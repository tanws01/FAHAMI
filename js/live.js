/* ============================================================================
   FAHAMI — live.js
   Pulls live official figures from DOSM Open Data (api.data.gov.my) and merges
   them over the bundled fallback. Every call is defensive: if the network is
   unreachable (offline, or opened via file://), the bundled snapshot stands and
   the UI shows a "bundled" data pill instead of "live".

   DOSM feeds are long-format: rows carry a category column (series / division /
   sector / section) and a single value column. Loaders below filter or group by
   that category, and derive year-on-year figures from the index history when the
   API doesn't publish a ready-made growth number.

   Public API:
     window.FAHAMI_LIVE.refresh()  -> Promise, fills window.FAHAMI (the store)
     window.FAHAMI_LIVE.status     -> { source, asOf, ok, checkedAt, error }
     window.FAHAMI                 -> merged data store the UI reads from

   Creator: Tan Wei Siang. Fully owned by Tan Wei Siang.
   Data: Department of Statistics Malaysia (DOSM) — https://open.dosm.gov.my
   ============================================================================ */
(function () {
  const API = "https://api.data.gov.my/data-catalogue";
  const TIMEOUT = 9000;

  // The merged store the whole app reads. Starts as a deep copy of the fallback.
  window.FAHAMI = JSON.parse(JSON.stringify(window.FAHAMI_FALLBACK));

  const status = {
    source: "bundled", ok: false, asOf: window.FAHAMI_FALLBACK.asOf,
    checkedAt: null, error: null, got: []
  };
  window.FAHAMI_LIVE = { status, refresh };

  // params is a raw query string (the '@' in DOSM filters must stay unescaped).
  // DOSM applies `limit` AFTER sorting, so to get the most recent N rows we must
  // sort by -date (newest first) and then reverse to ascending for the caller.
  async function rows(id, params) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT);
    try {
      const r = await fetch(`${API}/?id=${id}&${params}`, { signal: ctrl.signal, headers: { accept: "application/json" } });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      const arr = Array.isArray(j) ? j : (j && j.data) || [];
      // If we requested newest-first, hand back oldest-first so last() = newest.
      return /sort=-date/.test(params) ? arr.slice().reverse() : arr;
    } finally { clearTimeout(t); }
  }

  const num = (v) => (v === null || v === undefined || v === "" || isNaN(+v)) ? null : +v;
  const last = (a) => (a && a.length ? a[a.length - 1] : null);
  const fmtMonth = (d) => { const x = new Date(d); return isNaN(x) ? d : x.toLocaleDateString("en-MY", { month: "short", year: "numeric" }); };
  const fmtQtr = (d) => { const x = new Date(d); return isNaN(x) ? d : x.getFullYear() + "-Q" + (Math.floor(x.getMonth() / 3) + 1); };
  // Year-on-year % from an ascending index series (12 periods = 1 year).
  function yoy(series) {
    if (series.length < 13) return null;
    const now = series[series.length - 1], ago = series[series.length - 13];
    if (!ago) return null;
    return +(((now - ago) / ago) * 100).toFixed(1);
  }

  /* ---- GDP (overall, quarterly) ------------------------------------------ */
  async function loadGDP() {
    const data = await rows("gdp_qtr_real", "sort=-date&limit=60"); // recent quarters x 3 series
    if (!data.length) return;
    const bySeries = {};
    data.forEach((r) => { (bySeries[r.series] = bySeries[r.series] || []).push(r); });
    const g = window.FAHAMI.gdp, take = (s, f) => { const arr = bySeries[s]; if (arr && arr.length) { const v = num(last(arr).value); if (v !== null) f(v, last(arr)); } };
    take("growth_yoy", (v, r) => { g.growth_yoy = +v.toFixed(1); g.quarter = fmtQtr(r.date); });
    take("growth_qoq", (v) => { g.growth_qoq = +v.toFixed(1); });
    take("abs", (v) => { g.abs = Math.round(v); });
    status.got.push("GDP");
  }

  /* ---- GDP by sector ----------------------------------------------------- */
  async function loadGDPSectors() {
    const data = await rows("gdp_qtr_real_supply", "sort=-date&limit=60");
    if (!data.length) return;
    const latestDate = last(data).date;
    const rec = data.filter((r) => r.date === latestDate);
    const names = {
      p1: { name: "Agriculture", emoji: "&#127806;" }, p2: { name: "Mining", emoji: "&#9935;" },
      p3: { name: "Manufacturing", emoji: "&#127981;" }, p4: { name: "Construction", emoji: "&#128679;" },
      p5: { name: "Services", emoji: "&#127978;" }, p6: { name: "Import duties", emoji: "&#128230;" }
    };
    const growth = {}, abs = {};
    rec.forEach((r) => { if (r.series === "growth_yoy") growth[r.sector] = num(r.value); if (r.series === "abs") abs[r.sector] = num(r.value); });
    const total = abs.p0 || Object.keys(names).reduce((s, k) => s + (abs[k] || 0), 0);
    const out = [];
    Object.keys(names).forEach((code) => {
      if (growth[code] != null) out.push({
        code, ...names[code], growth: +growth[code].toFixed(1),
        share: total && abs[code] != null ? +((abs[code] / total) * 100).toFixed(1) : 0
      });
    });
    if (out.length) { out.sort((a, b) => b.share - a.share); window.FAHAMI.gdp.sectors = out; status.got.push("GDP sectors"); }
  }

  /* ---- CPI (headline, all divisions in one pull) ------------------------- */
  async function loadCPI() {
    const data = await rows("cpi_headline", "sort=-date&limit=450");
    if (!data.length) return;
    const byDiv = {};
    data.forEach((r) => { (byDiv[r.division] = byDiv[r.division] || []).push(num(r.index)); });
    const c = window.FAHAMI.cpi;
    const overallRows = data.filter((r) => r.division === "overall");
    if (overallRows.length) {
      const lastR = last(overallRows);
      c.index = +num(lastR.index).toFixed(1);
      c.month = fmtMonth(lastR.date);
      const iy = yoy(byDiv.overall.filter((v) => v != null));
      if (iy != null) c.inflation_yoy = iy;
    }
    const divs = {
      "01": { name: "Food & non-alcoholic drinks", emoji: "&#127858;" }, "02": { name: "Alcohol & tobacco", emoji: "&#127866;" },
      "04": { name: "Housing, water, electricity", emoji: "&#127968;" }, "06": { name: "Health", emoji: "&#129658;" },
      "07": { name: "Transport", emoji: "&#128663;" }, "11": { name: "Restaurants & hotels", emoji: "&#127869;" }
    };
    const out = [];
    Object.keys(divs).forEach((code) => {
      const iy = byDiv[code] ? yoy(byDiv[code].filter((v) => v != null)) : null;
      if (iy != null) out.push({ code, ...divs[code], yoy: iy });
    });
    if (out.length) { out.sort((a, b) => b.yoy - a.yoy); c.divisions = out; }
    status.got.push("CPI");
  }

  /* ---- Core CPI ---------------------------------------------------------- */
  async function loadCore() {
    const data = await rows("cpi_core", "filter=overall@division&sort=-date&limit=40");
    if (!data.length) return;
    const idxs = data.map((r) => num(r.index)).filter((v) => v != null);
    if (idxs.length) window.FAHAMI.cpi.core_index = +last(idxs).toFixed(1);
    const cy = yoy(idxs); if (cy != null) window.FAHAMI.cpi.core_yoy = cy;
  }

  /* ---- Labour force ------------------------------------------------------ */
  async function loadLabour() {
    const data = await rows("lfs_month", "sort=-date&limit=24");
    if (!data.length) return;
    const r = last(data), l = window.FAHAMI.labour;
    if (num(r.u_rate) != null) l.u_rate = +(+r.u_rate).toFixed(1);
    if (num(r.p_rate) != null) l.p_rate = +(+r.p_rate).toFixed(1);
    if (num(r.ep_ratio) != null) l.ep_ratio = +(+r.ep_ratio).toFixed(1);
    if (num(r.lf_employed) != null) l.employed = Math.round(+r.lf_employed);
    if (num(r.lf_unemployed) != null) l.unemployed = Math.round(+r.lf_unemployed);
    if (r.date) l.month = fmtMonth(r.date);
    status.got.push("Labour");
  }

  /* ---- Population (pick the fully-aggregated row) ------------------------ */
  async function loadPopulation() {
    const data = await rows("population_malaysia", "sort=-date&limit=60"); // returned ascending
    if (!data.length) return;
    const agg = data.filter((x) => x.age === "overall" && x.sex === "both" && x.ethnicity === "overall");
    const r = last(agg); // newest aggregated row
    if (r && num(r.population) != null) {
      window.FAHAMI.population.total = +(+r.population).toFixed(1);
      window.FAHAMI.population.year = new Date(r.date).getFullYear();
      status.got.push("Population");
    }
  }

  /* ---- External trade (overall section; API values are in RM, -> RM mil) - */
  async function loadTrade() {
    const data = await rows("trade_sitc_1d", "filter=overall@section&sort=-date&limit=40");
    if (!data.length) return;
    const r = last(data), t = window.FAHAMI.trade, M = 1e6;
    const e = num(r.exports), im = num(r.imports);
    if (e != null) t.exports = Math.round(e / M);
    if (im != null) t.imports = Math.round(im / M);
    if (e != null && im != null) t.balance = Math.round((e - im) / M);
    if (r.date) t.month = fmtMonth(r.date);
    if (e != null || im != null) status.got.push("Trade");
  }

  /* ---- Household income by state (no national aggregate in this feed) ---- */
  async function loadStates() {
    const data = await rows("hies_state", "sort=date&limit=400");
    if (!data.length) return;
    const byState = {};
    data.forEach((r) => { if (r.state) byState[r.state] = r; }); // ascending -> keeps newest
    const emojiFor = (name) => { const h = window.FAHAMI_STATES.find((s) => s.key === name); return h ? h.emoji : "&#127465;"; };
    const out = [];
    Object.keys(byState).forEach((st) => {
      const r = byState[st], median = num(r.income_median), mean = num(r.income_mean);
      if (median == null && mean == null) return;
      out.push({ key: st, emoji: emojiFor(st), median: median != null ? Math.round(median) : null,
        mean: mean != null ? Math.round(mean) : null, gini: num(r.gini), poverty: num(r.poverty) });
    });
    if (out.length >= 5) {
      out.sort((a, b) => (b.median || 0) - (a.median || 0));
      // This feed has no "Malaysia" row; keep the national fallback row on top.
      const nat = window.FAHAMI_STATES.find((s) => /malaysia/i.test(s.key));
      window.FAHAMI_STATES = nat ? [nat, ...out] : out;
      status.got.push("States");
    }
  }

  /* ---- Orchestrator ------------------------------------------------------ */
  async function refresh() {
    const results = await Promise.allSettled([
      loadGDP(), loadGDPSectors(), loadCPI(), loadCore(),
      loadLabour(), loadPopulation(), loadTrade(), loadStates()
    ]);
    const anyOk = status.got.length > 0;
    status.ok = anyOk;
    status.source = anyOk ? "live" : "bundled";
    status.checkedAt = new Date();
    const failed = results.filter((r) => r.status === "rejected");
    status.error = anyOk ? null : (failed[0] && failed[0].reason && String(failed[0].reason.message || failed[0].reason)) || "unreachable";
    if (anyOk) status.asOf = `${window.FAHAMI.gdp.quarter} GDP - ${window.FAHAMI.cpi.month} CPI`;
    return status;
  }
})();
