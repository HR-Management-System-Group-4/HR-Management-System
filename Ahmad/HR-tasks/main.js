let closeTaskButton = document.getElementById("closeTaskButton");
let btn = document.getElementById("addTaskButton");
let taskDialog = document.getElementById("taskDialog");
let taskForm = document.getElementById("taskForm");
let taskList = document.getElementById("taskList");

//close the popup
closeTaskButton.onclick = function () {
    taskDialog.close();
};
// Get tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Open popup
btn.onclick = function () {
  taskDialog.showModal();
};

// Create task
taskForm.onsubmit = function (event) {
  event.preventDefault();

  let taskTitle = document.getElementById("taskTitle").value;
  let taskDescription = document.getElementById("taskDescription").value;
  let assignTo = document.getElementById("assignTo").value;
  let priority = document.getElementById("taskPriority").value;
  let dueDate = document.getElementById("taskDueDate").value;
  let status = document.getElementById("taskStatus").value;
  let notes = document.getElementById("taskNotes").value;

  let task = {
    id: Date.now(),
    title: taskTitle,
    description: taskDescription,
    assignTo: assignTo,
    priority: priority,
    dueDate: dueDate,
    status: status,
    notes: notes,
  };

  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();

  taskForm.reset();

  taskDialog.close();
};

// Display tasks
function displayTasks() {
  taskList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
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

    taskList.innerHTML += `

            <div class="task-card priority-${tasks[i].priority.toLowerCase()}">


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


                            <span class="chip priority-${tasks[i].priority.toLowerCase()}">

                                <i class="bi bi-bar-chart-fill"></i>

                                ${tasks[i].priority}

                            </span>


                            <span class="chip status-${statusClass}">

                                <i class="bi bi-record-circle"></i>

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

                                ${tasks[i].assignTo}

                            </span>


                        </div>


                    </div>


                </div>



                <div class="task-actions">


                    <button
                        class="icon-action view"
                        type="button"
                    >

                        <i class="bi bi-eye-fill"></i>

                    </button>


                    <button
                        class="icon-action edit"
                        type="button"
                    >

                        <i class="bi bi-pencil-fill"></i>

                    </button>


                    <button
                        class="icon-action delete"
                        type="button"
                    >

                        <i class="bi bi-trash3-fill"></i>

                    </button>


                </div>


            </div>

        `;
  }
}

// Get employees from JSON
function displayEmployees() {
  let assignTo = document.getElementById("assignTo");

  fetch("../../employee.json")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        assignTo.innerHTML += `
                    <option value="${data[i].name}">
                        ${data[i].name}
                    </option>
                `;
      }
    });
}
displayEmployees();

// Display saved tasks when page opens
displayTasks();
