
// 1. Settings

// Temporary HR account for testing
localStorage.setItem("loggedInUserId", "1");

const userId = Number(localStorage.getItem("loggedInUserId"));
const jsonPath = "../../employee.json";
const defaultImage = "../photo.jpg";

const el = id => document.getElementById(id);

const fields = [
    "name", "email", "phone", "position", "department",
    "contactName", "contactPhone", "startDate"
];

const selects = [
    "employmentType", "workLocation", "accountState"
];

let profile = null;
let newImage = null;
let imageLoading = false;


// 2. Local Storage

function getSavedProfiles() {
    try {
        return JSON.parse(localStorage.getItem("profileEdits")) || {};
    } catch {
        return {};
    }
}


// 3. Display Profile

function displayProfile() {
    const id = "HR" + String(profile.id).padStart(3, "0");
    const image = profile.profileImage || defaultImage;

    el("headerName").textContent = profile.name;
    el("topName").textContent = profile.name;

    el("headerJob").textContent =
        `${profile.position} • ${profile.department}`;

    el("headerId").textContent = id;
    el("headerStatus").textContent = profile.accountState;
    el("employeeId").textContent = id;
    el("displayDate").textContent = profile.startDate || "Not provided";

    el("profileImage").src = image;
    el("topImage").src = image;

    // Fill the fields
    const values = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        position: profile.position,
        department: profile.department,
        contactName: profile.emergencyContactName,
        contactPhone: profile.emergencyContactPhone,
        startDate: profile.startDate,
        employmentType: profile.employmentType,
        workLocation: profile.workLocation,
        accountState: profile.accountState
    };

    Object.entries(values).forEach(([id, value]) => {
        el(id).value = value || "";
    });
}


// 4. Edit Mode

function editMode(editing) {
    fields.forEach(id => {
        el(id).readOnly = !editing;
    });

    selects.forEach(id => {
        el(id).disabled = !editing;
    });

    el("editBtn").hidden = editing;
    el("saveBtn").hidden = !editing;
    el("cancelBtn").hidden = !editing;
    el("photoBtn").hidden = !editing;

    el("hrForm").classList.toggle("editing", editing);
}

// Start in view mode
editMode(false);


// 5. Fetch JSON

fetch(jsonPath)
    .then(response => {
        if (!response.ok) throw new Error("JSON not found");
        return response.json();
    })

    .then(data => {
        const employee = (Array.isArray(data) ? data : data.employees).find(user => user.id === userId);

        if (!employee || employee.role !== "HR") {
            throw new Error("HR employee not found");
        }

        profile = {
            ...employee,
            ...getSavedProfiles()[userId]
        };

        displayProfile();
    })

    .catch(error => {
        console.error(error);
        alert("Unable to load HR profile.");
    });


// 6. Edit Button

el("editBtn").addEventListener("click", () => {
    if (!profile) return;

    newImage = null;
    el("imageInput").value = "";

    editMode(true);
});


// 7. Cancel Button

el("cancelBtn").addEventListener("click", () => {
    newImage = null;
    el("imageInput").value = "";

    displayProfile();
    editMode(false);
});


// 8. Change Profile Image

el("imageInput").addEventListener("change", function() {
    const file = this.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type) ||
        file.size > 1024 * 1024) {

        alert("Choose a JPG or PNG image under 1MB.");
        this.value = "";
        return;
    }

    const reader = new FileReader();

    imageLoading = true;
    el("saveBtn").disabled = true;

    reader.onload = () => {
        newImage = reader.result;
        el("profileImage").src = newImage;

        imageLoading = false;
        el("saveBtn").disabled = false;
    };

    reader.onerror = () => {
        alert("Unable to read image.");
        imageLoading = false;
        el("saveBtn").disabled = false;
    };

    reader.readAsDataURL(file);
});


// 9. Save Changes

el("hrForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (!profile || imageLoading) return;

    const value = id => el(id).value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{9,20}$/;

    if (!value("name") || !value("position") ||
        !value("department")) {

        alert("Please fill all required fields.");
        return;
    }

    if (!emailRegex.test(value("email"))) {
        alert("Invalid email address.");
        return;
    }

    if ([value("phone"), value("contactPhone")].some(
        phone => phone && !phoneRegex.test(phone)
    )) {
        alert("Invalid phone number.");
        return;
    }

    if (!value("startDate")) {
        alert("Please select a start date.");
        return;
    }

    const updated = {
        ...profile,
        name: value("name"),
        email: value("email"),
        phone: value("phone"),
        position: value("position"),
        department: value("department"),
        emergencyContactName: value("contactName"),
        emergencyContactPhone: value("contactPhone"),
        startDate: value("startDate"),
        employmentType: value("employmentType"),
        workLocation: value("workLocation"),
        accountState: value("accountState"),
        profileImage: newImage || profile.profileImage || ""
    };

    const saved = getSavedProfiles();
    saved[userId] = updated;

    try {
        localStorage.setItem(
            "profileEdits",
            JSON.stringify(saved)
        );

        profile = updated;
        newImage = null;

        displayProfile();
        editMode(false);

        alert("Profile updated successfully!");

    } catch (error) {
        console.error(error);
        alert("Unable to save changes.");
    }
});
