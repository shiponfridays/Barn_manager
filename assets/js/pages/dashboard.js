const REMINDERS_KEY     = 'reminders_items';
    const FLOCK_INFO_KEY    = 'flock_info_current';
    const DASHBOARD_PREVIEW_LIMIT = 5;

    function getRepairsList()    { return loadState(REPAIRS_LIST_KEY, []); }
    function saveRepairsList(r)  { saveState(REPAIRS_LIST_KEY, r); }
    function getReminders()      { return loadState(REMINDERS_KEY, []); }
    function saveReminders(r)    { saveState(REMINDERS_KEY, r); }
    function getFlockInfo()      { return loadState(FLOCK_INFO_KEY, { quotaPeriod:'', placementDate:'', processingDate:'', birdCount:'', hatchery:'' }); }

    function setDashboardViewAllFooter(listEl, total, page) {
      const panel = listEl.closest('.dashboard-panel');
      if (!panel) return;

      let footer = panel.querySelector('.dashboard-panel-footer');
      if (!footer) {
        footer = document.createElement('footer');
        footer.className = 'dashboard-panel-footer';
        panel.appendChild(footer);
      }

      if (total <= DASHBOARD_PREVIEW_LIMIT) {
        footer.innerHTML = '';
        footer.classList.add('is-hidden');
        return;
      }

      footer.classList.remove('is-hidden');
      footer.innerHTML = '';

      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'dashboard-view-all';
      link.textContent = `View all (${total})`;
      link.addEventListener('click', () => goTo(page));
      footer.appendChild(link);
    }

    function renderFlockInfoSummary() {
      const info = getFlockInfo();
      document.getElementById('dashboardQuotaPeriod').textContent  = info.quotaPeriod  || '—';
      document.getElementById('dashboardPlacementDate').textContent = info.placementDate || '—';
      document.getElementById('dashboardShipDate').textContent      = info.processingDate || '—';
      document.getElementById('dashboardBirdCount').textContent     = info.birdCount    || '—';
      document.getElementById('dashboardHatchery').textContent      = info.hatchery     || '—';
      const age = info.placementDate ? `${calculateBirdAgeDays(info.placementDate)} days` : '—';
      document.getElementById('dashboardBirdAge').textContent = age;
    }

    function renderDashboardLists() {
      const todoListEl      = document.getElementById('todoList');
      const todoBadge       = document.getElementById('todoCountBadge');
      const reminderListEl  = document.getElementById('reminderList');
      const reminderBadge   = document.getElementById('reminderCountBadge');
      const todos           = getOpenRepairs();
      const reminders       = getReminders();

      // Repairs
      todoListEl.innerHTML = '';
      if (!todos.length) {
        todoListEl.innerHTML = '<div class="list-empty">No repair items yet.</div>';
      } else {
        todos.slice(0, DASHBOARD_PREVIEW_LIMIT).forEach((item, idx) => {
          const row = document.createElement('div');
          row.className = 'todo-item';
          row.innerHTML = `
            <div class="todo-item-main">
              <div class="todo-title">${item.item || 'Repair item'}</div>
              <div class="todo-meta">Barn ${item.barn || '?'} · ${item.location || 'Location N/A'}<br>Added: ${item.createdAt || ''}</div>
            </div>
            <div class="todo-right">
              <input type="checkbox" aria-label="Mark completed">
            </div>`;
          row.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            const checkbox = e.target;
            if (!checkbox.checked) return;

            const openRepairs = getOpenRepairs();
            const done = openRepairs[idx];
            if (!done) {
              checkbox.checked = false;
              return;
            }

            checkbox.checked = false;
            const label = done.item || 'this repair';
            openCompleteModal({
              title: 'Complete repair?',
              text: `Mark "${label}" as completed and remove it from your to-do list?`,
              onConfirm: () => {
                const full = getRepairsList();
                full.forEach(r => {
                  if (repairEntryMatches(r, done)) r.status = 'Completed';
                });
                saveRepairsList(full);
                renderDashboardLists();
              }
            });
          });
          todoListEl.appendChild(row);
        });
      }
      todoBadge.textContent = `${todos.length} item${todos.length === 1 ? '' : 's'}`;
      setDashboardViewAllFooter(todoListEl, todos.length, 'repairs.html');

      // Reminders
      reminderListEl.innerHTML = '';
      if (!reminders.length) {
        reminderListEl.innerHTML = '<div class="list-empty">No reminders yet.</div>';
      } else {
        reminders.slice(0, DASHBOARD_PREVIEW_LIMIT).forEach((r, idx) => {
          const row = document.createElement('div');
          row.className = 'reminder-item';
          row.innerHTML = `
            <div class="reminder-item-main">
              <div class="reminder-title">${r.text || 'Reminder'}</div>
              <div class="reminder-meta">Created: ${r.createdAt || ''}${r.dueDate ? '<br>Due: ' + r.dueDate : ''}</div>
            </div>
            <div class="todo-right">
              <input type="checkbox" aria-label="Complete reminder">
            </div>`;
          row.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            const checkbox = e.target;
            if (!checkbox.checked) return;
            checkbox.checked = false;
            openCompleteModal({
              title: 'Complete reminder?',
              text: `Mark "${r.text || 'Reminder'}" as complete and remove it from your list?`,
              onConfirm: () => {
                const all = getReminders();
                if (!all[idx]) return;
                all.splice(idx, 1);
                saveReminders(all);
                renderDashboardLists();
              }
            });
          });
          reminderListEl.appendChild(row);
        });
      }
      reminderBadge.textContent = `${reminders.length} item${reminders.length === 1 ? '' : 's'}`;
      setDashboardViewAllFooter(reminderListEl, reminders.length, 'reminders.html');
    }

    function maybeShowDueTodayPopup() {
      const reminders = getReminders();
      if (!reminders.length) return;
      const today = getTodayISO();
      const dueToday = reminders.filter(r => r.dueDate === today);
      if (!dueToday.length) return;
      const popup   = document.getElementById('reminderPopup');
      const content = document.getElementById('reminderPopupContent');
      const closeBtn= document.getElementById('reminderPopupClose');
      content.innerHTML = dueToday.map(r => `
        <div class="popup-item">
          <strong>${r.text}</strong><br>
          <span class="popup-item-meta">Due: ${r.dueDate}</span>
        </div>`).join('');
      popup.style.display = 'flex';
      closeBtn.onclick = () => popup.style.display = 'none';
    }

    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      initChickenIcons();
      initCompleteModal();
      renderFlockInfoSummary();
      renderDashboardLists();
      maybeShowDueTodayPopup();
    });
