// ===================================
// MYSTA HR DASHBOARD JAVASCRIPT
// ===================================


// ===============================
// VARIABLES
// ===============================

let employees = [];




// ===============================
// LOAD LEAVES FROM LOCAL STORAGE
// ===============================

let leaves = [];


try {


let savedLeaves =
JSON.parse(
localStorage.getItem("leaveApplications")
) || [];



savedLeaves.forEach(item=>{


leaves.push({

employee: item.employee || "Employee",

type: item.leaveType || "Leave",

date: item.startDate || "",

status: item.status || "Pending"


});


});


}
catch(error){

console.log(
"Leave loading error",
error
);

}






// ===============================
// TASK DATA
// ===============================


const tasks = [

{
title:"Employee Handbook",
status:"Active"
},

{
title:"Performance Review",
status:"Active"
},

{
title:"System Update",
status:"Completed"
},

{
title:"Database Backup",
status:"Completed"
}

];






// ===============================
// FEEDBACK
// ===============================


const feedback = [];






// ===============================
// UPDATE STATISTICS
// ===============================


function updateStatistics(){



document.getElementById("totalEmployees").innerHTML =
employees.length;




document.getElementById("pendingLeaves").innerHTML =

leaves.filter(
x=>x.status==="Pending"
).length;




document.getElementById("activeTasks").innerHTML =

tasks.filter(
x=>x.status==="Active"
).length;




document.getElementById("completedTasks").innerHTML =

tasks.filter(
x=>x.status==="Completed"
).length;




document.getElementById("feedback").innerHTML =
feedback.length;



}








// ===============================
// DEPARTMENT SECTION
// ===============================


function loadDepartments(){


let container =
document.getElementById("department");



if(!container)
return;



container.innerHTML="";



let departments = {};



employees.forEach(emp=>{


if(!departments[emp.department]){


departments[emp.department]=0;


}


departments[emp.department]++;



});





Object.keys(departments)
.forEach(dep=>{



let width =
departments[dep] * 15;



container.innerHTML += `


<div>


<p>

${dep}

<b>
${departments[dep]}
</b>


</p>



<span style="width:${width}%"></span>



</div>


`;



});



}









// ===============================
// LEAVE OVERVIEW
// ===============================


function loadLeaveOverview(){


let box =
document.getElementById("leaveOverview");



if(!box)
return;




let pending =
leaves.filter(
x=>x.status==="Pending"
).length;




let approved =
leaves.filter(
x=>x.status==="Approved"
).length;




let rejected =
leaves.filter(
x=>x.status==="Rejected"
).length;




let total =
pending + approved + rejected;



box.innerHTML = `



<div class="leave-item">


<div class="leave-name">


<span class="leave-dot"
style="background:#118ab2">
</span>


Pending


</div>



<div class="leave-number">

${pending}


<span class="leave-percent">

${Math.round((pending/total)*100 || 0)}%

</span>


</div>


</div>





<div class="leave-item">


<div class="leave-name">


<span class="leave-dot"
style="background:#7cd5c7">
</span>


Approved


</div>



<div class="leave-number">

${approved}


<span class="leave-percent">

${Math.round((approved/total)*100 || 0)}%

</span>


</div>


</div>






<div class="leave-item">


<div class="leave-name">


<span class="leave-dot"
style="background:#ef476f">
</span>


Rejected


</div>



<div class="leave-number">

${rejected}


<span class="leave-percent">

${Math.round((rejected/total)*100 || 0)}%

</span>


</div>


</div>



`;

}

// ===============================
// PENDING REQUESTS
// ===============================


function loadPendingRequests(){


let container =
document.getElementById("pendingRequests");



if(!container)
return;



container.innerHTML = "";



leaves

.filter(
item => item.status === "Pending"
)

.forEach(item=>{



container.innerHTML += `


<div class="request">


<div>


<h4>

${item.employee}

</h4>



<p>

${item.type}
•
${item.date}

</p>


</div>



<button>

Pending

</button>



</div>


`;



});


}









// ===============================
// ACTIVITY TIMELINE
// ===============================


function loadActivity(){


let activity =
document.getElementById("activity");



if(!activity)
return;



activity.innerHTML = "";



let data = [];




// Create activity from leave requests

leaves.forEach(item=>{


data.push({

text:
`${item.employee} submitted a leave request`,

time:
item.date

});


});





if(data.length === 0){


data.push({

text:
"No recent activity",

time:
""

});


}






data.forEach(item=>{


activity.innerHTML += `


<div class="timeline-item">


<div class="timeline-dot"></div>



<div class="timeline-content">


<div class="timeline-title">

${item.text}

</div>



<div class="timeline-time">

${item.time}

</div>



</div>


</div>



`;


});


}









// ===============================
// LOAD EMPLOYEES JSON
// ===============================


function loadEmployeesJSON(){



fetch("../../employee.json")


.then(response=>response.json())


.then(data=>{


let list =

Array.isArray(data)

?

data

:

data.employees;





if(Array.isArray(list)){



employees.splice(

0,

employees.length,

...list

);





updateStatistics();


loadDepartments();



}



})



.catch(error=>{


console.log(

"Employee JSON loading error",

error

);



});


}









// ===============================
// PROFILE LINK
// ===============================


function loadProfileLink(){


let profileLink =
document.getElementById("profileLink");



let user = null;



try{


user =
JSON.parse(

localStorage.getItem("user") ||

localStorage.getItem("currentUser") ||

"null"

);



}

catch(error){


console.log(error);


}





if(profileLink && user){



profileLink.href =

`../../Mohamad/Hr-profile/hr.html?id=${user.id}`;



}


}











// ===============================
// START DASHBOARD
// ===============================



window.addEventListener(

"load",

function(){



loadEmployeesJSON();



updateStatistics();



loadDepartments();



loadLeaveOverview();



loadPendingRequests();



loadActivity();



loadProfileLink();



}

);