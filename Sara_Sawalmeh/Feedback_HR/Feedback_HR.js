const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
const feedbackContainer = document.querySelector('.feedbacks');

function updateCounts() {
    document.querySelector('#newCount').textContent = feedbacks.filter(item => (item.status || 'New') === 'New').length;
    document.querySelector('#reviewedCount').textContent = feedbacks.filter(item => item.status === 'Reviewed').length;
}

feedbacks.forEach(feedback => {
    feedback.status = feedback.status || 'New';
    const row = document.createElement('tr');
    row.className = feedback.status.toLowerCase();
    for (const value of [feedback.employee || feedback.name, feedback.subject, feedback.message, feedback.date || 'Today']) {
        const cell = document.createElement('td');
        cell.textContent = value || '';
        row.append(cell);
    }
     
    const statusCell = document.createElement('td');
    const statusTag = document.createElement('span');
    statusTag.className = `status-badge ${feedback.status.toLowerCase()}`;
    statusTag.textContent = feedback.status;
    statusCell.append(statusTag);
    row.append(statusCell);

 const actionCell = document.createElement('td');

const resolveButton = document.createElement('button');
resolveButton.type = 'button';
resolveButton.className = 'resolveFeedback';
resolveButton.textContent = 'Resolve';

resolveButton.addEventListener('click', () => {

    feedback.status = feedback.status === 'New' ? 'Reviewed' : 'New';

    statusTag.textContent = feedback.status;
    statusTag.className = `status-badge ${feedback.status.toLowerCase()}`;
    row.className = feedback.status.toLowerCase();

    resolveButton.textContent =feedback.status === 'Reviewed' ? '✓ Resolved' : 'Resolve';

    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    showAlert('success', feedback.status === 'Reviewed' ? 'Feedback Resolved!' : 'Feedback Reopened!', feedback.status === 'Reviewed' ? 'The feedback has been marked as reviewed.' : 'The feedback has been marked as new.');
    updateCounts();
});

actionCell.append(resolveButton);
row.append(actionCell);
feedbackContainer.append(row);
});

updateCounts();
let All=document.getElementById("All");
let New=document.getElementById("New");
let Reviewed=document.getElementById("Reviewed");
let feedbackRows =document.getElementsByClassName("feedbacks")[0].getElementsByTagName("tr");
All.classList.add("active");
All.addEventListener("click",function(){
All.classList.add("active");
New.classList.remove("active");
Reviewed.classList.remove("active");
for (let i = 0; i < feedbackRows.length; i++) {
        feedbackRows[i].style.display = "table-row";
    }
});
New.addEventListener("click",function(){
All.classList.remove("active");
New.classList.add("active");
Reviewed.classList.remove("active");
for (let i = 0; i < feedbackRows.length; i++) {
        let isNew =feedbackRows[i].classList.contains("new");
        if (isNew) {
            feedbackRows[i].style.display = "table-row";
        } else {
            feedbackRows[i].style.display = "none";
        }
    }
});
Reviewed.addEventListener("click",function(){
All.classList.remove("active");
New.classList.remove("active");
Reviewed.classList.add("active");
 for (let i = 0; i < feedbackRows.length; i++) {
        let isReviewed =feedbackRows[i].classList.contains("reviewed");
        if (isReviewed) {
            feedbackRows[i].style.display = "table-row";
        } else {
            feedbackRows[i].style.display = "none";
        }
    }
});
