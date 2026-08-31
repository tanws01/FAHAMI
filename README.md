# FAHAMI

**Fahami Ekonomi Malaysia** - Understand Malaysia's Economy.

FAHAMI turns Malaysia's official economic data from **DOSM Open Data** (Department
of Statistics Malaysia) into simple, visual, interactive and personalised insights.
It takes one headline number - "Malaysia grew 6%" - and walks you from *what does
this mean?* all the way to *what does it mean for me?*

Created by **Tan Wei Siang**. Fully owned by Tan Wei Siang.

---

## Run it

FAHAMI fetches **live** data from DOSM, so it must be served over `http://`
(opening `index.html` directly with `file://` blocks the fetch and it falls back
to bundled figures).

**Windows - easiest:** double-click **`serve.cmd`**, then open
<http://localhost:5273>. It uses Python if present, otherwise a built-in
PowerShell server (`serve.ps1`) that needs nothing installed.

**Any OS with Python:**

```bash
python -m http.server 5273
# then open http://localhost:5273
```

Press `Ctrl+C` in the terminal to stop.

---

## What's inside

| Screen | What it does |
| --- | --- |
| **Landing** | The "Magic Moment" - one headline, then a guided tour |
| **Economy at a Glance** | GDP, inflation, jobs, income, trade, population in six cards |
| **AI Explainer** | Plain-English "what it means / what it doesn't / why you care" |
| **Ask FAHAMI** | Type a question; get an answer grounded in DOSM figures |
| **My Economy** | Your income + state + life stage -> a personal snapshot |
| **Playground** | Move policy levers, watch the economic chain reaction |
| **Malaysia vs Your State** | Compare your state's income against the nation |
| **MADANI Tracker** | Live indicators vs Ekonomi MADANI reference targets |
| **Learn + Quiz** | Bite-sized lessons, a quiz, and collectable badges |

Fully translated into four languages - English, Bahasa Melayu, Chinese (Simplified)
and Tamil - covering not just the chrome but every generated explanation, lesson,
quiz and snapshot. Light + dark theme, and a live/bundled data-source pill in the
header. Proper nouns (FAHAMI, DOSM, MADANI, RM, state names) stay as-is in every
language via an English fallback.

## About the "AI"

FAHAMI's explanations are generated **on your device** by a deterministic,
data-grounded template engine that follows a *Source -> Data -> Plain-English*
pattern. There is **no external AI model and no API key**, and nothing you type is
sent anywhere. Every number FAHAMI states is traceable to an official DOSM
statistic. This keeps FAHAMI fully self-contained and honest about its sources.

## Data source

- **DOSM Open Data** - <https://open.dosm.gov.my> (`api.data.gov.my`)
- Datasets: quarterly real GDP + by sector, headline & core CPI, labour force,
  population, external trade, and household income by state.
- When the API is unreachable, FAHAMI shows clearly-labelled bundled figures.

## Tech

Vanilla HTML + CSS + JavaScript. No build step, no dependencies, no backend, no
database. Design language mirrored from the sibling **KAYA** project.

- `index.html` - app shell and all screens
- `css/styles.css` - the full design system (light/dark, fun layer)
- `js/data.js` - bundled fallback figures + labels, targets, lessons, quiz
- `js/live.js` - DOSM Open Data fetch + graceful fallback
- `js/ai.js` - the on-device explanation engine + Ask FAHAMI
- `js/fahami.js` - UI controller (screens, charts, gamification, theme, i18n)

## Privacy

Everything runs in your browser. No sign-up, no cookies for tracking, no server
storing your inputs. Your income and preferences stay on your device
(`localStorage`) for theme, language and badges only.

---

*Data: Department of Statistics Malaysia (DOSM). FAHAMI is an independent
educational project and is not affiliated with or endorsed by DOSM or the
Government of Malaysia. Figures are for education, not financial advice.*
