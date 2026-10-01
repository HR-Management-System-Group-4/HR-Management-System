const sampleRequests = [
  { id: 'sample-1', employee: 'Ahmad Saleh', leaveType: 'Annual Leave', startDate: '2026-10-12', endDate: '2026-10-16', reason: 'Family holiday planned in advance.', status: 'Pending' },
  { id: 'sample-2', employee: 'Dana Rimawi', leaveType: 'Annual Leave', startDate: '2026-10-04', endDate: '2026-10-05', reason: 'Personal commitments.', status: 'Approved' },
  { id: 'sample-3', employee: 'Tariq Hijazi', leaveType: 'Sick Leave', startDate: '2026-09-27', endDate: '2026-09-27', reason: 'Medical appointment.', status: 'Rejected' }
];

try {
  const decisions = JSON.parse(localStorage.getItem('sampleLeaveDecisions') || '{}');
  sampleRequests.forEach(request => {
    if (['Approved', 'Rejected'].includes(decisions[request.id])) request.status = decisions[request.id];
  });
} catch (_) { /* Keep the sample requests available. */ }

const box = document.getElementById('requests');
let activeFilter = 'All';

function savedRequests() {
  try {
    const stored = JSON.parse(localStorage.getItem('leaveApplications') || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.warn('Could not read saved leave requests.', error);
    return [];
  }
}

function requestCard(request, saved) {
  const card = document.createElement('article');
  card.className = 'card';
  const heading = document.createElement('div');
  heading.className = 'name';
  const summary = document.createElement('div');
  const name = document.createElement('h3');
  name.textContent = request.employee || 'Employee';
  const details = document.createElement('p');
  details.className = 'details';
  details.textContent = `${request.leaveType || 'Leave'} · ${request.startDate || ''}${request.endDate && request.endDate !== request.startDate ? ` – ${request.endDate}` : ''}`;
  const status = document.createElement('span');
  status.className = `status ${(request.status || 'Pending').toLowerCase()}`;
  status.textContent = request.status || 'Pending';
  summary.append(name, details);
  heading.append(summary, status);
  const reason = document.createElement('p');
  reason.className = 'reason';
  reason.textContent = request.reason || 'No reason provided.';
  card.append(heading, reason);

  if (request.status === 'Pending') {
    for (const [label, nextStatus, className] of [['Approve', 'Approved', 'approve'], ['Reject', 'Rejected', 'reject']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.textContent = label;
      button.addEventListener('click', () => {
        if (saved) {
          const all = savedRequests();
          const entry = all.find(item => String(item.id) === String(request.id));
          if (entry) entry.status = nextStatus;
          localStorage.setItem('leaveApplications', JSON.stringify(all));
        } else {
          request.status = nextStatus;
          const decisions = JSON.parse(localStorage.getItem('sampleLeaveDecisions') || '{}');
          decisions[request.id] = nextStatus;
          localStorage.setItem('sampleLeaveDecisions', JSON.stringify(decisions));
        }
        renderRequests();
      });
      card.append(button);
    }
  }
  return card;
}

function renderRequests() {
  box.replaceChildren();
  const all = [...savedRequests().map(request => ({ request, saved: true })), ...sampleRequests.map(request => ({ request, saved: false }))];
  const visible = all.filter(({ request }) => activeFilter === 'All' || request.status === activeFilter);
  if (!visible.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No requests in this category.';
    box.append(empty);
  }
  visible.forEach(({ request, saved }) => box.append(requestCard(request, saved)));
  document.querySelectorAll('#filter button').forEach(button => button.classList.toggle('active', button.dataset.status === activeFilter));
}

function filterRequests(status) {
  activeFilter = status;
  renderRequests();
}

renderRequests();
