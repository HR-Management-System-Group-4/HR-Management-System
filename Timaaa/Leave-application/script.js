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

    if (startDate.value !== "" && endDate.value !== "") {

        if (endDate.value < startDate.value) {

            alert("End date cannot be before start date.");

            endDate.value = "";

        }

    }

});


// ============================
// Submit Form
// ============================

leaveForm.addEventListener("submit", function (event) {

    event.preventDefault();


    let reasonText = reason.value.trim();


    // Check required fields

    if (
        leaveType.value === "" ||
        startDate.value === "" ||
        endDate.value === "" ||
        hours.value === "" ||
        reasonText === ""
    ) {

        alert("Please fill in all required fields.");

        return;

    }


    // Check reason length

    if (reasonText.length < 10) {

        alert("Reason must contain at least 10 characters.");

        return;

    }


    // Check hours

    if (hours.value <= 0) {

        alert("Hours must be greater than 0.");

        return;

    }


    // Success

    alert("Leave application submitted successfully!");


    // Reset form

    leaveForm.reset();

    charCount.textContent = "0 chars";

});


// ============================
// Cancel Button
// ============================

cancelButton.addEventListener("click", function () {

    let confirmCancel = confirm(
        "Are you sure you want to cancel?"
    );


    if (confirmCancel) {

        leaveForm.reset();

        charCount.textContent = "0 chars";

    }

});