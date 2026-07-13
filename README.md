# Moving Gallery

Two experimental Three.js galleries exploring different scroll-based animation concepts.

## Galleries

### Gallery 1 — Auto-play Pass-by
**File:** `index.html` (root)

Cards animate in a continuous loop, passing by like billboards viewed from a moving car. Each card appears, grows to full size, then shrinks and fades — overlapping slightly with the next card.

- **Trigger:** Auto-plays on load / scroll advances the timeline
- **Layout:** Vertical arc in 3D space
- **Hover:** Tilt/parallax effect on mouse hover

### Gallery 2 — Scroll Sequential Diagonal
**File:** `gallery2.html`

Cards appear one at a time, scroll-controlled. Each card starts as a small image at center, grows to full size, and moves diagonally to alternating sides — Card 0 → up-left, Card 1 → down-right, Card 2 → up-left, etc. The next card only begins after the current one fades out.

- **Trigger:** Scroll-driven (no auto-play)
- **Layout:** Sequential, no overlap between cards
- **Motion:** Diagonal (horizontal + vertical)

## Setup

```bash
npm install
npm run dev
```

## Access

| Page | URL |
|---|---|
| Gallery 1 | `http://localhost:5173/` |
| Gallery 2 | `http://localhost:5173/gallery2.html` |

## Tech

- [Three.js](https://threejs.org/) — 3D rendering
- [Vite](https://vitejs.dev/) — dev server and build
