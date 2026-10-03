const footerContainer = document.querySelector('.footer');

if (footerContainer) {
  const footerUrl = new URL('footer.html', document.currentScript.src);
  const homepageUrl = new URL('../Ahmad/Homepage/index.html', footerUrl);
  const loginUrl = new URL('../Sara_Dolat/log in/index.html', footerUrl);
  const aboutUrl = new URL('../Yasmeen_Telfah/aboutUs/aboutUs.html', footerUrl);
  const teamUrl = new URL('../Yasmeen_Telfah/team/team.html#team', footerUrl);

  fetch(footerUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Footer request failed: ${response.status}`);
      return response.text();
    })
    .then((html) => {
      const footer = new DOMParser().parseFromString(html, 'text/html').querySelector('footer');
      if (!footer) throw new Error('Footer markup was not found.');

      footer.querySelector('[data-brand-logo]').src = new URL('../assets/Logo-cropped.png', footerUrl).href;

      const isHomepage = window.location.pathname === homepageUrl.pathname;
      footer.querySelectorAll('[data-page-anchor]').forEach((link) => {
        const anchor = `#${link.dataset.pageAnchor}`;
        link.href = link.dataset.pageAnchor === 'services' ? (window.MystaServiceRouting?.pageUrl() || loginUrl.href)
          : link.dataset.pageAnchor === 'about' ? aboutUrl.href
          : link.dataset.pageAnchor === 'team' ? teamUrl.href
          : isHomepage ? anchor : `${homepageUrl.href}${anchor}`;
      });
      footerContainer.replaceChildren(footer);
      if (window.location.hash === '#contact') {
        requestAnimationFrame(() => footer.scrollIntoView());
      }
      initializeFooterMap(footer, footerUrl);
    })
    .catch((error) => console.error('Footer could not be loaded:', error));
}

function initializeFooterMap(footer, footerUrl) {
  const viewport = footer.querySelector('[data-footer-map]');
  const frame = footer.querySelector('[data-map-frame]');
  const placeholder = footer.querySelector('[data-map-placeholder]');
  if (!viewport || !frame || !placeholder) return;

  const mapUrl = new URL('footer-map/dist/index.html', footerUrl);
  const publicMapUrl = new URL('footer-map/public-map.html', footerUrl);
  let mapStarted = false;
  let mapReady = false;
  let visible = false;

  const tellMapVisibility = () => {
    if (mapReady && frame.contentWindow) {
      frame.contentWindow.postMessage({ type: 'mysta-map:visibility', visible }, window.location.origin);
    }
  };

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'mysta-map:ready') {
      mapReady = true;
      placeholder.hidden = true;
      tellMapVisibility();
    }
  });

  const startMap = async () => {
    if (mapStarted) return;
    mapStarted = true;
    placeholder.querySelector('small').textContent = 'Preparing the 3D city…';
    frame.loading = 'eager';
    try {
      const response = await fetch(mapUrl, { method: 'HEAD' });
      frame.src = response.ok ? mapUrl.href : publicMapUrl.href;
    } catch (error) {
      // A static checkout works even before the optional Cesium build exists.
      frame.src = publicMapUrl.href;
      console.warn('Mysta footer map build unavailable; opening the public 3D scene:', error);
    }
  };

  const preloadObserver = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      startMap();
      observer.disconnect();
    }
  }, { rootMargin: '300px 0px' });
  preloadObserver.observe(viewport);

  const visibleObserver = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting && document.visibilityState === 'visible';
    tellMapVisibility();
  }, { threshold: 0.01 });
  visibleObserver.observe(viewport);
  document.addEventListener('visibilitychange', () => {
    visible = document.visibilityState === 'visible' && viewport.getBoundingClientRect().bottom > 0 && viewport.getBoundingClientRect().top < window.innerHeight;
    tellMapVisibility();
  });
}
