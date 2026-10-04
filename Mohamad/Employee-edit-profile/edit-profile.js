
// =========================
// 1. Elements & Variables
// =========================

const userId = Number(localStorage.getItem("loggedInUserId"));

const form = document.getElementById("editProfileForm");
const imageInput = document.getElementById("profileImage");
const imagePreview = document.getElementById("editProfileImage");
const fileName = document.getElementById("fileName");

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
// 2. Unified Alert Messages
// =========================

const showMessage = showAlert;


// =========================
// 3. Local Storage
// =========================

function getSavedProfiles() {
    try {
        return JSON.parse(localStorage.getItem("profileEdits")) || {};
    } catch {
        return {};
    }
}


// =========================
// 4. Profile Image
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
// 5. Fill Employee Form
// =========================

function fillForm(employee) {

    for (const key in fields) {
        fields[key].value = employee[key] || "";
    }

    document.getElementById("employeeId").value =
        "EMP" + String(employee.id).padStart(3, "0");

    document.getElementById("position").value =
        employee.position || "";

    document.getElementById("department").value =
        employee.department || "";

    imagePreview.src = getImagePath(employee.profileImage);
}


// =========================
// 6. Load Employee Data
// =========================

async function loadEmployee() {

    if (!userId) {
        await showMessage(
            "warning",
            "Login Required",
            "Please log in first."
        );

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

        await showMessage(
            "error",
            "Loading Failed",
            "Unable to load employee information."
        );

        form.querySelector(".save-btn").disabled = true;
    }
}

loadEmployee();


// =========================
// 7. Upload Profile Image
// =========================

imageInput.addEventListener("change", async function () {

    const file = this.files[0];

    if (!file) {
        selectedImage = null;

        if (currentEmployee) {
            imagePreview.src = getImagePath(
                currentEmployee.profileImage
            );
        }

        if (fileName) {
            fileName.textContent = "JPG or PNG. Maximum 1MB.";
        }

        return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
        this.value = "";
        selectedImage = null;

        if (fileName) {
            fileName.textContent = "JPG or PNG. Maximum 1MB.";
        }

        await showMessage(
            "error",
            "Invalid Image",
            "Please choose a JPG or PNG image."
        );

        return;
    }

    if (file.size > 1024 * 1024) {
        this.value = "";
        selectedImage = null;

        if (fileName) {
            fileName.textContent = "JPG or PNG. Maximum 1MB.";
        }

        await showMessage(
            "error",
            "Image Too Large",
            "Maximum image size is 1MB."
        );

        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        selectedImage = reader.result;
        imagePreview.src = selectedImage;

        if (fileName) {
            fileName.textContent = file.name;
        }
    };

    reader.onerror = function () {
        selectedImage = null;
        imageInput.value = "";

        if (fileName) {
            fileName.textContent = "JPG or PNG. Maximum 1MB.";
        }

        showMessage(
            "error",
            "Upload Failed",
            "Unable to read the selected image."
        );
    };

    reader.readAsDataURL(file);
});


// =========================
// 8. Validate Form
// =========================

async function validateForm(data) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{9,20}$/;

    if (!data.name) {
        await showMessage(
            "error",
            "Full Name Required",
            "Please enter your full name."
        );

        fields.name.focus();
        return false;
    }

    if (!emailRegex.test(data.email)) {
        await showMessage(
            "error",
            "Invalid Email",
            "Please enter a valid email address."
        );

        fields.email.focus();
        return false;
    }

    const phones = [
        [
            "phone",
            "Invalid Phone Number",
            "Please enter a valid phone number."
        ],
        [
            "emergencyContactPhone",
            "Invalid Emergency Number",
            "Please enter a valid emergency contact number."
        ]
    ];

    for (const [key, title, message] of phones) {

        if (data[key] && !phoneRegex.test(data[key])) {

            await showMessage("error", title, message);

            fields[key].focus();
            return false;
        }
    }

    return true;
}


// =========================
// 9. Save Profile Changes
// =========================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    if (!currentEmployee) return;

    const updatedData = {};

    for (const key in fields) {
        if (key === "email") continue;

        updatedData[key] = fields[key].value.trim();
    }

    updatedData.email = currentEmployee.email;

    const isValid = await validateForm(updatedData);

    if (!isValid) return;

    if (selectedImage) {
        updatedData.profileImage = selectedImage;
    }

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

        const session = JSON.parse(
            localStorage.getItem("user")
        );

        if (session && Number(session.id) === userId) {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...session,
                    ...updatedData
                })
            );
        }

    } catch (error) {
        console.error(error);

        await showMessage(
            "error",
            "Save Failed",
            "Unable to save changes. Try a smaller image."
        );

        return;
    }

    await showMessage(
        "success",
        "Changes Saved!",
        "Your profile has been updated successfully."
    );

    window.location.href =
        "../Employee-profile/Profile.html";
});
