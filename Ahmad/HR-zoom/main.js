const storageKey = 'ahmadHrZoomDashboardV1';
const pageSize = 6;
const today = new Date();
const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const daysFromToday = (offset) => {
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const seedRequests = [
  ['Sarah Khan', 'EMP001', 'Computer Science', 'Career Guidance', 1, '10:30', 'I would like to discuss my career growth opportunities.', 'Pending', 'rose'],
  ['Ali Raza', 'EMP014', 'Business Administration', 'Performance Discussion', 2, '11:00', 'I want to discuss my recent performance and goals.', 'Pending', 'peach'],
  ['Ayesha Malik', 'EMP027', 'Design', 'Leave Related', 3, '14:00', 'I have a few questions regarding my upcoming leave.', 'Approved', 'rose'],
  ['Bilal Ahmed', 'EMP031', 'Computer Science', 'General Discussion', 4, '15:30', 'I would like to discuss some general queries.', 'Rejected', 'mint'],
  ['Fatima Noor', 'EMP036', 'Human Resources', 'Policy Clarification', 5, '10:00', 'I need clarification on the remote work policy.', 'Pending', 'rose'],
  ['Hassan Ali', 'EMP042', 'Engineering', 'Career Guidance', 6, '13:00', 'I would like to know about internal transfer opportunities.', 'Approved', 'peach'],
  ['Omar Faris', 'EMP044', 'Product', 'Project Update', 7, '09:00', 'I would like to discuss my project progress.', 'Pending', 'mint'],
  ['Maya Haddad', 'EMP048', 'Design', 'Portfolio Review', 8, '11:30', 'Can we review my design portfolio?', 'Approved', 'lilac'],
  ['Rami Nasser', 'EMP052', 'Engineering', 'Performance Discussion', 9, '14:30', 'I would like feedback on this quarter.', 'Approved', 'peach'],
  ['Lina Saad', 'EMP055', 'Finance', 'Leave Related', 10, '10:30', 'I have a question about annual leave.', 'Pending', 'rose'],
  ['Yousef Saleh', 'EMP059', 'Operations', 'General Discussion', 11, '12:00', 'I need to discuss a workplace issue.', 'Approved', 'mint'],
  ['Nour Khalil', 'EMP062', 'Marketing', 'Career Guidance', 12, '09:30', 'I would like guidance on my career path.', 'Approved', 'lilac'],
  ['Khaled Amin', 'EMP066', 'Sales', 'Policy Clarification', 13, '15:00', 'I need more information about the policy.', 'Rejected', 'peach'],
  ['Dana Mansour', 'EMP071', 'Human Resources', 'Team Planning', 14, '13:30', 'Let us discuss the team plan.', 'Approved', 'rose'],
  ['Hiba Qasem', 'EMP074', 'Finance', 'Performance Discussion', 15, '11:00', 'I would like to discuss development goals.', 'Pending', 'lilac'],
  ['Tariq Odeh', 'EMP079', 'Engineering', 'Project Update', 16, '10:00', 'I have an update on the project.', 'Approved', 'mint'],
  ['Salma Barakat', 'EMP082', 'Marketing', 'Career Guidance', 17, '14:00', 'I would like to explore new opportunities.', 'Approved', 'rose'],
  ['Fadi Darwish', 'EMP086', 'Operations', 'General Discussion', 18, '09:30', 'I have some questions for HR.', 'Rejected', 'peach']
].map(([name, employeeId, department, purpose, dayOffset, time, message, status, avatar], index) => ({
  id: index + 1, name, employeeId, department, purpose, date: daysFromToday(dayOffset), time, message, status, avatar
}));

const seedMeetings = [
  { id: 1, name: 'Sarah Khan', topic: 'Career Guidance', date: localToday, time: '10:30', duration: 30, status: 'Scheduled', avatar: 'rose', link: '' },
  { id: 2, name: 'Ayesha Malik', topic: 'Leave Discussion', date: localToday, time: '14:00', duration: 30, status: 'Scheduled', avatar: 'rose', link: '' },
  { id: 3, name: 'Hassan Ali', topic: 'General Discussion', date: localToday, time: '11:00', duration: 30, status: 'Upcoming', avatar: 'peach', link: '' },
  { id: 4, name: 'Maya Haddad', topic: 'Portfolio Review', date: localToday, time: '16:00', duration: 45, status: 'Upcoming', avatar: 'lilac', link: '' }
];

const seedActivity = [
  { action: 'approved', name: 'Ayesha Malik', at: Date.now() - 2 * 60 * 60 * 1000 },
  { action: 'scheduled', name: 'Hassan Ali', at: Date.now() - 4 * 60 * 60 * 1000 }
];

function loadState() {
  let result;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored && Array.isArray(stored.requests) && Array.isArray(stored.meetings) && Array.isArray(stored.activity)) result = stored;
  } catch (error) {
    console.warn('Saved meeting data could not be loaded.', error);
  }
  result ||= { requests: seedRequests, meetings: seedMeetings, activity: seedActivity };
  try {
    const employeeRequests = JSON.parse(localStorage.getItem('ahmadMeetingRequests') || '[]');
    for (const request of employeeRequests) {
      if (!request.sentAt || result.requests.some((item) => item.sourceSentAt === request.sentAt)) continue;
      const [clock, period] = (request.time || '10:00 AM').split(' ');
      const [hour, minute] = clock.split(':').map(Number);
      const time = `${String((hour % 12) + (period === 'PM' ? 12 : 0)).padStart(2, '0')}:${String(minute || 0).padStart(2, '0')}`;
      result.requests.unshift({
        id: Date.parse(request.sentAt), sourceSentAt: request.sentAt,
        name: request.name || 'Employee', employeeId: 'EMP-DEMO', department: 'Employee',
        purpose: request.purpose, date: request.date, time, message: request.message,
        status: request.status || 'Pending', avatar: 'peach'
      });
    }
    localStorage.setItem(storageKey, JSON.stringify(result));
  } catch (error) {
    console.warn('Employee meeting requests could not be loaded.', error);
  }
  return result;
}

const state = loadState();
let currentPage = 1;
let showAllMeetings = false;
let showAllActivity = false;
let toastTimer;

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
const avatar = (name, tone) => `<span class="avatar ${escapeHtml(tone || '')}" aria-hidden="true">${escapeHtml(initials(name))}</span>`;
const formatDate = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatTime = (value) => new Date(`2000-01-01T${value}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    const employeeRequests = JSON.parse(localStorage.getItem('ahmadMeetingRequests') || '[]');
    for (const request of employeeRequests) {
      const match = state.requests.find((item) => item.sourceSentAt === request.sentAt);
      if (match) request.status = match.status;
    }
    localStorage.setItem('ahmadMeetingRequests', JSON.stringify(employeeRequests));
  }
  catch (error) { console.warn('Meeting data could not be saved on this device.', error); }
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
}

function renderStats() {
  document.querySelector('#totalCount').textContent = state.requests.length;
  document.querySelector('#pendingCount').textContent = state.requests.filter((item) => item.status === 'Pending').length;
  document.querySelector('#approvedCount').textContent = state.requests.filter((item) => item.status === 'Approved').length;
  document.querySelector('#todayCount').textContent = state.meetings.filter((item) => item.date === localToday).length;
}

function filteredRequests() {
  const query = document.querySelector('#tableSearch').value.trim().toLowerCase();
  const status = document.querySelector('#statusFilter').value;
  const sort = document.querySelector('#dateSort').value;
  const filtered = state.requests.filter((item) => {
    const matchesText = `${item.name} ${item.department} ${item.purpose}`.toLowerCase().includes(query);
    return matchesText && (status === 'all' || item.status === status);
  });
  filtered.sort((a, b) => sort === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  return filtered;
}

function renderRequests() {
  const requests = filteredRequests();
  const pageCount = Math.max(1, Math.ceil(requests.length / pageSize));
  currentPage = Math.min(currentPage, pageCount);
  const first = (currentPage - 1) * pageSize;
  const page = requests.slice(first, first + pageSize);
  const body = document.querySelector('#requestsBody');
  body.innerHTML = page.length ? page.map((item) => {
    let actions = '';
    if (item.status === 'Pending') actions = `<button class="primary-action" data-action="accept" data-id="${item.id}">Accept</button><button class="reject-action" data-action="reject" data-id="${item.id}">Reject</button>`;
    else if (item.status === 'Approved') actions = `<button data-action="schedule" data-id="${item.id}">Schedule</button>`;
    else actions = `<button data-action="view" data-id="${item.id}">View</button>`;
    return `<tr><td><div class="employee-cell">${avatar(item.name, item.avatar)}<span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.employeeId)}</small></span></div></td><td>${escapeHtml(item.department)}</td><td>${escapeHtml(item.purpose)}</td><td>${formatDate(item.date)}</td><td>${formatTime(item.time)}</td><td><span class="truncate" title="${escapeHtml(item.message)}">${escapeHtml(item.message)}</span></td><td><span class="status-pill ${item.status.toLowerCase()}">${escapeHtml(item.status)}</span></td><td class="action-cell">${actions}<button class="more-action" data-action="view" data-id="${item.id}" aria-label="View ${escapeHtml(item.name)} request">${icon('more')}</button></td></tr>`;
  }).join('') : '<tr><td class="empty-row" colspan="8">No meeting requests match your search.</td></tr>';
  const start = requests.length ? first + 1 : 0;
  const end = Math.min(first + pageSize, requests.length);
  document.querySelector('#paginationSummary').textContent = `Showing ${start}–${end} of ${requests.length} requests`;
  const pagination = document.querySelector('#pagination');
  pagination.innerHTML = `<button type="button" data-page="${currentPage - 1}" aria-label="Previous page" ${currentPage === 1 ? 'disabled' : ''}>${icon('left')}</button>${Array.from({ length: pageCount }, (_, index) => `<button type="button" data-page="${index + 1}" class="${index + 1 === currentPage ? 'current' : ''}" aria-label="Page ${index + 1}" ${index + 1 === currentPage ? 'aria-current="page"' : ''}>${index + 1}</button>`).join('')}<button type="button" data-page="${currentPage + 1}" aria-label="Next page" ${currentPage === pageCount ? 'disabled' : ''}>${icon('right')}</button>`;
}

function renderEmployees() {
  const select = document.querySelector('#employeeSelect');
  const current = select.value;
  select.innerHTML = '<option value="">Select employee</option>' + state.requests.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('');
  select.value = current;
}

function renderMeetings() {
  const list = document.querySelector('#upcomingList');
  const meetings = [...state.meetings].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const shown = showAllMeetings ? meetings : meetings.slice(0, 3);
  list.innerHTML = shown.length ? shown.map((item) => `<div class="upcoming-item"><div class="upcoming-person">${avatar(item.name, item.avatar)}<span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.topic)}</small></span></div><div class="upcoming-time"><span>${item.date === localToday ? 'Today' : formatDate(item.date)}, ${formatTime(item.time)}</span><span>${icon('clock')} ${escapeHtml(item.duration)} min</span></div><span class="status-pill ${item.status === 'Scheduled' ? 'scheduled' : 'pending'}">${escapeHtml(item.status)}</span></div>`).join('') : '<p class="empty-mini">No upcoming meetings yet.</p>';
  document.querySelector('#viewAllMeetings').textContent = showAllMeetings ? 'Show Less' : 'View All';
}

function relativeTime(timestamp) {
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}

function renderActivity() {
  const list = document.querySelector('#activityList');
  const activities = [...state.activity].sort((a, b) => b.at - a.at);
  const shown = showAllActivity ? activities : activities.slice(0, 2);
  list.innerHTML = shown.length ? shown.map((item) => {
    const label = item.action === 'scheduled' ? 'scheduled a Zoom meeting with' : `${item.action} a meeting request from`;
    const symbol = item.action === 'scheduled' ? 'calendar' : 'check';
    return `<div class="activity-item"><span class="activity-symbol ${escapeHtml(item.action)}">${icon(symbol)}</span><div><p>You <strong>${escapeHtml(label)}</strong> <strong>${escapeHtml(item.name)}</strong></p><small>${relativeTime(item.at)}</small></div></div>`;
  }).join('') : '<p class="empty-mini">No recent activity.</p>';
  document.querySelector('#viewAllActivity').textContent = showAllActivity ? 'Show Less' : 'View All';
}

function renderAll() { renderStats(); renderRequests(); renderEmployees(); renderMeetings(); renderActivity(); }

document.querySelector('#requestsBody').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const item = state.requests.find((request) => request.id === Number(button.dataset.id));
  if (!item) return;
  const action = button.dataset.action;
  if (action === 'view') { showToast(`${item.name}: ${item.message}`); return; }
  if (action === 'schedule') {
    document.querySelector('#employeeSelect').value = String(item.id);
    document.querySelector('#meetingTopic').value = item.purpose;
    document.querySelector('#meetingDate').value = item.date;
    document.querySelector('#meetingTime').value = item.time;
    document.querySelector('#scheduleForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector('#meetingTopic').focus();
    return;
  }
  item.status = action === 'accept' ? 'Approved' : 'Rejected';
  state.activity.unshift({ action: action === 'accept' ? 'approved' : 'rejected', name: item.name, at: Date.now() });
  saveState(); renderAll(); showToast(`${item.name}'s request ${item.status.toLowerCase()}.`);
});

document.querySelector('#pagination').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-page]');
  if (!button || button.disabled) return;
  currentPage = Number(button.dataset.page);
  renderRequests();
});

for (const id of ['tableSearch', 'statusFilter', 'dateSort']) {
  document.getElementById(id).addEventListener(id === 'tableSearch' ? 'input' : 'change', () => { currentPage = 1; renderRequests(); });
}

document.querySelector('#globalSearch').addEventListener('input', (event) => {
  document.querySelector('#tableSearch').value = event.target.value;
  currentPage = 1;
  renderRequests();
});

document.querySelector('#scheduleForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const employee = state.requests.find((item) => item.id === Number(document.querySelector('#employeeSelect').value));
  const date = document.querySelector('#meetingDate').value;
  const time = document.querySelector('#meetingTime').value;
  const feedback = document.querySelector('#scheduleFeedback');
  if (!employee || !date || !time) return;
  if (date < localToday) { feedback.textContent = 'Choose today or a future date.'; return; }
  const meeting = {
    id: Date.now(), name: employee.name, topic: document.querySelector('#meetingTopic').value.trim(), date, time,
    duration: Number(document.querySelector('#meetingDuration').value), status: 'Scheduled', avatar: employee.avatar,
    link: document.querySelector('#zoomLink').value.trim(), notes: document.querySelector('#hrNotes').value.trim()
  };
  if (!meeting.topic) { feedback.textContent = 'Add a meeting topic.'; return; }
  state.meetings.push(meeting);
  employee.status = 'Scheduled';
  state.activity.unshift({ action: 'scheduled', name: employee.name, at: Date.now() });
  saveState(); renderAll();
  event.target.reset();
  feedback.textContent = 'Meeting saved on this device. Share the Zoom link with the employee separately.';
  showToast(`Meeting scheduled with ${employee.name}.`);
});

document.querySelector('#viewAllMeetings').addEventListener('click', () => { showAllMeetings = !showAllMeetings; renderMeetings(); });
document.querySelector('#viewAllActivity').addEventListener('click', () => { showAllActivity = !showAllActivity; renderActivity(); });
document.querySelector('.notification-button').addEventListener('click', () => showToast('No new notifications.'));
document.querySelector('.profile-button').addEventListener('click', () => showToast('HR Admin'));
document.querySelectorAll('[data-placeholder]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); showToast('This section is coming soon.'); }));

const menuButton = document.querySelector('#menuButton');
menuButton.addEventListener('click', () => {
  const open = document.querySelector('#sidebar').classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
document.addEventListener('click', (event) => {
  if (window.innerWidth > 870 || !document.querySelector('#sidebar').classList.contains('open')) return;
  if (event.target.closest('#sidebar, #menuButton')) return;
  document.querySelector('#sidebar').classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
});

document.querySelector('#meetingDate').min = localToday;
renderAll();
