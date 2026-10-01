const STORAGE_KEY = "mysta_hr_tasks_v1";

const sampleTasks = [
  { id: "sample-1", title: "Q4 Performance Reviews", description: "Complete performance evaluation forms and submit them to HR.", assignees: ["Omar Khaled", "Lina Hassan"], priority: "High", dueDate: "2026-10-15", status: "In Progress", solution: "" },
  { id: "sample-2", title: "Update Employee Handbook", description: "Review and update the employee handbook policies.", assignee: "Rana Mahmoud", priority: "Medium", dueDate: "2026-10-20", status: "Pending", solution: "" },
  { id: "sample-3", title: "Website Accessibility Audit", description: "Check the new employee portal and document accessibility issues.", assignee: "Maya Nasser", priority: "High", dueDate: "2026-10-24", status: "Submitted", solution: "I reviewed the portal and documented keyboard navigation and contrast issues." },
  { id: "sample-4", title: "October Onboarding Checklist", description: "Prepare the checklist for new starters and confirm all required documents.", assignee: "Lina Hassan", priority: "Low", dueDate: "2026-10-28", status: "Completed", solution: "The checklist and document list are ready.", reviewNote: "Approved. Thank you!" }
];

function get(id) {
  return document.getElementById(id);
}

function loadTasks() {
  try {
    let saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    // Use the examples if this browser has no readable saved data.
  }
  return sampleTasks;
}

let tasks = loadTasks();
let currentFilter = "All";
let viewingId = "";
let deletingId = "";
let toastTimer;

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    showToast("Could not save tasks in this browser.");
    return false;
  }
}

function showToast(message) {
  get("toast").textContent = message;
  get("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    get("toast").classList.remove("show");
  }, 3000);
}

function getAssignees(task) {
  if (Array.isArray(task.assignees) && task.assignees.length > 0) return task.assignees;
  if (task.assignee) return [task.assignee];
  return [];
}

function findTask(id) {
  for (let task of tasks) {
    if (task.id === id) return task;
  }
  return null;
}

function formatDate(date) {
  if (!date) return "No date";
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric"
  });
}

function showTasks() {
  let counts = { Pending: 0, "In Progress": 0, Submitted: 0, Completed: 0 };
  let search = get("taskSearch").value.trim().toLowerCase();
  let list = get("taskList");
  let shown = 0;
  list.innerHTML = "";

  for (let task of tasks) {
    if (counts[task.status] !== undefined) counts[task.status]++;
    if (currentFilter !== "All" && task.status !== currentFilter) continue;

    let people = getAssignees(task).join(", ");
    let text = (task.title + " " + task.description + " " + people).toLowerCase();
    if (!text.includes(search)) continue;

    let card = get("taskTemplate").content.firstElementChild.cloneNode(true);
    let priority = (task.priority || "Medium").toLowerCase();
    let status = (task.status || "Pending").toLowerCase().replace(" ", "");

    card.classList.add("priority-" + priority);
    card.querySelector(".task-title").textContent = task.title;
    card.querySelector(".task-description").textContent = task.description;
    card.querySelector(".task-priority").classList.add("priority-" + priority);
    card.querySelector(".task-priority span").textContent = task.priority;
    card.querySelector(".task-status").classList.add("status-" + (status === "inprogress" ? "progress" : status));
    card.querySelector(".task-status span").textContent = task.status;
    card.querySelector(".task-date").textContent = formatDate(task.dueDate);
    card.querySelector(".task-people").textContent = people;
    card.querySelector(".review-cue").hidden = task.status !== "Submitted";

    card.querySelector(".view").onclick = function () { openView(task.id); };
    card.querySelector(".edit").onclick = function () { openForm(task.id); };
    card.querySelector(".delete").onclick = function () { openDelete(task.id); };
    list.appendChild(card);
    shown++;
  }

  get("totalCount").textContent = tasks.length;
  get("pendingCount").textContent = counts.Pending;
  get("progressCount").textContent = counts["In Progress"];
  get("submittedCount").textContent = counts.Submitted;
  get("completedCount").textContent = counts.Completed;
  get("allBadge").textContent = tasks.length;
  get("reviewBadge").textContent = counts.Submitted || "";

  if (shown === 0) {
    list.innerHTML = '<div class="empty-state"><i class="bi bi-inbox"></i><h3>No tasks found</h3><p>Try another filter or create a new task.</p></div>';
  }
}

function employeeChecks() {
  return document.querySelectorAll("#employeeOptions input");
}

function selectedEmployees() {
  let names = [];
  for (let checkbox of employeeChecks()) {
    if (checkbox.checked) names.push(checkbox.value);
  }
  return names;
}

function showSelectedEmployees() {
  let box = get("selectedEmployees");
  box.innerHTML = "";

  for (let checkbox of employeeChecks()) {
    if (!checkbox.checked) continue;

    let chip = document.createElement("span");
    chip.className = "employee-chip";
    let avatar = checkbox.parentElement.querySelector(".employee-avatar").cloneNode(true);
    let name = document.createElement("span");
    name.textContent = checkbox.value;
    let remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Remove " + checkbox.value);
    remove.onclick = function (event) {
      event.stopPropagation();
      checkbox.checked = false;
      showSelectedEmployees();
    };
    chip.append(avatar, name, remove);
    box.appendChild(chip);
  }

  if (box.children.length === 0) {
    let placeholder = document.createElement("span");
    placeholder.className = "assignee-placeholder";
    placeholder.textContent = "Select team members...";
    box.appendChild(placeholder);
  }
  get("assigneeTrigger").classList.toggle("has-selection", selectedEmployees().length > 0);
}

function openEmployeeList(open) {
  get("assigneeDropdown").hidden = !open;
  get("assigneeTrigger").classList.toggle("is-open", open);
  get("assigneeToggle").querySelector("i").className = open ? "bi bi-chevron-up" : "bi bi-chevron-down";
  if (open) get("employeeSearch").focus();
}

function updateFormStyle() {
  get("taskPriority").parentElement.dataset.value = get("taskPriority").value;
  get("taskStatus").parentElement.dataset.value = get("taskStatus").value;
  get("dateField").classList.toggle("has-value", get("taskDueDate").value !== "");
  get("descriptionCount").textContent = get("taskDescription").value.length + "/1000";
}

function openForm(id) {
  let task = findTask(id);
  get("taskForm").reset();
  get("taskId").value = task ? task.id : "";
  get("formTitle").textContent = task ? "Edit task" : "Add a task";
  get("formSubtitle").textContent = task ? "Update the task, team members and details." : "Create a new task, assign it to team members and set the details.";
  get("saveTaskButton").querySelector("span").textContent = task ? "Save Changes" : "Create Task";
  get("assigneeError").hidden = true;
  get("assigneeTrigger").setAttribute("aria-invalid", "false");
  get("employeeSearch").value = "";

  for (let option of document.querySelectorAll(".employee-option")) option.hidden = false;
  for (let checkbox of employeeChecks()) {
    checkbox.checked = task ? getAssignees(task).includes(checkbox.value) : false;
  }

  if (task) {
    get("taskTitle").value = task.title;
    get("taskDescription").value = task.description;
    get("taskPriority").value = task.priority;
    get("taskStatus").value = task.status;
    get("taskDueDate").value = task.dueDate;
    get("taskNotes").value = task.notes || "";
  } else {
    get("taskPriority").value = "Medium";
    get("taskStatus").value = "Pending";
  }

  showSelectedEmployees();
  updateFormStyle();
  get("taskDialog").showModal();
  openEmployeeList(false);
  get("taskTitle").focus();
}

function openView(id) {
  let task = findTask(id);
  if (!task) return;
  viewingId = id;
  get("viewTitle").textContent = task.title;
  get("viewAssignees").textContent = getAssignees(task).join(", ");
  get("viewDueDate").textContent = formatDate(task.dueDate);
  get("viewPriority").textContent = task.priority;
  get("viewStatus").textContent = task.status;
  get("viewDescription").textContent = task.description;
  get("viewNotes").textContent = task.notes || "";
  get("viewNotesBlock").hidden = !task.notes;
  get("viewSolution").textContent = task.solution || "No solution has been submitted yet.";
  get("viewFeedback").textContent = task.reviewNote || "";
  get("viewFeedbackBlock").hidden = !task.reviewNote;
  get("reviewPanel").hidden = task.status !== "Submitted";
  get("reviewFeedback").value = task.reviewNote || "";
  get("viewDialog").showModal();
}

function reviewTask(status) {
  let task = findTask(viewingId);
  if (!task || task.status !== "Submitted") return;
  let note = get("reviewFeedback").value.trim();

  if (status === "In Progress" && !note) {
    showToast("Add feedback before requesting changes.");
    get("reviewFeedback").focus();
    return;
  }
  if (status === "Completed" && !task.solution) {
    showToast("No employee solution to approve yet.");
    return;
  }

  task.status = status;
  task.reviewNote = note;
  if (!saveTasks()) return;
  get("viewDialog").close();
  showTasks();
  showToast(status === "Completed" ? "Solution approved." : "Changes requested.");
}

function openDelete(id) {
  let task = findTask(id);
  if (!task) return;
  deletingId = id;
  get("deleteMessage").textContent = "“" + task.title + "” will be removed from the task list.";
  get("deleteDialog").showModal();
}

let btn = get("addTaskButton");
btn.onclick = function () {
  openForm();
};

get("taskForm").onsubmit = function (event) {
  event.preventDefault();
  let assignTo = selectedEmployees();
  if (assignTo.length === 0) {
    get("assigneeError").hidden = false;
    get("assigneeTrigger").setAttribute("aria-invalid", "true");
    openEmployeeList(true);
    return;
  }

  let taskTitle = get("taskTitle").value.trim();
  let taskDescription = get("taskDescription").value.trim();
  let oldTask = findTask(get("taskId").value);
  let task = oldTask || { id: "task-" + Date.now(), solution: "", reviewNote: "" };

  task.title = taskTitle;
  task.description = taskDescription;
  task.assignees = assignTo;
  task.assignee = assignTo[0];
  task.priority = get("taskPriority").value;
  task.status = get("taskStatus").value;
  task.dueDate = get("taskDueDate").value;
  task.notes = get("taskNotes").value.trim();

  if (!oldTask) tasks.unshift(task);
  if (!saveTasks()) return;
  get("taskDialog").close();
  get("taskSearch").value = "";
  get("allFilter").click();
  showToast(oldTask ? "Task updated." : "Task created and assigned.");
};

get("assigneeToggle").onclick = function () {
  openEmployeeList(get("assigneeDropdown").hidden);
};
get("assigneeTrigger").onclick = function (event) {
  if (event.target.closest("button")) return;
  openEmployeeList(get("assigneeDropdown").hidden);
};
for (let checkbox of employeeChecks()) {
  checkbox.onchange = function () {
    get("assigneeError").hidden = true;
    get("assigneeTrigger").setAttribute("aria-invalid", "false");
    showSelectedEmployees();
  };
}
get("employeeSearch").oninput = function () {
  let search = this.value.toLowerCase();
  for (let option of document.querySelectorAll(".employee-option")) {
    option.hidden = !option.textContent.toLowerCase().includes(search);
  }
};
get("taskDescription").oninput = updateFormStyle;
get("taskPriority").onchange = updateFormStyle;
get("taskStatus").onchange = updateFormStyle;
get("taskDueDate").onchange = updateFormStyle;
get("taskSearch").oninput = showTasks;

for (let filter of document.querySelectorAll(".filter")) {
  filter.onclick = function () {
    currentFilter = filter.value;
    for (let button of document.querySelectorAll(".filter")) {
      button.classList.toggle("active", button === filter);
    }
    showTasks();
  };
}

get("closeTaskButton").onclick = function () { get("taskDialog").close(); };
get("cancelTaskButton").onclick = function () { get("taskDialog").close(); };
get("closeViewButton").onclick = function () { get("viewDialog").close(); };
get("closeDeleteButton").onclick = function () { get("deleteDialog").close(); };
get("cancelDeleteButton").onclick = function () { get("deleteDialog").close(); };
get("approveButton").onclick = function () { reviewTask("Completed"); };
get("requestChangesButton").onclick = function () { reviewTask("In Progress"); };
get("confirmDeleteButton").onclick = function () {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === deletingId) {
      tasks.splice(i, 1);
      break;
    }
  }
  if (!saveTasks()) return;
  get("deleteDialog").close();
  showTasks();
  showToast("Task deleted.");
};

showTasks();
