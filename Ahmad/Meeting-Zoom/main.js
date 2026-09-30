const form = document.querySelector('#meetingForm');
const message = document.querySelector('#message');
const feedback = document.querySelector('#formFeedback');
const storageKey = 'ahmadMeetingRequests';

function showLastRequest() {
  const requests = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const lastRequest = requests.at(-1);
  if (!lastRequest) return;
  document.querySelector('#statusSample').hidden = true;
  document.querySelector('#statusHeading').textContent = lastRequest.purpose;
  document.querySelector('#statusDate').textContent = `Sent on ${new Date(lastRequest.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const pill = document.querySelector('#statusPill');
  pill.textContent = 'Pending';
  pill.classList.add('pending');
}

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
document.querySelector('#meetingDate').min = localToday;

message.addEventListener('input', () => {
  document.querySelector('#messageCount').textContent = message.value.length;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const request = {
    purpose: document.querySelector('#purpose').value,
    message: message.value.trim(),
    date: document.querySelector('#meetingDate').value,
    time: form.querySelector('input[name="time"]:checked').value,
    sentAt: new Date().toISOString(),
    status: 'Pending'
  };
  if (!request.message) {
    feedback.textContent = 'Please enter a message for HR.';
    message.focus();
    return;
  }
  const requests = JSON.parse(localStorage.getItem(storageKey) || '[]');
  requests.push(request);
  localStorage.setItem(storageKey, JSON.stringify(requests));
  form.reset();
  document.querySelector('#messageCount').textContent = '0';
  feedback.textContent = 'Your meeting request was saved on this device.';
  showLastRequest();
});

form.addEventListener('reset', () => {
  feedback.textContent = '';
  document.querySelector('#messageCount').textContent = '0';
});

document.querySelector('#navbar-layout').addEventListener('click', (event) => {
  const themeButton = event.target.closest('.theme-btn');
  if (!themeButton) return;
  document.body.classList.toggle('dark-mode');
  const dark = document.body.classList.contains('dark-mode');
  themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  themeButton.querySelector('i').className = dark ? 'bi bi-sun' : 'bi bi-moon';
});

// The supplied example embeds Jitsi. Keep this optional demo separate from Zoom requests.
document.querySelector('#demoButton').addEventListener('click', () => {
  const container = document.querySelector('#meet');
  if (!container.hidden) return;
  const button = document.querySelector('#demoButton');
  button.disabled = true;
  button.textContent = 'Loading demo...';
  const script = document.createElement('script');
  script.src = 'https://meet.jit.si/external_api.js';
  script.onload = () => {
    container.hidden = false;
    button.textContent = 'Demo open';
    new JitsiMeetExternalAPI('meet.jit.si', {
      roomName: `MystaHRDemo${Date.now()}`,
      width: '100%',
      height: 500,
      parentNode: container
    });
  };
  script.onerror = () => {
    button.textContent = 'Demo unavailable';
  };
  document.head.append(script);
});

showLastRequest();
