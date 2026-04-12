/* ═══════════════════════════════════════════════════
   My Pet Elegans — script.js

   Two canvas layers:

   1. #filament-canvas  (full-page, fixed)
      Neural filament lines + drifting nodes.
      Inspired by the game's main menu background.

   2. #dish-canvas  (hero section only)
      Soft petri-dish spotlight + drifting motes +
      animated worm (kinematic chain, 20 segments).
      Worm steers gently toward the pointer.
═══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   Shared utilities
───────────────────────────────────────── */
const TWO_PI = Math.PI * 2;
const rnd    = (a, b) => a + Math.random() * (b - a);
const lerp   = (a, b, t) => a + (b - a) * t;
const clamp  = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ═══════════════════════════════════════════════════
   1. FILAMENT BACKGROUND
   Flowing neural filament lines with drifting nodes,
   matching the palette and mood of the game menu.
═══════════════════════════════════════════════════ */
(function initFilament() {
  const canvas = document.getElementById('filament-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* Tune these to adjust density / speed */
  const NODE_COUNT   = 36;
  const CONNECT_DIST = 210;  /* px — max distance for a connection line */
  const NODE_SPEED   = 0.10; /* max px per frame */

  let W, H, nodes = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeNode() {
    return {
      x:     rnd(0, W || window.innerWidth),
      y:     rnd(0, H || window.innerHeight),
      vx:    rnd(-NODE_SPEED, NODE_SPEED),
      vy:    rnd(-NODE_SPEED, NODE_SPEED),
      r:     rnd(1.4, 3.2),
      phase: rnd(0, TWO_PI),
    };
  }

  for (let i = 0; i < NODE_COUNT; i++) nodes.push(makeNode());

  resize();
  window.addEventListener('resize', resize);

  function updateNodes() {
    for (const n of nodes) {
      n.x     += n.vx;
      n.y     += n.vy;
      n.phase += 0.007;
      /* Soft bounce */
      if (n.x < 0) { n.x = 0;  n.vx *= -1; }
      if (n.x > W) { n.x = W;  n.vx *= -1; }
      if (n.y < 0) { n.y = 0;  n.vy *= -1; }
      if (n.y > H) { n.y = H;  n.vy *= -1; }
    }
  }

  function drawFilament() {
    ctx.clearRect(0, 0, W, H);

    /* Connection arcs between nearby nodes */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > CONNECT_DIST) continue;

        const alpha = (1 - dist / CONNECT_DIST) * 0.16;

        /* Slight arc: control point offset perpendicular to midpoint.
           The phase difference creates a gentle breathing bow. */
        const mx   = (a.x + b.x) * 0.5;
        const my   = (a.y + b.y) * 0.5;
        const perp = Math.atan2(dy, dx) + Math.PI * 0.5;
        const bow  = Math.sin(a.phase - b.phase) * 20;
        const cpx  = mx + Math.cos(perp) * bow;
        const cpy  = my + Math.sin(perp) * bow;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cpx, cpy, b.x, b.y);
        ctx.strokeStyle = `rgba(188, 207, 228, ${alpha})`;
        ctx.lineWidth   = 0.75;
        ctx.stroke();
      }
    }

    /* Node circles — subtle pulse */
    for (const n of nodes) {
      const pulse = 0.32 + 0.18 * Math.sin(n.phase);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, TWO_PI);
      ctx.fillStyle = `rgba(208, 220, 236, ${pulse})`;
      ctx.fill();
    }
  }

  function loop() {
    updateNodes();
    drawFilament();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();


/* ═══════════════════════════════════════════════════
   2. DISH CANVAS
   Petri dish spotlight, drifting motes, and
   the animated worm — all living inside the hero.
═══════════════════════════════════════════════════ */
(function initDish() {
  const canvas = document.getElementById('dish-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, cx, cy, dishR;

  /* ── Pointer tracking ──────────────────────────── */
  const pointer = { x: null, y: null };

  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  });

  window.addEventListener('mouseleave', () => {
    pointer.x = pointer.y = null;
  });

  window.addEventListener('touchmove', e => {
    const r = canvas.getBoundingClientRect();
    const t = e.touches[0];
    pointer.x = t.clientX - r.left;
    pointer.y = t.clientY - r.top;
  }, { passive: true });

  /* ── Canvas resize ─────────────────────────────── */
  function resize() {
    /* Use the hero section's dimensions */
    const parent = canvas.parentElement;
    W = canvas.width  = parent.offsetWidth  || window.innerWidth;
    H = canvas.height = parent.offsetHeight || window.innerHeight;
    cx = W * 0.5;
    cy = H * 0.5;
    dishR = Math.min(W, H) * 0.38;
    /* Re-scatter motes on resize */
    spawnMotes();
  }

  window.addEventListener('resize', resize);

  /* ── Spotlight pulse ───────────────────────────── */
  let spotPhase = 0; /* slow breathe for the dish glow */

  /* ── Dust motes ────────────────────────────────── */
  /* Tiny biological debris drifting in the dish */
  const MOTE_COUNT = 26;
  let motes = [];

  function makeMote() {
    const angle  = rnd(0, TWO_PI);
    const radius = rnd(0, dishR * 0.88);
    return {
      x:     cx + Math.cos(angle) * radius,
      y:     cy + Math.sin(angle) * radius,
      vx:    rnd(-0.06, 0.06),
      vy:    rnd(-0.06, 0.06),
      r:     rnd(0.8, 2.0),
      alpha: rnd(0.05, 0.16),
      phase: rnd(0, TWO_PI),
    };
  }

  function spawnMotes() {
    motes = [];
    for (let i = 0; i < MOTE_COUNT; i++) motes.push(makeMote());
  }

  function updateMotes() {
    for (const m of motes) {
      m.x     += m.vx;
      m.y     += m.vy;
      m.phase += 0.010;
      /* Soft confinement to dish edge */
      const dx = m.x - cx, dy = m.y - cy;
      const d  = Math.sqrt(dx * dx + dy * dy);
      const limit = dishR * 0.92;
      if (d > limit) {
        m.vx -= (dx / d) * 0.018;
        m.vy -= (dy / d) * 0.018;
      }
    }
  }

  function drawMotes() {
    for (const m of motes) {
      const a = m.alpha * (0.65 + 0.35 * Math.sin(m.phase));
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, TWO_PI);
      ctx.fillStyle = `rgba(168, 190, 215, ${a})`;
      ctx.fill();
    }
  }

  /* ── Worm ──────────────────────────────────────── */
  /*
    Kinematic chain: 20 segments.
    Head wanders with sinusoidal steering + gentle
    attraction toward the pointer when it is nearby.
    Each segment trails the one in front.
    Body is drawn tapered — wide at the head, thin at
    the tail — to match the game's tiny worm silhouette.

    Swap SEGS / SEG_LEN to change body length.
  */
  const SEGS    = 20;
  const SEG_LEN = 7;    /* px between consecutive segments */

  const worm = {
    segs:        [],
    angle:       rnd(0, TWO_PI),
    wigglePhase: 0,
    speed:       0.50,
  };

  function initWorm() {
    worm.segs = [];
    for (let i = 0; i < SEGS; i++) {
      worm.segs.push({
        x: cx - Math.cos(worm.angle) * i * SEG_LEN,
        y: cy - Math.sin(worm.angle) * i * SEG_LEN,
      });
    }
  }

  function updateWorm(dt) {
    /* dt normalised to 60 fps */
    const t60 = dt / 16.67;

    worm.wigglePhase += 0.036 * t60;

    const head   = worm.segs[0];
    const wiggle = Math.sin(worm.wigglePhase) * 0.52;

    /* Pointer attraction — worm notices movement nearby */
    let steer = 0;
    if (pointer.x !== null) {
      const pdx  = pointer.x - head.x;
      const pdy  = pointer.y - head.y;
      const pdst = Math.sqrt(pdx * pdx + pdy * pdy);
      if (pdst < dishR * 0.75 && pdst > 8) {
        let diff = Math.atan2(pdy, pdx) - worm.angle;
        while (diff >  Math.PI) diff -= TWO_PI;
        while (diff < -Math.PI) diff += TWO_PI;
        steer = diff * 0.016;
      }
    }

    worm.angle += wiggle * 0.024 * t60 + steer * t60;

    /* Edge avoidance — turn away from dish boundary */
    const edx   = head.x - cx, edy = head.y - cy;
    const edist = Math.sqrt(edx * edx + edy * edy);
    const margin = dishR * 0.80;
    if (edist > margin) {
      let diff = Math.atan2(-edy, -edx) - worm.angle;
      while (diff >  Math.PI) diff -= TWO_PI;
      while (diff < -Math.PI) diff += TWO_PI;
      worm.angle += diff * 0.07 * t60;
      /* Gently push head back inside */
      const nx = edx / edist, ny = edy / edist;
      head.x -= nx * (edist - margin) * 0.4;
      head.y -= ny * (edist - margin) * 0.4;
    }

    /* Advance head */
    head.x += Math.cos(worm.angle) * worm.speed * t60;
    head.y += Math.sin(worm.angle) * worm.speed * t60;

    /* Kinematic chain — each segment follows the one ahead */
    for (let i = 1; i < SEGS; i++) {
      const prev = worm.segs[i - 1];
      const curr = worm.segs[i];
      const sdx  = curr.x - prev.x;
      const sdy  = curr.y - prev.y;
      const sd   = Math.sqrt(sdx * sdx + sdy * sdy);
      if (sd > SEG_LEN) {
        curr.x = prev.x + (sdx / sd) * SEG_LEN;
        curr.y = prev.y + (sdy / sd) * SEG_LEN;
      }
    }
  }

  function drawWorm() {
    const segs = worm.segs;
    ctx.save();
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';

    /* Draw segment-by-segment with decreasing width and alpha,
       producing the tapered, slightly translucent body. */
    for (let i = 0; i < segs.length - 1; i++) {
      const t = i / (segs.length - 1);
      const w = lerp(5.2, 0.7, t);   /* width: head → tail */
      const a = lerp(0.70, 0.20, t); /* alpha: head → tail */

      ctx.beginPath();
      ctx.moveTo(segs[i].x, segs[i].y);
      ctx.lineTo(segs[i + 1].x, segs[i + 1].y);
      ctx.strokeStyle = `rgba(58, 72, 88, ${a})`;
      ctx.lineWidth   = w;
      ctx.stroke();
    }

    ctx.restore();
  }

  /* ── Dish visuals ──────────────────────────────── */
  function drawSpotlight() {
    /* Slow breathe: centre intensity varies ~±8% */
    const pulse = 0.92 + 0.08 * Math.sin(spotPhase);

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, dishR * 1.08);
    grad.addColorStop(0.00, `rgba(212, 220, 232, ${0.190 * pulse})`);
    grad.addColorStop(0.45, `rgba(192, 206, 226, ${0.110 * pulse})`);
    grad.addColorStop(0.80, `rgba(175, 192, 218, ${0.040 * pulse})`);
    grad.addColorStop(1.00, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, dishR * 1.12, 0, TWO_PI);
    ctx.fill();
  }

  function drawDishRing() {
    /* Thin outer ring — like a lens or dish edge */
    ctx.beginPath();
    ctx.arc(cx, cy, dishR, 0, TWO_PI);
    ctx.strokeStyle = 'rgba(175, 198, 225, 0.07)';
    ctx.lineWidth   = 1.2;
    ctx.stroke();

    /* Outer vignette darkens the corners */
    const vign = ctx.createRadialGradient(cx, cy, dishR * 0.6, cx, cy, dishR * 1.35);
    vign.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    vign.addColorStop(1.0, 'rgba(12, 16, 24, 0.60)');
    ctx.fillStyle = vign;
    ctx.beginPath();
    ctx.arc(cx, cy, dishR * 1.4, 0, TWO_PI);
    ctx.fill();
  }

  /* ── Main animation loop ───────────────────────── */
  let last = 0;

  function loop(ts) {
    const dt = Math.min(ts - last, 50); /* cap at 50ms to avoid big jumps */
    last = ts;

    spotPhase += 0.005;

    ctx.clearRect(0, 0, W, H);

    drawSpotlight();
    drawDishRing();
    updateMotes();
    drawMotes();
    updateWorm(dt);
    drawWorm();

    requestAnimationFrame(loop);
  }

  /* Init — defer one frame so CSS layout has settled */
  requestAnimationFrame(() => {
    resize();
    initWorm();
    requestAnimationFrame(loop);
  });

  /* Also re-init on resize since dishR and cx/cy change */
  window.addEventListener('resize', () => {
    initWorm();
  });
})();
