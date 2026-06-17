const FLOCK_INFO_KEY = 'flock_info_current';

    function getFlockInfo() {
      return loadState(FLOCK_INFO_KEY, {
        quotaPeriod: '',
        placementDate: '',
        birdCount: '',
        processingDate: '',
        hatchery: ''
      });
    }

    function saveFlockInfo(info) {
      saveState(FLOCK_INFO_KEY, info);
    }

    function fillFlockInfoForm() {
      const info = getFlockInfo();
      document.getElementById('quotaPeriod').value = info.quotaPeriod || '';
      document.getElementById('placementDate').value = info.placementDate || '';
      document.getElementById('birdCount').value = info.birdCount || '';
      document.getElementById('processingDate').value = info.processingDate || '';
      document.getElementById('hatchery').value = info.hatchery || '';
    }

    function readFormValues() {
      return {
        quotaPeriod: document.getElementById('quotaPeriod').value.trim(),
        placementDate: document.getElementById('placementDate').value,
        birdCount: document.getElementById('birdCount').value,
        processingDate: document.getElementById('processingDate').value,
        hatchery: document.getElementById('hatchery').value.trim()
      };
    }

    function setupAutosave() {
      ['quotaPeriod', 'placementDate', 'birdCount', 'processingDate', 'hatchery'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
          if (id === 'birdCount') {
            clearFieldError(document.getElementById('birdCountField'));
          }
          saveFlockInfo(readFormValues());
        });
      });
    }

    function validateFlockInfoForm() {
      const birdCountField = document.getElementById('birdCountField');
      const birdCount = document.getElementById('birdCount').value.trim();

      clearFieldError(birdCountField);

      if (!birdCount) {
        setFieldError(birdCountField, '# of Birds is required.');
        document.getElementById('birdCount').focus();
        return false;
      }

      return true;
    }

    function resetFlockInfoForm() {
      clearFieldError(document.getElementById('birdCountField'));
      saveFlockInfo({
        quotaPeriod: '',
        placementDate: '',
        birdCount: '',
        processingDate: '',
        hatchery: ''
      });
      fillFlockInfoForm();
    }

    async function submitFlockInfo() {
      const info = readFormValues();
      saveFlockInfo(info);

      if (!validateFlockInfoForm()) return;

      try {
        await postToSheet({
          sheet: 'Flock Info',
          type: 'flockInfo',
          timestamp: formatDateTime(),
          rows: [{
            quotaPeriod: info.quotaPeriod,
            placementDate: info.placementDate,
            birdCount: info.birdCount,
            processingDate: info.processingDate,
            hatchery: info.hatchery
          }]
        });
        notifySuccess('Flock Info submitted.');
      } catch (e) {
        notifyError('Error submitting Flock Info: ' + e.message);
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      initChickenIcons();
      fillFlockInfoForm();
      setupAutosave();
    });
