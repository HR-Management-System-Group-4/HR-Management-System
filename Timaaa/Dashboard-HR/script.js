// ===================================
// NEXUS HR DASHBOARD JAVASCRIPT
// ===================================



// ===============================
// DATA
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






const leaves = [

{
employee:"Adam Smith",
type:"Annual Leave",
date:"2026-10-10",
status:"Pending"
},


{
employee:"Lina Ahmad",
type:"Sick Leave",
date:"2026-10-15",
status:"Pending"
},


{
employee:"Sara Ahmed",
type:"Annual Leave",
date:"2026-09-20",
status:"Approved"
},


{
employee:"Omar Khalil",
type:"Emergency Leave",
date:"2026-09-22",
status:"Rejected"
},


{
employee:"Emma Brown",
type:"Annual Leave",
date:"2026-09-25",
status:"Approved"
}


];






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






const feedback = [

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
).innerHTML = employees.length;



document.getElementById(
"pendingLeaves"
).innerHTML =

leaves.filter(
item=>item.status==="Pending"
).length;




document.getElementById(
"activeTasks"
).innerHTML =

tasks.filter(
item=>item.status==="Active"
).length;




document.getElementById(
"completedTasks"
).innerHTML =

tasks.filter(
item=>item.status==="Completed"
).length;




document.getElementById(
"feedback"
).innerHTML = feedback.length;



}








// ===============================
// EMPLOYEE DEPARTMENT
// ===============================


function loadDepartments(){



let container =
document.getElementById(
"department"
);



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



container.innerHTML += `


<div>


<p>

${dep}

<b>
${departments[dep]}
</b>

</p>


<span></span>


</div>


`;



});



}









// ===============================
// LEAVE OVERVIEW
// ===============================


function loadLeaveOverview(){



let box =
document.getElementById(
"leaveOverview"
);



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



box.innerHTML=`


<p>

<span class="orange"></span>

Pending

<b>
${pending}
</b>

</p>



<p>

<span class="green-dot"></span>

Approved

<b>
${approved}
</b>

</p>



<p>

<span class="red"></span>

Rejected

<b>
${rejected}
</b>

</p>



<a href="#">

View All Requests →

</a>


`;



}









// ===============================
// PENDING REQUESTS
// ===============================


function loadPendingRequests(){



let container =
document.getElementById(
"pendingRequests"
);



container.innerHTML="";




leaves
.filter(
leave=>leave.status==="Pending"
)
.forEach(leave=>{



container.innerHTML += `


<div class="request">


<div>


<h4>
${leave.employee}
</h4>


<p>
${leave.type} • ${leave.date}
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
// RECENT ACTIVITY
// ===============================


function loadActivity(){



let activity =
document.getElementById(
"activity"
);



activity.innerHTML="";



let data=[

{
text:"Adam Smith submitted a leave request",
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


activity.innerHTML +=`


<li>


<div class="circle"></div>


${item.text}


<small>

${item.time}

</small>


</li>


`;



});



}









// ===============================
// QUICK ACTION CLICK EFFECT
// ===============================


document
.querySelectorAll(".quick-card")
.forEach(card=>{


card.addEventListener(
"click",
function(){


console.log(
"Opening:",
this.innerText
);


});


});










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



});