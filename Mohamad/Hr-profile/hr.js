
// ==========================
// 1. Settings
// ==========================

const userId = Number(localStorage.getItem("loggedInUserId"));
const jsonPath = "../../employee.json";

const el = id => document.getElementById(id);

const fields = [
    "name",
    "phone",
    "position",
    "department",
    "contactName",
    "contactPhone",
    "startDate"
];

const selects = [
    "employmentType",
    "workLocation",
    "accountState"
];

let profile = null;
let newImage = null;
let imageLoading = false;


// ==========================
// 2. Unified Messages
// ==========================

const showMessage = showAlert;


// ==========================
// 3. Helper Functions
// ==========================

function getSavedProfiles() {
    try {
        return JSON.parse(
            localStorage.getItem("profileEdits")
        ) || {};
    } catch {
        return {};
    }
}

function getImagePath(path) {
    if (!path) {
        return "../../Json-Images/images.jpg";
    }

    if (
        path.startsWith("data:") ||
        path.startsWith("blob:") ||
        path.startsWith("http")
    ) {
        return path;
    }

    return "../../" + path;
}

function setSelectValue(id, value) {
    const select = el(id);
    const selectedValue = value || "";

    if (
        selectedValue &&
        !Array.from(select.options).some(
            option => option.value === selectedValue
        )
    ) {
        select.add(
            new Option(selectedValue, selectedValue)
        );
    }

    select.value = selectedValue;
}


// ==========================
// 4. Display HR Profile
// ==========================

function displayProfile() {
    if (!profile) return;

    const id = "HR" + String(profile.id).padStart(3, "0");
    const image = getImagePath(profile.profileImage);

    // Header
    el("headerName").textContent = profile.name || "";
    el("headerJob").textContent =
        `${profile.position || ""} • ${profile.department || ""}`;

    el("headerId").textContent = id;

    const status = profile.accountState || "Not provided";
    const statusBadge = el("headerStatus");

    statusBadge.textContent = status;
    statusBadge.classList.toggle(
        "is-active",
        status.toLowerCase() === "active"
    );

    el("employeeId").textContent = id;

    el("displayDate").textContent =
        profile.startDate || "Not provided";

    // Profile image
    el("profileImage").src = image;

    // Optional elements kept for compatibility
    if (el("topName")) {
        el("topName").textContent = profile.name || "";
    }

    if (el("topImage")) {
        el("topImage").src = image;
    }

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
// 5. Edit Mode
// ==========================

function editMode(editing) {
    fields.forEach(id => {
        el(id).readOnly = !editing;
    });

    // Email always stays read-only
    el("email").readOnly = true;

    selects.forEach(id => {
        el(id).disabled = !editing;
    });

    el("editBtn").hidden = editing;
    el("saveBtn").hidden = !editing;
    el("cancelBtn").hidden = !editing;
    el("photoBtn").hidden = !editing;

    el("hrForm").classList.toggle(
        "editing",
        editing
    );
}

editMode(false);


// ==========================
// 6. Load Logged-in HR
// ==========================

async function loadProfile() {
    if (!userId) {
        await showMessage(
            "warning",
            "Login Required",
            "Please log in first."
        );

        el("editBtn").disabled = true;
        return;
    }

    try {
        const response = await fetch(jsonPath);

        if (!response.ok) {
            throw new Error(
                "Failed to load employee data"
            );
        }

        const data = await response.json();

        const employees = Array.isArray(data)
            ? data
            : data.employees;

        const employee = employees.find(
            user => user.id === userId && user.role === "HR"
        );

        if (!employee) {
            throw new Error(
                "HR account not found"
            );
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

        await showMessage(
            "error",
            "Loading Failed",
            "Unable to load HR profile."
        );

        el("editBtn").disabled = true;
    }
}

loadProfile();


// ==========================
// 7. Edit & Cancel
// ==========================

el("editBtn").addEventListener("click", () => {
    if (!profile) return;

    newImage = null;
    el("imageInput").value = "";

    editMode(true);
});

el("cancelBtn").addEventListener("click", () => {
    if (imageLoading) return;

    newImage = null;
    el("imageInput").value = "";

    displayProfile();
    editMode(false);
});


// ==========================
// 8. Upload Image
// ==========================

el("imageInput").addEventListener(
    "change",
    async function () {

        const file = this.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];

        if (!allowedTypes.includes(file.type)) {
            this.value = "";
            newImage = null;

            el("profileImage").src =
                getImagePath(profile.profileImage);

            await showMessage(
                "error",
                "Invalid Image",
                "Please choose a JPG or PNG image."
            );

            return;
        }

        if (file.size > 1024 * 1024) {
            this.value = "";
            newImage = null;

            el("profileImage").src =
                getImagePath(profile.profileImage);

            await showMessage(
                "error",
                "Image Too Large",
                "Maximum image size is 1MB."
            );

            return;
        }

        const reader = new FileReader();

        imageLoading = true;
        el("saveBtn").disabled = true;
        el("cancelBtn").disabled = true;
        el("imageInput").disabled = true;

        reader.onload = () => {
            newImage = reader.result;
            el("profileImage").src = newImage;

            imageLoading = false;
            el("saveBtn").disabled = false;
            el("cancelBtn").disabled = false;
            el("imageInput").disabled = false;
        };

        reader.onerror = async () => {
            newImage = null;
            this.value = "";

            el("profileImage").src =
                getImagePath(profile.profileImage);

            imageLoading = false;
            el("saveBtn").disabled = false;
            el("cancelBtn").disabled = false;
            el("imageInput").disabled = false;

            await showMessage(
                "error",
                "Upload Failed",
                "Unable to read the selected image."
            );
        };

        reader.readAsDataURL(file);
    }
);


// ==========================
// 9. Form Validation
// ==========================

async function validateForm() {
    const value = id => el(id).value.trim();

    const requiredFields = [
        ["name", "Full Name"],
        ["position", "Position"],
        ["department", "Department"],
        ["startDate", "Join Date"]
    ];

    for (const [id, label] of requiredFields) {
        if (!value(id)) {
            await showMessage(
                "error",
                `${label} Required`,
                `Please enter ${label.toLowerCase()}.`
            );

            el(id).focus();
            return false;
        }
    }

    // Accepts optional +, digits, spaces and hyphens
    const phoneRegex = /^\+?[\d\s-]{9,20}$/;

    const phoneFields = [
        ["phone", "Phone Number"],
        ["contactPhone", "Emergency Contact Number"]
    ];

    for (const [id, label] of phoneFields) {
        if (value(id) && !phoneRegex.test(value(id))) {
            await showMessage(
                "error",
                `Invalid ${label}`,
                `Please enter a valid ${label.toLowerCase()}.`
            );

            el(id).focus();
            return false;
        }
    }

    return true;
}


// ==========================
// 10. Save Changes
// ==========================

el("hrForm").addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        if (!profile || imageLoading) return;

        const saveBtn = el("saveBtn");
        saveBtn.disabled = true;

        try {
            const valid = await validateForm();

            if (!valid) return;

            const value = id => el(id).value.trim();

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

            // Save only edited information
            const saved = getSavedProfiles();

            const previous = saved[userId] || {};

            saved[userId] = {
                ...previous,
                ...updated
            };

            // Login email must remain unchanged
            delete saved[userId].email;

            localStorage.setItem(
                "profileEdits",
                JSON.stringify(saved)
            );

            // Update current session if available
            try {
                const session = JSON.parse(
                    localStorage.getItem("user") || "null"
                );

                if (
                    session &&
                    Number(session.id) === userId
                ) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...session,
                            ...updated
                        })
                    );
                }
            } catch (sessionError) {
                console.error(
                    "Session update failed:",
                    sessionError
                );
            }

            profile = {
                ...profile,
                ...updated
            };

            newImage = null;
            el("imageInput").value = "";

            displayProfile();
            editMode(false);

            await showMessage(
                "success",
                "Changes Saved!",
                "Your HR profile has been updated successfully."
            );

        } catch (error) {
            console.error(error);

            await showMessage(
                "error",
                "Save Failed",
                "Unable to save changes. Try a smaller image."
            );

        } finally {
            saveBtn.disabled = false;
        }
    }
);
