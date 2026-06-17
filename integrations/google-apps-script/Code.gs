function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(payload.sheet);

    if (!sheet) {
      return jsonResponse({ ok: false, error: 'Sheet not found: ' + payload.sheet });
    }

    switch (payload.type) {
      case 'flockInfo':
        return handleFlockInfo(sheet, payload);
      case 'barnSetup':
        return handleBarnSetup(sheet, payload);
      case 'ventTemps':
        return handleVentTemps(sheet, payload);
      case 'cropFills':
        return handleCropFills(sheet, payload);
      case 'walkThrough':
        return handleWalkThrough(sheet, payload);
      case 'weights':
        return handleWeights(sheet, payload);
      case 'repairs':
        return handleRepairs(sheet, payload);
      default:
        return jsonResponse({ ok: false, error: 'Unknown type: ' + payload.type });
    }
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleFlockInfo(sheet, payload) {
  const ts = payload.timestamp || '';
  (payload.rows || []).forEach(row => {
    sheet.appendRow([
      ts,
      row.quotaPeriod || '',
      row.placementDate || '',
      row.birdCount || '',
      row.processingDate || '',
      row.hatchery || ''
    ]);
  });
  return jsonResponse({ ok: true });
}

function handleBarnSetup(sheet, payload) {
  const ts = payload.timestamp || '';
  (payload.rows || []).forEach(row => {
    sheet.appendRow([
      ts,
      row.task || '',
      row.details || '',
      row.notes || '',
      row.complete || ''
    ]);
  });
  return jsonResponse({ ok: true });
}

function handleVentTemps(sheet, payload) {
  const ts = payload.timestamp || '';
  (payload.rows || []).forEach(row => {
    if (!hasAny(row.barn, row.temp, row.datetime)) return;
    sheet.appendRow([
      ts,
      row.chick || '',
      row.barn || '',
      row.temp || '',
      row.datetime || ''
    ]);
  });
  return jsonResponse({ ok: true });
}

function handleCropFills(sheet, payload) {
  const ts = payload.timestamp || '';
  (payload.rows || []).forEach(row => {
    if (!hasAny(row.barn, row.cropFill, row.datetime)) return;
    sheet.appendRow([
      ts,
      row.chick || '',
      row.barn || '',
      row.cropFill || '',
      row.datetime || ''
    ]);
  });
  return jsonResponse({ ok: true });
}

function handleWalkThrough(sheet, payload) {
  const d = payload.data || {};
  sheet.appendRow([
    payload.timestamp || '',
    d.deads || 0,
    d.flips || 0,
    d.legs || 0,
    d.sick || 0,
    d.small || 0,
    d.deformed || 0,
    d.other || 0,
    d.dailyMortality || 0,
    d.dailyCulls || 0,
    d.totalMortality || 0
  ]);
  return jsonResponse({ ok: true });
}

function handleWeights(sheet, payload) {
  const ts = payload.timestamp || '';
  const overall = payload.overallAverage || '';
  const filled = (payload.rows || []).filter(row =>
    hasAny(row.birds, row.weight, row.avgWeight)
  );

  if (!filled.length) {
    return jsonResponse({ ok: false, error: 'No weight rows to save' });
  }

  filled.forEach(row => {
    sheet.appendRow([
      ts,
      row.bucket || '',
      row.birds || '',
      row.weight || '',
      row.avgWeight || '',
      overall
    ]);
  });

  return jsonResponse({ ok: true });
}

function handleRepairs(sheet, payload) {
  const ts = payload.timestamp || '';
  (payload.rows || []).forEach(row => {
    sheet.appendRow([
      ts,
      row.item || '',
      row.barn || '',
      row.location || '',
      row.issue || '',
      row.materials || '',
      row.status || '',
      row.createdAt || ''
    ]);
  });
  return jsonResponse({ ok: true });
}

function hasAny() {
  for (let i = 0; i < arguments.length; i++) {
    if (String(arguments[i] || '').trim() !== '') return true;
  }
  return false;
}