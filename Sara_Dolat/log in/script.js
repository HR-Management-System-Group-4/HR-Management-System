let roleButtons = document.querySelectorAll('.role button');
let message = document.getElementById('message');
let selectedRole = 'HR';

function selectRole(role) {
    selectedRole = role;
    roleButtons.forEach(button =>
        button.classList.toggle('active',
            button.id.toLowerCase() === role.toLowerCase())
    );
}

document.getElementById('employee').onclick = () => selectRole('Employee');
document.getElementById('hr').onclick = () => selectRole('HR');
selectRole(selectedRole);

document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (password.length < 6) {
        message.textContent = 'Password must be at least 6 characters';
        return;
    }

    fetch('../../employee.json')
        .then(response => response.json())
        .then(data => {

            let user = data.employees.find(user =>
                user.email === email &&
                user.password === password &&
                user.role === selectedRole
            );

            if (!user) {
                let employees =
                    JSON.parse(localStorage.getItem('employees')) || [];

                let localEmployee = employees.find(employee =>
                    employee.email === email &&
                    employee.password === password
                );

                if (localEmployee) {user = localEmployee;
                            }            }

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('loggedInUserId', String(user.id));

                location.href = user.role === 'HR'
                    ? '../../Timaaa/Dashboard-HR/index.html'
                    : '../../Ahmad/Homepage/index.html';
            } else {
                message.textContent = 'Wrong email, password or role';
            }
        })
     
};


