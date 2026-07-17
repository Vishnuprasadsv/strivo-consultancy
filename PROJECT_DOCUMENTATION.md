# Project Documentation: Strivo Consultancy

Strivo Consultancy is an enterprise-grade, full-stack web application engineered to manage and streamline corporate consultancy operations, client engagement, talent acquisition, and content management.

---

## 1. Technical Stack (Tech Stack)

### Frontend (Client)
*   **Core Library**: React 19
*   **Build Tool**: Vite (configured with lazy-loaded code-splitting for performance optimization)
*   **Styling**: Tailwind CSS v4, Material UI (MUI v5 with Emotion engine)
*   **Routing**: React Router DOM (v6) for declarative routing and dynamic path parameters
*   **Animations**: Framer Motion, OGL, React CountUp
*   **Data Visualization**: Recharts (for dynamic admin graphs and combined reports)
*   **Notification Engine**: Sonner & React-Toastify
*   **Client State & HTTP**: Axios (with custom request/response interceptors for automatic JWT propagation)

### Backend (Server)
*   **Runtime Environment**: Node.js
*   **Web Framework**: Express.js (v5)
*   **Database**: MongoDB with Mongoose ODM (Object Document Mapper)
*   **Security & Hashing**: JSON Web Token (JWT) for stateless session handling, BcryptJS for cryptography/password hashing
*   **File Management**: Multer (in-memory buffers) and Cloudinary API (storage integration)
*   **Email Engine**: Nodemailer (configured with secure SMTP TLS)
*   **Resume Parsing**: PDF-Parse (for PDF extraction) and Mammoth (for raw DOCX XML extraction)

---

## 2. Deployment & Hosting (Vercel)

The application employs Vercel for continuous deployment across both layers:
*   **Frontend (Client)**: Deployed as a high-performance static site with edge-routing support.
*   **Backend (Server)**: Deployed using **Vercel Serverless Functions**. The `vercel.json` configuration file at the server root directs incoming `/api/*` endpoints to the Node.js/Express server initializer (`src/server.js`), running them on demand.
*   **Cloud Data Stores**:
    *   **MongoDB**: Hosted globally on MongoDB Atlas database clusters.
    *   **Media Storage**: Cloudinary maps and holds candidates' resumes, CVs, and blog images.

---

## 3. Role-Based Access Control (RBAC) & Portal Roles

Strivo implements strict role separation between Admin (Administrator) and HR (Human Resources) roles. This permissions matrix determines which page subsystems and API endpoints are available to the user.

### Client-Side Guard Rails (`ProtectedRoute.jsx`)
*   Wraps administrative routes, reading the active session token and user profile object.
*   **HR Role Boundaries**: Blocked from accessing the global Admin Dashboard, client inquiries, case studies, or articles. Attempted access to restricted routes automatically redirects them to `/admin/career`.
*   **Admin/Administrator Role Boundaries**: Complete, unrestricted navigation access across all panels.

### Server-Side Route Guard Rails (`authMiddleware.js`)
*   **Authentication Check (`protect` middleware)**: Verifies the integrity of the JWT from HTTP-only request cookies, falling back to request authorization headers or query parameters. Retrieves user profile fields while keeping passwords secret.
*   **Authorization Check (`authorize` middleware)**: Accepts role permissions as an array. Ensures that requests originating from unauthorized roles return a 403 Forbidden response block, ensuring endpoint-level API security.

---

## 4. Frontend System Architecture (Client)

### Subsystem Overview & Core User Interfaces
The frontend is divided into three primary interfaces:
1.  **Public Visitor Site**: Open to general clients and candidates (Home, About, Contact, Services, Careerstrivo, Review, etc.). Allows submitting inquiries, job applications, and client feedback reviews.
2.  **Administrative Management Portal**: Exclusive to the Admin / Administrator role. Provides dashboard business analytics, inquiries board, review moderation sliders, and CRUD controls over Case Studies and blog Articles. (Consists of 19 views in total: 4 public auth views, 7 shared views, and 8 admin-only views. "Views" in this context refers to the specific administrative page layouts and panel interfaces within the routing structure).
3.  **HR Management Subsystem**: Accessible to both HR and Admin accounts. This subsystem is detailed below:
    *   **Recruitment status workflows**: Candidate applications (`Admincareers.jsx`) cycle through six strict recruiting statuses (`new`, `referred`, `reviewed`, `accepted`, `appointed`, `rejected`) using the recruiter panel to transition states.
    *   **Interviews and Appointments integration**: Candidates moved to `referred` automatically sync to the Interviews Board (`InterviewsAdmin.jsx`). HR can set dates/times and launch Nodemailer SMTP invites which update the calendar schedule list.
    *   **Talent Pool screening**: HR can search historical applicant profiles (`TalentPoolAdmin.jsx`) using skill keywords tags, score ranges, and date ranges.
    *   **Vacancies management**: Forms to post and edit listings (`CreateJob.jsx` / `EditJob.jsx`) with department tags and expiry dates.
    *   **Staff credentials edits**: Settings panel (`Profile.jsx`) to update email/username and verify Bcrypt passwords.

### Frontend Folder Structure & Mapped Pages
```text
client/
├── public/                 # Static public assets
└── src/                    # Source Code
    ├── Admin/              # Administrative & HR Portal Views (19 files)
    │   ├── Login.jsx              # Admin/HR portal entrance login verification
    │   ├── Register.jsx           # Account creation with role selector
    │   ├── ForgotPassword.jsx     # Sends OTP email for credential recovery
    │   ├── ResetPassword.jsx      # Updates password via validated OTP
    │   ├── Profile.jsx            # Account edits & Bcrypt password modification
    │   ├── Dashboard.jsx          # Admin dashboard, tasks checklists, and reviews approval
    │   ├── Inquiries.jsx          # Manage client inquiries, email, and proposal actions
    │   ├── CaseStudies.jsx        # Admin case studies table list
    │   ├── CreateCaseStudy.jsx    # Create case study form (future date draft triggers)
    │   ├── EditCaseStudy.jsx      # Edit case study form
    │   ├── ArticlesAdmin.jsx      # Admin blog posts table list
    │   ├── CreateArticle.jsx      # Create blog form (enforces future date draft)
    │   ├── EditArticle.jsx        # Edit article details / replace cover photos
    │   ├── Admincareers.jsx       # Job vacancies sub-tabs and resume parser match list
    │   ├── InterviewsAdmin.jsx    # Interview schedulers and Nodemailer calendar invites
    │   ├── AppointmentsAdmin.jsx  # Track and schedule consulting appointments
    │   ├── TalentPoolAdmin.jsx    # General database indexing candidates
    │   ├── CreateJob.jsx          # Add vacancy positions form
    │   └── EditJob.jsx            # Modify active vacancies form
    │
    ├── pages/              # Public Facing Pages (20 views)
    │   ├── Home.jsx               # Landing page with services highlights, reviews slider
    │   ├── About.jsx              # Company history, milestone timeline, executive bios
    │   ├── Contact.jsx            # Inquiry submissions form (integrates contact API)
    │   ├── Insight.jsx            # Insights blog list feed
    │   ├── Article.jsx            # Detailed article reading layout
    │   ├── CaseStudies.jsx        # Grid displaying success stories with category filters
    │   ├── CaseStudyDetails.jsx   # Detailed viewer displaying individual case study
    │   ├── Services.jsx           # Catalog directory of consultancy services
    │   ├── Strategic.jsx          # Strategy growth and advisory landing page
    │   ├── Operations.jsx         # Operational supply chain audits landing page
    │   ├── Digital.jsx            # Digital transformation consulting landing page
    │   ├── Change.jsx             # Restructuring advisory landing page
    │   ├── Mission.jsx            # Layout highlighting company core missions
    │   ├── Vision.jsx             # Layout outlining company visions
    │   ├── Values.jsx             # Principle explainers (integrity, client-first, etc.)
    │   ├── Career.jsx             # Job postings board and resume submittals form
    │   ├── PrivacyPolicy.jsx      # Legal privacy rules notice
    │   ├── TermsAndConditions.jsx # Standard usage terms and conditions
    │   ├── Review.jsx             # Testimonial submission form
    │   └── NotFound.jsx           # Fallback wildcard 404 page
    │
    ├── Components/         # Shared UI Components
    │   ├── Navbar.jsx             # Public header navigation panel
    │   ├── AdminNavbar.jsx        # Administrative side/top nav headers
    │   ├── Footer.jsx             # General bottom links bar
    │   ├── SEO.jsx                # Dynamically sets page meta titles and SEO tags
    │   ├── ErrorBoundary.jsx      # Catches rendering crashes and displays indicators
    │   ├── LoadingIndicator.jsx   # Global lazy load spinners
    │   └── Ready.jsx              # Bottom CTA prompt block
    │
    ├── services/           # Network Communication Services
    │   ├── allApi.js              # Maps individual CRUD endpoints to Axios calls
    │   ├── commonApi.js           # Generic HTTP executor
    │   ├── cookieHelper.js        # Helper to set/get HTTP session cookies
    │   └── serverUrl.js           # Houses development/production URL mapping configs
    │
    ├── App.jsx             # React routing configurations & shell Layout
    └── main.jsx            # Mounting node entry point
```

---

## 5. Backend System Architecture (Server)

### Subsystem Overview & Role-Based Access Control (RBAC)
The backend enforces security by assigning users to either the Admin (Administrator) or HR (Human Resources) role in the database.

### Server Route Guards (`authMiddleware.js`)
*   `protect` checks the validity of the JWT from incoming request HTTP cookies or Auth headers.
*   `authorize` checks user roles against permissible values. Attempts by HR to hit `/api/inquiries`, `/api/casestudies`, `/api/articles` (and related CRUDs) return a 403 Forbidden error block.

### Backend Folder Structure
```text
server/
└── src/                    # Source Code
    ├── config/             # DB connection, Cloudinary, Mail configurations
    │   ├── db.js                # Sets up connection configurations with MongoDB Atlas
    │   ├── cloudinary.js        # Sets up keys for file buffers storage on Cloudinary
    │   └── mail.js              # TLS SMTP transporter configs for Nodemailer email relays
    │
    ├── middlewares/        # Middlewares
    │   └── authMiddleware.js    # Verifies JWT session token and authorizes roles (RBAC)
    │
    ├── routes/             # REST Route mappings
    │   ├── adminRoutes.js       # Mappings for Login, Register, Profile, and OTP reset
    │   ├── articleRoutes.js     # Article CRUD routes
    │   ├── careerRoutes.js      # Applications submission and jobs CRUD
    │   ├── caseStudyRoutes.js   # Case study CRUD routes
    │   ├── inquiryRoutes.js     # Inquiry queries list and email/proposal actions
    │   ├── reviewRoutes.js      # Testimonials submit, review approval/deletions
    │   ├── successStoryRoutes.js# Success stories controllers link
    │   └── talentRoutes.js      # Talent pool search directory
    │
    ├── controllers/        # Controllers executing business logic
    │   ├── adminController.js   # Authenticates admins/HR, encrypts credentials, validates OTP
    │   ├── articleController.js # Stores and updates article data, deletes records
    │   ├── careerController.js  # Job vacancies and applicant resume tracking
    │   ├── caseStudyController.js # Manages case study metrics updates
    │   ├── inquiryController.js # Handles SMTP email drafts and proposal conversions
    │   ├── reviewController.js  # Review approval setters and analytics triggers
    │   ├── successStoryController.js # Saves success stories content
    │   └── talentController.js  # Manages historic talent profile queries
    │
    ├── models/             # Mongoose DB schemas
    │   ├── Admin.js             # Admin/HR credentials schema (with password Bcrypt hash)
    │   ├── Article.js           # Insights blog schema (title, status, date, cover URL)
    │   ├── CareerApplication.js # Job applications schema (CV Cloudinary path, parsed skills)
    │   ├── CaseStudy.js         # Case studies metrics and data schema
    │   ├── Job.js               # Job description details and expiry date schema
    │   ├── Review.js            # Feedback testimonials and rating schema
    │   ├── Subscriber.js        # Newsletter subscriptions schema
    │   ├── SuccessStory.js      # Success stories layout schema
    │   ├── TalentSubmission.js  # General candidates database schema
    │   └── inquiryModel.js      # Contact inquiry, employee assigned, follow-up schemas
    │
    ├── utils/              # Utilities
    │   └── resumeParser.js      # CV parser text extractor (mammoth, pdf-parse)
    │
    └── server.js           # Server initialize entry point
```

### Core Security & Authentication Workflows
*   **Account Registration & Roles Assignment**: Accounts are created via `Register.jsx` using a secure selection between Admin and HR roles, which gates access both on the client (via `ProtectedRoute.jsx`) and the server (via `authMiddleware.js`).
*   **Stateless Sessions (JWT & Cookie Buffers)**: Upon login, the backend issues a signed JWT token. This token is saved in LocalStorage and HTTP cookies. Custom Axios request interceptors read the local token and attach it as an `Authorization: Bearer <token>` header to all outgoing requests.
*   **Encryption & Bcrypt Hashing**: Passwords are never stored as plain text. The system implements `bcryptjs` cryptography, applying salt rounds to hash credentials prior to database insertion.
*   **Password Strength Criteria**: To enforce credential integrity, registration validates passwords on both the frontend and backend using regex matching the following criteria:
    *   Minimum **8 characters** in length.
    *   Contains at least **1 uppercase letter**.
    *   Contains at least **1 lowercase letter**.
    *   Contains at least **1 numeric digit**.
    *   Contains at least **1 special symbol** (e.g., `@`, `$`, `!`, `%`, `*`, `?`, `&`).
*   **Forgot/Reset Password OTP Recovery Workflow**:
    1.  *Trigger Recovery*: User requests recovery via `ForgotPassword.jsx`. The backend generates a 6-digit numeric OTP, stores the hashed version with a 5-minute expiry, and sends it to the user via Nodemailer.
    2.  *Validate OTP*: User inputs the OTP into `ResetPassword.jsx`. The backend verifies that the OTP matches and has not expired.
    3.  *Complete Reset*: The backend issues a temporary 10-minute JWT token allowing the user to update their credentials securely.

---

## 6. End-to-End Business Logic & Inquiry Workflows

This section maps out the logical data path from inquiry submission to proposal generation.

### Customer Inquiry, Assignment & Follow-Up Pipeline
```text
       [ Client Contact Form (/contact) ]
                      │
                      ▼  POST /api/inquiries
           [ MongoDB: inquiries ] ◄── (Stored as Status: "New")
                      │
                      ▼  GET /api/inquiries (Dashboard Fetch)
          [ Admin Inquiries Page ] 
                      │
      ┌───────────────┼───────────────┬────────────────────────┐
      │               │               │                        │
      ▼               ▼               ▼                        ▼
  [ Draft ]    [ Assign Team ]   [ Follow-Up ]        [ Convert to Proposal ]
   (Save)      (Select Member)   (Select Date)                 │
                      │               │                        ▼
                      │               │              [ Proposal Editor ] 
                      │               │         (Timeline, Budget, Note, CV)
                      │               │                        │
                      ▼               ▼                        ▼
           [ Status: Responded ] ◄────┘                [ Send Proposal ]
           (SMTP Intro Mail)                           (SMTP Proposal Mail)
                      │                                        │
                      │                                        ▼
                      │                               [ Status: Proposals ]
                      │                                        │
                      └───────────────┬────────────────────────┘
                                      │
                                      ▼
                             [ Status: Closed ]
                             (SMTP Closure Mail)
```

### Detailed Data Flow & Tracking Mechanisms
1.  **Inquiry Intake**: Customer submits query details (name, email, phone, service, requirements) on `/contact` (`Contact.jsx`). This posts to `/api/inquiries`, saving the query in the database with status set to `New`.
2.  **Tracking Dashboard Alert**: The Analytics Dashboard (`Dashboard.jsx`) fetches `New` entries to update scorecard metrics and creates an actionable task ("Review X New Inquiries") inside the Today's Tasks allocation, ensuring client queries are tracked.
3.  **Representative Assignment Flow**:
    *   *Action*: From the Inquiry details view (`Inquiries.jsx`), the Admin selects **Assign to Team** and chooses a team representative from the dropdown.
    *   *Backend Process*: Hitting Submit calls `PUT /api/inquiries/:id` updating the `assignedTo` field in MongoDB.
    *   *Nodemailer Process*: Triggers Nodemailer to send a dynamic email introducing the assigned representative to the client. The inquiry status updates to `Responded`.
4.  **Follow-Up Scheduling Flow**:
    *   *Action*: Admin selects **Schedule Follow-up** from the actions menu and chooses a date via the date picker.
    *   *Backend Process*: Updates the `nextFollowUp` field in MongoDB with the selected date, updating the status to `Responded`.
    *   *SMTP Integration*: Sends a scheduled follow-up email alert to the client, confirming the date. The client card is sorted under the Follow-ups tracker tab.
5.  **Proposal Conversion Flow**:
    *   *Action*: Admin selects **Convert to Proposal**, launching the Proposal Editor Overlay where pricing budgets, timelines, notes, and PDF attachments are structured.
    *   *SMTP Integration*: Clicking "Send Proposal" updates the database status to `Proposals` (rendering it under the Proposals tab) and emails the proposal PDF to the client.
6.  **Resolution & Closure Flow**:
    *   *Action*: Admin selects **Mark as Closed**.
    *   *Process*: Sets status to `Closed` (pushed to the Closed list) and sends a final closure/resolution notification email to the client.

---

## 7. Detailed Administrative Portal Page-by-Page Specifications (Admin Role)

This section details the subsystems and pages accessible exclusively to the Admin / Administrator role.

### Central Analytics Dashboard (`Dashboard.jsx`)
*   **Objective**: Serves as the primary operational tracking command center, keeping all system jobs, client feedbacks, pending moderation pipelines, and business metrics under control.
*   **KPI Scorecard Tracker**: Renders live indicator cards counting core system entries (Total Inquiries, Total Case Studies, Active Articles, New Applications, Talent Pool Submissions) and real-time backend API connectivity checker.
*   **Business Analytics & Date Filtering**: Integrates Recharts charts (Area, Bar, and Line charts) with dropdown duration filters (All-Time, Last 30 Days, Last 7 Days) to sort statistics.
*   **Dossier Printing & Exporting**: Features a dossier print button that opens a clean layout view of the analytics grid and runs `window.print()` dynamically, compiling KPIs, unapproved reviews, and active case studies for offline tracking.
*   **Today's & Pending Task Allocations**: Tracks moderation tasks created "Today" (9 AM today to 5 PM tomorrow) versus "Older" pending items. Clicking on a task checks its state and alerts the admin. Features a progress bar reflecting the overall completion rate.
*   **Actionables Card**: Aggregates counts of items needing attention (e.g., Draft Articles, Unapproved Reviews). Clicking any item opens the Actionables Modal, listing unmoderated records with quick-approve options and redirects.
*   **Client Review & Testimonials Moderation**: Reviews submitted via `/review` are saved as unapproved (`approved: false`). Admin can review them and click Approve (calls `PUT /api/reviews/:id`, setting `approved: true` to display it on the Home page slider) or Delete (calls `DELETE /api/reviews/:id` to purge the feedback).

### Customer Inquiries Board (`Inquiries.jsx`)
*   **Objective**: Manages customer inquiries submitted via `/contact`.
*   **Detailed Inquiry Modal**: Displays sender info (name, email, phone, corporate title) and query message.
*   **Backend Response Action Flow**: Admins select an action from the dropdown and hit Submit, which presents a text field to edit email copy before triggering Nodemailer SMTP mailers and database status updates:
    *   *Reply by Email*: Type a message and email it to the client. Transitions the inquiry status to `Responded`.
    *   *Convert to Proposal*: Switches to the Proposal Editor Overlay to specify Subject, Budget, Timeline, Client Notes, and file attachments. Clicking "Send Proposal" updates the status to `Proposals`. Admins can also download or preview the generated PDF.
    *   *Assign to Team*: Opens a dropdown to select a team member. Assigning updates the `assignedTo` field and emails the client introducing their assigned representative, transitioning status to `Responded`.
    *   *Schedule Follow-up*: Opens a date selector. Submitting sets the `nextFollowUp` date and emails scheduling details to the client, transitioning status to `Responded`.
    *   *Mark as Closed*: Marks the status as `Closed` and emails a closure notification to the client.
*   **Dossier Printing & Exporting**: Features a print dossier button that compiles selected client metadata into a printable document view using `@media print` CSS overrides.
*   **Inquiries Overview & Client Action Tracker Cards**: Tabbed views filter entries. Renders an interactive card grid tracking overall action details of prospective clients, highlighting their contact information, date created, assigned team member, next follow-up dates, and current status badges.

### Articles & Insights CRUD Management
*   **Files**: `ArticlesAdmin.jsx` (Listings & Actions), `CreateArticle.jsx` (Form Creation), `EditArticle.jsx` (Edits)
*   **Objective**: Manages the published corporate blog posts and market insights.
*   **Content Editor**: Form supporting text content, titles, categories, tags, and cover image.
*   **Media Syncing**: Uploads cover images to Cloudinary CDN on form submit, fetching secure image URLs for rendering.
*   **Publishing Validation & Future Dates Rules**:
    *   *Validation*: The date picker restricts selection to today or future dates (past dates are disabled).
    *   *Future Date Rule*: If a future date is selected (`publicationDate > today`), the system automatically saves it as a **Draft** status to keep it back from the public insights feed until the release date.
*   **Actions**: Draft articles, publish articles, edit existing posts (supporting updates to titles, body copy, and replacing cover photos), and delete articles.

### Case Studies CRUD Management
*   **Files**: `CaseStudies.jsx` (Listings), `CreateCaseStudy.jsx` (Form Creation), `EditCaseStudy.jsx` (Edits)
*   **Objective**: Create and display success stories to demonstrate consultant capabilities.
*   **Data Fields**: Title, industry category, statistical metrics, client summary, and cover layout.
*   **Future Dates Rule**: Enforces the same date check. Future publishing dates automatically save the case study as a draft.
*   **Actions**: Create case study, edit metadata, upload graphics to Cloudinary, and delete case study.

### Profile Settings (`Profile.jsx`)
*   **Objective**: Manage user account details and credentials.
*   **Actions**: Edit administrative username, email, and trigger password modification forms (requiring current password verification and strong format validation check).

---

## 8. HR Portal Page-by-Page Specifications (HR & Shared Roles)

Accessible to HR (Human Resources) and Admin roles.

### Job Vacancies Constructor (`CreateJob.jsx` / `EditJob.jsx`)
*   **Objective**: HR form to post and edit active vacancies on `/careerstrivo`.
*   **Data Inputs**: Job title, description, department (HR, Consulting, Tech), required skills, location, job type (Full Time, Remote), and expiry date.

### Recruitment Applications Manager (`Admincareers.jsx`)
*   **Objective**: Direct management of candidates applying for job vacancies.
*   **Interface Layout & Sub-Tabs**: Organizes the portal into three main sub-tabs:
    *   `applications`: Core applications queue with filters for active positions.
    *   `talent`: Searchable directory of the candidate Talent Network.
    *   `jobs`: Dashboard to create, toggle status, and edit active job vacancies.
*   **Parsed Match Indicator**: Displays the candidate profile along with matching score indicators (percentage and match frequency counts) calculated by the backend `resumeParser.js` script.
*   **Recruitment & Status Workflows**:
    *   HR can cycle candidates through six strict recruiting statuses: `new` (Awaiting review), `referred` (Interview scheduled), `reviewed` (Passed initial screening), `accepted` (Job offer sent), `appointed` (Candidate hired), `rejected` (Candidate rejected).
    *   *Interview Synchronization*: Updating candidate status to `referred` automatically creates an entry and syncs status updates with the Interviews Board.
    *   *Download Resume*: Direct link pointing to Cloudinary PDF/DOCX storage paths to download CVs.

### Talent Pool Indexer (`TalentPoolAdmin.jsx`)
*   **Objective**: General index cataloging historical applicant CVs and general candidate profiles.
*   **Function**: Search box with filter tags based on skills, match scores, or date ranges.

### Interviews Admin Panel (`InterviewsAdmin.jsx`)
*   **Objective**: Tracks scheduled candidate interviews and handles invitations.
*   **Actions**:
    *   *Schedule Interview*: Form to set dates, times, and meeting formats.
    *   *Send Invitation Email*: Triggers Nodemailer to send calendar invites and credentials to candidates.
    *   *Update Status*: Transition interview state (Scheduled, Completed, Offered, Hired).

### Appointments & Consultations Board (`AppointmentsAdmin.jsx`)
*   **Objective**: Manages client consultations and corporate bookings.
*   **Function**: Calendar/list layout of consultation requests, allowing scheduling or editing.

---

## 9. Business Workflows & Data Flows (Structured Mappings)

This section maps out how data propagates between the frontend, MongoDB backend APIs, Cloudinary, and external SMTP relay networks under administrative and HR workflows.

### A. Client Inquiry & Administrative Actions Data Flow
When a visitor submits an inquiry, administrators can execute sequential operations (Drafts, Nodemailer email replies, assignments, and proposals).

| Step | Action / Trigger | Source Component / File | API Endpoint | Database Collection | Results & Downstream Actions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Submit Inquiry Form | `Contact.jsx` | `POST /api/inquiries` | `inquiries` | Validates inputs and stores client message. Status set to `New`. |
| 2 | Load Inquiries List | `Inquiries.jsx` | `GET /api/inquiries` | `inquiries` | Fetches data to populate Admin list on mount. |
| 3 | Draft Response | `Inquiries.jsx` | Local/DB update | `inquiries` | Saves a response message draft locally to refer back to. |
| 4 | Send Email Reply | `Inquiries.jsx` | `POST /api/inquiries/reply` | `inquiries` | Sends email via SMTP (Nodemailer `mail.js`). Transitions status to `Responded`. |
| 5 | Assign to Employee | `Inquiries.jsx` | `PUT /api/inquiries/:id` | `inquiries` | Dropdown choice updates `assignedTo` field and emails client. |
| 6 | Schedule Follow-up | `Inquiries.jsx` | `PUT /api/inquiries/:id` | `inquiries` | Sets `nextFollowUp` date and emails scheduling details. |
| 7 | Convert to Proposal | `Inquiries.jsx` | `PUT /api/inquiries/:id` | `inquiries` | Shifts to Proposal overlay. Updates status to `Proposals` upon sending. |

### B. Client Review Verification & Approval Cycle
To filter spam and display only authenticated feedback, a custom approval cycle is enforced for public testimonials.

| Step | Action / Trigger | Source Component / File | API Endpoint | Moderation State | Downstream Impact & Visibility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Submit Testimonial | `Review.jsx` | `POST /api/reviews` | `approved: false` | Stored in DB but hidden from public site pages. |
| 2 | Fetch Queue | `Dashboard.jsx` | `GET /api/reviews` | Moderation queue | Loaded in unapproved reviews panel on Admin dashboard. |
| 3 | Admin Approves | `Dashboard.jsx` | `PUT /api/reviews/:id` | `approved: true` | Visible immediately in public testimonials slider (`Home.jsx`). |
| 4 | Admin Deletes | `Dashboard.jsx` | `DELETE /api/reviews/:id` | Purged from DB | Removed completely from database. |
| 5 | Sort / Filter | `Dashboard.jsx` | Internal state filter | `reviews` | Admin sorts testimonials by rating or date within Dashboard. |

### C. Talent Acquisition, Resume Parsing, & HR Management
The Careers pipeline processes applicant files dynamically using PDF/DOCX extractors and keyword filters to score applicants.

| Step | Action / Trigger | Source Component | API Endpoint | Target Service | Downstream Impact & Visibility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Candidate Applies | `Career.jsx` | `POST /api/careers/apply` | Cloudinary Storage | CV PDF/DOCX uploaded to Cloudinary CDN, fetching file URL. |
| 2 | Parse Resume | Backend server | Pre-save hook | `resumeParser.js` | Converts CV file buffer to raw text via `pdf-parse` or `mammoth`. |
| 3 | Score Candidate | Backend server | Pre-save hook | Skill keyword list | Scans text for target keywords to count skill match frequency. |
| 4 | Save Application | Database | Model save | `careerapplications` | Saves candidate profile details, CV link, and matched skills. |
| 5 | HR Opens Dash | `Admincareers.jsx` | `GET /api/careers` | `careerapplications` | Lists candidate entries showing details and score badges. |
| 6 | Download CV | `Admincareers.jsx` | Cloudinary link | Browser Download | Directly fetches candidate CV for HR screening. |
| 7 | Schedule Interview | `InterviewsAdmin.jsx` | `POST /api/interviews` | Nodemailer SMTP | Sets date/time and emails calendar invites to candidate. |

### D. HR vs. Admin Access Permissions & Role Differentiation
Access to pages is dynamically gated depending on whether the user logs in as an HR representative or Administrator.

| Subsystem Page | Active View Route | Target Code File | Admin Access | HR Access | Access Control / Redirection Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| System Dashboard | `/admin/dashboard` | `Dashboard.jsx` | Allowed | Blocked | Auto-redirects HR accounts to `/admin/career` |
| Inquiries Board | `/admin/inquiries` | `Inquiries.jsx` | Allowed | Blocked | Auto-redirects HR accounts to `/admin/career` |
| Case Studies CRUD | `/admin/casestudies` | `CaseStudies.jsx` | Allowed | Blocked | Auto-redirects HR accounts to `/admin/career` |
| Articles Board | `/admin/article` | `ArticlesAdmin.jsx` | Allowed | Blocked | Auto-redirects HR accounts to `/admin/career` |
| Careers Manager | `/admin/career` | `Admincareers.jsx` | Allowed | Allowed | Shared dashboard for recruitment status management |
| Interviews Panel | `/admin/interviews` | `InterviewsAdmin.jsx` | Allowed | Allowed | Scheduling calendar and Nodemailer invite triggers |
| Talent Pool Indexer | `/admin/talent-pool` | `TalentPoolAdmin.jsx` | Allowed | Allowed | Shared search directory for candidate entries |
| Job Creator Form | `/admin/create-job` | `CreateJob.jsx` | Allowed | Allowed | HR forms to post new vacancy openings |
| Appointments | `/admin/appointments` | `AppointmentsAdmin.jsx` | Allowed | Allowed | Track and schedule consulting inquiries |

---

## 10. Conclusion & Future Roadmap

Strivo Consultancy delivers a robust, enterprise-ready digital workspace that streamlines client onboarding, recruitment pipelines, and administrative content moderation.

### Key Achievements
*   **Consolidated Operations**: Replaces disparate channels (spreadsheets, emails, manual files) with a single, role-gated platform where HR and administrators work in sync.
*   **Enterprise-Grade Security**: Protects sensitive organizational data and candidate credentials through Bcrypt hashing, secure JWT state management, and strict backend RBAC rules.
*   **Actionable Business Intelligence**: Renders real-time KPIs and interactive charts, allowing administrators to make data-driven staffing and operational decisions.

### Future Development Scope
1.  **AI-Powered Resume Matcher**: Implement NLP classifiers or LLM APIs to match candidate skills with active job descriptions, ranking candidates automatically.
2.  **Real-Time Notifications**: Add WebSocket or push notification alerts for new client inquiries, interview scheduling conflicts, or new applications.
3.  **Client Collaboration Hub**: Create a client dashboard where external stakeholders can track consultation timelines, view proposal budgets, and exchange project files.
