
// =========================
// 1. Elements & Variables
// =========================

const userId = Number(localStorage.getItem("loggedInUserId"));

const form = document.getElementById("editProfileForm");
const imageInput = document.getElementById("profileImage");
const imagePreview = document.getElementById("editProfileImage");

const fields = {
    name: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    emergencyContactName: document.getElementById("contactName"),
    emergencyContactPhone: document.getElementById("contactPhone")
};

let currentEmployee = null;
let selectedImage = null;


// =========================
// 2. Local Storage
// =========================

function getSavedProfiles() {
    try {
        return JSON.parse(localStorage.getItem("profileEdits")) || {};
    } catch {
        return {};
    }
}


// =========================
// 3. Display Profile Image
// =========================

function getImagePath(path) {
    if (!path) {
        return "../../Json-Images/images.jpg";
    }

    if (path.startsWith("data:")) {
        return path;
    }

    return "../../" + path;
}


// =========================
// 4. Fill Employee Form
// =========================

function fillForm(employee) {

    // Editable fields
    for (const key in fields) {
        fields[key].value = employee[key] || "";
    }

    // Read-only fields
    document.getElementById("employeeId").value =
        "EMP" + String(employee.id).padStart(3, "0");

    document.getElementById("position").value =
        employee.position || "";

    document.getElementById("department").value =
        employee.department || "";

    // Profile image
    imagePreview.src = getImagePath(employee.profileImage);
}


// =========================
// 5. Load Employee Data
// =========================

async function loadEmployee() {

    if (!userId) {
        alert("Please log in first.");
        form.querySelector(".save-btn").disabled = true;
        return;
    }

    try {
        const response = await fetch("../../employee.json");

        if (!response.ok) {
            throw new Error("Failed to load employees");
        }

        const data = await response.json();

        const employees = Array.isArray(data)
            ? data
            : data.employees;

        const employee = employees.find(
            user => user.id === userId
        );

        if (!employee) {
            throw new Error("Employee not found");
        }

        const saved = getSavedProfiles()[userId] || {};

            currentEmployee = {
            ...employee,
            ...saved,
            email: employee.email
        };

        fillForm(currentEmployee);

    } catch (error) {
        console.error(error);
        alert("Unable to load employee information.");
        form.querySelector(".save-btn").disabled = true;
    }
}

loadEmployee();


// =========================
// 6. Upload Profile Image
// =========================

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        selectedImage = null;

        if (currentEmployee) {
            imagePreview.src = getImagePath(
                currentEmployee.profileImage
            );
        }

        return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
        alert("Please choose a JPG or PNG image.");
        this.value = "";
        return;
    }

    if (file.size > 1024 * 1024) {
        alert("Maximum image size is 1MB.");
        this.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        selectedImage = reader.result;
        imagePreview.src = selectedImage;
    };

    reader.readAsDataURL(file);
});


// =========================
// 7. Validate Form
// =========================

function validateForm(data) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{9,20}$/;

    if (!data.name) {
        alert("Please enter your full name.");
        fields.name.focus();
        return false;
    }

    if (!emailRegex.test(data.email)) {
        alert("Please enter a valid email.");
        fields.email.focus();
        return false;
    }

    const phones = [
        ["phone", "Please enter a valid phone number."],
        ["emergencyContactPhone",
         "Please enter a valid emergency contact number."]
    ];

    for (const [key, message] of phones) {
        if (data[key] && !phoneRegex.test(data[key])) {
            alert(message);
            fields[key].focus();
            return false;
        }
    }

    return true;
}


// =========================
// 8. Save Profile Changes
// =========================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!currentEmployee) return;

    // Read editable fields
    const updatedData = {};

    for (const key in fields) {
    if (key === "email") continue;

    updatedData[key] = fields[key].value.trim();
}

updatedData.email = currentEmployee.email;

    // Validate entered information
    if (!validateForm(updatedData)) return;

    // Add image only if changed
    if (selectedImage) {
        updatedData.profileImage = selectedImage;
    }

    // Save changes for logged-in employee
    const savedProfiles = getSavedProfiles();

    savedProfiles[userId] = {
        ...savedProfiles[userId],
        ...updatedData
    };

    try {
        localStorage.setItem(
            "profileEdits",
            JSON.stringify(savedProfiles)
        );

        // Update the logged-in user's stored information
        const session = JSON.parse(localStorage.getItem("user"));

        if (session && Number(session.id) === userId) {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...session,
                    ...updatedData
                })
            );
        }

        Swal.fire({
    icon: "success",
    title: "Changes Saved!",
    text: "Your profile has been updated successfully.",
    position: "center",
    showConfirmButton: false,
    timer: 1800,
    background: "#ffffff",
    color: "#232743",
    customClass: {
        popup: "mysta-popup"
    }
}).then(() => {
    window.location.href =
        "../Employee-profile/Profile.html";
});

    } catch (error) {
        console.error(error);
        alert("Unable to save changes. Try a smaller image.");
    }
});
