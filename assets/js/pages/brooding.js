const VENT_KEY = 'brooding_vent_rows';
    const CROP_KEY = 'brooding_crop_rows';

    function setupTabs() {
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');
          document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById(tabId).classList.add('active');
        });
      });
    }

    function defaultVentRows() {
      const rows = [];
      for (let i = 1; i <= 10; i++) {
        rows.push({
          chick: `Chick #${i}`,
          barn: '',
          temp: '',
          datetime: ''
        });
      }
      return rows;
    }

    function defaultCropRows() {
      const rows = [];
      for (let i = 1; i <= 10; i++) {
        rows.push({
          chick: `Chick #${i}`,
          barn: '',
          cropFill: '',
          datetime: ''
        });
      }
      return rows;
    }

    function getVentRows() {
      const rows = loadState(VENT_KEY, null);
      if (rows) return rows;
      const starter = defaultVentRows();
      saveState(VENT_KEY, starter);
      return starter;
    }

    function getCropRows() {
      const rows = loadState(CROP_KEY, null);
      if (rows) return rows;
      const starter = defaultCropRows();
      saveState(CROP_KEY, starter);
      return starter;
    }

    const BARN_OPTIONS = [
      { value: '', label: 'Select' },
      { value: 'Barn 1', label: 'Barn 1' },
      { value: 'Barn 2', label: 'Barn 2' }
    ];

    function renderVentTable() {
      closeCustomSelects();
      const rows = getVentRows();
      const tbody = document.querySelector('#ventTable tbody');
      tbody.innerHTML = '';

      rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.chick}</td>
          <td class="select-cell"></td>
          <td>
            <input type="number" step="0.1" class="vent-temp" value="${row.temp}">
          </td>
          <td>
            <input type="text" class="vent-datetime" value="${row.datetime}" readonly>
          </td>
        `;

        const barnSelect = createCustomSelect({
          value: row.barn,
          options: BARN_OPTIONS,
          onChange: (val) => {
            const current = getVentRows();
            current[index].barn = val;
            saveState(VENT_KEY, current);
          }
        });
        tr.querySelector('.select-cell').appendChild(barnSelect);

        const tempInput = tr.querySelector('.vent-temp');
        const dtInput = tr.querySelector('.vent-datetime');

        tempInput.addEventListener('input', () => {
          const current = getVentRows();
          current[index].temp = tempInput.value;
          if (tempInput.value !== '') {
            current[index].datetime = formatDateTime();
            dtInput.value = current[index].datetime;
          } else {
            current[index].datetime = '';
            dtInput.value = '';
          }
          saveState(VENT_KEY, current);
        });

        tbody.appendChild(tr);
      });
    }

    function renderCropTable() {
      closeCustomSelects();
      const rows = getCropRows();
      const tbody = document.querySelector('#cropTable tbody');
      tbody.innerHTML = '';

      rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.chick}</td>
          <td class="select-cell"></td>
          <td>
            <input type="text" class="crop-fill" value="${row.cropFill}">
          </td>
          <td>
            <input type="text" class="crop-datetime" value="${row.datetime}" readonly>
          </td>
        `;

        const barnSelect = createCustomSelect({
          value: row.barn,
          options: BARN_OPTIONS,
          onChange: (val) => {
            const current = getCropRows();
            current[index].barn = val;
            saveState(CROP_KEY, current);
          }
        });
        tr.querySelector('.select-cell').appendChild(barnSelect);

        const fillInput = tr.querySelector('.crop-fill');
        const dtInput = tr.querySelector('.crop-datetime');

        fillInput.addEventListener('input', () => {
          const current = getCropRows();
          current[index].cropFill = fillInput.value;
          if (fillInput.value !== '') {
            current[index].datetime = formatDateTime();
            dtInput.value = current[index].datetime;
          } else {
            current[index].datetime = '';
            dtInput.value = '';
          }
          saveState(CROP_KEY, current);
        });

        tbody.appendChild(tr);
      });
    }

    function addVentRow() {
      const rows = getVentRows();
      rows.push({
        chick: `Chick #${rows.length + 1}`,
        barn: '',
        temp: '',
        datetime: ''
      });
      saveState(VENT_KEY, rows);
      renderVentTable();
    }

    function addCropRow() {
      const rows = getCropRows();
      rows.push({
        chick: `Chick #${rows.length + 1}`,
        barn: '',
        cropFill: '',
        datetime: ''
      });
      saveState(CROP_KEY, rows);
      renderCropTable();
    }

    function resetVent() {
      const rows = getVentRows().map(row => ({
        ...row,
        temp: '',
        datetime: ''
      }));
      saveState(VENT_KEY, rows);
      renderVentTable();
    }

    function resetCrop() {
      const rows = getCropRows().map(row => ({
        ...row,
        cropFill: '',
        datetime: ''
      }));
      saveState(CROP_KEY, rows);
      renderCropTable();
    }

    async function submitVent() {
      const rows = getVentRows();
      try {
        await postToSheet({
          sheet: 'Vent Temps',
          type: 'ventTemps',
          timestamp: formatDateTime(),
          rows
        });
        notifySuccess('Vent Temps submitted.');
      } catch (e) {
        notifyError('Error submitting Vent Temps: ' + e.message);
      }
    }

    async function submitCrop() {
      const rows = getCropRows();
      try {
        await postToSheet({
          sheet: 'Crop Fills',
          type: 'cropFills',
          timestamp: formatDateTime(),
          rows
        });
        notifySuccess('Crop fills submitted.');
      } catch (e) {
        notifyError('Error submitting Crop fills: ' + e.message);
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      setupTabs();
      renderVentTable();
      renderCropTable();
    });
