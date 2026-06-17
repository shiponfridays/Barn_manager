const BARN_NUMBER_OPTIONS = [
      { value: '', label: 'Select' },
      { value: '1', label: '1' },
      { value: '2', label: '2' }
    ];
    const STATUS_OPTIONS = [
      { value: 'Open', label: 'Open' },
      { value: 'Completed', label: 'Completed' }
    ];

    let repairBarnSelect;
    const repairsPagination = createListPagination('repairs_list');

    function getRepairs() {
      return loadState(REPAIRS_LIST_KEY, []);
    }
    function saveRepairs(rows) {
      saveState(REPAIRS_LIST_KEY, rows);
    }

    function deleteRepairAt(index) {
      const repairs = getRepairs();
      if (!repairs[index]) return;

      repairs.splice(index, 1);
      saveRepairs(repairs);

      if (!repairs.length) {
        repairsPagination.setPage(1);
      } else {
        const totalPages = Math.ceil(repairs.length / repairsPagination.getPageSize());
        if (repairsPagination.getPage() > totalPages) {
          repairsPagination.setPage(totalPages);
        }
      }

      renderRepairs();
    }

    function openDeleteRepairModal(index) {
      const row = getRepairs()[index];
      if (!row) return;

      const label = row.item || 'this repair';
      openActionConfirmModal({
        title: 'Delete repair?',
        text: `Remove "${label}" from the repairs list? This cannot be undone.`,
        confirmLabel: 'Delete',
        onConfirm: () => deleteRepairAt(index)
      });
    }

    function renderRepairs() {
      closeCustomSelects();
      const rows = getRepairs();
      const tbody = document.querySelector('#repairsTable tbody');
      const paginationEl = document.getElementById('repairsPagination');
      tbody.innerHTML = '';

      if (!rows.length) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="9">No repair items added yet.</td>';
        tbody.appendChild(tr);
        renderListPaginationBar(paginationEl, { page: 1, pageSize: repairsPagination.getPageSize(), total: 0, totalPages: 1 }, {});
        return;
      }

      const meta = repairsPagination.paginate(rows);

      meta.items.forEach((row, i) => {
        const index = meta.startIndex + i;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="col-no">${index + 1}</td>
          <td>${row.item}</td>
          <td>${row.barn}</td>
          <td>${row.location}</td>
          <td>${row.issue}</td>
          <td>${row.materials}</td>
          <td class="select-cell"></td>
          <td>${row.createdAt}</td>
          <td class="action-cell">
            <button type="button" class="btn-icon-delete" aria-label="Delete repair">
              <i data-lucide="trash-2" width="16" height="16"></i>
            </button>
          </td>
        `;

        tr.querySelector('.btn-icon-delete').addEventListener('click', () => {
          openDeleteRepairModal(index);
        });

        const statusSelect = createCustomSelect({
          value: row.status,
          options: STATUS_OPTIONS,
          placeholder: 'Open',
          onChange: (val) => {
            const repairs = getRepairs();
            repairs[index].status = val;
            saveRepairs(repairs);
          }
        });
        tr.querySelector('.select-cell').appendChild(statusSelect);
        tbody.appendChild(tr);
      });

      lucide.createIcons({ root: tbody });

      renderListPaginationBar(paginationEl, meta, {
        onPageChange: (page) => {
          repairsPagination.setPage(page);
          renderRepairs();
        },
        onPageSizeChange: (size) => {
          repairsPagination.setPageSize(size);
          renderRepairs();
        }
      });
    }

    function clearRepairFormErrors() {
      clearFormFieldErrors(document.getElementById('repairFormCard'));
    }

    function clearRepairForm() {
      document.getElementById('repairItem').value = '';
      repairBarnSelect.setValue('');
      document.getElementById('repairLocation').value = '';
      document.getElementById('repairIssue').value = '';
      document.getElementById('repairMaterials').value = '';
      clearRepairFormErrors();
    }

    function addRepair() {
      const formCard = document.getElementById('repairFormCard');
      const itemField = document.getElementById('repairItemField');
      const barnField = document.getElementById('repairBarnField');
      const item = document.getElementById('repairItem').value.trim();
      const barn = repairBarnSelect.getValue();
      const location = document.getElementById('repairLocation').value.trim();
      const issue = document.getElementById('repairIssue').value.trim();
      const materials = document.getElementById('repairMaterials').value.trim();

      clearRepairFormErrors();
      let hasErrors = false;

      if (!item) {
        setFieldError(itemField, 'Item is required.');
        hasErrors = true;
      }

      if (!barn) {
        setFieldError(barnField, 'Barn # is required.');
        hasErrors = true;
      }

      if (hasErrors) {
        formCard.classList.add('has-form-errors');
        const firstError = formCard.querySelector('.field-group.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      const createdAt = formatDateTime();
      const row = {
        item,
        barn,
        location,
        issue,
        materials,
        status: 'Open',
        createdAt
      };

      const repairs = getRepairs();
      repairs.push(row);
      saveRepairs(repairs);

      repairsPagination.setPage(Math.ceil(repairs.length / repairsPagination.getPageSize()));

      clearRepairForm();
      renderRepairs();
    }

    async function submitRepairsExport() {
      const repairs = getRepairs();
      if (!repairs.length) {
        notifyWarning('No repair items to export.');
        return;
      }

      try {
        await postToSheet({
          sheet: 'Repairs',
          type: 'repairs',
          timestamp: formatDateTime(),
          rows: repairs
        });

        notifySuccess('Repairs submitted to sheet.');
      } catch (e) {
        notifyError('Error submitting Repairs: ' + e.message);
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      repairBarnSelect = createCustomSelect({
        value: '',
        options: BARN_NUMBER_OPTIONS,
        onChange: () => {
          const formCard = document.getElementById('repairFormCard');
          clearFieldError(document.getElementById('repairBarnField'));
          if (!formCard.querySelector('.field-group.has-error')) {
            formCard.classList.remove('has-form-errors');
          }
        }
      });
      document.getElementById('repairBarnMount').appendChild(repairBarnSelect);
      document.getElementById('repairItem').addEventListener('input', () => {
        clearFieldError(document.getElementById('repairItemField'));
        document.getElementById('repairFormCard').classList.remove('has-form-errors');
      });

      initActionConfirmModal();
      renderRepairs();
    });
