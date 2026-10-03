const routing = window.MystaServiceRouting;
const role = routing?.getRole();

if (!role) {
  window.location.replace(new URL('../../Sara_Dolat/log in/index.html', document.baseURI).href);
} else {
  const hrContent = {
    leave: ['Leave Requests', 'Review and manage employee leave requests.'],
    employees: ['Employee Management', 'View and manage employee records.'],
    policies: ['Company Policies', 'Create and update workplace policies.'],
    tasks: ['Task Management', 'Assign tasks and track employee progress.'],
    feedback: ['Feedback Inbox', 'Read and respond to employee feedback.'],
    meetings: ['Employee Meetings', 'Schedule and manage employee meetings.']
  };

  if (role === 'HR') {
    document.title = 'Mysta HR Services';
    document.querySelector('.section-header h1').textContent = 'Everything HR Needs, In One Place';
    document.querySelector('.section-header p').textContent = 'Manage your team, requests, policies, tasks, and feedback.';
  } else {
    document.title = 'Mysta Employee Services';
    document.querySelector('.section-header h1').textContent = 'Everything You Need, In One Place';
    document.querySelector('.section-header p').textContent = 'Access your information, tasks, leave, policies, and feedback.';
  }

  document.querySelectorAll('.service-card[data-service]').forEach((card) => {
    const key = card.dataset.service;
    card.querySelector('a').href = routing.pageUrl(key);
    if (role === 'HR') {
      const [title, description] = hrContent[key];
      card.querySelector('h3').textContent = title;
      card.querySelector('p').textContent = description;
    }
  });
}
