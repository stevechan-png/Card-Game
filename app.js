(() => {
  const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const LOBBY_STALE_MS = 15000;
  const HEARTBEAT_MS = 4000;
  const JOIN_TIMEOUT_MS = 16000;
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
    "electrified-pack": {
      id: "electrified-pack",
      name: "Electrified Pack",
      price: 0,
      pool: "electrified",
      stockKey: "eventStock",
      shopSold: false,
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
    "fire-gem": {
      id: "fire-gem",
      name: "Fire Gem",
      note: "Tap to apply Fire Mutation to one card.",
      usable: true,
    },
    "gold-gem": {
      id: "gold-gem",
      name: "Gold Gem",
      note: "Tap to apply Gold Mutation to one card.",
      usable: true,
    },
    "diamond-gem": {
      id: "diamond-gem",
      name: "Diamond Gem",
      note: "Tap to apply Diamond Mutation to one card.",
      usable: true,
    },
    "luck-i-potion": {
      id: "luck-i-potion",
      name: "Luck I Potion",
      note: "Tap to double pack luck for 1 minute. Extra uses add 1 minute.",
      usable: true,
    },
    "healing-gem": {
      id: "healing-gem",
      name: "Healing Gem",
      note: "Tap to apply Healing Mutation to one card.",
      usable: true,
    },
    "clear-gem": {
      id: "clear-gem",
      name: "Clear Gem",
      note: "Tap to remove a card's mutation. The gem is not returned.",
      usable: true,
    },
    "clear-crystal": {
      id: "clear-crystal",
      name: "Clear Crystal",
      note: "Tap to remove a card's mutation and return its gem.",
      usable: true,
    },
    "shiny-gem": {
      id: "shiny-gem",
      name: "Shiny Gem",
      note: "Tap to apply Shiny Mutation. Only from Clear Crystal.",
      usable: true,
    },
    "silver-gem": {
      id: "silver-gem",
      name: "Silver Gem",
      note: "Tap to apply Silver Mutation. Only from Clear Crystal.",
      usable: true,
    },
    potion: {
      id: "potion",
      name: "Potion",
      note: "Use in battle to heal one living card 30 HP. Costs a turn.",
    },
    revive: {
      id: "revive",
      name: "Revive",
      note: "Use in battle to revive one card to half HP. Once every 3 turns.",
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
    lightning: {
      id: "lightning",
      name: "Lightning",
      value: 80,
      hp: 40,
      oneIn: 2,
      cps: 2,
      theme: "lightning",
      blurb: "Sky spark",
      emoji: "⚡",
      moves: [
        { id: "zap", name: "Zap", damage: 18 },
        { id: "static-charge", name: "Static Charge", damage: 23 },
      ],
    },
    storm: {
      id: "storm",
      name: "Storm",
      value: 110,
      hp: 55,
      oneIn: 5,
      cps: 4,
      theme: "storm",
      blurb: "Rolling thunder",
      emoji: "🌩️",
      moves: [
        { id: "lightning-strike", name: "Lightning Strike", damage: 20 },
        { id: "fury-of-the-storm", name: "Fury of the Storm", damage: 28 },
      ],
    },
    "thunder-eagle": {
      id: "thunder-eagle",
      name: "Thunder Eagle",
      value: 140,
      hp: 70,
      oneIn: 10,
      cps: 7,
      theme: "thunder-eagle",
      blurb: "Stormborn wings",
      model: "./assets/thunder-eagle-model.png",
      modelKnockout: true,
      emoji: "🦅",
      moves: [
        { id: "thunder-charge", name: "Thunder Charge", damage: 27 },
        { id: "electrified-swoop", name: "Electrified Swoop", damage: 32 },
      ],
    },
    "thunder-snake": {
      id: "thunder-snake",
      name: "Thunder Snake",
      value: 180,
      hp: 90,
      oneIn: 18,
      cps: 10,
      theme: "thunder-snake",
      blurb: "Voltage coil",
      model: "./assets/thunder-snake-model.png",
      modelKnockout: true,
      emoji: "🐍",
      moves: [
        { id: "voltage-blast", name: "Voltage Blast", damage: 29 },
        { id: "electric-wrap", name: "Electric Wrap", damage: 33 },
      ],
    },
    "electrified-bull": {
      id: "electrified-bull",
      name: "Electrified Bull",
      value: 240,
      hp: 120,
      oneIn: 25,
      cps: 13,
      theme: "electrified-bull",
      blurb: "Live-wire charge",
      model: "./assets/electrified-bull-model.png",
      modelKnockout: true,
      emoji: "🐂",
      moves: [
        { id: "thunder-stomp", name: "Thunder Stomp", damage: 32 },
        { id: "electrical-stampede", name: "Electrical Stampede", damage: 35 },
      ],
    },
    "electrified-panther": {
      id: "electrified-panther",
      name: "Electrified Panther",
      value: 310,
      hp: 155,
      oneIn: 35,
      cps: 16,
      theme: "electrified-panther",
      blurb: "Static hunter",
      model: "./assets/electrified-panther-model.png",
      modelKnockout: true,
      emoji: "🐆",
      moves: [
        { id: "thunder-claw", name: "Thunder Claw", damage: 34 },
        { id: "electrical-assault", name: "Electrical Assault", damage: 37 },
      ],
    },
    miraidon: {
      id: "miraidon",
      name: "Miraidon",
      value: 380,
      hp: 190,
      oneIn: 50,
      cps: 22,
      theme: "miraidon",
      blurb: "Future voltage",
      model: "./assets/miraidon-model.png",
      modelKnockout: true,
      emoji: "⚡",
      moves: [
        { id: "engine-charge", name: "Engine Charge", heal: 20 },
        { id: "thunders-wraith", name: "Thunders Wraith", damage: 42 },
        { id: "electro-drift", name: "Electro Drift", damage: 45 },
      ],
    },
    "thunder-scylla": {
      id: "thunder-scylla",
      name: "Thunder Scylla",
      value: 460,
      hp: 230,
      oneIn: 75,
      cps: 30,
      theme: "thunder-scylla",
      blurb: "Deep-sea thunder",
      model: "./assets/thunder-scylla-model.png",
      modelKnockout: true,
      emoji: "🐙",
      moves: [
        { id: "tentacle-shock", name: "Tentacle Shock", damage: 42 },
        { id: "maelstrom-bolt", name: "Maelstrom Bolt", damage: 45 },
        { id: "abyssal-thunder", name: "Abyssal Thunder", damage: 49 },
      ],
    },
    "miraidon-x": {
      id: "miraidon-x",
      name: "Miraidon X",
      value: 630,
      hp: 315,
      oneIn: 100,
      cps: 38,
      theme: "miraidon-x",
      blurb: "Apex voltage",
      model: "./assets/miraidon-x-model.png",
      modelKnockout: true,
      emoji: "⚡",
      moves: [
        { id: "engine-charge-x", name: "Engine Charge X", heal: 30, healTeam: true },
        { id: "thunders-wraith-x", name: "Thunders Wraith X", damage: 55 },
        { id: "electro-drift-x", name: "Electro Drift X", damage: 62 },
      ],
    },
    unknown: {
      id: "unknown",
      name: "???",
      value: 99999,
      oneIn: 99999,
      cps: 0,
      theme: "unknown",
      blurb: "???",
      emoji: "?",
      battleOnly: true,
      moves: [
        { id: "the-end", name: "???", damage: 99999, isWipe: true },
      ],
    },
  };

  const SECOND_MOVE_MISS_CHANCE = 0.1;
  const HEAL_MOVE_TURN_GAP = 2;
  const ENGINE_CHARGE_X_REVIVE_HP = 90;
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
    move.isWipe = Boolean(move.isWipe);
    move.healTeam = Boolean(move.healTeam) && isHeal;
    move.alwaysFirst = isJumpscare || isHeal || slot === 1 || move.isWipe;
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

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function rng() {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
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
    const items = [];
    const jumpscares = [];
    const heals = [];
    const strikes = [];

    function consider(side) {
      if (!side) return;
      if (side.item === "potion" || side.item === "revive") {
        items.push({
          sideId: side.id,
          type: "item",
          itemId: side.item,
          targetIndex: Math.floor(Number(side.targetIndex)),
        });
        return;
      }
      if (!side.move) return;
      const move = side.move;
      const dmgMult = side.statMult || 1;
      const healMult = side.healMult != null ? side.healMult : 1;
      if (move.isJumpscare || move.isWipe) {
        const amount = move.isWipe
          ? Math.max(1, Math.ceil(move.damage * dmgMult))
          : Math.max(1, Math.ceil(jumpscareDamage(move, side.jumpscareUses) * dmgMult));
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
          amount: Math.max(0, Math.ceil(move.heal * healMult)),
          moveId: move.id,
          healTeam: Boolean(move.healTeam),
          engineChargeMode: side.engineChargeMode === "revive" ? "revive" : "heal",
          reviveIndex: Number.isInteger(side.reviveIndex) ? side.reviveIndex : null,
        });
      }
      if (move.damage > 0) {
        strikes.push({
          sideId: side.id,
          type: "damage",
          amount: Math.max(0, Math.ceil(move.damage * dmgMult)),
          moveId: move.id,
          move,
        });
      }
    }

    consider(left);
    consider(right);
    if (items.length === 2 && rng() < 0.5) items.reverse();
    actions.push(...items);
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
    if (card.hp == null) card.hp = card.value;
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

  const ELECTRIFIED_POOL = [
    CARDS.lightning,
    CARDS.storm,
    CARDS["thunder-eagle"],
    CARDS["thunder-snake"],
    CARDS["electrified-bull"],
    CARDS["electrified-panther"],
    CARDS.miraidon,
    CARDS["thunder-scylla"],
    CARDS["miraidon-x"],
  ];

  const COMMON_CARD_IDS = new Set(COMMON_POOL.map((c) => c.id));
  const RARE_CARD_IDS = new Set(RARE_POOL.map((c) => c.id));
  const EVENT_CARD_IDS = new Set(ELECTRIFIED_POOL.map((c) => c.id));
  for (const id of EVENT_CARD_IDS) {
    const card = CARDS[id];
    if (card && card.hp != null) card.value = card.hp * 2;
  }
  const AUTO_SELL_ORDER = [
    ...COMMON_POOL.map((c) => c.id),
    ...RARE_POOL.map((entry) => entry.id).filter((id) => id !== "shark"),
    ...ELECTRIFIED_POOL.map((c) => c.id),
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
    shiny: { id: "shiny", label: "Shiny", prefix: "Shiny", hpMult: 1.2, dmgMult: 1.2, healMult: 1.2, className: "mutation-shiny" },
    silver: { id: "silver", label: "Silver", prefix: "Silver", hpMult: 1.3, dmgMult: 1.3, healMult: 1.3, className: "mutation-silver" },
    gold: { id: "gold", label: "Gold", prefix: "Gold", hpMult: 1.4, dmgMult: 1.4, healMult: 1.4, className: "mutation-gold" },
    diamond: { id: "diamond", label: "Diamond", prefix: "Diamond", hpMult: 1.6, dmgMult: 1.6, healMult: 1.6, className: "mutation-diamond" },
    fire: { id: "fire", label: "Fire", prefix: "Fire", hpMult: 0.8, dmgMult: 1.8, healMult: 1, econMult: 1, className: "mutation-fire", crafted: true },
    healing: { id: "healing", label: "Healing", prefix: "Healing", hpMult: 2, dmgMult: 1, healMult: 2.5, econMult: 1, className: "mutation-heal", crafted: true },
  };
  const MUTATION_RANK = { "": 0, shiny: 1, silver: 2, gold: 3, diamond: 4, fire: 5, healing: 6 };
  const FIRE_GEM_CRAFT_MS = 5 * 60 * 1000;
  const LUCK_I_POTION_MS = 60 * 1000;
  const LUCK_I_POTION_MULT = 2;
  const LUCK_I_POTION_PRICE = 20000;
  const LUCK_I_POTION_JACKPOT_ONE_IN = 200;
  const LUCK_I_POTION_CRAFT_MS = 10 * 60 * 1000;
  const HEALING_GEM_PRICE = 60000;
  const CLEAR_GEM_PRICE = 10000;
  const CLEAR_CRYSTAL_PRICE = 90000;
  const HEALING_GEM_STOCK_CHANCE = 0.3;
  const CLEAR_GEM_STOCK_CHANCE = 0.6;
  const CLEAR_CRYSTAL_STOCK_CHANCE = 0.3;
  const POTION_PRICE = 10000;
  const BATTLE_POTION_HEAL = 30;
  const REVIVE_ITEM_TURN_GAP = 3;
  const REVIVE_CRAFT_MS = 5 * 60 * 1000;
  const GEM_ITEMS = {
    "fire-gem": { itemId: "fire-gem", mutation: "fire", title: "Fire Mutation" },
    "gold-gem": { itemId: "gold-gem", mutation: "gold", title: "Gold Mutation" },
    "diamond-gem": { itemId: "diamond-gem", mutation: "diamond", title: "Diamond Mutation" },
    "healing-gem": { itemId: "healing-gem", mutation: "healing", title: "Healing Mutation" },
    "shiny-gem": { itemId: "shiny-gem", mutation: "shiny", title: "Shiny Mutation" },
    "silver-gem": { itemId: "silver-gem", mutation: "silver", title: "Silver Mutation" },
  };
  const CLEAR_ITEMS = {
    "clear-gem": {
      itemId: "clear-gem",
      refund: false,
      title: "Clear Gem",
      copy: "Remove this mutation. The gem is not returned.",
    },
    "clear-crystal": {
      itemId: "clear-crystal",
      refund: true,
      title: "Clear Crystal",
      copy: "Remove this mutation and return the gem if it has one.",
    },
  };
  const MUTATION_RETURN_GEM = {
    fire: "fire-gem",
    gold: "gold-gem",
    diamond: "diamond-gem",
    healing: "healing-gem",
    shiny: "shiny-gem",
    silver: "silver-gem",
  };
  const CRAFTER_SHOP_GOODS = [
    {
      id: "potion",
      name: "Potion",
      mark: "🧪",
      theme: "potion",
      price: POTION_PRICE,
      blurb: "Battle item. Heal one living card 30 HP. Costs a turn.",
      stockKey: "potionStock",
    },
    {
      id: "luck-i-potion",
      name: "Luck I Potion",
      mark: "🍀",
      theme: "luck",
      price: LUCK_I_POTION_PRICE,
      blurb: "Doubles pack luck for 1 minute. Extra uses add 1 minute.",
      stockKey: "luckPotionStock",
    },
    {
      id: "healing-gem",
      name: "Healing Gem",
      mark: "💚",
      theme: "heal",
      price: HEALING_GEM_PRICE,
      blurb: "Applies Healing Mutation: 2× HP and 2.5× healing.",
      stockKey: "healingGemStock",
    },
    {
      id: "clear-gem",
      name: "Clear Gem",
      mark: "⚪",
      theme: "clear",
      price: CLEAR_GEM_PRICE,
      blurb: "Removes a mutation. Does not return a gem.",
      stockKey: "clearGemStock",
    },
    {
      id: "clear-crystal",
      name: "Clear Crystal",
      mark: "💠",
      theme: "crystal",
      price: CLEAR_CRYSTAL_PRICE,
      blurb: "Removes a mutation and returns the gem.",
      stockKey: "clearCrystalStock",
    },
  ];
  const CRAFT_RECIPES = {
    "fire-gem": {
      id: "fire-gem",
      name: "Fire Gem",
      itemId: "fire-gem",
      craftMs: FIRE_GEM_CRAFT_MS,
      blurb: "3 Demons, 1 Kitsune, and 10,000 coins. 5 minutes to finish.",
      coins: 10000,
      theme: "fire",
      mark: "🔥",
      stats: "1.8× damage · 0.8× HP · healing unchanged · one mutation per card",
      materials: [
        { cardId: "demon", count: 3 },
        { cardId: "kitsune", count: 1 },
      ],
    },
    "gold-gem": {
      id: "gold-gem",
      name: "Gold Gem",
      itemId: "gold-gem",
      craftMs: FIRE_GEM_CRAFT_MS,
      blurb: "5 Shiny cards and 10,000 coins. 5 minutes to finish.",
      coins: 10000,
      theme: "gold",
      mark: "🥇",
      stats: "1.4× HP · 1.4× damage · 1.4× healing · one mutation per card",
      pick: { mutation: "shiny", count: 5 },
    },
    "diamond-gem": {
      id: "diamond-gem",
      name: "Diamond Gem",
      itemId: "diamond-gem",
      craftMs: FIRE_GEM_CRAFT_MS,
      blurb: "10 Silver cards and 20,000 coins. 5 minutes to finish.",
      coins: 20000,
      theme: "diamond",
      mark: "💎",
      stats: "1.6× HP · 1.6× damage · 1.6× healing · one mutation per card",
      pick: { mutation: "silver", count: 10 },
    },
    "luck-i-potion": {
      id: "luck-i-potion",
      name: "Luck I Potion",
      itemId: "luck-i-potion",
      craftMs: LUCK_I_POTION_CRAFT_MS,
      blurb: "5 Kitsunes. 10 minutes to finish.",
      coins: 0,
      theme: "luck",
      mark: "🍀",
      stats: "2× pack luck for 1 minute · extra uses add 1 minute",
      materials: [{ cardId: "kitsune", count: 5 }],
    },
    revive: {
      id: "revive",
      name: "Revive",
      itemId: "revive",
      craftMs: REVIVE_CRAFT_MS,
      blurb: "10 Potions, 8 T-Rex, and 15,000 coins. 5 minutes to finish.",
      coins: 15000,
      theme: "revive",
      mark: "💗",
      stats: "Battle revive to half HP · once every 3 turns · costs a turn",
      materials: [
        { itemId: "potion", count: 10 },
        { cardId: "trex", count: 8 },
      ],
    },
  };

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

  function mutationHpMult(key) {
    const spec = mutationSpec(key);
    return spec && spec.hpMult != null ? spec.hpMult : 1;
  }

  function mutationDmgMult(key) {
    const spec = mutationSpec(key);
    return spec && spec.dmgMult != null ? spec.dmgMult : 1;
  }

  function mutationHealMult(key) {
    const spec = mutationSpec(key);
    return spec && spec.healMult != null ? spec.healMult : 1;
  }

  function mutationEconMult(key) {
    const spec = mutationSpec(key);
    if (!spec) return 1;
    if (spec.econMult != null) return spec.econMult;
    return spec.hpMult != null ? spec.hpMult : 1;
  }

  function cardStatMult(key) {
    return mutationHpMult(key);
  }

  function ceilMutationStat(base, key) {
    const n = Number(base) || 0;
    const scaled = n * mutationHpMult(key);
    if (!Number.isFinite(scaled) || scaled <= 0) return 0;
    return Math.ceil(scaled);
  }

  function ceilEconStat(base, key) {
    const n = Number(base) || 0;
    const scaled = n * mutationEconMult(key);
    if (!Number.isFinite(scaled) || scaled <= 0) return 0;
    return Math.ceil(scaled);
  }

  function cardValueForKey(key) {
    const card = baseCard(key);
    if (!card) return 0;
    return Math.max(1, ceilEconStat(card.value, key));
  }

  function cardCpsForKey(key) {
    const card = baseCard(key);
    if (!card) return 0;
    return ceilEconStat(card.cps, key);
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
  const EVENT_QUEST_SLOT_COUNT = 5;
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
  const EVENT_QUEST_DEFS = {
    "eq-collect-chicken": {
      type: "eq-collect-chicken",
      title: "Collect 40 Chickens",
      target: 40,
      packs: 6,
      collectBaseId: "chicken",
    },
    "eq-beat-demon-boss": {
      type: "eq-beat-demon-boss",
      title: "Beat Demon Boss",
      target: 1,
      packs: 4,
    },
    "eq-open-common-5": {
      type: "eq-open-common-5",
      title: "Open 5 Common Packs",
      target: 5,
      packs: 1,
    },
    "eq-open-rare-3": {
      type: "eq-open-rare-3",
      title: "Open 3 Rare Packs",
      target: 3,
      packs: 1,
    },
    "eq-trial-8": {
      type: "eq-trial-8",
      title: "Reach Trial Mode Trial 8",
      target: 8,
      packs: 6,
      trialReach: true,
    },
    "eq-trial-4": {
      type: "eq-trial-4",
      title: "Reach Trial Mode Trial 4",
      target: 4,
      packs: 3,
      trialReach: true,
    },
    "eq-mutate-10": {
      type: "eq-mutate-10",
      title: "Mutate 10 cards",
      target: 10,
      packs: 3,
    },
    "eq-beat-bosses-3": {
      type: "eq-beat-bosses-3",
      title: "Beat 3 Bosses",
      target: 3,
      packs: 4,
    },
    "eq-collect-cow": {
      type: "eq-collect-cow",
      title: "Collect 20 Cows",
      target: 20,
      packs: 4,
      collectBaseId: "cow",
    },
    "eq-sell-100": {
      type: "eq-sell-100",
      title: "Sell 100 Cards",
      target: 100,
      packs: 5,
    },
    "eq-sell-30": {
      type: "eq-sell-30",
      title: "Sell 30 Cards",
      target: 30,
      packs: 2,
    },
    "eq-craft-fire-gem": {
      type: "eq-craft-fire-gem",
      title: "Craft a Fire Gem",
      target: 1,
      packs: 2,
    },
    "eq-mutate-diamond": {
      type: "eq-mutate-diamond",
      title: "Mutate a Diamond Card",
      target: 1,
      packs: 5,
    },
  };
  const EVENT_QUEST_ORDER = Object.keys(EVENT_QUEST_DEFS);

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
      const fallback = card.emoji
        ? `<span class="card-emoji" hidden role="img" aria-label="${escapeHtml(card.name)}">${card.emoji}</span>`
        : `<span class="card-emoji card-emoji-empty" hidden aria-hidden="true"></span>`;
      return `<img class="card-model${knockout}" src="${src}" alt="${escapeHtml(card.name)}" draggable="false" decoding="async" onerror="this.hidden=true; const n=this.nextElementSibling; if(n) n.hidden=false;" />${fallback}`;
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
    btnMultiplayerBattles: document.getElementById("btn-multiplayer-battles"),
    btnTrialMode: document.getElementById("btn-trial-mode"),
    battlesMsg: document.getElementById("battles-msg"),
    npcFighterList: document.getElementById("npc-fighter-list"),
    npcBattlesMsg: document.getElementById("npc-battles-msg"),
    npcRewardTip: document.getElementById("npc-reward-tip"),
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
    battleReward: document.getElementById("battle-reward"),
    battleRewardTitle: document.getElementById("battle-reward-title"),
    battleRewardCopy: document.getElementById("battle-reward-copy"),
    battleRewardList: document.getElementById("battle-reward-list"),
    btnBattleRewardDone: document.getElementById("btn-battle-reward-done"),
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
    indexDetailModal: document.getElementById("index-detail-modal"),
    indexDetailTitle: document.getElementById("index-detail-title"),
    indexDetailCard: document.getElementById("index-detail-card"),
    indexDetailPack: document.getElementById("index-detail-pack"),
    indexDetailMoves: document.getElementById("index-detail-moves"),
    btnIndexDetailClose: document.getElementById("btn-index-detail-close"),
    btnQuests: document.getElementById("btn-quests"),
    btnQuestsBack: document.getElementById("btn-quests-back"),
    btnCrafting: document.getElementById("btn-crafting"),
    btnCraftingBack: document.getElementById("btn-crafting-back"),
    craftingMain: document.getElementById("crafting-main"),
    luckBoostHud: document.getElementById("luck-boost-hud"),
    luckBoostTime: document.getElementById("luck-boost-time"),
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
    itemDiscardModal: document.getElementById("item-discard-modal"),
    itemDiscardName: document.getElementById("item-discard-name"),
    itemDiscardQty: document.getElementById("item-discard-qty"),
    itemDiscardHint: document.getElementById("item-discard-hint"),
    btnDiscardKeepOne: document.getElementById("btn-discard-keep-one"),
    btnItemDiscardCancel: document.getElementById("btn-item-discard-cancel"),
    btnItemDiscardConfirm: document.getElementById("btn-item-discard-confirm"),
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
    adminNoCraftWait: document.getElementById("admin-no-craft-wait"),
    adminLuck: document.getElementById("admin-luck"),
    adminLuckPreview: document.getElementById("admin-luck-preview"),
    adminOddsNone: document.getElementById("admin-odds-none"),
    adminOddsShiny: document.getElementById("admin-odds-shiny"),
    adminOddsSilver: document.getElementById("admin-odds-silver"),
    adminOddsGold: document.getElementById("admin-odds-gold"),
    adminOddsDiamond: document.getElementById("admin-odds-diamond"),
    btnAdminClose: document.getElementById("btn-admin-close"),
    adminEventPackCount: document.getElementById("admin-event-pack-count"),
    btnAdminGrantElectrified: document.getElementById("btn-admin-grant-electrified"),
    engineChargeModal: document.getElementById("engine-charge-modal"),
    engineChargeCopy: document.getElementById("engine-charge-copy"),
    engineChargeChoices: document.getElementById("engine-charge-choices"),
    engineChargeReviveList: document.getElementById("engine-charge-revive-list"),
    btnEngineHealTeam: document.getElementById("btn-engine-heal-team"),
    btnEngineRevive: document.getElementById("btn-engine-revive"),
    btnEngineChargeCancel: document.getElementById("btn-engine-charge-cancel"),
    battleItemDock: document.getElementById("battle-item-dock"),
    battleItemModal: document.getElementById("battle-item-modal"),
    battleItemTitle: document.getElementById("battle-item-title"),
    battleItemCopy: document.getElementById("battle-item-copy"),
    battleItemList: document.getElementById("battle-item-list"),
    btnBattleItemCancel: document.getElementById("btn-battle-item-cancel"),
    restockTokenModal: document.getElementById("restock-token-modal"),
    fireMutateModal: document.getElementById("fire-mutate-modal"),
    fireMutateTitle: document.getElementById("fire-mutate-title"),
    fireMutateCopy: document.getElementById("fire-mutate-copy"),
    btnFireMutateNo: document.getElementById("btn-fire-mutate-no"),
    btnFireMutateYes: document.getElementById("btn-fire-mutate-yes"),
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
    loginRequiredCopy: document.getElementById("login-required-copy"),
    btnLoginRequiredOk: document.getElementById("btn-login-required-ok"),
    btnTradeBack: document.getElementById("btn-trade-back"),
    lobbyMenuTitle: document.getElementById("lobby-menu-title"),
    lobbyMenuCopy: document.getElementById("lobby-menu-copy"),
    joinMenuTitle: document.getElementById("join-menu-title"),
    joinMenuCopy: document.getElementById("join-menu-copy"),
    quickMenuTitle: document.getElementById("quick-menu-title"),
    quickMenuCopy: document.getElementById("quick-menu-copy"),
    battleLobbyPanel: document.getElementById("battle-lobby-panel"),
    battleLobbyCopy: document.getElementById("battle-lobby-copy"),
    btnBattlePickTeam: document.getElementById("btn-battle-pick-team"),
    battleLobbyReady: document.getElementById("battle-lobby-ready"),
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
  let netMode = "trade";
  let myPvpTeam = null;
  let theirPvpTeam = null;
  let myPvpChoice = null;
  let theirPvpChoice = null;

  let currentScreen = "title";
  let inventoryReturnScreen = "title";
  let indexReturnScreen = "title";
  let questsReturnScreen = "title";
  let craftReturnScreen = "title";
  let inventoryTab = "packs";
  let questTab = "daily";
  let craftTab = "bench";
  let selectedCraftRecipeId = null;
  let mergerPickKey = null;
  let pendingFireCardKey = null;
  let pendingGemItemId = null;
  let pendingClearItemId = null;
  let pendingCraftRecipeId = null;
  let pendingCraftPicks = [];
  let questPlaySaveAcc = 0;
  let questClaimFlash = "";
  let questClaimFlashUntil = 0;
  let inventoryMode = "browse"; // browse | trade | sell | battle
  let pendingSellSlot = null;
  let sellTickTimer = null;
  let shopUiTimer = null;
  let luckBoostHudTimer = null;
  let battle = null;
  let pendingBattleNpc = null;
  let pendingBattleKind = null;
  let pendingBattleTeam = [];
  let pendingEngineCharge = null;
  let pendingBattleItem = null;
  let battleAnimGen = 0;
  let battleRewardAction = "hide";

  const PLAYER_TEAM_SIZE = 3;
  const BATTLE_LOG_FADE_MS = 220;
  const BATTLE_LOG_HOLD_MS = 800;
  const BATTLE_FAINT_MS = 950;

  const NPC_FIGHTERS = {
    beginner: {
      id: "beginner",
      name: "Beginner Fighter",
      team: ["chicken", "chicken", "chicken"],
      reward: { packs: { "common-pack": 1 } },
    },
    animal: {
      id: "animal",
      name: "Animal Fighter",
      team: ["chicken", "cow", "pig"],
      reward: { packs: { "common-pack": 1 }, coins: 100 },
    },
    animal2: {
      id: "animal2",
      name: "Animal Fighter 2",
      team: ["pig", "salmon", "squid"],
      reward: { coins: 300 },
    },
    ocean: {
      id: "ocean",
      name: "Ocean Fighter",
      team: ["salmon", "squid", "squid"],
      reward: { coins: 500 },
    },
    monkeyTamer: {
      id: "monkeyTamer",
      name: "Monkey Tamer",
      team: ["monkey", "monkey", "monkey"],
      reward: { packs: { "rare-pack": 1 } },
    },
    wildAnimal: {
      id: "wildAnimal",
      name: "Wild Animal Fighter",
      team: ["tiger", "lion", "leopard"],
      reward: { packs: { "rare-pack": 1 }, coins: 100 },
    },
    beastTrainer: {
      id: "beastTrainer",
      name: "Beast Trainer",
      team: ["shark", "triceratops", "trex"],
      reward: { packs: { "rare-pack": 2 } },
    },
    prehistoric: {
      id: "prehistoric",
      name: "Prehistoric Fighter",
      team: ["triceratops", "trex", "trex"],
      reward: { items: { "restock-token": 1 }, coins: 500 },
    },
    undead1: {
      id: "undead1",
      name: "Undead Trainer I",
      team: ["skeleton", "zombie", "spirit"],
      reward: { items: { "restock-token": 2 }, coins: 800 },
    },
    undead2: {
      id: "undead2",
      name: "Undead Trainer II",
      team: ["zombie", "skeleton", "skeleton", "spirit", "spirit", "spirit"],
      danger: true,
      reward: { items: { "restock-token": 3 }, packs: { "rare-pack": 1 } },
    },
    spiritTrainer: {
      id: "spiritTrainer",
      name: "Spirit Trainer",
      team: ["spiritual-horse-rider", "ghoul", "ghost-fox"],
      reward: { items: { "restock-token": 1 }, packs: { "rare-pack": 1 } },
    },
    hellFighter: {
      id: "hellFighter",
      name: "Hell Fighter",
      team: ["demon", "demon", "demon"],
      reward: { packs: { "rare-pack": 2 } },
    },
    legendTrainer: {
      id: "legendTrainer",
      name: "Legend Trainer",
      team: ["dragon", "dragon", "kitsune"],
      reward: { items: { "restock-token": 2 }, coins: 1500 },
    },
    kitsuneTrainer: {
      id: "kitsuneTrainer",
      name: "Kitsune Trainer",
      team: ["kitsune", "kitsune", "kitsune"],
      reward: { packs: { "rare-pack": 2 }, items: { "restock-token": 2 } },
    },
    hellForces: {
      id: "hellForces",
      name: "Hell Forces",
      team: ["demon", "grim-reaper", "grim-reaper"],
      reward: { packs: { "rare-pack": 3 }, coins: 3000 },
    },
    demonBoss: {
      id: "demonBoss",
      name: "Demon Boss",
      team: ["demon", "demon", "grim-reaper", "demon", "grim-reaper", "demon"],
      danger: true,
      serif: true,
      reward: { packs: { "rare-pack": 4 }, items: { "restock-token": 4 } },
    },
  };

  const NPC_FIGHTER_LIST = Object.values(NPC_FIGHTERS);
  const TRIAL_LATE_WAVES = {
    20: { name: "Wave 20", team: ["demon", "demon", "demon", "grim-reaper", "grim-reaper", "grim-reaper"], danger: true },
    21: { name: "Wave 21", team: ["demon", "demon", "grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper"], danger: true },
    22: { name: "Wave 22", team: ["demon", "grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper"], danger: true },
    23: { name: "Wave 23", team: ["grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper"], danger: true },
    24: { name: "Wave 24", team: ["grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper", "kitsune", "kitsune"], danger: true },
    25: { name: "Wave 25", team: ["grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper", "kitsune"], danger: true },
    26: { name: "Wave 26", team: ["grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper", "grim-reaper"], danger: true },
    27: { name: "Wave 27", team: Array(12).fill("dragon"), danger: true },
    28: { name: "???", team: ["unknown"], danger: true, serif: true },
  };

  function trialWaveFromNpc(npc, waveNumber) {
    if (!npc) return null;
    return {
      name: npc.name,
      team: npc.team.slice(),
      danger: Boolean(npc.danger),
      serif: Boolean(npc.serif),
      wave: waveNumber,
    };
  }

  function trialWaveDef(waveNumber) {
    const n = Number(waveNumber);
    if (n >= 1 && n <= 8) return trialWaveFromNpc(NPC_FIGHTER_LIST[n - 1], n);
    if (n === 9) return { name: "Wave 9", team: ["squid", "shark", "skeleton"] };
    if (n === 10) return { name: "Wave 10", team: ["shark", "skeleton", "shark"] };
    if (n === 11) return { name: "Wave 11", team: ["triceratops", "triceratops", "trex", "trex"] };
    if (n >= 12 && n <= 19) return trialWaveFromNpc(NPC_FIGHTER_LIST[n - 4], n);
    return TRIAL_LATE_WAVES[n] ? { ...TRIAL_LATE_WAVES[n], team: TRIAL_LATE_WAVES[n].team.slice(), wave: n } : null;
  }

  function trialWaveReward(waveNumber) {
    const n = Number(waveNumber);
    if (!n || n < 1) return null;
    const reward = { coins: 130 * 2 ** Math.floor((n - 1) / 2) };
    if (n % 5 === 0) reward.packs = { "rare-pack": 2 ** (n / 5) };
    return reward;
  }

  function randomStockAmount() {
    return STOCK_MIN + Math.floor(Math.random() * (STOCK_MAX - STOCK_MIN + 1));
  }

  function randomRareStockAmount() {
    if (Math.random() < RARE_MISS_CHANCE) return 0;
    return RARE_STOCK_MIN + Math.floor(Math.random() * (RARE_STOCK_MAX - RARE_STOCK_MIN + 1));
  }

  function randomLuckPotionStock() {
    if (Math.random() < 1 / LUCK_I_POTION_JACKPOT_ONE_IN) return 50;
    return 1 + Math.floor(Math.random() * 3);
  }

  function randomChanceStock(chance) {
    return Math.random() < chance ? 1 : 0;
  }

  function randomPotionStock() {
    const roll = Math.random();
    if (roll < 0.5) return 2;
    if (roll < 0.79) return 3;
    if (roll < 0.99) return 4;
    return 5;
  }

  function crafterStockSnapshot() {
    return {
      potionStock: shop.potionStock,
      luckPotionStock: shop.luckPotionStock,
      healingGemStock: shop.healingGemStock,
      clearGemStock: shop.clearGemStock,
      clearCrystalStock: shop.clearCrystalStock,
    };
  }

  function restockCrafterGoods() {
    shop.potionStock = randomPotionStock();
    shop.luckPotionStock = randomLuckPotionStock();
    shop.healingGemStock = randomChanceStock(HEALING_GEM_STOCK_CHANCE);
    shop.clearGemStock = randomChanceStock(CLEAR_GEM_STOCK_CHANCE);
    shop.clearCrystalStock = randomChanceStock(CLEAR_CRYSTAL_STOCK_CHANCE);
  }

  function freshShopState() {
    return {
      stock: randomStockAmount(),
      rareStock: randomRareStockAmount(),
      eventStock: randomEventStockAmount(),
      luckPotionStock: randomLuckPotionStock(),
      potionStock: randomPotionStock(),
      healingGemStock: randomChanceStock(HEALING_GEM_STOCK_CHANCE),
      clearGemStock: randomChanceStock(CLEAR_GEM_STOCK_CHANCE),
      clearCrystalStock: randomChanceStock(CLEAR_CRYSTAL_STOCK_CHANCE),
      nextRestockAt: Date.now() + RESTOCK_MS,
      infiniteStock: false,
      unkickable: false,
      instantQuests: false,
      noQuestCooldown: false,
      noCraftWait: false,
      luck: 1,
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
        eventStock:
          data.eventStock == null
            ? randomEventStockAmount()
            : Math.max(0, Math.floor(Number(data.eventStock) || 0)),
        luckPotionStock:
          data.luckPotionStock == null
            ? randomLuckPotionStock()
            : Math.max(0, Math.floor(Number(data.luckPotionStock) || 0)),
        potionStock:
          data.potionStock == null
            ? randomPotionStock()
            : Math.max(0, Math.floor(Number(data.potionStock) || 0)),
        healingGemStock:
          data.healingGemStock == null
            ? randomChanceStock(HEALING_GEM_STOCK_CHANCE)
            : Math.min(1, Math.max(0, Math.floor(Number(data.healingGemStock) || 0))),
        clearGemStock:
          data.clearGemStock == null
            ? randomChanceStock(CLEAR_GEM_STOCK_CHANCE)
            : Math.min(1, Math.max(0, Math.floor(Number(data.clearGemStock) || 0))),
        clearCrystalStock:
          data.clearCrystalStock == null
            ? randomChanceStock(CLEAR_CRYSTAL_STOCK_CHANCE)
            : Math.min(1, Math.max(0, Math.floor(Number(data.clearCrystalStock) || 0))),
        nextRestockAt: Number(data.nextRestockAt) || Date.now() + RESTOCK_MS,
        infiniteStock: Boolean(data.infiniteStock),
        unkickable: Boolean(data.unkickable),
        instantQuests: Boolean(data.instantQuests),
        noQuestCooldown: Boolean(data.noQuestCooldown),
        noCraftWait: Boolean(data.noCraftWait),
        luck: sanitizeLuck(data.luck),
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
        eventStock: shop.eventStock,
        luckPotionStock: shop.luckPotionStock,
        potionStock: shop.potionStock,
        healingGemStock: shop.healingGemStock,
        clearGemStock: shop.clearGemStock,
        clearCrystalStock: shop.clearCrystalStock,
        nextRestockAt: shop.nextRestockAt,
        infiniteStock: shop.infiniteStock,
        unkickable: shop.unkickable,
        instantQuests: shop.instantQuests,
        noQuestCooldown: shop.noQuestCooldown,
        noCraftWait: Boolean(shop.noCraftWait),
        luck: sanitizeLuck(shop.luck),
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
    shop.eventStock = randomEventStockAmount();
    restockCrafterGoods();
    saveShop();
  }

  function forceShopRestock() {
    shop.stock = randomStockAmount();
    shop.rareStock =
      RARE_STOCK_MIN + Math.floor(Math.random() * (RARE_STOCK_MAX - RARE_STOCK_MIN + 1));
    shop.eventStock =
      RARE_STOCK_MIN + Math.floor(Math.random() * (RARE_STOCK_MAX - RARE_STOCK_MIN + 1));
    restockCrafterGoods();
    shop.nextRestockAt = Date.now() + RESTOCK_MS;
    saveShop();
    renderShopStock();
    if (currentScreen === "crafting" && craftTab === "shop") renderCrafting();
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
    applyLuckFromAdmin(true);
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

  function packHasInfiniteStock(pack) {
    return Boolean(pack && pack.infiniteStock) || shop.infiniteStock;
  }

  function packStockCount(pack) {
    if (packHasInfiniteStock(pack)) return Infinity;
    return Math.max(0, Math.floor(Number(shop[pack.stockKey]) || 0));
  }

  function consumePackStock(pack) {
    if (packHasInfiniteStock(pack)) return;
    const key = pack.stockKey;
    shop[key] = Math.max(0, Math.floor(Number(shop[key]) || 0) - 1);
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
      const beforeEvent = shop.eventStock;
      const beforeCrafter = crafterStockSnapshot();
      applyDueRestocks();
      const afterCrafter = crafterStockSnapshot();
      const crafterChanged = Object.keys(beforeCrafter).some((key) => beforeCrafter[key] !== afterCrafter[key]);
      const changed =
        before !== shop.stock ||
        beforeRare !== shop.rareStock ||
        beforeEvent !== shop.eventStock ||
        crafterChanged;
      if (currentScreen === "cardShop" || changed) {
        if (currentScreen === "cardShop") renderShopStock();
        else if (changed) saveShop();
      }
      if (currentScreen === "crafting" && craftTab === "shop" && changed) renderCrafting();
      if (currentScreen === "crafting" && craftTab === "bench") {
        const timers = document.querySelectorAll("[data-craft-timer]");
        if (timers.length) {
          const now = Date.now();
          let needsRefresh = false;
          timers.forEach((el) => {
            const job = (player.craftJobs || []).find((j) => j.id === el.getAttribute("data-craft-timer"));
            if (!job) {
              needsRefresh = true;
              return;
            }
            if (craftJobReady(job)) {
              if (el.textContent !== "Ready to claim") needsRefresh = true;
            } else {
              el.textContent = formatCountdown(job.readyAt - now);
              const bar = document.querySelector(`[data-craft-bar="${job.id}"]`);
              if (bar) bar.style.width = `${Math.round(craftJobProgress(job) * 100)}%`;
            }
          });
          if (needsRefresh) renderCrafting();
        }
      }
      if (currentScreen === "crafting" && craftTab === "shop") {
        const timer = document.getElementById("crafter-shop-timer");
        if (timer) {
          applyDueRestocks();
          const remaining = Math.max(0, shop.nextRestockAt - Date.now());
          timer.textContent = shop.infiniteStock
            ? "Infinite stock enabled"
            : `Restock in ${formatCountdown(remaining)}`;
        }
      }
    }, 250);
  }
  let pendingTradeKind = null;
  let pendingTradeId = null;
  let pendingSellCardId = null;
  let pendingDiscardItemId = null;
  let accountFormMode = "register"; // register | login
  let myConfirmed = false;
  let theirConfirmed = false;
  let bothConfirmedSince = null;
  let tradeArmedTimer = null;
  let tradeUiTimer = null;
  let tradeExecuting = false;

  const MAX_TRADE_CARD_TYPES = 4;
  const MAX_TRADE_PACK_TYPES = 4;
  const MAX_TRADE_ITEM_TYPES = 4;

  const myOffer = { cards: [], packs: [], items: [], cash: 0 };
  const theirOffer = { cards: [], packs: [], items: [], cash: 0 };
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
      eventQuests: [],
      eventQuestLocks: [],
      craftJobs: [],
      luckBoostUntil: 0,
      luckBoostMult: 1,
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
    bags.eventQuests = sanitizeEventQuests(data.eventQuests);
    bags.eventQuestLocks = sanitizeQuestLocks(data.eventQuestLocks, EVENT_QUEST_SLOT_COUNT);
    fillEventQuestSlots(bags.eventQuests, bags.eventQuestLocks);
    applyInstantQuests(bags.eventQuests);
    bags.craftJobs = sanitizeCraftJobs(data.craftJobs);
    const boostUntil = Number(data.luckBoostUntil);
    bags.luckBoostUntil = Number.isFinite(boostUntil) && boostUntil > Date.now() ? boostUntil : 0;
    const boostMult = Number(data.luckBoostMult);
    bags.luckBoostMult =
      bags.luckBoostUntil > 0 && Number.isFinite(boostMult) && boostMult > 1
        ? boostMult
        : 1;
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
      eventQuests: snapshotEventQuests(p.eventQuests),
      eventQuestLocks: [...(p.eventQuestLocks || [])],
      craftJobs: snapshotCraftJobs(p.craftJobs),
      luckBoostUntil: p.luckBoostUntil || 0,
      luckBoostMult: p.luckBoostMult || 1,
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
    player.eventQuests = next.eventQuests;
    player.eventQuestLocks = next.eventQuestLocks;
    player.craftJobs = next.craftJobs;
    player.luckBoostUntil = next.luckBoostUntil;
    player.luckBoostMult = next.luckBoostMult;
    player.settings = next.settings;
    renderLuckBoostHud();
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

  function sanitizeLuck(raw) {
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) return 1;
    return n;
  }

  function luckBoostRemaining() {
    const until = Number(player && player.luckBoostUntil);
    if (!Number.isFinite(until) || until <= 0) return 0;
    return Math.max(0, until - Date.now());
  }

  function playerLuckMult() {
    return luckBoostRemaining() > 0 ? sanitizeLuck(player.luckBoostMult || LUCK_I_POTION_MULT) : 1;
  }

  function effectiveLuck() {
    return sanitizeLuck(shop.luck) * playerLuckMult();
  }

  function luckBoostHudEl() {
    let el = document.getElementById("luck-boost-hud");
    if (el) return el;
    el = document.createElement("div");
    el.id = "luck-boost-hud";
    el.className = "luck-boost-hud";
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
    if (els) els.luckBoostHud = el;
    return el;
  }

  function expireLuckBoost() {
    if (!(player.luckBoostUntil > 0)) return;
    player.luckBoostUntil = 0;
    player.luckBoostMult = 1;
    savePlayer();
  }

  function renderLuckBoostHud() {
    const el = luckBoostHudEl();
    const remain = luckBoostRemaining();
    if (remain <= 0) {
      expireLuckBoost();
      el.classList.remove("is-on");
      el.removeAttribute("hidden");
      el.innerHTML = "";
      return;
    }
    const mult = sanitizeLuck(player.luckBoostMult || LUCK_I_POTION_MULT);
    el.innerHTML = `<span class="luck-boost-label">${mult}× Luck</span><strong id="luck-boost-time">${formatCountdown(
      remain
    )}</strong>`;
    el.removeAttribute("hidden");
    el.classList.add("is-on");
    if (els) {
      els.luckBoostHud = el;
      els.luckBoostTime = document.getElementById("luck-boost-time");
    }
  }

  function startLuckBoostHudTimer() {
    if (luckBoostHudTimer) return;
    luckBoostHudTimer = setInterval(renderLuckBoostHud, 250);
  }

  function useLuckIPotion() {
    if (!(player.items["luck-i-potion"] > 0)) return;
    player.items["luck-i-potion"] -= 1;
    if (player.items["luck-i-potion"] <= 0) delete player.items["luck-i-potion"];
    const now = Date.now();
    const remain = luckBoostRemaining();
    player.luckBoostUntil = now + remain + LUCK_I_POTION_MS;
    player.luckBoostMult = LUCK_I_POTION_MULT;
    savePlayer();
    renderLuckBoostHud();
    renderPlayerUi();
  }

  function formatOneIn(oneIn) {
    const n = Number(oneIn);
    if (!Number.isFinite(n) || n <= 0) return "1";
    if (n >= 10) return String(Math.round(n));
    const rounded = Math.round(n * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function luckPreviewText(luck) {
    const l = sanitizeLuck(luck);
    if (l <= 1) return "Card labels stay the printed 1-in. Luck 1 draws the full pool.";
    return `Labels stay the printed 1-in. Rates 1/${formatOneIn(l)} and easier become undrawable.`;
  }

  function refreshLuckPreview(raw) {
    if (!els.adminLuckPreview) return;
    els.adminLuckPreview.textContent = luckPreviewText(raw == null ? shop.luck : raw);
  }

  function applyLuckFromAdmin(rewrite) {
    if (!els.adminLuck) return;
    const raw = String(els.adminLuck.value || "").trim();
    const parsed = Number(raw);
    const valid = Number.isFinite(parsed) && parsed > 0;
    if (!valid) {
      refreshLuckPreview(rewrite ? 1 : raw);
      if (!rewrite) return;
      shop.luck = 1;
      els.adminLuck.value = "1";
    } else {
      shop.luck = parsed;
      if (rewrite) els.adminLuck.value = String(shop.luck);
      refreshLuckPreview(shop.luck);
    }
    saveShop();
  }

  function rarityHtml(card) {
    const fromCommon = COMMON_CARD_IDS.has(card.id);
    const fromRare = RARE_CARD_IDS.has(card.id);
    if (fromCommon && fromRare && card.altOneIn) {
      return `<span class="card-rarity"><span class="rarity-common">1/${formatOneIn(card.oneIn)}</span><span class="rarity-sep">-</span><span class="rarity-rare">1/${formatOneIn(card.altOneIn)}</span></span>`;
    }
    if (card.battleOnly) {
      return `<span class="card-rarity">???</span>`;
    }
    if (EVENT_CARD_IDS.has(card.id)) {
      return `<span class="card-rarity rarity-event">1/${formatOneIn(card.oneIn)}</span>`;
    }
    if (fromRare) {
      return `<span class="card-rarity rarity-rare">1/${formatOneIn(card.oneIn)}</span>`;
    }
    return `<span class="card-rarity rarity-common">1/${formatOneIn(card.oneIn)}</span>`;
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
      opts.hp != null ? opts.hp : Math.max(1, ceilMutationStat(card.hp, key));
    const hpHtml = `<span class="card-hp">HP&nbsp;${hp}</span>`;
    const name = spec ? `${spec.prefix} ${card.name}` : card.name;
    const mutClass = spec ? spec.className : "";
    const sparkles =
      spec && (spec.id === "shiny" || spec.id === "gold")
        ? `<div class="card-sparkles" aria-hidden="true"></div>`
        : "";
    const crystal =
      spec && spec.id === "diamond" ? `<div class="card-crystal" aria-hidden="true"></div>` : "";
    const flame =
      spec && spec.id === "fire" ? `<div class="card-flame" aria-hidden="true"><span>🔥</span></div>` : "";
    const healAura =
      spec && spec.id === "healing" ? `<div class="card-heal" aria-hidden="true"><span>💚</span></div>` : "";
    return `
      <article class="animal-card theme-${card.theme} ${compact ? "compact" : ""} ${mutClass}" data-card-id="${escapeHtml(key)}">
        <div class="card-texture" aria-hidden="true"></div>
        <div class="card-pattern" aria-hidden="true"></div>
        <div class="card-sheen" aria-hidden="true"></div>
        <div class="card-frame" aria-hidden="true"></div>
        ${sparkles}
        ${crystal}
        ${flame}
        ${healAura}
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

  function poolEntryOneIn(entry) {
    const n = Number(entry && entry.oneIn);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  function pickPoolEntry(pool) {
    if (!pool || !pool.length) return null;
    const weights = pool.map((c) => 1 / poolEntryOneIn(c));
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i += 1) {
      r -= weights[i];
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  function drawablePool(pool) {
    const luck = effectiveLuck();
    const kept = pool.filter((entry) => {
      const oneIn = poolEntryOneIn(entry);
      return oneIn / luck > 1;
    });
    if (kept.length) return kept;
    let rarest = 0;
    for (const entry of pool) rarest = Math.max(rarest, poolEntryOneIn(entry));
    return pool.filter((entry) => poolEntryOneIn(entry) === rarest);
  }

  function weightedDraw(pool) {
    const entry = pickPoolEntry(drawablePool(pool)) || pickPoolEntry(pool);
    return CARDS[entry.id] || entry;
  }

  function poolForPack(pack) {
    if (pack.pool === "rare") return RARE_POOL;
    if (pack.pool === "electrified") return ELECTRIFIED_POOL;
    return COMMON_POOL;
  }

  function isAutoSell(cardId) {
    return Boolean(player.autoSell && player.autoSell[cardId]);
  }

  function markIndexFound(cardId) {
    const baseId = parseCardKey(cardId).baseId;
    if (!CARDS[baseId] || CARDS[baseId].battleOnly) return;
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

  function snapshotEventQuests(list) {
    return (Array.isArray(list) ? list : []).slice(0, EVENT_QUEST_SLOT_COUNT).map((q) => ({
      uid: q.uid,
      type: q.type,
      progress: q.progress || 0,
    }));
  }

  function sanitizeEventQuests(raw) {
    if (!Array.isArray(raw)) return [];
    const seen = new Set();
    const out = [];
    for (const q of raw) {
      if (!q || !EVENT_QUEST_DEFS[q.type] || seen.has(q.type)) continue;
      seen.add(q.type);
      const def = EVENT_QUEST_DEFS[q.type];
      out.push({
        uid: typeof q.uid === "string" && q.uid ? q.uid : newQuestUid(),
        type: q.type,
        progress: Math.max(0, Math.min(def.target, Math.floor(Number(q.progress) || 0))),
      });
      if (out.length >= EVENT_QUEST_SLOT_COUNT) break;
    }
    return out;
  }

  function unusedEventQuestTypes(existing) {
    const used = new Set(existing.map((q) => q.type));
    return EVENT_QUEST_ORDER.filter((type) => !used.has(type));
  }

  function createEventQuest(type) {
    return { uid: newQuestUid(), type, progress: 0 };
  }

  function fillEventQuestSlots(quests, locks = []) {
    const pending = pruneQuestLocks(locks);
    if (locks) {
      locks.length = 0;
      locks.push(...pending);
    }
    while (quests.length + pending.length < EVENT_QUEST_SLOT_COUNT) {
      const types = unusedEventQuestTypes(quests);
      if (!types.length) break;
      quests.push(createEventQuest(pickRandom(types)));
    }
    return quests;
  }

  function ensureEventQuests() {
    if (!Array.isArray(player.eventQuests)) player.eventQuests = [];
    if (!Array.isArray(player.eventQuestLocks)) player.eventQuestLocks = [];
    player.eventQuests = sanitizeEventQuests(player.eventQuests);
    player.eventQuestLocks = pruneQuestLocks(player.eventQuestLocks).slice(0, EVENT_QUEST_SLOT_COUNT);
    fillEventQuestSlots(player.eventQuests, player.eventQuestLocks);
    applyInstantQuests(player.eventQuests);
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

  function sanitizeQuestLocks(raw, max = QUEST_SLOT_COUNT) {
    if (!Array.isArray(raw)) return [];
    const now = Date.now();
    return raw
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n) && n > now)
      .slice(0, max);
  }

  function pruneQuestLocks(locks) {
    const now = Date.now();
    const next = (locks || []).filter((n) => Number.isFinite(n) && n > now);
    if (shop.noQuestCooldown) next.length = 0;
    return next;
  }

  function snapshotCraftJobs(list) {
    return sanitizeCraftJobs(list);
  }

  function sanitizeCraftJobs(raw) {
    if (!Array.isArray(raw)) return [];
    const out = [];
    for (const job of raw) {
      if (!job || !CRAFT_RECIPES[job.recipeId]) continue;
      const readyAt = Number(job.readyAt);
      if (!Number.isFinite(readyAt) || readyAt <= 0) continue;
      out.push({
        id: typeof job.id === "string" && job.id ? job.id : newCraftJobId(),
        recipeId: job.recipeId,
        readyAt,
      });
    }
    return out;
  }

  function newCraftJobId() {
    return `cj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function ownedBaseCardCount(cardId) {
    return player.cards[cardId] || 0;
  }

  function ownedMutationCardCount(mutation) {
    let n = 0;
    for (const [key, count] of Object.entries(player.cards || {})) {
      if (count > 0 && parseCardKey(key).mutation === mutation) n += Number(count) || 0;
    }
    return n;
  }

  function takeOwnedCardCopy(key) {
    if (!(player.cards[key] > 0)) return false;
    player.cards[key] -= 1;
    if (player.cards[key] <= 0) delete player.cards[key];
    player.sellSlots = (player.sellSlots || []).map((slot) => {
      if (slot !== key) return slot;
      return player.cards[key] > 0 ? slot : null;
    });
    return true;
  }

  function recipeCoinCost(recipe) {
    const n = Number(recipe && recipe.coins);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  function formatCraftWait(recipe) {
    if (shop.noCraftWait) return "Instant";
    const mins = Math.max(1, Math.round((recipe && recipe.craftMs ? recipe.craftMs : FIRE_GEM_CRAFT_MS) / 60000));
    return `${mins} min`;
  }

  function recipeMatOwned(mat) {
    if (!mat) return 0;
    if (mat.itemId) return Math.max(0, Math.floor(Number(player.items[mat.itemId]) || 0));
    if (mat.cardId) return ownedBaseCardCount(mat.cardId);
    return 0;
  }

  function canAffordRecipe(recipe) {
    if (!recipe) return false;
    if ((player.coins || 0) < recipeCoinCost(recipe)) return false;
    if (recipe.pick) {
      return ownedMutationCardCount(recipe.pick.mutation) >= recipe.pick.count;
    }
    return (recipe.materials || []).every((mat) => recipeMatOwned(mat) >= mat.count);
  }

  function canConsumePicks(recipe, picks) {
    if (!recipe || !recipe.pick || !Array.isArray(picks) || picks.length !== recipe.pick.count) return false;
    if ((player.coins || 0) < recipeCoinCost(recipe)) return false;
    const used = {};
    for (const key of picks) {
      if (!baseCard(key) || parseCardKey(key).mutation !== recipe.pick.mutation) return false;
      used[key] = (used[key] || 0) + 1;
      if ((player.cards[key] || 0) < used[key]) return false;
    }
    return true;
  }

  function consumeRecipeMaterials(recipe, picks) {
    if (recipe && recipe.pick) {
      if (!canConsumePicks(recipe, picks)) return false;
      const coins = recipeCoinCost(recipe);
      if (coins) player.coins -= coins;
      for (const key of picks) takeOwnedCardCopy(key);
      return true;
    }
    if (!canAffordRecipe(recipe)) return false;
    const coins = recipeCoinCost(recipe);
    if (coins) player.coins -= coins;
    for (const mat of recipe.materials) {
      if (mat.itemId) {
        player.items[mat.itemId] = Math.max(0, (player.items[mat.itemId] || 0) - mat.count);
        if (player.items[mat.itemId] <= 0) delete player.items[mat.itemId];
      } else if (mat.cardId) {
        player.cards[mat.cardId] -= mat.count;
        if (player.cards[mat.cardId] <= 0) delete player.cards[mat.cardId];
      }
    }
    return true;
  }

  function enqueueCraftJob(recipe) {
    if (!Array.isArray(player.craftJobs)) player.craftJobs = [];
    const wait = shop.noCraftWait ? 0 : recipe.craftMs;
    player.craftJobs.push({
      id: newCraftJobId(),
      recipeId: recipe.id,
      readyAt: Date.now() + wait,
    });
    savePlayer();
    renderPlayerUi();
    renderCrafting();
  }

  function clearCraftPicks() {
    pendingCraftRecipeId = null;
    pendingCraftPicks = [];
  }

  function openCraftMaterialPicker(recipeId) {
    const recipe = CRAFT_RECIPES[recipeId];
    if (!recipe || !recipe.pick) return;
    if (!canAffordRecipe(recipe)) return;
    pendingCraftRecipeId = recipeId;
    pendingCraftPicks = [];
    openInventory("craft");
  }

  function finishCraftMaterialPicks() {
    const recipe = CRAFT_RECIPES[pendingCraftRecipeId];
    const picks = pendingCraftPicks.slice();
    clearCraftPicks();
    inventoryMode = "browse";
    if (!recipe || !consumeRecipeMaterials(recipe, picks)) {
      selectedCraftRecipeId = recipe ? recipe.id : selectedCraftRecipeId;
      craftTab = "bench";
      showScreen("crafting");
      renderCrafting();
      return;
    }
    selectedCraftRecipeId = recipe.id;
    craftTab = "bench";
    enqueueCraftJob(recipe);
    showScreen("crafting");
  }

  function startCraftRecipe(recipeId) {
    const recipe = CRAFT_RECIPES[recipeId];
    if (!recipe) return;
    selectedCraftRecipeId = recipe.id;
    if (recipe.pick) {
      openCraftMaterialPicker(recipeId);
      return;
    }
    if (!consumeRecipeMaterials(recipe)) return;
    enqueueCraftJob(recipe);
  }

  function craftJobReady(job) {
    if (!job) return false;
    if (shop.noCraftWait) return true;
    return job.readyAt <= Date.now();
  }

  function craftJobProgress(job) {
    if (craftJobReady(job)) return 1;
    const recipe = CRAFT_RECIPES[job.recipeId];
    const total = recipe && recipe.craftMs ? recipe.craftMs : FIRE_GEM_CRAFT_MS;
    const startAt = job.readyAt - total;
    return Math.min(1, Math.max(0, (Date.now() - startAt) / total));
  }

  function claimCraftJob(jobId) {
    if (!Array.isArray(player.craftJobs)) return;
    const idx = player.craftJobs.findIndex((job) => job.id === jobId);
    if (idx < 0) return;
    const job = player.craftJobs[idx];
    if (!craftJobReady(job)) return;
    const recipe = CRAFT_RECIPES[job.recipeId];
    if (!recipe) {
      player.craftJobs.splice(idx, 1);
      savePlayer();
      renderCrafting();
      return;
    }
    player.craftJobs.splice(idx, 1);
    player.items[recipe.itemId] = (player.items[recipe.itemId] || 0) + 1;
    progressQuests({ craftItem: recipe.itemId });
    savePlayer();
    renderPlayerUi();
    renderCrafting();
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
    ensureEventQuests();
  }

  function questDef(quest) {
    if (!quest) return null;
    return EVENT_QUEST_DEFS[quest.type] || QUEST_DEFS[quest.type] || null;
  }

  function questTarget(quest) {
    const def = questDef(quest);
    return def ? def.target : 1;
  }

  function questTitle(quest) {
    if (quest.type === "obtain") {
      const card = CARDS[quest.cardId];
      return card ? `Obtain a ${card.name}` : "Obtain a card";
    }
    const def = questDef(quest);
    return def ? def.title : "Quest";
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

  function electrifiedPackReward(count) {
    const n = Math.max(0, Math.floor(Number(count) || 0));
    return {
      packs: n ? { "electrified-pack": n } : undefined,
      label: n === 1 ? "1 Electrified Pack" : `${n} Electrified Packs`,
    };
  }

  function questReward(quest) {
    if (!quest) return { label: "" };
    const eventDef = EVENT_QUEST_DEFS[quest.type];
    if (eventDef) return electrifiedPackReward(eventDef.packs);
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
    const daily = player.quests.filter(isQuestReady).length;
    const event = (player.eventQuests || []).filter(isQuestReady).length;
    return daily + event;
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

  function setQuestProgressAtLeast(quest, value) {
    if (!quest || isQuestReady(quest)) return false;
    const n = Math.max(0, Math.floor(Number(value) || 0));
    const next = Math.min(questTarget(quest), Math.max(quest.progress, n));
    if (next === quest.progress) return false;
    quest.progress = next;
    return true;
  }

  function cardGainQty(update, predicate) {
    let n = 0;
    if (Array.isArray(update.cardGains)) {
      for (const row of update.cardGains) {
        if (!row || !predicate(row.cardId)) continue;
        n += Math.max(0, Math.floor(Number(row.qty) || 0));
      }
      return n;
    }
    if (!Array.isArray(update.cardIds)) return 0;
    for (const id of update.cardIds) {
      if (predicate(id)) n += 1;
    }
    return n;
  }

  function progressQuests(update) {
    ensureQuestBoard();
    let changed = false;
    const quests = [...player.quests, ...(player.eventQuests || [])];
    for (const quest of quests) {
      const def = questDef(quest);
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
        if (update.packId === "common-pack" && (quest.type === "open-common-30" || quest.type === "eq-open-common-5")) {
          changed = bumpQuestProgress(quest, 1) || changed;
        }
        if (update.packId === "rare-pack" && (quest.type === "open-rare-10" || quest.type === "eq-open-rare-3")) {
          changed = bumpQuestProgress(quest, 1) || changed;
        }
      }
      if (update.cardIds && quest.type === "obtain" && update.cardIds.includes(quest.cardId)) {
        changed = bumpQuestProgress(quest, 1) || changed;
      }
      if (def && def.collectBaseId) {
        const gained = cardGainQty(
          update,
          (id) => id && parseCardKey(id).baseId === def.collectBaseId
        );
        if (gained) changed = bumpQuestProgress(quest, gained) || changed;
      }
      if (update.soldCards && (quest.type === "eq-sell-100" || quest.type === "eq-sell-30")) {
        changed = bumpQuestProgress(quest, update.soldCards) || changed;
      }
      if (update.mutate && quest.type === "eq-mutate-10") {
        changed = bumpQuestProgress(quest, update.mutate) || changed;
      }
      if (update.diamondMutate && quest.type === "eq-mutate-diamond") {
        changed = bumpQuestProgress(quest, 1) || changed;
      }
      if (update.craftItem === "fire-gem" && quest.type === "eq-craft-fire-gem") {
        changed = bumpQuestProgress(quest, 1) || changed;
      }
      if (update.trialWave && def && def.trialReach) {
        changed = setQuestProgressAtLeast(quest, update.trialWave) || changed;
      }
      if (update.npcWin === "demonBoss" && quest.type === "eq-beat-demon-boss") {
        changed = bumpQuestProgress(quest, 1) || changed;
      }
      if (update.npcDanger && quest.type === "eq-beat-bosses-3") {
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
    if (!Array.isArray(player.eventQuestLocks)) player.eventQuestLocks = [];
    if (!Array.isArray(player.eventQuests)) player.eventQuests = [];
    const beforeLocks = player.questLocks.length;
    const beforeQuests = player.quests.length;
    const beforeEventLocks = player.eventQuestLocks.length;
    const beforeEventQuests = player.eventQuests.length;
    player.questLocks = pruneQuestLocks(player.questLocks);
    fillQuestSlots(player.quests, player.questLocks);
    applyInstantQuests(player.quests);
    player.eventQuestLocks = pruneQuestLocks(player.eventQuestLocks).slice(0, EVENT_QUEST_SLOT_COUNT);
    fillEventQuestSlots(player.eventQuests, player.eventQuestLocks);
    applyInstantQuests(player.eventQuests);
    const rolled =
      player.questLocks.length !== beforeLocks ||
      player.quests.length !== beforeQuests ||
      player.eventQuestLocks.length !== beforeEventLocks ||
      player.eventQuests.length !== beforeEventQuests;
    if (rolled) {
      savePlayer();
      updateQuestBadge();
    }
    if (
      currentScreen === "quests" &&
      ((questTab === "daily" && (rolled || player.questLocks.length)) ||
        (questTab === "event" && (rolled || player.eventQuestLocks.length)))
    ) {
      renderQuests();
    }
  }

  function questThumbHtml(quest) {
    if (quest.type === "obtain") {
      const card = CARDS[quest.cardId];
      return card ? `<span class="quest-thumb">${cardArtHtml(card)}</span>` : "";
    }
    const def = questDef(quest);
    const collectId = def && def.collectBaseId;
    if (collectId && CARDS[collectId]) {
      return `<span class="quest-thumb">${cardArtHtml(CARDS[collectId])}</span>`;
    }
    return "";
  }

  function questCardHtml(quest, { refreshable = false } = {}) {
    const ready = isQuestReady(quest);
    const pct = Math.round((quest.progress / questTarget(quest)) * 100);
    const reward = questReward(quest);
    const thumb = questThumbHtml(quest);
    const refreshBtn = refreshable
      ? `<button type="button" class="quest-refresh" data-refresh-quest="${escapeHtml(quest.uid)}" title="Refresh quest" aria-label="Refresh quest">↻</button>`
      : "";
    const status = ready
      ? `<button type="button" class="btn btn-primary" data-claim-quest="${escapeHtml(quest.uid)}">Claim</button>`
      : `<span class="quest-pending">In progress</span>`;
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
        <div class="quest-card-actions">
          ${refreshBtn}
          ${status}
        </div>
      </article>
    `;
  }

  function cooldownQuestCardHtml(readyAt) {
    const remain = formatCountdown(readyAt - Date.now());
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
  }

  function renderQuestLockCards(locks) {
    const now = Date.now();
    return (locks || [])
      .filter((t) => t > now)
      .map((readyAt) => cooldownQuestCardHtml(readyAt))
      .join("");
  }

  function renderQuests() {
    ensureQuestBoard();
    const eventMode = questTab === "event";
    els.questsHeading.textContent = eventMode ? "Event Quests" : "Quests";
    els.questsCopy.textContent = eventMode
      ? questClaimFlash && Date.now() < questClaimFlashUntil
        ? questClaimFlash
        : shop.noQuestCooldown
          ? "Five random event quests. Claim or refresh to roll a new one."
          : "Five random event quests. Claim or refresh, then wait 30 minutes for a new one."
      : questClaimFlash && Date.now() < questClaimFlashUntil
        ? questClaimFlash
        : shop.noQuestCooldown
          ? "Three active quests. Claim a finished one to roll a new task."
          : "Three active quests. After a claim, a new quest rolls in 30 minutes.";
    document.querySelectorAll("[data-quest-tab]").forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-quest-tab") === questTab);
    });
    els.questsEventEmpty.hidden = true;
    els.questsList.hidden = false;
    if (eventMode) {
      const questCards = (player.eventQuests || []).map((quest) =>
        questCardHtml(quest, { refreshable: true })
      );
      const lockCards = renderQuestLockCards(player.eventQuestLocks);
      const html = `${questCards.join("")}${lockCards}`;
      if (!html) {
        els.questsList.hidden = true;
        els.questsEventEmpty.hidden = false;
        els.questsList.innerHTML = "";
      } else {
        els.questsList.innerHTML = html;
      }
      updateQuestBadge();
      return;
    }
    const questCards = player.quests.map((quest) => questCardHtml(quest));
    els.questsList.innerHTML = `${questCards.join("")}${renderQuestLockCards(player.questLocks)}`;
    updateQuestBadge();
  }

  function pushEventQuestLock() {
    if (!Array.isArray(player.eventQuestLocks)) player.eventQuestLocks = [];
    if (!shop.noQuestCooldown) {
      player.eventQuestLocks.push(Date.now() + QUEST_COOLDOWN_MS);
    }
  }

  function claimEventQuest(uid) {
    ensureEventQuests();
    const index = player.eventQuests.findIndex((q) => q.uid === uid);
    if (index < 0) return;
    const quest = player.eventQuests[index];
    if (!isQuestReady(quest)) return;
    const reward = grantQuestReward(quest);
    player.eventQuests.splice(index, 1);
    pushEventQuestLock();
    fillEventQuestSlots(player.eventQuests, player.eventQuestLocks);
    applyInstantQuests(player.eventQuests);
    questClaimFlash = reward.label ? `Claimed · ${reward.label}` : "Quest claimed.";
    questClaimFlashUntil = Date.now() + 4000;
    savePlayer();
    renderQuests();
    renderPlayerUi();
  }

  function refreshEventQuest(uid) {
    ensureEventQuests();
    const index = player.eventQuests.findIndex((q) => q.uid === uid);
    if (index < 0) return;
    player.eventQuests.splice(index, 1);
    pushEventQuestLock();
    fillEventQuestSlots(player.eventQuests, player.eventQuestLocks);
    applyInstantQuests(player.eventQuests);
    questClaimFlash = shop.noQuestCooldown
      ? "Quest skipped."
      : "Quest skipped. A new one rolls in 30 minutes.";
    questClaimFlashUntil = Date.now() + 4000;
    savePlayer();
    renderQuests();
    renderPlayerUi();
  }

  function claimQuest(uid) {
    if ((player.eventQuests || []).some((q) => q.uid === uid)) {
      claimEventQuest(uid);
      return;
    }
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
      els.itemDiscardModal,
      els.battleItemModal,
      els.loginRequiredModal,
      els.restockTokenModal,
      els.fireMutateModal,
      els.engineChargeModal,
      els.craftResult,
      els.battleReward,
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
    progressQuests({
      packId,
      cardIds: drawn.map((card) => card.id),
      cardGains: drawn.map((card) => ({ cardId: card.id, qty: 1 })),
      soldCards: soldFlags.filter(Boolean).length,
    });
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
      return `<button type="button" class="index-slot index-slot-found" data-index-card="${escapeHtml(id)}" aria-label="View ${escapeHtml(card.name)} stats">${cardFaceHtml(card, { qty, compact: true })}</button>`;
    }).join("");
    updateIndexBadge();
  }

  function packNamesForCard(id) {
    const names = [];
    if (COMMON_CARD_IDS.has(id)) names.push(PACKS["common-pack"].name);
    if (RARE_CARD_IDS.has(id)) names.push(PACKS["rare-pack"].name);
    if (EVENT_CARD_IDS.has(id)) names.push(PACKS["electrified-pack"].name);
    return names;
  }

  function hideIndexDetail() {
    if (els.indexDetailModal) els.indexDetailModal.hidden = true;
  }

  function openIndexDetail(id) {
    const card = CARDS[id];
    if (!card || !els.indexDetailModal) return;
    if (!(player.indexFound && player.indexFound[id])) return;
    els.indexDetailTitle.textContent = card.name;
    els.indexDetailCard.innerHTML = cardFaceHtml(card, { qty: ownedCardCount(id) });
    const packs = packNamesForCard(id);
    els.indexDetailPack.textContent = packs.length
      ? `Found in ${packs.join(" · ")}`
      : "Not found in a pack.";
    const moves = Array.isArray(card.moves) ? card.moves : [];
    els.indexDetailMoves.innerHTML = moves.length
      ? moves
          .map(
            (move) => `
        <li class="index-detail-move">
          <span class="index-detail-move-name">${escapeHtml(move.name)}</span>
          <span class="index-detail-move-stat">${escapeHtml(battleMoveStat(move, null))}</span>
        </li>`
          )
          .join("")
      : `<li class="index-detail-move is-empty">No moves.</li>`;
    els.indexDetailModal.hidden = false;
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

  function craftJobRowsHtml(recipeId) {
    const jobs = (Array.isArray(player.craftJobs) ? player.craftJobs : []).filter(
      (job) => !recipeId || job.recipeId === recipeId
    );
    if (!jobs.length) return "";
    return `<div class="craft-jobs">${jobs
      .map((job) => {
        const def = CRAFT_RECIPES[job.recipeId] || CRAFT_RECIPES["fire-gem"];
        const ready = craftJobReady(job);
        const wait = formatCountdown(job.readyAt - Date.now());
        const pct = Math.round(craftJobProgress(job) * 100);
        return `
          <div class="craft-job${ready ? " is-ready" : ""}">
            <div class="craft-job-icon" aria-hidden="true">${def.mark || "🔥"}</div>
            <div class="craft-job-body">
              <div class="craft-job-top">
                <strong>${escapeHtml(def.name)}</strong>
                <span class="item-note" data-craft-timer="${escapeHtml(job.id)}">${
                  ready ? "Ready to claim" : wait
                }</span>
              </div>
              <div class="craft-job-track" aria-hidden="true">
                <span data-craft-bar="${escapeHtml(job.id)}" style="width:${pct}%"></span>
              </div>
            </div>
            <button type="button" class="btn ${ready ? "btn-primary" : "btn-secondary"}" data-claim-craft="${escapeHtml(job.id)}" ${
              ready ? "" : "disabled"
            }>Claim</button>
          </div>`;
      })
      .join("")}</div>`;
  }

  function craftRecipeDetailHtml(recipe) {
    const coinCost = recipeCoinCost(recipe);
    const coinOwned = player.coins || 0;
    const coinChip = coinCost
      ? `<div class="craft-chip${coinOwned >= coinCost ? "" : " is-short"}">
        <div class="craft-chip-art craft-chip-coin" aria-hidden="true">$</div>
        <div class="craft-chip-meta">
          <strong>Coins</strong>
          <span>×${coinCost.toLocaleString()}</span>
          <span class="craft-chip-have">${coinOwned.toLocaleString()}/${coinCost.toLocaleString()}</span>
        </div>
      </div>
      <span class="craft-op" aria-hidden="true">+</span>`
      : "";
    let materialBits = "";
    if (recipe.pick) {
      const spec = MUTATION_SPECS[recipe.pick.mutation];
      const owned = ownedMutationCardCount(recipe.pick.mutation);
      const enough = owned >= recipe.pick.count;
      const label = spec ? `${spec.label} card` : "Mutated card";
      materialBits = `
      <div class="craft-chip${enough ? "" : " is-short"}">
        <div class="craft-chip-art craft-chip-mut craft-chip-mut-${escapeHtml(recipe.pick.mutation)}" aria-hidden="true">${
          recipe.pick.mutation === "silver" ? "🥈" : "✨"
        }</div>
        <div class="craft-chip-meta">
          <strong>${escapeHtml(label)}</strong>
          <span>×${recipe.pick.count}</span>
          <span class="craft-chip-have">${owned}/${recipe.pick.count}</span>
        </div>
      </div>`;
    } else {
      materialBits = (recipe.materials || [])
        .map((mat, i) => {
          const item = mat.itemId ? ITEMS[mat.itemId] : null;
          const card = mat.cardId ? CARDS[mat.cardId] : null;
          const owned = recipeMatOwned(mat);
          const enough = owned >= mat.count;
          const plus = i > 0 ? `<span class="craft-op" aria-hidden="true">+</span>` : "";
          const name = item ? item.name : card ? card.name : mat.itemId || mat.cardId;
          const art = item
            ? `<div class="craft-chip-art craft-chip-gem" aria-hidden="true">${item.id === "potion" ? "🧪" : "✦"}</div>`
            : `<div class="craft-chip-art">${card ? cardArtHtml(card) : ""}</div>`;
          return `
      ${plus}
      <div class="craft-chip${enough ? "" : " is-short"}">
        ${art}
        <div class="craft-chip-meta">
          <strong>${escapeHtml(name)}</strong>
          <span>×${mat.count}</span>
          <span class="craft-chip-have">${owned}/${mat.count}</span>
        </div>
      </div>`;
        })
        .join("");
    }
    const canCraft = canAffordRecipe(recipe);
    const jobs = craftJobRowsHtml(recipe.id);
    return `
      <button type="button" class="btn-back craft-detail-back" data-craft-grid-back="1">← Recipes</button>
      <article class="craft-recipe craft-recipe-${escapeHtml(recipe.theme || "fire")}">
        <div class="craft-recipe-head">
          <div class="craft-gem-mark" aria-hidden="true">${recipe.mark || "🔥"}</div>
          <div>
            <h3>${escapeHtml(recipe.name)}</h3>
            <p class="craft-recipe-stats">${escapeHtml(recipe.stats || recipe.blurb || "")}</p>
          </div>
        </div>
        <div class="craft-flow">
          ${coinChip}
          ${materialBits}
          <span class="craft-op" aria-hidden="true">→</span>
          <div class="craft-chip craft-chip-out">
            <div class="craft-chip-art craft-chip-gem" aria-hidden="true">${recipe.mark || "🔥"}</div>
            <div class="craft-chip-meta">
              <strong>${escapeHtml(recipe.name)}</strong>
              <span>${formatCraftWait(recipe)}</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-primary craft-go" data-craft-recipe="${escapeHtml(recipe.id)}" ${
          canCraft ? "" : "disabled"
        }>Craft</button>
      </article>
      <div class="craft-claim-area">
        <h3 class="craft-claim-head">Claim</h3>
        ${jobs || `<p class="inventory-empty">No crafts in progress.</p>`}
      </div>`;
  }

  function luckPotionStockCount() {
    applyDueRestocks();
    if (shop.infiniteStock) return Infinity;
    return Math.max(0, Math.floor(Number(shop.luckPotionStock) || 0));
  }

  function crafterGoodStock(good) {
    applyDueRestocks();
    if (!good || !good.stockKey) return Infinity;
    if (shop.infiniteStock) return Infinity;
    return Math.max(0, Math.floor(Number(shop[good.stockKey]) || 0));
  }

  function buyCrafterGood(id) {
    const good = CRAFTER_SHOP_GOODS.find((item) => item.id === id);
    if (!good) return;
    applyDueRestocks();
    const stock = crafterGoodStock(good);
    if (player.coins < good.price) return;
    if (stock !== Infinity && stock <= 0) return;
    player.coins -= good.price;
    if (good.stockKey && !shop.infiniteStock) {
      shop[good.stockKey] = Math.max(0, stock - 1);
      saveShop();
    }
    player.items[good.id] = (player.items[good.id] || 0) + 1;
    savePlayer();
    renderPlayerUi();
    renderCrafting();
  }

  function buyLuckIPotion() {
    buyCrafterGood("luck-i-potion");
  }

  function renderCrafterShop() {
    applyDueRestocks();
    const remaining = Math.max(0, shop.nextRestockAt - Date.now());
    const timer = shop.infiniteStock
      ? "Infinite stock enabled"
      : `Restock in ${formatCountdown(remaining)}`;
    const rows = CRAFTER_SHOP_GOODS.map((good) => {
      const stock = crafterGoodStock(good);
      const soldOut = stock !== Infinity && stock <= 0;
      const canBuy = !soldOut && player.coins >= good.price;
      const stockLabel =
        stock === Infinity ? (good.stockKey && shop.infiniteStock ? "In stock: ∞" : "Always in stock") : formatStockLabel(stock);
      return `
      <article class="crafter-shop-item is-${escapeHtml(good.theme || "luck")}">
        <div class="crafter-shop-mark" aria-hidden="true">${good.mark}</div>
        <div class="crafter-shop-copy">
          <h3>${escapeHtml(good.name)}</h3>
          <p>${escapeHtml(good.blurb)}</p>
          <p class="crafter-shop-meta">${good.price.toLocaleString()} Coins · ${stockLabel}</p>
        </div>
        <button type="button" class="btn btn-primary" data-buy-crafter="${escapeHtml(good.id)}" ${
          canBuy ? "" : "disabled"
        }>Buy</button>
      </article>`;
    }).join("");
    els.craftingMain.innerHTML = `
      <h2>Crafter's Shop</h2>
      <p class="panel-copy">Buy potions and gems for your bench. Stock refreshes with the card shop.</p>
      <p class="coin-badge crafter-shop-coins"><span class="coin-label">Coins</span> <strong>${player.coins.toLocaleString()}</strong></p>
      <p class="restock-timer" id="crafter-shop-timer">${timer}</p>
      <div class="crafter-shop-list">${rows}</div>
    `;
  }

  function renderCrafting() {
    if (!els.craftingMain) return;
    document.querySelectorAll("[data-craft-tab]").forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-craft-tab") === craftTab);
    });
    if (craftTab === "shop") {
      renderCrafterShop();
      return;
    }
    if (craftTab === "bench") {
      const recipe = selectedCraftRecipeId ? CRAFT_RECIPES[selectedCraftRecipeId] : null;
      if (recipe) {
        els.craftingMain.innerHTML = `
          <h2>Crafting bench</h2>
          <p class="panel-copy">Craft this recipe, then claim it from the queue.</p>
          ${craftRecipeDetailHtml(recipe)}
        `;
        return;
      }
      const jobs = Array.isArray(player.craftJobs) ? player.craftJobs : [];
      const tiles = Object.values(CRAFT_RECIPES)
        .map((item) => {
          const pending = jobs.filter((job) => job.recipeId === item.id);
          const ready = pending.some((job) => craftJobReady(job));
          const badge = ready
            ? `<span class="craft-tile-badge is-ready">Ready</span>`
            : pending.length
              ? `<span class="craft-tile-badge">${pending.length}</span>`
              : "";
          return `
            <button type="button" class="craft-recipe-tile craft-recipe-${escapeHtml(item.theme || "fire")}" data-open-recipe="${escapeHtml(item.id)}">
              ${badge}
              <span class="craft-gem-mark" aria-hidden="true">${item.mark || "🔥"}</span>
              <strong>${escapeHtml(item.name)}</strong>
              <span class="craft-tile-wait">${formatCraftWait(item)}</span>
            </button>`;
        })
        .join("");
      els.craftingMain.innerHTML = `
        <h2>Crafting bench</h2>
        <p class="panel-copy">Pick a recipe to craft and claim.</p>
        <div class="craft-recipe-grid">${tiles}</div>
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

  function gemItemDef(itemId = pendingGemItemId) {
    return itemId ? GEM_ITEMS[itemId] || null : null;
  }

  function openGemPicker(itemId) {
    if (!(player.items[itemId] > 0) || !GEM_ITEMS[itemId]) return;
    pendingGemItemId = itemId;
    pendingClearItemId = null;
    pendingFireCardKey = null;
    openInventory("mutate");
  }

  function clearItemDef(itemId = pendingClearItemId) {
    return itemId ? CLEAR_ITEMS[itemId] || null : null;
  }

  function mutationReturnGem(mutation) {
    return MUTATION_RETURN_GEM[mutation] || "";
  }

  function openClearPicker(itemId) {
    if (!(player.items[itemId] > 0) || !CLEAR_ITEMS[itemId]) return;
    pendingClearItemId = itemId;
    pendingGemItemId = null;
    pendingFireCardKey = null;
    openInventory("clear");
  }

  function closeFireConfirm() {
    pendingFireCardKey = null;
    if (els.fireMutateModal) els.fireMutateModal.hidden = true;
    refreshFabs();
  }

  function cancelFireMutate() {
    closeFireConfirm();
    inventoryMode = "browse";
    inventoryTab = "items";
    pendingGemItemId = null;
    pendingClearItemId = null;
    showScreen("inventory");
    renderInventoryList();
  }

  function promptFireMutate(cardKeyVal) {
    const gem = gemItemDef();
    if (!gem || !(player.items[gem.itemId] > 0)) return;
    if (!baseCard(cardKeyVal) || parseCardKey(cardKeyVal).mutation) return;
    if (!(player.cards[cardKeyVal] > 0)) return;
    pendingFireCardKey = cardKeyVal;
    if (els.fireMutateTitle) els.fireMutateTitle.textContent = gem.title;
    if (els.fireMutateCopy) {
      els.fireMutateCopy.textContent = `Are you sure you want to apply the ${gem.title} to ${cardDisplayName(cardKeyVal)}.`;
    }
    if (els.fireMutateModal) els.fireMutateModal.hidden = false;
    refreshFabs();
  }

  function confirmFireMutate() {
    const gem = gemItemDef();
    const fromKey = pendingFireCardKey;
    closeFireConfirm();
    if (!gem || !(player.items[gem.itemId] > 0) || !fromKey || parseCardKey(fromKey).mutation) {
      cancelFireMutate();
      return;
    }
    if (!(player.cards[fromKey] > 0)) {
      cancelFireMutate();
      return;
    }
    const parsed = parseCardKey(fromKey);
    const toKey = cardKey(parsed.baseId, gem.mutation);
    player.items[gem.itemId] -= 1;
    if (player.items[gem.itemId] <= 0) delete player.items[gem.itemId];
    player.cards[fromKey] -= 1;
    if (player.cards[fromKey] <= 0) delete player.cards[fromKey];
    player.cards[toKey] = (player.cards[toKey] || 0) + 1;
    player.sellSlots = (player.sellSlots || []).map((slot) => {
      if (slot !== fromKey) return slot;
      return player.cards[fromKey] > 0 ? slot : toKey;
    });
    pendingGemItemId = null;
    progressQuests({
      mutate: 1,
      diamondMutate: gem.mutation === "diamond",
    });
    savePlayer();
    inventoryMode = "browse";
    inventoryTab = "cards";
    renderPlayerUi();
    showScreen("inventory");
    renderInventoryList();
  }

  function promptClearMutate(cardKeyVal) {
    const clear = clearItemDef();
    if (!clear || !(player.items[clear.itemId] > 0)) return;
    const parsed = parseCardKey(cardKeyVal);
    if (!baseCard(cardKeyVal) || !parsed.mutation) return;
    if (!(player.cards[cardKeyVal] > 0)) return;
    pendingFireCardKey = cardKeyVal;
    const spec = MUTATION_SPECS[parsed.mutation];
    const refundId = clear.refund ? mutationReturnGem(parsed.mutation) : "";
    const refundItem = refundId ? ITEMS[refundId] : null;
    if (els.fireMutateTitle) els.fireMutateTitle.textContent = clear.title;
    if (els.fireMutateCopy) {
      const extra = clear.refund
        ? refundItem
          ? ` The ${refundItem.name} will be returned.`
          : " This mutation has no gem to return."
        : " The gem is not returned.";
      els.fireMutateCopy.textContent = `Remove the ${spec ? spec.label : ""} Mutation from ${cardDisplayName(
        cardKeyVal
      )}.${extra}`;
    }
    if (els.fireMutateModal) els.fireMutateModal.hidden = false;
    refreshFabs();
  }

  function confirmClearMutate() {
    const clear = clearItemDef();
    const fromKey = pendingFireCardKey;
    closeFireConfirm();
    const parsed = fromKey ? parseCardKey(fromKey) : { baseId: "", mutation: "" };
    if (!clear || !(player.items[clear.itemId] > 0) || !fromKey || !parsed.mutation) {
      cancelFireMutate();
      return;
    }
    if (!(player.cards[fromKey] > 0)) {
      cancelFireMutate();
      return;
    }
    const toKey = parsed.baseId;
    player.items[clear.itemId] -= 1;
    if (player.items[clear.itemId] <= 0) delete player.items[clear.itemId];
    player.cards[fromKey] -= 1;
    if (player.cards[fromKey] <= 0) delete player.cards[fromKey];
    player.cards[toKey] = (player.cards[toKey] || 0) + 1;
    if (clear.refund) {
      const refundId = mutationReturnGem(parsed.mutation);
      if (refundId) player.items[refundId] = (player.items[refundId] || 0) + 1;
    }
    player.sellSlots = (player.sellSlots || []).map((slot) => {
      if (slot !== fromKey) return slot;
      return player.cards[fromKey] > 0 ? slot : toKey;
    });
    pendingClearItemId = null;
    savePlayer();
    inventoryMode = "browse";
    inventoryTab = "cards";
    renderPlayerUi();
    showScreen("inventory");
    renderInventoryList();
  }

  function openFireGemPicker() {
    openGemPicker("fire-gem");
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
    if (rolled) {
      progressQuests({
        mutate: 1,
        diamondMutate: rolled === "diamond",
      });
    }
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
    const craftRecipe = inventoryMode === "craft" ? CRAFT_RECIPES[pendingCraftRecipeId] : null;
    const craftNeed = craftRecipe && craftRecipe.pick ? craftRecipe.pick.count : 0;
    const craftLabel =
      craftRecipe && craftRecipe.pick && MUTATION_SPECS[craftRecipe.pick.mutation]
        ? MUTATION_SPECS[craftRecipe.pick.mutation].label
        : "mutated";
    const gem = gemItemDef();
    const clear = clearItemDef();
    const cardOnlyPick =
      inventoryMode === "sell" ||
      inventoryMode === "battle" ||
      inventoryMode === "mutate" ||
      inventoryMode === "clear" ||
      inventoryMode === "craft";
    const tradePick = inventoryMode === "trade";
    const pickMode = cardOnlyPick || tradePick;

    if (tradePick) {
      els.inventoryTitle.textContent = "Add to offer";
      els.inventoryCopy.textContent =
        inventoryTab === "packs"
          ? "Pick a pack, then choose how many to offer."
          : inventoryTab === "items"
            ? "Pick an item, then choose how many to offer."
            : "Pick a card, then choose how many to offer.";
      document.querySelectorAll(".inv-tab").forEach((tab) => {
        tab.hidden = false;
        tab.classList.toggle("active", tab.getAttribute("data-inv-tab") === inventoryTab);
      });
    } else if (pickMode) {
      els.inventoryTitle.textContent =
        inventoryMode === "sell"
          ? "Station a card"
          : inventoryMode === "battle"
            ? `${pendingBattleKind === "trial" ? "Trial team" : pendingBattleKind === "pvp" ? "Battle team" : "Choose fighters"} (${pendingBattleTeam.length + 1} / ${PLAYER_TEAM_SIZE})`
            : inventoryMode === "craft"
              ? `Choose cards (${pendingCraftPicks.length + 1} / ${craftNeed})`
            : inventoryMode === "mutate"
              ? gem
                ? `Apply ${gem.title}`
                : "Apply mutation"
            : inventoryMode === "clear"
              ? clear
                ? `Use ${clear.title}`
                : "Clear mutation"
              : "Select a card";
      els.inventoryCopy.textContent =
        inventoryMode === "sell"
          ? "Pick a card to earn coins every second."
          : inventoryMode === "battle"
            ? pendingBattleTeam.length
              ? `Picked: ${pendingBattleTeam.map((id) => cardDisplayName(id)).join(", ")}. Pick ${
                  PLAYER_TEAM_SIZE - pendingBattleTeam.length
                } more.`
              : pendingBattleKind === "trial"
                ? "Pick 3 cards. They heal after every wave."
                : pendingBattleKind === "pvp"
                  ? "Pick 3 cards. The fight starts when both teams are ready."
                  : "Pick 3 cards for your team."
            : inventoryMode === "craft"
              ? pendingCraftPicks.length
                ? `Picked: ${pendingCraftPicks.map((id) => cardDisplayName(id)).join(", ")}. Pick ${
                    craftNeed - pendingCraftPicks.length
                  } more.`
                : `Pick ${craftNeed} ${craftLabel} cards.`
            : inventoryMode === "mutate"
              ? "Click a card to apply mutation."
            : inventoryMode === "clear"
              ? "Click a mutated card to clear it."
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
            : "Tap a usable item to use it. Right-click to discard with no reward.";
      document.querySelectorAll(".inv-tab").forEach((tab) => {
        tab.hidden = false;
        tab.classList.toggle("active", tab.getAttribute("data-inv-tab") === inventoryTab);
      });
    }

    const activeBag =
      pickMode && !tradePick
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
          ? inventoryTab === "packs"
            ? "No packs to offer."
            : inventoryTab === "items"
              ? "No items to offer."
              : "No cards to offer yet. Open some packs first."
          : inventoryMode === "sell"
            ? "No cards to station. Open some packs first."
            : inventoryMode === "battle"
              ? "No cards to battle with. Open a pack first."
              : inventoryMode === "craft"
                ? `You need ${craftNeed} ${craftLabel} cards.`
              : inventoryMode === "mutate"
                ? "You need a card with no mutation."
              : inventoryMode === "clear"
                ? "You need a card with a mutation."
          : inventoryTab === "packs"
            ? "No packs. Visit the Card shop."
            : inventoryTab === "cards"
              ? "No cards yet. Open a pack!"
              : "No items yet.";
      els.inventoryList.innerHTML = `<p class="inventory-empty">${emptyMsg}</p>`;
      return;
    }

    if (tradePick && inventoryTab === "packs") {
      const list = activeEntries.filter(([id, count]) => count > 0 && canTradePack(id));
      if (!list.length) {
        els.inventoryList.innerHTML = `<p class="inventory-empty">No packs to offer.</p>`;
        return;
      }
      els.inventoryList.innerHTML = list
        .map(
          ([id, count]) => `
            <button type="button" class="inventory-row pack-row" data-pick-pack="${escapeHtml(id)}">
              <div>
                <div class="item-name">${escapeHtml(goodsDisplayName("pack", id))}</div>
                <span class="item-note">Tap to offer this pack</span>
              </div>
              <div class="item-count">×${count}</div>
            </button>
          `
        )
        .join("");
      return;
    }

    if (tradePick && inventoryTab === "items") {
      const list = activeEntries.filter(([id, count]) => count > 0 && canTradeItem(id));
      if (!list.length) {
        els.inventoryList.innerHTML = `<p class="inventory-empty">No items to offer.</p>`;
        return;
      }
      els.inventoryList.innerHTML = list
        .map(([id, count]) => {
          const item = ITEMS[id] || { name: id, note: "" };
          const note = item.note
            ? `<span class="item-note">${escapeHtml(item.note)}</span>`
            : `<span class="item-note">Tap to offer this item</span>`;
          return `
            <button type="button" class="inventory-row pack-row" data-pick-item="${escapeHtml(id)}">
              <div>
                <div class="item-name">${escapeHtml(item.name)}</div>
                ${note}
              </div>
              <div class="item-count">×${count}</div>
            </button>
          `;
        })
        .join("");
      return;
    }

    if (pickMode || inventoryTab === "cards") {
      const list = sortCardEntries(activeEntries).filter(([id, count]) => {
        if (!baseCard(id) || count <= 0) return false;
        if (inventoryMode === "mutate" && parseCardKey(id).mutation) return false;
        if (inventoryMode === "clear" && !parseCardKey(id).mutation) return false;
        if (inventoryMode === "craft") {
          if (!craftRecipe || !craftRecipe.pick) return false;
          if (parseCardKey(id).mutation !== craftRecipe.pick.mutation) return false;
          return count - pendingCraftPicks.filter((picked) => picked === id).length > 0;
        }
        if (inventoryMode === "battle") {
          return count - pendingBattleTeam.filter((picked) => picked === id).length > 0;
        }
        return true;
      });
      if (!list.length) {
        els.inventoryList.innerHTML = `<p class="inventory-empty">${
          inventoryMode === "mutate"
            ? "You need a card with no mutation."
            : inventoryMode === "clear"
              ? "You need a card with a mutation."
            : inventoryMode === "craft"
              ? `You need ${craftNeed} ${craftLabel} cards.`
            : inventoryMode === "battle"
              ? "No cards to battle with. Open a pack first."
              : inventoryMode === "trade"
                ? "No cards to offer yet. Open some packs first."
              : "No cards yet. Open a pack!"
        }</p>`;
        return;
      }
      els.inventoryList.innerHTML = `<div class="card-grid">${list
        .map(([id, count]) => {
          const shown =
            inventoryMode === "battle"
              ? count - pendingBattleTeam.filter((picked) => picked === id).length
              : inventoryMode === "craft"
                ? count - pendingCraftPicks.filter((picked) => picked === id).length
              : count;
          if (shown <= 0) return "";
          const cpsNote =
            inventoryMode === "sell"
              ? `<div class="card-cps-tag">+${cardCpsForKey(id)}/s</div>`
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
      <button type="button" class="inventory-row pack-row" data-use-item="${escapeHtml(id)}" data-discard-item="${escapeHtml(id)}">
        <div>
          <div class="item-name">${escapeHtml(item.name)}</div>
          ${note}
        </div>
        <div class="item-count">×${count}</div>
      </button>
    `;
        }
        return `
      <div class="inventory-row" data-discard-item="${escapeHtml(id)}">
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
      return sum + (id ? cardCpsForKey(id) : 0);
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
        <div class="slot-meta">+<strong>${cardCpsForKey(cardId)}</strong>/s</div>
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
    return { cards: [], packs: [], items: [], cash: 0 };
  }

  function canTradePack(packId) {
    const pack = PACKS[packId];
    return Boolean(pack && pack.shopSold !== false);
  }

  function canTradeItem(itemId) {
    return Boolean(ITEMS[itemId]);
  }

  function maxTradeTypes(kind) {
    if (kind === "card") return MAX_TRADE_CARD_TYPES;
    if (kind === "pack") return MAX_TRADE_PACK_TYPES;
    return MAX_TRADE_ITEM_TYPES;
  }

  function offerCollection(offer, kind) {
    if (kind === "card") return offer.cards;
    if (kind === "pack") return offer.packs;
    return offer.items;
  }

  function offerRowIdKey(kind) {
    if (kind === "card") return "cardId";
    if (kind === "pack") return "packId";
    return "itemId";
  }

  function findOfferRow(offer, kind, id) {
    const key = offerRowIdKey(kind);
    return offerCollection(offer, kind).find((row) => row[key] === id);
  }

  function playerBagForKind(kind) {
    if (kind === "card") return player.cards;
    if (kind === "pack") return player.packs;
    return player.items;
  }

  function goodsOwned(kind, id) {
    return playerBagForKind(kind)[id] || 0;
  }

  function goodsDisplayName(kind, id) {
    if (kind === "card") return cardDisplayName(id);
    if (kind === "pack") return (PACKS[id] && PACKS[id].name) || id;
    return (ITEMS[id] && ITEMS[id].name) || id;
  }

  function goodsUnitValue(kind, id) {
    if (kind === "card") return cardValueForKey(id);
    if (kind === "pack") return Number(PACKS[id] && PACKS[id].price) || 0;
    return 0;
  }

  function goodsKindLabel(kind) {
    if (kind === "card") return "Card";
    if (kind === "pack") return "Pack";
    return "Item";
  }

  function goodsIcon(kind) {
    if (kind === "pack") return "📦";
    if (kind === "item") return "✦";
    return "";
  }

  function goodsFaceHtml(kind, id, qty) {
    if (kind === "card") return cardFaceForKey(id, { qty: qty || 1, compact: true });
    return `
      <div class="trade-goods-face">
        <span class="trade-goods-icon">${goodsIcon(kind)}</span>
        <span class="trade-goods-kind">${goodsKindLabel(kind)}</span>
      </div>
    `;
  }

  function normalizeOfferRows(raw, idKey, isAllowed, limit) {
    const rows = [];
    const list = Array.isArray(raw) ? raw : [];
    for (const row of list) {
      if (!row || typeof row[idKey] !== "string" || !isAllowed(row[idKey])) continue;
      const qty = Math.max(0, Math.floor(Number(row.qty) || 0));
      if (qty <= 0) continue;
      if (rows.some((existing) => existing[idKey] === row[idKey])) continue;
      rows.push({ [idKey]: row[idKey], qty });
      if (rows.length >= limit) break;
    }
    return rows;
  }

  function normalizeOffer(data) {
    return {
      cards: normalizeOfferRows(data?.cards, "cardId", (id) => Boolean(baseCard(id)), MAX_TRADE_CARD_TYPES),
      packs: normalizeOfferRows(data?.packs, "packId", canTradePack, MAX_TRADE_PACK_TYPES),
      items: normalizeOfferRows(data?.items, "itemId", canTradeItem, MAX_TRADE_ITEM_TYPES),
      cash: Math.max(0, Math.floor(Number(data?.cash) || 0)),
    };
  }

  function copyNormalizedOffer(target, data) {
    const next = normalizeOffer(data);
    target.cards = next.cards;
    target.packs = next.packs;
    target.items = next.items;
    target.cash = next.cash;
  }

  function offerHasContent(offer) {
    return (
      offer.cash > 0 ||
      offer.cards.some((c) => c.qty > 0) ||
      offer.packs.some((p) => p.qty > 0) ||
      offer.items.some((i) => i.qty > 0)
    );
  }

  function offerTotalValue(offer) {
    let total = offer.cash || 0;
    for (const row of offer.cards) total += goodsUnitValue("card", row.cardId) * row.qty;
    for (const row of offer.packs) total += goodsUnitValue("pack", row.packId) * row.qty;
    return total;
  }

  function canAffordOfferRows(bag, rows, idKey) {
    for (const row of rows) {
      if ((bag[row[idKey]] || 0) < row.qty) return false;
    }
    return true;
  }

  function canAffordMyOffer() {
    if (myOffer.cash > player.coins) return false;
    return (
      canAffordOfferRows(player.cards, myOffer.cards, "cardId") &&
      canAffordOfferRows(player.packs, myOffer.packs, "packId") &&
      canAffordOfferRows(player.items, myOffer.items, "itemId")
    );
  }

  function snapshotOffer(offer) {
    return {
      cards: offer.cards.map((c) => ({ cardId: c.cardId, qty: c.qty })),
      packs: offer.packs.map((p) => ({ packId: p.packId, qty: p.qty })),
      items: offer.items.map((i) => ({ itemId: i.itemId, qty: i.qty })),
      cash: offer.cash || 0,
    };
  }

  function takeOfferRows(bag, rows, idKey) {
    for (const row of rows) {
      bag[row[idKey]] -= row.qty;
      if (bag[row[idKey]] <= 0) delete bag[row[idKey]];
    }
  }

  function giveOfferRows(bag, rows, idKey) {
    for (const row of rows) {
      bag[row[idKey]] = (bag[row[idKey]] || 0) + row.qty;
    }
  }

  function offerLineHtml(kind, id, qty, editable) {
    const lineValue = goodsUnitValue(kind, id) * qty;
    const removeBtn = editable
      ? `<button type="button" class="btn-remove-trade" data-remove-kind="${escapeHtml(kind)}" data-remove-id="${escapeHtml(id)}" title="Remove">×</button>`
      : "";
    return `
      <div class="trade-item-row">
        <div class="trade-item-card">${goodsFaceHtml(kind, id, qty)}</div>
        <div class="trade-item-meta">
          <div>${escapeHtml(goodsDisplayName(kind, id))} ×${qty}</div>
          <div class="trade-item-value">$${lineValue}</div>
        </div>
        ${removeBtn}
      </div>
    `;
  }

  function offerGoodsHtml(offer, editable) {
    const rows = [
      ...offer.cards.map((row) => offerLineHtml("card", row.cardId, row.qty, editable)),
      ...offer.packs.map((row) => offerLineHtml("pack", row.packId, row.qty, editable)),
      ...offer.items.map((row) => offerLineHtml("item", row.itemId, row.qty, editable)),
    ].join("");
    if (!rows) {
      return `<p class="trade-empty">${editable ? "Nothing offered yet." : "Waiting…"}</p>`;
    }
    return rows;
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
    els.btnAddTradeCard.disabled = locked;
    els.btnAddTradeCard.hidden = false;
    els.myTradeCash.disabled = locked;
    els.btnClearOffer.disabled = locked;
    els.btnAddTradeCard.classList.toggle("trade-locked", locked);

    els.myTradeItems.innerHTML = offerGoodsHtml(myOffer, !locked);
    els.myTradeCash.value = String(myOffer.cash || 0);
    els.myTradeTotal.textContent = `$${offerTotalValue(myOffer)}`;
    els.btnClearOffer.hidden = !offerHasContent(myOffer);

    els.theirTradeItems.innerHTML = offerGoodsHtml(theirOffer, false);
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
      els.tradeConfirmStatus.textContent = "Add cards, packs, items, or cash (or wait for theirs) before confirming.";
      return;
    }
    if (!myConfirmed && !canAffordMyOffer()) {
      els.tradeConfirmStatus.textContent = "You don't have enough cards, packs, items, or cash for this offer.";
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
      els.tradeConfirmStatus.textContent = "Trade failed — not enough cards, packs, items, or cash.";
      sendPayload({ type: "trade-fail", reason: "missing-cards" });
      return;
    }

    takeOfferRows(player.cards, myOffer.cards, "cardId");
    takeOfferRows(player.packs, myOffer.packs, "packId");
    takeOfferRows(player.items, myOffer.items, "itemId");
    if (myOffer.cash > 0) player.coins -= myOffer.cash;

    giveOfferRows(player.cards, theirOffer.cards, "cardId");
    giveOfferRows(player.packs, theirOffer.packs, "packId");
    giveOfferRows(player.items, theirOffer.items, "itemId");
    for (const row of theirOffer.cards) markIndexFound(row.cardId);
    if (theirOffer.cash > 0) addEarnedCoins(theirOffer.cash);
    progressQuests({
      cardIds: theirOffer.cards.map((row) => row.cardId),
      cardGains: theirOffer.cards.map((row) => ({ cardId: row.cardId, qty: row.qty })),
    });

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
    if (!pack || pack.shopSold === false) return;
    applyDueRestocks();
    if (!packHasInfiniteStock(pack) && packStockCount(pack) <= 0) {
      setShopMessage("Sold out. Wait for the restock timer.", true);
      renderShopStock();
      return;
    }
    if (player.coins < pack.price) {
      setShopMessage("Not enough coins.", true);
      return;
    }
    player.coins -= pack.price;
    if (!packHasInfiniteStock(pack)) {
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
    if (els.adminNoCraftWait) els.adminNoCraftWait.checked = Boolean(shop.noCraftWait);
    if (els.adminLuck) els.adminLuck.value = String(sanitizeLuck(shop.luck));
    refreshLuckPreview(shop.luck);
    fillAdminOddsInputs();
    refreshAdminEventPackCount();
    els.adminSettings.hidden = false;
    refreshFabs();
  }

  function refreshAdminEventPackCount() {
    if (!els.adminEventPackCount) return;
    els.adminEventPackCount.textContent = `×${player.packs["electrified-pack"] || 0}`;
  }

  function grantElectrifiedPack() {
    player.packs["electrified-pack"] = (player.packs["electrified-pack"] || 0) + 1;
    savePlayer();
    renderPlayerUi();
    refreshAdminEventPackCount();
  }

  function tryAdminLogin() {
    if (els.adminPassword.value === ADMIN_PASSWORD) {
      openAdminSettings();
      return;
    }
    setError(els.adminGateError, "Wrong password.");
  }

  function formatBattleReward(reward) {
    if (!reward) return "";
    const parts = [];
    if (reward.coins) parts.push(`${reward.coins.toLocaleString()} coins`);
    if (reward.packs) {
      for (const [id, count] of Object.entries(reward.packs)) {
        const pack = PACKS[id];
        parts.push(`${count}× ${pack ? pack.name : id}`);
      }
    }
    if (reward.items) {
      for (const [id, count] of Object.entries(reward.items)) {
        const item = ITEMS[id];
        parts.push(`${count}× ${item ? item.name : id}`);
      }
    }
    return parts.join(" · ");
  }

  function battleRewardLines(reward) {
    if (!reward) return [];
    const lines = [];
    if (reward.coins) lines.push(`${reward.coins.toLocaleString()} coins`);
    if (reward.packs) {
      for (const [id, count] of Object.entries(reward.packs)) {
        const pack = PACKS[id];
        lines.push(`${count}× ${pack ? pack.name : id}`);
      }
    }
    if (reward.items) {
      for (const [id, count] of Object.entries(reward.items)) {
        const item = ITEMS[id];
        lines.push(`${count}× ${item ? item.name : id}`);
      }
    }
    return lines;
  }

  function grantBattleReward(b) {
    if (!b || b.rewardGranted) return null;
    const reward = b.mode === "trial" ? trialWaveReward(b.trialWave) : (NPC_FIGHTERS[b.npcId] && NPC_FIGHTERS[b.npcId].reward);
    if (!reward) return null;
    b.rewardGranted = true;
    if (reward.coins) addEarnedCoins(reward.coins);
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
    savePlayer();
    renderPlayerUi();
    return reward;
  }

  function showBattleReward(reward, opts = {}) {
    if (!els.battleReward) return;
    const lines = battleRewardLines(reward);
    battleRewardAction = opts.action || "hide";
    if (els.battleRewardTitle) els.battleRewardTitle.textContent = opts.title || "You win";
    els.battleRewardCopy.textContent = opts.copy || (lines.length ? "You earned:" : "You win!");
    els.battleRewardList.innerHTML = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
    if (els.btnBattleRewardDone) els.btnBattleRewardDone.textContent = opts.doneLabel || "Done";
    els.battleReward.hidden = false;
    refreshFabs();
  }

  function hideBattleReward() {
    if (!els.battleReward) return;
    els.battleReward.hidden = true;
    battleRewardAction = "hide";
    if (els.battleRewardList) els.battleRewardList.innerHTML = "";
    if (els.battleRewardTitle) els.battleRewardTitle.textContent = "You win";
    if (els.btnBattleRewardDone) els.btnBattleRewardDone.textContent = "Done";
    refreshFabs();
  }

  function finishBattleReward() {
    const action = battleRewardAction;
    const keys = battle && battle.youTeam ? battle.youTeam.map((member) => member.cardKey) : [];
    const nextWave = battle && battle.trialWave ? battle.trialWave + 1 : 0;
    hideBattleReward();
    if (action === "continue-trial") {
      startTrialWave(keys, nextWave);
      return;
    }
    if (action === "leave-npc" || action === "leave-trial" || action === "leave-pvp") leaveBattle();
  }

  function hideNpcRewardTip() {
    if (!els.npcRewardTip) return;
    els.npcRewardTip.hidden = true;
    els.npcRewardTip.textContent = "";
  }

  function showNpcRewardTip(npcId, clientX, clientY) {
    if (!els.npcRewardTip) return;
    const npc = NPC_FIGHTERS[npcId];
    const text = formatBattleReward(npc && npc.reward);
    if (!text) {
      hideNpcRewardTip();
      return;
    }
    els.npcRewardTip.textContent = text;
    els.npcRewardTip.hidden = false;
    const pad = 10;
    const tip = els.npcRewardTip;
    const rect = tip.getBoundingClientRect();
    let left = clientX + 12;
    let top = clientY + 12;
    if (left + rect.width > window.innerWidth - pad) left = clientX - rect.width - 12;
    if (top + rect.height > window.innerHeight - pad) top = clientY - rect.height - 12;
    tip.style.left = `${Math.max(pad, left)}px`;
    tip.style.top = `${Math.max(pad, top)}px`;
  }

  function renderNpcFighters() {
    hideNpcRewardTip();
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
    pendingBattleKind = "npc";
    pendingBattleNpc = npcId;
    pendingBattleTeam = [];
    openInventory("battle");
  }

  function openTrialMode() {
    if (ownedCardTotal() < PLAYER_TEAM_SIZE) {
      if (els.battlesMsg) {
        els.battlesMsg.hidden = false;
        els.battlesMsg.textContent = "You need 3 cards in your backpack first.";
      }
      return;
    }
    if (els.battlesMsg) els.battlesMsg.hidden = true;
    pendingBattleKind = "trial";
    pendingBattleNpc = null;
    pendingBattleTeam = [];
    openInventory("battle");
  }

  function makeBattler(card, key) {
    const cardKeyVal = key || card.id;
    const hp = Math.max(1, ceilMutationStat(card.hp, cardKeyVal));
    return {
      cardId: card.id,
      cardKey: cardKeyVal,
      statMult: mutationDmgMult(cardKeyVal),
      healMult: mutationHealMult(cardKeyVal),
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

  function startEncounter({ youKeys, foeIds, foeKeys, name, danger, serif, npcId, trialWave, mode }) {
    const keys = (youKeys || []).filter((id) => baseCard(id));
    const foeSource = foeKeys && foeKeys.length ? foeKeys : foeIds;
    const foeTeam = (foeSource || [])
      .map((id) => {
        const card = baseCard(id);
        return card ? makeBattler(card, id) : null;
      })
      .filter(Boolean);
    if (keys.length !== PLAYER_TEAM_SIZE || !foeTeam.length) return;
    const first = CARDS[foeTeam[0].cardId];
    battleAnimGen += 1;
    battle = {
      mode: mode || (trialWave ? "trial" : "npc"),
      npcId: npcId || "",
      trialWave: trialWave || 0,
      npcName: name,
      npcDanger: Boolean(danger),
      npcSerif: Boolean(serif),
      foeTeam,
      foeIndex: 0,
      youTeam: keys.map((key) => makeBattler(baseCard(key), key)),
      youIndex: 0,
      youReviveLastTurn: null,
      foeReviveLastTurn: null,
      turn: 1,
      over: false,
      busy: false,
      mustSwitch: false,
      waitingFoeSwitch: false,
      hideYouCard: false,
      hideFoeCard: false,
      result: "",
      log: `${name} sends out ${first ? first.name : "a fighter"}. Your turn.`,
    };
    pendingBattleNpc = null;
    pendingBattleKind = null;
    pendingBattleTeam = [];
    inventoryMode = "browse";
    els.battleParty.hidden = true;
    hideBattleReward();
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

  function startBattle(playerCardIds, npcId) {
    const npc = NPC_FIGHTERS[npcId];
    if (!npc) return;
    startEncounter({
      youKeys: playerCardIds,
      foeIds: npc.team,
      name: npc.name,
      danger: npc.danger,
      serif: npc.serif,
      npcId,
    });
  }

  function startTrialWave(playerCardIds, waveNumber) {
    const def = trialWaveDef(waveNumber);
    if (!def) {
      leaveBattle();
      return;
    }
    startEncounter({
      youKeys: playerCardIds,
      foeIds: def.team,
      name: def.name,
      danger: def.danger,
      serif: def.serif,
      trialWave: waveNumber,
    });
    progressQuests({ trialWave: waveNumber });
  }

  function battleMoveReady(move, battler) {
    if (!move || !battler || !battle) return false;
    if (move.isHeal) return healMoveReady(move, battler.healLastTurn[move.id], battle.turn);
    return true;
  }

  function battleMoveDamage(move, battler) {
    const mult = battler && battler.statMult ? battler.statMult : 1;
    if (move.isJumpscare) return Math.max(1, Math.ceil(jumpscareDamage(move, battler.jumpscareUses) * mult));
    return Math.max(0, Math.ceil(move.damage * mult));
  }

  function battleMoveHeal(move, battler) {
    const mult = battler && battler.healMult != null ? battler.healMult : 1;
    return Math.max(0, Math.ceil((move.heal || 0) * mult));
  }

  function battleMoveStat(move, battler) {
    const dmg = battleMoveDamage(move, battler);
    const heal = battleMoveHeal(move, battler);
    if (move.healTeam) return `Heal team ${heal}`;
    if (move.isHybrid) return `Heal ${heal} · ${dmg} DMG`;
    if (move.isHeal) return `Heal ${heal}`;
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

  function applyBattleItemAction(action) {
    const team = action.sideId === "you" ? battle.youTeam : battle.foeTeam;
    const idx = Math.floor(Number(action.targetIndex));
    const target = team && team[idx];
    if (!target) return null;
    const name = cardDisplayName(target.cardKey || target.cardId);
    const activeIndex = action.sideId === "you" ? battle.youIndex : battle.foeIndex;
    const showOnActive = idx === activeIndex;
    if (action.itemId === "potion") {
      if (target.hp <= 0) return { log: `Potion could not heal ${name}.` };
      const before = target.hp;
      target.hp = Math.min(target.maxHp, target.hp + BATTLE_POTION_HEAL);
      const gained = target.hp - before;
      return {
        log: `Potion heals ${name} ${gained} HP.`,
        heal: showOnActive && gained ? action.sideId : null,
        amount: gained,
      };
    }
    if (action.itemId === "revive") {
      if (target.hp > 0) return { log: `Revive could not bring back ${name}.` };
      const hp = Math.max(1, Math.floor(target.maxHp / 2));
      target.hp = hp;
      return {
        log: `Revive brings ${name} back to ${hp} HP.`,
        heal: showOnActive ? action.sideId : null,
        amount: hp,
      };
    }
    return null;
  }

  function applyOneBattleAction(action) {
    if (action && action.type === "item") return applyBattleItemAction(action);
    const battler = battlerBySide(action.sideId);
    if (!battler || battler.hp <= 0) return null;
    const card = CARDS[battler.cardId];
    const move = (card.moves || []).find((m) => m.id === action.moveId);
    const moveName = move ? move.name : "A move";
    if (action.type === "heal") {
      const team = action.healTeam
        ? action.sideId === "you"
          ? battle.youTeam
          : battle.foeTeam
        : [battler];
      if (action.healTeam && action.engineChargeMode === "revive") {
        const idx = Number(action.reviveIndex);
        const target = Number.isInteger(idx) ? team[idx] : null;
        if (target && target.hp <= 0) {
          target.hp = Math.min(target.maxHp, ENGINE_CHARGE_X_REVIVE_HP);
          return {
            log: `${moveName} revives ${cardDisplayName(target.cardKey || target.cardId)} to ${target.hp} HP.`,
            heal: action.sideId,
            amount: target.hp,
          };
        }
      }
      for (const member of team || []) {
        if (!member || member.hp <= 0) continue;
        member.hp = Math.min(member.maxHp, member.hp + action.amount);
      }
      return {
        log: action.healTeam
          ? `${cardDisplayName(battler.cardKey || battler.cardId)} heals the team ${action.amount}.`
          : `${cardDisplayName(battler.cardKey || battler.cardId)} heals ${action.amount}.`,
        heal: action.sideId,
        amount: action.amount,
      };
    }
    if (action.missed) {
      return { log: `${moveName} missed!` };
    }
    if (move && move.isWipe) {
      const team = action.sideId === "you" ? battle.foeTeam : battle.youTeam;
      for (const member of team) member.hp = 0;
      const hitSide = action.sideId === "you" ? "foe" : "you";
      return { log: `${moveName} hits for ${action.amount}.`, hit: hitSide, amount: action.amount };
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
    const pvp = battle.mode === "pvp";
    if (foe && foe.hp <= 0) {
      events.push({
        faint: "foe",
        stay: true,
        log: `${cardDisplayName(foe.cardKey || foe.cardId)} fainted.`,
      });
      if (pvp) {
        if (battle.foeTeam.some((member) => member.hp > 0)) {
          battle.waitingFoeSwitch = true;
        } else {
          events.push({ log: "You win!", stay: true, battleOver: "win" });
          return events;
        }
      } else if (battle.foeIndex < battle.foeTeam.length - 1) {
        const next = battle.foeTeam[battle.foeIndex + 1];
        events.push({
          switchFoe: true,
          stay: true,
          log: `${battle.npcName} Switched in ${cardDisplayName(next.cardKey || next.cardId)}`,
        });
      } else {
        events.push({ log: "You win!", stay: true, battleOver: "win" });
        return events;
      }
    }
    if (you && you.hp <= 0) {
      events.push({
        faint: "you",
        stay: true,
        log: `${cardDisplayName(you.cardKey || you.cardId)} fainted.`,
      });
      if (battle.youTeam.some((member) => member.hp > 0)) {
        events.push({
          log: "Choose a card.",
          stay: true,
          openParty: true,
          mustSwitch: true,
        });
        return events;
      }
      events.push({ log: "You lose.", stay: true, battleOver: "lose" });
      return events;
    }
    if (pvp && battle.waitingFoeSwitch) {
      events.push({ log: "Opponent is choosing a card.", stay: true });
      return events;
    }
    events.push({ log: pvp && myPvpChoice ? "Waiting for opponent…" : "Your turn.", stay: true });
    return events;
  }

  async function playCardFaint(side, gen) {
    const wrap = side === "you" ? els.battleYouCard : els.battleFoe;
    const card = wrap && wrap.querySelector(".animal-card");
    if (card) {
      card.classList.remove("is-hit", "is-heal");
      void card.offsetWidth;
      card.classList.add("is-fainting");
    }
    await battleSleep(BATTLE_FAINT_MS);
    if (!battle || gen !== battleAnimGen) return;
    if (side === "you") {
      battle.hideYouCard = true;
      if (els.battleYouCard) els.battleYouCard.innerHTML = "";
    } else {
      battle.hideFoeCard = true;
      if (els.battleFoe) els.battleFoe.innerHTML = "";
    }
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
    if (!event) return;
    if (gen !== battleAnimGen) return;
    if (event.switchFoe) {
      battle.foeIndex += 1;
      battle.hideFoeCard = false;
    }
    if (event.mustSwitch) battle.mustSwitch = true;
    if (event.battleOver) {
      battle.over = true;
      battle.result = event.battleOver;
      if (event.battleOver === "win") {
        if (battle.mode === "pvp") {
          showBattleReward(null, {
            title: "You win",
            copy: "Your opponent's team fainted.",
            doneLabel: "Done",
            action: "leave-pvp",
          });
        } else {
          if (battle.mode === "trial") {
            progressQuests({ trialWave: battle.trialWave });
          } else if (battle.npcId) {
            const npc = NPC_FIGHTERS[battle.npcId];
            progressQuests({
              npcWin: battle.npcId,
              npcDanger: Boolean(npc && npc.danger),
            });
          }
          const reward = grantBattleReward(battle);
          if (battle.mode === "trial") {
            const next = trialWaveDef(battle.trialWave + 1);
            showBattleReward(reward, {
              title: "You win",
              copy: `Wave ${battle.trialWave} cleared.`,
              doneLabel: next ? "Continue" : "Done",
              action: next ? "continue-trial" : "leave-trial",
            });
          } else {
            showBattleReward(reward, {
              title: "You win",
              copy: battleRewardLines(reward).length ? "You earned:" : "You win!",
              doneLabel: "Done",
              action: "leave-npc",
            });
          }
        }
      } else if (event.battleOver === "lose" && battle.mode === "pvp") {
        showBattleReward(null, {
          title: "You lose",
          copy: "Your team fainted.",
          doneLabel: "Done",
          action: "leave-pvp",
        });
      } else if (event.battleOver === "lose" && battle.mode === "trial") {
        progressQuests({ trialWave: battle.trialWave });
        showBattleReward(null, {
          title: "Trial over",
          copy: `You reached wave ${battle.trialWave}.`,
          doneLabel: "Done",
          action: "leave-trial",
        });
      }
    }
    if (event.mustSwitch || event.battleOver) renderBattleHud();
    if (event.log) {
      els.battleLog.classList.remove("is-in");
      await battleSleep(BATTLE_LOG_FADE_MS);
      if (gen !== battleAnimGen) return;
      battle.log = event.log;
      els.battleLog.textContent = event.log;
    }
    if (!event.faint) renderBattleCards();
    if (event.log) els.battleLog.classList.add("is-in");
    if (event.hit) spawnBattleFloat(event.hit, event.amount, "hit");
    if (event.heal) spawnBattleFloat(event.heal, event.amount, "heal");
    if (event.faint) {
      await playCardFaint(event.faint, gen);
      if (gen !== battleAnimGen) return;
      return;
    }
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
    if (!battle.over && !battle.mustSwitch && !battle.waitingFoeSwitch) battle.turn += 1;
    battle.busy = false;
    renderBattle();
    const last = events[events.length - 1];
    if (last && last.openParty) openBattleParty();
  }

  function faintedTeamMembers(team) {
    return (team || [])
      .map((member, index) => ({ member, index }))
      .filter((entry) => entry.member && entry.member.hp <= 0);
  }

  function autoEngineChargeExtras(move, team) {
    if (!move || !move.healTeam) return {};
    const dead = faintedTeamMembers(team);
    if (!dead.length) return { engineChargeMode: "heal" };
    return { engineChargeMode: "revive", reviveIndex: dead[0].index };
  }

  function hideEngineChargeModal() {
    pendingEngineCharge = null;
    if (els.engineChargeModal) els.engineChargeModal.hidden = true;
    if (els.engineChargeReviveList) {
      els.engineChargeReviveList.hidden = true;
      els.engineChargeReviveList.innerHTML = "";
    }
    if (els.engineChargeChoices) els.engineChargeChoices.hidden = false;
    if (els.engineChargeCopy) {
      els.engineChargeCopy.textContent = "Do you want to heal your team or revive one card";
    }
    refreshFabs();
  }

  function showEngineChargePrompt(index) {
    pendingEngineCharge = { index };
    if (els.engineChargeCopy) {
      els.engineChargeCopy.textContent = "Do you want to heal your team or revive one card";
    }
    if (els.engineChargeChoices) els.engineChargeChoices.hidden = false;
    if (els.engineChargeReviveList) {
      els.engineChargeReviveList.hidden = true;
      els.engineChargeReviveList.innerHTML = "";
    }
    if (els.engineChargeModal) els.engineChargeModal.hidden = false;
    refreshFabs();
  }

  function showEngineChargeRevivePicks() {
    if (!battle || !pendingEngineCharge) return;
    const dead = faintedTeamMembers(battle.youTeam);
    if (!dead.length) {
      confirmEngineChargeHeal();
      return;
    }
    if (els.engineChargeCopy) els.engineChargeCopy.textContent = "Choose one card to revive to 90 HP.";
    if (els.engineChargeChoices) els.engineChargeChoices.hidden = true;
    if (!els.engineChargeReviveList) return;
    els.engineChargeReviveList.innerHTML = dead
      .map(
        ({ member, index }) => `
        <button type="button" class="engine-charge-revive-pick" data-engine-revive="${index}">
          ${cardFaceHtml(CARDS[member.cardId], {
            compact: true,
            showValue: false,
            hp: 0,
            cardKey: member.cardKey || member.cardId,
          })}
        </button>`
      )
      .join("");
    els.engineChargeReviveList.hidden = false;
  }

  function confirmEngineChargeHeal() {
    const pending = pendingEngineCharge;
    hideEngineChargeModal();
    if (!pending) return;
    commitBattleMove(pending.index, { engineChargeMode: "heal" });
  }

  function confirmEngineChargeRevive(reviveIndex) {
    const pending = pendingEngineCharge;
    hideEngineChargeModal();
    if (!pending) return;
    commitBattleMove(pending.index, { engineChargeMode: "revive", reviveIndex });
  }

  function battleSideExtras(sideId, move, extras) {
    const team = sideId === "you" ? battle.youTeam : battle.foeTeam;
    if (!move || !move.healTeam) return {};
    if (extras && extras.engineChargeMode === "revive") {
      const idx = Math.floor(Number(extras.reviveIndex));
      const target = team[idx];
      if (target && target.hp <= 0) return { engineChargeMode: "revive", reviveIndex: idx };
    }
    return { engineChargeMode: "heal" };
  }

  function battleActionLocked() {
    return (
      !battle ||
      battle.over ||
      battle.busy ||
      battle.mustSwitch ||
      battle.waitingFoeSwitch ||
      Boolean(battle.mode === "pvp" && myPvpChoice)
    );
  }

  function ownedBattleItem(itemId) {
    return Math.max(0, Math.floor(Number(player.items[itemId]) || 0));
  }

  function consumeBattleItem(itemId) {
    if (ownedBattleItem(itemId) < 1) return false;
    player.items[itemId] -= 1;
    if (player.items[itemId] <= 0) delete player.items[itemId];
    savePlayer();
    return true;
  }

  function reviveLastTurn(sideId) {
    if (!battle) return null;
    return sideId === "you" ? battle.youReviveLastTurn : battle.foeReviveLastTurn;
  }

  function reviveItemReady(sideId) {
    if (!battle) return false;
    const last = reviveLastTurn(sideId);
    if (last == null || last < 0) return true;
    return battle.turn >= last + REVIVE_ITEM_TURN_GAP;
  }

  function reviveWaitTurns(sideId) {
    if (!battle) return 0;
    const last = reviveLastTurn(sideId);
    if (last == null || last < 0) return 0;
    return Math.max(0, last + REVIVE_ITEM_TURN_GAP - battle.turn);
  }

  function markReviveUsed(sideId) {
    if (!battle) return;
    if (sideId === "you") battle.youReviveLastTurn = battle.turn;
    else battle.foeReviveLastTurn = battle.turn;
  }

  function battleItemTargets(itemId, team) {
    return (team || [])
      .map((member, index) => ({ member, index }))
      .filter(({ member }) => {
        if (!member) return false;
        if (itemId === "potion") return member.hp > 0;
        if (itemId === "revive") return member.hp <= 0;
        return false;
      });
  }

  function canCommitBattleItem(itemId, targetIndex, sideId = "you") {
    if (itemId !== "potion" && itemId !== "revive") return false;
    const team = sideId === "you" ? battle.youTeam : battle.foeTeam;
    const target = team && team[targetIndex];
    if (!target) return false;
    if (itemId === "potion") return target.hp > 0;
    return target.hp <= 0 && reviveItemReady(sideId);
  }

  function hideBattleItemModal() {
    pendingBattleItem = null;
    if (els.battleItemModal) els.battleItemModal.hidden = true;
    if (els.battleItemList) els.battleItemList.innerHTML = "";
    refreshFabs();
  }

  function openBattleItemPicker(itemId) {
    if (battleActionLocked()) return;
    if (itemId === "potion" && ownedBattleItem("potion") < 1) return;
    if (itemId === "revive" && (ownedBattleItem("revive") < 1 || !reviveItemReady("you"))) return;
    const targets = battleItemTargets(itemId, battle.youTeam);
    if (!targets.length) return;
    pendingBattleItem = itemId;
    if (els.battleItemTitle) els.battleItemTitle.textContent = itemId === "revive" ? "Revive" : "Potion";
    if (els.battleItemCopy) {
      els.battleItemCopy.textContent =
        itemId === "revive"
          ? "Choose one fainted card to revive to half HP."
          : "Choose one living card to heal 30 HP.";
    }
    if (els.battleItemList) {
      els.battleItemList.innerHTML = targets
        .map(
          ({ member, index }) => `
        <button type="button" class="engine-charge-revive-pick" data-battle-item-target="${index}">
          ${cardFaceHtml(CARDS[member.cardId], {
            compact: true,
            showValue: false,
            hp: member.hp,
            cardKey: member.cardKey || member.cardId,
          })}
        </button>`
        )
        .join("");
    }
    if (els.battleItemModal) els.battleItemModal.hidden = false;
    refreshFabs();
  }

  function confirmBattleItemTarget(targetIndex) {
    const itemId = pendingBattleItem;
    hideBattleItemModal();
    if (!itemId) return;
    commitBattleItem(itemId, targetIndex);
  }

  async function commitBattleItem(itemId, targetIndex) {
    if (battleActionLocked()) return;
    const idx = Math.floor(Number(targetIndex));
    if (itemId === "potion" && ownedBattleItem("potion") < 1) return;
    if (itemId === "revive" && ownedBattleItem("revive") < 1) return;
    if (!canCommitBattleItem(itemId, idx, "you")) return;
    if (battle.mode === "pvp") {
      if (battle.waitingFoeSwitch || myPvpChoice) return;
      if (!consumeBattleItem(itemId)) return;
      if (itemId === "revive") markReviveUsed("you");
      lockInPvpChoice({ type: "item", itemId, targetIndex: idx });
      return;
    }
    const you = activeYou();
    const foe = activeFoe();
    const foeCard = foe && CARDS[foe.cardId];
    if (!you || !foeCard) return;
    if (!consumeBattleItem(itemId)) return;
    if (itemId === "revive") markReviveUsed("you");
    const foeMove = pickNpcMove(foeCard, foe);
    const foeExtras = autoEngineChargeExtras(foeMove, battle.foeTeam);
    const actions = resolveBattleTurn(
      {
        id: "you",
        item: itemId,
        targetIndex: idx,
        jumpscareUses: you.jumpscareUses,
        statMult: you.statMult || 1,
        healMult: you.healMult != null ? you.healMult : 1,
      },
      {
        id: "foe",
        move: foeMove,
        jumpscareUses: foe.jumpscareUses,
        statMult: foe.statMult || 1,
        healMult: foe.healMult != null ? foe.healMult : 1,
        ...foeExtras,
      }
    );
    if (foeMove) {
      if (foeMove.isHeal) foe.healLastTurn[foeMove.id] = battle.turn;
      if (foeMove.isJumpscare) foe.jumpscareUses += 1;
    }
    await resolvePlayedActions(actions);
  }

  function renderBattleItemDock() {
    if (!els.battleItemDock) return;
    if (!battle) {
      els.battleItemDock.innerHTML = "";
      return;
    }
    const locked = battleActionLocked();
    const potionCount = ownedBattleItem("potion");
    const reviveCount = ownedBattleItem("revive");
    const potionReady = !locked && potionCount > 0 && battleItemTargets("potion", battle.youTeam).length > 0;
    const reviveWait = reviveWaitTurns("you");
    const reviveReady =
      !locked && reviveCount > 0 && reviveItemReady("you") && battleItemTargets("revive", battle.youTeam).length > 0;
    els.battleItemDock.innerHTML = `
      <button type="button" class="battle-item-btn is-potion" data-battle-item="potion" ${
        potionReady ? "" : "disabled"
      } title="Potion: heal 30 HP">
        <span aria-hidden="true">🧪</span>
        <span class="battle-item-count">${potionCount}</span>
      </button>
      <button type="button" class="battle-item-btn is-revive" data-battle-item="revive" ${
        reviveReady ? "" : "disabled"
      } title="Revive: half HP">
        <span aria-hidden="true">💗</span>
        <span class="battle-item-count">${reviveCount}</span>
        ${reviveWait > 0 ? `<span class="battle-item-wait">${reviveWait}</span>` : ""}
      </button>
    `;
  }

  async function playBattleMove(index) {
    if (!battle || battle.over || battle.busy || battle.mustSwitch) return;
    const you = activeYou();
    const youCard = you && CARDS[you.cardId];
    const youMove = youCard && youCard.moves ? youCard.moves[index] : null;
    if (!youMove || !battleMoveReady(youMove, you)) return;
    if (youMove.healTeam && faintedTeamMembers(battle.youTeam).length) {
      showEngineChargePrompt(index);
      return;
    }
    commitBattleMove(index, youMove.healTeam ? { engineChargeMode: "heal" } : {});
  }

  async function commitBattleMove(index, extras = {}) {
    if (!battle || battle.over || battle.busy || battle.mustSwitch) return;
    if (battle.mode === "pvp") {
      lockInPvpChoice({ type: "move", index, ...extras });
      return;
    }
    const you = activeYou();
    const youCard = you && CARDS[you.cardId];
    const foe = activeFoe();
    const foeCard = foe && CARDS[foe.cardId];
    const youMove = youCard && youCard.moves ? youCard.moves[index] : null;
    if (!youMove || !foeCard || !battleMoveReady(youMove, you)) return;
    const foeMove = pickNpcMove(foeCard, foe);
    const youExtras = battleSideExtras("you", youMove, extras);
    const foeExtras = autoEngineChargeExtras(foeMove, battle.foeTeam);
    const actions = resolveBattleTurn(
      {
        id: "you",
        move: youMove,
        jumpscareUses: you.jumpscareUses,
        statMult: you.statMult || 1,
        healMult: you.healMult != null ? you.healMult : 1,
        ...youExtras,
      },
      {
        id: "foe",
        move: foeMove,
        jumpscareUses: foe.jumpscareUses,
        statMult: foe.statMult || 1,
        healMult: foe.healMult != null ? foe.healMult : 1,
        ...foeExtras,
      }
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
    if (battle.mode === "pvp") {
      if (battle.mustSwitch) {
        applyPvpLocalSwitch(index);
        return;
      }
      closeBattleParty();
      lockInPvpChoice({ type: "switch", index });
      return;
    }
    const name = cardDisplayName(next.cardKey || next.cardId);
    battle.hideYouCard = false;
    battle.youIndex = index;
    battle.mustSwitch = false;
    els.battleParty.hidden = true;
    const you = activeYou();
    const foe = activeFoe();
    const foeCard = foe && CARDS[foe.cardId];
    if (!you || !foeCard) return;
    const foeMove = pickNpcMove(foeCard, foe);
    const foeExtras = autoEngineChargeExtras(foeMove, battle.foeTeam);
    const actions = resolveBattleTurn(
      { id: "you", move: null, jumpscareUses: you.jumpscareUses, statMult: you.statMult || 1, healMult: you.healMult != null ? you.healMult : 1 },
      { id: "foe", move: foeMove, jumpscareUses: foe.jumpscareUses, statMult: foe.statMult || 1, healMult: foe.healMult != null ? foe.healMult : 1, ...foeExtras }
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
    const waveBit = battle.mode === "trial" && battle.trialWave ? `Wave ${battle.trialWave} · ` : "";
    els.battleFoeMeta.textContent = `${waveBit}${battle.npcName} · ${battle.foeIndex + 1} / ${battle.foeTeam.length}`;
    els.battleFoeMeta.classList.toggle("is-danger", Boolean(battle.npcDanger));
    els.battleFoeMeta.classList.toggle("is-serif", Boolean(battle.npcSerif));
    if (!battle.hideFoeCard) {
      els.battleFoe.innerHTML = foeCard
        ? cardFaceHtml(foeCard, {
            compact: true,
            showValue: false,
            hp: foe.hp,
            cardKey: foe.cardKey || foe.cardId,
          })
        : "";
    }
    if (!battle.hideYouCard) {
      els.battleYouCard.innerHTML = youCard
        ? cardFaceHtml(youCard, {
            compact: true,
            showValue: false,
            hp: you.hp,
            cardKey: you.cardKey || you.cardId,
          })
        : "";
    }
  }

  function renderBattleHud() {
    if (!battle) return;
    const you = activeYou();
    const youCard = you && CARDS[you.cardId];
    const locked =
      battle.over ||
      battle.busy ||
      battle.mustSwitch ||
      battle.waitingFoeSwitch ||
      Boolean(battle.mode === "pvp" && myPvpChoice);
    els.btnBattleFlee.textContent = battle.over ? "← Leave" : "← Flee";
    els.btnBattleCards.disabled = battle.over || (battle.busy && !battle.mustSwitch) || Boolean(battle.mode === "pvp" && myPvpChoice);
    els.btnBattleCards.classList.toggle("need-pick", Boolean(battle.mustSwitch));
    els.battleMoves.innerHTML = (youCard && youCard.moves ? youCard.moves : [])
      .map((move, i) => {
        const ready = !locked && battleMoveReady(move, you);
        const wait = battle.over
          ? "Battle over"
          : battle.mustSwitch
            ? "Choose a card"
            : battle.waitingFoeSwitch
              ? "Waiting"
              : battle.mode === "pvp" && myPvpChoice
                ? "Waiting"
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
    renderBattleItemDock();
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

  function leaveBattle() {
    const dest =
      battle && battle.mode === "pvp"
        ? "battles"
        : battle && battle.mode === "trial"
          ? "battles"
          : "npcBattles";
    if (battle && battle.mode === "pvp") {
      if (conn && conn.open && !battle.over) sendPayload({ type: "pvp-flee" });
      resetPvpMatch();
      destroySession();
    }
    battleAnimGen += 1;
    battle = null;
    pendingBattleNpc = null;
    pendingBattleKind = null;
    pendingBattleTeam = [];
    hideBattleReward();
    hideEngineChargeModal();
    hideBattleItemModal();
    if (els.battleItemDock) els.battleItemDock.innerHTML = "";
    els.battleLog.classList.remove("is-in");
    els.battleParty.hidden = true;
    showScreen(dest);
  }

  function fleeBattle() {
    leaveBattle();
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
    else hideIndexDetail();
    if (name === "quests") renderQuests();
    if (name === "crafting") renderCrafting();
    if (name === "npcBattles") renderNpcFighters();
    else hideNpcRewardTip();
    if (name === "battles" && els.battlesMsg) {
      els.battlesMsg.hidden = true;
      els.battlesMsg.textContent = "";
    }
      if (
      name === "cardShop" ||
      name === "inventory" ||
      name === "room" ||
      name === "sellStop"
    ) {
      renderPlayerUi();
    }
    if (name === "room") renderBattleLobby();
    if (name === "trade" || name === "join" || name === "quick") syncLobbyMenuUi();
  }

  function openInventory(mode = "browse", sellSlotIndex = null) {
    inventoryMode = mode;
    pendingSellSlot = mode === "sell" ? sellSlotIndex : null;
    if (mode === "sell" || mode === "battle" || mode === "mutate" || mode === "clear" || mode === "craft") inventoryTab = "cards";
    if (mode === "trade") inventoryTab = "cards";
    if (mode !== "craft") clearCraftPicks();
    if (mode !== "mutate") pendingGemItemId = null;
    if (mode !== "clear") pendingClearItemId = null;
    inventoryReturnScreen = currentScreen === "inventory" ? inventoryReturnScreen : currentScreen;
    showScreen("inventory");
    renderInventoryList();
  }

  function openQtyModal(kind, id) {
    const owned = goodsOwned(kind, id);
    if (owned < 1) return;
    if (kind === "card" && !baseCard(id)) return;
    if (kind === "pack" && !canTradePack(id)) return;
    if (kind === "item" && !canTradeItem(id)) return;
    const existing = findOfferRow(myOffer, kind, id);
    if (!existing && offerCollection(myOffer, kind).length >= maxTradeTypes(kind)) {
      els.tradeConfirmStatus.textContent = `You can only add 4 different ${kind} types.`;
      showScreen("room");
      return;
    }
    pendingTradeKind = kind;
    pendingTradeId = id;
    const name = goodsDisplayName(kind, id);
    els.qtyTitle.textContent = existing ? `Update ${name}` : `Offer ${name}`;
    els.qtyPreview.innerHTML =
      kind === "card"
        ? cardFaceForKey(id, { qty: owned, compact: true })
        : `<div class="qty-goods-preview"><div class="qty-goods-icon">${goodsIcon(kind)}</div><div class="qty-goods-name">${escapeHtml(name)}</div></div>`;
    els.qtyInput.max = String(owned);
    els.qtyInput.value = String(existing ? existing.qty : 1);
    updateQtyTotal();
    els.qtyModal.hidden = false;
    refreshFabs();
  }

  function updateQtyTotal() {
    if (!pendingTradeKind || !pendingTradeId) return;
    const owned = goodsOwned(pendingTradeKind, pendingTradeId);
    let qty = Math.floor(Number(els.qtyInput.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    els.qtyInput.value = String(qty);
    els.qtyTotalValue.textContent = `$${goodsUnitValue(pendingTradeKind, pendingTradeId) * qty}`;
  }

  function closeQtyModal() {
    els.qtyModal.hidden = true;
    pendingTradeKind = null;
    pendingTradeId = null;
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

  function openItemDiscardModal(itemId) {
    const owned = player.items[itemId] || 0;
    if (owned < 1) return;
    pendingDiscardItemId = itemId;
    const item = ITEMS[itemId] || { name: itemId };
    if (els.itemDiscardName) els.itemDiscardName.textContent = item.name;
    els.itemDiscardQty.max = String(owned);
    els.itemDiscardQty.value = "1";
    if (els.itemDiscardHint) els.itemDiscardHint.textContent = `Owned: ${owned}`;
    if (els.btnDiscardKeepOne) els.btnDiscardKeepOne.disabled = owned < 2;
    updateItemDiscardQty();
    els.itemDiscardModal.hidden = false;
    refreshFabs();
  }

  function updateItemDiscardQty() {
    if (!pendingDiscardItemId || !els.itemDiscardQty) return;
    const owned = player.items[pendingDiscardItemId] || 0;
    let qty = Math.floor(Number(els.itemDiscardQty.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    els.itemDiscardQty.value = String(qty);
    if (els.btnItemDiscardConfirm) els.btnItemDiscardConfirm.disabled = qty < 1 || qty > owned;
  }

  function setDiscardKeepOne() {
    const owned = player.items[pendingDiscardItemId] || 0;
    if (owned < 2) return;
    els.itemDiscardQty.value = String(owned - 1);
    updateItemDiscardQty();
  }

  function closeItemDiscardModal() {
    if (els.itemDiscardModal) els.itemDiscardModal.hidden = true;
    pendingDiscardItemId = null;
    refreshFabs();
  }

  function confirmItemDiscard() {
    const itemId = pendingDiscardItemId;
    const owned = player.items[itemId] || 0;
    if (!itemId || owned < 1) {
      closeItemDiscardModal();
      return;
    }
    let qty = Math.floor(Number(els.itemDiscardQty.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    player.items[itemId] -= qty;
    if (player.items[itemId] <= 0) delete player.items[itemId];
    savePlayer();
    closeItemDiscardModal();
    renderPlayerUi();
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
    progressQuests({ soldCards: qty });
    savePlayer();
    closeCardSellModal();
    renderPlayerUi();
  }

  function confirmTradeQty() {
    if (myConfirmed) return;
    const kind = pendingTradeKind;
    const id = pendingTradeId;
    const owned = goodsOwned(kind, id);
    let qty = Math.floor(Number(els.qtyInput.value) || 0);
    qty = Math.max(1, Math.min(owned, qty));
    if (!kind || !id || qty < 1) return;
    if (kind === "card" && !baseCard(id)) return;
    if (kind === "pack" && !canTradePack(id)) return;
    if (kind === "item" && !canTradeItem(id)) return;

    const existing = findOfferRow(myOffer, kind, id);
    const rows = offerCollection(myOffer, kind);
    const idKey = offerRowIdKey(kind);
    if (existing) {
      existing.qty = qty;
    } else {
      if (rows.length >= maxTradeTypes(kind)) {
        closeQtyModal();
        showScreen("room");
        els.tradeConfirmStatus.textContent = `You can only add 4 different ${kind} types.`;
        return;
      }
      rows.push({ [idKey]: id, qty });
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

  function removeTradeGood(kind, id) {
    if (myConfirmed) return;
    const idKey = offerRowIdKey(kind);
    if (kind === "card") myOffer.cards = myOffer.cards.filter((row) => row[idKey] !== id);
    else if (kind === "pack") myOffer.packs = myOffer.packs.filter((row) => row[idKey] !== id);
    else myOffer.items = myOffer.items.filter((row) => row[idKey] !== id);
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

  function resetPvpMatch() {
    myPvpTeam = null;
    theirPvpTeam = null;
    myPvpChoice = null;
    theirPvpChoice = null;
  }

  function packedReviveIndex(raw) {
    if (raw == null || raw === "") return null;
    const idx = Math.floor(Number(raw));
    return Number.isFinite(idx) ? idx : null;
  }

  function pvpChoiceFrom(choice, battler) {
    if (!choice || !battler) return { type: "none" };
    if (choice.type === "switch") {
      const idx = Math.max(0, Math.floor(Number(choice.index) || 0));
      return { type: "switch", index: idx };
    }
    if (choice.type === "move") {
      const card = CARDS[battler.cardId];
      const idx = Math.max(0, Math.floor(Number(choice.index) || 0));
      const move = card && card.moves ? card.moves[idx] : null;
      if (!move) return { type: "none" };
      return {
        type: "move",
        index: idx,
        move,
        engineChargeMode: choice.engineChargeMode === "revive" ? "revive" : "heal",
        reviveIndex: packedReviveIndex(choice.reviveIndex),
      };
    }
    if (choice.type === "item") {
      const itemId = choice.itemId === "revive" ? "revive" : choice.itemId === "potion" ? "potion" : "";
      if (!itemId) return { type: "none" };
      return {
        type: "item",
        itemId,
        targetIndex: packedReviveIndex(choice.targetIndex),
      };
    }
    return { type: "none" };
  }

  function resumePvpAfterSwitch() {
    if (!battle || battle.over) return;
    if (battle.mustSwitch || battle.waitingFoeSwitch) return;
    battle.turn += 1;
    battle.log = "Your turn.";
    if (els.battleLog) {
      els.battleLog.textContent = battle.log;
      els.battleLog.classList.add("is-in");
    }
    renderBattle();
  }

  function applyPvpLocalSwitch(index) {
    const next = battle.youTeam[index];
    if (!next || next.hp <= 0) return;
    battle.hideYouCard = false;
    battle.youIndex = index;
    battle.mustSwitch = false;
    if (els.battleParty) els.battleParty.hidden = true;
    sendPayload({ type: "pvp-switch", index, turn: battle.turn });
    const name = cardDisplayName(next.cardKey || next.cardId);
    battle.log = `You switched in ${name}.`;
    if (els.battleLog) {
      els.battleLog.textContent = battle.log;
      els.battleLog.classList.add("is-in");
    }
    renderBattle();
    resumePvpAfterSwitch();
  }

  function applyPvpFoeSwitch(index) {
    if (!battle || battle.mode !== "pvp") return;
    const next = battle.foeTeam[index];
    if (!next || next.hp <= 0) return;
    battle.foeIndex = index;
    battle.hideFoeCard = false;
    battle.waitingFoeSwitch = false;
    const name = cardDisplayName(next.cardKey || next.cardId);
    battle.log = `${battle.npcName} switched in ${name}.`;
    if (els.battleLog) {
      els.battleLog.textContent = battle.log;
      els.battleLog.classList.add("is-in");
    }
    renderBattle();
    resumePvpAfterSwitch();
  }

  function lockInPvpChoice(choice) {
    if (!battle || battle.mode !== "pvp" || battle.over || battle.busy || battle.mustSwitch) return;
    if (battle.waitingFoeSwitch || myPvpChoice) return;
    const you = activeYou();
    if (choice.type === "move") {
      const card = you && CARDS[you.cardId];
      const move = card && card.moves ? card.moves[choice.index] : null;
      if (!move || !battleMoveReady(move, you)) return;
    }
    if (choice.type === "switch") {
      const next = battle.youTeam[choice.index];
      if (!next || next.hp <= 0 || choice.index === battle.youIndex) return;
    }
    if (choice.type === "item") {
      const itemId = choice.itemId === "revive" ? "revive" : choice.itemId === "potion" ? "potion" : "";
      const idx = Math.floor(Number(choice.targetIndex));
      if (!itemId || !canCommitBattleItem(itemId, idx, "you")) return;
    }
    myPvpChoice = choice;
    sendPayload({ type: "pvp-choice", choice, turn: battle.turn });
    if (els.battleLog) {
      els.battleLog.textContent = "Waiting for opponent…";
      els.battleLog.classList.add("is-in");
    }
    renderBattle();
    maybeResolvePvpTurn();
  }

  function maybeResolvePvpTurn() {
    if (!battle || battle.mode !== "pvp" || battle.over) return;
    if (!myPvpChoice || !theirPvpChoice) return;
    if (role !== "host") return;
    const seed = crypto.getRandomValues(new Uint32Array(1))[0];
    const hostChoice = myPvpChoice;
    const guestChoice = theirPvpChoice;
    sendPayload({
      type: "pvp-resolve",
      turn: battle.turn,
      hostChoice,
      guestChoice,
      seed,
    });
    runPvpResolve(hostChoice, guestChoice, seed);
  }

  async function runPvpResolve(hostChoice, guestChoice, seed) {
    if (!battle || battle.mode !== "pvp" || battle.over) return;
    const myChoiceRaw = role === "host" ? hostChoice : guestChoice;
    const foeChoiceRaw = role === "host" ? guestChoice : hostChoice;
    myPvpChoice = null;
    theirPvpChoice = null;
    const rng = mulberry32(Number(seed) || 1);
    const prefix = [];
    if (myChoiceRaw && myChoiceRaw.type === "switch") {
      const next = battle.youTeam[myChoiceRaw.index];
      if (next && next.hp > 0) {
        battle.youIndex = myChoiceRaw.index;
        battle.hideYouCard = false;
        prefix.push({
          log: `You switched in ${cardDisplayName(next.cardKey || next.cardId)}.`,
          stay: true,
        });
      }
    }
    if (foeChoiceRaw && foeChoiceRaw.type === "switch") {
      const next = battle.foeTeam[foeChoiceRaw.index];
      if (next && next.hp > 0) {
        battle.foeIndex = foeChoiceRaw.index;
        battle.hideFoeCard = false;
        prefix.push({
          log: `${battle.npcName} switched in ${cardDisplayName(next.cardKey || next.cardId)}.`,
          stay: true,
        });
      }
    }
    const you = activeYou();
    const foe = activeFoe();
    const myPacked = pvpChoiceFrom(myChoiceRaw, you);
    const foePacked = pvpChoiceFrom(foeChoiceRaw, foe);
    const youMove = myPacked.type === "move" ? myPacked.move : null;
    const foeMove = foePacked.type === "move" ? foePacked.move : null;
    if (youMove && you) {
      if (youMove.isHeal) you.healLastTurn[youMove.id] = battle.turn;
      if (youMove.isJumpscare) you.jumpscareUses += 1;
    }
    if (foeMove && foe) {
      if (foeMove.isHeal) foe.healLastTurn[foeMove.id] = battle.turn;
      if (foeMove.isJumpscare) foe.jumpscareUses += 1;
    }
    if (myPacked.type === "item" && myPacked.itemId === "revive") markReviveUsed("you");
    if (foePacked.type === "item" && foePacked.itemId === "revive") markReviveUsed("foe");
    const youExtras = battleSideExtras("you", youMove, myPacked);
    const foeExtras = battleSideExtras("foe", foeMove, foePacked);
    const youSide =
      myPacked.type === "item"
        ? {
            id: "you",
            item: myPacked.itemId,
            targetIndex: myPacked.targetIndex,
            jumpscareUses: you ? you.jumpscareUses : 0,
            statMult: you ? you.statMult || 1 : 1,
            healMult: you && you.healMult != null ? you.healMult : 1,
          }
        : {
            id: "you",
            move: youMove,
            jumpscareUses: you ? you.jumpscareUses : 0,
            statMult: you ? you.statMult || 1 : 1,
            healMult: you && you.healMult != null ? you.healMult : 1,
            ...youExtras,
          };
    const foeSide =
      foePacked.type === "item"
        ? {
            id: "foe",
            item: foePacked.itemId,
            targetIndex: foePacked.targetIndex,
            jumpscareUses: foe ? foe.jumpscareUses : 0,
            statMult: foe ? foe.statMult || 1 : 1,
            healMult: foe && foe.healMult != null ? foe.healMult : 1,
          }
        : {
            id: "foe",
            move: foeMove,
            jumpscareUses: foe ? foe.jumpscareUses : 0,
            statMult: foe ? foe.statMult || 1 : 1,
            healMult: foe && foe.healMult != null ? foe.healMult : 1,
            ...foeExtras,
          };
    const actions = resolveBattleTurn(youSide, foeSide, rng);
    await resolvePlayedActions(actions, prefix);
  }

  function maybeStartPvpBattle() {
    if (netMode !== "battle" || !myPvpTeam || !theirPvpTeam) return;
    if (battle && battle.mode === "pvp") return;
    const foeName = partnerUsername || "Opponent";
    startEncounter({
      youKeys: myPvpTeam,
      foeKeys: theirPvpTeam,
      name: foeName,
      mode: "pvp",
    });
    myPvpChoice = null;
    theirPvpChoice = null;
    renderBattleLobby();
  }

  function submitPvpTeam(keys) {
    myPvpTeam = keys.slice(0, PLAYER_TEAM_SIZE);
    inventoryMode = "browse";
    pendingBattleKind = null;
    pendingBattleTeam = [];
    sendPayload({
      type: "pvp-team",
      keys: myPvpTeam,
      username: sessionUser || "Guest",
    });
    showScreen("room");
    renderBattleLobby();
    maybeStartPvpBattle();
  }

  function handlePvpMessage(data) {
    if (!data || typeof data !== "object") return false;
    if (data.type === "pvp-team" && Array.isArray(data.keys)) {
      if (battle && battle.mode === "pvp") return true;
      theirPvpTeam = data.keys.filter((key) => baseCard(key)).slice(0, PLAYER_TEAM_SIZE);
      if (typeof data.username === "string" && data.username.trim()) {
        partnerUsername = data.username.trim();
      }
      if (myPvpTeam) sendPayload({ type: "pvp-team", keys: myPvpTeam, username: sessionUser || "Guest" });
      renderBattleLobby();
      maybeStartPvpBattle();
      return true;
    }
    if (data.type === "pvp-choice" && data.choice) {
      if (!battle || battle.mode !== "pvp" || battle.over) return true;
      theirPvpChoice = data.choice;
      maybeResolvePvpTurn();
      renderBattle();
      return true;
    }
    if (data.type === "pvp-resolve") {
      if (!battle || battle.mode !== "pvp" || battle.over) return true;
      runPvpResolve(data.hostChoice, data.guestChoice, data.seed);
      return true;
    }
    if (data.type === "pvp-switch" && Number.isFinite(Number(data.index))) {
      applyPvpFoeSwitch(Number(data.index));
      return true;
    }
    if (data.type === "pvp-flee") {
      if (battle && battle.mode === "pvp" && !battle.over) {
        battle.over = true;
        showBattleReward(null, {
          title: "You win",
          copy: "Your opponent fled.",
          doneLabel: "Done",
          action: "leave-pvp",
        });
        renderBattle();
      }
      return true;
    }
    return false;
  }

  function renderBattleLobby() {
    const battleMode = netMode === "battle";
    if (screens.room) screens.room.classList.toggle("battle-mode", battleMode);
    if (els.battleLobbyPanel) els.battleLobbyPanel.hidden = !battleMode || currentScreen !== "room";
    if (!battleMode) return;
    const linked = Boolean(conn && conn.open);
    if (els.btnBattlePickTeam) {
      els.btnBattlePickTeam.disabled = !linked || Boolean(myPvpTeam);
      els.btnBattlePickTeam.textContent = myPvpTeam ? "Team locked" : "Choose team";
    }
    if (els.battleLobbyCopy) {
      els.battleLobbyCopy.textContent = linked
        ? "Pick 3 cards. The fight starts when both teams are ready."
        : "Waiting for a partner to join this battle lobby.";
    }
    if (els.battleLobbyReady) {
      if (!linked) els.battleLobbyReady.textContent = "Waiting for partner…";
      else if (myPvpTeam && theirPvpTeam) els.battleLobbyReady.textContent = "Starting battle…";
      else if (myPvpTeam) els.battleLobbyReady.textContent = "Waiting for opponent's team…";
      else if (theirPvpTeam) els.battleLobbyReady.textContent = "Opponent is ready. Choose your team.";
      else els.battleLobbyReady.textContent = "Both players need a team of 3.";
    }
  }

  function syncLobbyMenuUi() {
    const battle = netMode === "battle";
    if (els.lobbyMenuTitle) els.lobbyMenuTitle.textContent = battle ? "Multiplayer Battles" : "Trade";
    if (els.lobbyMenuCopy) {
      els.lobbyMenuCopy.textContent = battle
        ? "Create a lobby, join with a code, or pick an open room. Fight when both players are in."
        : "Create a lobby, join with a code, or pick an open room.";
    }
    if (els.btnCreate) els.btnCreate.textContent = battle ? "Create Battle Space" : "Create Trade Space";
    if (els.btnJoin) els.btnJoin.textContent = battle ? "Join Battle Space" : "Join Trade Space";
    if (els.joinMenuTitle) els.joinMenuTitle.textContent = battle ? "Join Battle Space" : "Join Trade Space";
    if (els.joinMenuCopy) {
      els.joinMenuCopy.textContent = battle
        ? "Enter the battle lobby code from the other player."
        : "Enter the lobby code from the other player.";
    }
    if (els.quickMenuTitle) els.quickMenuTitle.textContent = battle ? "Battle Lobbies" : "Quick Lobby";
    if (els.quickMenuCopy) {
      els.quickMenuCopy.textContent = battle
        ? "Open battle lobbies waiting for a partner."
        : "Open lobbies waiting for a partner. Join with one click.";
    }
    if (els.loginRequiredCopy) {
      els.loginRequiredCopy.textContent = battle
        ? "You need to log in to play multiplayer battles."
        : "You need to log in to trade.";
    }
    renderBattleLobby();
  }

  function lobbyHomeScreen() {
    return netMode === "battle" ? "battles" : "title";
  }

  function requireOnlineAccount(kind) {
    if (sessionUser) return true;
    netMode = kind;
    syncLobbyMenuUi();
    els.loginRequiredModal.hidden = false;
    refreshFabs();
    return false;
  }

  function openMultiplayerBattles() {
    if (ownedCardTotal() < PLAYER_TEAM_SIZE) {
      if (els.battlesMsg) {
        els.battlesMsg.hidden = false;
        els.battlesMsg.textContent = "You need 3 cards in your backpack first.";
      }
      return;
    }
    if (!requireOnlineAccount("battle")) return;
    netMode = "battle";
    resetPvpMatch();
    setError(els.tradeError, "");
    syncLobbyMenuUi();
    showScreen("trade");
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

  function netTag() {
    const s = `${location.hostname}${location.pathname.replace(/\/[^/]*$/, "/")}`;
    let h = 2166136261;
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function boardIds() {
    const tag = netTag();
    return [`cgb-${tag}-0`, `cgb-${tag}-1`, `cgb-${tag}-2`];
  }

  function peerOptions() {
    return {
      debug: 0,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun.cloudflare.com:3478" },
          {
            urls: [
              "turn:openrelay.metered.ca:80",
              "turn:openrelay.metered.ca:443",
              "turn:openrelay.metered.ca:443?transport=tcp",
            ],
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
      },
    };
  }

  function destroyPeerObj(p) {
    if (!p) return;
    try {
      p.destroy();
    } catch (_) {}
  }

  function peerOnceOpen(p, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      if (p.open) {
        resolve(p.id);
        return;
      }
      let done = false;
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        reject(Object.assign(new Error("timeout"), { type: "timeout" }));
      }, timeoutMs);
      const finish = (fn, value) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        try {
          p.off("open", onOpen);
          p.off("error", onError);
        } catch (_) {}
        fn(value);
      };
      const onOpen = (id) => finish(resolve, id);
      const onError = (err) => finish(reject, err);
      p.on("open", onOpen);
      p.on("error", onError);
    });
  }

  function makePeer(id) {
    if (typeof Peer !== "function") {
      throw new Error("PeerJS failed to load");
    }
    return id ? new Peer(id, peerOptions()) : new Peer(peerOptions());
  }

  function randomCode(length = 6) {
    let out = "";
    const values = crypto.getRandomValues(new Uint32Array(length));
    for (let i = 0; i < length; i += 1) out += CODE_CHARS[values[i] % CODE_CHARS.length];
    return out;
  }

  function peerIdFromCode(code, kind = netMode) {
    const mode = kind === "battle" ? "b" : "t";
    return `cg${netTag()}-${mode}-${String(code || "").toUpperCase()}`;
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
      .map((entry) => ({ code: entry.code, updatedAt: entry.updatedAt, kind: entry.kind || "trade" }));
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
    const open = knownLobbies.filter((l) => l && l.code && (l.kind || "trade") === netMode);
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
            lobbyRegistry.set(code, {
              code,
              kind: data.kind === "battle" ? "battle" : "trade",
              status: "open",
              updatedAt: Date.now(),
            });
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
        connection.send({ type: "announce", code: announcedCode, status: "open", kind: netMode });
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
    boardReadyPromise = (async () => {
      const ids = boardIds();
      for (const boardId of ids) {
        const hostPeer = makePeer(boardId);
        hostPeer.on("connection", (connection) => bindBoardHostConnection(connection));
        try {
          await peerOnceOpen(hostPeer, 8000);
          boardPeer = hostPeer;
          isBoardHost = true;
          setKnownLobbies(openLobbiesFromRegistry());
          return;
        } catch (err) {
          destroyPeerObj(hostPeer);
          if (err?.type !== "unavailable-id") continue;
        }
        const clientPeer = makePeer();
        try {
          await peerOnceOpen(clientPeer, 8000);
          const connection = clientPeer.connect(boardId, { reliable: true });
          const joined = await new Promise((resolve) => {
            const timer = setTimeout(() => resolve(false), 5000);
            connection.on("open", () => {
              clearTimeout(timer);
              bindBoardClientConnection(connection);
              resolve(true);
            });
            connection.on("error", () => {
              clearTimeout(timer);
              resolve(false);
            });
          });
          if (joined) {
            boardPeer = clientPeer;
            isBoardHost = false;
            return;
          }
        } catch (_) {}
        destroyPeerObj(clientPeer);
      }
    })();
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
      sendBoard({ type: "announce", code: announcedCode, status: "open", kind: netMode });
      if (isBoardHost) setKnownLobbies(openLobbiesFromRegistry());
      else if (boardConn && boardConn.open) boardConn.send({ type: "list" });
    }, HEARTBEAT_MS);
  }

  async function announceLobby(code) {
    announcedCode = code;
    await ensureBoard();
    sendBoard({ type: "announce", code, status: "open", kind: netMode });
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
    resetPvpMatch();
    Object.assign(myOffer, emptyOffer());
    Object.assign(theirOffer, emptyOffer());
    resetTradeLockState();
    clearPartnerPresence();
    els.lobbyCode.textContent = "------";
    renderTradeSlots();
    renderBattleLobby();
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
    copyNormalizedOffer(theirOffer, data);
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
      if (role === "host") markLobbyFull();
      if (netMode === "battle") {
        setStatus("Connected — pick your team");
        sendPayload({
          type: "hello",
          username: sessionUser || "Guest",
          unkickable: Boolean(shop.unkickable),
        });
        renderBattleLobby();
        return;
      }
      setStatus("Connected — trading live");
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
        if (battle && battle.mode === "pvp") {
          battleAnimGen += 1;
          battle = null;
          hideBattleReward();
          if (els.battleParty) els.battleParty.hidden = true;
        }
        destroySession();
        showScreen("trade");
        setError(
          els.tradeError,
          netMode === "battle" ? "You were kicked from the battle room." : "You were kicked from the trade room."
        );
        return;
      }
      if (data.type === "kick-denied") {
        kickingPartner = false;
        partnerUnkickable = true;
        updatePartnerChrome();
        setStatus(netMode === "battle" ? "Connected — pick your team" : "Connected — trading live");
        setError(els.tradeError, "Kick failed — that player is unkickable.");
        return;
      }
      if (handlePvpMessage(data)) return;
      if (netMode === "battle") {
        if (data.type === "hello" || data.type === "offer") {
          if (typeof data.username === "string" && data.username.trim()) {
            partnerUsername = data.username.trim();
          }
          if (typeof data.unkickable === "boolean") partnerUnkickable = data.unkickable;
          updatePartnerChrome();
          setStatus("Connected — pick your team");
          renderBattleLobby();
        }
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
        copyNormalizedOffer(theirOffer, data);
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
      if (netMode === "battle" && battle && battle.mode === "pvp") {
        if (!battle.over) {
          battle.over = true;
          showBattleReward(null, {
            title: "You win",
            copy: wasKick ? "You kicked your opponent." : "Your opponent disconnected.",
            doneLabel: "Done",
            action: "leave-pvp",
          });
          renderBattle();
        }
        return;
      }
      resetPvpMatch();
      setStatus(wasKick ? "Partner kicked — waiting…" : "Partner disconnected — waiting…");
      Object.assign(theirOffer, emptyOffer());
      resetTradeLockState();
      clearPartnerPresence();
      renderTradeSlots();
      renderBattleLobby();
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
    renderBattleLobby();
  }

  function setLobbyMenuBusy(busy) {
    els.btnCreate.disabled = busy;
    els.btnJoin.disabled = busy;
    els.btnQuick.disabled = busy;
  }

  function createTradeSpace() {
    setError(els.tradeError, "");
    setLobbyMenuBusy(true);
    destroySession({ keepBoard: true });
    role = "host";
    const code = randomCode();
    try {
      peer = makePeer(peerIdFromCode(code));
    } catch (_) {
      setLobbyMenuBusy(false);
      setError(els.tradeError, "Network library failed to load. Refresh and try again.");
      return;
    }

    peer.on("open", async () => {
      setLobbyMenuBusy(false);
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
      setLobbyMenuBusy(false);
      const kind = netMode === "battle" ? "battle" : "trade";
      const msg =
        err?.type === "unavailable-id"
          ? "That lobby code was taken. Try creating again."
          : `Could not create a ${kind} space. Check your connection and try again.`;
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
    try {
      peer = makePeer();
    } catch (_) {
      els.btnJoinConfirm.disabled = false;
      const msg = "Network library failed to load. Refresh and try again.";
      if (returnScreen === "quick") setError(els.quickError, msg);
      else setError(els.joinError, msg);
      return;
    }

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
      }, JOIN_TIMEOUT_MS);

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
    if (!requireOnlineAccount("trade")) return;
    netMode = "trade";
    resetPvpMatch();
    setError(els.tradeError, "");
    syncLobbyMenuUi();
    showScreen("trade");
  });
  els.btnLoginRequiredOk.addEventListener("click", () => {
    els.loginRequiredModal.hidden = true;
    refreshFabs();
    showScreen(lobbyHomeScreen());
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
  if (els.btnMultiplayerBattles) {
    els.btnMultiplayerBattles.addEventListener("click", openMultiplayerBattles);
  }
  if (els.btnTrialMode) els.btnTrialMode.addEventListener("click", openTrialMode);
  els.btnCardShopBack.addEventListener("click", () => showScreen("play"));
  els.btnSellStopBack.addEventListener("click", () => showScreen("play"));
  els.btnBattlesBack.addEventListener("click", () => showScreen("play"));
  els.btnNpcBattlesBack.addEventListener("click", () => showScreen("battles"));
  els.npcFighterList.addEventListener("click", (e) => {
    hideNpcRewardTip();
    const btn = e.target.closest("[data-npc-id]");
    if (!btn) return;
    openNpcBattle(btn.getAttribute("data-npc-id"));
  });
  els.npcFighterList.addEventListener("contextmenu", (e) => {
    const btn = e.target.closest("[data-npc-id]");
    if (!btn) return;
    e.preventDefault();
    showNpcRewardTip(btn.getAttribute("data-npc-id"), e.clientX, e.clientY);
  });
  els.npcFighterList.addEventListener("scroll", hideNpcRewardTip);
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
    if (inventoryMode === "mutate" || inventoryMode === "clear") {
      closeFireConfirm();
      pendingGemItemId = null;
      pendingClearItemId = null;
      inventoryMode = "browse";
      inventoryTab = "items";
      renderInventoryList();
      return;
    }
    if (inventoryMode === "craft") {
      clearCraftPicks();
      inventoryMode = "browse";
      showScreen("crafting");
      renderCrafting();
      return;
    }
    const back =
      inventoryMode === "trade"
        ? "room"
        : inventoryMode === "sell"
          ? "sellStop"
          : inventoryMode === "battle"
            ? pendingBattleKind === "trial"
              ? "battles"
              : pendingBattleKind === "pvp"
                ? "room"
                : "npcBattles"
            : inventoryReturnScreen || "title";
    inventoryMode = "browse";
    pendingSellSlot = null;
    pendingBattleNpc = null;
    pendingBattleKind = null;
    pendingBattleTeam = [];
    showScreen(back);
  });
  els.btnBackpack.addEventListener("click", () => openInventory("browse"));
  els.btnIndex.addEventListener("click", openIndex);
  els.btnIndexBack.addEventListener("click", () => {
    showScreen(indexReturnScreen || "title");
  });
  els.btnIndexClaim.addEventListener("click", claimIndexRewards);
  els.indexGrid.addEventListener("click", (e) => {
    const slot = e.target.closest("[data-index-card]");
    if (!slot || !els.indexGrid.contains(slot)) return;
    openIndexDetail(slot.getAttribute("data-index-card"));
  });
  els.btnIndexDetailClose.addEventListener("click", hideIndexDetail);
  els.indexDetailModal.addEventListener("click", (e) => {
    if (e.target === els.indexDetailModal) hideIndexDetail();
  });
  els.btnQuests.addEventListener("click", openQuests);
  els.btnQuestsBack.addEventListener("click", () => {
    showScreen(questsReturnScreen || "title");
  });
  els.btnCrafting.addEventListener("click", openCrafting);
  els.btnCraftingBack.addEventListener("click", () => {
    if (craftTab === "bench" && selectedCraftRecipeId) {
      selectedCraftRecipeId = null;
      renderCrafting();
      return;
    }
    showScreen(craftReturnScreen || "title");
  });
  document.querySelectorAll("[data-craft-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const next = tab.getAttribute("data-craft-tab");
      craftTab = next === "merger" || next === "shop" ? next : "bench";
      selectedCraftRecipeId = null;
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
    const gridBack = e.target.closest("[data-craft-grid-back]");
    if (gridBack) {
      selectedCraftRecipeId = null;
      renderCrafting();
      return;
    }
    const openRecipe = e.target.closest("[data-open-recipe]");
    if (openRecipe) {
      selectedCraftRecipeId = openRecipe.getAttribute("data-open-recipe");
      renderCrafting();
      return;
    }
    const buyBtn = e.target.closest("[data-buy-crafter]");
    if (buyBtn) {
      buyCrafterGood(buyBtn.getAttribute("data-buy-crafter"));
      return;
    }
    const craftBtn = e.target.closest("[data-craft-recipe]");
    if (craftBtn) startCraftRecipe(craftBtn.getAttribute("data-craft-recipe"));
    const claim = e.target.closest("[data-claim-craft]");
    if (claim) claimCraftJob(claim.getAttribute("data-claim-craft"));
  });
  els.btnCraftResultDone.addEventListener("click", hideCraftResult);
  els.btnBattleRewardDone.addEventListener("click", finishBattleReward);
  document.querySelectorAll("[data-quest-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      questTab = tab.getAttribute("data-quest-tab") === "event" ? "event" : "daily";
      renderQuests();
    });
  });
  els.questsList.addEventListener("click", (e) => {
    const refresh = e.target.closest("[data-refresh-quest]");
    if (refresh) {
      refreshEventQuest(refresh.getAttribute("data-refresh-quest"));
      return;
    }
    const btn = e.target.closest("[data-claim-quest]");
    if (!btn || btn.disabled) return;
    claimQuest(btn.getAttribute("data-claim-quest"));
  });
  els.btnBuyCommonPack.addEventListener("click", () => buyPack("common-pack"));
  els.btnBuyRarePack.addEventListener("click", () => buyPack("rare-pack"));
  if (els.btnAdminGrantElectrified) {
    els.btnAdminGrantElectrified.addEventListener("click", grantElectrifiedPack);
  }
  if (els.btnEngineHealTeam) els.btnEngineHealTeam.addEventListener("click", confirmEngineChargeHeal);
  if (els.btnEngineRevive) els.btnEngineRevive.addEventListener("click", showEngineChargeRevivePicks);
  if (els.btnEngineChargeCancel) {
    els.btnEngineChargeCancel.addEventListener("click", () => {
      if (pendingEngineCharge && els.engineChargeReviveList && !els.engineChargeReviveList.hidden) {
        showEngineChargePrompt(pendingEngineCharge.index);
        return;
      }
      hideEngineChargeModal();
    });
  }
  if (els.engineChargeReviveList) {
    els.engineChargeReviveList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-engine-revive]");
      if (!btn) return;
      confirmEngineChargeRevive(Number(btn.getAttribute("data-engine-revive")));
    });
  }
  if (els.battleItemDock) {
    els.battleItemDock.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-battle-item]");
      if (!btn) return;
      openBattleItemPicker(btn.getAttribute("data-battle-item"));
    });
  }
  if (els.btnBattleItemCancel) els.btnBattleItemCancel.addEventListener("click", hideBattleItemModal);
  if (els.battleItemList) {
    els.battleItemList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-battle-item-target]");
      if (!btn) return;
      confirmBattleItemTarget(Number(btn.getAttribute("data-battle-item-target")));
    });
  }
  if (els.battleItemModal) {
    els.battleItemModal.addEventListener("click", (e) => {
      if (e.target === els.battleItemModal) hideBattleItemModal();
    });
  }
  els.btnRevealDone.addEventListener("click", hidePackReveal);

  els.btnAdminGateCancel.addEventListener("click", closeAdminGate);
  els.btnAdminGateEnter.addEventListener("click", tryAdminLogin);
  els.adminPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryAdminLogin();
  });
  els.btnAdminClose.addEventListener("click", closeAdminSettings);
  els.btnRestockTokenNo.addEventListener("click", closeRestockTokenModal);
  els.btnRestockTokenYes.addEventListener("click", confirmRestockToken);
  if (els.btnFireMutateNo) els.btnFireMutateNo.addEventListener("click", cancelFireMutate);
  if (els.btnFireMutateYes) {
    els.btnFireMutateYes.addEventListener("click", () => {
      if (pendingClearItemId) confirmClearMutate();
      else confirmFireMutate();
    });
  }
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
    if (shop.noQuestCooldown) {
      player.questLocks = [];
      player.eventQuestLocks = [];
    }
    ensureQuestBoard();
    savePlayer();
    if (currentScreen === "quests") renderQuests();
  });
  if (els.adminNoCraftWait) {
    els.adminNoCraftWait.addEventListener("change", () => {
      shop.noCraftWait = els.adminNoCraftWait.checked;
      saveShop();
      if (currentScreen === "crafting") renderCrafting();
    });
  }
  if (els.adminLuck) {
    els.adminLuck.addEventListener("input", () => applyLuckFromAdmin(false));
    els.adminLuck.addEventListener("change", () => applyLuckFromAdmin(true));
    els.adminLuck.addEventListener("blur", () => applyLuckFromAdmin(true));
  }
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
    if (els.itemDiscardModal && !els.itemDiscardModal.hidden) return;
    if (els.battleItemModal && !els.battleItemModal.hidden) return;
    if (els.restockTokenModal && !els.restockTokenModal.hidden) return;
    if (els.fireMutateModal && !els.fireMutateModal.hidden) return;
    if (els.craftResult && !els.craftResult.hidden) return;
    e.preventDefault();
    openAdminGate();
  });

  els.btnTradeBack.addEventListener("click", () => {
    destroySession();
    showScreen(lobbyHomeScreen());
  });

  document.querySelectorAll(".inv-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      if (inventoryMode === "sell" || inventoryMode === "battle" || inventoryMode === "mutate" || inventoryMode === "clear" || inventoryMode === "craft") return;
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
      const itemId = useBtn.getAttribute("data-use-item");
      if (itemId === "restock-token") openRestockTokenModal();
      else if (itemId === "luck-i-potion") useLuckIPotion();
      else if (GEM_ITEMS[itemId]) openGemPicker(itemId);
      else if (CLEAR_ITEMS[itemId]) openClearPicker(itemId);
      return;
    }
    const packPick = e.target.closest("[data-pick-pack]");
    if (packPick && inventoryMode === "trade") {
      if (myConfirmed) return;
      openQtyModal("pack", packPick.getAttribute("data-pick-pack"));
      return;
    }
    const itemPick = e.target.closest("[data-pick-item]");
    if (itemPick && inventoryMode === "trade") {
      if (myConfirmed) return;
      openQtyModal("item", itemPick.getAttribute("data-pick-item"));
      return;
    }
    const cardBtn = e.target.closest("[data-pick-card]");
    if (!cardBtn) return;
    const cardId = cardBtn.getAttribute("data-pick-card");
    if (inventoryMode === "trade") {
      if (myConfirmed) return;
      openQtyModal("card", cardId);
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
        const team = pendingBattleTeam.slice();
        if (pendingBattleKind === "trial") startTrialWave(team, 1);
        else if (pendingBattleKind === "pvp") submitPvpTeam(team);
        else startBattle(team, pendingBattleNpc);
      } else {
        renderInventoryList();
      }
      return;
    }
    if (inventoryMode === "craft") {
      const recipe = CRAFT_RECIPES[pendingCraftRecipeId];
      if (!recipe || !recipe.pick) return;
      if (parseCardKey(cardId).mutation !== recipe.pick.mutation) return;
      const remaining =
        (player.cards[cardId] || 0) -
        pendingCraftPicks.filter((picked) => picked === cardId).length;
      if (remaining <= 0) return;
      pendingCraftPicks.push(cardId);
      if (pendingCraftPicks.length >= recipe.pick.count) finishCraftMaterialPicks();
      else renderInventoryList();
      return;
    }
    if (inventoryMode === "mutate") {
      promptFireMutate(cardId);
      return;
    }
    if (inventoryMode === "clear") {
      promptClearMutate(cardId);
    }
  });

  els.inventoryList.addEventListener("contextmenu", (e) => {
    if (inventoryMode !== "browse") return;
    const itemRow = e.target.closest("[data-discard-item]");
    if (itemRow && els.inventoryList.contains(itemRow)) {
      e.preventDefault();
      openItemDiscardModal(itemRow.getAttribute("data-discard-item"));
      return;
    }
    const cardBtn = e.target.closest("[data-pick-card]");
    if (!cardBtn) return;
    e.preventDefault();
    openCardSellModal(cardBtn.getAttribute("data-pick-card"));
  });

  els.cardSellQty.addEventListener("input", updateCardSellTotal);
  els.btnSellKeepOne.addEventListener("click", setSellKeepOne);
  els.btnCardSellCancel.addEventListener("click", closeCardSellModal);
  els.btnCardSellConfirm.addEventListener("click", confirmCardSell);
  if (els.itemDiscardQty) els.itemDiscardQty.addEventListener("input", updateItemDiscardQty);
  if (els.btnDiscardKeepOne) els.btnDiscardKeepOne.addEventListener("click", setDiscardKeepOne);
  if (els.btnItemDiscardCancel) els.btnItemDiscardCancel.addEventListener("click", closeItemDiscardModal);
  if (els.btnItemDiscardConfirm) els.btnItemDiscardConfirm.addEventListener("click", confirmItemDiscard);
  if (els.itemDiscardModal) {
    els.itemDiscardModal.addEventListener("click", (e) => {
      if (e.target === els.itemDiscardModal) closeItemDiscardModal();
    });
  }

  els.myTradeItems.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-kind]");
    if (!btn || myConfirmed) return;
    removeTradeGood(btn.getAttribute("data-remove-kind"), btn.getAttribute("data-remove-id"));
  });
  els.btnAddTradeCard.addEventListener("click", () => {
    if (myConfirmed) return;
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
  if (els.btnBattlePickTeam) {
    els.btnBattlePickTeam.addEventListener("click", () => {
      if (!conn || !conn.open || myPvpTeam) return;
      pendingBattleKind = "pvp";
      pendingBattleNpc = null;
      pendingBattleTeam = [];
      openInventory("battle");
    });
  }
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
    else renderLuckBoostHud();
  });
  window.addEventListener("pageshow", () => {
    startLuckBoostHudTimer();
    renderLuckBoostHud();
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
  startLuckBoostHudTimer();
  renderLuckBoostHud();
  savePlayer();
})();
