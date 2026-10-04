
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


function readTasks() {
  try {
    let saved = JSON.parse(localStorage.getItem("tasks") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (_) {
    return [];
  }
}

let tasks = readTasks();

let selectedEmployees = [];

let availableEmployees = [];

let taskToDelete = "";

let currentViewTaskId = "";

let currentSubmissionIndex = -1;

let activeFilter = "All";

let toastTimer;

function showAllTasks() {
  activeFilter = "All";
  document.querySelectorAll(".filter").forEach(function (button) {
    button.classList.toggle("active", button.dataset.filter === "All");
  });
}

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

  selectedEmployees = [];
  employeeSearch.value = "";
  filterEmployeeOptions();

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
      filterEmployeeOptions();
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

document.getElementById("selectAllEmployees").onclick = function () {
  // Select every active employee, including names hidden by the search filter.
  selectedEmployees = availableEmployees
    .filter(function (employee) {
      return employee.role === "Employee" && employee.accountState === "Active";
    })
    .map(function (employee) { return employee.name; });
  syncEmployeeCheckboxes();
  displaySelectedEmployees();
};

// ========================================
// Search Employees
// ========================================

let employeeSearch = document.getElementById("employeeSearch");

function filterEmployeeOptions() {
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
}

employeeSearch.oninput = filterEmployeeOptions;

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
  let isCreating = taskId === "";
  // A second tab may have changed the list since this page was opened.
  let nextTasks = readTasks();

  // ====================================
  // Create New Task
  // ====================================

  if (isCreating) {
    let task = {
      id: nextTasks.reduce(function (latest, item) {
        return Math.max(latest, Number(item.id) || 0);
      }, Date.now()) + 1,

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

    nextTasks.push(task);
  }

  // ====================================
  // Edit Existing Task
  // ====================================
  else {
    let existingTask = nextTasks.find(function (item) {
      return String(item.id) === taskId;
    });
    if (!existingTask) {
      showToast("This task no longer exists. Refresh the page and try again.");
      return;
    }
    existingTask.title = taskTitle;

    existingTask.description = taskDescription;

    existingTask.assignTo = assignTo;

    existingTask.assigneeIds = assigneeIds;

    existingTask.priority = priority;

    existingTask.dueDate = dueDate;

    existingTask.status = status;

    existingTask.notes = notes;

  }

  try {
    localStorage.setItem("tasks", JSON.stringify(nextTasks));
  } catch (_) {
    showToast("Could not save the task in this browser. Check available storage and try again.");
    return;
  }
  tasks = nextTasks;
  if (isCreating) {
    showAllTasks();
  }

  displayTasks();
  showToast(isCreating ? "Task added successfully." : "Task updated successfully.");

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

  if (Array.isArray(task.assignedTo)) return task.assignedTo;
  if (task.assignedTo) return [task.assignedTo];

  return [];
}

// ========================================
// Get Employees As Text
// ========================================

function getEmployeesText(task) {
  let employees = getTaskEmployees(task);

  return employees.join(", ");
}

function readSolutions() {
  try {
    let saved = JSON.parse(localStorage.getItem("solutions") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (_) {
    return [];
  }
}

function belongsToTask(solution, task) {
  let assigned = getTaskEmployees(task);
  let hasIds = Array.isArray(task.assigneeIds) && task.assigneeIds.length > 0;
  let employeeMatches = solution.employeeId != null && hasIds
    ? task.assigneeIds.some(function (id) {
      return String(id) === String(solution.employeeId);
    }) : assigned.includes(solution.employeeName);
  if (!employeeMatches) return false;
  // Older submissions were saved with a title instead of a task ID.
  return solution.taskId != null
    ? String(solution.taskId) === String(task.id)
    : solution.taskName === task.title;
}

function getTaskSubmissions(task) {
  return readSolutions().filter(function (solution) {
    return belongsToTask(solution, task);
  });
}

function getSubmissionStatus(solution, task) {
  if (solution.status) return solution.status;
  return getTaskEmployees(task).length === 1 && task.status === "Completed"
    ? "Completed" : "Submitted";
}

function getDisplayStatus(task) {
  if (getTaskSubmissions(task).some(function (solution) {
    return getSubmissionStatus(solution, task) === "Submitted";
  })) return "Submitted";
  return task.status;
}

// ========================================
// Display Tasks
// ========================================

function displayTasks() {
  taskList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    let displayStatus = getDisplayStatus(tasks[i]);
    // =================================
    // Filter
    // =================================

    if (activeFilter != "All" && displayStatus != activeFilter) {
      continue;
    }

    // =================================
    // Status Class
    // =================================

    let statusClass = "";

    if (displayStatus == "Pending") {
      statusClass = "pending";
    }

    if (displayStatus == "In Progress") {
      statusClass = "progress";
    }

    if (displayStatus == "Submitted") {
      statusClass = "submitted";
    }

    if (displayStatus == "Completed") {
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

                                ${displayStatus}

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

      document.getElementById("viewStatus").textContent = getDisplayStatus(tasks[i]);

      document.getElementById("viewDescription").innerHTML =
        tasks[i].description;

      document.getElementById("viewNotes").innerHTML =
        tasks[i].notes || "No notes";

      currentSubmissionIndex = -1;
      refreshSubmissionPicker(tasks[i]);

      viewDialog.showModal();

      break;
    }
  }
}

function refreshSubmissionPicker(task) {
  let submissions = getTaskSubmissions(task);
  let picker = document.getElementById("viewSubmission");
  picker.replaceChildren();
  submissions.forEach(function (submission, index) {
    let option = document.createElement("option");
    option.value = String(index);
    option.textContent = submission.employeeName + " — " +
      getSubmissionStatus(submission, task);
    picker.append(option);
  });
  document.getElementById("submissionPicker").hidden = submissions.length < 2;
  let pendingIndex = submissions.findIndex(function (submission) {
    return getSubmissionStatus(submission, task) === "Submitted";
  });
  if (pendingIndex >= 0) currentSubmissionIndex = pendingIndex;
  else if (currentSubmissionIndex < 0 || currentSubmissionIndex >= submissions.length) {
    currentSubmissionIndex = 0;
  }
  picker.value = String(currentSubmissionIndex);
  renderCurrentSubmission();
}

function renderCurrentSubmission() {
  let task = tasks.find(function (item) { return item.id == currentViewTaskId; });
  if (!task) return;
  let submission = getTaskSubmissions(task)[currentSubmissionIndex];
  document.getElementById("viewSolution").textContent = submission
    ? submission.solution : (task.solution || "No solution has been submitted yet.");
  let fileElement = document.getElementById("viewFileName");
  fileElement.replaceChildren();
  if (submission && submission.fileName) {
    if (/^data:[^,]+;base64,/.test(submission.fileData || "")) {
      let link = document.createElement("a");
      link.href = submission.fileData;
      link.download = submission.fileName;
      link.textContent = "Download attachment: " + submission.fileName;
      fileElement.append(link);
    } else {
      fileElement.textContent = "Attached file: " + submission.fileName;
    }
  }
  document.getElementById("reviewFeedback").value = submission
    ? (submission.reviewNote || "") : (task.reviewNote || "");
  document.getElementById("reviewPanel").hidden = !submission ||
    getSubmissionStatus(submission, task) !== "Submitted";
}

document.getElementById("viewSubmission").onchange = function () {
  currentSubmissionIndex = Number(this.value);
  renderCurrentSubmission();
};

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

function reviewCurrentSubmission(status) {
  let task = tasks.find(function (item) { return item.id == currentViewTaskId; });
  if (!task) return false;
  let solutions = readSolutions();
  let matchingIndices = [];
  solutions.forEach(function (solution, index) {
    if (belongsToTask(solution, task)) matchingIndices.push(index);
  });
  let solution = solutions[matchingIndices[currentSubmissionIndex]];
  if (!solution || getSubmissionStatus(solution, task) !== "Submitted") return false;

  solution.status = status;
  solution.reviewNote = document.getElementById("reviewFeedback").value.trim();
  localStorage.setItem("solutions", JSON.stringify(solutions));

  task.employeeStatuses = task.employeeStatuses || {};
  let key = solution.employeeId != null ? String(solution.employeeId)
    : solution.employeeName;
  task.employeeStatuses[key] = status;
  task.employeeStatuses[solution.employeeName] = status;
  let assigned = getTaskEmployees(task);
  let statuses = assigned.map(function (name, index) {
    let employee = availableEmployees.find(function (item) { return item.name === name; });
    let assigneeId = Array.isArray(task.assigneeIds) ? task.assigneeIds[index]
      : employee && employee.id;
    let submission = solutions.find(function (item) {
      return belongsToTask(item, task) && (item.employeeId != null && assigneeId != null
        ? String(item.employeeId) === String(assigneeId) : item.employeeName === name);
    });
    if (submission) return getSubmissionStatus(submission, task);
    return task.employeeStatuses[name] ||
      task.employeeStatuses[String(employee ? employee.id : name)] || "Pending";
  });
  task.status = statuses.includes("Submitted") ? "Submitted"
    : statuses.every(function (item) { return item === "Completed"; }) ? "Completed"
    : statuses.includes("In Progress") || statuses.includes("Completed") ? "In Progress"
    : "Pending";
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
  document.getElementById("viewDialog").close();
  return true;
}

approveButton.onclick = function () {
  if (reviewCurrentSubmission("Completed")) showToast("Submission approved.");
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

  if (reviewCurrentSubmission("In Progress")) showToast("Changes requested.");
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
    let status = getDisplayStatus(tasks[i]);
    if (status == "Pending") {
      pending++;
    }

    if (status == "In Progress") {
      progress++;
    }

    if (status == "Submitted") {
      submitted++;
    }

    if (status == "Completed") {
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

function refreshTasks() {
  tasks = readTasks();
  displayTasks();
  if (document.getElementById("viewDialog").open) {
    let task = tasks.find(function (item) { return item.id == currentViewTaskId; });
    if (task) refreshSubmissionPicker(task);
  }
}

window.addEventListener("storage", function (event) {
  if (!event.key || event.key === "tasks" || event.key === "solutions") {
    showAllTasks();
    refreshTasks();
  }
});
window.addEventListener("focus", refreshTasks);
window.addEventListener("pageshow", refreshTasks);
