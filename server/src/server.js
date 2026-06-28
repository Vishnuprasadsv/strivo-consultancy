import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import successStoryRoutes from './routes/successStoryRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import caseStudyRoutes from "./routes/caseStudyRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import talentRoutes from "./routes/talentRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
// Load env vars


// Connect to database
connectDB();
console.log("CLOUDINARY_CLOUD_NAME:", JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME));
console.log("CLOUDINARY_API_KEY:", JSON.stringify(process.env.CLOUDINARY_API_KEY));
console.log("CLOUDINARY_API_SECRET:", JSON.stringify(process.env.CLOUDINARY_API_SECRET));

const app = express();

import path from 'path';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads directory statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/success-stories', successStoryRoutes);
// career

app.use('/api/career', careerRoutes);
app.use('/api/talent', talentRoutes);

app.use('/api/articles', articleRoutes);
app.use('/api/reviews', reviewRoutes);

app.use('/api/inquiries', inquiryRoutes);
app.use("/api/case-studies", caseStudyRoutes);
app.get('/', (req, res) => {
  res.send('Strivo Consultancy API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: err
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
