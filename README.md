<div align="center">

# 🏢 HR Management System

### A Modern & Responsive Human Resources Management Platform

A front-end **HR Management System** designed to simplify employee management, task tracking, leave requests, company policies, feedback, meetings, and internal HR operations.

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

**🌐 Live Demo:** [View Website](https://hr-management-system-group-4.github.io/HR-Management-System/Ahmad/Homepage/index.html)

**📦 Repository:** [GitHub Repository](https://github.com/HR-Management-System-Group-4/HR-Management-System)

---

</div>

## 📖 About the Project

The **HR Management System** is a responsive web application created to organize and simplify common Human Resources operations inside a company.

The system provides different functionality according to the logged-in user's role.

**HR users** can manage employees, tasks, leave requests, feedback, company policies, and meetings.

**Employees** can manage their profiles, review assigned tasks, submit solutions, request leave, send feedback, view company policies, and access company meetings.

The project was developed using **HTML5, CSS3, Bootstrap, JavaScript, JSON, and LocalStorage**, with a focus on responsive design, clean user experience, form validation, role-based functionality, and collaborative front-end development.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- Client-side login using employee email and password.
- JavaScript form validation.
- Authentication using locally stored application data.
- Automatic identification of the logged-in user's role.
- Role-based redirection after login.
- Session management using `LocalStorage`.
- Dynamic navigation based on authentication state and user role.

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
- Search employees by:
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
- Add notes to task submissions.
- View all leave requests.
- Approve or reject leave requests.
- Filter leave requests by employee or status.
- View company policies.
- View employee feedback.
- Manage company video meetings.

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
- Access company meetings.

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

### HR Task Actions

```text
Create → Assign → Edit → Delete → Review → Approve
```

### Employee Task Actions

```text
View → Start → Submit Solution → Review Feedback → Resubmit
```

---

## 🏖️ Leave Management

Employees can submit leave requests containing:

- Leave type
- Start date
- End date
- Reason

Employees can also view previous requests and track their current status.

HR can review all leave requests and:

- Approve requests.
- Reject requests.
- Filter requests by employee.
- Filter requests by status.

---

## 📜 Company Policies

The system includes a dedicated **Company Policies** section.

Policy information is loaded from JSON data and displayed to authenticated users through an accessible interface.

---

## 💬 Feedback System

Employees can send feedback to HR through the Contact / Feedback interface.

Submitted feedback is stored using `LocalStorage` and can later be reviewed from the HR side of the application.

---

## 🎥 Video Meetings

The platform includes functionality for company video meetings.

HR can manage employee meeting requests and create meeting rooms for approved requests.

The current implementation supports **Jitsi meeting rooms**, while existing meeting links can also remain accessible where applicable.

Meeting-related data is handled on the client side using browser storage.

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

Changes are handled using JavaScript and persisted locally when required.

---

## 🏠 Main Pages & Modules

The application contains several connected pages and modules:

| Page / Module | Purpose |
|---|---|
| 🏠 Home | Introduction and overview of the platform |
| 🔐 Login | User authentication |
| 👤 Profile | Employee and HR profile information |
| 👥 Employees | HR employee management |
| ✅ Tasks | Task creation, assignment, submission and tracking |
| 🏖️ Leave | Leave request submission and management |
| 📜 Policies | Company policies |
| 💬 Feedback | Employee-to-HR feedback |
| 🎥 Meetings | Video meeting management |
| ℹ️ About Us | Project and team information |
| 📞 Contact Us | Contact information and feedback |

---

## 🧭 Dynamic Navigation

The navigation changes according to the authentication state and user role.

### Guest

```text
Home
About
Contact
Login
```

### Employee

```text
Home
Profile
Tasks
Leave Requests
Policies
Meetings
Logout
```

### HR

```text
Dashboard
Employees
Tasks
Leave Requests
Policies
Feedback
Meetings
Logout
```

---

## 💻 Technologies Used

### Front-End

| Technology | Usage |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** | Custom styling, layouts and animations |
| **Bootstrap** | Responsive grid and UI components |
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
| **GitHub** | Repository hosting and team collaboration |
| **Figma** | Wireframes, mockups and prototype |
| **Trello** | Agile workflow and task management |

---

## 🗃️ Data Management

Because the project is implemented as a front-end application, browser storage is used to simulate persistent application data.

`LocalStorage` is used for information such as:

```text
users
employees
currentUser
tasks
leaveRequests
feedback
profileUpdates
meetingData
```

JSON files are also used for predefined application data such as employee information and company policies.

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

### 👉 [Open Figma Design](https://www.figma.com/design/aWfk1DFm8dUlGnbCTTzprD/HR-Managment-Group4?node-id=0-1&t=DJYxDR35R90X3uMN-1)

---

## 📋 Project Management

The project follows an **Agile / Scrum-style collaborative workflow**.

Tasks, responsibilities, project progress, and workflow organization are managed through Trello.

### Project Roles

- **Product Owner:** Mohammad Azzam
- **Scrum Master:** Sara Sawalmeh

### 👉 [Open Trello Board](https://trello.com/invite/b/6abc0ac86c1336877c016551/ATTI3ae98a32a5bc0963957f3bd82ba0ccecCB5F0948/my-trello-board)

---

## 📁 Project Structure

The repository is organized around the modules developed by the team, together with shared assets and layout components:

```text
HR-Management-System/
│
├── Ahmad/
│   ├── Homepage/
│   ├── HR-tasks/
│   ├── HR-zoom/
│   ├── Meeting-Zoom/
│   └── Login/
│
├── Mohamad/
│   ├── Employee-profile/
│   ├── Employee-edit-profile/
│   ├── Hr-profile/
│   └── My-Employee-Information/
│
├── Sara_Dolat/
│   ├── log in/
│   ├── Leave-HR/
│   └── company policies/
│
├── Sara_Sawalmeh/
│   ├── Employee_Task/
│   ├── Feedback_HR/
│   └── Policies/
│
├── Timaaa/
│   ├── Dashboard-HR/
│   ├── Leave-application/
│   ├── services/
│   └── task_page/
│
├── Yasmeen_Telfah/
│   ├── employeeManagement/
│   ├── aboutUs/
│   ├── feedbackEmployees/
│   ├── feedbackHr/
│   └── team/
│
├── Footer/
├── Side_Bar/
├── Json-Images/
├── assets/
├── layout/
├── nav-bar/
│
├── employee.json
├── layout.css
├── index.html
└── README.md
```

The root `index.html` acts as the project entry point and routes users into the integrated application.

---

## 🚀 Getting Started

To run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/HR-Management-System-Group-4/HR-Management-System.git
```

### 2. Open the Project Folder

```bash
cd HR-Management-System
```

### 3. Run the Application

Open the project using a local development server such as **Live Server**.

You can start from:

```text
index.html
```

or directly from:

```text
Ahmad/Homepage/index.html
```

Using a development server is recommended because some pages load JSON files and shared resources using `fetch()`.

### 🌐 Online Version

The deployed application is available through GitHub Pages:

[Open Live Demo](https://hr-management-system-group-4.github.io/HR-Management-System/Ahmad/Homepage/index.html)

---

## 🧪 Validation

JavaScript validation is implemented throughout relevant forms to help ensure that user-entered information is valid before being processed.

Validation is used for:

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

The project was developed collaboratively using Git and GitHub.

A typical development workflow is:

```bash
# Update local repository
git pull origin main

# Create or switch to a feature branch
git checkout -b feature/feature-name

# Stage changes
git add .

# Commit changes
git commit -m "Add feature description"

# Push the branch
git push origin feature/feature-name
```

Changes are then reviewed, integrated, and merged into the main project branch.

---

## 👨‍💻 Development Team

This project was built collaboratively by **Group 4**.

### 🧭 Team Roles

| Role | Team Member |
|---|---|
| 📌 **Product Owner** | **Mohammad Azzam** |
| 🔄 **Scrum Master** | **Sara Sawalmeh** |

### 👥 Team Members & Contributions

| Team Member | GitHub | Main Contribution |
|---|---|---|
| **Mohammad Azzam** — Product Owner | [@moazzam9444-wq](https://github.com/moazzam9444-wq) | Employee & HR profile pages, profile editing, employee information views, and employee JSON/data updates. |
| **Sara Sawalmeh** — Scrum Master | [@sarasawalmeh30-debug](https://github.com/sarasawalmeh30-debug) | Company Policies, Employee Task pages, and HR Feedback review interfaces. |
| **Yasmeen Telfah** | [@yasmeenht](https://github.com/yasmeenht) | Employee Management module, About Us styling, responsive UI refinements, and dark/light mode implementation. |
| **Ahmad Bani Hamad** | [@ahmadfa100](https://github.com/ahmadfa100) | Homepage and About section, HR Task Management, meeting integration, shared navigation, and project-wide integration fixes. |
| **Sara Al-Doulat** | [@saraaldoulat2749-art](https://github.com/saraaldoulat2749-art) | Login/authentication interface and logic, plus HR leave-request review and management. |
| **Taima Afreahat** | [@taimaafreahat4](https://github.com/taimaafreahat4) | HR Dashboard, Leave Application, Services page, and related dashboard functionality. |

### 🤝 Shared Repository Contributions

The team collaborated on:

```text
🎨 UI / UX Implementation
💻 Front-End Development
⚙️ JavaScript Functionality
📦 LocalStorage Data Management
🧑‍💼 HR Dashboard
👤 Employee Profiles
👥 Employee Management
✅ Task Management
🏖️ Leave Management
💬 Feedback System
📜 Company Policies
🎥 Video Meetings
📱 Responsive Design
🧪 Testing & Debugging
🔀 Git / GitHub Collaboration
```

---

## 🤝 Team Collaboration

Development responsibilities were distributed among team members while maintaining a shared visual identity and consistent application behavior.

The team used:

- **GitHub** for source control, feature branches, integration, and collaboration.
- **Trello** for task organization and project progress.
- **Figma** for UI/UX design, wireframes, mockups, and prototyping.
- **Agile / Scrum-style practices** to organize responsibilities and teamwork.

---

## 🎯 Project Goals

The main goals of the project are to demonstrate practical understanding of:

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
• Secure password hashing
• Email notifications
• Advanced HR analytics
• Attendance management
• Payroll management
• Real-time notifications
• Cloud database integration
```

---

## 📌 Project Information

| | |
|---|---|
| **Project** | HR Management System |
| **Team** | Group 4 |
| **Type** | Front-End Web Application |
| **Methodology** | Agile / Scrum-style Team Development |
| **Product Owner** | Mohammad Azzam |
| **Scrum Master** | Sara Sawalmeh |
| **Design** | Figma |
| **Project Management** | Trello |
| **Version Control** | Git & GitHub |
| **Deployment** | GitHub Pages |

---

<div align="center">

## 🌟 HR Management System

**Manage People. Organize Work. Simplify HR.**

<br>

### 🔗 Quick Links

**[Figma](https://www.figma.com/design/aWfk1DFm8dUlGnbCTTzprD/HR-Managment-Group4?node-id=0-1&t=DJYxDR35R90X3uMN-1) • [Trello](https://trello.com/invite/b/6abc0ac86c1336877c016551/ATTI3ae98a32a5bc0963957f3bd82ba0ccecCB5F0948/my-trello-board) • [Live Demo](https://hr-management-system-group-4.github.io/HR-Management-System/Ahmad/Homepage/index.html) • [Repository](https://github.com/HR-Management-System-Group-4/HR-Management-System)**

<br>

Built with ❤️ by **Group 4**

</div>
