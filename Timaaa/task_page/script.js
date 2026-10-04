// ===============================
// EMPLOYEES
// ===============================


const employees = [

"All Employees",

"Ahmad Ali",

"Sara Ahmad",

"John Smith",

"Lina Khaled",

"Omar Hassan",

"Maya Ali",

"Daniel Brown",

"Adam Smith",

"Nour Ahmed",

"Rami Saleh",

"Yousef Omar",

"Hiba Ahmad",

"Khaled Mahmoud",

"Reem Ali",

"Ali Hassan"

];





// ===============================
// TASK DATA
// ===============================


let tasks = JSON.parse(
localStorage.getItem("tasks")
) || [

{
title:"Q4 Performance Reviews",

description:
"Complete performance evaluation forms for all team members and submit to HR.",

date:"2026-10-15",

priority:"High",

status:"In Progress",

assignedTo:[
"Ahmad Ali",
"Sara Ahmad"
]

},



{
title:"Update Employee Handbook",

description:
"Review and update employee handbook policies.",

date:"2026-10-20",

priority:"Medium",

status:"Pending",

assignedTo:[
"All Employees"
]

}

];





let editIndex=null;

let currentFilter="All";




// ===============================
// ELEMENTS
// ===============================


const modal =
document.getElementById("taskModal");


const reviewModal =
document.getElementById("reviewModal");



const tasksContainer =
document.getElementById("tasksContainer");



const employeesList =
document.getElementById("employeesList");




const titleInput =
document.getElementById("titleInput");


const descInput =
document.getElementById("descInput");


const dateInput =
document.getElementById("dateInput");


const priorityInput =
document.getElementById("priorityInput");






// ===============================
// SAVE DATA
// ===============================


function saveData(){

localStorage.setItem(
"tasks",
JSON.stringify(tasks)
);

}







// ===============================
// LOAD EMPLOYEES CHECKBOX
// ===============================


function loadEmployees(selected=[]){


employeesList.innerHTML="";



employees.forEach((employee,index)=>{


let checked =
selected.includes(employee)
?
"checked"
:
"";



employeesList.innerHTML += `


<div class="employee-check">


<input

type="checkbox"

class="employeeBox"

id="employee${index}"

value="${employee}"

${checked}


/>


<label for="employee${index}">

${employee}

</label>



</div>


`;


});






const all =
document.querySelector(".employeeBox");



all.onchange=function(){


document
.querySelectorAll(".employeeBox")
.forEach(box=>{


box.checked=this.checked;


});


};


}








// ===============================
// DISPLAY TASKS
// ===============================


function renderTasks(){



tasksContainer.innerHTML="";



let displayTasks =
tasks;



if(currentFilter !== "All"){


displayTasks =
tasks.filter(
task=>task.status===currentFilter
);


}





displayTasks.forEach(task=>{


let index =
tasks.indexOf(task);




tasksContainer.innerHTML += `


<div class="task-card">



<div>


<div class="task-title">

${task.title}

</div>



<div class="task-description">

${task.description}

</div>




<div class="badges">


<span class="badge priority-${task.priority.toLowerCase()}">

${task.priority}

</span>



<span class="badge ${getStatusClass(task.status)}">

${task.status}

</span>



</div>





<div class="task-info">


<span>

<i class="fa-regular fa-calendar"></i>

${task.date || "No Date"}

</span>




<span>

<i class="fa-solid fa-users"></i>

${task.assignedTo.join(", ")}

</span>



</div>



</div>






<div class="actions">



<button class="view-btn"
onclick="reviewTask(${index})">


<i class="fa-solid fa-eye"></i>


</button>





<button class="edit-btn"
onclick="editTask(${index})">


<i class="fa-solid fa-pen"></i>


</button>





<button class="delete-btn"
onclick="deleteTask(${index})">


<i class="fa-solid fa-trash"></i>


</button>



</div>




</div>


`;



});



updateCounters();


}








// ===============================
// STATUS COLOR
// ===============================


function getStatusClass(status){


if(status==="Pending")

return "status-pending";



if(status==="In Progress")

return "status-progress";



return "status-completed";


}








// ===============================
// COUNTERS
// ===============================


function updateCounters(){


document.getElementById("total")
.innerHTML =
tasks.length;



document.getElementById("pending")
.innerHTML =
tasks.filter(
t=>t.status==="Pending"
).length;



document.getElementById("progress")
.innerHTML =
tasks.filter(
t=>t.status==="In Progress"
).length;



document.getElementById("completed")
.innerHTML =
tasks.filter(
t=>t.status==="Completed"
).length;


}









// ===============================
// OPEN ADD TASK
// ===============================


document
.getElementById("openModal")
.onclick=function(){


editIndex=null;



document
.getElementById("modalTitle")
.innerHTML="Add New Task";



clearInputs();


loadEmployees();


modal.style.display="flex";


};








// ===============================
// SAVE TASK
// ===============================


document
.getElementById("saveTask")
.onclick=function(){



let assigned=[];



document
.querySelectorAll(".employeeBox:checked")
.forEach(emp=>{


assigned.push(emp.value);


});





if(titleInput.value.trim()===""){


showAlert("error", "Missing Title", "Please enter a task title.");

return;


}





let task={


title:titleInput.value,


description:descInput.value,


date:dateInput.value,


priority:priorityInput.value,


status:"Pending",


assignedTo:assigned



};






if(editIndex===null){


tasks.push(task);


}

else{


tasks[editIndex]=task;


}





saveData();

showAlert("success", editIndex === null ? "Task Added!" : "Task Updated!", editIndex === null ? "The task has been added successfully." : "The task has been updated successfully.");

renderTasks();



modal.style.display="none";


clearInputs();



};









// ===============================
// EDIT TASK
// ===============================


function editTask(index){



editIndex=index;



let task =
tasks[index];



document
.getElementById("modalTitle")
.innerHTML="Edit Task";



titleInput.value =
task.title;



descInput.value =
task.description;



dateInput.value =
task.date;



priorityInput.value =
task.priority;



loadEmployees(
task.assignedTo
);



modal.style.display="flex";



}








// ===============================
// REVIEW TASK
// ===============================


function reviewTask(index){


let task =
tasks[index];



document
.getElementById("reviewTitle")
.innerHTML =
task.title;



document
.getElementById("reviewDescription")
.innerHTML =
task.description;



reviewModal.style.display="flex";



}








// ===============================
// DELETE TASK
// ===============================


function deleteTask(index){
  confirmAlert("Delete Task?", "Are you sure you want to delete this task?").then(confirmed => {
    if (!confirmed) return;
    tasks.splice(index, 1);
    saveData();
    renderTasks();
    showAlert("success", "Task Deleted!", "The task has been deleted successfully.");
  });
}

// ===============================
// CLOSE MODALS
// ===============================


document
.getElementById("closeModal")
.onclick=function(){

modal.style.display="none";

};



document
.getElementById("cancelTask")
.onclick=function(){

modal.style.display="none";

};




document
.getElementById("closeReview")
.onclick=function(){

reviewModal.style.display="none";

};




document
.getElementById("closeReviewBtn")
.onclick=function(){

reviewModal.style.display="none";

};








// ===============================
// FILTERS
// ===============================


document
.querySelectorAll(".filters button")
.forEach(button=>{


button.onclick=function(){



document
.querySelectorAll(".filters button")
.forEach(btn=>{

btn.classList.remove("active");

});



button.classList.add("active");



currentFilter =
button.dataset.filter;



renderTasks();



};


});








// ===============================
// CLEAR INPUTS
// ===============================


function clearInputs(){


titleInput.value="";


descInput.value="";


dateInput.value="";


priorityInput.value="Medium";


}








// START

renderTasks();