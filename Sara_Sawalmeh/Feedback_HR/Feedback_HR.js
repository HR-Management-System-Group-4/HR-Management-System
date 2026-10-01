let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
let feedbackContainer = document.querySelector(".feedbacks");
feedbacks.forEach(feedback => {
    let row = document.createElement("tr");
    feedback.status = feedback.status || "New";
    row.innerHTML = `
        <td><strong>${feedback.employee || "Employee"}</strong></td>
        <td>${feedback.subject}</td>
        <td>${feedback.message}</td>
        <td>${feedback.date || "Today"}</td>
        <td><span class="status-badge ${feedback.status.toLowerCase()}">${feedback.status}</span></td>
        <td><i class="fa-solid fa-check resolveFeedback"></i></td>
    `;

    feedbackContainer.appendChild(row);

    let resolveButton = row.querySelector(".resolveFeedback");
    let statusTag = row.querySelector(".status-badge");
    resolveButton.addEventListener("click", function () {
        if (feedback.status === "New") {
            feedback.status = "Reviewed";
            statusTag.textContent = "Reviewed";
            statusTag.className = "status-badge reviewed";
        } else {
            feedback.status = "New";
            statusTag.textContent = "New";
            statusTag.className = "status-badge new";
        }

        localStorage.setItem("feedbacks",JSON.stringify(feedbacks));

    });

});
document.addEventListener("DOMContentLoaded",function(){
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    let newCount = 0;
    let reviewedCount = 0;

    feedbacks.forEach(function (feedback) {

        if (feedback.status === "New") {
            newCount++;
        }

        if (feedback.status === "Reviewed") {
            reviewedCount++;
        }

    });

    document.getElementById("newCount").textContent = newCount;
    document.getElementById("reviewedCount").textContent = reviewedCount;
});