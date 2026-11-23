// ====== Section backgrounds: one fixed canvas, one scene per section, crossfaded as you scroll ======
// hero: black hole · about: particle ocean · skills: spiral galaxy · experience: tunnel ·
// achievements/projects: wireframe polyhedra · contact/footer: deep field with a faint grid
(() => {
  const cv = document.getElementById("scene");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);
  const gauss = () => { let u = 0; while (!u) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * Math.random()); };

  let W = 0, H = 0, dpr = 1, small = false, ink = "255,255,255", bg = "#000";
  const colors = () => {
    const dark = root.dataset.theme !== "light";
    ink = dark ? "255,255,255" : "12,12,12";
    bg = getComputedStyle(root).getPropertyValue("--bg").trim() || (dark ? "#000" : "#fafafa");
  };
  const c = a => `rgba(${ink},${a})`;                         // for strokes/gradients (a few per frame)
  const dotA = (x, y, s, a) => { ctx.globalAlpha = a > 1 ? 1 : a; ctx.fillRect(x, y, s, s); };   // particles: one fill colour, alpha per dot

  // ---------- shared starfield ----------
  let stars = [];
  const makeStars = () => { stars = Array.from({ length: small ? 140 : 260 }, () => ({ x: Math.random(), y: Math.random(), r: rnd(.3, 1.2), a: rnd(.15, .7), p: rnd(0, TAU) })); };
  const drawStars = (t, k) => {
    ctx.fillStyle = `rgb(${ink})`;
    for (const s of stars) {
      dotA(s.x * W, s.y * H, s.r, s.a * k * (.75 + .25 * Math.sin(t * 1.4 + s.p)));
    }
    ctx.globalAlpha = 1;
  };

  // ---------- 1. black hole ----------
  const hole = { disk: [], ring: [] };
  const makeHole = () => {
    hole.disk = Array.from({ length: small ? 1600 : 3600 }, () => {
      const R = 1.3 + Math.pow(Math.random(), 2.2) * 3.4;     // in units of the horizon radius, denser inside
      return { R, a: rnd(0, TAU), w: .22 / Math.pow(R, 1.5), y: gauss() * .05 * R, s: rnd(.6, 2) };
    });
    hole.ring = Array.from({ length: small ? 900 : 2000 }, () => ({ R: 1.04 + Math.abs(gauss()) * .2, a: rnd(0, TAU), s: rnd(.5, 1.6) }));
  };
  const drawHole = (t, k) => {
    const r = Math.min(W, H) * (small ? .12 : .13);
    const cx = small ? W * .66 : W * .74, cy = small ? H * .72 : H * .3;   // mobile: in the gap under the CTAs, clear of the text
    const sx = 1.18, sy = .2;                                   // disk seen almost edge-on
    // haze
    const g = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 5);
    g.addColorStop(0, c(.07 * k)); g.addColorStop(1, c(0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // orbit guides
    ctx.lineWidth = 1;
    for (const m of [2.1, 3.1, 4.6]) {
      ctx.strokeStyle = c(.1 * k);
      ctx.beginPath(); ctx.ellipse(cx, cy, r * m * sx, r * m * sy, -.06, 0, TAU); ctx.stroke();
    }
    const disk = back => {
      ctx.fillStyle = `rgb(${ink})`;
      for (const p of hole.disk) {
        const a = p.a + t * p.w;
        const s = Math.sin(a);
        if ((s < 0) !== back) continue;
        const x = cx + Math.cos(a) * p.R * r * sx, y = cy + (s * p.R * sy + p.y * .4) * r - Math.cos(a) * p.R * r * .06;
        const bright = (1.4 - p.R / 4.6) * (1 + .35 * -Math.cos(a));   // hotter inside, brighter on the approaching side
        dotA(x, y, p.s, Math.min(1, .85 * bright) * k);
      }
      ctx.globalAlpha = 1;
    };
    disk(true);
    // horizon + wireframe sphere
    ctx.globalAlpha = Math.min(1, k);                             // the horizon fades out with the scene
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
    ctx.strokeStyle = c(.16 * k);
    for (let i = 0; i < 6; i++) {                                 // meridians, slowly turning
      const ph = (i / 6) * Math.PI + t * .08;
      ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(Math.cos(ph)) * r, r, 0, 0, TAU); ctx.stroke();
    }
    for (let j = -2; j <= 2; j++) {                               // parallels
      const yy = cy + (j / 3) * r;
      const ww = Math.sqrt(Math.max(0, r * r - (yy - cy) ** 2));
      ctx.beginPath(); ctx.ellipse(cx, yy, ww, ww * .12, 0, 0, TAU); ctx.stroke();
    }
    ctx.restore();
    // photon ring (the lensed back of the disk wrapping the horizon): a soft glow under the particles
    ctx.strokeStyle = c(.18 * k); ctx.lineWidth = r * .32;
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.2, 0, TAU); ctx.stroke();
    ctx.strokeStyle = c(.22 * k); ctx.lineWidth = r * .12;
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.1, 0, TAU); ctx.stroke();
    ctx.fillStyle = `rgb(${ink})`;
    for (const p of hole.ring) {
      const a = p.a - t * .05;
      const x = cx + Math.cos(a) * p.R * r, y = cy + Math.sin(a) * p.R * r;
      dotA(x, y, p.s, Math.max(.15, 1 - (p.R - 1.04) * 2.2) * k);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c(.5 * k); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.04, 0, TAU); ctx.stroke();
    ctx.lineWidth = 1;
    disk(false);
  };

  // ---------- 2. particle ocean ----------
  const drawOcean = (t, k) => {
    const cols = small ? 56 : 96, rows = small ? 30 : 42, f = Math.min(W, H) * 1.05, horizon = H * .42, camY = 1.25;
    for (let j = rows - 1; j >= 0; j--) {
      const z = 1.4 + j * .32;
      const depth = 1 - j / rows;
      ctx.beginPath();
      ctx.fillStyle = `rgb(${ink})`;
      let first = true;
      for (let i = 0; i <= cols; i++) {
        const x = (i / cols - .5) * 14;
        const y = Math.sin(x * .55 + t * .5) * .28 + Math.sin(z * .7 - t * .7) * .32 + Math.sin((x - z) * 1.3 + t * .9) * .09;
        const px = W / 2 + (x / z) * f, py = horizon + ((camY - y) / z) * f * .55;
        if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
        if (i % 2 === 0) dotA(px, py, 1.5, Math.min(1, .35 + y * .5) * depth * k);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c(.14 * depth * k); ctx.stroke();
    }
  };

  // ---------- 3. spiral galaxy ----------
  let galaxy = [];
  const makeGalaxy = () => {
    galaxy = Array.from({ length: small ? 1500 : 3200 }, () => {
      const arm = Math.floor(rnd(0, 3)), r = Math.pow(Math.random(), 1.6);
      return { r, a: arm * TAU / 3 + Math.log(r * 30 + 1) * 1.55 + gauss() * (.32 - r * .12), s: rnd(.5, 1.5), b: rnd(.4, 1) };
    });
  };
  const drawGalaxy = (t, k) => {
    const cx = small ? W * .7 : W * .9, cy = small ? H * .3 : H * .5, R = Math.min(W, H) * (small ? .55 : .62), tilt = .55, rot = -.35;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * .35);
    g.addColorStop(0, c(.22 * k)); g.addColorStop(1, c(0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const cr = Math.cos(rot), sr = Math.sin(rot);
    ctx.fillStyle = `rgb(${ink})`;
    for (const p of galaxy) {
      const a = p.a + t * .06 * (1.2 - p.r);
      const x0 = Math.cos(a) * p.r * R, y0 = Math.sin(a) * p.r * R * tilt;
      const x = cx + x0 * cr - y0 * sr, y = cy + x0 * sr + y0 * cr;
      dotA(x, y, p.s, Math.min(1, p.b * (1.1 - p.r * .6)) * k);
    }
    ctx.globalAlpha = 1;
  };

  // ---------- 4. tunnel ----------
  const drawTunnel = (t, k) => {
    const cx = small ? W * .5 : W * .62, cy = H * .48, N = 26, dots = small ? 48 : 72, base = Math.min(W, H) * .07;
    for (let i = 0; i < N; i++) {
      const z = ((i / N) + t * .045) % 1;                          // 0 = far, 1 = near
      const rr = base / (1.02 - z * .98);
      const a = Math.pow(z, 1.4) * .6;
      if (rr > Math.hypot(W, H)) continue;
      ctx.strokeStyle = c(a * .35 * k);
      ctx.beginPath(); ctx.ellipse(cx, cy, rr, rr * .92, 0, 0, TAU); ctx.stroke();
      const twist = i * .21 + t * .1;
      ctx.fillStyle = `rgb(${ink})`; ctx.globalAlpha = Math.min(1, a * k);
      for (let d = 0; d < dots; d++) {
        const ang = (d / dots) * TAU + twist;
        ctx.fillRect(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr * .92, 1.2, 1.2);
      }
      ctx.globalAlpha = 1;
    }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 2);
    g.addColorStop(0, c(.25 * k)); g.addColorStop(1, c(0));
    ctx.fillStyle = g; ctx.fillRect(cx - base * 2, cy - base * 2, base * 4, base * 4);
  };

  // ---------- 5. floating wireframe polyhedra ----------
  const PHI = (1 + Math.sqrt(5)) / 2;
  const ICO_V = [[-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0], [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI], [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]];
  const ICO_E = [];
  ICO_V.forEach((a, i) => ICO_V.forEach((b, j) => { if (j > i && Math.abs(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) - 2) < .01) ICO_E.push([i, j]); }));
  let polys = [];
  const makePolys = () => {
    const spots = small ? [[.15, .2], [.85, .45], [.25, .8]] : [[.08, .22], [.9, .18], [.82, .7], [.18, .78], [.5, .1], [.62, .9], [.97, .46]];
    polys = spots.map(([x, y]) => ({
      x, y, s: rnd(.05, .1),
      ax: rnd(0, TAU), ay: rnd(0, TAU), vx: rnd(.05, .14) * (Math.random() < .5 ? -1 : 1), vy: rnd(.04, .12),
      jit: ICO_V.map(() => rnd(.85, 1.15)),                       // a bit irregular, like rocks
    }));
  };
  const drawPolys = (t, k) => {
    for (const p of polys) {
      const S = Math.min(W, H) * p.s, cx = p.x * W, cy = p.y * H + Math.sin(t * .4 + p.x * 9) * 8;
      const ax = p.ax + t * p.vx, ay = p.ay + t * p.vy, cxr = Math.cos(ax), sxr = Math.sin(ax), cyr = Math.cos(ay), syr = Math.sin(ay);
      const pts = ICO_V.map(([x, y, z], i) => {
        const j = p.jit[i]; x *= j; y *= j; z *= j;
        const y1 = y * cxr - z * sxr, z1 = y * sxr + z * cxr;     // rotate X
        const x2 = x * cyr + z1 * syr, z2 = -x * syr + z1 * cyr;  // rotate Y
        const persp = 3.2 / (3.2 + z2 * .35);
        return [cx + x2 * S * .55 * persp, cy + y1 * S * .55 * persp, z2];
      });
      ctx.strokeStyle = c(.16 * k);
      ctx.beginPath();
      for (const [a, b] of ICO_E) { ctx.moveTo(pts[a][0], pts[a][1]); ctx.lineTo(pts[b][0], pts[b][1]); }
      ctx.stroke();
      ctx.fillStyle = `rgb(${ink})`;
      for (const q of pts) dotA(q[0] - 1, q[1] - 1, 2, (.35 + q[2] * .12) * k);
      ctx.globalAlpha = 1;
    }
  };

  // ---------- 6. deep field ----------
  const drawDeep = (t, k) => {
    const G = 64, off = (t * 6) % G;
    ctx.strokeStyle = c(.035 * k);
    ctx.beginPath();
    for (let x = -off; x < W; x += G) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = -off; y < H; y += G) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
    drawStars(t * 1.6, k * .9);
  };

  const SCENES = { hole: drawHole, ocean: drawOcean, galaxy: drawGalaxy, tunnel: drawTunnel, polys: drawPolys, deep: drawDeep };
  // How strongly each scene shows behind its section (text has to stay readable on top)
  const STRENGTH = { hole: 1, ocean: .7, galaxy: .85, tunnel: .65, polys: .9, deep: 1 };
  const MAP = [["#hero", "hole"], ["#about", "ocean"], [".tagline", "ocean"], ["#skills", "galaxy"], ["#experience", "tunnel"],
    ["#achievements", "polys"], ["#projects", "polys"], ["#contact", "deep"], ["#vim", "deep"]];
  const fade = Object.fromEntries(Object.keys(SCENES).map(k => [k, 0]));
  let active = "hole";

  const pick = () => {
    const mid = innerHeight * .5;
    for (const [sel, name] of MAP) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { active = name; return; }
    }
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) active = "deep";
  };

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight; small = W < 700;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars(); makeHole(); makeGalaxy(); makePolys();
  };

  let last = 0, t = 0;
  const render = () => {
    ctx.clearRect(0, 0, W, H);
    const visible = Object.keys(fade).filter(k => fade[k] > .01);
    if (!visible.includes("deep")) drawStars(t, .8);              // the deep field draws its own stars
    for (const k of visible) SCENES[k](t, fade[k] * STRENGTH[k]);
  };
  const frame = now => {
    requestAnimationFrame(frame);
    if (small && now - last < 32) return;                         // ~30 fps on phones: half the work, same look
    const dt = Math.min(64, now - (last || now)); last = now;
    t += dt / 1000;
    for (const k in fade) fade[k] += ((k === active ? 1 : 0) - fade[k]) * Math.min(1, dt / 380);   // ~0.6 s crossfade
    render();
  };

  colors(); resize(); pick();
  new MutationObserver(() => { colors(); if (reduced) render(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  addEventListener("resize", () => { resize(); if (reduced) render(); });
  addEventListener("scroll", () => {
    const before = active; pick();
    if (reduced && before !== active) { for (const k in fade) fade[k] = k === active ? 1 : 0; render(); }
  }, { passive: true });

  if (reduced) { t = 12; fade[active] = 1; render(); }            // one still frame per scene, no motion
  else {
    fade[active] = 1;
    render();                                                     // first frame now; motion starts once the intro is gone
    (window.introReady || Promise.resolve()).then(() => requestAnimationFrame(frame));
  }
})();
