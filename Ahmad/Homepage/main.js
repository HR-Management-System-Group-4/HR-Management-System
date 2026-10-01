const heroMedia = document.querySelector('#heroMedia');
document.querySelector('#heroVimeo').addEventListener('load', () => {
  heroMedia.classList.add('video-ready');
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
}

const services = {
  profile: {
    number: '01', name: 'EMPLOYEE PROFILE', title: 'Your details,<br>always in one place.',
    description: 'Access and manage personal and employment information.',
    pill: 'EMP-1042 · Active',
    items: ['View your employment details', 'Keep contact information current', 'Store your emergency contact', 'View and download your CV'],
    link: '../../Mohamad/Employee-profile/Profile.html'
  },
  tasks: {
    number: '02', name: 'TASK MANAGEMENT', title: 'Stay on top of<br>every task.',
    description: 'View assigned work, send solutions, and follow progress.',
    pill: '3 tasks · In progress',
    items: ['See tasks assigned to you', 'Check priorities and due dates', 'Submit your work to HR', 'Track review and completion'],
    link: '../../Sara_Sawalmeh/Employee_Task/Employee_Task.html'
  },
  leave: {
    number: '03', name: 'LEAVE MANAGEMENT', title: 'Time off,<br>made simple.',
    description: 'Request leave and see the status of each application.',
    pill: 'Leave · Employee view',
    items: ['Choose your leave type', 'Select start and end dates', 'Explain your request', 'Follow the approval status'],
    link: '../../Timaaa/Leave-application/Timaa.html'
  },
  policies: {
    number: '04', name: 'COMPANY POLICIES', title: 'Find the policy<br>you need.',
    description: 'Keep important company guidance easy to find.',
    pill: 'Policies · Library',
    items: ['Browse published policies', 'Read current guidance', 'Find documents quickly', 'Stay informed about updates'],
    link: '#servicePreview'
  },
  meetings: {
    number: '05', name: 'MEETINGS', title: 'Never miss a<br>meeting.',
    description: 'View upcoming company meetings and join scheduled Zoom sessions.',
    link: '../Meeting-Zoom/index.html'
  },
  feedback: {
    number: '06', name: 'FEEDBACK', title: 'Your voice,<br>heard clearly.',
    description: 'Share feedback with HR in one simple place.',
    pill: 'Feedback · Employee view',
    items: ['Write your feedback', 'Send it to HR', 'Keep communication organized', 'Help improve everyday work'],
    link: '../../Yasmeen_Telfah/feedbackEmployees.html'
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
    if (Array.isArray(saved?.meetings)) meetings = saved.meetings;
  } catch (error) {
    console.warn('Meeting data could not be loaded.', error);
  }

  // A saved Zoom link distinguishes a scheduled appointment from dashboard sample data.
  const now = Date.now();
  const nextMeeting = meetings
    .filter(item => item?.status === 'Scheduled' && item.link && /^https?:\/\//i.test(item.link))
    .map(item => ({ ...item, startsAt: new Date(`${item.date}T${item.time}`).getTime() }))
    .filter(item => Number.isFinite(item.startsAt) && item.startsAt >= now)
    .sort((a, b) => a.startsAt - b.startsAt)[0];

  document.querySelector('#meetingNotice').hidden = !nextMeeting;
  document.querySelector('#meetingEmpty').hidden = Boolean(nextMeeting);
  if (!nextMeeting) return;

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
  link.href = service.link;
  link.innerHTML = key === 'meetings'
    ? 'Request a meeting <i class="bi bi-arrow-right" aria-hidden="true"></i>'
    : 'Learn more <i class="bi bi-arrow-up-right" aria-hidden="true"></i>';

  standardPreview.hidden = key === 'meetings';
  meetingPreview.hidden = key !== 'meetings';
  if (key === 'meetings') {
    renderNextMeeting();
    return;
  }

  document.querySelector('#previewNumber').textContent = service.number;
  document.querySelector('#previewTitle').textContent = service.name;
  document.querySelector('#previewPill').innerHTML = `<span></span> ${service.pill}`;
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

document.querySelectorAll('[data-service]').forEach(element => {
  element.addEventListener('click', () => selectService(element.dataset.service));
});

selectService('profile');
window.addEventListener('storage', (event) => {
  if (event.key === 'ahmadHrZoomDashboardV1' && activeService === 'meetings') renderNextMeeting();
});
