(() => {
  const PEER_PREFIX = "tradegame-";
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const screens = {
    title: document.getElementById("screen-title"),
    join: document.getElementById("screen-join"),
    room: document.getElementById("screen-room"),
  };

  const els = {
    btnCreate: document.getElementById("btn-create"),
    btnJoin: document.getElementById("btn-join"),
    btnJoinBack: document.getElementById("btn-join-back"),
    btnJoinConfirm: document.getElementById("btn-join-confirm"),
    btnLeave: document.getElementById("btn-leave"),
    btnCopy: document.getElementById("btn-copy-code"),
    joinInput: document.getElementById("join-code-input"),
    titleError: document.getElementById("title-error"),
    joinError: document.getElementById("join-error"),
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

  function destroySession() {
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
    setError(els.titleError, "");
    setError(els.joinError, "");
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
    theirOffer.amount = typeof data.amount === "string" ? data.amount : String(data.amount ?? "");
    theirOffer.value = typeof data.value === "string" ? data.value : String(data.value ?? "");
    renderTheirOffer();
  }

  function bindConnection(connection) {
    conn = connection;

    const onReady = () => {
      setStatus("Connected — trading live");
      sendPayload(currentOfferPayload("hello"));
    };

    if (connection.open) {
      onReady();
    } else {
      connection.on("open", onReady);
    }

    connection.on("data", (data) => {
      if (!data || typeof data !== "object") return;

      if (data.type === "full") {
        setError(els.joinError, data.message || "Lobby is full.");
        destroySession();
        showScreen("join");
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
    });

    connection.on("error", () => {
      setStatus("Connection issue — retry joining if needed");
    });
  }

  function enterRoom(code) {
    lobbyCode = code;
    els.lobbyCode.textContent = code;
    syncMyInputsFromState();
    renderTheirOffer();
    showScreen("room");
  }

  function createTradeSpace() {
    setError(els.titleError, "");
    els.btnCreate.disabled = true;
    els.btnJoin.disabled = true;

    destroySession();
    role = "host";
    const code = randomCode();
    const id = peerIdFromCode(code);

    peer = new Peer(id, { debug: 0 });

    peer.on("open", () => {
      els.btnCreate.disabled = false;
      els.btnJoin.disabled = false;
      setStatus("Waiting for partner…");
      enterRoom(code);
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
      const msg =
        err?.type === "unavailable-id"
          ? "That lobby code was taken. Try creating again."
          : "Could not create a trade space. Check your connection and try again.";
      destroySession();
      showScreen("title");
      setError(els.titleError, msg);
    });

    peer.on("disconnected", () => {
      setStatus("Reconnecting…");
    });
  }

  function joinTradeSpace() {
    const code = normalizeCode(els.joinInput.value);
    setError(els.joinError, "");

    if (code.length !== 6) {
      setError(els.joinError, "Enter the full 6-character lobby code.");
      return;
    }

    els.btnJoinConfirm.disabled = true;
    destroySession();
    role = "guest";

    peer = new Peer({ debug: 0 });

    peer.on("open", () => {
      const connection = peer.connect(peerIdFromCode(code), { reliable: true });
      let opened = false;

      const failTimer = setTimeout(() => {
        if (opened) return;
        els.btnJoinConfirm.disabled = false;
        destroySession();
        showScreen("join");
        setError(
          els.joinError,
          "Could not reach that lobby. Check the code and that the host is still in the room."
        );
      }, 8000);

      connection.on("open", () => {
        opened = true;
        clearTimeout(failTimer);
        els.btnJoinConfirm.disabled = false;
        bindConnection(connection);
        enterRoom(code);
      });

      connection.on("error", () => {
        clearTimeout(failTimer);
        els.btnJoinConfirm.disabled = false;
        destroySession();
        showScreen("join");
        setError(els.joinError, "Failed to join that lobby. Try again.");
      });
    });

    peer.on("error", () => {
      els.btnJoinConfirm.disabled = false;
      destroySession();
      showScreen("join");
      setError(els.joinError, "Could not connect. Check your network and try again.");
    });
  }

  function leaveRoom() {
    destroySession();
    els.joinInput.value = "";
    showScreen("title");
  }

  function onMyOfferInput() {
    readMyOfferFromInputs();
    scheduleOfferSync();
  }

  els.btnCreate.addEventListener("click", createTradeSpace);
  els.btnJoin.addEventListener("click", () => {
    setError(els.joinError, "");
    els.joinInput.value = "";
    showScreen("join");
    els.joinInput.focus();
  });
  els.btnJoinBack.addEventListener("click", () => {
    destroySession();
    showScreen("title");
  });
  els.btnJoinConfirm.addEventListener("click", joinTradeSpace);
  els.btnLeave.addEventListener("click", leaveRoom);

  els.joinInput.addEventListener("input", () => {
    els.joinInput.value = normalizeCode(els.joinInput.value);
  });
  els.joinInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") joinTradeSpace();
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
    destroySession();
  });
})();
