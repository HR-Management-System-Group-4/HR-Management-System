const navbarContainer = document.querySelector('.nav-bar');

if (navbarContainer) {
  const navbarUrl = new URL('header.html', document.currentScript.src);
  const homepageUrl = new URL('../Ahmad/Homepage/index.html', navbarUrl);
  const servicesUrl = new URL('../Timaaa/services/index.html', navbarUrl);
  const teamUrl = new URL('../Yasmeen_Telfah/aboutUs.html', navbarUrl);
  const isHomepage = window.location.pathname === homepageUrl.pathname;
  const themeClass = document.body.dataset.themeClass || 'dark-mode';
  const themeKey = document.body.dataset.themeKey || 'mysta_theme';

  try {
    if (localStorage.getItem(themeKey) === 'dark') document.body.classList.add(themeClass);
  } catch (_) { /* Theme persistence is optional. */ }

  fetch(navbarUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Navbar request failed: ${response.status}`);
      return response.text();
    })
    .then((html) => {
      const nav = new DOMParser().parseFromString(html, 'text/html').querySelector('nav');
      if (!nav) throw new Error('Navbar markup was not found.');

      nav.querySelector('[data-brand-logo]').src = new URL('../assets/Logo-cropped.png', navbarUrl).href;

      nav.querySelectorAll('[data-page-anchor]').forEach((link) => {
        const anchor = `#${link.dataset.pageAnchor}`;
        link.href = link.dataset.pageAnchor === 'services' ? servicesUrl.href
          : link.dataset.pageAnchor === 'team' ? `${teamUrl.href}#team`
          : link.dataset.pageAnchor === 'about' ? teamUrl.href
          : isHomepage ? anchor : `${homepageUrl.href}${anchor}`;
      });
      const updateActiveLink = () => {
        const activeSection = window.location.pathname === teamUrl.pathname
          ? window.location.hash === '#team' ? 'team' : 'about'
          : isHomepage ? (window.location.hash.slice(1) || 'home')
          : window.location.pathname === servicesUrl.pathname ? 'services' : '';
        nav.querySelectorAll('.nav-link').forEach((link) => {
          const active = link.dataset.pageAnchor === activeSection;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      };
      updateActiveLink();
      window.addEventListener('hashchange', updateActiveLink);

      const loginLink = nav.querySelector('[data-login-link]');
      loginLink.href = new URL('../Sara_Dolat/log in/index.html', navbarUrl).href;
      try {
        const signedInUser = JSON.parse(localStorage.getItem('currentUser') || localStorage.getItem('user') || 'null');
        if (signedInUser) {
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

      const themeButton = nav.querySelector('.theme-btn');
      const updateThemeButton = () => {
        const dark = document.body.classList.contains(themeClass);
        themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        themeButton.querySelector('[data-theme-icon]').innerHTML = dark
          ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>'
          : '<path d="M20.5 14.3A8.7 8.7 0 0 1 9.7 3.5 8.8 8.8 0 1 0 20.5 14.3Z"/>';
      };
      themeButton.addEventListener('click', () => {
        document.body.classList.toggle(themeClass);
        updateThemeButton();
        try { localStorage.setItem(themeKey, document.body.classList.contains(themeClass) ? 'dark' : 'light'); }
        catch (_) { /* Theme persistence is optional. */ }
      });
      updateThemeButton();

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
