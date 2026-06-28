import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';

import { 
  getAllInquiriesAPI, 
  getAllCaseStudiesAPI, 
  getArticlesAPI, 
  getAdminApplicationsAPI,
  getReviewsAPI
} from '../services/allApi';

import {
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

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
  
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  
  const [reviews, setReviews] = useState([]);

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
      document.getElementById('imageUpload').value = "";
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
    <div className="min-h-screen pt-28 px-4 sm:px-8 relative z-10 md:ml-64">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-white/50 text-sm">Manage your platform data here</p>
          </div>
        </div>
        
        {/* Dashboard Metrics Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          {/* Card 1: Total Inquiries */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-white/10 transition-all">
            <h3 className="text-white/70 text-sm font-medium mb-1">Total Inquiries</h3>
            <p className="text-3xl font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">{metrics.totalInquiries}</p>
          </div>
          
          {/* Card 2: Total Case Studies */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-white/10 transition-all">
            <h3 className="text-white/70 text-sm font-medium mb-1">Total Case Studies</h3>
            <p className="text-3xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]">{metrics.totalCaseStudies}</p>
          </div>

          {/* Card 3: Active Articles */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-white/10 transition-all">
            <h3 className="text-white/70 text-sm font-medium mb-1">Active Articles</h3>
            <p className="text-3xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">{metrics.activeArticles}</p>
          </div>

          {/* Card 4: New Applications */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-white/10 transition-all">
            <h3 className="text-white/70 text-sm font-medium mb-1">New Applications</h3>
            <p className="text-3xl font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{metrics.newApplications}</p>
          </div>
        </div>

        {/* Analytics Section (2x2 Grid of Glassmorphism Charts) */}
        <div className="mt-12 relative z-10">
          <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Analytics Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Top-Left: Liquid Blue Line Chart */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(37,99,235,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-40 mix-blend-overlay"></div>
              <h3 className="text-blue-300 font-bold mb-4 relative z-10 drop-shadow-md">Inquiries Trend</h3>
              <div className="h-64 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.inquiries}>
                    <defs>
                      <linearGradient id="lineBlue" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#ffffff55" tick={{fill: '#ffffff88', fontSize: 12}} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{backgroundColor: 'rgba(15,23,42,0.8)', borderColor: 'rgba(59,130,246,0.3)', backdropFilter: 'blur(12px)', borderRadius: '12px', color: '#fff'}}
                      itemStyle={{color: '#93c5fd'}} 
                    />
                    <Line type="basis" dataKey="value" stroke="url(#lineBlue)" strokeWidth={5} dot={{r: 0}} activeDot={{r: 6, fill: '#bfdbfe', stroke: '#3b82f6', strokeWidth: 2, filter: 'drop-shadow(0px 0px 5px rgba(96,165,250,0.8))'}} style={{ filter: 'drop-shadow(0px 10px 10px rgba(59,130,246,0.4))' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top-Right: Liquid Purple Bar Chart */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(147,51,234,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/20 to-transparent opacity-40 mix-blend-overlay"></div>
              <h3 className="text-purple-300 font-bold mb-4 relative z-10 drop-shadow-md">Case Studies Engagement</h3>
              <div className="h-64 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.caseStudies}>
                    <defs>
                      <linearGradient id="barPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d8b4fe" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#7e22ce" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#ffffff55" tick={{fill: '#ffffff88', fontSize: 12}} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{backgroundColor: 'rgba(15,23,42,0.8)', borderColor: 'rgba(168,85,247,0.3)', backdropFilter: 'blur(12px)', borderRadius: '12px', color: '#fff'}}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="value" fill="url(#barPurple)" radius={[8, 8, 8, 8]} style={{ filter: 'drop-shadow(0px 5px 8px rgba(147,51,234,0.4))' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom-Left: Liquid Green Area Chart */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(16,185,129,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-40 mix-blend-overlay"></div>
              <h3 className="text-emerald-300 font-bold mb-4 relative z-10 drop-shadow-md">Article Reads</h3>
              <div className="h-64 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.articles}>
                    <defs>
                      <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#047857" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#ffffff55" tick={{fill: '#ffffff88', fontSize: 12}} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{backgroundColor: 'rgba(15,23,42,0.8)', borderColor: 'rgba(16,185,129,0.3)', backdropFilter: 'blur(12px)', borderRadius: '12px', color: '#fff'}}
                    />
                    <Area type="monotone" dataKey="value" stroke="#34d399" strokeWidth={3} fill="url(#areaGreen)" style={{ filter: 'drop-shadow(0px 8px 12px rgba(16,185,129,0.3))' }} activeDot={{r: 6, fill: '#a7f3d0', stroke: '#10b981', strokeWidth: 2}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom-Right: Liquid Gold Donut Chart */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(245,158,11,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tl from-amber-500/20 to-transparent opacity-40 mix-blend-overlay"></div>
              <h3 className="text-amber-300 font-bold mb-4 relative z-10 drop-shadow-md">Applications Status</h3>
              <div className="h-64 relative z-10 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="gold1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fde68a" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                      <linearGradient id="gold2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={applicationsDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                      style={{ filter: 'drop-shadow(0px 0px 15px rgba(245,158,11,0.4))' }}
                    >
                      <Cell fill="url(#gold1)" />
                      <Cell fill="url(#gold2)" />
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{backgroundColor: 'rgba(15,23,42,0.8)', borderColor: 'rgba(245,158,11,0.3)', backdropFilter: 'blur(12px)', borderRadius: '12px', color: '#fff'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Add Success Story Form */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Add Client Success Story</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Client Story</label>
              <textarea 
                name="clientStories"
                value={formData.clientStories}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="Write the client's success story here..."
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="e.g. Sarah Johnson"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Position & Company</label>
                <input 
                  type="text" 
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="e.g. CEO, GlobalTech"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Client Image</label>
              <input 
                type="file" 
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors cursor-pointer"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Uploading...' : 'Submit Story'}
            </button>
          </form>
        </div>

        {/* Active Client Stories Section */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Active Client Stories</h2>
          
          {loadingStories ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : stories.length === 0 ? (
            <div className="p-8 text-center text-white/50 bg-black/20 rounded-xl border border-white/5">
              No stories to display
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div key={story._id} className="bg-black/20 border border-white/10 rounded-xl p-5 relative group transition-all hover:border-blue-500/30">
                  <button 
                    onClick={() => handleDelete(story._id)}
                    className="absolute top-4 right-4 text-white/40 hover:text-red-500 transition-colors z-10 p-2 bg-black/40 rounded-lg hover:bg-black/80 shadow-lg"
                    title="Delete Story"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <img src={story.imageUrl} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-white/10" />
                    <div>
                      <h3 className="text-white font-bold">{story.name}</h3>
                      <p className="text-white/50 text-sm">{story.position}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm italic line-clamp-4">
                    "{story.clientStories}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Client Reviews Section */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Client Reviews</h2>
          
          {reviews.length === 0 ? (
            <div className="p-8 text-center text-white/50 bg-black/20 rounded-xl border border-white/5">
              No reviews to display
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => {
                const isNew = (new Date() - new Date(review.createdAt)) < 24 * 60 * 60 * 1000;
                return (
                  <div key={review._id} className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-5 relative group transition-all hover:border-blue-500/30 flex flex-col h-full">
                    {isNew && (
                      <div className="absolute -top-2 -right-2 flex items-center justify-center">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-slate-900 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-3">
                      <div className="pr-4 overflow-hidden">
                        <h3 className="text-white font-bold text-lg leading-tight truncate">{review.fullName}</h3>
                        <p className="text-white/50 text-sm truncate">{review.company}</p>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            fontSize="small" 
                            className={i < review.rating ? "text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]" : "text-white/10"} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <h4 className="text-blue-300 font-semibold mb-2 line-clamp-1 break-all" title={review.title}>{review.title}</h4>
                    
                    <p className="text-white/70 text-sm italic whitespace-pre-wrap break-words">
                      "{review.review}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
