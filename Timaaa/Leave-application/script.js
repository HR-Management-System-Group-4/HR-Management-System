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


        employee: JSON.parse(localStorage.getItem("user") || "null")?.name || "Demo Employee",


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
    renderMyRequests();








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

let currentUser = null;
try { currentUser = JSON.parse(localStorage.getItem('user') || 'null'); } catch (_) { /* Demo mode. */ }
if (currentUser) {
    document.querySelector('.employee-info h3').textContent = currentUser.name;
    document.querySelector('.employee-info p').textContent = `${currentUser.position || currentUser.role} • EMP${String(currentUser.id).padStart(3, '0')}`;
}

const requestHistory = document.createElement('section');
requestHistory.className = 'request-history';
requestHistory.innerHTML = '<h2>My leave requests</h2><div class="request-history-list"></div>';
document.querySelector('main.page').append(requestHistory);

function renderMyRequests() {
    const list = requestHistory.querySelector('.request-history-list');
    list.replaceChildren();
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem('leaveApplications') || '[]'); } catch (_) { /* Start empty. */ }
    if (!Array.isArray(saved)) saved = [];
    const mine = saved.filter(item => !currentUser || item.employee === currentUser.name);
    if (!mine.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No leave requests submitted yet.';
        list.append(empty);
        return;
    }
    mine.slice().reverse().forEach(item => {
        const row = document.createElement('div');
        row.className = 'request-history-item';
        const summary = document.createElement('span');
        summary.textContent = `${item.leaveType} · ${item.startDate} – ${item.endDate}`;
        const status = document.createElement('strong');
        status.textContent = item.status;
        row.append(summary, status);
        list.append(row);
    });
}

renderMyRequests();
