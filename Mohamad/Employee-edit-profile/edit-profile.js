
// ==============================
// 1. Get logged-in employee ID
// ==============================

let userId = Number(
    localStorage.getItem("loggedInUserId")
);

const form = document.getElementById("editProfileForm");

const fullName = document.getElementById("fullName");
const employeeId = document.getElementById("employeeId");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const position = document.getElementById("position");
const department = document.getElementById("department");

const contactName = document.getElementById("contactName");
const contactPhone = document.getElementById("contactPhone");

const imageInput = document.getElementById("profileImage");
const imagePreview = document.getElementById("editProfileImage");

let currentEmployee = null;
let selectedImage = null;


// ==============================
// 2. Read Local Storage
// ==============================

function getSavedProfiles() {
    try {
        return JSON.parse(
            localStorage.getItem("profileEdits")
        ) || {};
    } catch (error) {
        console.error(error);
        return {};
    }
}


// ==============================
// 3. Load employee data
// ==============================

if (!userId) {
    alert("Please log in first.");
} else {

    fetch("/employee.json")

        .then(function(response) {

            if (!response.ok) {
                throw new Error("JSON file not found");
            }

            return response.json();
        })

        .then(function(data) {

            // Find the logged-in employee
            let employee = data.employees.find(function(user) {
            return user.id === userId;
});

            if (!employee) {
                throw new Error("Employee not found");
            }

            // Get saved changes for this employee
            let savedProfiles = getSavedProfiles();
            let savedData = savedProfiles[userId] || {};

            // Merge original and edited information
            currentEmployee = {
                ...employee,
                ...savedData
            };

            // Display employee information
            loadEmployee(currentEmployee);
        })

        .catch(function(error) {
            console.error(error);
            alert("Unable to load employee data.");
        });
}


// ==============================
// 4. Fill the form
// ==============================

function loadEmployee(employee) {

    fullName.value = employee.name || "";

    employeeId.value =
        "EMP" + String(employee.id).padStart(3, "0");

    email.value = employee.email || "";
    phone.value = employee.phone || "";

    position.value = employee.position || "";
    department.value = employee.department || "";

    contactName.value = employee.emergencyContactName || "";
    contactPhone.value = employee.emergencyContactPhone || "";

    if (employee.profileImage) {
        imagePreview.src = employee.profileImage;
    }
}


// ==============================
// 5. Preview profile image
// ==============================

imageInput.addEventListener("change", function() {

    const file = imageInput.files[0];

    if (!file) {
        selectedImage = null;
        imagePreview.src =
            currentEmployee?.profileImage || "../photo.jpg";
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png"
    ];

    // File type validation
    if (!allowedTypes.includes(file.type)) {
        alert("Please choose a JPG or PNG image.");
        imageInput.value = "";
        return;
    }

    // Maximum size: 1 MB
    if (file.size > 1024 * 1024) {
        alert("Maximum image size is 1MB.");
        imageInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function() {
        selectedImage = reader.result;
        imagePreview.src = selectedImage;
    };

    reader.readAsDataURL(file);

});


// ==============================
// 6. Save profile changes
// ==============================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!currentEmployee) {
        alert("Employee data is not ready.");
        return;
    }

    // Read input values
    let nameValue = fullName.value.trim();
    let emailValue = email.value.trim();
    let phoneValue = phone.value.trim();

    let contactNameValue = contactName.value.trim();
    let contactPhoneValue = contactPhone.value.trim();


    // ==========================
    // 7. Form Validation
    // ==========================

    if (nameValue === "") {
        alert("Please enter your full name.");
        fullName.focus();
        return;
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
        alert("Please enter a valid email.");
        email.focus();
        return;
    }

    let phoneRegex = /^\+?[\d\s-]{9,20}$/;

    if (
        phoneValue !== "" &&
        !phoneRegex.test(phoneValue)
    ) {
        alert("Please enter a valid phone number.");
        phone.focus();
        return;
    }

    if (
        contactPhoneValue !== "" &&
        !phoneRegex.test(contactPhoneValue)
    ) {
        alert("Please enter a valid emergency contact number.");
        contactPhone.focus();
        return;
    }


    // ==========================
    // 8. Prepare updated data
    // ==========================

    let updatedEmployee = {
        ...currentEmployee,

        name: nameValue,
        email: emailValue,
        phone: phoneValue,

        emergencyContactName: contactNameValue,
        emergencyContactPhone: contactPhoneValue,

        emergencyContact: [
            contactNameValue,
            contactPhoneValue
        ].filter(Boolean).join(" - "),

        profileImage:
            selectedImage || currentEmployee.profileImage || ""
    };


    // ==========================
    // 9. Save to Local Storage
    // ==========================

    let savedProfiles = getSavedProfiles();

    savedProfiles[userId] = updatedEmployee;

    try {

        localStorage.setItem(
            "profileEdits",
            JSON.stringify(savedProfiles)
        );

        alert("Profile updated successfully!");

        window.location.href =
            "../Employee-profile/Profile.html";

    } catch (error) {

        console.error(error);

        alert(
            "Unable to save changes. " +
            "Please try a smaller profile image."
        );
    }

});
