fetch("employee.json")
    .then(response => response.json())
    .then(data => {

        let policies = data.policies;
        let container = document.getElementById("policies");

        policies.forEach(policy => {

            let div = document.createElement("div");

            div.className = "policy";

            div.innerHTML = `
                
                <div class="policy-header-row">

                    <div>

                        <div class="policy-title">

                            <i class="${policy.icon}"></i>

                            <span class="policy-name">
                                ${policy.name}
                            </span>

                            <span class="category">
                                ${policy.category}
                            </span>

                        </div>

                        <div class="policy-date">
                            Last updated: ${policy.lastUpdated}
                        </div>

                    </div>

                    <button class="policy-button">
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>

                </div>


                <div class="policy-details">

                    <p>
                        ${policy.shortDescription}
                    </p>

                    ${showDetails(policy.details)}

                </div>
            `;

            container.appendChild(div);

            let header = div.querySelector(".policy-header-row");

            header.addEventListener("click", function () {

                // إغلاق باقي الـ Policies
                document.querySelectorAll(".policy").forEach(item => {
                    if (item !== div) {
                        item.classList.remove("active");
                    }
                });

                // فتح أو إغلاق الحالية
                div.classList.toggle("active");

            });

        });

    })
    .catch(error => {
        console.log("Error:", error);
    });


function showDetails(details) {

    let result = "";

    for (let key in details) {

        result += `
            <p>
                <strong>${key}:</strong>
                ${details[key]}
            </p>
        `;
    }

    return result;
}