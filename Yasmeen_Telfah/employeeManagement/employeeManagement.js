function showError(inputId, message) {
    let input = document.querySelector("#" + inputId);
    let error = document.querySelector("#" + inputId + "Error");

    if (!error) {
        error = document.createElement("p");
        error.id = inputId + "Error";
        error.className = "fieldError";
        error.setAttribute("aria-live", "polite");
        input.insertAdjacentElement("afterend", error);

        input.addEventListener("input", function () {
            error.textContent = "";
            input.removeAttribute("aria-invalid");
        });

        input.setAttribute("aria-describedby", error.id);
    }

    error.textContent = message;
    input.setAttribute("aria-invalid", "true");
}

let blockDialog = document.querySelector("#blockDialog");
let confirmBlockButton = document.querySelector("#confirmBlockButton");
let pendingStatusChange = null;

function closeBlockDialog() {
    blockDialog.close();
}

document.querySelector("#closeBlockButton")
    .addEventListener("click", closeBlockDialog);

document.querySelector("#cancelBlockButton")
    .addEventListener("click", closeBlockDialog);

blockDialog.addEventListener("close", function () {
    pendingStatusChange = null;
});

confirmBlockButton.addEventListener("click", function () {
    const accountState = pendingStatusChange?.();
    closeBlockDialog();
    if (accountState) {
        showAlert("success", accountState === "Active" ? "Employee Activated" : "Employee Deactivated", `The employee account is now ${accountState.toLowerCase()}.`);
    }
});

function clearErrors() {
    document.querySelectorAll(".fieldError").forEach(function (error) {
        error.textContent = "";
    });

    document.querySelectorAll('[aria-invalid="true"]').forEach(function (input) {
        input.removeAttribute("aria-invalid");
    });
}

fetch("../../employee.json")
    .then(response => response.json())
    .then(data => {
        let employees = Array.isArray(data) ? data : data.employees;
        console.log(employees);

const savedEmployees = localStorage.getItem("employees");
if(savedEmployees != null){
    try {
        const saved = JSON.parse(savedEmployees);
        const parsed = Array.isArray(saved) ? saved : saved?.employees;
        if (Array.isArray(parsed)) employees = parsed;
    } catch (_) {
        // Keep the original employee list if saved data is malformed.
    }
}
else{
    localStorage.setItem("employees", JSON.stringify(employees));
}

let nextEmployeeId = Math.max(0, ...employees.map(employee => Number(employee.id) || 0)) + 1;
let normalizedEmployees = false;
employees.forEach(employee => {
    if (employee.id == null) { employee.id = nextEmployeeId++; normalizedEmployees = true; }
    if (!employee.role) { employee.role = "Employee"; normalizedEmployees = true; }
    if (!employee.accountState) { employee.accountState = "Active"; normalizedEmployees = true; }
});
if (normalizedEmployees) localStorage.setItem("employees", JSON.stringify(employees));

let addEmployee = document.querySelector(".addEmployee button");
let cancelEmployee = document.querySelector("#cancelNewEmployee");
let newEmployeeForm = document.querySelector("#newEmployeeForm");
let nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
let emailRegex = /^[^\s@]+@mysta\.com$/i;
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

addEmployee.addEventListener("click", function(event){
    event.preventDefault();
    document.querySelector(".addEmployeeForm").style.display = "block";
})

newEmployeeForm.addEventListener("submit", function(event){
        event.preventDefault();
        let name = document.querySelector("#fullNameNew").value.trim();
        let email = document.querySelector("#workEmailNew").value.trim().toLowerCase();
        let password = document.querySelector("#passwordNew").value;

        clearErrors();
        let hasError = false;

        if (!nameRegex.test(name)) {
            showError("fullNameNew", "Enter a valid full name.");
            hasError = true;
        }

        if (!emailRegex.test(email)) {
            showError("workEmailNew", "Email must end with @mysta.com.");
            hasError = true;
        } else if (employees.some(employee => employee.email?.trim().toLowerCase() === email)) {
            showError("workEmailNew", "An employee already uses this email address.");
            hasError = true;
        }

        if (!passwordRegex.test(password)) {
            showError(
                "passwordNew",
                "Password must be at least 8 characters and contain a letter and a number."
            );
            hasError = true;
        }

        if (hasError) return;

        const newEmployee = {};
        newEmployee.name = name;
        newEmployee.email = email;
        newEmployee.password = password;
        newEmployee.position = document.querySelector("#positionNew").value;
        newEmployee.department = document.querySelector("#departmentNew").value;
        newEmployee.id = Math.max(0, ...employees.map(employee => Number(employee.id) || 0)) + 1;
        newEmployee.role = "Employee";
        newEmployee.accountState = "Active";

        employees.unshift(newEmployee);
        localStorage.setItem("employees", JSON.stringify(employees));
        document.querySelector(".addEmployeeForm").style.display = "none";

        showAlert("success", "Employee Added!", "The employee has been added successfully.").then(() => location.reload());
})

cancelEmployee.addEventListener("click", function(){
        document.querySelector(".addEmployeeForm").style.display = "none";
})

let table = document.querySelector("#employeesBody");

employees.forEach(employee => {
    if(employee.department != "Human Resources"){
            let row = document.createElement("tr");

    row.innerHTML = `
        <td>
            <div class="employeeProfile">
                <img class="employeeImage" src="../../${employee.profileImage}" alt="${employee.name}">
                <div class="employeeInfo">
                    <p class="employeeName">${employee.name}</p>
                    <p class="employeeEmail">${employee.email}</p>
                    <p class="employeeDetails">
                        <span class="employeeId">${employee.id}</span>
                        ·
                        <span class="employeePosition">${employee.position}</span>
                    </p>
                </div>
            </div>
        </td>
        <td class="department">${employee.department}</td>
        <td>
            <span class="employeeStatus">${employee.accountState}</span>
        </td>
        <td>
            <div class="employeeActions">
                <button type="button" class="edit">Edit</button>
                <button type="button" class="blockEmployee">${employee.accountState.toLowerCase()=="active" ? "Deactivate":"Activate"}</button>
            </div>
        </td>
    `;

    if(employee.accountState.toLowerCase() == "active"){
        row.querySelector(".employeeStatus").classList.add("active");
    }
    else {
        row.querySelector(".employeeStatus").classList.add("inactive");
        row.classList.add("disabled");
    }

    table.appendChild(row);

    let editButtons = row.querySelector(".edit");
    let editForm = document.querySelector(".editEmployeeForm");
    let saveButton = document.querySelector("#saveEmployee");

    editButtons.addEventListener("click", function(){
        editForm.style.display = "block";
        editForm.querySelector("#fullName").value = employee.name;
        editForm.querySelector("#workEmail").value = employee.email;
        editForm.querySelector("#position").value = employee.position;
        editForm.querySelector("#department").value = employee.department;


        saveButton.onclick = function (event) {
            event.preventDefault();
            let name = editForm.querySelector("#fullName").value;
            let email = editForm.querySelector("#workEmail").value;

            if (!nameRegex.test(name)) {
                showAlert("error", "Invalid Name", "Please enter a valid full name.");
                return;
            }

            if (!emailRegex.test(email)) {
                showAlert("error", "Invalid Email", "Please enter a valid email address.");
                return;
            }

            employee.name = name;
            employee.email = email;
            employee.position = editForm.querySelector("#position").value;
            employee.department = editForm.querySelector("#department").value;

            row.querySelector(".employeeName").textContent = employee.name;
            row.querySelector(".employeeEmail").textContent = employee.email;
            row.querySelector(".employeePosition").textContent = employee.position;
            row.querySelector(".department").textContent = employee.department;
            let status = row.querySelector(".employeeStatus")
            status.textContent = employee.accountState;
            status.classList.remove("active", "inactive");

            if (employee.accountState.toLowerCase() == "active") {
                status.classList.add("active");
            } else {
                status.classList.add("inactive");
            }

            localStorage.setItem("employees", JSON.stringify(employees));
            editForm.style.display = "none";
            showAlert("success", "Employee Updated!", "The employee has been updated successfully.");
        };
    })

    let status = row.querySelector(".employeeStatus");
    let block = row.querySelector(".blockEmployee");

    block.addEventListener("click", function () {
        let isActive = employee.accountState.toLowerCase() === "active";
        let action = isActive ? "Deactivate" : "Activate";

        document.querySelector("#blockKicker").textContent =
            action.toUpperCase() + " EMPLOYEE";

        document.querySelector("#blockTitle").textContent =
            action + " this employee?";

        document.querySelector("#blockMessage").textContent =
            "Are you sure you want to " +
            action.toLowerCase() + " " + employee.name + "?";

        confirmBlockButton.textContent = action + " Employee";

        pendingStatusChange = function () {
            employee.accountState = isActive ? "Inactive" : "Active";

            status.textContent = employee.accountState;
            status.className = isActive
                ? "employeeStatus inactive"
                : "employeeStatus active";

            row.classList.toggle("disabled", isActive);
            block.textContent = isActive ? "Activate" : "Deactivate";

            localStorage.setItem("employees", JSON.stringify(employees));
            return employee.accountState;
        };

        blockDialog.showModal();
    });

    let cancel = document.querySelector("#cancel");
    cancel.addEventListener("click", function(){
        editForm.style.display = "none";
    })
    }

});

let rows = document.querySelectorAll("#employeesBody tr");
let search = document.querySelector("#searchEmployee");

search.addEventListener("input", function(){
    let searchValue = search.value.toLowerCase();

    rows.forEach(row => {
        let name = row.querySelector(".employeeName").textContent.toLowerCase();
        let email = row.querySelector(".employeeEmail").textContent.toLowerCase();
        let department = row.querySelector(".department").textContent.toLowerCase();

        if(
            name.includes(searchValue) ||
            email.includes(searchValue) ||
            department.includes(searchValue)
        ){
            row.style.display = "";

            setTimeout(function(){
                row.classList.remove("searchHidden");
            }, 10);
        }
        else{
            row.classList.add("searchHidden");

            setTimeout(function(){
                if(row.classList.contains("searchHidden")){
                    row.style.display = "none";
                }
            }, 400);
        }
    });
})

})
.catch(error => {
    console.log("Could not load employees:", error);
})

let currentTime = document.querySelector("#currentTime");
let now = new Date();

// now.toLocaleString() turns it into readable text.
currentTime.textContent = now.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
}).toUpperCase();

let loggedInUser = JSON.parse(localStorage.getItem("user"));

let positionTag = document.querySelector(".positionTag");
let nameTag = document.querySelector(".nameTag");

if(loggedInUser){
    positionTag.textContent = "HR ADMIN";
    nameTag.textContent = loggedInUser.name;
}

let darkModeButton = document.querySelector(".dlmode");

if (localStorage.getItem("darkMode") == "true") {
    document.body.classList.add("dark");
}

darkModeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "true");
    } else {
        localStorage.setItem("darkMode", "false");
    }
});
