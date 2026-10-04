const feedbackForm = document.querySelector("#submitFeedback").form;

feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const anonymous = document.querySelector("#anonymousFeedback").checked;
    let user;
    if (!anonymous) {
        try {
            user = JSON.parse(localStorage.getItem("user"));
        } catch {
            user = null;
        }
        if (!user?.name) {
            showAlert("error", "Submission Failed", "Please sign in before submitting feedback with your name.");
            return;
        }
    }

    const newFeedback = {
        name: anonymous ? "Anonymous" : user.name,
        category: document.querySelector("#feedbackCategory").value,
        subject: document.querySelector("#feedbackSubject").value,
        message: document.querySelector("#feedbackMessage").value
    };

    try {
        const feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
        if (!Array.isArray(feedbacks)) throw new Error("Invalid feedback data");
        feedbacks.push(newFeedback);
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    } catch (error) {
        console.error("Feedback could not be saved:", error);
        showAlert("error", "Submission Failed", "Your feedback could not be saved. Please try again.");
        return;
    }

    event.target.reset();
    showAlert("success", "Feedback Submitted!", anonymous
        ? "Your anonymous feedback has been submitted successfully."
        : "Your feedback has been submitted to HR successfully.");
});
