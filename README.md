# Trade Space

A simple 2-player trading lobby that runs as a static site on GitHub Pages.

## How to play

1. Open the site and choose **Create Trade Space**.
2. Share the **lobby code** with the other player.
3. The other player chooses **Join Trade Space** and enters the code.
4. At the top: **1 oak log = 1 value**.
5. Each player fills in **Item**, **Amount**, and **Estimated value** (all text fields).
6. You can only edit your own side. Their side updates live and is read-only.

## Deploy on GitHub Pages

1. Create a GitHub repository and push these files to the default branch.
2. In the repo: **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Choose your default branch and `/ (root)`, then save.
5. After a minute or two, open the Pages URL.

This project already includes `.nojekyll` so GitHub Pages serves the files as-is.

## Local preview

```bash
npx --yes serve .
```

Open the local URL in two browser windows (or one normal + one private window) to test create/join.

## Notes

- Real-time sync uses [PeerJS](https://peerjs.com/) (browser-to-browser). Both players need internet access.
- Lobby codes are 6 characters.
- A lobby supports two players.
