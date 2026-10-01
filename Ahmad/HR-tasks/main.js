let closeTaskButton = document.getElementById("closeTaskButton");
let btn = document.getElementById("addTaskButton");
let taskDialog = document.getElementById("taskDialog");
let taskForm = document.getElementById("taskForm");
let taskList = document.getElementById("taskList");
let cancelTaskButton = document.getElementById("cancelDeleteButton");
let closeViewButton = document.getElementById("closeViewButton");

closeViewButton.onclick = function () {

    document.getElementById("viewDialog").close();

};

//close the popup
closeTaskButton.onclick = function () {
  taskDialog.close();

  // cancel
  cancelTaskButton.onclick = function () {
    taskDialog.close();
  };
};
// Get tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// Keep previously saved tasks visible after removing the old status.
if (tasks.some((task) => task.status === "Pending")) {
  tasks = tasks.map((task) =>
    task.status === "Pending" ? { ...task, status: "In Progress" } : task,
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

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
                        onclick="viewTask(${tasks[i].id})
                    >

                        <i class="bi bi-eye-fill"></i>

                    </button>


                    <button
                        class="icon-action edit"
                        type="button"
                        onclick="editTask(${tasks[i].id})
                    >

                        <i class="bi bi-pencil-fill"></i>

                    </button>


                    <button
                        class="icon-action delete"
                        type="button"
                        onclick="deleteTask(${tasks[i].id})
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
      const employees = Array.isArray(data) ? data : data.employees;
      for (let i = 0; i < employees.length; i++) {
        assignTo.innerHTML += `
                    <option value="${employees[i].name}">
                        ${employees[i].name}
                    </option>
                `;
      }
    });
}

function viewTask(id) {
  let viewDialog = document.getElementById("viewDialog");

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      document.getElementById("viewTitle").innerHTML = tasks.title;
      document.getElementById("viewAssignee").innerHTML = tasks[i].assignTo;

      document.getElementById("viewDueDate").innerHTML = tasks[i].dueDate;

      document.getElementById("viewPriority").innerHTML = tasks[i].priority;

      document.getElementById("viewStatus").innerHTML = tasks[i].status;

      document.getElementById("viewDescription").innerHTML =
        tasks[i].description;
      document.getElementById("viewNotes").innerHTML =
        tasks[i].notes || "No notes";

      document.getElementById("viewSolution").innerHTML =
        tasks[i].solution || "No solution has been submitted yet.";

        viewDialog();
    }
  }
}

displayEmployees();

// Display saved tasks when page opens
displayTasks();
