
// Main Elements

let btn = document.getElementById("addTaskButton");

let taskDialog = document.getElementById("taskDialog");

let taskForm = document.getElementById("taskForm");

let taskList = document.getElementById("taskList");

let closeTaskButton = document.getElementById("closeTaskButton");

let cancelTaskButton = document.getElementById("cancelTaskButton");

let closeViewButton = document.getElementById("closeViewButton");

let saveTaskButton = document.getElementById("saveTaskButton");

let toast = document.getElementById("toast");

// Variables


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let selectedEmployees = [];

let availableEmployees = [];

let taskToDelete = "";

let currentViewTaskId = "";

let activeFilter = "All";

let toastTimer;

// Toast


function showToast(message) {
  toast.textContent = message;

  toast.classList.add("show");


  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 3500);
}


// Open Add Task Popup


btn.onclick = function () {
  taskForm.reset();
  taskForm.classList.add("is-creating");

  document.getElementById("taskId").value = "";


  displaySelectedEmployees();

  syncEmployeeCheckboxes();

  document.getElementById("formTitle").innerHTML = "Add a task";

  saveTaskButton.innerHTML = `
        <i class="bi bi-plus-lg"></i>
        Create Task
    `;

  // Default values
  document.getElementById("taskPriority").value = "Medium";

  document.getElementById("taskStatus").value = "Pending";

  updateDecorations();

  taskDialog.showModal();
};

// ========================================
// Close Add / Edit Popup
// ========================================

closeTaskButton.onclick = function () {
  taskDialog.close();
};

cancelTaskButton.onclick = function () {
  taskDialog.close();
};

// ========================================
// Employee Dropdown
// ========================================

let assigneeToggle = document.getElementById("assigneeToggle");

let assigneeDropdown = document.getElementById("assigneeDropdown");

assigneeToggle.onclick = function () {
  if (assigneeDropdown.hidden == true) {
    assigneeDropdown.hidden = false;

    assigneeToggle.innerHTML = `
            <i class="bi bi-chevron-up"></i>
        `;
  } else {
    assigneeDropdown.hidden = true;

    assigneeToggle.innerHTML = `
            <i class="bi bi-chevron-down"></i>
        `;
  }
};

// ========================================
// Load Employees From JSON
// ========================================

function displayEmployees() {
  let employeeOptions = document.getElementById("employeeOptions");

  fetch("../../employee.json")
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      let employees;


      if (Array.isArray(data)) {
        employees = data;
      } else {
        employees = data.employees;
      }

      availableEmployees = employees;

      employeeOptions.innerHTML = "";

      for (let i = 0; i < employees.length; i++) {
        // Only active Employees
        // Do not show HR or inactive accounts

        if (
          employees[i].role == "Employee" &&
          employees[i].accountState == "Active"
        ) {
          let name = employees[i].name;

          let initials = getInitials(name);

          employeeOptions.innerHTML += `

                        <label class="employee-option">

                            <input
                                type="checkbox"
                                value="${name}"
                                onchange="selectEmployee(this)"
                            >


                            <span
                                class="employee-avatar avatar-${i % 6}"
                            >

                                ${initials}

                            </span>


                            <span>
                                ${name}
                            </span>

                        </label>

                    `;
        }
      }

      syncEmployeeCheckboxes();
    });
}

// ========================================
// Get Employee Initials
// ========================================

function getInitials(name) {
  let words = name.split(" ");

  let initials = words[0][0];

  return initials.toUpperCase();
}

// ========================================
// Select Employee
// ========================================

  function selectEmployee(checkbox) {
    if (checkbox.checked) {
      if (!selectedEmployees.includes(checkbox.value)) {
        selectedEmployees.push(checkbox.value);
      }
    } else {
      let index = selectedEmployees.indexOf(checkbox.value);

      if (index != -1) {
        selectedEmployees.splice(index, 1);
      }
    }

    displaySelectedEmployees();
  }

// ========================================
// Display Selected Employees
// ========================================

function displaySelectedEmployees() {
  let box = document.getElementById("selectedEmployees");

  box.innerHTML = "";

  if (selectedEmployees.length == 0) {
    box.innerHTML = `

            <span class="assignee-placeholder">

                Select team members...

            </span>

        `;

    return;
  }

  for (let i = 0; i < selectedEmployees.length; i++) {
    let name = selectedEmployees[i];

    let initials = getInitials(name);

    box.innerHTML += `

            <span class="employee-chip">


                <span class="employee-avatar">

                    ${initials}

                </span>


                <span>

                    ${name}

                </span>


                <button
                    type="button"
                    onclick="removeEmployee('${name}')"
                >

                    <i class="bi bi-x"></i>

                </button>


            </span>

        `;
  }
}

// ========================================
// Remove Selected Employee
// ========================================

function removeEmployee(name) {
  let index = selectedEmployees.indexOf(name);

  if (index != -1) {
    selectedEmployees.splice(index, 1);
  }

  syncEmployeeCheckboxes();

  displaySelectedEmployees();
}

// ========================================
// Sync Checkboxes
// ========================================

function syncEmployeeCheckboxes() {
  let checkboxes = document.querySelectorAll("#employeeOptions input");

  for (let i = 0; i < checkboxes.length; i++) {
    if (selectedEmployees.includes(checkboxes[i].value)) {
      checkboxes[i].checked = true;
    } else {
      checkboxes[i].checked = false;
    }
  }
}

// ========================================
// Search Employees
// ========================================

let employeeSearch = document.getElementById("employeeSearch");

employeeSearch.oninput = function () {
  let search = employeeSearch.value.toLowerCase();

  let employees = document.getElementsByClassName("employee-option");

  for (let i = 0; i < employees.length; i++) {
    let name = employees[i].innerText.toLowerCase();

    if (name.includes(search)) {
      employees[i].style.display = "flex";
    } else {
      employees[i].style.display = "none";
    }
  }
};

// ========================================
// Create / Edit Task
// ========================================

taskForm.onsubmit = function (event) {
  event.preventDefault();

  if (selectedEmployees.length == 0) {
    showToast("Please select at least one employee.");

    return;
  }

  let taskId = document.getElementById("taskId").value;

  let taskTitle = document.getElementById("taskTitle").value;

  let taskDescription = document.getElementById("taskDescription").value;

  let assignTo = selectedEmployees.slice();

  let assigneeIds = availableEmployees
    .filter(function (employee) {
      return selectedEmployees.includes(employee.name);
    })
    .map(function (employee) {
      return employee.id;
    });

  let priority = document.getElementById("taskPriority").value;

  let dueDate = document.getElementById("taskDueDate").value;

  let status = document.getElementById("taskStatus").value;

  let notes = document.getElementById("taskNotes").value;

  // ====================================
  // Create New Task
  // ====================================

  if (taskId == "") {
    let task = {
      id: Date.now(),

      title: taskTitle,

      description: taskDescription,

      assignTo: assignTo,

      assigneeIds: assigneeIds,

      assignedDate: new Date().toISOString().slice(0, 10),

      priority: priority,

      dueDate: dueDate,

      status: "Pending",

      notes: notes,

      solution: "",

      reviewNote: "",
    };

    tasks.push(task);

    showToast("Task added successfully.");
  }

  // ====================================
  // Edit Existing Task
  // ====================================
  else {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == taskId) {
        tasks[i].title = taskTitle;

        tasks[i].description = taskDescription;

        tasks[i].assignTo = assignTo;

        tasks[i].assigneeIds = assigneeIds;

        tasks[i].priority = priority;

        tasks[i].dueDate = dueDate;

        tasks[i].status = status;

        tasks[i].notes = notes;

        showToast("Task updated successfully.");

        break;
      }
    }
  }

  // Save
  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();

  taskForm.reset();

  document.getElementById("taskId").value = "";

  selectedEmployees = [];

  displaySelectedEmployees();

  syncEmployeeCheckboxes();

  assigneeDropdown.hidden = true;

  taskDialog.close();
};

// ========================================
// Get Employees From Task
// ========================================

function getTaskEmployees(task) {
  // New tasks use array

  if (Array.isArray(task.assignTo)) {
    return task.assignTo;
  }

  // Old saved tasks may contain
  // one employee as string

  if (task.assignTo) {
    return [task.assignTo];
  }

  return [];
}

// ========================================
// Get Employees As Text
// ========================================

function getEmployeesText(task) {
  let employees = getTaskEmployees(task);

  return employees.join(", ");
}

// ========================================
// Display Tasks
// ========================================

function displayTasks() {
  taskList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    // =================================
    // Filter
    // =================================

    if (activeFilter != "All" && tasks[i].status != activeFilter) {
      continue;
    }

    // =================================
    // Status Class
    // =================================

    let statusClass = "";

    if (tasks[i].status == "Pending") {
      statusClass = "pending";
    }

    if (tasks[i].status == "In Progress") {
      statusClass = "progress";
    }

    if (tasks[i].status == "Submitted") {
      statusClass = "submitted";
    }

    if (tasks[i].status == "Completed") {
      statusClass = "completed";
    }

    // =================================
    // Card
    // =================================

    taskList.innerHTML += `

            <div
                class="task-card priority-${tasks[i].priority.toLowerCase()}"
            >


                <div class="task-body">


                    <div class="task-symbol">

                        <i class="bi bi-file-earmark-text"></i>

                    </div>


                    <div class="task-copy">


                        <h3>

                            ${tasks[i].title}

                        </h3>


                        <p class="task-description">

                            ${tasks[i].description}

                        </p>


                        <div class="chips">


                            <span
                                class="chip priority-${tasks[i].priority.toLowerCase()}"
                            >

                                ${tasks[i].priority}

                            </span>


                            <span
                                class="chip status-${statusClass}"
                            >

                                ${tasks[i].status}

                            </span>


                        </div>


                        <div class="task-meta">


                            <span>

                                <i class="bi bi-calendar3"></i>

                                ${tasks[i].dueDate}

                            </span>


                            <span class="divider"></span>


                            <span>

                                <i class="bi bi-people"></i>

                                ${getEmployeesText(tasks[i])}

                            </span>


                        </div>


                    </div>


                </div>



                <div class="task-actions">


                    <button
                        class="icon-action view"
                        type="button"
                        onclick="viewTask(${tasks[i].id})"
                    >

                        <i class="bi bi-eye-fill"></i>

                    </button>


                    <button
                        class="icon-action edit"
                        type="button"
                        onclick="editTask(${tasks[i].id})"
                    >

                        <i class="bi bi-pencil-fill"></i>

                    </button>


                    <button
                        class="icon-action delete"
                        type="button"
                        onclick="deleteTask(${tasks[i].id})"
                    >

                        <i class="bi bi-trash3-fill"></i>

                    </button>


                </div>


            </div>

        `;
  }

  updateCounters();
}

// ========================================
// View Task
// ========================================

function viewTask(id) {
  let viewDialog = document.getElementById("viewDialog");

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      currentViewTaskId = tasks[i].id;

      document.getElementById("viewTitle").innerHTML = tasks[i].title;

      document.getElementById("viewAssignee").innerHTML = getEmployeesText(
        tasks[i],
      );

      document.getElementById("viewDueDate").innerHTML = tasks[i].dueDate;

      document.getElementById("viewPriority").innerHTML = tasks[i].priority;

      document.getElementById("viewStatus").innerHTML = tasks[i].status;

      document.getElementById("viewDescription").innerHTML =
        tasks[i].description;

      document.getElementById("viewNotes").innerHTML =
        tasks[i].notes || "No notes";

      document.getElementById("viewSolution").innerHTML =
        tasks[i].solution || "No solution has been submitted yet.";

      let reviewPanel = document.getElementById("reviewPanel");

      if (tasks[i].status == "Submitted") {
        reviewPanel.hidden = false;
      } else {
        reviewPanel.hidden = true;
      }

      document.getElementById("reviewFeedback").value =
        tasks[i].reviewNote || "";

      viewDialog.showModal();

      break;
    }
  }
}

// ========================================
// Close View
// ========================================

closeViewButton.onclick = function () {
  document.getElementById("viewDialog").close();
};

// ========================================
// Edit Task
// ========================================

function editTask(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      taskForm.classList.remove("is-creating");
      // Store ID
      document.getElementById("taskId").value = tasks[i].id;

      // Fill inputs
      document.getElementById("taskTitle").value = tasks[i].title;

      document.getElementById("taskDescription").value = tasks[i].description;

      document.getElementById("taskPriority").value = tasks[i].priority;

      document.getElementById("taskDueDate").value = tasks[i].dueDate;

      document.getElementById("taskStatus").value = tasks[i].status;

      document.getElementById("taskNotes").value = tasks[i].notes || "";

      // Selected employees
      selectedEmployees = getTaskEmployees(tasks[i]).slice();

      displaySelectedEmployees();

      syncEmployeeCheckboxes();

      // Change popup title
      document.getElementById("formTitle").innerHTML = "Edit task";

      saveTaskButton.innerHTML = `

                <i class="bi bi-check2"></i>

                Save Changes

            `;

      updateDecorations();

      taskDialog.showModal();

      break;
    }
  }
}

// ========================================
// Delete Task
// ========================================

function deleteTask(id) {
  taskToDelete = id;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      document.getElementById("deleteMessage").innerHTML =
        `Are you sure you want to delete "${tasks[i].title}"?`;

      break;
    }
  }

  document.getElementById("deleteDialog").showModal();
}

// ========================================
// Delete Dialog Buttons
// ========================================

let closeDeleteButton = document.getElementById("closeDeleteButton");

let cancelDeleteButton = document.getElementById("cancelDeleteButton");

let confirmDeleteButton = document.getElementById("confirmDeleteButton");

closeDeleteButton.onclick = function () {
  document.getElementById("deleteDialog").close();
};

cancelDeleteButton.onclick = function () {
  document.getElementById("deleteDialog").close();
};

// ========================================
// Confirm Delete
// ========================================

confirmDeleteButton.onclick = function () {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskToDelete) {
      tasks.splice(i, 1);

      break;
    }
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();

  document.getElementById("deleteDialog").close();

  taskToDelete = "";

  showToast("Task deleted successfully.");
};

// ========================================
// Approve Submitted Task
// ========================================

let approveButton = document.getElementById("approveButton");

approveButton.onclick = function () {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentViewTaskId) {
      tasks[i].status = "Completed";

      tasks[i].reviewNote = document.getElementById("reviewFeedback").value;

      break;
    }
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();

  document.getElementById("viewDialog").close();

  showToast("Task approved.");
};

// ========================================
// Request Changes
// ========================================

let requestChangesButton = document.getElementById("requestChangesButton");

requestChangesButton.onclick = function () {
  let feedback = document.getElementById("reviewFeedback").value;

  if (feedback.trim() == "") {
    showToast("Please add feedback first.");

    return;
  }

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentViewTaskId) {
      tasks[i].status = "In Progress";

      tasks[i].reviewNote = feedback;

      break;
    }
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();

  document.getElementById("viewDialog").close();

  showToast("Changes requested.");
};

// ========================================
// Task Counters
// ========================================

function updateCounters() {
  let progress = 0;

  let submitted = 0;

  let completed = 0;

  let pending = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status == "Pending") {
      pending++;
    }

    if (tasks[i].status == "In Progress") {
      progress++;
    }

    if (tasks[i].status == "Submitted") {
      submitted++;
    }

    if (tasks[i].status == "Completed") {
      completed++;
    }
  }

  document.getElementById("totalCount").innerHTML = tasks.length;

  let pendingCount = document.getElementById("pendingCount");

  if (pendingCount) {
    pendingCount.innerHTML = pending;
  }

  document.getElementById("progressCount").innerHTML = progress;

  document.getElementById("submittedCount").innerHTML = submitted;

  document.getElementById("completedCount").innerHTML = completed;

  let allBadge = document.getElementById("allBadge");

  if (allBadge) {
    allBadge.innerHTML = tasks.length;
  }

  let reviewBadge = document.getElementById("reviewBadge");

  if (reviewBadge) {
    if (submitted > 0) {
      reviewBadge.innerHTML = submitted;
    } else {
      reviewBadge.innerHTML = "";
    }
  }
}

// ========================================
// Task Filters
// ========================================

let filterButtons = document.getElementsByClassName("filter");

for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].onclick = function () {
    activeFilter = this.getAttribute("data-filter");

    for (let j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove("active");
    }

    this.classList.add("active");

    displayTasks();
  };
}

// ========================================
// Small Visual Updates
// ========================================

function updateDecorations() {
  let prioritySelect = document.querySelector(".priority-select");

  let statusSelect = document.querySelector(".status-select");

  let dateField = document.getElementById("dateField");

  if (prioritySelect) {
    prioritySelect.setAttribute(
      "data-value",
      document.getElementById("taskPriority").value,
    );
  }

  if (statusSelect) {
    statusSelect.setAttribute(
      "data-value",
      document.getElementById("taskStatus").value,
    );
  }

  if (dateField) {
    if (document.getElementById("taskDueDate").value != "") {
      dateField.classList.add("has-value");
    } else {
      dateField.classList.remove("has-value");
    }
  }

  // Description counter
  // Works only if this element exists in HTML

  let descriptionCount = document.getElementById("descriptionCount");

  if (descriptionCount) {
    let length = document.getElementById("taskDescription").value.length;

    descriptionCount.innerHTML = length + "/1000";
  }
}

// ========================================
// Update Decorations When Inputs Change
// ========================================

document.getElementById("taskPriority").onchange = function () {
  updateDecorations();
};

document.getElementById("taskStatus").onchange = function () {
  updateDecorations();
};

document.getElementById("taskDueDate").onchange = function () {
  updateDecorations();
};

document.getElementById("taskDescription").oninput = function () {
  updateDecorations();
};

// ========================================
// Start Page
// ========================================

displayEmployees();

displayTasks();

updateDecorations();
