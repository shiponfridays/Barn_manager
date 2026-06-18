# Barn Manager

A static progressive web app for daily barn operations. Track flock details, barn setup, brooding, walk-throughs, weights, repairs, and reminders. Data is saved in the browser and exported to Google Sheets through a single Apps Script Web App.

## Quick start

```bash
npx serve .
```

Open **http://localhost:3000** (use `http://` or `https://` — not `file://`).

1. Enter the 4-digit access code on the login screen and press enter.
2. Use the **Dashboard** to open any worksheet.
3. Fill in data — it autosaves to `localStorage`.
4. Click **Submit** (or **Submit to Sheet**) to append a snapshot to Google Sheets.

## Features

| Area | What it does |
|------|----------------|
| **Login** | Single passcode keypad gate before entering the app |
| **Dashboard** | Flock summary, worksheet tiles, To-Do (open repairs), Reminders |
| **Flock Info** | Quota period, placement/ship dates, bird count, hatchery |
| **Barn Setup** | Pre-placement checklist per barn (Barn 1 / Barn 2 tabs) |
| **Brooding** | Vent temps and crop fills (10 chick rows per barn) |
| **Walk Through** | Daily mortality counters per barn |
| **Weights** | Bucket weights with per-bucket and overall averages |
| **Repairs** | Add repairs locally, paginated list, export full list to sheet |
| **Reminders** | Local notes with optional due dates (no sheet export) |

### UX

- **Animated chicken loader** — shown while any sheet submit is in progress
- **Toast notifications** — success / warning / error messages (top-center, 5s auto-dismiss with countdown)
- **Dashboard preview** — To-Do and Reminders show up to **5** items; **View all** links to the full page when there are more
- **In-app validation** — required fields use red borders and inline messages (no browser `alert()`)
- **Offline-friendly PWA** — service worker caches app shell and assets

## Project layout

```
barn-manager/
├── index.html                    # Login entry
├── manifest.json                 # PWA manifest
├── sw.js                         # Service worker
├── README.md
├── assets/
│   ├── css/style.css             # Global styles (Natural Minimalist theme)
│   ├── images/                   # farm-bg.jpg, farm-bg1.jpg (set via --bg-image), favicons
│   └── js/
│       ├── app.js                # Shared: storage, Sheets API, UI helpers, loader, toasts
│       └── pages/                # One script per screen
│           ├── login.js
│           ├── dashboard.js
│           ├── flock-info.js
│           ├── barn-setup.js
│           ├── brooding.js
│           ├── walkthrough.js
│           ├── weights.js
│           ├── repairs.js
│           └── reminders.js
├── pages/                        # App HTML screens
│   ├── dashboard.html
│   ├── flock-info.html
│   ├── barn-setup.html
│   ├── brooding.html
│   ├── walkthrough.html
│   ├── weights.html
│   ├── repairs.html
│   └── reminders.html
├── integrations/
│   └── google-apps-script/
│       └── Code.gs               # Sheets backend (copy into your spreadsheet)
└── docs/
    └── google-sheets-setup.md    # Spreadsheet tabs, headers, deployment
```

## Google Sheets integration

Nine worksheets export to Google Sheets. **Reminders** stay local only.

| App page | Sheet tab(s) | Submit button |
|----------|--------------|---------------|
| Flock Info | `Flock Info` | Submit to Sheet |
| Barn Setup | `Barn 1 Setup` / `Barn 2 Setup` | Submit (per tab) |
| Brooding → Vent Temps | `Vent Temps` | Submit |
| Brooding → Crop Fills | `Crop Fills` | Submit |
| Walk Through | `Barn 1 Walk Through` / `Barn 2 Walk Through` | Submit (per tab) |
| Weights | `Barn 1 Weights` / `Barn 2 Weights` | Submit (per tab) |
| Repairs | `Repairs` | Submit to Sheet |

Full setup: [docs/google-sheets-setup.md](docs/google-sheets-setup.md)

After deploying the Apps Script Web App, set the URL in `assets/js/app.js`:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

## Local data (`localStorage`)

| Key | Contents |
|-----|----------|
| `flock_info_current` | Flock Info form object |
| `repairs_full_list` | All repair rows (open + completed) |
| `reminders_items` | Reminder list |
| `barn_setup_barn1` / `barn_setup_barn2` | Barn setup checklist rows |
| `brooding_vent_rows` / `brooding_crop_rows` | Brooding table data |
| `walkthrough_barn1` / `walkthrough_barn2` | Walk-through counters |
| `weights_barn1` / `weights_barn2` | Weight bucket rows |

Repairs **remain in the app after submit** — export appends rows to the sheet without clearing the local list.

## Deployment

Host the project root on any static host (Netlify, GitHub Pages, internal server, etc.). Requirements:

- Served over **HTTP/HTTPS** (required for `fetch` to Google Apps Script)
- Apps Script Web App deployed with **Who has access: Anyone**

## Development notes

- Hard refresh or use incognito if the service worker serves stale files after updates.
- Sheet tab names must match **exactly** (spaces and capitalization).
- Bump `CACHE_NAME` in `sw.js` when you need clients to pick up asset changes.
- `# of Birds` on Flock Info is required before submit.
- **Access code** is set in `assets/js/pages/login.js` (`CORRECT_CODE`). This is a light client-side gate only — the code is visible in source, so it is not real security.
- **Theme / background:** colors live in the `:root` tokens in `assets/css/style.css`; swap the background photo by changing the `--bg-image` token (currently `farm-bg1.jpg`).

## Troubleshooting

| Problem | Likely fix |
|---------|------------|
| Submit fails / “Failed to fetch” | Run via `http://localhost`, not `file://` |
| `Sheet not found` | Tab name in spreadsheet must match app payload exactly |
| Stale UI after code changes | Hard refresh; clear site data or unregister service worker |
| Weights differ from form | Submit reads live table values; only filled buckets are sent |
| Repairs list empty after submit | Fixed — list is kept locally; re-export appends again to sheet |
