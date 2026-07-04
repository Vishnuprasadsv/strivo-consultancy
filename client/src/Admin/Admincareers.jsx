import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';


import {
  getAdminStatsAPI,
  getJobsAPI,
  getAdminApplicationsAPI,
  updateApplicationStatusAPI,
  referApplicationAPI,
  createJobAPI,
  updateJobAPI,
  deleteJobAPI,
  getTalentSubmissionsAPI,
  deleteApplicationAPI,
  deleteTalentSubmissionAPI
} from '../services/allApi';

import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import ErrorIcon from '@mui/icons-material/Error';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button
} from "@mui/material";

const CareerAdmin = () => {
  



  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    talentSubmissions: 0,
    pendingActions: 0
  });

 
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // filter chaiyyan
  const [activeFilter, setActiveFilter] = useState('all');

  // job list chaiyyan modal open chaiyya close chaiyya
  const [openJobModal, setOpenJobModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    jobType: 'Full Time',
    status: 'Active',
    description: ''
  });

  const [openAppModal, setOpenAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);


  const [openTalentModal, setOpenTalentModal] = useState(false);
  const [talentSubmissions, setTalentSubmissions] = useState([]);
  const [loadingTalent, setLoadingTalent] = useState(false);
  
  // Pagination & Notification Clear States
  const [appPage, setAppPage] = useState(1);
  const [talentPage, setTalentPage] = useState(1);
  const [clearedNotificationsTime, setClearedNotificationsTime] = useState(null);
// ella datem fetch chaiyya back end eenu
  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      
      const [statsRes, jobsRes, appsRes, talentRes] = await Promise.all([
        getAdminStatsAPI(),
        getJobsAPI(),
        getAdminApplicationsAPI(),
        getTalentSubmissionsAPI()
      ]);

      if (statsRes.status === 200 && statsRes.data?.success) setStats(statsRes.data.data);
      if (jobsRes.status === 200 && jobsRes.data?.success) setJobs(jobsRes.data.data);
      if (appsRes.status === 200 && appsRes.data?.success) setApplications(appsRes.data.data);
      if (talentRes.status === 200 && talentRes.data?.success) setTalentSubmissions(talentRes.data.data);

//    bell adikkan
      window.dispatchEvent(new Event('notificationUpdate'));

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      if (!silent) toast.error("Failed to load real-time backend data.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleUpdateStatus = async (appId, newStatus) => {
    const previousApps = [...applications];
   



    setApplications(prev =>
      prev.map(app => (app._id === appId ? { ...app, status: newStatus } : app))
    );
    window.dispatchEvent(new Event('notificationUpdate'));

    try {
      const response = await updateApplicationStatusAPI(appId, newStatus);
      if (response.status === 200 && response.data?.success) {
        toast.success(`Application updated to: ${getStatusDetails(newStatus).label}`);
        




        fetchData(true);
      } else {
        setApplications(previousApps);
        window.dispatchEvent(new Event('notificationUpdate'));
        toast.error("Failed to update application status.");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      setApplications(previousApps);
      window.dispatchEvent(new Event('notificationUpdate'));
      toast.error("Failed to update application status.");
    }
  };







  const handleReferToHR = async (appId) => {
    const previousApps = [...applications];
  
    setApplications(prev =>
      prev.map(app => (app._id === appId ? { ...app, status: 'referred' } : app))
    );
    window.dispatchEvent(new Event('notificationUpdate'));

    try {
      const response = await referApplicationAPI(appId);
      if (response.status === 200 && response.data?.success) {
        toast.success("Candidate referred to HR. Notification email triggered.");



        fetchData(true);
      } else {
        setApplications(previousApps);
        window.dispatchEvent(new Event('notificationUpdate'));
        toast.error("Failed to refer candidate to HR.");
      }
    } catch (error) {
      console.error("Failed to refer candidate:", error);
      setApplications(previousApps);
      window.dispatchEvent(new Event('notificationUpdate'));
      toast.error("Failed to refer candidate to HR.");
    }
  };

  const handleDeleteApplication = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      const response = await deleteApplicationAPI(appId);
      if (response.status === 200 && response.data?.success) {
        toast.success("Application deleted successfully");
        setAppPage(1);
        fetchData(true);
      } else {
        toast.error("Failed to delete application.");
      }
    } catch (error) {
      console.error("Failed to delete application:", error);
      toast.error("Failed to delete application.");
    }
  };

  const handleDeleteTalent = async (subId) => {
    if (!window.confirm("Are you sure you want to delete this talent network submission?")) return;
    try {
      const response = await deleteTalentSubmissionAPI(subId);
      if (response.status === 200 && response.data?.success) {
        toast.success("Talent submission deleted successfully");
        setTalentPage(1);
        fetchData(true);
      } else {
        toast.error("Failed to delete talent submission.");
      }
    } catch (error) {
      console.error("Failed to delete talent submission:", error);
      toast.error("Failed to delete talent submission.");
    }
  };

// delete chaiyyan
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      const response = await deleteJobAPI(jobId);
      if (response.status === 200 && response.data?.success) {
        toast.success("Job deleted successfully");
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete job listing.");
    }
  };




//   modal
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentJobId(null);
    setJobForm({
      title: '',
      department: '',
      location: '',
      jobType: 'Full Time',
      status: 'Active',
      description: ''
    });
    setOpenJobModal(true);
  };

  const handleOpenEditModal = (job) => {
    setIsEditing(true);
    setCurrentJobId(job._id);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      jobType: job.jobType || 'Full Time',
      status: job.status || 'Active',
      description: job.description
    });
    setOpenJobModal(true);
  };




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({ ...prev, [name]: value }));
  };

 



  const handleSubmitJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.department || !jobForm.location || !jobForm.description) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      if (isEditing) {
        const res = await updateJobAPI(currentJobId, jobForm);
        if (res.status === 200 && res.data?.success) {
          toast.success("Job listing updated successfully!");
        }
      } else {
        const res = await createJobAPI(jobForm);
        if (res.status === 201 && res.data?.success) {
          toast.success("New job listing created successfully!");
        }
      }
      setOpenJobModal(false);
      fetchData();
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job listing.");
    }
  };




  const handleViewApplication = (app) => {
    setSelectedApp(app);
    setOpenAppModal(true);
  };




  const handleOpenTalentModal = async () => {
    setOpenTalentModal(true);
    setLoadingTalent(true);
    try {
      const res = await getTalentSubmissionsAPI();
      if (res.status === 200 && res.data?.success) {
        setTalentSubmissions(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load talent network:", error);
      toast.error("Failed to retrieve talent network list.");
    } finally {
      setLoadingTalent(false);
    }
  };

  


  const getStatusDetails = (status) => {
    switch (status) {
      case 'referred':
        return { label: 'Referred to HR', className: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' };
      case 'accepted':
        return { label: 'Approved', className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' };
      case 'rejected':
        return { label: 'Rejected', className: 'bg-red-500/20 text-red-400 border border-red-500/30' };
      case 'reviewed':
        return { label: 'Under Review', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' };
      case 'pending':
      default:
        return { label: 'New', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' };
    }
  };

// donut
  const getAppStatsCounts = () => {
    const counts = { pending: 0, reviewed: 0, accepted: 0, rejected: 0, referred: 0 };
    applications.forEach(app => {
      const s = app.status || 'pending';
      if (counts[s] !== undefined) {
        counts[s]++;
      }
    });
    return counts;
  };

  const appCounts = getAppStatsCounts();
  const totalAppsCount = applications.length || 1; // avoid division by zero
  const statusPercentages = {
    pending: Math.round((appCounts.pending / totalAppsCount) * 100),
    reviewed: Math.round((appCounts.reviewed / totalAppsCount) * 100),
    accepted: Math.round((appCounts.accepted / totalAppsCount) * 100),
    rejected: Math.round((appCounts.rejected / totalAppsCount) * 100),
    referred: Math.round((appCounts.referred / totalAppsCount) * 100),
  };

//  chart ithu material ui 
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // Approx 251.327
  
  const statsMap = [
    { count: appCounts.pending, color: '#3B82F6' },    // Blue (New)
    { count: appCounts.reviewed, color: '#F59E0B' },   // Orange (Under Review)
    { count: appCounts.accepted, color: '#10B981' },   // Green (Approved)
    { count: appCounts.referred, color: '#A855F7' },   // Purple (Referred to HR)
    { count: appCounts.rejected, color: '#EF4444' }    // Red (Rejected)
  ];
  
  let currentOffset = 0;
  const donutSegments = [];
  
  statsMap.forEach((segment) => {
   
    if (segment.count > 0) {
      const percentage = segment.count / totalAppsCount;
      const strokeLength = percentage * circumference;
      const strokeOffset = circumference - strokeLength + currentOffset;
      
      donutSegments.push({
        color: segment.color,
        strokeOffset: strokeOffset
      });
    
      currentOffset = currentOffset - strokeLength;
    }
  });

//  filter & sort (newest first)
  const filteredApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(app => {
      if (activeFilter === 'pending') {
        return app.status === 'pending';
      }
      return true; // show all
    });

  // Recent Applications Pagination
  const appsPerPage = 5;
  const totalAppPages = Math.ceil(filteredApplications.length / appsPerPage) || 1;
  const currentAppPage = Math.min(appPage, totalAppPages);
  const paginatedApplications = filteredApplications.slice((currentAppPage - 1) * appsPerPage, currentAppPage * appsPerPage);

  // Talent Submissions Pagination & Sort (newest first)
  const sortedTalentSubmissions = [...talentSubmissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const talentPerPage = 5;
  const totalTalentPages = Math.ceil(sortedTalentSubmissions.length / talentPerPage) || 1;
  const currentTalentPage = Math.min(talentPage, totalTalentPages);
  const paginatedTalent = sortedTalentSubmissions.slice((currentTalentPage - 1) * talentPerPage, currentTalentPage * talentPerPage);


  const getDynamicNotifications = () => {
    const list = [];

    // 1. Add all applications
    applications.forEach(app => {
      let text = "";
      let color = "bg-blue-500";
      
      if (app.status === 'pending' || !app.status) {
        text = `New application: ${app.fullName} for ${app.appliedPosition}`;
        color = "bg-blue-500";
      } else if (app.status === 'reviewed') {
        text = `Application reviewed: ${app.fullName} (${app.appliedPosition})`;
        color = "bg-yellow-500";
      } else if (app.status === 'referred') {
        text = `Application referred to HR: ${app.fullName} (${app.appliedPosition})`;
        color = "bg-purple-500";
      } else if (app.status === 'accepted') {
        text = `Application approved: ${app.fullName} (${app.appliedPosition})`;
        color = "bg-emerald-500";
      } else if (app.status === 'rejected') {
        text = `Application rejected: ${app.fullName} (${app.appliedPosition})`;
        color = "bg-red-500";
      }

      list.push({
        text,
        time: new Date(app.createdAt || app.updatedAt),
        color
      });
    });

    
    talentSubmissions.forEach(sub => {
      list.push({
        text: `New talent submission: ${sub.fullName} (${sub.category})`,
        time: new Date(sub.createdAt),
        color: "bg-emerald-500"
      });
    });


    let filteredList = list;
    if (clearedNotificationsTime) {
      filteredList = list.filter(item => item.time > clearedNotificationsTime);
    }

    filteredList.sort((a, b) => b.time - a.time);

    return filteredList.slice(0, 5).map(item => {
      const diffMs = new Date() - item.time;
      const diffMins = Math.floor(diffMs / 60000);
      let timeStr = "";

      if (diffMins < 1) {
        timeStr = "Just now";
      } else if (diffMins < 60) {
        timeStr = `${diffMins}m ago`;
      } else if (diffMins < 1440) {
        timeStr = `${Math.floor(diffMins / 60)}h ago`;
      } else {
        timeStr = item.time.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }

      return {
        text: item.text,
        time: timeStr,
        color: item.color
      };
    });
  };

  const recentNotifications = getDynamicNotifications();

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 relative z-10 md:ml-64 bg-sub">
   
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pb-12"
      >
  
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-[var(--color-border)] gap-4">
          <div>
            <h1 style={{ fontSize: 'var(--text-sub-heading)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }}>
              Career Admin Dashboard
            </h1>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-paragraph)', opacity: 0.6, margin: '2px 0 0 0' }}>
              Manage careers, applications and talent submissions
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="btn px-5 py-2.5 flex items-center gap-2 cursor-pointer border-none"
            style={{ fontWeight: 'var(--font-medium)' }}
          >
            <AddIcon fontSize="small" /> Create New Job
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
          <div
            onClick={() => {
              const element = document.getElementById('active-job-listings-section');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="card p-5 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)', opacity: 0.7, margin: 0 }}>Total Jobs</h3>
            <p style={{ fontSize: 'var(--text-sub-heading)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '4px 0 0 0' }}>{stats.totalJobs || jobs.length}</p>
            <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)', margin: '4px 0 0 0' }}>Click to View Listing</p>
          </div>

          <div
            onClick={() => {
              setActiveFilter('all');
              toast.info("Showing all applications.");
            }}
            className="card p-5 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)', opacity: 0.7, margin: 0 }}>Applications</h3>
            <p style={{ fontSize: 'var(--text-sub-heading)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '4px 0 0 0' }}>{stats.totalApplications || applications.length}</p>
            <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)', margin: '4px 0 0 0' }}>Show All Entries </p>
          </div>

          <div
            onClick={handleOpenTalentModal}
            className="card p-5 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)', opacity: 0.7, margin: 0 }}>Talent Submissions</h3>
            <p style={{ fontSize: 'var(--text-sub-heading)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '4px 0 0 0' }}>{stats.talentSubmissions || talentSubmissions.length}</p>
            <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)', margin: '4px 0 0 0' }}>View Talent Network </p>
          </div>

          <div
            onClick={() => {
              setActiveFilter('pending');
              toast.info("Filtering table: Pending actions only.");
            }}
            className="card p-5 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)', opacity: 0.7, margin: 0 }}>Pending Actions</h3>
            <p style={{ fontSize: 'var(--text-sub-heading)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '4px 0 0 0' }}>{stats.pendingActions || applications.filter(a => a.status === 'pending').length}</p>
            <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)', margin: '4px 0 0 0' }}>Filter Pending</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          
          <div className="lg:col-span-8 flex flex-col gap-8">
            
           
            <div className="card p-5 shadow-card relative overflow-hidden">
              <div className="flex flex-wrap justify-between items-center mb-5 gap-2">
                <div className="flex items-center gap-3">
                  <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: 0 }}>Recent Applications</h2>
                  {activeFilter === 'pending' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
                      Pending Only
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {activeFilter !== 'all' && (
                    <button
                      onClick={() => setActiveFilter('all')}
                      className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] opacity-80 hover:opacity-100 rounded-[var(--radius-sm)] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Clear Filter
                    </button>
                  )}
                  <button onClick={fetchData} className="px-4 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] opacity-80 hover:opacity-100 rounded-[var(--radius-sm)] text-xs font-semibold transition-colors cursor-pointer">
                    Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : filteredApplications.length === 0 ? (
                <div className="py-12 text-center text-[var(--color-paragraph)] opacity-50 border border-[var(--color-border)] bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]">
                  {activeFilter === 'pending' ? 'No pending applications left!' : 'No applications received yet.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-[var(--color-paragraph)] opacity-50 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pr-4 font-semibold w-1/3 min-w-[200px]">Candidate & Position</th>
                        <th className="pb-3 px-4 font-semibold w-1/6 min-w-[100px]">Applied On</th>
                        <th className="pb-3 px-4 font-semibold w-1/6 min-w-[100px]">Status</th>
                        <th className="pb-3 pl-4 font-semibold text-right w-1/3 min-w-[200px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-sm">
                      {paginatedApplications.map((app) => {
                        const statusObj = getStatusDetails(app.status);
                        const appliedDate = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        
                        return (
                          <tr key={app._id} className="hover:bg-[var(--color-sub-bg)]/40 transition-colors">
                           
                            <td className="py-4 pr-4 w-1/3 min-w-[200px]">
                              <div className="flex items-center gap-3">
                                <div className="min-w-0">
                                  <p style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }} className="truncate">
                                    {app.fullName}
                                  </p>
                                  <p style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-primary)', margin: '2px 0 0 0' }} className="truncate">
                                    {app.appliedPosition}
                                  </p>
                                  <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-paragraph)', opacity: 0.8, margin: '2px 0 0 0' }} className="truncate">
                                    {app.email}
                                  </p>
                                
                                  <a
                                    href={app.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                                    style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)' }}
                                  >
                                    <PictureAsPdfIcon style={{ fontSize: 14 }} /> View Resume
                                  </a>
                                </div>
                              </div>
                            </td>
                          
                            <td className="py-4 px-4 text-[var(--color-paragraph)] opacity-80 w-1/6 min-w-[100px]">{appliedDate}</td>
                           
                            <td className="py-4 px-4 w-1/6 min-w-[100px]">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusObj.className}`}>
                                {statusObj.label}
                              </span>
                            </td>
                        
                            <td className="py-4 pl-4 text-right w-1/3 min-w-[200px] whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleViewApplication(app)}
                                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-70 hover:opacity-100"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="View Details"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'reviewed')}
                                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-yellow-500/20 bg-yellow-500/5 text-yellow-600 hover:bg-yellow-500/10"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="Move to Under Review"
                                >
                                  <SendIcon fontSize="small" style={{ transform: 'rotate(-45deg)' }} />
                                </button>
                                <button
                                  onClick={() => handleReferToHR(app._id)}
                                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-purple-500/20 bg-purple-500/5 text-purple-600 hover:bg-purple-500/10"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="Refer to HR (Triggers Mail)"
                                >
                                  <SendIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="Approve Profile"
                                >
                                  <CheckIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="Reject Application"
                                >
                                  <CloseIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleDeleteApplication(app._id)}
                                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="Delete Application"
                                >
                                  <DeleteIcon fontSize="small" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {totalAppPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border)]">
                      <button
                        disabled={currentAppPage === 1}
                        onClick={() => setAppPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] text-xs rounded-[var(--radius-sm)] transition-all cursor-pointer font-semibold"
                      >
                        Previous
                      </button>
                      <span className="text-xs text-[var(--color-paragraph)] opacity-60">
                        Page {currentAppPage} of {totalAppPages}
                      </span>
                      <button
                        disabled={currentAppPage === totalAppPages}
                        onClick={() => setAppPage(p => Math.min(totalAppPages, p + 1))}
                        className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] text-xs rounded-[var(--radius-sm)] transition-all cursor-pointer font-semibold"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            
            <div id="active-job-listings-section" className="card p-5 shadow-card relative overflow-hidden scroll-mt-24">
              <div className="mb-5">
                <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: 0 }}>Active Job Listings</h2>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : jobs.length === 0 ? (
                <div className="py-12 text-center text-[var(--color-paragraph)] opacity-50 border border-[var(--color-border)] bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]">
                  No active job listings found. Click "Create New Job" to list one.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-[var(--color-paragraph)] opacity-50 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pr-4 font-semibold">Job Title</th>
                        <th className="pb-3 px-4 font-semibold">Department</th>
                        <th className="pb-3 px-4 font-semibold">Location</th>
                        <th className="pb-3 px-4 font-semibold">Applications</th>
                        <th className="pb-3 px-4 font-semibold">Status</th>
                        <th className="pb-3 pl-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-sm">
                      {jobs.map((job) => {
                        const appCountForJob = applications.filter(app => app.appliedPosition.toLowerCase().trim() === job.title.toLowerCase().trim()).length;
                        return (
                          <tr key={job._id} className="hover:bg-[var(--color-sub-bg)]/40 transition-colors">
                            <td className="py-4 pr-4 font-bold text-[var(--color-black)]">{job.title}</td>
                            <td className="py-4 px-4 text-[var(--color-paragraph)] opacity-80">{job.department}</td>
                            <td className="py-4 px-4 text-[var(--color-paragraph)] opacity-70">{job.location}</td>
                            <td className="py-4 px-4 font-semibold text-[var(--color-primary)]">{appCountForJob}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                job.status === 'Closed' ? 'bg-gray-100 text-gray-500 border border-gray-200' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              }`}>
                                {job.status || 'Active'}
                              </span>
                            </td>
                            <td className="py-4 pl-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditModal(job)}
                                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-70 hover:opacity-100"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="Edit Job"
                                >
                                  <EditIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleDeleteJob(job._id)}
                                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="Delete Job"
                                >
                                  <DeleteIcon fontSize="small" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

     
          <div className="lg:col-span-4 flex flex-col gap-8">
            
         
            <div className="card p-5 shadow-card relative overflow-hidden">
              <div className="flex justify-between items-center mb-5">
                <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: 0 }} className="flex items-center gap-2">
                  <NotificationsIcon className="text-[var(--color-primary)]" /> Notifications
                </h2>
                <button
                  onClick={() => {
                    setClearedNotificationsTime(new Date());
                    toast.success("All notifications marked as read");
                  }}
                  className="text-xs text-[var(--color-primary)] hover:underline transition-colors border-none bg-transparent cursor-pointer font-semibold"
                >
                  Mark all as read
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {recentNotifications.length === 0 ? (
                  <div className="py-8 text-center text-[var(--color-paragraph)] opacity-50 text-sm border border-dashed border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-sub-bg)]/20">
                    No new notifications
                  </div>
                ) : (
                  recentNotifications.map((notif, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[var(--color-sub-bg)]/50 border border-[var(--color-border)] rounded-[var(--radius-sm)] hover:border-[var(--color-primary)]/20 transition-colors">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.color}`}></span>
                      <div className="min-w-0">
                        <p className="text-sm text-[var(--color-paragraph)] leading-snug">{notif.text}</p>
                        <span className="text-[10px] text-[var(--color-paragraph)] opacity-60 block mt-1">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

       
            <div className="card p-5 shadow-card relative overflow-hidden">
              <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '0 0 20px 0' }}>Applications Overview</h2>
              
              <div className="flex flex-col items-center gap-6">
              
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-border)" strokeWidth="12" />
                 
                    {donutSegments.map((segment, idx) => {
                      return (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke={segment.color}
                          strokeWidth="12"
                          strokeDasharray={circumference}
                          strokeDashoffset={segment.strokeOffset}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-[var(--color-black)]">{applications.length}</span>
                    <span className="text-[10px] text-[var(--color-paragraph)] opacity-50 uppercase tracking-widest">Total</span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-[var(--color-paragraph)] opacity-80">New</span>
                    </div>
                    <span className="font-semibold text-[var(--color-black)]">{appCounts.pending} ({statusPercentages.pending}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      <span className="text-[var(--color-paragraph)] opacity-80">Under Review</span>
                    </div>
                    <span className="font-semibold text-[var(--color-black)]">{appCounts.reviewed} ({statusPercentages.reviewed}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                      <span className="text-[var(--color-paragraph)] opacity-80">Referred to HR</span>
                    </div>
                    <span className="font-semibold text-[var(--color-black)]">{appCounts.referred} ({statusPercentages.referred}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-[var(--color-paragraph)] opacity-80">Approved</span>
                    </div>
                    <span className="font-semibold text-[var(--color-black)]">{appCounts.accepted} ({statusPercentages.accepted}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span className="text-[var(--color-paragraph)] opacity-80">Rejected</span>
                    </div>
                    <span className="font-semibold text-[var(--color-black)]">{appCounts.rejected} ({statusPercentages.rejected}%)</span>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </motion.div>

      <Dialog
        open={openJobModal}
        onClose={() => setOpenJobModal(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            background: "var(--color-main-bg) !important",
            color: "var(--color-paragraph) !important",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            p: { xs: 1.5, sm: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontStyle: "normal", fontWeight: 700, fontSize: "1.3rem", pb: 2, borderBottom: "1px solid var(--color-border)", color: "var(--color-black)" }}>
          {isEditing ? "Edit Job Listing" : "Create New Job Listing"}
        </DialogTitle>
        <form onSubmit={handleSubmitJob}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3.5, mt: 2 }}>
            <TextField
              label="Job Title"
              name="title"
              value={jobForm.title}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="e.g. Frontend Developer"
              variant="outlined"
              slotProps={{
                inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "var(--color-paragraph)",
                  backgroundColor: "var(--color-sub-bg)",
                  borderRadius: "var(--radius-sm)",
                  "& fieldset": { borderColor: "var(--color-border)" },
                  "&:hover fieldset": { borderColor: "var(--color-primary)" },
                  "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                }
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Department"
                name="department"
                value={jobForm.department}
                onChange={handleInputChange}
                required
                placeholder="e.g. Development, Design"
                variant="outlined"
                slotProps={{
                  inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-paragraph)",
                    backgroundColor: "var(--color-sub-bg)",
                    borderRadius: "var(--radius-sm)",
                    "& fieldset": { borderColor: "var(--color-border)" },
                    "&:hover fieldset": { borderColor: "var(--color-primary)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                  }
                }}
              />

              <TextField
                label="Location"
                name="location"
                value={jobForm.location}
                onChange={handleInputChange}
                required
                placeholder="e.g. Kochi, India or Remote"
                variant="outlined"
                slotProps={{
                  inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-paragraph)",
                    backgroundColor: "var(--color-sub-bg)",
                    borderRadius: "var(--radius-sm)",
                    "& fieldset": { borderColor: "var(--color-border)" },
                    "&:hover fieldset": { borderColor: "var(--color-primary)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                select
                label="Job Type"
                name="jobType"
                value={jobForm.jobType}
                onChange={handleInputChange}
                required
                variant="outlined"
                slotProps={{
                  inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-paragraph)",
                    backgroundColor: "var(--color-sub-bg)",
                    borderRadius: "var(--radius-sm)",
                    "& fieldset": { borderColor: "var(--color-border)" },
                    "&:hover fieldset": { borderColor: "var(--color-primary)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                  },
                  "& .MuiSvgIcon-root": { color: "var(--color-paragraph)" }
                }}
              >
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
              </TextField>

              <TextField
                select
                label="Listing Status"
                name="status"
                value={jobForm.status}
                onChange={handleInputChange}
                required
                variant="outlined"
                slotProps={{
                  inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-paragraph)",
                    backgroundColor: "var(--color-sub-bg)",
                    borderRadius: "var(--radius-sm)",
                    "& fieldset": { borderColor: "var(--color-border)" },
                    "&:hover fieldset": { borderColor: "var(--color-primary)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                  },
                  "& .MuiSvgIcon-root": { color: "var(--color-paragraph)" }
                }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </TextField>
            </div>

            <TextField
              label="Job Description"
              name="description"
              value={jobForm.description}
              onChange={handleInputChange}
              required
              fullWidth
              multiline
              rows={4}
              placeholder="Describe the job description, specifications and requirements..."
              variant="outlined"
              slotProps={{
                inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "var(--color-paragraph)",
                  backgroundColor: "var(--color-sub-bg)",
                  borderRadius: "var(--radius-sm)",
                  "& fieldset": { borderColor: "var(--color-border)" },
                  "&:hover fieldset": { borderColor: "var(--color-primary)" },
                  "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                }
              }}
            />
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 2, pt: 3, borderTop: "1px solid var(--color-border)" }}>
            <Button
              onClick={() => setOpenJobModal(false)}
              sx={{ color: "var(--color-paragraph)", opacity: 0.6, "&:hover": { opacity: 1 }, textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "var(--color-primary)",
                color: "#fff",
                px: 4,
                py: 1.2,
                borderRadius: "var(--radius-sm)",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { background: "var(--color-primary)", opacity: 0.9 },
                boxShadow: "none"
              }}
            >
              {isEditing ? "Save Changes" : "Create Job"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

     
      <Dialog
        open={openAppModal}
        onClose={() => setOpenAppModal(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            background: "var(--color-main-bg) !important",
            color: "var(--color-paragraph) !important",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            p: { xs: 1.5, sm: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontStyle: "normal", fontWeight: 700, fontSize: "1.3rem", pb: 2, borderBottom: "1px solid var(--color-border)", color: "var(--color-black)" }}>
          Application Profile
        </DialogTitle>
        <DialogContent sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          {selectedApp && (
            <>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-600 flex items-center justify-center font-bold text-2xl border border-blue-500/20">
                  {selectedApp.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-black)]">{selectedApp.fullName}</h2>
                  <p className="text-sm text-[var(--color-primary)] mt-1 font-semibold">{selectedApp.appliedPosition}</p>
                </div>
              </div>

              <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-[var(--color-paragraph)] opacity-60 block">Email Address</span>
                    <span className="text-sm text-[var(--color-black)] font-medium break-all">{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-paragraph)] opacity-60 block">Mobile Number</span>
                    <span className="text-sm text-[var(--color-black)] font-medium">{selectedApp.mobile}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-xs text-[var(--color-paragraph)] opacity-60 block">Applied Date</span>
                    <span className="text-sm text-[var(--color-black)] font-medium">
                      {new Date(selectedApp.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-paragraph)] opacity-60 block">Current Status</span>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusDetails(selectedApp.status).className}`}>
                      {getStatusDetails(selectedApp.status).label}
                    </span>
                  </div>
                </div>

                {selectedApp.roleDescription && (
                  <div className="mt-2">
                    <span className="text-xs text-[var(--color-paragraph)] opacity-60 block mb-1">Role Description</span>
                    <div className="p-3 bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-[var(--color-paragraph)] leading-relaxed max-h-36 overflow-y-auto">
                      {selectedApp.roleDescription}
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  <span className="text-xs text-[var(--color-paragraph)] opacity-60 block mb-2">Resume / CV Document</span>
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-600 rounded-[var(--radius-sm)] transition-all font-semibold text-sm cursor-pointer no-underline"
                  >
                    <PictureAsPdfIcon />
                    <span className="truncate">View Submitted Resume</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2.5, sm: 2 },
          pt: 3,
          borderTop: "1px solid var(--color-border)",
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: { xs: 1.5, sm: 1 },
          alignItems: "stretch",
          "& .MuiButton-root": {
            width: { xs: "100%", sm: "auto" },
            margin: "0 !important"
          }
        }}>
          {selectedApp && selectedApp.status === 'pending' && (
            <>
              <Button
                onClick={() => { handleUpdateStatus(selectedApp._id, 'rejected'); setOpenAppModal(false); }}
                sx={{ color: "rgba(239, 68, 68, 0.8)", "&:hover": { color: "#ef4444" }, textTransform: "none", fontWeight: 700 }}
              >
                Reject Application
              </Button>
              
              <Button
                onClick={() => { handleReferToHR(selectedApp._id); setOpenAppModal(false); }}
                variant="outlined"
                sx={{
                  color: "var(--color-primary)",
                  borderColor: "var(--color-border)",
                  px: 3,
                  py: 1,
                  borderRadius: "var(--radius-sm)",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { borderColor: "var(--color-primary)", background: "var(--color-sub-bg)" }
                }}
              >
                Refer to HR
              </Button>

              <Button
                onClick={() => { handleUpdateStatus(selectedApp._id, 'accepted'); setOpenAppModal(false); }}
                variant="contained"
                sx={{
                  background: "#10B981",
                  color: "#fff",
                  px: 4,
                  py: 1,
                  borderRadius: "var(--radius-sm)",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { background: "#059669" }
                }}
              >
                Accept Application
              </Button>
            </>
          )}
          <Button
            onClick={() => setOpenAppModal(false)}
            sx={{ color: "var(--color-paragraph)", opacity: 0.6, "&:hover": { opacity: 1 }, textTransform: "none", fontWeight: 600, ml: "auto" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

     
      <Dialog
        open={openTalentModal}
        onClose={() => setOpenTalentModal(false)}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            background: "var(--color-main-bg) !important",
            color: "var(--color-paragraph) !important",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            p: { xs: 1.5, sm: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontStyle: "normal", fontWeight: 700, fontSize: "1.3rem", pb: 2, borderBottom: "1px solid var(--color-border)", color: "var(--color-black)" }}>
          Talent Network Submissions
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {loadingTalent ? (
            <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : talentSubmissions.length === 0 ? (
            <div className="py-12 text-center text-[var(--color-paragraph)] opacity-50 border border-[var(--color-border)] bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]">
              No resumes submitted to the Talent Network yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-paragraph)] opacity-50 text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-3 pr-4 font-semibold">Candidate</th>
                    <th className="pb-3 px-4 font-semibold">Mobile</th>
                    <th className="pb-3 px-4 font-semibold">Category</th>
                    <th className="pb-3 px-4 font-semibold">Submitted On</th>
                    <th className="pb-3 pl-4 font-semibold text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] text-sm">
                  {paginatedTalent.map((sub) => {
                    const initials = sub.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    const submittedDate = new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    
                    return (
                      <tr key={sub._id} className="hover:bg-[var(--color-sub-bg)]/40 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-600/30 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[var(--color-black)] truncate">{sub.fullName}</p>
                              <p className="text-xs text-[var(--color-paragraph)] opacity-60 truncate mt-0.5">{sub.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-[var(--color-paragraph)] opacity-80">{sub.mobile}</td>
                        <td className="py-4 px-4 text-[var(--color-paragraph)] opacity-80 font-medium">{sub.category}</td>
                        <td className="py-4 px-4 text-[var(--color-paragraph)] opacity-70">{submittedDate}</td>
                        <td className="py-4 pl-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={sub.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-600 rounded-[var(--radius-sm)] transition-all font-semibold text-xs inline-flex items-center gap-1 cursor-pointer no-underline"
                            >
                              <PictureAsPdfIcon style={{ fontSize: 13 }} /> View Resume
                            </a>
                            <button
                              onClick={() => handleDeleteTalent(sub._id)}
                              className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                              style={{ borderRadius: 'var(--radius-sm)' }}
                              title="Delete Talent Submission"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {totalTalentPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border)]">
                  <button
                    disabled={currentTalentPage === 1}
                    onClick={() => setTalentPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] text-xs rounded-[var(--radius-sm)] transition-all cursor-pointer font-semibold"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-[var(--color-paragraph)] opacity-60">
                    Page {currentTalentPage} of {totalTalentPages}
                  </span>
                  <button
                    disabled={currentTalentPage === totalTalentPages}
                    onClick={() => setTalentPage(p => Math.min(totalTalentPages, p + 1))}
                    className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] text-xs rounded-[var(--radius-sm)] transition-all cursor-pointer font-semibold"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 3, borderTop: "1px solid var(--color-border)" }}>
          <Button
            onClick={() => setOpenTalentModal(false)}
            sx={{ color: "var(--color-paragraph)", opacity: 0.6, "&:hover": { opacity: 1 }, textTransform: "none", fontWeight: 600, ml: "auto" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CareerAdmin;
