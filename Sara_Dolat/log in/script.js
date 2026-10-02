let roleButtons = document.querySelectorAll('.role button');
let message = document.getElementById('message');

let selectedRole = 'HR';

function selectRole(role) {
    selectedRole = role;

    roleButtons.forEach(button => {
        button.classList.toggle(
            'active',
            button.id.toLowerCase() === role.toLowerCase()
        );
    });
}

document.getElementById('employee').onclick = () => selectRole('Employee');
document.getElementById('hr').onclick = () => selectRole('HR');

selectRole(selectedRole);

document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    fetch('../../employee.json')
        .then(response => response.json())
        .then(data => {

            let user = data.employees.find(user =>
                user.email === email &&
                user.password === password &&
                user.role === selectedRole
            );

            if (user) {
                localStorage.setItem(
                  'currentUser',
                 JSON.stringify(user)
                   );

                localStorage.setItem('email', email);
                localStorage.setItem('password', password);

                if (user.role === 'HR') {
                    location.href = '../../Timaaa/Dashboard-HR/index.html';
                } else {
                    location.href = '../../Timaaa/services/index.html';
                }

            } else {
                message.textContent = 'Wrong email, password or role';
            }
        });
};