const status = document.querySelector('#roomStatus');
const directLink = document.querySelector('#openDirect');
const parameters = new URLSearchParams(location.search);
const meetingId = parameters.get('id');
let api;
let connectionTimer;

function readMeeting() {
  try {
    const state = JSON.parse(localStorage.getItem('ahmadHrZoomDashboardV1') || 'null');
    return Array.isArray(state?.meetings) ? state.meetings.find((item) => item.id === meetingId) : null;
  } catch { return null; }
}

function validJitsiRoom(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'meet.jit.si' && /^\/[a-z0-9_-]{16,100}\/?$/i.test(url.pathname)
      ? url.pathname.slice(1).replace(/\/$/, '') : '';
  } catch { return ''; }
}

const meeting = readMeeting();
const roomName = validJitsiRoom(meeting?.link);
if (!roomName) {
  status.textContent = 'This meeting room is unavailable on this browser. Return to the meeting request and try again.';
} else {
  document.querySelector('#roomTitle').textContent = meeting.topic || 'Video meeting';
  document.querySelector('#backLink').href = parameters.get('role') === 'hr' ? '../HR-zoom/index.html' : 'index.html';
  directLink.href = meeting.link;
  directLink.hidden = false;

  const script = document.createElement('script');
  script.src = 'https://meet.jit.si/external_api.js';
  script.onload = () => {
    if (typeof JitsiMeetExternalAPI !== 'function') {
      status.textContent = 'The meeting could not load here. Open it directly in Jitsi.';
      return;
    }
    try {
      api = new JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#meet'),
        configOverwrite: {
          prejoinConfig: { enabled: false },
          startWithAudioMuted: true,
          startWithVideoMuted: true
        },
        userInfo: { displayName: parameters.get('role') === 'hr' ? 'HR' : 'Employee' },
        onload: () => {
          status.textContent = 'Meeting window ready. Connecting…';
          connectionTimer = setTimeout(() => {
            status.textContent = 'Still connecting. If the call does not start, open it directly in Jitsi.';
          }, 20000);
        }
      });
      api.addListener('videoConferenceJoined', () => {
        clearTimeout(connectionTimer);
        status.textContent = 'You joined the meeting.';
      });
      api.addListener('errorOccurred', (error) => {
        if (error.type !== 'CONNECTION' && !error.isFatal) return;
        clearTimeout(connectionTimer);
        status.textContent = 'Jitsi could not connect here. Try opening the room directly in Jitsi.';
      });
      api.addListener('readyToClose', () => { status.textContent = 'You left the meeting.'; });
    } catch (error) {
      console.error('Jitsi meeting could not start.', error);
      status.textContent = 'The meeting could not start here. Open it directly in Jitsi.';
    }
  };
  script.onerror = () => { status.textContent = 'The meeting service could not load. Open it directly in Jitsi.'; };
  document.head.append(script);
}

window.addEventListener('pagehide', () => { clearTimeout(connectionTimer); api?.dispose(); });
