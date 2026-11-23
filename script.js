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
    "hero.eyebrow": "Barcelona",
    "hero.lead": "DevOps Engineer at OCA Global. I automate deployments and run infrastructure on AWS and Azure with Ansible, Jenkins, Docker and Kubernetes. Coming from Windows, Linux and VMware administration; studying Computer Engineering at UOC.",
    "hero.contact": "Let's talk", "hero.work": "See projects", "cv.short": "CV ↓", "cv": "Download CV",
    "id.hint": "↻ ./flip", "id.role": "Role", "id.at": "Company", "id.loc": "Location", "id.study": "Studying", "id.langs": "Languages", "id.next": "Next",
    "id.quote": "Always learning, always building.",
    "about.title": "DevOps Engineer today, Cloud Architect tomorrow.",
    "about.p1": "I'm a DevOps Engineer at OCA Global, where I automate deployments and manage infrastructure with Ansible, Jenkins, GitHub, Zabbix and Azure. Before that I ran virtualized environments on VMware and Linux and Windows servers, and worked with AWS, Docker and Kubernetes.",
    "about.p2": "Right now I'm preparing the AWS Solutions Architect Associate and studying Computer Engineering at UOC.",
    "st.years": "years in IT", "st.certs": "certifications", "st.repos": "public repos", "st.degree": "degree in progress",
    "sk.title": "terraform state list", "sk.hint": "Hover or tap an element to read its description.", "sk.use": "in use", "sk.train": "in training",
    "exp.title": "Journey",
    "w1.date": "JAN 2022 – JAN 2024", "w1.role": "Operation Technician Cloud", "w1.a": "AWS environment administration (EC2, S3, IAM)", "w1.b": "Docker containers and pods in production · Kubernetes operational support", "w1.c": "Monitoring with Grafana and IBM Dashboard · CI/CD collaboration",
    "w2.date": "FEB 2024 – DEC 2024", "w2.role": "IT Systems Administrator", "w2.a": "Virtualized environments with VMware vSphere, ESXi and vCenter", "w2.b": "Linux and Windows Server · backups with Veeam and Microsoft 365", "w2.c": "CI/CD with GitHub Actions · containerization with Docker", "w2.d": "Monitoring and optimization with Grafana",
    "w3.date": "JUN 2026 – PRESENT", "w3.role": "DevOps Engineer", "w3.a": "Automating deployments and infrastructure tasks with Ansible and Jenkins", "w3.b": "Monitoring with Zabbix · working on Azure and GitHub",
    "edu.title": "Education", "badge.progress": "In progress",
    "edu.uoc": "BSc Computer Engineering · 2026 – present",
    "edu.cifo": "Specialization in Multiplatform App Development (DAM) and DevOps Tools · 2024 – 2025",
    "edu.fp": "Higher Technician in Networked Computer Systems · 2019 – 2021",
    "ach.title": "Certifications & recognition",
    "cert.next": "NEXT TARGET", "cert.verify": "verify on Credly ↗", "cert.view": "View certificate", "cert.post": "see the LinkedIn post ↗",
    "q.title": "Projects & roadmap", "q.done": "Published",
    "qa.title": "Aeropuerto · Infra & CI/CD", "qa.desc": "Infrastructure and pipelines for the Aeropuerto system: Spring Boot backend and React frontend deployed on AWS ECS Fargate.",
    "qb.title": "CI/CD with automated tests", "qb.desc": "Python pipeline that validates every commit with automated tests (shift-left testing).",
    "qc.title": "Pokémon REST API", "qc.desc": "FastAPI REST API: CRUD, filters and Swagger, tests in CI and ready for a container.",
    "q.hack": "NASA Space Apps 2026", "chip.rt": "Real-time",
    "qd.title": "Astro-Care", "qd.desc": "Offline health monitoring for Artemis astronauts, built as a team in 48 hours: live vitals, automatic NEWS2 scoring and a GO / NO-GO test before critical tasks.",
    "qe.title": "Bedrock-IA · DevOps content", "qe.desc": "Daily pipeline that generates a DevOps post with AI (Amazon Bedrock) and publishes it to GitHub Pages with Quarto and GitHub Actions.",
    "q.roadmap": "Roadmap",
    "rm1.t": "Foundations", "rm1.d": "Linux, networking, Windows Server, AD, virtualization, Git",
    "rm2.t": "Cloud & IaC", "rm2.d": "AWS / Azure, Docker, Terraform, CI/CD",
    "rm3.t": "Platform & operations", "rm3.d": "Kubernetes, Helm, observability, cost, high availability",
    "rm4.t": "Cloud Architect", "rm4.d": "Landing zones, hybrid networking, Well-Architected",
    "c.title": "Let's talk", "c.lead": "Looking for someone for your systems or cloud team? Drop me a line.",
    "skip": "Skip to content",
    "a.loading": "Loading", "a.home": "Boris — home", "a.sections": "Sections", "a.theme": "Toggle light/dark theme", "a.lang": "Cambiar a español", "a.menu": "Menu",
    "a.summary": "Summary", "a.flip": "Flip card", "a.filter": "Filter skills",
    "tagline": "I automate deployments and run cloud infrastructure so teams can ship with confidence.",
    "vim.ask": "Last challenge: exit vim.", "vim.l1": "# Boring deployments (the good kind)", "vim.l3": "If your team still deploys by hand and crosses its fingers,",
    "vim.l4": "or you need someone to automate the repetitive stuff", "vim.l5": "and keep the cloud up while you sleep:", "vim.l6": "that's me. Get in touch ↑",
    "vim.l8": "By the way: you're inside vim.", "vim.ok": "Some people have been trying for years.", "vim.label": "Vim command",
    "egg.half": "A loose commit: drag it onto the other one to merge", "sky.quote": "Talk is cheap. Show me the code.", "sky.cite": "— Linus Torvalds", "egg.quote": "If you can imagine it, you can program it.", "egg.close": "Close",
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
      f.setAttribute("aria-pressed", k === activeCat);
      f.textContent = CATS[lang][k];
      f.addEventListener("click", () => {
        activeCat = k;
        $$(".filter").forEach(x => { x.classList.toggle("active", x === f); x.setAttribute("aria-pressed", x === f); });
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
    splitTagline();
    moveInd();   // link widths change with the language
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

  /* Theme switch: the new theme opens as a circle from the toggle (View Transitions + clip-path).
     Strong ease-out (the --ease token): most of the screen is covered in the first ~200 ms, the edge settles after.
     Reduced motion: a short crossfade instead. No View Transitions support: instant switch. */
  const themeBtn = $("#theme-btn");
  let themeBusy = false;
  themeBtn.addEventListener("click", () => {
    if (!document.startViewTransition) return flipTheme();
    if (themeBusy) return;
    themeBusy = true;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add(calm ? "vt-fade" : "vt-reveal");
    const vt = document.startViewTransition(flipTheme);
    if (!calm) vt.ready.then(() => {
      const r = themeBtn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));   // reach the farthest corner
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 520, easing: getComputedStyle(root).getPropertyValue("--ease").trim() || "ease-out", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(() => {});
    vt.finished.finally(() => { root.classList.remove("vt-reveal", "vt-fade"); themeBusy = false; });
  });

  // ---------- ID card ----------
  const card = $("#id-card");
  card.addEventListener("click", () => card.setAttribute("aria-pressed", card.classList.toggle("flipped")));

  // ---------- Public repo count, live from the GitHub API (cached per session; the HTML number is the fallback) ----------
  const repoEl = $("#repo-count");
  const showRepos = n => { if (Number.isFinite(n) && n > 0) repoEl.textContent = n; };
  const cachedRepos = +sessionStorage.getItem("pf-repos");
  if (cachedRepos) showRepos(cachedRepos);
  else fetch("https://api.github.com/users/borizSam")
    .then(r => (r.ok ? r.json() : null))
    .then(d => { if (d && d.public_repos) { showRepos(d.public_repos); sessionStorage.setItem("pf-repos", d.public_repos); } })
    .catch(() => {});


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

  // Nav: denser surface once scrolled · active section (sliding underline + prompt path) · page progress bar
  const navEl = $("#nav"), navInd = $("#nav-ind"), navPath = $("#nav-path");
  const navSecs = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
  let ticking = false, current = null;
  const moveInd = () => {
    const a = links.find(l => l.classList.contains("active"));
    if (!a || getComputedStyle(navInd).display === "none") { navInd.style.opacity = 0; return; }
    const nr = a.parentElement.getBoundingClientRect(), r = a.getBoundingClientRect();
    navInd.style.opacity = 1;
    navInd.style.transform = `translateX(${r.left - nr.left}px) scaleX(${r.width})`;
  };
  const navUpdate = () => {
    navEl.classList.toggle("scrolled", scrollY > 24);
    const max = document.documentElement.scrollHeight - innerHeight;
    navEl.style.setProperty("--prog", max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
    const line = innerHeight * .4;
    const sec = navSecs.filter(s => s.getBoundingClientRect().top <= line).pop() || null;
    if (sec !== current) {
      current = sec;
      links.forEach(a => a.classList.toggle("active", !!sec && a.getAttribute("href") === "#" + sec.id));
      navPath.textContent = sec ? "~/" + sec.id : "~";
      moveInd();
    }
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { navUpdate(); ticking = false; });
    }
  };
  addEventListener("resize", moveInd);
  document.fonts?.ready.then(moveInd);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Drag-scroll for achievements ----------
  const sc = $("#scroller");
  let down = false, sx = 0, sl = 0, dragged = false;
  sc.addEventListener("pointerdown", e => { down = true; dragged = false; sx = e.clientX; sl = sc.scrollLeft; sc.classList.add("drag"); });
  window.addEventListener("pointerup", () => { down = false; sc.classList.remove("drag"); });
  sc.addEventListener("pointermove", e => { if (!down) return; if (Math.abs(e.clientX - sx) > 5) dragged = true; sc.scrollLeft = sl - (e.clientX - sx); });
  sc.addEventListener("dragstart", e => e.preventDefault());   // links inside must not start a native drag
  sc.addEventListener("click", e => { if (dragged) e.preventDefault(); }, true);   // a drag is not a click on the Credly link

  const hero = $("#hero");
  const egg = { state: "apart", solved: false };   // easter egg state (see below)

  // ---------- NASA Space Apps certificate: the thumbnail opens it full size in a modal dialog ----------
  const certDlg = $("#cert-dlg");
  $("#cert-open").addEventListener("click", () => { certDlg.showModal(); document.body.classList.add("lock"); });
  $("#cert-close").addEventListener("click", () => certDlg.close());
  certDlg.addEventListener("click", e => { if (e.target === certDlg) certDlg.close(); });   // click on the backdrop
  certDlg.addEventListener("close", () => document.body.classList.remove("lock"));

  // ---------- Hidden easter egg: two loose commits that pass for stars; drag one onto the other to merge them ----------
  const halves = [$("#egg-l"), $("#egg-r")];
  const reveal = $("#egg-reveal"), revealClose = $("#egg-close");
  const SNAP = 64;   // px between the stars' centres that counts as "joined"
  // A commit node (ring + dot) with a short branch stub; the stub points away from the other half
  const NODE = stub => `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="currentColor" opacity=".07" />` +
    `<path d="${stub}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 4" opacity=".55" />` +
    `<circle cx="20" cy="20" r="7" fill="none" stroke="currentColor" stroke-width="2.5" /><circle cx="20" cy="20" r="2.6" fill="currentColor" /></svg>`;
  // git graph drawn where they meet: feature/imagine + main -> merge commit -> HEAD
  const CON = `<svg viewBox="0 0 160 140" aria-hidden="true">
    <path pathLength="1" d="M24 112C24 80 80 88 80 58" /><path pathLength="1" d="M136 112C136 80 80 88 80 58" /><path pathLength="1" d="M80 58V20" />
    <circle cx="24" cy="112" r="3.5" /><circle cx="136" cy="112" r="3.5" /><circle cx="80" cy="58" r="5" /><circle cx="80" cy="20" r="4" />
    <text x="24" y="130">feature/imagine</text><text x="136" y="130">main</text><text x="80" y="8">HEAD</text></svg>`;
  halves[0].innerHTML = NODE("M14 26L4 36");   // left node trails down-left
  halves[1].innerHTML = NODE("M26 14L36 4");   // right node trails up-right
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

  // ---------- Hidden terminal: type "sudo" anywhere, press ` or Ctrl+Alt+T, or tap the logo 5 times ----------
  const term = $("#term"), tOut = $("#term-out"), tIn = $("#term-in");
  const T = (es, en) => (lang === "en" ? en : es);
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const PROMPT = '<b class="tp">visitor@borizsam</b>:~$ ';
  const print = (html, cls = "") => { const d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html; tOut.appendChild(d); tOut.scrollTop = tOut.scrollHeight; };
  const text = el => ($(el)?.textContent || "").trim();
  const link = (href, label) => `<a href="${href}" target="_blank" rel="noopener">${esc(label || href)}</a>`;
  const SECTIONS = { about: "about", skills: "skills", experience: "experience", exp: "experience", achievements: "achievements", projects: "projects", contact: "contact" };
  const TUX = ["    .--.     ", "   |o_o |    ", "   |:_/ |    ", "  //   \\ \\   ", " (|     | )  ", "/'\\_   _/`\\  ", "\\___)=(___/  "];
  let history = [], hIdx = 0, greeted = false;

  const CMDS = {
    help: () => print(esc(T(
`Comandos:
  whoami · neofetch      quién soy
  ls · cat <archivo>     mira los archivos
  skills · projects      lo que uso y lo que he hecho
  experience             git log de mi carrera
  contact · cv           escríbeme o descarga el CV
  open <sección>         about · skills · experience · projects · contact
  theme · lang           cambia el tema o el idioma
  clear · exit
Hay más. Prueba cosas que escribirías en un Linux.`,
`Commands:
  whoami · neofetch      who I am
  ls · cat <file>        look at the files
  skills · projects      what I use and what I've built
  experience             git log of my career
  contact · cv           write to me or download the CV
  open <section>         about · skills · experience · projects · contact
  theme · lang           switch theme or language
  clear · exit
There's more. Try things you'd type on a Linux box.`)), "pre"),
    whoami: () => print("Boris Ivan Huarachi Pérez — DevOps Engineer @ OCA Global · Barcelona"),
    neofetch: () => {
      const info = ['<b class="tp">boris</b>@<b class="tp">prod</b>', "----------",
        "<b>OS</b>: Debian GNU/Linux (portfolio edition)", "<b>Host</b>: borisdevops.com", `<b>Kernel</b>: ${T("HTML + CSS + JS, sin frameworks", "HTML + CSS + JS, no frameworks")}`,
        `<b>Uptime</b>: ${T("5+ años en IT", "5+ years in IT")}`, "<b>Shell</b>: bash", "<b>Role</b>: DevOps Engineer @ OCA Global",
        "<b>Stack</b>: AWS · Azure · Terraform · Docker · K8s · Jenkins · Ansible", `<b>Study</b>: ${T("Ing. Informática · UOC", "Computer Engineering · UOC")}`, "<b>Location</b>: Barcelona"];
      print(info.map((l, i) => `<span class="tux">${esc(TUX[i] || " ".repeat(13))}</span>${l}`).join("\n"), "pre");
    },
    ls: a => print((a.includes("-a") || a.includes("-la") ? '<span class="dim">.secret</span>  ' : "") + 'about.txt  contact.txt  cv.pdf  <b class="td">projects/</b>  <b class="td">skills/</b>'),
    cat: a => {
      const f = (a[0] || "").replace(/^\.\//, "");
      if (!f) return print(T("uso: cat &lt;archivo&gt;", "usage: cat &lt;file&gt;"));
      if (f === "about.txt") return print(esc(text('[data-i18n="about.p1"]') + "\n\n" + text('[data-i18n="about.p2"]')), "pre");
      if (f === "contact.txt") return CMDS.contact();
      if (f === "cv.pdf") return print(T("cat: cv.pdf: es un binario. Prueba <b>cv</b>.", "cat: cv.pdf: binary file. Try <b>cv</b>."));
      if (f === ".secret") return print(T("Dos de las estrellas del cielo de arriba no son estrellas: son commits sueltos. Haz merge.", "Two of the stars in the sky up top aren't stars: they're loose commits. Merge them."));
      if (/^(projects|skills)\/?$/.test(f)) return print(`cat: ${esc(f)}: ${T("es un directorio", "Is a directory")}`);
      print(`cat: ${esc(f)}: ${T("No existe el archivo o el directorio", "No such file or directory")}`);
    },
    skills: () => {
      const rows = Object.keys(CATS.es).filter(k => k !== "all").map(k =>
        `<b class="td">${esc(CATS[lang][k].padEnd(14))}</b>` + SK.filter(e => e.c === k).map(e => (e.t ? '<span class="tw">~</span>' : '<span class="tok">+</span>') + esc(e.n)).join("  "));
      print(rows.join("\n") + `\n\n<span class="tok">+</span> ${T("en uso", "in use")}  <span class="tw">~</span> ${T("en entrenamiento", "in training")}`, "pre");
    },
    projects: () => print($$("#projects .grid3 .card").map(c => {
      const a = $("a.link", c);
      return `<b class="td">${esc($("h3, h4", c).textContent.trim())}</b>\n  ${a ? link(a.href, a.href.replace("https://", "")) : ""}`;
    }).join("\n"), "pre"),
    experience: () => print(esc($$(".timeline > li").map((li, i) => {
      const hash = ["a3f9c21", "7be04d8", "1c5e9f0"][i] || "0000000";
      return `${hash} ${i === 0 ? "(HEAD -> main) " : ""}${$("h3", li).childNodes[0].textContent.trim()} · ${$("h3 small", li).textContent.trim()} · ${$("time", li).textContent.trim()}`;
    }).join("\n")), "pre"),
    contact: () => print(["Email: " + link("mailto:bhuarachiperez@gmail.com", "bhuarachiperez@gmail.com"),
      "LinkedIn: " + link("https://www.linkedin.com/in/boris-ivan-huarachi-perez-859638219", "linkedin.com/in/boris-ivan-huarachi-perez"),
      "GitHub: " + link("https://github.com/borizSam", "github.com/borizSam")].join("\n"), "pre"),
    cv: () => { const a = document.createElement("a"); a.href = "assets/Boris-Ivan-Huarachi-Perez-CV.pdf"; a.download = "Boris-Ivan-Huarachi-Perez-CV.pdf"; a.click(); print(T("Descargando Boris-Ivan-Huarachi-Perez-CV.pdf…", "Downloading Boris-Ivan-Huarachi-Perez-CV.pdf…")); },
    open: a => {
      const id = SECTIONS[(a[0] || "").replace(/\/$/, "")];
      if (!id) return print(T("uso: open about | skills | experience | projects | contact", "usage: open about | skills | experience | projects | contact"));
      closeTerm(); setTimeout(() => $("#" + id).scrollIntoView({ behavior: reduced ? "auto" : "smooth" }), 50);
    },
    theme: () => { closeTerm(); setTimeout(() => $("#theme-btn").click(), 80); },
    lang: () => { $("#lang-btn").click(); print(T("Idioma: español", "Language: English")); },
    clear: () => { tOut.innerHTML = ""; },
    exit: () => closeTerm(),
    history: () => print(esc(history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join("\n")), "pre"),
    pwd: () => print("/home/visitor"),
    date: () => print(esc(new Date().toString())),
    echo: a => print(esc(a.join(" "))),
    uptime: () => print(T(" arriba 5+ años, 1 usuario, carga media: café, café, café", " up 5+ years, 1 user, load average: coffee, coffee, coffee")),
    sudo: () => print("[sudo] password for visitor: ********\nvisitor is not in the sudoers file. This incident will be reported.", "pre terr"),
    rm: a => print(a.join(" ").includes("/") ? T("rm: no se puede borrar '/': este portfolio es infraestructura inmutable 😉", "rm: cannot remove '/': this portfolio is immutable infrastructure 😉") : "rm: missing operand", "terr"),
    kubectl: a => print(a[0] === "get" && /^pods?$/.test(a[1] || "") ?
`NAME                          READY   STATUS    RESTARTS   AGE
portfolio-web-7f9c6d-x2k8p    1/1     Running   0          5y
coffee-daemon-5b8d9-qq2lm     1/1     Running   42         5y
boris-learning-0              1/1     Running   0          ∞` : esc("kubectl: try 'kubectl get pods'"), "pre"),
    docker: a => print(a[0] === "ps" ?
`CONTAINER ID   IMAGE                 STATUS        NAMES
3f1a9c2e7b40   borizsam/portfolio    Up 5 years    portfolio
9d2e41b0c3aa   aws/solutions-arch    Up (study)    next-cert` : esc("docker: try 'docker ps'"), "pre"),
    terraform: a => print(a[0] === "apply" ? T("Apply complete! Resources: 1 added (tú, como visitante), 0 changed, 0 destroyed.", "Apply complete! Resources: 1 added (you, as a visitor), 0 changed, 0 destroyed.")
      : "No changes. Your infrastructure matches the configuration."),
    git: a => (a[0] === "log" ? CMDS.experience() : a[0] === "status" ? print("On branch main\nYour branch is ahead of 'origin/junior' by 5+ years.\nnothing to commit, working tree clean", "pre") : print(esc("git: try 'git log' or 'git status'"))),
    ping: a => print(esc(`64 bytes from ${a[0] || "boris"}: icmp_seq=1 ttl=64 hire_me=yes time=0.1 ms`)),
    vim: () => print(T("Has entrado en vim. Para salir: <b>:q!</b> …es broma, ya estás fuera.", "You've entered vim. To quit: <b>:q!</b> …just kidding, you're already out.")),
  };
  Object.assign(CMDS, { "?": CMDS.help, man: CMDS.help, cd: CMDS.open, vi: CMDS.vim, nano: CMDS.vim, logout: CMDS.exit, quit: CMDS.exit, contacto: CMDS.contact, ll: () => CMDS.ls(["-la"]) });

  function run(line) {
    const raw = line.trim();
    print(PROMPT + esc(raw), "tcmd");
    if (!raw) return;
    history.push(raw); hIdx = history.length;
    const [cmd, ...args] = raw.split(/\s+/);
    const fn = CMDS[cmd.toLowerCase()];
    fn ? fn(args) : print(`bash: ${esc(cmd)}: command not found` + T(" · prueba <b>help</b>", " · try <b>help</b>"), "terr");
  }
  function openTerm() {
    if (term.open) return;
    term.showModal(); document.body.classList.add("lock");
    if (!greeted) {
      greeted = true;
      print(T("Bienvenido a la shell de Boris. Escribe <b>help</b> para ver los comandos.", "Welcome to Boris's shell. Type <b>help</b> to see the commands."), "dim");
    }
    tIn.focus();
  }
  function closeTerm() { if (term.open) term.close(); }
  term.addEventListener("close", () => document.body.classList.remove("lock"));
  term.addEventListener("click", e => { if (e.target === term) closeTerm(); else if (!e.target.closest("a, button")) tIn.focus(); });
  $("#term-x").addEventListener("click", closeTerm);
  $("#term-form").addEventListener("submit", e => { e.preventDefault(); run(tIn.value); tIn.value = ""; });
  tIn.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      hIdx = Math.max(0, Math.min(history.length, hIdx + (e.key === "ArrowUp" ? -1 : 1)));
      tIn.value = history[hIdx] || "";
    } else if (e.key === "Tab") {
      e.preventDefault();
      const hits = Object.keys(CMDS).filter(c => c.startsWith(tIn.value.trim().toLowerCase()) && /^[a-z]/.test(c));
      if (hits.length === 1) tIn.value = hits[0] + " ";
      else if (hits.length > 1) print(hits.join("  "), "dim");
    } else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); CMDS.clear(); }
  });

  // Triggers
  let typedKeys = "";
  addEventListener("keydown", e => {
    if (term.open || e.target.closest?.("input, textarea, [contenteditable]")) return;
    if ((e.ctrlKey && e.altKey && e.key.toLowerCase() === "t") || e.key === "`") { e.preventDefault(); return openTerm(); }
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
    typedKeys = (typedKeys + e.key.toLowerCase()).slice(-4);
    if (typedKeys === "sudo") { typedKeys = ""; openTerm(); }
  });
  let taps = 0, tapTimer;
  $(".logo").addEventListener("click", e => {
    taps++; clearTimeout(tapTimer); tapTimer = setTimeout(() => (taps = 0), 1500);
    if (taps >= 5) { taps = 0; e.preventDefault(); openTerm(); }
  });
  // A hint for whoever opens DevTools
  console.log("%c boris@prod:~$ %c ¿Curioseando? Escribe \"sudo\" en la página. · Curious? Type \"sudo\" on the page.",
    "background:#b3122e;color:#fff;font-weight:700;padding:2px 4px;border-radius:3px", "color:inherit");

  // ---------- Footer puzzle: you're inside vim. Get out. ----------
  const vimWin = $("#vim-win"), vimIn = $("#vim-in"), vimMsg = $("#vim-msg"), vimMode = $("#vim-mode"), vimEdit = $("#vim-edit");
  let vimFails = 0, vimT0 = 0;
  const vimSay = (html, err) => { vimMsg.innerHTML = html; vimMsg.classList.toggle("err", !!err); };
  const vimHint = () => {
    vimFails++;
    if (vimFails === 3) return T(" · Pista: empieza por dos puntos.", " · Hint: it starts with a colon.");
    if (vimFails === 5) return T(" · Pista: <b>:q</b> y algo que grite.", " · Hint: <b>:q</b> and something that shouts.");
    if (vimFails >= 7) return T(" · Vale, vale: <b>:q!</b> y Enter.", " · Fine, fine: <b>:q!</b> and Enter.");
    return "";
  };
  function vimExit() {
    const secs = Math.max(1, Math.round((performance.now() - (vimT0 || performance.now())) / 1000));
    $("#vim-time").textContent = T(`Saliste de vim en ${secs} s.`, `You exited vim in ${secs} s.`);
    $("#vim").classList.add("done");
    vimIn.blur();
    vimEdit.classList.add("closing");                              // the editor fades, the same card reports the exit
    setTimeout(() => {
      vimEdit.hidden = true;
      $("#vim-title").textContent = "exit 0";
      vimWin.classList.add("exited");
      $("#vim-ok").hidden = false; $("#vim-quote").hidden = false;
      requestAnimationFrame(() => vimWin.classList.add("shown"));
    }, reduced ? 0 : 320);
  }
  function vimRun(raw) {
    const c = raw.trim();
    if (!c) return;
    const q = c.replace(/\s+/g, "");
    if (/^:(q|qa|wq|x|wqa|xa|cq)!$/.test(q) || q === "ZQ") return vimExit();
    if (/^:(q|qa|quit|quita|cq)$/.test(q)) return vimSay("E37: No write since last change (add ! to override)" + vimHint(), true);
    if (/^:(w|wq|x|wqa|xa|write|update)!?$/.test(q) || q === "ZZ") return vimSay("E45: 'readonly' option is set (add ! to override)" + vimHint(), true);
    if (/^:(h|help)\b/.test(q)) return vimSay(T("Para salir: <b>:q!</b> (sin guardar). Ya está, ese era el secreto.", "To quit: <b>:q!</b> (without saving). That's it, that was the secret."));
    if (/^:!/.test(q)) return vimSay(T("Buen intento, pero aquí no hay shell. Primero sal de vim.", "Nice try, but there's no shell here. Exit vim first."), true);
    if (/^(exit|quit|salir|logout|bye|adios|adiós)$/i.test(q)) return vimSay(`E492: Not an editor command: ${esc(c)}` + vimHint(), true);
    if (/^[ia]$/i.test(q)) { vimMode.textContent = "-- INSERT --"; return vimSay(T("Ahora estás en modo INSERT. Eso no te saca de aquí: pulsa Esc.", "Now you're in INSERT mode. That won't get you out: press Esc.")); }
    if (q[0] !== ":") return vimSay(T(`Estás en modo NORMAL: "${esc(c)}" no hace nada útil. Los comandos empiezan por <b>:</b>`, `You're in NORMAL mode: "${esc(c)}" does nothing useful. Commands start with <b>:</b>`) + vimHint(), true);
    vimSay(`E492: Not an editor command: ${esc(c.slice(1))}` + vimHint(), true);
  }
  $("#vim-form").addEventListener("submit", e => { e.preventDefault(); if (!vimT0) vimT0 = performance.now(); vimRun(vimIn.value); vimIn.value = ""; });
  vimIn.addEventListener("focus", () => { if (!vimT0) vimT0 = performance.now(); });
  vimIn.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (vimMode.textContent !== "-- NORMAL --") { vimMode.textContent = "-- NORMAL --"; vimSay(""); }
      else vimSay(T("Ya estás en modo NORMAL. Pulsar Esc más fuerte no ayuda.", "You're already in NORMAL mode. Pressing Esc harder won't help."));
    } else if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      vimSay("Type  :qa!  and press &lt;Enter&gt; to abandon all changes and exit Vim");
    }
  });
  vimWin.addEventListener("click", () => vimIn.focus());

  applyLang();
})();
