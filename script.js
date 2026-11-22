// ====== Portfolio — Boris Huarachi ======
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- i18n (Spanish lives in the HTML) ----------
  const EN = {
    "nav.about": "About", "nav.skills": "Skills", "nav.exp": "Experience", "nav.ach": "Achievements", "nav.proj": "Projects", "nav.contact": "Contact",
    "hero.eyebrow": "Barcelona", "hero.hi": "Hi, I'm",
    "hero.lead": "DevOps Engineer at OCA Global. I automate deployments and run infrastructure on AWS and Azure with Ansible, Jenkins, Docker and Kubernetes. Coming from Windows, Linux and VMware administration; studying Computer Engineering at UOC.",
    "hero.contact": "Let's talk", "hero.work": "See projects", "cv.short": "CV ↓", "cv": "Download CV",
    "id.hint": "↻ ./flip", "id.role": "Role", "id.at": "Company", "id.loc": "Location", "id.study": "Studying", "id.langs": "Languages", "id.next": "Next",
    "id.quote": "Always learning, always building.", "id.photo": "See real photo", "id.char": "See character",
    "about.title": "DevOps Engineer today, Cloud Architect tomorrow.",
    "about.p1": "I'm a DevOps Engineer at OCA Global, where I automate deployments and manage infrastructure with Ansible, Jenkins, GitHub, Zabbix and Azure. Before that I ran virtualized environments on VMware and Linux and Windows servers, and worked with AWS, Docker and Kubernetes.",
    "about.p2": "I build and operate secure, scalable and highly available platforms. I'm now preparing the AWS Solutions Architect Associate while studying Computer Engineering at UOC.",
    "st.years": "years in IT", "st.certs": "certifications", "st.repos": "public repos", "st.degree": "degree in progress",
    "sk.title": "terraform state list", "sk.hint": "Hover an element to read its description.", "sk.use": "in use", "sk.train": "in training",
    "exp.title": "Journey",
    "w1.date": "JAN 2022 – JAN 2024", "w1.role": "Operation Technician Cloud", "w1.a": "AWS environment administration (EC2, S3, IAM)", "w1.b": "Docker containers and pods in production · Kubernetes operational support", "w1.c": "Monitoring with Grafana and IBM Dashboard · CI/CD collaboration",
    "w2.date": "FEB 2024 – DEC 2024", "w2.role": "IT Systems Administrator", "w2.a": "Virtualized environments with VMware vSphere, ESXi and vCenter", "w2.b": "Linux and Windows Server · backups with Veeam and Microsoft 365", "w2.c": "CI/CD with GitHub Actions · containerization with Docker", "w2.d": "Monitoring and optimization with Grafana",
    "w3.date": "JUN 2026 – PRESENT", "w3.role": "DevOps Engineer", "w3.a": "Automating deployments and infrastructure tasks with Ansible and Jenkins", "w3.b": "Monitoring with Zabbix · working on Azure and GitHub",
    "edu.title": "Education", "badge.progress": "In progress",
    "edu.uoc": "BSc Computer Engineering · 2026 – present",
    "edu.cifo": "Specialization in Multiplatform App Development (DAM) and DevOps Tools · 2024 – 2025",
    "edu.fp": "Higher Technician in Networked Computer Systems · 2019 – 2021",
    "ach.title": "Certifications",
    "cert.next": "NEXT TARGET",
    "q.title": "Projects & roadmap", "q.done": "Published",
    "qa.title": "Aeropuerto · Infra & CI/CD", "qa.desc": "Infrastructure and pipelines for the Aeropuerto system: Spring Boot backend and React frontend deployed on AWS ECS Fargate.",
    "qb.title": "CI/CD with automated tests", "qb.desc": "Python pipeline that validates every commit with automated tests (shift-left testing).",
    "qc.title": "Pokémon REST API", "qc.desc": "FastAPI REST API: CRUD, filters and Swagger, tests in CI and ready for a container.",
    "q.hack": "NASA Space Apps 2026",
    "qd.title": "Astro-Care", "qd.desc": "Offline health monitoring for Artemis astronauts: live vitals, automatic NEWS2 scoring and a GO / NO-GO test before critical tasks.",
    "qe.title": "Bedrock-IA · DevOps content", "qe.desc": "Daily pipeline that generates a DevOps post with AI (Amazon Bedrock) and publishes it to GitHub Pages with Quarto and GitHub Actions.",
    "q.roadmap": "Roadmap",
    "rm1.t": "Foundations", "rm1.d": "Linux, networking, Windows Server, AD, virtualization, Git",
    "rm2.t": "Cloud & IaC", "rm2.d": "AWS / Azure, Docker, Terraform, CI/CD",
    "rm3.t": "Platform & operations", "rm3.d": "Kubernetes, Helm, observability, cost, high availability",
    "rm4.t": "Cloud Architect", "rm4.d": "Landing zones, hybrid networking, Well-Architected",
    "c.title": "Let's talk?", "c.lead": "Looking for someone for your systems or cloud team? Drop me a line.",
    "skip": "Skip to content",
    "tagline": "I automate deployments and run cloud infrastructure so teams can ship with confidence.",
    "egg.half": "A bright star: drag it onto the other one", "egg.tip": "Break it!", "egg.honor": "In honor of", "sky.quote": "All warfare is based on deception.", "sky.cite": "— Sun Tzu · The Art of War", "egg.quote": "If you can imagine it, you can program it.", "egg.hammer": "Hammer: hit the egg", "egg.close": "Close",
  };
  const CATS = {
    es: { all: "Todo", cloud: "Cloud", devops: "DevOps / IaC", sys: "Sistemas", code: "Código", db: "Bases de datos" },
    en: { all: "All", cloud: "Cloud", devops: "DevOps / IaC", sys: "Systems", code: "Code", db: "Databases" },
  };
  const ES = {};
  $$("[data-i18n]").forEach(el => { ES[el.dataset.i18n] = el.innerHTML; });
  $$("[data-i18n-label]").forEach(el => { ES[el.dataset.i18nLabel] = el.getAttribute("aria-label"); });
  let lang = store.get("pf-lang") || (navigator.language || "es").slice(0, 2);
  if (lang !== "en") lang = "es";

  // ---------- Skills (periodic table) ----------
  // s = symbol, n = name, c = category, t = in training
  const SK = [
    { s: "Aw", n: "AWS", c: "cloud", es: "EC2, S3, IAM, ECS/Fargate y VPC en entornos productivos.", en: "EC2, S3, IAM, ECS/Fargate and VPC in production environments." },
    { s: "Az", n: "Azure", c: "cloud", es: "Azure en mi día a día en OCA Global.", en: "Azure in my day-to-day work at OCA Global." },
    { s: "Tf", n: "Terraform", c: "devops", t: 1, es: "En entrenamiento: infraestructura como código (IaC).", en: "In training: infrastructure as code (IaC)." },
    { s: "Dk", n: "Docker", c: "devops", es: "Contenedores, imágenes y despliegue de pods.", en: "Containers, images and pod deployments." },
    { s: "K8", n: "Kubernetes", c: "devops", es: "Soporte operativo y despliegues en clústeres.", en: "Operational support and deployments on clusters." },
    { s: "Jk", n: "Jenkins", c: "devops", es: "Pipelines de CI/CD y despliegues continuos.", en: "CI/CD pipelines and continuous delivery." },
    { s: "Ga", n: "GitHub Actions", c: "devops", es: "Workflows de CI/CD para build, test y deploy.", en: "CI/CD workflows for build, test and deploy." },
    { s: "An", n: "Ansible", c: "devops", es: "Automatización de configuración y despliegues.", en: "Configuration and deployment automation." },
    { s: "Gt", n: "Git", c: "devops", es: "Control de versiones, ramas y pull requests.", en: "Version control, branches and pull requests." },
    { s: "Zb", n: "Zabbix", c: "devops", es: "Monitorización de servicios e infraestructura.", en: "Service and infrastructure monitoring." },
    { s: "Gr", n: "Grafana", c: "devops", es: "Dashboards y observabilidad.", en: "Dashboards and observability." },
    { s: "Ws", n: "Windows Server", c: "sys", es: "Administración de servidores Windows.", en: "Windows Server administration." },
    { s: "Lx", n: "Linux", c: "sys", es: "Administración de servidores Linux.", en: "Linux server administration." },
    { s: "Vm", n: "VMware", c: "sys", es: "Entornos virtualizados con vSphere, ESXi y vCenter.", en: "Virtualized environments with vSphere, ESXi and vCenter." },
    { s: "Vt", n: "Veeam", c: "sys", es: "Backups y recuperación con Veeam.", en: "Backups and recovery with Veeam." },
    { s: "M3", n: "Microsoft 365", c: "sys", es: "Administración de Microsoft 365.", en: "Microsoft 365 administration." },
    { s: "Py", n: "Python", c: "code", es: "Scripting, automatización y APIs con FastAPI.", en: "Scripting, automation and APIs with FastAPI." },
    { s: "Sh", n: "Bash", c: "code", es: "Scripts de shell para automatizar tareas.", en: "Shell scripts to automate tasks." },
    { s: "Jv", n: "Java", c: "code", es: "Backend con Spring Boot y APIs REST.", en: "Backend with Spring Boot and REST APIs." },
    { s: "Re", n: "React", c: "code", es: "Frontend del proyecto Aeropuerto.", en: "Frontend of the Aeropuerto project." },
    { s: "Dy", n: "DynamoDB", c: "db", es: "Bases de datos NoSQL en AWS.", en: "NoSQL databases on AWS." },
    { s: "Es", n: "Elasticsearch", c: "db", es: "Búsqueda y análisis de datos.", en: "Search and data analysis." },
  ];
  const table = $("#periodic"), desc = $("#sk-desc"), filters = $("#filters");
  SK.forEach((e, i) => {
    const b = document.createElement("button");
    b.className = "el" + (e.t ? " train" : "");
    b.dataset.cat = e.c;
    b.innerHTML = `<span class="n">${String(i + 1).padStart(2, "0")}</span><span class="s">${e.s}</span><span class="m">${e.n}</span>`;
    const show = () => { desc.innerHTML = `<strong>${e.n}</strong> — ${e[lang]}`; };
    b.addEventListener("mouseenter", show);
    b.addEventListener("focus", show);
    b.addEventListener("click", show);
    table.appendChild(b);
  });
  // terraform-style plan line: in use = to add, in training = to change
  const tfAdd = SK.filter(e => !e.t).length, tfChg = SK.filter(e => e.t).length;
  $("#tfplan").textContent = `Plan: ${tfAdd} to add, ${tfChg} to change, 0 to destroy.`;
  let activeCat = "all";
  function buildFilters() {
    filters.innerHTML = "";
    Object.keys(CATS.es).forEach(k => {
      const f = document.createElement("button");
      f.className = "filter" + (k === activeCat ? " active" : "");
      f.textContent = CATS[lang][k];
      f.addEventListener("click", () => {
        activeCat = k;
        $$(".filter").forEach(x => x.classList.toggle("active", x === f));
        $$(".el").forEach(el => el.classList.toggle("off", k !== "all" && el.dataset.cat !== k));
      });
      filters.appendChild(f);
    });
  }

  function applyLang() {
    const dict = lang === "en" ? EN : ES;
    $$("[data-i18n]").forEach(el => { const v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    $$("[data-i18n-label]").forEach(el => { const v = dict[el.dataset.i18nLabel]; if (v != null) el.setAttribute("aria-label", v); });
    document.documentElement.lang = lang;
    $("#lang-btn").textContent = lang === "en" ? "ES" : "EN";
    buildFilters();
    $$(".el").forEach(el => el.classList.toggle("off", activeCat !== "all" && el.dataset.cat !== activeCat));
    startTyping();
    splitTagline();
    if (beat) bubble.textContent = beatText(beat);
  }
  $("#lang-btn").addEventListener("click", () => { lang = lang === "en" ? "es" : "en"; store.set("pf-lang", lang); applyLang(); });

  // ---------- Theme ----------
  const root = document.documentElement;
  // Always starts dark; a manual switch only lasts for the current tab session
  root.dataset.theme = sessionStorage.getItem("pf-theme") || "dark";
  const flipTheme = () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    sessionStorage.setItem("pf-theme", root.dataset.theme);
  };

  /* Theme transition: the new theme burns in from the button with a ragged, flame-like edge.
     A noise "arrival time" map is drawn once into an image; an SVG threshold filter turns it
     into a mask for ::view-transition-new(root), and moving the threshold every frame
     advances the edge smoothly. Falls back to an instant switch. */
  const themeFx = (() => {
    if (!document.startViewTransition) return null;
    const FX = { dur: 1000, mix: .74, freq: 5, warp: 1.3, soft: .015, oct: 6 };
    const NS = "http://www.w3.org/2000/svg";
    const holder = document.createElement("div");
    holder.setAttribute("aria-hidden", "true");
    holder.className = "fx-defs";
    holder.innerHTML =
      `<svg xmlns="${NS}" width="0" height="0"><defs>` +
      `<filter id="fx-th" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB"><feComponentTransfer>` +
      `<feFuncR type="linear"/><feFuncG type="linear"/><feFuncB type="linear"/><feFuncA type="linear" slope="0" intercept="1"/>` +
      `</feComponentTransfer></filter>` +
      `<mask id="fx-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="1" height="1">` +
      `<image x="0" y="0" width="1" height="1" preserveAspectRatio="none" filter="url(#fx-th)"/></mask>` +
      `</defs></svg>`;
    document.body.appendChild(holder);
    const mask = holder.querySelector("mask"), image = holder.querySelector("image");
    const funcs = [...holder.querySelectorAll("feFuncR,feFuncG,feFuncB")];
    const setT = t => funcs.forEach(f => { f.setAttribute("slope", -1 / FX.soft); f.setAttribute("intercept", t / FX.soft); });

    function noise(seed) {
      const P = new Uint8Array(512), V = new Float32Array(256);
      let s = seed >>> 0 || 1;
      const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
      for (let i = 0; i < 256; i++) { P[i] = i; V[i] = rnd(); }
      for (let i = 255; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [P[i], P[j]] = [P[j], P[i]]; }
      for (let i = 0; i < 256; i++) P[i + 256] = P[i];
      const fade = t => t * t * (3 - 2 * t);
      const n2 = (x, y) => {
        const xi = Math.floor(x), yi = Math.floor(y), u = fade(x - xi), v = fade(y - yi), X = xi & 255, Y = yi & 255;
        const a = V[P[P[X] + Y]], b = V[P[P[X + 1] + Y]], c = V[P[P[X] + Y + 1]], d = V[P[P[X + 1] + Y + 1]];
        return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
      };
      return (x, y, oct) => {
        let sum = 0, amp = .5, f = 1, norm = 0;
        for (let o = 0; o < oct; o++) { sum += amp * n2(x * f, y * f); norm += amp; amp *= .5; f *= 2.03; }
        return sum / norm;
      };
    }
    function fieldURL(W, H, cx, cy) {
      const S = 4, w = Math.ceil(W / S), h = Math.ceil(H / S), ox = cx / S, oy = cy / S;
      const fbm = noise(Math.random() * 1e9);
      const dmax = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy));
      const F = new Float32Array(w * h);
      let mn = Infinity, mx = -Infinity;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const px = (x / h) * FX.freq, py = (y / h) * FX.freq;
        const qx = fbm(px + 1.7, py + 9.2, 4), qy = fbm(px + 8.3, py + 2.8, 4);
        const n = 1 - Math.abs(2 * fbm(px + FX.warp * (qx - .5) * 2, py + FX.warp * (qy - .5) * 2, FX.oct) - 1);
        const f = FX.mix * (Math.hypot(x - ox, y - oy) / dmax) + (1 - FX.mix) * n;
        F[y * w + x] = f;
        if (f < mn) mn = f; if (f > mx) mx = f;
      }
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d"), img = ctx.createImageData(w, h), D = img.data;
      for (let i = 0; i < F.length; i++) {
        D[i * 4] = D[i * 4 + 1] = D[i * 4 + 2] = Math.round(((F[i] - mn) / (mx - mn)) * 255);
        D[i * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      return cv.toDataURL("image/png");
    }

    // Prepared ahead of time (and decoded) so the click starts instantly; a new shape each time.
    let ready = false, key = "";
    const prepare = () => {
      const r = $("#theme-btn").getBoundingClientRect(), W = innerWidth, H = innerHeight;
      const k = [W, H, Math.round(r.left), Math.round(r.top)].join("|");
      if (ready && key === k) return;
      const url = fieldURL(W, H, r.left + r.width / 2, r.top + r.height / 2);
      [mask, image].forEach(el => { el.setAttribute("width", W); el.setAttribute("height", H); });
      image.setAttribute("href", url);
      key = k;
      const pre = new Image(); pre.src = url;
      pre.decode().catch(() => {}).then(() => { ready = true; });
    };
    const idle = cb => (window.requestIdleCallback ? requestIdleCallback(cb, { timeout: 2000 }) : setTimeout(cb, 300));
    idle(prepare);
    let rz;
    addEventListener("resize", () => { ready = false; clearTimeout(rz); rz = setTimeout(() => idle(prepare), 300); });

    let busy = false;
    return () => {
      if (busy) return;
      busy = true;
      if (!ready) prepare();
      ready = false;
      const T0 = .06, T1 = 1 + FX.soft;
      const at = p => T0 + (T1 - T0) * (1 - Math.pow(1 - p, 2.2));
      setT(at(0));
      root.classList.add("fx-theme");
      const vt = document.startViewTransition(flipTheme);
      vt.ready.then(() => {
        root.animate({ opacity: [1, 1] }, { duration: FX.dur, pseudoElement: "::view-transition-new(root)" });
        const start = performance.now();
        const tick = now => {
          const p = Math.min(1, Math.max(0, (now - start) / FX.dur));
          setT(at(p));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }).catch(() => {});
      vt.finished.finally(() => { root.classList.remove("fx-theme"); busy = false; idle(prepare); });
    };
  })();

  $("#theme-btn").addEventListener("click", () => {
    if (themeFx && !matchMedia("(prefers-reduced-motion: reduce)").matches) themeFx();
    else flipTheme();
  });

  // ---------- ID card ----------
  const card = $("#id-card");
  card.addEventListener("click", () => card.classList.toggle("flipped"));


  // ---------- Typed role ----------
  const ROLES = ["Cloud & DevOps Engineer", "AWS · Terraform · Kubernetes", "Ingeniería Informática (UOC)"];
  const typed = $("#typed");
  let typeRun = 0;
  async function startTyping() {
    const run = ++typeRun;
    if (reduced) { typed.textContent = ROLES[0] + " → " + ROLES[2]; return; }
    const wait = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; run === typeRun; i = (i + 1) % ROLES.length) {
      for (let c = 1; c <= ROLES[i].length && run === typeRun; c++) { typed.textContent = ROLES[i].slice(0, c); await wait(55); }
      await wait(1400);
      for (let c = ROLES[i].length; c >= 0 && run === typeRun; c--) { typed.textContent = ROLES[i].slice(0, c); await wait(28); }
      await wait(250);
    }
  }

  // ---------- Mobile menu ----------
  const nav = $("#nav"), menuBtn = $("#menu-btn");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    document.body.classList.toggle("lock", open);
  }
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("#menu a").forEach((a, i) => { a.style.setProperty("--i", i); a.addEventListener("click", () => setMenu(false)); });
  addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false); });

  // ---------- Tagline: words light up one by one as they cross the trigger line ----------
  const tagline = $("#tagline");
  let words = [];
  function splitTagline() {
    tagline.innerHTML = tagline.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span> `).join("");
    words = $$(".w", tagline);
    paintWords();
  }
  function paintWords() {
    const line = innerHeight * 0.72;
    words.forEach(w => w.classList.toggle("on", reduced || w.getBoundingClientRect().top < line));
  }
  let wordsQueued = false;
  addEventListener("scroll", () => {
    if (wordsQueued) return;
    wordsQueued = true;
    requestAnimationFrame(() => { wordsQueued = false; paintWords(); });
  }, { passive: true });

  // ---------- Reveal + nav highlight ----------
  const links = $$(".nav nav a");
  const rev = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    if (en.target.id) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
  }), { threshold: .15 });
  $$(".block").forEach(s => { s.classList.add("reveal"); rev.observe(s); });
  // L2: staggered reveal for list items (timeline, cards, roadmap)
  const staggerEls = $$(".timeline > li, .grid3 > .card, .roadmap > li");
  const stag = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    stag.unobserve(en.target);
  }), { threshold: .2 });
  staggerEls.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = ((i % 3) * 90) + "ms";
    stag.observe(el);
  });

  // L2: nav surface gets denser once the page is scrolled
  const navEl = $("#nav");
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { navEl.classList.toggle("scrolled", window.scrollY > 24); ticking = false; });
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Drag-scroll for achievements ----------
  const sc = $("#scroller");
  let down = false, sx = 0, sl = 0;
  sc.addEventListener("pointerdown", e => { down = true; sx = e.clientX; sl = sc.scrollLeft; sc.classList.add("drag"); });
  window.addEventListener("pointerup", () => { down = false; sc.classList.remove("drag"); });
  sc.addEventListener("pointermove", e => { if (down) sc.scrollLeft = sl - (e.clientX - sx); });

  // ---------- Hero character: pre-keyed clip (colour on top, alpha below) drawn in WebGL + speech clouds synced to it ----------
  // hero animation (15 s loop): 0–1 uncrosses · 1–2.5 waves hello · 3–4.8 points down · 5–7.8 types on an invisible keyboard (KBD) ·
  // 9–10.3 thumbs up (with a wink) · 11.6–15 arms crossed again
  const BEATS = [
    { id: "hi", from: 0.5, to: 2.9, es: "¡Hola! Bienvenido a mi portafolio 👋", en: "Hi! Welcome to my portfolio 👋" },
    { id: "down", from: 3.2, to: 4.9, es: "Baja y mira lo que hago 👇", en: "Scroll down and see what I do 👇" },
    { id: "deploy", from: 5.0, to: 7.9, es: "Desplegando… 🚀", en: "Deploying… 🚀" },
  ];
  const KBD = [4.9, 7.9];   // the holographic keyboard is visible while he types
  const PEEK = [];   // moments when the egg halves glow (none: the egg is meant to be found, not hinted)
  const hero = $("#hero"), cv = $("#anim"), vid = $("#hero-vid"), poster = $("#hero-poster"), bubble = $("#bubble"), kbd = $("#kbd");
  let beat = null;
  const egg = { state: "apart", hits: 0, solved: false, at: 0, moved: null, home: null };   // easter egg state (see below)
  const beatText = b => (b.done && egg.solved ? b.done : b)[lang];

  // Holographic keyboard: rows of keys, a random one lights up now and then while it is visible
  const ROWS = [12, 11, 10, 7];
  kbd.innerHTML = ROWS.map((n, r) => `<div class="kr">${Array.from({ length: n }, (_, i) => `<i${r === 3 && i === 3 ? ' class="sp"' : ""}></i>`).join("")}</div>`).join("");
  const keys = [...kbd.querySelectorAll("i")];
  setInterval(() => {
    if (!kbd.classList.contains("show")) return;
    const k = keys[Math.floor(Math.random() * keys.length)];
    k.classList.add("hit");
    setTimeout(() => k.classList.remove("hit"), 140);
  }, 85);

  function showBeat(b) {
    if (b === beat) return;
    beat = b;
    if (!b) { bubble.classList.remove("show"); return; }
    bubble.className = "bubble b-" + b.id;
    bubble.textContent = beatText(b);
    void bubble.offsetWidth;   // restart the entrance transition
    bubble.classList.add("show");
  }
  function syncTo(t) {
    showBeat(BEATS.find(b => t >= b.from && t < b.to) || null);
    kbd.classList.toggle("show", t >= KBD[0] && t < KBD[1]);
    hero.classList.toggle("peek", egg.state === "apart" && (PEEK.some(([a, b]) => t >= a && t < b)));
  }

  // The green was keyed offline: top half is premultiplied colour, bottom half is alpha
  function keyer(canvas) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER,
      "attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}"));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER,
      "precision mediump float;uniform sampler2D t;varying vec2 v;void main(){float a=texture2D(t,vec2(v.x,.5+v.y*.5)).g;" +
      "a=smoothstep(.04,.96,a);gl_FragColor=vec4(min(texture2D(t,vec2(v.x,v.y*.5)).rgb,vec3(a)),a);}"));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR]]
      .forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
    return src => {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
  }

  const draw = !reduced && keyer(cv);
  if (!draw) {
    // Still poster (reduced motion or no WebGL): just the welcome cloud
    vid.remove();
    (window.introReady || Promise.resolve()).then(() => setTimeout(() => showBeat(BEATS[0]), 500));
  } else {
    const hasVFC = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    const onFrame = () => {
      draw(vid);
      if (!hero.classList.contains("live")) hero.classList.add("live");   // hide the poster once the clip paints
      syncTo(vid.currentTime);
      hasVFC ? vid.requestVideoFrameCallback(onFrame) : requestAnimationFrame(onFrame);
    };
    if (vid.readyState >= 2) onFrame();   // the clip may have loaded before this script ran
    else vid.addEventListener("loadeddata", onFrame, { once: true });
    const play = () => (window.introReady || Promise.resolve()).then(() => vid.play()).catch(() => {
      showBeat(BEATS[0]);   // autoplay blocked (e.g. low-power mode): start on the first tap
      addEventListener("pointerdown", () => vid.play().catch(() => {}), { once: true });
    });
    // Only run while the hero is on screen
    new IntersectionObserver(([en]) => { en.isIntersecting ? play() : vid.pause(); }, { threshold: 0.05 }).observe(hero);
  }

  // ---------- Hidden easter egg: two bright stars; drag one onto the other to draw a constellation ----------
  const halves = [$("#egg-l"), $("#egg-r")];
  const reveal = $("#egg-reveal"), revealClose = $("#egg-close");
  const SNAP = 64;   // px between the stars' centres that counts as "joined"
  const STAR = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="currentColor" opacity=".08" /><path d="M20 1L24.5 15.5L39 20L24.5 24.5L20 39L15.5 24.5L1 20L15.5 15.5Z" fill="currentColor" /></svg>`;
  const CON = `<svg viewBox="0 0 120 130" aria-hidden="true"><polyline pathLength="1" points="22,100 60,18 98,100" /><polyline pathLength="1" points="38,70 82,70" />
    <circle cx="22" cy="100" r="3.5" /><circle cx="60" cy="18" r="4.5" /><circle cx="98" cy="100" r="3.5" /><circle cx="38" cy="70" r="2.5" /><circle cx="82" cy="70" r="2.5" /><text x="60" y="124">ATS</text></svg>`;
  halves.forEach(h => (h.innerHTML = STAR));
  let con = null;

  const other = h => halves[h === halves[0] ? 1 : 0];
  const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const gap = h => { const [a, b] = center(h), [c, d] = center(other(h)); return Math.hypot(a - c, b - d); };
  const off = new Map(halves.map(h => [h, [0, 0]]));
  const place = (h, x, y) => { off.set(h, [x, y]); h.style.translate = `${x}px ${y}px`; };

  function join(h) {
    egg.state = "done"; egg.solved = true;
    h.classList.add("snap");
    const [a, b] = center(h), [c, d] = center(other(h)), [x, y] = off.get(h);
    place(h, x + c - a, y + d - b);
    const hr = hero.getBoundingClientRect();
    con = document.createElement("div");
    con.className = "con";
    con.innerHTML = CON;
    con.style.left = c - hr.left + "px"; con.style.top = d - hr.top + "px";
    hero.appendChild(con);
    setTimeout(openReveal, 2300);
  }
  function hint(h) {
    h.classList.remove("wiggle"); void h.offsetWidth; h.classList.add("wiggle");
    setTimeout(() => h.classList.remove("wiggle"), 600);
  }
  function openReveal() {
    reveal.hidden = false;
    void reveal.offsetWidth;
    reveal.classList.add("open");
    document.body.classList.add("lock");
    revealClose.focus();
  }
  function closeReveal() {
    if (reveal.hidden) return;
    reveal.classList.remove("open");
    document.body.classList.remove("lock");
    setTimeout(() => { reveal.hidden = true; resetEgg(); }, 400);
  }
  function resetEgg() {
    Object.assign(egg, { state: "apart", moved: null });
    con?.remove(); con = null;
    halves.forEach(h => { h.classList.remove("snap"); place(h, 0, 0); });
  }

  halves.forEach(h => {
    let drag = null;
    h.addEventListener("pointerdown", e => {
      if (egg.state !== "apart") return;
      const [x, y] = off.get(h);
      drag = { px: e.clientX, py: e.clientY, x, y, moved: false };
      h.setPointerCapture(e.pointerId);
      h.classList.add("dragging");
    });
    h.addEventListener("pointermove", e => {
      if (!drag) return;
      const dx = e.clientX - drag.px, dy = e.clientY - drag.py;
      if (Math.hypot(dx, dy) > 4) drag.moved = true;
      place(h, drag.x + dx, drag.y + dy);
      other(h).classList.toggle("near", gap(h) < SNAP);
    });
    const end = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      h.classList.remove("dragging");
      other(h).classList.remove("near");
      if (gap(h) < SNAP) join(h);
      else if (!moved) hint(h);
    };
    h.addEventListener("pointerup", end);
    h.addEventListener("pointercancel", end);
    h.addEventListener("click", e => {
      if (egg.state === "apart" && e.detail === 0) join(h);   // keyboard: Enter/Space joins straight away
    });
  });
  revealClose.addEventListener("click", closeReveal);
  reveal.addEventListener("click", e => { if (e.target === reveal) closeReveal(); });
  addEventListener("keydown", e => { if (e.key === "Escape") closeReveal(); });

  applyLang();

  // ---------- Matrix rain (full-screen background layer) ----------
  const mx = $("#matrix");
  if (mx && !reduced && getComputedStyle(mx).display !== "none") {
    const ctx = mx.getContext("2d");
    const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF";
    const FS = 16;
    let cols = [], w = 0, h = 0, dpr = 1, running = false, last = 0;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = mx.clientWidth; h = mx.clientHeight;
      mx.width = w * dpr; mx.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.ceil(w / FS);
      cols = Array.from({ length: n }, () => ({ y: -Math.random() * h / FS, v: .25 + Math.random() * .5 }));
    };
    const frame = (t) => {
      if (!running) return;
      if (t - last < 50) { requestAnimationFrame(frame); return; }   // ~20 fps: calm, cheap
      last = t;
      const trail = getComputedStyle(root).getPropertyValue("--ink").trim() || "#ffffff";   // white in dark mode
      ctx.globalCompositeOperation = "destination-out";   // fade trails to transparent
      ctx.fillStyle = "rgba(0,0,0,.16)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.font = FS + "px ui-monospace, monospace";
      cols.forEach((c, i) => {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * FS, y = c.y * FS;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(ch, x, y);                 // bright head
        ctx.fillStyle = trail;
        ctx.globalAlpha = .7;
        ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], x, y - FS);
        ctx.globalAlpha = 1;
        c.y += c.v;
        if (y > h && Math.random() > .975) { c.y = -Math.random() * 10; c.v = .25 + Math.random() * .5; }
      });
      requestAnimationFrame(frame);
    };
    resize();
    addEventListener("resize", resize);
    running = true;   // full-viewport layer; the browser already pauses rAF in background tabs
    requestAnimationFrame(frame);
  }
})();
