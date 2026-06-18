(function() {
      if (typeof isAuthenticated === 'function' && isAuthenticated()) {
        window.location.replace('pages/dashboard.html');
        return;
      }

      const CORRECT_CODE = '8811';

      let entered = '';

      const display = document.getElementById('keypadDisplay');
      const errorEl = document.getElementById('keypadError');

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
          setAuthenticated();
          window.location.href = 'pages/dashboard.html';
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

      updateDisplay();
    })();
