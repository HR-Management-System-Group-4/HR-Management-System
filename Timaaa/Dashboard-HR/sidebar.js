const sidebar = document.querySelector('#hrSidebar');
const toggle = document.querySelector('#sidebarToggle');
const backdrop = document.querySelector('#sidebarBackdrop');

function setSidebarOpen(open) {
  sidebar.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close HR menu' : 'Open HR menu');
  backdrop.hidden = !open;
}

toggle.addEventListener('click', () => setSidebarOpen(!sidebar.classList.contains('is-open')));
backdrop.addEventListener('click', () => setSidebarOpen(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setSidebarOpen(false);
});
