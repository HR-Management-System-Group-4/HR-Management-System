const footerContainer = document.querySelector('.footer');

if (footerContainer) {
  const footerUrl = new URL('footer.html', document.currentScript.src);
  const homepageUrl = new URL('../Ahmad/Homepage/index.html', footerUrl);

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
        link.href = isHomepage ? anchor : `${homepageUrl.href}${anchor}`;
      });
      footerContainer.replaceChildren(footer);
    })
    .catch((error) => console.error('Footer could not be loaded:', error));
}
