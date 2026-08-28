(() => {
  const PEER_PREFIX = "cardgame-trade-";
  const BOARD_ID = "cardgame-lobby-board-v1";
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const LOBBY_STALE_MS = 15000;
  const HEARTBEAT_MS = 4000;
  const STORAGE_KEY = "cardgame-player-v2";
  const STARTING_COINS = 200;
  const CARDS_PER_PACK = 5;

  const PACKS = {
    "common-pack": {
      id: "common-pack",
      name: "Common Pack",
      price: 100,
      pool: "common",
    },
  };

  const CARDS = {
    chicken: {
      id: "chicken",
      name: "Chicken",
      value: 5,
      oneIn: 2,
      theme: "chicken",
      blurb: "Farmyard flutter",
    },
    cow: {
      id: "cow",
      name: "Cow",
      value: 10,
      oneIn: 3,
      theme: "cow",
      blurb: "Pasture classic",
    },
    pig: {
      id: "pig",
      name: "Pig",
      value: 12,
      oneIn: 5,
      theme: "pig",
      blurb: "Muddy treasure",
    },
    salmon: {
      id: "salmon",
      name: "Salmon",
      value: 16,
      oneIn: 8,
      theme: "salmon",
      blurb: "Upstream flash",
    },
    squid: {
      id: "squid",
      name: "Squid",
      value: 18,
      oneIn: 10,
      theme: "squid",
      blurb: "Ink & tide",
    },
    monkey: {
      id: "monkey",
      name: "Monkey",
      value: 20,
      oneIn: 15,
      theme: "monkey",
      blurb: "Canopy trickster",
    },
    lion: {
      id: "lion",
      name: "Lion",
      value: 25,
      oneIn: 20,
      theme: "lion",
      blurb: "Savanna crown",
    },
    tiger: {
      id: "tiger",
      name: "Tiger",
      value: 30,
      oneIn: 20,
      theme: "tiger",
      blurb: "Striped thunder",
    },
    leopard: {
      id: "leopard",
      name: "Leopard",
      value: 35,
      oneIn: 20,
      theme: "leopard",
      blurb: "Spotted shadow",
    },
    shark: {
      id: "shark",
      name: "Shark",
      value: 40,
      oneIn: 30,
      theme: "shark",
      blurb: "Deep blue menace",
    },
    triceratops: {
      id: "triceratops",
      name: "Triceratops",
      value: 50,
      oneIn: 40,
      theme: "triceratops",
      blurb: "Horned relic",
    },
    trex: {
      id: "trex",
      name: "T-Rex",
      value: 65,
      oneIn: 50,
      theme: "trex",
      blurb: "Apex fossil",
    },
  };

  const COMMON_POOL = Object.values(CARDS);

  const ART = {
    chicken: `<svg viewBox="0 0 120 120"><circle cx="60" cy="62" r="28" fill="#f0c14a"/><circle cx="78" cy="48" r="14" fill="#f7d977"/><path d="M88 48l16 4-16 6z" fill="#e4572e"/><circle cx="82" cy="46" r="2.2" fill="#1a1408"/><path d="M40 78c8 16 32 16 40 0" fill="#e8a317"/><path d="M52 38c-8-12-20-8-18 2" fill="#f0c14a"/></svg>`,
    cow: `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="68" rx="34" ry="26" fill="#f4efe6"/><ellipse cx="44" cy="60" rx="10" ry="8" fill="#2a241c"/><ellipse cx="72" cy="74" rx="12" ry="9" fill="#2a241c"/><circle cx="42" cy="44" r="10" fill="#f4efe6"/><circle cx="78" cy="44" r="10" fill="#f4efe6"/><circle cx="60" cy="52" r="16" fill="#f4efe6"/><circle cx="54" cy="50" r="2" fill="#1a1408"/><circle cx="66" cy="50" r="2" fill="#1a1408"/><path d="M54 58h12v6c0 4-12 4-12 0z" fill="#e8b4b8"/></svg>`,
    pig: `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="70" rx="32" ry="24" fill="#f2a6b5"/><circle cx="60" cy="52" r="20" fill="#f7bcc8"/><ellipse cx="60" cy="58" rx="10" ry="7" fill="#e8899b"/><circle cx="56" cy="58" r="1.6" fill="#1a1408"/><circle cx="64" cy="58" r="1.6" fill="#1a1408"/><circle cx="52" cy="48" r="2.2" fill="#1a1408"/><circle cx="68" cy="48" r="2.2" fill="#1a1408"/><ellipse cx="38" cy="42" rx="7" ry="10" fill="#f2a6b5"/><ellipse cx="82" cy="42" rx="7" ry="10" fill="#f2a6b5"/></svg>`,
    salmon: `<svg viewBox="0 0 120 120"><path d="M20 64c20-22 60-22 80 0-20 22-60 22-80 0z" fill="#ff7a59"/><path d="M90 64l18-12v24z" fill="#ff9478"/><path d="M48 52c8 4 16 4 24 0" stroke="#ffd1c4" stroke-width="3" fill="none"/><circle cx="34" cy="60" r="2.5" fill="#1a1408"/><path d="M58 74l8 12-4-12 10 10z" fill="#e4572e"/></svg>`,
    squid: `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="44" rx="22" ry="26" fill="#8b6cff"/><circle cx="52" cy="40" r="4" fill="#e8f0ff"/><circle cx="68" cy="40" r="4" fill="#e8f0ff"/><circle cx="53" cy="40" r="1.8" fill="#1a1408"/><circle cx="69" cy="40" r="1.8" fill="#1a1408"/><path d="M42 64c2 20 6 28 10 34M52 66c1 22 4 30 8 34M68 66c-1 22-4 30-8 34M78 64c-2 20-6 28-10 34M60 66c0 24 0 32 0 36" stroke="#b9a6ff" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`,
    monkey: `<svg viewBox="0 0 120 120"><circle cx="60" cy="58" r="28" fill="#8b5a2b"/><ellipse cx="60" cy="66" rx="18" ry="16" fill="#e7c7a0"/><circle cx="36" cy="54" r="12" fill="#8b5a2b"/><circle cx="84" cy="54" r="12" fill="#8b5a2b"/><circle cx="36" cy="54" r="7" fill="#e7c7a0"/><circle cx="84" cy="54" r="7" fill="#e7c7a0"/><circle cx="52" cy="58" r="2.4" fill="#1a1408"/><circle cx="68" cy="58" r="2.4" fill="#1a1408"/><path d="M54 70c4 4 8 4 12 0" stroke="#1a1408" stroke-width="2" fill="none"/></svg>`,
    lion: `<svg viewBox="0 0 120 120"><circle cx="60" cy="62" r="34" fill="#c47a16"/><circle cx="60" cy="62" r="22" fill="#e8b84a"/><circle cx="52" cy="58" r="2.5" fill="#1a1408"/><circle cx="68" cy="58" r="2.5" fill="#1a1408"/><path d="M60 64v6" stroke="#1a1408" stroke-width="2"/><path d="M52 76c5 5 11 5 16 0" stroke="#1a1408" stroke-width="2" fill="none"/><path d="M40 40c8-10 20-10 28-2M80 40c-8-10-20-10-28-2" stroke="#a65f0a" stroke-width="6" fill="none"/></svg>`,
    tiger: `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="64" rx="34" ry="28" fill="#f08a24"/><path d="M40 48c8 8 8 20 0 28M60 44v40M80 48c-8 8-8 20 0 28" stroke="#1a1408" stroke-width="5" fill="none"/><circle cx="48" cy="58" r="2.5" fill="#1a1408"/><circle cx="72" cy="58" r="2.5" fill="#1a1408"/><path d="M54 70h12" stroke="#1a1408" stroke-width="2"/><path d="M34 40l-12-10M86 40l12-10" stroke="#f08a24" stroke-width="6"/></svg>`,
    leopard: `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="64" rx="34" ry="28" fill="#e0b15a"/><circle cx="44" cy="56" r="5" fill="#5a4020"/><circle cx="62" cy="48" r="4" fill="#5a4020"/><circle cx="78" cy="60" r="5" fill="#5a4020"/><circle cx="52" cy="74" r="4" fill="#5a4020"/><circle cx="70" cy="78" r="3.5" fill="#5a4020"/><circle cx="50" cy="58" r="2.3" fill="#1a1408"/><circle cx="70" cy="58" r="2.3" fill="#1a1408"/><path d="M34 42l-10-8M86 42l10-8" stroke="#e0b15a" stroke-width="6"/></svg>`,
    shark: `<svg viewBox="0 0 120 120"><path d="M18 68c18-28 70-28 88-4-24 8-52 12-88 4z" fill="#6f8ea8"/><path d="M96 66l16-18v22z" fill="#8aa7c0"/><path d="M60 44l8-18-4 18" fill="#8aa7c0"/><path d="M30 74l10 16 4-14" fill="#dfe8f0"/><circle cx="36" cy="62" r="2.5" fill="#1a1408"/><path d="M28 68h18" stroke="#1a1408" stroke-width="2"/></svg>`,
    triceratops: `<svg viewBox="0 0 120 120"><ellipse cx="58" cy="72" rx="36" ry="24" fill="#3f7a4c"/><path d="M78 58c18-6 28-2 30 10-16 4-28 2-30-10z" fill="#4f915c"/><circle cx="86" cy="62" r="3" fill="#1a1408"/><path d="M96 54l10-16M88 50l2-18M100 62l16-4" stroke="#d9e6c8" stroke-width="5" stroke-linecap="round"/><path d="M34 78c-10 4-16 12-14 16h40c-6-6-14-12-26-16z" fill="#2f5d3a"/></svg>`,
    trex: `<svg viewBox="0 0 120 120"><path d="M30 78c8-28 40-40 62-28-4 18-18 30-40 34z" fill="#a63d2f"/><path d="M78 52c14-4 24 2 28 14-12 2-22 0-28-14z" fill="#c45240"/><circle cx="92" cy="58" r="2.6" fill="#1a1408"/><path d="M98 64h14" stroke="#1a1408" stroke-width="3"/><path d="M48 88l-4 18M60 90l2 18" stroke="#7a2c22" stroke-width="6" stroke-linecap="round"/><path d="M40 60l-16-8" stroke="#a63d2f" stroke-width="7" stroke-linecap="round"/></svg>`,
  };

  const screens = {
    title: document.getElementById("screen-title"),
    play: document.getElementById("screen-play"),
    cardShop: document.getElementById("screen-card-shop"),
    sellStop: document.getElementById("screen-sell-stop"),
    battles: document.getElementById("screen-battles"),
    inventory: document.getElementById("screen-inventory"),
    trade: document.getElementById("screen-trade"),
    join: document.getElementById("screen-join"),
    quick: document.getElementById("screen-quick"),
    room: document.getElementById("screen-room"),
  };

  const els = {
    btnPlay: document.getElementById("btn-play"),
    btnTrade: document.getElementById("btn-trade"),
    btnPlayBack: document.getElementById("btn-play-back"),
    btnCardShop: document.getElementById("btn-card-shop"),
    btnSellStop: document.getElementById("btn-sell-stop"),
    btnBattles: document.getElementById("btn-battles"),
    btnCardShopBack: document.getElementById("btn-card-shop-back"),
    btnSellStopBack: document.getElementById("btn-sell-stop-back"),
    btnBattlesBack: document.getElementById("btn-battles-back"),
    btnInventoryBack: document.getElementById("btn-inventory-back"),
    btnBackpack: document.getElementById("btn-backpack"),
    btnBuyCommonPack: document.getElementById("btn-buy-common-pack"),
    shopCoins: document.getElementById("shop-coins"),
    inventoryCoins: document.getElementById("inventory-coins"),
    inventoryList: document.getElementById("inventory-list"),
    inventoryTitle: document.getElementById("inventory-title"),
    inventoryCopy: document.getElementById("inventory-copy"),
    backpackCount: document.getElementById("backpack-count"),
    shopMsg: document.getElementById("shop-msg"),
    packReveal: document.getElementById("pack-reveal"),
    revealGrid: document.getElementById("reveal-grid"),
    btnRevealDone: document.getElementById("btn-reveal-done"),
    qtyModal: document.getElementById("qty-modal"),
    qtyTitle: document.getElementById("qty-title"),
    qtyPreview: document.getElementById("qty-card-preview"),
    qtyInput: document.getElementById("qty-input"),
    qtyTotalValue: document.getElementById("qty-total-value"),
    btnQtyCancel: document.getElementById("btn-qty-cancel"),
    btnQtyConfirm: document.getElementById("btn-qty-confirm"),
    myTradeSlot: document.getElementById("my-trade-slot"),
    theirTradeSlot: document.getElementById("their-trade-slot"),
    btnClearOffer: document.getElementById("btn-clear-offer"),
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

  let currentScreen = "title";
  let inventoryReturnScreen = "title";
  let inventoryTab = "packs";
  let inventoryMode = "browse"; // browse | trade
  let pendingTradeCardId = null;

  const myOffer = { cardId: null, qty: 0 };
  const theirOffer = { cardId: null, qty: 0 };

  function emptyBags() {
    return { packs: {}, cards: {}, items: {} };
  }

  function loadPlayer() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("cardgame-player-v1");
      if (!raw) return { coins: STARTING_COINS, ...emptyBags() };
      const data = JSON.parse(raw);
      const coins = Number.isFinite(data.coins)
        ? Math.max(0, Math.floor(data.coins))
        : STARTING_COINS;
      const bags = emptyBags();

      if (data.packs || data.cards || data.items) {
        for (const key of ["packs", "cards", "items"]) {
          const src = data[key] || {};
          for (const [id, count] of Object.entries(src)) {
            const n = Math.floor(Number(count));
            if (n > 0) bags[key][id] = n;
          }
        }
      } else if (data.inventory && typeof data.inventory === "object") {
        for (const [id, count] of Object.entries(data.inventory)) {
          const n = Math.floor(Number(count));
          if (n <= 0) continue;
          if (PACKS[id]) bags.packs[id] = n;
          else if (CARDS[id]) bags.cards[id] = n;
          else bags.items[id] = n;
        }
      }
      return { coins, ...bags };
    } catch (_) {
      return { coins: STARTING_COINS, ...emptyBags() };
    }
  }

  const player = loadPlayer();

  function savePlayer() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        coins: player.coins,
        packs: player.packs,
        cards: player.cards,
        items: player.items,
      })
    );
  }

  function inventoryTotal() {
    const sum = (bag) => Object.values(bag).reduce((a, b) => a + b, 0);
    return sum(player.packs) + sum(player.cards) + sum(player.items);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cardFaceHtml(card, opts = {}) {
    const qty = opts.qty;
    const showValue = opts.showValue !== false;
    const compact = opts.compact;
    const qtyBadge =
      qty && qty > 0 ? `<span class="card-qty">×${qty}</span>` : "";
    const valueHtml = showValue
      ? `<span class="card-value">$${card.value}</span>`
      : "";
    return `
      <article class="animal-card theme-${card.theme} ${compact ? "compact" : ""}" data-card-id="${card.id}">
        <div class="card-sheen" aria-hidden="true"></div>
        <div class="card-top">
          <span class="card-rarity">1/${card.oneIn}</span>
          ${valueHtml}
        </div>
        <div class="card-art">${ART[card.id] || ""}</div>
        <div class="card-body">
          <h3 class="card-name">${escapeHtml(card.name)}</h3>
          <p class="card-blurb">${escapeHtml(card.blurb)}</p>
        </div>
        ${qtyBadge}
      </article>
    `;
  }

  function weightedDraw(pool) {
    const weights = pool.map((c) => 1 / c.oneIn);
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i += 1) {
      r -= weights[i];
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  function openPack(packId) {
    const pack = PACKS[packId];
    if (!pack || !player.packs[packId]) return;
    player.packs[packId] -= 1;
    if (player.packs[packId] <= 0) delete player.packs[packId];

    const drawn = [];
    for (let i = 0; i < CARDS_PER_PACK; i += 1) {
      const card = weightedDraw(COMMON_POOL);
      drawn.push(card);
      player.cards[card.id] = (player.cards[card.id] || 0) + 1;
    }
    savePlayer();
    renderPlayerUi();
    showPackReveal(drawn);
  }

  function showPackReveal(drawn) {
    els.revealGrid.innerHTML = drawn
      .map((card, i) => `<div class="reveal-item" style="animation-delay:${i * 0.08}s">${cardFaceHtml(card)}</div>`)
      .join("");
    els.packReveal.hidden = false;
  }

  function hidePackReveal() {
    els.packReveal.hidden = true;
    els.revealGrid.innerHTML = "";
  }

  function setShopMessage(message, isError = false) {
    if (!message) {
      els.shopMsg.hidden = true;
      els.shopMsg.textContent = "";
      els.shopMsg.classList.remove("error");
      return;
    }
    els.shopMsg.hidden = false;
    els.shopMsg.textContent = message;
    els.shopMsg.classList.toggle("error", isError);
  }

  function renderInventoryList() {
    if (inventoryMode === "trade") {
      els.inventoryTitle.textContent = "Select a card";
      els.inventoryCopy.textContent = "Pick a card, then choose how many to offer.";
      document.querySelectorAll(".inv-tab").forEach((tab) => {
        const on = tab.getAttribute("data-inv-tab") === "cards";
        tab.classList.toggle("active", on);
        tab.hidden = tab.getAttribute("data-inv-tab") !== "cards";
      });
      inventoryTab = "cards";
    } else {
      els.inventoryTitle.textContent = "Backpack";
      els.inventoryCopy.textContent =
        inventoryTab === "packs"
          ? "Tap a pack to open it for 5 cards."
          : inventoryTab === "cards"
            ? "Your collected animal cards."
            : "General items will show up here.";
      document.querySelectorAll(".inv-tab").forEach((tab) => {
        tab.hidden = false;
        tab.classList.toggle("active", tab.getAttribute("data-inv-tab") === inventoryTab);
      });
    }

    const activeBag =
      inventoryMode === "trade"
        ? player.cards
        : inventoryTab === "packs"
          ? player.packs
          : inventoryTab === "cards"
            ? player.cards
            : player.items;
    const activeEntries = Object.entries(activeBag);

    if (!activeEntries.length) {
      const emptyMsg =
        inventoryMode === "trade"
          ? "No cards to offer yet. Open some packs first."
          : inventoryTab === "packs"
            ? "No packs. Visit the Card shop."
            : inventoryTab === "cards"
              ? "No cards yet. Open a pack!"
              : "No items yet.";
      els.inventoryList.innerHTML = `<p class="inventory-empty">${emptyMsg}</p>`;
      return;
    }

    if (inventoryMode === "trade" || inventoryTab === "cards") {
      els.inventoryList.innerHTML = `<div class="card-grid">${activeEntries
        .map(([id, count]) => {
          const card = CARDS[id];
          if (!card) return "";
          return `<button type="button" class="card-pick" data-pick-card="${id}">${cardFaceHtml(card, { qty: count })}</button>`;
        })
        .join("")}</div>`;
      return;
    }

    if (inventoryTab === "packs") {
      els.inventoryList.innerHTML = activeEntries
        .map(([id, count]) => {
          const pack = PACKS[id] || { name: id };
          return `
            <button type="button" class="inventory-row pack-row" data-open-pack="${id}">
              <div>
                <div class="item-name">${escapeHtml(pack.name)}</div>
                <span class="item-note">Tap to open · 5 cards</span>
              </div>
              <div class="item-count">×${count}</div>
            </button>
          `;
        })
        .join("");
      return;
    }

    els.inventoryList.innerHTML = activeEntries
      .map(
        ([id, count]) => `
      <div class="inventory-row">
        <div class="item-name">${escapeHtml(id)}</div>
        <div class="item-count">×${count}</div>
      </div>
    `
      )
      .join("");
  }

  function renderTradeSlots() {
    if (myOffer.cardId && myOffer.qty > 0 && CARDS[myOffer.cardId]) {
      const card = CARDS[myOffer.cardId];
      const total = card.value * myOffer.qty;
      els.myTradeSlot.classList.add("filled");
      els.myTradeSlot.innerHTML = `
        ${cardFaceHtml(card, { qty: myOffer.qty, compact: true })}
        <div class="slot-meta">Est. <strong>$${total}</strong></div>
      `;
      els.btnClearOffer.hidden = false;
    } else {
      els.myTradeSlot.classList.remove("filled");
      els.myTradeSlot.innerHTML = `
        <span class="trade-slot-plus">+</span>
        <span class="trade-slot-label">Add card</span>
      `;
      els.btnClearOffer.hidden = true;
    }

    if (theirOffer.cardId && theirOffer.qty > 0 && CARDS[theirOffer.cardId]) {
      const card = CARDS[theirOffer.cardId];
      const total = card.value * theirOffer.qty;
      els.theirTradeSlot.classList.add("filled");
      els.theirTradeSlot.classList.remove("empty");
      els.theirTradeSlot.innerHTML = `
        ${cardFaceHtml(card, { qty: theirOffer.qty, compact: true })}
        <div class="slot-meta">Est. <strong>$${total}</strong></div>
      `;
    } else {
      els.theirTradeSlot.classList.remove("filled");
      els.theirTradeSlot.classList.add("empty");
      els.theirTradeSlot.innerHTML = `<span class="trade-slot-label">Waiting…</span>`;
    }
  }

  function renderPlayerUi() {
    els.shopCoins.textContent = String(player.coins);
    els.inventoryCoins.textContent = String(player.coins);
    els.btnBuyCommonPack.disabled = player.coins < PACKS["common-pack"].price;

    const total = inventoryTotal();
    if (total > 0) {
      els.backpackCount.hidden = false;
      els.backpackCount.textContent = String(total);
    } else {
      els.backpackCount.hidden = true;
    }

    if (currentScreen === "inventory") renderInventoryList();
    if (currentScreen === "room") renderTradeSlots();
  }

  function buyPack(packId) {
    const pack = PACKS[packId];
    if (!pack) return;
    if (player.coins < pack.price) {
      setShopMessage("Not enough coins.", true);
      return;
    }
    player.coins -= pack.price;
    player.packs[packId] = (player.packs[packId] || 0) + 1;
    savePlayer();
    renderPlayerUi();
    setShopMessage(`Bought ${pack.name}. Open it from your backpack.`);
  }

  function showScreen(name) {
    currentScreen = name;
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[name].classList.add("active");
    els.btnBackpack.hidden = name === "inventory";
    if (name === "cardShop" || name === "inventory" || name === "room") renderPlayerUi();
  }

  function openInventory(mode = "browse") {
    inventoryMode = mode;
    if (mode === "trade") inventoryTab = "cards";
    inventoryReturnScreen = currentScreen === "inventory" ? inventoryReturnScreen : currentScreen;
    showScreen("inventory");
    renderInventoryList();
  }

  function openQtyModal(cardId) {
    const card = CARDS[cardId];
    const owned = player.cards[cardId] || 0;
    if (!card || owned < 1) return;
    pendingTradeCardId = cardId;
    els.qtyTitle.textContent = `Offer ${card.name}`;
    els.qtyPreview.innerHTML = cardFaceHtml(card, { qty: owned, compact: true });
    els.qtyInput.max = String(owned);
    els.qtyInput.value = "1";
    updateQtyTotal();
    els.qtyModal.hidden = false;
    els.btnBackpack.hidden = true;
  }

  function updateQtyTotal() {
    const card = CARDS[pendingTradeCardId];
    if (!card) return;
    const owned = player.cards[pendingTradeCardId] || 0;
    let qty = Math.floor(Number(els.qtyInput.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    els.qtyInput.value = String(qty);
    els.qtyTotalValue.textContent = `$${card.value * qty}`;
  }

  function closeQtyModal() {
    els.qtyModal.hidden = true;
    pendingTradeCardId = null;
    els.btnBackpack.hidden = currentScreen === "inventory";
  }

  function confirmTradeQty() {
    const cardId = pendingTradeCardId;
    const card = CARDS[cardId];
    const owned = player.cards[cardId] || 0;
    let qty = Math.floor(Number(els.qtyInput.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    if (!card || qty < 1) return;
    myOffer.cardId = cardId;
    myOffer.qty = qty;
    closeQtyModal();
    inventoryMode = "browse";
    showScreen("room");
    renderTradeSlots();
    scheduleOfferSync();
  }

  function clearMyOffer() {
    myOffer.cardId = null;
    myOffer.qty = 0;
    renderTradeSlots();
    scheduleOfferSync();
  }

  /* ——— Networking (PeerJS) ——— */

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
    for (let i = 0; i < length; i += 1) out += CODE_CHARS[values[i] % CODE_CHARS.length];
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
        <button type="button" class="btn btn-primary btn-sm" data-join-code="${lobby.code}">Join</button>
      </div>`
      )
      .join("");
  }

  function handleBoardMessage(data, fromConn) {
    if (!data || typeof data !== "object") return;
    if (isBoardHost) {
      if (data.type === "announce" && typeof data.code === "string") {
        const code = normalizeCode(data.code);
        if (code.length === 6) {
          if (data.status === "full") lobbyRegistry.delete(code);
          else {
            lobbyRegistry.set(code, { code, status: "open", updatedAt: Date.now() });
          }
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
      }
      return;
    }
    if (data.type === "lobbies") setKnownLobbies(data.lobbies);
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
        setTimeout(() => ensureBoard().catch(() => {}), 500);
      }
    });
  }

  function bindBoardHostConnection(connection) {
    boardClients.add(connection);
    connection.on("data", (data) => handleBoardMessage(data, connection));
    connection.on("close", () => boardClients.delete(connection));
  }

  function destroyBoard() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (boardConn) {
      try {
        boardConn.close();
      } catch (_) {}
      boardConn = null;
    }
    for (const client of boardClients) {
      try {
        client.close();
      } catch (_) {}
    }
    boardClients.clear();
    if (boardPeer) {
      try {
        boardPeer.destroy();
      } catch (_) {}
      boardPeer = null;
    }
    isBoardHost = false;
    boardReadyPromise = null;
    lobbyRegistry.clear();
  }

  function ensureBoard() {
    if (boardPeer && !boardPeer.destroyed) return boardReadyPromise || Promise.resolve();
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
      hostPeer.on("connection", (connection) => bindBoardHostConnection(connection));
      hostPeer.on("error", (err) => {
        if (err?.type === "unavailable-id") {
          try {
            hostPeer.destroy();
          } catch (_) {}
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
    if (boardConn && boardConn.open) boardConn.send(payload);
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
      } catch (_) {}
      conn = null;
    }
    if (peer) {
      try {
        peer.destroy();
      } catch (_) {}
      peer = null;
    }
    role = null;
    lobbyCode = null;
    myOffer.cardId = null;
    myOffer.qty = 0;
    theirOffer.cardId = null;
    theirOffer.qty = 0;
    els.lobbyCode.textContent = "------";
    renderTradeSlots();
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
      cardId: myOffer.cardId,
      qty: myOffer.qty,
    };
  }

  function scheduleOfferSync() {
    if (sendTimer) clearTimeout(sendTimer);
    sendTimer = setTimeout(() => {
      sendPayload(currentOfferPayload("offer"));
    }, 80);
  }

  function applyTheirOffer(data) {
    theirOffer.cardId = typeof data.cardId === "string" ? data.cardId : null;
    theirOffer.qty = Math.max(0, Math.floor(Number(data.qty) || 0));
    renderTradeSlots();
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
      theirOffer.cardId = null;
      theirOffer.qty = 0;
      renderTradeSlots();
      if (role === "host" && lobbyCode) announceLobby(lobbyCode).catch(() => {});
    });

    connection.on("error", () => {
      setStatus("Connection issue — retry joining if needed");
    });
  }

  function enterRoom(code) {
    browsingQuick = false;
    lobbyCode = code;
    els.lobbyCode.textContent = code;
    showScreen("room");
    renderTradeSlots();
  }

  function createTradeSpace() {
    setError(els.tradeError, "");
    els.btnCreate.disabled = true;
    els.btnJoin.disabled = true;
    els.btnQuick.disabled = true;
    destroySession({ keepBoard: true });
    role = "host";
    const code = randomCode();
    peer = new Peer(peerIdFromCode(code), { debug: 0 });

    peer.on("open", async () => {
      els.btnCreate.disabled = false;
      els.btnJoin.disabled = false;
      els.btnQuick.disabled = false;
      setStatus("Waiting for partner…");
      enterRoom(code);
      try {
        await announceLobby(code);
      } catch (_) {}
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

    peer.on("disconnected", () => setStatus("Reconnecting…"));
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
        const msg = "Could not reach that lobby. It may have closed or already filled.";
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

  /* ——— Events ——— */

  els.btnPlay.addEventListener("click", () => showScreen("play"));
  els.btnTrade.addEventListener("click", () => {
    setError(els.tradeError, "");
    showScreen("trade");
  });
  els.btnPlayBack.addEventListener("click", () => showScreen("title"));
  els.btnCardShop.addEventListener("click", () => {
    setShopMessage("");
    showScreen("cardShop");
  });
  els.btnSellStop.addEventListener("click", () => showScreen("sellStop"));
  els.btnBattles.addEventListener("click", () => showScreen("battles"));
  els.btnCardShopBack.addEventListener("click", () => showScreen("play"));
  els.btnSellStopBack.addEventListener("click", () => showScreen("play"));
  els.btnBattlesBack.addEventListener("click", () => showScreen("play"));
  els.btnInventoryBack.addEventListener("click", () => {
    const back = inventoryMode === "trade" ? "room" : inventoryReturnScreen || "title";
    inventoryMode = "browse";
    showScreen(back);
  });
  els.btnBackpack.addEventListener("click", () => openInventory("browse"));
  els.btnBuyCommonPack.addEventListener("click", () => buyPack("common-pack"));
  els.btnRevealDone.addEventListener("click", hidePackReveal);
  els.btnTradeBack.addEventListener("click", () => {
    destroySession();
    showScreen("title");
  });

  document.querySelectorAll(".inv-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      if (inventoryMode === "trade") return;
      inventoryTab = tab.getAttribute("data-inv-tab");
      renderInventoryList();
    });
  });

  els.inventoryList.addEventListener("click", (e) => {
    const packBtn = e.target.closest("[data-open-pack]");
    if (packBtn && inventoryMode === "browse") {
      openPack(packBtn.getAttribute("data-open-pack"));
      return;
    }
    const cardBtn = e.target.closest("[data-pick-card]");
    if (cardBtn && inventoryMode === "trade") {
      openQtyModal(cardBtn.getAttribute("data-pick-card"));
    }
  });

  els.myTradeSlot.addEventListener("click", () => openInventory("trade"));
  els.btnClearOffer.addEventListener("click", clearMyOffer);
  els.qtyInput.addEventListener("input", updateQtyTotal);
  els.btnQtyCancel.addEventListener("click", closeQtyModal);
  els.btnQtyConfirm.addEventListener("click", confirmTradeQty);

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

  renderPlayerUi();
})();
