(function() {
      const CORRECT_CODE = '8811';
      const CORRECT_YEAR = 1990;

      let entered = '';

      const display = document.getElementById('keypadDisplay');
      const errorEl = document.getElementById('keypadError');
      const yearStep = document.getElementById('step-year');
      const keypadStep = document.getElementById('step-keypad');
      const yearInput = document.getElementById('yearInput');
      const yearError = document.getElementById('yearError');
      const yearSubmit = document.getElementById('yearSubmit');

      function updateDisplay() {
        display.textContent = entered ? entered.replace(/./g, '•') : '••••';
      }

      function handleDigit(d) {
        if (entered.length >= 4) return;
        entered += d;
        updateDisplay();
      }

      function clearCode() {
        entered = '';
        updateDisplay();
        errorEl.textContent = '';
      }

      function handleEnter() {
        if (entered === CORRECT_CODE) {
          keypadStep.style.display = 'none';
          yearStep.style.display = 'block';
          yearInput.focus();
        } else {
          errorEl.textContent = 'Incorrect';
          clearCode();
        }
      }

      document.querySelectorAll('.keypad-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const digit = btn.getAttribute('data-digit');
          const action = btn.getAttribute('data-action');
          if (digit) {
            handleDigit(digit);
          } else if (action === 'clear') {
            clearCode();
          } else if (action === 'enter') {
            handleEnter();
          }
        });
      });

      yearSubmit.addEventListener('click', () => {
        const yr = parseInt(yearInput.value, 10);
        if (yr === CORRECT_YEAR) {
          window.location.href = 'pages/dashboard.html';
        } else {
          yearError.textContent = 'Incorrect';
        }
      });

      yearInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') yearSubmit.click();
      });

      updateDisplay();
    })();
