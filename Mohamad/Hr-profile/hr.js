
// ==========================
// 1. Settings
// ==========================

const userId = Number(localStorage.getItem("loggedInUserId"));
const jsonPath = "../../employee.json";

const el = id => document.getElementById(id);

const fields = [
    "name", "phone", "position", "department",
    "contactName", "contactPhone", "startDate"
];

const selects = [
    "employmentType", "workLocation", "accountState"
];

let profile = null;
let newImage = null;
let imageLoading = false;


// ==========================
// 2. Helper Functions
// ==========================

function getSavedProfiles() {
    try {
        return JSON.parse(localStorage.getItem("profileEdits")) || {};
    } catch {
        return {};
    }
}

function getImagePath(path) {
    if (!path) return "../../Json-Imges/images.jpg";

    if (path.startsWith("data:")) return path;

    return "../../" + path.replace(
        "Json-Images/",
        "Json-Imges/"
    );
}

// Handle values that are missing from HTML select options
function setSelectValue(id, value) {
    const select = el(id);
    const selectedValue = value || "";

    if (
        selectedValue &&
        !Array.from(select.options).some(
            option => option.value === selectedValue
        )
    ) {
        select.add(new Option(selectedValue, selectedValue));
    }

    select.value = selectedValue;
}


// ==========================
// 3. Display HR Profile
// ==========================

function displayProfile() {
    const id = "HR" + String(profile.id).padStart(3, "0");
    const image = getImagePath(profile.profileImage);

    // Header
    el("headerName").textContent = profile.name;
    el("topName").textContent = profile.name;
    el("headerJob").textContent =
        `${profile.position} • ${profile.department}`;

    el("headerId").textContent = id;
    el("headerStatus").textContent = profile.accountState;
    el("employeeId").textContent = id;

    el("displayDate").textContent =
        profile.startDate || "Not provided";

    // Profile and top bar images
    el("profileImage").src = image;
    el("topImage").src = image;

    // Input values
    const values = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        position: profile.position,
        department: profile.department,
        contactName: profile.emergencyContactName,
        contactPhone: profile.emergencyContactPhone,
        startDate: profile.startDate
    };

    Object.entries(values).forEach(([id, value]) => {
        el(id).value = value ?? "";
    });

    selects.forEach(id => {
        setSelectValue(id, profile[id]);
    });
}


// ==========================
// 4. Edit Mode
// ==========================

function editMode(editing) {
    fields.forEach(id => {
        el(id).readOnly = !editing;
    });

    // Email can never be edited
    el("email").readOnly = true;

    selects.forEach(id => {
        el(id).disabled = !editing;
    });

    el("editBtn").hidden = editing;
    el("saveBtn").hidden = !editing;
    el("cancelBtn").hidden = !editing;
    el("photoBtn").hidden = !editing;

    el("hrForm").classList.toggle("editing", editing);
}

editMode(false);


// ==========================
// 5. Load Logged-in HR
// ==========================

async function loadProfile() {
    if (!userId) {
        alert("Please log in first.");
        return;
    }

    try {
        const response = await fetch(jsonPath);

        if (!response.ok) {
            throw new Error("Failed to load employee data");
        }

        const data = await response.json();

        const employees = Array.isArray(data)
            ? data
            : data.employees;

        const employee = employees.find(
            user => user.id === userId && user.role === "HR"
        );

        if (!employee) {
            throw new Error("HR account not found");
        }

        const saved = getSavedProfiles()[userId] || {};

        profile = {
            ...employee,
            ...saved,
            email: employee.email,
            id: employee.id,
            role: employee.role
        };

        displayProfile();

    } catch (error) {
        console.error(error);
        alert("Unable to load HR profile.");
    }
}

loadProfile();


// ==========================
// 6. Edit & Cancel
// ==========================

el("editBtn").addEventListener("click", () => {
    if (!profile) return;

    newImage = null;
    el("imageInput").value = "";

    editMode(true);
});

el("cancelBtn").addEventListener("click", () => {
    newImage = null;
    el("imageInput").value = "";

    displayProfile();
    editMode(false);
});


// ==========================
// 7. Upload Image
// ==========================

el("imageInput").addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];

    if (
        !allowedTypes.includes(file.type) ||
        file.size > 1024 * 1024
    ) {
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


// ==========================
// 8. Save Changes
// ==========================

el("hrForm").addEventListener("submit", event => {
    event.preventDefault();

    if (!profile || imageLoading) return;

    const value = id => el(id).value.trim();
    const phoneRegex = /^\+?[\d\s-]{9,20}$/;

    // Validation
    if (
        !value("name") ||
        !value("position") ||
        !value("department") ||
        !value("startDate")
    ) {
        alert("Please fill all required fields.");
        return;
    }

    if (
        [value("phone"), value("contactPhone")].some(
            phone => phone && !phoneRegex.test(phone)
        )
    ) {
        alert("Invalid phone number.");
        return;
    }

    // Prepare changes
    const updated = {
        name: value("name"),
        phone: value("phone"),
        position: value("position"),
        department: value("department"),
        emergencyContactName: value("contactName"),
        emergencyContactPhone: value("contactPhone"),
        startDate: value("startDate"),
        employmentType: value("employmentType"),
        workLocation: value("workLocation"),
        accountState: value("accountState")
    };

    if (newImage) {
        updated.profileImage = newImage;
    }

    // Save only the edited information
    const saved = getSavedProfiles();

    saved[userId] = {
        ...saved[userId],
        ...updated
    };

    // Keep the original login email
    delete saved[userId].email;

    try {
        localStorage.setItem(
            "profileEdits",
            JSON.stringify(saved)
        );

        // Update current session
        const session = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        if (session && Number(session.id) === userId) {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...session,
                    ...updated
                })
            );
        }

        profile = {
            ...profile,
            ...updated
        };

        newImage = null;

        displayProfile();
        editMode(false);

        alert("Profile updated successfully!");

    } catch (error) {
        console.error(error);
        alert("Unable to save changes.");
    }
});
