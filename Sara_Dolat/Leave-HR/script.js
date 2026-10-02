let requests = JSON.parse(localStorage.getItem("leaveApplications")) || [
  { id: 1, name: "Ahmad Saleh", leaveType: "Annual Leave", date: "12 - 16 Oct 2026", reason: "Family holiday planned in advance.", status: "Pending" },
  { id: 2, name: "Dana Rimawi", leaveType: "Annual Leave", date: "4 - 5 Oct 2026", reason: "Personal commitments.", status: "Approved" },
  { id: 3, name: "Tariq Hijazi", leaveType: "Sick Leave", date: "27 Sep 2026", reason: "Medical appointment.", status: "Rejected" }
];

let box = document.getElementById("requests");

function save() {
  localStorage.setItem("leaveApplications", JSON.stringify(requests));
}

function updateCounts() {
  document.getElementById("total").innerText = requests.length;
  document.getElementById("pendingCount").innerText = requests.filter(r => r.status == "Pending").length;
  document.getElementById("approvedCount").innerText = requests.filter(r => r.status == "Approved").length;
  document.getElementById("rejectedCount").innerText = requests.filter(r => r.status == "Rejected").length;
}

function show(data) {
  box.innerHTML = "";

  data.forEach(r => {
    box.innerHTML += `
      <div class="card">

        <div class="name">
          <div>
            <h3>${r.employee}</h3>
            <p class="details">${r.leaveType}</p>
          </div>
        </div>

        <div>
          <p class="details">
            ▣ &nbsp; ${r.startDate} - ${r.endDate}
          </p>

          <p class="reason">
            ▢ &nbsp; ${r.reason}
          </p>
        </div>

        <div>

          <span class="status ${r.status.toLowerCase()}">
            ${r.status}
          </span>

          ${
            r.status == "Pending"
            ? `
              <div class="actions">

                <button class="approve" onclick="approve(${r.id})">
                  Approve
                </button>

                <button class="reject" onclick="reject(${r.id})">
                  Reject
                </button>

              </div>

              <div class="reviewed">
                Requested on ${r.createdDate}
              </div>
            `
            : `
              <div class="reviewed">
                ${r.status}
                <br>by HR Admin
              </div>
            `
          }

        </div>

      </div>
    `;
  });
}

function approve(id) {
  requests.find(r => r.id == id).status = "Approved";
  save();
  updateCounts();
  show(requests);
}

function reject(id) {
  requests.find(r => r.id == id).status = "Rejected";
  save();
  updateCounts();
  show(requests);
}

function filterRequests(status) {
  show(status == "All" ? requests : requests.filter(r => r.status == status));
}

updateCounts();
show(requests);