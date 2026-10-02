const policiesGrid = document.getElementById("policiesGrid");

const recordsCount = document.getElementById("recordsCount");

const searchInput = document.getElementById("searchInput");

const newPolicyBtn = document.getElementById("newPolicyBtn");

const policyModal = document.getElementById("policyModal");

const closeModal = document.getElementById("closeModal");

const cancelBtn = document.getElementById("cancelBtn");

const saveBtn = document.getElementById("saveBtn");

const modalTitle = document.getElementById("modalTitle");

const policyTitle = document.getElementById("policyTitle");

const policyCategory = document.getElementById("policyCategory");

const policyStatus = document.getElementById("policyStatus");

const policyDescription = document.getElementById("policyDescription");


let policies = [];

let editIndex = null;


/* =========================
   GET DATA FROM JSON
========================= */

fetch("policies.json")
    .then(response => response.json())
    .then(data => {

        policies = data;

        /*
        إذا كان عندنا بيانات معدلة في localStorage
        نستخدمها بدل JSON
        */

        const savedPolicies = localStorage.getItem("policies");

        if (savedPolicies) {
            policies = JSON.parse(savedPolicies);
        }

        displayPolicies();

    })
    .catch(error => {

        console.log("Error loading policies:", error);

    });


/* =========================
   DISPLAY POLICIES
========================= */

function displayPolicies() {

    policiesGrid.innerHTML = "";

    policies.forEach((policy, index) => {

        const card = document.createElement("div");

        card.className = "policy-card";


        card.innerHTML = `

            <div class="card-header-row">

                <h3>${policy.title}</h3>

                <span class="status-badge ${policy.status.toLowerCase()}">
                    ${policy.status}
                </span>

            </div>


            <span class="category-name">
                ${policy.category}
            </span>


            <p class="policy-desc">
                ${policy.description}
            </p>


            <div class="card-footer">
                <button class="edit-link" onclick="editPolicy(${index})"> Edit</button>
                <button class="delete-link" onclick="deletePolicy(${index})">Delete</button>
            </div>

        `;
        policiesGrid.append(card);
    });
    recordsCount.textContent =`${policies.length} RECORDS`;
}

newPolicyBtn.addEventListener("click", function () {
    editIndex = null;
    modalTitle.textContent = "New Policy";
    policyTitle.value = "";
    policyCategory.value = "";
    policyStatus.value = "PUBLISHED";
    policyDescription.value = "";
    policyModal.classList.add("show");
});
function editPolicy(index) {
    editIndex = index;
    const policy = policies[index];
    modalTitle.textContent = "Edit Policy";
    policyTitle.value = policy.title;
    policyCategory.value = policy.category;
    policyStatus.value = policy.status;
    policyDescription.value = policy.description;
    policyModal.classList.add("show");
}
saveBtn.addEventListener("click", function () {
    const title = policyTitle.value.trim();
    const category = policyCategory.value.trim();
    const status = policyStatus.value;
    const description = policyDescription.value.trim();
    if (title === "" || category === "" || description === "") {
        alert("Please fill in all fields.");
        return;
    }
    const newPolicy = {
        title: title,
        category: category,
        status: status,
        description: description
    };
    if (editIndex === null) {
        policies.push(newPolicy);
    } else {
        policies[editIndex] = newPolicy;
    }
    localStorage.setItem("policies",JSON.stringify(policies));
    displayPolicies();
    closePolicyModal();
});

function deletePolicy(index) {
    const confirmDelete =
        confirm("Are you sure you want to delete this policy?");
    if (confirmDelete) {
        policies.splice(index, 1);
        localStorage.setItem("policies", JSON.stringify(policies));
        displayPolicies();
    }
}
function closePolicyModal() {
    policyModal.classList.remove("show");
}
closeModal.addEventListener("click",closePolicyModal);
cancelBtn.addEventListener("click",closePolicyModal);
