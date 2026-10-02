// ===================================
// MYSTA HR DASHBOARD JAVASCRIPT
// ===================================



// ===============================
// VARIABLES
// ===============================


let leaveChart;




// ===============================
// EMPLOYEES DATA
// ===============================


const employees = [


{
name:"Adam Smith",
department:"Engineering"
},


{
name:"Lina Ahmad",
department:"Design"
},


{
name:"Sara Ahmed",
department:"Marketing"
},


{
name:"Omar Khalil",
department:"Analytics"
},


{
name:"John David",
department:"Engineering"
},


{
name:"Emma Brown",
department:"Engineering"
}



];








// ===============================
// LEAVE DATA
// ===============================


const leaves = [


{
employee:"Ahmad Saleh",
type:"Annual Leave",
date:"2026-10-12",
status:"Pending"
},


{
employee:"Dana Rimawi",
type:"Annual Leave",
date:"2026-10-04",
status:"Approved"
},


{
employee:"Tariq Hijazi",
type:"Sick Leave",
date:"2026-09-27",
status:"Rejected"
}



];







// ===============================
// LOAD LOCAL STORAGE LEAVES
// ===============================


try{


let savedLeaves =
JSON.parse(
localStorage.getItem("leaveApplications")
) || [];



savedLeaves.forEach(item=>{


leaves.push({


employee:item.employee || "Employee",

type:item.leaveType || "Leave",

date:item.startDate || "",

status:item.status || "Pending"



});


});


}

catch(error){


console.log(
"Local storage error",
error
);


}









// ===============================
// TASK DATA
// ===============================


const tasks=[


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


const feedback=[


"New feedback received",

"Employee satisfaction survey",

"HR review completed"



];









// ===============================
// UPDATE STAT CARDS
// ===============================


function updateStatistics(){



document.getElementById(
"totalEmployees"
).innerHTML =
employees.length;




document.getElementById(
"pendingLeaves"
).innerHTML =


leaves.filter(
x=>x.status==="Pending"
).length;






document.getElementById(
"activeTasks"
).innerHTML =


tasks.filter(
x=>x.status==="Active"
).length;






document.getElementById(
"completedTasks"
).innerHTML =


tasks.filter(
x=>x.status==="Completed"
).length;






document.getElementById(
"feedback"
).innerHTML =
feedback.length;



}









// ===============================
// DEPARTMENT SECTION
// ===============================


function loadDepartments(){



let container =
document.getElementById(
"department"
);



if(!container)
return;



container.innerHTML="";



let departments={};



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
// LEAVE OVERVIEW + CHART
// ===============================


function loadLeaveOverview(){



let box =
document.getElementById(
"leaveOverview"
);



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







// CREATE CHART


let chartElement =
document.getElementById(
"leaveChart"
);



if(chartElement){



if(leaveChart){

leaveChart.destroy();


}




leaveChart =
new Chart(chartElement,{



type:"doughnut",



data:{


labels:[

"Pending",

"Approved",

"Rejected"

],



datasets:[{


data:[

pending,

approved,

rejected

],



backgroundColor:[


"#118ab2",

"#7cd5c7",

"#ef476f"



],


borderWidth:0



}]



},



options:{



responsive:true,


cutout:"70%",



plugins:{



legend:{


display:false


}



}



}



});



}



}









// ===============================
// PENDING REQUESTS
// ===============================


function loadPendingRequests(){



let container =
document.getElementById(
"pendingRequests"
);



if(!container)
return;



container.innerHTML="";




leaves

.filter(
x=>x.status==="Pending"
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
document.getElementById(
"activity"
);



if(!activity)
return;



activity.innerHTML="";




let data=[



{

text:"Ahmad Saleh submitted a leave request",

time:"2 hours ago"


},



{

text:"Lina updated task status",

time:"Yesterday"


},



{

text:"New feedback received",

time:"Today"


}



];







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
// LOAD EMPLOYEE JSON
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
"JSON loading error",
error
);


});



}









// ===============================
// START DASHBOARD
// ===============================


window.addEventListener(
"load",

function(){



updateStatistics();


loadDepartments();


loadLeaveOverview();


loadPendingRequests();


loadActivity();


loadEmployeesJSON();



});

