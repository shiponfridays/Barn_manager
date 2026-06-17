const REMINDERS_KEY = 'reminders_items';
    const remindersPagination = createListPagination('reminders_list');

    function getReminders() {
      return loadState(REMINDERS_KEY, []);
    }
    function saveReminders(rows) {
      saveState(REMINDERS_KEY, rows);
    }

    function completeReminderAt(index) {
      const all = getReminders();
      if (!all[index]) return;
      all.splice(index, 1);
      saveReminders(all);

      if (!all.length) {
        remindersPagination.setPage(1);
      } else {
        const totalPages = Math.ceil(all.length / remindersPagination.getPageSize());
        if (remindersPagination.getPage() > totalPages) {
          remindersPagination.setPage(totalPages);
        }
      }

      renderRemindersPage();
    }

    function renderRemindersPage() {
      const reminders = getReminders();
      const list = document.getElementById('remindersList');
      const paginationEl = document.getElementById('remindersPagination');
      list.innerHTML = '';

      if (!reminders.length) {
        list.innerHTML = '<div class="list-empty">No reminders yet.</div>';
        renderListPaginationBar(paginationEl, { page: 1, pageSize: remindersPagination.getPageSize(), total: 0, totalPages: 1 }, {});
        return;
      }

      const meta = remindersPagination.paginate(reminders);

      meta.items.forEach((row, i) => {
        const index = meta.startIndex + i;
        const item = document.createElement('div');
        item.className = 'reminder-item';
        item.innerHTML = `
          <div class="reminder-item-main">
            <div class="reminder-title">${row.text}</div>
            <div class="reminder-meta">
              Created: ${row.createdAt}
              ${row.dueDate ? `<br>Due: ${row.dueDate}` : ''}
            </div>
          </div>
          <div>
            <button class="btn btn-small btn-ghost" data-index="${index}">Complete</button>
          </div>
        `;
        list.appendChild(item);
      });

      list.querySelectorAll('button[data-index]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          const row = getReminders()[idx];
          if (!row) return;
          openCompleteModal({
            title: 'Complete reminder?',
            text: `Mark "${row.text || 'this reminder'}" as complete and remove it from your list?`,
            onConfirm: () => completeReminderAt(idx)
          });
        });
      });

      renderListPaginationBar(paginationEl, meta, {
        onPageChange: (page) => {
          remindersPagination.setPage(page);
          renderRemindersPage();
        },
        onPageSizeChange: (size) => {
          remindersPagination.setPageSize(size);
          renderRemindersPage();
        }
      });
    }

    function addReminder() {
      const text = document.getElementById('reminderText').value.trim();
      const dueDate = document.getElementById('reminderDueDate').value;

      if (!text) {
        notifyWarning('Please enter a reminder.');
        return;
      }

      const reminders = getReminders();
      reminders.push({
        text,
        dueDate,
        createdAt: formatDateTime()
      });
      saveReminders(reminders);

      remindersPagination.setPage(Math.ceil(reminders.length / remindersPagination.getPageSize()));

      document.getElementById('reminderText').value = '';
      document.getElementById('reminderDueDate').value = '';

      renderRemindersPage();
    }

    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      initCompleteModal();
      renderRemindersPage();
    });
