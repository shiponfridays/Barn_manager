const BARN_SETUP_TEMPLATE = [
      { id: 'empty_garbage', task: 'Empty Garbage', details: '' },
      { id: 'buckets', task: 'Buckets', details: 'Clean & Disinfect Buckets' },
      { id: 'scales', task: 'Scales', details: 'Clean & Disinfect Scales' },
      { id: 'humidity_curve', task: 'Humidity Curve', details: '' },
      { id: 'temperature_curve', task: 'Temperature Curve', details: '' },
      { id: 'differential', task: 'Differential', details: '' },

      { id: 'stage1', task: 'Stage 1', details:
`Start Temp: 29.6
Modulation Band: 0.2
Minimum Speed: 50%
Minimum Speed Curve: Off
Maximum Speed: 100%
Probes: 123456
Timer: Timer 1
Tunnel Shutoff: Yes
Humidity Setpoint: 1 RH
Add Min Speed: 25%
Humidity Setpoint 2: 5 RH
Add Min Speed 2: 25%
CO2 Influence: Off
Min Speed Reference: 50%
Tunnel Mode Reactivation Temp: 35` },

      { id: 'stage2', task: 'Stage 2', details:
`Start Temp: 29.8
Modulation Band: 0.2
Minimum Speed: 25%
Minimum Speed Curve: Off
Maximum Speed: 100%
Probes: 123456
Timer: Timer 2
Tunnel Shutoff: Yes
Humidity Setpoint: 6 RH
Add Min Speed: 25%
Humidity Setpoint 2: 10 RH
Add Min Speed 2: 50%
CO2 Influence: Off
Min Speed Reference: 25%
Tunnel Mode Reactivation Temp: 35` },

      { id: 'stage3', task: 'Stage 3', details:
`Start Temp: 30.0
Modulation Band: 0.2
Minimum Speed: 25%
Minimum Speed Curve: Off
Maximum Speed: 100%
Probes: 123456
Timer: Timer 3
Tunnel Shutoff: Yes
Humidity Setpoint: 11 RH
Add Min Speed: 25%
Humidity Setpoint 2: 15 RH
Add Min Speed 2: 50%
CO2 Influence: Off
Min Speed Reference: 25%
Tunnel Mode Reactivation Temp: 35` },

      { id: 'stage4', task: 'Stage 4', details:
`Start Temp: 30.2
Modulation Band: 0.2
Minimum Speed: 25%
Minimum Speed Curve: Off
Maximum Speed: 100%
Probes: 123456
Timer: Timer 4
Tunnel Shutoff: Yes
Humidity Setpoint: 16 RH
Add Min Speed: 25%
Humidity Setpoint 2: 20 RH
Add Min Speed 2: 50%
CO2 Influence: Off
Min Speed Reference: 25%
Tunnel Mode Reactivation Temp: 35` },

      { id: 'stage5', task: 'Stage 5', details:
`On Temp: 30.4
Differential: 0.2
Probes: 123456
Timer: Off
Tunnel Shutoff: Yes
Tunnel Mode Reactivation: 35
Humidity Influence: Off
CO2 Influence: Off` },

      { id: 'stage6', task: 'Stage 6', details:
`On Temp: 30.7
Differential: 0.3
Probes: 123456
Timer: Off
Tunnel Shutoff: No
Tunnel Mode Reactivation: 35
Humidity Influence: Off
CO2 Influence: Off` },

      { id: 'stage7', task: 'Stage 7', details:
`On Temp: 31.0
Differential: 0.3
Probes: 123456
Timer: Off
Tunnel Shutoff: No
Tunnel Mode Reactivation: 35
Humidity Influence: Off
CO2 Influence: Off` },

      { id: 'stage8', task: 'Stage 8', details:
`On Temp: 31.3
Differential: 0.3
Probes: 123456
Timer: Off
Tunnel Shutoff: No
Tunnel Mode Reactivation: 35
Humidity Influence: Off
CO2 Influence: Off` },

      { id: 'stage9', task: 'Stage 9', details:
`On Temp: 32.0
Differential: 0.7
Probes: 123456
Timer: Off
Tunnel Shutoff: No
Tunnel Mode Reactivation: 35
Humidity Influence: Off
CO2 Influence: Off` },

      { id: 'stage10', task: 'Stage 10', details: 'Mirror Stage 9' },
      { id: 'stage11', task: 'Stage 11', details: 'Mirror Stage 9' },

      { id: 'inlet1', task: 'Inlet 1', details:
`Minimum Position: 0
Winter Setpoint: TBD
Summer Setpoint: TBD
Winter Minimum Opening: 0
Summer Minimum Opening: 0
Winter Variable 1 Start Position: 2
Summer Variable 1 Start Position: 2
Variable 1 End Position: 10
Variable 2 Start: 10
Variable 2 End: 20
Variable 3 Start: 0
Variable 3 End: 0
Variable 4 Start: 0
Variable 4 End: 0
Stage 5: 0
Stage 6: 0
Stage 7: 0
Stage 8: 0
Stage 9: 0
Stage 10: 0
Stage 11: 0
Max Opening Temp: 40
Max Opening: 90
Absolute Max Opening Winter: 70
Absolute Max Opening: 100
Position in Tunnel: OFF
Cold Closing Temperature: -12
Don’t touch anything under this.` },

      { id: 'inlet2', task: 'Inlet 2', details: 'Mirror Inlet 1' },

      { id: 'inlet3', task: 'Inlet 3', details:
`Minimum Position: 0
Winter Setpoint: TBD
Summer Setpoint: TBD
Winter Minimum Opening: 0
Summer Minimum Opening: 0
Winter Variable 1 Start Position: 0
Summer Variable 1 Start Position: 0
Variable 1 End Position: 0
Variable 2 Start: 0
Variable 2 End: 0
Variable 3 Start: 2
Variable 3 End: 10
Variable 4 Start: 10
Variable 4 End: 20
Stage 5: 30
Stage 6: 40
Stage 7: 50
Stage 8: 60
Stage 9: 0
Stage 10: 0
Stage 11: 0
Max Opening Temp: 35
Max Opening: 90
Absolute Max Opening Winter: 50
Absolute Max Opening: 100
Position in Tunnel: OFF
Cold Closing Temperature: -20
Don’t touch anything under this.` },

      { id: 'inlet4', task: 'Inlet 4', details: 'Mirror Inlet 3' },
      { id: 'inlet5', task: 'Inlet 5', details: 'Mirror Inlet 3' },

      { id: 'inlet6', task: 'Inlet 6', details:
`Minimum Position: 0
Winter Setpoint: TBD
Summer Setpoint: TBD
Winter Minimum Opening: 0
Summer Minimum Opening: 0
Winter Variable 1 Start Position: 0
Summer Variable 1 Start Position: 0
Variable 1 End Position: 0
Variable 2 Start: 0
Variable 2 End: 0
Variable 3 Start: 0
Variable 3 End: 0
Variable 4 Start: 0
Variable 4 End: 0
Stage 5: 0
Stage 6: 0
Stage 7: 0
Stage 8: 50
Stage 9: 50
Stage 10: 100
Stage 11: 100
Max Opening Temp: 35
Max Opening: 90
Absolute Max Opening Winter: 50
Absolute Max Opening: 100
Position in Tunnel: OFF
Cold Closing Temperature: -20
Don’t touch anything under this.` },

      { id: 'heater1', task: 'Heater 1', details:
`On Temp: 20.0
Differential: 0.3
Probes: 12
High Temp Shutoff Curve: ON
Day 0: 35
Day 32: 22
Activates First Ventilation Stage: No` },

      { id: 'heater2', task: 'Heater 2', details:
`On Temp: 20.0
Differential: 0.3
Probes: 34
High Temp Shutoff Curve: ON
Day 0: 35
Day 32: 22
Activates First Ventilation Stage: No` },

      { id: 'heater3', task: 'Heater 3', details:
`On Temp: 20.0
Differential: 0.3
Probes: 56
High Temp Shutoff Curve: ON
Day 0: 35
Day 32: 22
Activates First Ventilation Stage: No` },

      { id: 'lighting_program', task: 'Lighting Program', details:
`Intensity Between Cycles: 0
Off System Intensity: 0
Power Outage Recov. Mod: 5

Period 1 24 Hour: OFF
Period 1 # of Cycles: 2
Period 1 End Day: 1
P1 C1 Min Intensity: 0
P1 C1 Max Intensity: 100
P1 C1 Start Mod Time: 20
P1 C1 End Mod Time: 20
P1 C1 On Time: 7am
P1 C1 Off Time: 3pm
P1 C2 Min: 0
P1 C2 Max: 100
P1 C2 Start Mod Time: 20
P1 C2 End Mod Time: 20
P1 C2 On Time: 5pm
P1 C2 Off Time: 11pm

Period 2 24 Hour: OFF
P2 # Cycles: 1
Period 2 End Day: 2
P2 Min: 0
P2 Max: 90
P2 Start Mod Time: 20
P2 End Mod Time: 20
P2 On: 7am
P2 Off: 11pm

Period 3 24 Hour: OFF
P3 # Cycles: 1
Period 3 End Day: 4
P3 Min: 0
P3 Max: 70
P3 Start Mod Time: 20
P3 End Mod Time: 20
P3 On: 7am
P3 Off: 11pm

Period 4 24 Hour: OFF
P4 # Cycles: 1
Period 4 End Day: 6
P4 Min: 0
P4 Max: 50
P4 Start Mod Time: 20
P4 End Mod Time: 20
P4 On: 7am
P4 Off: 11pm

Period 5 24 Hour: OFF
P5 # Cycles: 1
Period 5 End Day: 2
P5 Min: 0
P5 Max: 40
P5 Start Mod Time: 45
P5 End Mod Time: 45
P5 On: 8am
P5 Off: 11pm` },

      { id: 'alarms_fq', task: 'Alarms (FQ)', details:
`Temperatures: None
Pressure Alarms: None
CO2 Alarms: OFF

Water Meter Alarms
Consumption: 3
Curve: OFF
Low Limit: OFF
High Limit: 2
High Meter Check Rate: 0.01
Low Rate Check: 1.00
Outside Temp for High Increase: 25
High Water Meter Increase: 50
Deactivate Low Water at Night: ON
Deactivate Low Water Alarm Before Day: 1

Feeder Alarms (before d7)
Stop Limit: OFF (120)
Stop Limit Curve: OFF
Max Limit: 20
Alarm Relay for Max: ON
Deactivate Low Alarm at Night: ON

Auger Alarms (before d7)
Stop Limit: OFF (120)
Stop Limit Curve: OFF
Max Limit: 20
Alarm Relay for Max: ON
Deactivate Low Alarm at Night: ON` },

      { id: 'scales_hang', task: 'Scales', details: 'Hang Scales' },
      { id: 'probes_sensors', task: 'Probes / Sensors', details: 'Drop Probes & Sensors' },
      { id: 'update_fq_screen', task: 'Update FQ Screen', details: 'Update # Placed\nStart Batch\nAdjust Age' }
    ];

    function setupTabs() {
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-tab');
          document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById(id).classList.add('active');
        });
      });
    }

    function getBarnSetupKey(barnId) {
      return `barn_setup_${barnId}`;
    }

    function getBarnSetupData(barnId) {
      const saved = loadState(getBarnSetupKey(barnId), null);
      if (saved) return saved;
      const defaults = BARN_SETUP_TEMPLATE.map(r => ({
        id: r.id,
        task: r.task,
        details: r.details,
        notes: '',
        complete: false
      }));
      saveState(getBarnSetupKey(barnId), defaults);
      return defaults;
    }

    function saveBarnSetupData(barnId, rows) {
      saveState(getBarnSetupKey(barnId), rows);
    }

    let currentEditBarn = null;
    let currentEditIndex = null;

    function openDetailsModal(barnId, index) {
      const rows = getBarnSetupData(barnId);
      currentEditBarn = barnId;
      currentEditIndex = index;
      document.getElementById('detailsModalTextarea').value = rows[index].details || '';
      document.getElementById('detailsModal').style.display = 'flex';
    }

    function closeDetailsModal() {
      document.getElementById('detailsModal').style.display = 'none';
      currentEditBarn = null;
      currentEditIndex = null;
    }

    function renderBarnSetup(barnId) {
      const rows = getBarnSetupData(barnId);
      const tbody = document.getElementById(barnId === 'barn1' ? 'barnSetupBody1' : 'barnSetupBody2');
      tbody.innerHTML = '';

      rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.task}</td>
          <td class="details-cell">
            <span class="details-text details-multiline">${row.details || ''}</span>
            <button type="button" class="details-pencil">✎</button>
          </td>
          <td><input type="text" class="notes-input" value="${row.notes || ''}"></td>
          <td><input type="checkbox" class="complete-input" ${row.complete ? 'checked' : ''}></td>
        `;

        const notesInput = tr.querySelector('.notes-input');
        const completeInput = tr.querySelector('.complete-input');
        const pencilBtn = tr.querySelector('.details-pencil');

        notesInput.addEventListener('input', () => {
          const current = getBarnSetupData(barnId);
          current[index].notes = notesInput.value;
          saveBarnSetupData(barnId, current);
        });

        completeInput.addEventListener('change', () => {
          const current = getBarnSetupData(barnId);
          current[index].complete = completeInput.checked;
          saveBarnSetupData(barnId, current);
        });

        pencilBtn.addEventListener('click', () => openDetailsModal(barnId, index));

        tbody.appendChild(tr);
      });
    }

    function resetBarnSetup(barnId) {
      const rows = getBarnSetupData(barnId).map(r => ({
        ...r,
        notes: '',
        complete: false
      }));
      saveBarnSetupData(barnId, rows);
      renderBarnSetup(barnId);
    }

    async function submitBarnSetup(barnId) {
      const rows = getBarnSetupData(barnId);
      const sheet = barnId === 'barn1' ? 'Barn 1 Setup' : 'Barn 2 Setup';
      try {
        await postToSheet({
          sheet,
          type: 'barnSetup',
          timestamp: formatDateTime(),
          rows: rows.map(r => ({
            task: r.task,
            details: r.details,
            notes: r.notes,
            complete: r.complete ? 'Yes' : 'No'
          }))
        });
        notifySuccess('Barn Setup submitted.');
      } catch (e) {
        notifyError('Error submitting Barn Setup: ' + e.message);
      }
    }

    document.addEventListener("DOMContentLoaded", () => { lucide.createIcons();
      setupTabs();
      renderBarnSetup('barn1');
      renderBarnSetup('barn2');

      document.getElementById('detailsCancel').addEventListener('click', closeDetailsModal);
      document.getElementById('detailsModal').addEventListener('click', e => {
        if (e.target.id === 'detailsModal') closeDetailsModal();
      });
      document.getElementById('detailsSave').addEventListener('click', () => {
        if (currentEditBarn == null) return;
        const rows = getBarnSetupData(currentEditBarn);
        rows[currentEditIndex].details = document.getElementById('detailsModalTextarea').value;
        saveBarnSetupData(currentEditBarn, rows);
        renderBarnSetup(currentEditBarn);
        closeDetailsModal();
      });
    });
