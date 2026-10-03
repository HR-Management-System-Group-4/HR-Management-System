let feedbackCategory = document.querySelector("#feedbackCategory");
let feedback = document.querySelector("#feedbackMessage");
let subject = document.querySelector("#feedbackSubject")
let submit = document.querySelector("#submitFeedback");


submit.form.addEventListener("submit", function(event){
    event.preventDefault();
    let anonymous = document.querySelector("#anonymousFeedback");
    if(anonymous.checked){
        let newFeedback = {
            name: "Anonymous",
            category: feedbackCategory.value,
            subject: subject.value,
            message: feedback.value
        }
        let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
        feedbacks.push(newFeedback);
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        document.querySelector("#feedbackResult").textContent = "Feedback submitted anonymously";
        event.target.reset();
    }
    else{
        let user = JSON.parse(localStorage.getItem("user"));
        let newFeedback = {
                name: user.name,
                category: feedbackCategory.value,
                subject: subject.value,
                message: feedback.value
            }

            let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
            feedbacks.push(newFeedback);
            localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
            document.querySelector("#feedbackResult").textContent = "Feedback submitted. HR can now see it in the inbox.";
            event.target.reset();
            }


})

