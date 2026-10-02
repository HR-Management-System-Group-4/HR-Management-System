
// ==========================
// 1. Get Logged-in User
// ==========================

const userId = Number(
    localStorage.getItem("loggedInUserId")
);


// ==========================
// 2. Helper Functions
// ==========================

// Display text inside HTML elements
function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "Not provided";
    }
}

// Get saved profile changes
function getSavedProfiles() {
    try {
        return JSON.parse(
            localStorage.getItem("profileEdits")
        ) || {};
    } catch {
        return {};
    }
}

// Get correct image path
function getImagePath(path) {
    if (!path) {
        return "../../Json-Images/images.jpg";
    }

    if (path.startsWith("data:")) {
        return path;
    }

    return "../../" + path;
}


// ==========================
// 3. Display Employee Profile
// ==========================

function displayProfile(employee) {

    const employeeId =
        "EMP" + String(employee.id).padStart(3, "0");

    const emergencyContact = [
        employee.emergencyContactName,
        employee.emergencyContactPhone
    ].filter(Boolean).join(" - ");

    // Profile header
    setText("employeeName", employee.name);
    setText("employeePosition", employee.position);
    setText("employeeIdBadge", employeeId);
    setText("employeeStatusBadge", employee.accountState);
    setText("employeeTypeBadge", employee.employmentType);

    // Personal information
    setText("profileEmail", employee.email);
    setText("profilePhone", employee.phone);
    setText("profileId", employeeId);
    setText("profilePosition", employee.position);
    setText("profileDepartment", employee.department);
    setText("profileEmergency", emergencyContact || "Not provided");

    // Employment information
    setText("employmentType", employee.employmentType);
    setText("employmentLocation", employee.workLocation);
    setText("employmentStatus", employee.accountState);
    setText("employmentStart", employee.startDate);

    // Employee image from JSON
    const imagePath = getImagePath(employee.profileImage);

    const profileImage =
        document.getElementById("profileImage");

    const navImage =
        document.getElementById("navUserImage");

    if (profileImage) {
    profileImage.src = imagePath;

    profileImage.onerror = function () {
        console.error("Image failed:", this.src);
    };
}

    if (navImage) {
        navImage.src = imagePath;
    }

    // Navbar employee name
    setText("navUserName", employee.name);
}


// ==========================
// 4. Load Employee Data
// ==========================

async function loadProfile() {

    if (!userId) {
        console.error("No logged-in employee found");
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

        // Find logged-in employee
        const employee = employees.find(
            user => user.id === userId
        );

        if (!employee) {
            throw new Error("Employee not found");
        }

        // Get previously saved changes
        const saved = getSavedProfiles()[userId] || {};

        // Merge employee information
        const profile = {
    ...employee,
    ...saved,
    profileImage: saved.profileImage || employee.profileImage
};

        displayProfile(profile);

    } catch (error) {

        console.error(error);
        alert("Unable to load profile");
    }
}
document.querySelectorAll("[data-pending]").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
    });
});

loadProfile();
