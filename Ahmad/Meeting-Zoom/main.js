const form = document.querySelector("#meetingForm");
const message = document.querySelector("#message");
const feedback = document.querySelector("#formFeedback");

const storageKey = "ahmadMeetingRequests";
const activeRequestKey = "ahmadActiveMeetingRequest";

// Number of requests displayed before "Show more"
const requestPreviewLimit = 3;

// Is the request history expanded?
let requestHistoryExpanded = false;

/* =========================================================
   READ REQUESTS
========================================================= */

function readRequests() {
  try {
    const requests = JSON.parse(localStorage.getItem(storageKey) || "[]");

    return Array.isArray(requests) ? requests : [];
  } catch (error) {
    console.warn("Meeting requests could not be loaded.", error);

    return [];
  }
}

/* =========================================================
   VALIDATE ZOOM URL
========================================================= */

function zoomUrl(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      (url.hostname === "zoom.us" || url.hostname.endsWith(".zoom.us")) &&
      /^\/(?:j\/\d+|my\/[a-z0-9._-]+|wc\/join\/\d+)\/?$/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}

/* =========================================================
   VALIDATE JITSI URL
========================================================= */

function jitsiUrl(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "meet.jit.si" &&
      /^\/[a-z0-9_-]{16,100}\/?$/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}

/* =========================================================
   GET STATUS INFORMATION
========================================================= */

function getStatusInfo(status) {
  const currentStatus = (status || "Pending").toLowerCase();

  if (currentStatus === "scheduled") {
    return {
      label: "Scheduled",
      className: "scheduled",
      icon: "bi-calendar-check",
    };
  }

  if (currentStatus === "completed") {
    return {
      label: "Completed",
      className: "completed",
      icon: "bi-check-lg",
    };
  }

  if (currentStatus === "rejected") {
    return {
      label: "Rejected",
      className: "rejected",
      icon: "bi-x-lg",
    };
  }

  if (currentStatus === "cancelled") {
    return {
      label: "Cancelled",
      className: "cancelled",
      icon: "bi-slash-circle",
    };
  }

  return {
    label: "Pending",
    className: "pending",
    icon: "bi-clock",
  };
}

/* =========================================================
   FORMAT REQUEST DATE
========================================================= */

function formatRequestDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "Date unavailable",
      time: "",
    };
  }

  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),

    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

/* =========================================================
   CREATE ONE TIMELINE REQUEST
========================================================= */
function createRequestItem(request, index) {
  const status = getStatusInfo(request.status);
  const sentAt = formatRequestDate(request.sentAt);

  const item = document.createElement("article");

  item.className = `request-item request-item-${status.className}`;

  /* ========================================
     Timeline marker
  ======================================== */

  const rail = document.createElement("div");

  rail.className = "request-rail";

  const marker = document.createElement("span");

  marker.className = `request-marker ${status.className}`;

  marker.innerHTML = `
    <i
      class="bi ${status.icon}"
      aria-hidden="true"
    ></i>
  `;

  rail.append(marker);

  /* ========================================
     Main content
  ======================================== */

  const body = document.createElement("div");

  body.className = "request-item-body";

  /* Top row */

  const top = document.createElement("div");

  top.className = "request-item-top";

  const titleArea = document.createElement("div");

  titleArea.className = "request-title-area";

  const titleRow = document.createElement("div");

  titleRow.className = "request-title-row";

  const title = document.createElement("h3");

  title.textContent = request.purpose || "Meeting request";

  titleRow.append(title);

  /* Latest request */

  if (index === 0) {
    const latest = document.createElement("span");

    latest.className = "request-latest";

    latest.innerHTML = `
      <span></span>
      Latest
    `;

    titleRow.append(latest);
  }

  /* Date */

  const meta = document.createElement("div");

  meta.className = "request-meta";

  meta.innerHTML = `
    <i
      class="bi bi-calendar3"
      aria-hidden="true"
    ></i>

    <span>${sentAt.date}</span>

    ${
      sentAt.time
        ? `
          <span class="request-meta-dot"></span>
          <span>${sentAt.time}</span>
        `
        : ""
    }
  `;

  titleArea.append(titleRow, meta);

  /* Status */

  const statusPill = document.createElement("span");

  statusPill.className = `request-status ${status.className}`;

  statusPill.innerHTML = `
    <span class="request-status-dot"></span>
    ${status.label}
  `;

  top.append(titleArea, statusPill);

  body.append(top);

  /* ========================================
     Message
  ======================================== */

  if (request.message) {
    const requestMessage = document.createElement("p");

    requestMessage.className = "request-preview-message";

    requestMessage.textContent = request.message;

    body.append(requestMessage);
  }

  /* ========================================
     Scheduled meeting
  ======================================== */

  if (status.className === "scheduled" && request.meeting) {
    const meetingRow = document.createElement("div");

    meetingRow.className = "request-schedule-row";

    let meetingLabel = request.meeting.whenLabel || "Meeting scheduled";

    if (request.meeting.date && request.meeting.time) {
      const meetingDate = new Date(
        `${request.meeting.date}T${request.meeting.time}`,
      );

      if (!Number.isNaN(meetingDate.getTime())) {
        meetingLabel = meetingDate.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
      }
    }

    meetingRow.innerHTML = `
      <i
        class="bi bi-camera-video"
        aria-hidden="true"
      ></i>

      <span>
        ${
          request.meeting.link && jitsiUrl(request.meeting.link)
            ? "Jitsi Meet"
            : "Video meeting"
        }
      </span>

      <span class="request-meta-dot"></span>

      <strong>
        ${meetingLabel}
      </strong>
    `;

    body.append(meetingRow);
  }

  item.append(rail, body);

  return item;
}

/* =========================================================
   DISPLAY REQUEST HISTORY
========================================================= */
function displayRequestHistory(requests) {
  const statuses = document.querySelector("#requestStatuses");

  statuses.replaceChildren();

  /* ========================================
     Empty state
  ======================================== */

  if (!requests.length) {
    const card = document.createElement("section");

    card.className = "card request-history-card";

    card.innerHTML = `
      <div class="history-header">
        <div>
          <h2>Request history</h2>

          <p>
            Track the status of your meeting requests.
          </p>
        </div>
      </div>

      <div class="history-empty">

        <span class="history-empty-icon">
          <i
            class="bi bi-chat-square-text"
            aria-hidden="true"
          ></i>
        </span>

        <div>
          <strong>No meeting requests yet</strong>

          <p>
            Once you send a request,
            its progress will appear here.
          </p>
        </div>

      </div>
    `;

    statuses.append(card);

    return;
  }

  /* Newest first */

  const orderedRequests = [...requests].reverse();

  /* ========================================
     Main card
  ======================================== */

  const card = document.createElement("section");

  card.className = "card request-history-card";

  /* ========================================
     Header
  ======================================== */

  const header = document.createElement("div");

  header.className = "history-header";

  const headerCopy = document.createElement("div");

  headerCopy.innerHTML = `
    <h2>
      Request history
    </h2>

    <p>
      Track the status of your meeting requests.
    </p>
  `;

  const counter = document.createElement("span");

  counter.className = "history-count";

  counter.innerHTML = `
    ${orderedRequests.length}
    <span>
      ${orderedRequests.length === 1 ? "request" : "requests"}
    </span>
  `;

  header.append(headerCopy, counter);

  /* ========================================
     Timeline
  ======================================== */

  const list = document.createElement("div");

  list.className = "request-list";

  const visibleRequests = requestHistoryExpanded
    ? orderedRequests
    : orderedRequests.slice(0, requestPreviewLimit);

  for (let i = 0; i < visibleRequests.length; i++) {
    list.append(createRequestItem(visibleRequests[i], i));
  }

  card.append(header, list);

  /* ========================================
     Show more
  ======================================== */

  if (orderedRequests.length > requestPreviewLimit) {
    const footer = document.createElement("div");

    footer.className = "history-footer";

    const button = document.createElement("button");

    button.type = "button";

    button.className = "history-toggle";

    const remaining = orderedRequests.length - requestPreviewLimit;

    if (requestHistoryExpanded) {
      button.innerHTML = `
        <span>
          Show recent requests only
        </span>

        <i
          class="bi bi-chevron-up"
          aria-hidden="true"
        ></i>
      `;
    } else {
      button.innerHTML = `
        <span>
          View ${remaining} older
          ${remaining === 1 ? "request" : "requests"}
        </span>

        <i
          class="bi bi-chevron-down"
          aria-hidden="true"
        ></i>
      `;
    }

    button.addEventListener("click", function () {
      requestHistoryExpanded = !requestHistoryExpanded;

      displayRequestHistory(requests);
    });

    footer.append(button);

    card.append(footer);
  }

  statuses.append(card);
}

/* =========================================================
   DISPLAY UPCOMING MEETING
========================================================= */

function displayUpcomingMeeting(requests) {
  const meetingBox = document.querySelector("#scheduledMeeting");

  const meetingEmpty = document.querySelector("#meetingEmpty");

  meetingBox.hidden = true;
  meetingEmpty.hidden = false;

  const request = [...requests].reverse().find(function (item) {
    return (
      item.status === "Scheduled" &&
      item.meeting &&
      (zoomUrl(item.meeting.link) || jitsiUrl(item.meeting.link))
    );
  });

  if (!request) {
    return;
  }

  const meeting = request.meeting;

  meetingBox.hidden = false;
  meetingEmpty.hidden = true;

  /* Meeting date */

  const startsAt =
    meeting.date && meeting.time
      ? new Date(`${meeting.date}T${meeting.time}`)
      : null;

  document.querySelector("#meetingWhen").textContent =
    meeting.whenLabel ||
    (startsAt && !Number.isNaN(startsAt.getTime())
      ? startsAt.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "Meeting link ready");

  /* Topic */

  document.querySelector("#meetingTopic").textContent =
    meeting.topic || request.purpose;

  /* Note */

  document.querySelector("#meetingNote").textContent =
    meeting.notes || "Your meeting room is ready.";

  /* Channel */

  document.querySelector("#meetingChannel").textContent = jitsiUrl(meeting.link)
    ? "Jitsi Meet"
    : "Zoom";

  /* Join button */

  const join = document.querySelector("#employeeJoinLink");

  join.href = jitsiUrl(meeting.link)
    ? `room.html?id=${encodeURIComponent(meeting.id)}&role=employee`
    : meeting.link;
}

/* =========================================================
   SHOW REQUESTS
========================================================= */

function showRequests() {
  const requests = readRequests();

  displayRequestHistory(requests);

  displayUpcomingMeeting(requests);
}

/* =========================================================
   MESSAGE COUNTER
========================================================= */

message.addEventListener("input", function () {
  document.querySelector("#messageCount").textContent = message.value.length;
});

/* =========================================================
   SUBMIT REQUEST
========================================================= */

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const request = {
    id: crypto.randomUUID(),

    name: document.querySelector("#employeeName").value.trim(),

    email: document.querySelector("#employeeEmail").value.trim(),

    purpose: document.querySelector("#purpose").value,

    message: message.value.trim(),

    sentAt: new Date().toISOString(),

    status: "Pending",
  };

  /* Validate message */

  if (!request.message) {
    feedback.textContent = "Please enter a message for HR.";

    message.focus();

    return;
  }

  const requests = readRequests();

  requests.push(request);

  /* Save */

  try {
    localStorage.setItem(storageKey, JSON.stringify(requests));

    localStorage.setItem(activeRequestKey, request.id);
  } catch (error) {
    showAlert(
      "error",
      "Save Failed",
      "Your meeting request could not be saved. Please try again.",
    );

    return;
  }

  /* Keep timeline collapsed after new request */

  requestHistoryExpanded = false;

  /* Reset form */

  form.reset();

  document.querySelector("#messageCount").textContent = "0";

  /* Success alert */

  showAlert(
    "success",
    "Request Submitted!",
    "Your meeting request has been saved and sent to HR.",
  );

  /* Refresh */

  showRequests();
});

/* =========================================================
   RESET FORM
========================================================= */

form.addEventListener("reset", function () {
  feedback.textContent = "";

  document.querySelector("#messageCount").textContent = "0";
});

/* =========================================================
   LISTEN FOR STORAGE CHANGES
========================================================= */

window.addEventListener("storage", function (event) {
  if (event.key === storageKey) {
    requestHistoryExpanded = false;

    showRequests();
  }
});

/* =========================================================
   REFRESH WHEN PAGE IS SHOWN
========================================================= */

window.addEventListener("pageshow", showRequests);

/* =========================================================
   INITIAL DISPLAY
========================================================= */

showRequests();
