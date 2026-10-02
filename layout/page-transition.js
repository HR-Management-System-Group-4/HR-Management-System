(() => {
  const key = 'mysta-page-arrival';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let navigating = false;

  try {
    if (sessionStorage.getItem(key) === '1' && !reducedMotion.matches) {
      document.documentElement.classList.add('page-arriving');
      sessionStorage.removeItem(key);
      addEventListener('DOMContentLoaded', () => {
        setTimeout(() => document.documentElement.classList.remove('page-arriving'), 850);
      }, { once: true });
    }
  } catch (_) { /* Navigation still works when storage is unavailable. */ }

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
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<strong>Mysta<span aria-hidden="true">.</span></strong>';
    document.body.append(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('is-active')));

    setTimeout(() => {
      try { sessionStorage.setItem(key, '1'); } catch (_) { /* Optional enhancement. */ }
      location.assign(destination.href);
    }, 800);
  }, true);

  addEventListener('pageshow', () => {
    navigating = false;
    document.querySelector('.page-transition')?.remove();
  });
})();
