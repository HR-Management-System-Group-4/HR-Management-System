let policies = JSON.parse(localStorage.getItem("policies")) || [];

displayPolicies(policies);


// عرض الـ Policies
function displayPolicies(policies) {

    let container = document.getElementById("policies");

    container.innerHTML = "";

    // فقط الـ Policies المنشورة تظهر للـEmployee
    let publishedPolicies = policies.filter(
        policy => policy.status === "PUBLISHED"
    );

    publishedPolicies.forEach(policy => {

        let div = document.createElement("div");

        div.className = "policy";

        div.innerHTML = `
            
            <div class="policy-header-row">

                <div>

                    <div class="policy-title">

                        <i class="fa-solid fa-file-lines"></i>

                        <span class="policy-name">
                            ${policy.title}
                        </span>

                    </div>

                    <div class="policy-date">
                        Category: ${policy.category}
                    </div>

                </div>

                <button class="policy-button">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>

            </div>


            <div class="policy-details">

                <p>
                    ${policy.description}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${policy.status}
                </p>

            </div>
        `;

        container.appendChild(div);


        let header = div.querySelector(".policy-header-row");

        header.addEventListener("click", function () {

            document.querySelectorAll(".policy").forEach(item => {

                if (item !== div) {
                    item.classList.remove("active");
                }

            });

            div.classList.toggle("active");

        });

    });
}


// تحديث الصفحة إذا الـHR عمل تعديل
window.addEventListener("storage", function (event) {

    if (event.key === "policies") {

        let policies = JSON.parse(event.newValue) || [];

        displayPolicies(policies);

    }

});