
// 1. Get the logged-in employee ID
const userId = Number(localStorage.getItem("loggedInUserId"));


// 2. Function to display information
function showValue(id, value) {
    document.getElementById(id).textContent =
        value !== undefined && value !== null && value !== ""
            ? value
            : "Not Available";
}


function getImagePath(path) {
    if (!path) {
        return "../../Json-Imges/images.jpg";
    }

    if (path.startsWith("data:")) {
        return path;
    }

    return "../../" + path.replace(
        "Json-Images/",
        "Json-Imges/"
    );
}


// 3. Calculate years of service
function calculateService(startDate) {

    if (!startDate) {
        return "Not Available";
    }

    const start = new Date(startDate);
    const today = new Date();

    if (isNaN(start.getTime()) || start > today) {
        return "Not Available";
    }

    let years = today.getFullYear() - start.getFullYear();

    if (
        today.getMonth() < start.getMonth() ||
        (
            today.getMonth() === start.getMonth() &&
            today.getDate() < start.getDate()
        )
    ) {
        years--;
    }

    return years === 1 ? "1 Year" : years + " Years";
}


// 4. Display employee data
function displayEmployee(employee) {

    // Profile Header
    showValue("employeeName", employee.name);
    showValue("employeePosition", employee.position);
    showValue("employeeCode", "EMP" + employee.id);
    showValue("employeeStatus", employee.accountState);
    showValue("employeeType", employee.employmentType);

    document.getElementById("employeeImage").src =
    getImagePath(employee.profileImage);


    // Personal Information
    showValue("fullName", employee.name);
    showValue("employeeId", employee.id);
    showValue("email", employee.email);
    showValue("phone", employee.phone);
    showValue("role", employee.role);


    // Employment Information
    showValue("department", employee.department);
    showValue("position", employee.position);
    showValue("employmentType", employee.employmentType);
    showValue("workLocation", employee.workLocation);
    showValue("accountState", employee.accountState);


    // Additional Work Details
    showValue("startDate", employee.startDate);
    showValue("yearsOfService", calculateService(employee.startDate));
    showValue("reportingManager", employee.reportingManager);
    showValue("contractType", employee.contractType);
    showValue("departmentId", employee.departmentId);
    showValue("workSchedule", employee.workSchedule);
    showValue("contractEndDate", employee.contractEndDate);


    // Emergency Contact
    showValue("emergencyContactName", employee.emergencyContactName);
    showValue("emergencyContactPhone", employee.emergencyContactPhone);
}


// 5. Fetch employee data from JSON
if (!userId) {

    document.getElementById("employeeName").textContent =
        "Please log in first";

} else {

    fetch("../../employee.json")

        .then(function(response) {

            if (!response.ok) {
                throw new Error("Cannot load JSON file");
            }

            return response.json();

        })

        .then(function(data) {

            // Find the logged-in employee
            let employee = (Array.isArray(data) ? data : data.employees).find(function(user) {
                    return user.id === userId;
                });


            // Check if employee exists
            if (!employee) {
                throw new Error("Employee not found");
            }


            // Read previously saved profile changes
            let savedProfiles = {};

            try {

                savedProfiles = JSON.parse(
                    localStorage.getItem("profileEdits")
                ) || {};

            } catch (error) {

                console.error("Invalid saved profile data:", error);

            }


            // Combine JSON data with saved edits
            employee = {
                ...employee,
                ...(savedProfiles[userId] || {})
            };


            // Display the final information
            displayEmployee(employee);

        })

        .catch(function(error) {

            console.error(error);

            document.getElementById("employeeName").textContent =
                "Unable to load employee information";

        });

}
