let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
let feedbackContainer = document.querySelector(".feedbacks");

feedbacks.forEach(feedback => {
    let feedbackCard = document.createElement("div");
    feedbackCard.classList.add("feedbackCard");

    feedbackCard.innerHTML = `
        <p class="feedbackCategory"></p>
        <p class="feedbackSubject"></p>
        <p class="feedbackMessage"></p>
        <span class="feedbackStatus">New</span>
        <button type="button" class="resolveFeedback">Mark resolved</button>
    `;

    feedbackCard.querySelector(".feedbackCategory").textContent = feedback.category;
    feedbackCard.querySelector(".feedbackSubject").textContent = feedback.subject;
    feedbackCard.querySelector(".feedbackMessage").textContent = feedback.message;

    feedbackContainer.appendChild(feedbackCard);


    let resolveButton = feedbackCard.querySelector(".resolveFeedback");
    let tag = feedbackCard.querySelector(".feedbackStatus");

    feedback.status = feedback.status || "New";

    tag.textContent = feedback.status;
    resolveButton.textContent =
        feedback.status === "Resolved" ? "Reopen" : "Mark resolved";

    resolveButton.addEventListener("click", function () {
        if (feedback.status === "New") {
            feedback.status = "Resolved";
            resolveButton.textContent = "Reopen";
        } else {
            feedback.status = "New";
            resolveButton.textContent = "Mark resolved";
        }

        tag.textContent = feedback.status;

        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        showAlert("success", feedback.status === "Reviewed" ? "Feedback Resolved!" : "Feedback Reopened!", feedback.status === "Reviewed" ? "The feedback has been marked as reviewed." : "The feedback has been marked as new.");
    });
});





