import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { toast } from 'sonner';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import { 
  getAllInquiriesAPI, 
  getAllCaseStudiesAPI, 
  getArticlesAPI, 
  getAdminApplicationsAPI,
  getReviewsAPI,
  deleteReviewAPI
} from '../services/allApi';

import {
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [selectedDetailsModal, setSelectedDetailsModal] = useState(null);

  const [metrics, setMetrics] = useState({
    totalInquiries: 0,
    totalCaseStudies: 0,
    activeArticles: 0,
    newApplications: 0,
    totalApplications: 0
  });

  const [chartData, setChartData] = useState({
    inquiries: [],
    caseStudies: [],
    articles: []
  });

  const applicationsDonutData = React.useMemo(() => [
    { name: 'New (Pending)', value: metrics.newApplications || 0 },
    { name: 'Reviewed/Archived', value: Math.max(0, metrics.totalApplications - metrics.newApplications) || 0 }
  ], [metrics.newApplications, metrics.totalApplications]);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    clientStories: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState({});

  const toggleExpandReview = (id) => {
    setExpandedReviews(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const fetchStories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/success-stories`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.position || !formData.clientStories || !formData.image) {
      toast.error('Please fill all fields and select an image');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('position', formData.position);
      data.append('clientStories', formData.clientStories);
      data.append('image', formData.image);

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/success-stories`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Client success story added successfully!');
      setFormData({ name: '', position: '', clientStories: '', image: null });
      const imgInput = document.getElementById('imageUpload');
      if (imgInput) imgInput.value = "";
      setShowStoryModal(false);
      fetchStories(); // Refetch after adding
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Failed to add success story';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/success-stories/${id}`);
      toast.success('Story deleted successfully');
      setStories(stories.filter(story => story._id !== id));
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await deleteReviewAPI(id);
      toast.success('Review deleted successfully');
      setReviews(reviews.filter(review => review._id !== id));
      const updatedReviewsCount = reviews.length - 1;
      const reviewsPerPage = 9;
      const totalPages = Math.ceil(updatedReviewsCount / reviewsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
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

      setMetrics({
        totalInquiries: inquiriesList.length,
        totalCaseStudies: caseStudiesList.length,
        activeArticles: articlesList.length,
        newApplications: applicationsList.filter(app => app.status === "pending").length,
        totalApplications: applicationsList.length
      });

      const processChartData = (dataArray) => {
        const countsByDate = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            last7Days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }

        last7Days.forEach(dateStr => {
            countsByDate[dateStr] = 0;
        });

        if (Array.isArray(dataArray)) {
            dataArray.forEach(item => {
                if (item.createdAt) {
                    const d = new Date(item.createdAt);
                    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    if (countsByDate[dateStr] !== undefined) {
                        countsByDate[dateStr]++;
                    }
                }
            });
        }

        return last7Days.map(date => ({ date, value: countsByDate[date] }));
      };

      setChartData({
        inquiries: processChartData(inquiriesList),
        caseStudies: processChartData(caseStudiesList),
        articles: processChartData(articlesList)
      });

      if (reviewsRes.status === 200 && reviewsRes.data?.success) {
        setReviews(reviewsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
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

      const handleUpdate = () => fetchMetrics();
      window.addEventListener('notificationUpdate', handleUpdate);
      const interval = setInterval(fetchMetrics, 15000);

      return () => {
        window.removeEventListener('notificationUpdate', handleUpdate);
        clearInterval(interval);
      };
    }
  }, [navigate]);

  if (!adminUser) return null;

  return (
    <>
      <div className="min-h-screen pt-24 px-4 sm:px-8 pb-8 relative z-10 md:ml-56 bg-sub">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-5 border-b border-[var(--color-border)] gap-4">
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }}>
                Admin Dashboard
              </h1>
              <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-paragraph)', opacity: 0.6, margin: '2px 0 0 0' }}>
                Manage your platform data here
              </p>
            </div>
            <button
              onClick={() => setShowStoryModal(true)}
              className="btn px-4 py-2 border-none cursor-pointer w-full sm:w-auto justify-center h-10 text-sm"
              style={{ fontWeight: 'var(--font-medium)' }}
            >
              Add Client Success Story
            </button>
          </div>
          
          {/* Dashboard Metrics Cards (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 relative z-10">
            {/* Card 1: Total Inquiries */}
            <div className="card py-4 px-5 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300">
              <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)', opacity: 0.7, margin: 0 }}>Total Inquiries</h3>
              <p style={{ fontSize: '26px', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '2px 0 0 0' }}>{metrics.totalInquiries}</p>
            </div>
            
            {/* Card 2: Total Case Studies */}
            <div className="card py-4 px-5 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300">
              <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)', opacity: 0.7, margin: 0 }}>Total Case Studies</h3>
              <p style={{ fontSize: '26px', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '2px 0 0 0' }}>{metrics.totalCaseStudies}</p>
            </div>
 
            {/* Card 3: Active Articles */}
            <div className="card py-4 px-5 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300">
              <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)', opacity: 0.7, margin: 0 }}>Active Articles</h3>
              <p style={{ fontSize: '26px', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '2px 0 0 0' }}>{metrics.activeArticles}</p>
            </div>
 
            {/* Card 4: New Applications */}
            <div className="card py-4 px-5 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300">
              <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)', opacity: 0.7, margin: 0 }}>New Applications</h3>
              <p style={{ fontSize: '26px', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '2px 0 0 0' }}>{metrics.newApplications}</p>
            </div>
          </div>
 
          {/* Analytics Section */}
          <div className="mt-8 relative z-10">
            <button
              type="button"
              id="analytics-accordion-btn"
              onClick={() => setIsAnalyticsOpen(prev => !prev)}
              className="w-full flex items-center justify-between card p-4 hover:border-[var(--color-primary)]/40 transition-all cursor-pointer text-left focus:outline-none"
            >
              <div>
                <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: 0 }}>
                  Analytics Overview
                </h2>
                <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-paragraph)', opacity: 0.6, margin: '2px 0 0 0' }}>
                  Click to expand/collapse detailed platform metrics
                </p>
              </div>
              <div className={`transform transition-transform duration-300 ${isAnalyticsOpen ? 'rotate-180' : 'rotate-0'}`}>
                <ExpandMoreIcon className="text-[var(--color-primary)]" />
              </div>
            </button>

            <AnimatePresence>
              {isAnalyticsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top-Left: Line Chart */}
                    <div className="card p-4 shadow-card relative overflow-hidden group">
                      <h3 style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: '0 0 8px 0' }} className="relative z-10">Inquiries Trend</h3>
                      <div className="h-44 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData.inquiries}>
                            <XAxis dataKey="date" stroke="var(--color-border)" tick={{fill: 'var(--color-paragraph)', opacity: 0.6, fontSize: 10}} tickLine={false} axisLine={false} />
                            <RechartsTooltip 
                              contentStyle={{backgroundColor: 'var(--color-main-bg)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-paragraph)'}}
                            />
                            <Line type="basis" dataKey="value" stroke="var(--color-primary)" strokeWidth={3} dot={{r: 0}} activeDot={{r: 5, fill: '#fff', stroke: 'var(--color-primary)', strokeWidth: 1.5}} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Top-Right: Bar Chart */}
                    <div className="card p-4 shadow-card relative overflow-hidden group">
                      <h3 style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: '0 0 8px 0' }} className="relative z-10">Case Studies Engagement</h3>
                      <div className="h-44 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData.caseStudies}>
                            <XAxis dataKey="date" stroke="var(--color-border)" tick={{fill: 'var(--color-paragraph)', opacity: 0.6, fontSize: 10}} tickLine={false} axisLine={false} />
                            <RechartsTooltip 
                              contentStyle={{backgroundColor: 'var(--color-main-bg)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-paragraph)'}}
                              cursor={{fill: 'var(--color-sub-bg)', opacity: 0.4}}
                            />
                            <Bar dataKey="value" fill="var(--color-primary)" radius={[3, 3, 0, 0]} opacity={0.8} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bottom-Left: Area Chart */}
                    <div className="card p-4 shadow-card relative overflow-hidden group">
                      <h3 style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: '0 0 8px 0' }} className="relative z-10">Article Reads</h3>
                      <div className="h-44 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData.articles}>
                            <defs>
                              <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="var(--color-border)" tick={{fill: 'var(--color-paragraph)', opacity: 0.6, fontSize: 10}} tickLine={false} axisLine={false} />
                            <RechartsTooltip 
                              contentStyle={{backgroundColor: 'var(--color-main-bg)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-paragraph)'}}
                            />
                            <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#areaColor)" activeDot={{r: 5, fill: '#fff', stroke: 'var(--color-primary)', strokeWidth: 1.5}} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bottom-Right: Donut Chart */}
                    <div className="card p-4 shadow-card relative overflow-hidden group">
                      <h3 style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: '0 0 8px 0' }} className="relative z-10">Applications Status</h3>
                      <div className="h-44 relative z-10 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={applicationsDonutData}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={65}
                              paddingAngle={6}
                              dataKey="value"
                              stroke="none"
                            >
                              <Cell fill="var(--color-primary)" />
                              <Cell fill="var(--color-border)" />
                            </Pie>
                            <RechartsTooltip 
                              contentStyle={{backgroundColor: 'var(--color-main-bg)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-paragraph)'}}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Active Client Stories Section */}
          <div className="card p-5 shadow-card relative overflow-hidden mt-6">
            <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '0 0 15px 0' }}>
              Active Client Stories
            </h2>
            
            {loadingStories ? (
              <div className="flex justify-center p-5">
                <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : stories.length === 0 ? (
              <div className="p-6 text-center text-[var(--color-paragraph)] opacity-60 bg-[var(--color-sub-bg)]/40 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-sm">
                No stories to display
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stories.map((story) => (
                  <div key={story._id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 relative group transition-all hover:border-[var(--color-primary)]/40 bg-[var(--color-sub-bg)]/40 hover:bg-[var(--color-sub-bg)] hover:-translate-y-0.5 flex flex-col justify-between h-[150px] overflow-hidden">
                    <button 
                      onClick={() => handleDelete(story._id)}
                      className="absolute top-3.5 right-3.5 text-[var(--color-paragraph)] opacity-40 hover:opacity-100 hover:text-red-500 transition z-10 p-1.5 bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-sm cursor-pointer"
                      title="Delete Story"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-2 animate-none">
                      <img src={story.imageUrl} alt={story.name} className="w-12 h-12 rounded-full object-cover border border-[var(--color-border)]" />
                      <div>
                        <h3 className="text-[var(--color-black)] font-bold text-sm leading-tight truncate max-w-[120px]">{story.name}</h3>
                        <p className="text-[var(--color-paragraph)] opacity-60 text-xs truncate max-w-[120px]">{story.position}</p>
                      </div>
                    </div>
                    
                    <p className={`text-[var(--color-paragraph)] opacity-80 text-xs italic ${story.clientStories.length > 110 ? "line-clamp-2" : "line-clamp-3"}`}>
                      "{story.clientStories}"
                    </p>
                    {story.clientStories.length > 110 && (
                      <button
                        type="button"
                        onClick={() => setSelectedDetailsModal({
                          title: 'Client Story Details',
                          type: 'Story',
                          name: story.name,
                          subtitle: story.position,
                          text: story.clientStories,
                          imageUrl: story.imageUrl
                        })}
                        className="text-[var(--color-primary)] hover:underline text-[10px] font-semibold mt-0.5 self-start cursor-pointer focus:outline-none"
                      >
                        Read More
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Reviews Section */}
          <div className="card p-5 shadow-card relative overflow-hidden mt-6 mb-6">
            <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '0 0 15px 0' }}>
              Client Reviews
            </h2>
            
            {reviews.length === 0 ? (
              <div className="p-6 text-center text-[var(--color-paragraph)] opacity-60 bg-[var(--color-sub-bg)]/40 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-sm">
                No reviews to display
              </div>
            ) : (() => {
              const reviewsPerPage = 9; // exactly 3 rows of 3 columns on desktop
              const indexOfLastReview = currentPage * reviewsPerPage;
              const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
              const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
              const totalPages = Math.ceil(reviews.length / reviewsPerPage);
              
              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentReviews.map((review) => {
                      const isNew = (new Date() - new Date(review.createdAt)) < 24 * 60 * 60 * 1000;
                      return (
                        <div key={review._id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 relative group transition-all hover:border-[var(--color-primary)]/40 bg-[var(--color-sub-bg)]/40 hover:bg-[var(--color-sub-bg)] hover:-translate-y-0.5 flex flex-col justify-between h-[150px] overflow-hidden">
                          <button 
                            onClick={() => handleDeleteReview(review._id)}
                            className="absolute top-3.5 right-3.5 text-[var(--color-paragraph)] opacity-40 hover:opacity-100 hover:text-red-500 transition z-10 p-1.5 bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-sm cursor-pointer"
                            title="Delete Review"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>

                          <div>
                            {isNew && (
                              <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border border-slate-900 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-start mb-2">
                              <div className="pr-12 overflow-hidden">
                                <h3 className="text-[var(--color-black)] font-bold text-sm leading-tight truncate max-w-[120px]">{review.fullName}</h3>
                                <p className="text-[var(--color-paragraph)] opacity-60 text-xs truncate max-w-[120px]">{review.company}</p>
                              </div>
                              <div className="flex gap-0.5 shrink-0 mr-8">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon 
                                    key={i} 
                                    fontSize="small" 
                                    style={{ fontSize: 14 }}
                                    className={i < review.rating ? "text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]" : "text-[var(--color-paragraph)] opacity-20"} 
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <h4 className="text-[var(--color-primary)] font-semibold mb-1 text-xs line-clamp-1 break-all" title={review.title}>{review.title}</h4>
                            
                            <div className={`text-[var(--color-paragraph)] opacity-80 text-xs italic whitespace-pre-wrap break-words ${review.review.length > 110 ? "line-clamp-1" : "line-clamp-2"}`}>
                              "{review.review}"
                            </div>
                            {review.review.length > 110 && (
                              <button
                                type="button"
                                onClick={() => setSelectedDetailsModal({
                                  title: 'Client Review Details',
                                  type: 'Review',
                                  name: review.fullName,
                                  subtitle: review.company,
                                  text: review.review,
                                  rating: review.rating,
                                  reviewTitle: review.title
                                })}
                                className="text-[var(--color-primary)] hover:underline text-[10px] font-semibold mt-0.5 self-start cursor-pointer focus:outline-none"
                              >
                                Read More
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-[var(--color-border)] text-xs rounded-[var(--radius-sm)] text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold"
                      >
                        Previous
                      </button>
                      <span className="text-xs font-semibold text-[var(--color-paragraph)] opacity-80">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border border-[var(--color-border)] text-xs rounded-[var(--radius-sm)] text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </motion.div>
      </div>

      {showStoryModal &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg border border-[var(--color-border)] bg-[var(--color-main-bg)] shadow-xl overflow-hidden" style={{ borderRadius: 'var(--radius-sm)' }}>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
                <div>
                  <h2 style={{ fontSize: 'var(--text-card-heading)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }}>
                    Add Success Story
                  </h2>
                  <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-1">
                    Create a new client success story to display on the platform.
                  </p>
                </div>
                <button
                  onClick={() => setShowStoryModal(false)}
                  className="w-8 h-8 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-[var(--color-paragraph)] opacity-60 hover:opacity-100 cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit}>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block mb-1.5 text-[var(--color-paragraph)] opacity-80 font-medium text-xs">Client Story</label>
                    <textarea 
                      name="clientStories"
                      value={formData.clientStories}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] p-3 text-sm text-[var(--color-paragraph)] placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] transition resize-none"
                      placeholder="Write the client's success story here..."
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-[var(--color-paragraph)] opacity-80 font-medium text-xs">Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 text-sm text-[var(--color-paragraph)] placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] transition"
                        placeholder="Sarah Johnson"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-[var(--color-paragraph)] opacity-80 font-medium text-xs">Position & Company</label>
                      <input 
                        type="text" 
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 text-sm text-[var(--color-paragraph)] placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] transition"
                        placeholder="CEO, GlobalTech"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-[var(--color-paragraph)] opacity-80 font-medium text-xs">Client Image</label>
                    <input 
                      type="file" 
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 text-sm text-[var(--color-paragraph)] opacity-80 file:mr-4 file:py-1.5 file:px-3 file:rounded-[var(--radius-sm)] file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-blue-600 transition cursor-pointer"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setShowStoryModal(false)}
                    className="px-5 py-2 border border-[var(--color-border)] text-sm text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition font-semibold cursor-pointer h-10"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn px-5 py-2 border-none disabled:opacity-50 cursor-pointer text-sm h-10"
                    style={{ fontWeight: 'var(--font-semibold)' }}
                  >
                    {isSubmitting ? 'Uploading...' : 'Submit Story'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
      {/* FULL DETAILS MODAL */}
      <Dialog
        open={Boolean(selectedDetailsModal)}
        onClose={() => setSelectedDetailsModal(null)}
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
        {selectedDetailsModal && (
          <>
            <DialogTitle style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 style={{ fontSize: 'var(--text-card-heading)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: 0 }}>
                    {selectedDetailsModal.title}
                  </h2>
                </div>
              </div>
            </DialogTitle>
            
            <DialogContent style={{ paddingTop: '20px' }}>
              <div className="flex flex-col gap-4">
                {selectedDetailsModal.type === 'Story' ? (
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedDetailsModal.imageUrl} 
                      alt={selectedDetailsModal.name} 
                      className="w-12 h-12 rounded-full object-cover border border-[var(--color-border)]" 
                    />
                    <div>
                      <h3 className="text-[var(--color-black)] font-bold text-sm leading-tight">{selectedDetailsModal.name}</h3>
                      <p className="text-[var(--color-paragraph)] opacity-60 text-xs">{selectedDetailsModal.subtitle}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-[var(--color-black)] font-bold text-sm leading-tight">{selectedDetailsModal.name}</h3>
                        <p className="text-[var(--color-paragraph)] opacity-60 text-xs">{selectedDetailsModal.subtitle}</p>
                      </div>
                      <div className="flex gap-0.5 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            fontSize="small" 
                            style={{ fontSize: 14 }}
                            className={i < selectedDetailsModal.rating ? "text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]" : "text-[var(--color-paragraph)] opacity-20"} 
                          />
                        ))}
                      </div>
                    </div>
                    {selectedDetailsModal.reviewTitle && (
                      <h4 className="text-[var(--color-primary)] font-semibold text-xs mb-1">
                        {selectedDetailsModal.reviewTitle}
                      </h4>
                    )}
                  </div>
                )}
                
                <div className="text-[var(--color-paragraph)] opacity-85 text-xs sm:text-sm italic leading-relaxed whitespace-pre-wrap bg-[var(--color-sub-bg)]/30 p-4 border border-[var(--color-border)] rounded-[var(--radius-sm)]">
                  "{selectedDetailsModal.text}"
                </div>
              </div>
            </DialogContent>
            
            <DialogActions style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
              <Button 
                onClick={() => setSelectedDetailsModal(null)}
                variant="outlined" 
                style={{ 
                  color: 'var(--color-paragraph)', 
                  borderColor: 'var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  textTransform: 'none',
                  fontWeight: 'var(--font-semibold)',
                  fontSize: '12px'
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default Dashboard;
