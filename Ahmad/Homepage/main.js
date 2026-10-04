const heroMedia = document.querySelector('#heroMedia');
document.querySelector('#heroVimeo').addEventListener('load', () => {
  heroMedia.classList.add('video-ready');
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loginUrl = new URL('../../Sara_Dolat/log in/index.html', document.baseURI).href;
const serviceRouting = window.MystaServiceRouting;
if (!reducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('[data-reveal], .problems-section').forEach((element) => revealObserver.observe(element));

  const impactSection = document.querySelector('.impact-section');
  const impactObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      if (entry.target !== impactSection) animateImpactValue(entry.target.querySelector('.impact-value'));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.28, rootMargin: '0px 0px -5% 0px' });
  impactObserver.observe(impactSection);
  impactSection.querySelectorAll('.impact-item').forEach((item) => impactObserver.observe(item));
}

function animateImpactValue(element) {
  const target = element.dataset.count;
  const parts = target.split('/').map(Number);
  const duration = 1500;
  let startTime;
  element.textContent = parts.map(() => '0').join('/');

  function frame(now) {
    if (startTime === undefined) startTime = now;
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - progress) ** 4;
    element.textContent = parts.map(value => Math.round(value * eased)).join('/');
    if (progress < 1) requestAnimationFrame(frame);
    else element.textContent = target;
  }

  requestAnimationFrame(frame);
}

const services = {
  profile: {
    number: '01', name: 'EMPLOYEE PROFILE', title: 'Your details,<br>always in one place.',
    description: 'Access and manage personal and employment information.',
    pill: 'EMP-1042 · Active',
    items: ['View your employment details', 'Keep contact information current', 'Store your emergency contact'],
    action: 'Open your profile', hrAction: 'Open your HR profile'
  },
  tasks: {
    number: '02', name: 'TASK MANAGEMENT', title: 'Stay on top of<br>every task.',
    description: 'View assigned work, send solutions, and follow progress.',
    pill: null,
    items: ['See tasks assigned to you', 'Check priorities and due dates', 'Submit your work to HR', 'Track review and completion'],
    action: 'View your tasks', hrAction: 'Manage tasks'
  },
  leave: {
    number: '03', name: 'LEAVE MANAGEMENT', title: 'Time off,<br>made simple.',
    description: 'Request leave and see the status of each application.',
    pill: 'Leave · Employee view',
    items: ['Choose your leave type', 'Select start and end dates', 'Explain your request', 'Follow the approval status'],
    action: 'Request time off', hrAction: 'Review leave requests'
  },
  policies: {
    number: '04', name: 'COMPANY POLICIES', title: 'Find the policy<br>you need.',
    description: 'Keep important company guidance easy to find.',
    pill: 'Policies · Library',
    items: ['Browse published policies', 'Read current guidance', 'Find documents quickly', 'Stay informed about updates'],
    action: 'Browse policies', hrAction: 'Manage policies'
  },
  meetings: {
    number: '05', name: 'MEETINGS', title: 'Never miss a<br>meeting.',
    description: 'View meeting requests and join video rooms created by HR.',
    action: 'Request a meeting', hrAction: 'Manage meetings'
  },
  feedback: {
    number: '06', name: 'FEEDBACK', title: 'Your voice,<br>heard clearly.',
    description: 'Share feedback with HR in one simple place.',
    pill: 'Feedback · Employee view',
    items: ['Write your feedback', 'Send it to HR', 'Keep communication organized', 'Help improve everyday work'],
    action: 'Share your feedback', hrAction: 'View feedback'
  }
};

const serviceCopy = document.querySelector('.service-copy');
const servicePreview = document.querySelector('#servicePreview');
const standardPreview = document.querySelector('#standardPreview');
const meetingPreview = document.querySelector('#meetingPreview');
let activeService = '';
let transitionToken = 0;
let serviceAnimations = [];

function renderNextMeeting() {
  let meetings = [];
  try {
    const saved = JSON.parse(localStorage.getItem('ahmadHrZoomDashboardV1') || 'null');
    const requests = JSON.parse(localStorage.getItem('ahmadMeetingRequests') || '[]');
    const activeId = localStorage.getItem('ahmadActiveMeetingRequest');
    const activeRequest = requests.find(item => (item.id || item.sentAt) === activeId) || requests.at(-1);
    if (Array.isArray(saved?.meetings) && activeRequest) {
      meetings = saved.meetings.filter(item => item.requestId === (activeRequest.id || activeRequest.sentAt));
    }
  } catch (error) {
    console.warn('Meeting data could not be loaded.', error);
  }

  // Only show a meeting that has a usable video room or legacy Zoom link.
  const now = Date.now();
  const nextMeeting = meetings
    .filter(item => item?.status === 'Scheduled' && item.link && (() => { try { const url = new URL(item.link); return url.protocol === 'https:' && (url.hostname === 'zoom.us' || url.hostname.endsWith('.zoom.us') || url.hostname === 'meet.jit.si'); } catch { return false; } })())
    .map(item => ({ ...item, startsAt: item.date && item.time ? new Date(`${item.date}T${item.time}`).getTime() : NaN }))
    .filter(item => !Number.isFinite(item.startsAt) || item.startsAt >= now)
    .sort((a, b) => (Number.isFinite(a.startsAt) ? a.startsAt : Infinity) - (Number.isFinite(b.startsAt) ? b.startsAt : Infinity))[0];

  document.querySelector('#meetingNotice').hidden = !nextMeeting;
  document.querySelector('#meetingEmpty').hidden = Boolean(nextMeeting);
  if (!nextMeeting) return;

  if (!Number.isFinite(nextMeeting.startsAt)) {
    document.querySelector('#meetingWhen').textContent = nextMeeting.whenLabel || 'Meeting room ready';
    return;
  }
  const date = new Date(nextMeeting.startsAt);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  const dateLabel = sameDay ? 'Today' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  document.querySelector('#meetingWhen').textContent = `${dateLabel} · ${timeLabel}`;
}

function renderService(key) {
  const service = services[key];
  activeService = key;
  document.querySelector('#serviceNumber').textContent = service.number;
  document.querySelector('#serviceTitle').innerHTML = service.title;
  document.querySelector('#serviceDescription').textContent = service.description;
  const link = document.querySelector('#serviceLink');
  const role = serviceRouting?.getRole();
  link.href = serviceRouting?.pageUrl(key) || loginUrl;
  link.innerHTML = `${role ? (role === 'HR' ? service.hrAction : service.action) : `Log in to ${service.action.toLowerCase()}`} <i class="bi bi-arrow-right" aria-hidden="true"></i>`;
  document.querySelector('#serviceAccessNote').hidden = Boolean(role);
  const getStarted = document.querySelector('#getStartedLink');
  getStarted.href = serviceRouting?.pageUrl() || loginUrl;
  getStarted.setAttribute('aria-label', role ? 'Get started with Mysta services' : 'Log in to get started with Mysta services');
  standardPreview.hidden = key === 'meetings';
  meetingPreview.hidden = key !== 'meetings';
  if (key === 'meetings') {
    renderNextMeeting();
    return;
  }

  document.querySelector('#previewNumber').textContent = service.number;
  document.querySelector('#previewTitle').textContent = service.name;
  const previewPill = document.querySelector('#previewPill');
  previewPill.hidden = !service.pill;
  if (service.pill) previewPill.innerHTML = `<span></span> ${service.pill}`;
  document.querySelector('#previewList').replaceChildren(...service.items.map(item => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  }));
}

async function selectService(key) {
  if (!services[key] || key === activeService) return;
  const token = ++transitionToken;
  serviceAnimations.forEach(animation => animation.cancel());
  serviceAnimations = [];
  document.querySelectorAll('.service-tab').forEach(button => {
    const selected = button.dataset.service === key;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  if (reducedMotion || !activeService || !Element.prototype.animate) {
    renderService(key);
    return;
  }

  serviceAnimations = [serviceCopy, servicePreview].map((element, index) => element.animate([
    { opacity: 1, transform: 'translateY(0) scale(1)' },
    { opacity: 0, transform: `translateY(${index ? '10px' : '-10px'}) scale(.985)` }
  ], { duration: 150, easing: 'ease-in', fill: 'forwards' }));
  await Promise.all(serviceAnimations.map(animation => animation.finished.catch(() => {})));
  if (token !== transitionToken) return;
  serviceAnimations.forEach(animation => animation.cancel());
  renderService(key);
  serviceAnimations = [serviceCopy, servicePreview].map((element, index) => element.animate([
    { opacity: 0, transform: `translateY(${index ? '18px' : '12px'}) scale(.985)` },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
  ], { duration: 390, delay: index * 55, easing: 'cubic-bezier(.2,.8,.2,1)' }));
}

document.querySelectorAll('.service-tab[data-service]').forEach(element => {
  element.addEventListener('click', () => selectService(element.dataset.service));
});

selectService('profile');
window.addEventListener('storage', (event) => {
  if (event.key === 'ahmadHrZoomDashboardV1' && activeService === 'meetings') renderNextMeeting();
  if (event.key === 'currentUser' || event.key === 'user') renderService(activeService);
});
window.addEventListener('pageshow', () => renderService(activeService));
