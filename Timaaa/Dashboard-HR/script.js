// ===================================
// MYSTA HR DASHBOARD JAVASCRIPT
// VARIABLES
// ===============================
let employees = [];
let leaves = [];
// ===============================
// LOAD LEAVES FROM LOCAL STORAGE
// ===============================
try {
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
"Leave loading error",
error
);
}
// ===============================
// TASK DATA
// ===============================
// ===============================
// LOAD TASKS FROM LOCAL STORAGE
// ===============================

let tasks = JSON.parse(
localStorage.getItem("tasks")
) || [];
// ===============================
// ===============================
// LOAD FEEDBACK FROM LOCAL STORAGE
// ===============================

let feedback = JSON.parse(
    localStorage.getItem("feedbacks")
) || [];
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
// TOTAL TASKS

document.getElementById("totalTasks").innerHTML =
tasks.length;


// COMPLETED TASKS

document.getElementById("completedTasks").innerHTML =
tasks.filter(
task => task.status === "Completed"
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
// LEAVE OVERVIEW + DONUT
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
document.getElementById("totalRequests").innerHTML =
total;
let pendingPercent =
total ? (pending/total)*360 : 0;
let approvedPercent =
total ? (approved/total)*360 : 0;
let rejectedPercent =
total ? (rejected/total)*360 : 0;
let pendingEnd =
pendingPercent;
let approvedEnd =
pendingPercent + approvedPercent;
let pendingPercentValue =
total ? Math.round((pending / total) * 100) : 0;
let approvedPercentValue =
total ? Math.round((approved / total) * 100) : 0;
let rejectedPercentValue =
total ? Math.round((rejected / total) * 100) : 0;
let chart =
document.getElementById("leaveChart");
if(chart){
chart.style.background =
`
conic-gradient(
#118ab2 0deg ${pendingEnd}deg,
#7cd5c7 ${pendingEnd}deg ${approvedEnd}deg,
#ef476f ${approvedEnd}deg 360deg
)
`;
}
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
<span>
(${Math.round((pending/total)*100 || 0)}%)
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
<span>
(${Math.round((approved/total)*100 || 0)}%)
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

<span>
(${Math.round((rejected/total)*100 || 0)}%)
</span>
</div>
</div>
`;}
// ===============================
// PENDING REQUESTS
// ===============================
function loadPendingRequests(){
let container =
document.getElementById("pendingRequests");
if(!container)
return;
container.innerHTML="";
leaves
.filter(
item=>item.status==="Pending"
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
activity.innerHTML="";
let data=[];
leaves.forEach(item=>{

data.push({
employee:item.employee,
action:"submitted a leave request",
date:item.date

});
});
// newest first
data.sort((a,b)=>{
return new Date(b.date)-new Date(a.date);
});
if(data.length===0){
data.push({
employee:"No activity",
action:"",
date:""
});
}
data.forEach((item,index)=>{
let last = 
index === data.length-1
?
"last"
:
"";
activity.innerHTML += `
<div class="timeline-item ${last}">
<div class="timeline-marker">
<div class="timeline-dot"></div>
<div class="timeline-line"></div>
</div>
<div class="timeline-content">
<div class="timeline-title">
${item.employee} ${item.action}

</div>
<div class="timeline-time">
${item.date}
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
let user=null;
try{
user = JSON.parse(
localStorage.getItem("user")
||
localStorage.getItem("currentUser")
||
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
// LOAD USER HEADER
// ===============================
function loadUser(){
let user=null;
try{
user=JSON.parse(
localStorage.getItem("currentUser")
||
localStorage.getItem("user")
||
"null"
);
}
catch(error){}
if(user){
document.getElementById("dashboardName").textContent =
user.name || "User";
document.getElementById("userRole").textContent =
user.role || "Employee";
document.getElementById("dashboardWelcome").textContent =
`Welcome back, ${user.name?.split(" ")[0] || "User"}!`;
if(user.profileImage){

    let imageName = user.profileImage.split("/").pop();
    document.getElementById("profileImage").src =
    "../../Json-Images/" + imageName;
}

}
}
// ===============================
// START
// ===============================
window.addEventListener(
"load",
function(){
loadUser();
loadEmployeesJSON();
updateStatistics();
loadDepartments();
loadLeaveOverview();
loadPendingRequests();
loadActivity();
loadProfileLink();
});