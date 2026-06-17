const WALK_KEYS = ['deads', 'flips', 'legs', 'sick', 'small', 'deformed', 'other'];

    function setupWalkTabs() {
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

    function getWalkStateKey(barnId) {
      return `walkthrough_${barnId}`;
    }

    function getDefaultWalkState() {
      return {
        datetime: '',
        deads: 0,
        flips: 0,
        legs: 0,
        sick: 0,
        small: 0,
        deformed: 0,
        other: 0
      };
    }

    function getWalkState(barnId) {
      return loadState(getWalkStateKey(barnId), getDefaultWalkState());
    }

    function saveWalkState(barnId, state) {
      saveState(getWalkStateKey(barnId), state);
    }

    function ensureWalkDateTime(barnId, state) {
      if (!state.datetime) {
        state.datetime = formatDateTime();
      }
    }

    function labelFromKey(key) {
      const map = {
        deads: 'Deads',
        flips: 'Flips',
        legs: 'Legs',
        sick: 'Sick',
        small: 'Small',
        deformed: 'Deformed',
        other: 'Other'
      };
      return map[key];
    }

    function renderWalkPanel(barnId) {
      const state = getWalkState(barnId);
      const countersWrap = document.getElementById(`${barnId}Counters`);
      const dtSpan = document.getElementById(`${barnId}DateTime`);

      dtSpan.textContent = state.datetime || '—';
      countersWrap.innerHTML = '';

      WALK_KEYS.forEach(key => {
        const row = document.createElement('div');
        row.className = 'counter-row';
        row.innerHTML = `
          <div class="counter-label">${labelFromKey(key)}</div>
          <div class="counter-controls">
            <button class="counter-btn" type="button">-</button>
            <div class="counter-value">${state[key]}</div>
            <button class="counter-btn" type="button">+</button>
          </div>
        `;

        const minusBtn = row.querySelectorAll('.counter-btn')[0];
        const plusBtn = row.querySelectorAll('.counter-btn')[1];
        const valueEl = row.querySelector('.counter-value');

        minusBtn.addEventListener('click', () => {
          const current = getWalkState(barnId);
          ensureWalkDateTime(barnId, current);
          current[key] = Math.max(0, current[key] - 1);
          saveWalkState(barnId, current);
          renderWalkPanel(barnId);
        });

        plusBtn.addEventListener('click', () => {
          const current = getWalkState(barnId);
          ensureWalkDateTime(barnId, current);
          current[key] = Math.min(1000, current[key] + 1);
          saveWalkState(barnId, current);
          renderWalkPanel(barnId);
        });

        countersWrap.appendChild(row);
      });

      const dailyMortality = state.deads + state.flips;
      const dailyCulls = state.legs + state.sick + state.small + state.deformed + state.other;
      const totalMortality = dailyMortality + dailyCulls;

      document.getElementById(`${barnId}DailyMortality`).textContent = dailyMortality;
      document.getElementById(`${barnId}DailyCulls`).textContent = dailyCulls;
      document.getElementById(`${barnId}TotalMortality`).textContent = totalMortality;
    }

    async function submitWalkthrough(barnId) {
      const state = getWalkState(barnId);
      const dailyMortality = state.deads + state.flips;
      const dailyCulls = state.legs + state.sick + state.small + state.deformed + state.other;
      const totalMortality = dailyMortality + dailyCulls;
      const sheet = barnId === 'barn1' ? 'Barn 1 Walk Through' : 'Barn 2 Walk Through';

      try {
        await postToSheet({
          sheet,
          type: 'walkThrough',
          timestamp: state.datetime || formatDateTime(),
          data: {
            deads: state.deads,
            flips: state.flips,
            legs: state.legs,
            sick: state.sick,
            small: state.small,
            deformed: state.deformed,
            other: state.other,
            dailyMortality,
            dailyCulls,
            totalMortality
          }
        });

        saveWalkState(barnId, getDefaultWalkState());
        renderWalkPanel(barnId);
        notifySuccess('Walk Through submitted.');
      } catch (e) {
        notifyError('Error submitting Walk Through: ' + e.message);
      }
    }

    document.addEventListener("DOMContentLoaded", () => { lucide.createIcons();
      setupWalkTabs();
      renderWalkPanel('barn1');
      renderWalkPanel('barn2');
    });
