function goTo(page) {
  const inPages = window.location.pathname.includes('/pages/');
  let target = page;

  if (!/^https?:\/\//.test(page) && !page.startsWith('../') && !page.includes('/')) {
    target = inPages ? page : `pages/${page}`;
  }

  window.location.href = target;
}

const AUTH_SESSION_KEY = 'barn_manager_authenticated';

function isAuthenticated() {
  try {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function setAuthenticated() {
  try {
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
  } catch (e) {
    console.warn('Unable to save auth session', e);
  }
}

function clearAuthentication() {
  try {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  } catch (e) {
    console.warn('Unable to clear auth session', e);
  }
}

function isProtectedAppPage() {
  return /\/pages\//.test(window.location.pathname);
}

function getLoginPageUrl() {
  return isProtectedAppPage() ? '../index.html' : 'index.html';
}

function requireAuth() {
  if (!isProtectedAppPage()) return true;
  if (isAuthenticated()) return true;
  window.location.replace(getLoginPageUrl());
  return false;
}

(function enforceAuthGate() {
  requireAuth();
})();

function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Unable to save state', key, e);
  }
}

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Unable to load state', key, e);
    return fallback;
  }
}

const REPAIRS_LIST_KEY = 'repairs_full_list';

function repairEntryMatches(a, b) {
  return a.item === b.item && a.createdAt === b.createdAt;
}

function getOpenRepairs() {
  return loadState(REPAIRS_LIST_KEY, []).filter(r => (r.status || 'Open') === 'Open');
}

function setFieldError(groupEl, message) {
  if (!groupEl) return;
  groupEl.classList.add('has-error');
  groupEl.querySelectorAll('input, textarea').forEach(el => el.classList.add('is-invalid'));
  groupEl.querySelectorAll('.custom-select').forEach(el => el.classList.add('is-invalid'));

  let err = groupEl.querySelector('.field-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'field-error';
    err.setAttribute('role', 'alert');
    groupEl.appendChild(err);
  }
  err.textContent = message;
}

function clearFieldError(groupEl) {
  if (!groupEl) return;
  groupEl.classList.remove('has-error');
  groupEl.querySelectorAll('input, textarea').forEach(el => el.classList.remove('is-invalid'));
  groupEl.querySelectorAll('.custom-select').forEach(el => el.classList.remove('is-invalid'));
  const err = groupEl.querySelector('.field-error');
  if (err) err.remove();
}

function clearFormFieldErrors(formEl) {
  if (!formEl) return;
  formEl.querySelectorAll('.field-group').forEach(clearFieldError);
  formEl.classList.remove('has-form-errors');
}

let completeModalCallback = null;
let completeModalReady = false;

function initCompleteModal() {
  if (completeModalReady) return;

  const modal = document.getElementById('completeReminderModal');
  const cancelBtn = document.getElementById('completeReminderCancel');
  const confirmBtn = document.getElementById('completeReminderConfirm');
  if (!modal || !cancelBtn || !confirmBtn) return;

  cancelBtn.addEventListener('click', closeCompleteModal);
  confirmBtn.addEventListener('click', () => {
    const callback = completeModalCallback;
    closeCompleteModal();
    if (callback) callback();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCompleteModal();
  });

  completeModalReady = true;
}

function openCompleteModal({ title = 'Complete?', text, onConfirm }) {
  const modal = document.getElementById('completeReminderModal');
  const titleEl = document.getElementById('completeReminderModalTitle');
  const textEl = document.getElementById('completeReminderModalText');
  if (!modal || !titleEl || !textEl) return;

  titleEl.textContent = title;
  textEl.textContent = text;
  completeModalCallback = onConfirm;
  modal.style.display = 'flex';

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons({ root: modal });
  }

  document.getElementById('completeReminderCancel')?.focus();
}

function closeCompleteModal() {
  completeModalCallback = null;
  const modal = document.getElementById('completeReminderModal');
  if (modal) modal.style.display = 'none';
}

let actionConfirmCallback = null;
let actionConfirmModalReady = false;

function initActionConfirmModal() {
  if (actionConfirmModalReady) return;

  const modal = document.getElementById('actionConfirmModal');
  const cancelBtn = document.getElementById('actionConfirmCancel');
  const confirmBtn = document.getElementById('actionConfirmConfirm');
  if (!modal || !cancelBtn || !confirmBtn) return;

  cancelBtn.addEventListener('click', closeActionConfirmModal);
  confirmBtn.addEventListener('click', () => {
    const callback = actionConfirmCallback;
    closeActionConfirmModal();
    if (callback) callback();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeActionConfirmModal();
  });

  actionConfirmModalReady = true;
}

function openActionConfirmModal({ title, text, confirmLabel = 'Confirm', onConfirm }) {
  const modal = document.getElementById('actionConfirmModal');
  const titleEl = document.getElementById('actionConfirmModalTitle');
  const textEl = document.getElementById('actionConfirmModalText');
  const confirmBtn = document.getElementById('actionConfirmConfirm');
  if (!modal || !titleEl || !textEl || !confirmBtn) return;

  titleEl.textContent = title;
  textEl.textContent = text;
  confirmBtn.textContent = confirmLabel;
  actionConfirmCallback = onConfirm;
  modal.style.display = 'flex';

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons({ root: modal });
  }

  document.getElementById('actionConfirmCancel')?.focus();
}

function closeActionConfirmModal() {
  actionConfirmCallback = null;
  const modal = document.getElementById('actionConfirmModal');
  if (modal) modal.style.display = 'none';
}

function getTodayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDateTime(dt = new Date()) {
  const d = dt;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}

function calcBucketAvgWeight(birds, weight) {
  const birdCount = parseFloat(birds);
  const totalWeight = parseFloat(weight);
  if (!birds || !weight || isNaN(birdCount) || isNaN(totalWeight) || birdCount <= 0 || totalWeight <= 0) {
    return '';
  }
  return (totalWeight / birdCount).toFixed(2);
}

function isFilledWeightRow(row) {
  const birds = String(row.birds || '').trim();
  const weight = String(row.weight || '').trim();
  return birds !== '' && weight !== '';
}

function computeWeightsOverallAverage(rows) {
  let totalBirds = 0;
  let totalWeight = 0;

  for (const row of rows) {
    if (!isFilledWeightRow(row)) continue;
    const birds = parseFloat(row.birds);
    const weight = parseFloat(row.weight);
    if (isNaN(birds) || birds <= 0 || isNaN(weight) || weight <= 0) continue;
    totalBirds += birds;
    totalWeight += weight;
  }

  return totalBirds > 0 ? (totalWeight / totalBirds).toFixed(2) : '0.00';
}

function calculateBirdAgeDays(placementDate) {
  if (!placementDate) return '';
  const start = new Date(placementDate + 'T00:00:00');
  const now = new Date();
  const diffMs = now - start;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (isNaN(days) || days < 0) return '0';
  return String(days);
}

const CHICKEN_ICON_SVG = `
  <ellipse cx="17.2" cy="14.2" rx="2.1" ry="3" fill="#f0ece4"/>
  <ellipse cx="11.8" cy="15.8" rx="6.6" ry="5.4" fill="#fdfbf7" stroke="#d8d2c8" stroke-width="0.45"/>
  <path d="M8.8 12.2c1.2 2.2 3 3.4 5.2 3.4" stroke="#ebe6dd" stroke-width="0.55" fill="none" stroke-linecap="round"/>
  <ellipse cx="11.8" cy="8.9" rx="3.55" ry="3.35" fill="#8f5e42"/>
  <path d="M8.6 6.4c.15-1 .65-1.55 1.15-1.15.25-.85.85-1.05 1.35-.35.3-.75.95-.9 1.35-.2.35-.65.95-.55 1.2-.05" fill="#e04242"/>
  <ellipse cx="10.2" cy="10.35" rx="0.9" ry="1.2" fill="#e04242"/>
  <ellipse cx="13.4" cy="10.35" rx="0.9" ry="1.2" fill="#e04242"/>
  <path d="M10.95 9.55 L11.8 11.75 L12.65 9.55 Z" fill="#f2a024"/>
  <path d="M11.15 9.55 L11.8 10.35 L12.45 9.55 Z" fill="#d88a18"/>
  <circle cx="10.35" cy="8.25" r="0.88" fill="#252525"/>
  <circle cx="13.25" cy="8.25" r="0.88" fill="#252525"/>
  <circle cx="10.62" cy="7.88" r="0.3" fill="#ffffff"/>
  <circle cx="13.52" cy="7.88" r="0.3" fill="#ffffff"/>
  <path d="M9.8 20.4v2.35" stroke="#ef9a2e" stroke-width="1.35" stroke-linecap="round"/>
  <path d="M13.8 20.4v2.35" stroke="#ef9a2e" stroke-width="1.35" stroke-linecap="round"/>
  <path d="M8.55 22.35h2.15" stroke="#ef9a2e" stroke-width="1.15" stroke-linecap="round"/>
  <path d="M12.55 22.35h2.15" stroke="#ef9a2e" stroke-width="1.15" stroke-linecap="round"/>
`;

function createChickenIcon(size = 24) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon icon-chicken');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = CHICKEN_ICON_SVG;
  return svg;
}

function initChickenIcons() {
  document.querySelectorAll('[data-icon="chicken"]').forEach(slot => {
    const size = parseInt(slot.getAttribute('data-size') || '24', 10);
    slot.replaceWith(createChickenIcon(size));
  });
}

const CHICKEN_LOADER_SVG = `
  <ellipse class="cl-ground" cx="60" cy="101" rx="30" ry="5.5" fill="rgba(63,78,92,0.14)"/>
  <g class="cl-rig">
    <g class="cl-tail">
      <path d="M26 62 L14 50 L20 60 L12 54 L22 66 Z" fill="#6d4a32"/>
      <path d="M28 64 L18 58 L24 66 Z" fill="#8f5e42"/>
      <path d="M30 66 L22 62 L28 68 Z" fill="#a97262"/>
    </g>
    <ellipse class="cl-body" cx="50" cy="70" rx="23" ry="19" fill="#fdfbf7" stroke="#d8d2c8" stroke-width="1"/>
    <path d="M34 58 Q50 52 66 58" stroke="#ebe6dd" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <g class="cl-wing">
      <ellipse cx="56" cy="66" rx="14" ry="9" fill="#f5f0e8" stroke="#d8d2c8" stroke-width="0.9"/>
      <path d="M44 64 Q56 56 68 66" stroke="#e0dbd2" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      <path d="M46 68 Q56 62 66 70" stroke="#ebe6dd" stroke-width="0.5" fill="none" stroke-linecap="round"/>
    </g>
    <g class="cl-legs">
      <path class="cl-leg cl-leg-left" d="M42 88 v11" stroke="#ef9a2e" stroke-width="2.8" stroke-linecap="round"/>
      <path class="cl-leg cl-leg-right" d="M56 88 v11" stroke="#ef9a2e" stroke-width="2.8" stroke-linecap="round"/>
      <path class="cl-toe cl-toe-left" d="M38 99 h9" stroke="#ef9a2e" stroke-width="2.2" stroke-linecap="round"/>
      <path class="cl-toe cl-toe-right" d="M52 99 h9" stroke="#ef9a2e" stroke-width="2.2" stroke-linecap="round"/>
    </g>
    <g class="cl-head">
      <ellipse cx="78" cy="54" rx="15" ry="14" fill="#8f5e42"/>
      <path class="cl-comb" d="M69 40 C71 30 75 32 78 38 C81 30 85 32 87 40 C85 35 81 35 78 40 C75 35 71 35 69 40 Z" fill="#e04242"/>
      <ellipse cx="71" cy="56" rx="4" ry="5" fill="#e04242"/>
      <ellipse cx="85" cy="56" rx="4" ry="5" fill="#e04242"/>
      <path d="M75 50 L78 58 L81 50 Z" fill="#f2a024"/>
      <path d="M75.5 50 L78 53 L80.5 50 Z" fill="#d88a18"/>
      <circle cx="72" cy="50" r="3.2" fill="#252525"/>
      <circle cx="84" cy="50" r="3.2" fill="#252525"/>
      <circle cx="73.1" cy="48.9" r="1.1" fill="#ffffff"/>
      <circle cx="85.1" cy="48.9" r="1.1" fill="#ffffff"/>
    </g>
  </g>
  <g class="cl-spark cl-spark-1" aria-hidden="true"><circle cx="92" cy="72" r="2" fill="#b6b8a5" opacity="0.5"/></g>
  <g class="cl-spark cl-spark-2" aria-hidden="true"><circle cx="96" cy="78" r="1.5" fill="#9bb5ad" opacity="0.45"/></g>
  <g class="cl-spark cl-spark-3" aria-hidden="true"><circle cx="88" cy="80" r="1.2" fill="#b6b8a5" opacity="0.4"/></g>
`;

let submitLoadingCount = 0;

function ensureSubmitLoadingOverlay() {
  let overlay = document.getElementById('submitLoadingOverlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'submitLoadingOverlay';
  overlay.className = 'submit-loading-overlay';
  overlay.setAttribute('role', 'alertdialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'submitLoadingTitle');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="submit-loading-card">
      <div class="chicken-loader" aria-hidden="true">
        <svg class="chicken-loader-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          ${CHICKEN_LOADER_SVG}
        </svg>
      </div>
      <p class="submit-loading-title" id="submitLoadingTitle">Saving to sheet…</p>
      <p class="submit-loading-sub">Your chicken is on the way to Google Sheets</p>
      <div class="submit-loading-progress" aria-hidden="true">
        <div class="submit-loading-progress-bar"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function showSubmitLoading(message = 'Saving to sheet…') {
  submitLoadingCount += 1;
  const overlay = ensureSubmitLoadingOverlay();
  const title = overlay.querySelector('.submit-loading-title');
  if (title) title.textContent = message;
  overlay.classList.add('is-visible');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('submit-loading-active');
}

function hideSubmitLoading() {
  submitLoadingCount = Math.max(0, submitLoadingCount - 1);
  if (submitLoadingCount > 0) return;

  const overlay = document.getElementById('submitLoadingOverlay');
  if (!overlay) return;

  overlay.classList.remove('is-visible');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('submit-loading-active');
}

function getSubmitLoadingMessage(payload) {
  if (payload && payload.sheet) return `Saving to ${payload.sheet}…`;
  return 'Saving to sheet…';
}

const TOAST_DEFAULT_DURATION = 5000;

const TOAST_ICONS = {
  success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12.5 2.5 2.5L16 9.5"/></svg>`,
  warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="m10.29 3.86-8.18 14.2A2 2 0 0 0 3.82 21h16.36a2 2 0 0 0 1.71-2.94l-8.18-14.2a2 2 0 0 0-3.42 0Z"/></svg>`,
  error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`
};

function ensureToastStack() {
  let stack = document.getElementById('toastStack');
  if (stack) return stack;

  stack = document.createElement('div');
  stack.id = 'toastStack';
  stack.className = 'toast-stack';
  stack.setAttribute('aria-live', 'polite');
  stack.setAttribute('aria-relevant', 'additions');
  document.body.appendChild(stack);
  return stack;
}

function dismissToast(toast) {
  if (!toast || toast.classList.contains('is-leaving')) return;

  clearTimeout(toast._dismissTimer);
  clearInterval(toast._countdownTimer);

  toast.classList.add('is-leaving');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
  setTimeout(() => toast.remove(), 400);
}

function showNotification(message, type = 'success', duration = TOAST_DEFAULT_DURATION) {
  const stack = ensureToastStack();
  const safeType = ['success', 'warning', 'error'].includes(type) ? type : 'success';
  const totalSeconds = Math.max(1, Math.ceil(duration / 1000));

  const toast = document.createElement('div');
  toast.className = `toast toast--${safeType} is-entering`;
  toast.setAttribute('role', 'status');
  toast.style.setProperty('--toast-duration', `${duration}ms`);

  toast.innerHTML = `
    <div class="toast-icon" aria-hidden="true">${TOAST_ICONS[safeType]}</div>
    <div class="toast-content">
      <p class="toast-message"></p>
    </div>
    <div class="toast-countdown-wrap" aria-hidden="true">
      <svg class="toast-countdown-ring" viewBox="0 0 36 36">
        <circle class="toast-countdown-track" cx="18" cy="18" r="15.5"/>
        <circle class="toast-countdown-progress" cx="18" cy="18" r="15.5"/>
      </svg>
      <span class="toast-countdown-num">${totalSeconds}</span>
    </div>
    <button type="button" class="toast-close" aria-label="Dismiss notification">&times;</button>
    <div class="toast-bar" aria-hidden="true"><div class="toast-bar-fill"></div></div>
  `;

  toast.querySelector('.toast-message').textContent = message;
  toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));

  stack.appendChild(toast);

  let secondsLeft = totalSeconds;
  const countdownEl = toast.querySelector('.toast-countdown-num');
  toast._countdownTimer = setInterval(() => {
    secondsLeft -= 1;
    if (secondsLeft <= 0) {
      clearInterval(toast._countdownTimer);
      if (countdownEl) countdownEl.textContent = '0';
      return;
    }
    if (countdownEl) countdownEl.textContent = String(secondsLeft);
  }, 1000);

  toast._dismissTimer = setTimeout(() => dismissToast(toast), duration);

  return toast;
}

function notifySuccess(message, duration) {
  return showNotification(message, 'success', duration);
}

function notifyWarning(message, duration) {
  return showNotification(message, 'warning', duration);
}

function notifyError(message, duration) {
  return showNotification(message, 'error', duration);
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzF3FpJDIkQbf6WrdsePm3zwEaZaDv3uS60vpDlFUK1S5MlD4WVtkq3gMrjPSxbdidKnw/exec';

async function postToSheet(payload) {
  showSubmitLoading(getSubmitLoadingMessage(payload));

  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to submit');
    }

    return res.json().catch(() => ({}));
  } finally {
    hideSubmitLoading();
  }
}

let activeCustomSelect = null;

function closeCustomSelects() {
  if (!activeCustomSelect) return;
  const { root, menu } = activeCustomSelect;
  menu.classList.remove('is-open', 'opens-up');
  root.classList.remove('open');
  root.appendChild(menu);
  menu.style.cssText = '';
  activeCustomSelect = null;
}

function openCustomSelect(root, trigger, menu) {
  closeCustomSelects();
  const rect = trigger.getBoundingClientRect();
  const gap = 6;
  const viewportPad = 8;

  document.body.appendChild(menu);
  menu.classList.add('is-open');
  menu.style.position = 'fixed';
  menu.style.left = `${rect.left}px`;
  menu.style.width = `${rect.width}px`;
  menu.style.zIndex = '5000';
  menu.style.top = '0';
  menu.style.maxHeight = '';
  menu.style.visibility = 'hidden';

  const menuHeight = menu.offsetHeight;
  const menuWidth = menu.offsetWidth;
  const spaceBelow = window.innerHeight - rect.bottom - viewportPad;
  const spaceAbove = rect.top - viewportPad;

  let top;
  let opensUp = false;

  if (menuHeight <= spaceBelow) {
    top = rect.bottom + gap;
  } else if (menuHeight <= spaceAbove) {
    top = rect.top - menuHeight - gap;
    opensUp = true;
  } else if (spaceAbove >= spaceBelow) {
    const maxH = Math.max(120, spaceAbove - gap);
    menu.style.maxHeight = `${maxH}px`;
    top = Math.max(viewportPad, rect.top - maxH - gap);
    opensUp = true;
  } else {
    const maxH = Math.max(120, spaceBelow - gap);
    menu.style.maxHeight = `${maxH}px`;
    top = rect.bottom + gap;
  }

  const maxLeft = window.innerWidth - menuWidth - viewportPad;
  menu.style.left = `${Math.max(viewportPad, Math.min(rect.left, maxLeft))}px`;
  menu.style.top = `${top}px`;
  menu.style.visibility = '';
  menu.classList.toggle('opens-up', opensUp);
  root.classList.add('open');
  activeCustomSelect = { root, menu };
}

function createCustomSelect({ value = '', options = [], placeholder = 'Select', onChange }) {
  const root = document.createElement('div');
  root.className = 'custom-select';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'custom-select-trigger';

  const labelEl = document.createElement('span');
  labelEl.className = 'custom-select-label';

  const chevron = document.createElement('span');
  chevron.className = 'custom-select-chevron';
  chevron.setAttribute('aria-hidden', 'true');

  const menu = document.createElement('ul');
  menu.className = 'custom-select-menu';
  menu.setAttribute('role', 'listbox');

  function setValue(val) {
    root.dataset.value = val;
    const opt = options.find(o => o.value === val);
    if (!val || !opt) {
      labelEl.textContent = placeholder;
      labelEl.classList.add('is-placeholder');
    } else {
      labelEl.textContent = opt.label;
      labelEl.classList.remove('is-placeholder');
    }
    menu.querySelectorAll('.custom-select-option').forEach(li => {
      const selected = li.dataset.value === val;
      li.classList.toggle('selected', selected);
      li.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

  options.forEach(opt => {
    const li = document.createElement('li');
    li.className = 'custom-select-option';
    li.dataset.value = opt.value;
    li.setAttribute('role', 'option');
    li.textContent = opt.label;
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      setValue(opt.value);
      closeCustomSelects();
      if (onChange) onChange(opt.value);
    });
    menu.appendChild(li);
  });

  setValue(value);

  trigger.appendChild(labelEl);
  trigger.appendChild(chevron);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (root.classList.contains('open')) {
      closeCustomSelects();
    } else {
      openCustomSelect(root, trigger, menu);
    }
  });

  menu.addEventListener('click', (e) => e.stopPropagation());

  root.appendChild(trigger);
  root.appendChild(menu);

  root.getValue = () => root.dataset.value || '';
  root.setValue = setValue;

  return root;
}

const LIST_PAGE_SIZES = [5, 10, 15, 20];
const DEFAULT_LIST_PAGE_SIZE = 10;

function createListPagination(storageKey) {
  const sizeKey = `${storageKey}_page_size`;
  const pageKey = `${storageKey}_page`;

  function getPageSize() {
    const n = parseInt(loadState(sizeKey, DEFAULT_LIST_PAGE_SIZE), 10);
    return LIST_PAGE_SIZES.includes(n) ? n : DEFAULT_LIST_PAGE_SIZE;
  }

  function getPage() {
    const n = parseInt(loadState(pageKey, 1), 10);
    return n > 0 ? n : 1;
  }

  function setPageSize(size) {
    const n = parseInt(size, 10);
    if (!LIST_PAGE_SIZES.includes(n)) return;
    saveState(sizeKey, n);
    saveState(pageKey, 1);
  }

  function setPage(page) {
    saveState(pageKey, Math.max(1, parseInt(page, 10) || 1));
  }

  function paginate(allItems) {
    const pageSize = getPageSize();
    const total = allItems.length;
    if (!total) {
      return { items: [], page: 1, pageSize, total: 0, totalPages: 1, startIndex: 0 };
    }

    const totalPages = Math.ceil(total / pageSize);
    let page = getPage();
    if (page > totalPages) {
      page = totalPages;
      setPage(page);
    }

    const startIndex = (page - 1) * pageSize;
    return {
      items: allItems.slice(startIndex, startIndex + pageSize),
      page,
      pageSize,
      total,
      totalPages,
      startIndex
    };
  }

  return { getPageSize, getPage, setPageSize, setPage, paginate };
}

function renderListPaginationBar(container, meta, { onPageChange, onPageSizeChange }) {
  if (!container) return;

  const { page, pageSize, total, totalPages } = meta;
  if (!total) {
    container.innerHTML = '';
    container.classList.add('is-hidden');
    return;
  }

  container.classList.remove('is-hidden');
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  container.innerHTML = '';
  const bar = document.createElement('div');
  bar.className = 'list-pagination-inner';

  const sizeGroup = document.createElement('div');
  sizeGroup.className = 'list-pagination-size';
  const sizeLabel = document.createElement('span');
  sizeLabel.className = 'list-pagination-label';
  sizeLabel.textContent = 'Rows per page';
  const sizeMount = document.createElement('div');
  sizeMount.className = 'list-pagination-size-mount';
  sizeGroup.appendChild(sizeLabel);
  sizeGroup.appendChild(sizeMount);

  const navGroup = document.createElement('div');
  navGroup.className = 'list-pagination-nav';

  const info = document.createElement('span');
  info.className = 'list-pagination-info';
  info.textContent = `${start}–${end} of ${total}`;

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'btn btn-ghost btn-small list-pagination-btn';
  prevBtn.setAttribute('aria-label', 'Previous page');
  prevBtn.disabled = !canPrev;
  prevBtn.innerHTML = '<i data-lucide="chevron-left" width="16" height="16"></i>';

  const pageLabel = document.createElement('span');
  pageLabel.className = 'list-pagination-page';
  pageLabel.textContent = `Page ${page} of ${totalPages}`;

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'btn btn-ghost btn-small list-pagination-btn';
  nextBtn.setAttribute('aria-label', 'Next page');
  nextBtn.disabled = !canNext;
  nextBtn.innerHTML = '<i data-lucide="chevron-right" width="16" height="16"></i>';

  navGroup.appendChild(info);
  navGroup.appendChild(prevBtn);
  navGroup.appendChild(pageLabel);
  navGroup.appendChild(nextBtn);
  bar.appendChild(sizeGroup);
  bar.appendChild(navGroup);
  container.appendChild(bar);

  const sizeSelect = createCustomSelect({
    value: String(pageSize),
    options: LIST_PAGE_SIZES.map(n => ({ value: String(n), label: String(n) })),
    onChange: (val) => {
      if (onPageSizeChange) onPageSizeChange(parseInt(val, 10));
    }
  });
  sizeMount.appendChild(sizeSelect);

  prevBtn.addEventListener('click', () => {
    if (canPrev && onPageChange) onPageChange(page - 1);
  });
  nextBtn.addEventListener('click', () => {
    if (canNext && onPageChange) onPageChange(page + 1);
  });

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons({ root: container });
  }
}

document.addEventListener('click', closeCustomSelects);
window.addEventListener('resize', closeCustomSelects);
window.addEventListener('scroll', closeCustomSelects, true);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = window.location.pathname.includes('/pages/') ? '../sw.js' : './sw.js';
    navigator.serviceWorker.register(swPath).catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
