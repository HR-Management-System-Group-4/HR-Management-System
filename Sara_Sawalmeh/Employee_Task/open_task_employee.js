function readStoredUser(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || "null");
    } catch (_) {
        return null;
    }
}
function getLoggedInEmployee() {
    const storedId = localStorage.getItem("loggedInUserId");
    const users = [readStoredUser("currentUser"), readStoredUser("user")];
    return users.find(function (user) {
        return user && user.role === "Employee" &&
            (!storedId || String(user.id) === storedId);
    }) || null;
}
function isAssignedToEmployee(task, employee) {
    if (!employee) return false;
    if (Array.isArray(task.assigneeIds) && task.assigneeIds.length) {
        return task.assigneeIds.some(function (id) {
            return String(id) === String(employee.id);
        });
    }
    // Tasks saved before assignee IDs were added still contain employee names.
    const names = Array.isArray(task.assignTo) ? task.assignTo
        : Array.isArray(task.assignedTo) ? task.assignedTo
        : [task.assignTo || task.assignedTo].filter(Boolean);
    return names.some(function (name) {
        return String(name).trim().toLocaleLowerCase() ===
            String(employee.name).trim().toLocaleLowerCase();
    });
}
function readSolutions() {
    try {
        const saved = JSON.parse(localStorage.getItem("solutions") || "[]");
        return Array.isArray(saved) ? saved : [];
    } catch (_) {
        return [];
    }
}
function readTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
        return Array.isArray(saved) ? saved : [];
    } catch (_) {
        return [];
    }
}
function isMySolution(solution, task) {
    if (!loggedInUser) return false;
    const sameEmployee = solution.employeeId != null
        ? String(solution.employeeId) === String(loggedInUser.id)
        : solution.employeeName === loggedInUser.name;
    if (!sameEmployee) return false;
    return solution.taskId != null ? String(solution.taskId) === String(task.id)
        : solution.taskName === task.title;
}
function getMySolution(task) {
    return readSolutions().find(function (solution) {
        return isMySolution(solution, task);
    });
}
function getMyStatus(task) {
    const solution = getMySolution(task);
    const assignees = Array.isArray(task.assignTo) ? task.assignTo : [task.assignTo];
    if (solution) return solution.status ||
        (task.status === "Completed" && assignees.length <= 1
            ? "Completed" : "Submitted");
    const statuses = task.employeeStatuses || {};
    const key = String(loggedInUser.id);
    if (statuses[key] || statuses[loggedInUser.name]) {
        return statuses[key] || statuses[loggedInUser.name];
    }
    return assignees.length <= 1 ? task.status : "Pending";
}
function updateOverallStatus(task) {
    const assignees = Array.isArray(task.assignTo) ? task.assignTo : [task.assignTo];
    const solutions = readSolutions();
    const statuses = assignees.map(function (name) {
        const solution = solutions.find(function (item) {
            const index = assignees.indexOf(name);
            const id = Array.isArray(task.assigneeIds) ? task.assigneeIds[index] : null;
            const sameEmployee = item.employeeId != null && id != null
                ? String(item.employeeId) === String(id) : item.employeeName === name;
            return sameEmployee && (item.taskId != null
                ? String(item.taskId) === String(task.id) : item.taskName === task.title);
        });
        if (solution) return solution.status || "Submitted";
        const index = assignees.indexOf(name);
        const id = Array.isArray(task.assigneeIds) ? task.assigneeIds[index] : null;
        return (task.employeeStatuses || {})[name] ||
            (task.employeeStatuses || {})[String(id)] || "Pending";
    });
    task.status = statuses.includes("Submitted") ? "Submitted"
        : statuses.every(function (status) { return status === "Completed"; }) ? "Completed"
        : statuses.includes("In Progress") || statuses.includes("Completed") ? "In Progress"
        : "Pending";
}
let loggedInUser = getLoggedInEmployee();
let tasks = [];
let myTasks = [];
let tasksContainer = document.getElementById("tasksContainer");
let taskModal = document.getElementById("taskModal");
let closeModalBtn = document.getElementById("closeModalBtn");
let btn_submit_solution = document.getElementById("btn-submit-solution");
let btn_Edit_solution = document.getElementById("btn-Edite-solution");
let userSolution = document.getElementById("userSolution");
let solutionFile = document.getElementById("solutionFile");
let fileName = document.getElementById("fileName");
let errorMsg = document.getElementById("errorMsg");
let deadlineMsg = document.getElementById("deadlineMsg");
let currentTaskName = "";
let currentTaskIndex = -1;
let open_link;
let state;
let col;
function findStoredTaskIndex(task) {
    return tasks.findIndex(function (item) {
        if (task.id !== undefined) {
            return String(item.id) === String(task.id);
        }
        return item.title === task.title && isAssignedToEmployee(item, loggedInUser);
    });
}
function isPastDue(dateString) {
    if (!dateString) return false;
    const deadline = new Date(dateString + "T23:59:59.999");
    return !Number.isNaN(deadline.getTime()) && Date.now() > deadline.getTime();
}
function readAttachment(file) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function () { resolve(reader.result); };
        reader.onerror = function () { reject(reader.error); };
        reader.readAsDataURL(file);
    });
}
function displayTasks() {
    tasksContainer.innerHTML = "";
    if (myTasks.length === 0) {
        tasksContainer.innerHTML = `<div class="col-12"><p class="text-center text-muted py-5">${loggedInUser ?
            "No tasks are assigned to you yet." :
            "Sign in as an employee to view your assigned tasks."}</p></div>`;
    }
    myTasks.forEach(function (task) {
        let priorityClass = task.priority.toLowerCase();
        let statusClass = task.status.toLowerCase().replace(" ", "-");

        tasksContainer.innerHTML += `
            <div class="col">
                <div class="card task-card">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <div class="card-meta d-flex justify-content-between align-items-center mb-2">
                                <span class="priority ${priorityClass}">  ${task.priority} </span>
                                <span class="state ${statusClass}">${task.status}</span>
                            </div>
                            <h5 class="card-title">${task.title}</h5>
                            <p class="card-text"> ${task.description} </p>
                        </div>
                        <div class="card-footer-info d-flex justify-content-between align-items-center mt-3">
                            <span class="due-date">Due ${task.dueDate} </span>
                            <a href="#taskModal" class="open-link"> Open </a>

                        </div>

                    </div>
                </div>
            </div>
        `;
    });
    open_link = tasksContainer.getElementsByClassName("open-link");
    state = tasksContainer.getElementsByClassName("state");
    col = tasksContainer.getElementsByClassName("col");
    addOpenEvents();
    updateCounters();
}

function updateCounters() {

    let completedCount = document.getElementById("completedCount");
    let PendingCount = document.getElementById("PendingCount");
    let progressCount = document.getElementById("progressCount");
    let SubmittedCount = document.getElementById("SubmittedCount");

    let completed = myTasks.filter(function (task) { return task.status === "Completed"; }).length;
    let pending = myTasks.filter(function (task) { return task.status === "Pending"; }).length;
    let in_progress = myTasks.filter(function (task) { return task.status === "In Progress"; }).length;
    let submitted = myTasks.filter(function (task) { return task.status === "Submitted"; }).length;

    completedCount.textContent = completed;
    PendingCount.textContent = pending;
    progressCount.textContent = in_progress;
    SubmittedCount.textContent = submitted;
}

function addOpenEvents() {
    for (let i = 0; i < open_link.length; i++) {
        open_link[i].addEventListener("click", function (e) {
            e.preventDefault();
            currentTaskIndex = i;
            let task = myTasks[currentTaskIndex];
            if (!task) {
                return;
            }
            errorMsg.style.display = "none";
            currentTaskName = task.title;
            if (task.status === "Pending") {
                tasks = readTasks();
                let taskIndex = findStoredTaskIndex(task);
                if (taskIndex !== -1) {
                    tasks[taskIndex].employeeStatuses = tasks[taskIndex].employeeStatuses || {};
                    tasks[taskIndex].employeeStatuses[String(loggedInUser.id)] = "In Progress";
                    tasks[taskIndex].employeeStatuses[loggedInUser.name] = "In Progress";
                    updateOverallStatus(tasks[taskIndex]);
                    try {
                        localStorage.setItem("tasks", JSON.stringify(tasks));
                        task.status = "In Progress";
                    } catch (_) {
                        errorMsg.textContent = "Could not save progress in this browser.";
                        errorMsg.style.display = "block";
                    }
                }
                if (task.status === "In Progress") {
                    state[i].textContent = "In Progress";
                    state[i].classList.remove("pending");
                    state[i].classList.add("in-progress");
                    state[i].style.color = "#f0ad4e";
                }
            }
            document.getElementById("modalTaskTitle").textContent = task.title;
            document.getElementById("modalTaskDescription").textContent = task.description;
            document.getElementById("modalPriority").textContent =task.priority + " priority";
            document.getElementById("modalStatus").textContent = task.status;
            document.getElementById("modalAssignedDate").textContent =task.assignedDate || "Not specified";
            document.getElementById("modalDueDate").textContent = task.dueDate;
            let taskSolution = getMySolution(task);
            document.getElementById("modalHrNotes").textContent = taskSolution && taskSolution.reviewNote
                ? (task.notes ? task.notes + "\n\n" : "") + "HR feedback: " + taskSolution.reviewNote
                : task.hrNotes || task.notes || "No HR notes.";
            if (isPastDue(task.dueDate)) {
                deadlineMsg.textContent = "The deadline has passed. You can no longer edit or submit this task.";
                userSolution.setAttribute("readonly", true);
                solutionFile.setAttribute("disabled", true);
                btn_submit_solution.style.display = "none";
                btn_Edit_solution.style.display = "none";
            } else {
                deadlineMsg.textContent = "";
                if (taskSolution) {
                    userSolution.value = taskSolution.solution;
                    fileName.textContent = taskSolution.fileName
                        ? taskSolution.fileData
                            ? "File: " + taskSolution.fileName
                            : taskSolution.fileName + " needs to be attached again so HR can download it."
                        : "";
                    userSolution.setAttribute("readonly", true);
                    solutionFile.setAttribute("disabled", true);
                    btn_Edit_solution.style.display = task.status === "Completed" ? "none" : "block";
                    btn_submit_solution.style.display = "none";

                } else {
                    userSolution.value = "";
                    fileName.textContent = "";
                    userSolution.removeAttribute("readonly");
                    solutionFile.removeAttribute("disabled");
                    btn_Edit_solution.style.display = "none";
                    btn_submit_solution.style.display = "block";
                }
            }
            taskModal.style.display = "flex";
            updateCounters();
        });
    }
}
btn_Edit_solution.addEventListener("click", function () {
    let task = myTasks[currentTaskIndex];
    if (!task) {
        return;
    }
    if (isPastDue(task.dueDate)) {
        deadlineMsg.textContent ="The deadline has passed. You can no longer edit or submit this task.";
        return;
    }
    userSolution.removeAttribute("readonly");
    solutionFile.removeAttribute("disabled");
    btn_submit_solution.style.display = "block";
    btn_Edit_solution.style.display = "none";
});

btn_submit_solution.addEventListener("click", async function () {
    let task = myTasks[currentTaskIndex];
    if (!task) {
        return;
    }
    if (isPastDue(task.dueDate)) {
        deadlineMsg.textContent = "The deadline has passed. You can no longer submit this task.";
        return;
    }
    let input_File = solutionFile;
    let solutionText = userSolution.value.trim();
    const githubRegex =  /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/i;
    const gdriveRegex =/^https?:\/\/(drive|docs)\.google\.com\/.+/i;
    const urlRegex =/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})([/\w .-]*)\/?$/i;
    const textRegex = /^.{11,}$/;
    let validText =
        githubRegex.test(solutionText) ||
        gdriveRegex.test(solutionText) ||
        urlRegex.test(solutionText) ||
        textRegex.test(solutionText);
    const attachment = input_File.files[0];
    if (solutionText && !validText || !solutionText && !attachment) {
        errorMsg.textContent ="Please enter a valid solution, GitHub link, Google Drive link, or URL.";
        errorMsg.style.display = "block";
        return;
    }
    let solutions = readSolutions();
    let existingIndex = solutions.findIndex(function (solution) {
        return isMySolution(solution, task);
    });
    if (attachment && attachment.size > 1024 * 1024) {
        errorMsg.textContent = "The attachment must be 1 MB or smaller to save in this browser.";
        errorMsg.style.display = "block";
        return;
    }
    const previous = existingIndex !== -1 ? solutions[existingIndex] : null;
    btn_submit_solution.disabled = true;
    let fileData = previous && previous.fileData || "";
    try {
        if (attachment) fileData = await readAttachment(attachment);
    } catch (_) {
        errorMsg.textContent = "Could not read the attachment. Please try again.";
        errorMsg.style.display = "block";
        btn_submit_solution.disabled = false;
        return;
    }
    const fileNameToSave = attachment ? attachment.name
        : fileData && previous ? previous.fileName : "";
    let solutionData = {

        taskId: task.id,
        employeeId: loggedInUser.id,
        employeeName: loggedInUser.name,
        taskName: currentTaskName,
        fileName: fileNameToSave,
        fileData: fileData,
        solution: solutionText || "See attached file.",
        status: "Submitted",
        reviewNote: ""
    };
    if (existingIndex !== -1) {
        solutions[existingIndex] = solutionData;
    } else {
        solutions.push(solutionData);
    }
    try {
        localStorage.setItem("solutions", JSON.stringify(solutions));
    } catch (_) {
        errorMsg.textContent = "Could not save the submission in this browser. Try a smaller attachment.";
        errorMsg.style.display = "block";
        btn_submit_solution.disabled = false;
        return;
    }
    task.status = "Submitted";
    tasks = readTasks();
    let taskIndex = findStoredTaskIndex(task);
    if (taskIndex !== -1) {
        tasks[taskIndex].employeeStatuses = tasks[taskIndex].employeeStatuses || {};
        tasks[taskIndex].employeeStatuses[String(loggedInUser.id)] = "Submitted";
        tasks[taskIndex].employeeStatuses[loggedInUser.name] = "Submitted";
        updateOverallStatus(tasks[taskIndex]);
        try {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        } catch (_) { /* HR can still read the saved solution. */ }
    }
    if (currentTaskIndex !== -1) {
        state[currentTaskIndex].textContent = "Submitted";
        state[currentTaskIndex].classList.remove("in-progress");
        state[currentTaskIndex].classList.remove("pending");
        state[currentTaskIndex].classList.add("submitted");
        state[currentTaskIndex].style.color = "var(--color-accent)";
    }

    updateCounters();
    btn_submit_solution.disabled = false;
    errorMsg.style.display = "none";
    taskModal.style.display = "none";
});
// إغلاق صفحه ال popup
closeModalBtn.addEventListener("click", function () {
    taskModal.style.display = "none";
});
let ALL = document.getElementById("ALL");
ALL.addEventListener("click", function () {
    for (let i = 0; i < col.length; i++) {
        col[i].style.display = "flex";
    }
});
let filter_pending = document.getElementById("filter_pending");
filter_pending.addEventListener("click", function () {
    for (let i = 0; i < col.length; i++) {
        let ispending = col[i].querySelector(".pending");
        if (ispending) {
            col[i].style.display = "flex";
        } else {
            col[i].style.display = "none";
        }
    }
});
let filter_progress = document.getElementById("filter_progress");
filter_progress.addEventListener("click", function () {
    for (let i = 0; i < col.length; i++) {
        let isprogress = col[i].querySelector(".in-progress");
        if (isprogress) {
            col[i].style.display = "flex";
        } else {
            col[i].style.display = "none";
        }
    }
});
let filter_submition = document.getElementById("filter_submition");
filter_submition.addEventListener("click", function () {
    for (let i = 0; i < col.length; i++) {
        let issubmitted = col[i].querySelector(".submitted");
        if (issubmitted) {
            col[i].style.display = "flex";
        } else {
            col[i].style.display = "none";
        }
    }
});
let filter_completed = document.getElementById("filter_completed");
filter_completed.addEventListener("click", function () {
    for (let i = 0; i < col.length; i++) {
        let iscompleted = col[i].querySelector(".completed");
        if (iscompleted) {
            col[i].style.display = "flex";
        } else {
            col[i].style.display = "none";
        }
    }
});

let filter_btn_ALL = document.getElementById("ALL");
let filter_btn_pending = document.getElementById("filter_pending");
let filter_btn_submition = document.getElementById("filter_submition");
let filter_btn_completed = document.getElementById("filter_completed");
let filter_btn_progress = document.getElementById("filter_progress");

filter_btn_ALL.classList.add("active");

function setActiveFilter(activeButton) {
    filter_btn_ALL.classList.remove("active");
    filter_btn_pending.classList.remove("active");
    filter_btn_submition.classList.remove("active");
    filter_btn_completed.classList.remove("active");
    filter_btn_progress.classList.remove("active");
    activeButton.classList.add("active");
}
filter_btn_ALL.addEventListener("click", function () {
    setActiveFilter(filter_btn_ALL);
});
filter_btn_pending.addEventListener("click", function () {
    setActiveFilter(filter_btn_pending);
});
filter_btn_submition.addEventListener("click", function () {
    setActiveFilter(filter_btn_submition);
});
filter_btn_completed.addEventListener("click", function () {
    setActiveFilter(filter_btn_completed);
});
filter_btn_progress.addEventListener("click", function () {
    setActiveFilter(filter_btn_progress);
});

function refreshTasks() {
    loggedInUser = getLoggedInEmployee();
    tasks = readTasks();
    myTasks = tasks.filter(function (task) {
        return isAssignedToEmployee(task, loggedInUser);
    }).map(function (task) {
        return Object.assign({}, task, {status: getMyStatus(task)});
    });
    displayTasks();
}
window.addEventListener("storage", function (event) {
    if (!event.key || ["tasks", "solutions", "currentUser", "user", "loggedInUserId"].includes(event.key)) {
        refreshTasks();
    }
});
window.addEventListener("focus", refreshTasks);
window.addEventListener("pageshow", refreshTasks);
refreshTasks();
