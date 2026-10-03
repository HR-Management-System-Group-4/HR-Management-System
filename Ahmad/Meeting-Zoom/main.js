const form = document.querySelector('#meetingForm');
const message = document.querySelector('#message');
const feedback = document.querySelector('#formFeedback');
const storageKey = 'ahmadMeetingRequests';
const activeRequestKey = 'ahmadActiveMeetingRequest';

function readRequests() {
  try {
    const requests = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(requests) ? requests : [];
  } catch (error) {
    console.warn('Meeting requests could not be loaded.', error);
    return [];
  }
}

function zoomUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'zoom.us' || url.hostname.endsWith('.zoom.us')) && /^\/(?:j\/\d+|my\/[a-z0-9._-]+|wc\/join\/\d+)\/?$/i.test(url.pathname);
  } catch { return false; }
}

function jitsiUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'meet.jit.si' && /^\/[a-z0-9_-]{16,100}\/?$/i.test(url.pathname);
  } catch { return false; }
}

function showLastRequest() {
  const requests = readRequests();
  const activeId = localStorage.getItem(activeRequestKey);
  const request = requests.find((item) => (item.id || item.sentAt) === activeId) || requests.at(-1);
  const meetingBox = document.querySelector('#scheduledMeeting');
  const meetingEmpty = document.querySelector('#meetingEmpty');
  const pill = document.querySelector('#statusPill');
  meetingBox.hidden = true;
  meetingEmpty.hidden = false;
  pill.hidden = !request;
  if (!request) return;

  document.querySelector('#statusHeading').textContent = request.purpose;
  document.querySelector('#statusDate').textContent = `Sent on ${new Date(request.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  pill.textContent = request.status || 'Pending';
  pill.classList.toggle('pending', pill.textContent === 'Pending');

  const meeting = request.meeting;
  if (request.status !== 'Scheduled' || !meeting || !(zoomUrl(meeting.link) || jitsiUrl(meeting.link))) return;
  meetingBox.hidden = false;
  meetingEmpty.hidden = true;
  const startsAt = meeting.date && meeting.time ? new Date(`${meeting.date}T${meeting.time}`) : null;
  document.querySelector('#meetingWhen').textContent = meeting.whenLabel || (startsAt && !Number.isNaN(startsAt.getTime()) ? startsAt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Meeting link ready');
  document.querySelector('#meetingTopic').textContent = meeting.topic || request.purpose;
  document.querySelector('#meetingNote').textContent = meeting.notes || 'Your meeting room is ready.';
  document.querySelector('#meetingChannel').textContent = jitsiUrl(meeting.link) ? 'Jitsi Meet' : 'Zoom';
  const join = document.querySelector('#employeeJoinLink');
  join.href = jitsiUrl(meeting.link) ? `room.html?id=${encodeURIComponent(meeting.id)}&role=employee` : meeting.link;
}

message.addEventListener('input', () => {
  document.querySelector('#messageCount').textContent = message.value.length;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const request = {
    id: crypto.randomUUID(),
    name: document.querySelector('#employeeName').value.trim(),
    email: document.querySelector('#employeeEmail').value.trim(),
    purpose: document.querySelector('#purpose').value,
    message: message.value.trim(),
    sentAt: new Date().toISOString(),
    status: 'Pending'
  };
  if (!request.message) {
    feedback.textContent = 'Please enter a message for HR.';
    message.focus();
    return;
  }
  const requests = readRequests();
  requests.push(request);
  try {
    localStorage.setItem(storageKey, JSON.stringify(requests));
    localStorage.setItem(activeRequestKey, request.id);
  } catch (error) {
    feedback.textContent = 'Your request could not be saved. Please try again.';
    return;
  }
  form.reset();
  document.querySelector('#messageCount').textContent = '0';
  feedback.textContent = 'Your meeting request was saved. HR can review it on this device and browser.';
  showLastRequest();
});

form.addEventListener('reset', () => {
  feedback.textContent = '';
  document.querySelector('#messageCount').textContent = '0';
});

window.addEventListener('storage', (event) => {
  if (event.key === storageKey) showLastRequest();
});
window.addEventListener('pageshow', showLastRequest);
showLastRequest();
