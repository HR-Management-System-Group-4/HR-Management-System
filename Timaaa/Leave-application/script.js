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
// Character Counter
// ============================

reason.addEventListener("input", function () {

    let count = reason.value.length;

    charCount.textContent = count + " chars";

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




    // ============================
    // Validation
    // ============================


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


        status: "Pending",


        employee: "Adam Smith",


        createdDate: new Date().toLocaleDateString()



    };







    // ============================
    // Save To Local Storage
    // ============================



    // Get old applications

    let leaveApplications = JSON.parse(
        localStorage.getItem("leaveApplications")
    ) || [];




    // Add new application

    leaveApplications.push(leaveApplication);





    // Save again

    localStorage.setItem(
        "leaveApplications",
        JSON.stringify(leaveApplications)
    );








    // ============================
    // Success Message
    // ============================


    alert("Leave application submitted successfully!");





    // Reset Form


    leaveForm.reset();


    charCount.textContent = "0 chars";



});








// ============================
// Cancel Button
// ============================


cancelButton.addEventListener("click", function(){



    let confirmCancel = confirm(
        "Are you sure you want to cancel?"
    );




    if(confirmCancel){


        leaveForm.reset();


        charCount.textContent="0 chars";


    }



});
