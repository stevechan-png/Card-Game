# Card Game

A static browser app for GitHub Pages with a title menu, an empty Play screen, and a live 2-player Trade desk.

## Title screen

- **Play** — placeholder screen for now
- **Trade** — trading lobby menu

## Trade

1. **Create Trade Space** — host a lobby and share the code (also listed in Quick Lobby)
2. **Join Trade Space** — enter a 6-character lobby code
3. **Quick Lobby** — see open lobbies and join with one click (no code typing)

In the trade room, each player fills **Item**, **Amount**, and **Estimated value**. Your side is editable; theirs updates live and is read-only. Rate shown at the top: **1 oak log = 1 value**.

## Deploy on GitHub Pages

1. Push these files to a GitHub repository.
2. **Settings → Pages** → Deploy from a branch → `/ (root)`.
3. Open the Pages URL after it finishes building.

`.nojekyll` is included so Pages serves files as-is.

## Local preview

```bash
npx --yes serve .
```

Use two browser windows (or one normal + one private) to test create/join and Quick Lobby.

## Notes

- Real-time sync uses [PeerJS](https://peerjs.com/). Both players need internet.
- Quick Lobby discovery uses a shared PeerJS lobby board; open rooms appear while the host is waiting for a partner.
