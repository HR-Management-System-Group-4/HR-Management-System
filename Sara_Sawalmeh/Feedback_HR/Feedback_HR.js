const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
const feedbackContainer = document.querySelector('.feedbacks');

function updateCounts() {
    document.querySelector('#newCount').textContent = feedbacks.filter(item => (item.status || 'New') === 'New').length;
    document.querySelector('#reviewedCount').textContent = feedbacks.filter(item => item.status === 'Reviewed').length;
}

feedbacks.forEach(feedback => {
    feedback.status = feedback.status || 'New';
    const row = document.createElement('tr');
    for (const value of [feedback.employee || 'Employee', feedback.subject, feedback.message, feedback.date || 'Today']) {
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
    resolveButton.setAttribute('aria-label', 'Toggle feedback review status');
    resolveButton.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
    resolveButton.addEventListener('click', () => {
        feedback.status = feedback.status === 'New' ? 'Reviewed' : 'New';
        statusTag.textContent = feedback.status;
        statusTag.className = `status-badge ${feedback.status.toLowerCase()}`;
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        updateCounts();
    });
    actionCell.append(resolveButton);
    row.append(actionCell);
    feedbackContainer.append(row);
});

updateCounts();
