let loggedInUser =JSON.parse(localStorage.getItem("loggedInUser"));
let tasks =JSON.parse(localStorage.getItem("tasks")) || [];
let myTasks = tasks.filter(function(task) {
    return task.employeeName === loggedInUser.name;
});
let tasksContainer =document.getElementById("tasksContainer");
let taskModal =document.getElementById("taskModal");
let closeModalBtn =document.getElementById("closeModalBtn");
let btn_submit_solution =document.getElementById("btn-submit-solution");
let btn_Edit_solution =document.getElementById("btn-Edite-solution");
let userSolution =document.getElementById("userSolution");
let solutionFile =document.getElementById("solutionFile");
let fileName =document.getElementById("fileName");
let errorMsg = document.getElementById("errorMsg");
let deadlineMsg =document.getElementById("deadlineMsg");
let currentTaskName = "";
let open_link;
let state;
let col;
function displayTasks() {
    tasksContainer.innerHTML = "";
    myTasks.forEach(function(task) {
        let priorityClass =task.priority.toLowerCase();
        let statusClass =task.status.toLowerCase().replace(" ", "-");
        tasksContainer.innerHTML += `
        <div class="col">
            <div class="card task-card">
                <div class="card-body d-flex flex-column justify-content-between">
                  <div>
                     <div class="card-meta d-flex justify-content-between align-items-center mb-2">
                        <span class="priority ${priorityClass}">${task.priority}</span>
                        <span class="state ${statusClass}">${task.status}</span>
                     </div>
                     <h5 class="card-title">${task.title}</h5>
                     <p class="card-text"> ${task.description}</p>
                  </div>
                  <div class="card-footer-info d-flex justify-content-between align-items-center mt-3">
                     <span class="due-date"> Due ${task.dueDate}</span>
                     <a href="#taskModal" class="open-link">Open</a>
                  </div>
               </div>
            </div>
        </div>
        `;
    });
    open_link =document.getElementsByClassName("open-link");
    state =document.getElementsByClassName("state");
    col =document.getElementsByClassName("col");
    addOpenEvents();
    updateCounters();
}

function updateCounters() {
    let completedCount =document.getElementById("completedCount");
    let PendingCount =document.getElementById("PendingCount");
    let progressCount =document.getElementById("progressCount");
    let SubmittedCount =document.getElementById("SubmittedCount");

    let completed =document.getElementsByClassName("completed").length;
    let pending =document.getElementsByClassName("pending").length;
    let in_progress =document.getElementsByClassName("in-progress").length;
    let submitted =document.getElementsByClassName("submitted").length;
    
    completedCount.innerHTML = `${completed}`;
    PendingCount.innerHTML =`${pending}`;
    progressCount.innerHTML =`${in_progress}`;
    SubmittedCount.innerHTML =`${submitted}`;
}

function addOpenEvents() {
    for (let i = 0; i < open_link.length; i++) {
        open_link[i].addEventListener("click", function(e) {
            e.preventDefault();
            let taskCard =this.closest(".task-card"); //this بجيب الي انكبس عليه , clodest اقرب كاردفيه هذا الاشي 
            let taskName =taskCard.querySelector(".card-title").textContent.trim();
            currentTaskName =taskName;
            let task =myTasks.find(function(task) {
                    return task.title === currentTaskName;
                });
            if (!task) {
                return;
            }
            if (state[i].textContent.trim() === "Pending") {

                state[i].innerHTML ="In progress";
                state[i].style.color ="#f0ad4e";
                state[i].classList.remove("pending");
                state[i].classList.add("in-progress");

                let taskIndex =tasks.findIndex(function(task) {
                     return task.employeeName === loggedInUser.name && task.title === currentTaskName;
                    });

                if (taskIndex !== -1) {
                    tasks[taskIndex].status ="In progress";//غيرت الحاله وخزنتها لحتى يصلل لل HR
                    task.status = "In progress";
                    localStorage.setItem("tasks",JSON.stringify(tasks));
                }
            }
            //popup 
            document.getElementById("modalTaskTitle").textContent =task.title;
            document.getElementById("modalTaskDescription").textContent =task.description;
            document.getElementById("modalPriority").textContent =task.priority + " priority";
            document.getElementById("modalStatus").textContent =task.status;
            document.getElementById("modalAssignedDate").textContent =task.assignedDate || "Not specified";
            document.getElementById("modalDueDate").textContent =task.dueDate;
            document.getElementById("modalHrNotes").textContent =task.hrNotes || "No HR notes.";
            let deadline =new Date(task.dueDate);
            let now =new Date();
            if (now > deadline) {
                deadlineMsg.textContent ="The deadline has passed. You can no longer edit or submit this task.";
                userSolution.setAttribute("readonly",true);
                solutionFile.setAttribute("disabled",true);
                btn_submit_solution.style.display ="none";
                btn_Edit_solution.style.display ="none";
            } else {
                deadlineMsg.textContent ="";
                let solutions =JSON.parse(localStorage.getItem("solutions")) || [];
                let taskSolution =solutions.find(function(solution) {
                        return solution.employeeName === loggedInUser.name &&solution.taskName === currentTaskName;
                    });
                if (taskSolution) {
                    userSolution.value =taskSolution.solution;
                    fileName.textContent = "File: " + taskSolution.fileName;
                    userSolution.setAttribute("readonly",true);
                    solutionFile.setAttribute("disabled",true);
                    btn_Edit_solution.style.display ="block";
                    btn_submit_solution.style.display ="none";
                } else {
                    userSolution.value ="";
                    userSolution.removeAttribute("readonly");
                    solutionFile.removeAttribute("disabled");
                    btn_Edit_solution.style.display ="none";
                    btn_submit_solution.style.display ="block";
                }
            }
            errorMsg.style.display ="none";
            taskModal.style.display ="flex";
            updateCounters();

        });
    }
}
btn_Edit_solution.addEventListener("click",function() {
        let task = myTasks.find(function(task) {
           return task.title === currentTaskName;
        });

        if (!task) {
            return;
        }
        let deadline =new Date(task.dueDate);
        let now =new Date();
        if (now > deadline) {
            deadlineMsg.textContent ="The deadline has passed. You can no longer edit or submit this task.";
            return;
        }
        userSolution.removeAttribute("readonly");
        solutionFile.removeAttribute("disabled");
        btn_submit_solution.style.display = "block";
        btn_Edit_solution.style.display ="none";
    }
);

btn_submit_solution.addEventListener("click",function() {
    let task = myTasks.find(function(task) {
        return task.title === currentTaskName;
    });
        if (!task) {
            return;
        }
        let deadline =new Date(task.dueDate);
        let now =new Date();
        if (now > deadline) {
            deadlineMsg.textContent ="The deadline has passed. You can no longer submit this task.";
            return;
        }
        let input_File =solutionFile;
        let solutionText =userSolution.value.trim();
        const githubRegex =/^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/i;
        const gdriveRegex =/^https?:\/\/(drive|docs)\.google\.com\/.+/i;
        const urlRegex =/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
        const textRegex =/^.{11,}$/;
        let validText =githubRegex.test(solutionText) || gdriveRegex.test(solutionText) || urlRegex.test(solutionText) ||textRegex.test(solutionText);
        if (!validText) {
            errorMsg.textContent ="Please enter a valid solution, GitHub link, Google Drive link, or URL.";
            errorMsg.style.display ="block";
            return;
        }


        let solutions =JSON.parse(localStorage.getItem("solutions")) || [];
        let existingIndex =solutions.findIndex(function(solution) {
            return solution.employeeName === loggedInUser.name && solution.taskName === currentTaskName;
            });

        let fileNameToSave ="";
        if (input_File.files.length > 0) {
            fileNameToSave =input_File.files[0].name;
        } else if (existingIndex !== -1) {// لحتى لو عمل المستخدم ايديت ولكن ما غير غلى الفايل لحتى ما يروح
            fileNameToSave =solutions[existingIndex].fileName;
        } else {
            errorMsg.textContent ="Please upload a file.";
            errorMsg.style.display ="block";
            return;
        }
        let solutionData = {
            employeeName:loggedInUser.name,
            taskName:currentTaskName,
            fileName:fileNameToSave,
            solution:solutionText
        };
        if (existingIndex !== -1) {
            solutions[existingIndex] =solutionData;
        } else {
            solutions.push(solutionData);
        }
        localStorage.setItem("solutions",JSON.stringify(solutions));

        for (let i = 0; i < open_link.length; i++) {
            let taskCard =open_link[i].closest(".task-card");
            let cardTaskName =taskCard.querySelector(".card-title").textContent.trim();
            if (cardTaskName === currentTaskName) {
                state[i].innerHTML ="Submitted";
                state[i].classList.remove("in-progress");
                state[i].classList.remove("pending");
                state[i].classList.add("submitted");
                state[i].style.color ="var(--color-accent)";
            }
        }
        let taskIndex =tasks.findIndex(function(task) {
                return task.employeeName === loggedInUser.name && task.title === currentTaskName;
            });
        if (taskIndex !== -1) {
            tasks[taskIndex].status ="Submitted";
            localStorage.setItem("tasks",JSON.stringify(tasks));
        }
        let myTaskIndex = myTasks.findIndex(function(task) {
            return task.employeeName === loggedInUser.name && task.title === currentTaskName;
        });
        if (myTaskIndex !== -1) {
            myTasks[myTaskIndex].status ="Submitted";
        }
        updateCounters();
        errorMsg.style.display ="none";
        taskModal.style.display ="none";

    }
);

closeModalBtn.addEventListener("click",function() {
        taskModal.style.display ="none";
    }
);

let ALL =document.getElementById("ALL");
ALL.addEventListener("click",function() {
        for (let i = 0; i < col.length; i++) {
            col[i].style.display ="flex";
        }
    }
);
let filter_pending =document.getElementById("filter_pending");
filter_pending.addEventListener("click",function() {
     for (let i = 0; i < col.length; i++) {
         let ispending =col[i].querySelector(".pending");
            if (ispending) {
                col[i].style.display ="flex";
            } else {
                col[i].style.display ="none";
            }
        }
    }
);
let filter_progress =document.getElementById("filter_progress");
filter_progress.addEventListener("click",function() {
    for (let i = 0; i < col.length; i++) {
        let isprogress =col[i].querySelector(".in-progress");
            if (isprogress) {
                col[i].style.display ="flex";
            } else {
                col[i].style.display ="none";
            }
        }
    }
);
let filter_submition =document.getElementById("filter_submition");
filter_submition.addEventListener("click",
    function() {for (let i = 0; i < col.length; i++) {
        let issubmitted =col[i].querySelector(".submitted");
            if (issubmitted) {
                col[i].style.display ="flex";
            } else {
                col[i].style.display ="none";
            }
        }
    }
);
let filter_completed =document.getElementById("filter_completed");
filter_completed.addEventListener("click",function() {
        for (let i = 0; i < col.length; i++) {
            let iscompleted =col[i].querySelector(".completed");
            if (iscompleted) {
                col[i].style.display ="flex";
            } else {
                col[i].style.display =
                    "none";
            }
        }
    }
);

let filter_btn_ALL = document.getElementById("ALL");
let filter_btn_pending =document.getElementById("filter_pending");
let filter_btn_submition =document.getElementById("filter_submition");
let filter_btn_completed =document.getElementById("filter_completed");
let filter_btn_progress =document.getElementById("filter_progress");
filter_btn_ALL.classList.add("active");

filter_btn_ALL.addEventListener("click",function() {
        filter_btn_ALL.classList.add("active");
        filter_btn_pending.classList.remove("active");
        filter_btn_submition.classList.remove("active");
        filter_btn_completed.classList.remove("active");
        filter_btn_progress.classList.remove("active");
    }
);
filter_btn_pending.addEventListener("click",function() {
        filter_btn_pending.classList.add("active");
        filter_btn_ALL.classList.remove("active");
        filter_btn_submition.classList.remove("active");
        filter_btn_completed.classList.remove("active");
        filter_btn_progress.classList.remove("active");
    }
);
filter_btn_submition.addEventListener("click",function() {
        filter_btn_ALL.classList.remove("active");
        filter_btn_pending.classList.remove("active");
        filter_btn_submition.classList.add("active");
        filter_btn_completed.classList.remove("active");
        filter_btn_progress.classList.remove("active");
    }
);
filter_btn_completed.addEventListener("click",function() {
        filter_btn_pending.classList.remove("active");
        filter_btn_ALL.classList.remove("active");
        filter_btn_submition.classList.remove("active");
        filter_btn_completed.classList.add("active");
        filter_btn_progress.classList.remove("active");
    }
);
filter_btn_progress.addEventListener("click",function() {
        filter_btn_pending.classList.remove("active");
        filter_btn_progress.classList.add("active");
        filter_btn_ALL.classList.remove("active");
        filter_btn_submition.classList.remove("active");
        filter_btn_completed.classList.remove("active");
    }
);
displayTasks();