<h1 align="center">STRIVO CONSULTANCY WEBSITE</h1>
<h2 align="center">PROJECT DOCUMENTATION REPORT</h2>
<p align="center"><i>A Professional MERN Stack Consultancy Web Application</i></p>

---

<h2 align="center">1. Project Takeaways</h2>

Working on the Strivo Consultancy Website was a valuable learning experience that went beyond technical development. The project helped us understand the importance of collaboration, effective communication, and teamwork in building a complete full-stack application.

---

<h2 align="center">2. Key Takeaways</h2>

- Working as a team allowed us to share ideas, discuss different approaches, and learn from one another throughout the project.
- Regular communication and progress discussions helped us stay aligned and complete tasks efficiently.
- Collaborating with teammates improved our understanding of both frontend and backend development, as we frequently exchanged knowledge and supported each other when solving technical challenges.
- Listening to different perspectives helped us make better design and implementation decisions while improving the overall quality of the application.
- Dividing responsibilities among team members made the development process more organized and ensured that project milestones were completed on time.
- Resolving issues together during development strengthened our problem-solving skills and taught us the value of collaborative debugging.
- Using Git and GitHub as part of our daily workflow gave us practical experience with feature branches, commits, pull requests, and version control in a team environment.
- The project improved our ability to plan tasks, coordinate development activities, and work effectively as part of a software development team.
- Overall, this project enhanced both our technical knowledge and our confidence in working collaboratively on real-world web development projects.

---

<h2 align="center">3. Project Summary & Description</h2>

### 3.1 Overview
Strivo Consultancy is a high-performance, responsive full-stack MERN (MongoDB, Express, React, Node.js) web application. Designed for modern corporate consultancy operations, it facilitates lead capture, dynamic content management, applicant screening, and customer review curation. The system employs a secure, authenticated dashboard allowing administrators to handle incoming operational inquiries, jobs, and articles.

---

<h2 align="center">4. Project Scope</h2>

The scope of this project includes the design, development, and testing of a responsive, fullstack web application consisting of a React client, an Express backend server, and a MongoDB database. The scope covers the frontend UI animations, client form verification, file uploads management (via Cloudinary integration), secure JWT-based admin login authorization, database aggregation for dashboard statistics, and deployment verification. The system is scoped to scale gracefully across mobile, tablet, and widescreen desktop layouts.

---

<h2 align="center">5. Key Features</h2>

### 5.1 Client-Facing Portal
- **Interactive Background**: An advanced interactive WebGL fluid background (Ferrofluid) reacting to user cursor coordinates.
- **Insights & Articles Engine**: Categorized articles list featuring pagination, responsive grid layouts, and dynamic reading views.
- **Advisory Hubs**: Specialized pages showcasing Strivo's corporate solutions, including Strategic Advisory, Operations, Digital Integration, and Change Consulting.
- **Dynamic Reviews Slider**: A client review slider powered by Swiper.js, showcasing approved user-submitted testimonials.
- **Careers Application Gate**: Dynamic listing of open roles with integrated CV uploads directly submitted to administrators.
- **Inbound Lead Form**: Validated contact form collecting client details and storing them in the centralized inquiries system.

### 5.2 Administrative Console
- **Secure Authentication Gate**: Secure Login, Change Password, and Profile configuration, utilizing dynamic OTP generation for recovery.
- **Operational Dashboard**: Real-time statistics counters summarizing active jobs, pending applications, inquiries, and candidate profiles.
- **Job Board Controller**: Direct management panel to create, update, deactivate, and remove recruitment postings.
- **Application Desk**: Interactive applicant review list displaying submission details, status toggles, internal reference controls, and resume links.
- **Inquiry Manager**: Notifications panel to inspect client requests, flag inquiries as read, update statuses, and send outbound email responses.
- **Articles & Success Story Managers**: CRUD panels to draft, publish, edit, and delete corporate blogs and case studies.

---

<h2 align="center">6. Target Users</h2>

### 6.1 User Persona Matrix
- **Corporate Clients**: CEOs, founders, and division leads looking for consulting strategies who submit business inquiries.
- **Job Candidates**: Professional applicants submitting details and uploading PDF resumes for active job roles.
- **System Administrators**: HR managers and content curators managing platform updates and inbound leads.

---

<h2 align="center">7. Technical Implementation Details</h2>

### 7.1 Framework Matrix
| Tier / Tool | Selected Technologies | Implementation Purpose |
| :--- | :--- | :--- |
| **Frontend Tier** | React 19, JavaScript (ES6+), TailwindCSS v4, MUI v9, Framer Motion, Swiper.js, OGL (WebGL) | Dynamic rendering, utility-first layouts, pre-built inputs, smooth transitions, high-fidelity WebGL graphics. |
| **Backend Tier** | Node.js, Express.js v5, Multer, Streamifier, Nodemailer, JWT | MVC logic, in-memory multi-part form handling, dynamic SMTP email dispatch, session signature validations. |
| **Database Tier** | MongoDB, Mongoose ODM v9, Cloudinary Cloud Storage | Document storage, object-data modeling, secure storage for candidate resumes and article image assets. |
| **Build & Linting** | Vite 8, ESLint, Postman, Git & GitHub | HMR development server, code-standard audits, endpoint testing, version control. |

### 7.2 Authentication & Authorization
Access to administrative operations is secured using JSON Web Token (JWT) standards:
- **Credential Verification**: Admin login verifies password hashes using bcryptjs on the server.
- **Token Signature**: Upon verification, the server signs a JWT containing user identity variables and a cryptographic key from server configuration.
- **Stateless Guard**: The client stores the JWT in session storage and applies it as a bearer token inside Authorization request headers.
- **Validation Middleware**: A custom server middleware intercepts admin routes, verifies token signatures, and permits actions only upon token validation.

### 7.3 Responsive Design Approach
- **Media Queries and Flex Grids**: Styled utilizing CSS grids, custom tailwind utilities, and flexbox coordinates that recalculate layouts according to viewport bounds.
- **Dynamic Breakpoints**: Content displays scale between 12-column grid rows, shifting cards dynamically based on responsive triggers (`sm`, `md`, `lg`).

### 7.4 Error Handling
- **Try-Catch Block Wrapping**: Controllers handle potential exceptions gracefully, preventing runtime thread failure and returning structured JSON messages with HTTP error codes.
- **Sonner Toast Alerts**: Frontend failures (network issues, missing inputs) trigger non-blocking, user-friendly UI toasts instead of crashing the client interface.

### 7.5 Security Measures
- **Strict CORS Origin Policies**: The backend restricts cross-origin request sources to verify that client connections originate from validated hosts.
- **Environment Isolation**: Private database credentials, API access keys, and server-side configurations are strictly mapped via local `.env` variables and kept away from repositories.

### 7.6 Performance Optimizations
The application implements performance optimization techniques to improve page speed and performance:
- **Route Lazy Loading**: React pages are lazy-loaded using Suspense fallback indicators. This splits production bundles into smaller, route-specific files, reducing initial load times.
- **Asset Optimization**: Content images are optimized, and document assets (like candidate CV resumes) are hosted and delivered via Cloudinary's content delivery network (CDN).
- **Database Indexing**: Indexes are created on frequently queried document keys (e.g. isApproved flag on reviews) to improve query execution times.

### 7.7 Git Workflow
- **Branch Strategy**: Development occurs on decoupled feature branches (e.g., `feature/career`, `feature/inquiry`). The main branch is protected.
- **Structured Commits**: Commits utilize prefixed headings (`feat:`, `fix:`, `refactor:`) to maintain readable change timelines.

---

<h2 align="center">8. Website Pages Hub & System Catalog</h2>

### 8.1 Public Client Pages (14 Pages / View Modules)
The client-facing UI has a total of 14 key pages, split between static layouts and dynamically loaded views:
- **Home (`Home.jsx`) [Dynamic]**: Landing hub displaying dynamic client metrics, and fetches approved client reviews for the swiper.
- **About Us (`About.jsx`) [Static Hub]**: Corporate introduction which has **6 specific subpages**:
  1. *Mission Page (`Mission.jsx`) [Static]*: Presentsdelivery methodologies (Analytical Rigor, Strategic Foresight, Flawless Execution, Growth).
  2. *Vision Page (`Vision.jsx`) [Static]*: Presents long-term goals (Global Footprint, Integrity, Innovation, Legacy Impact).
  3. *Core Value - Integrity (`Values.jsx#integrity`) [Dynamic]*: Renders specific focus matrices for Strivo's integrity principles.
  4. *Core Value - Innovation (`Values.jsx#innovation`) [Dynamic]*: Highlights business modernization.
  5. *Core Value - Impact (`Values.jsx#impact`) [Dynamic]*: Outlines quantitative performance results.
  6. *Core Value - Collaboration (`Values.jsx#collaboration`) [Dynamic]*: Displays strategic partnership systems.
- **Services (`Services.jsx`) [Static Hub]**: Directory connecting the 4 primary advisory service pages:
  - *Strategic Advisory (`Strategic.jsx`) [Static]*
  - *Operations Consulting (`Operations.jsx`) [Static]*
  - *Digital Integration (`Digital.jsx`) [Static]*
  - *Change Consulting (`Change.jsx`) [Static]*
- **Insights Portal (`Insight.jsx`) [Dynamic]**: Renders paginated lists of blog articles.
- **Article Reader (`Article.jsx`) [Dynamic]**: Dynamically renders full blog posts based on ID parameters.
- **Case Studies Portal (`CaseStudies.jsx`) [Dynamic]**: Lists corporate case study cards.
- **Case Study Details (`CaseStudyDetails.jsx`) [Dynamic]**: Displays specific timeline details and results for selected case studies.
- **Contact Us (`Contact.jsx`) [Dynamic Form]**: Displays office locations and submits contact inquiries.
- **Careers Portal (`Career.jsx`) [Dynamic]**: Pulls active job openings and processes applicant resume uploads.
- **Reviews Submission (`Review.jsx`) [Dynamic Form]**: Captures client ratings and reviews for administrative desk moderation.

### 8.2 Administrative Pages (11 View Modules - All Dynamic)
- **Admin Login (`Login.jsx`)**: Authenticated administrative gate.
- **Forgot Password (`ForgotPassword.jsx`)**: Requests reset OTP.
- **Reset Password (`ResetPassword.jsx`)**: Updates account password with OTP verification.
- **Admin Dashboard (`Dashboard.jsx`)**: Displays statistics counters and provides navigation links.
- **Inquiries Console (`Inquiries.jsx`)**: Reviews inbound leads and drafts responses.
- **Careers Manager (`Admincareers.jsx`)**: Manages job openings and lists applicants.
- **Articles Console (`ArticlesAdmin.jsx`)**: Writes, edits, and deletes articles.
- **Case Studies Console (`CaseStudies.jsx`)**: Lists all project portfolios.
- **Create Case Study (`CreateCaseStudy.jsx`)**: Submits new case study details and images.
- **Edit Case Study (`EditCaseStudy.jsx`)**: Modifies existing case studies.
- **Profile Settings (`Profile.jsx`)**: Updates email, username, and profile image.

---

<h2 align="center">9. System Architecture & Data Flow</h2>

### 9.1 Architectural Data Flow Description
1. The React client makes API calls using Axios instances to endpoints on the Express backend server.
2. For public requests (testimonials list, details), the server queries MongoDB and responds with data.
3. When a candidate uploads a resume, the server intercepts the multipart form-data via Multer, streams the PDF binary to Cloudinary, receives the HTTPS hosting URL, and creates a MongoDB record linking the applicant data to the resume URL.
4. For administrative requests, the client attaches a JWT authorization token to request headers. The server verifies this token via custom middleware before granting CRUD.

### 9.2 Block Diagram
```
+-----------------------------------------------------------+
 | CLIENT TIER                                             |
 | React 19 SPA (Client UI, MUI, Tailwind, Swiper)          |
 +-----------------------------+-----------------------------+
                               | (HTTPS Requests / JSON / Uploads)
                               v
 +-----------------------------+-----------------------------+
 | SERVER TIER                                             |
 | Express.js REST API (JWT Auth, Multer, controllers)       |
 +--------------+------------------------------+-------------+
                |                              |
                | (Mongoose ODM)               | (Uploads)
                v                              v
 +--------------+--------------+ +-------------+-------------+
 | DATABASE TIER               | | FILE STORAGE              |
 | MongoDB Cloud Atlas         | | Cloudinary Cloud          |
 +-----------------------------+ +---------------------------+
```

---

<h2 align="center">10. Project Structure</h2>

### 10.1 Directory Layout
```
strivo-consultancy/
├── client/                     # Frontend Application
│   ├── public/                 # Static Public Assets
│   └── src/
│       ├── Admin/              # Admin pages (Dashboard, Login, Career, Profile)
│       ├── Components/         # Reusable Components (Navbar, WebGL background)
│       ├── pages/              # Client-Facing pages (Home, About, Services)
│       ├── services/           # Axios API configuration & endpoints
│       ├── App.jsx             # React router configuration
│       └── main.jsx            # Entry script
├── server/                     # Backend API Application
│   └── src/
│       ├── config/             # DB connection, Cloudinary, Mailer configs
│       ├── controllers/        # Logical controllers (admin, job, inquiry)
│       ├── models/             # Mongoose schemas (10 Collections)
│       ├── routes/             # Route handlers
│       └── server.js           # Server application bootstrap
└── Strivo_Project_Documentation.pdf
```

---

<h2 align="center">11. Code Modules & API Routes</h2>

### 11.1 Module Architecture
#### Backend Controller Modules (MVC Pattern)
- **Admin Module (`adminController.js`)**: Manages authentication mechanisms, including bcrypt password checking, OTP generation/verification for recovery, profile image updates, and JWT creation.
- **Career & Job Module (`careerController.js`)**: Processes job postings (CRUD operations) and job applications, handles in-memory file buffers, and calculates aggregated metrics for the dashboard view.
- **Talent Submission Module (`talentController.js`)**: Processes general submissions to the talent database, enforces email duplicates filtering, uploads resumes to Cloudinary, and triggers SMTP receipt confirmations.
- **Inquiry Module (`inquiryController.js`)**: Manages lead captures, updates message statuses (New/Responded/Closed), counts unread alerts, and routes admin replies back to users.
- **Article & Insights Module (`articleController.js`)**: Controls public content publishing, updates metadata tags, manages paginated article delivery, and supports newsletter email subscription actions.
- **Case Study Module (`caseStudyController.js`)**: Governs high-fidelity project portfolios, detailing consulting solutions, challenges, and client impacts.
- **Success Story Module (`successStoryController.js`)**: *Developed by Engineer A.* Handles the upload of successful client text stories and associated image coordinates directly to Cloudinary. It is structurally decoupled from user feedback.
- **Reviews Module (`reviewController.js`)**: *Developed by Engineer B.* Collects direct ratings (1-5 stars) and detailed comments from the user reviews form, managing admin moderation pipelines prior to public swiper display.

#### Frontend Modules (Component & Service Architecture)
- **API Client Layer (`allApi.js`, `commonApi.js`)**: Configures standard Axios requests, mounts backend targets dynamically via `serverUrl.js`, and abstracts endpoint requests into modular client methods.
- **Authentication & Security Module**: Controls application-state updates, guards dashboard routes based on session storage, and appends authorization bearer tokens.
- **Interactive UI Engine**: Employs WebGL shaders (`ogl` library) to run interactive fluid animations in the browser background while using Framer Motion to animate container view entries.

### 11.2 Endpoint Catalog
All API endpoints are mounted under `/api` routing paths:

| Method | Endpoint | Description | Scope |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/admin/register` | Registers a new administrator profile | Public / Restricted |
| **POST** | `/api/admin/login` | Authenticates administrator and returns a JWT | Public |
| **POST** | `/api/admin/forgot-password` | Generates OTP and dispatches email link | Public |
| **POST** | `/api/admin/verify-otp` | Validates submitted recovery OTP | Public |
| **PUT** | `/api/admin/reset-password` | Updates account credentials using OTP validation | Public |
| **PUT** | `/api/admin/change-password` | Updates active administrator password | Private (Admin) |
| **PUT** | `/api/admin/profile-image` | Uploads a new profile image via Cloudinary | Private (Admin) |
| **GET** | `/api/career/jobs` | Fetches all active job postings | Public |
| **POST** | `/api/career/jobs` | Creates a new job posting | Private (Admin) |
| **PUT** | `/api/career/jobs/:id` | Updates specific job attributes | Private (Admin) |
| **DELETE** | `/api/career/jobs/:id` | Deletes a job posting from the catalog | Private (Admin) |
| **POST** | `/api/career/apply` | Submits job application with CV (Multer) | Public |
| **GET** | `/api/career/applications` | Retrieves all applicant records | Private (Admin) |
| **PUT** | `/api/career/applications/:id/status` | Updates applicant review status | Private (Admin) |
| **PUT** | `/api/career/applications/:id/refer` | Flags application for internal referral | Private (Admin) |
| **GET** | `/api/career/stats` | Calculates dashboard count statistics | Private (Admin) |
| **POST** | `/api/talent/submit` | Handles general talent pool CV submissions | Public |
| **GET** | `/api/talent/submissions` | Fetches talent pool candidate records | Private (Admin) |
| **POST** | `/api/reviews` | Submits a customer testimonial | Public |
| **GET** | `/api/reviews` | Fetches approved customer testimonials | Public |
| **POST** | `/api/articles` | Creates a new blog article | Private (Admin) |
| **GET** | `/api/articles` | Fetches blog articles list | Public |
| **GET** | `/api/articles/:id` | Fetches detailed view of a blog article | Public |
| **PUT** | `/api/articles/:id` | Edits an existing blog article | Private (Admin) |
| **DELETE** | `/api/articles/:id` | Deletes a blog article | Private (Admin) |
| **POST** | `/api/articles/subscribe` | Registers email to newsletter subscription | Public |
| **GET** | `/api/articles/subscribers` | Fetches registered subscriber emails | Private (Admin) |
| **DELETE** | `/api/articles/subscribers/:id` | Removes email subscriber from list | Private (Admin) |
| **POST** | `/api/success-stories` | Creates a new success story | Private (Admin) |
| **GET** | `/api/success-stories` | Fetches success stories | Public |
| **DELETE** | `/api/success-stories/:id` | Deletes a success story | Private (Admin) |
| **POST** | `/api/inquiries` | Submits contact/inquiry form | Public |
| **GET** | `/api/inquiries` | Fetches all operational inquiries | Private (Admin) |
| **GET** | `/api/inquiries/notifications` | Fetches unread inquiries for dashboard alerts | Private (Admin) |
| **PUT** | `/api/inquiries/:id` | Updates inquiry status (New/In Progress/Closed) | Private (Admin) |
| **POST** | `/api/inquiries/reply` | Emails a reply response back to the client | Private (Admin) |
| **POST** | `/api/case-studies` | Creates a client case study | Private (Admin) |
| **GET** | `/api/case-studies` | Fetches all case studies | Public |
| **GET** | `/api/case-studies/:id` | Fetches a single case study's details | Public |
| **PUT** | `/api/case-studies/:id` | Updates case study details | Private (Admin) |
| **DELETE** | `/api/case-studies/:id` | Deletes case study | Private (Admin) |

---

<h2 align="center">12. Database Design</h2>

### 12.1 Database Collections (10 Schemas)

#### 12.1.1 `Admin` Schema
- `username` (String, required, unique, trim)
- `password` (String, required)
- `email` (String, default: "admin@strivo.com")
- `role` (String, default: "Administrator")
- `profileImage` (String, default: "")
- `resetPasswordOtp` (String)
- `resetPasswordOtpExpire` (Date)
- `timestamps` (true)

#### 12.1.2 `Article` Schema
- `title` (String, required, trim)
- `category` (String, required, trim)
- `imageUrl` (String, required, trim)
- `description` (String, required, trim)
- `content` (String, required, trim)
- `showSubscription` (Boolean, default: true)
- `timestamps` (true)

#### 12.1.3 `CareerApplication` Schema
- `fullName` (String, required)
- `email` (String, required)
- `mobile` (String, required)
- `appliedPosition` (String, required)
- `roleDescription` (String)
- `resumeUrl` (String, required)
- `status` (String, enum: ["pending", "reviewed", "accepted", "rejected"], default: "pending")
- `timestamps` (true)

#### 12.1.4 `CaseStudy` Schema
- `title` (String, required)
- `author` (String, required)
- `authorRole` (String, required)
- `category` (String, required)
- `duration` (String)
- `publicationDate` (Date)
- `summary` (String, required)
- `challenges` (String, required)
- `results` (String, required)
- `authorWebsite` (String)
- `coverImage` (String)
- `authorImage` (String)
- `status` (String, enum: ["Draft", "Published", "Archived"], default: "Draft")
- `timestamps` (true)

#### 12.1.5 `Job` Schema
- `title` (String, required)
- `description` (String, required)
- `department` (String, required)
- `location` (String, required)
- `jobType` (String, required)
- `status` (String, enum: ["Active", "Closed"], default: "Active")
- `timestamps` (true)

#### 12.1.6 `Review` Schema
- `fullName` (String, required, trim)
- `company` (String, required, trim)
- `rating` (Number, required, min: 1, max: 5)
- `title` (String, required, trim)
- `review` (String, required, trim, minlength: 20)
- `timestamps` (true)

#### 12.1.7 `Subscriber` Schema
- `email` (String, required, unique, trim, lowercase)
- `timestamps` (true)

#### 18.1.8 `SuccessStory` Schema
- `name` (String, required)
- `position` (String, required)
- `clientStories` (String, required)
- `imageUrl` (String, required)
- `imageId` (String)
- `timestamps` (true)

#### 12.1.9 `TalentSubmission` Schema
- `fullName` (String, required)
- `email` (String, required)
- `mobile` (String, required)
- `category` (String, required)
- `resumeUrl` (String, required)
- `status` (String, enum: ["pending", "reviewed", "contacted"], default: "pending")
- `timestamps` (true)

#### 12.1.10 `Inquiry` Schema
- `fullName` (String, required)
- `company` (String)
- `email` (String, required)
- `phone` (String)
- `service` (String, required)
- `message` (String, required)
- `status` (String, enum: ["New", "In Progress", "Responded", "Closed"], default: "New")
- `isRead` (Boolean, default: false)
- `timestamps` (true)

---

<h2 align="center">13. Team Contribution Matrix</h2>

### 13.1 Namitha
- **Frontend Contributions**:
  - Home page (`Home.jsx` route `/home`)
  - About us page (`About.jsx` route `/about`)
  - ourmission page (`Mission.jsx` route `/mission`)
  - ourvision page (`Vision.jsx` route `/vision`)
  - integrity page (`Values.jsx#integrity` route `/values/integrity`)
  - innovation page (`Values.jsx#innovation` route `/values/innovation`)
  - impact page (`Values.jsx#impact` route `/values/impact`)
  - collaboration page (`Values.jsx#collaboration` route `/values/collaboration`)
  - careers page (`Career.jsx` route `/careerstrivo`)
  - add review page (`Review.jsx` route `/review`)
  - Admin careers page (`Admincareers.jsx` route `/admin/career`)
  - Admin articles (`ArticlesAdmin.jsx` route `/admin/article`)
- **Backend Contributions**:
  - Add review (`reviewRoutes.js`, route `/api/reviews`)
  - careers (`careerRoutes.js`, route `/api/career/apply` and `/api/career/jobs`)
  - admin careers (`careerRoutes.js`, route `/api/career/applications`)
  - articles page (`articleRoutes.js`, route `/api/articles`)
  - admin articles (`articleRoutes.js`, routes under `/api/articles` write/edit/delete)
  - nexus insights daily subscriptions (`articleRoutes.js`, route `/api/articles/subscribe`)

### 13.2 Vishnu
- **Frontend Contributions**:
  - insight page (`Insight.jsx` route `/insights`)
  - contact page (`Contact.jsx` route `/contact`)
  - article pages (`Article.jsx` route `/article/:id`)
  - services pages (`Services.jsx` route `/services`)
  - Admin Login page (`Login.jsx` route `/admin/login`)
  - Admin forgot password page (`ForgotPassword.jsx` route `/admin/forgot-password`)
  - Admin dashboard (`Dashboard.jsx` route `/admin/dashboard`)
  - Admin profile (`Profile.jsx` route `/admin/profile`)
  - Strategic Planning (`Strategic.jsx` route `/strategic`)
  - Operations Optimizations (`Operations.jsx` route `/operations`)
  - Digital Transformation (`Digital.jsx` route `/digital`)
  - Change Management (`Change.jsx` route `/change`)
- **Backend Contributions**:
  - Admin Login (`adminRoutes.js`, route `/api/admin/login`)
  - Forgot password (`adminRoutes.js`, route `/api/admin/forgot-password`)
  - client story (`successStoryRoutes.js`, route `/api/success-stories`)
  - news letter (`articleRoutes.js`, route `/api/articles/subscribe`)
  - admin profile (`adminRoutes.js`, route `/api/admin/profile-image` and `/api/admin/change-password`)
  - admin dashboard (`careerRoutes.js`, route `/api/career/stats`)

### 13.3 Nejuma
- **Frontend Contributions**:
  - service page (`Services.jsx` route `/services`)
  - case studies page (`CaseStudies.jsx` route `/casestudies`)
  - case studies details page (`CaseStudyDetails.jsx` route `/case-study-details/:id`)
  - admin inquiries page (`Inquiries.jsx` route `/admin/inquiries`)
  - admin case studies page (`CaseStudies.jsx` route `/admin/casestudies`)
- **Backend Contributions**:
  - case studies (`caseStudyRoutes.js`, route `/api/case-studies`)
  - inquiries (`inquiryRoutes.js`, route `/api/inquiries`)

---

<h2 align="center">14. Deployment Process</h2>

### 14.1 CI/CD Configuration
- **Vite Build System**: The client application is compiled into minified static assets (`npm run build`) via the Vite bundler.
- **Express Backend Hosting**: The Express application handles CORS parameters and serves request payloads. It has a custom check `if (!process.env.VERCEL)` for optional local port listening.
- **Database Access Control**: IP addresses for deployment servers are whitelisted inside the MongoDB Atlas portal to permit transaction requests.

---

<h2 align="center">15. Challenges Faced During Development</h2>

### 15.1 Frontend Challenges
- **Interactive Background Lag**: The cool moving fluid background (WebGL/OGL) took up a lot of computer memory. When moving between normal pages and the admin area, the background wouldn't reset correctly, causing the page to lag or freeze. We had to write code to clean up the WebGL data whenever we switched pages.
- **Page Loading Flickers**: When we set up page loading optimization (lazy loading in React), the pages would briefly look broken or shift around while loading. We solved this by creating a simple loading spinner that holds the page layout still until everything is ready.
- **Empty Review Sliders**: Sometimes the testimonial slider would load before the data came back from the database, showing an empty box. We had to add a simple check to make sure the reviews actually loaded before showing the slider on the screen.
- **CSS Style Fights**: We used both Material-UI and Tailwind CSS for styling. However, their default styles fought with each other, making text boxes look weird. We had to write a custom style settings file to make them play nice together.
- **Handling Data and Props**: Passing data down through too many layers of components (prop drilling) got confusing, and sometimes the frontend got out of sync with what was actually saved in the backend database.
- **Handling Loading and Error Screens**: Making sure the app didn't crash when a network call failed, and showing nice "loading" or "empty" screens instead of blank pages, took a lot of testing.

### 15.2 Backend Challenges
- **Resume Upload Crashes**: Since we hosted the backend on Vercel, it wouldn't let us save files directly to the server disk. To upload resumes, we had to temporarily store them in the computer's memory using Multer and send them straight to Cloudinary as a data stream.
- **Emails Not Sending**: The server didn't want to send confirmation emails to applicants at first because of security and certificate blockages. We had to bypass these checks by tweaking the SMTP mailer settings.
- **Database Connection Timeouts**: When working on our local machines, the app would sometimes take forever to connect to our cloud MongoDB database. We fixed this by forcing the app to use IPv4 instead of searching for IPv6 addresses.
- **Orphaned Images on Cloudinary**: When we deleted a blog post or a case study, the image remained on Cloudinary, wasting cloud space. We had to add a delete script that logs into Cloudinary and removes the image there whenever a post is deleted.
- **Async Function Failures**: Writing backend code that waits for database results (async/await) sometimes crashed the whole server if a query failed. We had to wrap our routes in try-catch statements to keep the server running.
- **Changing Database Rules**: As our requirements changed, we had to constantly update the database structures (Mongoose schemas) to make sure users couldn't submit empty or invalid data.

---

<h2 align="center">16. Future Enhancements</h2>

### 16.1 Roadmap Tasks
- **Automated Interview Scheduling**: Direct integration with external calendar engines to book consultations.
- **Audit Logging System**: Detailed metadata recording to track administrative data updates and actions.
- **Multi-Tenant Roles**: Multi-tier permissions (e.g., Editor, SuperAdmin) inside the admin panel.

---

<h2 align="center">17. Conclusion</h2>

### 17.1 Closing Summary
The Strivo Consultancy Website project showcases a modern, secure, and production-ready MERN application. By implementing stateless administrative controls, in-memory media uploads, and structured NoSQL collections, the application provides a scalable corporate platform capable of handling operational client traffic with premium aesthetics.
