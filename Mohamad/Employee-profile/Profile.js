// Get logged-in employee ID
const userId = Number(localStorage.getItem("loggedInUserId"));

// Display a value inside an HTML element
function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "Not provided";
    }
}

// Read saved profile edits
function getSavedProfiles() {
    try {
        return JSON.parse(localStorage.getItem("profileEdits")) || {};
    } catch {
        return {};
    }
}

// Prepare the image path
function getImagePath(path) {
    if (!path) {
        return "../../Json-Images/images.jpg";
    }

    if (path.startsWith("data:")) {
        return path;
    }

    return "../../" + path;
}

// Display employee information
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

    // Profile image
    const profileImage = document.getElementById("profileImage");

    if (profileImage) {
        profileImage.src = getImagePath(employee.profileImage);
    }
}

// Load employee data and saved edits
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
        const employees = Array.isArray(data) ? data : data.employees;

        const employee = employees.find(user => user.id === userId);

        if (!employee) {
            throw new Error("Employee not found");
        }

        const saved = getSavedProfiles()[userId] || {};

        const profile = {
            ...employee,
            ...saved,
            profileImage: saved.profileImage || employee.profileImage
        };

        displayProfile(profile);
    } catch (error) {
        console.error(error);
        showAlert("error", "Loading Failed", "Unable to load your profile. Please try again.");
    }
}

loadProfile();