const form = document.querySelector('#loginForm');
const error = document.querySelector('#loginError');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = form.elements.email.value.trim().toLowerCase();
  const password = form.elements.password.value;
  if (email === 'hr@mysta.demo' && password === 'demo1234') {
    window.location.href = '../../Timaaa/Dashboard-HR/index.html';
    return;
  }
  error.hidden = false;
});

form.addEventListener('input', () => { error.hidden = true; });
