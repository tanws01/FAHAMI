/* ============================================================================
   FAHAMI — data.js
   Bundled fallback figures + static metadata (labels, targets, lessons, quiz).
   Live values overwrite the fallbacks when DOSM Open Data is reachable
   (see live.js). Everything degrades gracefully when offline / on file://.

   Creator: Tan Wei Siang. Fully owned by Tan Wei Siang.
   Source of all economic figures: Department of Statistics Malaysia (DOSM),
   OpenDOSM — https://open.dosm.gov.my  (api.data.gov.my).
   ============================================================================ */

/* ---- Bundled fallback snapshot -------------------------------------------
   These are the last-known official figures, used only when the live API
   cannot be reached. They are clearly labelled "bundled" in the UI.        */
window.FAHAMI_FALLBACK = {
  asOf: "2026-Q2 GDP / Jul 2026 CPI",
  gdp: {
    growth_yoy: 6.0,          // % real GDP growth, latest quarter YoY
    growth_qoq: 1.9,
    abs: 445896,              // RM million, real, latest quarter
    quarter: "2026-Q2",
    sectors: [                // share of the economy, latest quarter growth YoY
      { code: "p5", name: "Services",        emoji: "&#127978;", growth: 5.9,  share: 59.6 },
      { code: "p3", name: "Manufacturing",   emoji: "&#127981;", growth: 7.3,  share: 23.3 },
      { code: "p1", name: "Agriculture",     emoji: "&#127806;", growth: -3.7, share: 5.6  },
      { code: "p2", name: "Mining",          emoji: "&#9935;",   growth: 9.2,  share: 5.5  },
      { code: "p4", name: "Construction",    emoji: "&#128679;", growth: 6.5,  share: 4.3  },
      { code: "p6", name: "Import duties",   emoji: "&#128230;", growth: 19.5, share: 1.6  }
    ]
  },
  cpi: {
    index: 137.1,             // overall headline CPI (base 2010 = 100)
    inflation_yoy: 1.8,       // % YoY headline inflation
    core_index: 136.2,
    core_yoy: 1.8,
    month: "Jul 2026",
    divisions: [              // YoY change by expenditure group
      { code: "02", name: "Alcohol & tobacco",            emoji: "&#127866;", yoy: 2.7 },
      { code: "11", name: "Restaurants & hotels",         emoji: "&#127869;", yoy: 2.0 },
      { code: "01", name: "Food & non-alcoholic drinks",  emoji: "&#127858;", yoy: 1.8 },
      { code: "04", name: "Housing, water, electricity",  emoji: "&#127968;", yoy: 1.8 },
      { code: "07", name: "Transport",                    emoji: "&#128663;", yoy: 1.4 },
      { code: "06", name: "Health",                       emoji: "&#129658;", yoy: 1.1 }
    ]
  },
  labour: {
    u_rate: 3.0,              // % unemployment
    p_rate: 70.9,            // % labour force participation
    ep_ratio: 68.8,
    employed: 16825,         // thousand persons
    unemployed: 513,
    month: "May 2026"
  },
  population: { total: 34389.4, year: 2026 },   // thousand persons
  trade: {
    exports: 177887,         // RM million, latest month
    imports: 163001,
    balance: 14885,
    month: "Jun 2026"
  },
  income: {                  // national, DOSM HIES reference
    mean: 8479,              // RM household monthly mean income
    median: 6338,
    gini: 0.404,
    year: 2022
  }
};

/* ---- State reference (HIES) ----------------------------------------------
   Household income snapshot by state; used by "Malaysia vs Your State".
   Figures are DOSM HIES reference values, overwritten by live where present. */
window.FAHAMI_STATES = [
  { key: "Malaysia",        emoji: "&#127962;", median: 6338, mean: 8479, gini: 0.404, poverty: 6.2 },
  { key: "W.P. Kuala Lumpur", emoji: "&#127961;", median: 11080, mean: 15131, gini: 0.421, poverty: 1.8 },
  { key: "W.P. Putrajaya",  emoji: "&#127963;", median: 12296, mean: 14109, gini: 0.362, poverty: 0.5 },
  { key: "W.P. Labuan",     emoji: "&#127965;", median: 7099,  mean: 8319,  gini: 0.331, poverty: 3.1 },
  { key: "Selangor",        emoji: "&#127961;", median: 9983,  mean: 12736, gini: 0.394, poverty: 1.6 },
  { key: "Pulau Pinang",    emoji: "&#127965;", median: 7774,  mean: 10079, gini: 0.402, poverty: 1.9 },
  { key: "Melaka",          emoji: "&#127984;", median: 7159,  mean: 8794,  gini: 0.371, poverty: 3.6 },
  { key: "Johor",           emoji: "&#127981;", median: 7024,  mean: 8955,  gini: 0.389, poverty: 3.9 },
  { key: "Negeri Sembilan", emoji: "&#127984;", median: 6707,  mean: 8348,  gini: 0.384, poverty: 4.5 },
  { key: "Terengganu",      emoji: "&#127965;", median: 6435,  mean: 8306,  gini: 0.396, poverty: 6.1 },
  { key: "Perak",           emoji: "&#127984;", median: 5788,  mean: 7519,  gini: 0.400, poverty: 7.3 },
  { key: "Pahang",          emoji: "&#127966;", median: 5723,  mean: 7297,  gini: 0.395, poverty: 6.8 },
  { key: "Sarawak",         emoji: "&#127966;", median: 5658,  mean: 7845,  gini: 0.428, poverty: 9.2 },
  { key: "Perlis",          emoji: "&#127966;", median: 5619,  mean: 7091,  gini: 0.379, poverty: 6.4 },
  { key: "Kedah",           emoji: "&#127966;", median: 5522,  mean: 7069,  gini: 0.391, poverty: 8.8 },
  { key: "Sabah",           emoji: "&#127965;", median: 4919,  mean: 6867,  gini: 0.408, poverty: 19.5 },
  { key: "Kelantan",        emoji: "&#127966;", median: 4874,  mean: 6707,  gini: 0.407, poverty: 13.2 }
];

/* ---- MADANI economy targets ----------------------------------------------
   Ekonomi MADANI is Malaysia's economic framework. Progress bars combine the
   live indicator (where available) against the published target.            */
window.FAHAMI_MADANI = [
  { key: "gdp",      emoji: "&#128200;", name: "Grow the economy",       metric: "Real GDP growth", live: "gdp.growth_yoy", unit: "%", target: 5.5, floor: 0, ceil: 8,
    dir: "up", note: "MADANI targets solid, broad-based growth. Live GDP growth is shown against the mid-point of the 4.5-5.5% aspiration." },
  { key: "labour",   emoji: "&#128188;", name: "Jobs for everyone",      metric: "Unemployment rate", live: "labour.u_rate", unit: "%", target: 3.0, floor: 5, ceil: 2.5,
    dir: "down", note: "A lower unemployment rate is better. Full employment is around 3%." },
  { key: "inflation",emoji: "&#127961;", name: "Keep prices stable",     metric: "Inflation (CPI YoY)", live: "cpi.inflation_yoy", unit: "%", target: 2.5, floor: 5, ceil: 1,
    dir: "down", note: "Prices should rise slowly and predictably. Bank Negara comfort zone is roughly 2-3%." },
  { key: "income",   emoji: "&#128176;", name: "Raise incomes",          metric: "Median household income", live: "income.median", unit: "RM", target: 8000, floor: 5000, ceil: 9000,
    dir: "up", note: "MADANI aims to lift wages so a typical household earns more each year." },
  { key: "labourforce", emoji: "&#129309;", name: "Bring people into work", metric: "Participation rate", live: "labour.p_rate", unit: "%", target: 72, floor: 65, ceil: 74,
    dir: "up", note: "More adults working or looking for work means a bigger, more productive economy." }
];

/* ---- Learn modules -------------------------------------------------------- */
window.FAHAMI_LESSONS = [
  { id: "gdp",   ic: "&#128202;", t: "What is GDP?", lvl: "Basics",
    d: "The total value of everything Malaysia makes in a year.",
    body: "GDP (Gross Domestic Product) adds up the value of all goods and services the country produces. When GDP <b>grows</b>, the economy is making more than before. Think of it as the country's total 'income' for the year. Malaysia's GDP is measured every quarter by DOSM." },
  { id: "inflation", ic: "&#127925;", t: "What is inflation?", lvl: "Basics",
    d: "Why the same RM buys a little less each year.",
    body: "Inflation is the rate at which prices rise. If inflation is 2%, something that cost RM100 last year now costs about RM102. A little inflation is normal and healthy; too much hurts your purchasing power. DOSM tracks it with the Consumer Price Index (CPI)." },
  { id: "cpi",   ic: "&#128722;", t: "How the CPI works", lvl: "Basics",
    d: "A 'shopping basket' that measures the cost of living.",
    body: "The CPI follows the price of a fixed basket of things households actually buy - food, transport, housing, and more. Each group has a weight based on how much people spend on it. Food and housing move the index the most because we spend the most there." },
  { id: "unemployment", ic: "&#128188;", t: "Unemployment rate", lvl: "Basics",
    d: "The share of people who want a job but can't find one.",
    body: "The unemployment rate is the number of people actively looking for work, divided by the total labour force. Around 3% is considered 'full employment' - there will always be some people between jobs. It does not count people who aren't looking for work." },
  { id: "purchasingpower", ic: "&#128181;", t: "Purchasing power", lvl: "Everyday",
    d: "What your money can actually buy over time.",
    body: "Purchasing power is the real value of your money. Even if your salary stays the same, inflation quietly shrinks what it can buy. That's why a raise that matches inflation keeps you standing still - to get ahead, income must grow faster than prices." },
  { id: "gini", ic: "&#9878;", t: "The Gini coefficient", lvl: "Deeper",
    d: "One number for how evenly income is shared.",
    body: "The Gini coefficient runs from 0 (everyone earns the same) to 1 (one person earns everything). Malaysia's is around 0.40. Lower is more equal. It helps compare fairness across states and over time, alongside median income." }
];

/* ---- Quiz bank ------------------------------------------------------------ */
window.FAHAMI_QUIZ = [
  { q: "If inflation is 2% this year, RM100 of goods will cost roughly...",
    opts: ["RM98 next year", "RM102 next year", "RM120 next year", "The same, RM100"], a: 1,
    why: "2% inflation means prices rise about 2%, so RM100 becomes about RM102." },
  { q: "When GDP 'grows', it means the country...",
    opts: ["Printed more money", "Produced more goods and services", "Raised taxes", "Borrowed more"], a: 1,
    why: "GDP growth measures a rise in the value of what the economy produces." },
  { q: "Which spending group usually has the biggest weight in Malaysia's CPI?",
    opts: ["Alcohol & tobacco", "Recreation", "Food & housing", "Communication"], a: 2,
    why: "Households spend the most on food and housing, so they move the CPI most." },
  { q: "An unemployment rate near 3% is generally considered...",
    opts: ["A crisis", "Roughly full employment", "Impossible", "Deflation"], a: 1,
    why: "Around 3% is treated as full employment - some job-switching is always normal." },
  { q: "A Gini coefficient closer to 0 means income is...",
    opts: ["More unequal", "More equally shared", "Growing faster", "Falling"], a: 1,
    why: "Gini of 0 is perfect equality; closer to 1 is more unequal." }
];

/* ---- Gamification badges --------------------------------------------------- */
window.FAHAMI_BADGES = [
  { id: "explorer",  m: "&#128269;", name: "Explorer",        hint: "Open the Explainer" },
  { id: "curious",   m: "&#128172;", name: "Curious Mind",    hint: "Ask FAHAMI a question" },
  { id: "personal",  m: "&#129489;", name: "It's Personal",   hint: "Build your snapshot" },
  { id: "player",    m: "&#127918;", name: "Playground Pro",  hint: "Move a Playground slider" },
  { id: "scholar",   m: "&#127891;", name: "Scholar",         hint: "Finish a lesson" },
  { id: "quizwhiz",  m: "&#127942;", name: "Quiz Whiz",       hint: "Score 4/5 on a quiz" }
];
