import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { toast } from 'sonner';
import './DashboardStyles.css';

import {
  getAllInquiriesAPI,
  getAllCaseStudiesAPI,
  getArticlesAPI,
  getAdminApplicationsAPI,
  getReviewsAPI,
  deleteReviewAPI,
  updateReviewStatusAPI,
  updateApplicationStatusAPI
} from '../services/allApi';

import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

const axiosInstance = axios;

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeActionable, setActiveActionable] = useState(null);

  const [metrics, setMetrics] = useState({
    totalInquiries: 0,
    totalCaseStudies: 0,
    activeArticles: 0,
    newApplications: 0,
    totalApplications: 0
  });

  const [chartData, setChartData] = useState({
    combined: []
  });

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    clientStories: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showAppointmentApprovalModal, setShowAppointmentApprovalModal] = useState(false);

  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [editingStory, setEditingStory] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [storyErrors, setStoryErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: '', // 'review' | 'story'
    id: null,
    title: '',
    message: ''
  });
  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('this-week');
  const [showDetailedReportModal, setShowDetailedReportModal] = useState(false);
  const [showPdfExportModal, setShowPdfExportModal] = useState(false);
  const [exportFromDate, setExportFromDate] = useState('');
  const [exportToDate, setExportToDate] = useState('');
  const [isPendingExpanded, setIsPendingExpanded] = useState(false);
  const lastGeneratedTime = 'Jul 12, 2025 • 10:30 AM';

  // Reviews filters, search, and pagination
  const [reviewsSearch, setReviewsSearch] = useState('');
  const [reviewsStatusFilter, setReviewsStatusFilter] = useState('All');
  const [reviewsPage, setReviewsPage] = useState(1);
  const reviewsPerPage = 5;

  // Stories search and pagination
  const [storiesSearch, setStoriesSearch] = useState('');
  const [storiesPage, setStoriesPage] = useState(1);
  const storiesPerPage = 5;

  const [activeMgmtTab, setActiveMgmtTab] = useState('reviews');
  const [activeReviewDetails, setActiveReviewDetails] = useState(null);
  const [activeStoryDetails, setActiveStoryDetails] = useState(null);
  const [deletedCount, setDeletedCount] = useState(0);
  const [appointments, setAppointments] = useState([]);

  // Store lists for real-time dashboard data
  const [inquiries, setInquiries] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [articles, setArticles] = useState([]);
  const [applications, setApplications] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getLastUpdatedText = (itemsList) => {
    if (!itemsList || itemsList.length === 0) return 'N/A';
    
    // Find the latest item based on createdAt
    let latestDate = null;
    itemsList.forEach(item => {
      const dateVal = item.createdAt ? new Date(item.createdAt) : null;
      if (dateVal) {
        if (!latestDate || dateVal > latestDate) {
          latestDate = dateVal;
        }
      }
    });
    
    if (!latestDate) return 'N/A';
    
    return latestDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getLastUpdatedAppsText = () => {
    if (!appointments || appointments.length === 0) return 'N/A';
    let latestDate = null;
    appointments.forEach(item => {
      let itemTime = null;
      if (item.updatedAt) {
        itemTime = new Date(item.updatedAt);
      } else if (item.createdAt) {
        itemTime = new Date(item.createdAt);
      } else if (item.id && typeof item.id === 'number' && item.id > 1000000000) {
        itemTime = new Date(item.id);
      }
      if (itemTime && !isNaN(itemTime.getTime())) {
        if (!latestDate || itemTime > latestDate) {
          latestDate = itemTime;
        }
      }
    });
    if (!latestDate) return 'N/A';
    return latestDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  };

  const getMotivationalMessage = (pendingCount) => {
    if (pendingCount === 0) {
      return {
        title: "All Tasks Completed!",
        text: "Outstanding work! You've achieved a perfect day. Enjoy the success! 🚀",
        color: "text-green-700 bg-green-50/50 border-green-200"
      };
    }
    
    const quotes = [
      {
        title: "You've Got This!",
        text: `Only ${pendingCount} task${pendingCount > 1 ? 's' : ''} left to wrap up a productive day. Let's finish strong! 💪`,
        color: "text-blue-700 bg-blue-50/50 border-blue-200"
      },
      {
        title: "Stay Focused!",
        text: "Every small task completed is a step closer to seamless operations. Keep going! 🎯",
        color: "text-indigo-700 bg-indigo-50/50 border-indigo-200"
      },
      {
        title: "Keep Up the Momentum!",
        text: "Productivity is built on consistent execution. You are doing great! ✨",
        color: "text-violet-700 bg-violet-50/50 border-violet-200"
      }
    ];
    
    const selectIdx = pendingCount % quotes.length;
    return quotes[selectIdx];
  };

  const fetchStories = async () => {
    try {
      const response = await axiosInstance.get(`${import.meta.env.VITE_API_BASE_URL}/api/success-stories`);
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoadingStories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleCloseStoryModal = () => {
    setShowStoryModal(false);
    setEditingStory(null);
    setFormData({ name: '', position: '', clientStories: '', image: null });
    setStoryErrors({});
    const imgInput = document.getElementById('imageUpload');
    if (imgInput) imgInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!(formData.name || '').trim()) {
      errors.name = "Name is required";
    }
    if (!(formData.position || '').trim()) {
      errors.position = "Position & Company are required";
    }
    if (!(formData.clientStories || '').trim()) {
      errors.clientStories = "Client Success Story is required";
    }
    if (!editingStory && !formData.image) {
      errors.image = "Client image is required";
    }

    if (Object.keys(errors).length > 0) {
      setStoryErrors(errors);
      return;
    }

    if (editingStory) {
      const isNameUnchanged = (formData.name || '').trim() === (editingStory.name || '').trim();
      const isPositionUnchanged = (formData.position || '').trim() === (editingStory.position || '').trim();
      const isStoriesUnchanged = (formData.clientStories || '').trim() === (editingStory.clientStories || '').trim();
      const isImageUnchanged = !formData.image;

      if (isNameUnchanged && isPositionUnchanged && isStoriesUnchanged && isImageUnchanged) {
        toast.info('No changes has been made in the edit');
        handleCloseStoryModal();
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('position', formData.position);
      data.append('clientStories', formData.clientStories);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingStory) {
        await axiosInstance.put(`${import.meta.env.VITE_API_BASE_URL}/api/success-stories/${editingStory._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Client success story updated successfully!');
      } else {
        await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/success-stories`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Client success story added successfully!');
      }
      handleCloseStoryModal();
      fetchStories();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Failed to save success story';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStory = (id) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'story',
      id: id,
      title: 'Delete Success Story',
      message: 'Are you sure you want to delete this success story? This action cannot be undone.'
    });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({
      isOpen: false,
      type: '',
      id: null,
      title: '',
      message: ''
    });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteConfirm;
    handleCancelDelete();
    if (type === 'review') {
      try {
        await deleteReviewAPI(id);
        toast.success('Review deleted successfully');
        setReviews(prev => prev.filter(review => review._id !== id));
        setDeletedCount(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      }
    } else if (type === 'story') {
      try {
        await axiosInstance.delete(`${import.meta.env.VITE_API_BASE_URL}/api/success-stories/${id}`);
        toast.success('Story deleted successfully');
        setStories(prev => prev.filter(story => story._id !== id));
      } catch (error) {
        console.error('Error deleting story:', error);
        toast.error('Failed to delete story');
      }
    }
  };

  const getThisWeekRangeText = () => {
    const now = new Date();
    const day = now.getDay();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - day));
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const getLastWeekRangeText = () => {
    const now = new Date();
    const day = now.getDay();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day - 7);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day - 1);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const handleViewDetailedReport = () => {
    setShowDetailedReportModal(true);
  };

  const handleExportReport = (format) => {
    if (format === 'csv' || format === 'excel') {
      const headers = 'Metric,Value,Status\n';
      const rows = [
        `Total Inquiries,${inquiries.length},Active`,
        `Reviews Received,${reviews.length},Active`,
        `Reviews Approved,${reviews.filter(r => r.status === 'Approved').length},Approved`,
        `Reviews Rejected,${reviews.filter(r => r.status === 'Rejected').length},Rejected`,
        `Success Stories Published,${stories.length},Published`,
        `Case Studies Published,${caseStudies.length},Active`,
        `Case Studies Approved,${caseStudies.filter(c => c.status === 'Published').length},Approved`,
        `Applications,${applications.length},Active`,
        `Applications Referred,${applications.filter(a => a.referred).length},Referred`
      ].join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `business_analytics_report_${format === 'excel' ? 'excel.csv' : 'report.csv'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Report exported successfully as ${format.toUpperCase()}!`);
    } else if (format === 'pdf') {
      if (!exportFromDate || !exportToDate) {
        toast.error("Please select both From and To dates!");
        return;
      }
      const start = new Date(exportFromDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(exportToDate);
      end.setHours(23, 59, 59, 999);

      if (start > end) {
        toast.error("From Date cannot be later than To Date!");
        return;
      }

      // Filter all data arrays by date range
      const filteredInquiries = inquiries.filter(inq => {
        const d = new Date(inq.createdAt);
        return d >= start && d <= end;
      });

      const filteredArticles = articles.filter(art => {
        const d = new Date(art.createdAt);
        return d >= start && d <= end;
      });

      const filteredApplications = applications.filter(app => {
        const d = new Date(app.createdAt);
        return d >= start && d <= end;
      });

      const filteredReviews = reviews.filter(rev => {
        const d = new Date(rev.createdAt);
        return d >= start && d <= end;
      });

      const filteredCaseStudies = caseStudies.filter(cs => {
        const d = new Date(cs.createdAt);
        return d >= start && d <= end;
      });

      const totalReviews = filteredReviews.length;
      const rejectedReviews = filteredReviews.filter(r => r.status === 'Rejected').length;
      const rejectionRate = totalReviews ? Math.round((rejectedReviews / totalReviews) * 100) : 0;

      const inquiriesListHTML = filteredInquiries.length === 0
        ? '<tr><td colspan="4" style="text-align: center; color: #999; padding: 15px;">No inquiries received</td></tr>'
        : filteredInquiries.map(inq => `
            <tr>
              <td><strong>${inq.fullName || ''}</strong><br><small style="color: #666;">${inq.email}</small></td>
              <td>${inq.service || ''}</td>
              <td>${inq.message}</td>
              <td>${new Date(inq.createdAt).toLocaleDateString()}</td>
            </tr>
          `).join('');

      const articlesListHTML = filteredArticles.length === 0
        ? '<tr><td colspan="3" style="text-align: center; color: #999; padding: 15px;">No articles published</td></tr>'
        : filteredArticles.map(art => `
            <tr>
              <td><strong>${art.title}</strong></td>
              <td>${art.description || 'N/A'}</td>
              <td>${new Date(art.createdAt).toLocaleDateString()}</td>
            </tr>
          `).join('');

      const approvedApps = filteredApplications.filter(app => app.status === 'approved' || app.status === 'Selected' || app.status === 'Approved' || app.status === 'referred');
      const applicationsListHTML = approvedApps.length === 0
        ? '<tr><td colspan="4" style="text-align: center; color: #999; padding: 15px;">No approved applications sent to HR</td></tr>'
        : approvedApps.map(app => `
            <tr>
              <td><strong>${app.fullName}</strong></td>
              <td>${app.email}</td>
              <td>${app.appliedPosition}</td>
              <td><span style="background-color: #DEF7EC; color: #03543F; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; border: 1px solid #BCF0DA;">Sent to HR</span></td>
            </tr>
          `).join('');

      const approvedReviewsList = filteredReviews.filter(rev => rev.status === 'Approved');
      const reviewsListHTML = approvedReviewsList.length === 0
        ? '<tr><td colspan="4" style="text-align: center; color: #999; padding: 15px;">No approved reviews</td></tr>'
        : approvedReviewsList.map(rev => `
            <tr>
              <td><strong>${rev.fullName}</strong><br><small style="color: #666;">${rev.company}</small></td>
              <td style="color: #FBBF24;">${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}</td>
              <td><strong>${rev.title}</strong></td>
              <td>"${rev.review}"</td>
            </tr>
          `).join('');

      const publishedCaseStudies = filteredCaseStudies.filter(cs => cs.status === 'Published');
      const caseStudiesListHTML = publishedCaseStudies.length === 0
        ? '<tr><td colspan="3" style="text-align: center; color: #999; padding: 15px;">No approved case studies</td></tr>'
        : publishedCaseStudies.map(cs => `
            <tr>
              <td><strong>${cs.title}</strong></td>
              <td>${cs.author}</td>
              <td>${cs.authorRole || 'Author'}</td>
            </tr>
          `).join('');

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Business Analytics & Export Report</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #333; line-height: 1.5; background-color: #fff; }
              .header-logo { font-size: 24px; font-weight: bold; color: #012959; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
              h1 { color: #012959; border-bottom: 2px solid #012959; padding-bottom: 10px; margin: 0 0 5px 0; font-size: 26px; }
              .subtitle { font-size: 14px; color: #666; margin-bottom: 25px; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #F9FAFB; padding: 15px; border: 1px solid #E5E7EB; border-radius: 4px; }
              .meta-grid p { margin: 4px 0; font-size: 13px; color: #4B5563; }
              
              .kpi-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 40px; }
              .kpi-card { border: 1px solid #E5E7EB; padding: 15px; border-radius: 4px; text-align: center; background-color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
              .kpi-title { font-size: 11px; font-weight: bold; color: #6B7280; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }
              .kpi-value { font-size: 26px; font-weight: 800; color: #012959; }
              
              h2 { font-size: 16px; color: #012959; background-color: #F3F4F6; padding: 8px 12px; margin: 35px 0 15px 0; border-left: 4px solid #012959; border-radius: 0 4px 4px 0; text-transform: uppercase; letter-spacing: 0.5px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
              th, td { border: 1px solid #E5E7EB; padding: 10px 12px; text-align: left; font-size: 13px; vertical-align: top; }
              th { background-color: #F9FAFB; color: #1F2937; font-weight: bold; }
              
              .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #9B9C9E; border-top: 1px solid #E5E7EB; padding-top: 15px; font-weight: 500; }
              @media print {
                body { padding: 20px; }
                h2 { background-color: #F3F4F6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div class="header-logo">Strivo Consultancy</div>
            <h1>Business Analytics & Export Report</h1>
            <div class="subtitle">Sectional Summary and Operational Audit Dossier</div>
            
            <div class="meta-grid">
              <div>
                <p><strong>Report Period:</strong> ${exportFromDate} to ${exportToDate}</p>
                <p><strong>Generated On:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              </div>
              <div>
                <p><strong>Author Role:</strong> Platform Administrator</p>
                <p><strong>Dossier Status:</strong> Verified & Released</p>
              </div>
            </div>

            <div class="kpi-container">
              <div class="kpi-card">
                <div class="kpi-title">Total Inquiries</div>
                <div class="kpi-value">${filteredInquiries.length}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-title">Reviews Rejection Rate</div>
                <div class="kpi-value">${rejectionRate}%</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-title">Approved Reviews</div>
                <div class="kpi-value">${approvedReviewsList.length}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-title">HR Forwards</div>
                <div class="kpi-value">${approvedApps.length}</div>
              </div>
            </div>

            <h2>1. Inquiries Received Section</h2>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">Client Details</th>
                  <th style="width: 20%;">Subject</th>
                  <th style="width: 40%;">Message Body</th>
                  <th style="width: 15%;">Received Date</th>
                </tr>
              </thead>
              <tbody>
                ${inquiriesListHTML}
              </tbody>
            </table>

            <h2>2. Published Articles Section</h2>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%;">Article Title</th>
                  <th style="width: 55%;">Brief Description</th>
                  <th style="width: 15%;">Published Date</th>
                </tr>
              </thead>
              <tbody>
                ${articlesListHTML}
              </tbody>
            </table>

            <h2>3. Approved Applications (Sent to HR)</h2>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%;">Applicant Name</th>
                  <th style="width: 30%;">Email Address</th>
                  <th style="width: 25%;">Target Position</th>
                  <th style="width: 15%;">HR Routing Status</th>
                </tr>
              </thead>
              <tbody>
                ${applicationsListHTML}
              </tbody>
            </table>

            <h2>4. Approved Client Reviews</h2>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">Reviewer Details</th>
                  <th style="width: 15%;">Rating</th>
                  <th style="width: 20%;">Review Title</th>
                  <th style="width: 40%;">Review Content</th>
                </tr>
              </thead>
              <tbody>
                ${reviewsListHTML}
              </tbody>
            </table>

            <h2>5. Approved Case Studies</h2>
            <table>
              <thead>
                <tr>
                  <th style="width: 40%;">Case Study Title</th>
                  <th style="width: 30%;">Lead Author</th>
                  <th style="width: 30%;">Author Professional Role</th>
                </tr>
              </thead>
              <tbody>
                ${caseStudiesListHTML}
              </tbody>
            </table>
            
            <div class="footer">
              Strivo Consultancy Dossier Report • Confidential Administration Use Only • Page generated under authorization
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      toast.success('Detailed PDF report print dossier generated!');
      setShowPdfExportModal(false);
    }
  };

  const renderAnalyticsMetricCard = (title, value, percentage, isPositive) => {
    return (
      <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-2.5 flex flex-col justify-between items-center text-center shadow-sm min-h-[85px] transition hover:shadow-md w-full">
        <span className="text-[10px] font-bold text-paragraph opacity-70 tracking-tight leading-tight line-clamp-2 h-7 flex items-center justify-center">
          {title}
        </span>
        <span className="text-lg font-[var(--font-bold)] text-primary my-1">
          {value}
        </span>
        {isPositive === null ? (
          <span className="text-[10px] font-bold text-paragraph opacity-55 flex items-center gap-0.5">
            ⚪ {percentage}
          </span>
        ) : isPositive ? (
          <span className="text-[10px] font-bold text-green-600 flex items-center gap-0.5">
            ▲ {percentage}
          </span>
        ) : (
          <span className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">
            ▼ {percentage}
          </span>
        )}
      </div>
    );
  };

  const handleDeleteReview = (id) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'review',
      id: id,
      title: 'Delete Review',
      message: 'Are you sure you want to delete this review? This action cannot be undone.'
    });
  };

  const handleApproveReview = async (id) => {
    try {
      const res = await updateReviewStatusAPI(id, { status: 'Approved' });
      if (res.status === 200) {
        toast.success('Review approved successfully!');
        setReviews(reviews.map(r => r._id === id ? { ...r, status: 'Approved' } : r));
        fetchMetrics();
      } else {
        toast.error('Failed to approve review');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error approving review');
    }
  };

  const handleRejectReview = async (id) => {
    try {
      const res = await updateReviewStatusAPI(id, { status: 'Rejected' });
      if (res.status === 200) {
        toast.success('Review rejected successfully');
        setReviews(reviews.map(r => r._id === id ? { ...r, status: 'Rejected' } : r));
        fetchMetrics();
      } else {
        toast.error('Failed to reject review');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error rejecting review');
    }
  };

  const fetchMetrics = async () => {
    try {
      const [inquiriesRes, caseStudiesRes, articlesRes, applicationsRes, reviewsRes] = await Promise.all([
        getAllInquiriesAPI(),
        getAllCaseStudiesAPI(),
        getArticlesAPI(),
        getAdminApplicationsAPI(),
        getReviewsAPI()
      ]);

      const inquiriesList = inquiriesRes.status === 200 ? inquiriesRes.data : [];
      const caseStudiesList = caseStudiesRes.status === 200 ? caseStudiesRes.data : [];
      const articlesList = (articlesRes.status === 200 && articlesRes.data?.success) ? articlesRes.data.data : [];
      const applicationsList = (applicationsRes.status === 200 && applicationsRes.data?.success) ? applicationsRes.data.data : [];

      const sortedInquiries = [...inquiriesList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const sortedCaseStudies = [...caseStudiesList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const sortedArticles = [...articlesList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const sortedApplications = [...applicationsList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setInquiries(sortedInquiries);
      setCaseStudies(sortedCaseStudies);
      setArticles(sortedArticles);
      setApplications(sortedApplications);

      setMetrics({
        totalInquiries: inquiriesList.length,
        totalCaseStudies: caseStudiesList.length,
        activeArticles: articlesList.length,
        newApplications: applicationsList.filter(app => app.status === "pending").length,
        totalApplications: applicationsList.length
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        last7Days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }

      const getCountsByDate = (dataArray) => {
        const counts = {};
        last7Days.forEach(date => { counts[date] = 0; });
        if (Array.isArray(dataArray)) {
          dataArray.forEach(item => {
            if (item.createdAt) {
              const d = new Date(item.createdAt);
              const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              if (counts[dateStr] !== undefined) {
                counts[dateStr]++;
              }
            }
          });
        }
        return counts;
      };

      const inquiriesCounts = getCountsByDate(inquiriesList);
      const caseStudiesCounts = getCountsByDate(caseStudiesList);
      const articlesCounts = getCountsByDate(articlesList);
      const applicationsCounts = getCountsByDate(applicationsList);

      const combinedChart = last7Days.map(date => ({
        date,
        Inquiries: inquiriesCounts[date] || 0,
        'Case Studies': caseStudiesCounts[date] || 0,
        Articles: articlesCounts[date] || 0,
        Applications: applicationsCounts[date] || 0
      }));

      const hasRealData = combinedChart.some(item => item.Inquiries > 0 || item['Case Studies'] > 0 || item.Articles > 0 || item.Applications > 0);
      if (!hasRealData) {
        setChartData({
          combined: last7Days.map((date, idx) => ({
            date,
            Inquiries: [5, 8, 7, 12, 10, 8, 9][idx] + (inquiriesList.length ? 1 : 0),
            'Case Studies': [1, 2, 2, 4, 3, 2, 3][idx] + (caseStudiesList.length ? 1 : 0),
            Articles: [0, 1, 1, 2, 1, 2, 2][idx] + (articlesList.length ? 1 : 0),
            Applications: [0, 0, 1, 2, 0, 1, 0][idx] + (applicationsList.length ? 1 : 0)
          }))
        });
      } else {
        setChartData({
          combined: combinedChart
        });
      }

      if (reviewsRes.status === 200 && reviewsRes.data?.success) {
        setReviews(reviewsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchAppointments = () => {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  };

  const handleApproveAppointment = async (id) => {
    const storedApps = localStorage.getItem('appointments');
    if (!storedApps) return;
    try {
      const apps = JSON.parse(storedApps);
      const appRecord = apps.find(a => a.id === id);
      if (!appRecord) return;

      const updatedApps = apps.map(a => a.id === id ? { ...a, status: 'Approved', updatedAt: new Date().toISOString() } : a);
      localStorage.setItem('appointments', JSON.stringify(updatedApps));
      window.dispatchEvent(new Event('appointmentsUpdated'));

      // Sync to interviews
      const storedInts = localStorage.getItem('interviews');
      if (storedInts) {
        const ints = JSON.parse(storedInts);
        const updatedInts = ints.map(i => i.email.toLowerCase() === appRecord.email.toLowerCase() ? { ...i, status: 'Approved' } : i);
        localStorage.setItem('interviews', JSON.stringify(updatedInts));
        window.dispatchEvent(new Event('interviewsUpdated'));
      }

      toast.success("Appointment request approved by Admin!");
      fetchAppointments();
      fetchMetrics();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve appointment.");
    }
  };

  const handleRejectAppointment = async (id) => {
    const storedApps = localStorage.getItem('appointments');
    if (!storedApps) return;
    try {
      const apps = JSON.parse(storedApps);
      const appRecord = apps.find(a => a.id === id);
      if (!appRecord) return;

      const updatedApps = apps.map(a => a.id === id ? { ...a, status: 'Rejected', updatedAt: new Date().toISOString() } : a);
      localStorage.setItem('appointments', JSON.stringify(updatedApps));
      window.dispatchEvent(new Event('appointmentsUpdated'));

      // Sync to interviews
      const storedInts = localStorage.getItem('interviews');
      if (storedInts) {
        const ints = JSON.parse(storedInts);
        const updatedInts = ints.map(i => i.email.toLowerCase() === appRecord.email.toLowerCase() ? { ...i, status: 'Rejected' } : i);
        localStorage.setItem('interviews', JSON.stringify(updatedInts));
        window.dispatchEvent(new Event('interviewsUpdated'));
      }

      // Update backend status to rejected
      const candidateApp = applications.find(a => a.email.toLowerCase() === appRecord.email.toLowerCase());
      if (candidateApp) {
        await updateApplicationStatusAPI(candidateApp._id, 'rejected');
      }

      toast.success("Appointment request rejected.");
      fetchAppointments();
      fetchMetrics();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject appointment.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');

    if (!token || !user) {
      navigate('/admin/login');
    } else {
      setAdminUser(JSON.parse(user));
      fetchStories();
      fetchMetrics();
      fetchAppointments();

      const handleUpdate = () => fetchMetrics();
      const handleAppsUpdate = () => fetchAppointments();
      window.addEventListener('notificationUpdate', handleUpdate);
      window.addEventListener('appointmentsUpdated', handleAppsUpdate);
      const interval = setInterval(fetchMetrics, 15000);

      return () => {
        window.removeEventListener('notificationUpdate', handleUpdate);
        window.removeEventListener('appointmentsUpdated', handleAppsUpdate);
        clearInterval(interval);
      };
    }
  }, [navigate]);

  const filteredReviews = reviews.filter(rev => {
    const status = rev.status || 'Pending';
    const matchesStatus = reviewsStatusFilter === 'All' || status === reviewsStatusFilter;
    
    const searchLower = (reviewsSearch || '').toLowerCase();
    const matchesSearch = 
      (rev.fullName || '').toLowerCase().includes(searchLower) ||
      (rev.company || '').toLowerCase().includes(searchLower) ||
      (rev.title || '').toLowerCase().includes(searchLower) ||
      (rev.review || '').toLowerCase().includes(searchLower);
      
    return matchesStatus && matchesSearch;
  });

  const totalReviewsPages = Math.ceil(filteredReviews.length / reviewsPerPage) || 1;
  const currentReviewsPage = Math.min(reviewsPage, totalReviewsPages);
  const reviewsStartIndex = (currentReviewsPage - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(reviewsStartIndex, reviewsStartIndex + reviewsPerPage);

  const filteredStories = stories.filter(story => {
    const searchLower = (storiesSearch || '').toLowerCase();
    return (
      (story.name || '').toLowerCase().includes(searchLower) ||
      (story.position || '').toLowerCase().includes(searchLower) ||
      (story.clientStories || '').toLowerCase().includes(searchLower)
    );
  });

  const totalStoriesPages = Math.ceil(filteredStories.length / storiesPerPage) || 1;
  const currentStoriesPage = Math.min(storiesPage, totalStoriesPages);
  const storiesStartIndex = (currentStoriesPage - 1) * storiesPerPage;
  const paginatedStories = filteredStories.slice(storiesStartIndex, storiesStartIndex + storiesPerPage);

  const handleOpenActionable = (moduleName, count, divertPath) => {
    if (count === 0) {
      if (moduleName === 'Reviews') {
        setActiveMgmtTab('reviews');
        setTimeout(() => {
          document.getElementById('content-management')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (moduleName === 'Success Stories') {
        setActiveMgmtTab('stories');
        setTimeout(() => {
          document.getElementById('content-management')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        navigate(divertPath);
      }
    } else {
      if (moduleName === 'Reviews' || moduleName === 'Success Stories') {
        setActiveActionable({
          moduleName,
          count,
          divertPath: '#content-management'
        });
      } else {
        setActiveActionable({
          moduleName,
          count,
          divertPath
        });
      }
    }
  };

  const handleTaskClick = (task) => {
    if (task.isCompleted) {
      toast.success(task.successMsg, {
        duration: 3000
      });
    } else {
      toast(task.failMsg, {
        duration: 4000,
        style: {
          background: 'var(--color-main-bg)',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)'
        }
      });
    }
  };

  if (!adminUser) return null;

  // Real-time task verification variables with Date Range filtering (9 AM today to 5 PM tomorrow)
  const getTodayRange = () => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(9, 0, 0, 0);
    
    const end = new Date(now);
    end.setDate(end.getDate() + 1);
    end.setHours(17, 0, 0, 0);
    
    if (now < start) {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    }
    return { start, end };
  };

  const isTodayTask = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const { start, end } = getTodayRange();
    return d >= start && d <= end;
  };

  const todayInquiriesCount = inquiries.filter(inq => inq.status === 'New' && isTodayTask(inq.createdAt)).length;
  const pendingInquiriesCount = inquiries.filter(inq => inq.status === 'New' && !isTodayTask(inq.createdAt)).length;

  const todayAppsCount = applications.filter(app => app.status === 'pending' && isTodayTask(app.createdAt)).length;
  const pendingAppsCount = applications.filter(app => app.status === 'pending' && !isTodayTask(app.createdAt)).length;

  const todayCaseStudiesCount = caseStudies.filter(cs => cs.status === 'Draft' && isTodayTask(cs.createdAt)).length;
  const pendingCaseStudiesCount = caseStudies.filter(cs => cs.status === 'Draft' && !isTodayTask(cs.createdAt)).length;

  const todayReviewsCount = reviews.filter(r => (r.status || 'Pending') === 'Pending' && isTodayTask(r.createdAt)).length;
  const pendingReviewsCount = reviews.filter(r => (r.status || 'Pending') === 'Pending' && !isTodayTask(r.createdAt)).length;

  const draftStoriesCount = 0; // Success stories are always published and do not have draft/pending moderation states
  const draftArticlesCount = articles.filter(art => art.status === 'Draft').length;

  const tasksList = [
    {
      id: 'inquiries',
      text: `Review ${todayInquiriesCount} New Inquiries`,
      isCompleted: todayInquiriesCount === 0,
      pendingCount: todayInquiriesCount,
      successMsg: "Great job! 👍 All today's inquiries reviewed!",
      failMsg: `You are doing great! ${todayInquiriesCount} more today's inquiries to complete, all the best!`
    },
    {
      id: 'applications',
      text: `Review ${todayAppsCount} Applications`,
      isCompleted: todayAppsCount === 0,
      pendingCount: todayAppsCount,
      successMsg: "Superb! 🌟 All today's career applications reviewed!",
      failMsg: `You are doing great! ${todayAppsCount} more today's applications to complete, all the best!`
    },
    {
      id: 'caseStudies',
      text: `Approve ${todayCaseStudiesCount} Case Study`,
      isCompleted: todayCaseStudiesCount === 0,
      pendingCount: todayCaseStudiesCount,
      successMsg: "Awesome! 🌟 All today's case studies approved!",
      failMsg: `You are doing great! ${todayCaseStudiesCount} more today's case study to complete, all the best!`
    },
    {
      id: 'reviews',
      text: `Approve ${todayReviewsCount} Reviews`,
      isCompleted: todayReviewsCount === 0,
      pendingCount: todayReviewsCount,
      successMsg: "Fantastic! Double thumbs up 👍👍 All today's reviews approved!",
      failMsg: `You are doing great! ${todayReviewsCount} more today's reviews to complete, all the best!`
    }
  ];

  const pendingTasksList = [
    {
      id: 'inquiries',
      text: `Review ${pendingInquiriesCount} Older Inquiries`,
      isCompleted: pendingInquiriesCount === 0,
      pendingCount: pendingInquiriesCount,
      successMsg: "Great job! 👍 All older pending inquiries reviewed!",
      failMsg: `You are doing great! ${pendingInquiriesCount} older pending inquiries to complete, all the best!`
    },
    {
      id: 'applications',
      text: `Review ${pendingAppsCount} Older Applications`,
      isCompleted: pendingAppsCount === 0,
      pendingCount: pendingAppsCount,
      successMsg: "Superb! 🌟 All older career applications reviewed!",
      failMsg: `You are doing great! ${pendingAppsCount} older pending applications to complete, all the best!`
    },
    {
      id: 'caseStudies',
      text: `Approve ${pendingCaseStudiesCount} Older Case Study`,
      isCompleted: pendingCaseStudiesCount === 0,
      pendingCount: pendingCaseStudiesCount,
      successMsg: "Awesome! 🌟 All older case studies approved!",
      failMsg: `You are doing great! ${pendingCaseStudiesCount} older pending case study to complete, all the best!`
    },
    {
      id: 'reviews',
      text: `Approve ${pendingReviewsCount} Older Reviews`,
      isCompleted: pendingReviewsCount === 0,
      pendingCount: pendingReviewsCount,
      successMsg: "Fantastic! Double thumbs up 👍👍 All older reviews approved!",
      failMsg: `You are doing great! ${pendingReviewsCount} older pending reviews to complete, all the best!`
    }
  ];

  const getFilteredDataByPeriod = (items, dateKey = 'createdAt') => {
    if (!items || items.length === 0) return [];
    if (reportPeriod === 'all-time') return items;

    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (reportPeriod === 'this-week') {
      const day = now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - day), 23, 59, 59);
    } else if (reportPeriod === 'last-week') {
      const day = now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day - 7, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day - 1, 23, 59, 59);
    } else if (reportPeriod === 'this-month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else {
      return items;
    }

    return items.filter(item => {
      const d = new Date(item[dateKey]);
      return d >= start && d <= end;
    });
  };

  const periodInquiries = getFilteredDataByPeriod(inquiries);
  const periodCaseStudies = getFilteredDataByPeriod(caseStudies);
  const periodArticles = getFilteredDataByPeriod(articles);
  const periodApplications = getFilteredDataByPeriod(applications);
  const periodReviews = getFilteredDataByPeriod(reviews);
  const periodStories = getFilteredDataByPeriod(stories);

  const overviewPieData = [
    { name: 'Inquiries', value: periodInquiries.length, color: '#2563EB' },
    { name: 'Case Studies', value: periodCaseStudies.length, color: '#10B981' },
    { name: 'Articles', value: periodArticles.length, color: '#8B5CF6' },
    { name: 'Applications', value: periodApplications.length, color: '#F59E0B' },
    { name: 'Reviews', value: periodReviews.length, color: '#EC4899' }
  ].filter(item => item.value > 0);

  // If no data, show mockup items
  if (overviewPieData.length === 0) {
    overviewPieData.push(
      { name: 'Inquiries', value: 8, color: '#2563EB' },
      { name: 'Case Studies', value: 3, color: '#10B981' },
      { name: 'Articles', value: 2, color: '#8B5CF6' },
      { name: 'Applications', value: 1, color: '#F59E0B' },
      { name: 'Reviews', value: 4, color: '#EC4899' }
    );
  }

  return (
    <>
      <div className="min-h-screen bg-sub flex flex-col font-primary" style={{ fontFamily: 'var(--font-primary)' }}>
      
      {/* Top Header Section with bg-main spanning full-width */}
      <div className="bg-main pt-24 pb-6 border-b border-[var(--color-border)] px-8 md:px-16 lg:px-24">
        <div className="max-w-[98%] mx-auto">
          {/* Header Row - Styled exactly to match standard admin page titles */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 w-full">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
              <h1 className="text-2xl font-[var(--font-bold)] text-primary leading-none uppercase" style={{ margin: 0 }}>
                ADMIN DASHBOARD
              </h1>
              <p className="text-xs text-[var(--color-black)] font-medium opacity-85 mt-2" style={{ margin: '6px 0 0 0', lineHeight: 1.3 }}>
                Manage your platform data here
              </p>
            </div>
            <button
              onClick={() => setShowDetailedReportModal(true)}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-5 rounded-[var(--radius-sm)] flex items-center gap-2 transition cursor-pointer border-none"
            >
              <span>📊</span> PLATFORM ANALYTICS
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section - Rendered over grey backdrop (bg-sub) */}
      <div className="flex-grow py-8 px-8 md:px-16 lg:px-24">
        <div className="max-w-[98%] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >

          {/* StatsCards (Grid of 4 - No Icons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 relative z-10">
            {/* Card 1: Total Inquiries */}
            <div className="card bg-white p-4 flex flex-col justify-between items-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-300">
              <div>
                <h3 className="card-title-custom" style={{ margin: 0 }}>Total Inquiries</h3>
                <p className="stats-number" style={{ margin: '3px 0 0 0', lineHeight: 1.1 }}>{metrics.totalInquiries}</p>
              </div>
              <div className="text-green-600 font-semibold mt-2.5" style={{ fontSize: 'var(--text-caption)' }}>
                ▲ 27% this week
              </div>
            </div>

            {/* Card 2: Total Case Studies */}
            <div className="card bg-white p-4 flex flex-col justify-between items-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-300">
              <div>
                <h3 className="card-title-custom" style={{ margin: 0 }}>Total Case Studies</h3>
                <p className="stats-number" style={{ margin: '3px 0 0 0', lineHeight: 1.1 }}>{metrics.totalCaseStudies}</p>
              </div>
              <div className="text-green-600 font-semibold mt-2.5" style={{ fontSize: 'var(--text-caption)' }}>
                ▲ 12% this week
              </div>
            </div>

            {/* Card 3: Active Articles */}
            <div className="card bg-white p-4 flex flex-col justify-between items-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-300">
              <div>
                <h3 className="card-title-custom" style={{ margin: 0 }}>Active Articles</h3>
                <p className="stats-number" style={{ margin: '3px 0 0 0', lineHeight: 1.1 }}>{metrics.activeArticles}</p>
              </div>
              <div className="text-paragraph opacity-50 font-semibold mt-2.5" style={{ fontSize: 'var(--text-caption)' }}>
                0% this week
              </div>
            </div>

            {/* Card 4: New Applications */}
            <div className="card bg-white p-4 flex flex-col justify-between items-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-300">
              <div>
                <h3 className="card-title-custom" style={{ margin: 0 }}>New Applications</h3>
                <p className="stats-number" style={{ margin: '3px 0 0 0', lineHeight: 1.1 }}>{metrics.newApplications}</p>
              </div>
              <div className="text-red-500 font-semibold mt-2.5" style={{ fontSize: 'var(--text-caption)' }}>
                ▼ 100% this week
              </div>
            </div>
          </div>

          {/* Actionables & Today's Tasks (Side-by-Side Grid Row) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
            {/* Actionables Card (2/3 width) */}
            <div className="card bg-white p-4 shadow-card lg:col-span-8 flex flex-col justify-between">
              <div className="border-b border-[var(--color-border)] pb-2 mb-3">
                <h3 className="text-primary font-[var(--font-bold)]" style={{ fontSize: 'var(--text-small)', margin: 0 }}>ACTIONABLES</h3>
              </div>
              <div className="hidden md:block overflow-x-auto flex-1 w-full">
                <table className="w-full text-left border-collapse table-fixed min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-primary uppercase tracking-wider" style={{ fontSize: 'var(--text-caption)' }}>
                      <th className="py-1.5 px-3 text-left w-1/5" style={{ fontWeight: 'normal' }}>MODULE</th>
                      <th className="py-1.5 px-3 text-center w-1/5" style={{ fontWeight: 'normal' }}>TOTAL</th>
                      <th className="py-1.5 px-3 text-center w-1/5" style={{ fontWeight: 'normal' }}>PENDING</th>
                      <th className="py-1.5 px-3 text-center w-1/5" style={{ fontWeight: 'normal' }}>LAST UPDATED</th>
                      <th className="py-1.5 px-3 text-center w-1/5" style={{ fontWeight: 'normal' }}>VIEW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Inquiries Row */}
                    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary transition-all" style={{ fontSize: 'var(--text-caption)' }}>
                      <td className="py-2.5 px-3 font-bold text-left w-1/5">INQUIRIES</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{inquiries.length}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{pendingInquiriesCount}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5 text-paragraph">{getLastUpdatedText(inquiries).toUpperCase()}</td>
                      <td className="py-2.5 px-3 text-center w-1/5">
                        <button
                          onClick={() => handleOpenActionable('Inquiries', pendingInquiriesCount, '/admin/inquiries')}
                          className="bg-primary hover:bg-primary-hover text-white btn-text-custom rounded-[var(--radius-sm)] cursor-pointer"
                        >
                          REVIEW
                        </button>
                      </td>
                    </tr>
                    {/* Applications Row */}
                    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary transition-all" style={{ fontSize: 'var(--text-caption)' }}>
                      <td className="py-2.5 px-3 font-bold text-left w-1/5">APPLICATIONS</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{appointments.length}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{appointments.filter(a => a.status === 'Pending Approval').length}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5 text-paragraph">{getLastUpdatedAppsText()}</td>
                      <td className="py-2.5 px-3 text-center w-1/5">
                        <button
                          onClick={() => setShowAppointmentApprovalModal(true)}
                          className="bg-primary hover:bg-primary-hover text-white btn-text-custom rounded-[var(--radius-sm)] cursor-pointer"
                        >
                          REVIEW
                        </button>
                      </td>
                    </tr>
                    {/* Articles Row */}
                    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary transition-all" style={{ fontSize: 'var(--text-caption)' }}>
                      <td className="py-2.5 px-3 font-bold text-left w-1/5">ARTICLES</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{articles.length}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{draftArticlesCount}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5 text-paragraph">{getLastUpdatedText(articles).toUpperCase()}</td>
                      <td className="py-2.5 px-3 text-center w-1/5">
                        <button
                          onClick={() => handleOpenActionable('Articles', draftArticlesCount, '/admin/article')}
                          className="bg-primary hover:bg-primary-hover text-white btn-text-custom rounded-[var(--radius-sm)] cursor-pointer"
                        >
                          PUBLISH
                        </button>
                      </td>
                    </tr>
                    {/* Case Studies Row */}
                    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary transition-all" style={{ fontSize: 'var(--text-caption)' }}>
                      <td className="py-2.5 px-3 font-bold text-left w-1/5">CASE STUDIES</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{caseStudies.length}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{pendingCaseStudiesCount}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5 text-paragraph">{getLastUpdatedText(caseStudies).toUpperCase()}</td>
                      <td className="py-2.5 px-3 text-center w-1/5">
                        <button
                          onClick={() => handleOpenActionable('Case Studies', pendingCaseStudiesCount, '/admin/casestudies')}
                          className="bg-primary hover:bg-primary-hover text-white btn-text-custom rounded-[var(--radius-sm)] cursor-pointer"
                        >
                          APPROVE
                        </button>
                      </td>
                    </tr>
                    {/* Reviews Row */}
                    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary transition-all" style={{ fontSize: 'var(--text-caption)' }}>
                      <td className="py-2.5 px-3 font-bold text-left w-1/5">REVIEWS</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{reviews.length}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{pendingReviewsCount}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5 text-paragraph">{getLastUpdatedText(reviews).toUpperCase()}</td>
                      <td className="py-2.5 px-3 text-center w-1/5">
                        <button
                          onClick={() => handleOpenActionable('Reviews', pendingReviewsCount, '#')}
                          className="bg-primary hover:bg-primary-hover text-white btn-text-custom rounded-[var(--radius-sm)] cursor-pointer"
                        >
                          MODERATE
                        </button>
                      </td>
                    </tr>
                    {/* Success Stories Row */}
                    <tr className="hover:bg-[var(--color-sub-bg)] text-primary transition-all" style={{ fontSize: 'var(--text-caption)' }}>
                      <td className="py-2.5 px-3 font-bold text-left w-1/5">SUCCESS STORIES</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{stories.length}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5">{draftStoriesCount}</td>
                      <td className="py-2.5 px-3 font-medium text-center w-1/5 text-paragraph">{getLastUpdatedText(stories).toUpperCase()}</td>
                      <td className="py-2.5 px-3 text-center w-1/5">
                        <button
                          onClick={() => handleOpenActionable('Success Stories', draftStoriesCount, '#')}
                          className="bg-primary hover:bg-primary-hover text-white btn-text-custom rounded-[var(--radius-sm)] cursor-pointer"
                        >
                          PUBLISH
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View for Actionables */}
              <div className="block md:hidden space-y-3 flex-1 w-full">
                {[
                  { name: 'INQUIRIES', total: inquiries.length, pending: pendingInquiriesCount, lastUpdated: getLastUpdatedText(inquiries).toUpperCase(), actionText: 'REVIEW', path: '/admin/inquiries', moduleKey: 'Inquiries' },
                  { name: 'APPLICATIONS', total: appointments.length, pending: appointments.filter(a => a.status === 'Pending Approval').length, lastUpdated: getLastUpdatedAppsText(), actionText: 'REVIEW', path: '/admin/career', moduleKey: 'Career' },
                  { name: 'ARTICLES', total: articles.length, pending: draftArticlesCount, lastUpdated: getLastUpdatedText(articles).toUpperCase(), actionText: 'PUBLISH', path: '/admin/article', moduleKey: 'Articles' },
                  { name: 'CASE STUDIES', total: caseStudies.length, pending: pendingCaseStudiesCount, lastUpdated: getLastUpdatedText(caseStudies).toUpperCase(), actionText: 'APPROVE', path: '/admin/casestudies', moduleKey: 'Case Studies' },
                  { name: 'REVIEWS', total: reviews.length, pending: pendingReviewsCount, lastUpdated: getLastUpdatedText(reviews).toUpperCase(), actionText: 'MODERATE', path: '#', moduleKey: 'Reviews' },
                  { name: 'SUCCESS STORIES', total: stories.length, pending: draftStoriesCount, lastUpdated: getLastUpdatedText(stories).toUpperCase(), actionText: 'PUBLISH', path: '#', moduleKey: 'Success Stories' }
                ].map((row) => (
                  <div key={row.name} className="p-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-sub-bg)]/20 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary text-sm">{row.name}</span>
                      <button
                        onClick={() => {
                          if (row.name === 'APPLICATIONS') {
                            setShowAppointmentApprovalModal(true);
                          } else {
                            handleOpenActionable(row.moduleKey, row.pending, row.path);
                          }
                        }}
                        className="bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold py-1 px-3.5 rounded-[var(--radius-sm)] cursor-pointer"
                        style={{ height: '28px', minWidth: '75px' }}
                      >
                        {row.actionText}
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[11px] text-paragraph opacity-85">
                      <div>
                        <span className="font-semibold block opacity-60">TOTAL</span>
                        <span className="font-bold text-primary">{row.total}</span>
                      </div>
                      <div>
                        <span className="font-semibold block opacity-60">PENDING</span>
                        <span className="font-bold text-primary">{row.pending}</span>
                      </div>
                      <div>
                        <span className="font-semibold block opacity-60">LAST UPDATED</span>
                        <span className="text-primary">{row.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's & Pending Tasks Card (1/3 width) */}
            <div className="card bg-white p-4 shadow-card lg:col-span-4 flex flex-col justify-start gap-4">
              <div>
                {/* Main Card Header */}
                <div className="border-b border-[var(--color-border)] pb-2 mb-4">
                  <h3 className="text-primary font-[var(--font-bold)]" style={{ fontSize: 'var(--text-small)', margin: 0 }}>TASK ALLOCATIONS</h3>
                </div>

                {/* Sub-section 1: Today's Tasks */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2 select-none">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">TODAY'S TASKS</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                      {tasksList.filter(t => !t.isCompleted).length} PENDING
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-1">
                    {tasksList.map((task) => (
                      <div
                        key={`today-${task.id}`}
                        onClick={() => handleTaskClick(task)}
                        className="flex items-center justify-between p-1.5 px-2.5 hover:bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)] cursor-pointer transition-all border border-[var(--color-border)]/40 hover:border-blue-500/20"
                      >
                        <span className="font-semibold text-paragraph" style={{ fontSize: 'var(--text-caption)' }}>
                          {task.text}
                        </span>
                        <button
                          className="focus:outline-none cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0"
                        >
                          {task.isCompleted ? (
                            <span className="text-green-600 font-bold" style={{ fontSize: 'var(--text-caption)' }}>☑</span>
                          ) : (
                            <span className="text-paragraph opacity-40 font-bold" style={{ fontSize: 'var(--text-caption)' }}>☐</span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-section 2: Pending Tasks Accordion */}
                <div>
                  <div 
                    onClick={() => setIsPendingExpanded(!isPendingExpanded)}
                    className="flex justify-between items-center mb-2 select-none cursor-pointer p-1 rounded hover:bg-[var(--color-sub-bg)]/40 transition-all"
                  >
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      PENDING SECTION
                      <span className="transition-transform duration-200 inline-block text-[8px]" style={{ transform: isPendingExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                        ▶
                      </span>
                    </span>
                    <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                      {pendingTasksList.filter(t => !t.isCompleted).length} PENDING
                    </span>
                  </div>
                  
                  {isPendingExpanded && (
                    <div className="flex flex-col gap-1.5 mt-1 border-l-2 border-amber-200/50 pl-2 ml-1">
                      {pendingTasksList.map((task) => (
                        <div
                          key={`pending-${task.id}`}
                          onClick={() => handleTaskClick(task)}
                          className="flex items-center justify-between p-1.5 px-2.5 hover:bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)] cursor-pointer transition-all border border-[var(--color-border)]/40 hover:border-blue-500/20"
                        >
                          <span className="font-semibold text-paragraph" style={{ fontSize: 'var(--text-caption)' }}>
                            {task.text}
                          </span>
                          <button
                            className="focus:outline-none cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0"
                          >
                            {task.isCompleted ? (
                              <span className="text-green-600 font-bold" style={{ fontSize: 'var(--text-caption)' }}>☑</span>
                            ) : (
                              <span className="text-paragraph opacity-40 font-bold" style={{ fontSize: 'var(--text-caption)' }}>☐</span>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Section */}
              {(() => {
                const totalTodayTasks = tasksList.length;
                const completedTodayCount = tasksList.filter(t => t.isCompleted).length;
                
                const totalPendingTasks = pendingTasksList.length;
                const completedPendingCount = pendingTasksList.filter(t => t.isCompleted).length;

                const totalTasks = totalTodayTasks + totalPendingTasks;
                const completedCount = completedTodayCount + completedPendingCount;
                const percentage = Math.round((completedCount / totalTasks) * 100);
                
                return (
                  <div className="mt-2 p-3 border border-[var(--color-border)] bg-[var(--color-sub-bg)]/30 rounded-[var(--radius-sm)] transition-all duration-300">
                    <h4 className="font-bold text-primary mb-2 uppercase tracking-wider" style={{ fontSize: '10px', margin: 0 }}>OVERALL PROGRESS</h4>
                    
                    <div className="flex justify-between items-center mb-1 text-paragraph opacity-80" style={{ fontSize: 'var(--text-caption)' }}>
                      <span className="font-semibold uppercase text-[9px] tracking-wider">COMPLETED TASKS</span>
                      <span className="font-bold text-primary">{completedCount} / {totalTasks}</span>
                    </div>
                    
                    {/* Progress Bar Track */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-1.5 border border-gray-200/50">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="font-bold text-primary text-[10px] uppercase tracking-wider">
                      {percentage}% Completed
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="mt-6 mb-4 pb-1 flex flex-col items-start gap-2.5" id="content-management">
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)', margin: 0 }}>
                Content Management
              </h2>
            </div>
            <div className="flex justify-start gap-6">
              <button
                type="button"
                onClick={() => setActiveMgmtTab('reviews')}
                className={`pb-2 px-1 font-semibold text-sm transition-all relative border-none bg-transparent cursor-pointer ${
                  activeMgmtTab === 'reviews' ? 'text-primary' : 'text-paragraph opacity-60 hover:opacity-100'
                }`}
              >
                Reviews
                {activeMgmtTab === 'reviews' && (
                  <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--color-primary)' }} />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveMgmtTab('stories')}
                className={`pb-2 px-1 font-semibold text-sm transition-all relative border-none bg-transparent cursor-pointer ${
                  activeMgmtTab === 'stories' ? 'text-primary' : 'text-paragraph opacity-60 hover:opacity-100'
                }`}
              >
                Client Success Stories
                {activeMgmtTab === 'stories' && (
                  <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--color-primary)' }} />
                )}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeMgmtTab === 'reviews' ? (
              <motion.div
                key="reviews-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4"
              >
                {/* Left Column: Review Moderation (col-span-12) */}
                <div className="card bg-white p-4 shadow-card lg:col-span-12 flex flex-col justify-between">
                  <div>
                    {/* Title & Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-2 border-b border-[var(--color-border)]/60">
                      <h3 className="text-primary font-[var(--font-bold)]" style={{ fontSize: 'var(--text-small)', margin: 0 }}>
                        Review
                      </h3>
                      
                      {/* Search and Filters */}
                      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder="Search reviews..."
                          value={reviewsSearch}
                          onChange={(e) => {
                            setReviewsSearch(e.target.value);
                            setReviewsPage(1);
                          }}
                          className="w-full sm:w-44 bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1.5 px-3 text-paragraph placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] transition"
                          style={{ fontSize: 'var(--text-caption)' }}
                        />
                        <select
                          value={reviewsStatusFilter}
                          onChange={(e) => {
                            setReviewsStatusFilter(e.target.value);
                            setReviewsPage(1);
                          }}
                          className="bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1.5 px-3 text-paragraph focus:outline-none focus:border-[var(--color-primary)] transition cursor-pointer text-xs"
                          style={{ minHeight: '32px' }}
                        >
                          <option value="All">All Reviews ({reviews.length})</option>
                          <option value="Pending">Pending Reviews ({reviews.filter(r => (r.status || 'Pending') === 'Pending').length})</option>
                          <option value="Approved">Approved Reviews ({reviews.filter(r => (r.status || 'Pending') === 'Approved').length})</option>
                          <option value="Rejected">Rejected Reviews ({reviews.filter(r => (r.status || 'Pending') === 'Rejected').length})</option>
                          <option value="Deleted">Deleted Reviews ({deletedCount})</option>
                        </select>
                      </div>
                    </div>
                    {/* Table of reviews (Desktop) */}
                    <div className="hidden md:block overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
                        <thead>
                          <tr className="border-b border-[var(--color-border)] text-primary uppercase tracking-wider" style={{ fontSize: 'var(--text-caption)' }}>
                            <th className="py-1.5 px-3 text-left w-1/6" style={{ fontWeight: 'normal' }}>Reviewer</th>
                            <th className="py-1.5 px-3 text-center w-1/6" style={{ fontWeight: 'normal' }}>Rating</th>
                            <th className="py-1.5 px-3 text-left w-1/6" style={{ fontWeight: 'normal' }}>Review</th>
                            <th className="py-1.5 px-3 text-center w-1/6" style={{ fontWeight: 'normal' }}>Date</th>
                            <th className="py-1.5 px-3 text-center w-1/6" style={{ fontWeight: 'normal' }}>Status</th>
                            <th className="py-1.5 px-3 text-center w-1/6" style={{ fontWeight: 'normal' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedReviews.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="py-8 text-center text-paragraph opacity-60 px-3" style={{ fontSize: 'var(--text-caption)' }}>
                                No reviews found matching filters.
                              </td>
                            </tr>
                          ) : (
                            paginatedReviews.map((rev) => {
                              const statusVal = rev.status || 'Pending';
                              
                              return (
                                <tr key={rev._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary transition-all" style={{ fontSize: 'var(--text-caption)' }}>
                                  <td className="py-2.5 px-3 w-1/6 text-left">
                                    <div>
                                      <p className="font-bold text-primary" style={{ margin: 0, lineHeight: 1.2 }}>{rev.fullName}</p>
                                      <p className="text-paragraph opacity-60 text-[10px]" style={{ margin: 0 }}>{rev.company}</p>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 w-1/6 text-center text-amber-400 font-semibold" style={{ fontSize: '13px' }}>
                                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                  </td>
                                  <td className="py-2.5 px-3 w-1/6 text-left max-w-[180px]">
                                    <p className="font-semibold text-primary truncate" style={{ margin: 0 }}>{rev.title}</p>
                                    <p className="text-paragraph opacity-85 truncate" style={{ margin: 0, fontSize: '11px' }}>
                                      {rev.review}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => setActiveReviewDetails(rev)}
                                      className="text-primary hover:underline font-bold text-[10px] p-0 border-none bg-transparent cursor-pointer mt-0.5"
                                    >
                                      Read more
                                    </button>
                                  </td>
                                  <td className="py-2.5 px-3 w-1/6 text-center font-medium text-paragraph">
                                    {formatDate(rev.createdAt)}
                                  </td>
                                  <td className="py-2.5 px-3 w-1/6 text-center">
                                    <span className="px-2 py-0.5 rounded-full border text-[10px] font-semibold bg-[var(--color-primary)] text-white border-[var(--color-primary)]">
                                      {statusVal}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 w-1/6 text-center">
                                    <div className="flex justify-center">
                                      {statusVal === 'Approved' ? (
                                        <button
                                          onClick={() => handleDeleteReview(rev._id)}
                                          className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all cursor-pointer shadow-[var(--shadow-button)]"
                                          title="Delete Review"
                                        >
                                          <DeleteIcon fontSize="small" style={{ fontSize: 16 }} />
                                        </button>
                                      ) : (
                                        <select
                                          value=""
                                          onChange={(e) => {
                                            const action = e.target.value;
                                            if (action === 'approve') {
                                              handleApproveReview(rev._id);
                                            } else if (action === 'reject') {
                                              handleRejectReview(rev._id);
                                            } else if (action === 'delete') {
                                              handleDeleteReview(rev._id);
                                            }
                                          }}
                                          className="bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1 px-2 focus:outline-none transition cursor-pointer text-paragraph text-[11px]"
                                        >
                                          <option value="" disabled hidden>Actions</option>
                                          {statusVal !== 'Approved' && <option value="approve">Approve</option>}
                                          {statusVal !== 'Rejected' && <option value="reject">Reject</option>}
                                          <option value="delete">Delete</option>
                                        </select>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Table of reviews (Mobile Card View) */}
                    <div className="block md:hidden space-y-4">
                      {paginatedReviews.length === 0 ? (
                        <p className="py-8 text-center text-paragraph opacity-60 text-xs">
                          No reviews found matching filters.
                        </p>
                      ) : (
                        paginatedReviews.map((rev) => {
                          const statusVal = rev.status || 'Pending';
                          return (
                            <div key={rev._id} className="bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 shadow-sm space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-primary text-sm">{rev.fullName}</h4>
                                  <p className="text-paragraph opacity-60 text-xs">{rev.company}</p>
                                </div>
                                <span className="px-2 py-0.5 rounded-full border text-[10px] font-semibold bg-[var(--color-primary)] text-white border-[var(--color-primary)]">
                                  {statusVal}
                                </span>
                              </div>
                              
                              <div className="flex items-center text-amber-400 font-semibold text-xs">
                                {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                <span className="text-paragraph opacity-50 ml-2 text-[10px]">{formatDate(rev.createdAt)}</span>
                              </div>

                              <div className="space-y-1">
                                <p className="font-semibold text-primary text-xs">{rev.title}</p>
                                <p className="text-paragraph opacity-85 text-xs line-clamp-3">{rev.review}</p>
                                <button
                                  type="button"
                                  onClick={() => setActiveReviewDetails(rev)}
                                  className="text-primary hover:underline font-bold text-[10px] p-0 border-none bg-transparent cursor-pointer mt-0.5"
                                >
                                  Read more
                                </button>
                              </div>

                              <div className="flex gap-2 pt-2 border-t border-[var(--color-border)]/60 justify-end items-center">
                                {statusVal === 'Approved' ? (
                                  <button
                                    onClick={() => handleDeleteReview(rev._id)}
                                    className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all cursor-pointer shadow-[var(--shadow-button)]"
                                    title="Delete Review"
                                  >
                                    <DeleteIcon fontSize="small" style={{ fontSize: 16 }} />
                                  </button>
                                ) : (
                                  <>
                                    <span className="text-[11px] text-paragraph opacity-60 font-semibold">Actions:</span>
                                    <select
                                      value=""
                                      onChange={(e) => {
                                        const action = e.target.value;
                                        if (action === 'approve') {
                                          handleApproveReview(rev._id);
                                        } else if (action === 'reject') {
                                          handleRejectReview(rev._id);
                                        } else if (action === 'delete') {
                                          handleDeleteReview(rev._id);
                                        }
                                      }}
                                      className="bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1 px-2 focus:outline-none transition cursor-pointer text-paragraph text-[11px]"
                                    >
                                      <option value="" disabled hidden>Actions</option>
                                      {statusVal !== 'Approved' && <option value="approve">Approve</option>}
                                      {statusVal !== 'Rejected' && <option value="reject">Reject</option>}
                                      <option value="delete">Delete</option>
                                    </select>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Pagination Footer */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-[var(--color-border)] flex-col sm:flex-row gap-3">
                    <div style={{ fontSize: 'var(--text-caption)' }} className="text-paragraph opacity-70">
                      Showing {reviewsStartIndex + 1} to {Math.min(reviewsStartIndex + reviewsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={currentReviewsPage === 1}
                        onClick={() => setReviewsPage(prev => Math.max(prev - 1, 1))}
                        className="w-7 h-7 flex items-center justify-center rounded border border-[var(--color-border)] bg-transparent text-paragraph hover:bg-[var(--color-sub-bg)] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                      >
                        ‹
                      </button>
                      {Array.from({ length: totalReviewsPages }, (_, idx) => idx + 1).map(page => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setReviewsPage(page)}
                          className={`w-7 h-7 flex items-center justify-center rounded font-semibold text-xs transition cursor-pointer border ${page === currentReviewsPage ? 'bg-primary text-white border-primary' : 'border-[var(--color-border)] bg-transparent text-paragraph hover:bg-[var(--color-sub-bg)]'}`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={currentReviewsPage === totalReviewsPages}
                        onClick={() => setReviewsPage(prev => Math.min(prev + 1, totalReviewsPages))}
                        className="w-7 h-7 flex items-center justify-center rounded border border-[var(--color-border)] bg-transparent text-paragraph hover:bg-[var(--color-sub-bg)] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>

                </motion.div>
            ) : (
              <motion.div
                key="stories-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="card bg-white p-4 shadow-card mb-4"
              >
                {/* Full-width Stories Moderation View */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-2 border-b border-[var(--color-border)]/60">
                  <h3 className="text-primary font-[var(--font-bold)]" style={{ fontSize: 'var(--text-small)', margin: 0 }}>
                    Client Success Stories Moderation
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Search stories */}
                    <div className="w-full sm:w-60">
                      <input
                        type="text"
                        placeholder="Search success stories..."
                        value={storiesSearch}
                        onChange={(e) => {
                          setStoriesSearch(e.target.value);
                          setStoriesPage(1);
                        }}
                        className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1.5 px-3 text-paragraph placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] transition"
                        style={{ fontSize: 'var(--text-caption)' }}
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowStoryModal(true)}
                      className="btn cursor-pointer text-white"
                      style={{ fontSize: 'var(--text-caption)', textTransform: 'none', padding: '6px 14px' }}
                    >
                      + Add Story
                    </button>
                  </div>
                </div>

                {/* Table of stories (Desktop) */}
                <div className="hidden md:block overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-primary uppercase tracking-wider" style={{ fontSize: 'var(--text-caption)' }}>
                        <th className="py-1.5 px-3 text-left w-1/5" style={{ fontWeight: 'normal' }}>Client Name</th>
                        <th className="py-1.5 px-3 text-left w-1/5" style={{ fontWeight: 'normal' }}>Position / Company</th>
                        <th className="py-1.5 px-3 text-left w-1/5" style={{ fontWeight: 'normal' }}>Client Story Text</th>
                        <th className="py-1.5 px-3 text-center w-1/5" style={{ fontWeight: 'normal' }}>Created Date</th>
                        <th className="py-1.5 px-3 text-center w-1/5" style={{ fontWeight: 'normal' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStories.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-paragraph opacity-60 px-3" style={{ fontSize: 'var(--text-caption)' }}>
                            No client success stories found.
                          </td>
                        </tr>
                      ) : (
                        filteredStories.slice((currentStoriesPage - 1) * storiesPerPage, currentStoriesPage * storiesPerPage).map((story) => (
                          <tr key={story._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-paragraph transition-all" style={{ fontSize: 'var(--text-caption)' }}>
                            <td className="py-2.5 px-3 font-bold">
                              <div className="flex items-center gap-2">
                                {story.imageUrl ? (
                                  <img
                                    src={story.imageUrl}
                                    alt={story.name}
                                    className="w-8 h-8 object-cover border border-[var(--color-border)]"
                                    style={{ borderRadius: 'var(--radius-sm)' }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                    {story.name.charAt(0)}
                                  </div>
                                )}
                                <span>{story.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-medium">{story.position ? story.position.replace(',', ' - ') : ''}</td>
                            <td className="py-2.5 px-3 max-w-[280px]">
                              <p className="line-clamp-2" style={{ margin: 0, color: '#000000' }}>
                                {story.clientStories}
                              </p>
                              <button
                                type="button"
                                onClick={() => setActiveStoryDetails(story)}
                                className="text-primary hover:underline font-bold text-[10px] p-0 border-none bg-transparent cursor-pointer mt-0.5 animate-none"
                              >
                                View full story
                              </button>
                            </td>
                            <td className="py-2.5 px-3 text-center opacity-70">{formatDate(story.createdAt)}</td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex justify-center">
                                <select
                                  value=""
                                  onChange={(e) => {
                                    const action = e.target.value;
                                    if (action === 'edit') {
                                      setEditingStory(story);
                                      setFormData({
                                        name: story.name,
                                        position: story.position,
                                        clientStories: story.clientStories,
                                        image: null
                                      });
                                      setShowStoryModal(true);
                                    } else if (action === 'delete') {
                                      handleDeleteStory(story._id);
                                    }
                                  }}
                                  className="bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1 px-2 focus:outline-none transition cursor-pointer text-paragraph text-[11px]"
                                >
                                  <option value="" disabled hidden>Actions</option>
                                  <option value="edit">Edit</option>
                                  <option value="delete">Delete</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table of stories (Mobile Card View) */}
                <div className="block md:hidden space-y-4">
                  {filteredStories.length === 0 ? (
                    <p className="py-8 text-center text-paragraph opacity-60 text-xs">
                      No client success stories found.
                    </p>
                  ) : (
                    filteredStories.slice((currentStoriesPage - 1) * storiesPerPage, currentStoriesPage * storiesPerPage).map((story) => (
                      <div key={story._id} className="bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                          {story.imageUrl ? (
                            <img
                              src={story.imageUrl}
                              alt={story.name}
                              className="w-10 h-10 object-cover border border-[var(--color-border)]"
                              style={{ borderRadius: 'var(--radius-sm)' }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                              {story.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-primary text-sm">{story.name}</h4>
                            <p className="text-paragraph opacity-60 text-xs">{story.position ? story.position.replace(',', ' - ') : ''}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs line-clamp-3" style={{ margin: 0, color: '#000000' }}>{story.clientStories}</p>
                          <div className="flex justify-between items-center mt-1">
                            <button
                              type="button"
                              onClick={() => setActiveStoryDetails(story)}
                              className="text-primary hover:underline font-bold text-[10px] p-0 border-none bg-transparent cursor-pointer"
                            >
                              View full story
                            </button>
                            <span className="text-paragraph opacity-50 text-[10px]">{formatDate(story.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-[var(--color-border)]/60 justify-end items-center">
                          <span className="text-[11px] text-paragraph opacity-60 font-semibold">Actions:</span>
                          <select
                            value=""
                            onChange={(e) => {
                              const action = e.target.value;
                              if (action === 'edit') {
                                setEditingStory(story);
                                setFormData({
                                  name: story.name,
                                  position: story.position,
                                  clientStories: story.clientStories,
                                  image: null
                                });
                                setShowStoryModal(true);
                              } else if (action === 'delete') {
                                handleDeleteStory(story._id);
                              }
                            }}
                            className="bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1 px-2 focus:outline-none transition cursor-pointer text-paragraph text-[11px]"
                          >
                            <option value="" disabled hidden>Actions</option>
                            <option value="edit">Edit</option>
                            <option value="delete">Delete</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Full Stories Pagination Footer */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[var(--color-border)] flex-col sm:flex-row gap-3">
                  <div style={{ fontSize: 'var(--text-caption)' }} className="text-paragraph opacity-70">
                    Showing {storiesStartIndex + 1} to {Math.min(storiesStartIndex + storiesPerPage, filteredStories.length)} of {filteredStories.length} stories
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentStoriesPage === 1}
                      onClick={() => setStoriesPage(prev => Math.max(prev - 1, 1))}
                      className="w-7 h-7 flex items-center justify-center rounded border border-[var(--color-border)] bg-transparent text-paragraph hover:bg-[var(--color-primary)] hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-paragraph cursor-pointer"
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalStoriesPages }, (_, idx) => idx + 1).map(page => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setStoriesPage(page)}
                        className={`w-7 h-7 flex items-center justify-center rounded font-semibold text-xs transition cursor-pointer border ${page === currentStoriesPage ? 'text-white' : 'border-[var(--color-border)] bg-transparent text-paragraph hover:bg-[var(--color-primary)] hover:text-white'}`}
                        style={page === currentStoriesPage ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentStoriesPage === totalStoriesPages}
                      onClick={() => setStoriesPage(prev => Math.min(prev + 1, totalStoriesPages))}
                      className="w-7 h-7 flex items-center justify-center rounded border border-[var(--color-border)] bg-transparent text-paragraph hover:bg-[var(--color-primary)] hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-paragraph cursor-pointer"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Business Analytics Accordion Section */}
          <div className="card bg-white p-4 shadow-card mb-4 mt-6">
            <div 
              className="flex justify-between items-center cursor-pointer select-none pb-2"
              onClick={() => setIsAnalyticsExpanded(!isAnalyticsExpanded)}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)', margin: 0 }}>
                Business Analytics
              </h2>
              <span className="text-paragraph opacity-60 font-bold transition-transform duration-300" style={{ transform: isAnalyticsExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                ▼
              </span>
            </div>
            
            <AnimatePresence>
              {isAnalyticsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4 space-y-6"
                >
                  {/* Analytics Overview (Pie Chart) */}
                  <div className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-[var(--color-sub-bg)]/25">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-primary font-[var(--font-bold)] text-xs" style={{ margin: 0 }}>Analytics Overview</h3>
                      </div>
                    </div>
                    <div className="h-44 w-full min-w-0 overflow-hidden flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-main-bg)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-paragraph)', fontSize: 12 }} />
                          <Pie
                            data={overviewPieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={3}
                          >
                            {overviewPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend Row */}
                    <div className="flex flex-wrap justify-center items-center gap-4 mt-2 font-semibold text-paragraph opacity-85" style={{ fontSize: 'var(--text-caption)' }}>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#2563EB' }}></span> Inquiries ({periodInquiries.length})</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#10B981' }}></span> Case Studies ({periodCaseStudies.length})</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#8B5CF6' }}></span> Articles ({periodArticles.length})</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#F59E0B' }}></span> Applications ({periodApplications.length})</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#EC4899' }}></span> Reviews ({periodReviews.length})</div>
                    </div>
                  </div>

                  {/* Business Analytics & Export Report */}
                  <div className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-[var(--color-sub-bg)]/10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-2 border-b border-[var(--color-border)]/60 gap-3">
                      <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <h3 className="text-primary font-bold text-xs" style={{ margin: 0 }}>
                          Business Analytics & Export Report
                        </h3>
                        <button
                          type="button"
                          onClick={handleViewDetailedReport}
                          className="text-primary hover:underline font-semibold text-left text-xs bg-transparent border-none cursor-pointer p-0"
                        >
                          View Detailed Report
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                        <button
                          type="button"
                          onClick={() => {
                            setExportFromDate('');
                            setExportToDate('');
                            setShowPdfExportModal(true);
                          }}
                          className="flex items-center gap-1 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1.5 px-3 hover:bg-[var(--color-sub-bg)] transition font-semibold text-[11px] cursor-pointer h-7 shadow-sm text-paragraph"
                        >
                          Export PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExportReport('excel')}
                          className="flex items-center gap-1 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1.5 px-3 hover:bg-[var(--color-sub-bg)] transition font-semibold text-[11px] cursor-pointer h-7 shadow-sm text-paragraph"
                        >
                          Export Excel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExportReport('csv')}
                          className="flex items-center gap-1 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1.5 px-3 hover:bg-[var(--color-sub-bg)] transition font-semibold text-[11px] cursor-pointer h-7 shadow-sm text-paragraph"
                        >
                          Export CSV
                        </button>
                      </div>
                    </div>

                    {/* Report Period */}
                    <div className="mb-4">
                      <label className="block mb-1.5 text-paragraph opacity-80 font-semibold text-[10px] uppercase tracking-wider">
                        Report Period
                      </label>
                      <div className="relative inline-block w-full sm:w-72">
                        <select
                          value={reportPeriod}
                          onChange={(e) => setReportPeriod(e.target.value)}
                          className="w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1.5 px-3 pr-10 text-paragraph font-semibold focus:outline-none focus:border-[var(--color-primary)] transition cursor-pointer text-xs"
                        >
                          <option value="this-week">This Week ({getThisWeekRangeText()})</option>
                          <option value="last-week">Last Week ({getLastWeekRangeText()})</option>
                          <option value="this-month">This Month</option>
                          <option value="all-time">All Time</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-paragraph opacity-60 text-xs">
                          📅
                        </span>
                      </div>
                    </div>

                    {/* Metrics grid row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 mb-4">
                      {renderAnalyticsMetricCard('Total Inquiries', periodInquiries.length, '27%', true)}
                      {renderAnalyticsMetricCard('Reviews Received', periodReviews.length, '14%', true)}
                      {renderAnalyticsMetricCard('Reviews Approved', periodReviews.filter(r => r.status === 'Approved').length, '25%', true)}
                      {renderAnalyticsMetricCard('Reviews Rejected', periodReviews.filter(r => r.status === 'Rejected').length, '33%', false)}
                      {renderAnalyticsMetricCard('Success Stories Published', periodStories.length, '50%', true)}
                      {renderAnalyticsMetricCard('Case Studies Published', periodCaseStudies.length, '100%', true)}
                      {renderAnalyticsMetricCard('Case Studies Approved', periodCaseStudies.filter(c => c.status === 'Published').length, '33%', true)}
                      {renderAnalyticsMetricCard('Applications', periodApplications.length, '33%', false)}
                      {renderAnalyticsMetricCard('Applications Referred', periodApplications.filter(a => a.referred || a.status === 'referred').length, '0%', null)}
                    </div>

                    {/* Section-wise detailed status breakdowns */}
                    <div className="mt-6 border-t border-[var(--color-border)]/60 pt-4 select-none">
                      <h4 className="text-primary font-bold text-xs uppercase mb-4 text-left">Detailed Status Breakdowns</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                        
                        {/* 1. Inquiries Status */}
                        <div className="bg-white border border-[var(--color-border)] p-4 rounded-[var(--radius-sm)] shadow-sm flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2.5">Inquiries Pipeline</span>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between items-center border-b pb-1">
                                <span className="text-paragraph opacity-75 font-semibold">New Submissions</span>
                                <span className="font-bold text-green-600">{periodInquiries.filter(i => i.status === 'New').length}</span>
                              </div>
                              <div className="flex justify-between items-center border-b pb-1">
                                <span className="text-paragraph opacity-75 font-semibold">Responded</span>
                                <span className="font-bold text-blue-600">{periodInquiries.filter(i => i.status === 'In Progress' || i.status === 'Responded').length}</span>
                              </div>
                              <div className="flex justify-between items-center border-b pb-1">
                                <span className="text-paragraph opacity-75 font-semibold">Proposals Converted</span>
                                <span className="font-bold text-amber-500">{periodInquiries.filter(i => i.status === 'Proposals').length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-paragraph opacity-75 font-semibold">Closed/Resolved</span>
                                <span className="font-bold text-gray-500">{periodInquiries.filter(i => i.status === 'Closed').length}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-3 pt-2 border-t font-semibold">Total: {periodInquiries.length} Inquiries</div>
                        </div>

                        {/* 2. Reviews Status */}
                        <div className="bg-white border border-[var(--color-border)] p-4 rounded-[var(--radius-sm)] shadow-sm flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2.5">Reviews Moderation</span>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between items-center border-b pb-1">
                                <span className="text-paragraph opacity-75 font-semibold">Pending Approval</span>
                                <span className="font-bold text-blue-600">{periodReviews.filter(r => (r.status || 'Pending') === 'Pending').length}</span>
                              </div>
                              <div className="flex justify-between items-center border-b pb-1">
                                <span className="text-paragraph opacity-75 font-semibold">Approved Reviews</span>
                                <span className="font-bold text-green-600">{periodReviews.filter(r => r.status === 'Approved').length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-paragraph opacity-75 font-semibold">Rejected Reviews</span>
                                <span className="font-bold text-red-500">{periodReviews.filter(r => r.status === 'Rejected').length}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-3 pt-2 border-t font-semibold">Total: {periodReviews.length} Reviews</div>
                        </div>

                        {/* 3. Case Studies Status */}
                        <div className="bg-white border border-[var(--color-border)] p-4 rounded-[var(--radius-sm)] shadow-sm flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2.5">Case Studies Pipeline</span>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between items-center border-b pb-1">
                                <span className="text-paragraph opacity-75 font-semibold">Draft/Pending Approval</span>
                                <span className="font-bold text-amber-500">{periodCaseStudies.filter(c => c.status === 'Draft').length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-paragraph opacity-75 font-semibold">Approved & Published</span>
                                <span className="font-bold text-green-600">{periodCaseStudies.filter(c => c.status === 'Published').length}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-3 pt-2 border-t font-semibold">Total: {periodCaseStudies.length} Case Studies</div>
                        </div>

                        {/* 4. Applications Status */}
                        <div className="bg-white border border-[var(--color-border)] p-4 rounded-[var(--radius-sm)] shadow-sm flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2.5">Applications Funnel</span>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between items-center border-b pb-1">
                                <span className="text-paragraph opacity-75 font-semibold">Pending Review</span>
                                <span className="font-bold text-amber-500">{periodApplications.filter(a => a.status === 'pending').length}</span>
                              </div>
                              <div className="flex justify-between items-center border-b pb-1">
                                <span className="text-paragraph opacity-75 font-semibold">Referred</span>
                                <span className="font-bold text-blue-600">{periodApplications.filter(a => a.referred || a.status === 'referred').length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-paragraph opacity-75 font-semibold">Rejected</span>
                                <span className="font-bold text-red-500">{periodApplications.filter(a => a.status === 'rejected').length}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-3 pt-2 border-t font-semibold">Total: {periodApplications.length} Applications</div>
                        </div>

                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Appointments Pending Approval Section */}
          {appointments.filter(a => a.status === 'Pending Approval').length > 0 && (
            <div className="card bg-white p-4 shadow-card mt-6">
              <div className="border-b border-[var(--color-border)] pb-2 mb-3">
                <h3 className="text-primary font-[var(--font-bold)] text-xs" style={{ margin: 0 }}>
                  APPOINTMENTS PENDING APPROVAL
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-primary uppercase tracking-wider" style={{ fontSize: 'var(--text-caption)' }}>
                      <th className="py-2 px-3 text-left w-[25%]" style={{ fontWeight: 'normal' }}>Candidate</th>
                      <th className="py-2 px-3 text-left w-[20%]" style={{ fontWeight: 'normal' }}>Job Position</th>
                      <th className="py-2 px-3 text-left w-[20%]" style={{ fontWeight: 'normal' }}>Interviewer</th>
                      <th className="py-2 px-3 text-center w-[20%]" style={{ fontWeight: 'normal' }}>Date & Time</th>
                      <th className="py-2 px-3 text-center w-[15%]" style={{ fontWeight: 'normal' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.filter(a => a.status === 'Pending Approval').map((app) => (
                      <tr key={app.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary transition-all" style={{ fontSize: 'var(--text-caption)' }}>
                        <td className="py-3 px-3 text-left">
                          <div>
                            <p className="font-bold text-primary" style={{ margin: 0 }}>{app.name}</p>
                            <p className="text-paragraph opacity-60 text-[10px]" style={{ margin: 0 }}>{app.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-left font-semibold">{app.position}</td>
                        <td className="py-3 px-3 text-left">{app.interviewer}</td>
                        <td className="py-3 px-3 text-center">{app.date}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApproveAppointment(app.id)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-green-50 border border-green-200 hover:bg-green-100 text-green-700 rounded-[var(--radius-sm)] transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectAppointment(app.id)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-[var(--radius-sm)] transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          </motion.div>
        </div>
      </div>
    </div>

      {/* Success story modal creation portal */}
      {showStoryModal &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-none">
            <div className="w-full max-w-lg border border-[var(--color-border)] bg-[var(--color-main-bg)] shadow-xl overflow-hidden" style={{ borderRadius: 'var(--radius-sm)' }}>
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
                <div>
                  <h2 className="text-primary font-[var(--font-semibold)]" style={{ fontSize: 'var(--text-small)', margin: 0 }}>
                    Add Success Story
                  </h2>
                  <p className="text-paragraph opacity-60 mt-1" style={{ fontSize: 'var(--text-caption)' }}>
                    Create a new client success story to display on the platform.
                  </p>
                </div>
                <button
                  onClick={() => setShowStoryModal(false)}
                  className="w-8 h-8 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-paragraph opacity-60 hover:opacity-100 cursor-pointer"
                  style={{ fontSize: 'var(--text-caption)' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block mb-1.5 text-paragraph opacity-80 font-medium" style={{ fontSize: 'var(--text-caption)' }}>Client Story</label>
                    <textarea
                      name="clientStories"
                      value={formData.clientStories}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (storyErrors.clientStories) {
                          setStoryErrors(prev => ({ ...prev, clientStories: "" }));
                        }
                      }}
                      rows="3"
                      className={`w-full bg-[var(--color-sub-bg)] border rounded-[var(--radius-sm)] p-3 text-paragraph placeholder-gray-400 focus:outline-none transition resize-none ${storyErrors.clientStories ? 'border-red-500 focus:border-red-500' : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'}`}
                      style={{ fontSize: 'var(--text-caption)' }}
                      placeholder="Write the client's success story here..."
                    ></textarea>
                    {storyErrors.clientStories && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold">{storyErrors.clientStories}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-paragraph opacity-80 font-medium" style={{ fontSize: 'var(--text-caption)' }}>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => {
                          handleInputChange(e);
                          if (storyErrors.name) {
                            setStoryErrors(prev => ({ ...prev, name: "" }));
                          }
                        }}
                        className={`w-full bg-[var(--color-sub-bg)] border rounded-[var(--radius-sm)] py-2.5 px-3 text-paragraph placeholder-gray-400 focus:outline-none transition ${storyErrors.name ? 'border-red-500 focus:border-red-500' : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'}`}
                        style={{ fontSize: 'var(--text-caption)' }}
                        placeholder="Sarah Johnson"
                      />
                      {storyErrors.name && (
                        <p className="text-red-500 text-[10px] mt-1 font-semibold">{storyErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1.5 text-paragraph opacity-80 font-medium" style={{ fontSize: 'var(--text-caption)' }}>Position & Company</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={(e) => {
                          handleInputChange(e);
                          if (storyErrors.position) {
                            setStoryErrors(prev => ({ ...prev, position: "" }));
                          }
                        }}
                        className={`w-full bg-[var(--color-sub-bg)] border rounded-[var(--radius-sm)] py-2.5 px-3 text-paragraph placeholder-gray-400 focus:outline-none transition ${storyErrors.position ? 'border-red-500 focus:border-red-500' : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'}`}
                        style={{ fontSize: 'var(--text-caption)' }}
                        placeholder="CEO, GlobalTech"
                      />
                      {storyErrors.position && (
                        <p className="text-red-500 text-[10px] mt-1 font-semibold">{storyErrors.position}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-paragraph opacity-80 font-medium" style={{ fontSize: 'var(--text-caption)' }}>Client Image</label>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageChange(e);
                        if (storyErrors.image) {
                          setStoryErrors(prev => ({ ...prev, image: "" }));
                        }
                      }}
                      className={`w-full bg-[var(--color-sub-bg)] border rounded-[var(--radius-sm)] py-2 px-3 text-paragraph opacity-80 file:mr-4 file:py-1 file:px-2.5 file:rounded-[var(--radius-sm)] file:border-0 file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-[var(--color-primary-hover)] transition cursor-pointer text-xs ${storyErrors.image ? 'border-red-500 focus:border-red-500' : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'}`}
                      style={{ fontSize: 'var(--text-caption)' }}
                    />
                    {storyErrors.image && (
                      <p className="text-red-500 text-[10px] mt-1 font-semibold">{storyErrors.image}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
                  <button
                    type="button"
                    onClick={handleCloseStoryModal}
                    className="px-4 py-1.5 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-paragraph bg-white hover:bg-[var(--color-sub-bg)] transition font-semibold cursor-pointer h-8 text-xs shadow-sm flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn px-4 cursor-pointer border-none rounded-[var(--radius-sm)] text-xs font-semibold h-8 text-white flex items-center justify-center"
                    style={{ minWidth: 'auto', boxShadow: 'none' }}
                  >
                    {isSubmitting ? 'Uploading...' : (editingStory ? 'Update Story' : 'Submit Story')}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm.isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-none">
            <div className="bg-white p-6 rounded-[var(--radius-sm)] shadow-xl max-w-sm w-full mx-4 border border-[var(--color-border)] text-left font-primary font-normal z-[999999]">
              <h3 className="text-[var(--color-primary)] font-bold text-lg mb-2">
                {deleteConfirm.title}
              </h3>
              <p className="text-[var(--color-paragraph)] text-sm mb-5 font-semibold">
                {deleteConfirm.message}
              </p>
              <div className="flex justify-end gap-3 font-normal">
                <button
                  onClick={handleCancelDelete}
                  className="border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center border-solid h-8.5 px-4"
                  style={{ fontWeight: 'normal' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center border-none h-8.5 px-4"
                  style={{ fontWeight: 'normal' }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Actionable Details Modal */}
      {activeActionable && (
        <Dialog
          open={Boolean(activeActionable)}
          onClose={() => setActiveActionable(null)}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                borderRadius: "var(--radius-sm)",
                padding: "8px",
                boxShadow: "var(--shadow-card)",
                border: "1px solid var(--color-border)"
              }
            }
          }}
        >
          <DialogTitle style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <div className="flex justify-between items-center text-primary">
              <h2 className="font-bold text-primary" style={{ fontSize: 'var(--text-caption)', margin: 0 }}>
                Actionable: {activeActionable.moduleName} ({activeActionable.count} Items)
              </h2>
              <button
                onClick={() => setActiveActionable(null)}
                className="w-6 h-6 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-paragraph opacity-60 hover:opacity-100 cursor-pointer"
                style={{ fontSize: 'var(--text-caption)' }}
              >
                ✕
              </button>
            </div>
          </DialogTitle>

          <DialogContent style={{ paddingTop: '16px' }} className="max-h-[300px] overflow-y-auto">
            <div className="space-y-2.5">
              {activeActionable.count === 0 ? (
                <p className="text-paragraph opacity-60 text-center py-4" style={{ fontSize: 'var(--text-caption)' }}>No pending items to review.</p>
              ) : (() => {
                const name = activeActionable.moduleName;
                if (name === 'Inquiries') {
                  return inquiries.filter(inq => inq.status === 'New').map((inq) => (
                    <div key={inq._id} className="p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-sub-bg)]/20" style={{ fontSize: 'var(--text-caption)' }}>
                      <p className="font-bold text-primary">{inq.fullName ? inq.fullName.toUpperCase() : ''} (<span style={{ textTransform: 'lowercase' }}>{inq.email || ''}</span>)</p>
                      <p className="opacity-80 mt-1"><span className="font-semibold">SERVICE:</span> {inq.service || ''}</p>
                      <p className="opacity-70 mt-0.5 line-clamp-2">{inq.message || ''}</p>
                    </div>
                  ));
                }
                if (name === 'Career') {
                  return applications.filter(app => app.status === 'pending').map((app) => (
                    <div key={app._id} className="p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-sub-bg)]/20" style={{ fontSize: 'var(--text-caption)' }}>
                      <p className="font-bold text-primary">{app.fullName} ({app.email})</p>
                      <p className="opacity-80 mt-1"><span className="font-semibold">Position:</span> {app.appliedPosition}</p>
                      {app.roleDescription && <p className="opacity-70 mt-0.5 line-clamp-1">{app.roleDescription}</p>}
                    </div>
                  ));
                }
                if (name === 'Articles') {
                  return articles.slice(0, activeActionable.count).map((art) => (
                    <div key={art._id} className="p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-sub-bg)]/20" style={{ fontSize: 'var(--text-caption)' }}>
                      <p className="font-bold text-primary">{art.title}</p>
                      <p className="opacity-70 mt-0.5 line-clamp-2">{art.description}</p>
                    </div>
                  ));
                }
                if (name === 'Case Studies') {
                  return caseStudies.filter(cs => cs.status === 'Draft').map((cs) => (
                    <div key={cs._id} className="p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-sub-bg)]/20" style={{ fontSize: 'var(--text-caption)' }}>
                      <p className="font-bold text-primary">{cs.title}</p>
                      <p className="opacity-80 mt-1"><span className="font-semibold">Author:</span> {cs.author} - {cs.authorRole}</p>
                    </div>
                  ));
                }
                if (name === 'Reviews') {
                  return reviews.slice(0, activeActionable.count).map((rev) => (
                    <div key={rev._id} className="p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-sub-bg)]/20" style={{ fontSize: 'var(--text-caption)' }}>
                      <p className="font-bold text-primary">{rev.fullName} ({rev.company})</p>
                      <p className="opacity-80 mt-1 font-semibold">"{rev.title}"</p>
                      <p className="opacity-70 mt-0.5 line-clamp-2">{rev.review}</p>
                    </div>
                  ));
                }
                if (name === 'Success Stories') {
                  return stories.slice(0, activeActionable.count).map((story) => (
                    <div key={story._id} className="p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-sub-bg)]/20" style={{ fontSize: 'var(--text-caption)' }}>
                      <p className="font-bold text-primary">{story.name}</p>
                      <p className="opacity-80 mt-1"><span className="font-semibold">Position:</span> {story.position ? story.position.replace(',', ' - ') : ''}</p>
                    </div>
                  ));
                }
                return null;
              })()}
            </div>
          </DialogContent>

          <DialogActions style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }} className="flex justify-end gap-2.5">
            {activeActionable.divertPath && activeActionable.divertPath !== '#' && (
              <Button
                onClick={() => {
                  const path = activeActionable.divertPath;
                  setActiveActionable(null);
                  if (path.startsWith('#')) {
                    const id = path.substring(1);
                    if (activeActionable.moduleName === 'Reviews') {
                      setActiveMgmtTab('reviews');
                    } else if (activeActionable.moduleName === 'Success Stories') {
                      setActiveMgmtTab('stories');
                    }
                    setTimeout(() => {
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    navigate(path);
                  }
                }}
                variant="contained"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-sm)',
                  textTransform: 'none',
                  fontWeight: 'var(--font-semibold)',
                  fontSize: 'var(--text-caption)',
                  height: '32px'
                }}
              >
                Go to Module Page
              </Button>
            )}
            <Button
              onClick={() => setActiveActionable(null)}
              variant="outlined"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-paragraph)',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'none',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-caption)',
                height: '32px'
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Appointment Approvals Modal */}
      {showAppointmentApprovalModal && (
        <Dialog
          open={showAppointmentApprovalModal}
          onClose={() => setShowAppointmentApprovalModal(false)}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-container": {
              backgroundColor: "rgba(10,15,30,0.7)",
              backdropFilter: "blur(8px)",
              "& .MuiPaper-root": {
                borderRadius: "var(--radius-sm)",
                padding: "8px",
                boxShadow: "var(--shadow-card)",
                border: "1px solid var(--color-border)",
                background: "var(--color-main-bg)"
              }
            }
          }}
        >
          <DialogTitle style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <div className="flex justify-between items-center text-primary">
              <div>
                <h2 className="font-bold text-primary" style={{ fontSize: 'var(--text-caption)', margin: 0 }}>
                  APPOINTMENTS PENDING APPROVAL
                </h2>
                <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 mt-0.5 font-normal" style={{ margin: 0 }}>
                  Review and approve appointments sent by HR
                </p>
              </div>
              <button
                onClick={() => setShowAppointmentApprovalModal(false)}
                className="w-6 h-6 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-paragraph opacity-60 hover:opacity-100 cursor-pointer"
                style={{ fontSize: 'var(--text-caption)' }}
              >
                ✕
              </button>
            </div>
          </DialogTitle>

          <DialogContent style={{ paddingTop: '16px' }} className="max-h-[450px] overflow-y-auto pr-1">
            <div className="space-y-4">
              {appointments.filter(a => a.status === 'Pending Approval').length === 0 ? (
                <p className="text-center py-8 text-xs text-[var(--color-paragraph)] opacity-60">
                  No appointments pending approval.
                </p>
              ) : (
                appointments.filter(a => a.status === 'Pending Approval').map((app) => {
                  const candidateApp = applications.find(a => a.email === app.email);
                  const resumeUrl = candidateApp ? candidateApp.resumeUrl : null;

                  return (
                    <div key={app.id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-[var(--color-sub-bg)]/20 hover:bg-[var(--color-sub-bg)]/40 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="text-left">
                        <p className="font-bold text-primary" style={{ margin: 0 }}>{app.name}</p>
                        <p className="text-paragraph opacity-60 text-[10px]" style={{ margin: 0 }}>{app.email}</p>
                        <div className="mt-2 text-xs text-[var(--color-paragraph)] opacity-90 space-y-0.5">
                          <p><span className="font-semibold text-primary">Position:</span> {app.position}</p>
                          <p><span className="font-semibold text-primary">Interviewer:</span> {app.interviewer}</p>
                          <p><span className="font-semibold text-primary">Date & Time:</span> {app.date}</p>
                          <p><span className="font-semibold text-primary">Mode:</span> {app.mode}</p>
                        </div>
                        <div className="mt-3">
                          {resumeUrl ? (
                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-[var(--radius-sm)] transition-all font-bold text-[10px] no-underline cursor-pointer"
                            >
                              View Resume
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400">No Resume Uploaded</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleApproveAppointment(app.id)}
                          className="px-3.5 py-1.5 text-xs font-bold bg-green-50 border border-green-200 hover:bg-green-100 text-green-700 rounded-[var(--radius-sm)] transition cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectAppointment(app.id)}
                          className="px-3.5 py-1.5 text-xs font-bold bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-[var(--radius-sm)] transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </DialogContent>

          <DialogActions style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }} className="flex justify-end gap-2.5">
            <Button
              onClick={() => setShowAppointmentApprovalModal(false)}
              variant="outlined"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-paragraph)',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'none',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-caption)',
                height: '32px'
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Review Details Dialog */}
      {activeReviewDetails && (
        <Dialog
          open={Boolean(activeReviewDetails)}
          onClose={() => setActiveReviewDetails(null)}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                borderRadius: "var(--radius-sm)",
                padding: "8px",
                boxShadow: "var(--shadow-card)",
                border: "1px solid var(--color-border)"
              }
            }
          }}
        >
          <DialogTitle style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <div className="flex justify-between items-center">
              <h2 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: 0 }}>
                Review Details
              </h2>
              <button
                type="button"
                onClick={() => setActiveReviewDetails(null)}
                className="w-6 h-6 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-paragraph opacity-60 hover:opacity-100 cursor-pointer"
                style={{ fontSize: 'var(--text-caption)' }}
              >
                ✕
              </button>
            </div>
          </DialogTitle>
          <DialogContent style={{ paddingTop: '16px' }}>
            <div className="space-y-3">
              <div>
                <p className="font-bold text-primary text-[var(--text-caption)]" style={{ margin: 0 }}>{activeReviewDetails.fullName}</p>
                <p className="text-paragraph opacity-60 text-[10px]" style={{ margin: 0 }}>{activeReviewDetails.company}</p>
              </div>
              <div>
                <span className="font-semibold text-primary" style={{ fontSize: 'var(--text-caption)' }}>Rating: </span>
                <span className="text-amber-400">{'★'.repeat(activeReviewDetails.rating)}{'☆'.repeat(5 - activeReviewDetails.rating)}</span>
              </div>
              <div>
                <h4 className="font-bold text-primary text-xs" style={{ margin: 0 }}>{activeReviewDetails.title}</h4>
                <p className="text-paragraph opacity-85 mt-1.5 whitespace-pre-wrap bg-[var(--color-sub-bg)]/25 p-3 rounded border border-[var(--color-border)]" style={{ fontSize: 'var(--text-caption)', lineHeight: 1.5, margin: 0 }}>
                  {activeReviewDetails.review}
                </p>
              </div>
            </div>
          </DialogContent>
          <DialogActions style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
            <Button
              onClick={() => setActiveReviewDetails(null)}
              variant="outlined"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-paragraph)',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'none',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-caption)',
                height: '32px'
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Client Success Story Details Dialog */}
      {activeStoryDetails && (
        <Dialog
          open={Boolean(activeStoryDetails)}
          onClose={() => setActiveStoryDetails(null)}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                borderRadius: "var(--radius-sm)",
                padding: "8px",
                boxShadow: "var(--shadow-card)",
                border: "1px solid var(--color-border)"
              }
            }
          }}
        >
          <DialogTitle style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <div className="flex justify-between items-center">
              <h2 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: 0 }}>
                Client Success Story Details
              </h2>
              <button
                type="button"
                onClick={() => setActiveStoryDetails(null)}
                className="w-6 h-6 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-paragraph opacity-60 hover:opacity-100 cursor-pointer"
                style={{ fontSize: 'var(--text-caption)' }}
              >
                ✕
              </button>
            </div>
          </DialogTitle>
          <DialogContent style={{ paddingTop: '16px' }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {activeStoryDetails.imageUrl ? (
                  <img
                    src={activeStoryDetails.imageUrl}
                    alt={activeStoryDetails.name}
                    className="w-12 h-12 object-cover border border-[var(--color-border)]"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded" style={{ fontSize: 'var(--text-paragraph)' }}>
                    {activeStoryDetails.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-primary" style={{ fontSize: 'var(--text-caption)', margin: 0 }}>{activeStoryDetails.name}</h3>
                  <p className="text-paragraph opacity-60" style={{ fontSize: 'var(--text-caption)', margin: 0 }}>{activeStoryDetails.position ? activeStoryDetails.position.replace(',', ' - ') : ''}</p>
                </div>
              </div>
              <div>
                <p className="text-paragraph opacity-85 whitespace-pre-wrap bg-[var(--color-sub-bg)]/25 p-3 rounded border border-[var(--color-border)]" style={{ fontSize: 'var(--text-caption)', lineHeight: 1.5, margin: 0 }}>
                  {activeStoryDetails.clientStories}
                </p>
              </div>
            </div>
          </DialogContent>
          <DialogActions style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
            <Button
              onClick={() => setActiveStoryDetails(null)}
              variant="outlined"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-paragraph)',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'none',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-caption)',
                height: '32px'
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Detailed Analytics Modal */}
      {showDetailedReportModal && (
        <Dialog
          open={Boolean(showDetailedReportModal)}
          onClose={() => setShowDetailedReportModal(false)}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                borderRadius: "var(--radius-sm)",
                padding: "8px",
                boxShadow: "var(--shadow-card)",
                border: "1px solid var(--color-border)"
              }
            }
          }}
        >
          <DialogTitle style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <div className="flex justify-between items-center">
              <h2 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: 0 }}>
                Detailed Analytics Breakdown Report
              </h2>
              <button
                type="button"
                onClick={() => setShowDetailedReportModal(false)}
                className="w-6 h-6 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-paragraph opacity-60 hover:opacity-100 cursor-pointer"
                style={{ fontSize: 'var(--text-caption)' }}
              >
                ✕
              </button>
            </div>
          </DialogTitle>
          <DialogContent style={{ paddingTop: '16px' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left Side: Pie Chart */}
              <div className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-[var(--color-sub-bg)]/20 flex flex-col items-center select-none">
                <h4 className="text-primary font-[var(--font-bold)] text-[10px] mb-2 text-center w-full uppercase tracking-wider">Metrics Visual Breakdown</h4>
                <div className="h-40 w-full min-w-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-main-bg)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-paragraph)', fontSize: 11 }} />
                      <Pie
                        data={overviewPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={3}
                      >
                        {overviewPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Visual Legend */}
                <div className="flex flex-wrap justify-center gap-2 mt-2 text-[9px] font-bold text-paragraph">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#2563EB]"></span> INQ</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#10B981]"></span> CS</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#8B5CF6]"></span> ART</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#F59E0B]"></span> APP</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#EC4899]"></span> REV</span>
                </div>
              </div>

              {/* Right Side: Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-paragraph opacity-60">
                      <th className="py-2" style={{ fontWeight: 'normal' }}>Metric Name</th>
                      <th className="py-2 text-right" style={{ fontWeight: 'normal' }}>Count</th>
                      <th className="py-2 text-right" style={{ fontWeight: 'normal' }}>Details / Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary">
                      <td className="py-2.5 font-bold">Total Inquiries</td>
                      <td className="py-2.5 text-right font-semibold">{inquiries.length}</td>
                      <td className="py-2.5 text-right opacity-80">New Inquiries: {inquiries.filter(i => i.status === 'New').length}</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary">
                      <td className="py-2.5 font-bold">Reviews Received</td>
                      <td className="py-2.5 text-right font-semibold">{reviews.length}</td>
                      <td className="py-2.5 text-right opacity-80">Approved: {reviews.filter(r => (r.status || 'Pending') === 'Approved').length}</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary">
                      <td className="py-2.5 font-bold">Success Stories</td>
                      <td className="py-2.5 text-right font-semibold">{stories.length}</td>
                      <td className="py-2.5 text-right opacity-80">Active testimonials: {stories.length}</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary">
                      <td className="py-2.5 font-bold">Case Studies</td>
                      <td className="py-2.5 text-right font-semibold">{caseStudies.length}</td>
                      <td className="py-2.5 text-right opacity-80">Draft: {caseStudies.filter(c => c.status === 'Draft').length}</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-sub-bg)] text-primary">
                      <td className="py-2.5 font-bold">Applications</td>
                      <td className="py-2.5 text-right font-semibold">{applications.length}</td>
                      <td className="py-2.5 text-right opacity-80">Pending: {applications.filter(a => a.status === 'pending').length}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
          <DialogActions style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
            <Button
              onClick={() => setShowDetailedReportModal(false)}
              variant="contained"
              sx={{
                background: 'var(--color-primary) !important',
                color: '#fff !important',
                '&:hover': {
                  background: 'var(--color-primary-hover) !important'
                },
                borderRadius: 'var(--radius-sm)',
                textTransform: 'none',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-caption)',
                height: '32px',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Date Range Export Modal for PDF */}
      {showPdfExportModal && (
        <Dialog
          open={Boolean(showPdfExportModal)}
          onClose={() => setShowPdfExportModal(false)}
          maxWidth="xs"
          fullWidth
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                borderRadius: "var(--radius-sm)",
                padding: "8px",
                boxShadow: "var(--shadow-card)",
                border: "1px solid var(--color-border)"
              }
            }
          }}
        >
          <DialogTitle style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <div className="flex justify-between items-center">
              <h2 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: 0 }}>
                Export Business Analytics to PDF
              </h2>
              <button
                type="button"
                onClick={() => setShowPdfExportModal(false)}
                className="w-6 h-6 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-paragraph opacity-60 hover:opacity-100 cursor-pointer"
                style={{ fontSize: 'var(--text-caption)' }}
              >
                ✕
              </button>
            </div>
          </DialogTitle>
          <DialogContent style={{ paddingTop: '16px' }}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] text-paragraph opacity-85 font-semibold uppercase tracking-wider block text-left">From Date</label>
                <input
                  type="date"
                  value={exportFromDate}
                  onChange={(e) => setExportFromDate(e.target.value)}
                  className="w-full border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-xs text-paragraph focus:outline-none focus:border-[var(--color-primary)] bg-white font-normal"
                />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] text-paragraph opacity-85 font-semibold uppercase tracking-wider block text-left">To Date</label>
                <input
                  type="date"
                  value={exportToDate}
                  onChange={(e) => setExportToDate(e.target.value)}
                  className="w-full border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-xs text-paragraph focus:outline-none focus:border-[var(--color-primary)] bg-white font-normal"
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }} className="flex justify-end gap-2.5">
            <Button
              onClick={() => {
                setShowPdfExportModal(false);
                setExportFromDate('');
                setExportToDate('');
              }}
              variant="outlined"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-paragraph)',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'none',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-caption)',
                height: '32px'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleExportReport('pdf')}
              variant="contained"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'none',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-caption)',
                height: '32px'
              }}
            >
              Export
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default Dashboard;
