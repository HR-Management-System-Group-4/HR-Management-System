let open_link=document.getElementsByClassName("open-link");
let state=document.getElementsByClassName("state");
let btn_submit_solution=document.getElementById("btn-submit-solution");
for(let i=0;i<open_link.length;i++){
open_link[i].addEventListener("click",function(){
if(state[i].textContent.trim()==="Pending"){
    state[i].innerHTML="In progress";
    state[i].style.color="#f0ad4e";
    
}

});}

let taskModal=document.getElementById("taskModal");
for(let i=0;i<open_link.length;i++){
open_link[i].addEventListener("click",function(e){
    e.preventDefault();
     taskModal.style.display="flex";
});
}
let closeModalBtn=document.getElementById("closeModalBtn");
closeModalBtn.addEventListener("click", function() {
    taskModal.style.display = "none";
});
let completedCount=document.getElementById("completedCount");
document.addEventListener("DOMContentLoaded",function(){
let completed=document.getElementsByClassName("completed").length;

completedCount.innerHTML=`${completed}`

});
let PendingCount=document.getElementById("PendingCount");
document.addEventListener("DOMContentLoaded",function(){
let pending=document.getElementsByClassName("pending").length;

PendingCount.innerHTML=`${pending}`

});
let progressCount=document.getElementById("progressCount");
document.addEventListener("DOMContentLoaded",function(){
let in_progress=document.getElementsByClassName("in-progress").length;

progressCount.innerHTML=`${in_progress}`

});
let SubmittedCount=document.getElementById("SubmittedCount");
document.addEventListener("DOMContentLoaded",function(){
let submitted=document.getElementsByClassName("submitted").length;

SubmittedCount.innerHTML=`${submitted}`

});
let col=document.getElementsByClassName("col");

let ALL=document.getElementById("ALL");
ALL.addEventListener("click",function(){
for(let i=0;i<col.length;i++){

        col[i].style.display="flex";
}
});
let filter_pending=document.getElementById("filter_pending");
filter_pending.addEventListener("click",function(){
for(let i=0;i<col.length;i++){
    let ispending=col[i].querySelector(".pending");
    if(ispending){
        col[i].style.display="flex";
    }else{
        col[i].style.display="none";
    }
}
});

let filter_progress=document.getElementById("filter_progress");
filter_progress.addEventListener("click",function(){
for(let i=0;i<col.length;i++){
    let isprogress=col[i].querySelector(".in-progress");
    if(isprogress){
        col[i].style.display="flex";
    }else{
        col[i].style.display="none";
    }
}
});
let filter_submition=document.getElementById("filter_submition");
filter_submition.addEventListener("click",function(){
for(let i=0;i<col.length;i++){
    let issubmitted=col[i].querySelector(".submitted");
    if(issubmitted){
        col[i].style.display="flex";
    }else{
        col[i].style.display="none";
    }
}
});
let filter_completed=document.getElementById("filter_completed");
filter_completed.addEventListener("click",function(){
for(let i=0;i<col.length;i++){
    let iscompleted=col[i].querySelector(".completed");
    if(iscompleted){
        col[i].style.display="flex";
    }else{
        col[i].style.display="none";
    }
}
});

btn_submit_solution.addEventListener("click",function(){
let errorMsg=document.getElementById("errorMsg");
const githubRegex = /^https:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/i;
const gdriveRegex = /^https:\/\/(drive|docs)\.google\.com\/.+/i;
const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
let userSolution=document.getElementById("userSolution");
let githubRegex_test=githubRegex.test(userSolution.value);
let gdriveRegex_test=gdriveRegex.test(userSolution.value);
let urlRegex_test=urlRegex.test(userSolution.value);
if(githubRegex_test||gdriveRegex_test||urlRegex_test){
     errorMsg.style.display="none";
     for(let i=0;i<open_link.length;i++){
     
     if(state[i].textContent.trim()==="In progress"){
    state[i].innerHTML="Submitted";
    state[i].style.color="var(--color-accent)";}
    

        }
     localStorage.setItem("Solution",JSON.stringify(errorMsg));
     taskModal.style.display="none";

    }
    else{
        errorMsg.style.display="flex";
    }
});
