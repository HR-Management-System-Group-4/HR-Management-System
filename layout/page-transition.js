(() => {
  const key = 'mysta-page-arrival';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let navigating = false;

  try {
    const arrival = JSON.parse(sessionStorage.getItem(key) || 'null');
    sessionStorage.removeItem(key);
    if (!reducedMotion.matches && arrival?.path === location.pathname + location.search &&
        Date.now() - arrival.at < 5000) {
      document.documentElement.classList.add('page-arriving');
      addEventListener('DOMContentLoaded', () => {
        setTimeout(() => document.documentElement.classList.remove('page-arriving'), 300);
      }, { once: true });
    }
  } catch (_) { /* Navigation works when storage is unavailable. */ }

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || navigating || reducedMotion.matches ||
        event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.hasAttribute('download') || link.hasAttribute('data-login-link') ||
        link.dataset.noTransition !== undefined ||
        (link.target && link.target !== '_self')) return;

    const destination = new URL(link.href, location.href);
    if (!/^https?:$/.test(destination.protocol) || destination.origin !== location.origin ||
        (destination.pathname === location.pathname && destination.search === location.search)) return;

    event.preventDefault();
    navigating = true;
    document.documentElement.classList.add('page-leaving');
    try {
      sessionStorage.setItem(key, JSON.stringify({ path: destination.pathname + destination.search, at: Date.now() }));
    } catch (_) { /* Arrival animation is optional. */ }
    setTimeout(() => location.assign(destination.href), 190);
  }, true);

  addEventListener('pageshow', () => {
    navigating = false;
    document.documentElement.classList.remove('page-leaving');
  });
})();
