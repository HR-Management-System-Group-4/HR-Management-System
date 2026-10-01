const roleButtons = document.querySelectorAll('.role button');
const message = document.getElementById('message');
let selectedRole = 'HR';

function selectRole(role) {
  selectedRole = role;
  roleButtons.forEach(button => button.classList.toggle('active', button.id.toLowerCase() === role.toLowerCase()));
}

document.getElementById('employee').addEventListener('click', () => selectRole('Employee'));
document.getElementById('hr').addEventListener('click', () => selectRole('HR'));
selectRole(selectedRole);

document.getElementById('loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  message.textContent = '';

  if (!email || !password) {
    message.textContent = 'Please enter your email and password.';
    return;
  }

  try {
    const response = await fetch('../../employee.json');
    if (!response.ok) throw new Error('Employee data unavailable');
    const data = await response.json();
    const employees = Array.isArray(data) ? data : data.employees;
    const user = employees.find(employee => employee.email.toLowerCase() === email && employee.role === selectedRole);
    if (!user || user.password !== password) {
      message.textContent = 'Incorrect email, password or role.';
      return;
    }
    if (user.accountState !== 'Active') {
      message.textContent = 'This account is inactive.';
      return;
    }

    const { password: ignored, ...sessionUser } = user;
    localStorage.setItem('user', JSON.stringify(sessionUser));
    localStorage.setItem('loggedInUserId', String(user.id));
    location.href = user.role === 'HR'
      ? '../../Timaaa/Dashboard-HR/index.html'
      : '../../Timaaa/services/index.html';
  } catch (error) {
    console.error(error);
    message.textContent = 'Could not load account data. Open the site through the local server.';
  }
});
