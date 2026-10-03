// ============================
// ELEMENTS
// ============================

let leaveForm =
document.getElementById("leaveForm");
let reason =
document.getElementById("reason");
let charCount =
document.getElementById("charCount");
let cancelButton =
document.getElementById("cancelButton");
let startDate =
document.getElementById("startDate");
let endDate =
document.getElementById("endDate");
let leaveType =
document.getElementById("leaveType");
let hours =
document.getElementById("hours");
let hoursGroup =
document.getElementById("hoursGroup");
let otherLeaveBox =
document.getElementById("otherLeaveBox");
let otherLeaveInput =
document.getElementById("otherLeaveInput");
// ============================
// CURRENT USER
// ============================
let currentUser = null;

try{

currentUser =
JSON.parse(
localStorage.getItem("user") ||
localStorage.getItem("currentUser") ||
"null"
);
}
catch(error){
console.log(
"User loading error"
);
}
// ============================
// DISPLAY USER
// ============================
if(currentUser){

let name =
document.getElementById("employeeName");

let info =
document.getElementById("employeeInfo");

let image =
document.getElementById("employeeImage");

if(name){
name.textContent =
currentUser.name || "Employee";
}
if(info){

info.textContent =
`${currentUser.position || currentUser.role || "Employee"} • EMP${String(currentUser.id || "").padStart(3,"0")}`;

}
if(image && currentUser.profileImage){
image.src =
"../../Json-Images/" +
currentUser.profileImage.split("/").pop();

}
}
// ============================
// ERROR FUNCTIONS
// ============================
function showError(id,message){
let element =
document.getElementById(id);
if(element){
element.textContent = message;

}

}
function clearErrors(){

document
.querySelectorAll(".error-message")
.forEach(item=>{

item.textContent="";
});
document
.querySelectorAll("input,select,textarea")
.forEach(item=>{
item.classList.remove("input-error");
});
}
function invalid(element){

if(element){
element.classList.add("input-error");
}

}

// ============================
// OTHER OPTION
// ============================
leaveType.addEventListener(
"change",
function(){
if(this.value==="Others"){
otherLeaveBox.style.display="block";
}
else{
otherLeaveBox.style.display="none";
otherLeaveInput.value="";
}
});

// ============================
// HOURS SHOW
// ===========================
function checkHours(){
if(
startDate.value &&
endDate.value &&
startDate.value === endDate.value

){
hoursGroup.style.display="block";
}
else{
hoursGroup.style.display="none";
hours.value="";
}

}
startDate.addEventListener(
"change",
checkHours
);

endDate.addEventListener(
"change",
checkHours
);
// ============================
// CHARACTER COUNT
// ============================
reason.addEventListener(
"input",
function(){

charCount.textContent =
reason.value.length + " chars";
});
// ============================
// SUBMIT VALIDATION
// ============================
leaveForm.addEventListener(
"submit",
function(event){
event.preventDefault();
clearErrors();
let valid = true;
// Leave type

if(leaveType.value===""){

invalid(leaveType);
showError(
"leaveTypeError",
"Please select leave type."
);
valid=false;
}
// Other leave

if(
leaveType.value==="Others" &&
otherLeaveInput.value.trim()===""
){
invalid(otherLeaveInput);
showError(
"otherLeaveError",
"Please specify leave type."
);
valid=false;

}
// Start date
if(startDate.value===""){

invalid(startDate);
showError(
"startDateError",
"Please select start date."
);
valid=false;
}
// End date
if(endDate.value===""){
invalid(endDate);
showError(
"endDateError",
"Please select end date."
);
valid=false;
}
if(
startDate.value &&
endDate.value &&
endDate.value < startDate.value

){

invalid(endDate);


showError(
"endDateError",
"End date must be after start date."
);

valid=false;
}
// Hours
if(hoursGroup.style.display==="block"){
if(hours.value===""){
invalid(hours);

showError(
"hoursError",
"Please enter hours."
);
valid=false;
}

if(Number(hours.value)>24){
invalid(hours);

showError(
"hoursError",
"Hours cannot be more than 24 hours."
);
valid=false;
}

}
// Reason


if(reason.value.trim()===""){
invalid(reason);

showError(
"reasonError",
"Please enter reason.");

valid=false;
}
else if(reason.value.trim().length < 10){

invalid(reason);
showError(
"reasonError",
"Reason must contain at least 10 characters."
);
valid=false;
}
// STOP

if(!valid){
return;
}
// ============================
// SAVE REQUEST
// ===========================
let leaveApplication = {

id:Date.now(),

employee:
currentUser?.name || "Employee",
leaveType:
leaveType.value==="Others"
?
otherLeaveInput.value
:
leaveType.value,
startDate:
startDate.value,
endDate:
endDate.value,
hours:
hours.value || null,
reason:
reason.value,
status:
"Pending",
createdDate:
new Date().toLocaleDateString()
};
let requests =
JSON.parse(
localStorage.getItem("leaveApplications") || "[]"
);
requests.push(
leaveApplication
);
localStorage.setItem(
"leaveApplications",
JSON.stringify(requests)
);
renderMyRequests();
alert(
"Leave application submitted successfully!"
);
leaveForm.reset();
hoursGroup.style.display="none";
otherLeaveBox.style.display="none";
charCount.textContent="0 chars";
});
// ============================
// CANCEL
// ============================
cancelButton.addEventListener(
"click",
function(){
leaveForm.reset();
clearErrors();
hoursGroup.style.display="none";
otherLeaveBox.style.display="none";
charCount.textContent="0 chars";
});
// ============================
// REQUEST HISTORY
// ============================
function renderMyRequests(){
let list =
document.querySelector(
".request-history-list"
);
if(!list)
return;
list.innerHTML="";
let requests =
JSON.parse(
localStorage.getItem("leaveApplications") || "[]"
);
let mine =
requests.filter(item=>{
return !currentUser ||
item.employee === currentUser.name;
});
if(mine.length===0){
list.innerHTML =
`
<p>
No leave requests submitted yet.
</p>
`;
return;
}
mine.reverse()
.forEach(item=>{
let color="#173d6d";
if(item.status==="Approved"){
color="#2e8b57";
}
if(item.status==="Rejected"){
color="#d9534f";
}
list.innerHTML += `
<div class="request-history-item">
<div>
<strong>
${item.leaveType}
</strong>
<br>

${item.startDate}
-
${item.endDate}
</div>
<strong style="color:${color}">
${item.status}
</strong>
</div>

`;
});

}

renderMyRequests();