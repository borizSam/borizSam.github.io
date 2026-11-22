// Terminal-style intro ("deploy --portfolio") + custom cursor

// ---- dot portrait of Boris (his photo rebuilt from dots) ----
// mode "intro": full-screen assembly, resolves when it settles; mode "hero": side portrait, runs while visible
const startPortrait = (cv, mode) => new Promise(resolve => {
  const ctx = cv.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SRC = 720, STEP = 4;
  const img = new Image();
  img.src = "assets/boris-foto.webp?v=1";
  const mouse = { x: 0, y: 0, on: false };
  let pts = [], W = 0, H = 0, dpr = 1, t0 = 0, running = false;

  const sample = () => {
    const off = document.createElement("canvas");
    off.width = off.height = SRC;
    const o = off.getContext("2d");
    o.drawImage(img, 0, 0, SRC, SRC);
    const d = o.getImageData(0, 0, SRC, SRC).data;
    const out = [];
    for (let y = 0; y < SRC; y += STEP) for (let x = 0; x < SRC; x += STEP) {
      const nx = (x / SRC - 0.5) / 0.22, ny = (y / SRC - 0.7) / 0.36;   // mask around the figure
      if (nx * nx + ny * ny > 1) continue;
      const i = (y * SRC + x) * 4;
      const l = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
      out.push({ u: x / SRC, v: y / SRC, l, ph: Math.random() * 6.28, sx: Math.random(), sy: Math.random() });
    }
    return out;
  };
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const layout = () => {
    const S = mode === "intro" ? Math.min(H * 0.78, W * 0.62) : Math.min(W, H);
    return { x0: (W - S) / 2, y0: (H - S) / 2, S };
  };
  const ease = k => 1 - Math.pow(1 - k, 3);

  const draw = now => {
    const t = (now - t0) / 1000;
    const st = getComputedStyle(document.documentElement);
    const accent = st.getPropertyValue("--accent").trim() || "#39ff88";
    const ink = st.getPropertyValue("--ink").trim() || "#ffffff";
    const L = layout();
    ctx.clearRect(0, 0, W, H);
    const mx = mouse.on ? mouse.x : W * (0.5 + 0.3 * Math.sin(t * 0.45));
    const my = mouse.on ? mouse.y : H * (0.45 + 0.2 * Math.cos(t * 0.33));
    const R = L.S * 0.14, R2 = 2 * R * R;
    for (const p of pts) {
      const hx = L.x0 + p.u * L.S, hy = L.y0 + p.v * L.S;
      const k = Math.min(1, Math.max(0, (t - p.sx * 0.9) / 1.4));   // staggered assembly
      const e = reduced ? 1 : ease(k);
      let x = (p.sx - 0.5) * W * 2.2 * (1 - e) + hx * e;
      let y = (p.sy - 0.5) * H * 2.2 * (1 - e) + hy * e;
      const dx = x - mx, dy = y - my;
      const inf = Math.exp(-(dx * dx + dy * dy) / R2);
      x += dx * inf * 0.06; y += dy * inf * 0.06;
      const b = Math.min(1, 0.18 + p.l * 0.6 + inf * 0.9 + (reduced ? 0 : Math.sin(t * 1.3 + p.ph) * 0.03));
      ctx.fillStyle = inf > 0.35 ? accent : ink;
      ctx.globalAlpha = b;
      const s = 0.6 + p.l * 1.4 + inf * 1.8;
      ctx.fillRect(x, y, s, s);
    }
    ctx.globalAlpha = 1;
  };
  const tick = now => { if (!running) return; draw(now); requestAnimationFrame(tick); };

  addEventListener("resize", resize);
  addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
  }, { passive: true });
  document.addEventListener("mouseleave", () => { mouse.on = false; });

  img.onload = () => {
    pts = sample(); resize(); t0 = performance.now();
    if (reduced) { draw(t0 + 10000); resolve(); return; }
    running = true; requestAnimationFrame(tick);
    if (mode === "intro") {
      setTimeout(() => { running = false; resolve(); }, 3000);   // assembly ~2.3 s + short hold
    } else {
      new IntersectionObserver(([en]) => {
        const was = running;
        running = en.isIntersecting;
        if (running && !was) requestAnimationFrame(tick);
      }).observe(cv);
      resolve();
    }
  };
});
(() => {
  const root = document.documentElement;
  const intro = document.getElementById("intro");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- intro ----
  let resolve;
  window.introReady = new Promise(r => (resolve = r));
  if (root.classList.contains("no-intro") || reduced) {
    intro.remove(); resolve();
  } else {
    document.body.classList.add("loading");
    const cmd = "deploy --env production --portfolio";
    const typed = document.getElementById("intro-typed");
    const steps = [...document.querySelectorAll("#intro-steps li")];
    const status = document.getElementById("intro-status");
    const pct = document.getElementById("intro-pct");
    const bar = document.getElementById("intro-steps");
    const MSG = ["› initializing build environment…", "› running test suite…", "› deploying to production…", "› verifying health checks…"];
    // systemd-style boot log, printed as the progress bar advances
    const logEl = document.getElementById("intro-log");
    const LOG = [
      [.05, "Started Docker Application Container Engine."],
      [.18, "Reached target Cloud Infrastructure."],
      [.32, "Started Jenkins Continuous Integration Server."],
      [.46, "Mounted remote Terraform state."],
      [.60, "Started Zabbix Agent."],
      [.74, "Finished Ansible playbook: site.yml."],
      [.88, "Reached target Multi-User System."],
    ];
    let li = 0;
    let i = 0;
    const type = () => {
      typed.textContent = cmd.slice(0, ++i);
      if (i < cmd.length) return setTimeout(type, 28 + Math.random() * 30);
      setTimeout(run, 250);
    };
    const run = () => {
      const DUR = 2600, t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / DUR, 1);
        const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;   // ease in-out
        pct.textContent = Math.round(e * 100);
        bar.style.setProperty("--p", e.toFixed(3));
        let n = 0;
        steps.forEach((s, k) => { const on = e >= Math.max(k / 3, .06); s.classList.toggle("on", on); if (on) n = k; });
        status.textContent = p === 1 ? "› ready — welcome" : MSG[n];
        while (li < LOG.length && e >= LOG[li][0]) {
          const row = document.createElement("li");
          row.innerHTML = '<span class="ok">[  OK  ]</span> ' + LOG[li][1];
          logEl.appendChild(row); li++;
        }
        if (p < 1) return requestAnimationFrame(tick);
        setTimeout(finish, 450);
      };
      requestAnimationFrame(tick);
    };
    const finish = () => {
      try { sessionStorage.setItem("intro", "1"); } catch (e) {}
      intro.classList.add("done");
      document.body.classList.remove("loading");
      resolve();
      setTimeout(() => intro.remove(), 800);
    };
    // dots gather into "WELCOME" across the full screen, behind the terminal
    const dc = document.getElementById("intro-dots");
    if (dc && !reduced) {
      const dctx = dc.getContext("2d");
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const DW = innerWidth, DH = innerHeight;
      dc.width = DW * dpr; dc.height = DH * dpr;
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const build = () => {
        const size = 180;                                  // font size in px before fitting
        const o = document.createElement("canvas");
        o.width = DW; o.height = DH;
        const x = o.getContext("2d");
        const WORD = "WELCOME";
        x.font = `800 ${size}px Orbitron, sans-serif`;
        const fit = Math.min(1, (DW * 0.72) / x.measureText(WORD).width);
        x.font = `800 ${size * fit}px Orbitron, sans-serif`;
        x.fillStyle = "#fff"; x.textAlign = "center"; x.textBaseline = "middle";
        const cy = DH * 0.2;
        x.fillText(WORD, DW / 2, cy);
        const step = Math.max(3, Math.round(size * fit / 42));   // coarser grid on big text
        const d = x.getImageData(0, 0, DW, DH).data;
        const pts = [];
        for (let y = 0; y < DH; y += step) for (let px = 0; px < DW; px += step) {
          if (d[(y * DW + px) * 4 + 3] > 128) pts.push({ x: px, y, sx: Math.random(), sy: Math.random() });
        }
        const t0 = performance.now();
        const ease = k => 1 - Math.pow(1 - k, 3);
        const dot = Math.max(1.6, step * 0.55);
        const frame = now => {
          const t = (now - t0) / 1000;
          const st = getComputedStyle(document.documentElement);
          const ink = st.getPropertyValue("--ink").trim() || "#fff";
          const accent = st.getPropertyValue("--accent").trim() || "#ff3b4e";
          dctx.clearRect(0, 0, DW, DH);
          for (const p of pts) {
            const k = Math.min(1, Math.max(0, (t - p.sx * 0.8) / 1.4));
            const e = ease(k);
            const px = (p.sx - 0.5) * DW * 2.5 * (1 - e) + p.x * e;
            const py = (p.sy - 0.5) * DH * 2.5 * (1 - e) + p.y * e;
            dctx.fillStyle = e > .97 ? accent : ink;
            dctx.globalAlpha = .35 + .65 * e;
            dctx.fillRect(px, py, dot, dot);
          }
          dctx.globalAlpha = 1;
          if (t < 3.2) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      };
      (document.fonts ? document.fonts.load("800 180px Orbitron") : Promise.resolve()).then(build, build);
    }
    setTimeout(type, 400);
  }

  // ---- cursor ----
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const ring = document.getElementById("cur-ring"), dot = document.getElementById("cur-dot");
  root.classList.add("has-cur");
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    x = e.clientX; y = e.clientY;
    root.classList.add("cur-on");
    dot.style.transform = `translate(${x}px,${y}px)`;
    ring.classList.toggle("link", !!e.target.closest("a, button, [role=button], .filter, .egg-half, input, label"));
  }, { passive: true });
  document.addEventListener("mouseleave", () => root.classList.remove("cur-on"));
  addEventListener("pointerdown", () => ring.classList.add("down"));
  addEventListener("pointerup", () => ring.classList.remove("down"));
  (function loop() {
    rx += (x - rx) * .18; ry += (y - ry) * .18;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  })();
})();

// ---- constellations (fixed background, tech-themed) + git-history timeline ----
(() => {
  const cv = document.getElementById("stars");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (cv) {
    const ctx = cv.getContext("2d");
    // Named constellations: points are fractions of the viewport
    const SETS = [
      { n: "apt-get", p: [[.08, .22], [.13, .12], [.2, .2], [.17, .33], [.09, .38]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3]] },
      { n: "kill -9", p: [[.8, .14], [.87, .09], [.93, .18], [.88, .3], [.78, .27]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 4]] },
      { n: "systemd", p: [[.06, .66], [.14, .6], [.2, .7], [.14, .82]], e: [[0, 1], [1, 2], [2, 3], [1, 3]] },
      { n: "ps aux", p: [[.82, .62], [.9, .55], [.95, .68], [.86, .8], [.78, .76]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
    ];
    const dust = Array.from({ length: 170 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + .25, a: Math.random() * .6 + .15 }));
    const flares = new Map();   // "set:index" -> start time (ms): a star flares up now and then
    let nextFlare = performance.now() + 1500;
    let W, H, mx = 0, my = 0, tx = 0, ty = 0, sy = 0, t = 0;
    const resize = () => { const d = Math.min(devicePixelRatio || 1, 2); W = cv.width = innerWidth * d; H = cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    resize(); addEventListener("resize", resize);
    addEventListener("pointermove", e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
    addEventListener("scroll", () => { sy = scrollY; }, { passive: true });
    const draw = () => {
      t += .01; mx += (tx - mx) * .05; my += (ty - my) * .05;
      const w = innerWidth, h = innerHeight, dark = document.documentElement.dataset.theme === "dark";
      const c = dark ? "255,255,255" : "0,0,0";
      const ac = dark ? "215,10,83" : "168,0,48";   // Debian palette: #D70A53 / #A80030
      ctx.clearRect(0, 0, w, h);
      const now = performance.now();
      if (!reduced && now > nextFlare) {
        const si = Math.floor(Math.random() * SETS.length);
        flares.set(si + ":" + Math.floor(Math.random() * SETS[si].p.length), now);
        nextFlare = now + 900 + Math.random() * 1800;
      }
      ctx.font = "600 10px 'Geist Mono', monospace"; ctx.textAlign = "center";
      dust.forEach((d, i) => {
        const k = .4 + (i % 3) * .3;
        const x = ((d.x * w + mx * 30 * k) % w + w) % w, y = (((d.y * h - sy * .04 * k + my * 30 * k) % h) + h) % h;
        ctx.fillStyle = `rgba(${c},${d.a * (.7 + .3 * Math.sin(t * 2 + i))})`;
        ctx.beginPath(); ctx.arc(x, y, d.r, 0, 7); ctx.fill();
      });
      // scroll-driven: each edge is drawn as you scroll down the page, so the constellations form
      const docMax = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const f = reduced ? 1 : Math.min(1, sy / docMax);   // reduced motion: show all
      const E = SETS.reduce((n, st) => n + st.e.length, 0);
      let g = 0;
      const edgeFrac = gi => {
        const start = (gi / E) * .85, len = (.85 / E) * 1.6;
        return Math.min(1, Math.max(0, (f - start) / len));
      };
      SETS.forEach((s, si) => {
        const k = 1 + si * .25, ox = mx * 22 * k, oy = my * 22 * k - sy * .06 * k + h * .18;   // sits lower on the page   // no wrap: a figure scrolls off, never streaks across
        const pts = s.p.map(([x, y]) => [x * w + ox, y * h + oy]);
        const ef = s.e.map(() => edgeFrac(g++));
        const seen = pts.map(() => false);
        ctx.strokeStyle = `rgba(${c},.5)`; ctx.lineWidth = 1; ctx.beginPath();
        s.e.forEach(([a, b], j) => {
          const q = ef[j];
          if (q <= 0) return;
          seen[a] = true; if (q >= 1) seen[b] = true;
          const x2 = pts[a][0] + (pts[b][0] - pts[a][0]) * q, y2 = pts[a][1] + (pts[b][1] - pts[a][1]) * q;
          ctx.moveTo(pts[a][0], pts[a][1]); ctx.lineTo(x2, y2);
        });
        ctx.stroke();
        pts.forEach(([x, y], i) => {
          if (!seen[i]) return;
          const key = si + ":" + i, f0 = flares.get(key);
          let e = 0;
          if (f0 != null) { const q = (now - f0) / 1600; if (q >= 1) flares.delete(key); else e = Math.sin(q * Math.PI); }
          ctx.fillStyle = `rgba(${c},${Math.min(1, .75 + .25 * Math.sin(t * 2 + i + si) + e * .25)})`;
          ctx.shadowColor = `rgba(${c},.8)`; ctx.shadowBlur = 8;   // glowing node
          ctx.beginPath(); ctx.arc(x, y, 2 + e * 2.2, 0, 7); ctx.fill();
          ctx.shadowBlur = 0;
          if (e > 0) {   // four-point glint
            const L = 5 + e * 13;
            ctx.strokeStyle = `rgba(${ac},${e * .9})`; ctx.lineWidth = 1; ctx.beginPath();
            ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
          }
        });
        if (seen[0]) { ctx.fillStyle = `rgba(${c},.35)`; ctx.fillText(s.n, pts[0][0], pts[0][1] - 14); }
      });
      if (!reduced) requestAnimationFrame(draw);
    };
    draw();
  }

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

// ---- hidden Draco constellation in the footer: brush all 10 stars with the cursor (or tap them) and a Chinese dragon is drawn ----
(() => {
  const sky = document.getElementById("sky");
  if (!sky) return;
  const NS = "http://www.w3.org/2000/svg", W = 560, H = 300;
  const S = [[.84, .28], [.74, .2], [.67, .36], [.8, .44], [.62, .58], [.5, .48], [.4, .62], [.28, .5], [.18, .66], [.08, .55]].map(([x, y]) => [(x * .7 + .02) * W, y * H]);
  const E = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]];
  const key = (a, b) => (a < b ? a + "-" + b : b + "-" + a);
  const el = (n, a = {}, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p && p.appendChild(e); return e; };
  const f = v => v.toFixed(1), pt = p => f(p[0]) + "," + f(p[1]);

  function dragon(g) {
    const h0 = S[0], P = [S[9], S[8], S[7], S[6], S[5], S[4], S[3], h0, [h0[0] + 38, h0[1] - 16]];
    const pts = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, P.length - 1)];
      for (let t = 0; t < 1; t += 1 / 22) {
        const t2 = t * t, t3 = t2 * t;
        pts.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
      }
    }
    pts.push(P[P.length - 1]);
    const n = pts.length, L = [], R = [], T = [], Wd = [];
    pts.forEach((p, i) => {
      const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, n - 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
      const w = 1.4 + 8.6 * Math.pow(Math.min(1, i / (n - 1) / .38), .9);
      T.push([dx, dy]); Wd.push(w);
      L.push([p[0] - dy * w, p[1] + dx * w]);   // belly side
      R.push([p[0] + dy * w, p[1] - dx * w]);   // back side
    });
    el("path", { class: "body", d: "M" + L.map(pt).join("L") + "L" + [...R].reverse().map(pt).join("L") + "Z", pathLength: 1 }, g);
    let sc = "";
    for (let i = 8; i < n - 14; i += 4) sc += `M${pt(L[i])}Q${pt([pts[i][0] - T[i][0] * Wd[i] * 1.1, pts[i][1] - T[i][1] * Wd[i] * 1.1])} ${pt(R[i])}`;
    el("path", { class: "scale", d: sc }, g);
    let fin = "";
    for (let i = 10; i < n - 8; i += 6) {   // flame mane along the back
      const w = Wd[i], tx = T[i][0], ty = T[i][1], nx = R[i][0] - pts[i][0], ny = R[i][1] - pts[i][1], k = 1.25 + w / 7;
      const tip = [R[i][0] + nx * k - tx * (4 + w * .7), R[i][1] + ny * k - ty * (4 + w * .7)];
      fin += `M${pt(R[i])}Q${pt([R[i][0] + nx * k * .9 + tx * 2, R[i][1] + ny * k * .9 + ty * 2])} ${pt(tip)}`;
    }
    const e0 = pts[0];
    fin += `M${pt(e0)}C${f(e0[0] - 10)},${f(e0[1] - 8)} ${f(e0[0] - 20)},${f(e0[1] - 2)} ${f(e0[0] - 26)},${f(e0[1] - 12)}M${pt(e0)}C${f(e0[0] - 10)},${f(e0[1] + 4)} ${f(e0[0] - 18)},${f(e0[1] + 12)} ${f(e0[0] - 26)},${f(e0[1] + 8)}`;
    el("path", { class: "fin", d: fin }, g);
    let legs = "";
    [.2, .3, .55, .66].forEach(q => {
      const i = Math.floor(n * q), tx = T[i][0], ty = T[i][1], bx = L[i][0], by = L[i][1];
      const nx = bx - pts[i][0], ny = by - pts[i][1], m = Math.hypot(nx, ny) || 1, ux = nx / m, uy = ny / m;
      const k = [bx + ux * 7 - tx * 5, by + uy * 7 - ty * 5], paw = [bx + ux * 15 + tx * 3, by + uy * 15 + ty * 3];
      legs += `M${pt([bx, by])}L${pt(k)}L${pt(paw)}`;
      [-4, 0, 4].forEach(o => { legs += `M${pt(paw)}L${pt([paw[0] + ux * 5 + tx * (3 + o), paw[1] + uy * 5 + ty * (3 + o)])}`; });
    });
    el("path", { class: "leg", d: legs }, g);
    const e = pts[n - 1], q = pts[n - 7], ang = Math.atan2(e[1] - q[1], e[0] - q[0]);
    const hg = el("g", { transform: `translate(${f(e[0])} ${f(e[1])}) rotate(${f(ang * 180 / Math.PI)})` }, g);
    el("path", { class: "head", d:
      "M-6 -10C8 -17 26 -16 38 -10C44 -8 48 -11 51 -6C51 -3 45 -2 41 -1L27 0L41 4C36 9 24 11 14 10C6 10 -1 9 -6 10Z" +
      "M31 -1L33 4L35 -1M23 0L25 4L27 0M9 -10Q15 -13 21 -9" +
      "M-2 -12C-10 -22 -22 -28 -38 -25M-14 -22C-16 -31 -24 -37 -32 -38M-8 -15C-18 -18 -28 -14 -34 -8" +
      "M46 -6C60 -16 74 -8 90 -20C94 -23 99 -19 96 -16M45 -4C58 3 72 9 90 2C94 0 97 4 94 6" +
      "M14 10C13 19 7 24 -1 24M22 10C23 17 19 23 12 27" }, hg);
    el("circle", { class: "eye", cx: 15, cy: -6, r: 2.2 }, hg);
    el("circle", { class: "eye", cx: 45, cy: -6, r: 1.2 }, hg);
    const pg = el("g", { class: "pearl", transform: `translate(${f(e[0] + Math.cos(ang) * 100 + 4)} ${f(e[1] + Math.sin(ang) * 100 + 8)})` }, g);
    el("circle", { r: 9 }, pg);
    el("path", { d: "M-9 -2C-16 -10 -12 -18 -8 -22M-3 -9C-6 -18 0 -24 4 -28M5 -8C10 -14 8 -22 14 -26M9 0C18 -2 22 -10 20 -14" }, pg);
  }

  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true" });
  sky.insertBefore(svg, sky.firstChild);
  const edges = new Map(E.map(([a, b]) => [key(a, b), el("line", { class: "edge", x1: S[a][0], y1: S[a][1], x2: S[b][0], y2: S[b][1] }, svg)]));
  // Tux, the Linux penguin, drawn point by point like a constellation (outline traced from the official logo)
  const TUX = [[275.8,25.0], [259.5,32.8], [250.4,46.5], [247.1,64.1], [248.4,95.3], [243.9,110.9], [209.4,173.4], [206.8,196.9], [195.7,210.5], [176.8,218.4], [174.9,251.6], [183.3,259.4], [231.5,273.0], [334.4,275.0], [381.9,241.8], [385.1,235.9], [370.2,218.4], [366.3,204.7], [361.7,202.7], [365.6,181.2], [361.1,163.7], [320.0,97.3], [314.2,44.5], [302.5,30.9], [284.9,25.0]];
  const TUX_BELLY = [[246,150],[238,204],[282,238],[326,204],[318,150]];
  const TUX_BEAK = [[262,80],[276,90],[291,80]];
  const TUX_EYES = [[262,68],[289,68]];
  const tux = el("g", { class: "dragon" }, svg);
  el("path", { class: "body", pathLength: 1, d: "M" + TUX.map(([x, y]) => x + "," + y).join("L") + "Z" }, tux);
  el("path", { class: "scale", d: "M" + TUX_BELLY.map(([x, y]) => x + "," + y).join("L") }, tux);
  el("path", { class: "head", d: "M" + TUX_BEAK.map(([x, y]) => x + "," + y).join("L") + "Z" }, tux);
  TUX_EYES.forEach(([x, y]) => el("circle", { class: "eye", cx: x, cy: y, r: 2.6 }, tux));
  TUX.forEach(([x, y]) => el("circle", { class: "tuxnode", cx: x, cy: y, r: 1.8 }, tux));
  const stars = S.map(p => {
    const g = el("g", { class: "star" }, svg);
    el("circle", { class: "core", cx: p[0], cy: p[1], r: 2.4 }, g);
    el("path", { class: "streak", d: `M${p[0] - 7} ${p[1]}H${p[0] + 7}M${p[0]} ${p[1] - 7}V${p[1] + 7}` }, g);   // small cross flare around the star
    el("circle", { class: "hit", cx: p[0], cy: p[1], r: 18 }, g);
    return g;
  });
  const lit = new Set();
  let done = false;
  const touch = i => {
    if (done) return;
    lit.add(i); stars[i].classList.add("lit");
    E.forEach(([a, b]) => { if (lit.has(a) && lit.has(b)) edges.get(key(a, b)).classList.add("on"); });
    if (lit.size === S.length) { done = true; setTimeout(() => sky.classList.add("done"), 500); }
  };
  stars.forEach((s, i) => { s.addEventListener("pointerenter", () => touch(i)); s.addEventListener("pointerdown", () => touch(i)); });
})();

// ---- hero portrait (side) ----
(() => { const hc = document.getElementById("dot-portrait"); if (hc) startPortrait(hc, "hero"); })();

// ---- page-wide cursor light: a faint dot grid that lights up under the pointer ----
(() => {
  const cv = document.getElementById("cursor-field");
  if (!cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = cv.getContext("2d");
  const GAP = 26;
  let W = 0, H = 0, dpr = 1, mx = -9999, my = -9999, on = false;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize(); addEventListener("resize", resize);
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; on = true; }, { passive: true });
  document.addEventListener("mouseleave", () => { on = false; });
  const R2 = 2 * 170 * 170;
  const draw = () => {
    const st = getComputedStyle(document.documentElement);
    const accent = st.getPropertyValue("--accent").trim() || "#39ff88";
    const ink = st.getPropertyValue("--ink").trim() || "#ffffff";
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
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();
