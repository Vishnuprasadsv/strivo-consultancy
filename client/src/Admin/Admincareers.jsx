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
  getTalentSubmissionsAPI
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

//  filter
  const filteredApplications = applications.filter(app => {
    if (activeFilter === 'pending') {
      return app.status === 'pending';
    }
    return true; // show all
  });


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


    list.sort((a, b) => b.time - a.time);

   
    return list.slice(0, 5).map(item => {
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
    <div className="min-h-screen pt-24 px-4 sm:px-8 relative z-10 md:ml-64 text-white">
   
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pb-12"
      >
  
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Career Admin Dashboard</h1>
            <p className="text-white/50 text-sm">Manage careers, applications and talent submissions</p>
          </div>
        </div>

  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
          <div
            onClick={() => {
              const element = document.getElementById('active-job-listings-section');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl backdrop-blur-xl hover:border-blue-500/30 transition-all duration-300 cursor-pointer group"
          >
            <div className="p-4 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-xl group-hover:bg-blue-600/20 transition-all">
              <WorkIcon />
            </div>
            <div>
              <h3 className="text-white/50 text-sm font-medium">Total Jobs</h3>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalJobs || jobs.length}</p>
              <p className="text-xs text-blue-400 font-semibold mt-1">Click to View Listing &rarr;</p>
            </div>
          </div>

   
          <div
            onClick={() => {
              setActiveFilter('all');
              toast.info("Showing all applications.");
            }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl backdrop-blur-xl hover:border-purple-500/30 transition-all duration-300 cursor-pointer group"
          >
            <div className="p-4 bg-purple-600/10 text-purple-400 border border-purple-600/20 rounded-xl group-hover:bg-purple-600/20 transition-all">
              <DescriptionIcon />
            </div>
            <div>
              <h3 className="text-white/50 text-sm font-medium">Applications</h3>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalApplications || applications.length}</p>
              <p className="text-xs text-purple-400 font-semibold mt-1">Show All Entries </p>
            </div>
          </div>

          


          <div
            onClick={handleOpenTalentModal}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group"
          >
            <div className="p-4 bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 rounded-xl group-hover:bg-emerald-600/20 transition-all">
              <PeopleIcon />
            </div>
            <div>
              <h3 className="text-white/50 text-sm font-medium">Talent Submissions</h3>
              <p className="text-3xl font-bold text-white mt-1">{stats.talentSubmissions || 56}</p>
              <p className="text-xs text-emerald-400 font-semibold mt-1">View Talent Network </p>
            </div>
          </div>

        
          <div
            onClick={() => {
              setActiveFilter('pending');
              toast.info("Filtering table: Pending actions only.");
            }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-xl backdrop-blur-xl hover:border-amber-500/30 transition-all duration-300 cursor-pointer group"
          >
            <div className="p-4 bg-amber-600/10 text-amber-400 border border-amber-600/20 rounded-xl group-hover:bg-amber-600/20 transition-all">
              <ErrorIcon />
            </div>
            <div>
              <h3 className="text-white/50 text-sm font-medium">Pending Actions</h3>
              <p className="text-3xl font-bold text-white mt-1">{stats.pendingActions || appCounts.pending}</p>
              <p className="text-xs text-amber-400 font-semibold mt-1">Filter Pending &rarr;</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          
          <div className="lg:col-span-8 flex flex-col gap-8">
            
           
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">Recent Applications</h2>
                  {activeFilter === 'pending' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xxs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                      Pending Only
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {activeFilter !== 'all' && (
                    <button
                      onClick={() => setActiveFilter('all')}
                      className="px-3 py-1.5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Clear Filter
                    </button>
                  )}
                  <button onClick={fetchData} className="px-4 py-1.5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                    Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : filteredApplications.length === 0 ? (
                <div className="py-12 text-center text-white/40 border border-white/5 bg-black/20 rounded-2xl">
                  {activeFilter === 'pending' ? 'No pending applications left!' : 'No applications received yet.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pr-4 font-semibold w-1/3 min-w-[200px]">Candidate & Position</th>
                        <th className="pb-3 px-4 font-semibold w-1/6 min-w-[100px]">Applied On</th>
                        <th className="pb-3 px-4 font-semibold w-1/6 min-w-[100px]">Status</th>
                        <th className="pb-3 pl-4 font-semibold text-right w-1/3 min-w-[200px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {filteredApplications.map((app) => {
                        const statusObj = getStatusDetails(app.status);
                        const appliedDate = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        
                        return (
                          <tr key={app._id} className="hover:bg-white/2.5 transition-colors">
                           
                            <td className="py-4 pr-4 w-1/3 min-w-[200px]">
                              <div className="flex items-center gap-3">
                                <div className="min-w-0">
                                  <p className="font-bold text-white truncate">{app.fullName}</p>
                                  <p className="text-xs text-blue-400 font-medium truncate mt-0.5">{app.appliedPosition}</p>
                                  <p className="text-xs text-white/50 truncate mt-0.5">{app.email}</p>
                                
                                  <a
                                    href={app.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1 mt-1 font-medium cursor-pointer"
                                  >
                                    <PictureAsPdfIcon style={{ fontSize: 13 }} /> View Resume
                                  </a>
                                </div>
                              </div>
                            </td>
                         
                            <td className="py-4 px-4 text-white/60 w-1/6 min-w-[100px]">{appliedDate}</td>
                           
                            <td className="py-4 px-4 w-1/6 min-w-[100px]">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusObj.className}`}>
                                {statusObj.label}
                              </span>
                            </td>
                        
                            <td className="py-4 pl-4 text-right w-1/3 min-w-[200px] whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleViewApplication(app)}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/5"
                                  title="View Details"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'reviewed')}
                                  className="w-8 h-8 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 flex items-center justify-center transition-colors cursor-pointer border border-yellow-500/10"
                                  title="Move to Under Review"
                                >
                                  <SendIcon fontSize="small" style={{ transform: 'rotate(-45deg)' }} />
                                </button>
                                <button
                                  onClick={() => handleReferToHR(app._id)}
                                  className="w-8 h-8 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 flex items-center justify-center transition-colors cursor-pointer border border-purple-500/10"
                                  title="Refer to HR (Triggers Mail)"
                                >
                                  <SendIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                  className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-colors cursor-pointer border border-emerald-500/10"
                                  title="Approve Profile"
                                >
                                  <CheckIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer border border-red-500/10"
                                  title="Reject Application"
                                >
                                  <CloseIcon fontSize="small" />
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

            
            <div id="active-job-listings-section" className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl scroll-mt-24">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-white">Active Job Listings</h2>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer border-none"
                >
                  <AddIcon fontSize="small" /> Create New Job
                </button>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : jobs.length === 0 ? (
                <div className="py-12 text-center text-white/40 border border-white/5 bg-black/20 rounded-2xl">
                  No active job listings found. Click "Create New Job" to list one.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pr-4 font-semibold">Job Title</th>
                        <th className="pb-3 px-4 font-semibold">Department</th>
                        <th className="pb-3 px-4 font-semibold">Location</th>
                        <th className="pb-3 px-4 font-semibold">Applications</th>
                        <th className="pb-3 px-4 font-semibold">Status</th>
                        <th className="pb-3 pl-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {jobs.map((job) => {
                        const appCountForJob = applications.filter(app => app.appliedPosition.toLowerCase().trim() === job.title.toLowerCase().trim()).length;
                        return (
                          <tr key={job._id} className="hover:bg-white/2.5 transition-colors">
                            <td className="py-4 pr-4 font-bold text-white">{job.title}</td>
                            <td className="py-4 px-4 text-white/70">{job.department}</td>
                            <td className="py-4 px-4 text-white/60">{job.location}</td>
                            <td className="py-4 px-4 font-semibold text-blue-400">{appCountForJob}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                job.status === 'Closed' ? 'bg-white/10 text-white/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {job.status || 'Active'}
                              </span>
                            </td>
                            <td className="py-4 pl-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditModal(job)}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/5"
                                  title="Edit Job"
                                >
                                  <EditIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleDeleteJob(job._id)}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer border border-red-500/10"
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
            
         
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <NotificationsIcon className="text-blue-400" /> Notifications
                </h2>
                <button onClick={() => toast.success("All notifications marked as read")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors border-none bg-transparent cursor-pointer font-semibold">
                  Mark all as read
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {recentNotifications.map((notif, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/2.5 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.color}`}></span>
                    <div className="min-w-0">
                      <p className="text-sm text-white/80 leading-snug">{notif.text}</p>
                      <span className="text-xxs text-white/40 block mt-1">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

       
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <h2 className="text-lg font-bold text-white mb-6">Applications Overview</h2>
              
              <div className="flex flex-col items-center gap-6">
              
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                 
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
                    <span className="text-3xl font-extrabold text-white">{applications.length}</span>
                    <span className="text-xxs text-white/40 uppercase tracking-widest">Total</span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-white/60">New</span>
                    </div>
                    <span className="font-semibold text-white">{appCounts.pending} ({statusPercentages.pending}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      <span className="text-white/60">Under Review</span>
                    </div>
                    <span className="font-semibold text-white">{appCounts.reviewed} ({statusPercentages.reviewed}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                      <span className="text-white/60">Referred to HR</span>
                    </div>
                    <span className="font-semibold text-white">{appCounts.referred} ({statusPercentages.referred}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-white/60">Approved</span>
                    </div>
                    <span className="font-semibold text-white">{appCounts.accepted} ({statusPercentages.accepted}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span className="text-white/60">Rejected</span>
                    </div>
                    <span className="font-semibold text-white">{appCounts.rejected} ({statusPercentages.rejected}%)</span>
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
            background: "#000000 !important",
            color: "#ffffff !important",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: { xs: "20px", sm: "28px" },
            p: { xs: 1.5, sm: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontStyle: "normal", fontWeight: 800, fontSize: "1.5rem", pb: 2, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
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
                inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "14px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                  "&.Mui-focused fieldset": { borderColor: "#2563EB" }
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
                  inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: "14px",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "#2563EB" }
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
                  inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: "14px",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "#2563EB" }
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
                  inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: "14px",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "#2563EB" }
                  },
                  "& .MuiSvgIcon-root": { color: "#fff" }
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
                  inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: "14px",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "#2563EB" }
                  },
                  "& .MuiSvgIcon-root": { color: "#fff" }
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
                inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "14px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                  "&.Mui-focused fieldset": { borderColor: "#2563EB" }
                }
              }}
            />
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 2, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Button
              onClick={() => setOpenJobModal(false)}
              sx={{ color: "rgba(255,255,255,0.6)", textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #2563EB, #7C3AED)",
                color: "#fff",
                px: 4,
                py: 1.2,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
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
            background: "#000000 !important",
            color: "#ffffff !important",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: { xs: "20px", sm: "28px" },
            p: { xs: 1.5, sm: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontStyle: "normal", fontWeight: 800, fontSize: "1.5rem", pb: 2, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          Application Profile
        </DialogTitle>
        <DialogContent sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          {selectedApp && (
            <>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-2xl border border-blue-500/20">
                  {selectedApp.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedApp.fullName}</h2>
                  <p className="text-sm text-blue-400 mt-1 font-semibold">{selectedApp.appliedPosition}</p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-white/40 block">Email Address</span>
                    <span className="text-sm text-white/80 font-medium break-all">{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-white/40 block">Mobile Number</span>
                    <span className="text-sm text-white/80 font-medium">{selectedApp.mobile}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-xs text-white/40 block">Applied Date</span>
                    <span className="text-sm text-white/80 font-medium">
                      {new Date(selectedApp.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-white/40 block">Current Status</span>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusDetails(selectedApp.status).className}`}>
                      {getStatusDetails(selectedApp.status).label}
                    </span>
                  </div>
                </div>

                {selectedApp.roleDescription && (
                  <div className="mt-2">
                    <span className="text-xs text-white/40 block mb-1">Role Description</span>
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white/80 leading-relaxed max-h-36 overflow-y-auto">
                      {selectedApp.roleDescription}
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  <span className="text-xs text-white/40 block mb-2">Resume / CV Document</span>
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 rounded-xl transition-all font-semibold text-sm cursor-pointer no-underline"
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
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
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
                  color: "#a855f7",
                  borderColor: "rgba(168, 85, 247, 0.3)",
                  px: 3,
                  py: 1,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { borderColor: "#a855f7", background: "rgba(168, 85, 247, 0.1)" }
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
                  borderRadius: "10px",
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
            sx={{ color: "rgba(255,255,255,0.6)", textTransform: "none", fontWeight: 600, ml: "auto" }}
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
            background: "#000000 !important",
            color: "#ffffff !important",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: { xs: "20px", sm: "28px" },
            p: { xs: 1.5, sm: 3 }
          }
        }}
      >
        <DialogTitle sx={{ fontStyle: "normal", fontWeight: 800, fontSize: "1.5rem", pb: 2, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          Talent Network Submissions
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {loadingTalent ? (
            <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : talentSubmissions.length === 0 ? (
            <div className="py-12 text-center text-white/40 border border-white/5 bg-black/20 rounded-2xl">
              No resumes submitted to the Talent Network yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-3 pr-4 font-semibold">Candidate</th>
                    <th className="pb-3 px-4 font-semibold">Mobile</th>
                    <th className="pb-3 px-4 font-semibold">Category</th>
                    <th className="pb-3 px-4 font-semibold">Submitted On</th>
                    <th className="pb-3 pl-4 font-semibold text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {talentSubmissions.map((sub) => {
                    const initials = sub.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    const submittedDate = new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    
                    return (
                      <tr key={sub._id} className="hover:bg-white/2.5 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate">{sub.fullName}</p>
                              <p className="text-xs text-white/50 truncate mt-0.5">{sub.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white/80">{sub.mobile}</td>
                        <td className="py-4 px-4 text-white/70 font-medium">{sub.category}</td>
                        <td className="py-4 px-4 text-white/60">{submittedDate}</td>
                        <td className="py-4 pl-4 text-right">
                          <a
                            href={sub.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded-lg transition-all font-semibold text-xs inline-flex items-center gap-1 cursor-pointer no-underline"
                          >
                            <PictureAsPdfIcon style={{ fontSize: 13 }} /> View Resume
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Button
            onClick={() => setOpenTalentModal(false)}
            sx={{ color: "rgba(255,255,255,0.6)", textTransform: "none", fontWeight: 600, ml: "auto" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CareerAdmin;
