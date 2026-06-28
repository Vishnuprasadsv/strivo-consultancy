# Strivo Consultancy

**Deployed Link:** [https://strivo-psi.vercel.app/](https://strivo-psi.vercel.app/)  
**GitHub Repository:** [https://github.com/Vishnuprasadsv/strivo-consultancy.git](https://github.com/Vishnuprasadsv/strivo-consultancy.git)

Strivo Consultancy is a full-stack web application designed to manage and streamline consultancy operations. It features a robust backend built with Node.js and Express, connected to a MongoDB database, and a dynamic, responsive frontend built with React, Vite, and Tailwind CSS. The platform includes secure authentication, file management via Cloudinary, email notifications, and an admin dashboard.

---

## 🚀 Features

- **User & Admin Authentication**: Secure login and registration using JWT (JSON Web Tokens) and bcrypt for password hashing. Includes password recovery (Forgot Password) functionality.
- **Admin Dashboard**: A comprehensive dashboard for administrators to manage users, data, and platform settings.
- **File Uploads**: Seamless image and file uploading integration using Cloudinary and Multer.
- **Email Notifications**: Automated email sending functionality powered by Nodemailer.
- **Interactive UI**: A highly interactive and modern user interface utilizing Framer Motion for animations, Material UI, and Tailwind CSS for styling.
- **Data Visualization**: Charts and analytics displayed using Recharts.
- **Responsive Design**: Fully responsive layout ensuring a great user experience across all devices.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v4, Material UI (@mui/material), Emotion
- **Routing**: React Router DOM
- **Animations & Graphics**: Framer Motion, OGL, React CountUp
- **Carousels/Sliders**: Swiper, Embla Carousel
- **Icons**: React Icons, Material Icons
- **Data Visualization**: Recharts
- **Notifications**: Sonner

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Token (JWT), bcryptjs
- **File Storage**: Cloudinary, Multer, multer-storage-cloudinary, streamifier
- **Email Service**: Nodemailer
- **Environment Management**: dotenv
- **Middleware**: CORS

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Cloudinary Account** (for file storage)
- **SMTP Server Details** (for Nodemailer emails, e.g., Gmail App Passwords)

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### 1. Clone the repository
```bash
git clone <repository-url>
cd strivo-consultancy
```

### 2. Setup the Backend (Server)

Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

**Create Environment Variables:**
Create a `.env` file in the `server` root directory and add the following configurations:
```env
# Server
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email / Nodemailer
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Start the backend development server:
```bash
npm run dev
```
The server should now be running on `http://localhost:5000`.

### 3. Setup the Frontend (Client)

Open a new terminal window, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

**Create Environment Variables:**
Create a `.env` file in the `client` root directory and add your API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```
The client application should now be accessible at `http://localhost:5173`.

---

## 📂 Project Structure

```text
strivo-consultancy/
├── client/                 # Frontend React Application
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── Admin/          # Admin dashboard components and views
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── App.jsx         # Main React component
│   │   └── main.jsx        # React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                 # Backend Node.js/Express Application
│   ├── src/                # Server source code
│   │   ├── config/         # Configuration files (Cloudinary, DB, etc.)
│   │   ├── controllers/    # Route controllers (Admin logic, etc.)
│   │   ├── models/         # Mongoose database schemas
│   │   ├── routes/         # Express API routes
│   │   ├── middleware/     # Custom middleware (Auth, etc.)
│   │   └── server.js       # Express application entry point
│   ├── package.json
│   └── vercel.json         # Deployment configuration for Vercel
│
├── .gitignore
└── README.md
```

---

## 📜 Available Scripts

### Client Scripts
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Locally previews the production build.

### Server Scripts
- `npm start`: Starts the node server (typically for production).
- `npm run dev`: Starts the server with Nodemon for development (auto-reloads on file changes).

---

## 🌐 Deployment

This project is configured for deployment. 

- **Frontend**: Can be easily deployed to platforms like Vercel, Netlify, or Firebase Hosting. Simply run `npm run build` and deploy the output `dist` folder.
- **Backend**: Can be deployed to services like Vercel (using the included `vercel.json`), Render, or Heroku. Ensure all environment variables are properly configured in your hosting platform.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the issues page.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

