const navbarContainer = document.querySelector('.nav-bar');

const layoutUrl = new URL('header.html', document.currentScript.src);
const servicePages = {
  HR: {
    home: '../Timaaa/services/index.html',
    profile: '../Mohamad/Hr-profile/hr.html',
    tasks: '../Ahmad/HR-tasks/index.html',
    leave: '../Sara_Dolat/Leave-HR/index.html',
    policies: '../Sara_Sawalmeh/Policies/Policies_HR.Html',
    meetings: '../Ahmad/HR-zoom/index.html',
    feedback: '../Sara_Sawalmeh/Feedback_HR/Feedback_HR.html',
    employees: '../Yasmeen_Telfah/employeeManagement/employeeManagement.html'
  },
  Employee: {
    home: '../Timaaa/services/index.html',
    profile: '../Mohamad/Employee-profile/Profile.html',
    tasks: '../Sara_Sawalmeh/Employee_Task/Employee_Task.html',
    leave: '../Timaaa/Leave-application/Timaa.html',
    policies: '../Sara_Dolat/company policies/index.html',
    meetings: '../Ahmad/Meeting-Zoom/index.html',
    feedback: '../Yasmeen_Telfah/feedbackEmployees/feedbackEmployees.html',
    employees: '../Mohamad/My-Employee-Information/info.html'
  }
};
const loginPageUrl = new URL('../Sara_Dolat/log in/index.html', layoutUrl).href;

function getServiceRole() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId && String(currentUser?.id) === loggedInUserId &&
        (currentUser.role === 'HR' || currentUser.role === 'Employee')) return currentUser.role;
    if (loggedInUserId && String(user?.id) === loggedInUserId &&
        (user.role === 'HR' || user.role === 'Employee')) return user.role;
  } catch (_) { /* Ignore malformed demo storage. */ }
  return null;
}

function getProfileUrl() {
  const role = getServiceRole() === 'HR' ? 'HR' : 'Employee';
  return new URL(servicePages[role].profile, layoutUrl).href;
}

function getServiceUrl(page = 'home') {
  const role = getServiceRole();
  return role && servicePages[role][page]
    ? new URL(servicePages[role][page], layoutUrl).href
    : loginPageUrl;
}

window.MystaServiceRouting = { getRole: getServiceRole, pageUrl: getServiceUrl, profileUrl: getProfileUrl };

if (navbarContainer) {
  const navbarUrl = layoutUrl;
  const homepageUrl = new URL('../Ahmad/Homepage/index.html', navbarUrl);
  const servicesUrl = new URL('../Timaaa/services/index.html', navbarUrl);
  const aboutUrl = new URL('../Yasmeen_Telfah/aboutUs/aboutUs.html', navbarUrl);
  const feedbackFormUrl = new URL('../Yasmeen_Telfah/feedbackEmployees/feedbackEmployees.html', navbarUrl);
  const isHomepage = window.location.pathname === homepageUrl.pathname;
  fetch(navbarUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Navbar request failed: ${response.status}`);
      return response.text();
    })
    .then((html) => {
      const nav = new DOMParser().parseFromString(html, 'text/html').querySelector('nav');
      if (!nav) throw new Error('Navbar markup was not found.');

      nav.querySelector('[data-brand-logo]').src = new URL('../assets/Logo-cropped.png', navbarUrl).href;
      const profileLink = nav.querySelector('[data-service-page="profile"]');
      if (getServiceRole()) profileLink.href = getProfileUrl();
      else profileLink.remove();

      nav.querySelectorAll('[data-page-anchor]').forEach((link) => {
        const anchor = `#${link.dataset.pageAnchor}`;
        link.href = link.dataset.pageAnchor === 'contact' ? feedbackFormUrl.href
          : link.dataset.pageAnchor === 'services' ? getServiceUrl()
          : link.dataset.pageAnchor === 'about' ? aboutUrl.href
          : isHomepage ? anchor : `${homepageUrl.href}${anchor}`;
      });
      const updateActiveLink = () => {
        const profilePath = new URL(getProfileUrl()).pathname;
        const activeSection = window.location.pathname === profilePath
          ? 'profile'
          : window.location.pathname === aboutUrl.pathname ? 'about'
          : window.location.pathname === feedbackFormUrl.pathname ? 'contact'
          : isHomepage ? (window.location.hash.slice(1) || 'home')
          : window.location.pathname === servicesUrl.pathname ? 'services' : '';
        nav.querySelectorAll('.nav-link').forEach((link) => {
          const active = (link.dataset.pageAnchor || link.dataset.servicePage) === activeSection;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      };
      updateActiveLink();
      window.addEventListener('hashchange', updateActiveLink);

      const loginLink = nav.querySelector('[data-login-link]');
      loginLink.href = loginPageUrl;
      try {
        if (getServiceRole()) {
          loginLink.textContent = 'Logout';
          loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('user');
            localStorage.removeItem('loggedInUserId');
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            window.location.assign(loginLink.href);
          });
        }
      } catch (_) { /* Keep the login link when demo storage is unavailable. */ }

      const menuButton = nav.querySelector('.navbar-toggler');
      const menu = nav.querySelector('.navbar-content');
      menuButton.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      });
      menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
      }));

      navbarContainer.replaceChildren(nav);
    })
    .catch((error) => console.error('Navbar could not be loaded:', error));
}
