(() => {
  const PEER_PREFIX = "cardgame-trade-";
  const BOARD_ID = "cardgame-lobby-board-v1";
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const LOBBY_STALE_MS = 15000;
  const HEARTBEAT_MS = 4000;
  const STORAGE_KEY = "cardgame-player-v2";
  const SHOP_STORAGE_KEY = "cardgame-shop-v1";
  const ACCOUNTS_KEY = "cardgame-accounts-v1";
  const SESSION_KEY = "cardgame-session-v1";
  const STARTING_COINS = 200;
  const CARDS_PER_PACK = 5;
  const RESTOCK_MS = 3 * 60 * 1000;
  const STOCK_MIN = 6;
  const STOCK_MAX = 10;
  const ADMIN_PASSWORD = "Stevevava";
  const TRADE_CONFIRM_MS = 2000;

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
      cps: 1,
      theme: "chicken",
      blurb: "Farmyard flutter",
      emoji: "🐔",
    },
    cow: {
      id: "cow",
      name: "Cow",
      value: 10,
      oneIn: 3,
      cps: 2,
      theme: "cow",
      blurb: "Pasture classic",
      emoji: "🐄",
    },
    pig: {
      id: "pig",
      name: "Pig",
      value: 12,
      oneIn: 5,
      cps: 3,
      theme: "pig",
      blurb: "Muddy treasure",
      emoji: "🐷",
    },
    salmon: {
      id: "salmon",
      name: "Salmon",
      value: 16,
      oneIn: 8,
      cps: 4,
      theme: "salmon",
      blurb: "Upstream flash",
      emoji: "🐟",
    },
    squid: {
      id: "squid",
      name: "Squid",
      value: 18,
      oneIn: 10,
      cps: 5,
      theme: "squid",
      blurb: "Ink & tide",
      emoji: "🦑",
    },
    monkey: {
      id: "monkey",
      name: "Monkey",
      value: 20,
      oneIn: 15,
      cps: 6,
      theme: "monkey",
      blurb: "Canopy trickster",
      emoji: "🐵",
    },
    lion: {
      id: "lion",
      name: "Lion",
      value: 30,
      oneIn: 20,
      cps: 8,
      theme: "lion",
      blurb: "Savanna crown",
      emoji: "🦁",
    },
    tiger: {
      id: "tiger",
      name: "Tiger",
      value: 30,
      oneIn: 20,
      cps: 8,
      theme: "tiger",
      blurb: "Striped thunder",
      emoji: "🐯",
    },
    leopard: {
      id: "leopard",
      name: "Leopard",
      value: 30,
      oneIn: 20,
      cps: 8,
      theme: "leopard",
      blurb: "Spotted shadow",
      emoji: "🐆",
    },
    shark: {
      id: "shark",
      name: "Shark",
      value: 40,
      oneIn: 30,
      cps: 10,
      theme: "shark",
      blurb: "Deep blue menace",
      emoji: "🦈",
    },
    triceratops: {
      id: "triceratops",
      name: "Triceratops",
      value: 50,
      oneIn: 40,
      cps: 12,
      theme: "triceratops",
      blurb: "Horned relic",
      emoji: "🦕",
      model: "assets/triceratops-emoji.png",
    },
    trex: {
      id: "trex",
      name: "T-Rex",
      value: 65,
      oneIn: 50,
      cps: 15,
      theme: "trex",
      blurb: "Apex fossil",
      emoji: "🦖",
    },
  };

  const COMMON_POOL = Object.values(CARDS);

  function resolveAssetUrl(relPath) {
    try {
      return new URL(relPath, document.baseURI).href;
    } catch (_) {
      return relPath;
    }
  }

  function cardArtHtml(card) {
    if (card.model) {
      const src = escapeHtml(resolveAssetUrl(card.model));
      const fallback = escapeHtml(card.emoji || "?");
      return `<img class="card-model" src="${src}" alt="${escapeHtml(card.name)}" draggable="false" data-fallback="${fallback}" onerror="this.outerHTML='<span class=\\'card-emoji\\' role=\\'img\\'>'+this.dataset.fallback+'</span>'" />`;
    }
    if (card.emoji) {
      return `<span class="card-emoji" role="img" aria-label="${escapeHtml(card.name)}">${card.emoji}</span>`;
    }
    return `<span class="card-emoji">?</span>`;
  }

  const screens = {
    title: document.getElementById("screen-title"),
    play: document.getElementById("screen-play"),
    cardShop: document.getElementById("screen-card-shop"),
    sellStop: document.getElementById("screen-sell-stop"),
    battles: document.getElementById("screen-battles"),
    inventory: document.getElementById("screen-inventory"),
    settings: document.getElementById("screen-settings"),
    accounts: document.getElementById("screen-accounts"),
    accountForm: document.getElementById("screen-account-form"),
    trade: document.getElementById("screen-trade"),
    join: document.getElementById("screen-join"),
    quick: document.getElementById("screen-quick"),
    room: document.getElementById("screen-room"),
  };

  const els = {
    btnPlay: document.getElementById("btn-play"),
    btnTrade: document.getElementById("btn-trade"),
    btnSettings: document.getElementById("btn-settings"),
    titleAccountChip: document.getElementById("title-account-chip"),
    btnPlayBack: document.getElementById("btn-play-back"),
    btnSettingsBack: document.getElementById("btn-settings-back"),
    btnAccounts: document.getElementById("btn-accounts"),
    btnAccountsBack: document.getElementById("btn-accounts-back"),
    accountsStatus: document.getElementById("accounts-status"),
    accountsMsg: document.getElementById("accounts-msg"),
    btnAccountRegister: document.getElementById("btn-account-register"),
    btnAccountLogin: document.getElementById("btn-account-login"),
    btnAccountLogout: document.getElementById("btn-account-logout"),
    btnAccountFormBack: document.getElementById("btn-account-form-back"),
    accountFormTitle: document.getElementById("account-form-title"),
    accountFormCopy: document.getElementById("account-form-copy"),
    accountUsername: document.getElementById("account-username"),
    accountPassword: document.getElementById("account-password"),
    btnAccountSubmit: document.getElementById("btn-account-submit"),
    accountFormError: document.getElementById("account-form-error"),
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
    packStockLabel: document.getElementById("pack-stock-label"),
    restockTimer: document.getElementById("restock-timer"),
    inventoryCoins: document.getElementById("inventory-coins"),
    sellCoins: document.getElementById("sell-coins"),
    sellIncomeRate: document.getElementById("sell-income-rate"),
    sellSlot0: document.getElementById("sell-slot-0"),
    sellSlot1: document.getElementById("sell-slot-1"),
    btnClearSell0: document.getElementById("btn-clear-sell-0"),
    btnClearSell1: document.getElementById("btn-clear-sell-1"),
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
    cardSellModal: document.getElementById("card-sell-modal"),
    cardSellPreview: document.getElementById("card-sell-preview"),
    cardSellQty: document.getElementById("card-sell-qty"),
    cardSellTotal: document.getElementById("card-sell-total"),
    cardSellHint: document.getElementById("card-sell-hint"),
    btnSellKeepOne: document.getElementById("btn-sell-keep-one"),
    btnCardSellCancel: document.getElementById("btn-card-sell-cancel"),
    btnCardSellConfirm: document.getElementById("btn-card-sell-confirm"),
    adminGate: document.getElementById("admin-gate"),
    adminSettings: document.getElementById("admin-settings"),
    adminPassword: document.getElementById("admin-password"),
    adminGateError: document.getElementById("admin-gate-error"),
    btnAdminGateCancel: document.getElementById("btn-admin-gate-cancel"),
    btnAdminGateEnter: document.getElementById("btn-admin-gate-enter"),
    adminInfiniteStock: document.getElementById("admin-infinite-stock"),
    adminUnkickable: document.getElementById("admin-unkickable"),
    btnAdminClose: document.getElementById("btn-admin-close"),
    myTradeItems: document.getElementById("my-trade-items"),
    theirTradeItems: document.getElementById("their-trade-items"),
    btnAddTradeCard: document.getElementById("btn-add-trade-card"),
    myTradeCash: document.getElementById("my-trade-cash"),
    myTradeTotal: document.getElementById("my-trade-total"),
    theirTradeCashLine: document.getElementById("their-trade-cash-line"),
    theirTradeTotal: document.getElementById("their-trade-total"),
    theirConfirmHint: document.getElementById("their-confirm-hint"),
    btnClearOffer: document.getElementById("btn-clear-offer"),
    btnTradeConfirm: document.getElementById("btn-trade-confirm"),
    tradeConfirmStatus: document.getElementById("trade-confirm-status"),
    partnerName: document.getElementById("partner-name"),
    btnKick: document.getElementById("btn-kick"),
    loginRequiredModal: document.getElementById("login-required-modal"),
    btnLoginRequiredOk: document.getElementById("btn-login-required-ok"),
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
  let kickingPartner = false;
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
  let inventoryMode = "browse"; // browse | trade | sell
  let pendingSellSlot = null;
  let sellTickTimer = null;
  let shopUiTimer = null;

  function randomStockAmount() {
    return STOCK_MIN + Math.floor(Math.random() * (STOCK_MAX - STOCK_MIN + 1));
  }

  function loadShop() {
    try {
      const raw = localStorage.getItem(SHOP_STORAGE_KEY);
      if (!raw) {
        return {
          stock: randomStockAmount(),
          nextRestockAt: Date.now() + RESTOCK_MS,
          infiniteStock: false,
          unkickable: false,
        };
      }
      const data = JSON.parse(raw);
      return {
        stock: Math.max(0, Math.floor(Number(data.stock) || 0)),
        nextRestockAt: Number(data.nextRestockAt) || Date.now() + RESTOCK_MS,
        infiniteStock: Boolean(data.infiniteStock),
        unkickable: Boolean(data.unkickable),
      };
    } catch (_) {
      return {
        stock: randomStockAmount(),
        nextRestockAt: Date.now() + RESTOCK_MS,
        infiniteStock: false,
        unkickable: false,
      };
    }
  }

  const shop = loadShop();

  function saveShop() {
    localStorage.setItem(
      SHOP_STORAGE_KEY,
      JSON.stringify({
        stock: shop.stock,
        nextRestockAt: shop.nextRestockAt,
        infiniteStock: shop.infiniteStock,
        unkickable: shop.unkickable,
      })
    );
  }

  function applyDueRestocks() {
    const now = Date.now();
    if (!Number.isFinite(shop.nextRestockAt)) {
      shop.nextRestockAt = now + RESTOCK_MS;
      saveShop();
      return;
    }
    if (now < shop.nextRestockAt) return;
    const cycles = Math.floor((now - shop.nextRestockAt) / RESTOCK_MS) + 1;
    shop.nextRestockAt += cycles * RESTOCK_MS;
    shop.stock = randomStockAmount();
    saveShop();
  }

  function closeAdminSettings() {
    els.adminSettings.hidden = true;
    els.btnBackpack.hidden = currentScreen === "inventory";
    renderShopStock();
  }

  function formatCountdown(ms) {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function renderShopStock() {
    applyDueRestocks();
    const remaining = Math.max(0, shop.nextRestockAt - Date.now());

    if (shop.infiniteStock) {
      els.packStockLabel.textContent = "In stock: ∞";
      els.restockTimer.textContent = "Infinite stock enabled";
      els.btnBuyCommonPack.disabled = player.coins < PACKS["common-pack"].price;
      return;
    }

    els.packStockLabel.textContent =
      shop.stock > 0 ? `In stock: ${shop.stock}` : "In stock: 0";
    els.restockTimer.textContent =
      shop.stock > 0
        ? `Next restock replaces stock in ${formatCountdown(remaining)}`
        : `Sold out · restocks in ${formatCountdown(remaining)}`;
    els.btnBuyCommonPack.disabled =
      shop.stock <= 0 || player.coins < PACKS["common-pack"].price;
  }

  function startShopUiTimer() {
    if (shopUiTimer) return;
    shopUiTimer = setInterval(() => {
      const before = shop.stock;
      applyDueRestocks();
      if (currentScreen === "cardShop" || before !== shop.stock) {
        if (currentScreen === "cardShop") renderShopStock();
        else if (before !== shop.stock) saveShop();
      }
    }, 250);
  }
  let pendingTradeCardId = null;
  let pendingSellCardId = null;
  let accountFormMode = "register"; // register | login
  let myConfirmed = false;
  let theirConfirmed = false;
  let bothConfirmedSince = null;
  let tradeArmedTimer = null;
  let tradeUiTimer = null;
  let tradeExecuting = false;

  const MAX_TRADE_CARD_TYPES = 4;

  const myOffer = { cards: [], cash: 0 };
  const theirOffer = { cards: [], cash: 0 };
  let partnerUsername = null;
  let partnerUnkickable = false;

  function emptyBags() {
    return { packs: {}, cards: {}, items: {}, sellSlots: [null, null] };
  }

  function freshPlayer() {
    return { coins: STARTING_COINS, ...emptyBags() };
  }

  function normalizePlayerData(data) {
    const bags = emptyBags();
    if (!data || typeof data !== "object") return freshPlayer();
    const coins = Number.isFinite(data.coins)
      ? Math.max(0, Math.floor(data.coins))
      : STARTING_COINS;

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

    if (Array.isArray(data.sellSlots)) {
      bags.sellSlots = [0, 1].map((i) => {
        const id = data.sellSlots[i];
        return typeof id === "string" && CARDS[id] ? id : null;
      });
    }
    return { coins, ...bags };
  }

  function snapshotPlayer(p = player) {
    return {
      coins: p.coins,
      packs: { ...p.packs },
      cards: { ...p.cards },
      items: { ...p.items },
      sellSlots: [...p.sellSlots],
    };
  }

  function applyPlayerData(data) {
    const next = normalizePlayerData(data);
    player.coins = next.coins;
    player.packs = next.packs;
    player.cards = next.cards;
    player.items = next.items;
    player.sellSlots = next.sellSlots;
  }

  function loadAccountsDb() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      if (!raw) return {};
      const data = JSON.parse(raw);
      return data && typeof data === "object" ? data : {};
    } catch (_) {
      return {};
    }
  }

  /** Persist accounts without ever dropping stored passwords. */
  function saveAccountsDb(db) {
    const existing = loadAccountsDb();
    const merged = { ...existing };
    for (const [username, entry] of Object.entries(db || {})) {
      const prev = existing[username] || {};
      const password =
        typeof entry.password === "string" && entry.password.length
          ? entry.password
          : typeof prev.password === "string"
            ? prev.password
            : "";
      if (!password) continue;
      merged[username] = {
        password,
        player: entry.player != null ? entry.player : prev.player || freshPlayer(),
      };
    }
    // Keep every previously known account password forever.
    for (const [username, prev] of Object.entries(existing)) {
      if (!merged[username] && typeof prev.password === "string" && prev.password.length) {
        merged[username] = {
          password: prev.password,
          player: prev.player || freshPlayer(),
        };
      }
    }
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(merged));
  }

  function loadSessionUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      const user = typeof data.user === "string" ? data.user.trim() : null;
      if (!user) return null;
      const db = loadAccountsDb();
      return db[user] ? user : null;
    } catch (_) {
      return null;
    }
  }

  function saveSessionUser(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: user || null }));
  }

  function loadGuestPlayer() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("cardgame-player-v1");
      if (!raw) return freshPlayer();
      return normalizePlayerData(JSON.parse(raw));
    } catch (_) {
      return freshPlayer();
    }
  }

  function saveGuestPlayer(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshotPlayer(data)));
  }

  let sessionUser = loadSessionUser();
  let player = freshPlayer();

  if (sessionUser) {
    const db = loadAccountsDb();
    applyPlayerData(db[sessionUser]?.player || freshPlayer());
  } else {
    applyPlayerData(loadGuestPlayer());
  }

  function savePlayer() {
    const snap = snapshotPlayer();
    if (sessionUser) {
      const db = loadAccountsDb();
      const prev = db[sessionUser] || {};
      // Never overwrite/remove password — only refresh player save.
      db[sessionUser] = {
        password: prev.password,
        player: snap,
      };
      saveAccountsDb(db);
    } else {
      saveGuestPlayer(snap);
    }
  }

  function renderAccountUi() {
    const label = sessionUser ? `Logged in as ${sessionUser}` : "Playing as Guest";
    els.titleAccountChip.textContent = label;
    els.accountsStatus.textContent = sessionUser
      ? `Logged in as ${sessionUser}. You can switch accounts anytime.`
      : "You are playing as a guest. Register to keep this profile forever.";
  }

  function setAccountsMsg(message, isError = false) {
    if (!message) {
      els.accountsMsg.hidden = true;
      els.accountsMsg.textContent = "";
      els.accountsMsg.classList.remove("error");
      return;
    }
    els.accountsMsg.hidden = false;
    els.accountsMsg.textContent = message;
    els.accountsMsg.classList.toggle("error", isError);
  }

  function openAccountForm(mode) {
    accountFormMode = mode;
    setError(els.accountFormError, "");
    els.accountUsername.value = "";
    els.accountPassword.value = "";
    if (mode === "register") {
      els.accountFormTitle.textContent = "Register";
      els.accountFormCopy.textContent =
        "Create an account. Your password is saved forever on this device.";
      els.btnAccountSubmit.textContent = "Register";
    } else {
      els.accountFormTitle.textContent = "Log in";
      els.accountFormCopy.textContent =
        "Log into any saved account. You can do this even while logged in.";
      els.btnAccountSubmit.textContent = "Log in";
    }
    showScreen("accountForm");
    els.accountUsername.focus();
  }

  function registerAccount() {
    const username = els.accountUsername.value.trim();
    const password = els.accountPassword.value;
    if (!username || username.length < 2) {
      setError(els.accountFormError, "Account name must be at least 2 characters.");
      return;
    }
    if (!password || password.length < 1) {
      setError(els.accountFormError, "Password is required.");
      return;
    }
    const db = loadAccountsDb();
    if (db[username]) {
      setError(els.accountFormError, "That account already exists. Try logging in.");
      return;
    }
    // Save current progress into the new account.
    db[username] = {
      password,
      player: snapshotPlayer(),
    };
    saveAccountsDb(db);
    sessionUser = username;
    saveSessionUser(sessionUser);
    setAccountsMsg(`Registered and logged in as ${username}.`);
    showScreen("accounts");
    renderAccountUi();
  }

  function loginAccount() {
    const username = els.accountUsername.value.trim();
    const password = els.accountPassword.value;
    const db = loadAccountsDb();
    const entry = db[username];
    if (!entry || entry.password !== password) {
      setError(els.accountFormError, "Wrong account or password.");
      return;
    }
    // Persist current profile before switching.
    savePlayer();
    sessionUser = username;
    saveSessionUser(sessionUser);
    applyPlayerData(entry.player || freshPlayer());
    savePlayer();
    setAccountsMsg(`Logged in as ${username}.`);
    showScreen("accounts");
    renderAccountUi();
    renderPlayerUi();
  }

  function logoutAccount() {
    if (!sessionUser) {
      setAccountsMsg("You are already a guest.", true);
      return;
    }
    savePlayer();
    sessionUser = null;
    saveSessionUser(null);
    applyPlayerData(freshPlayer());
    saveGuestPlayer(player);
    setAccountsMsg("Logged out. You are on a new guest profile.");
    renderAccountUi();
    renderPlayerUi();
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
        <div class="card-texture" aria-hidden="true"></div>
        <div class="card-pattern" aria-hidden="true"></div>
        <div class="card-sheen" aria-hidden="true"></div>
        <div class="card-frame" aria-hidden="true"></div>
        <div class="card-top">
          <span class="card-rarity">1/${card.oneIn}</span>
          ${valueHtml}
        </div>
        <div class="card-art">
          <div class="card-medallion">${cardArtHtml(card)}</div>
        </div>
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
    const pickMode = inventoryMode === "trade" || inventoryMode === "sell";

    if (pickMode) {
      els.inventoryTitle.textContent =
        inventoryMode === "sell" ? "Station a card" : "Select a card";
      els.inventoryCopy.textContent =
        inventoryMode === "sell"
          ? "Pick a card to earn coins every second."
          : "Pick a card, then choose how many to offer.";
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
            ? "Your collected animal cards. Right-click a card to sell."
            : "General items will show up here.";
      document.querySelectorAll(".inv-tab").forEach((tab) => {
        tab.hidden = false;
        tab.classList.toggle("active", tab.getAttribute("data-inv-tab") === inventoryTab);
      });
    }

    const activeBag =
      pickMode
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
          : inventoryMode === "sell"
            ? "No cards to station. Open some packs first."
          : inventoryTab === "packs"
            ? "No packs. Visit the Card shop."
            : inventoryTab === "cards"
              ? "No cards yet. Open a pack!"
              : "No items yet.";
      els.inventoryList.innerHTML = `<p class="inventory-empty">${emptyMsg}</p>`;
      return;
    }

    if (pickMode || inventoryTab === "cards") {
      els.inventoryList.innerHTML = `<div class="card-grid">${activeEntries
        .map(([id, count]) => {
          const card = CARDS[id];
          if (!card) return "";
          const cpsNote =
            inventoryMode === "sell"
              ? `<div class="card-cps-tag">+${card.cps}/s</div>`
              : "";
          return `<button type="button" class="card-pick" data-pick-card="${id}">${cardFaceHtml(card, { qty: count })}${cpsNote}</button>`;
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

  function totalSellCps() {
    return player.sellSlots.reduce((sum, id) => {
      const card = id ? CARDS[id] : null;
      return sum + (card ? card.cps : 0);
    }, 0);
  }

  function renderSellSlot(index) {
    const slotEl = index === 0 ? els.sellSlot0 : els.sellSlot1;
    const clearBtn = index === 0 ? els.btnClearSell0 : els.btnClearSell1;
    const cardId = player.sellSlots[index];
    const card = cardId ? CARDS[cardId] : null;

    if (card) {
      slotEl.classList.add("filled");
      slotEl.innerHTML = `
        ${cardFaceHtml(card, { compact: true })}
        <div class="slot-meta">+<strong>${card.cps}</strong>/s</div>
      `;
      clearBtn.hidden = false;
    } else {
      slotEl.classList.remove("filled");
      slotEl.innerHTML = `
        <span class="trade-slot-plus">+</span>
        <span class="trade-slot-label">Add card</span>
      `;
      clearBtn.hidden = true;
    }
  }

  function renderSellStop() {
    renderSellSlot(0);
    renderSellSlot(1);
    els.sellCoins.textContent = String(player.coins);
    els.sellIncomeRate.textContent = String(totalSellCps());
  }

  function assignSellSlot(index, cardId) {
    if (!CARDS[cardId] || !player.cards[cardId]) return;
    const prev = player.sellSlots[index];
    if (prev) {
      player.cards[prev] = (player.cards[prev] || 0) + 1;
    }
    player.cards[cardId] -= 1;
    if (player.cards[cardId] <= 0) delete player.cards[cardId];
    player.sellSlots[index] = cardId;
    savePlayer();
    pendingSellSlot = null;
    inventoryMode = "browse";
    showScreen("sellStop");
    renderPlayerUi();
  }

  function clearSellSlot(index) {
    const prev = player.sellSlots[index];
    if (!prev) return;
    player.cards[prev] = (player.cards[prev] || 0) + 1;
    player.sellSlots[index] = null;
    savePlayer();
    renderPlayerUi();
  }

  function tickSellIncome() {
    const cps = totalSellCps();
    if (cps <= 0) return;
    player.coins += cps;
    savePlayer();
    if (currentScreen === "sellStop") {
      els.sellCoins.textContent = String(player.coins);
    }
    if (currentScreen === "cardShop") {
      els.shopCoins.textContent = String(player.coins);
      renderShopStock();
    }
    if (currentScreen === "inventory") {
      els.inventoryCoins.textContent = String(player.coins);
    }
  }

  function startSellTicker() {
    if (sellTickTimer) return;
    sellTickTimer = setInterval(tickSellIncome, 1000);
  }

  function emptyOffer() {
    return { cards: [], cash: 0 };
  }

  function normalizeOffer(data) {
    const cards = [];
    const rawCards = Array.isArray(data?.cards) ? data.cards : [];
    for (const row of rawCards) {
      if (!row || typeof row.cardId !== "string" || !CARDS[row.cardId]) continue;
      const qty = Math.max(0, Math.floor(Number(row.qty) || 0));
      if (qty <= 0) continue;
      if (cards.some((c) => c.cardId === row.cardId)) continue;
      cards.push({ cardId: row.cardId, qty });
      if (cards.length >= MAX_TRADE_CARD_TYPES) break;
    }
    const cash = Math.max(0, Math.floor(Number(data?.cash) || 0));
    return { cards, cash };
  }

  function offerHasContent(offer) {
    return offer.cash > 0 || offer.cards.some((c) => c.qty > 0);
  }

  function offerTotalValue(offer) {
    let total = offer.cash || 0;
    for (const row of offer.cards) {
      const card = CARDS[row.cardId];
      if (card) total += card.value * row.qty;
    }
    return total;
  }

  function canAffordMyOffer() {
    if (myOffer.cash > player.coins) return false;
    for (const row of myOffer.cards) {
      if ((player.cards[row.cardId] || 0) < row.qty) return false;
    }
    return true;
  }

  function snapshotOffer(offer) {
    return {
      cards: offer.cards.map((c) => ({ cardId: c.cardId, qty: c.qty })),
      cash: offer.cash || 0,
    };
  }

  function offerCardsHtml(offer, editable) {
    if (!offer.cards.length) {
      return `<p class="trade-empty">${editable ? "No cards yet." : "Waiting…"}</p>`;
    }
    return offer.cards
      .map((row) => {
        const card = CARDS[row.cardId];
        if (!card) return "";
        const lineValue = card.value * row.qty;
        const removeBtn = editable
          ? `<button type="button" class="btn-remove-trade" data-remove-trade="${row.cardId}" title="Remove">×</button>`
          : "";
        return `
          <div class="trade-item-row">
            <div class="trade-item-card">${cardFaceHtml(card, { qty: row.qty, compact: true })}</div>
            <div class="trade-item-meta">
              <div>${escapeHtml(card.name)} ×${row.qty}</div>
              <div class="trade-item-value">$${lineValue}</div>
            </div>
            ${removeBtn}
          </div>
        `;
      })
      .join("");
  }

  function updatePartnerChrome() {
    if (partnerUsername) {
      els.partnerName.hidden = false;
      els.partnerName.textContent = partnerUsername;
      const canKick = role === "host";
      els.btnKick.hidden = !canKick;
      els.btnKick.disabled = canKick && partnerUnkickable;
      els.btnKick.title = partnerUnkickable ? "This player is unkickable" : "Kick from room";
      els.roomStatus.textContent = "Connected — trading live";
    } else {
      els.partnerName.hidden = true;
      els.partnerName.textContent = "";
      els.btnKick.hidden = true;
      els.btnKick.disabled = false;
      els.btnKick.title = "Kick from room";
    }
  }

  function clearPartnerPresence() {
    partnerUsername = null;
    partnerUnkickable = false;
    updatePartnerChrome();
  }

  function renderTradeSlots() {
    const locked = myConfirmed;
    els.btnAddTradeCard.disabled = locked || myOffer.cards.length >= MAX_TRADE_CARD_TYPES;
    els.btnAddTradeCard.hidden = locked ? false : myOffer.cards.length >= MAX_TRADE_CARD_TYPES;
    els.myTradeCash.disabled = locked;
    els.btnClearOffer.disabled = locked;
    els.btnAddTradeCard.classList.toggle("trade-locked", locked);

    els.myTradeItems.innerHTML = offerCardsHtml(myOffer, !locked);
    els.myTradeCash.value = String(myOffer.cash || 0);
    els.myTradeTotal.textContent = `$${offerTotalValue(myOffer)}`;
    els.btnClearOffer.hidden = !offerHasContent(myOffer);

    els.theirTradeItems.innerHTML = offerCardsHtml(theirOffer, false);
    els.theirTradeCashLine.textContent = `Cash: $${theirOffer.cash || 0}`;
    els.theirTradeTotal.textContent = `$${offerTotalValue(theirOffer)}`;

    els.theirConfirmHint.textContent = theirConfirmed ? "Confirmed" : "Read only";
    els.theirConfirmHint.classList.toggle("confirmed", theirConfirmed);
    updatePartnerChrome();
    renderTradeConfirmUi();
  }

  function clearTradeArmedTimer() {
    if (tradeArmedTimer) {
      clearTimeout(tradeArmedTimer);
      tradeArmedTimer = null;
    }
    bothConfirmedSince = null;
  }

  function renderTradeConfirmUi() {
    if (!els.btnTradeConfirm) return;
    els.btnTradeConfirm.textContent = myConfirmed ? "Unconfirm" : "Confirm";
    els.btnTradeConfirm.classList.toggle("btn-secondary", myConfirmed);
    els.btnTradeConfirm.classList.toggle("btn-primary", !myConfirmed);

    if (tradeExecuting) {
      els.tradeConfirmStatus.textContent = "Trade complete!";
      return;
    }

    if (myConfirmed && theirConfirmed && bothConfirmedSince) {
      const left = Math.max(0, TRADE_CONFIRM_MS - (Date.now() - bothConfirmedSince));
      const secs = (left / 1000).toFixed(1);
      els.tradeConfirmStatus.textContent = `Both confirmed — trading in ${secs}s…`;
      return;
    }
    if (myConfirmed && !theirConfirmed) {
      els.tradeConfirmStatus.textContent = "You confirmed. Waiting for partner…";
      return;
    }
    if (!myConfirmed && theirConfirmed) {
      els.tradeConfirmStatus.textContent = "Partner confirmed. Confirm to lock the trade.";
      return;
    }
    els.tradeConfirmStatus.textContent = "Set your offer, then confirm.";
  }

  function armDualConfirmTrade() {
    if (!(myConfirmed && theirConfirmed)) {
      clearTradeArmedTimer();
      renderTradeConfirmUi();
      return;
    }
    if (!bothConfirmedSince) bothConfirmedSince = Date.now();
    const wait = Math.max(0, TRADE_CONFIRM_MS - (Date.now() - bothConfirmedSince));
    if (tradeArmedTimer) clearTimeout(tradeArmedTimer);
    tradeArmedTimer = setTimeout(() => {
      if (myConfirmed && theirConfirmed) executeTrade(false);
    }, wait);
    renderTradeConfirmUi();
    if (!tradeUiTimer) {
      tradeUiTimer = setInterval(() => {
        if (!(myConfirmed && theirConfirmed)) {
          clearInterval(tradeUiTimer);
          tradeUiTimer = null;
          return;
        }
        renderTradeConfirmUi();
      }, 100);
    }
  }

  function setMyConfirmed(next) {
    myConfirmed = Boolean(next);
    if (!myConfirmed) clearTradeArmedTimer();
    sendPayload({
      type: "confirm",
      confirmed: myConfirmed,
      ...snapshotOffer(myOffer),
    });
    renderTradeSlots();
    armDualConfirmTrade();
  }

  function toggleTradeConfirm() {
    if (tradeExecuting) return;
    if (!conn || !conn.open) {
      setStatus("Connect with a partner before confirming.");
      return;
    }
    if (!myConfirmed && !offerHasContent(myOffer) && !offerHasContent(theirOffer)) {
      els.tradeConfirmStatus.textContent = "Add cards or cash (or wait for theirs) before confirming.";
      return;
    }
    if (!myConfirmed && !canAffordMyOffer()) {
      els.tradeConfirmStatus.textContent = "You don't have enough cards or cash for this offer.";
      return;
    }
    setMyConfirmed(!myConfirmed);
  }

  function executeTrade(fromPartnerSignal = false) {
    if (tradeExecuting) return;
    if (!offerHasContent(myOffer) && !offerHasContent(theirOffer)) return;
    if (!fromPartnerSignal && !(myConfirmed && theirConfirmed)) return;

    tradeExecuting = true;
    clearTradeArmedTimer();

    if (!canAffordMyOffer()) {
      tradeExecuting = false;
      myConfirmed = false;
      clearTradeArmedTimer();
      sendPayload({
        type: "confirm",
        confirmed: false,
        ...snapshotOffer(myOffer),
      });
      renderTradeSlots();
      els.tradeConfirmStatus.textContent = "Trade failed — not enough cards or cash.";
      sendPayload({ type: "trade-fail", reason: "missing-cards" });
      return;
    }

    for (const row of myOffer.cards) {
      player.cards[row.cardId] -= row.qty;
      if (player.cards[row.cardId] <= 0) delete player.cards[row.cardId];
    }
    if (myOffer.cash > 0) player.coins -= myOffer.cash;

    for (const row of theirOffer.cards) {
      player.cards[row.cardId] = (player.cards[row.cardId] || 0) + row.qty;
    }
    if (theirOffer.cash > 0) player.coins += theirOffer.cash;

    savePlayer();

    Object.assign(myOffer, emptyOffer());
    Object.assign(theirOffer, emptyOffer());
    myConfirmed = false;
    theirConfirmed = false;
    if (!fromPartnerSignal) sendPayload({ type: "trade-done" });
    renderTradeSlots();
    renderPlayerUi();
    els.tradeConfirmStatus.textContent = "Trade complete!";
    setStatus("Trade complete — set a new offer anytime.");
    setTimeout(() => {
      tradeExecuting = false;
      renderTradeConfirmUi();
    }, 1200);
  }

  function resetTradeLockState() {
    myConfirmed = false;
    theirConfirmed = false;
    tradeExecuting = false;
    clearTradeArmedTimer();
    if (tradeUiTimer) {
      clearInterval(tradeUiTimer);
      tradeUiTimer = null;
    }
  }

  function renderPlayerUi() {
    els.shopCoins.textContent = String(player.coins);
    els.inventoryCoins.textContent = String(player.coins);
    renderShopStock();

    const total = inventoryTotal();
    if (total > 0) {
      els.backpackCount.hidden = false;
      els.backpackCount.textContent = String(total);
    } else {
      els.backpackCount.hidden = true;
    }

    if (currentScreen === "inventory") renderInventoryList();
    if (currentScreen === "room") renderTradeSlots();
    if (currentScreen === "sellStop") renderSellStop();
  }

  function buyPack(packId) {
    const pack = PACKS[packId];
    if (!pack) return;
    applyDueRestocks();
    if (!shop.infiniteStock && shop.stock <= 0) {
      setShopMessage("Sold out. Wait for the restock timer.", true);
      renderShopStock();
      return;
    }
    if (player.coins < pack.price) {
      setShopMessage("Not enough coins.", true);
      return;
    }
    player.coins -= pack.price;
    if (!shop.infiniteStock) {
      shop.stock -= 1;
      saveShop();
    }
    player.packs[packId] = (player.packs[packId] || 0) + 1;
    savePlayer();
    renderPlayerUi();
    setShopMessage(`Bought ${pack.name}. Open it from your backpack.`);
  }

  function openAdminGate() {
    setError(els.adminGateError, "");
    els.adminPassword.value = "";
    els.adminGate.hidden = false;
    els.btnBackpack.hidden = true;
    setTimeout(() => els.adminPassword.focus(), 0);
  }

  function closeAdminGate() {
    els.adminGate.hidden = true;
    els.btnBackpack.hidden = currentScreen === "inventory";
  }

  function openAdminSettings() {
    closeAdminGate();
    els.adminInfiniteStock.checked = shop.infiniteStock;
    els.adminUnkickable.checked = shop.unkickable;
    els.adminSettings.hidden = false;
    els.btnBackpack.hidden = true;
  }

  function tryAdminLogin() {
    if (els.adminPassword.value === ADMIN_PASSWORD) {
      openAdminSettings();
      return;
    }
    setError(els.adminGateError, "Wrong password.");
  }

  function showScreen(name) {
    currentScreen = name;
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[name].classList.add("active");
    els.btnBackpack.hidden = name === "inventory";
    if (name === "title" || name === "accounts" || name === "settings") renderAccountUi();
    if (
      name === "cardShop" ||
      name === "inventory" ||
      name === "room" ||
      name === "sellStop"
    ) {
      renderPlayerUi();
    }
  }

  function openInventory(mode = "browse", sellSlotIndex = null) {
    inventoryMode = mode;
    pendingSellSlot = mode === "sell" ? sellSlotIndex : null;
    if (mode === "trade" || mode === "sell") inventoryTab = "cards";
    inventoryReturnScreen = currentScreen === "inventory" ? inventoryReturnScreen : currentScreen;
    showScreen("inventory");
    renderInventoryList();
  }

  function openQtyModal(cardId) {
    const card = CARDS[cardId];
    const owned = player.cards[cardId] || 0;
    if (!card || owned < 1) return;
    const existing = myOffer.cards.find((c) => c.cardId === cardId);
    if (!existing && myOffer.cards.length >= MAX_TRADE_CARD_TYPES) {
      els.tradeConfirmStatus.textContent = "You can only add 4 different card types.";
      showScreen("room");
      return;
    }
    pendingTradeCardId = cardId;
    els.qtyTitle.textContent = existing ? `Update ${card.name}` : `Offer ${card.name}`;
    els.qtyPreview.innerHTML = cardFaceHtml(card, { qty: owned, compact: true });
    els.qtyInput.max = String(owned);
    els.qtyInput.value = String(existing ? existing.qty : 1);
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

  function openCardSellModal(cardId) {
    const card = CARDS[cardId];
    const owned = player.cards[cardId] || 0;
    if (!card || owned < 1) return;
    pendingSellCardId = cardId;
    els.cardSellPreview.innerHTML = cardFaceHtml(card, { qty: owned, compact: true });
    els.cardSellQty.max = String(owned);
    els.cardSellQty.value = "1";
    els.cardSellHint.textContent = `Owned: ${owned} · Unit value $${card.value}`;
    els.btnSellKeepOne.disabled = owned < 2;
    updateCardSellTotal();
    els.cardSellModal.hidden = false;
    els.btnBackpack.hidden = true;
  }

  function updateCardSellTotal() {
    const card = CARDS[pendingSellCardId];
    if (!card) return;
    const owned = player.cards[pendingSellCardId] || 0;
    let qty = Math.floor(Number(els.cardSellQty.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    els.cardSellQty.value = String(qty);
    els.cardSellTotal.textContent = `$${card.value * qty}`;
    els.btnCardSellConfirm.disabled = qty < 1 || qty > owned;
  }

  function setSellKeepOne() {
    const owned = player.cards[pendingSellCardId] || 0;
    if (owned < 2) return;
    els.cardSellQty.value = String(owned - 1);
    updateCardSellTotal();
  }

  function closeCardSellModal() {
    els.cardSellModal.hidden = true;
    pendingSellCardId = null;
    els.btnBackpack.hidden = currentScreen === "inventory";
  }

  function confirmCardSell() {
    const cardId = pendingSellCardId;
    const card = CARDS[cardId];
    const owned = player.cards[cardId] || 0;
    if (!card || owned < 1) {
      closeCardSellModal();
      return;
    }
    let qty = Math.floor(Number(els.cardSellQty.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    const payout = card.value * qty;
    player.cards[cardId] -= qty;
    if (player.cards[cardId] <= 0) delete player.cards[cardId];
    player.coins += payout;
    savePlayer();
    closeCardSellModal();
    renderPlayerUi();
  }

  function confirmTradeQty() {
    if (myConfirmed) return;
    const cardId = pendingTradeCardId;
    const card = CARDS[cardId];
    const owned = player.cards[cardId] || 0;
    let qty = Math.floor(Number(els.qtyInput.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    if (!card || qty < 1) return;

    const existing = myOffer.cards.find((c) => c.cardId === cardId);
    if (existing) {
      existing.qty = qty;
    } else {
      if (myOffer.cards.length >= MAX_TRADE_CARD_TYPES) {
        closeQtyModal();
        showScreen("room");
        els.tradeConfirmStatus.textContent = "You can only add 4 different card types.";
        return;
      }
      myOffer.cards.push({ cardId, qty });
    }
    closeQtyModal();
    inventoryMode = "browse";
    showScreen("room");
    renderTradeSlots();
    scheduleOfferSync();
  }

  function clearMyOffer() {
    if (myConfirmed) return;
    Object.assign(myOffer, emptyOffer());
    renderTradeSlots();
    scheduleOfferSync();
  }

  function removeTradeCard(cardId) {
    if (myConfirmed) return;
    myOffer.cards = myOffer.cards.filter((c) => c.cardId !== cardId);
    renderTradeSlots();
    scheduleOfferSync();
  }

  function syncMyTradeCashFromInput() {
    if (myConfirmed) return;
    let cash = Math.floor(Number(els.myTradeCash.value) || 0);
    cash = Math.max(0, Math.min(player.coins, cash));
    els.myTradeCash.value = String(cash);
    myOffer.cash = cash;
    els.myTradeTotal.textContent = `$${offerTotalValue(myOffer)}`;
    els.btnClearOffer.hidden = !offerHasContent(myOffer);
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
    Object.assign(myOffer, emptyOffer());
    Object.assign(theirOffer, emptyOffer());
    resetTradeLockState();
    clearPartnerPresence();
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
      ...snapshotOffer(myOffer),
      confirmed: myConfirmed,
      username: sessionUser || "Guest",
      unkickable: Boolean(shop.unkickable),
    };
  }

  function scheduleOfferSync() {
    if (myConfirmed) return;
    if (sendTimer) clearTimeout(sendTimer);
    sendTimer = setTimeout(() => {
      sendPayload(currentOfferPayload("offer"));
    }, 80);
  }

  function applyTheirOffer(data) {
    const next = normalizeOffer(data);
    theirOffer.cards = next.cards;
    theirOffer.cash = next.cash;
    if (typeof data.confirmed === "boolean") {
      theirConfirmed = data.confirmed;
      if (!theirConfirmed) clearTradeArmedTimer();
    }
    if (typeof data.username === "string" && data.username.trim()) {
      partnerUsername = data.username.trim();
    }
    if (typeof data.unkickable === "boolean") {
      partnerUnkickable = data.unkickable;
    }
    renderTradeSlots();
    armDualConfirmTrade();
  }

  function kickPartner() {
    if (!conn || role !== "host") return;
    if (partnerUnkickable) {
      setError(els.tradeError, "That player is unkickable.");
      return;
    }
    // Send kick and wait: kickable guests leave (close cleans up);
    // unkickable guests reply kick-denied and stay connected.
    kickingPartner = true;
    sendPayload({ type: "kicked" });
    setStatus("Kicking partner…");
  }

  function bindConnection(connection) {
    conn = connection;
    const onReady = () => {
      setStatus("Connected — trading live");
      if (role === "host") markLobbyFull();
      resetTradeLockState();
      sendPayload(currentOfferPayload("hello"));
      renderTradeSlots();
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
      if (data.type === "kicked") {
        if (shop.unkickable) {
          sendPayload({ type: "kick-denied" });
          setError(els.tradeError, "Kick blocked — you are unkickable.");
          return;
        }
        destroySession();
        showScreen("trade");
        setError(els.tradeError, "You were kicked from the trade room.");
        return;
      }
      if (data.type === "kick-denied") {
        kickingPartner = false;
        partnerUnkickable = true;
        updatePartnerChrome();
        setStatus("Connected — trading live");
        setError(els.tradeError, "Kick failed — that player is unkickable.");
        return;
      }
      if (data.type === "hello" || data.type === "offer") {
        applyTheirOffer(data);
        if (data.type === "hello") {
          setStatus("Connected — trading live");
          sendPayload(currentOfferPayload("offer"));
        }
        return;
      }
      if (data.type === "confirm") {
        theirConfirmed = Boolean(data.confirmed);
        const next = normalizeOffer(data);
        theirOffer.cards = next.cards;
        theirOffer.cash = next.cash;
        if (typeof data.username === "string" && data.username.trim()) {
          partnerUsername = data.username.trim();
        }
        if (typeof data.unkickable === "boolean") {
          partnerUnkickable = data.unkickable;
        }
        if (!theirConfirmed) clearTradeArmedTimer();
        renderTradeSlots();
        armDualConfirmTrade();
        return;
      }
      if (data.type === "trade-done") {
        if (!tradeExecuting) executeTrade(true);
        return;
      }
      if (data.type === "trade-fail") {
        tradeExecuting = false;
        setMyConfirmed(false);
        els.tradeConfirmStatus.textContent = "Partner could not complete the trade.";
      }
    });

    connection.on("close", () => {
      if (conn === connection) conn = null;
      const wasKick = kickingPartner;
      kickingPartner = false;
      setStatus(wasKick ? "Partner kicked — waiting…" : "Partner disconnected — waiting…");
      Object.assign(theirOffer, emptyOffer());
      resetTradeLockState();
      clearPartnerPresence();
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
    if (!sessionUser) {
      els.loginRequiredModal.hidden = false;
      els.btnBackpack.hidden = true;
      return;
    }
    setError(els.tradeError, "");
    showScreen("trade");
  });
  els.btnLoginRequiredOk.addEventListener("click", () => {
    els.loginRequiredModal.hidden = true;
    els.btnBackpack.hidden = currentScreen === "inventory";
    showScreen("title");
  });
  els.btnSettings.addEventListener("click", () => {
    setAccountsMsg("");
    renderAccountUi();
    showScreen("settings");
  });
  els.btnPlayBack.addEventListener("click", () => showScreen("title"));
  els.btnSettingsBack.addEventListener("click", () => showScreen("title"));
  els.btnAccounts.addEventListener("click", () => {
    setAccountsMsg("");
    renderAccountUi();
    showScreen("accounts");
  });
  els.btnAccountsBack.addEventListener("click", () => showScreen("settings"));
  els.btnAccountRegister.addEventListener("click", () => openAccountForm("register"));
  els.btnAccountLogin.addEventListener("click", () => openAccountForm("login"));
  els.btnAccountLogout.addEventListener("click", logoutAccount);
  els.btnAccountFormBack.addEventListener("click", () => showScreen("accounts"));
  els.btnAccountSubmit.addEventListener("click", () => {
    if (accountFormMode === "register") registerAccount();
    else loginAccount();
  });
  els.accountPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") els.btnAccountSubmit.click();
  });
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
    const back =
      inventoryMode === "trade"
        ? "room"
        : inventoryMode === "sell"
          ? "sellStop"
          : inventoryReturnScreen || "title";
    inventoryMode = "browse";
    pendingSellSlot = null;
    showScreen(back);
  });
  els.btnBackpack.addEventListener("click", () => openInventory("browse"));
  els.btnBuyCommonPack.addEventListener("click", () => buyPack("common-pack"));
  els.btnRevealDone.addEventListener("click", hidePackReveal);

  els.btnAdminGateCancel.addEventListener("click", closeAdminGate);
  els.btnAdminGateEnter.addEventListener("click", tryAdminLogin);
  els.adminPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryAdminLogin();
  });
  els.btnAdminClose.addEventListener("click", closeAdminSettings);
  els.adminInfiniteStock.addEventListener("change", () => {
    shop.infiniteStock = els.adminInfiniteStock.checked;
    saveShop();
    renderShopStock();
  });
  els.adminUnkickable.addEventListener("change", () => {
    shop.unkickable = els.adminUnkickable.checked;
    saveShop();
    if (conn) sendPayload(currentOfferPayload("offer"));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Alt" || e.repeat) return;
    if (!els.adminGate.hidden || !els.adminSettings.hidden) return;
    if (!els.qtyModal.hidden || !els.packReveal.hidden || !els.cardSellModal.hidden) return;
    e.preventDefault();
    openAdminGate();
  });

  els.btnTradeBack.addEventListener("click", () => {
    destroySession();
    showScreen("title");
  });

  document.querySelectorAll(".inv-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      if (inventoryMode === "trade" || inventoryMode === "sell") return;
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
    if (!cardBtn) return;
    const cardId = cardBtn.getAttribute("data-pick-card");
    if (inventoryMode === "trade") {
      if (myConfirmed) return;
      openQtyModal(cardId);
      return;
    }
    if (inventoryMode === "sell" && pendingSellSlot !== null) {
      assignSellSlot(pendingSellSlot, cardId);
    }
  });

  els.inventoryList.addEventListener("contextmenu", (e) => {
    const cardBtn = e.target.closest("[data-pick-card]");
    if (!cardBtn) return;
    if (inventoryMode !== "browse") return;
    e.preventDefault();
    openCardSellModal(cardBtn.getAttribute("data-pick-card"));
  });

  els.cardSellQty.addEventListener("input", updateCardSellTotal);
  els.btnSellKeepOne.addEventListener("click", setSellKeepOne);
  els.btnCardSellCancel.addEventListener("click", closeCardSellModal);
  els.btnCardSellConfirm.addEventListener("click", confirmCardSell);

  els.myTradeItems.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-trade]");
    if (!btn || myConfirmed) return;
    removeTradeCard(btn.getAttribute("data-remove-trade"));
  });
  els.btnAddTradeCard.addEventListener("click", () => {
    if (myConfirmed) return;
    if (myOffer.cards.length >= MAX_TRADE_CARD_TYPES) {
      els.tradeConfirmStatus.textContent = "You can only add 4 different card types.";
      return;
    }
    openInventory("trade");
  });
  els.myTradeCash.addEventListener("input", syncMyTradeCashFromInput);
  els.myTradeCash.addEventListener("change", syncMyTradeCashFromInput);
  els.btnTradeConfirm.addEventListener("click", toggleTradeConfirm);
  els.btnKick.addEventListener("click", kickPartner);
  els.btnClearOffer.addEventListener("click", clearMyOffer);
  els.sellSlot0.addEventListener("click", () => openInventory("sell", 0));
  els.sellSlot1.addEventListener("click", () => openInventory("sell", 1));
  els.btnClearSell0.addEventListener("click", (e) => {
    e.stopPropagation();
    clearSellSlot(0);
  });
  els.btnClearSell1.addEventListener("click", (e) => {
    e.stopPropagation();
    clearSellSlot(1);
  });
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

  renderAccountUi();
  renderPlayerUi();
  startSellTicker();
  startShopUiTimer();
})();
