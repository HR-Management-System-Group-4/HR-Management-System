// ============================
// Get Elements
// ============================

let leaveForm = document.getElementById("leaveForm");

let reason = document.getElementById("reason");

let charCount = document.getElementById("charCount");

let cancelButton = document.getElementById("cancelButton");

let startDate = document.getElementById("startDate");

let endDate = document.getElementById("endDate");

let leaveType = document.getElementById("leaveType");

let hours = document.getElementById("hours");



// ============================
// Load Current User
// ============================

let currentUser = null;

try {

    currentUser = JSON.parse(
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser") ||
        "null"
    );

}
catch(error){

    console.log("User loading error");

}



// ============================
// Display Employee Data
// ============================

if(currentUser){


    let nameElement = document.getElementById("employeeName");

    let infoElement = document.getElementById("employeeInfo");

    let imageElement = document.getElementById("employeeImage");



    if(nameElement){

        nameElement.textContent =
        currentUser.name || "Employee";

    }



    if(infoElement){

        infoElement.textContent =
        `${currentUser.position || currentUser.role || "Employee"} • EMP${String(currentUser.id || "").padStart(3,"0")}`;

    }



if(imageElement){

    imageElement.src =
    currentUser.profileImage
    ? "../../Json-Imges/" + currentUser.profileImage.split("/").pop()
    : "images.jpg";

}


}






// ============================
// Character Counter
// ============================

reason.addEventListener("input", function () {


    let count = reason.value.length;


    charCount.textContent =
    count + " chars";


});






// ============================
// Date Validation
// ============================


endDate.addEventListener("change", function () {


    if(startDate.value !== "" && endDate.value !== ""){


        if(endDate.value < startDate.value){


            alert("End date cannot be before start date.");


            endDate.value = "";


        }


    }


});






// ============================
// Submit Form
// ============================


leaveForm.addEventListener("submit", function(event){


    event.preventDefault();



    let reasonText = reason.value.trim();





    if(

        leaveType.value === "" ||

        startDate.value === "" ||

        endDate.value === "" ||

        hours.value === "" ||

        reasonText === ""

    ){


        alert("Please fill in all required fields.");

        return;


    }






    if(reasonText.length < 10){


        alert("Reason must contain at least 10 characters.");

        return;


    }






    if(hours.value <= 0){


        alert("Hours must be greater than 0.");

        return;


    }







    // ============================
    // Create Leave Object
    // ============================


    let leaveApplication = {


        id: Date.now(),


        leaveType: leaveType.value,


        startDate: startDate.value,


        endDate: endDate.value,


        hours: hours.value,


        reason: reasonText,


        status:"Pending",



        employee:
        currentUser?.name || "Demo Employee",



        createdDate:
        new Date().toLocaleDateString()



    };









    // ============================
    // Save Local Storage
    // ============================


    let leaveApplications =
    JSON.parse(
        localStorage.getItem("leaveApplications")
    ) || [];



    leaveApplications.push(
        leaveApplication
    );



    localStorage.setItem(
        "leaveApplications",
        JSON.stringify(leaveApplications)
    );



    renderMyRequests();






    alert(
        "Leave application submitted successfully!"
    );






    leaveForm.reset();


    charCount.textContent="0 chars";



});








// ============================
// Cancel Button
// ============================


cancelButton.addEventListener("click", function(){


    let confirmCancel =
    confirm(
        "Are you sure you want to cancel?"
    );



    if(confirmCancel){


        leaveForm.reset();


        charCount.textContent="0 chars";


    }


});









// ============================
// Request History
// ============================


const requestHistory =
document.createElement("section");


requestHistory.className =
"request-history";



requestHistory.innerHTML =
`
<h2>
My leave requests
</h2>

<div class="request-history-list"></div>

`;



document
.querySelector("main.page")
.append(requestHistory);








function renderMyRequests(){


    const list =
    requestHistory.querySelector(
        ".request-history-list"
    );



    list.replaceChildren();




    let saved=[];


    try{

        saved =
        JSON.parse(
            localStorage.getItem("leaveApplications") || "[]"
        );

    }

    catch(error){

        saved=[];

    }





    const mine =
    saved.filter(
        item =>
        !currentUser ||
        item.employee === currentUser.name
    );






    if(!mine.length){


        let empty =
        document.createElement("p");


        empty.textContent =
        "No leave requests submitted yet.";


        list.append(empty);


        return;


    }







    mine
    .slice()
    .reverse()
    .forEach(item=>{



        let row =
        document.createElement("div");


        row.className =
        "request-history-item";




        let summary =
        document.createElement("span");



        summary.textContent =
        `${item.leaveType} · ${item.startDate} – ${item.endDate}`;





        let status =
        document.createElement("strong");



        status.textContent =
        item.status;





        row.append(
            summary,
            status
        );



        list.append(row);



    });



}







renderMyRequests();