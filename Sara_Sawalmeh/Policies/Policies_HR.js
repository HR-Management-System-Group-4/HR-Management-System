const policiesGrid = document.getElementById("policiesGrid");
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
fetch("../../employee.json")
    .then(response => response.json())
    .then(data => {
        const savedPolicies = localStorage.getItem("policies");
        if (savedPolicies) {
            policies = JSON.parse(savedPolicies);
        } else {
            policies = data.policies.map(function(policy) {
                return {
                    title: policy.name,
                    category: policy.category,
                    status: "PUBLISHED",
                    description: policy.shortDescription
                };
            });
        }
        displayPolicies();
    })
    .catch(error => {
        console.log("Error loading policies:", error);
    });

function displayPolicies() {
    policiesGrid.innerHTML = "";
    policies.forEach(function(policy, index) {
        const card = document.createElement("div");
        card.className = "policy-card";
        card.innerHTML = `
            <div class="card-header-row">
                <h3>${policy.title}</h3>
                <span class="status-badge ${policy.status.toLowerCase()}">  ${policy.status}</span>
            </div>
            <span class="category-name"> ${policy.category}</span>
            <p class="policy-desc">  ${policy.description} </p>
            <div class="card-footer">
                <button  class="edit-link" onclick="editPolicy (${index}) ">Edit</button>
                <button class="delete-link" onclick="deletePolicy(${index})">  Delete </button>
            </div>
        `;
        policiesGrid.append(card);
    });
}

newPolicyBtn.addEventListener("click", function() {
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

saveBtn.addEventListener("click", function() {
    const title = policyTitle.value.trim();
    const category = policyCategory.value;
    const status = policyStatus.value;
    const description = policyDescription.value.trim();

    if ( title === "" ||  category === "" || description === "") {
        showAlert("error","Error!","Please fill in all fields." );
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
        localStorage.setItem("policies",JSON.stringify(policies)
        );
        displayPolicies();
        showAlert("success","Policy Added!", "The policy has been added successfully.").then(function() {
            closePolicyModal();
        });
    }
    else {
        policies[editIndex] = newPolicy;
        localStorage.setItem("policies", JSON.stringify(policies));
        displayPolicies();
        showAlert("success", "Policy Updated!","The policy has been updated successfully." ).then(function() {
            closePolicyModal();
        });
    }
});

function deletePolicy(index) {
    const confirmDelete = confirm("Are you sure you want to delete this policy?");
    if (confirmDelete) {
        policies.splice(index, 1);
        localStorage.setItem("policies",JSON.stringify(policies) );
        displayPolicies();
    }
}

function closePolicyModal() {
    policyModal.classList.remove("show");
    editIndex = null;
}
closeModal.addEventListener("click", function() {
    closePolicyModal();
});
cancelBtn.addEventListener("click", function() {
    closePolicyModal();
});

function showAlert(type, title, message) {
    return Swal.fire({
        icon: type,
        title: title,
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: "#232743",
        customClass: {
            popup: "mysta-popup"
        }
    });

}