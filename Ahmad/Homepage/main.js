const heroMedia = document.querySelector('#heroMedia');
document.querySelector('#heroVimeo').addEventListener('load', () => {
  heroMedia.classList.add('video-ready');
});

const navbarLayout = document.querySelector('#navbar-layout');
fetch(new URL('../../nav-bar/nav.html', document.baseURI))
  .then((response) => {
    if (!response.ok) throw new Error(`Navbar request failed: ${response.status}`);
    return response.text();
  })
  .then((html) => {
    const nav = new DOMParser().parseFromString(html, 'text/html').querySelector('nav');
    if (!nav) throw new Error('Navbar markup was not found.');
    const anchors = { Home: '#home', Services: '#services', Team: '#team', About: '#about' };
    nav.querySelectorAll('.nav-link').forEach((link) => {
      const destination = anchors[link.textContent.trim()];
      if (destination) link.href = destination;
    });
    navbarLayout.replaceChildren(nav);
  })
  .catch((error) => console.error('Navbar could not be loaded:', error));

navbarLayout.addEventListener('click', (event) => {
  const themeButton = event.target.closest('.theme-btn');
  if (!themeButton) return;
  document.body.classList.toggle('dark-mode');
  const dark = document.body.classList.contains('dark-mode');
  themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  themeButton.querySelector('i').className = dark ? 'bi bi-sun' : 'bi bi-moon';
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

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const about = document.querySelector('.about-section');
  const art = about.querySelector('.about-art');
  let frame = 0;
  about.addEventListener('pointermove', (event) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = about.getBoundingClientRect();
      art.style.setProperty('--about-x', `${((event.clientX - rect.left) / rect.width - .5) * 22}px`);
      art.style.setProperty('--about-y', `${((event.clientY - rect.top) / rect.height - .5) * 18}px`);
    });
  });
  about.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    art.style.setProperty('--about-x', '0px');
    art.style.setProperty('--about-y', '0px');
  });
}

const services = {
  profile: {
    number: '01', name: 'EMPLOYEE PROFILE', title: 'Your details,<br>always in one place.',
    description: 'Access and manage personal and employment information.',
    pill: 'EMP-1042 · Active',
    items: ['View your employment details', 'Keep contact information current', 'Store your emergency contact', 'View and download your CV'],
    link: '#servicePreview'
  },
  tasks: {
    number: '02', name: 'TASK MANAGEMENT', title: 'Stay on top of<br>every task.',
    description: 'View assigned work, send solutions, and follow progress.',
    pill: '3 tasks · In progress',
    items: ['See tasks assigned to you', 'Check priorities and due dates', 'Submit your work to HR', 'Track review and completion'],
    link: '#servicePreview'
  },
  leave: {
    number: '03', name: 'LEAVE MANAGEMENT', title: 'Time off,<br>made simple.',
    description: 'Request leave and see the status of each application.',
    pill: 'Leave · Employee view',
    items: ['Choose your leave type', 'Select start and end dates', 'Explain your request', 'Follow the approval status'],
    link: '#servicePreview'
  },
  policies: {
    number: '04', name: 'COMPANY POLICIES', title: 'Find the policy<br>you need.',
    description: 'Keep important company guidance easy to find.',
    pill: 'Policies · Library',
    items: ['Browse published policies', 'Read current guidance', 'Find documents quickly', 'Stay informed about updates'],
    link: '#servicePreview'
  },
  meetings: {
    number: '05', name: 'MEETINGS', title: 'Make space for<br>the conversation.',
    description: 'Request a meeting with HR and choose a preferred time.',
    pill: 'Meetings · Request',
    items: ['Choose a meeting purpose', 'Send a message to HR', 'Pick a preferred date and time', 'Follow your request status'],
    link: '../Meeting-Zoom/index.html'
  },
  feedback: {
    number: '06', name: 'FEEDBACK', title: 'Your voice,<br>heard clearly.',
    description: 'Share feedback with HR in one simple place.',
    pill: 'Feedback · Employee view',
    items: ['Write your feedback', 'Send it to HR', 'Keep communication organized', 'Help improve everyday work'],
    link: '#servicePreview'
  }
};

function selectService(key) {
  const service = services[key];
  if (!service) return;
  document.querySelectorAll('.service-tab').forEach(button => {
    const selected = button.dataset.service === key;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#serviceNumber').textContent = service.number;
  document.querySelector('#previewNumber').textContent = service.number;
  document.querySelector('#previewTitle').textContent = service.name;
  document.querySelector('#serviceTitle').innerHTML = service.title;
  document.querySelector('#serviceDescription').textContent = service.description;
  document.querySelector('#previewPill').innerHTML = `<span></span> ${service.pill}`;
  document.querySelector('#previewList').replaceChildren(...service.items.map(item => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  }));
  document.querySelector('#serviceLink').href = service.link;
}

document.querySelectorAll('[data-service]').forEach(element => {
  element.addEventListener('click', () => selectService(element.dataset.service));
});

selectService('profile');
