# Google Sheets Setup

This guide connects the Barn Manager PWA to a Google Spreadsheet using one Apps Script Web App. The app sends JSON `POST` requests; the script routes by `type` and appends rows to the tab named in `sheet`.

## Prerequisites

- Google account with access to Google Sheets and Apps Script
- Barn Manager hosted over **HTTP/HTTPS** (not `file://`)
- Source script in the repo: `integrations/google-apps-script/Code.gs`

---

## 1. Create the spreadsheet

Create a spreadsheet with **10 tabs**. Names must match **exactly**:

| # | Tab name |
|---|----------|
| 1 | `Flock Info` |
| 2 | `Barn 1 Setup` |
| 3 | `Barn 2 Setup` |
| 4 | `Vent Temps` |
| 5 | `Crop Fills` |
| 6 | `Barn 1 Walk Through` |
| 7 | `Barn 2 Walk Through` |
| 8 | `Barn 1 Weights` |
| 9 | `Barn 2 Weights` |
| 10 | `Repairs` |

Optional: **View → Freeze → 1 row** on each tab.

---

## 2. Row 1 headers

Paste these into **row 1** of each tab:

**Flock Info**  
`Submitted At | Quota Period | Placement Date | Bird Count | Ship Date | Hatchery`

**Barn 1 Setup / Barn 2 Setup**  
`Submitted At | Task | Details | Notes | Complete`

**Vent Temps**  
`Submitted At | Chick # | Barn | Temp | Date/Time`

**Crop Fills**  
`Submitted At | Chick # | Barn | Crop Fill | Date/Time`

**Barn 1 Walk Through / Barn 2 Walk Through**  
`Submitted At | Deads | Flips | Legs | Sick | Small | Deformed | Other | Daily Mortality | Daily Culls | Total Mortality`

**Barn 1 Weights / Barn 2 Weights**  
`Submitted At | Bucket # | # of Birds | Weight (g) | Avg Weight | Overall Average`

**Repairs**  
`Submitted At | Item | Barn # | Location | Issue | Materials | Status | Created At`

---

## 3. Install Apps Script

1. In the spreadsheet: **Extensions → Apps Script**
2. Replace the default `Code.gs` with `integrations/google-apps-script/Code.gs` from this repo
3. **Save** the project (e.g. “Barn Manager API”)
4. **Run** any function once and **authorize** when prompted (Spreadsheet access)

---

## 4. Deploy as Web App

1. **Deploy → New deployment**
2. Type: **Web app**
3. Settings:
   - **Execute as:** Me
   - **Who has access:** **Anyone** (required for browser `fetch` from the PWA)
4. **Deploy** and copy the URL (must end with `/exec`)

---

## 5. Connect the app

In `assets/js/app.js`, set:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

Hard refresh the app after changing this value.

---

## 6. After script changes

Each time you edit `Code.gs`:

1. **Deploy → Manage deployments**
2. Edit your deployment → **Version: New version**
3. **Deploy**

The Web App URL stays the same unless you create a **new** deployment.

---

## App → script payload map

| `type` | `sheet` (examples) | Payload shape |
|--------|-------------------|---------------|
| `flockInfo` | `Flock Info` | `{ timestamp, rows: [one object] }` |
| `barnSetup` | `Barn 1 Setup` | `{ timestamp, rows: [...] }` |
| `ventTemps` | `Vent Temps` | `{ timestamp, rows: [...] }` — empty rows skipped |
| `cropFills` | `Crop Fills` | `{ timestamp, rows: [...] }` — empty rows skipped |
| `walkThrough` | `Barn 1 Walk Through` | `{ timestamp, data: {...} }` — **not** `rows` |
| `weights` | `Barn 1 Weights` | `{ timestamp, overallAverage, rows: [...] }` — only filled buckets |
| `repairs` | `Repairs` | `{ timestamp, rows: [...] }` — full local list |

**Reminders** are not exported to Sheets.

### Field reference (common)

**Flock Info row:** `quotaPeriod`, `placementDate`, `birdCount`, `processingDate` (ship date), `hatchery`

**Vent Temps / Crop Fills row:** `chick`, `barn`, `temp` or `cropFill`, `datetime`

**Walk Through `data`:** `deads`, `flips`, `legs`, `sick`, `small`, `deformed`, `other`, `dailyMortality`, `dailyCulls`, `totalMortality`

**Weights row:** `bucket`, `birds`, `weight`, `avgWeight` + top-level `overallAverage`

**Repairs row:** `item`, `barn`, `location`, `issue`, `materials`, `status`, `createdAt`

---

## Weights — Overall Average

- **Per bucket:** `Weight (g) ÷ # of Birds`
- **Overall Average (column F):** `sum(all weights) ÷ sum(all birds)` across filled buckets in that submit
- The same overall value is written on **each bucket row** for that submission (audit-friendly)
- The app only sends buckets that have both birds and weight filled

---

## Repairs — export behavior

- **Submit to Sheet** sends the **entire** repairs list currently in the app
- Rows are **appended** to the `Repairs` tab (audit trail — repeated submits create new rows)
- The app **keeps** the local list after submit (items are not cleared)
- Open repairs appear on the Dashboard To-Do panel; marking completed updates `status` locally

---

## Test a deployment

From a terminal (replace URL and adjust JSON):

```bash
curl -X POST 'YOUR_WEB_APP_URL/exec' \
  -H 'Content-Type: text/plain;charset=utf-8' \
  -d '{"sheet":"Flock Info","type":"flockInfo","timestamp":"2026-06-17 12:00","rows":[{"quotaPeriod":"Q1","placementDate":"2026-01-01","birdCount":"1000","processingDate":"2026-03-01","hatchery":"Test"}]}'
```

Expected response: `{"ok":true}`

In the browser: **DevTools → Network** → POST to `script.google.com` → check response body on failure.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Sheet not found: …` | Tab name typo — compare spreadsheet tab to payload `sheet` |
| CORS / Failed to fetch | Use `http://localhost` or HTTPS hosting; redeploy with **Anyone** |
| Nothing in sheet, no error | Check Network tab response; confirm `{ "ok": true }` |
| `Crop Fills` fails | Tab must be `Crop Fills` (capital F) |
| Walk Through wrong columns | Handler expects `payload.data`, not `rows` |
| Weights missing rows | Only buckets with both birds and weight are sent |
| Duplicate repair rows | By design — each submit appends; filter in Sheets if needed |

---

## Checklist

- [ ] 10 tabs with exact names
- [ ] Header row on every tab
- [ ] `Code.gs` pasted and authorized
- [ ] Web App deployed (**Anyone**)
- [ ] `GOOGLE_SCRIPT_URL` updated in `assets/js/app.js`
- [ ] Tested Flock Info submit from the app
- [ ] Tested at least one Barn 1 / Barn 2 worksheet
