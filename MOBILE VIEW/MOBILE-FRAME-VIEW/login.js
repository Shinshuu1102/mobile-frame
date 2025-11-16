// login.js


document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const message = document.getElementById('login-message');

  function showMessage(text, type) {
    if (message) {
      message.textContent = text;
      message.style.color = (type === 'error') ? '#c0392b' : '#27ae60';
    } else {
      console[type === 'error' ? 'warn' : 'log'](text);
    }
  }

  function authenticate(email, password) {
    try {
      const users = JSON.parse(localStorage.getItem('mv_users') || '[]');
      const normalized = (email || '').trim().toLowerCase();
      const found = users.find(u => u.email && u.email.toLowerCase() === normalized);
      if (!found) return { success: false, error: 'User not found' };
      if (found.password !== password) return { success: false, error: 'Invalid password' };
      return { success: true, user: found };
    } catch (err) {
      return { success: false, error: 'Auth storage error' };
    }
  }

  if (!form) {
    console.error('login.js: #login-form not found');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = (emailInput.value || '').trim();
    const password = passwordInput.value || '';

    if (!email || !password) return showMessage('Please enter email and password.', 'error');

    const result = authenticate(email, password);
    if (!result.success) return showMessage(result.error, 'error');

    // Write a simple session marker
    localStorage.setItem('mv_current_user', JSON.stringify({ email: result.user.email, loggedAt: Date.now() }));


    setTimeout(function () {
      // Redirect to the appointments page (change if you want a different page)
      window.location.href = 'Appointment.html';
    }, 300);
  });
});
