let requests = JSON.parse(localStorage.getItem("requests")) || [
  {
    id: 1,
    name: "Ahmad Saleh",
    leaveType: "Annual Leave",
    date: "12 - 16 Oct 2026",
    reason: "Family holiday planned in advance.",
    status: "Pending",
  },

  {
    id: 2,
    name: "Dana Rimawi",
    leaveType: "Annual Leave",
    date: "4 - 5 Oct 2026",
    reason: "Personal commitments.",
    status: "Approved",
  },

  {
    id: 3,
    name: "Tariq Hijazi",
    leaveType: "Sick Leave",
    date: "27 Sep 2026",
    reason: "Medical appointment.",
    status: "Rejected",
  },
];

let box = document.getElementById("requests");

/* =========================
   SAVE TO LOCAL STORAGE
========================= */

function saveRequests() {
  localStorage.setItem("requests", JSON.stringify(requests));
}

/* =========================
   UPDATE COUNTS
========================= */

function updateCounts() {
  let total = requests.length;

  let pending = requests.filter(function (request) {
    return request.status == "Pending";
  }).length;

  let approved = requests.filter(function (request) {
    return request.status == "Approved";
  }).length;

  let rejected = requests.filter(function (request) {
    return request.status == "Rejected";
  }).length;

  document.getElementById("total").innerText = total;

  document.getElementById("pendingCount").innerText = pending;

  document.getElementById("approvedCount").innerText = approved;

  document.getElementById("rejectedCount").innerText = rejected;
}

/* =========================
   SHOW REQUESTS
========================= */

function show(data) {
  box.innerHTML = "";

  data.forEach(function (request) {
    box.innerHTML += `

        <div class="card">

            <!-- Employee -->

            <div class="name">

                <div>

                    <h3>
                        ${request.name}
                    </h3>

                    <p class="details">
                        ${request.leaveType}
                    </p>

                </div>

            </div>


            <!-- Date + Reason -->

            <div>

                <p class="details">
                    ▣ &nbsp; ${request.date}
                </p>

                <p class="reason">
                    ▢ &nbsp; ${request.reason}
                </p>

            </div>


            <!-- Status + Actions -->

            <div>

                <span class="status ${request.status.toLowerCase()}">

                    ${
                      request.status == "Pending"
                        ? "◷ Pending"
                        : request.status == "Approved"
                          ? "✓ Approved"
                          : "× Rejected"
                    }

                </span>


                ${
                  request.status == "Pending"
                    ? `

                    <div class="actions">

                        <button
                            class="approve"
                            onclick="approve(${request.id})">

                            ✓ &nbsp; Approve

                        </button>


                        <button
                            class="reject"
                            onclick="reject(${request.id})">

                            × &nbsp; Reject

                        </button>

                    </div>


                    <div class="reviewed">
                        Requested on 2 Oct 2026
                    </div>

                    `
                    : request.status == "Approved"
                      ? `

                    <div class="reviewed">

                        Approved on 1 Oct 2026
                        <br>
                        by HR Admin

                    </div>

                    `
                      : `

                    <div class="reviewed">

                        Rejected on 26 Sep 2026
                        <br>
                        by HR Admin

                    </div>

                    `
                }

            </div>

        </div>

        `;
  });
}

/* =========================
   APPROVE
========================= */

function approve(id) {
  let request = requests.find(function (r) {
    return r.id == id;
  });

  request.status = "Approved";

  saveRequests();

  updateCounts();

  show(requests);
}

/* =========================
   REJECT
========================= */

function reject(id) {
  let request = requests.find(function (r) {
    return r.id == id;
  });

  request.status = "Rejected";

  saveRequests();

  updateCounts();

  show(requests);
}

/* =========================
   FILTER
========================= */

function filterRequests(status) {
  if (status == "All") {
    show(requests);
  } else {
    let result = requests.filter(function (request) {
      return request.status == status;
    });

    show(result);
  }
}

updateCounts();

show(requests);
