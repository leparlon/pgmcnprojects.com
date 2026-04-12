/* ═══════════════════════════════════════════════════
   Clock In — script.js

   Two systems:

   1. Parallax bus scene
      Continuous horizontal scroll, 4 layers at
      different speeds. Loop is seamless.

   2. Subtle wrongness
      Things that happen if you stay long enough.
      Not bugs. Not errors. Just... changes.
═══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. PARALLAX

   Source images are 1280×720 px.
   Layers use background-size: auto 100%, so at
   viewport height H, each tile is (1280/720)*H wide.
   We animate background-position-x from 0 → −tileW
   and mod-wrap for a seamless continuous loop.

   Speeds are in px/s at the source image height (720px).
   They scale proportionally with actual viewport height.

   yOffset — vertical position tweak per layer, as a fraction of viewport height.
     0     = anchored to bottom (default)
     0.306 = image shifts UP by ~30.6 % of viewport height
     (220px at 720px source height → 220/720 ≈ 0.306)
───────────────────────────────────────── */
const LAYERS = [
  { el: document.getElementById('l3'), speed: 18,  yOffset: 0.306 }, /* furthest, slowest */
  { el: document.getElementById('l2'), speed: 38,  yOffset: 0.306 },
  { el: document.getElementById('l1'), speed: 68,  yOffset: 0.306 },
  { el: document.getElementById('l0'), speed: 115, yOffset: 0     }, /* closest,  fastest */
];

/* Apply Y offsets once — edit the yOffset values above to reposition each layer */
for (const layer of LAYERS) {
  layer.el.style.backgroundPositionY = `bottom ${(layer.yOffset * 100).toFixed(1)}vh`;
}

const IMG_ASPECT = 1280 / 720; /* source image aspect ratio */

const offsets = [0, 0, 0, 0];
let   last    = 0;

/* speedMult: increases imperceptibly over time — see "speed creep" below */
let speedMult = 1.0;

function tick(ts) {
  const dt    = Math.min(ts - last, 50) / 1000; /* seconds; capped at 50ms */
  last = ts;

  /* Tile width scales with viewport height */
  const tileW = IMG_ASPECT * window.innerHeight;

  for (let i = 0; i < LAYERS.length; i++) {
    offsets[i] = (offsets[i] + LAYERS[i].speed * speedMult * dt) % tileW;
    LAYERS[i].el.style.backgroundPositionX = `-${offsets[i].toFixed(1)}px`;
  }

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

/* ─────────────────────────────────────────
   2. SUBTLE WRONGNESS
───────────────────────────────────────── */

/* ── Speed creep ──
   Every 60 seconds the bus gets slightly faster.
   After 5 minutes it is 1.2x. Barely perceptible.
   You have been on this bus for a while now.
*/
setInterval(() => {
  speedMult = Math.min(speedMult + 0.04, 1.5);
}, 60_000);

/* ── Bus vibration ──
   An occasional brief jitter — like a pothole,
   or a seam in the road. Happens every 8–15 seconds.
   Starts after the first 12 seconds.
*/
const busOverlay = document.getElementById('bus-overlay');
busOverlay.style.transition = 'transform 0.08s';

function vibrate() {
  const dx = (Math.random() - 0.5) * 4;
  const dy = (Math.random() - 0.5) * 2;
  busOverlay.style.transform = `translate(${dx}px, ${dy}px)`;
  setTimeout(() => { busOverlay.style.transform = ''; }, 90);
  setTimeout(vibrate, 8000 + Math.random() * 7000);
}

setTimeout(vibrate, 12000);

/* ── Day counter ──
   Days advance every 40 seconds.
   After Day 7, it resets to Day 1 quietly.
   You have been here before.
*/
const dayLabel = document.getElementById('day-label');
dayLabel.style.transition = 'opacity 0.5s';
let currentDay = 1;

setInterval(() => {
  currentDay = currentDay >= 7 ? 1 : currentDay + 1;
  dayLabel.style.opacity = '0';
  setTimeout(() => {
    dayLabel.textContent = `Day ${currentDay}`;
    dayLabel.style.opacity = '';
  }, 500);
}, 40_000);

/* ── Title flip ──
   After 2 minutes the title changes for a few seconds.
   Only once. Only if you are still here.
   Then it goes back, like nothing happened.
*/
const titleEl = document.getElementById('main-title');

setTimeout(() => {
  titleEl.style.transition = 'opacity 0.9s';

  /* Fade out */
  titleEl.style.opacity = '0';

  setTimeout(() => {
    titleEl.textContent = 'CLOCK OUT';
    titleEl.style.opacity = '0.50';
  }, 900);

  /* Fade back */
  setTimeout(() => { titleEl.style.opacity = '0'; }, 5400);

  setTimeout(() => {
    titleEl.textContent = 'CLOCK IN';
    titleEl.style.opacity = '0.86';
    titleEl.style.transition = '';
  }, 6400);

}, 2 * 60 * 1000);
