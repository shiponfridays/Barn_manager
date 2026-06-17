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

    function getWeightsKey(barnId) {
      return `weights_${barnId}`;
    }

    function getDefaultWeightRows() {
      const rows = [];
      for (let i = 1; i <= 10; i++) {
        rows.push({
          bucket: i,
          birds: '',
          weight: '',
          avgWeight: ''
        });
      }
      return rows;
    }

    function getWeightRows(barnId) {
      const key = getWeightsKey(barnId);
      const saved = loadState(key, null);
      if (saved) return saved;
      const defaults = getDefaultWeightRows();
      saveState(key, defaults);
      return defaults;
    }

    function saveWeightRows(barnId, rows) {
      saveState(getWeightsKey(barnId), rows);
    }

    const BIRDS_OPTIONS = [
      { value: '', label: 'Select' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' }
    ];

    function renderWeightsTable(barnId) {
      closeCustomSelects();
      const rows = getWeightRows(barnId);
      const tbody = document.querySelector(`#weightsTable${barnId === 'barn1' ? 'Barn1' : 'Barn2'} tbody`);
      tbody.innerHTML = '';

      rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.bucket}</td>
          <td class="select-cell"></td>
          <td><input type="number" step="0.01" class="weight-input" value="${row.weight}"></td>
          <td><input type="text" class="avg-output" value="${row.avgWeight}" readonly></td>
        `;

        const birdsSelect = createCustomSelect({
          value: row.birds,
          options: BIRDS_OPTIONS,
          onChange: () => recalc()
        });
        tr.querySelector('.select-cell').appendChild(birdsSelect);

        const weightInput = tr.querySelector('.weight-input');
        const avgOutput = tr.querySelector('.avg-output');

        function recalc() {
          const currentRows = getWeightRows(barnId);
          const birds = birdsSelect.getValue();
          const weight = weightInput.value;
          let avg = '';

          if (birds && weight && parseFloat(birds) > 0 && parseFloat(weight) > 0) {
            avg = calcBucketAvgWeight(birds, weight);
          }

          currentRows[index] = {
            bucket: row.bucket,
            birds: birds,
            weight: weight,
            avgWeight: avg
          };

          saveWeightRows(barnId, currentRows);
          avgOutput.value = avg;
          updateOverallAverage(barnId);
        }

        weightInput.addEventListener('input', recalc);
        weightInput.addEventListener('change', recalc);

        tbody.appendChild(tr);
      });

      updateOverallAverage(barnId);
    }

    function updateOverallAverageDisplay(barnId, avg) {
      document.getElementById(
        barnId === 'barn1' ? 'overallAverageBarn1' : 'overallAverageBarn2'
      ).textContent = avg;
    }

    function updateOverallAverage(barnId) {
      const rows = getWeightRows(barnId).filter(isFilledWeightRow);
      updateOverallAverageDisplay(barnId, computeWeightsOverallAverage(rows));
    }

    function syncWeightsFromDom(barnId) {
      const tableId = barnId === 'barn1' ? 'weightsTableBarn1' : 'weightsTableBarn2';
      const tbody = document.querySelector(`#${tableId} tbody`);
      const allRows = [];

      tbody.querySelectorAll('tr').forEach(tr => {
        const bucket = parseInt(tr.cells[0].textContent, 10);
        const birdsSelect = tr.querySelector('.custom-select');
        const birds = birdsSelect && birdsSelect.getValue ? birdsSelect.getValue() : '';
        const weight = tr.querySelector('.weight-input')?.value ?? '';
        const avgWeight = calcBucketAvgWeight(birds, weight);

        allRows.push({
          bucket,
          birds,
          weight,
          avgWeight
        });

        const avgOutput = tr.querySelector('.avg-output');
        if (avgOutput) avgOutput.value = avgWeight;
      });

      saveWeightRows(barnId, allRows);

      const filledRows = allRows.filter(isFilledWeightRow);
      const overallAverage = computeWeightsOverallAverage(filledRows);
      updateOverallAverageDisplay(barnId, overallAverage);

      return { rows: filledRows, overallAverage };
    }

    function addBucket(barnId) {
      const rows = getWeightRows(barnId);
      rows.push({
        bucket: rows.length + 1,
        birds: '',
        weight: '',
        avgWeight: ''
      });
      saveWeightRows(barnId, rows);
      renderWeightsTable(barnId);
    }

    function resetWeights(barnId) {
      const rows = getWeightRows(barnId).map(r => ({
        ...r,
        birds: '',
        weight: '',
        avgWeight: ''
      }));
      saveWeightRows(barnId, rows);
      renderWeightsTable(barnId);
    }

    async function submitWeights(barnId) {
      const { rows, overallAverage } = syncWeightsFromDom(barnId);

      if (!rows.length) {
        notifyWarning('Enter at least one bucket with # of Birds and Weight before submitting.');
        return;
      }

      const sheet = barnId === 'barn1' ? 'Barn 1 Weights' : 'Barn 2 Weights';

      try {
        await postToSheet({
          sheet,
          type: 'weights',
          timestamp: formatDateTime(),
          overallAverage,
          rows
        });
        notifySuccess('Weights submitted.');
      } catch (e) {
        notifyError('Error submitting Weights: ' + e.message);
      }
    }

    document.addEventListener("DOMContentLoaded", () => { lucide.createIcons();
      setupTabs();
      renderWeightsTable('barn1');
      renderWeightsTable('barn2');
    });
