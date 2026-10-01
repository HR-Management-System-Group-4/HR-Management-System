const STORAGE_KEY = 'mysta_hr_tasks_v1';
const THEME_KEY = 'mysta_hr_tasks_theme';

// Mirrors active employees in the project's employee.json so this page also works offline.
const employees = [
  'Omar Khaled', 'Lina Hassan', 'Ahmad Saleh', 'Maya Nasser',
  'Yousef Ali', 'Khaled Ibrahim', 'Rana Mahmoud', 'Tareq Abdullah',
  'Noor Hamdan', 'Hala Yassin', 'Fadi Majed', 'Reem Adel'
];

const sampleTasks = [
  { id: 'sample-1', title: 'Q4 Performance Reviews', description: 'Complete performance evaluation forms and submit them to HR.', assignee: 'Omar Khaled', priority: 'High', dueDate: '2026-10-15', status: 'In Progress', solution: '', reviewNote: '' },
  { id: 'sample-2', title: 'Update Employee Handbook', description: 'Review and update the employee handbook policies.', assignee: 'Rana Mahmoud', priority: 'Medium', dueDate: '2026-10-20', status: 'Pending', solution: '', reviewNote: '' },
  { id: 'sample-3', title: 'Website Accessibility Audit', description: 'Check the new employee portal and document accessibility issues.', assignee: 'Maya Nasser', priority: 'High', dueDate: '2026-10-24', status: 'Submitted', solution: 'I reviewed the portal, documented keyboard navigation and contrast issues, and attached the audit notes to the project workspace.', reviewNote: '' },
  { id: 'sample-4', title: 'October Onboarding Checklist', description: 'Prepare the checklist for new starters and confirm all required documents.', assignee: 'Lina Hassan', priority: 'Low', dueDate: '2026-10-28', status: 'Completed', solution: 'The checklist and document list are ready for the next onboarding cycle.', reviewNote: 'Approved. Thank you!' }
];

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const readTasks = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : structuredClone(sampleTasks);
  } catch {
    return structuredClone(sampleTasks);
  }
};

let tasks = readTasks();
let activeFilter = 'All';
let viewingId = null;
let deletingId = null;
let toastTimer;

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    showToast('Could not save changes in this browser.');
    return false;
  }
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function formatDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return 'No date';
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function statusClass(status) {
  return ({ Pending: 'pending', 'In Progress': 'progress', Submitted: 'submitted', Completed: 'completed' })[status] || 'pending';
}

function render() {
  const count = (status) => tasks.filter((task) => task.status === status).length;
  $('#totalCount').textContent = tasks.length;
  $('#pendingCount').textContent = count('Pending');
  $('#progressCount').textContent = count('In Progress');
  $('#submittedCount').textContent = count('Submitted');
  $('#completedCount').textContent = count('Completed');
  $('#allBadge').textContent = tasks.length;
  $('#reviewBadge').textContent = count('Submitted') || '';

  const query = $('#taskSearch').value.trim().toLowerCase();
  const visible = tasks.filter((task) =>
    (activeFilter === 'All' || task.status === activeFilter) &&
    `${task.title} ${task.description} ${task.assignee}`.toLowerCase().includes(query)
  );

  $('#taskList').innerHTML = visible.length ? visible.map((task) => `
    <article class="task-card priority-${escapeHtml(task.priority.toLowerCase())}" data-id="${escapeHtml(task.id)}">
      <div class="task-body">
        <span class="task-symbol"><i class="bi bi-file-earmark-text" aria-hidden="true"></i></span>
        <div class="task-copy">
          <h3>${escapeHtml(task.title)}</h3>
          <p class="task-description">${escapeHtml(task.description)}</p>
          <div class="chips"><span class="chip priority-${escapeHtml(task.priority.toLowerCase())}"><i class="bi bi-bar-chart-fill" aria-hidden="true"></i>${escapeHtml(task.priority)}</span><span class="chip status-${statusClass(task.status)}"><i class="bi ${task.status === 'Completed' ? 'bi-check2-circle' : task.status === 'Submitted' ? 'bi-inbox' : task.status === 'In Progress' ? 'bi-arrow-repeat' : 'bi-clock'}" aria-hidden="true"></i>${escapeHtml(task.status)}</span></div>
          <div class="task-meta"><span><i class="bi bi-calendar3" aria-hidden="true"></i>${formatDate(task.dueDate)}</span><span class="divider" aria-hidden="true"></span><span><i class="bi bi-person" aria-hidden="true"></i>${escapeHtml(task.assignee)}</span></div>
        </div>
      </div>
      ${task.status === 'Submitted' ? '<span class="review-cue">READY FOR REVIEW</span>' : ''}
      <div class="task-actions">
        <button class="icon-action view" type="button" data-action="view" aria-label="View ${escapeHtml(task.title)}" title="View and review"><i class="bi bi-eye-fill" aria-hidden="true"></i></button>
        <button class="icon-action edit" type="button" data-action="edit" aria-label="Edit ${escapeHtml(task.title)}" title="Edit task"><i class="bi bi-pencil-fill" aria-hidden="true"></i></button>
        <button class="icon-action delete" type="button" data-action="delete" aria-label="Delete ${escapeHtml(task.title)}" title="Delete task"><i class="bi bi-trash3-fill" aria-hidden="true"></i></button>
      </div>
    </article>`).join('') : '<div class="empty-state"><i class="bi bi-inbox" aria-hidden="true"></i><h3>No tasks found</h3><p>Try another filter or create a new task.</p></div>';
}

function openForm(task) {
  $('#taskForm').reset();
  $('#taskId').value = task?.id || '';
  $('#formTitle').textContent = task ? 'Edit task' : 'Add a task';
  $('#saveTaskButton').textContent = task ? 'Save Changes' : 'Create Task';
  if (task) {
    $('#taskTitle').value = task.title;
    $('#taskDescription').value = task.description;
    $('#taskAssignee').value = task.assignee;
    $('#taskPriority').value = task.priority;
    $('#taskDueDate').value = task.dueDate;
    $('#taskStatus').value = task.status;
  } else {
    $('#taskPriority').value = 'Medium';
    $('#taskStatus').value = 'Pending';
  }
  $('#taskDialog').showModal();
  $('#taskTitle').focus();
}

function openView(task) {
  viewingId = task.id;
  $('#viewTitle').textContent = task.title;
  $('#viewContent').innerHTML = `
    <div class="detail-grid">
      <div class="detail-item"><b>Assigned to</b><span>${escapeHtml(task.assignee)}</span></div>
      <div class="detail-item"><b>Due date</b><span>${formatDate(task.dueDate)}</span></div>
      <div class="detail-item"><b>Priority</b><span>${escapeHtml(task.priority)}</span></div>
      <div class="detail-item"><b>Status</b><span>${escapeHtml(task.status)}</span></div>
    </div>
    <div class="detail-block"><h3>Description</h3><p>${escapeHtml(task.description)}</p></div>
    <div class="detail-block solution"><h3>Employee solution</h3><p>${task.solution ? escapeHtml(task.solution) : 'No solution has been submitted yet.'}</p></div>
    ${task.reviewNote ? `<div class="detail-block"><h3>HR feedback</h3><p>${escapeHtml(task.reviewNote)}</p></div>` : ''}`;
  $('#reviewFeedback').value = task.reviewNote || '';
  $('#reviewPanel').hidden = task.status !== 'Submitted';
  $('#viewDialog').showModal();
}

function updateReview(status) {
  const task = tasks.find((item) => item.id === viewingId);
  if (!task || task.status !== 'Submitted') return;
  if (status === 'Completed' && !task.solution?.trim()) {
    showToast('No employee solution to approve yet.');
    return;
  }
  const note = $('#reviewFeedback').value.trim();
  if (status === 'In Progress' && !note) {
    $('#reviewFeedback').setCustomValidity('Please add feedback before requesting changes.');
    $('#reviewFeedback').reportValidity();
    $('#reviewFeedback').focus();
    return;
  }
  task.status = status;
  task.reviewNote = note;
  if (!saveTasks()) return;
  $('#viewDialog').close();
  render();
  showToast(status === 'Completed' ? 'Solution approved. Task completed.' : 'Changes requested. Employee feedback saved.');
}

$('#taskAssignee').insertAdjacentHTML('beforeend', employees.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join(''));
$('#addTaskButton').addEventListener('click', () => openForm());
$('#taskSearch').addEventListener('input', render);
document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach((item) => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  render();
}));

$('#taskList').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const task = tasks.find((item) => item.id === button.closest('[data-id]').dataset.id);
  if (!task) return;
  if (button.dataset.action === 'view') openView(task);
  if (button.dataset.action === 'edit') openForm(task);
  if (button.dataset.action === 'delete') {
    deletingId = task.id;
    $('#deleteMessage').textContent = `“${task.title}” will be removed from the task list.`;
    $('#deleteDialog').showModal();
  }
});

$('#confirmDeleteButton').addEventListener('click', () => {
  if (!deletingId) return;
  const remaining = tasks.filter((item) => item.id !== deletingId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    tasks = remaining;
    deletingId = null;
    $('#deleteDialog').close();
    render();
    showToast('Task deleted.');
  } catch {
    showToast('Could not delete this task in this browser.');
  }
});

$('#taskForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const id = $('#taskId').value;
  const previous = tasks.find((item) => item.id === id);
  const data = {
    id: id || (crypto.randomUUID?.() || `task-${Date.now()}`),
    title: $('#taskTitle').value.trim(),
    description: $('#taskDescription').value.trim(),
    assignee: $('#taskAssignee').value,
    priority: $('#taskPriority').value,
    dueDate: $('#taskDueDate').value,
    status: $('#taskStatus').value,
    solution: previous?.solution || '',
    reviewNote: previous?.reviewNote || ''
  };
  if (!data.title || !data.description) { showToast('Please complete the title and description.'); return; }
  if (previous) Object.assign(previous, data);
  else tasks.unshift(data);
  if (!saveTasks()) return;
  $('#taskDialog').close();
  activeFilter = 'All';
  document.querySelector('[data-filter="All"]').click();
  $('#taskSearch').value = '';
  render();
  showToast(previous ? 'Task updated.' : 'Task created and assigned.');
});

document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => $(`#${button.dataset.close}`).close()));
document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
$('#reviewFeedback').addEventListener('input', () => $('#reviewFeedback').setCustomValidity(''));
$('#approveButton').addEventListener('click', () => updateReview('Completed'));
$('#requestChangesButton').addEventListener('click', () => updateReview('In Progress'));

try {
  if (localStorage.getItem(THEME_KEY) === 'dark') document.body.classList.add('dark');
} catch { /* Theme persistence is optional. */ }
$('#themeButton').addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  $('#themeButton').innerHTML = `<i class="bi bi-${dark ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
  $('#themeButton').setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch { /* Theme persistence is optional. */ }
});
if (document.body.classList.contains('dark')) {
  $('#themeButton').innerHTML = '<i class="bi bi-sun" aria-hidden="true"></i>';
  $('#themeButton').setAttribute('aria-label', 'Switch to light mode');
}

render();
