const storageKey = 'ahmadHrZoomDashboardV1';
try { document.body.classList.toggle('dark-mode', localStorage.getItem('mysta_theme') === 'dark'); }
catch (error) { console.warn('Theme preference could not be loaded.', error); }
const pageSize = 6;

function loadState() {
  let result;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored && Array.isArray(stored.requests) && Array.isArray(stored.meetings) && Array.isArray(stored.activity)) result = stored;
  } catch (error) {
    console.warn('Saved meeting data could not be loaded.', error);
  }
  result ||= { requests: [], meetings: [], activity: [] };
  try {
    const employeeRequests = JSON.parse(localStorage.getItem('ahmadMeetingRequests') || '[]');
    for (const request of employeeRequests) {
      if (!request.sentAt || result.requests.some((item) => item.sourceSentAt === request.sentAt)) continue;
      result.requests.unshift({
        id: request.id || request.sentAt, sourceSentAt: request.sentAt,
        name: request.name || 'Employee', employeeId: 'Employee request', department: 'Employee',
        email: request.email || '', purpose: request.purpose, message: request.message, sentAt: request.sentAt,
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

const zoomUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'zoom.us' || url.hostname.endsWith('.zoom.us')) && /^\/(?:j\/\d+|my\/[a-z0-9._-]+|wc\/join\/\d+)\/?$/i.test(url.pathname);
  } catch { return false; }
};
const jitsiUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'meet.jit.si' && /^\/[a-z0-9_-]{16,100}\/?$/i.test(url.pathname);
  } catch { return false; }
};
const joinable = (meeting) => zoomUrl(meeting.link) || jitsiUrl(meeting.link);
const roomHref = (meeting, role = 'hr') => jitsiUrl(meeting.link)
  ? `../Meeting-Zoom/room.html?id=${encodeURIComponent(meeting.id)}&role=${role}`
  : meeting.link;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
const avatar = (name, tone) => `<span class="avatar ${escapeHtml(tone || '')}" aria-hidden="true">${escapeHtml(initials(name))}</span>`;
const formatDate = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatTime = (value) => new Date(`2000-01-01T${value}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const meetingWhen = (meeting) => meeting.whenLabel || (meeting.date && meeting.time ? `${formatDate(meeting.date)}, ${formatTime(meeting.time)}` : 'See Zoom for time');

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    const employeeRequests = JSON.parse(localStorage.getItem('ahmadMeetingRequests') || '[]');
    for (const request of employeeRequests) {
      const match = state.requests.find((item) => item.sourceSentAt === request.sentAt);
      if (match) {
        request.status = match.status;
        const meeting = state.meetings.find((item) => item.requestId === match.id);
        request.meeting = meeting ? { id: meeting.id, date: meeting.date, time: meeting.time, duration: meeting.duration, whenLabel: meeting.whenLabel, topic: meeting.topic, link: meeting.link, notes: meeting.notes, provider: meeting.provider } : null;
      }
    }
    localStorage.setItem('ahmadMeetingRequests', JSON.stringify(employeeRequests));
    return true;
  }
  catch (error) {
    console.warn('Meeting data could not be saved on this device.', error);
    return false;
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
}

function showDetails(request) {
  const meeting = state.meetings.find((entry) => entry.requestId === request.id);
  const rows = [
    ['Employee', request.name], ['Email', request.email || 'Not provided'],
    ['Purpose', request.purpose], ['Message', request.message], ['Status', request.status]
  ];
  if (meeting) {
    rows.push(['Meeting time', meetingWhen(meeting)], ['Topic', meeting.topic], ['HR notes', meeting.notes || 'None']);
    if (meeting.duration) rows.push(['Duration', `${meeting.duration} minutes`]);
  }
  document.querySelector('#detailsList').innerHTML = rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || '')}</dd></div>`).join('');
  const join = document.querySelector('#detailsJoin');
  join.hidden = !meeting || !joinable(meeting);
  if (!join.hidden) join.href = roomHref(meeting);
  const replace = document.querySelector('#replaceRoom');
  replace.hidden = !meeting || !zoomUrl(meeting.link);
  replace.dataset.requestId = request.id;
  document.querySelector('#meetingDetails').showModal();
}

function renderStats() {
  document.querySelector('#totalCount').textContent = state.requests.length;
  document.querySelector('#pendingCount').textContent = state.requests.filter((item) => item.status === 'Pending').length;
  document.querySelector('#approvedCount').textContent = state.requests.filter((item) => item.status === 'Approved').length;
  document.querySelector('#todayCount').textContent = state.meetings.filter(joinable).length;
}

function filteredRequests() {
  const status = document.querySelector('#statusFilter').value;
  const filtered = state.requests.filter((item) => status === 'all' || item.status === status);
  filtered.sort((a, b) => (b.sentAt || b.sourceSentAt || '').localeCompare(a.sentAt || a.sourceSentAt || ''));
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
    if (item.status === 'Pending') actions = `<button class="primary-action" data-action="accept" data-id="${escapeHtml(item.id)}">Accept</button><button class="reject-action" data-action="reject" data-id="${escapeHtml(item.id)}">Reject</button>`;
    else if (item.status === 'Approved') actions = `<button data-action="schedule" data-id="${escapeHtml(item.id)}">Create room</button>`;
    else actions = `<button data-action="view" data-id="${escapeHtml(item.id)}">View</button>`;
    return `<tr><td><div class="employee-cell">${avatar(item.name, item.avatar)}<span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.employeeId)}</small></span></div></td><td>${escapeHtml(item.email || 'Not provided')}</td><td>${escapeHtml(item.department)}</td><td>${escapeHtml(item.purpose)}</td><td><span class="truncate" title="${escapeHtml(item.message)}">${escapeHtml(item.message)}</span></td><td><span class="status-pill ${item.status.toLowerCase()}">${escapeHtml(item.status)}</span></td><td class="action-cell">${actions}<button class="more-action" data-action="view" data-id="${escapeHtml(item.id)}" aria-label="View ${escapeHtml(item.name)} request">${icon('more')}</button></td></tr>`;
  }).join('') : '<tr><td class="empty-row" colspan="7">No meeting requests to show.</td></tr>';
  const start = requests.length ? first + 1 : 0;
  const end = Math.min(first + pageSize, requests.length);
  document.querySelector('#paginationSummary').textContent = `Showing ${start}–${end} of ${requests.length} requests`;
  const pagination = document.querySelector('#pagination');
  pagination.innerHTML = `<button type="button" data-page="${currentPage - 1}" aria-label="Previous page" ${currentPage === 1 ? 'disabled' : ''}>${icon('left')}</button>${Array.from({ length: pageCount }, (_, index) => `<button type="button" data-page="${index + 1}" class="${index + 1 === currentPage ? 'current' : ''}" aria-label="Page ${index + 1}" ${index + 1 === currentPage ? 'aria-current="page"' : ''}>${index + 1}</button>`).join('')}<button type="button" data-page="${currentPage + 1}" aria-label="Next page" ${currentPage === pageCount ? 'disabled' : ''}>${icon('right')}</button>`;
}

function renderEmployees() {
  const select = document.querySelector('#employeeSelect');
  const current = select.value;
  select.innerHTML = '<option value="">Select employee</option>' + state.requests.filter((item) => item.status === 'Approved').map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} — ${escapeHtml(item.purpose)}</option>`).join('');
  select.value = current;
}

function renderMeetings() {
  const list = document.querySelector('#upcomingList');
  const meetings = [...state.meetings].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const shown = showAllMeetings ? meetings : meetings.slice(0, 3);
  list.innerHTML = shown.length ? shown.map((item) => `<div class="upcoming-item"><div class="upcoming-person">${avatar(item.name, item.avatar)}<span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.topic)}</small></span></div><div class="upcoming-time" title="${escapeHtml(meetingWhen(item))}">${escapeHtml(meetingWhen(item))}</div>${joinable(item) ? `<a class="join-link" href="${escapeHtml(roomHref(item))}">Join now</a>` : '<span class="status-pill pending">No link</span>'}</div>`).join('') : '<div class="meeting-empty"><span class="meeting-empty-icon">📹</span><strong>No meeting right now</strong><p>Created meeting rooms and the Join now link will appear here.</p></div>';
  document.querySelector('#viewAllMeetings').hidden = meetings.length <= 3;
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
    const label = item.action === 'created' ? 'created a meeting room for' : item.action === 'linked' ? 'linked a Zoom meeting for' : item.action === 'scheduled' ? 'scheduled a Zoom meeting with' : `${item.action} a meeting request from`;
    const symbol = ['created', 'scheduled', 'linked'].includes(item.action) ? 'calendar' : 'check';
    return `<div class="activity-item"><span class="activity-symbol ${escapeHtml(item.action)}">${icon(symbol)}</span><div><p>You <strong>${escapeHtml(label)}</strong> <strong>${escapeHtml(item.name)}</strong></p><small>${relativeTime(item.at)}</small></div></div>`;
  }).join('') : '<p class="empty-mini">No recent activity.</p>';
  document.querySelector('#viewAllActivity').textContent = showAllActivity ? 'Show Less' : 'View All';
}

function renderAll() { renderStats(); renderRequests(); renderEmployees(); renderMeetings(); renderActivity(); }

document.querySelector('#requestsBody').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const item = state.requests.find((request) => String(request.id) === button.dataset.id);
  if (!item) return;
  const action = button.dataset.action;
  if (action === 'view') { showDetails(item); return; }
  if (action === 'schedule') {
    document.querySelector('#employeeSelect').value = String(item.id);
    document.querySelector('#scheduleForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector('#hrNotes').focus();
    return;
  }
  item.status = action === 'accept' ? 'Approved' : 'Rejected';
  state.activity.unshift({ action: action === 'accept' ? 'approved' : 'rejected', name: item.name, at: Date.now() });
  const saved = saveState();
  renderAll();
  showAlert(saved ? "success" : "error", saved ? "Request Updated!" : "Save Failed", saved ? `${item.name}'s meeting request was ${item.status.toLowerCase()} successfully.` : "The meeting request could not be saved. Please try again.");
});

document.querySelector('#pagination').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-page]');
  if (!button || button.disabled) return;
  currentPage = Number(button.dataset.page);
  renderRequests();
});

document.querySelector('#statusFilter').addEventListener('change', () => { currentPage = 1; renderRequests(); });

document.querySelector('#scheduleForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const employee = state.requests.find((item) => String(item.id) === document.querySelector('#employeeSelect').value);
  const feedback = document.querySelector('#scheduleFeedback');
  if (!employee) { feedback.textContent = 'Select an employee request first.'; return; }
  if (employee.status !== 'Approved') { feedback.textContent = 'Approve this request before creating a room.'; return; }
  if (state.meetings.some((item) => item.requestId === employee.id)) { feedback.textContent = 'This request already has a linked meeting.'; return; }
  const id = crypto.randomUUID();
  const roomName = `MystaHR${id.replaceAll('-', '')}`;
  const meeting = {
    id, requestId: employee.id, name: employee.name,
    topic: employee.purpose, whenLabel: 'Room ready to join',
    createdAt: Date.now(), status: 'Scheduled', avatar: employee.avatar,
    provider: 'jitsi', link: `https://meet.jit.si/${roomName}`,
    notes: document.querySelector('#hrNotes').value.trim()
  };
  state.meetings.push(meeting);
  employee.status = 'Scheduled';
  state.activity.unshift({ action: 'created', name: employee.name, at: Date.now() });
  saveState(); renderAll();
  event.target.reset();
  feedback.textContent = 'Meeting room created. Join now is available to the employee on this device and browser.';
  showToast(`Meeting room ready for ${employee.name}.`);
});

document.querySelector('#viewAllMeetings').addEventListener('click', () => { showAllMeetings = !showAllMeetings; renderMeetings(); });
document.querySelector('#closeDetails').addEventListener('click', () => document.querySelector('#meetingDetails').close());
document.querySelector('#replaceRoom').addEventListener('click', (event) => {
  const request = state.requests.find((item) => String(item.id) === event.currentTarget.dataset.requestId);
  const meeting = state.meetings.find((item) => item.requestId === request?.id);
  if (!meeting || !zoomUrl(meeting.link)) return;
  const roomName = `MystaHR${crypto.randomUUID().replaceAll('-', '')}`;
  meeting.previousZoomLink = meeting.link;
  meeting.link = `https://meet.jit.si/${roomName}`;
  meeting.provider = 'jitsi';
  meeting.whenLabel = 'Room ready to join';
  meeting.createdAt = Date.now();
  state.activity.unshift({ action: 'created', name: request.name, at: Date.now() });
  saveState(); renderAll();
  document.querySelector('#meetingDetails').close();
  showToast(`Meeting room ready for ${request.name}.`);
});
window.addEventListener('storage', (event) => {
  if (event.key === 'ahmadMeetingRequests') { Object.assign(state, loadState()); renderAll(); }
  if (event.key === 'mysta_theme') document.body.classList.toggle('dark-mode', event.newValue === 'dark');
});
document.querySelector('#viewAllActivity').addEventListener('click', () => { showAllActivity = !showAllActivity; renderActivity(); });
document.querySelector('.profile-button').addEventListener('click', () => showToast('HR Admin'));
document.querySelectorAll('[data-placeholder]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); showToast('This section is coming soon.'); }));

renderAll();
