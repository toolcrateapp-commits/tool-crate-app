# ToolCrate — v11 "HANDS ON"

Browser-runnable build of the v11 prototype. No build step, no bundler, no `npm install`.

```
index.html      entry point — React + JSX transpile loaded from CDN
app.jsx         the prototype (178 KB)
assets/         113 tool photos
.nojekyll       tells GitHub Pages to serve every file as-is
```

---

## Put it online (GitHub Pages)

1. Go to **github.com/new**. Name it `toolcrate` (or anything). **Public**. Don't add a README — you already have one.
2. On the empty repo page click **uploading an existing file**.
3. Drag in **everything**: `index.html`, `app.jsx`, `.nojekyll`, and the whole `assets` folder. Commit.
4. **Settings → Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**. Save.
5. Wait ~60 seconds, then open:

   ```
   https://<your-username>.github.io/toolcrate/
   ```

That URL works on any phone or desktop. Send it to anyone.

**If you want it private:** GitHub Pages on a private repo needs a paid plan. Free alternatives that take the same drag-and-drop folder — [netlify.com/drop](https://app.netlify.com/drop) or [vercel.com](https://vercel.com) — give you a private-ish URL in about 30 seconds with no repo at all.

---

## Preview it locally first

**Double-clicking `index.html` will not work.** Browsers block loading `app.jsx` over `file://`. You need a local server:

```bash
cd toolcrate-v11
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

If it fails, the page tells you why on screen instead of going blank.

---

## Swapping in real tool photos

`app.jsx` has a `PHOTOS` map near the top, keyed by exact tool name. Every one of the 113 tools currently points at a local file:

```js
"Milwaukee Pry Bar": "assets/milwaukee-pry-bar.webp",
```

To replace a photo, either **overwrite the file in `assets/`** keeping the same name, or **point the key at any URL**:

```js
"Milwaukee Pry Bar": "https://cdn.yoursite.com/48-22-9042.webp",
```

Set it to `""` and that tool falls back to the line drawing. A wrong URL or missing file also falls back silently — it will never show a broken image.

Shooting guidance is in the comment block above `PHOTOS`: transparent background, ~800×800, 3/4 angle, tool filling ~80% of frame. White backgrounds ruin the reveal, since the tool rises out of a glow.

---

## Two things worth knowing

**The internal crate IDs are the legacy names.** In the code the catalogs are `starter`, `builder`, `foreman` — those are today's **Builder**, **Foreman**, and **Contractor**. Confirmed by price and by catalog contents:

| Code variable | Tools | Value range | Actually is |
|---|---|---|---|
| `STARTER_ITEMS` | 45 | $19.90 – $398 | **Builder** ($50) |
| `BUILDER_ITEMS` | 48 | $40.90 – $767 | **Foreman** ($100) |
| `FOREMAN_ITEMS` | 38 | $101.90 – $1,444 | **Contractor** ($250) |

Renaming these variables is cosmetic and safe, but it touches `CATALOG`, `tierStats()`, and every tier reference — worth doing deliberately in one pass rather than mid-session.

**Odds don't total exactly 100%.** Measured from the catalogs:

| Catalog | Odds sum |
|---|---|
| `STARTER_ITEMS` | 99.9997% |
| `BUILDER_ITEMS` | 99.9999% |
| `FOREMAN_ITEMS` | 100.0004% |

Rounding dust, and invisible to the reveal logic. But "every crate odds table must total 100%" is a launch gate and published odds have to be literally true, so it needs cleaning before launch — not before a demo.

---

## Production note

This build transpiles JSX in the browser via Babel standalone. That is the right trade for a prototype you want on a URL in five minutes: nothing to install, nothing to rebuild when you edit `app.jsx`.

It costs about a 2.7 MB one-time CDN download and roughly a second of startup. For a real launch, move to Vite (`npm create vite@latest`) and drop `app.jsx` in as a component — the code needs no changes beyond restoring the `import` line and the `export default`.
