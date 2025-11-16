// Certificate-request.js
// Handles certificate-request form submission: validation, table update, and success modal.

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('certificate-form');
  const dateInput = document.getElementById('date');
  const docTypeSelect = document.getElementById('doc-type');
  const timeInput = document.getElementById('time');
  const purposeInput = document.getElementById('purpose');
  const tbody = document.querySelector('.pending-section table tbody');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const dateVal = dateInput.value;
    const docVal = docTypeSelect.value;
    const timeVal = timeInput.value;
    const purposeVal = purposeInput.value.trim();

    // simple validation: ensure all required fields are present
    const missing = [];
    if (!dateVal) missing.push(dateInput);
    if (!docVal) missing.push(docTypeSelect);
    if (!timeVal) missing.push(timeInput);
    if (!purposeVal) missing.push(purposeInput);

    if (missing.length) {
      // highlight missing fields and focus the first
      missing.forEach((el) => {
        el.style.borderColor = '#d9534f';
        el.style.boxShadow = '0 0 0 3px rgba(217,83,79,0.08)';
      });
      missing[0].focus();
      return;
    }

    // clear any prior error styles
    [dateInput, docTypeSelect, timeInput, purposeInput].forEach((el) => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });

    const formattedDate = formatDateToMMDDYYYY(dateVal);
    const docText = getSelectedOptionText(docTypeSelect);
    const formattedTime = formatTimeTo12Hour(timeVal);

    // create new table row
    const tr = document.createElement('tr');
    const tdDate = document.createElement('td');
    tdDate.textContent = formattedDate;
    const tdDoc = document.createElement('td');
    tdDoc.textContent = docText;
    const tdStatus = document.createElement('td');
    tdStatus.textContent = 'Pending';
    tdStatus.className = 'pending';

    tr.appendChild(tdDate);
    tr.appendChild(tdDoc);
    tr.appendChild(tdStatus);

    // prepend to the table body so newest are on top
    if (tbody.firstChild) tbody.insertBefore(tr, tbody.firstChild);
    else tbody.appendChild(tr);

    // show success modal then reset form when closed
    showSuccessModal('certificate', () => {
      form.reset();
      tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // remove red outline when user changes inputs
  [dateInput, docTypeSelect, timeInput, purposeInput].forEach((el) => {
    el.addEventListener('input', () => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });
    el.addEventListener('change', () => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });
  });

  function getSelectedOptionText(selectEl) {
    const opt = selectEl.options[selectEl.selectedIndex];
    return opt ? opt.text : selectEl.value;
  }

  function formatDateToMMDDYYYY(isoDate) {
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }

  function formatTimeTo12Hour(time24) {
    const [hStr, m] = time24.split(':');
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${ampm}`;
  }

  function showSuccessModal(type, onClose) {
    // create overlay
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

    // modal box
    const box = document.createElement('div');
    box.style.width = '92%';
    box.style.maxWidth = '520px';
    box.style.background = '#ffffff';
    box.style.borderRadius = '10px';
    box.style.padding = '24px 22px';
    box.style.boxShadow = '0 12px 30px rgba(0,0,0,0.18)';
    box.style.textAlign = 'center';
    box.style.fontFamily = 'Poppins, sans-serif';

    const title = document.createElement('p');
    title.style.margin = '0 0 12px 0';
    title.style.color = '#0b5bd7';
    title.style.fontWeight = '700';
    title.style.fontSize = '16px';
    title.innerHTML = `Your ${type === 'certificate' ? 'certificate' : 'appointment'} request has been<br>submitted successfully!`;

    const subtitle = document.createElement('div');
    subtitle.style.color = '#333';
    subtitle.style.fontSize = '13px';
    subtitle.style.marginBottom = '16px';
    subtitle.textContent = "We'll review your details shortly.";

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
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
      cleanup();
      if (typeof onClose === 'function') onClose();
    });

    box.appendChild(title);
    box.appendChild(subtitle);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    function keyHandler(e) {
      if (e.key === 'Escape') {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
        cleanup();
        if (typeof onClose === 'function') onClose();
      }
    }
    document.addEventListener('keydown', keyHandler);

    function cleanup() {
      document.removeEventListener('keydown', keyHandler);
    }
  }
});
