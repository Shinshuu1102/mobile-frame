// Appointment.js
// Handles appointment form submission: validation, table update, and success modal.

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('appointment-form');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const purposeInput = document.getElementById('purpose');
  const tbody = document.querySelector('.pending-section table tbody');

  if (!form) return; // nothing to do

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const dateVal = dateInput.value;
    const timeVal = timeInput.value;
    const purposeVal = purposeInput.value.trim();

    // simple validation
    if (!dateVal || !timeVal || !purposeVal) {
      // highlight empty fields
      [dateInput, timeInput, purposeInput].forEach((el) => {
        if (!el.value || !el.value.trim()) {
          el.style.borderColor = '#d9534f';
          el.style.boxShadow = '0 0 0 3px rgba(217,83,79,0.08)';
        } else {
          el.style.borderColor = '';
          el.style.boxShadow = '';
        }
      });
      // focus first empty
      const firstEmpty = [dateInput, timeInput, purposeInput].find((i) => !i.value || !i.value.trim());
      if (firstEmpty) firstEmpty.focus();
      return;
    }

    // reset any previous error styles
    [dateInput, timeInput, purposeInput].forEach((el) => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });

    // Format values for display
    const formattedDate = formatDateToMMDDYYYY(dateVal);
    const formattedTime = formatTimeTo12Hour(timeVal);

    // create new table row
    const tr = document.createElement('tr');
    const tdDate = document.createElement('td');
    tdDate.textContent = formattedDate;
    const tdDoc = document.createElement('td');
    tdDoc.textContent = purposeVal;
    const tdStatus = document.createElement('td');
    tdStatus.textContent = 'Pending';
    tdStatus.className = 'pending';

    tr.appendChild(tdDate);
    tr.appendChild(tdDoc);
    tr.appendChild(tdStatus);

    // insert at top of tbody
    if (tbody.firstChild) tbody.insertBefore(tr, tbody.firstChild);
    else tbody.appendChild(tr);

    // show modal
    showSuccessModal(() => {
      // on modal close: reset form and optionally scroll to table
      form.reset();
      // scroll to the newly added entry
      tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // remove red outline when user types
  [dateInput, timeInput, purposeInput].forEach((el) => {
    el.addEventListener('input', () => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });
  });

  // helpers
  function formatDateToMMDDYYYY(isoDate) {
    // isoDate is like "YYYY-MM-DD"
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }

  function formatTimeTo12Hour(time24) {
    // time24 is like "HH:MM"
    const [hStr, m] = time24.split(':');
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${ampm}`;
  }

  function showSuccessModal(onClose) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0,0,0,0.35)';
    overlay.style.zIndex = '9999';

    // Modal box
    const box = document.createElement('div');
    box.style.width = '90%';
    box.style.maxWidth = '420px';
    box.style.background = '#ffffff';
    box.style.borderRadius = '10px';
    box.style.padding = '26px 20px';
    box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    box.style.textAlign = 'center';
    box.style.fontFamily = 'Poppins, sans-serif';

    const msg = document.createElement('p');
    msg.style.margin = '0 0 18px 0';
    msg.style.color = '#0b5bd7';
    msg.style.fontWeight = '700';
    msg.style.fontSize = '15px';
    msg.innerHTML = `Your appointment request has been<br>submitted successfully!<br><span style="font-weight:400;color:#333;margin-top:10px;display:block;font-size:13px;">We'll review your details shortly.</span>`;

    const btn = document.createElement('button');
    btn.textContent = 'Okay';
    btn.style.background = '#0b78e6';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '8px 22px';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = '600';

    btn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      if (typeof onClose === 'function') onClose();
    });

    box.appendChild(msg);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // keyboard accessibility: close on Escape
    function keyHandler(e) {
      if (e.key === 'Escape') {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
        document.removeEventListener('keydown', keyHandler);
        if (typeof onClose === 'function') onClose();
      }
    }
    document.addEventListener('keydown', keyHandler);
  }
});
