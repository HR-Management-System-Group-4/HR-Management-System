// A small navigation rail for walking through the team's pages in one demo.
(() => {
  const script = document.currentScript;
  const root = new URL('../', script.src);
  const pages = [
    ['Home', 'Ahmad/Homepage/index.html'],
    ['Log in', 'Sara_Dolat/log in/index.html'],
    ['Employee services', 'Timaaa/services/index.html'],
    ['About the team', 'Yasmeen_Telfah/aboutUs.html'],
    ['Employee information', 'Mohamad/My-Employee-Information/info.html'],
    ['Employee profile', 'Mohamad/Employee-profile/Profile.html'],
    ['Edit profile', 'Mohamad/Employee-edit-profile/edit-profile.html'],
    ['My tasks', 'Sara_Sawalmeh/Employee_Task/Employee_Task.html'],
    ['Task board', 'Timaaa/task_page/index.html'],
    ['Leave request', 'Timaaa/Leave-application/Timaa.html'],
    ['Meeting request', 'Ahmad/Meeting-Zoom/index.html'],
    ['Send feedback', 'Yasmeen_Telfah/feedbackEmployees.html'],
    ['HR dashboard', 'Timaaa/Dashboard-HR/index.html'],
    ['Employees', 'Yasmeen_Telfah/employeeManagement.html'],
    ['HR leave requests', 'Sara_Dolat/Leave-HR/index.html'],
    ['Company policies', 'Sara_Dolat/company policies/index.html'],
    ['HR tasks', 'Ahmad/HR-tasks/index.html'],
    ['HR meetings', 'Ahmad/HR-zoom/index.html'],
    ['Feedback inbox', 'Sara_Sawalmeh/Feedback_HR/Feedback_HR.html'],
    ['HR profile', 'Mohamad/Hr-profile/hr.html']
  ];
  const current = pages.findIndex(([, path]) => new URL(path, root).pathname === location.pathname);
  if (current < 0) return;

  const rail = document.createElement('div');
  rail.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:2147483647';
  const shadow = rail.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      * { box-sizing: border-box; }
      nav { display:flex;align-items:center;gap:8px;max-width:calc(100vw - 32px);padding:8px 10px;border:1px solid #d6d9e2;border-radius:14px;background:#fff;color:#172033;box-shadow:0 8px 32px #16203330;font:600 13px/1.3 system-ui,sans-serif; }
      strong { white-space:nowrap; }
      select, a { border:1px solid #d6d9e2;border-radius:8px;background:#fff;color:#172033;font:inherit;min-height:34px;padding:6px 8px;text-decoration:none; }
      select { min-width:120px;max-width:220px; }
      a:hover, a:focus-visible, select:focus-visible { border-color:#f47b39;outline:2px solid #f47b3955; }
      @media(max-width:600px) { nav { flex-wrap:wrap; } strong { width:100%; } select { flex:1; } }
    </style>
    <nav aria-label="Demo page navigation">
      <strong>Demo ${current + 1}/${pages.length}</strong>
      <select aria-label="Jump to a page"></select>
      <a id="previous">← Back</a>
      <a id="next">Next →</a>
    </nav>`;
  const select = shadow.querySelector('select');
  pages.forEach(([label, path], index) => {
    const option = document.createElement('option');
    option.value = new URL(path, root).href;
    option.textContent = `${index + 1}. ${label}`;
    option.selected = index === current;
    select.append(option);
  });
  select.addEventListener('change', () => { location.href = select.value; });
  shadow.querySelector('#previous').href = new URL(pages[(current + pages.length - 1) % pages.length][1], root).href;
  shadow.querySelector('#next').href = new URL(pages[(current + 1) % pages.length][1], root).href;
  document.body.append(rail);
})();
