// register.js

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('register-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const message = document.getElementById('message');

  function showMessage(text, type) {
    message.textContent = text;
    message.style.color = (type === 'error') ? '#c0392b' : (type === 'success' ? '#27ae60' : '#1a1a1a');
  }


  if (!form) {
    // Fail early if the element is missing — helps debugging
    console.error('register.js: #register-form not found');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = (emailInput.value || '').trim();
    const password = passwordInput.value || '';

    if (!email) return showMessage('Please enter your email address.', 'error');
    // basic email check
    if (!/\S+@\S+\.\S+/.test(email)) return showMessage('Please enter a valid email address.', 'error');
    if (password.length < 6) return showMessage('Password must be at least 6 characters long.', 'error');

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('mv_users') || '[]');
    } catch (err) {
      users = [];
    }

    const lowerEmail = email.toLowerCase();
    if (users.some(u => u.email && u.email.toLowerCase() === lowerEmail)) {
      return showMessage('This email is already registered. Please sign in instead.', 'error');
    }

    users.push({ email: email, password: password });
    localStorage.setItem('mv_users', JSON.stringify(users));
    setTimeout(function () {
      window.location.href = 'Log-in.html';
    }, 300);
  });
});
