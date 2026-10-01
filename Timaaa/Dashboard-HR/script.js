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
  { employee: "Ahmad Saleh", type: "Annual Leave", date: "2026-10-12", status: "Pending" },
  { employee: "Dana Rimawi", type: "Annual Leave", date: "2026-10-04", status: "Approved" },
  { employee: "Tariq Hijazi", type: "Sick Leave", date: "2026-09-27", status: "Rejected" }
];

try {
  const decisions = JSON.parse(localStorage.getItem('sampleLeaveDecisions') || '{}');
  [['sample-1', 0], ['sample-2', 1], ['sample-3', 2]].forEach(([id, index]) => {
    if (['Approved', 'Rejected'].includes(decisions[id])) leaves[index].status = decisions[id];
  });
} catch (_) { /* Use sample statuses. */ }


try {
  const saved = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
  if (Array.isArray(saved)) {
    saved.forEach(item => leaves.push({
      employee: item.employee || 'Employee',
      type: item.leaveType || 'Leave',
      date: item.startDate || '',
      status: item.status || 'Pending'
    }));
  }
} catch (error) {
  console.warn('Saved leave requests could not be loaded.', error);
}

const escapeDashboardText = value => String(value).replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);






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



<a href="../../Sara_Dolat/Leave-HR/index.html">

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
${escapeDashboardText(leave.employee)}
</h4>


<p>
${escapeDashboardText(leave.type)} • ${escapeDashboardText(leave.date)}
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

fetch('../../employee.json')
  .then(response => response.json())
  .then(data => {
    const all = Array.isArray(data) ? data : data.employees;
    if (Array.isArray(all)) {
      employees.splice(0, employees.length, ...all);
      updateStatistics();
      loadDepartments();
    }
  })
  .catch(error => console.warn('Employee count unavailable.', error));



});
