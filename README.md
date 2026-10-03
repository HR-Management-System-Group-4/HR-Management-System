<div align="center">

# 🏢 HR Management System

### A modern, responsive Human Resources Management platform

A front-end HR Management System designed to simplify employee management, task tracking, leave requests, company policies, feedback, and internal HR operations.

<br>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)](https://www.json.org/)

<br>

### 🔗 Project Links

| 🎨 UI/UX Design | 📋 Project Management |
| :---: | :---: |
| **[View Figma Design](https://www.figma.com/design/aWfk1DFm8dUlGnbCTTzprD/HR-Managment-Group4?node-id=0-1&t=DJYxDR35R90X3uMN-1)** | **[View Trello Board](https://trello.com/invite/b/6abc0ac86c1336877c016551/ATTI3ae98a32a5bc0963957f3bd82ba0ccecCB5F0948/my-trello-board)** |
| Mockups • Wireframes • Prototype | Tasks • Workflow • Team Progress |

<br>
**🌐 Live Demo:** [View Website](LIVE_DEMO_LINK)

**📦 Repository:** [GitHub Repository](GITHUB_REPOSITORY_LINK)

---

</div>

## 📖 About the Project

The **HR Management System** is a responsive web application created to organize and simplify common Human Resources operations inside a company.

The system provides different functionality according to the logged-in user's role. HR users can manage employees, tasks, leave requests, feedback, company policies, and meetings, while employees can manage their profiles, review assigned tasks, submit solutions, request leave, send feedback, and access company information.

The project was developed using **HTML5, CSS3, Bootstrap, JavaScript, JSON, and LocalStorage**, with a focus on responsive design, clean user experience, form validation, and role-based functionality.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- Secure-style login flow using employee email and password.
- JavaScript form validation.
- User authentication using data stored locally.
- Automatic identification of the logged-in user's role.
- Role-based redirection after login.
- Session management using `LocalStorage`.
- Dynamic navigation depending on authentication status.

---

## 👥 User Roles

The system contains two primary user roles:

### 👨‍💼 HR

HR users have administrative access to the system and can:

- View all employees.
- Add new employees.
- Edit employee information.
- Delete employees.
- Search and filter employees.
- Search by:
  - Name
  - Email
  - Department
- Create tasks.
- Assign tasks to employees.
- Edit and delete tasks.
- Track task progress.
- Review submitted employee solutions.
- Approve completed tasks.
- Request changes when necessary.
- Add notes to employees' task submissions.
- View all leave requests.
- Approve or reject leave requests.
- Filter leave requests by employee or status.
- View company policies.
- View employee feedback.
- Manage video meetings.

### 👤 Employee

Employees can:

- Log in using an account created by HR.
- View their personal profile.
- Edit permitted profile information.
- View only the tasks assigned to them.
- Open assigned tasks.
- Submit task solutions to HR.
- Track task status.
- Submit leave requests.
- View their leave-request history.
- Track leave-request status.
- View company policies.
- Send feedback to HR.
- Access video meetings.

---

## 🧑‍💼 Employee Management

The HR dashboard provides centralized employee management.

Employee profiles can include:

| Information | Description |
|---|---|
| 🖼️ Profile Picture | Employee image |
| 👤 Name | Full employee name |
| 📧 Email | Employee email address |
| 📞 Phone | Contact number |
| 💼 Position | Current job position |
| 🏢 Department | Employee department |
| 📅 Joining Date | Employment start date |
| 🟢 Status | Current employee status |

HR can **add, update, delete, search, and filter employees**, while normal employees only have access to their own profile information.

---

## ✅ Task Management

The Task Management module allows HR to create and assign work to employees.

Each task can contain:

| Field | Description |
|---|---|
| Task Title | Name of the task |
| Description | Detailed task requirements |
| Assigned To | Responsible employee |
| Priority | Low / Medium / High |
| Due Date | Task deadline |
| Status | Current task progress |

### Task Status Workflow

```text
Pending
   ↓
In Progress
   ↓
Submitted
   ↓
HR Review
   ↓
Completed
```

If changes are required:

```text
Submitted
   ↓
Request Changes
   ↓
Employee Updates Solution
   ↓
Submitted
   ↓
Completed
```

HR can:

`Create → Assign → Edit → Delete → Review → Approve`

Employees can:

`View → Start → Submit Solution → Review Feedback → Resubmit`

---

## 🏖️ Leave Management

Employees can submit leave requests containing information such as:

- Leave type
- Start date
- End date
- Reason

Employees can view their previous requests and track their status.

HR can review all leave requests and:

- Approve requests.
- Reject requests.
- Filter requests by employee.
- Filter requests by status.

---

## 📜 Company Policies

The system includes a dedicated **Company Policies** section.

Policy information is loaded from a JSON file and displayed to authenticated users in a clear and accessible interface.

---

## 💬 Feedback System

Employees can communicate feedback to HR through the Contact / Feedback form.

Submitted feedback is stored using `LocalStorage` and can later be reviewed from the HR side of the application.

---

## 🎥 Video Meetings

The platform also includes functionality for company meetings.

HR reviews employee requests and creates a unique Jitsi room for each approved request. The **Join now** button opens the room inside the site for HR and the employee. The first person starting a room on the public `meet.jit.si` service may need to sign in to Jitsi. Existing Zoom meeting links remain available through their original URL; HR can create a replacement Jitsi room from the meeting details. Request and room data are stored in browser `localStorage`, so both roles must use the same browser and site origin.

---

## 👤 Profile Management

Each employee has an individual profile containing personal and professional information.

The profile may include:

```text
Profile Picture
Name
Email
Phone
Position
Department
Joining Date
Status
```

Employees can modify only the information they are permitted to edit.

Changes are handled through JavaScript and persisted locally when required.

---

## 🏠 Main Pages

The application is organized into several pages and modules:

| Page / Module | Purpose |
|---|---|
| 🏠 Home | Introduction and overview of the platform |
| 🔐 Login | User authentication |
| 👤 Profile | Employee information |
| 👥 Employees | HR employee management |
| ✅ Tasks | Task creation, assignment and tracking |
| 🏖️ Leave | Leave request management |
| 📜 Policies | Company policies |
| 💬 Feedback | Employee-to-HR feedback |
| 🎥 Meetings | Video meeting management |
| ℹ️ About Us | Project and team information |
| 📞 Contact Us | Contact information and feedback form |

---

## 🧭 Dynamic Navigation

The navigation bar changes according to the current user's authentication state and role.

For example:

```text
Guest
→ Home
→ About
→ Contact
→ Login
```

```text
Employee
→ Home
→ Profile
→ Tasks
→ Leave Requests
→ Policies
→ Meetings
→ Logout
```

```text
HR
→ Dashboard
→ Employees
→ Tasks
→ Leave Requests
→ Policies
→ Feedback
→ Meetings
→ Logout
```

---

## 💻 Technologies Used

### Front-End

| Technology | Usage |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** | Custom styles, animations and layouts |
| **Bootstrap** | Grid system and responsive UI components |
| **JavaScript** | Application logic and interactivity |

### Data & Storage

| Technology | Usage |
|---|---|
| **JSON** | Employee and company-policy data |
| **LocalStorage** | Persistent browser-side application data |
| **Session Storage / LocalStorage** | User-session handling where applicable |

### Collaboration & Design

| Tool | Usage |
|---|---|
| **Git** | Version control |
| **GitHub** | Repository and team collaboration |
| **Figma** | Wireframes, mockups and prototype |
| **Trello** | Agile task and workflow management |

---

## 🗃️ Data Management

Since the project is implemented as a front-end application, browser storage is used to simulate persistent application data.

`LocalStorage` can manage information such as:

```text
users
employees
currentUser
tasks
leaveRequests
feedback
profileUpdates
```

JSON files are used for predefined data such as employee information and company policies.

---

## 📱 Responsive Design

The application is designed to work across different screen sizes using:

- Bootstrap Grid System
- Responsive navigation
- Flexible layouts
- Media queries
- Responsive images
- Mobile-friendly forms
- Responsive tables and cards

Supported layouts include:

```text
🖥️ Desktop
💻 Laptop
📱 Tablet
📱 Mobile
```

---

## 🎨 UI / UX Design

The complete interface design process is available on Figma.

It includes:

- Wireframes
- Mockups
- Page layouts
- UI components
- Responsive concepts
- Interactive prototype

### 👉 [Open Figma Design](FIGMA_LINK)

---

## 📋 Project Management

The project follows an **Agile-style collaborative workflow**.

Tasks, assignments, progress, and project organization are managed through Trello.

### 👉 [Open Trello Board](TRELLO_LINK)

---

## 📁 Project Structure

The repository can generally be organized using the following structure:

```text
HR-Management-System/
│
├── index.html
│
├── pages/
│   ├── login.html
│   ├── profile.html
│   ├── employees.html
│   ├── tasks.html
│   ├── leave.html
│   ├── policies.html
│   ├── feedback.html
│   ├── meetings.html
│   ├── about.html
│   └── contact.html
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── css/
│   └── style.css
│
├── js/
│   ├── auth.js
│   ├── employees.js
│   ├── tasks.js
│   ├── leave.js
│   └── main.js
│
├── data/
│   ├── employees.json
│   └── policies.json
│
└── README.md
```

> **Note:** Update this structure to match the actual folders and files used in the repository.

---

## 🚀 Getting Started

To run the project locally:

### 1. Clone the repository

```bash
git clone GITHUB_REPOSITORY_LINK
```

### 2. Open the project folder

```bash
cd HR-Management-System
```

### 3. Run the application

Open:

```text
index.html
```

in your browser. The root page opens the homepage at `Ahmad/Homepage/index.html` while keeping its existing asset paths and page links intact.

Run the project through a local development server such as **Live Server** so pages that load JSON and shared layout files with `fetch()` work correctly.

---

## 🧪 Validation

JavaScript validation is implemented throughout relevant forms to help ensure that user-entered information is valid before being processed.

Validation is used for functionality such as:

```text
Login
Employee Data
Profile Updates
Leave Requests
Task Forms
Feedback Forms
```

---

## 🔄 Git & GitHub Workflow

The project is developed collaboratively using Git and GitHub.

A typical workflow is:

```bash
# Update local repository
git pull origin main

# Create or switch to your branch
git checkout -b feature/feature-name

# Add changes
git add .

# Commit changes
git commit -m "Add feature description"

# Push branch
git push origin feature/feature-name
```

Changes can then be reviewed and merged into the main branch.

---

## 👨‍💻 Development Team

This project was built collaboratively by **Group 4**.

| Team Member | GitHub | Main Contribution |
|---|---|---|
| **[Member Name]** | [@username](GITHUB_PROFILE_LINK) | [Pages / Features / Responsibilities] |
| **[Member Name]** | [@username](GITHUB_PROFILE_LINK) | [Pages / Features / Responsibilities] |
| **[Member Name]** | [@username](GITHUB_PROFILE_LINK) | [Pages / Features / Responsibilities] |
| **[Member Name]** | [@username](GITHUB_PROFILE_LINK) | [Pages / Features / Responsibilities] |

### Repository Contributions

The team collaborated on:

```text
🎨 UI / UX Implementation
💻 Front-End Development
⚙️ JavaScript Functionality
📦 LocalStorage Data Management
🧑‍💼 HR Dashboard
👤 Employee Dashboard
✅ Task Management
🏖️ Leave Management
💬 Feedback System
📜 Company Policies
📱 Responsive Design
🧪 Testing & Debugging
🔀 Git / GitHub Collaboration
```

> Replace the placeholders above with each team member's real name, GitHub username, and specific contribution.

---

## 🤝 Team Collaboration

Development responsibilities were distributed among team members while maintaining a shared design system and consistent application behavior.

GitHub was used for source control and code collaboration, **Trello** for task organization and progress tracking, and **Figma** for UI/UX design and prototyping.

---

## 🎯 Project Goals

The main goals of this project are to demonstrate practical understanding of:

```text
✓ Semantic HTML
✓ Modern CSS
✓ Bootstrap
✓ Responsive Web Design
✓ JavaScript
✓ DOM Manipulation
✓ Form Validation
✓ JSON
✓ LocalStorage
✓ Authentication Logic
✓ Role-Based Interfaces
✓ Git & GitHub
✓ Team Collaboration
✓ Agile Workflow
```

---

## 🔮 Possible Future Improvements

The project can later be expanded with technologies and features such as:

```text
• Real back-end authentication
• REST API integration
• SQL / NoSQL database
• Password encryption
• Email notifications
• Advanced HR analytics
• Attendance management
• Payroll management
• Real-time notifications
• Cloud deployment
```

---

## 📌 Project Information

| | |
|---|---|
| **Project** | HR Management System |
| **Team** | Group 4 |
| **Type** | Front-End Web Application |
| **Methodology** | Agile / Team-Based Development |
| **Design** | Figma |
| **Project Management** | Trello |
| **Version Control** | Git & GitHub |

---

<div align="center">

## 🌟 HR Management System

**Manage people. Organize work. Simplify HR.**

<br>

### 🔗 Quick Links

**[Figma](FIGMA_LINK) • [Trello](TRELLO_LINK) • [Live Demo](LIVE_DEMO_LINK) • [Repository](GITHUB_REPOSITORY_LINK)**

<br>

Built with ❤️ by **Group 4**

</div>
