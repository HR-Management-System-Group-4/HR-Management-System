const hrNavToggle = document.querySelector('.hr-nav-toggle');
const hrNavBackdrop = document.querySelector('.hr-nav-backdrop');

function setHrNavigationOpen(open) {
    document.body.classList.toggle('hr-nav-open', open);
    hrNavToggle.setAttribute('aria-expanded', String(open));
    hrNavToggle.setAttribute('aria-label', open ? 'Close HR menu' : 'Open HR menu');
    hrNavBackdrop.hidden = !open;
}

hrNavToggle.addEventListener('click', () => setHrNavigationOpen(!document.body.classList.contains('hr-nav-open')));
hrNavBackdrop.addEventListener('click', () => setHrNavigationOpen(false));
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setHrNavigationOpen(false);
});
window.addEventListener('resize', () => {
    if (window.innerWidth > 800) setHrNavigationOpen(false);
});
