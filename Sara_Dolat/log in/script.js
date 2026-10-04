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

    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value;
    message.textContent = '';

    if (password.length < 6) {
        message.textContent = 'Password must be at least 6 characters';
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

            let savedEmployees = [];
            try {
                const saved = JSON.parse(localStorage.getItem('employees'));
                savedEmployees = Array.isArray(saved) ? saved : saved?.employees || [];
            } catch (_) {
                // Invalid saved data must not block the original account list.
            }

            if (!user && selectedRole === 'Employee') {
                const localEmployee = savedEmployees.find(employee =>
                    employee.email === email &&
                    employee.password === password &&
                    (!employee.role || employee.role === selectedRole)
                );
                if (localEmployee) user = { ...localEmployee, role: 'Employee' };
            }

            if (user?.role === 'Employee') {
                const savedUser = savedEmployees.find(employee =>
                    String(employee.id) === String(user.id) || employee.email === user.email
                );
                const accountState = savedUser?.accountState ?? user.accountState;
                if (accountState?.toLowerCase() !== 'active') {
                    message.textContent = 'This account is inactive. Contact HR.';
                    return;
                }
            }

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('user', JSON.stringify(user));
                if (user.id != null) localStorage.setItem('loggedInUserId', String(user.id));
                else localStorage.removeItem('loggedInUserId');
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);

                location.href = user.role === 'HR'
                    ? '../../Timaaa/Dashboard-HR/index.html'
                    : '../../Ahmad/Homepage/index.html';
            } else {
                message.textContent = 'Wrong email, password or role';
            }
        })
        .catch(() => {
            message.textContent = 'Unable to check your account. Please try again.';
        });
};
