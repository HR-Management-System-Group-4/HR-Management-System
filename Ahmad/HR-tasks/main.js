let btn = document.getElementById("addTaskButton");
let taskDialog = document.getElementById("taskDialog");
let taskForm = document.getElementById("taskForm");
let taskList = document.getElementById("taskList");


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
        notes: notes
    };


    tasks.push(task);


    localStorage.setItem("tasks", JSON.stringify(tasks));


    displayTasks();


    taskForm.reset();

    taskDialog.close();
};


// Display tasks
function displayTasks() {

    let assignTo = document.getElementById("assignTo")


    taskList.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {

        taskList.innerHTML += `
            <div class="task-card">

                <h3>${tasks[i].title}</h3>

                <p>${tasks[i].description}</p>

                <p>Assigned To: ${tasks[i].assignTo}</p>

                <p>Priority: ${tasks[i].priority}</p>

                <p>Status: ${tasks[i].status}</p>

                <p>Due Date: ${tasks[i].dueDate}</p>

            </div>
        `;
    }
}

// Get employees from JSON
function displayEmployees() {

    let assignTo = document.getElementById("assignTo");

    fetch("../../employee.json")
        .then(response => response.json())
        .then(data => {

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