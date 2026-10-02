fetch("../employee.json") 
    .then(response => response.json()) 
    .then(data => { 
        let employees = Array.isArray(data) ? data : data.employees; 
        console.log(employees); 
 

 
 
const savedEmployees = localStorage.getItem("employees"); 
if(savedEmployees != null){ 
    const saved = JSON.parse(savedEmployees); 
    employees = Array.isArray(saved) ? saved : saved.employees; 
} 
else{ 
    localStorage.setItem("employees", JSON.stringify(employees)); 
} 
 
 
 
 
let addEmployee = document.querySelector(".addEmployee button"); 
let cancelEmployee = document.querySelector("#cancelNewEmployee"); 
let saveEmployee = document.querySelector("#saveNewEmployee"); 
 
addEmployee.addEventListener("click", function(){ 
    const newEmployee = {}; 
    document.querySelector(".addEmployeeForm").style.display = "block"; 
 
 
    saveEmployee.addEventListener("click", function(){ 
    newEmployee.name = document.querySelector("#fullNameNew").value; 
    newEmployee.email = document.querySelector("#workEmailNew").value; 
    newEmployee.password = document.querySelector("#passwordNew").value; 
    newEmployee.position = document.querySelector("#positionNew").value; 
    newEmployee.department = document.querySelector("#departmentNew").value; 
    newEmployee.accountState = document.querySelector("#accountStatusNew").value; 
 
    employees.push(newEmployee); 
    localStorage.setItem("employees", JSON.stringify(employees)); 
 
}) 
}) 
 
cancelEmployee.addEventListener("click", function(){ 
    document.querySelector(".addEmployeeForm").style.display = "none"; 
}) 
 
 
 
 
 
 
 
 
 
 let table = document.querySelector("#employeesBody"); 
  
  
  
        employees.forEach(employee => { 
            
            let row = document.createElement("tr"); 
 
            row.innerHTML = ` 
                <td>
                    <div class="employeeProfile">

                        <img class="employeeImage" src="${employee.profileImage}" alt="${employee.name}">

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
                        <button type="button" class="blockEmployee">${employee.accountState.toLowerCase()=="active" ? "block":"Unblock"}</button>
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
            let saveButton  = document.querySelector("#saveEmployee"); 
             
             
            editButtons.addEventListener("click", function(){ 
                editForm.style.display = "block"; 
                editForm.querySelector("#fullName").value = employee.name; 
                editForm.querySelector("#workEmail").value = employee.email; 
                editForm.querySelector("#position").value = employee.position; 
                editForm.querySelector("#department").value = employee.department; 
                editForm.querySelector("#accountStatus").value = 
                    employee.accountState.toLowerCase(); 
 
 
 
                    saveButton.onclick = function (event) { 
                    event.preventDefault(); 
                    employee.name = editForm.querySelector("#fullName").value; 
                    employee.email = editForm.querySelector("#workEmail").value; 
                    employee.position = editForm.querySelector("#position").value; 
                    employee.department = editForm.querySelector("#department").value; 
                    employee.accountState = editForm.querySelector("#accountStatus").value; 
 
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
 
 
                };       
                }) 

            let status = row.querySelector(".employeeStatus");
            let block = row.querySelector(".blockEmployee"); 
            block.addEventListener("click", function(){ 
                if(employee.accountState.toLowerCase() == "active"){ 
                    employee.accountState = "Inactive"; 
                    status.className = "employeeStatus inactive"; 
                    row.classList.add("disabled"); 
                    block.textContent = "Unblock"; 
                    status.textContent = "Inactive";
                } 
                else{ 
                    employee.accountState = "Active"; 
                    status.className = "employeeStatus active"; 
                    row.classList.remove("disabled"); 
                    block.textContent = "Block"; 
                    status.textContent = "Active";
                } 
                localStorage.setItem("employees", JSON.stringify(employees));
 
            }) 
 
 
          
                 
 
            let cancel = document.querySelector("#cancel"); 
            cancel.addEventListener("click", function(){ 
                editForm.style.display = "none"; 
            }) 
 
        }); 
        let rows = document.querySelectorAll("#employeesBody tr"); 
        let search = document.querySelector("#searchEmployee"); 

        search.addEventListener("input", function(){ 
            let searchValue = search.value.toLowerCase(); 

            employees.forEach((employee,index) => { 

                if( 
                    employee.name.toLowerCase().includes(searchValue) || 
                    employee.email.toLowerCase().includes(searchValue) || 
                    employee.department.toLowerCase().includes(searchValue) 
                ) 
                { 
                    rows[index].style.display = "";

                    setTimeout(function(){
                        rows[index].classList.remove("searchHidden");
                    }, 10);
                } 
                else{ 
                    rows[index].classList.add("searchHidden");

                    setTimeout(function(){
                        if(rows[index].classList.contains("searchHidden")){
                            rows[index].style.display = "none";
                        }
                    }, 400);
                } 
            }) 
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

