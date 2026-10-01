const navbarContainer = document.querySelector('.nav-bar');

if (navbarContainer) {
  const navbarUrl = new URL('header.html', document.currentScript.src);
  const homepageUrl = new URL('../Ahmad/Homepage/index.html', navbarUrl);
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
        link.href = isHomepage ? anchor : `${homepageUrl.href}${anchor}`;
      });
      nav.querySelector('[data-login-link]').href = new URL('../Ahmad/Login/index.html', navbarUrl).href;

      const themeButton = nav.querySelector('.theme-btn');
      const updateThemeButton = () => {
        const dark = document.body.classList.contains(themeClass);
        themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        themeButton.querySelector('i').className = dark ? 'bi bi-sun' : 'bi bi-moon';
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
