# Card Game

Static browser card game for GitHub Pages: shop, packs, collection, and live trading.

## Play

- Start with **200 Coins**
- **Card shop** — buy a **Common Pack** for **100 Coins**
- **Backpack** (bottom-right) has tabs: **Packs / Cards / Items**
- Tap a pack to open it and draw **5 cards** (weighted Common Pack odds)

## Trade

1. Create / join / Quick Lobby as before
2. Your offer slot shows **+** — tap it, pick a card from inventory, choose quantity
3. Estimated value = card **$** price × quantity
4. Partner sees your offer live (read-only)

## Deploy

Push to GitHub → **Settings → Pages** → branch `/ (root)`.

## Local

```bash
npx --yes serve .
```
