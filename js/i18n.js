/* ============================================================================
   FAHAMI — i18n.js
   Central four-language dictionary (English / Bahasa Melayu / Simplified
   Chinese / Tamil) plus a tiny runtime. Every user-facing string in FAHAMI is
   keyed here. The other scripts read strings through window.FAHAMI_T(key, vars).

   - Keys resolve on the active language; anything missing falls back to English,
     so proper nouns (FAHAMI, DOSM, MADANI, Gini, OPR, RM, Malaysia, state names)
     are simply left out of the non-English tables and stay as-is.
   - Strings interpolate {placeholder} tokens from the vars object.
   - Values may be strings or arrays (quiz options, suggestions); arrays are
     interpolated element-by-element.

   The Chinese and Tamil economic prose is a careful human-style translation of
   the English source; native review is welcome, since meaning matters more than
   machine literalness for teaching material.

   Creator: Tan Wei Siang. Fully owned by Tan Wei Siang.
   ============================================================================ */
(function () {
  "use strict";

  window.FAHAMI_I18N = {};

  /* --- runtime ----------------------------------------------------------- */
  let lang = localStorage.getItem("fahami-lang") || "en";
  const subs = [];

  function dig(obj, key) {
    return key.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  function raw(key) {
    const L = window.FAHAMI_I18N[lang];
    let v = L ? dig(L, key) : undefined;
    if (v === undefined) v = dig(window.FAHAMI_I18N.en, key);
    return v;
  }
  function fmt(str, vars) {
    if (typeof str !== "string" || !vars) return str;
    return str.replace(/\{(\w+)\}/g, (m, k) => (vars[k] == null ? m : vars[k]));
  }
  function T(key, vars) {
    const v = raw(key);
    if (Array.isArray(v)) return v.map((x) => fmt(x, vars));
    if (v === undefined) return key;
    return fmt(v, vars);
  }

  function applyStatic(root) {
    const r = root || document;
    r.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = T(el.getAttribute("data-i18n")); });
    r.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = T(el.getAttribute("data-i18n-html")); });
    r.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.setAttribute("placeholder", T(el.getAttribute("data-i18n-ph"))); });
  }

  window.FAHAMI_T = T;
  window.I18N = {
    get lang() { return lang; },
    set lang(v) { lang = v; localStorage.setItem("fahami-lang", lang); subs.forEach((f) => f(lang)); },
    t: T, fmt, applyStatic,
    onChange(fn) { subs.push(fn); }
  };
})();
/* ===================== ENGLISH (complete base) ===================== */
window.FAHAMI_I18N.en = {
  ui: { credit: "by Tan Wei Siang" },
  footer: { credit: "Created by Tan Wei Siang", owned: "Fully owned by Tan Wei Siang &middot; Data: DOSM Open Data" },
  nav: { glance: "Glance", explain: "Explainer", ask: "Ask", me: "My Economy", play: "Playground", states: "My State", madani: "MADANI", learn: "Learn" },
  pill: { live: "Live - DOSM", bundled: "Bundled figures", checking: "Checking data..." },
  hero: {
    badge: "Live from DOSM Open Data",
    mark: "FAHAMI &middot; Fahami Ekonomi Malaysia",
    big: "How is Malaysia's economy doing?",
    sub: "The official numbers, minus the jargon. FAHAMI turns Malaysia's real economic data into simple, visual answers you can actually feel.",
    tagline: "Malaysia's official economic data, explained simply and visually.",
    magic: "Show me the magic", explore: "Explore the dashboard"
  },
  glance: { eyebrow: "See it", title: "Economy at a glance", desc: "The pulse of Malaysia in six numbers. Tap any card to have FAHAMI explain it in plain English." },
  explain: {
    eyebrow: "Understand it", title: "AI economic explainer",
    desc: "Pick a topic. FAHAMI builds a plain-English explanation from the latest official figures - what it means, what it doesn't, and why you should care.",
    byline: "FAHAMI explanation, built from official DOSM figures",
    theNumber: "The number", plainEnglish: "In plain English", notMeanH: "What it does NOT mean", careH: "Why you should care"
  },
  ask: {
    eyebrow: "Ask it", title: "Ask FAHAMI", desc: "Type a question the way you'd say it out loud. Every answer is grounded in DOSM figures.",
    byline: "On-device answers, built from official DOSM data - no numbers are made up.",
    placeholder: "e.g. why is everything so expensive?", send: "Ask",
    greeting: "Hi! I'm FAHAMI. Ask me anything about Malaysia's economy - I answer using the latest official DOSM figures. Try a suggestion below.",
    footer: "Built from official DOSM figures &middot; on-device"
  },
  me: {
    eyebrow: "Make it personal", title: "My economy",
    desc: "Tell FAHAMI a little about you. It stays in your browser - nothing is sent anywhere - and FAHAMI shows where you sit in Malaysia's economy.",
    incomeLabel: "Monthly household income", stateLabel: "Your state", lifeLabel: "What best describes you?", build: "Build my snapshot",
    life: { student: "Student", working: "Working", family: "Family", business: "Business", retired: "Retired", other: "Other" }
  },
  play: {
    eyebrow: "Play with it", title: "Economy playground",
    desc: "You're in charge. Move the levers and watch FAHAMI trace the chain reaction through the economy - the way economists think about cause and effect.",
    leversH: "The levers", leversSub: "Drag to change a policy or shock. Everything below updates live.",
    oprName: "Interest rate (OPR)", oprL: "1% (cheap loans)", oprR: "6% (expensive loans)",
    infName: "Inflation shock", infL: "-3% (falling prices)", infR: "+8% (surging prices)",
    govName: "Government spending", govL: "-20% (austerity)", govR: "+20% (stimulus)",
    chainH: "The chain reaction", chainSub: "Tap a step to see why. This is a simplified teaching model, not a forecast."
  },
  states: {
    eyebrow: "Compare it", title: "Malaysia vs your state",
    desc: "Household incomes vary a lot across the country. See how your state compares with the national picture.", choose: "Choose a state"
  },
  madani: {
    eyebrow: "Track it", title: "Ekonomi MADANI tracker",
    desc: "Malaysia's economic framework sets targets for growth, jobs, prices and incomes. Here's how the live numbers stack up against them.",
    disclaimer: "Targets are illustrative reference points for education. Progress reflects the latest available DOSM figures against those benchmarks.",
    live: "Live", reference: "Reference", ontrack: "On track", target: "target"
  },
  learn: {
    eyebrow: "Learn it", title: "Learn economics", desc: "Bite-sized lessons in plain language. Read a few, then test yourself and collect badges.",
    lessonsH: "Quick lessons", lessonsSub: "Tap a card to read. Finish one to earn the Scholar badge.",
    quizH: "Test yourself", quizSub: "5 quick questions.", badgesH: "Your badges", badgesSub: "Earn these as you explore FAHAMI."
  },
  word: {
    grew: "grew", shrank: "shrank", surplus: "surplus", deficit: "deficit",
    tradePos: "Selling more than we buy brings money into the country.",
    tradeNeg: "Buying more than we sell sends money out.",
    feelHealthy: "healthy", feelModerate: "moderate", feelHigh: "high"
  },
  mood: { solid: "growing solidly", steady: "growing steadily", slow: "growing slowly", contracting: "contracting" },
  g: {
    live: "live", bundled: "bundled",
    explainThis: "Explain this",
    source: "Source: DOSM Open Data &middot; {src} &middot; {q} GDP, {m} CPI, {lm} labour",
    unitYoY: "% YoY", unitPct: "%", unitMo: "/mo", unitM: "M",
    gdp: { k: "GDP growth", up: "Growing", down: "Contracting" },
    inflation: { k: "Inflation", contained: "Contained", elevated: "Elevated" },
    unemployment: { k: "Unemployment", nearfull: "Near full", rising: "Rising" },
    income: { k: "Median income", tl: "Household" },
    trade: { k: "Trade balance", surplus: "Surplus", deficit: "Deficit" },
    population: { k: "Population", tl: "People", modalTitle: "Malaysia's population", million: "million",
      modalBody: "Estimated total population in {year}. A bigger population means a bigger workforce and a bigger domestic market." }
  },
  topic: { gdp: "GDP growth", inflation: "Inflation", unemployment: "Jobs", income: "Income", trade: "Trade" },
  sector: { p1: "Agriculture", p2: "Mining", p3: "Manufacturing", p4: "Construction", p5: "Services", p6: "Import duties" },
  explainers: {
    gdp: {
      title: "What does '{gp} GDP growth' actually mean?",
      source: "DOSM Open Data - Quarterly Real GDP",
      dataLine: "{q}: {gp} year-on-year ({gq} vs last quarter)",
      body: "GDP is the total value of everything Malaysia produces. Growth of <b>{gp}</b> means the country made about {gp} more goods and services than the same quarter a year ago. <b>{top}</b> is the biggest engine of the economy and it {topDir} {tgp}. In everyday terms: more activity usually means more jobs, more business, and more income flowing around.",
      notMean: "It does NOT mean prices went up by that much, and it does NOT mean everyone's salary rose 6%. GDP is about output, not your payslip.",
      care: "When the economy grows, it is generally easier to find work and for businesses to hire and invest."
    },
    inflation: {
      title: "Why does everything feel more expensive? (Inflation)",
      source: "DOSM Open Data - Consumer Price Index",
      dataLine: "{m}: inflation {ip} YoY - CPI index {idx}",
      body: "Inflation of <b>{ip}</b> means prices across a typical shopping basket are about {ir}% higher than a year ago. That's considered <b>{feel}</b>. So something that cost {rm100} last year now costs roughly <b>{rmNow}</b>. Core inflation (stripping out volatile food and fuel) is {cp}.",
      notMean: "It does NOT mean prices doubled, and it does NOT mean every single item rose the same amount - transport and food often move very differently.",
      care: "Inflation quietly reduces what your money buys. If your income rises slower than this, you can afford a little less over time."
    },
    unemployment: {
      title: "Is it easy to find a job right now? (Unemployment)",
      source: "DOSM Open Data - Labour Force Survey",
      dataLine: "{m}: unemployment {u}% - participation {p}%",
      body: "An unemployment rate of <b>{u}%</b> means about {u} out of every 100 people who want a job are still looking. That's <b>{feel}</b> - anything around 3% is treated as \"full employment\", because some people are always between jobs. About <b>{emp} million</b> Malaysians are employed.",
      notMean: "It does NOT count people who aren't looking for work (students, retirees, carers). It's the share of the labour force, not the whole population.",
      care: "A low rate means employers are hiring and workers have more bargaining power for pay and conditions."
    },
    income: {
      title: "What does a 'typical' Malaysian household earn?",
      source: "DOSM Open Data - Household Income Survey",
      dataLine: "Median household income {med}/month - mean {mean}",
      body: "The <b>median</b> household income is <b>{med}</b> a month - half of households earn more, half earn less. The <b>mean</b> ({mean}) is higher because a smaller number of very high earners pull the average up. The gap between them is one reason economists watch the Gini coefficient (currently {gini}).",
      notMean: "The mean is NOT the 'typical' household - the median is the better everyday benchmark.",
      care: "Comparing your own household to the median tells you where you sit, and how fast incomes need to grow to keep up with prices."
    },
    trade: {
      title: "Does Malaysia sell more than it buys? (Trade)",
      source: "DOSM Open Data - External Trade",
      dataLine: "{m}: exports {ex}m vs imports {im}m",
      body: "Malaysia is a big trading nation. In {m} it exported about <b>{ex} million</b> and imported <b>{im} million</b> - a trade <b>{balWord}</b> of {absBal} million. {balSentence}",
      notMean: "A surplus is NOT automatically 'good' and a deficit NOT automatically 'bad' - it depends on what's being traded and why.",
      care: "Trade drives a large share of Malaysian jobs, especially in manufacturing and electronics."
    }
  },
  headline: { big: "Malaysia's economy grew {gp}", sub: "Real GDP, {q}, year-on-year. The economy is {mood}." },
  askr: {
    helpDefault: "Ask me anything about Malaysia's economy - try 'why is everything so expensive?'",
    helpFallback: "I answer with official DOSM figures. I can explain <b>GDP</b>, <b>inflation</b>, <b>jobs</b>, <b>income</b> or <b>trade</b> - or check what an amount of ringgit is worth. Try one of the suggestions below.",
    ppIntent: "purchasing power", ppSource: "DOSM Open Data - Consumer Price Index", ppData: "Inflation {ip} ({m})",
    ppBody: "At today's inflation of <b>{ip}</b>, the buying power of <b>{amt}</b> shrinks to about <b>{eroded}</b> worth of goods a year from now. To keep pace, that money would need to grow {ip} just to stand still.",
    stIntent: "states", stSource: "DOSM Open Data - Household Income Survey", stData: "Highest median household income: {state} ({med})",
    stBody: "Household incomes vary a lot across Malaysia. {state} has the highest median at <b>{med}</b>/month, while the national median is <b>{natMed}</b>. Head to \"Malaysia vs Your State\" to compare your own state."
  },
  suggest: [
    { i: "gdp", label: "How is Malaysia's economy doing?" },
    { i: "inflation", label: "Why is everything so expensive?" },
    { i: "unemployment", label: "Is it easy to find a job now?" },
    { i: "ppower", label: "What is RM100 worth next year?" },
    { i: "states", label: "Which state earns the most?" },
    { i: "income", label: "What does a typical household earn?" }
  ],
  snap: {
    title: "Your economic snapshot", sub: "Based on what you told FAHAMI. Nothing here leaves your browser.",
    whereH: "Where you sit",
    whereBody: "Your household income of <b>{inc}</b> is <b>{where}</b> the national median of <b>{med}</b>{stateClause}.",
    stateClause: " and <b>{pct}</b> versus {state}'s median ({smed})",
    where: { comfAbove: "comfortably above", above: "above", littleBelow: "a little below", below: "below" },
    addH: "Add your income", addBody: "Enter a monthly household income above to see where you sit against the national median of <b>{med}</b>.",
    dimName: "You vs national median", dimHint: "100% = exactly the national median. Half-width bar = at the median.",
    taxH: "The inflation tax on you",
    taxBody: "At today's inflation of <b>+{infl}%</b>, your income needs to rise about <b>{raise}/month</b> just to keep the same buying power next year. A raise smaller than that is really a pay cut in disguise.",
    source: "DOSM Open Data &middot; median income, {m} CPI",
    playBtn: "See what moves these numbers", cmpBtn: "Compare my state"
  },
  tip: {
    student: { h: "As a student", body: "Inflation at +{infl}% hits everyday spending like food and transport hardest. Skills that lift your future income above the {med} median are the best hedge." },
    working: { h: "As a worker", body: "With unemployment at just {u}%, the job market favours workers right now - a good moment to negotiate pay that beats +{infl}% inflation." },
    family: { h: "For your family", body: "Household budgets feel inflation most through food and housing. Tracking these against the {med} median helps you plan." },
    business: { h: "For your business", body: "GDP growth of +{g}% means demand is expanding, but wage pressure is real with unemployment at {u}%." },
    retired: { h: "In retirement", body: "Fixed incomes are most exposed to inflation. At +{infl}%, savings lose buying power each year unless they grow at least that fast." },
    other: { h: "For you", body: "Whatever your situation, the same forces apply: growth (+{g}%), prices (+{infl}%) and jobs ({u}%)." }
  },
  chain: {
    dirUp: "rises", dirDown: "falls", dirFlat: "holds steady",
    n0T: "You set the levers", n0B: "OPR {o}%, inflation shock {i}%, government spending {g}%.",
    borrowCheapT: "Borrowing gets cheaper", borrowPricyT: "Borrowing gets pricier",
    borrowCheapB: "A {o}% policy rate means loans, mortgages and business credit are more affordable, so people and firms spend more.",
    borrowPricyB: "A {o}% policy rate means loans, mortgages and business credit are more expensive, so spending cools.",
    demandT: "Demand {x}", demandB: "Combining cheaper/dearer money, government spending and the price shock, overall demand in the economy {dir}.",
    gdpT: "GDP growth {x}", gdpB: "More spending pushes businesses to produce more, so growth tends to move to roughly <b>{val}%</b> in this scenario.",
    jobsT: "Jobs {x}", jobsB: "As firms produce more they hire more, nudging unemployment {ud} from today's {u}%.",
    jobDown: "down", jobUp: "up", jobFlat: "sideways",
    priceClimbT: "Prices climb faster", priceStayT: "Prices stay contained",
    priceB: "Strong demand plus the shock puts inflation near <b>{val}%</b>. This is the trade-off: heat the economy too much and prices rise."
  },
  cmp: {
    malaysia: "Malaysia", medianCaption: "median household / month", gapH: "The gap",
    gapBody: "{state}'s median household earns <b>{diff}</b> {moreless} the national median. {tail}",
    moreThan: "more than", lessThan: "less than",
    tailHigh: "It's one of the higher-income parts of Malaysia.", tailLow: "Incomes here sit below the national middle.",
    mMedian: "Median income", mMean: "Mean income", mGini: "Income inequality (Gini)", mPoverty: "Poverty rate",
    source: "DOSM Open Data - Household Income Survey"
  },
  madaniItem: {
    gdp: { name: "Grow the economy", metric: "Real GDP growth", note: "MADANI targets solid, broad-based growth. Live GDP growth is shown against the mid-point of the 4.5-5.5% aspiration." },
    labour: { name: "Jobs for everyone", metric: "Unemployment rate", note: "A lower unemployment rate is better. Full employment is around 3%." },
    inflation: { name: "Keep prices stable", metric: "Inflation (CPI YoY)", note: "Prices should rise slowly and predictably. Bank Negara comfort zone is roughly 2-3%." },
    income: { name: "Raise incomes", metric: "Median household income", note: "MADANI aims to lift wages so a typical household earns more each year." },
    labourforce: { name: "Bring people into work", metric: "Participation rate", note: "More adults working or looking for work means a bigger, more productive economy." }
  },
  lvl: { Basics: "Basics", Everyday: "Everyday", Deeper: "Deeper" },
  lesson: {
    modalSub: "{lvl} &middot; Learn", modalSource: "Concept explained with DOSM context",
    gdp: { t: "What is GDP?", d: "The total value of everything Malaysia makes in a year.",
      body: "GDP (Gross Domestic Product) adds up the value of all goods and services the country produces. When GDP <b>grows</b>, the economy is making more than before. Think of it as the country's total 'income' for the year. Malaysia's GDP is measured every quarter by DOSM." },
    inflation: { t: "What is inflation?", d: "Why the same RM buys a little less each year.",
      body: "Inflation is the rate at which prices rise. If inflation is 2%, something that cost RM100 last year now costs about RM102. A little inflation is normal and healthy; too much hurts your purchasing power. DOSM tracks it with the Consumer Price Index (CPI)." },
    cpi: { t: "How the CPI works", d: "A 'shopping basket' that measures the cost of living.",
      body: "The CPI follows the price of a fixed basket of things households actually buy - food, transport, housing, and more. Each group has a weight based on how much people spend on it. Food and housing move the index the most because we spend the most there." },
    unemployment: { t: "Unemployment rate", d: "The share of people who want a job but can't find one.",
      body: "The unemployment rate is the number of people actively looking for work, divided by the total labour force. Around 3% is considered 'full employment' - there will always be some people between jobs. It does not count people who aren't looking for work." },
    purchasingpower: { t: "Purchasing power", d: "What your money can actually buy over time.",
      body: "Purchasing power is the real value of your money. Even if your salary stays the same, inflation quietly shrinks what it can buy. That's why a raise that matches inflation keeps you standing still - to get ahead, income must grow faster than prices." },
    gini: { t: "The Gini coefficient", d: "One number for how evenly income is shared.",
      body: "The Gini coefficient runs from 0 (everyone earns the same) to 1 (one person earns everything). Malaysia's is around 0.40. Lower is more equal. It helps compare fairness across states and over time, alongside median income." }
  },
  quiz: {
    qOf: "Question {n} of {t} &middot; score {s}", done: "Done!", scored: "You scored {s}/{t}",
    winMsg: "Excellent - you really understand the basics of Malaysia's economy!", loseMsg: "Nice try! Read a couple of lessons above and go again.",
    again: "Play again", next: "Next question", result: "See result", correct: "Correct!", wrong: "Not quite",
    items: [
      { q: "If inflation is 2% this year, RM100 of goods will cost roughly...", opts: ["RM98 next year", "RM102 next year", "RM120 next year", "The same, RM100"], why: "2% inflation means prices rise about 2%, so RM100 becomes about RM102." },
      { q: "When GDP 'grows', it means the country...", opts: ["Printed more money", "Produced more goods and services", "Raised taxes", "Borrowed more"], why: "GDP growth measures a rise in the value of what the economy produces." },
      { q: "Which spending group usually has the biggest weight in Malaysia's CPI?", opts: ["Alcohol & tobacco", "Recreation", "Food & housing", "Communication"], why: "Households spend the most on food and housing, so they move the CPI most." },
      { q: "An unemployment rate near 3% is generally considered...", opts: ["A crisis", "Roughly full employment", "Impossible", "Deflation"], why: "Around 3% is treated as full employment - some job-switching is always normal." },
      { q: "A Gini coefficient closer to 0 means income is...", opts: ["More unequal", "More equally shared", "Growing faster", "Falling"], why: "Gini of 0 is perfect equality; closer to 1 is more unequal." }
    ]
  },
  badge: {
    unlocked: "Badge unlocked: {name}",
    explorer: { name: "Explorer", hint: "Open the Explainer" },
    curious: { name: "Curious Mind", hint: "Ask FAHAMI a question" },
    personal: { name: "It's Personal", hint: "Build your snapshot" },
    player: { name: "Playground Pro", hint: "Move a Playground slider" },
    scholar: { name: "Scholar", hint: "Finish a lesson" },
    quizwhiz: { name: "Quiz Whiz", hint: "Score 4/5 on a quiz" }
  },
  data: {
    liveTitle: "Live from DOSM", bundledTitle: "Using bundled figures", sub: "Data Source & Trust",
    lead: "FAHAMI reads Malaysia's official statistics directly from <b>DOSM Open Data</b> (Department of Statistics Malaysia).",
    liveH: "Live connection active", liveBody: "Pulled: <b>{got}</b>.<br>As of: {asOf}.<br>Checked {time}.",
    coreIndicators: "core indicators",
    bundledH: "Showing last-known figures",
    bundledBody: "The live API couldn't be reached{err}, so FAHAMI is showing bundled official figures. Run the app through <b>serve.cmd</b> (not by double-clicking the HTML file) and check your connection to go live.",
    note: "Every figure FAHAMI states is traceable to an official DOSM statistic. Explanations are generated on your device - there is no external AI model and nothing you enter is sent anywhere."
  },
  magic: {
    sub: "The Magic Moment &middot; DOSM live", readsH: "FAHAMI reads that headline for you",
    readsBody: "Watch what happens next: FAHAMI takes one official number and walks you from \"what does this mean?\" all the way to \"what does it mean <b>for me</b>?\" - in a few taps.",
    start: "Start the tour", justDash: "Just show the dashboard",
    tSee: "SEE - the economy at a glance", tUnderstand: "UNDERSTAND - what 6% growth means",
    tCompare: "COMPARE - how your state stacks up", tPersonalise: "PERSONALISE - make it about you",
    tPlay: "PLAY - move the levers", tTrack: "TRACK - Malaysia's MADANI targets"
  }
};
/* ===================== BAHASA MELAYU ===================== */
window.FAHAMI_I18N.ms = {
  ui: { credit: "oleh Tan Wei Siang" },
  footer: { credit: "Dihasilkan oleh Tan Wei Siang", owned: "Dimiliki sepenuhnya oleh Tan Wei Siang &middot; Data: DOSM Open Data" },
  nav: { glance: "Sekilas", explain: "Penjelas", ask: "Tanya", me: "Ekonomi Saya", play: "Padang", states: "Negeri Saya", madani: "MADANI", learn: "Belajar" },
  pill: { live: "Langsung - DOSM", bundled: "Angka simpanan", checking: "Menyemak data..." },
  hero: {
    badge: "Langsung dari DOSM Open Data",
    big: "Bagaimana keadaan ekonomi Malaysia?",
    sub: "Angka rasmi, tanpa jargon. FAHAMI mengubah data ekonomi sebenar Malaysia menjadi jawapan mudah dan visual yang boleh anda rasai.",
    tagline: "Data ekonomi rasmi Malaysia, dijelaskan dengan mudah dan visual.",
    magic: "Tunjukkan keajaiban", explore: "Terokai papan pemuka"
  },
  glance: { eyebrow: "Lihat", title: "Ekonomi sekilas pandang", desc: "Nadi Malaysia dalam enam angka. Ketik mana-mana kad untuk FAHAMI menerangkannya dengan mudah." },
  explain: {
    eyebrow: "Fahami", title: "Penjelas ekonomi AI",
    desc: "Pilih satu topik. FAHAMI membina penjelasan mudah daripada angka rasmi terkini - apa maksudnya, apa yang bukan, dan mengapa ia penting.",
    byline: "Penjelasan FAHAMI, dibina daripada angka rasmi DOSM",
    theNumber: "Angkanya", plainEnglish: "Dalam bahasa mudah", notMeanH: "Apa yang ia BUKAN maksudkan", careH: "Mengapa ia penting untuk anda"
  },
  ask: {
    eyebrow: "Tanya", title: "Tanya FAHAMI", desc: "Taip soalan seperti anda menyebutnya. Setiap jawapan berasaskan angka DOSM.",
    byline: "Jawapan pada peranti, dibina daripada data rasmi DOSM - tiada angka direka.",
    placeholder: "cth. kenapa segalanya mahal?", send: "Tanya",
    greeting: "Hai! Saya FAHAMI. Tanya saya apa sahaja tentang ekonomi Malaysia - saya menjawab menggunakan angka rasmi DOSM terkini. Cuba cadangan di bawah.",
    footer: "Dibina daripada angka rasmi DOSM &middot; pada peranti"
  },
  me: {
    eyebrow: "Jadikan peribadi", title: "Ekonomi saya",
    desc: "Beritahu FAHAMI sedikit tentang anda. Ia kekal dalam pelayar anda - tiada apa dihantar ke mana-mana - dan FAHAMI menunjukkan kedudukan anda dalam ekonomi Malaysia.",
    incomeLabel: "Pendapatan isi rumah bulanan", stateLabel: "Negeri anda", lifeLabel: "Apa yang paling menggambarkan anda?", build: "Bina gambaran saya",
    life: { student: "Pelajar", working: "Bekerja", family: "Keluarga", business: "Perniagaan", retired: "Bersara", other: "Lain-lain" }
  },
  play: {
    eyebrow: "Main dengannya", title: "Padang ekonomi",
    desc: "Anda yang mengawal. Gerakkan tuas dan lihat FAHAMI menjejak tindak balas berantai dalam ekonomi - cara ahli ekonomi berfikir tentang sebab dan kesan.",
    leversH: "Tuas kawalan", leversSub: "Seret untuk mengubah dasar atau kejutan. Semua di bawah dikemas kini secara langsung.",
    oprName: "Kadar faedah (OPR)", oprL: "1% (pinjaman murah)", oprR: "6% (pinjaman mahal)",
    infName: "Kejutan inflasi", infL: "-3% (harga jatuh)", infR: "+8% (harga melambung)",
    govName: "Perbelanjaan kerajaan", govL: "-20% (penjimatan)", govR: "+20% (rangsangan)",
    chainH: "Tindak balas berantai", chainSub: "Ketik satu langkah untuk lihat sebabnya. Ini model pengajaran ringkas, bukan ramalan."
  },
  states: {
    eyebrow: "Banding", title: "Malaysia vs negeri anda",
    desc: "Pendapatan isi rumah berbeza banyak di seluruh negara. Lihat bagaimana negeri anda berbanding gambaran negara.", choose: "Pilih satu negeri"
  },
  madani: {
    eyebrow: "Jejak", title: "Penjejak Ekonomi MADANI",
    desc: "Rangka kerja ekonomi Malaysia menetapkan sasaran untuk pertumbuhan, pekerjaan, harga dan pendapatan. Inilah kedudukan angka langsung berbanding sasaran itu.",
    disclaimer: "Sasaran ialah titik rujukan ilustrasi untuk tujuan pendidikan. Kemajuan mencerminkan angka DOSM terkini berbanding penanda aras tersebut.",
    live: "Langsung", reference: "Rujukan", ontrack: "Di landasan", target: "sasaran"
  },
  learn: {
    eyebrow: "Belajar", title: "Belajar ekonomi", desc: "Pelajaran ringkas dalam bahasa mudah. Baca beberapa, kemudian uji diri dan kumpul lencana.",
    lessonsH: "Pelajaran pantas", lessonsSub: "Ketik kad untuk membaca. Selesaikan satu untuk memperoleh lencana Sarjana.",
    quizH: "Uji diri anda", quizSub: "5 soalan pantas.", badgesH: "Lencana anda", badgesSub: "Peroleh lencana ini sambil anda meneroka FAHAMI."
  },
  word: {
    grew: "berkembang", shrank: "menyusut", surplus: "lebihan", deficit: "defisit",
    tradePos: "Menjual lebih daripada yang kita beli membawa wang masuk ke negara.",
    tradeNeg: "Membeli lebih daripada yang kita jual menghantar wang keluar.",
    feelHealthy: "sihat", feelModerate: "sederhana", feelHigh: "tinggi"
  },
  mood: { solid: "berkembang kukuh", steady: "berkembang stabil", slow: "berkembang perlahan", contracting: "menguncup" },
  g: {
    live: "langsung", bundled: "simpanan", explainThis: "Terangkan ini",
    source: "Sumber: DOSM Open Data &middot; {src} &middot; KDNK {q}, IHP {m}, buruh {lm}",
    unitYoY: "% TdT", unitPct: "%", unitMo: "/bln", unitM: "J",
    gdp: { k: "Pertumbuhan KDNK", up: "Berkembang", down: "Menguncup" },
    inflation: { k: "Inflasi", contained: "Terkawal", elevated: "Meningkat" },
    unemployment: { k: "Pengangguran", nearfull: "Hampir penuh", rising: "Meningkat" },
    income: { k: "Pendapatan median", tl: "Isi rumah" },
    trade: { k: "Imbangan dagangan", surplus: "Lebihan", deficit: "Defisit" },
    population: { k: "Penduduk", tl: "Orang", modalTitle: "Penduduk Malaysia", million: "juta",
      modalBody: "Anggaran jumlah penduduk pada {year}. Penduduk lebih besar bermakna tenaga kerja lebih besar dan pasaran domestik lebih besar." }
  },
  topic: { gdp: "Pertumbuhan KDNK", inflation: "Inflasi", unemployment: "Pekerjaan", income: "Pendapatan", trade: "Dagangan" },
  sector: { p1: "Pertanian", p2: "Perlombongan", p3: "Pembuatan", p4: "Pembinaan", p5: "Perkhidmatan", p6: "Duti import" },
  explainers: {
    gdp: {
      title: "Apa sebenarnya maksud 'pertumbuhan KDNK {gp}'?",
      source: "DOSM Open Data - KDNK Benar Suku Tahunan",
      dataLine: "{q}: {gp} tahun ke tahun ({gq} berbanding suku lalu)",
      body: "KDNK ialah jumlah nilai segala yang dihasilkan Malaysia. Pertumbuhan <b>{gp}</b> bermakna negara menghasilkan kira-kira {gp} lebih banyak barangan dan perkhidmatan berbanding suku yang sama setahun lalu. <b>{top}</b> ialah enjin terbesar ekonomi dan ia {topDir} {tgp}. Dalam erti kata harian: lebih banyak aktiviti biasanya bermakna lebih banyak pekerjaan, perniagaan dan pendapatan yang mengalir.",
      notMean: "Ia BUKAN bermakna harga naik sebanyak itu, dan BUKAN bermakna gaji semua orang naik 6%. KDNK adalah tentang pengeluaran, bukan slip gaji anda.",
      care: "Apabila ekonomi berkembang, biasanya lebih mudah mencari kerja dan bagi perniagaan untuk mengambil pekerja serta melabur."
    },
    inflation: {
      title: "Mengapa segalanya terasa lebih mahal? (Inflasi)",
      source: "DOSM Open Data - Indeks Harga Pengguna",
      dataLine: "{m}: inflasi {ip} TdT - indeks IHP {idx}",
      body: "Inflasi <b>{ip}</b> bermakna harga bagi bakul beli-belah biasa adalah kira-kira {ir}% lebih tinggi berbanding setahun lalu. Ini dianggap <b>{feel}</b>. Jadi sesuatu yang berharga {rm100} tahun lalu kini berharga kira-kira <b>{rmNow}</b>. Inflasi teras (tanpa makanan dan bahan api yang tidak menentu) ialah {cp}.",
      notMean: "Ia BUKAN bermakna harga berganda, dan BUKAN bermakna setiap item naik jumlah yang sama - pengangkutan dan makanan sering bergerak sangat berbeza.",
      care: "Inflasi secara senyap mengurangkan apa yang wang anda boleh beli. Jika pendapatan anda naik lebih perlahan daripada ini, anda mampu membeli sedikit kurang lama-kelamaan."
    },
    unemployment: {
      title: "Adakah mudah mencari kerja sekarang? (Pengangguran)",
      source: "DOSM Open Data - Survei Tenaga Buruh",
      dataLine: "{m}: pengangguran {u}% - penyertaan {p}%",
      body: "Kadar pengangguran <b>{u}%</b> bermakna kira-kira {u} daripada setiap 100 orang yang mahukan kerja masih mencari. Ini <b>{feel}</b> - sebarang angka sekitar 3% dianggap \"guna tenaga penuh\", kerana ada sahaja orang yang bertukar kerja. Kira-kira <b>{emp} juta</b> rakyat Malaysia bekerja.",
      notMean: "Ia TIDAK mengira orang yang tidak mencari kerja (pelajar, pesara, penjaga). Ia peratusan tenaga buruh, bukan seluruh penduduk.",
      care: "Kadar rendah bermakna majikan sedang mengambil pekerja dan pekerja mempunyai lebih kuasa tawar-menawar untuk gaji dan syarat."
    },
    income: {
      title: "Berapa pendapatan isi rumah Malaysia yang 'tipikal'?",
      source: "DOSM Open Data - Survei Pendapatan Isi Rumah",
      dataLine: "Pendapatan median isi rumah {med}/bulan - purata {mean}",
      body: "Pendapatan isi rumah <b>median</b> ialah <b>{med}</b> sebulan - separuh isi rumah memperoleh lebih, separuh kurang. <b>Purata</b> ({mean}) lebih tinggi kerana sebilangan kecil yang berpendapatan sangat tinggi menarik purata ke atas. Jurang antara keduanya ialah satu sebab ahli ekonomi memerhatikan pekali Gini (kini {gini}).",
      notMean: "Purata BUKAN isi rumah 'tipikal' - median ialah penanda aras harian yang lebih baik.",
      care: "Membandingkan isi rumah anda dengan median memberitahu kedudukan anda, dan berapa cepat pendapatan perlu berkembang untuk mengikut harga."
    },
    trade: {
      title: "Adakah Malaysia menjual lebih daripada yang dibeli? (Dagangan)",
      source: "DOSM Open Data - Dagangan Luar",
      dataLine: "{m}: eksport {ex}j vs import {im}j",
      body: "Malaysia ialah negara berdagang besar. Pada {m} ia mengeksport kira-kira <b>{ex} juta</b> dan mengimport <b>{im} juta</b> - satu <b>{balWord}</b> dagangan sebanyak {absBal} juta. {balSentence}",
      notMean: "Lebihan BUKAN secara automatik 'baik' dan defisit BUKAN secara automatik 'buruk' - ia bergantung pada apa yang didagangkan dan mengapa.",
      care: "Dagangan menggerakkan sebahagian besar pekerjaan di Malaysia, terutama dalam pembuatan dan elektronik."
    }
  },
  headline: { big: "Ekonomi Malaysia berkembang {gp}", sub: "KDNK benar, {q}, tahun ke tahun. Ekonomi sedang {mood}." },
  askr: {
    helpDefault: "Tanya saya apa sahaja tentang ekonomi Malaysia - cuba 'kenapa segalanya mahal?'",
    helpFallback: "Saya menjawab dengan angka rasmi DOSM. Saya boleh terangkan <b>KDNK</b>, <b>inflasi</b>, <b>pekerjaan</b>, <b>pendapatan</b> atau <b>dagangan</b> - atau semak nilai sesuatu jumlah ringgit. Cuba salah satu cadangan di bawah.",
    ppIntent: "kuasa beli", ppSource: "DOSM Open Data - Indeks Harga Pengguna", ppData: "Inflasi {ip} ({m})",
    ppBody: "Pada inflasi hari ini <b>{ip}</b>, kuasa beli <b>{amt}</b> menyusut kepada kira-kira <b>{eroded}</b> nilai barangan setahun dari sekarang. Untuk mengekalkan nilai, wang itu perlu berkembang {ip} sekadar untuk kekal sama.",
    stIntent: "negeri", stSource: "DOSM Open Data - Survei Pendapatan Isi Rumah", stData: "Pendapatan median isi rumah tertinggi: {state} ({med})",
    stBody: "Pendapatan isi rumah berbeza banyak di seluruh Malaysia. {state} mempunyai median tertinggi pada <b>{med}</b>/bulan, manakala median negara ialah <b>{natMed}</b>. Pergi ke \"Malaysia vs Negeri Anda\" untuk membandingkan negeri anda sendiri."
  },
  suggest: [
    { i: "gdp", label: "Bagaimana keadaan ekonomi Malaysia?" },
    { i: "inflation", label: "Kenapa segalanya begitu mahal?" },
    { i: "unemployment", label: "Adakah mudah mencari kerja sekarang?" },
    { i: "ppower", label: "Berapa nilai RM100 tahun depan?" },
    { i: "states", label: "Negeri mana berpendapatan tertinggi?" },
    { i: "income", label: "Berapa pendapatan isi rumah tipikal?" }
  ],
  snap: {
    title: "Gambaran ekonomi anda", sub: "Berdasarkan apa yang anda beritahu FAHAMI. Tiada apa di sini keluar dari pelayar anda.",
    whereH: "Kedudukan anda",
    whereBody: "Pendapatan isi rumah anda sebanyak <b>{inc}</b> adalah <b>{where}</b> median negara sebanyak <b>{med}</b>{stateClause}.",
    stateClause: " dan <b>{pct}</b> berbanding median {state} ({smed})",
    where: { comfAbove: "jauh melebihi", above: "melebihi", littleBelow: "sedikit di bawah", below: "di bawah" },
    addH: "Tambah pendapatan anda", addBody: "Masukkan pendapatan isi rumah bulanan di atas untuk melihat kedudukan anda berbanding median negara sebanyak <b>{med}</b>.",
    dimName: "Anda vs median negara", dimHint: "100% = tepat median negara. Bar separuh lebar = pada median.",
    taxH: "Cukai inflasi ke atas anda",
    taxBody: "Pada inflasi hari ini <b>+{infl}%</b>, pendapatan anda perlu naik kira-kira <b>{raise}/bulan</b> sekadar untuk mengekalkan kuasa beli yang sama tahun depan. Kenaikan lebih kecil daripada itu sebenarnya potongan gaji berselindung.",
    source: "DOSM Open Data &middot; pendapatan median, IHP {m}",
    playBtn: "Lihat apa yang menggerakkan angka ini", cmpBtn: "Bandingkan negeri saya"
  },
  tip: {
    student: { h: "Sebagai pelajar", body: "Inflasi pada +{infl}% memberi kesan paling teruk pada perbelanjaan harian seperti makanan dan pengangkutan. Kemahiran yang menaikkan pendapatan masa depan anda melebihi median {med} ialah perlindungan terbaik." },
    working: { h: "Sebagai pekerja", body: "Dengan pengangguran hanya {u}%, pasaran kerja memihak kepada pekerja sekarang - masa yang baik untuk merunding gaji yang mengatasi inflasi +{infl}%." },
    family: { h: "Untuk keluarga anda", body: "Bajet isi rumah paling terasa inflasi melalui makanan dan perumahan. Menjejaknya berbanding median {med} membantu anda merancang." },
    business: { h: "Untuk perniagaan anda", body: "Pertumbuhan KDNK +{g}% bermakna permintaan berkembang, tetapi tekanan gaji nyata dengan pengangguran pada {u}%." },
    retired: { h: "Semasa persaraan", body: "Pendapatan tetap paling terdedah kepada inflasi. Pada +{infl}%, simpanan hilang kuasa beli setiap tahun melainkan ia berkembang sekurang-kurangnya secepat itu." },
    other: { h: "Untuk anda", body: "Apa jua keadaan anda, daya yang sama terpakai: pertumbuhan (+{g}%), harga (+{infl}%) dan pekerjaan ({u}%)." }
  },
  chain: {
    dirUp: "naik", dirDown: "turun", dirFlat: "kekal stabil",
    n0T: "Anda tetapkan tuas", n0B: "OPR {o}%, kejutan inflasi {i}%, perbelanjaan kerajaan {g}%.",
    borrowCheapT: "Pinjaman jadi lebih murah", borrowPricyT: "Pinjaman jadi lebih mahal",
    borrowCheapB: "Kadar dasar {o}% bermakna pinjaman, gadai janji dan kredit perniagaan lebih mampu milik, jadi orang dan firma berbelanja lebih.",
    borrowPricyB: "Kadar dasar {o}% bermakna pinjaman, gadai janji dan kredit perniagaan lebih mahal, jadi perbelanjaan menyejuk.",
    demandT: "Permintaan {x}", demandB: "Menggabungkan wang murah/mahal, perbelanjaan kerajaan dan kejutan harga, permintaan keseluruhan dalam ekonomi {dir}.",
    gdpT: "Pertumbuhan KDNK {x}", gdpB: "Lebih banyak perbelanjaan mendorong perniagaan menghasilkan lebih, jadi pertumbuhan cenderung bergerak ke kira-kira <b>{val}%</b> dalam senario ini.",
    jobsT: "Pekerjaan {x}", jobsB: "Apabila firma menghasilkan lebih, mereka mengambil lebih ramai pekerja, menolak pengangguran {ud} daripada {u}% hari ini.",
    jobDown: "turun", jobUp: "naik", jobFlat: "mendatar",
    priceClimbT: "Harga naik lebih cepat", priceStayT: "Harga kekal terkawal",
    priceB: "Permintaan kuat ditambah kejutan menolak inflasi ke sekitar <b>{val}%</b>. Inilah tukar gantinya: panaskan ekonomi terlalu banyak dan harga naik."
  },
  cmp: {
    malaysia: "Malaysia", medianCaption: "median isi rumah / bulan", gapH: "Jurangnya",
    gapBody: "Isi rumah median {state} memperoleh <b>{diff}</b> {moreless} median negara. {tail}",
    moreThan: "lebih daripada", lessThan: "kurang daripada",
    tailHigh: "Ia salah satu bahagian berpendapatan tinggi di Malaysia.", tailLow: "Pendapatan di sini di bawah pertengahan negara.",
    mMedian: "Pendapatan median", mMean: "Pendapatan purata", mGini: "Ketidaksamaan pendapatan (Gini)", mPoverty: "Kadar kemiskinan",
    source: "DOSM Open Data - Survei Pendapatan Isi Rumah"
  },
  madaniItem: {
    gdp: { name: "Kembangkan ekonomi", metric: "Pertumbuhan KDNK benar", note: "MADANI menyasarkan pertumbuhan kukuh dan meluas. Pertumbuhan KDNK langsung ditunjukkan berbanding titik tengah aspirasi 4.5-5.5%." },
    labour: { name: "Pekerjaan untuk semua", metric: "Kadar pengangguran", note: "Kadar pengangguran yang lebih rendah adalah lebih baik. Guna tenaga penuh adalah sekitar 3%." },
    inflation: { name: "Kekalkan harga stabil", metric: "Inflasi (IHP TdT)", note: "Harga sepatutnya naik perlahan dan boleh diramal. Zon selesa Bank Negara sekitar 2-3%." },
    income: { name: "Naikkan pendapatan", metric: "Pendapatan median isi rumah", note: "MADANI berhasrat menaikkan gaji supaya isi rumah tipikal memperoleh lebih setiap tahun." },
    labourforce: { name: "Bawa rakyat bekerja", metric: "Kadar penyertaan", note: "Lebih ramai dewasa bekerja atau mencari kerja bermakna ekonomi lebih besar dan produktif." }
  },
  lvl: { Basics: "Asas", Everyday: "Harian", Deeper: "Lebih mendalam" },
  lesson: {
    modalSub: "{lvl} &middot; Belajar", modalSource: "Konsep dijelaskan dengan konteks DOSM",
    gdp: { t: "Apa itu KDNK?", d: "Jumlah nilai segala yang Malaysia hasilkan dalam setahun.",
      body: "KDNK (Keluaran Dalam Negara Kasar) menjumlahkan nilai semua barangan dan perkhidmatan yang dihasilkan negara. Apabila KDNK <b>berkembang</b>, ekonomi menghasilkan lebih daripada sebelumnya. Anggap ia sebagai jumlah 'pendapatan' negara untuk setahun. KDNK Malaysia diukur setiap suku tahun oleh DOSM." },
    inflation: { t: "Apa itu inflasi?", d: "Mengapa RM yang sama membeli sedikit kurang setiap tahun.",
      body: "Inflasi ialah kadar kenaikan harga. Jika inflasi 2%, sesuatu yang berharga RM100 tahun lalu kini berharga kira-kira RM102. Sedikit inflasi adalah normal dan sihat; terlalu banyak menjejaskan kuasa beli anda. DOSM menjejaknya dengan Indeks Harga Pengguna (IHP)." },
    cpi: { t: "Bagaimana IHP berfungsi", d: "Satu 'bakul beli-belah' yang mengukur kos sara hidup.",
      body: "IHP mengikut harga bakul tetap barang yang isi rumah benar-benar beli - makanan, pengangkutan, perumahan dan lain-lain. Setiap kumpulan mempunyai pemberat berdasarkan berapa banyak orang berbelanja untuknya. Makanan dan perumahan menggerakkan indeks paling banyak kerana kita berbelanja paling banyak di situ." },
    unemployment: { t: "Kadar pengangguran", d: "Peratusan orang yang mahukan kerja tetapi tidak menjumpainya.",
      body: "Kadar pengangguran ialah bilangan orang yang aktif mencari kerja, dibahagi dengan jumlah tenaga buruh. Sekitar 3% dianggap 'guna tenaga penuh' - akan sentiasa ada orang yang bertukar kerja. Ia tidak mengira orang yang tidak mencari kerja." },
    purchasingpower: { t: "Kuasa beli", d: "Apa yang wang anda benar-benar boleh beli dari masa ke masa.",
      body: "Kuasa beli ialah nilai sebenar wang anda. Walaupun gaji anda kekal sama, inflasi secara senyap mengecutkan apa yang ia boleh beli. Itulah sebabnya kenaikan yang setara dengan inflasi hanya membuatkan anda kekal di tempat - untuk maju ke hadapan, pendapatan mesti berkembang lebih cepat daripada harga." },
    gini: { t: "Pekali Gini", d: "Satu angka untuk seberapa sekata pendapatan dikongsi.",
      body: "Pekali Gini bermula dari 0 (semua orang memperoleh sama) hingga 1 (seorang memperoleh segalanya). Malaysia sekitar 0.40. Lebih rendah lebih sama rata. Ia membantu membandingkan keadilan antara negeri dan dari masa ke masa, bersama pendapatan median." }
  },
  quiz: {
    qOf: "Soalan {n} daripada {t} &middot; markah {s}", done: "Selesai!", scored: "Anda mendapat {s}/{t}",
    winMsg: "Cemerlang - anda benar-benar memahami asas ekonomi Malaysia!", loseMsg: "Cubaan yang baik! Baca beberapa pelajaran di atas dan cuba lagi.",
    again: "Main semula", next: "Soalan seterusnya", result: "Lihat keputusan", correct: "Betul!", wrong: "Belum tepat",
    items: [
      { q: "Jika inflasi 2% tahun ini, barangan RM100 akan berharga kira-kira...", opts: ["RM98 tahun depan", "RM102 tahun depan", "RM120 tahun depan", "Sama, RM100"], why: "Inflasi 2% bermakna harga naik kira-kira 2%, jadi RM100 menjadi kira-kira RM102." },
      { q: "Apabila KDNK 'berkembang', ia bermakna negara...", opts: ["Mencetak lebih banyak wang", "Menghasilkan lebih banyak barangan dan perkhidmatan", "Menaikkan cukai", "Meminjam lebih"], why: "Pertumbuhan KDNK mengukur kenaikan nilai apa yang dihasilkan ekonomi." },
      { q: "Kumpulan perbelanjaan mana biasanya mempunyai pemberat terbesar dalam IHP Malaysia?", opts: ["Alkohol & tembakau", "Rekreasi", "Makanan & perumahan", "Komunikasi"], why: "Isi rumah berbelanja paling banyak untuk makanan dan perumahan, jadi ia menggerakkan IHP paling banyak." },
      { q: "Kadar pengangguran hampir 3% biasanya dianggap...", opts: ["Krisis", "Lebih kurang guna tenaga penuh", "Mustahil", "Deflasi"], why: "Sekitar 3% dianggap guna tenaga penuh - sedikit pertukaran kerja sentiasa normal." },
      { q: "Pekali Gini lebih hampir kepada 0 bermakna pendapatan...", opts: ["Lebih tidak sama rata", "Lebih sama rata dikongsi", "Berkembang lebih cepat", "Menurun"], why: "Gini 0 ialah kesamaan sempurna; lebih hampir 1 lebih tidak sama rata." }
    ]
  },
  badge: {
    unlocked: "Lencana dibuka: {name}",
    explorer: { name: "Peneroka", hint: "Buka Penjelas" },
    curious: { name: "Minda Ingin Tahu", hint: "Tanya FAHAMI satu soalan" },
    personal: { name: "Ia Peribadi", hint: "Bina gambaran anda" },
    player: { name: "Pakar Padang", hint: "Gerakkan tuas Padang" },
    scholar: { name: "Sarjana", hint: "Selesaikan satu pelajaran" },
    quizwhiz: { name: "Juara Kuiz", hint: "Dapat 4/5 dalam kuiz" }
  },
  data: {
    liveTitle: "Langsung dari DOSM", bundledTitle: "Menggunakan angka simpanan", sub: "Sumber Data & Kepercayaan",
    lead: "FAHAMI membaca statistik rasmi Malaysia terus dari <b>DOSM Open Data</b> (Jabatan Perangkaan Malaysia).",
    liveH: "Sambungan langsung aktif", liveBody: "Diambil: <b>{got}</b>.<br>Setakat: {asOf}.<br>Disemak {time}.",
    coreIndicators: "penunjuk teras",
    bundledH: "Menunjukkan angka terakhir diketahui",
    bundledBody: "API langsung tidak dapat dicapai{err}, jadi FAHAMI menunjukkan angka rasmi simpanan. Jalankan aplikasi melalui <b>serve.cmd</b> (bukan dengan mengklik dua kali fail HTML) dan semak sambungan anda untuk pergi langsung.",
    note: "Setiap angka yang FAHAMI nyatakan boleh dijejak kepada statistik rasmi DOSM. Penjelasan dihasilkan pada peranti anda - tiada model AI luaran dan tiada apa yang anda masukkan dihantar ke mana-mana."
  },
  magic: {
    sub: "Detik Ajaib &middot; DOSM langsung", readsH: "FAHAMI membaca tajuk itu untuk anda",
    readsBody: "Lihat apa yang berlaku seterusnya: FAHAMI mengambil satu angka rasmi dan membawa anda dari \"apa maksudnya?\" hingga ke \"apa maksudnya <b>untuk saya</b>?\" - dalam beberapa ketik.",
    start: "Mulakan lawatan", justDash: "Tunjukkan papan pemuka sahaja",
    tSee: "LIHAT - ekonomi sekilas pandang", tUnderstand: "FAHAMI - maksud pertumbuhan 6%",
    tCompare: "BANDING - kedudukan negeri anda", tPersonalise: "PERIBADIKAN - jadikan tentang anda",
    tPlay: "MAIN - gerakkan tuas", tTrack: "JEJAK - sasaran MADANI Malaysia"
  }
};
/* ===================== 简体中文 (Simplified Chinese) ===================== */
window.FAHAMI_I18N.zh = {
  ui: { credit: "作者 Tan Wei Siang" },
  footer: { credit: "由 Tan Wei Siang 创建", owned: "完全归 Tan Wei Siang 所有 &middot; 数据：DOSM Open Data" },
  nav: { glance: "概览", explain: "讲解", ask: "提问", me: "我的经济", play: "模拟场", states: "我的州属", madani: "MADANI", learn: "学习" },
  pill: { live: "实时 - DOSM", bundled: "内置数据", checking: "正在检查数据..." },
  hero: {
    badge: "实时来自 DOSM Open Data",
    big: "马来西亚经济状况如何？",
    sub: "官方数字，去除术语。FAHAMI 把马来西亚真实的经济数据变成你能真切感受到的、简单而直观的答案。",
    tagline: "马来西亚官方经济数据，以简单直观的方式讲解。",
    magic: "让我看看奇迹", explore: "浏览仪表板"
  },
  glance: { eyebrow: "看一看", title: "经济一览", desc: "用六个数字把握马来西亚的脉搏。点按任意卡片，让 FAHAMI 用通俗语言为你讲解。" },
  explain: {
    eyebrow: "理解它", title: "AI 经济讲解员",
    desc: "选一个主题。FAHAMI 会根据最新官方数字生成通俗讲解——它意味着什么、不意味着什么，以及你为何该关心。",
    byline: "FAHAMI 讲解，基于 DOSM 官方数字生成",
    theNumber: "这个数字", plainEnglish: "用大白话说", notMeanH: "它并不意味着什么", careH: "你为何该关心"
  },
  ask: {
    eyebrow: "问一问", title: "问 FAHAMI", desc: "像平时说话那样输入问题。每个回答都以 DOSM 数字为依据。",
    byline: "本机回答，基于 DOSM 官方数据——数字绝不编造。",
    placeholder: "例如：为什么什么都这么贵？", send: "提问",
    greeting: "你好！我是 FAHAMI。关于马来西亚经济，尽管问我——我用最新的 DOSM 官方数字回答。试试下面的建议。",
    footer: "基于 DOSM 官方数字 &middot; 本机运算"
  },
  me: {
    eyebrow: "让它贴近你", title: "我的经济",
    desc: "把你的一点情况告诉 FAHAMI。它只留在你的浏览器里——不会发送到任何地方——FAHAMI 会显示你在马来西亚经济中的位置。",
    incomeLabel: "家庭月收入", stateLabel: "你的州属", lifeLabel: "哪一项最符合你？", build: "生成我的画像",
    life: { student: "学生", working: "在职", family: "家庭", business: "经商", retired: "退休", other: "其他" }
  },
  play: {
    eyebrow: "玩一玩", title: "经济模拟场",
    desc: "由你做主。移动这些控制杆，看 FAHAMI 如何追踪经济中的连锁反应——就像经济学家思考因果那样。",
    leversH: "控制杆", leversSub: "拖动以改变某项政策或冲击。下方内容会实时更新。",
    oprName: "利率（OPR）", oprL: "1%（贷款便宜）", oprR: "6%（贷款昂贵）",
    infName: "通胀冲击", infL: "-3%（物价下跌）", infR: "+8%（物价飙升）",
    govName: "政府开支", govL: "-20%（紧缩）", govR: "+20%（刺激）",
    chainH: "连锁反应", chainSub: "点按某一步查看原因。这是简化的教学模型，不是预测。"
  },
  states: {
    eyebrow: "比一比", title: "马来西亚 vs 你的州属",
    desc: "各地家庭收入差异很大。看看你的州属与全国情况相比如何。", choose: "选择一个州属"
  },
  madani: {
    eyebrow: "追踪它", title: "MADANI 经济追踪器",
    desc: "马来西亚的经济框架为增长、就业、物价和收入设定了目标。看看实时数字与这些目标相比如何。",
    disclaimer: "目标为教育用途的示意参考点。进度反映最新可得的 DOSM 数字与这些基准的对比。",
    live: "实时", reference: "参考", ontrack: "达标中", target: "目标"
  },
  learn: {
    eyebrow: "学一学", title: "学习经济学", desc: "用通俗语言写成的小课程。读几篇，再测测自己并收集徽章。",
    lessonsH: "快速课程", lessonsSub: "点按卡片阅读。读完一篇即可获得「学者」徽章。",
    quizH: "测测自己", quizSub: "5 道快速题目。", badgesH: "你的徽章", badgesSub: "在探索 FAHAMI 的过程中赢取这些徽章。"
  },
  word: {
    grew: "增长了", shrank: "萎缩了", surplus: "顺差", deficit: "逆差",
    tradePos: "卖得比买得多，会把钱带进国家。",
    tradeNeg: "买得比卖得多，会把钱送出国外。",
    feelHealthy: "健康", feelModerate: "适中", feelHigh: "偏高"
  },
  mood: { solid: "稳健增长", steady: "平稳增长", slow: "缓慢增长", contracting: "萎缩" },
  g: {
    live: "实时", bundled: "内置",
    explainThis: "讲解一下",
    source: "来源：DOSM Open Data &middot; {src} &middot; {q} GDP、{m} CPI、{lm} 劳动力",
    unitYoY: "% 同比", unitPct: "%", unitMo: "/月", unitM: "百万",
    gdp: { k: "GDP 增长", up: "增长中", down: "萎缩中" },
    inflation: { k: "通货膨胀", contained: "受控", elevated: "偏高" },
    unemployment: { k: "失业率", nearfull: "接近充分", rising: "上升" },
    income: { k: "收入中位数", tl: "家庭" },
    trade: { k: "贸易差额", surplus: "顺差", deficit: "逆差" },
    population: { k: "人口", tl: "人", modalTitle: "马来西亚人口", million: "百万",
      modalBody: "{year} 年的估计总人口。人口越多意味着劳动力越大、国内市场越大。" }
  },
  topic: { gdp: "GDP 增长", inflation: "通货膨胀", unemployment: "就业", income: "收入", trade: "贸易" },
  sector: { p1: "农业", p2: "采矿业", p3: "制造业", p4: "建筑业", p5: "服务业", p6: "进口税" },
  explainers: {
    gdp: {
      title: "「GDP 增长 {gp}」到底意味着什么？",
      source: "DOSM Open Data - 季度实质 GDP",
      dataLine: "{q}：同比 {gp}（较上一季 {gq}）",
      body: "GDP 是马来西亚生产的一切的总价值。增长 <b>{gp}</b> 意味着国家生产的商品和服务比一年前的同一季度多了约 {gp}。<b>{top}</b> 是经济最大的引擎，它{topDir} {tgp}。用日常话说：活动越多，通常意味着更多就业、更多生意、更多收入在流动。",
      notMean: "它并不意味着物价上涨了那么多，也不意味着每个人的薪水都涨了 6%。GDP 关乎产出，而非你的工资单。",
      care: "经济增长时，通常更容易找到工作，企业也更愿意招聘和投资。"
    },
    inflation: {
      title: "为什么什么都感觉更贵了？（通货膨胀）",
      source: "DOSM Open Data - 消费者价格指数",
      dataLine: "{m}：通胀同比 {ip} - CPI 指数 {idx}",
      body: "通胀 <b>{ip}</b> 意味着一个典型购物篮的物价比一年前高了约 {ir}%。这被视为 <b>{feel}</b>。所以去年花 {rm100} 的东西，如今大约要花 <b>{rmNow}</b>。核心通胀（剔除波动的食品和燃料）为 {cp}。",
      notMean: "它并不意味着物价翻倍，也不意味着每一样东西都涨了相同幅度——交通和食品往往走势相差很大。",
      care: "通胀在悄悄削减你的钱能买到的东西。如果你的收入涨得比它慢，随着时间推移你能负担的会越来越少。"
    },
    unemployment: {
      title: "现在找工作容易吗？（失业率）",
      source: "DOSM Open Data - 劳动力调查",
      dataLine: "{m}：失业率 {u}% - 参与率 {p}%",
      body: "失业率 <b>{u}%</b> 意味着每 100 个想工作的人中，约有 {u} 个还在找。这属于 <b>{feel}</b>——约 3% 被视为「充分就业」，因为总会有人处在换工作的空档期。约有 <b>{emp} 百万</b> 名马来西亚人就业。",
      notMean: "它并不计入不找工作的人（学生、退休者、照护者）。它是劳动力中的占比，而非全体人口。",
      care: "低失业率意味着雇主在招人，劳动者在薪酬和条件上有更大的议价能力。"
    },
    income: {
      title: "一个「典型」的马来西亚家庭赚多少？",
      source: "DOSM Open Data - 家庭收入调查",
      dataLine: "家庭收入中位数 {med}/月 - 平均值 {mean}",
      body: "家庭收入<b>中位数</b>为每月 <b>{med}</b>——一半家庭赚得更多，一半更少。<b>平均值</b>（{mean}）更高，是因为少数高收入者把平均拉高了。两者之间的差距，正是经济学家关注基尼系数（目前 {gini}）的原因之一。",
      notMean: "平均值并不是「典型」家庭——中位数才是更好的日常基准。",
      care: "把你自己的家庭与中位数相比，能看出你的位置，以及收入需要多快增长才能跟上物价。"
    },
    trade: {
      title: "马来西亚卖的比买的多吗？（贸易）",
      source: "DOSM Open Data - 对外贸易",
      dataLine: "{m}：出口 {ex}百万 vs 进口 {im}百万",
      body: "马来西亚是贸易大国。{m}，它出口约 <b>{ex} 百万</b>，进口 <b>{im} 百万</b>——贸易<b>{balWord}</b>为 {absBal} 百万。{balSentence}",
      notMean: "顺差不会自动就「好」，逆差也不会自动就「坏」——取决于交易的是什么以及为什么。",
      care: "贸易带动了马来西亚很大一部分就业，尤其在制造业和电子业。"
    }
  },
  headline: { big: "马来西亚经济增长 {gp}", sub: "实质 GDP，{q}，同比。经济正在{mood}。" },
  askr: {
    helpDefault: "关于马来西亚经济，尽管问我——试试「为什么什么都这么贵？」",
    helpFallback: "我用 DOSM 官方数字回答。我能讲解 <b>GDP</b>、<b>通胀</b>、<b>就业</b>、<b>收入</b> 或 <b>贸易</b>——也能算算一笔令吉现在值多少。试试下面的建议。",
    ppIntent: "购买力", ppSource: "DOSM Open Data - 消费者价格指数", ppData: "通胀 {ip}（{m}）",
    ppBody: "按今天 <b>{ip}</b> 的通胀，<b>{amt}</b> 的购买力在一年后会缩水到约能买 <b>{eroded}</b> 的东西。要保持不变，这笔钱得增长 {ip} 才能原地踏步。",
    stIntent: "州属", stSource: "DOSM Open Data - 家庭收入调查", stData: "家庭收入中位数最高：{state}（{med}）",
    stBody: "马来西亚各地家庭收入差异很大。{state} 的中位数最高，为每月 <b>{med}</b>，而全国中位数为 <b>{natMed}</b>。前往「马来西亚 vs 你的州属」比较你自己的州属。"
  },
  suggest: [
    { i: "gdp", label: "马来西亚经济状况如何？" },
    { i: "inflation", label: "为什么什么都这么贵？" },
    { i: "unemployment", label: "现在找工作容易吗？" },
    { i: "ppower", label: "RM100 明年值多少？" },
    { i: "states", label: "哪个州属收入最高？" },
    { i: "income", label: "典型家庭赚多少？" }
  ],
  snap: {
    title: "你的经济画像", sub: "根据你告诉 FAHAMI 的内容。这里的一切都不会离开你的浏览器。",
    whereH: "你的位置",
    whereBody: "你的家庭收入 <b>{inc}</b> <b>{where}</b>全国中位数 <b>{med}</b>{stateClause}。",
    stateClause: "，并且比 {state} 的中位数（{smed}）高 <b>{pct}</b>",
    where: { comfAbove: "明显高于", above: "高于", littleBelow: "略低于", below: "低于" },
    addH: "填入你的收入", addBody: "在上方填入家庭月收入，即可看到你相对全国中位数 <b>{med}</b> 的位置。",
    dimName: "你 vs 全国中位数", dimHint: "100% = 恰好为全国中位数。半格进度条 = 处于中位数。",
    taxH: "通胀对你的「隐形税」",
    taxBody: "按今天 <b>+{infl}%</b> 的通胀，你的收入需要每月约增加 <b>{raise}</b>，才能在明年保持相同的购买力。低于这个数的加薪，其实是变相减薪。",
    source: "DOSM Open Data &middot; 收入中位数、{m} CPI",
    playBtn: "看看什么在推动这些数字", cmpBtn: "比较我的州属"
  },
  tip: {
    student: { h: "作为学生", body: "+{infl}% 的通胀对食品、交通等日常开支冲击最大。能把你未来收入提升到 {med} 中位数以上的技能，是最好的对冲。" },
    working: { h: "作为在职者", body: "失业率仅 {u}%，眼下就业市场对劳动者有利——正是谈一份跑赢 +{infl}% 通胀薪酬的好时机。" },
    family: { h: "为了你的家庭", body: "家庭预算最能通过食品和住房感受到通胀。把它们与 {med} 中位数对照，有助于你规划。" },
    business: { h: "为了你的生意", body: "GDP 增长 +{g}% 意味着需求在扩张，但失业率 {u}% 之下工资压力真实存在。" },
    retired: { h: "退休期间", body: "固定收入最容易受通胀影响。在 +{infl}% 之下，除非储蓄至少以同样速度增长，否则每年都会流失购买力。" },
    other: { h: "为了你", body: "无论你的处境如何，同样的力量都在起作用：增长（+{g}%）、物价（+{infl}%）和就业（{u}%）。" }
  },
  chain: {
    dirUp: "上升", dirDown: "下降", dirFlat: "保持平稳",
    n0T: "你设定了控制杆", n0B: "OPR {o}%，通胀冲击 {i}%，政府开支 {g}%。",
    borrowCheapT: "借贷变得更便宜", borrowPricyT: "借贷变得更昂贵",
    borrowCheapB: "{o}% 的政策利率意味着贷款、房贷和企业信贷更实惠，于是民众和企业花得更多。",
    borrowPricyB: "{o}% 的政策利率意味着贷款、房贷和企业信贷更昂贵，于是开支降温。",
    demandT: "需求{x}", demandB: "把便宜／昂贵的资金、政府开支和物价冲击合在一起，经济中的总需求{dir}。",
    gdpT: "GDP 增长{x}", gdpB: "更多开支促使企业增产，因此在此情景下增长往往会移动到约 <b>{val}%</b>。",
    jobsT: "就业{x}", jobsB: "企业增产就会多招人，把失业率从今天的 {u}% 推{ud}。",
    jobDown: "低", jobUp: "高", jobFlat: "向横盘",
    priceClimbT: "物价上涨更快", priceStayT: "物价保持受控",
    priceB: "强劲的需求加上冲击，把通胀推到接近 <b>{val}%</b>。这就是取舍：把经济烧得太热，物价就会上涨。"
  },
  cmp: {
    malaysia: "马来西亚", medianCaption: "家庭收入中位数 / 月", gapH: "差距",
    gapBody: "{state} 的中位家庭收入比全国中位数{moreless} <b>{diff}</b>。{tail}",
    moreThan: "多", lessThan: "少",
    tailHigh: "它是马来西亚收入较高的地区之一。", tailLow: "这里的收入低于全国中间水平。",
    mMedian: "收入中位数", mMean: "收入平均值", mGini: "收入不平等（基尼）", mPoverty: "贫困率",
    source: "DOSM Open Data - 家庭收入调查"
  },
  madaniItem: {
    gdp: { name: "壮大经济", metric: "实质 GDP 增长", note: "MADANI 目标是稳健、广泛的增长。实时 GDP 增长以 4.5-5.5% 愿景的中点为对照显示。" },
    labour: { name: "人人有工作", metric: "失业率", note: "失业率越低越好。充分就业约在 3%。" },
    inflation: { name: "保持物价稳定", metric: "通胀（CPI 同比）", note: "物价应缓慢且可预测地上涨。国家银行的舒适区大约是 2-3%。" },
    income: { name: "提高收入", metric: "家庭收入中位数", note: "MADANI 旨在提高薪资，让典型家庭每年赚得更多。" },
    labourforce: { name: "让更多人就业", metric: "劳动参与率", note: "更多成年人工作或找工作，意味着经济更大、更有生产力。" }
  },
  lvl: { Basics: "基础", Everyday: "日常", Deeper: "进阶" },
  lesson: {
    modalSub: "{lvl} &middot; 学习", modalSource: "结合 DOSM 背景讲解的概念",
    gdp: { t: "什么是 GDP？", d: "马来西亚一年内所生产的一切的总价值。",
      body: "GDP（国内生产总值）把国家生产的所有商品和服务的价值加总起来。当 GDP <b>增长</b>时，经济生产得比以前多。可以把它想成国家这一年的总「收入」。马来西亚的 GDP 由 DOSM 每季度测量。" },
    inflation: { t: "什么是通货膨胀？", d: "为什么同样的令吉每年买到的东西少一点。",
      body: "通胀是物价上涨的速率。如果通胀为 2%，去年花 RM100 的东西如今约要 RM102。少许通胀是正常且健康的；过多则会损害你的购买力。DOSM 用消费者价格指数（CPI）来追踪它。" },
    cpi: { t: "CPI 如何运作", d: "一个衡量生活成本的「购物篮」。",
      body: "CPI 跟踪一篮子固定商品的价格——家庭真正会买的东西：食品、交通、住房等等。每个类别都有一个权重，取决于人们在上面花多少钱。食品和住房对指数的影响最大，因为我们在那上面花得最多。" },
    unemployment: { t: "失业率", d: "想要工作却找不到工作的人所占的比例。",
      body: "失业率是正在积极找工作的人数，除以劳动力总数。约 3% 被视为「充分就业」——总会有人处在换工作之间。它不计入不找工作的人。" },
    purchasingpower: { t: "购买力", d: "随着时间推移，你的钱究竟能买到什么。",
      body: "购买力是你金钱的真实价值。即使薪水不变，通胀也在悄悄缩减它能买到的东西。这就是为什么与通胀持平的加薪只能让你原地踏步——要往前走，收入必须比物价涨得更快。" },
    gini: { t: "基尼系数", d: "用一个数字表示收入分配有多均匀。",
      body: "基尼系数从 0（人人收入相同）到 1（一个人赚走全部）。马来西亚约为 0.40。越低越平等。它与收入中位数一起，有助于比较各州之间以及不同时期的公平程度。" }
  },
  quiz: {
    qOf: "第 {n} 题，共 {t} 题 &middot; 得分 {s}", done: "完成！", scored: "你得了 {s}/{t}",
    winMsg: "太棒了——你真正掌握了马来西亚经济的基础！", loseMsg: "不错的尝试！读读上面几篇课程再来一次。",
    again: "再玩一次", next: "下一题", result: "查看结果", correct: "答对了！", wrong: "还差一点",
    items: [
      { q: "如果今年通胀为 2%，价值 RM100 的商品大约会花...", opts: ["明年 RM98", "明年 RM102", "明年 RM120", "不变，RM100"], why: "2% 通胀意味着物价约上涨 2%，所以 RM100 变成约 RM102。" },
      { q: "当 GDP「增长」时，意味着国家...", opts: ["印了更多钞票", "生产了更多商品和服务", "提高了税收", "借了更多钱"], why: "GDP 增长衡量的是经济产出价值的上升。" },
      { q: "在马来西亚的 CPI 中，通常哪一类支出的权重最大？", opts: ["烟酒", "娱乐", "食品与住房", "通讯"], why: "家庭在食品和住房上花得最多，所以它们对 CPI 影响最大。" },
      { q: "接近 3% 的失业率通常被认为是...", opts: ["危机", "大致充分就业", "不可能", "通货紧缩"], why: "约 3% 被视为充分就业——一些换工作总是正常的。" },
      { q: "基尼系数越接近 0，意味着收入...", opts: ["更不平等", "分配更平等", "增长更快", "下降"], why: "基尼为 0 是完全平等；越接近 1 越不平等。" }
    ]
  },
  badge: {
    unlocked: "解锁徽章：{name}",
    explorer: { name: "探索者", hint: "打开讲解页" },
    curious: { name: "好奇心", hint: "向 FAHAMI 提一个问题" },
    personal: { name: "专属于你", hint: "生成你的画像" },
    player: { name: "模拟场高手", hint: "移动一个模拟场控制杆" },
    scholar: { name: "学者", hint: "读完一篇课程" },
    quizwhiz: { name: "答题达人", hint: "测验答对 4/5" }
  },
  data: {
    liveTitle: "实时来自 DOSM", bundledTitle: "正在使用内置数据", sub: "数据来源与可信度",
    lead: "FAHAMI 直接从 <b>DOSM Open Data</b>（马来西亚统计局）读取马来西亚的官方统计数据。",
    liveH: "实时连接已启用", liveBody: "已获取：<b>{got}</b>。<br>截至：{asOf}。<br>检查于 {time}。",
    coreIndicators: "核心指标",
    bundledH: "正在显示最近已知的数字",
    bundledBody: "无法连接实时 API{err}，因此 FAHAMI 正在显示内置的官方数字。请通过 <b>serve.cmd</b> 运行本应用（而不是双击 HTML 文件），并检查你的网络连接以启用实时数据。",
    note: "FAHAMI 所述的每个数字都可追溯到 DOSM 官方统计。讲解在你的设备上生成——没有外部 AI 模型，你输入的任何内容也不会发送到任何地方。"
  },
  magic: {
    sub: "奇迹时刻 &middot; DOSM 实时", readsH: "FAHAMI 替你读懂那条头条",
    readsBody: "看看接下来会发生什么：FAHAMI 拿起一个官方数字，用几次点按，带你从「这是什么意思？」一路走到「这对<b>我</b>意味着什么？」。",
    start: "开始导览", justDash: "只看仪表板",
    tSee: "看 - 经济一览", tUnderstand: "理解 - 6% 增长意味着什么",
    tCompare: "比较 - 你的州属如何", tPersonalise: "个性化 - 让它关乎你",
    tPlay: "玩 - 移动控制杆", tTrack: "追踪 - 马来西亚的 MADANI 目标"
  }
};
/* ===================== தமிழ் (Tamil) ===================== */
window.FAHAMI_I18N.ta = {
  ui: { credit: "உருவாக்கியவர் Tan Wei Siang" },
  footer: { credit: "Tan Wei Siang ஆல் உருவாக்கப்பட்டது", owned: "முழுமையாக Tan Wei Siang உடையது &middot; தரவு: DOSM Open Data" },
  nav: { glance: "ஒரு பார்வை", explain: "விளக்கம்", ask: "கேள்", me: "என் பொருளாதாரம்", play: "விளையாட்டு", states: "என் மாநிலம்", madani: "MADANI", learn: "கற்க" },
  pill: { live: "நேரலை - DOSM", bundled: "சேமித்த தரவு", checking: "தரவைச் சரிபார்க்கிறது..." },
  hero: {
    badge: "DOSM Open Data-விலிருந்து நேரலை",
    big: "மலேசியாவின் பொருளாதாரம் எப்படி இருக்கிறது?",
    sub: "அதிகாரப்பூர்வ எண்கள், சொற்சிக்கல் இல்லாமல். மலேசியாவின் உண்மையான பொருளாதாரத் தரவை நீங்கள் உணரக்கூடிய எளிய, காட்சி விடைகளாக FAHAMI மாற்றுகிறது.",
    tagline: "மலேசியாவின் அதிகாரப்பூர்வ பொருளாதாரத் தரவு, எளிமையாகவும் காட்சியாகவும் விளக்கப்பட்டது.",
    magic: "அந்த மாயத்தைக் காட்டு", explore: "டாஷ்போர்டைக் காண்க"
  },
  glance: { eyebrow: "பார்", title: "பொருளாதாரம் ஒரு பார்வையில்", desc: "ஆறு எண்களில் மலேசியாவின் துடிப்பு. எந்த அட்டையையும் தட்டினால் FAHAMI அதை எளிய மொழியில் விளக்கும்." },
  explain: {
    eyebrow: "புரிந்துகொள்", title: "AI பொருளாதார விளக்கி",
    desc: "ஒரு தலைப்பைத் தேர்வுசெய். சமீபத்திய அதிகாரப்பூர்வ எண்களிலிருந்து FAHAMI எளிய விளக்கத்தை உருவாக்கும் - அது என்ன பொருள், என்ன பொருள் அல்ல, ஏன் நீங்கள் கவனிக்க வேண்டும்.",
    byline: "FAHAMI விளக்கம், அதிகாரப்பூர்வ DOSM எண்களிலிருந்து உருவாக்கப்பட்டது",
    theNumber: "அந்த எண்", plainEnglish: "எளிய மொழியில்", notMeanH: "இது எதைக் குறிக்கவில்லை", careH: "நீங்கள் ஏன் கவனிக்க வேண்டும்"
  },
  ask: {
    eyebrow: "கேள்", title: "FAHAMI-யிடம் கேள்", desc: "வாய்விட்டுச் சொல்வதுபோலவே கேள்வியைத் தட்டச்சு செய். ஒவ்வொரு பதிலும் DOSM எண்களை அடிப்படையாகக் கொண்டது.",
    byline: "சாதனத்திலேயே பதில்கள், அதிகாரப்பூர்வ DOSM தரவிலிருந்து - எந்த எண்ணும் கற்பனையல்ல.",
    placeholder: "எ.கா. ஏன் எல்லாமே இவ்வளவு விலை?", send: "கேள்",
    greeting: "வணக்கம்! நான் FAHAMI. மலேசியப் பொருளாதாரம் பற்றி எதை வேண்டுமானாலும் கேளுங்கள் - சமீபத்திய அதிகாரப்பூர்வ DOSM எண்களைப் பயன்படுத்தி பதிலளிக்கிறேன். கீழே உள்ள பரிந்துரையை முயற்சிக்கவும்.",
    footer: "அதிகாரப்பூர்வ DOSM எண்களிலிருந்து &middot; சாதனத்திலேயே"
  },
  me: {
    eyebrow: "உனக்கானதாக்கு", title: "என் பொருளாதாரம்",
    desc: "உன்னைப் பற்றி சிறிது FAHAMI-யிடம் சொல். அது உன் உலாவியிலேயே இருக்கும் - எங்கும் அனுப்பப்படாது - மலேசியப் பொருளாதாரத்தில் நீ எங்கு நிற்கிறாய் என்பதை FAHAMI காட்டும்.",
    incomeLabel: "மாதாந்திர குடும்ப வருமானம்", stateLabel: "உன் மாநிலம்", lifeLabel: "உன்னை எது சிறப்பாக விவரிக்கிறது?", build: "என் சுருக்கத்தை உருவாக்கு",
    life: { student: "மாணவர்", working: "வேலை", family: "குடும்பம்", business: "வணிகம்", retired: "ஓய்வு", other: "மற்றவை" }
  },
  play: {
    eyebrow: "விளையாடு", title: "பொருளாதார விளையாட்டுத் திடல்",
    desc: "நீதான் பொறுப்பு. நெம்புகோல்களை நகர்த்து, பொருளாதாரம் முழுவதும் FAHAMI சங்கிலி வினையைக் கண்காணிப்பதைப் பார் - காரணமும் விளைவும் பற்றி பொருளாதார நிபுணர்கள் சிந்திக்கும் விதத்தில்.",
    leversH: "நெம்புகோல்கள்", leversSub: "ஒரு கொள்கை அல்லது அதிர்ச்சியை மாற்ற இழு. கீழே உள்ள அனைத்தும் நேரலையில் புதுப்பிக்கப்படும்.",
    oprName: "வட்டி விகிதம் (OPR)", oprL: "1% (மலிவான கடன்)", oprR: "6% (விலையுயர்ந்த கடன்)",
    infName: "பணவீக்க அதிர்ச்சி", infL: "-3% (விலை வீழ்ச்சி)", infR: "+8% (விலை உயர்வு)",
    govName: "அரசு செலவு", govL: "-20% (சிக்கனம்)", govR: "+20% (தூண்டுதல்)",
    chainH: "சங்கிலி வினை", chainSub: "காரணத்தைக் காண ஒரு படியைத் தட்டு. இது எளிமைப்படுத்தப்பட்ட கற்பித்தல் மாதிரி, முன்னறிவிப்பு அல்ல."
  },
  states: {
    eyebrow: "ஒப்பிடு", title: "மலேசியா vs உன் மாநிலம்",
    desc: "நாடு முழுவதும் குடும்ப வருமானம் பெரிதும் மாறுபடுகிறது. உன் மாநிலம் தேசியச் சித்திரத்துடன் எப்படி ஒப்பிடுகிறது என்று பார்.", choose: "ஒரு மாநிலத்தைத் தேர்வுசெய்"
  },
  madani: {
    eyebrow: "கண்காணி", title: "Ekonomi MADANI கண்காணிப்பான்",
    desc: "மலேசியாவின் பொருளாதாரக் கட்டமைப்பு வளர்ச்சி, வேலைவாய்ப்பு, விலை மற்றும் வருமானத்திற்கு இலக்குகளை நிர்ணயிக்கிறது. நேரலை எண்கள் அவற்றுடன் எப்படி ஒப்பிடுகின்றன என்பது இதோ.",
    disclaimer: "இலக்குகள் கல்விக்கான விளக்கக் குறிப்புப் புள்ளிகள். முன்னேற்றம் அந்த அளவுகோல்களுக்கு எதிராக சமீபத்திய DOSM எண்களைப் பிரதிபலிக்கிறது.",
    live: "நேரலை", reference: "குறிப்பு", ontrack: "இலக்கை நோக்கி", target: "இலக்கு"
  },
  learn: {
    eyebrow: "கற்க", title: "பொருளாதாரம் கற்க", desc: "எளிய மொழியில் சிறு பாடங்கள். சிலவற்றைப் படி, பிறகு உன்னைச் சோதித்து பதக்கங்களைச் சேகரி.",
    lessonsH: "விரைவுப் பாடங்கள்", lessonsSub: "படிக்க ஒரு அட்டையைத் தட்டு. ஒன்றை முடித்தால் Scholar பதக்கம் கிடைக்கும்.",
    quizH: "உன்னைச் சோதி", quizSub: "5 விரைவு கேள்விகள்.", badgesH: "உன் பதக்கங்கள்", badgesSub: "FAHAMI-யை ஆராயும்போது இவற்றைப் பெறு."
  },
  word: {
    grew: "வளர்ந்தது", shrank: "சுருங்கியது", surplus: "உபரி", deficit: "பற்றாக்குறை",
    tradePos: "வாங்குவதைவிட அதிகம் விற்பது நாட்டிற்குள் பணத்தைக் கொண்டுவருகிறது.",
    tradeNeg: "விற்பதைவிட அதிகம் வாங்குவது பணத்தை வெளியே அனுப்புகிறது.",
    feelHealthy: "ஆரோக்கியம்", feelModerate: "மிதம்", feelHigh: "அதிகம்"
  },
  mood: { solid: "உறுதியாக வளர்கிறது", steady: "சீராக வளர்கிறது", slow: "மெதுவாக வளர்கிறது", contracting: "சுருங்குகிறது" },
  g: {
    live: "நேரலை", bundled: "சேமித்த", explainThis: "இதை விளக்கு",
    source: "மூலம்: DOSM Open Data &middot; {src} &middot; {q} GDP, {m} CPI, {lm} தொழிலாளர்",
    unitYoY: "% ஆண்டுவாரி", unitPct: "%", unitMo: "/மாதம்", unitM: "மி",
    gdp: { k: "GDP வளர்ச்சி", up: "வளர்கிறது", down: "சுருங்குகிறது" },
    inflation: { k: "பணவீக்கம்", contained: "கட்டுக்குள்", elevated: "உயர்ந்து" },
    unemployment: { k: "வேலையின்மை", nearfull: "முழுமைக்கு அருகில்", rising: "உயர்கிறது" },
    income: { k: "இடைநிலை வருமானம்", tl: "குடும்பம்" },
    trade: { k: "வர்த்தக சமநிலை", surplus: "உபரி", deficit: "பற்றாக்குறை" },
    population: { k: "மக்கள்தொகை", tl: "மக்கள்", modalTitle: "மலேசியாவின் மக்கள்தொகை", million: "மில்லியன்",
      modalBody: "{year}-ல் மதிப்பிடப்பட்ட மொத்த மக்கள்தொகை. அதிக மக்கள்தொகை என்பது பெரிய தொழிலாளர் படை மற்றும் பெரிய உள்நாட்டுச் சந்தை." }
  },
  topic: { gdp: "GDP வளர்ச்சி", inflation: "பணவீக்கம்", unemployment: "வேலைவாய்ப்பு", income: "வருமானம்", trade: "வர்த்தகம்" },
  sector: { p1: "விவசாயம்", p2: "சுரங்கம்", p3: "உற்பத்தி", p4: "கட்டுமானம்", p5: "சேவைகள்", p6: "இறக்குமதி வரி" },
  explainers: {
    gdp: {
      title: "'{gp} GDP வளர்ச்சி' என்றால் உண்மையில் என்ன பொருள்?",
      source: "DOSM Open Data - காலாண்டு உண்மை GDP",
      dataLine: "{q}: ஆண்டுவாரி {gp} (சென்ற காலாண்டுடன் {gq})",
      body: "மலேசியா உற்பத்தி செய்யும் அனைத்தின் மொத்த மதிப்பே GDP. <b>{gp}</b> வளர்ச்சி என்பது, ஓராண்டுக்கு முன்னைய அதே காலாண்டைவிட நாடு சுமார் {gp} அதிக பொருட்களையும் சேவைகளையும் உற்பத்தி செய்தது என்பதாகும். <b>{top}</b> பொருளாதாரத்தின் மிகப்பெரிய இயந்திரம், அது {topDir} {tgp}. அன்றாட மொழியில்: அதிக செயல்பாடு பொதுவாக அதிக வேலை, அதிக வணிகம், அதிக வருமான ஓட்டம் என்று பொருள்.",
      notMean: "விலைகள் அந்த அளவு உயர்ந்தன என்று இது பொருள் அல்ல; எல்லோருடைய சம்பளமும் 6% உயர்ந்தது என்றும் பொருள் அல்ல. GDP என்பது வெளியீடு பற்றியது, உன் சம்பளச் சீட்டு பற்றியது அல்ல.",
      care: "பொருளாதாரம் வளரும்போது, பொதுவாக வேலை தேடுவதும், வணிகங்கள் ஆள் சேர்ப்பதும் முதலீடு செய்வதும் எளிதாகிறது."
    },
    inflation: {
      title: "ஏன் எல்லாமே அதிக விலை போல் தோன்றுகிறது? (பணவீக்கம்)",
      source: "DOSM Open Data - நுகர்வோர் விலைக் குறியீடு",
      dataLine: "{m}: பணவீக்கம் ஆண்டுவாரி {ip} - CPI குறியீடு {idx}",
      body: "<b>{ip}</b> பணவீக்கம் என்பது, ஒரு சராசரி பொருள் கூடையின் விலைகள் ஓராண்டுக்கு முன்பைவிட சுமார் {ir}% அதிகம் என்பதாகும். இது <b>{feel}</b> எனக் கருதப்படுகிறது. எனவே சென்ற ஆண்டு {rm100} ஆக இருந்த ஒன்று இப்போது சுமார் <b>{rmNow}</b> ஆகும். மைய பணவீக்கம் (ஏற்றமிறக்கமான உணவு, எரிபொருளை நீக்கி) {cp}.",
      notMean: "விலைகள் இரட்டிப்பானது என்று இது பொருள் அல்ல; ஒவ்வொரு பொருளும் ஒரே அளவு உயர்ந்தது என்றும் பொருள் அல்ல - போக்குவரத்தும் உணவும் பெரும்பாலும் மிக வேறுபட்டு நகர்கின்றன.",
      care: "பணவீக்கம் உன் பணம் வாங்கக்கூடியதை அமைதியாகக் குறைக்கிறது. உன் வருமானம் இதைவிட மெதுவாக உயர்ந்தால், காலப்போக்கில் நீ சற்று குறைவாகவே வாங்க முடியும்."
    },
    unemployment: {
      title: "இப்போது வேலை கிடைப்பது எளிதா? (வேலையின்மை)",
      source: "DOSM Open Data - தொழிலாளர் படை கணக்கெடுப்பு",
      dataLine: "{m}: வேலையின்மை {u}% - பங்கேற்பு {p}%",
      body: "<b>{u}%</b> வேலையின்மை விகிதம் என்பது, வேலை தேடும் ஒவ்வொரு 100 பேரிலும் சுமார் {u} பேர் இன்னும் தேடிக்கொண்டிருக்கிறார்கள் என்பதாகும். இது <b>{feel}</b> - சுமார் 3% \"முழு வேலைவாய்ப்பு\" எனக் கருதப்படுகிறது, ஏனெனில் சிலர் எப்போதும் வேலை மாறும் நிலையில் இருப்பர். சுமார் <b>{emp} மில்லியன்</b> மலேசியர்கள் வேலையில் உள்ளனர்.",
      notMean: "வேலை தேடாதவர்களை (மாணவர், ஓய்வூதியர், பராமரிப்பாளர்) இது கணக்கிடாது. இது தொழிலாளர் படையின் விகிதம், மொத்த மக்கள்தொகையின் அல்ல.",
      care: "குறைந்த விகிதம் என்பது முதலாளிகள் ஆள் சேர்க்கிறார்கள், தொழிலாளர்களுக்கு ஊதியம் மற்றும் நிபந்தனைகளில் அதிக பேரம் பேசும் சக்தி உள்ளது என்பதாகும்."
    },
    income: {
      title: "ஒரு 'சராசரி' மலேசியக் குடும்பம் எவ்வளவு சம்பாதிக்கிறது?",
      source: "DOSM Open Data - குடும்ப வருமான கணக்கெடுப்பு",
      dataLine: "இடைநிலை குடும்ப வருமானம் {med}/மாதம் - சராசரி {mean}",
      body: "<b>இடைநிலை</b> குடும்ப வருமானம் மாதம் <b>{med}</b> - பாதி குடும்பங்கள் அதிகம், பாதி குறைவாகச் சம்பாதிக்கின்றன. <b>சராசரி</b> ({mean}) அதிகம், ஏனெனில் மிக அதிகம் சம்பாதிக்கும் ஒரு சிறு தொகுதி சராசரியை மேலே இழுக்கிறது. இவற்றுக்கிடையிலான இடைவெளிதான் பொருளாதார நிபுணர்கள் Gini குணகத்தை (தற்போது {gini}) கவனிக்கக் காரணங்களில் ஒன்று.",
      notMean: "சராசரி என்பது 'சராசரி' குடும்பம் அல்ல - இடைநிலைதான் சிறந்த அன்றாட அளவுகோல்.",
      care: "உன் சொந்தக் குடும்பத்தை இடைநிலையுடன் ஒப்பிடுவது நீ எங்கு நிற்கிறாய், விலைகளுக்கு ஈடுகொடுக்க வருமானம் எவ்வளவு வேகமாக வளர வேண்டும் என்பதைக் காட்டுகிறது."
    },
    trade: {
      title: "மலேசியா வாங்குவதைவிட அதிகம் விற்கிறதா? (வர்த்தகம்)",
      source: "DOSM Open Data - வெளிநாட்டு வர்த்தகம்",
      dataLine: "{m}: ஏற்றுமதி {ex}மி vs இறக்குமதி {im}மி",
      body: "மலேசியா ஒரு பெரிய வர்த்தக நாடு. {m}-ல் அது சுமார் <b>{ex} மில்லியன்</b> ஏற்றுமதி செய்து <b>{im} மில்லியன்</b> இறக்குமதி செய்தது - {absBal} மில்லியன் வர்த்தக <b>{balWord}</b>. {balSentence}",
      notMean: "உபரி தானாகவே 'நல்லது' அல்ல, பற்றாக்குறை தானாகவே 'கெட்டது' அல்ல - எது வர்த்தகம் செய்யப்படுகிறது, ஏன் என்பதைப் பொறுத்தது.",
      care: "வர்த்தகம் மலேசிய வேலைகளில் பெரும் பகுதியை, குறிப்பாக உற்பத்தி மற்றும் மின்னணுத் துறையில், இயக்குகிறது."
    }
  },
  headline: { big: "மலேசியப் பொருளாதாரம் {gp} வளர்ந்தது", sub: "உண்மை GDP, {q}, ஆண்டுவாரி. பொருளாதாரம் {mood}." },
  askr: {
    helpDefault: "மலேசியப் பொருளாதாரம் பற்றி எதை வேண்டுமானாலும் கேள் - 'ஏன் எல்லாமே இவ்வளவு விலை?' என முயற்சி செய்.",
    helpFallback: "நான் அதிகாரப்பூர்வ DOSM எண்களுடன் பதிலளிக்கிறேன். <b>GDP</b>, <b>பணவீக்கம்</b>, <b>வேலைவாய்ப்பு</b>, <b>வருமானம்</b> அல்லது <b>வர்த்தகம்</b> - அல்லது ஒரு தொகை ரிங்கிட் எவ்வளவு மதிப்புள்ளது என்பதைச் சரிபார்க்க முடியும். கீழே உள்ள பரிந்துரைகளில் ஒன்றை முயற்சி செய்.",
    ppIntent: "வாங்கும் சக்தி", ppSource: "DOSM Open Data - நுகர்வோர் விலைக் குறியீடு", ppData: "பணவீக்கம் {ip} ({m})",
    ppBody: "இன்றைய <b>{ip}</b> பணவீக்கத்தில், <b>{amt}</b>-இன் வாங்கும் சக்தி ஓராண்டில் சுமார் <b>{eroded}</b> மதிப்புள்ள பொருட்களாகச் சுருங்குகிறது. ஈடுகொடுக்க, அந்தப் பணம் அதே இடத்தில் நிற்கவே {ip} வளர வேண்டும்.",
    stIntent: "மாநிலங்கள்", stSource: "DOSM Open Data - குடும்ப வருமான கணக்கெடுப்பு", stData: "அதிக இடைநிலை குடும்ப வருமானம்: {state} ({med})",
    stBody: "மலேசியா முழுவதும் குடும்ப வருமானம் பெரிதும் மாறுபடுகிறது. {state}-ல் அதிக இடைநிலை மாதம் <b>{med}</b>, தேசிய இடைநிலை <b>{natMed}</b>. உன் சொந்த மாநிலத்தை ஒப்பிட \"மலேசியா vs உன் மாநிலம்\" பகுதிக்குச் செல்."
  },
  suggest: [
    { i: "gdp", label: "மலேசியப் பொருளாதாரம் எப்படி இருக்கிறது?" },
    { i: "inflation", label: "ஏன் எல்லாமே இவ்வளவு விலை?" },
    { i: "unemployment", label: "இப்போது வேலை கிடைப்பது எளிதா?" },
    { i: "ppower", label: "RM100 அடுத்த ஆண்டு எவ்வளவு மதிப்பு?" },
    { i: "states", label: "எந்த மாநிலம் அதிகம் சம்பாதிக்கிறது?" },
    { i: "income", label: "ஒரு சராசரிக் குடும்பம் எவ்வளவு சம்பாதிக்கிறது?" }
  ],
  snap: {
    title: "உன் பொருளாதார சுருக்கம்", sub: "நீ FAHAMI-யிடம் சொன்னதை அடிப்படையாகக் கொண்டது. இங்குள்ள எதுவும் உன் உலாவியை விட்டு வெளியேறாது.",
    whereH: "நீ நிற்கும் இடம்",
    whereBody: "உன் <b>{inc}</b> குடும்ப வருமானம், தேசிய இடைநிலை <b>{med}</b>-ஐ விட <b>{where}</b>{stateClause}.",
    stateClause: ", மேலும் {state}-இன் இடைநிலையை ({smed}) விட <b>{pct}</b>",
    where: { comfAbove: "நன்கு அதிகம்", above: "அதிகம்", littleBelow: "சற்று குறைவு", below: "குறைவு" },
    addH: "உன் வருமானத்தைச் சேர்", addBody: "தேசிய இடைநிலை <b>{med}</b>-ஐ விட நீ எங்கு நிற்கிறாய் என்று காண மேலே மாதாந்திர குடும்ப வருமானத்தை உள்ளிடு.",
    dimName: "நீ vs தேசிய இடைநிலை", dimHint: "100% = சரியாக தேசிய இடைநிலை. அரை அகல பட்டை = இடைநிலையில்.",
    taxH: "உன்மீதான பணவீக்க வரி",
    taxBody: "இன்றைய <b>+{infl}%</b> பணவீக்கத்தில், அடுத்த ஆண்டு அதே வாங்கும் சக்தியைத் தக்கவைக்க உன் வருமானம் மாதம் சுமார் <b>{raise}</b> உயர வேண்டும். அதைவிடக் குறைவான ஊதிய உயர்வு உண்மையில் மறைமுக ஊதியக் குறைப்பே.",
    source: "DOSM Open Data &middot; இடைநிலை வருமானம், {m} CPI",
    playBtn: "இந்த எண்களை எது நகர்த்துகிறது என்று பார்", cmpBtn: "என் மாநிலத்தை ஒப்பிடு"
  },
  tip: {
    student: { h: "ஒரு மாணவராக", body: "+{infl}% பணவீக்கம் உணவு, போக்குவரத்து போன்ற அன்றாட செலவுகளை அதிகம் பாதிக்கிறது. உன் எதிர்கால வருமானத்தை {med} இடைநிலைக்கு மேல் உயர்த்தும் திறன்களே சிறந்த பாதுகாப்பு." },
    working: { h: "ஒரு பணியாளராக", body: "வேலையின்மை வெறும் {u}% ஆக இருப்பதால், இப்போது வேலைச் சந்தை தொழிலாளர்களுக்குச் சாதகம் - +{infl}% பணவீக்கத்தை மிஞ்சும் ஊதியத்தைப் பேச நல்ல தருணம்." },
    family: { h: "உன் குடும்பத்திற்கு", body: "குடும்பப் பட்ஜெட்டுகள் உணவு, வீட்டுவசதி வழியே பணவீக்கத்தை அதிகம் உணர்கின்றன. இவற்றை {med} இடைநிலையுடன் கண்காணிப்பது திட்டமிட உதவும்." },
    business: { h: "உன் வணிகத்திற்கு", body: "+{g}% GDP வளர்ச்சி தேவை விரிவடைகிறது என்பதைக் காட்டுகிறது, ஆனால் {u}% வேலையின்மையில் ஊதிய அழுத்தம் உண்மையானது." },
    retired: { h: "ஓய்வுக் காலத்தில்", body: "நிலையான வருமானங்கள் பணவீக்கத்திற்கு அதிகம் வெளிப்படுகின்றன. +{infl}%-ல், சேமிப்பு குறைந்தபட்சம் அதே வேகத்தில் வளராவிட்டால் ஒவ்வொரு ஆண்டும் வாங்கும் சக்தியை இழக்கிறது." },
    other: { h: "உனக்காக", body: "உன் நிலை எதுவாக இருந்தாலும், அதே சக்திகள் பொருந்தும்: வளர்ச்சி (+{g}%), விலை (+{infl}%) மற்றும் வேலைவாய்ப்பு ({u}%)." }
  },
  chain: {
    dirUp: "உயர்கிறது", dirDown: "வீழ்கிறது", dirFlat: "நிலையாக உள்ளது",
    n0T: "நீ நெம்புகோல்களை அமைத்தாய்", n0B: "OPR {o}%, பணவீக்க அதிர்ச்சி {i}%, அரசு செலவு {g}%.",
    borrowCheapT: "கடன் வாங்குவது மலிவாகிறது", borrowPricyT: "கடன் வாங்குவது விலையாகிறது",
    borrowCheapB: "{o}% கொள்கை விகிதம் என்பது கடன், வீட்டுக்கடன், வணிகக் கடன் மலிவாகிறது, எனவே மக்களும் நிறுவனங்களும் அதிகம் செலவழிக்கின்றனர்.",
    borrowPricyB: "{o}% கொள்கை விகிதம் என்பது கடன், வீட்டுக்கடன், வணிகக் கடன் விலையாகிறது, எனவே செலவு குறைகிறது.",
    demandT: "தேவை {x}", demandB: "மலிவான/விலையான பணம், அரசு செலவு, விலை அதிர்ச்சி ஆகியவற்றை இணைத்தால், பொருளாதாரத்தில் ஒட்டுமொத்தத் தேவை {dir}.",
    gdpT: "GDP வளர்ச்சி {x}", gdpB: "அதிக செலவு நிறுவனங்களை அதிகம் உற்பத்தி செய்யத் தூண்டுகிறது, எனவே இந்தச் சூழலில் வளர்ச்சி சுமார் <b>{val}%</b> நோக்கி நகர்கிறது.",
    jobsT: "வேலைவாய்ப்பு {x}", jobsB: "நிறுவனங்கள் அதிகம் உற்பத்தி செய்ய அதிகம் ஆள் சேர்க்கின்றன, இன்றைய {u}%-லிருந்து வேலையின்மையை {ud} தள்ளுகிறது.",
    jobDown: "கீழே", jobUp: "மேலே", jobFlat: "பக்கவாட்டாக",
    priceClimbT: "விலைகள் வேகமாக ஏறுகின்றன", priceStayT: "விலைகள் கட்டுக்குள் இருக்கின்றன",
    priceB: "வலுவான தேவையும் அதிர்ச்சியும் பணவீக்கத்தை <b>{val}%</b> அருகில் வைக்கின்றன. இதுவே சமரசம்: பொருளாதாரத்தை மிக அதிகம் சூடாக்கினால் விலைகள் உயரும்."
  },
  cmp: {
    malaysia: "மலேசியா", medianCaption: "இடைநிலை குடும்பம் / மாதம்", gapH: "இடைவெளி",
    gapBody: "{state}-இன் இடைநிலைக் குடும்பம் தேசிய இடைநிலையை விட <b>{diff}</b> {moreless} சம்பாதிக்கிறது. {tail}",
    moreThan: "அதிகம்", lessThan: "குறைவாக",
    tailHigh: "இது மலேசியாவின் அதிக வருமானப் பகுதிகளில் ஒன்று.", tailLow: "இங்கு வருமானம் தேசிய நடுத்தரத்திற்கு கீழே உள்ளது.",
    mMedian: "இடைநிலை வருமானம்", mMean: "சராசரி வருமானம்", mGini: "வருமான சமத்துவமின்மை (Gini)", mPoverty: "வறுமை விகிதம்",
    source: "DOSM Open Data - குடும்ப வருமான கணக்கெடுப்பு"
  },
  madaniItem: {
    gdp: { name: "பொருளாதாரத்தை வளர்", metric: "உண்மை GDP வளர்ச்சி", note: "MADANI உறுதியான, பரவலான வளர்ச்சியை இலக்காகக் கொண்டுள்ளது. நேரலை GDP வளர்ச்சி 4.5-5.5% விழைவின் நடுப்புள்ளிக்கு எதிராகக் காட்டப்படுகிறது." },
    labour: { name: "அனைவருக்கும் வேலை", metric: "வேலையின்மை விகிதம்", note: "குறைந்த வேலையின்மை விகிதம் சிறந்தது. முழு வேலைவாய்ப்பு சுமார் 3%." },
    inflation: { name: "விலைகளை நிலையாக வை", metric: "பணவீக்கம் (CPI ஆண்டுவாரி)", note: "விலைகள் மெதுவாகவும் யூகிக்கக்கூடியதாகவும் உயர வேண்டும். Bank Negara-வின் வசதி மண்டலம் சுமார் 2-3%." },
    income: { name: "வருமானத்தை உயர்த்து", metric: "இடைநிலை குடும்ப வருமானம்", note: "ஒரு சராசரிக் குடும்பம் ஒவ்வொரு ஆண்டும் அதிகம் சம்பாதிக்க ஊதியத்தை உயர்த்துவதே MADANI-இன் நோக்கம்." },
    labourforce: { name: "மக்களை வேலைக்குக் கொண்டுவா", metric: "பங்கேற்பு விகிதம்", note: "அதிக பெரியவர்கள் வேலை செய்வதோ தேடுவதோ பெரிய, அதிக உற்பத்தித் திறன் கொண்ட பொருளாதாரத்தைக் குறிக்கிறது." }
  },
  lvl: { Basics: "அடிப்படை", Everyday: "அன்றாடம்", Deeper: "ஆழமாக" },
  lesson: {
    modalSub: "{lvl} &middot; கற்க", modalSource: "DOSM சூழலுடன் விளக்கப்பட்ட கருத்து",
    gdp: { t: "GDP என்றால் என்ன?", d: "மலேசியா ஓராண்டில் உருவாக்கும் அனைத்தின் மொத்த மதிப்பு.",
      body: "GDP (மொத்த உள்நாட்டு உற்பத்தி) நாடு உற்பத்தி செய்யும் அனைத்துப் பொருட்கள் மற்றும் சேவைகளின் மதிப்பைக் கூட்டுகிறது. GDP <b>வளரும்போது</b>, பொருளாதாரம் முன்பைவிட அதிகம் உற்பத்தி செய்கிறது. அதை நாட்டின் ஆண்டு மொத்த 'வருமானம்' என நினைத்துக்கொள். மலேசியாவின் GDP-ஐ DOSM ஒவ்வொரு காலாண்டும் அளவிடுகிறது." },
    inflation: { t: "பணவீக்கம் என்றால் என்ன?", d: "அதே RM ஏன் ஒவ்வொரு ஆண்டும் சற்று குறைவாக வாங்குகிறது.",
      body: "பணவீக்கம் என்பது விலைகள் உயரும் விகிதம். பணவீக்கம் 2% எனில், சென்ற ஆண்டு RM100 ஆக இருந்த ஒன்று இப்போது சுமார் RM102. சிறிது பணவீக்கம் இயல்பானது, ஆரோக்கியமானது; அதிகமானால் உன் வாங்கும் சக்தியைப் பாதிக்கும். DOSM இதை நுகர்வோர் விலைக் குறியீட்டு (CPI) மூலம் கண்காணிக்கிறது." },
    cpi: { t: "CPI எப்படி வேலை செய்கிறது", d: "வாழ்க்கைச் செலவை அளவிடும் ஒரு 'பொருள் கூடை'.",
      body: "குடும்பங்கள் உண்மையில் வாங்கும் ஒரு நிலையான பொருள் கூடையின் விலையை CPI பின்தொடர்கிறது - உணவு, போக்குவரத்து, வீட்டுவசதி மற்றும் பல. ஒவ்வொரு தொகுதிக்கும் மக்கள் அதில் எவ்வளவு செலவழிக்கிறார்கள் என்பதன் அடிப்படையில் ஒரு எடை உண்டு. நாம் உணவு, வீட்டுவசதியில் அதிகம் செலவழிப்பதால் அவையே குறியீட்டை அதிகம் நகர்த்துகின்றன." },
    unemployment: { t: "வேலையின்மை விகிதம்", d: "வேலை வேண்டும் ஆனால் கிடைக்காதவர்களின் பங்கு.",
      body: "வேலையின்மை விகிதம் என்பது வேலையைத் தீவிரமாகத் தேடுபவர்களின் எண்ணிக்கையை மொத்தத் தொழிலாளர் படையால் வகுத்தது. சுமார் 3% 'முழு வேலைவாய்ப்பு' எனக் கருதப்படுகிறது - சிலர் எப்போதும் வேலை மாறும் நிலையில் இருப்பர். வேலை தேடாதவர்களை இது கணக்கிடாது." },
    purchasingpower: { t: "வாங்கும் சக்தி", d: "காலப்போக்கில் உன் பணம் உண்மையில் எதை வாங்க முடியும்.",
      body: "வாங்கும் சக்தி என்பது உன் பணத்தின் உண்மையான மதிப்பு. உன் சம்பளம் மாறாமல் இருந்தாலும், பணவீக்கம் அது வாங்கக்கூடியதை அமைதியாகச் சுருக்குகிறது. அதனால்தான் பணவீக்கத்திற்கு ஈடான ஊதிய உயர்வு உன்னை அதே இடத்தில் நிறுத்துகிறது - முன்னேற, வருமானம் விலைகளைவிட வேகமாக வளர வேண்டும்." },
    gini: { t: "Gini குணகம்", d: "வருமானம் எவ்வளவு சமமாகப் பகிரப்படுகிறது என்பதற்கான ஒரு எண்.",
      body: "Gini குணகம் 0 (எல்லோரும் சமமாகச் சம்பாதிக்கின்றனர்) முதல் 1 (ஒருவர் அனைத்தையும் சம்பாதிக்கிறார்) வரை இயங்குகிறது. மலேசியாவினுடையது சுமார் 0.40. குறைவானது அதிக சமத்துவம். இடைநிலை வருமானத்துடன் சேர்த்து, மாநிலங்களுக்கிடையிலும் காலப்போக்கிலும் நேர்மையை ஒப்பிட இது உதவுகிறது." }
  },
  quiz: {
    qOf: "கேள்வி {n} / {t} &middot; மதிப்பெண் {s}", done: "முடிந்தது!", scored: "நீ {s}/{t} பெற்றாய்",
    winMsg: "அருமை - மலேசியப் பொருளாதாரத்தின் அடிப்படைகளை நீ உண்மையில் புரிந்துகொண்டாய்!", loseMsg: "நல்ல முயற்சி! மேலே சில பாடங்களைப் படித்து மீண்டும் முயற்சி செய்.",
    again: "மீண்டும் விளையாடு", next: "அடுத்த கேள்வி", result: "முடிவைப் பார்", correct: "சரி!", wrong: "இன்னும் சரியில்லை",
    items: [
      { q: "இந்த ஆண்டு பணவீக்கம் 2% எனில், RM100 மதிப்புள்ள பொருட்கள் சுமார்...", opts: ["அடுத்த ஆண்டு RM98", "அடுத்த ஆண்டு RM102", "அடுத்த ஆண்டு RM120", "அதே, RM100"], why: "2% பணவீக்கம் என்பது விலைகள் சுமார் 2% உயர்கின்றன, எனவே RM100 சுமார் RM102 ஆகிறது." },
      { q: "GDP 'வளரும்' போது, அதன் பொருள் நாடு...", opts: ["அதிகப் பணம் அச்சிட்டது", "அதிகப் பொருட்களையும் சேவைகளையும் உற்பத்தி செய்தது", "வரியை உயர்த்தியது", "அதிகம் கடன் வாங்கியது"], why: "பொருளாதாரம் உற்பத்தி செய்வதன் மதிப்பு உயர்வதையே GDP வளர்ச்சி அளவிடுகிறது." },
      { q: "மலேசியாவின் CPI-ல் பொதுவாக எந்தச் செலவுத் தொகுதிக்கு அதிக எடை?", opts: ["மது & புகையிலை", "பொழுதுபோக்கு", "உணவு & வீட்டுவசதி", "தகவல்தொடர்பு"], why: "குடும்பங்கள் உணவு, வீட்டுவசதியில் அதிகம் செலவழிப்பதால் அவையே CPI-ஐ அதிகம் நகர்த்துகின்றன." },
      { q: "3%-க்கு அருகிலான வேலையின்மை விகிதம் பொதுவாக எப்படிக் கருதப்படுகிறது...", opts: ["ஒரு நெருக்கடி", "தோராயமாக முழு வேலைவாய்ப்பு", "சாத்தியமற்றது", "பணவாட்டம்"], why: "சுமார் 3% முழு வேலைவாய்ப்பாகக் கருதப்படுகிறது - சிறிது வேலை மாற்றம் எப்போதும் இயல்பே." },
      { q: "0-க்கு அருகிலான Gini குணகம் என்பது வருமானம்...", opts: ["அதிக சமத்துவமின்மை", "அதிக சமமாகப் பகிரப்படுகிறது", "வேகமாக வளர்கிறது", "வீழ்கிறது"], why: "Gini 0 என்பது முழுமையான சமத்துவம்; 1-க்கு அருகில் அதிக சமத்துவமின்மை." }
    ]
  },
  badge: {
    unlocked: "பதக்கம் திறக்கப்பட்டது: {name}",
    explorer: { name: "ஆய்வாளர்", hint: "விளக்கியைத் திற" },
    curious: { name: "ஆர்வ மனம்", hint: "FAHAMI-யிடம் ஒரு கேள்வி கேள்" },
    personal: { name: "உனக்கானது", hint: "உன் சுருக்கத்தை உருவாக்கு" },
    player: { name: "விளையாட்டு நிபுணர்", hint: "ஒரு விளையாட்டு நெம்புகோலை நகர்த்து" },
    scholar: { name: "அறிஞர்", hint: "ஒரு பாடத்தை முடி" },
    quizwhiz: { name: "வினா வித்தகர்", hint: "வினாடி வினாவில் 4/5 பெறு" }
  },
  data: {
    liveTitle: "DOSM-லிருந்து நேரலை", bundledTitle: "சேமித்த எண்களைப் பயன்படுத்துகிறது", sub: "தரவு மூலம் & நம்பகத்தன்மை",
    lead: "மலேசியாவின் அதிகாரப்பூர்வ புள்ளிவிவரங்களை FAHAMI நேரடியாக <b>DOSM Open Data</b> (மலேசியப் புள்ளியியல் துறை)-லிருந்து படிக்கிறது.",
    liveH: "நேரலை இணைப்பு செயலில்", liveBody: "பெறப்பட்டது: <b>{got}</b>.<br>இதுவரை: {asOf}.<br>சரிபார்க்கப்பட்டது {time}.",
    coreIndicators: "முக்கிய குறிகாட்டிகள்",
    bundledH: "கடைசியாக அறிந்த எண்களைக் காட்டுகிறது",
    bundledBody: "நேரலை API-ஐ அணுக முடியவில்லை{err}, எனவே FAHAMI சேமித்த அதிகாரப்பூர்வ எண்களைக் காட்டுகிறது. HTML கோப்பை இருமுறை கிளிக் செய்யாமல் <b>serve.cmd</b> வழியாக செயலியை இயக்கி, நேரலைக்குச் செல்ல உன் இணைப்பைச் சரிபார்.",
    note: "FAHAMI கூறும் ஒவ்வொரு எண்ணும் அதிகாரப்பூர்வ DOSM புள்ளிவிவரத்தைக் கண்டறியக்கூடியது. விளக்கங்கள் உன் சாதனத்திலேயே உருவாக்கப்படுகின்றன - வெளிப்புற AI மாதிரி இல்லை, நீ உள்ளிடும் எதுவும் எங்கும் அனுப்பப்படாது."
  },
  magic: {
    sub: "மாய தருணம் &middot; DOSM நேரலை", readsH: "அந்தத் தலைப்பை FAHAMI உனக்காகப் படிக்கிறது",
    readsBody: "அடுத்து என்ன நடக்கிறது என்று பார்: FAHAMI ஒரு அதிகாரப்பூர்வ எண்ணை எடுத்து, சில தட்டல்களில் \"இதன் பொருள் என்ன?\" என்பதிலிருந்து \"இது <b>எனக்கு</b> என்ன பொருள்?\" வரை உன்னை அழைத்துச் செல்கிறது.",
    start: "சுற்றுலாவைத் தொடங்கு", justDash: "டாஷ்போர்டை மட்டும் காட்டு",
    tSee: "பார் - பொருளாதாரம் ஒரு பார்வையில்", tUnderstand: "புரிந்துகொள் - 6% வளர்ச்சியின் பொருள்",
    tCompare: "ஒப்பிடு - உன் மாநிலம் எப்படி", tPersonalise: "தனிப்பயனாக்கு - உனக்கானதாக்கு",
    tPlay: "விளையாடு - நெம்புகோல்களை நகர்த்து", tTrack: "கண்காணி - மலேசியாவின் MADANI இலக்குகள்"
  }
};
/* DICT-INSERT */
