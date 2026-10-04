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

document.getElementById('employee').onclick = () =>
    selectRole('Employee');

document.getElementById('hr').onclick = () =>
    selectRole('HR');

selectRole(selectedRole);


document.getElementById('loginForm').onsubmit = function(e) {

    e.preventDefault();

    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value;
    message.textContent = '';

    if (password.length < 6) {
    message.textContent = "Password must be at least 6 characters";
    return;
}

    fetch('../../employee.json')

        .then(response => response.json())

        .then(data => {
            // Keep the original login credentials. HR's saved list is used
            // only to check whether this employee has been blocked.
            let user = data.employees.find(user =>
                user.email === email &&
                user.password === password &&
                user.role === selectedRole
            );

            if (user && user.role === 'Employee') {
                let savedEmployees;
                try {
                    const saved = JSON.parse(localStorage.getItem('employees'));
                    savedEmployees = Array.isArray(saved) ? saved : saved?.employees;
                } catch (_) {
                    // Invalid saved data must not break the original login flow.
                }

                const savedUser = Array.isArray(savedEmployees) && savedEmployees.find(employee =>
                    String(employee.id) === String(user.id) || employee.email === user.email
                );
                const accountState = savedUser?.accountState ?? user.accountState;

                if (accountState?.toLowerCase() !== 'active') {
                    message.textContent = 'This account is inactive. Contact HR.';
                    return;
                }
            }

            if (user) {

                localStorage.setItem(
                    'currentUser',
                    JSON.stringify(user)
                );

                // Shared navigation and feedback pages still read these keys.
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('loggedInUserId', String(user.id));

                localStorage.setItem('email', email);
                localStorage.setItem('password', password);

                if (user.role === 'HR') {

                    location.href =
                        '../../Timaaa/Dashboard-HR/index.html';

                } else {

                    location.href =
                        '../../Ahmad/Homepage/index.html';

                }

            } else {

                message.textContent =
                    'Wrong email, password or role';

            }

        })
        .catch(() => {
            message.textContent = 'Unable to check your account. Please try again.';
        });

};


/* MOUSE LIGHT */
let space = document.querySelector('.space');

space.addEventListener('mousemove', function(e) {

    let light = document.createElement('span');

    light.className = 'mouse-light';

    light.style.left = e.offsetX + 'px';
    light.style.top = e.offsetY + 'px';

    space.appendChild(light);

    setTimeout(() => light.remove(), 400);

});
