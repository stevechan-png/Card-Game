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
  const RARE_STOCK_MIN = 2;
  const RARE_STOCK_MAX = 5;
  const RARE_MISS_CHANCE = 0.1;
  const ADMIN_PASSWORD = "Stevevava";
  const TRADE_CONFIRM_MS = 2000;

  const PACKS = {
    "common-pack": {
      id: "common-pack",
      name: "Common Pack",
      price: 100,
      pool: "common",
      stockKey: "stock",
      canOpen: true,
    },
    "rare-pack": {
      id: "rare-pack",
      name: "Rare Pack",
      price: 500,
      pool: "rare",
      stockKey: "rareStock",
      canOpen: true,
    },
  };

  const ITEMS = {
    "index-token": {
      id: "index-token",
      name: "Index Token",
      note: "Earned from first-time Index finds.",
    },
    "restock-token": {
      id: "restock-token",
      name: "Restock Token",
      note: "Tap to force a shop restock.",
      usable: true,
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
      moves: [
        { id: "egg-pelt", name: "Egg Pelt", damage: 2 },
        { id: "feather-storm", name: "Feather Storm", damage: 4 },
      ],
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
      moves: [
        { id: "stomp", name: "Stomp", damage: 4 },
        { id: "solo-stampede", name: "Solo Stampede", damage: 7 },
      ],
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
      moves: [
        { id: "mud-slap", name: "Mud Slap", damage: 5 },
        { id: "mudstomp", name: "Mudstomp", damage: 10 },
      ],
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
      moves: [
        { id: "fish-swim", name: "Fish Swim", damage: 8 },
        { id: "water-splash", name: "Water Splash", damage: 11 },
      ],
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
      moves: [
        { id: "water-splash", name: "Water Splash", damage: 11 },
        { id: "ink-blast", name: "Ink Blast", damage: 14 },
      ],
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
      moves: [
        { id: "thrash", name: "Thrash", damage: 13 },
        { id: "banana-toss", name: "Banana Toss", damage: 17 },
      ],
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
      moves: [
        { id: "bite", name: "Bite", damage: 15 },
        { id: "leader-of-the-savanna", name: "Leader of the Savanna", damage: 20 },
      ],
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
      moves: [
        { id: "bite", name: "Bite", damage: 15 },
        { id: "leader-of-the-forest", name: "Leader of the Forest", damage: 20 },
      ],
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
      moves: [
        { id: "bite", name: "Bite", damage: 15 },
        { id: "stalker-of-the-shadow", name: "Stalker of the Shadow", damage: 15 },
      ],
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
      altOneIn: 2,
      moves: [
        { id: "water-wave", name: "Water Wave", damage: 18 },
        { id: "shark-chomp", name: "Shark Chomp", damage: 23 },
      ],
    },
    triceratops: {
      id: "triceratops",
      name: "Triceratops",
      value: 50,
      oneIn: 40,
      cps: 12,
      theme: "triceratops",
      blurb: "Horned relic",
      model: "./assets/triceratops-emoji.png",
      moves: [
        { id: "stampede", name: "Stampede", damage: 20 },
        { id: "triple-horn-mash", name: "Triple Horn Mash", damage: 27 },
      ],
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
      moves: [
        { id: "chomp", name: "Chomp", damage: 25 },
        { id: "leader-of-ancient-creatures", name: "Leader of Ancient Creatures", damage: 40 },
      ],
    },
    skeleton: {
      id: "skeleton",
      name: "Skeleton",
      value: 45,
      oneIn: 4,
      cps: 11,
      theme: "skeleton",
      blurb: "Rattling bones",
      emoji: "💀",
      moves: [
        { id: "bone-swipe", name: "Bone Swipe", damage: 20 },
        { id: "bone-bash", name: "Bone Bash", damage: 23 },
      ],
    },
    zombie: {
      id: "zombie",
      name: "Zombie",
      value: 50,
      oneIn: 7,
      cps: 12,
      theme: "zombie",
      blurb: "Still walking",
      emoji: "🧟",
      moves: [
        { id: "undead-assault", name: "Undead Assault", damage: 22 },
        { id: "undead-ending", name: "Undead Ending", damage: 26 },
      ],
    },
    spirit: {
      id: "spirit",
      name: "Spirit",
      value: 60,
      oneIn: 10,
      cps: 14,
      theme: "spirit",
      blurb: "A whisper of light",
      emoji: "👻",
      moves: [
        { id: "silent-stalking", name: "Silent Stalking", damage: 24 },
        { id: "jumpscare", name: "Jumpscare", damage: 30 },
      ],
    },
    "spiritual-horse-rider": {
      id: "spiritual-horse-rider",
      name: "Spiritual Horse Rider",
      value: 65,
      oneIn: 15,
      cps: 15,
      theme: "spiritual-horse-rider",
      blurb: "Moonlit charge",
      model: "./assets/spiritual-horseman-model.png",
      modelKnockout: true,
      moves: [
        { id: "spiritual-trampling", name: "Spiritual Trampling", damage: 27 },
        { id: "spiritual-neigh", name: "Spiritual Neigh", damage: 32 },
      ],
    },
    ghoul: {
      id: "ghoul",
      name: "Ghoul",
      value: 75,
      oneIn: 20,
      cps: 17,
      theme: "ghoul",
      blurb: "Hunger in the dark",
      model: "./assets/ghoul-model.png",
      modelKnockout: true,
      moves: [
        { id: "under-attackers", name: "Under Attackers", damage: 29 },
        { id: "infected-bite", name: "Infected Bite", damage: 33 },
      ],
    },
    "ghost-fox": {
      id: "ghost-fox",
      name: "Ghost Fox",
      value: 90,
      oneIn: 25,
      cps: 19,
      theme: "ghost-fox",
      blurb: "Pale tails in mist",
      model: "./assets/ghost-fox-model.png",
      modelKnockout: true,
      moves: [
        { id: "lost-medic", name: "Lost Medic", damage: 10, heal: 10 },
        { id: "spirit-attack", name: "Spirit Attack", damage: 32 },
      ],
    },
    demon: {
      id: "demon",
      name: "Demon",
      value: 110,
      oneIn: 30,
      cps: 22,
      theme: "demon",
      blurb: "Horned bargain",
      emoji: "😈",
      moves: [
        { id: "undaring-stare", name: "Undaring Stare", damage: 30 },
        { id: "underworld-hell", name: "Underworld Hell", damage: 35 },
      ],
    },
    dragon: {
      id: "dragon",
      name: "Dragon",
      value: 145,
      oneIn: 45,
      cps: 26,
      theme: "dragon",
      blurb: "Hoard and flame",
      emoji: "🐉",
      moves: [
        { id: "power-charge", name: "Power Charge", damage: 31 },
        { id: "dark-dragon-fire", name: "Dark Dragon Fire", damage: 37 },
      ],
    },
    kitsune: {
      id: "kitsune",
      name: "Kitsune",
      value: 185,
      oneIn: 60,
      cps: 30,
      theme: "kitsune",
      blurb: "Nine-tailed omen",
      model: "./assets/kitsune-model.png",
      modelKnockout: true,
      moves: [
        { id: "fiery-pounce", name: "Fiery Pounce", damage: 33 },
        { id: "triple-flareburst", name: "Triple Flareburst", damage: 35 },
        { id: "nine-tailed-omen", name: "Nine Tailed Omen", damage: 20, heal: 20 },
      ],
    },
    "grim-reaper": {
      id: "grim-reaper",
      name: "Grim Reaper",
      value: 250,
      oneIn: 80,
      cps: 35,
      theme: "grim-reaper",
      blurb: "The last collector",
      model: "./assets/grim-reaper-model.png",
      modelKnockout: true,
      moves: [
        { id: "scythe-slash", name: "Scythe Slash", damage: 35 },
        { id: "hell-fire-chaos", name: "Hell Fire Chaos", damage: 39 },
        { id: "force-of-death", name: "Force of Death", damage: 43 },
      ],
    },
  };

  const SECOND_MOVE_MISS_CHANCE = 0.1;
  const HEAL_MOVE_TURN_GAP = 2;
  const JUMPSCARE_DAMAGE_KEEP = 0.7;

  function prepareBattleMove(move, index) {
    const slot = index + 1;
    const damage = Number(move.damage) || 0;
    const heal = Number(move.heal) || 0;
    const isHeal = heal > 0;
    const isHybrid = isHeal && damage > 0;
    const isJumpscare = move.id === "jumpscare";
    const isSecond = slot === 2 && !isHeal && !isJumpscare;
    const isThird = slot === 3 && !isHeal && !isJumpscare;
    move.slot = slot;
    move.damage = damage;
    move.heal = heal;
    move.isHeal = isHeal;
    move.isHybrid = isHybrid;
    move.isJumpscare = isJumpscare;
    move.goesBeforeHeal = isJumpscare;
    move.cooldownTurns = isHeal && !isJumpscare ? HEAL_MOVE_TURN_GAP : 0;
    move.missChance = isSecond ? SECOND_MOVE_MISS_CHANCE : 0;
    move.alwaysFirst = isJumpscare || isHeal || slot === 1;
    move.alwaysLast = isThird;
    return move;
  }

  function healMoveReady(move, lastUsedTurn, currentTurn) {
    if (!move || !move.isHeal) return true;
    if (lastUsedTurn == null || lastUsedTurn < 0) return true;
    return currentTurn >= lastUsedTurn + move.cooldownTurns;
  }

  function jumpscareReady() {
    return true;
  }

  function jumpscareDamage(move, timesAlreadyUsed) {
    const uses = Math.max(0, Number(timesAlreadyUsed) || 0);
    const scaled = Math.round(move.damage * JUMPSCARE_DAMAGE_KEEP ** uses);
    return Math.max(1, scaled);
  }

  function orderDamageStrikes(a, b, rng) {
    if (a.move.isHybrid || b.move.isHybrid) {
      if (a.amount !== b.amount) {
        return a.amount < b.amount ? [a, b] : [b, a];
      }
      return rng() < 0.5 ? [a, b] : [b, a];
    }
    if (a.move.slot !== b.move.slot) {
      return a.move.slot < b.move.slot ? [a, b] : [b, a];
    }
    return rng() < 0.5 ? [a, b] : [b, a];
  }

  function strikeAction(strike, rng) {
    const missed = strike.move.missChance > 0 && rng() < strike.move.missChance;
    return {
      sideId: strike.sideId,
      type: "damage",
      amount: missed ? 0 : strike.amount,
      moveId: strike.moveId,
      missed,
    };
  }

  function resolveBattleTurn(left, right, rng = Math.random) {
    const actions = [];
    const jumpscares = [];
    const heals = [];
    const strikes = [];

    function consider(side) {
      if (!side || !side.move) return;
      const move = side.move;
      const mult = side.statMult || 1;
      if (move.isJumpscare) {
        const amount = Math.max(1, Math.round(jumpscareDamage(move, side.jumpscareUses) * mult));
        if (amount > 0) {
          jumpscares.push({
            sideId: side.id,
            type: "damage",
            amount,
            moveId: move.id,
            move,
          });
        }
        return;
      }
      if (move.heal > 0) {
        heals.push({
          sideId: side.id,
          type: "heal",
          amount: move.heal,
          moveId: move.id,
        });
      }
      if (move.damage > 0) {
        strikes.push({
          sideId: side.id,
          type: "damage",
          amount: Math.max(0, Math.round(move.damage * mult)),
          moveId: move.id,
          move,
        });
      }
    }

    consider(left);
    consider(right);
    if (jumpscares.length === 2 && rng() < 0.5) jumpscares.reverse();
    for (const scare of jumpscares) actions.push(strikeAction(scare, rng));
    if (heals.length === 2 && rng() < 0.5) heals.reverse();
    actions.push(...heals);
    if (strikes.length === 2) {
      const ordered = orderDamageStrikes(strikes[0], strikes[1], rng);
      actions.push(strikeAction(ordered[0], rng), strikeAction(ordered[1], rng));
    } else if (strikes.length === 1) {
      actions.push(strikeAction(strikes[0], rng));
    }
    return actions;
  }

  for (const card of Object.values(CARDS)) {
    card.hp = card.value;
    if (!Array.isArray(card.moves)) card.moves = [];
    card.moves.forEach((move, i) => prepareBattleMove(move, i));
  }

  const COMMON_POOL = [
    CARDS.chicken,
    CARDS.cow,
    CARDS.pig,
    CARDS.salmon,
    CARDS.squid,
    CARDS.monkey,
    CARDS.lion,
    CARDS.tiger,
    CARDS.leopard,
    CARDS.shark,
    CARDS.triceratops,
    CARDS.trex,
  ];

  const RARE_POOL = [
    { id: "shark", oneIn: 2 },
    { id: "skeleton", oneIn: 4 },
    { id: "zombie", oneIn: 7 },
    { id: "spirit", oneIn: 10 },
    { id: "spiritual-horse-rider", oneIn: 15 },
    { id: "ghoul", oneIn: 20 },
    { id: "ghost-fox", oneIn: 25 },
    { id: "demon", oneIn: 30 },
    { id: "dragon", oneIn: 45 },
    { id: "kitsune", oneIn: 60 },
    { id: "grim-reaper", oneIn: 80 },
  ];

  const COMMON_CARD_IDS = new Set(COMMON_POOL.map((c) => c.id));
  const RARE_CARD_IDS = new Set(RARE_POOL.map((c) => c.id));
  const AUTO_SELL_ORDER = [
    ...COMMON_POOL.map((c) => c.id),
    ...RARE_POOL.map((entry) => entry.id).filter((id) => id !== "shark"),
  ];

  const MERGE_COST = 3;
  const MUTATION_ORDER = ["none", "shiny", "silver", "gold", "diamond"];
  const DEFAULT_MUTATION_ODDS = {
    none: 40,
    shiny: 25,
    silver: 20,
    gold: 10,
    diamond: 5,
  };
  const MUTATION_SPECS = {
    shiny: { id: "shiny", label: "Shiny", prefix: "Shiny", hpMult: 1.2, dmgMult: 1.2, className: "mutation-shiny" },
    silver: { id: "silver", label: "Silver", prefix: "Silver", hpMult: 1.3, dmgMult: 1.3, className: "mutation-silver" },
    gold: { id: "gold", label: "Gold", prefix: "Gold", hpMult: 1.4, dmgMult: 1.4, className: "mutation-gold" },
    diamond: { id: "diamond", label: "Diamond", prefix: "Diamond", hpMult: 1.6, dmgMult: 1.6, className: "mutation-diamond" },
  };
  const MUTATION_RANK = { "": 0, shiny: 1, silver: 2, gold: 3, diamond: 4 };

  function parseCardKey(key) {
    if (!key || typeof key !== "string") return { baseId: "", mutation: "" };
    const at = key.indexOf("@");
    if (at < 0) return { baseId: key, mutation: "" };
    const baseId = key.slice(0, at);
    const mutation = key.slice(at + 1);
    if (MUTATION_SPECS[mutation]) return { baseId, mutation };
    return { baseId: key, mutation: "" };
  }

  function cardKey(baseId, mutation) {
    return mutation ? `${baseId}@${mutation}` : baseId;
  }

  function baseCard(key) {
    const parsed = parseCardKey(key);
    return parsed.baseId ? CARDS[parsed.baseId] || null : null;
  }

  function mutationSpec(key) {
    const mutation = parseCardKey(key).mutation;
    return mutation ? MUTATION_SPECS[mutation] : null;
  }

  function cardStatMult(key) {
    const spec = mutationSpec(key);
    return spec ? spec.hpMult : 1;
  }

  function cardValueForKey(key) {
    const card = baseCard(key);
    if (!card) return 0;
    return Math.max(1, Math.round(card.value * cardStatMult(key)));
  }

  function cardDisplayName(key) {
    const card = baseCard(key);
    if (!card) return String(key || "");
    const spec = mutationSpec(key);
    return spec ? `${spec.prefix} ${card.name}` : card.name;
  }

  function mutationRank(key) {
    return MUTATION_RANK[parseCardKey(key).mutation] || 0;
  }

  function sortCardEntries(entries) {
    return entries.slice().sort((a, b) => {
      const pa = parseCardKey(a[0]);
      const pb = parseCardKey(b[0]);
      const ia = AUTO_SELL_ORDER.indexOf(pa.baseId);
      const ib = AUTO_SELL_ORDER.indexOf(pb.baseId);
      if (ia !== ib) return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
      return mutationRank(a[0]) - mutationRank(b[0]);
    });
  }

  function sanitizeMutationOdds(raw) {
    const next = {};
    let sum = 0;
    for (const key of MUTATION_ORDER) {
      const n = Number(raw && raw[key]);
      next[key] = Number.isFinite(n) && n >= 0 ? n : DEFAULT_MUTATION_ODDS[key];
      sum += next[key];
    }
    return sum > 0 ? next : { ...DEFAULT_MUTATION_ODDS };
  }

  function rollMutation(rng = Math.random) {
    const odds = sanitizeMutationOdds(shop.mutationOdds);
    const total = MUTATION_ORDER.reduce((sum, key) => sum + odds[key], 0);
    let r = rng() * total;
    for (const key of MUTATION_ORDER) {
      r -= odds[key];
      if (r <= 0) return key === "none" ? "" : key;
    }
    return "";
  }

  const QUEST_SLOT_COUNT = 3;
  const QUEST_PLAY_TARGET_SEC = 30 * 60;
  const QUEST_COOLDOWN_MS = 30 * 60 * 1000;
  const QUEST_TYPES = [
    "play-30",
    "earn-10000",
    "earn-30000",
    "open-20",
    "open-common-30",
    "open-rare-10",
    "obtain",
  ];
  const QUEST_DEFS = {
    "play-30": { type: "play-30", target: QUEST_PLAY_TARGET_SEC, title: "Play for 30 minutes" },
    "earn-10000": { type: "earn-10000", target: 10000, title: "Earn 10,000 coins" },
    "earn-30000": { type: "earn-30000", target: 30000, title: "Earn 30,000 coins" },
    "open-20": { type: "open-20", target: 20, title: "Open 20 packs" },
    "open-common-30": { type: "open-common-30", target: 30, title: "Open 30 Common Packs" },
    "open-rare-10": { type: "open-rare-10", target: 10, title: "Open 10 Rare Packs" },
    obtain: { type: "obtain", target: 1, title: "Obtain a card" },
  };

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
      const knockout = card.modelKnockout ? " card-model-knockout" : "";
      return `<img class="card-model${knockout}" src="${src}" alt="${escapeHtml(card.name)}" draggable="false" decoding="async" />`;
    }
    if (card.emoji) {
      return `<span class="card-emoji" role="img" aria-label="${escapeHtml(card.name)}">${card.emoji}</span>`;
    }
    return `<span class="card-emoji card-emoji-empty" aria-hidden="true"></span>`;
  }

  const screens = {
    title: document.getElementById("screen-title"),
    play: document.getElementById("screen-play"),
    cardShop: document.getElementById("screen-card-shop"),
    sellStop: document.getElementById("screen-sell-stop"),
    battles: document.getElementById("screen-battles"),
    npcBattles: document.getElementById("screen-npc-battles"),
    battle: document.getElementById("screen-battle"),
    inventory: document.getElementById("screen-inventory"),
    index: document.getElementById("screen-index"),
    quests: document.getElementById("screen-quests"),
    crafting: document.getElementById("screen-crafting"),
    settings: document.getElementById("screen-settings"),
    autoSell: document.getElementById("screen-auto-sell"),
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
    settingBackpackCounter: document.getElementById("setting-backpack-counter"),
    titleAccountChip: document.getElementById("title-account-chip"),
    btnPlayBack: document.getElementById("btn-play-back"),
    btnSettingsBack: document.getElementById("btn-settings-back"),
    btnAutoSell: document.getElementById("btn-auto-sell"),
    btnAutoSellBack: document.getElementById("btn-auto-sell-back"),
    autoSellList: document.getElementById("auto-sell-list"),
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
    btnNpcBattles: document.getElementById("btn-npc-battles"),
    btnNpcBattlesBack: document.getElementById("btn-npc-battles-back"),
    npcFighterList: document.getElementById("npc-fighter-list"),
    npcBattlesMsg: document.getElementById("npc-battles-msg"),
    btnBattleFlee: document.getElementById("btn-battle-flee"),
    battleFoe: document.getElementById("battle-foe"),
    battleFoeMeta: document.getElementById("battle-foe-meta"),
    battleLog: document.getElementById("battle-log"),
    battleYouCard: document.getElementById("battle-you-card"),
    battleMoves: document.getElementById("battle-moves"),
    btnBattleCards: document.getElementById("btn-battle-cards"),
    battleParty: document.getElementById("battle-party"),
    battlePartyList: document.getElementById("battle-party-list"),
    btnBattlePartyClose: document.getElementById("btn-battle-party-close"),
    btnInventoryBack: document.getElementById("btn-inventory-back"),
    gameNav: document.getElementById("game-nav"),
    btnBackpack: document.getElementById("btn-backpack"),
    btnIndex: document.getElementById("btn-index"),
    btnIndexBack: document.getElementById("btn-index-back"),
    btnIndexClaim: document.getElementById("btn-index-claim"),
    indexGrid: document.getElementById("index-grid"),
    indexCopy: document.getElementById("index-copy"),
    indexClaimHint: document.getElementById("index-claim-hint"),
    indexCount: document.getElementById("index-count"),
    btnQuests: document.getElementById("btn-quests"),
    btnQuestsBack: document.getElementById("btn-quests-back"),
    btnCrafting: document.getElementById("btn-crafting"),
    btnCraftingBack: document.getElementById("btn-crafting-back"),
    craftingMain: document.getElementById("crafting-main"),
    craftResult: document.getElementById("craft-result"),
    craftResultCopy: document.getElementById("craft-result-copy"),
    craftResultCard: document.getElementById("craft-result-card"),
    btnCraftResultDone: document.getElementById("btn-craft-result-done"),
    questsCount: document.getElementById("quests-count"),
    questsHeading: document.getElementById("quests-heading"),
    questsCopy: document.getElementById("quests-copy"),
    questsList: document.getElementById("quests-list"),
    questsEventEmpty: document.getElementById("quests-event-empty"),
    btnBuyCommonPack: document.getElementById("btn-buy-common-pack"),
    btnBuyRarePack: document.getElementById("btn-buy-rare-pack"),
    shopCoins: document.getElementById("shop-coins"),
    packStockLabel: document.getElementById("pack-stock-label"),
    rarePackStockLabel: document.getElementById("rare-pack-stock-label"),
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
    revealCopy: document.getElementById("reveal-copy"),
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
    adminInstantQuests: document.getElementById("admin-instant-quests"),
    adminNoQuestCooldown: document.getElementById("admin-no-quest-cooldown"),
    adminOddsNone: document.getElementById("admin-odds-none"),
    adminOddsShiny: document.getElementById("admin-odds-shiny"),
    adminOddsSilver: document.getElementById("admin-odds-silver"),
    adminOddsGold: document.getElementById("admin-odds-gold"),
    adminOddsDiamond: document.getElementById("admin-odds-diamond"),
    btnAdminClose: document.getElementById("btn-admin-close"),
    restockTokenModal: document.getElementById("restock-token-modal"),
    btnRestockTokenNo: document.getElementById("btn-restock-token-no"),
    btnRestockTokenYes: document.getElementById("btn-restock-token-yes"),
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
  let indexReturnScreen = "title";
  let questsReturnScreen = "title";
  let craftReturnScreen = "title";
  let inventoryTab = "packs";
  let questTab = "daily";
  let craftTab = "bench";
  let mergerPickKey = null;
  let questPlaySaveAcc = 0;
  let questClaimFlash = "";
  let questClaimFlashUntil = 0;
  let inventoryMode = "browse"; // browse | trade | sell | battle
  let pendingSellSlot = null;
  let sellTickTimer = null;
  let shopUiTimer = null;
  let battle = null;
  let pendingBattleNpc = null;
  let pendingBattleTeam = [];
  let battleAnimGen = 0;

  const PLAYER_TEAM_SIZE = 3;
  const BATTLE_LOG_FADE_MS = 220;
  const BATTLE_LOG_HOLD_MS = 800;

  const NPC_FIGHTERS = {
    beginner: {
      id: "beginner",
      name: "Beginner Fighter",
      team: ["chicken", "chicken", "chicken"],
    },
    animal: {
      id: "animal",
      name: "Animal Fighter",
      team: ["chicken", "cow", "pig"],
    },
    animal2: {
      id: "animal2",
      name: "Animal Fighter 2",
      team: ["pig", "salmon", "squid"],
    },
    ocean: {
      id: "ocean",
      name: "Ocean Fighter",
      team: ["salmon", "squid", "squid"],
    },
    monkeyTamer: {
      id: "monkeyTamer",
      name: "Monkey Tamer",
      team: ["monkey", "monkey", "monkey"],
    },
    wildAnimal: {
      id: "wildAnimal",
      name: "Wild Animal Fighter",
      team: ["tiger", "lion", "leopard"],
    },
    beastTrainer: {
      id: "beastTrainer",
      name: "Beast Trainer",
      team: ["shark", "triceratops", "trex"],
    },
    prehistoric: {
      id: "prehistoric",
      name: "Prehistoric Fighter",
      team: ["triceratops", "trex", "trex"],
    },
    undead1: {
      id: "undead1",
      name: "Undead Trainer I",
      team: ["skeleton", "zombie", "spirit"],
    },
    undead2: {
      id: "undead2",
      name: "Undead Trainer II",
      team: ["zombie", "skeleton", "skeleton", "spirit", "spirit", "spirit"],
      danger: true,
    },
    spiritTrainer: {
      id: "spiritTrainer",
      name: "Spirit Trainer",
      team: ["spiritual-horse-rider", "ghoul", "ghost-fox"],
    },
    hellFighter: {
      id: "hellFighter",
      name: "Hell Fighter",
      team: ["demon", "demon", "demon"],
    },
    legendTrainer: {
      id: "legendTrainer",
      name: "Legend Trainer",
      team: ["dragon", "dragon", "kitsune"],
    },
    kitsuneTrainer: {
      id: "kitsuneTrainer",
      name: "Kitsune Trainer",
      team: ["kitsune", "kitsune", "kitsune"],
    },
    hellForces: {
      id: "hellForces",
      name: "Hell Forces",
      team: ["demon", "grim-reaper", "grim-reaper"],
    },
    demonBoss: {
      id: "demonBoss",
      name: "Demon Boss",
      team: ["demon", "demon", "grim-reaper", "demon", "grim-reaper", "demon"],
      danger: true,
      serif: true,
    },
  };

  function randomStockAmount() {
    return STOCK_MIN + Math.floor(Math.random() * (STOCK_MAX - STOCK_MIN + 1));
  }

  function randomRareStockAmount() {
    if (Math.random() < RARE_MISS_CHANCE) return 0;
    return RARE_STOCK_MIN + Math.floor(Math.random() * (RARE_STOCK_MAX - RARE_STOCK_MIN + 1));
  }

  function freshShopState() {
    return {
      stock: randomStockAmount(),
      rareStock: randomRareStockAmount(),
      nextRestockAt: Date.now() + RESTOCK_MS,
      infiniteStock: false,
      unkickable: false,
      instantQuests: false,
      noQuestCooldown: false,
      mutationOdds: { ...DEFAULT_MUTATION_ODDS },
    };
  }

  function loadShop() {
    try {
      const raw = localStorage.getItem(SHOP_STORAGE_KEY);
      if (!raw) return freshShopState();
      const data = JSON.parse(raw);
      return {
        stock: Math.max(0, Math.floor(Number(data.stock) || 0)),
        rareStock:
          data.rareStock == null
            ? randomRareStockAmount()
            : Math.max(0, Math.floor(Number(data.rareStock) || 0)),
        nextRestockAt: Number(data.nextRestockAt) || Date.now() + RESTOCK_MS,
        infiniteStock: Boolean(data.infiniteStock),
        unkickable: Boolean(data.unkickable),
        instantQuests: Boolean(data.instantQuests),
        noQuestCooldown: Boolean(data.noQuestCooldown),
        mutationOdds: sanitizeMutationOdds(data.mutationOdds),
      };
    } catch (_) {
      return freshShopState();
    }
  }

  const shop = loadShop();

  function saveShop() {
    localStorage.setItem(
      SHOP_STORAGE_KEY,
      JSON.stringify({
        stock: shop.stock,
        rareStock: shop.rareStock,
        nextRestockAt: shop.nextRestockAt,
        infiniteStock: shop.infiniteStock,
        unkickable: shop.unkickable,
        instantQuests: shop.instantQuests,
        noQuestCooldown: shop.noQuestCooldown,
        mutationOdds: sanitizeMutationOdds(shop.mutationOdds),
      })
    );
  }

  saveShop();

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
    shop.rareStock = randomRareStockAmount();
    saveShop();
  }

  function forceShopRestock() {
    shop.stock = randomStockAmount();
    shop.rareStock =
      RARE_STOCK_MIN + Math.floor(Math.random() * (RARE_STOCK_MAX - RARE_STOCK_MIN + 1));
    shop.nextRestockAt = Date.now() + RESTOCK_MS;
    saveShop();
    renderShopStock();
  }

  function openRestockTokenModal() {
    if (!(player.items["restock-token"] > 0)) return;
    els.restockTokenModal.hidden = false;
    refreshFabs();
  }

  function closeRestockTokenModal() {
    els.restockTokenModal.hidden = true;
    refreshFabs();
  }

  function confirmRestockToken() {
    if (!(player.items["restock-token"] > 0)) {
      closeRestockTokenModal();
      return;
    }
    player.items["restock-token"] -= 1;
    if (player.items["restock-token"] <= 0) delete player.items["restock-token"];
    forceShopRestock();
    savePlayer();
    closeRestockTokenModal();
    renderPlayerUi();
  }

  function closeAdminSettings() {
    readAdminOddsFromInputs();
    els.adminSettings.hidden = true;
    refreshFabs();
    renderShopStock();
  }

  function formatCountdown(ms) {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function packStockCount(pack) {
    return pack.stockKey === "rareStock" ? shop.rareStock : shop.stock;
  }

  function consumePackStock(pack) {
    if (pack.stockKey === "rareStock") shop.rareStock -= 1;
    else shop.stock -= 1;
  }

  function formatStockLabel(count) {
    return count > 0 ? `In stock: ${count}` : "In stock: 0";
  }

  function renderShopStock() {
    applyDueRestocks();
    const remaining = Math.max(0, shop.nextRestockAt - Date.now());
    const common = PACKS["common-pack"];
    const rare = PACKS["rare-pack"];

    if (shop.infiniteStock) {
      els.packStockLabel.textContent = "In stock: ∞";
      els.rarePackStockLabel.textContent = "In stock: ∞";
      els.restockTimer.textContent = "Infinite stock enabled";
      els.btnBuyCommonPack.disabled = player.coins < common.price;
      els.btnBuyRarePack.disabled = player.coins < rare.price;
      return;
    }

    els.packStockLabel.textContent = formatStockLabel(shop.stock);
    els.rarePackStockLabel.textContent = formatStockLabel(shop.rareStock);
    const anyStock = shop.stock > 0 || shop.rareStock > 0;
    els.restockTimer.textContent = anyStock
      ? `Next restock replaces stock in ${formatCountdown(remaining)}`
      : `Sold out · restocks in ${formatCountdown(remaining)}`;
    els.btnBuyCommonPack.disabled = shop.stock <= 0 || player.coins < common.price;
    els.btnBuyRarePack.disabled = shop.rareStock <= 0 || player.coins < rare.price;
  }

  function startShopUiTimer() {
    if (shopUiTimer) return;
    shopUiTimer = setInterval(() => {
      const before = shop.stock;
      const beforeRare = shop.rareStock;
      applyDueRestocks();
      const changed = before !== shop.stock || beforeRare !== shop.rareStock;
      if (currentScreen === "cardShop" || changed) {
        if (currentScreen === "cardShop") renderShopStock();
        else if (changed) saveShop();
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

  function defaultSettings() {
    return { backpackCounter: true };
  }

  function sanitizeSettings(raw) {
    return {
      backpackCounter: !(raw && raw.backpackCounter === false),
    };
  }

  function emptyBags() {
    return {
      packs: {},
      cards: {},
      items: {},
      sellSlots: [null, null],
      autoSell: {},
      indexFound: {},
      indexClaimed: {},
      quests: [],
      questLocks: [],
      settings: defaultSettings(),
    };
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
        else if (baseCard(id)) bags.cards[id] = n;
        else bags.items[id] = n;
      }
    }

    for (const id of Object.keys(bags.cards)) {
      if (!baseCard(id)) delete bags.cards[id];
    }

    if (Array.isArray(data.sellSlots)) {
      bags.sellSlots = [0, 1].map((i) => {
        const id = data.sellSlots[i];
        return typeof id === "string" && baseCard(id) ? id : null;
      });
    }

    const autoSellSrc = data.autoSell && typeof data.autoSell === "object" ? data.autoSell : {};
    for (const [id, on] of Object.entries(autoSellSrc)) {
      if (CARDS[id] && on) bags.autoSell[id] = true;
    }

    const foundSrc = data.indexFound && typeof data.indexFound === "object" ? data.indexFound : {};
    const claimedSrc = data.indexClaimed && typeof data.indexClaimed === "object" ? data.indexClaimed : {};
    for (const id of AUTO_SELL_ORDER) {
      const ownedBase = Object.entries(bags.cards).some(
        ([key, count]) => count > 0 && parseCardKey(key).baseId === id
      );
      const stationed = bags.sellSlots.some((slot) => slot && parseCardKey(slot).baseId === id);
      if (foundSrc[id] || ownedBase || stationed) {
        bags.indexFound[id] = true;
      }
      if (claimedSrc[id] && bags.indexFound[id]) bags.indexClaimed[id] = true;
    }

    bags.quests = sanitizeQuests(data.quests);
    bags.questLocks = sanitizeQuestLocks(data.questLocks);
    fillQuestSlots(bags.quests, bags.questLocks);
    applyInstantQuests(bags.quests);
    bags.settings = sanitizeSettings(data.settings);

    return { coins, ...bags };
  }

  function snapshotPlayer(p = player) {
    return {
      coins: p.coins,
      packs: { ...p.packs },
      cards: { ...p.cards },
      items: { ...p.items },
      sellSlots: [...p.sellSlots],
      autoSell: { ...(p.autoSell || {}) },
      indexFound: { ...(p.indexFound || {}) },
      indexClaimed: { ...(p.indexClaimed || {}) },
      quests: snapshotQuests(p.quests),
      questLocks: [...(p.questLocks || [])],
      settings: sanitizeSettings(p.settings),
    };
  }

  function applyPlayerData(data) {
    const next = normalizePlayerData(data);
    player.coins = next.coins;
    player.packs = next.packs;
    player.cards = next.cards;
    player.items = next.items;
    player.sellSlots = next.sellSlots;
    player.autoSell = next.autoSell;
    player.indexFound = next.indexFound;
    player.indexClaimed = next.indexClaimed;
    player.quests = next.quests;
    player.questLocks = next.questLocks;
    player.settings = next.settings;
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

  function rarityHtml(card) {
    const fromCommon = COMMON_CARD_IDS.has(card.id);
    const fromRare = RARE_CARD_IDS.has(card.id);
    if (fromCommon && fromRare && card.altOneIn) {
      return `<span class="card-rarity"><span class="rarity-common">1/${card.oneIn}</span><span class="rarity-sep">-</span><span class="rarity-rare">1/${card.altOneIn}</span></span>`;
    }
    if (fromRare) {
      return `<span class="card-rarity rarity-rare">1/${card.oneIn}</span>`;
    }
    return `<span class="card-rarity rarity-common">1/${card.oneIn}</span>`;
  }

  function cardFaceHtml(card, opts = {}) {
    const key = opts.cardKey || card.id;
    const spec = mutationSpec(key);
    const qty = opts.qty;
    const showValue = opts.showValue !== false;
    const compact = opts.compact;
    const qtyBadge =
      qty && qty > 0 ? `<span class="card-qty">×${qty}</span>` : "";
    const valueHtml = showValue
      ? `<span class="card-value">$${cardValueForKey(key)}</span>`
      : "";
    const hp =
      opts.hp != null ? opts.hp : Math.max(1, Math.round(card.hp * (spec ? spec.hpMult : 1)));
    const hpHtml = `<span class="card-hp">HP&nbsp;${hp}</span>`;
    const name = spec ? `${spec.prefix} ${card.name}` : card.name;
    const mutClass = spec ? spec.className : "";
    const sparkles =
      spec && (spec.id === "shiny" || spec.id === "gold")
        ? `<div class="card-sparkles" aria-hidden="true"></div>`
        : "";
    const crystal =
      spec && spec.id === "diamond" ? `<div class="card-crystal" aria-hidden="true"></div>` : "";
    return `
      <article class="animal-card theme-${card.theme} ${compact ? "compact" : ""} ${mutClass}" data-card-id="${escapeHtml(key)}">
        <div class="card-texture" aria-hidden="true"></div>
        <div class="card-pattern" aria-hidden="true"></div>
        <div class="card-sheen" aria-hidden="true"></div>
        <div class="card-frame" aria-hidden="true"></div>
        ${sparkles}
        ${crystal}
        <div class="card-top">
          ${rarityHtml(card)}
          <span class="card-top-right">${hpHtml}${valueHtml}</span>
        </div>
        <div class="card-art">
          <div class="card-medallion">${cardArtHtml(card)}</div>
        </div>
        <div class="card-body">
          <h3 class="card-name">${escapeHtml(name)}</h3>
          <p class="card-blurb">${escapeHtml(card.blurb)}</p>
        </div>
        ${qtyBadge}
      </article>
    `;
  }

  function cardFaceForKey(key, opts = {}) {
    const card = baseCard(key);
    if (!card) return "";
    return cardFaceHtml(card, { ...opts, cardKey: key });
  }

  function weightedDraw(pool) {
    const weights = pool.map((c) => 1 / c.oneIn);
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i += 1) {
      r -= weights[i];
      if (r <= 0) return CARDS[pool[i].id] || pool[i];
    }
    const last = pool[pool.length - 1];
    return CARDS[last.id] || last;
  }

  function poolForPack(pack) {
    if (pack.pool === "rare") return RARE_POOL;
    return COMMON_POOL;
  }

  function isAutoSell(cardId) {
    return Boolean(player.autoSell && player.autoSell[cardId]);
  }

  function markIndexFound(cardId) {
    const baseId = parseCardKey(cardId).baseId;
    if (!CARDS[baseId]) return;
    if (!player.indexFound) player.indexFound = {};
    player.indexFound[baseId] = true;
  }

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function newQuestUid() {
    return `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function snapshotQuests(list) {
    return (Array.isArray(list) ? list : []).slice(0, QUEST_SLOT_COUNT).map((q) => ({
      uid: q.uid,
      type: q.type,
      progress: q.progress || 0,
      ...(q.cardId ? { cardId: q.cardId } : {}),
    }));
  }

  function sanitizeQuests(raw) {
    if (!Array.isArray(raw)) return [];
    const seen = new Set();
    const out = [];
    for (const q of raw) {
      if (!q || !QUEST_DEFS[q.type] || seen.has(q.type)) continue;
      if (q.type === "obtain" && !CARDS[q.cardId]) continue;
      seen.add(q.type);
      const def = QUEST_DEFS[q.type];
      out.push({
        uid: typeof q.uid === "string" && q.uid ? q.uid : newQuestUid(),
        type: q.type,
        progress: Math.max(0, Math.min(def.target, Math.floor(Number(q.progress) || 0))),
        ...(q.type === "obtain" ? { cardId: q.cardId } : {}),
      });
      if (out.length >= QUEST_SLOT_COUNT) break;
    }
    return out;
  }

  function sanitizeQuestLocks(raw) {
    if (!Array.isArray(raw)) return [];
    const now = Date.now();
    return raw
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n) && n > now)
      .slice(0, QUEST_SLOT_COUNT);
  }

  function pruneQuestLocks(locks) {
    const now = Date.now();
    const next = (locks || []).filter((n) => Number.isFinite(n) && n > now);
    if (shop.noQuestCooldown) next.length = 0;
    return next;
  }

  function unusedQuestTypes(existing) {
    const used = new Set(existing.map((q) => q.type));
    return QUEST_TYPES.filter((type) => !used.has(type));
  }

  function createQuest(type, existing) {
    const quest = { uid: newQuestUid(), type, progress: 0 };
    if (type === "obtain") {
      const taken = new Set(existing.filter((q) => q.cardId).map((q) => q.cardId));
      const pool = AUTO_SELL_ORDER.filter((id) => !taken.has(id));
      quest.cardId = pickRandom(pool.length ? pool : AUTO_SELL_ORDER);
    }
    return quest;
  }

  function fillQuestSlots(quests, locks = []) {
    const pending = pruneQuestLocks(locks);
    if (locks) {
      locks.length = 0;
      locks.push(...pending);
    }
    while (quests.length + pending.length < QUEST_SLOT_COUNT) {
      const types = unusedQuestTypes(quests);
      if (!types.length) break;
      quests.push(createQuest(pickRandom(types), quests));
    }
    return quests;
  }

  function applyInstantQuests(quests) {
    if (!shop.instantQuests) return;
    for (const quest of quests) {
      quest.progress = questTarget(quest);
    }
  }

  function ensureQuestBoard() {
    if (!Array.isArray(player.quests)) player.quests = [];
    if (!Array.isArray(player.questLocks)) player.questLocks = [];
    player.quests = sanitizeQuests(player.quests);
    player.questLocks = pruneQuestLocks(player.questLocks);
    fillQuestSlots(player.quests, player.questLocks);
    applyInstantQuests(player.quests);
  }

  function questTarget(quest) {
    return QUEST_DEFS[quest.type] ? QUEST_DEFS[quest.type].target : 1;
  }

  function questTitle(quest) {
    if (quest.type === "obtain") {
      const card = CARDS[quest.cardId];
      return card ? `Obtain a ${card.name}` : "Obtain a card";
    }
    return QUEST_DEFS[quest.type] ? QUEST_DEFS[quest.type].title : "Quest";
  }

  function formatQuestClock(totalSec) {
    const sec = Math.max(0, Math.floor(totalSec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function questProgressLabel(quest) {
    const target = questTarget(quest);
    if (quest.type === "play-30") {
      return `${formatQuestClock(quest.progress)} / ${formatQuestClock(target)}`;
    }
    if (quest.type === "earn-10000" || quest.type === "earn-30000") {
      return `${quest.progress.toLocaleString()} / ${target.toLocaleString()}`;
    }
    return `${quest.progress} / ${target}`;
  }

  function obtainQuestIsRare(quest) {
    const card = CARDS[quest && quest.cardId];
    return Boolean(card && card.oneIn >= 30);
  }

  function questReward(quest) {
    if (!quest) return { label: "" };
    if (quest.type === "play-30") return { coins: 20000, label: "20,000 coins" };
    if (quest.type === "earn-10000") return { packs: { "rare-pack": 2 }, label: "2 Rare Packs" };
    if (quest.type === "earn-30000") return { packs: { "rare-pack": 6 }, label: "6 Rare Packs" };
    if (quest.type === "open-20") return { coins: 20000, label: "20,000 coins" };
    if (quest.type === "open-common-30") return { coins: 10000, label: "10,000 coins" };
    if (quest.type === "open-rare-10") {
      return { items: { "restock-token": 1 }, label: "1 Restock Token" };
    }
    if (quest.type === "obtain") {
      const coins = obtainQuestIsRare(quest) ? 20000 : 10000;
      return { coins, label: `${coins.toLocaleString()} coins` };
    }
    return { label: "" };
  }

  function grantQuestReward(quest) {
    const reward = questReward(quest);
    if (reward.coins) addCoins(reward.coins, { countAsEarn: false });
    if (reward.packs) {
      for (const [id, count] of Object.entries(reward.packs)) {
        player.packs[id] = (player.packs[id] || 0) + count;
      }
    }
    if (reward.items) {
      for (const [id, count] of Object.entries(reward.items)) {
        player.items[id] = (player.items[id] || 0) + count;
      }
    }
    return reward;
  }

  function isQuestReady(quest) {
    return Boolean(quest && quest.progress >= questTarget(quest));
  }

  function readyQuestCount() {
    ensureQuestBoard();
    return player.quests.filter(isQuestReady).length;
  }

  function updateQuestBadge() {
    const n = readyQuestCount();
    if (n > 0) {
      els.questsCount.hidden = false;
      els.questsCount.textContent = String(n);
    } else {
      els.questsCount.hidden = true;
    }
  }

  function bumpQuestProgress(quest, amount) {
    if (!quest || isQuestReady(quest)) return false;
    const n = Math.max(0, Math.floor(Number(amount) || 0));
    if (!n) return false;
    const next = Math.min(questTarget(quest), quest.progress + n);
    if (next === quest.progress) return false;
    quest.progress = next;
    return true;
  }

  function progressQuests(update) {
    ensureQuestBoard();
    let changed = false;
    for (const quest of player.quests) {
      if (update.playSec && quest.type === "play-30") {
        changed = bumpQuestProgress(quest, update.playSec) || changed;
      }
      if (
        update.earn &&
        !update.fromQuestReward &&
        (quest.type === "earn-10000" || quest.type === "earn-30000")
      ) {
        changed = bumpQuestProgress(quest, update.earn) || changed;
      }
      if (update.packId) {
        if (quest.type === "open-20") changed = bumpQuestProgress(quest, 1) || changed;
        if (update.packId === "common-pack" && quest.type === "open-common-30") {
          changed = bumpQuestProgress(quest, 1) || changed;
        }
        if (update.packId === "rare-pack" && quest.type === "open-rare-10") {
          changed = bumpQuestProgress(quest, 1) || changed;
        }
      }
      if (update.cardIds && quest.type === "obtain" && update.cardIds.includes(quest.cardId)) {
        changed = bumpQuestProgress(quest, 1) || changed;
      }
    }
    if (changed) {
      updateQuestBadge();
      if (currentScreen === "quests") renderQuests();
    }
    return changed;
  }

  function addCoins(amount, { countAsEarn = true } = {}) {
    const n = Math.max(0, Math.floor(Number(amount) || 0));
    if (!n) return 0;
    player.coins += n;
    if (countAsEarn) progressQuests({ earn: n });
    return n;
  }

  function addEarnedCoins(amount) {
    return addCoins(amount);
  }

  function tickQuestPlay(seconds) {
    tickQuestCooldowns();
    if (document.hidden) return;
    const changed = progressQuests({ playSec: seconds });
    if (!changed) return;
    questPlaySaveAcc += seconds;
    if (questPlaySaveAcc >= 5 || player.quests.some((q) => q.type === "play-30" && isQuestReady(q))) {
      questPlaySaveAcc = 0;
      savePlayer();
    }
  }

  function tickQuestCooldowns() {
    if (!Array.isArray(player.questLocks)) player.questLocks = [];
    if (!Array.isArray(player.quests)) player.quests = [];
    const beforeLocks = player.questLocks.length;
    const beforeQuests = player.quests.length;
    player.questLocks = pruneQuestLocks(player.questLocks);
    fillQuestSlots(player.quests, player.questLocks);
    applyInstantQuests(player.quests);
    const rolled =
      player.questLocks.length !== beforeLocks || player.quests.length !== beforeQuests;
    if (rolled) {
      savePlayer();
      updateQuestBadge();
    }
    if (currentScreen === "quests" && questTab === "daily" && (rolled || player.questLocks.length)) {
      renderQuests();
    }
  }

  function renderQuests() {
    ensureQuestBoard();
    const eventMode = questTab === "event";
    els.questsHeading.textContent = eventMode ? "Event Quests" : "Quests";
    els.questsCopy.textContent = eventMode
      ? "Limited events will show up here."
      : questClaimFlash && Date.now() < questClaimFlashUntil
        ? questClaimFlash
        : shop.noQuestCooldown
          ? "Three active quests. Claim a finished one to roll a new task."
          : "Three active quests. After a claim, a new quest rolls in 30 minutes.";
    els.questsEventEmpty.hidden = !eventMode;
    els.questsList.hidden = eventMode;
    document.querySelectorAll("[data-quest-tab]").forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-quest-tab") === questTab);
    });
    if (eventMode) {
      els.questsList.innerHTML = "";
      updateQuestBadge();
      return;
    }
    const now = Date.now();
    const lockCards = (player.questLocks || [])
      .filter((t) => t > now)
      .map((readyAt) => {
        const remain = formatCountdown(readyAt - now);
        return `
          <article class="quest-card is-cooldown">
            <div class="quest-card-copy">
              <h3 class="quest-title">New quest</h3>
              <span class="quest-reward">Rolling in ${remain}</span>
              <div class="quest-meta">
                <div class="quest-progress-wrap">
                  <span class="quest-progress-text">Cooldown</span>
                  <div class="quest-bar" aria-hidden="true"><span style="width:0%"></span></div>
                </div>
              </div>
            </div>
            <span class="quest-pending">${remain}</span>
          </article>
        `;
      });
    const questCards = player.quests.map((quest) => {
      const ready = isQuestReady(quest);
      const pct = Math.round((quest.progress / questTarget(quest)) * 100);
      const card = quest.type === "obtain" ? CARDS[quest.cardId] : null;
      const thumb = card ? `<span class="quest-thumb">${cardArtHtml(card)}</span>` : "";
      const reward = questReward(quest);
      return `
        <article class="quest-card${ready ? " is-ready" : ""}">
          <div class="quest-card-copy">
            <h3 class="quest-title">${escapeHtml(questTitle(quest))}</h3>
            <span class="quest-reward">Reward: ${escapeHtml(reward.label)}</span>
            <div class="quest-meta">
              ${thumb}
              <div class="quest-progress-wrap">
                <span class="quest-progress-text">${escapeHtml(questProgressLabel(quest))}</span>
                <div class="quest-bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
              </div>
            </div>
          </div>
          ${ready
            ? `<button type="button" class="btn btn-primary" data-claim-quest="${escapeHtml(quest.uid)}">Claim</button>`
            : `<span class="quest-pending">In progress</span>`}
        </article>
      `;
    });
    els.questsList.innerHTML = `${questCards.join("")}${lockCards.join("")}`;
    updateQuestBadge();
  }

  function claimQuest(uid) {
    ensureQuestBoard();
    const index = player.quests.findIndex((q) => q.uid === uid);
    if (index < 0) return;
    const quest = player.quests[index];
    if (!isQuestReady(quest)) return;
    const reward = grantQuestReward(quest);
    player.quests.splice(index, 1);
    if (!shop.noQuestCooldown) {
      player.questLocks.push(Date.now() + QUEST_COOLDOWN_MS);
    }
    fillQuestSlots(player.quests, player.questLocks);
    applyInstantQuests(player.quests);
    questClaimFlash = reward.label ? `Claimed · ${reward.label}` : "Quest claimed.";
    questClaimFlashUntil = Date.now() + 4000;
    savePlayer();
    renderQuests();
    renderPlayerUi();
  }

  function openQuests() {
    questsReturnScreen = currentScreen === "quests" ? questsReturnScreen : currentScreen;
    questTab = "daily";
    showScreen("quests");
    renderQuests();
  }

  function unclaimedIndexCount() {
    if (!player.indexFound) return 0;
    return AUTO_SELL_ORDER.reduce((n, id) => {
      const found = Boolean(player.indexFound[id]);
      const claimed = Boolean(player.indexClaimed && player.indexClaimed[id]);
      return n + (found && !claimed ? 1 : 0);
    }, 0);
  }

  function updateIndexBadge() {
    const n = unclaimedIndexCount();
    if (n > 0) {
      els.indexCount.hidden = false;
      els.indexCount.textContent = String(n);
    } else {
      els.indexCount.hidden = true;
    }
  }

  function isOverlayOpen() {
    return [
      els.adminGate,
      els.adminSettings,
      els.qtyModal,
      els.packReveal,
      els.cardSellModal,
      els.loginRequiredModal,
      els.restockTokenModal,
      els.craftResult,
    ].some((el) => el && !el.hidden);
  }

  function refreshFabs() {
    const overlay = isOverlayOpen();
    const hideNavigation = overlay || currentScreen === "room" || currentScreen === "battle";
    els.gameNav.hidden = hideNavigation;

    const destinations = [
      [els.btnIndex, "index"],
      [els.btnQuests, "quests"],
      [els.btnCrafting, "crafting"],
      [els.btnBackpack, "inventory"],
    ];
    for (const [button, destination] of destinations) {
      const isCurrent = currentScreen === destination;
      button.hidden = false;
      button.disabled = isCurrent;
      button.classList.toggle("is-current", isCurrent);
      if (isCurrent) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  }

  function openPack(packId) {
    const pack = PACKS[packId];
    if (!pack || !player.packs[packId]) return;
    if (!pack.canOpen) return;
    player.packs[packId] -= 1;
    if (player.packs[packId] <= 0) delete player.packs[packId];

    const pool = poolForPack(pack);
    const drawn = [];
    const soldFlags = [];
    let soldValue = 0;
    for (let i = 0; i < CARDS_PER_PACK; i += 1) {
      const card = weightedDraw(pool);
      drawn.push(card);
      markIndexFound(card.id);
      const sell = isAutoSell(card.id);
      soldFlags.push(sell);
      if (sell) {
        soldValue += addEarnedCoins(card.value);
      } else {
        player.cards[card.id] = (player.cards[card.id] || 0) + 1;
      }
    }
    progressQuests({ packId, cardIds: drawn.map((card) => card.id) });
    savePlayer();
    renderPlayerUi();
    showPackReveal(drawn, soldFlags, soldValue);
  }

  function showPackReveal(drawn, soldFlags = [], soldValue = 0) {
    const soldCount = soldFlags.filter(Boolean).length;
    els.revealCopy.textContent =
      soldCount > 0
        ? `You pulled 5 cards. Auto-sold ${soldCount} for $${soldValue}.`
        : "You pulled 5 cards.";
    els.revealGrid.innerHTML = drawn
      .map((card, i) => {
        const sold = Boolean(soldFlags[i]);
        const soldTag = sold
          ? `<span class="reveal-sold">Sold +$${card.value}</span>`
          : "";
        return `<div class="reveal-item${sold ? " is-sold" : ""}" style="animation-delay:${i * 0.08}s">${cardFaceHtml(card, { compact: true })}${soldTag}</div>`;
      })
      .join("");
    els.packReveal.hidden = false;
    refreshFabs();
  }

  function hidePackReveal() {
    els.packReveal.hidden = true;
    els.revealGrid.innerHTML = "";
    refreshFabs();
  }

  function renderAutoSellList() {
    const owned = AUTO_SELL_ORDER.filter((id) => (player.cards[id] || 0) > 0);
    if (!owned.length) {
      els.autoSellList.innerHTML = `<p class="inventory-empty">No cards yet. Open some packs first.</p>`;
      return;
    }
    els.autoSellList.innerHTML = owned
      .map((id) => {
        const card = CARDS[id];
        const selling = isAutoSell(id);
        return `
          <div class="auto-sell-row">
            <span class="auto-sell-name">${escapeHtml(card.name)}</span>
            <button type="button" class="btn btn-sm ${selling ? "btn-auto-sell is-sell" : "btn-secondary btn-auto-sell is-keep"}" data-auto-sell="${id}">
              ${selling ? "Sell" : "Keep"}
            </button>
          </div>
        `;
      })
      .join("");
  }

  function ownedCardCount(cardId) {
    let n = 0;
    for (const [key, count] of Object.entries(player.cards || {})) {
      if (parseCardKey(key).baseId === cardId) n += count || 0;
    }
    if (player.sellSlots) {
      for (const slot of player.sellSlots) {
        if (slot && parseCardKey(slot).baseId === cardId) n += 1;
      }
    }
    return n;
  }

  function renderIndex() {
    const foundCount = AUTO_SELL_ORDER.filter((id) => player.indexFound && player.indexFound[id]).length;
    const ready = unclaimedIndexCount();
    els.indexCopy.textContent = `${foundCount} / ${AUTO_SELL_ORDER.length} collected. First finds grant Index Tokens.`;
    els.indexClaimHint.textContent =
      ready > 0 ? `${ready} new find${ready === 1 ? "" : "s"} ready to claim.` : "No new rewards.";
    els.btnIndexClaim.disabled = ready <= 0;
    els.btnIndexClaim.textContent = ready > 0 ? `Claim ×${ready}` : "Claim";

    els.indexGrid.innerHTML = AUTO_SELL_ORDER.map((id) => {
      const card = CARDS[id];
      const found = Boolean(player.indexFound && player.indexFound[id]);
      if (!found) {
        return `
          <article class="index-slot unknown">
            <span class="index-unknown-mark">?</span>
            <span class="index-unknown-name">Unknown</span>
          </article>
        `;
      }
      const qty = ownedCardCount(id);
      return `<div class="index-slot">${cardFaceHtml(card, { qty, compact: true })}</div>`;
    }).join("");
    updateIndexBadge();
  }

  function claimIndexRewards() {
    const ready = unclaimedIndexCount();
    if (ready <= 0) return;
    if (!player.indexClaimed) player.indexClaimed = {};
    for (const id of AUTO_SELL_ORDER) {
      if (player.indexFound && player.indexFound[id] && !player.indexClaimed[id]) {
        player.indexClaimed[id] = true;
      }
    }
    player.items["index-token"] = (player.items["index-token"] || 0) + ready;
    savePlayer();
    renderIndex();
    renderPlayerUi();
  }

  function openIndex() {
    indexReturnScreen = currentScreen === "index" ? indexReturnScreen : currentScreen;
    showScreen("index");
    renderIndex();
  }

  function renderSettingsToggles() {
    if (!els.settingBackpackCounter) return;
    els.settingBackpackCounter.checked = !(player.settings && player.settings.backpackCounter === false);
  }

  function openCrafting() {
    craftReturnScreen = currentScreen === "crafting" ? craftReturnScreen : currentScreen;
    showScreen("crafting");
    renderCrafting();
  }

  function eligibleMergeEntries() {
    return sortCardEntries(
      Object.entries(player.cards || {}).filter(([key, count]) => baseCard(key) && count >= MERGE_COST)
    );
  }

  function renderCrafting() {
    if (!els.craftingMain) return;
    document.querySelectorAll("[data-craft-tab]").forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-craft-tab") === craftTab);
    });
    if (craftTab === "bench") {
      els.craftingMain.innerHTML = `
        <h2>Crafting bench</h2>
        <p class="panel-copy">Recipes will show up here later.</p>
        <div class="quests-event-empty"><p class="empty-note">Nothing to craft yet.</p></div>
      `;
      return;
    }
    if (mergerPickKey && (player.cards[mergerPickKey] || 0) < MERGE_COST) mergerPickKey = null;
    const picked = mergerPickKey && baseCard(mergerPickKey) ? mergerPickKey : null;
    const slots = [0, 1, 2]
      .map(() =>
        picked
          ? `<div class="merger-slot">${cardFaceForKey(picked, { compact: true, showValue: false })}</div>`
          : `<div class="merger-slot"><span class="merger-slot-empty">Empty</span></div>`
      )
      .join("");
    const eligible = eligibleMergeEntries();
    const grid = eligible.length
      ? `<div class="card-grid">${eligible
          .map(
            ([id, count]) => `
        <button type="button" class="card-pick${id === picked ? " is-merger-picked" : ""}" data-merge-pick="${escapeHtml(id)}">
          ${cardFaceForKey(id, { qty: count })}
        </button>`
          )
          .join("")}</div>`
      : `<p class="inventory-empty">You need 3 of the same card to merge.</p>`;
    els.craftingMain.innerHTML = `
      <h2>Mutation merger</h2>
      <p class="panel-copy merger-copy">Load 3 identical cards. They fuse into one, with a chance of mutation.</p>
      <div class="merger-slots">${slots}</div>
      <div class="merger-actions">
        <button type="button" class="btn btn-primary" id="btn-merge-combine" ${picked ? "" : "disabled"}>Combine</button>
      </div>
      ${grid}
    `;
  }

  function showCraftResult(resultKey, rolled) {
    const spec = rolled ? MUTATION_SPECS[rolled] : null;
    els.craftResultCopy.textContent = spec
      ? `The cards fused into ${cardDisplayName(resultKey)}.`
      : `No mutation. The three cards became one ${cardDisplayName(resultKey)}.`;
    els.craftResultCard.innerHTML = cardFaceForKey(resultKey, { compact: true });
    els.craftResult.hidden = false;
    refreshFabs();
  }

  function hideCraftResult() {
    if (!els.craftResult) return;
    els.craftResult.hidden = true;
    els.craftResultCard.innerHTML = "";
    refreshFabs();
  }

  function combineMutation() {
    const key = mergerPickKey;
    if (!key || (player.cards[key] || 0) < MERGE_COST) return;
    const parsed = parseCardKey(key);
    player.cards[key] -= MERGE_COST;
    if (player.cards[key] <= 0) delete player.cards[key];
    const rolled = rollMutation();
    const resultKey = cardKey(parsed.baseId, rolled);
    player.cards[resultKey] = (player.cards[resultKey] || 0) + 1;
    markIndexFound(parsed.baseId);
    if ((player.cards[key] || 0) < MERGE_COST) mergerPickKey = null;
    savePlayer();
    renderPlayerUi();
    showCraftResult(resultKey, rolled);
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
    const pickMode =
      inventoryMode === "trade" || inventoryMode === "sell" || inventoryMode === "battle";

    if (pickMode) {
      els.inventoryTitle.textContent =
        inventoryMode === "sell"
          ? "Station a card"
          : inventoryMode === "battle"
            ? `Choose fighters (${pendingBattleTeam.length + 1} / ${PLAYER_TEAM_SIZE})`
            : "Select a card";
      els.inventoryCopy.textContent =
        inventoryMode === "sell"
          ? "Pick a card to earn coins every second."
          : inventoryMode === "battle"
            ? pendingBattleTeam.length
              ? `Picked: ${pendingBattleTeam.map((id) => cardDisplayName(id)).join(", ")}. Pick ${
                  PLAYER_TEAM_SIZE - pendingBattleTeam.length
                } more.`
              : "Pick 3 cards for your team."
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
            : inventoryMode === "battle"
              ? "No cards to battle with. Open a pack first."
          : inventoryTab === "packs"
            ? "No packs. Visit the Card shop."
            : inventoryTab === "cards"
              ? "No cards yet. Open a pack!"
              : "No items yet.";
      els.inventoryList.innerHTML = `<p class="inventory-empty">${emptyMsg}</p>`;
      return;
    }

    if (pickMode || inventoryTab === "cards") {
      els.inventoryList.innerHTML = `<div class="card-grid">${sortCardEntries(activeEntries)
        .map(([id, count]) => {
          const card = baseCard(id);
          if (!card) return "";
          const shown =
            inventoryMode === "battle"
              ? count - pendingBattleTeam.filter((picked) => picked === id).length
              : count;
          if (shown <= 0) return "";
          const cpsNote =
            inventoryMode === "sell"
              ? `<div class="card-cps-tag">+${card.cps}/s</div>`
              : "";
          return `<button type="button" class="card-pick" data-pick-card="${escapeHtml(id)}">${cardFaceForKey(id, { qty: shown })}${cpsNote}</button>`;
        })
        .join("")}</div>`;
      return;
    }

    if (inventoryTab === "packs") {
      els.inventoryList.innerHTML = activeEntries
        .map(([id, count]) => {
          const pack = PACKS[id] || { name: id, canOpen: false };
          if (!pack.canOpen) {
            return `
              <div class="inventory-row pack-row sealed">
                <div>
                  <div class="item-name">${escapeHtml(pack.name)}</div>
                  <span class="item-note">Sealed · can't open yet</span>
                </div>
                <div class="item-count">×${count}</div>
              </div>
            `;
          }
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
      .map(([id, count]) => {
        const item = ITEMS[id] || { name: id, note: "" };
        const note = item.note
          ? `<span class="item-note">${escapeHtml(item.note)}</span>`
          : "";
        if (item.usable) {
          return `
      <button type="button" class="inventory-row pack-row" data-use-item="${escapeHtml(id)}">
        <div>
          <div class="item-name">${escapeHtml(item.name)}</div>
          ${note}
        </div>
        <div class="item-count">×${count}</div>
      </button>
    `;
        }
        return `
      <div class="inventory-row">
        <div>
          <div class="item-name">${escapeHtml(item.name)}</div>
          ${note}
        </div>
        <div class="item-count">×${count}</div>
      </div>
    `;
      })
      .join("");
  }

  function totalSellCps() {
    return player.sellSlots.reduce((sum, id) => {
      const card = id ? baseCard(id) : null;
      return sum + (card ? card.cps : 0);
    }, 0);
  }

  function renderSellSlot(index) {
    const slotEl = index === 0 ? els.sellSlot0 : els.sellSlot1;
    const clearBtn = index === 0 ? els.btnClearSell0 : els.btnClearSell1;
    const cardId = player.sellSlots[index];
    const card = cardId ? baseCard(cardId) : null;

    if (card) {
      slotEl.classList.add("filled");
      slotEl.innerHTML = `
        ${cardFaceForKey(cardId, { compact: true })}
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
    if (!baseCard(cardId) || !player.cards[cardId]) return;
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
    tickQuestPlay(1);
    const cps = totalSellCps();
    if (cps <= 0) return;
    addEarnedCoins(cps);
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
      if (!row || typeof row.cardId !== "string" || !baseCard(row.cardId)) continue;
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
      const card = baseCard(row.cardId);
      if (card) total += cardValueForKey(row.cardId) * row.qty;
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
        const card = baseCard(row.cardId);
        if (!card) return "";
        const lineValue = cardValueForKey(row.cardId) * row.qty;
        const removeBtn = editable
          ? `<button type="button" class="btn-remove-trade" data-remove-trade="${escapeHtml(row.cardId)}" title="Remove">×</button>`
          : "";
        return `
          <div class="trade-item-row">
            <div class="trade-item-card">${cardFaceForKey(row.cardId, { qty: row.qty, compact: true })}</div>
            <div class="trade-item-meta">
              <div>${escapeHtml(cardDisplayName(row.cardId))} ×${row.qty}</div>
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
      markIndexFound(row.cardId);
    }
    if (theirOffer.cash > 0) addEarnedCoins(theirOffer.cash);
    progressQuests({ cardIds: theirOffer.cards.map((row) => row.cardId) });

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
    const showCount = total > 0 && player.settings && player.settings.backpackCounter !== false;
    if (showCount) {
      els.backpackCount.hidden = false;
      els.backpackCount.textContent = String(total);
    } else {
      els.backpackCount.hidden = true;
    }
    updateIndexBadge();
    updateQuestBadge();

    if (currentScreen === "inventory") renderInventoryList();
    if (currentScreen === "room") renderTradeSlots();
    if (currentScreen === "sellStop") renderSellStop();
    if (currentScreen === "quests") renderQuests();
    if (currentScreen === "crafting") renderCrafting();
  }

  function buyPack(packId) {
    const pack = PACKS[packId];
    if (!pack) return;
    applyDueRestocks();
    if (!shop.infiniteStock && packStockCount(pack) <= 0) {
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
      consumePackStock(pack);
      saveShop();
    }
    player.packs[packId] = (player.packs[packId] || 0) + 1;
    savePlayer();
    renderPlayerUi();
    setShopMessage(
      pack.canOpen
        ? `Bought ${pack.name}. Open it from your backpack.`
        : `Bought ${pack.name}. Keep it sealed for now.`
    );
  }

  function openAdminGate() {
    setError(els.adminGateError, "");
    els.adminPassword.value = "";
    els.adminGate.hidden = false;
    refreshFabs();
    setTimeout(() => els.adminPassword.focus(), 0);
  }

  function closeAdminGate() {
    els.adminGate.hidden = true;
    refreshFabs();
  }

  function fillAdminOddsInputs() {
    const odds = sanitizeMutationOdds(shop.mutationOdds);
    shop.mutationOdds = odds;
    if (els.adminOddsNone) els.adminOddsNone.value = String(odds.none);
    if (els.adminOddsShiny) els.adminOddsShiny.value = String(odds.shiny);
    if (els.adminOddsSilver) els.adminOddsSilver.value = String(odds.silver);
    if (els.adminOddsGold) els.adminOddsGold.value = String(odds.gold);
    if (els.adminOddsDiamond) els.adminOddsDiamond.value = String(odds.diamond);
  }

  function readAdminOddsFromInputs() {
    shop.mutationOdds = sanitizeMutationOdds({
      none: els.adminOddsNone && els.adminOddsNone.value,
      shiny: els.adminOddsShiny && els.adminOddsShiny.value,
      silver: els.adminOddsSilver && els.adminOddsSilver.value,
      gold: els.adminOddsGold && els.adminOddsGold.value,
      diamond: els.adminOddsDiamond && els.adminOddsDiamond.value,
    });
    saveShop();
  }

  function openAdminSettings() {
    closeAdminGate();
    els.adminInfiniteStock.checked = shop.infiniteStock;
    els.adminUnkickable.checked = shop.unkickable;
    els.adminInstantQuests.checked = shop.instantQuests;
    els.adminNoQuestCooldown.checked = shop.noQuestCooldown;
    fillAdminOddsInputs();
    els.adminSettings.hidden = false;
    refreshFabs();
  }

  function tryAdminLogin() {
    if (els.adminPassword.value === ADMIN_PASSWORD) {
      openAdminSettings();
      return;
    }
    setError(els.adminGateError, "Wrong password.");
  }

  function renderNpcFighters() {
    if (!els.npcFighterList) return;
    els.npcFighterList.innerHTML = Object.values(NPC_FIGHTERS)
      .map((npc, i) => {
        const kind = i === 0 ? "btn-primary" : "btn-secondary";
        const extra = `${npc.danger ? " is-danger" : ""}${npc.serif ? " is-serif" : ""}`;
        return `<button type="button" class="btn ${kind} npc-fighter-btn${extra}" data-npc-id="${npc.id}">${escapeHtml(npc.name)}</button>`;
      })
      .join("");
  }

  function ownedCardTotal() {
    return Object.values(player.cards).reduce((sum, n) => sum + (n || 0), 0);
  }

  function openNpcBattle(npcId) {
    const npc = NPC_FIGHTERS[npcId];
    if (!npc) return;
    if (ownedCardTotal() < PLAYER_TEAM_SIZE) {
      els.npcBattlesMsg.hidden = false;
      els.npcBattlesMsg.textContent = "You need 3 cards in your backpack first.";
      return;
    }
    els.npcBattlesMsg.hidden = true;
    pendingBattleNpc = npcId;
    pendingBattleTeam = [];
    openInventory("battle");
  }

  function makeBattler(card, key) {
    const cardKeyVal = key || card.id;
    const mult = cardStatMult(cardKeyVal);
    const hp = Math.max(1, Math.round(card.hp * mult));
    return {
      cardId: card.id,
      cardKey: cardKeyVal,
      statMult: mult,
      hp,
      maxHp: hp,
      healLastTurn: {},
      jumpscareUses: 0,
    };
  }

  function activeFoe() {
    return battle && battle.foeTeam ? battle.foeTeam[battle.foeIndex] : null;
  }

  function activeYou() {
    return battle && battle.youTeam ? battle.youTeam[battle.youIndex] : null;
  }

  function battleSleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function startBattle(playerCardIds, npcId) {
    const youKeys = (playerCardIds || []).filter((id) => baseCard(id));
    const npc = NPC_FIGHTERS[npcId];
    const foeTeam = npc ? npc.team.map((id) => CARDS[id]).filter(Boolean) : [];
    if (youKeys.length !== PLAYER_TEAM_SIZE || !foeTeam.length) return;
    const first = foeTeam[0];
    battleAnimGen += 1;
    battle = {
      npcId,
      npcName: npc.name,
      npcDanger: Boolean(npc.danger),
      npcSerif: Boolean(npc.serif),
      foeTeam: foeTeam.map((card) => makeBattler(card)),
      foeIndex: 0,
      youTeam: youKeys.map((key) => makeBattler(baseCard(key), key)),
      youIndex: 0,
      turn: 1,
      over: false,
      busy: false,
      mustSwitch: false,
      result: "",
      log: `${npc.name} sends out ${first.name}. Your turn.`,
    };
    pendingBattleNpc = null;
    pendingBattleTeam = [];
    inventoryMode = "browse";
    els.battleParty.hidden = true;
    showScreen("battle");
    battle.busy = true;
    renderBattle();
    const introGen = battleAnimGen;
    presentBattleEvent({ log: battle.log, stay: true }, introGen).then(() => {
      if (!battle || introGen !== battleAnimGen) return;
      battle.busy = false;
      renderBattle();
    });
  }

  function battleMoveReady(move, battler) {
    if (!move || !battler || !battle) return false;
    if (move.isHeal) return healMoveReady(move, battler.healLastTurn[move.id], battle.turn);
    return true;
  }

  function battleMoveDamage(move, battler) {
    const mult = battler && battler.statMult ? battler.statMult : 1;
    if (move.isJumpscare) return Math.max(1, Math.round(jumpscareDamage(move, battler.jumpscareUses) * mult));
    return Math.max(0, Math.round(move.damage * mult));
  }

  function battleMoveStat(move, battler) {
    const dmg = battleMoveDamage(move, battler);
    if (move.isHybrid) return `Heal ${move.heal} · ${dmg} DMG`;
    if (move.isHeal) return `Heal ${move.heal}`;
    return `${dmg} DMG`;
  }

  function pickNpcMove(foeCard, battler) {
    const you = activeYou();
    const moves = foeCard.moves || [];
    const ready = moves.filter((move) => battleMoveReady(move, battler));
    const pool = ready.length ? ready : moves;
    if (!pool.length) return null;
    const oneshots = pool.filter(
      (move) => you && battleMoveDamage(move, battler) >= you.hp
    );
    const choices = oneshots.length ? oneshots : pool;
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function battlerBySide(sideId) {
    return sideId === "you" ? activeYou() : activeFoe();
  }

  function applyOneBattleAction(action) {
    const battler = battlerBySide(action.sideId);
    if (!battler || battler.hp <= 0) return null;
    const card = CARDS[battler.cardId];
    const move = (card.moves || []).find((m) => m.id === action.moveId);
    const moveName = move ? move.name : "A move";
    if (action.type === "heal") {
      battler.hp = Math.min(battler.maxHp, battler.hp + action.amount);
      return { log: `${cardDisplayName(battler.cardKey || battler.cardId)} heals ${action.amount}.`, heal: action.sideId, amount: action.amount };
    }
    if (action.missed) {
      return { log: `${moveName} missed!` };
    }
    const target = action.sideId === "you" ? activeFoe() : activeYou();
    if (!target) return null;
    target.hp = Math.max(0, target.hp - action.amount);
    const hitSide = action.sideId === "you" ? "foe" : "you";
    return { log: `${moveName} hits for ${action.amount}.`, hit: hitSide, amount: action.amount };
  }

  function finishBattleEvents() {
    const events = [];
    const you = activeYou();
    const foe = activeFoe();
    if (foe && foe.hp <= 0) {
      if (battle.foeIndex < battle.foeTeam.length - 1) {
        battle.foeIndex += 1;
        const next = activeFoe();
        const nextCard = CARDS[next.cardId];
        events.push({ log: `${battle.npcName} Switched in ${nextCard.name}` });
      } else {
        battle.over = true;
        battle.result = "win";
        events.push({ log: "You win!", stay: true });
        return events;
      }
    }
    if (you && you.hp <= 0) {
      if (battle.youTeam.some((member) => member.hp > 0)) {
        battle.mustSwitch = true;
        events.push({
          log: `${cardDisplayName(you.cardKey || you.cardId)} fainted. Choose a card.`,
          stay: true,
          openParty: true,
        });
        return events;
      }
      battle.over = true;
      battle.result = "lose";
      events.push({ log: "You lose.", stay: true });
      return events;
    }
    events.push({ log: "Your turn.", stay: true });
    return events;
  }

  function spawnBattleFloat(side, amount, kind) {
    const wrap = side === "you" ? els.battleYouCard : els.battleFoe;
    if (!wrap) return;
    const card = wrap.querySelector(".animal-card");
    if (card) {
      card.classList.remove(kind === "heal" ? "is-heal" : "is-hit");
      void card.offsetWidth;
      card.classList.add(kind === "heal" ? "is-heal" : "is-hit");
    }
    const floatEl = document.createElement("span");
    floatEl.className = `battle-float ${kind === "heal" ? "battle-float-heal" : "battle-float-dmg"}`;
    floatEl.textContent = kind === "heal" ? `+${amount}` : `-${amount}`;
    wrap.appendChild(floatEl);
    floatEl.addEventListener("animationend", () => floatEl.remove());
  }

  async function presentBattleEvent(event, gen) {
    if (!event || !event.log) return;
    if (gen !== battleAnimGen) return;
    els.battleLog.classList.remove("is-in");
    await battleSleep(BATTLE_LOG_FADE_MS);
    if (gen !== battleAnimGen) return;
    battle.log = event.log;
    els.battleLog.textContent = event.log;
    renderBattleCards();
    els.battleLog.classList.add("is-in");
    if (event.hit) spawnBattleFloat(event.hit, event.amount, "hit");
    if (event.heal) spawnBattleFloat(event.heal, event.amount, "heal");
    await battleSleep(event.stay ? 420 : BATTLE_LOG_HOLD_MS);
    if (gen !== battleAnimGen) return;
    if (!event.stay) {
      els.battleLog.classList.remove("is-in");
      await battleSleep(BATTLE_LOG_FADE_MS);
    }
  }

  async function playBattleEvents(events) {
    const gen = ++battleAnimGen;
    battle.busy = true;
    renderBattleHud();
    for (const event of events) {
      if (gen !== battleAnimGen) return gen;
      await presentBattleEvent(event, gen);
    }
    return gen;
  }

  async function resolvePlayedActions(actions, prefix = []) {
    const events = prefix.slice();
    for (const action of actions) {
      const event = applyOneBattleAction(action);
      if (event) events.push(event);
    }
    events.push(...finishBattleEvents());
    const gen = await playBattleEvents(events);
    if (gen !== battleAnimGen) return;
    if (!battle.over && !battle.mustSwitch) battle.turn += 1;
    battle.busy = false;
    renderBattle();
    const last = events[events.length - 1];
    if (last && last.openParty) openBattleParty();
  }

  async function playBattleMove(index) {
    if (!battle || battle.over || battle.busy || battle.mustSwitch) return;
    const you = activeYou();
    const youCard = you && CARDS[you.cardId];
    const foe = activeFoe();
    const foeCard = foe && CARDS[foe.cardId];
    const youMove = (youCard.moves || [])[index];
    if (!youMove || !foeCard || !battleMoveReady(youMove, you)) return;
    const foeMove = pickNpcMove(foeCard, foe);
    const actions = resolveBattleTurn(
      { id: "you", move: youMove, jumpscareUses: you.jumpscareUses, statMult: you.statMult || 1 },
      { id: "foe", move: foeMove, jumpscareUses: foe.jumpscareUses, statMult: foe.statMult || 1 }
    );
    if (youMove.isHeal) you.healLastTurn[youMove.id] = battle.turn;
    if (youMove.isJumpscare) you.jumpscareUses += 1;
    if (foeMove) {
      if (foeMove.isHeal) foe.healLastTurn[foeMove.id] = battle.turn;
      if (foeMove.isJumpscare) foe.jumpscareUses += 1;
    }
    await resolvePlayedActions(actions);
  }

  async function switchPlayerCard(index) {
    if (!battle || battle.over) return;
    if (battle.busy && !battle.mustSwitch) return;
    if (index === battle.youIndex) {
      closeBattleParty();
      return;
    }
    const next = battle.youTeam[index];
    if (!next || next.hp <= 0) return;
    const name = cardDisplayName(next.cardKey || next.cardId);
    battle.youIndex = index;
    const forced = battle.mustSwitch;
    battle.mustSwitch = false;
    els.battleParty.hidden = true;
    if (forced) {
      await playBattleEvents([{ log: `You switched in ${name}. Your turn.`, stay: true }]);
      if (!battle) return;
      battle.busy = false;
      renderBattle();
      return;
    }
    const you = activeYou();
    const foe = activeFoe();
    const foeCard = foe && CARDS[foe.cardId];
    if (!you || !foeCard) return;
    const foeMove = pickNpcMove(foeCard, foe);
    const actions = resolveBattleTurn(
      { id: "you", move: null, jumpscareUses: you.jumpscareUses, statMult: you.statMult || 1 },
      { id: "foe", move: foeMove, jumpscareUses: foe.jumpscareUses, statMult: foe.statMult || 1 }
    );
    if (foeMove) {
      if (foeMove.isHeal) foe.healLastTurn[foeMove.id] = battle.turn;
      if (foeMove.isJumpscare) foe.jumpscareUses += 1;
    }
    await resolvePlayedActions(actions, [{ log: `You switched in ${name}.` }]);
  }

  function renderBattleCards() {
    if (!battle) return;
    const you = activeYou();
    const youCard = you && CARDS[you.cardId];
    const foe = activeFoe();
    const foeCard = foe && CARDS[foe.cardId];
    els.battleFoeMeta.textContent = `${battle.npcName} · ${battle.foeIndex + 1} / ${battle.foeTeam.length}`;
    els.battleFoeMeta.classList.toggle("is-danger", Boolean(battle.npcDanger));
    els.battleFoeMeta.classList.toggle("is-serif", Boolean(battle.npcSerif));
    els.battleFoe.innerHTML = foeCard
      ? cardFaceHtml(foeCard, {
          compact: true,
          showValue: false,
          hp: foe.hp,
          cardKey: foe.cardKey || foe.cardId,
        })
      : "";
    els.battleYouCard.innerHTML = youCard
      ? cardFaceHtml(youCard, {
          compact: true,
          showValue: false,
          hp: you.hp,
          cardKey: you.cardKey || you.cardId,
        })
      : "";
  }

  function renderBattleHud() {
    if (!battle) return;
    const you = activeYou();
    const youCard = you && CARDS[you.cardId];
    const locked = battle.over || battle.busy || battle.mustSwitch;
    els.btnBattleFlee.textContent = battle.over ? "← Leave" : "← Flee";
    els.btnBattleCards.disabled = battle.over || (battle.busy && !battle.mustSwitch);
    els.btnBattleCards.classList.toggle("need-pick", Boolean(battle.mustSwitch));
    els.battleMoves.innerHTML = (youCard && youCard.moves ? youCard.moves : [])
      .map((move, i) => {
        const ready = !locked && battleMoveReady(move, you);
        const wait = battle.over
          ? "Battle over"
          : battle.mustSwitch
            ? "Choose a card"
            : battle.busy
              ? ""
              : move.isHeal && !ready
                ? "Next turn"
                : "";
        return `
          <button type="button" class="battle-move" data-battle-move="${i}" ${ready ? "" : "disabled"}>
            <span class="battle-move-name">${escapeHtml(move.name)}</span>
            <span class="battle-move-stat">${escapeHtml(wait || battleMoveStat(move, you))}</span>
          </button>
        `;
      })
      .join("");
  }

  function renderBattleParty() {
    if (!battle) return;
    els.battlePartyList.innerHTML = battle.youTeam
      .map((member, i) => {
        const card = CARDS[member.cardId];
        const fainted = member.hp <= 0;
        const active = i === battle.youIndex;
        return `
          <button type="button" class="battle-party-card${active ? " is-active" : ""}${fainted ? " is-fainted" : ""}" data-party-index="${i}" ${fainted ? "disabled" : ""}>
            ${cardFaceHtml(card, {
              compact: true,
              showValue: false,
              hp: member.hp,
              cardKey: member.cardKey || member.cardId,
            })}
            <span class="battle-party-label">${active ? "In battle" : fainted ? "Fainted" : "Switch"}</span>
          </button>
        `;
      })
      .join("");
    els.btnBattlePartyClose.hidden = Boolean(battle.mustSwitch);
  }

  function renderBattle() {
    if (!battle) return;
    renderBattleCards();
    renderBattleHud();
    if (!els.battleParty.hidden) renderBattleParty();
  }

  function openBattleParty() {
    if (!battle || battle.over) return;
    els.battleParty.hidden = false;
    renderBattleParty();
  }

  function closeBattleParty() {
    if (battle && battle.mustSwitch) return;
    els.battleParty.hidden = true;
  }

  function fleeBattle() {
    battleAnimGen += 1;
    battle = null;
    pendingBattleNpc = null;
    pendingBattleTeam = [];
    els.battleLog.classList.remove("is-in");
    els.battleParty.hidden = true;
    showScreen("npcBattles");
  }

  function showScreen(name) {
    currentScreen = name;
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[name].classList.add("active");
    refreshFabs();
    if (name === "title" || name === "accounts" || name === "settings") renderAccountUi();
    if (name === "settings") renderSettingsToggles();
    if (name === "autoSell") renderAutoSellList();
    if (name === "index") renderIndex();
    if (name === "quests") renderQuests();
    if (name === "crafting") renderCrafting();
    if (name === "npcBattles") renderNpcFighters();
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
    const card = baseCard(cardId);
    const owned = player.cards[cardId] || 0;
    if (!card || owned < 1) return;
    const existing = myOffer.cards.find((c) => c.cardId === cardId);
    if (!existing && myOffer.cards.length >= MAX_TRADE_CARD_TYPES) {
      els.tradeConfirmStatus.textContent = "You can only add 4 different card types.";
      showScreen("room");
      return;
    }
    pendingTradeCardId = cardId;
    els.qtyTitle.textContent = existing
      ? `Update ${cardDisplayName(cardId)}`
      : `Offer ${cardDisplayName(cardId)}`;
    els.qtyPreview.innerHTML = cardFaceForKey(cardId, { qty: owned, compact: true });
    els.qtyInput.max = String(owned);
    els.qtyInput.value = String(existing ? existing.qty : 1);
    updateQtyTotal();
    els.qtyModal.hidden = false;
    refreshFabs();
  }

  function updateQtyTotal() {
    const card = baseCard(pendingTradeCardId);
    if (!card) return;
    const owned = player.cards[pendingTradeCardId] || 0;
    let qty = Math.floor(Number(els.qtyInput.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    els.qtyInput.value = String(qty);
    els.qtyTotalValue.textContent = `$${cardValueForKey(pendingTradeCardId) * qty}`;
  }

  function closeQtyModal() {
    els.qtyModal.hidden = true;
    pendingTradeCardId = null;
    refreshFabs();
  }

  function openCardSellModal(cardId) {
    const card = baseCard(cardId);
    const owned = player.cards[cardId] || 0;
    if (!card || owned < 1) return;
    pendingSellCardId = cardId;
    els.cardSellPreview.innerHTML = cardFaceForKey(cardId, { qty: owned, compact: true });
    els.cardSellQty.max = String(owned);
    els.cardSellQty.value = "1";
    els.cardSellHint.textContent = `Owned: ${owned} · Unit value $${cardValueForKey(cardId)}`;
    els.btnSellKeepOne.disabled = owned < 2;
    updateCardSellTotal();
    els.cardSellModal.hidden = false;
    refreshFabs();
  }

  function updateCardSellTotal() {
    const card = baseCard(pendingSellCardId);
    if (!card) return;
    const owned = player.cards[pendingSellCardId] || 0;
    let qty = Math.floor(Number(els.cardSellQty.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    els.cardSellQty.value = String(qty);
    els.cardSellTotal.textContent = `$${cardValueForKey(pendingSellCardId) * qty}`;
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
    refreshFabs();
  }

  function confirmCardSell() {
    const cardId = pendingSellCardId;
    const card = baseCard(cardId);
    const owned = player.cards[cardId] || 0;
    if (!card || owned < 1) {
      closeCardSellModal();
      return;
    }
    let qty = Math.floor(Number(els.cardSellQty.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    const payout = cardValueForKey(cardId) * qty;
    player.cards[cardId] -= qty;
    if (player.cards[cardId] <= 0) delete player.cards[cardId];
    addEarnedCoins(payout);
    savePlayer();
    closeCardSellModal();
    renderPlayerUi();
  }

  function confirmTradeQty() {
    if (myConfirmed) return;
    const cardId = pendingTradeCardId;
    const card = baseCard(cardId);
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
      refreshFabs();
      return;
    }
    setError(els.tradeError, "");
    showScreen("trade");
  });
  els.btnLoginRequiredOk.addEventListener("click", () => {
    els.loginRequiredModal.hidden = true;
    refreshFabs();
    showScreen("title");
  });
  els.btnSettings.addEventListener("click", () => {
    setAccountsMsg("");
    renderAccountUi();
    renderSettingsToggles();
    showScreen("settings");
  });
  els.settingBackpackCounter.addEventListener("change", () => {
    if (!player.settings) player.settings = defaultSettings();
    player.settings.backpackCounter = els.settingBackpackCounter.checked;
    savePlayer();
    renderPlayerUi();
  });
  els.btnPlayBack.addEventListener("click", () => showScreen("title"));
  els.btnSettingsBack.addEventListener("click", () => showScreen("title"));
  els.btnAccounts.addEventListener("click", () => {
    setAccountsMsg("");
    renderAccountUi();
    showScreen("accounts");
  });
  els.btnAutoSell.addEventListener("click", () => showScreen("autoSell"));
  els.btnAutoSellBack.addEventListener("click", () => showScreen("settings"));
  els.autoSellList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-auto-sell]");
    if (!btn) return;
    const id = btn.getAttribute("data-auto-sell");
    if (!CARDS[id] || !(player.cards[id] > 0)) return;
    if (!player.autoSell) player.autoSell = {};
    if (player.autoSell[id]) delete player.autoSell[id];
    else player.autoSell[id] = true;
    savePlayer();
    renderAutoSellList();
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
  els.btnNpcBattles.addEventListener("click", () => showScreen("npcBattles"));
  els.btnCardShopBack.addEventListener("click", () => showScreen("play"));
  els.btnSellStopBack.addEventListener("click", () => showScreen("play"));
  els.btnBattlesBack.addEventListener("click", () => showScreen("play"));
  els.btnNpcBattlesBack.addEventListener("click", () => showScreen("battles"));
  els.npcFighterList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-npc-id]");
    if (!btn) return;
    openNpcBattle(btn.getAttribute("data-npc-id"));
  });
  els.btnBattleFlee.addEventListener("click", fleeBattle);
  els.btnBattleCards.addEventListener("click", () => {
    if (!battle || battle.over) return;
    if (battle.busy && !battle.mustSwitch) return;
    if (els.battleParty.hidden) openBattleParty();
    else closeBattleParty();
  });
  els.btnBattlePartyClose.addEventListener("click", closeBattleParty);
  els.battlePartyList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-party-index]");
    if (!btn) return;
    switchPlayerCard(Number(btn.getAttribute("data-party-index")));
  });
  els.battleMoves.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-battle-move]");
    if (!btn) return;
    playBattleMove(Number(btn.getAttribute("data-battle-move")));
  });
  els.btnInventoryBack.addEventListener("click", () => {
    const back =
      inventoryMode === "trade"
        ? "room"
        : inventoryMode === "sell"
          ? "sellStop"
          : inventoryMode === "battle"
            ? "npcBattles"
            : inventoryReturnScreen || "title";
    inventoryMode = "browse";
    pendingSellSlot = null;
    pendingBattleNpc = null;
    pendingBattleTeam = [];
    showScreen(back);
  });
  els.btnBackpack.addEventListener("click", () => openInventory("browse"));
  els.btnIndex.addEventListener("click", openIndex);
  els.btnIndexBack.addEventListener("click", () => {
    showScreen(indexReturnScreen || "title");
  });
  els.btnIndexClaim.addEventListener("click", claimIndexRewards);
  els.btnQuests.addEventListener("click", openQuests);
  els.btnQuestsBack.addEventListener("click", () => {
    showScreen(questsReturnScreen || "title");
  });
  els.btnCrafting.addEventListener("click", openCrafting);
  els.btnCraftingBack.addEventListener("click", () => {
    showScreen(craftReturnScreen || "title");
  });
  document.querySelectorAll("[data-craft-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      craftTab = tab.getAttribute("data-craft-tab") === "merger" ? "merger" : "bench";
      renderCrafting();
    });
  });
  els.craftingMain.addEventListener("click", (e) => {
    const pick = e.target.closest("[data-merge-pick]");
    if (pick) {
      mergerPickKey = pick.getAttribute("data-merge-pick");
      renderCrafting();
      return;
    }
    if (e.target.closest("#btn-merge-combine")) combineMutation();
  });
  els.btnCraftResultDone.addEventListener("click", hideCraftResult);
  document.querySelectorAll("[data-quest-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      questTab = tab.getAttribute("data-quest-tab") === "event" ? "event" : "daily";
      renderQuests();
    });
  });
  els.questsList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-claim-quest]");
    if (!btn || btn.disabled) return;
    claimQuest(btn.getAttribute("data-claim-quest"));
  });
  els.btnBuyCommonPack.addEventListener("click", () => buyPack("common-pack"));
  els.btnBuyRarePack.addEventListener("click", () => buyPack("rare-pack"));
  els.btnRevealDone.addEventListener("click", hidePackReveal);

  els.btnAdminGateCancel.addEventListener("click", closeAdminGate);
  els.btnAdminGateEnter.addEventListener("click", tryAdminLogin);
  els.adminPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryAdminLogin();
  });
  els.btnAdminClose.addEventListener("click", closeAdminSettings);
  els.btnRestockTokenNo.addEventListener("click", closeRestockTokenModal);
  els.btnRestockTokenYes.addEventListener("click", confirmRestockToken);
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
  els.adminInstantQuests.addEventListener("change", () => {
    shop.instantQuests = els.adminInstantQuests.checked;
    saveShop();
    ensureQuestBoard();
    savePlayer();
    updateQuestBadge();
    if (currentScreen === "quests") renderQuests();
  });
  els.adminNoQuestCooldown.addEventListener("change", () => {
    shop.noQuestCooldown = els.adminNoQuestCooldown.checked;
    saveShop();
    if (shop.noQuestCooldown) player.questLocks = [];
    ensureQuestBoard();
    savePlayer();
    if (currentScreen === "quests") renderQuests();
  });
  [
    els.adminOddsNone,
    els.adminOddsShiny,
    els.adminOddsSilver,
    els.adminOddsGold,
    els.adminOddsDiamond,
  ].forEach((input) => {
    if (!input) return;
    input.addEventListener("change", readAdminOddsFromInputs);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Alt" || e.repeat) return;
    if (!els.adminGate.hidden || !els.adminSettings.hidden) return;
    if (!els.qtyModal.hidden || !els.packReveal.hidden || !els.cardSellModal.hidden) return;
    if (els.restockTokenModal && !els.restockTokenModal.hidden) return;
    if (els.craftResult && !els.craftResult.hidden) return;
    e.preventDefault();
    openAdminGate();
  });

  els.btnTradeBack.addEventListener("click", () => {
    destroySession();
    showScreen("title");
  });

  document.querySelectorAll(".inv-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      if (inventoryMode === "trade" || inventoryMode === "sell" || inventoryMode === "battle") return;
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
    const useBtn = e.target.closest("[data-use-item]");
    if (useBtn && inventoryMode === "browse") {
      if (useBtn.getAttribute("data-use-item") === "restock-token") openRestockTokenModal();
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
      return;
    }
    if (inventoryMode === "battle") {
      const remaining =
        (player.cards[cardId] || 0) -
        pendingBattleTeam.filter((picked) => picked === cardId).length;
      if (remaining <= 0) return;
      pendingBattleTeam.push(cardId);
      if (pendingBattleTeam.length >= PLAYER_TEAM_SIZE) {
        startBattle(pendingBattleTeam.slice(), pendingBattleNpc);
      } else {
        renderInventoryList();
      }
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

  window.addEventListener("visibilitychange", () => {
    if (document.hidden) savePlayer();
  });

  window.addEventListener("beforeunload", () => {
    browsingQuick = false;
    destroySession();
    destroyBoard();
    savePlayer();
  });

  renderAccountUi();
  renderPlayerUi();
  startSellTicker();
  startShopUiTimer();
  savePlayer();
})();
