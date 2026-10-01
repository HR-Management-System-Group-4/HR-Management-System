let selectedRole = "";

// ================= EMPLOYEE =================
document.getElementById("employee").onclick = function () {

    selectedRole = "Employee";

    this.classList.add("active");
    document.getElementById("hr").classList.remove("active");
};


// ================= HR =================
document.getElementById("hr").onclick = function () {

    selectedRole = "HR";

    this.classList.add("active");
    document.getElementById("employee").classList.remove("active");
};


// ================= LOGIN =================
document.getElementById("login").onclick = function () {

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let message = document.getElementById("message");

    // Check empty fields
    if (email === "" || password === "") {
        message.innerText = "Please enter email and password";
        return;
    }

    // Check role
    if (selectedRole === "") {
        message.innerText = "Please select Employee or HR";
        return;
    }

    // Get employees from JSON
    fetch("employee.json")

        .then(response => response.json())

        .then(data => {

            // Find user
            let user = data.employees.find(user =>
                user.email === email &&
                user.role === selectedRole
            );

            // User not found
            if (!user) {
                message.innerText = "Invalid email or role";
                return;
            }

            // Check account state
            if (user.accountState !== "Active") {
                message.innerText = "Your account is inactive";
                return;
            }

            // Check password
            if (user.password !== password) {
                message.innerText = "Invalid password";
                return;
            }

            // ================= SAVE EMAIL + PASSWORD =================

            localStorage.setItem("email", email);
            localStorage.setItem("password", password);


            // ================= REDIRECT =================

            if (user.role === "Employee") {

                window.location.href = "Employee.html";

            } else if (user.role === "HR") {

                window.location.href = "HR.html";
            }

        })

        .catch(error => {

            console.error(error);

            message.innerText = "Error loading employee data";
        });

};