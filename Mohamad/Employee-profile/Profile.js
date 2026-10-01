
// Temporary user ID until Login is ready


const userId = Number(
    localStorage.getItem("loggedInUserId")
);

console.log("User ID:", userId);

// Display data in HTML
function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "Not provided";
    }
}

// Get saved changes
function getSavedProfiles() {
    try {
        return JSON.parse(localStorage.getItem("profileEdits")) || {};
    } catch {
        return {};
    }
}

// Load employee data
fetch("/employee.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load employees");
        }

        return response.json();
    })

    .then(data => {
       const employee = data.employees.find(user => user.id === userId);
        if (!employee) {
            throw new Error("Employee not found");
        }

        const saved = getSavedProfiles()[userId] || {};
        const profile = { ...employee, ...saved };

        displayProfile(profile);
    })

    .catch(error => {
        console.error(error);
        alert("Unable to load profile");
    });


// Display employee profile
function displayProfile(employee) {

    const employeeId = "EMP" + String(employee.id).padStart(3, "0");

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
const image = document.getElementById("profileImage");

if (image && employee.profileImage) {

    let imagePath = employee.profileImage;

    if (imagePath.startsWith("Json-Images/")) {
        imagePath = "/" + imagePath;
    }

    image.src = imagePath;
}
}
