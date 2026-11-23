// Terminal-style intro ("deploy --portfolio") + custom cursor

(() => {
  const root = document.documentElement;
  const intro = document.getElementById("intro");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- intro: requests stream in from the edges and settle into one cluster while a deploy counter runs to 100 ----
  let resolve;
  window.introReady = new Promise(r => (resolve = r));
  if (root.classList.contains("no-intro") || reduced) {
    intro.remove(); resolve();
  } else {
    document.body.classList.add("loading");
    const cv = document.getElementById("intro-field"), ctx = cv.getContext("2d");
    const pctEl = document.getElementById("intro-pct"), stageEl = document.getElementById("intro-stage"), rpsEl = document.getElementById("intro-rps");
    const STAGES = ["00 — PROVISION", "01 — BUILD", "02 — DEPLOY", "03 — LIVE"];
    const DUR = 1900, HOLD = 280;   // counter run, then a short hold at 100 before handing over
    const W = innerWidth, H = innerHeight, cx = W / 2, cy = H / 2, dpr = Math.min(devicePixelRatio || 1, W < 700 ? 1.5 : 2);   // phones: 1.5x is plenty for dots
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const R = Math.min(W, H) * .17;                          // cluster radius
    const far = Math.hypot(W, H) * .6;
    const gauss = () => { let u = 0; while (!u) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };
    const P = Array.from({ length: W < 700 ? 1200 : 3600 }, () => {
      const a = Math.random() * Math.PI * 2, ta = Math.random() * Math.PI * 2;
      const halo = Math.random() < .2;                       // a sparse halo around the dense core
      const tr = halo ? R * (1.1 + Math.random() * 2.8) : Math.abs(gauss()) * R * .5;
      const big = halo && Math.random() < .14;              // the few large dots live in the halo, the core stays a fine haze
      return {
        a, r0: far * (.9 + Math.random() * .5), ta, tr,
        d: Math.random() * .5,                               // arrival delay (fraction of DUR)
        sw: (Math.random() - .5) * 1.4,                      // swirl on the way in (radians)
        s: big ? 1.8 + Math.random() * 1.6 : .45 + Math.random() * .9,
        red: Math.random() < .06, ph: Math.random() * 6.28,
      };
    }).sort((a, b) => a.red - b.red);                         // white first, then red: one colour switch per frame
    const easeOut = k => 1 - Math.pow(1 - k, 3);
    const easeInOut = k => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
    let t0 = 0, done = false;
    const frame = now => {
      if (!t0) t0 = now;
      const t = now - t0, p = Math.min(1, t / DUR), e = easeInOut(p);
      // HUD
      const pct = Math.round(e * 100);
      pctEl.textContent = String(pct).padStart(3, "0");
      stageEl.textContent = STAGES[Math.min(3, Math.floor(pct / 34) + (pct === 100 ? 1 : 0))];
      rpsEl.textContent = Math.round(e * 4800 + (p < 1 ? Math.random() * 180 : 0)).toLocaleString("en-US");
      // particles
      ctx.clearRect(0, 0, W, H);
      let red = null;
      for (const q of P) {
        const k = Math.min(1, Math.max(0, (t / DUR - q.d * .6) / .75));
        const m = easeOut(k);
        const r = q.r0 + (q.tr - q.r0) * m;
        const ang = (k < 1 ? q.a + (q.ta - q.a) * m + q.sw * (1 - m) : q.ta) + Math.sin(t / 900 + q.ph) * .02;
        const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r * .92;
        ctx.globalAlpha = (.15 + .85 * m) * (q.s > 2 ? .9 : .7);
        if (q.red !== red) { red = q.red; ctx.fillStyle = red ? "#e0344f" : "#f2f2f2"; }
        if (q.s > 2) { ctx.beginPath(); ctx.arc(x, y, q.s, 0, 7); ctx.fill(); } else ctx.fillRect(x, y, q.s, q.s);
      }
      ctx.globalAlpha = 1;
      if (!done && t >= DUR + HOLD) finish();
      if (intro.isConnected) requestAnimationFrame(frame);
    };
    const finish = () => {
      done = true;
      try { sessionStorage.setItem("intro", "1"); } catch (e) {}
      intro.classList.add("done");
      document.body.classList.remove("loading");
      resolve();
      setTimeout(() => intro.remove(), 800);
    };
    requestAnimationFrame(frame);
  }

  // ---- cursor: a square viewfinder (4 corners) + an exact centre dot; over links/buttons it frames the element ----
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const ring = document.getElementById("cur-ring"), dot = document.getElementById("cur-dot");
  root.classList.add("has-cur");
  const SIZE = 26, PAD = 7, MAXW = 460, MAXH = 280;   // elements bigger than this are not framed
  const HOT = "a, button, [role=button], .filter, input, label, .el";
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, rw = SIZE, rh = SIZE, target = null;
  let running = false;
  const wake = () => { if (!running) { running = true; requestAnimationFrame(loop); } };
  addEventListener("scroll", wake, { passive: true });   // a framed element moves when the page scrolls
  addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    x = e.clientX; y = e.clientY; wake();
    root.classList.add("cur-on");
    dot.style.transform = `translate(${x}px,${y}px)`;
    const t = e.target.closest?.(HOT);
    target = t && !t.closest(".egg-half, .scroller") ? t : null;
    ring.classList.toggle("link", !!target);
  }, { passive: true });
  document.addEventListener("mouseleave", () => root.classList.remove("cur-on"));
  // press: the frame tightens around its own centre (size only, so it never shifts)
  let pressed = false;
  const press = on => { pressed = on; wake(); };
  addEventListener("pointerdown", e => { if (e.pointerType === "mouse") press(true); });
  addEventListener("pointerup", () => press(false));
  addEventListener("pointercancel", () => press(false));
  addEventListener("blur", () => press(false));
  const k = reduced ? 1 : .3;
  function loop() {
    let tx = x, ty = y, tw = SIZE, th = SIZE;
    if (target && target.isConnected) {
      const r = target.getBoundingClientRect();
      if (r.width && r.width <= MAXW && r.height <= MAXH) { tx = r.left + r.width / 2; ty = r.top + r.height / 2; tw = r.width + PAD * 2; th = r.height + PAD * 2; }
    }
    if (pressed) { tw *= .82; th *= .82; }
    rx += (tx - rx) * k; ry += (ty - ry) * k; rw += (tw - rw) * k; rh += (th - rh) * k;
    ring.style.width = rw + "px"; ring.style.height = rh + "px";
    ring.style.transform = `translate(${rx - rw / 2}px,${ry - rh / 2}px)`;
    const settled = Math.abs(tx - rx) + Math.abs(ty - ry) + Math.abs(tw - rw) + Math.abs(th - rh) < .3;
    if (settled) running = false; else requestAnimationFrame(loop);
  }
  wake();
})();

// ---- git-history timeline: the line fills and each release lights up as it crosses the reading line ----
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tl = document.querySelector(".timeline");
  if (tl) {
    const items = [...tl.children];
    const upd = () => {
      const r = tl.getBoundingClientRect(), line = innerHeight * .6;
      tl.style.setProperty("--tl", Math.max(0, Math.min(1, (line - r.top) / r.height)).toFixed(3));
      items.forEach(li => li.classList.toggle("lit", reduced || li.getBoundingClientRect().top < line));
    };
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  }
})();

// ---- page-wide cursor light: a faint dot grid that lights up under the pointer ----
// Redraws only while the pointer moves (and for a short fade after), not on every frame.
(() => {
  const cv = document.getElementById("cursor-field");
  if (!cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = cv.getContext("2d");
  const root = document.documentElement;
  const GAP = 26, R2 = 2 * 170 * 170;
  let W = 0, H = 0, mx = -9999, my = -9999, on = false, queued = false, accent = "#b3122e", ink = "#ffffff";
  const colors = () => {
    const st = getComputedStyle(root);
    accent = st.getPropertyValue("--accent").trim() || accent;
    ink = st.getPropertyValue("--ink").trim() || ink;
  };
  const draw = () => {
    queued = false;
    ctx.clearRect(0, 0, W, H);
    for (let y = GAP / 2; y < H; y += GAP) for (let x = GAP / 2; x < W; x += GAP) {
      const dx = x - mx, dy = y - my;
      const inf = on ? Math.exp(-(dx * dx + dy * dy) / R2) : 0;
      if (inf < 0.02) { ctx.fillStyle = ink; ctx.globalAlpha = .05; ctx.fillRect(x, y, 1, 1); continue; }
      ctx.fillStyle = inf > 0.35 ? accent : ink;
      ctx.globalAlpha = Math.min(1, .05 + inf * .9);
      const s = 1 + inf * 2.2;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    request();
  };
  colors(); resize();
  addEventListener("resize", resize);
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; on = true; request(); }, { passive: true });
  document.addEventListener("mouseleave", () => { on = false; request(); });
  new MutationObserver(() => { colors(); request(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
})();
