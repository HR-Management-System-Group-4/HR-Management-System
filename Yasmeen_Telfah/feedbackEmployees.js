let feedbackCategory = document.querySelector("#feedbackCategory");
let feedback = document.querySelector("#feedbackMessage");
let subject = document.querySelector("#feedbackSubject")
let submit = document.querySelector("#submitFeedback");


submit.form.addEventListener("submit", function(event){
    event.preventDefault();

    let newFeedback = {
        category: feedbackCategory.value,
        subject: subject.value,
        message: feedback.value
    }

    console.log(newFeedback);

    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.push(newFeedback);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));


})


