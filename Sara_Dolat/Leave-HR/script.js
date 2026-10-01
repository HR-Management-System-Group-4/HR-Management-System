let requests = [
    {
        id: 1,
        name: "Ahmad Saleh",
        leaveType: "Annual Leave",
        date: "12 - 16 Oct 2026",
        reason: "Family holiday planned in advance.",
        status: "Pending"
    },
    {
        id: 2,
        name: "Dana Rimawi",
        leaveType: "Annual Leave",
        date: "4 - 5 Oct 2026",
        reason: "Personal commitments.",
        status: "Approved"
    },
    {
        id: 3,
        name: "Tariq Hijazi",
        leaveType: "Sick Leave",
        date: "27 Sep 2026",
        reason: "Medical appointment.",
        status: "Rejected"
    }
];


let box = document.getElementById("requests");


function show(data) {

    box.innerHTML = "";


    data.forEach(function(request) {

        box.innerHTML += `

        <div class="card">

            <div class="name">

                <div>
                    <h3>${request.name}</h3>

                    <p class="details">
                        ${request.leaveType}
                        · ${request.date}
                        
                    </p>
                </div>

                <span class="status ${request.status.toLowerCase()}">
                    ${request.status}
                </span>

            </div>

            <p class="reason">
                ${request.reason}
            </p>

            ${
                request.status == "Pending"
                ?
                `
                <button
                    class="approve"
                    onclick="approve(${request.id})">
                    Approve
                </button>

                <button
                    class="reject"
                    onclick="reject(${request.id})">
                    Reject
                </button>
                `
                :
                ""
            }

        </div>

        `;
    });
}


function approve(id) {

    let request = requests.find(r => r.id == id);

    request.status = "Approved";

    show(requests);
}


function reject(id) {

    let request = requests.find(r => r.id == id);

    request.status = "Rejected";

    show(requests);
}


function filterRequests(status) {

    if (status == "All") {

        show(requests);

    } else {

        let result = requests.filter(function(request) {
            return request.status == status;
        });

        show(result);
    }
}


show(requests);