(() => {
  const PEER_PREFIX = "cardgame-trade-";
  const BOARD_ID = "cardgame-lobby-board-v1";
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const LOBBY_STALE_MS = 15000;
  const HEARTBEAT_MS = 4000;

  const screens = {
    title: document.getElementById("screen-title"),
    play: document.getElementById("screen-play"),
    trade: document.getElementById("screen-trade"),
    join: document.getElementById("screen-join"),
    quick: document.getElementById("screen-quick"),
    room: document.getElementById("screen-room"),
  };

  const els = {
    btnPlay: document.getElementById("btn-play"),
    btnTrade: document.getElementById("btn-trade"),
    btnPlayBack: document.getElementById("btn-play-back"),
    btnTradeBack: document.getElementById("btn-trade-back"),
    btnCreate: document.getElementById("btn-create"),
    btnJoin: document.getElementById("btn-join"),
    btnQuick: document.getElementById("btn-quick"),
    btnJoinBack: document.getElementById("btn-join-back"),
    btnJoinConfirm: document.getElementById("btn-join-confirm"),
    btnQuickBack: document.getElementById("btn-quick-back"),
    btnQuickRefresh: document.getElementById("btn-quick-refresh"),
    btnLeave: document.getElementById("btn-leave"),
    btnCopy: document.getElementById("btn-copy-code"),
    joinInput: document.getElementById("join-code-input"),
    tradeError: document.getElementById("trade-error"),
    joinError: document.getElementById("join-error"),
    quickError: document.getElementById("quick-error"),
    quickStatus: document.getElementById("quick-status"),
    lobbyList: document.getElementById("lobby-list"),
    lobbyCode: document.getElementById("lobby-code-display"),
    roomStatus: document.getElementById("room-status"),
    myText: document.getElementById("my-text"),
    myAmount: document.getElementById("my-amount"),
    myValue: document.getElementById("my-value"),
    theirText: document.getElementById("their-text"),
    theirAmount: document.getElementById("their-amount"),
    theirValue: document.getElementById("their-value"),
  };

  let peer = null;
  let conn = null;
  let role = null;
  let lobbyCode = null;
  let sendTimer = null;
  let joinReturnScreen = "trade";

  let boardPeer = null;
  let boardConn = null;
  let isBoardHost = false;
  let boardClients = new Set();
  let lobbyRegistry = new Map();
  let knownLobbies = [];
  let announcedCode = null;
  let heartbeatTimer = null;
  let boardReadyPromise = null;
  let browsingQuick = false;

  const myOffer = { text: "", amount: "", value: "" };
  const theirOffer = { text: "", amount: "", value: "" };

  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function setError(el, message) {
    if (!message) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = message;
  }

  function randomCode(length = 6) {
    let out = "";
    const values = crypto.getRandomValues(new Uint32Array(length));
    for (let i = 0; i < length; i += 1) {
      out += CODE_CHARS[values[i] % CODE_CHARS.length];
    }
    return out;
  }

  function peerIdFromCode(code) {
    return `${PEER_PREFIX}${code.toUpperCase()}`;
  }

  function normalizeCode(raw) {
    return String(raw || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
  }

  function setStatus(text) {
    els.roomStatus.textContent = text;
  }

  function setReadonlyBox(el, value, emptyLabel) {
    const text = String(value ?? "").trim();
    if (!text) {
      el.classList.add("empty");
      el.textContent = emptyLabel;
      return;
    }
    el.classList.remove("empty");
    el.textContent = text;
  }

  function renderTheirOffer() {
    setReadonlyBox(els.theirText, theirOffer.text, "Waiting…");
    setReadonlyBox(els.theirAmount, theirOffer.amount, "—");
    setReadonlyBox(els.theirValue, theirOffer.value, "—");
  }

  function syncMyInputsFromState() {
    els.myText.value = myOffer.text;
    els.myAmount.value = myOffer.amount;
    els.myValue.value = myOffer.value;
  }

  function readMyOfferFromInputs() {
    myOffer.text = els.myText.value;
    myOffer.amount = els.myAmount.value;
    myOffer.value = els.myValue.value;
  }

  function pruneRegistry() {
    const now = Date.now();
    for (const [code, entry] of lobbyRegistry) {
      if (now - entry.updatedAt > LOBBY_STALE_MS || entry.status !== "open") {
        lobbyRegistry.delete(code);
      }
    }
  }

  function openLobbiesFromRegistry() {
    pruneRegistry();
    return [...lobbyRegistry.values()]
      .filter((entry) => entry.status === "open")
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((entry) => ({ code: entry.code, updatedAt: entry.updatedAt }));
  }

  function broadcastLobbies() {
    if (!isBoardHost) return;
    const lobbies = openLobbiesFromRegistry();
    const payload = { type: "lobbies", lobbies };
    for (const client of boardClients) {
      if (client.open) client.send(payload);
    }
  }

  function setKnownLobbies(lobbies) {
    knownLobbies = Array.isArray(lobbies) ? lobbies : [];
    if (browsingQuick) renderLobbyList();
  }

  function renderLobbyList() {
    const open = knownLobbies.filter((l) => l && l.code);
    if (!open.length) {
      els.lobbyList.innerHTML = "";
      els.quickStatus.textContent = "No open lobbies right now. Create one, or refresh.";
      return;
    }

    els.quickStatus.textContent = `${open.length} open lobby${open.length === 1 ? "" : "ies"}`;
    els.lobbyList.innerHTML = open
      .map(
        (lobby) => `
      <div class="lobby-row">
        <div class="lobby-row-code">${lobby.code}</div>
        <button type="button" class="btn btn-primary btn-sm" data-join-code="${lobby.code}">
          Join
        </button>
      </div>
    `
      )
      .join("");
  }

  function handleBoardMessage(data, fromConn) {
    if (!data || typeof data !== "object") return;

    if (isBoardHost) {
      if (data.type === "announce" && typeof data.code === "string") {
        const code = normalizeCode(data.code);
        if (code.length === 6) {
          lobbyRegistry.set(code, {
            code,
            status: data.status === "full" ? "full" : "open",
            updatedAt: Date.now(),
          });
          if (data.status === "full") lobbyRegistry.delete(code);
          broadcastLobbies();
          setKnownLobbies(openLobbiesFromRegistry());
        }
        return;
      }
      if (data.type === "remove" && typeof data.code === "string") {
        lobbyRegistry.delete(normalizeCode(data.code));
        broadcastLobbies();
        setKnownLobbies(openLobbiesFromRegistry());
        return;
      }
      if (data.type === "list" && fromConn?.open) {
        fromConn.send({ type: "lobbies", lobbies: openLobbiesFromRegistry() });
        return;
      }
    }

    if (data.type === "lobbies") {
      setKnownLobbies(data.lobbies);
    }
  }

  function bindBoardClientConnection(connection) {
    boardConn = connection;

    const onReady = () => {
      connection.send({ type: "list" });
      if (announcedCode) {
        connection.send({ type: "announce", code: announcedCode, status: "open" });
      }
    };

    if (connection.open) onReady();
    else connection.on("open", onReady);

    connection.on("data", (data) => handleBoardMessage(data));

    connection.on("close", () => {
      if (boardConn === connection) boardConn = null;
      if (browsingQuick || announcedCode) {
        setTimeout(() => {
          ensureBoard().catch(() => {});
        }, 500);
      }
    });
  }

  function bindBoardHostConnection(connection) {
    boardClients.add(connection);

    connection.on("data", (data) => handleBoardMessage(data, connection));
    connection.on("close", () => {
      boardClients.delete(connection);
    });
  }

  function destroyBoard() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (boardConn) {
      try {
        boardConn.close();
      } catch (_) {
        /* ignore */
      }
      boardConn = null;
    }
    for (const client of boardClients) {
      try {
        client.close();
      } catch (_) {
        /* ignore */
      }
    }
    boardClients.clear();
    if (boardPeer) {
      try {
        boardPeer.destroy();
      } catch (_) {
        /* ignore */
      }
      boardPeer = null;
    }
    isBoardHost = false;
    boardReadyPromise = null;
    lobbyRegistry.clear();
  }

  function ensureBoard() {
    if (boardPeer && !boardPeer.destroyed) {
      return boardReadyPromise || Promise.resolve();
    }

    boardReadyPromise = new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      const hostPeer = new Peer(BOARD_ID, { debug: 0 });
      boardPeer = hostPeer;

      hostPeer.on("open", () => {
        isBoardHost = true;
        setKnownLobbies(openLobbiesFromRegistry());
        finish();
      });

      hostPeer.on("connection", (connection) => {
        bindBoardHostConnection(connection);
      });

      hostPeer.on("error", (err) => {
        if (err?.type === "unavailable-id") {
          try {
            hostPeer.destroy();
          } catch (_) {
            /* ignore */
          }
          isBoardHost = false;
          const clientPeer = new Peer({ debug: 0 });
          boardPeer = clientPeer;

          clientPeer.on("open", () => {
            const connection = clientPeer.connect(BOARD_ID, { reliable: true });
            bindBoardClientConnection(connection);
            const timer = setTimeout(finish, 2500);
            connection.on("open", () => {
              clearTimeout(timer);
              finish();
            });
            connection.on("error", () => {
              clearTimeout(timer);
              finish();
            });
          });

          clientPeer.on("error", () => finish());
          return;
        }
        finish();
      });
    });

    return boardReadyPromise;
  }

  function sendBoard(payload) {
    if (isBoardHost) {
      handleBoardMessage(payload);
      return;
    }
    if (boardConn && boardConn.open) {
      boardConn.send(payload);
    }
  }

  function startHeartbeat() {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(() => {
      if (!announcedCode) return;
      sendBoard({ type: "announce", code: announcedCode, status: "open" });
      if (isBoardHost) setKnownLobbies(openLobbiesFromRegistry());
      else if (boardConn && boardConn.open) boardConn.send({ type: "list" });
    }, HEARTBEAT_MS);
  }

  async function announceLobby(code) {
    announcedCode = code;
    await ensureBoard();
    sendBoard({ type: "announce", code, status: "open" });
    startHeartbeat();
  }

  function unannounceLobby() {
    if (!announcedCode) return;
    const code = announcedCode;
    announcedCode = null;
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    sendBoard({ type: "remove", code });
  }

  function markLobbyFull() {
    if (!announcedCode) return;
    const code = announcedCode;
    sendBoard({ type: "announce", code, status: "full" });
    sendBoard({ type: "remove", code });
    announcedCode = null;
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  function destroySession({ keepBoard = false } = {}) {
    unannounceLobby();
    if (sendTimer) {
      clearTimeout(sendTimer);
      sendTimer = null;
    }
    if (conn) {
      try {
        conn.close();
      } catch (_) {
        /* ignore */
      }
      conn = null;
    }
    if (peer) {
      try {
        peer.destroy();
      } catch (_) {
        /* ignore */
      }
      peer = null;
    }
    role = null;
    lobbyCode = null;
    myOffer.text = "";
    myOffer.amount = "";
    myOffer.value = "";
    theirOffer.text = "";
    theirOffer.amount = "";
    theirOffer.value = "";
    syncMyInputsFromState();
    els.lobbyCode.textContent = "------";
    renderTheirOffer();
    setStatus("Waiting for partner…");
    setError(els.tradeError, "");
    setError(els.joinError, "");
    setError(els.quickError, "");
    if (!keepBoard && !browsingQuick) destroyBoard();
  }

  function sendPayload(payload) {
    if (!conn || !conn.open) return;
    conn.send(payload);
  }

  function currentOfferPayload(type) {
    return {
      type,
      text: myOffer.text,
      amount: myOffer.amount,
      value: myOffer.value,
    };
  }

  function scheduleOfferSync() {
    if (sendTimer) clearTimeout(sendTimer);
    sendTimer = setTimeout(() => {
      sendPayload(currentOfferPayload("offer"));
    }, 80);
  }

  function applyTheirOffer(data) {
    theirOffer.text = typeof data.text === "string" ? data.text : "";
    theirOffer.amount =
      typeof data.amount === "string" ? data.amount : String(data.amount ?? "");
    theirOffer.value =
      typeof data.value === "string" ? data.value : String(data.value ?? "");
    renderTheirOffer();
  }

  function bindConnection(connection) {
    conn = connection;

    const onReady = () => {
      setStatus("Connected — trading live");
      if (role === "host") markLobbyFull();
      sendPayload(currentOfferPayload("hello"));
    };

    if (connection.open) onReady();
    else connection.on("open", onReady);

    connection.on("data", (data) => {
      if (!data || typeof data !== "object") return;

      if (data.type === "full") {
        setError(els.joinError, data.message || "Lobby is full.");
        setError(els.quickError, data.message || "Lobby is full.");
        destroySession();
        showScreen(joinReturnScreen);
        return;
      }

      if (data.type === "hello" || data.type === "offer") {
        applyTheirOffer(data);
        if (data.type === "hello") {
          setStatus("Connected — trading live");
          sendPayload(currentOfferPayload("offer"));
        }
      }
    });

    connection.on("close", () => {
      if (conn === connection) conn = null;
      setStatus("Partner disconnected — waiting…");
      theirOffer.text = "";
      theirOffer.amount = "";
      theirOffer.value = "";
      renderTheirOffer();
      if (role === "host" && lobbyCode) {
        announceLobby(lobbyCode).catch(() => {});
      }
    });

    connection.on("error", () => {
      setStatus("Connection issue — retry joining if needed");
    });
  }

  function enterRoom(code) {
    browsingQuick = false;
    lobbyCode = code;
    els.lobbyCode.textContent = code;
    syncMyInputsFromState();
    renderTheirOffer();
    showScreen("room");
  }

  function createTradeSpace() {
    setError(els.tradeError, "");
    els.btnCreate.disabled = true;
    els.btnJoin.disabled = true;
    els.btnQuick.disabled = true;

    destroySession({ keepBoard: true });
    role = "host";
    const code = randomCode();
    const id = peerIdFromCode(code);

    peer = new Peer(id, { debug: 0 });

    peer.on("open", async () => {
      els.btnCreate.disabled = false;
      els.btnJoin.disabled = false;
      els.btnQuick.disabled = false;
      setStatus("Waiting for partner…");
      enterRoom(code);
      try {
        await announceLobby(code);
      } catch (_) {
        /* listing is best-effort */
      }
    });

    peer.on("connection", (connection) => {
      if (conn && conn.open) {
        connection.on("open", () => {
          connection.send({ type: "full", message: "Lobby already has two players." });
          connection.close();
        });
        return;
      }
      bindConnection(connection);
    });

    peer.on("error", (err) => {
      els.btnCreate.disabled = false;
      els.btnJoin.disabled = false;
      els.btnQuick.disabled = false;
      const msg =
        err?.type === "unavailable-id"
          ? "That lobby code was taken. Try creating again."
          : "Could not create a trade space. Check your connection and try again.";
      destroySession();
      showScreen("trade");
      setError(els.tradeError, msg);
    });

    peer.on("disconnected", () => {
      setStatus("Reconnecting…");
    });
  }

  function joinTradeSpaceWithCode(code, returnScreen = "join") {
    const normalized = normalizeCode(code);
    setError(els.joinError, "");
    setError(els.quickError, "");
    joinReturnScreen = returnScreen;

    if (normalized.length !== 6) {
      const msg = "Enter the full 6-character lobby code.";
      if (returnScreen === "quick") setError(els.quickError, msg);
      else setError(els.joinError, msg);
      return;
    }

    els.btnJoinConfirm.disabled = true;
    destroySession({ keepBoard: browsingQuick });
    role = "guest";

    peer = new Peer({ debug: 0 });

    peer.on("open", () => {
      const connection = peer.connect(peerIdFromCode(normalized), { reliable: true });
      let opened = false;

      const failTimer = setTimeout(() => {
        if (opened) return;
        els.btnJoinConfirm.disabled = false;
        destroySession({ keepBoard: returnScreen === "quick" });
        showScreen(returnScreen);
        const msg =
          "Could not reach that lobby. It may have closed or already filled.";
        if (returnScreen === "quick") setError(els.quickError, msg);
        else setError(els.joinError, msg);
      }, 8000);

      connection.on("open", () => {
        opened = true;
        clearTimeout(failTimer);
        els.btnJoinConfirm.disabled = false;
        bindConnection(connection);
        enterRoom(normalized);
      });

      connection.on("error", () => {
        clearTimeout(failTimer);
        els.btnJoinConfirm.disabled = false;
        destroySession({ keepBoard: returnScreen === "quick" });
        showScreen(returnScreen);
        const msg = "Failed to join that lobby. Try again.";
        if (returnScreen === "quick") setError(els.quickError, msg);
        else setError(els.joinError, msg);
      });
    });

    peer.on("error", () => {
      els.btnJoinConfirm.disabled = false;
      destroySession({ keepBoard: returnScreen === "quick" });
      showScreen(returnScreen);
      const msg = "Could not connect. Check your network and try again.";
      if (returnScreen === "quick") setError(els.quickError, msg);
      else setError(els.joinError, msg);
    });
  }

  function joinTradeSpace() {
    joinTradeSpaceWithCode(els.joinInput.value, "join");
  }

  async function openQuickLobby() {
    browsingQuick = true;
    setError(els.quickError, "");
    els.quickStatus.textContent = "Looking for lobbies…";
    els.lobbyList.innerHTML = "";
    showScreen("quick");
    await ensureBoard();
    sendBoard({ type: "list" });
    if (isBoardHost) setKnownLobbies(openLobbiesFromRegistry());
    renderLobbyList();
  }

  function leaveQuickLobby() {
    browsingQuick = false;
    if (!announcedCode) destroyBoard();
    showScreen("trade");
  }

  function leaveRoom() {
    destroySession();
    els.joinInput.value = "";
    showScreen("trade");
  }

  function onMyOfferInput() {
    readMyOfferFromInputs();
    scheduleOfferSync();
  }

  els.btnPlay.addEventListener("click", () => showScreen("play"));
  els.btnTrade.addEventListener("click", () => {
    setError(els.tradeError, "");
    showScreen("trade");
  });
  els.btnPlayBack.addEventListener("click", () => showScreen("title"));
  els.btnTradeBack.addEventListener("click", () => {
    destroySession();
    showScreen("title");
  });

  els.btnCreate.addEventListener("click", createTradeSpace);
  els.btnJoin.addEventListener("click", () => {
    setError(els.joinError, "");
    els.joinInput.value = "";
    showScreen("join");
    els.joinInput.focus();
  });
  els.btnQuick.addEventListener("click", () => {
    openQuickLobby().catch(() => {
      setError(els.quickError, "Could not reach the lobby board. Try again.");
    });
  });

  els.btnJoinBack.addEventListener("click", () => {
    destroySession();
    showScreen("trade");
  });
  els.btnJoinConfirm.addEventListener("click", joinTradeSpace);
  els.btnQuickBack.addEventListener("click", leaveQuickLobby);
  els.btnQuickRefresh.addEventListener("click", async () => {
    setError(els.quickError, "");
    els.quickStatus.textContent = "Refreshing…";
    await ensureBoard();
    sendBoard({ type: "list" });
    if (isBoardHost) setKnownLobbies(openLobbiesFromRegistry());
    renderLobbyList();
  });
  els.btnLeave.addEventListener("click", leaveRoom);

  els.joinInput.addEventListener("input", () => {
    els.joinInput.value = normalizeCode(els.joinInput.value);
  });
  els.joinInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") joinTradeSpace();
  });

  els.lobbyList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-join-code]");
    if (!btn) return;
    joinTradeSpaceWithCode(btn.getAttribute("data-join-code"), "quick");
  });

  els.myText.addEventListener("input", onMyOfferInput);
  els.myAmount.addEventListener("input", onMyOfferInput);
  els.myValue.addEventListener("input", onMyOfferInput);

  els.btnCopy.addEventListener("click", async () => {
    if (!lobbyCode) return;
    try {
      await navigator.clipboard.writeText(lobbyCode);
      els.btnCopy.textContent = "Copied";
      setTimeout(() => {
        els.btnCopy.textContent = "Copy";
      }, 1200);
    } catch (_) {
      els.btnCopy.textContent = "Select code";
      setTimeout(() => {
        els.btnCopy.textContent = "Copy";
      }, 1200);
    }
  });

  window.addEventListener("beforeunload", () => {
    browsingQuick = false;
    destroySession();
    destroyBoard();
  });
})();
