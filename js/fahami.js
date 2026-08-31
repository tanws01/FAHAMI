/* ============================================================================
   FAHAMI — fahami.js
   UI controller: navigation, live-data wiring, rendering for every screen,
   the "Magic Moment" guided flow, gamification, confetti, theme + language.
   All user-facing text flows through window.FAHAMI_T (see i18n.js), so every
   screen renders in English, Malay, Chinese or Tamil.

   Creator: Tan Wei Siang. Fully owned by Tan Wei Siang.
   Self-contained: no build step, no dependencies, no Databricks, no Git.
   ============================================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const D = () => window.FAHAMI;
  const T = (k, v) => window.FAHAMI_T(k, v);
  const rm = (n) => "RM" + Number(Math.round(n)).toLocaleString("en-MY");
  const store = { life: null, income: null, state: "Malaysia" };

  /* ---- Language ---------------------------------------------------------- */
  function refreshHero() {
    const st = window.FAHAMI_LIVE.status;
    if (st && st.checkedAt && st.source === "live") $("#heroBig").textContent = window.FAHAMI_AI.headline().big;
  }
  function applyLang() {
    window.I18N.applyStatic();
    document.documentElement.lang = window.I18N.lang;
    refreshHero();
    renderDataPill();
  }

  /* ---- Navigation -------------------------------------------------------- */
  function go(name) {
    $$(".screen").forEach((s) => s.classList.toggle("active", s.dataset.screen === name));
    $$(".topnav button").forEach((b) => b.classList.toggle("on", b.dataset.go === name));
    window.scrollTo({ top: 0, behavior: "smooth" });
    const render = SCREEN_RENDER[name];
    if (render) render();
  }
  const SCREEN_RENDER = {};

  document.addEventListener("click", (e) => {
    const goEl = e.target.closest("[data-go]");
    if (goEl) { go(goEl.dataset.go); return; }
  });

  /* ---- Theme ------------------------------------------------------------- */
  function applyTheme(mode) {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem("fahami-theme", mode);
    $("#themeToggle").innerHTML = mode === "dark" ? "&#9728;" : "&#9789;";
  }
  $("#themeToggle").addEventListener("click", () =>
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

  $("#langSel").addEventListener("change", (e) => {
    window.I18N.lang = e.target.value; applyLang();
    const active = $(".screen.active"); if (active && SCREEN_RENDER[active.dataset.screen]) SCREEN_RENDER[active.dataset.screen]();
  });

  /* ---- Data pill --------------------------------------------------------- */
  function renderDataPill() {
    const st = window.FAHAMI_LIVE.status, pill = $("#dataStatus"), txt = $("#dataStatusText");
    if (!st.checkedAt) { txt.textContent = T("pill.checking"); pill.classList.remove("live"); return; }
    if (st.source === "live") { pill.classList.add("live"); txt.textContent = T("pill.live"); }
    else { pill.classList.remove("live"); txt.textContent = T("pill.bundled"); }
  }
  $("#dataStatus").addEventListener("click", () => {
    const st = window.FAHAMI_LIVE.status;
    openModal({
      ic: st.source === "live" ? "&#128225;" : "&#128230;",
      title: st.source === "live" ? T("data.liveTitle") : T("data.bundledTitle"),
      sub: T("data.sub"),
      html:
        `<p class="lead">${T("data.lead")}</p>` +
        (st.source === "live"
          ? `<div class="insight ok"><div class="h"><span>&#9989;</span> ${T("data.liveH")}</div>` +
            `<p>${T("data.liveBody", { got: st.got.join(", ") || T("data.coreIndicators"), asOf: st.asOf, time: st.checkedAt.toLocaleTimeString("en-MY") })}</p></div>`
          : `<div class="insight alert"><div class="h"><span>&#9888;</span> ${T("data.bundledH")}</div>` +
            `<p>${T("data.bundledBody", { err: st.error ? " (" + st.error + ")" : "" })}</p></div>`) +
        `<p class="small muted" style="margin-top:16px">${T("data.note")}</p>`
    });
  });

  /* ---- Modal ------------------------------------------------------------- */
  function openModal({ ic, title, sub, val, html }) {
    $("#modal").innerHTML =
      `<button class="x" aria-label="Close">&times;</button>` +
      `<div class="mhead"><div class="mic">${ic || "&#128202;"}</div>` +
      `<div><div class="mt">${title}</div>${sub ? `<div class="ms">${sub}</div>` : ""}</div></div>` +
      (val ? `<div class="mval">${val}</div>` : "") + (html || "");
    $("#modalBack").classList.add("open");
    $("#modal .x").addEventListener("click", closeModal);
  }
  function closeModal() { $("#modalBack").classList.remove("open"); }
  $("#modalBack").addEventListener("click", (e) => { if (e.target.id === "modalBack") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---- Confetti ---------------------------------------------------------- */
  const canvas = $("#confetti-canvas"), ctx = canvas.getContext("2d");
  let parts = [], raf = null;
  function sizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
  addEventListener("resize", sizeCanvas); sizeCanvas();
  function confetti(n) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cols = ["#2a78d6", "#7b61ff", "#eb6834", "#1baf7a", "#f5a623", "#ff7ac0"];
    for (let i = 0; i < (n || 90); i++)
      parts.push({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - 0.5) * 14,
        vy: Math.random() * -13 - 4, g: 0.35 + Math.random() * 0.2, s: 5 + Math.random() * 6,
        c: cols[(Math.random() * cols.length) | 0], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 90 });
    if (!raf) tick();
  }
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach((p) => { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); ctx.restore(); });
    parts = parts.filter((p) => p.life > 0 && p.y < canvas.height + 40);
    if (parts.length) raf = requestAnimationFrame(tick); else { raf = null; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  /* ---- Ripple on buttons ------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".btn-primary"); if (!b) return;
    const r = b.getBoundingClientRect(), s = document.createElement("span");
    s.className = "ripple"; const d = Math.max(r.width, r.height);
    s.style.width = s.style.height = d + "px";
    s.style.left = e.clientX - r.left - d / 2 + "px"; s.style.top = e.clientY - r.top - d / 2 + "px";
    b.appendChild(s); setTimeout(() => s.remove(), 600);
  });

  /* ---- Gamification ------------------------------------------------------ */
  const earned = new Set(JSON.parse(localStorage.getItem("fahami-badges") || "[]"));
  function earn(id) {
    if (earned.has(id)) return;
    earned.add(id); localStorage.setItem("fahami-badges", JSON.stringify([...earned]));
    const b = window.FAHAMI_BADGES.find((x) => x.id === id); if (!b) return;
    confetti(70);
    toast(`${b.m} ${T("badge.unlocked", { name: T("badge." + id + ".name") })}`);
    if ($(".screen.active").dataset.screen === "learn") renderBadges();
  }
  let toastT = null;
  function toast(msg) {
    let el = $("#toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; document.body.appendChild(el);
      el.style.cssText = "position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:95;" +
        "background:var(--surface-1);border:1px solid var(--good);color:var(--text-1);font-weight:800;" +
        "padding:12px 20px;border-radius:99px;box-shadow:var(--shadow-lg);transition:opacity .3s,transform .3s;font-size:14px;"; }
    el.textContent = msg; el.style.opacity = "1"; el.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(toastT);
    toastT = setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateX(-50%) translateY(10px)"; }, 2600);
  }

  /* ---- Sparkline (tiny inline SVG) --------------------------------------- */
  function spark(vals, color) {
    if (!vals || vals.length < 2) return "";
    const w = 100, h = 34, mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
    const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - ((v - mn) / rng) * (h - 6) - 3}`).join(" ");
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">` +
      `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  /* ======================================================================
     SCREEN: Economy at a Glance
     ====================================================================== */
  SCREEN_RENDER.glance = function () {
    const d = D();
    const cards = [
      { key: "gdp", ic: "&#128200;", k: T("g.gdp.k"), v: (d.gdp.growth_yoy > 0 ? "+" : "") + d.gdp.growth_yoy, u: T("g.unitYoY"),
        trend: d.gdp.growth_yoy >= 0 ? "up" : "down", tl: T(d.gdp.growth_yoy >= 0 ? "g.gdp.up" : "g.gdp.down"),
        sp: [4.2, 5.1, 4.8, 5.6, d.gdp.growth_yoy], c: "var(--brand)" },
      { key: "inflation", ic: "&#127925;", k: T("g.inflation.k"), v: "+" + d.cpi.inflation_yoy, u: T("g.unitYoY"),
        trend: d.cpi.inflation_yoy <= 3 ? "flat" : "up", tl: T(d.cpi.inflation_yoy <= 3 ? "g.inflation.contained" : "g.inflation.elevated"),
        sp: [1.8, 2.0, 2.3, 2.1, d.cpi.inflation_yoy], c: "var(--series-2)" },
      { key: "unemployment", ic: "&#128188;", k: T("g.unemployment.k"), v: d.labour.u_rate, u: T("g.unitPct"),
        trend: d.labour.u_rate <= 3.5 ? "down" : "up", tl: T(d.labour.u_rate <= 3.5 ? "g.unemployment.nearfull" : "g.unemployment.rising"),
        sp: [3.5, 3.3, 3.2, 3.1, d.labour.u_rate], c: "var(--series-3)" },
      { key: "income", ic: "&#128176;", k: T("g.income.k"), v: rm(d.income.median), u: T("g.unitMo"),
        trend: "up", tl: T("g.income.tl"), sp: [5900, 6100, 6200, 6300, d.income.median], c: "var(--c-purple)" },
      { key: "trade", ic: "&#128674;", k: T("g.trade.k"), v: (d.trade.balance >= 0 ? "+" : "-") + "RM" + Math.abs(Math.round(d.trade.balance / 1000)) + "b", u: "",
        trend: d.trade.balance >= 0 ? "up" : "down", tl: T(d.trade.balance >= 0 ? "g.trade.surplus" : "g.trade.deficit"),
        sp: [11, 12.5, 13, 12.8, d.trade.balance / 1000], c: "var(--c-teal)" },
      { key: "population", ic: "&#128101;", k: T("g.population.k"), v: (d.population.total / 1000).toFixed(1), u: T("g.unitM"),
        trend: "up", tl: T("g.population.tl"), sp: [33.4, 33.7, 34.0, 34.2, d.population.total / 1000], c: "var(--c-amber)" }
    ];
    $("#glanceGrid").innerHTML = cards.map((c) =>
      `<button class="ind" data-explain="${c.key}">` +
      `<span class="ic">${c.ic}</span><span class="k">${c.k}</span>` +
      `<span class="v">${c.v}<span class="u">${c.u}</span></span>` +
      `<span class="trend ${c.trend}">${c.trend === "up" ? "&#9650;" : c.trend === "down" ? "&#9660;" : "&#9644;"} ${c.tl}</span>` +
      spark(c.sp, c.c) +
      `<span class="whatlink">${T("g.explainThis")} <span>&rarr;</span></span></button>`).join("");
    $("#glanceSource").innerHTML =
      `<span class="pin">&#128204;</span> ` +
      T("g.source", { src: T(window.FAHAMI_LIVE.status.source === "live" ? "g.live" : "g.bundled"), q: d.gdp.quarter, m: d.cpi.month, lm: d.labour.month });

    $$("#glanceGrid .ind").forEach((el) => el.addEventListener("click", () => {
      const topic = el.dataset.explain;
      if (topic === "population") { openModal({ ic: "&#128101;", title: T("g.population.modalTitle"), sub: "DOSM Open Data",
        val: (d.population.total / 1000).toFixed(2) + " " + T("g.population.million"), html: `<p class="lead">${T("g.population.modalBody", { year: d.population.year })}</p>` }); return; }
      go("explain"); selectTopic(topic);
    }));
  };

  /* ======================================================================
     SCREEN: AI Explainer
     ====================================================================== */
  let currentTopic = "gdp";
  function selectTopic(topic) {
    currentTopic = topic; earn("explorer");
    $$("#explainTopics .chip").forEach((c) => c.classList.toggle("on", c.dataset.topic === topic));
    const e = window.FAHAMI_AI.explain(topic);
    $("#explainCard").innerHTML =
      `<div class="ai-byline"><span class="bot">&#129302;</span> ${T("explain.byline")}</div>` +
      `<h3 style="font-size:22px;font-weight:850;margin-bottom:6px">${e.title}</h3>` +
      `<div class="insight ${e.tone}" style="margin:16px 0"><div class="h"><span>&#128202;</span> ${T("explain.theNumber")}</div><p>${e.dataLine}</p></div>` +
      `<div class="explainer">` +
        `<details class="qa" open><summary><span>&#128172;</span> ${T("explain.plainEnglish")}<span class="chev">&rsaquo;</span></summary><div class="body">${e.body}</div></details>` +
        `<details class="qa notmean"><summary><span>&#10060;</span> ${T("explain.notMeanH")}<span class="chev">&rsaquo;</span></summary><div class="body">${e.notMean}</div></details>` +
        `<details class="qa care"><summary><span>&#10084;</span> ${T("explain.careH")}<span class="chev">&rsaquo;</span></summary><div class="body">${e.care}</div></details>` +
      `</div>` +
      `<div class="source-note"><span class="pin">&#128204;</span> ${e.source}</div>`;
  }
  SCREEN_RENDER.explain = function () {
    $("#explainTopics").innerHTML = window.FAHAMI_AI.topics().map((tp) =>
      `<button class="chip" data-topic="${tp.key}">${tp.ic} ${tp.label}</button>`).join("");
    $$("#explainTopics .chip").forEach((c) => c.addEventListener("click", () => selectTopic(c.dataset.topic)));
    selectTopic(currentTopic);
  };

  /* ======================================================================
     SCREEN: Ask FAHAMI
     ====================================================================== */
  let chatInit = false;
  function pushMsg(kind, html) {
    const el = document.createElement("div"); el.className = "msg " + kind; el.innerHTML = html;
    $("#chat").appendChild(el); $("#chat").scrollTop = $("#chat").scrollHeight; return el;
  }
  function botHtml(a) {
    return (a.source ? `<div class="src"><span>&#129302;</span> ${a.source}</div>` : "") +
      (a.dataLine ? `<div class="data-line">${a.dataLine}</div>` : "") +
      `<div>${a.body}</div>` +
      `<div class="foot">${T("ask.footer")}</div>`;
  }
  function respond(userText, getAnswer) {
    pushMsg("user", escapeHtml(userText));
    const typing = pushMsg("bot", `<div class="typing"><i></i><i></i><i></i></div>`);
    earn("curious");
    setTimeout(() => { typing.innerHTML = botHtml(getAnswer()); $("#chat").scrollTop = $("#chat").scrollHeight; }, 550);
  }
  const answer = (text) => respond(text, () => window.FAHAMI_AI.ask(text));
  const answerSuggest = (sug) => respond(sug.label, () => window.FAHAMI_AI.answerIntent(sug.i));
  SCREEN_RENDER.ask = function () {
    if (!chatInit) {
      pushMsg("bot", `<div class="src"><span>&#129302;</span> FAHAMI</div><div>${T("ask.greeting")}</div>`);
      const sugs = window.FAHAMI_AI.SUGGESTIONS();
      $("#askSuggests").innerHTML = sugs.map((s, i) => `<button data-sug="${i}">${s.label}</button>`).join("");
      $$("#askSuggests button").forEach((b) => b.addEventListener("click", () => answerSuggest(sugs[+b.dataset.sug])));
      const send = () => { const v = $("#askInput").value.trim(); if (!v) return; answer(v); $("#askInput").value = ""; };
      $("#askSend").addEventListener("click", send);
      $("#askInput").addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
      chatInit = true;
    }
  };
  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  /* ======================================================================
     SCREEN: My Economy
     ====================================================================== */
  function fillStateSelects() {
    const opts = window.FAHAMI_STATES.map((s) => `<option value="${s.key}">${s.key}</option>`).join("");
    $("#inState").innerHTML = opts; $("#cmpState").innerHTML = opts;
    if (store.state) { $("#inState").value = store.state; $("#cmpState").value = store.state; }
  }
  SCREEN_RENDER.me = function () { fillStateSelects(); };
  $$("#inLife button").forEach((b) => b.addEventListener("click", () => {
    $$("#inLife button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); store.life = b.dataset.v;
  }));
  $("#meBuild").addEventListener("click", () => {
    const income = +($("#inIncome").value || 0); store.income = income; store.state = $("#inState").value;
    const d = D(), st = window.FAHAMI_STATES.find((s) => s.key === store.state) || window.FAHAMI_STATES[0];
    const median = d.income.median;
    const ratio = income ? income / median : 0;
    const whereKey = ratio >= 1.5 ? "comfAbove" : ratio >= 1 ? "above" : ratio >= 0.7 ? "littleBelow" : "below";
    const pctVsState = st.median ? ((income - st.median) / st.median * 100).toFixed(0) : null;
    const infl = d.cpi.inflation_yoy;
    const needRaise = income ? rm(income * infl / 100) : null;
    const stateClause = pctVsState !== null
      ? T("snap.stateClause", { pct: (pctVsState >= 0 ? "+" : "") + pctVsState + "%", state: st.key, smed: rm(st.median) }) : "";

    earn("personal"); confetti(60);
    const r = $("#meResult"); r.classList.remove("hidden");
    r.innerHTML =
      `<div class="card pad-lg stagger">` +
      `<div class="card-title"><span>&#129489;</span> ${T("snap.title")}</div>` +
      `<div class="card-sub">${T("snap.sub")}</div>` +
      (income ?
        `<div class="insight ${ratio >= 1 ? "ok" : ""}"><div class="h"><span>&#128200;</span> ${T("snap.whereH")}</div>` +
        `<p>${T("snap.whereBody", { inc: rm(income), where: T("snap.where." + whereKey), med: rm(median), stateClause })}</p></div>`
        : `<div class="insight"><div class="h"><span>&#128161;</span> ${T("snap.addH")}</div><p>${T("snap.addBody", { med: rm(median) })}</p></div>`) +
      (income ?
        `<div class="dim"><div class="top"><span class="name"><span>&#9878;</span> ${T("snap.dimName")}</span><span class="score">${Math.round(ratio * 100)}%</span></div>` +
        `<div class="track"><div class="fill" style="width:${Math.min(100, ratio * 50).toFixed(0)}%;background:linear-gradient(90deg,var(--brand),var(--c-purple))"></div></div>` +
        `<div class="hint">${T("snap.dimHint")}</div></div>` : "") +
      (income ?
        `<div class="insight alert"><div class="h"><span>&#127925;</span> ${T("snap.taxH")}</div>` +
        `<p>${T("snap.taxBody", { infl, raise: needRaise })}</p></div>` : "") +
      lifeTip(store.life, d) +
      `<div class="source-note"><span class="pin">&#128204;</span> ${T("snap.source", { m: d.cpi.month })}</div>` +
      `<div class="btn-row"><button class="btn btn-primary" data-go="play"><span>&#127918;</span> ${T("snap.playBtn")}</button>` +
      `<button class="btn btn-ghost" data-go="states">${T("snap.cmpBtn")}</button></div>` +
      `</div>`;
    r.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  const TIP_IC = { student: "&#127891;", working: "&#128188;", family: "&#128106;", business: "&#127978;", retired: "&#127796;", other: "&#10024;" };
  function lifeTip(life, d) {
    if (!life || !TIP_IC[life]) return "";
    const vars = { infl: d.cpi.inflation_yoy, med: rm(d.income.median), u: d.labour.u_rate, g: d.gdp.growth_yoy };
    return `<div class="insight"><div class="h"><span>${TIP_IC[life]}</span> ${T("tip." + life + ".h")}</div><p>${T("tip." + life + ".body", vars)}</p></div>`;
  }

  /* ======================================================================
     SCREEN: Playground
     ====================================================================== */
  const opr = $("#opOpr"), inf = $("#opInf"), gov = $("#opGov");
  function sliderFill(el) {
    const min = +el.min, max = +el.max, v = +el.value;
    el.style.setProperty("--pct", ((v - min) / (max - min) * 100) + "%");
  }
  function renderChain() {
    const o = +opr.value, i = +inf.value, g = +gov.value;
    const rateEffect = (3 - o) * 0.4;
    const govEffect = g * 0.05;
    const inflDrag = -Math.max(0, i - 2) * 0.3;
    const demand = rateEffect + govEffect + inflDrag;
    const growthD = demand;
    const jobsD = demand * 0.5;
    const priceD = i + Math.max(0, demand) * 0.4;
    const dir = (v) => T(v > 0.15 ? "chain.dirUp" : v < -0.15 ? "chain.dirDown" : "chain.dirFlat");
    const arrow = (v) => v > 0.15 ? "&#9650;" : v < -0.15 ? "&#9660;" : "&#9644;";
    const cheap = o <= 3;
    const nodes = [
      ["&#127903;", T("chain.n0T"), T("chain.n0B", { o, i: (i > 0 ? "+" : "") + i, g: (g > 0 ? "+" : "") + g })],
      [cheap ? "&#128176;" : "&#128179;", T(cheap ? "chain.borrowCheapT" : "chain.borrowPricyT"), T(cheap ? "chain.borrowCheapB" : "chain.borrowPricyB", { o })],
      ["&#128722;", T("chain.demandT", { x: dir(demand) + " " + arrow(demand) }), T("chain.demandB", { dir: dir(demand) })],
      ["&#128200;", T("chain.gdpT", { x: dir(growthD) + " " + arrow(growthD) }), T("chain.gdpB", { val: (D().gdp.growth_yoy + growthD).toFixed(1) })],
      ["&#128188;", T("chain.jobsT", { x: dir(jobsD) + " " + arrow(jobsD) }),
        T("chain.jobsB", { ud: T(jobsD > 0.15 ? "chain.jobDown" : jobsD < -0.15 ? "chain.jobUp" : "chain.jobFlat"), u: D().labour.u_rate })],
      ["&#127925;", T(priceD > D().cpi.inflation_yoy ? "chain.priceClimbT" : "chain.priceStayT") + " " + arrow(priceD - D().cpi.inflation_yoy),
        T("chain.priceB", { val: priceD.toFixed(1) })]
    ];
    $("#chain").innerHTML = nodes.map((n, idx) =>
      `<div class="node${idx === 0 ? " open" : ""}"><div class="dotcol"><span class="bullet">${n[0]}</span><span class="stem"></span></div>` +
      `<div class="tx"><div class="lv">${n[1]}${idx < nodes.length - 1 ? '<span class="plus">+</span>' : ""}</div><div class="ex">${n[2]}</div></div></div>`).join("");
    $$("#chain .node").forEach((el) => el.addEventListener("click", () => el.classList.toggle("open")));
  }
  [opr, inf, gov].forEach((el) => el && el.addEventListener("input", () => {
    sliderFill(el);
    $("#opValOpr").textContent = opr.value + "%";
    $("#opValInf").textContent = (inf.value > 0 ? "+" : "") + inf.value + "%";
    $("#opValGov").textContent = (gov.value > 0 ? "+" : "") + gov.value + "%";
    renderChain(); earn("player");
  }));
  SCREEN_RENDER.play = function () { [opr, inf, gov].forEach(sliderFill); renderChain(); };

  /* ======================================================================
     SCREEN: Malaysia vs Your State
     ====================================================================== */
  function renderCompare() {
    const key = $("#cmpState").value;
    const my = window.FAHAMI_STATES.find((s) => /malaysia/i.test(s.key)) || window.FAHAMI_STATES[0];
    const st = window.FAHAMI_STATES.find((s) => s.key === key) || my;
    const stWins = (st.median || 0) >= (my.median || 0);
    const diff = my.median ? ((st.median - my.median) / my.median * 100).toFixed(0) : 0;
    const metric = (label, a, b, fmt, higherBetter) => {
      const av = a == null ? "-" : fmt(a), bv = b == null ? "-" : fmt(b);
      const better = a != null && b != null ? (higherBetter ? a > b : a < b) : false;
      return `<div class="statrow"><span class="k">${label}</span><span class="v ${better ? "pos" : ""}">${bv} <span class="muted small">(MY ${av})</span></span></div>`;
    };
    $("#cmpResult").innerHTML =
      `<div class="card pad-lg stagger">` +
      `<div class="compare"><div class="col ${!stWins ? "win" : ""}"><div class="place">${my.emoji} ${T("cmp.malaysia")}</div>` +
      `<div class="big">${rm(my.median)}</div><div class="lbl">${T("cmp.medianCaption")}</div></div>` +
      `<div class="vs">vs</div>` +
      `<div class="col ${stWins ? "win" : ""}"><div class="place">${st.emoji} ${st.key}</div>` +
      `<div class="big">${rm(st.median)}</div><div class="lbl">${T("cmp.medianCaption")}</div></div></div>` +
      `<div class="insight ${stWins ? "ok" : ""}" style="margin-top:20px"><div class="h"><span>&#128202;</span> ${T("cmp.gapH")}</div>` +
      `<p>${T("cmp.gapBody", { state: st.key, diff: (diff >= 0 ? "+" : "") + diff + "%", moreless: T(stWins ? "cmp.moreThan" : "cmp.lessThan"), tail: T(stWins ? "cmp.tailHigh" : "cmp.tailLow") })}</p></div>` +
      `<div class="cmp-metrics">` +
        metric(T("cmp.mMedian"), my.median, st.median, rm, true) +
        metric(T("cmp.mMean"), my.mean, st.mean, rm, true) +
        (st.gini != null ? metric(T("cmp.mGini"), my.gini, st.gini, (x) => x.toFixed(3), false) : "") +
        (st.poverty != null ? metric(T("cmp.mPoverty"), my.poverty, st.poverty, (x) => x + "%", false) : "") +
      `</div>` +
      `<div class="source-note"><span class="pin">&#128204;</span> ${T("cmp.source")}</div></div>`;
  }
  SCREEN_RENDER.states = function () { fillStateSelects(); if ($("#cmpState").value === "Malaysia") $("#cmpState").value = window.FAHAMI_STATES[1] ? window.FAHAMI_STATES[1].key : "Malaysia"; renderCompare(); };
  $("#cmpState").addEventListener("change", renderCompare);

  /* ======================================================================
     SCREEN: MADANI Tracker
     ====================================================================== */
  function liveVal(path) { return path.split(".").reduce((o, k) => (o ? o[k] : null), D()); }
  SCREEN_RENDER.madani = function () {
    $("#madaniList").innerHTML = window.FAHAMI_MADANI.map((m) => {
      const val = liveVal(m.live);
      const has = val != null && !isNaN(val);
      let progress = 0;
      if (has) { progress = ((val - m.floor) / (m.ceil - m.floor)) * 100; progress = Math.max(0, Math.min(100, progress)); }
      const fmtV = (v) => m.unit === "RM" ? rm(v) : v + m.unit;
      const met = has && (m.dir === "up" ? val >= m.target : val <= m.target);
      return `<div class="target">` +
        `<div class="th"><span class="nm">${m.emoji} ${T("madaniItem." + m.key + ".name")}</span>` +
        `<span class="badge ${has ? "live" : "model"}">${has ? T("madani.live") : T("madani.reference")}</span></div>` +
        `<div class="card-sub" style="margin:0">${T("madaniItem." + m.key + ".metric")}</div>` +
        `<div class="cur"><span class="now">${has ? fmtV(val) : "-"}</span><span class="arrow">&rarr; ${T("madani.target")}</span>` +
        `<span class="goal">${fmtV(m.target)}</span>${met ? ` <span class="badge live">${T("madani.ontrack")}</span>` : ""}</div>` +
        `<div class="ptrack"><div class="pf" style="width:${progress.toFixed(0)}%"></div></div>` +
        `<div class="exp">${T("madaniItem." + m.key + ".note")}</div></div>`;
    }).join("");
  };

  /* ======================================================================
     SCREEN: Learn + Quiz + Badges
     ====================================================================== */
  function renderLessons() {
    $("#lessonGrid").innerHTML = window.FAHAMI_LESSONS.map((l) =>
      `<button class="lesson" data-lesson="${l.id}"><span class="ic">${l.ic}</span>` +
      `<div class="t">${T("lesson." + l.id + ".t")}</div><div class="d">${T("lesson." + l.id + ".d")}</div><div class="lvl">${T("lvl." + l.lvl)}</div></button>`).join("");
    $$("#lessonGrid .lesson").forEach((el) => el.addEventListener("click", () => {
      const l = window.FAHAMI_LESSONS.find((x) => x.id === el.dataset.lesson);
      earn("scholar");
      openModal({ ic: l.ic, title: T("lesson." + l.id + ".t"), sub: T("lesson.modalSub", { lvl: T("lvl." + l.lvl) }),
        html: `<p class="lead">${T("lesson." + l.id + ".body")}</p>` +
          `<div class="source-note"><span class="pin">&#128204;</span> ${T("lesson.modalSource")}</div>` });
    }));
  }
  let quizIx = 0, quizScore = 0;
  function renderQuiz() {
    const items = T("quiz.items"), total = window.FAHAMI_QUIZ.length, q = items[quizIx];
    if (!q) {
      const win = quizScore >= 4;
      if (win) earn("quizwhiz");
      $("#quizProgress").textContent = T("quiz.done");
      $("#quizBody").innerHTML =
        `<div class="insight ${win ? "ok" : ""}"><div class="h"><span>${win ? "&#127942;" : "&#128170;"}</span> ${T("quiz.scored", { s: quizScore, t: total })}</div>` +
        `<p>${win ? T("quiz.winMsg") : T("quiz.loseMsg")}</p></div>` +
        `<div class="btn-row"><button class="btn btn-primary" id="quizAgain"><span>&#128260;</span> ${T("quiz.again")}</button></div>`;
      $("#quizAgain").addEventListener("click", () => { quizIx = 0; quizScore = 0; renderQuiz(); });
      if (win) confetti(120);
      return;
    }
    const ans = window.FAHAMI_QUIZ[quizIx].a;
    $("#quizProgress").textContent = T("quiz.qOf", { n: quizIx + 1, t: total, s: quizScore });
    $("#quizBody").innerHTML =
      `<h3 style="font-size:19px;font-weight:800;margin-bottom:16px">${q.q}</h3>` +
      q.opts.map((o, i) => `<button class="quiz-opt" data-i="${i}">${o}</button>`).join("");
    $$("#quizBody .quiz-opt").forEach((btn) => btn.addEventListener("click", () => {
      const i = +btn.dataset.i, correct = i === ans;
      $$("#quizBody .quiz-opt").forEach((b) => { b.disabled = true;
        if (+b.dataset.i === ans) b.classList.add("correct");
        else if (+b.dataset.i === i) b.classList.add("wrong"); });
      if (correct) { quizScore++; confetti(40); }
      const note = document.createElement("div"); note.className = "insight " + (correct ? "ok" : "alert");
      note.style.marginTop = "14px";
      note.innerHTML = `<div class="h"><span>${correct ? "&#9989;" : "&#128161;"}</span> ${correct ? T("quiz.correct") : T("quiz.wrong")}</div><p>${q.why}</p>`;
      $("#quizBody").appendChild(note);
      const next = document.createElement("div"); next.className = "btn-row";
      next.innerHTML = `<button class="btn btn-primary" id="quizNext">${quizIx + 1 < total ? T("quiz.next") : T("quiz.result")} <span>&rarr;</span></button>`;
      $("#quizBody").appendChild(next);
      $("#quizNext").addEventListener("click", () => { quizIx++; renderQuiz(); });
    }));
  }
  function renderBadges() {
    $("#badgeRow").innerHTML = window.FAHAMI_BADGES.map((b) =>
      `<span class="badge-chip ${earned.has(b.id) ? "earned" : ""}" title="${T("badge." + b.id + ".hint")}"><span class="m">${b.m}</span> ${T("badge." + b.id + ".name")}</span>`).join("");
  }
  SCREEN_RENDER.learn = function () { renderLessons(); if (quizIx === 0 && quizScore === 0) renderQuiz(); renderBadges(); };

  /* ======================================================================
     Magic Moment — guided flow from the landing page
     ====================================================================== */
  $("[data-magic]").addEventListener("click", () => {
    const h = window.FAHAMI_AI.headline();
    confetti(110);
    openModal({
      ic: "&#10024;", title: h.big, sub: T("magic.sub"),
      html:
        `<p class="lead" style="margin-top:4px">${h.sub}</p>` +
        `<div class="insight ok" style="margin:16px 0"><div class="h"><span>&#129302;</span> ${T("magic.readsH")}</div>` +
        `<p>${T("magic.readsBody")}</p></div>` +
        `<div class="btn-row" style="margin-top:8px">` +
        `<button class="btn btn-primary" data-magic-go><span>&#128200;</span> ${T("magic.start")}</button>` +
        `<button class="btn btn-ghost" data-go="glance" onclick="document.getElementById('modalBack').classList.remove('open')">${T("magic.justDash")}</button></div>`
    });
    $("[data-magic-go]").addEventListener("click", () => { closeModal(); runMagic(); });
  });
  function runMagic() {
    const steps = [
      () => { go("glance"); toast(T("magic.tSee")); },
      () => { go("explain"); selectTopic("gdp"); toast(T("magic.tUnderstand")); },
      () => { go("states"); toast(T("magic.tCompare")); },
      () => { go("me"); toast(T("magic.tPersonalise")); },
      () => { go("play"); toast(T("magic.tPlay")); },
      () => { go("madani"); toast(T("magic.tTrack")); confetti(90); }
    ];
    let k = 0;
    const run = () => { if (k >= steps.length) return; steps[k](); k++; setTimeout(run, 2100); };
    run();
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  function boot() {
    applyTheme(localStorage.getItem("fahami-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    $("#langSel").value = window.I18N.lang; applyLang();
    fillStateSelects();
    renderDataPill();

    window.FAHAMI_LIVE.refresh().then(() => {
      renderDataPill();
      const active = $(".screen.active").dataset.screen;
      if (SCREEN_RENDER[active]) SCREEN_RENDER[active]();
      refreshHero();
    }).catch(() => renderDataPill());
  }
  boot();
})();
