/* ============================================================================
   FAHAMI — ai.js
   The "AI" layer. FAHAMI's explanations are generated on-device by a
   deterministic, data-grounded template engine: every answer is built from the
   live DOSM figures in window.FAHAMI, following a Source -> Data -> Plain-English
   pattern. There is NO external model or API key. All prose comes from the
   four-language dictionary in i18n.js (window.FAHAMI_T), so the same figures are
   explained in English, Malay, Chinese or Tamil.

   Public API:
     FAHAMI_AI.explain(topic)        -> { title, source, dataLine, body, tone, notMean, care }
     FAHAMI_AI.ask(text)             -> free-text intent match
     FAHAMI_AI.answerIntent(intent)  -> answer keyed by a suggestion intent
     FAHAMI_AI.headline()            -> the "Magic Moment" headline object
     FAHAMI_AI.topics() / .SUGGESTIONS()

   Creator: Tan Wei Siang. Fully owned by Tan Wei Siang.
   ============================================================================ */
(function () {
  const D = () => window.FAHAMI;
  const T = (k, v) => window.FAHAMI_T(k, v);

  const rm = (n) => "RM" + Number(n).toLocaleString("en-MY");
  const pct = (n) => (n > 0 ? "+" : "") + n + "%";
  const feelWord = (v, good, bad) => T(v <= good ? "word.feelHealthy" : v >= bad ? "word.feelHigh" : "word.feelModerate");
  const sectorName = (s) => (s.code ? T("sector." + s.code) : s.name);

  /* ---- Headline (drives the landing "Magic Moment") ---------------------- */
  function headline() {
    const g = D().gdp.growth_yoy;
    const moodKey = g >= 5 ? "mood.solid" : g >= 3 ? "mood.steady" : g > 0 ? "mood.slow" : "mood.contracting";
    return {
      big: T("headline.big", { gp: pct(g) }),
      sub: T("headline.sub", { q: D().gdp.quarter, mood: T(moodKey) }),
      g
    };
  }

  /* ---- Structured explainers (used by the AI Explainer screen) ----------- */
  const EXPLAINERS = {
    gdp() {
      const g = D().gdp, top = g.sectors[0];
      return {
        title: T("explainers.gdp.title", { gp: pct(g.growth_yoy) }),
        source: T("explainers.gdp.source"),
        dataLine: T("explainers.gdp.dataLine", { q: g.quarter, gp: pct(g.growth_yoy), gq: pct(g.growth_qoq) }),
        tone: g.growth_yoy >= 4 ? "ok" : "",
        body: T("explainers.gdp.body", {
          gp: pct(g.growth_yoy), top: sectorName(top),
          topDir: T(top.growth >= 0 ? "word.grew" : "word.shrank"), tgp: pct(top.growth)
        }),
        notMean: T("explainers.gdp.notMean"),
        care: T("explainers.gdp.care")
      };
    },
    inflation() {
      const c = D().cpi;
      return {
        title: T("explainers.inflation.title"),
        source: T("explainers.inflation.source"),
        dataLine: T("explainers.inflation.dataLine", { m: c.month, ip: pct(c.inflation_yoy), idx: c.index }),
        tone: c.inflation_yoy <= 3 ? "ok" : "alert",
        body: T("explainers.inflation.body", {
          ip: pct(c.inflation_yoy), ir: c.inflation_yoy, feel: feelWord(c.inflation_yoy, 2.5, 4),
          rm100: rm(100), rmNow: rm((100 * (1 + c.inflation_yoy / 100)).toFixed(2)), cp: pct(c.core_yoy)
        }),
        notMean: T("explainers.inflation.notMean"),
        care: T("explainers.inflation.care")
      };
    },
    unemployment() {
      const l = D().labour;
      return {
        title: T("explainers.unemployment.title"),
        source: T("explainers.unemployment.source"),
        dataLine: T("explainers.unemployment.dataLine", { m: l.month, u: l.u_rate, p: l.p_rate }),
        tone: l.u_rate <= 3.5 ? "ok" : "alert",
        body: T("explainers.unemployment.body", { u: l.u_rate, feel: feelWord(l.u_rate, 3.5, 5), emp: (l.employed / 1000).toFixed(1) }),
        notMean: T("explainers.unemployment.notMean"),
        care: T("explainers.unemployment.care")
      };
    },
    income() {
      const i = D().income;
      return {
        title: T("explainers.income.title"),
        source: T("explainers.income.source"),
        dataLine: T("explainers.income.dataLine", { med: rm(i.median), mean: rm(i.mean) }),
        tone: "",
        body: T("explainers.income.body", { med: rm(i.median), mean: rm(i.mean), gini: i.gini }),
        notMean: T("explainers.income.notMean"),
        care: T("explainers.income.care")
      };
    },
    trade() {
      const tr = D().trade, surplus = tr.balance >= 0;
      return {
        title: T("explainers.trade.title"),
        source: T("explainers.trade.source"),
        dataLine: T("explainers.trade.dataLine", { m: tr.month, ex: rm(tr.exports), im: rm(tr.imports) }),
        tone: surplus ? "ok" : "alert",
        body: T("explainers.trade.body", {
          m: tr.month, ex: rm(tr.exports), im: rm(tr.imports),
          balWord: T(surplus ? "word.surplus" : "word.deficit"), absBal: rm(Math.abs(tr.balance)),
          balSentence: T(surplus ? "word.tradePos" : "word.tradeNeg")
        }),
        notMean: T("explainers.trade.notMean"),
        care: T("explainers.trade.care")
      };
    }
  };

  function explain(topic) { return (EXPLAINERS[topic] || EXPLAINERS.gdp)(); }
  function topics() {
    return [
      { key: "gdp", ic: "&#128200;", label: T("topic.gdp") },
      { key: "inflation", ic: "&#127925;", label: T("topic.inflation") },
      { key: "unemployment", ic: "&#128188;", label: T("topic.unemployment") },
      { key: "income", ic: "&#128176;", label: T("topic.income") },
      { key: "trade", ic: "&#128674;", label: T("topic.trade") }
    ];
  }

  /* ---- Reusable answer builders ------------------------------------------ */
  function topicAnswer(topic) {
    const e = explain(topic);
    return { intent: topic, source: e.source, dataLine: e.dataLine, body: e.body };
  }
  function ppowerAnswer(amt) {
    const infl = D().cpi.inflation_yoy;
    const eroded = (amt * (1 - infl / 100)).toFixed(2);
    return {
      intent: T("askr.ppIntent"), source: T("askr.ppSource"),
      dataLine: T("askr.ppData", { ip: pct(infl), m: D().cpi.month }),
      body: T("askr.ppBody", { ip: pct(infl), amt: rm(amt), eroded: rm(eroded) })
    };
  }
  function statesAnswer() {
    const s = window.FAHAMI_STATES;
    const top = s.slice(1).reduce((a, b) => ((b.median || 0) > (a.median || 0) ? b : a), s[1] || s[0]);
    return {
      intent: T("askr.stIntent"), source: T("askr.stSource"),
      dataLine: T("askr.stData", { state: top.key, med: rm(top.median) }),
      body: T("askr.stBody", { state: top.key, med: rm(top.median), natMed: rm(D().income.median) })
    };
  }
  function small(body) { return { intent: "help", source: "DOSM Open Data", dataLine: null, body }; }

  /* ---- Suggestions carry an intent, so they work in every language ------- */
  function answerIntent(intent) {
    if (intent === "ppower") return ppowerAnswer(100);
    if (intent === "states") return statesAnswer();
    return topicAnswer(intent);
  }
  function SUGGESTIONS() { return T("suggest"); }

  /* ---- Ask FAHAMI: light intent matching over the same data -------------- */
  const INTENTS = [
    { keys: ["grow", "gdp", "economy doing", "how is the economy", "recession", "ekonomi", "berkembang"], topic: "gdp" },
    { keys: ["inflation", "expensive", "price", "cost of living", "cpi", "harga", "inflasi", "mahal"], topic: "inflation" },
    { keys: ["job", "unemploy", "work", "hiring", "kerja", "pekerjaan", "menganggur"], topic: "unemployment" },
    { keys: ["income", "salary", "earn", "wage", "gaji", "median", "household", "pendapatan"], topic: "income" },
    { keys: ["trade", "export", "import", "sell", "buy", "dagangan", "eksport", "import"], topic: "trade" }
  ];

  function ask(textRaw) {
    const text = (textRaw || "").toLowerCase().trim();
    if (!text) return small(T("askr.helpDefault"));

    const money = text.match(/rm\s?(\d[\d,]*)/);
    if (money && /(worth|enough|buy|value|afford|nilai|baloi)/.test(text)) {
      return ppowerAnswer(+money[1].replace(/,/g, ""));
    }
    if (/(state|negeri|richest|poorest|compare|banding)/.test(text)) return statesAnswer();

    let hit = null;
    for (const it of INTENTS) if (it.keys.some((k) => text.includes(k))) { hit = it; break; }
    if (!hit) return small(T("askr.helpFallback"));
    return topicAnswer(hit.topic);
  }

  window.FAHAMI_AI = { explain, topics, ask, answerIntent, headline, SUGGESTIONS };
})();
