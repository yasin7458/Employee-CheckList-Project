# LeavePro - Employee Leave Management System

A responsive, full-featured Employee Leave Management System built with **React.js**, **React Router**, and **Tailwind CSS**, designed in accordance with the **LeavePro Practical Project Specification** and reference UI mockups.

---

## 🌟 Key Features

1. **Role-Based Experience**:
   - **Employee Role**: View dashboard metrics, apply for leave with date validation and real-time days calculation, track leave history with multi-filter search, monitor leave balances with progress meters, and view detailed request statuses.
   - **Manager Role**: Review leave requests, filter and search requests by employee/leave type, review full request details, approve/reject requests with immediate balance recalculation, and browse employee/department directories.
2. **Interactive Demo Credentials**:
   - Quick one-click login buttons on the Login page for both Employee and Manager.
   - Profile dropdown toggle to switch between Employee and Manager roles instantly on any screen.
3. **8 Screens Implemented (Matching Reference Figma UI)**:
   - **Screen 1 - Login Page**: Split-panel design with custom LeavePro branding illustration, email/password validation, show/hide password toggle, and one-click demo credentials.
   - **Screen 2 - Employee Dashboard**: Welcome banner, 4 metric cards (Total, Used, Remaining, Pending), current-year leave balance progress bars, recent requests table with status badges, and quick action shortcuts.
   - **Screen 3 - Apply Leave**: Leave type picker (CL, SL, EL, PL), start and end date pickers with validation, reason field, half-day toggle (0.5 day), real-time duration preview, reset, and submission with toast notifications.
   - **Screen 4 - Leave List (Manager View)**: Search by employee name or leave type, status filter dropdown (`All`, `Pending`, `Approved`, `Rejected`), employee avatars, date ranges, status badges, pagination, and direct `Approve` / `Reject` buttons.
   - **Screen 5 - My Leave History**: Filter by leave type and status, historical request log with dates, days, and status pills, reset button, and pagination.
   - **Screen 6 - Leave Balance**: 4 category balance cards with progress bars and remaining quotas, Leave Balance Policy table (CL: 7, SL: 5, EL: 10, PL: 5), and notice explaining approval updates.
   - **Screen 7 - Leave Details**: Complete view of employee details, leave type, date range, total days, reason, approver status, and contextual Approve/Reject buttons for managers.
   - **Screen 8 - Department & Employee Directory**: Searchable employee roster with department badges, "+ Add Employee" modal dialog, and departmental employee breakdown counts.
4. **Data Persistence**:
   - Changes (new leave applications, approvals, rejections, newly added employees) persist smoothly via `localStorage`.

---

## 🔑 Demo Credentials

| Role | Email | Password | Default User |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee@company.com` | `123456` | Piyush Nakrani (Frontend Developer) |
| **Manager** | `manager@company.com` | `123456` | Rahul Patel (Manager) |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 📐 Technology Stack

- **Framework**: React 18+
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State & Storage**: React Context API + LocalStorage
- **Build Tool**: Vite
"# Employee-CheckList-Project" 
"# Employee-project" 
"# Employee-project" 
"# Employee-CheckList-Project" 
