import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiSearch, FiRefreshCw, FiMoreVertical } from 'react-icons/fi';
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
  const navigate = useNavigate();




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
  const [notifPage, setNotifPage] = useState(1);
  const [clearedNotificationsTime, setClearedNotificationsTime] = useState(null);
  const [talentSearch, setTalentSearch] = useState('');

  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('applications');
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ date: "", time: "", type: "Technical Round", mode: "Online" });
  const [scheduleErrors, setScheduleErrors] = useState({});

  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      color: "var(--color-paragraph)",
      borderRadius: "var(--radius-sm)",
      "& fieldset": { borderColor: "var(--color-border)" },
      "&:hover fieldset": { borderColor: "var(--color-primary)" },
      "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
    },
    "& .MuiInputLabel-root": { color: "var(--color-paragraph)", opacity: 0.7 },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)", opacity: 1 },
  };
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
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleUpdate = () => fetchData(true);
    window.addEventListener('notificationUpdate', handleUpdate);
    window.addEventListener('appointmentsUpdated', handleUpdate);
    window.addEventListener('talentUpdated', handleUpdate);
    return () => {
      window.removeEventListener('notificationUpdate', handleUpdate);
      window.removeEventListener('appointmentsUpdated', handleUpdate);
      window.removeEventListener('talentUpdated', handleUpdate);
    };
  }, []);


  const syncApplicationStatusToInterview = (email, newAppStatus) => {
    const stored = localStorage.getItem('interviews');
    if (!stored) return;
    try {
      let interviews = JSON.parse(stored);
      let updated = false;
      interviews = interviews.map(item => {
        if (item.email === email) {
          let newInterviewStatus = item.status;
          if (newAppStatus === 'reviewed') {
            newInterviewStatus = 'In Progress';
          } else if (newAppStatus === 'rejected') {
            newInterviewStatus = 'Cancelled';
          } else if (newAppStatus === 'accepted') {
            newInterviewStatus = 'Completed';
          }
          if (item.status !== newInterviewStatus) {
            updated = true;
            return { ...item, status: newInterviewStatus };
          }
        }
        return item;
      });
      if (updated) {
        localStorage.setItem('interviews', JSON.stringify(interviews));
        window.dispatchEvent(new Event('interviewsUpdated'));
      }
    } catch (error) {
      console.error("Error syncing status to interview:", error);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    const previousApps = [...applications];
    const targetApp = applications.find(a => a._id === appId);
    const email = targetApp ? targetApp.email : null;




    setApplications(prev =>
      prev.map(app => (app._id === appId ? { ...app, status: newStatus } : app))
    );
    window.dispatchEvent(new Event('notificationUpdate'));

    try {
      const response = await updateApplicationStatusAPI(appId, newStatus);
      if (response.status === 200 && response.data?.success) {
        if (newStatus !== 'referred') {
          toast.success(`Application updated to: ${getStatusDetails(newStatus).label}`);
        }
        if (email) {
          syncApplicationStatusToInterview(email, newStatus);
        }





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







  const handleOpenScheduleModal = (app) => {
    setSchedulingApp(app);
    setScheduleForm({ date: "", time: "", type: "Technical Round", mode: "Online" });
    setScheduleErrors({});
    setOpenScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!scheduleForm.date) err.date = "Date is required";
    if (!scheduleForm.time) err.time = "Time is required";
    if (scheduleForm.date && scheduleForm.date < getTodayDateString()) {
      err.date = "Date cannot be in the past";
    }
    if (Object.keys(err).length > 0) {
      setScheduleErrors(err);
      return;
    }

    const formattedDate = new Date(`${scheduleForm.date}T${scheduleForm.time}`).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + " " + new Date(`${scheduleForm.date}T${scheduleForm.time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newInterview = {
      id: Date.now(),
      name: schedulingApp.fullName,
      email: schedulingApp.email,
      position: schedulingApp.appliedPosition,
      type: scheduleForm.type,
      mode: scheduleForm.mode,
      date: formattedDate,
      status: 'Scheduled'
    };

    const stored = localStorage.getItem('interviews');
    const initialInterviews = [
      { id: 1, name: "Arjun Menon", email: "arjun.menon@email.com", position: "Frontend Developer", type: "Technical Round", mode: "Online", date: "12 Jun 2026 10:00 AM", status: "Scheduled" },
      { id: 2, name: "Sneha Nair", email: "sneha.nair@email.com", position: "UI/UX Designer", type: "HR Round", mode: "Online", date: "12 Jun 2026 02:30 PM", status: "In Progress" },
      { id: 3, name: "Vishnu Prasad", email: "vishnu.prasad@email.com", position: "Backend Developer", type: "Technical Round", mode: "Offline", date: "13 Jun 2026 11:00 AM", status: "Scheduled" },
      { id: 4, name: "Aparna S", email: "aparna.s@email.com", position: "Product Manager", type: "Managerial Round", mode: "Offline", date: "14 Jun 2026 03:00 PM", status: "Completed" },
      { id: 5, name: "Rahul Ramesh", email: "rahul.ramesh@email.com", position: "DevOps Engineer", type: "HR Round", mode: "Online", date: "14 Jun 2026 04:30 PM", status: "Cancelled" }
    ];

    const currentInterviews = stored ? JSON.parse(stored) : initialInterviews;
    const updatedInterviews = [newInterview, ...currentInterviews];
    localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
    window.dispatchEvent(new Event('interviewsUpdated'));

    setOpenScheduleModal(false);
    await handleUpdateStatus(schedulingApp._id, 'referred');
    toast.success("Interview scheduled successfully and updated in Interviews tab!");
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

  const handleDeleteAllTalent = async () => {
    if (!window.confirm("WARNING: Are you sure you want to delete ALL talent submissions? This action cannot be undone.")) return;
    try {
      const promises = talentSubmissions.map(sub => deleteTalentSubmissionAPI(sub._id));
      await Promise.all(promises);
      toast.success("All talent submissions deleted successfully");
      setTalentPage(1);
      fetchData(true);
    } catch (error) {
      console.error("Error deleting all talent submissions:", error);
      toast.error("Failed to delete all talent submissions.");
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
        return { label: 'Interview Scheduled', className: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' };
      case 'accepted':
      case 'appointed':
        return { label: 'Appointed', className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' };
      case 'rejected':
        return { label: 'Rejected', className: 'bg-red-500/20 text-red-400 border border-red-500/30' };
      case 'reviewed':
        return { label: 'Under Review', className: 'bg-slate-100 text-slate-700 border border-slate-300/80' };
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
  const filteredTalentSubmissions = sortedTalentSubmissions.filter(sub => {
    if (!talentSearch.trim()) return true;
    const term = talentSearch.toLowerCase();
    return (
      (sub.fullName || '').toLowerCase().includes(term) ||
      (sub.email || '').toLowerCase().includes(term) ||
      (sub.category || '').toLowerCase().includes(term) ||
      (sub.mobile || '').includes(term)
    );
  });
  const talentPerPage = 5;
  const totalTalentPages = Math.ceil(filteredTalentSubmissions.length / talentPerPage) || 1;
  const currentTalentPage = Math.min(talentPage, totalTalentPages);
  const paginatedTalent = filteredTalentSubmissions.slice((currentTalentPage - 1) * talentPerPage, currentTalentPage * talentPerPage);


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

    return filteredList.slice(0, 30).map(item => {
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

  // Notifications Pagination
  const notifsPerPage = 3;
  const totalNotifPages = Math.ceil(recentNotifications.length / notifsPerPage) || 1;
  const currentNotifPage = Math.min(notifPage, totalNotifPages);
  const paginatedNotifications = recentNotifications.slice((currentNotifPage - 1) * notifsPerPage, currentNotifPage * notifsPerPage);

  return (
    <div className="min-h-screen bg-sub flex flex-col" style={{ fontFamily: 'var(--font-primary)' }}>
      
      {/* Top Header Section with bg-main spanning full-width */}
      <div className="bg-main pt-24 pb-6 border-b border-[var(--color-border)] px-8 md:px-16 lg:px-24">
        <div className="max-w-[98%] mx-auto">
          {/* Header Row - Styled exactly to match standard admin page titles */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 w-full">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
              <h1 className="text-2xl font-[var(--font-bold)] text-primary leading-none uppercase" style={{ margin: 0 }}>
                CAREER & JOBS ADMIN
              </h1>
              <p className="text-xs text-[var(--color-black)] font-medium opacity-85 mt-2" style={{ margin: '6px 0 0 0', lineHeight: 1.3 }}>
                Manage job listings, candidate profiles, and talent network
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
              {/* Notifications Bell Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    const nextShow = !showNotifDropdown;
                    setShowNotifDropdown(nextShow);
                    if (nextShow) {
                      setClearedNotificationsTime(new Date());
                      setNotifPage(1);
                    }
                  }}
                  className="bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white p-1.5 rounded-[var(--radius-sm)] flex items-center justify-center transition cursor-pointer h-8 w-8 relative shrink-0 shadow-sm"
                  title="Notifications"
                >
                  <NotificationsIcon style={{ fontSize: 16 }} />
                  {recentNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-extrabold rounded-full h-4 w-4 flex items-center justify-center">
                      {recentNotifications.length}
                    </span>
                  )}
                </button>
                
                <AnimatePresence>
                  {showNotifDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-[var(--color-border)] shadow-lg z-50 rounded-[var(--radius-sm)] overflow-hidden"
                        style={{ fontFamily: 'var(--font-primary)' }}
                      >
                        <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-sub-bg)]/20">
                          <span className="text-xs font-bold text-[var(--color-black)]">Recent Alerts</span>
                        </div>
                        <div className="flex flex-col max-h-80 overflow-y-auto divide-y divide-[var(--color-border)]">
                          {recentNotifications.length === 0 ? (
                            <div className="py-6 text-center text-[var(--color-paragraph)] opacity-60 text-xs">
                              No new notifications
                            </div>
                          ) : (
                            recentNotifications.map((notif, index) => (
                              <div key={index} className="flex items-start gap-2.5 p-3 hover:bg-[var(--color-sub-bg)]/30 transition-colors text-left">
                                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.color}`}></span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-[var(--color-paragraph)] leading-snug break-words" style={{ margin: 0 }}>
                                    {notif.text}
                                  </p>
                                  <span className="text-[9px] text-[var(--color-paragraph)] opacity-50 block mt-1">{notif.time}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Analytics button */}
              <button
                onClick={() => setShowAnalyticsModal(true)}
                className="bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:text-white hover:bg-[var(--color-primary)] px-2.5 py-1.5 rounded-[var(--radius-sm)] flex items-center justify-center gap-2 transition cursor-pointer h-8 text-xs font-normal w-full sm:w-auto"
              >
                <FiBarChart2 size={13} />
                Analytics
              </button>
              
              {/* Create New Job button */}
              <button
                id="create-new-job-btn"
                onClick={() => navigate('/admin/create-job')}
                className="btn px-2.5 py-1.5 flex items-center justify-center gap-2 cursor-pointer border-none h-8 text-xs font-normal w-full sm:w-auto"
                style={{ fontWeight: 'normal' }}
              >
                <AddIcon style={{ fontSize: 13 }} />
                Create New Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-10 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto flex flex-col gap-6"
        >

        {/* Tab Navigation Selector */}
        <div className="flex flex-wrap gap-2 p-1 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] mb-3 w-fit shadow-sm">
          <button
            onClick={() => {
              setActiveSubTab('applications');
              setAppPage(1);
            }}
            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-[var(--radius-sm)] cursor-pointer border-none ${
              activeSubTab === 'applications'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] bg-transparent'
            }`}
          >
            Applications
          </button>
          <button
            onClick={async () => {
              setActiveSubTab('talent');
              setTalentPage(1);
              setLoadingTalent(true);
              try {
                const res = await getTalentSubmissionsAPI();
                if (res.status === 200 && res.data?.success) {
                  setTalentSubmissions(res.data.data);
                }
              } catch (e) {
                toast.error("Failed to fetch talent submissions.");
              } finally {
                setLoadingTalent(false);
              }
            }}
            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-[var(--radius-sm)] cursor-pointer border-none ${
              activeSubTab === 'talent'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] bg-transparent'
            }`}
          >
            Talent Network
          </button>
          <button
            onClick={() => {
              setActiveSubTab('jobs');
            }}
            className={`px-4 py-1.5 text-xs font-bold transition-all rounded-[var(--radius-sm)] cursor-pointer border-none ${
              activeSubTab === 'jobs'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] bg-transparent'
            }`}
          >
            Job Listings
          </button>
        </div>

        <div className="w-full">


          <div className="w-full flex flex-col gap-6">


            {activeSubTab === 'applications' && (
              <div className="card bg-white p-5 shadow-card relative overflow-hidden border border-[var(--color-border)] rounded-[var(--radius-sm)]">
              <div className="flex flex-wrap justify-between items-center mb-5 gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-primary" style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', margin: 0 }}>Recent Applications</h2>
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
                  {/* Table view for desktop / tablet */}
                  <table className="w-full text-left border-collapse table-fixed hidden md:table">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-primary text-xs font-normal uppercase tracking-wider">
                        <th className="pb-3 px-6 font-normal w-[25%]" style={{ fontWeight: 'normal' }}>Candidate</th>
                        <th className="pb-3 px-6 font-normal w-[20%]" style={{ fontWeight: 'normal' }}>Position</th>
                        <th className="pb-3 px-6 font-normal w-[15%] text-center" style={{ fontWeight: 'normal' }}>Applied On</th>
                        <th className="pb-3 px-6 font-normal w-[20%] text-center" style={{ fontWeight: 'normal' }}>Status</th>
                        <th className="pb-3 px-6 font-normal text-center w-[20%]" style={{ fontWeight: 'normal' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-sm">
                      {paginatedApplications.map((app) => {
                        const statusObj = getStatusDetails(app.status);
                        const appliedDate = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                        return (
                          <tr key={app._id} className="hover:bg-[var(--color-sub-bg)]/40 transition-colors">

                            <td className="py-3 px-6 w-[25%] text-left">
                              <div className="flex items-center gap-2">
                                <div className="min-w-0">
                                  <p style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }} className="truncate">
                                    {app.fullName}
                                  </p>
                                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-paragraph)', opacity: 0.7, margin: '1px 0 0 0' }} className="truncate">
                                    {app.email}
                                  </p>

                                  <a
                                    href={app.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                                    style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)' }}
                                  >
                                    <PictureAsPdfIcon style={{ fontSize: 13 }} /> View Resume
                                  </a>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-6 text-[var(--color-black)] w-[20%] text-left text-xs font-semibold">{app.appliedPosition}</td>

                            <td className="py-3 px-6 text-[var(--color-black)] w-[15%] text-center text-xs">{appliedDate}</td>

                            <td className="py-3 px-6 w-[20%] text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${statusObj.className}`}>
                                {statusObj.label}
                              </span>
                            </td>

                            <td className="py-3 px-6 text-center w-[20%] whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleViewApplication(app)}
                                  className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-70 hover:opacity-100"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="View Details"
                                >
                                  <VisibilityIcon fontSize="small" style={{ fontSize: 16 }} />
                                </button>

                                <select
                                  value=""
                                  disabled={app.status === 'appointed'}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'reviewed') {
                                      handleUpdateStatus(app._id, 'reviewed');
                                    } else if (val === 'schedule') {
                                      handleOpenScheduleModal(app);
                                    } else if (val === 'rejected') {
                                      handleUpdateStatus(app._id, 'rejected');
                                    }
                                  }}
                                  className="bg-white text-black rounded-[var(--radius-sm)] px-2 py-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-7 cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <option value="" disabled hidden>Action</option>
                                  <option value="reviewed" disabled={app.status === 'reviewed'}>Move to Under Review</option>
                                  <option value="schedule" disabled={app.status === 'referred'}>Schedule Interview</option>
                                  <option value="rejected">Not Fit</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Card view for mobile screens (text and buttons aligned to center) */}
                  <div className="flex flex-col gap-4 md:hidden">
                    {paginatedApplications.map((app) => {
                      const statusObj = getStatusDetails(app.status);
                      const appliedDate = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                      return (
                        <div key={app._id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-5 bg-[var(--color-sub-bg)]/20 hover:bg-[var(--color-sub-bg)]/40 transition-colors flex flex-col items-center text-center gap-3">
                          <div>
                            <p style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }}>
                              {app.fullName}
                            </p>
                            <p style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-primary)', margin: '2px 0 0 0' }}>
                              {app.appliedPosition}
                            </p>
                            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-paragraph)', opacity: 0.8, margin: '2px 0 0 0' }}>
                              {app.email}
                            </p>
                            <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-1">
                              Applied: {appliedDate}
                            </p>
                          </div>

                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusObj.className}`}>
                              {statusObj.label}
                            </span>
                          </div>

                          <div className="flex items-center justify-center gap-1 mt-1">
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline inline-flex items-center gap-1 cursor-pointer bg-[var(--color-main-bg)] border border-[var(--color-border)] px-3 py-1.5 rounded-[var(--radius-sm)]"
                              style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)' }}
                            >
                              <PictureAsPdfIcon style={{ fontSize: 14 }} /> View Resume
                            </a>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
                            <button
                              onClick={() => handleViewApplication(app)}
                              className="w-10 h-10 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-70 hover:opacity-100"
                              style={{ borderRadius: 'var(--radius-sm)' }}
                              title="View Details"
                            >
                              <VisibilityIcon fontSize="small" />
                            </button>

                             <select
                              value=""
                              disabled={app.status === 'appointed'}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'reviewed') {
                                  handleUpdateStatus(app._id, 'reviewed');
                                } else if (val === 'schedule') {
                                  handleOpenScheduleModal(app);
                                } else if (val === 'rejected') {
                                  handleUpdateStatus(app._id, 'rejected');
                                }
                              }}
                              className="bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-10 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="" disabled hidden>Action</option>
                              <option value="reviewed" disabled={app.status === 'reviewed'}>Move to Under Review</option>
                              <option value="schedule" disabled={app.status === 'referred'}>Schedule Interview</option>
                              <option value="rejected">Not Fit</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalAppPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border)]">
                      <button
                        disabled={currentAppPage === 1}
                        onClick={() => setAppPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] text-xs rounded-[var(--radius-sm)] transition-all cursor-pointer font-semibold bg-transparent"
                      >
                        &lt;
                      </button>
                      <span className="text-xs text-[var(--color-paragraph)] opacity-60">
                        Page {currentAppPage} of {totalAppPages}
                      </span>
                      <button
                        disabled={currentAppPage === totalAppPages}
                        onClick={() => setAppPage(p => Math.min(totalAppPages, p + 1))}
                        className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] text-xs rounded-[var(--radius-sm)] transition-all cursor-pointer font-semibold bg-transparent"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Talent Network */}
          {activeSubTab === 'talent' && (
            <div className="card bg-white p-5 shadow-card relative overflow-hidden border border-[var(--color-border)] rounded-[var(--radius-sm)]">
              <div className="flex flex-wrap justify-between items-center mb-5 gap-4">
                <h2 className="text-primary" style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                  Talent Network Submissions
                </h2>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  {/* Search Input */}
                  <div className="flex items-center gap-2 bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-1.5 w-full sm:w-60">
                    <FiSearch className="text-[var(--color-paragraph)] opacity-60" size={14} />
                    <input
                      type="text"
                      value={talentSearch}
                      onChange={(e) => { setTalentSearch(e.target.value); setTalentPage(1); }}
                      placeholder="Search candidate or category..."
                      className="bg-transparent border-none outline-none text-xs text-[var(--color-black)] w-full placeholder-[var(--color-paragraph)]/60"
                      style={{ padding: 0, margin: 0, height: 'auto', lineHeight: 'normal' }}
                    />
                    {talentSearch && (
                      <button
                        type="button"
                        onClick={() => setTalentSearch('')}
                        className="bg-transparent border-none cursor-pointer p-0 text-[var(--color-paragraph)] hover:text-red-500 flex items-center justify-center shrink-0"
                      >
                        <CloseIcon style={{ fontSize: 14 }} />
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={async () => {
                      setLoadingTalent(true);
                      try {
                        const res = await getTalentSubmissionsAPI();
                        if (res.status === 200 && res.data?.success) {
                          setTalentSubmissions(res.data.data);
                          toast.success("Talent Network list reloaded");
                        }
                      } catch (e) {
                        toast.error("Failed to refresh talent network.");
                      } finally {
                        setLoadingTalent(false);
                      }
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--color-border)] bg-white text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition-all cursor-pointer shrink-0"
                    title="Refresh List"
                  >
                    <FiRefreshCw size={13} />
                  </button>

                  <button
                    onClick={handleDeleteAllTalent}
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--color-border)] bg-white text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition-all cursor-pointer shrink-0"
                    title="Delete All Submissions"
                  >
                    <DeleteIcon fontSize="small" style={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>

              {loadingTalent ? (
                <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : talentSubmissions.length === 0 ? (
                <div className="py-12 text-center text-[var(--color-paragraph)] opacity-50 border border-[var(--color-border)] bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]">
                  No resumes submitted to the Talent Network yet.
                </div>
              ) : (
                <>
                  {/* Desktop View Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[750px]">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] text-primary text-xs font-normal uppercase tracking-wider">
                          <th className="pb-3 px-6 font-normal" style={{ fontWeight: 'normal' }}>Candidate</th>
                          <th className="pb-3 px-6 font-normal" style={{ fontWeight: 'normal' }}>Mobile</th>
                          <th className="pb-3 px-6 font-normal" style={{ fontWeight: 'normal' }}>Category</th>
                          <th className="pb-3 px-6 font-normal" style={{ fontWeight: 'normal' }}>Submitted On</th>
                          <th className="pb-3 px-6 font-normal text-center" style={{ fontWeight: 'normal' }}>Resume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)] text-sm">
                        {paginatedTalent.map((sub) => {
                          const initials = sub.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                          const submittedDate = new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                          return (
                            <tr key={sub._id} className="hover:bg-[var(--color-sub-bg)]/40 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3 text-left">
                                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm shrink-0">
                                    {initials}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-[var(--color-black)] truncate" style={{ margin: 0 }}>{sub.fullName}</p>
                                    <p className="text-xs text-[var(--color-black)] opacity-60 truncate mt-0.5" style={{ margin: 0 }}>{sub.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-[var(--color-black)]">{sub.mobile}</td>
                              <td className="py-4 px-6 text-[var(--color-black)] font-medium">{sub.category}</td>
                              <td className="py-4 px-6 text-[var(--color-black)] opacity-85">{submittedDate}</td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <a
                                    href={sub.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-[var(--radius-sm)] transition-all font-semibold text-xs inline-flex items-center gap-1 cursor-pointer no-underline"
                                  >
                                    <PictureAsPdfIcon style={{ fontSize: 13 }} /> View Resume
                                  </a>
                                  <button
                                    onClick={() => handleDeleteTalent(sub._id)}
                                    className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-[var(--radius-sm)]"
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
                  </div>

                  {/* Mobile Card View */}
                  <div className="block md:hidden space-y-4">
                    {paginatedTalent.map((sub) => {
                      const initials = sub.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                      const submittedDate = new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                      return (
                        <div key={sub._id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-5 bg-white shadow-sm flex flex-col gap-3.5">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-[var(--color-black)] text-sm leading-snug break-words" style={{ margin: 0 }}>
                                {sub.fullName}
                              </h3>
                              <p className="text-xs text-[var(--color-black)] opacity-85 mt-0.5 truncate" style={{ margin: 0 }}>
                                {sub.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 text-xs text-left pt-2.5 border-t border-[var(--color-border)]/50">
                            <div className="flex justify-between items-center">
                              <span className="text-[var(--color-black)] opacity-80 font-medium">Mobile</span>
                              <span className="font-semibold text-[var(--color-black)]">{sub.mobile}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[var(--color-black)] opacity-80 font-medium">Category</span>
                              <span className="font-semibold text-[var(--color-primary)]">{sub.category}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2.5 border-t border-[var(--color-border)]/50 text-xs">
                            <span className="text-[var(--color-black)] opacity-60">
                              Submitted: {submittedDate}
                            </span>

                            <div className="flex items-center gap-2">
                              <a
                                href={sub.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-[var(--radius-sm)] transition-all font-semibold text-xs inline-flex items-center gap-1 cursor-pointer no-underline"
                              >
                                <PictureAsPdfIcon style={{ fontSize: 13 }} /> View Resume
                              </a>
                              <button
                                onClick={() => handleDeleteTalent(sub._id)}
                                className="px-2.5 py-1.5 flex items-center justify-center gap-1 transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-[var(--radius-sm)]"
                              >
                                <DeleteIcon style={{ fontSize: 13 }} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalTalentPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border)]">
                      <button
                        disabled={currentTalentPage === 1}
                        onClick={() => setTalentPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] text-xs rounded-[var(--radius-sm)] transition-all cursor-pointer font-semibold bg-transparent"
                      >
                        &lt;
                      </button>
                      <span className="text-xs text-[var(--color-paragraph)] opacity-60">
                        Page {currentTalentPage} of {totalTalentPages}
                      </span>
                      <button
                        disabled={currentTalentPage === totalTalentPages}
                        onClick={() => setTalentPage(p => Math.min(totalTalentPages, p + 1))}
                        className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] text-xs rounded-[var(--radius-sm)] transition-all cursor-pointer font-semibold bg-transparent"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}


            {activeSubTab === 'jobs' && (
              <div id="active-job-listings-section" className="card bg-white p-5 shadow-card relative overflow-hidden scroll-mt-24 border border-[var(--color-border)] rounded-[var(--radius-sm)]">
              <div className="flex justify-between items-center mb-5 gap-2">
                <h2 className="text-primary" style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', margin: 0 }}>Active Job Listings</h2>
                <button
                  onClick={() => navigate('/admin/create-job')}
                  className="btn px-2.5 py-1.5 flex items-center justify-center gap-1 cursor-pointer border-none h-8 text-xs font-normal"
                >
                  <AddIcon style={{ fontSize: 13 }} /> Create New Job
                </button>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : jobs.length === 0 ? (
                <div className="py-12 text-center text-[var(--color-paragraph)] opacity-50 border border-[var(--color-border)] bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]">
                  No active job listings found. Click "Create New Job" to list one.
                </div>
              ) : (
                <>
                  {/* Desktop View Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[750px]">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] text-primary text-xs font-normal uppercase tracking-wider">
                          <th className="pb-4 px-6 font-normal" style={{ fontWeight: 'normal' }}>Job Title</th>
                          <th className="pb-4 px-6 font-normal" style={{ fontWeight: 'normal' }}>Department</th>
                          <th className="pb-4 px-6 font-normal" style={{ fontWeight: 'normal' }}>Location</th>
                          <th className="pb-4 px-6 font-normal text-center" style={{ fontWeight: 'normal' }}>Apps</th>
                          <th className="pb-4 px-6 font-normal text-center" style={{ fontWeight: 'normal' }}>Status</th>
                          <th className="pb-4 px-6 font-normal text-center" style={{ fontWeight: 'normal' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)] text-sm">
                        {jobs.map((job) => {
                          const appCountForJob = applications.filter(app => app.appliedPosition.toLowerCase().trim() === job.title.toLowerCase().trim()).length;
                          return (
                            <tr key={job._id} className="hover:bg-[var(--color-sub-bg)]/40 transition-colors">
                              <td className="py-4 px-6 font-semibold text-[var(--color-black)] text-sm truncate">{job.title}</td>
                              <td className="py-4 px-6 text-[var(--color-black)] text-xs truncate">{job.department}</td>
                              <td className="py-4 px-6 text-[var(--color-black)] text-xs truncate">{job.location}</td>
                              <td className="py-4 px-6 font-semibold text-[var(--color-primary)] text-center text-xs">{appCountForJob}</td>
                              <td className="py-4 px-6 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${job.status === 'Closed' ? 'bg-gray-100 text-gray-500 border border-gray-200' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20'
                                  }`}>
                                  {job.status || 'Active'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => navigate(`/admin/edit-job/${job._id}`)}
                                    className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-70 hover:opacity-100"
                                    style={{ borderRadius: 'var(--radius-sm)' }}
                                    title="Edit Job"
                                  >
                                    <EditIcon fontSize="small" style={{ fontSize: 16 }} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJob(job._id)}
                                    className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
                                    style={{ borderRadius: 'var(--radius-sm)' }}
                                    title="Delete Job"
                                  >
                                    <DeleteIcon fontSize="small" style={{ fontSize: 16 }} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View Cards */}
                  <div className="block md:hidden space-y-4">
                    {jobs.map((job) => {
                      const appCountForJob = applications.filter(app => app.appliedPosition.toLowerCase().trim() === job.title.toLowerCase().trim()).length;
                      return (
                        <div key={job._id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-5 bg-white shadow-sm flex flex-col gap-3.5">
                          <div className="flex justify-between items-start gap-2 text-left">
                            <div>
                              <h3 className="font-bold text-[var(--color-black)] text-sm leading-snug break-words" style={{ margin: 0 }}>
                                {job.title}
                              </h3>
                              <p className="text-xs text-[var(--color-black)] opacity-85 mt-1" style={{ margin: 0 }}>
                                {job.department} • {job.location}
                              </p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${job.status === 'Closed' ? 'bg-gray-100 text-gray-500 border border-gray-200' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20'
                              }`}>
                              {job.status || 'Active'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2.5 border-t border-[var(--color-border)]/50 text-xs">
                            <span className="text-[var(--color-black)] opacity-85">
                              Applications: <span className="font-semibold text-[var(--color-primary)]">{appCountForJob}</span>
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/admin/edit-job/${job._id}`)}
                                className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-black)] text-xs font-semibold"
                                style={{ borderRadius: 'var(--radius-sm)' }}
                              >
                                <EditIcon style={{ fontSize: 13 }} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job._id)}
                                className="px-2.5 py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold rounded-[var(--radius-sm)]"
                              >
                                <DeleteIcon style={{ fontSize: 13 }} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
          </div>
        </div>
      </motion.div>
      </div>

      <Dialog
        open={openJobModal}
        onClose={() => setOpenJobModal(false)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        component="form"
        onSubmit={handleSubmitJob}
        sx={{
          "& .MuiDialog-paper": {
            background: "var(--color-main-bg) !important",
            color: "var(--color-paragraph) !important",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        <DialogTitle sx={{ fontStyle: "normal", fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-card-heading)', px: 3, pt: 3, pb: 2, borderBottom: "1px solid var(--color-border)", color: "var(--color-black)" }}>
          {isEditing ? "Edit Job Listing" : "Create New Job Listing"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3.5, px: 3, py: 2.5 }}>
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

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 2, borderTop: "1px solid var(--color-border)" }}>
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
      </Dialog>


      <Dialog
        open={openAppModal}
        onClose={() => setOpenAppModal(false)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        sx={{
          "& .MuiDialog-paper": {
            background: "var(--color-main-bg) !important",
            color: "var(--color-paragraph) !important",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        <DialogTitle sx={{ fontStyle: "normal", fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-card-heading)', px: 3, pt: 3, pb: 2, borderBottom: "1px solid var(--color-border)", color: "var(--color-black)" }}>
          Application Profile
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 3 }}>
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
                onClick={() => { handleOpenScheduleModal(selectedApp); setOpenAppModal(false); }}
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
                Schedule Interview
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

      {showAnalyticsModal &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-4xl border border-[var(--color-border)] bg-white shadow-xl overflow-hidden my-8" style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-primary)' }}>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 bg-white">
                <div>
                  <h2 className="text-lg font-bold text-primary" style={{ margin: 0 }}>
                    RECRUITMENT & APPLICATION ANALYTICS
                  </h2>
                  <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-1">
                    Real-time status overview of jobs, applications, and talent network
                  </p>
                </div>
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="w-8 h-8 rounded-full bg-[var(--color-white)] hover:bg-[var(--color-sub-bg)] transition flex items-center justify-center text-[var(--color-paragraph)] cursor-pointer text-xs border border-[var(--color-border)] shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 bg-[var(--color-sub-bg)]/35">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Donut Chart / Overview */}
                  <div className="card p-5 bg-white shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] flex flex-col items-center justify-center text-center">
                    <h3 className="text-xs font-bold text-[var(--color-black)] uppercase tracking-wider mb-4" style={{ margin: 0 }}>
                      Applications Overview
                    </h3>

                    <div className="relative w-36 h-36 mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-border)" strokeWidth="10" />
                        {donutSegments.map((segment, idx) => (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke={segment.color}
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={segment.strokeOffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                          />
                        ))}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold text-[var(--color-black)]">{applications.length}</span>
                        <span className="text-[9px] text-[var(--color-paragraph)] opacity-50 uppercase tracking-widest">Total</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs w-full max-w-[280px]">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          <span className="text-[var(--color-paragraph)] opacity-85">New</span>
                        </div>
                        <span className="font-semibold text-[var(--color-black)]">{appCounts.pending}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                          <span className="text-[var(--color-paragraph)] opacity-85">Review</span>
                        </div>
                        <span className="font-semibold text-[var(--color-black)]">{appCounts.reviewed}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                          <span className="text-[var(--color-paragraph)] opacity-85">Referred</span>
                        </div>
                        <span className="font-semibold text-[var(--color-black)]">{appCounts.referred}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          <span className="text-[var(--color-paragraph)] opacity-85">Approved</span>
                        </div>
                        <span className="font-semibold text-[var(--color-black)]">{appCounts.accepted}</span>
                      </div>
                      <div className="flex justify-between items-center col-span-2 mt-1 pt-1 border-t border-[var(--color-border)]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                          <span className="text-[var(--color-paragraph)] opacity-85">Rejected</span>
                        </div>
                        <span className="font-semibold text-[var(--color-black)]">{appCounts.rejected}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Recruitment Metrics */}
                  <div className="flex flex-col gap-4">
                    <div className="card p-4 bg-white shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] flex justify-between items-center">
                      <div className="text-left">
                        <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 font-semibold uppercase tracking-wider mb-0.5" style={{ margin: 0 }}>Total Active Jobs</p>
                        <p className="text-xl font-extrabold text-[var(--color-black)]" style={{ margin: 0, lineHeight: 1 }}>{stats.totalJobs || jobs.length}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowAnalyticsModal(false);
                          setActiveSubTab('jobs');
                          const element = document.getElementById('active-job-listings-section');
                          if (element) {
                            setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 150);
                          }
                        }}
                        className="text-xs font-bold text-[var(--color-primary)] hover:underline bg-transparent border-none cursor-pointer p-0 transition-colors"
                      >
                        View Listings
                      </button>
                    </div>

                    <div className="card p-4 bg-white shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] flex justify-between items-center">
                      <div className="text-left">
                        <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 font-semibold uppercase tracking-wider mb-0.5" style={{ margin: 0 }}>Total Applications</p>
                        <p className="text-xl font-extrabold text-[var(--color-black)]" style={{ margin: 0, lineHeight: 1 }}>{stats.totalApplications || applications.length}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowAnalyticsModal(false);
                          setActiveSubTab('applications');
                          setActiveFilter('all');
                          toast.info("Showing all applications.");
                        }}
                        className="text-xs font-bold text-[var(--color-primary)] hover:underline bg-transparent border-none cursor-pointer p-0 transition-colors"
                      >
                        Show All
                      </button>
                    </div>

                    <div className="card p-4 bg-white shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] flex justify-between items-center">
                      <div className="text-left">
                        <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 font-semibold uppercase tracking-wider mb-0.5" style={{ margin: 0 }}>Talent Network</p>
                        <p className="text-xl font-extrabold text-[var(--color-black)]" style={{ margin: 0, lineHeight: 1 }}>{stats.talentSubmissions || talentSubmissions.length}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowAnalyticsModal(false);
                          setActiveSubTab('talent');
                          toast.info("Showing Talent Network submissions.");
                        }}
                        className="text-xs font-bold text-[var(--color-primary)] hover:underline bg-transparent border-none cursor-pointer p-0 transition-colors"
                      >
                        View Network
                      </button>
                    </div>

                    <div className="card p-4 bg-white shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] flex justify-between items-center">
                      <div className="text-left">
                        <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 font-semibold uppercase tracking-wider mb-0.5" style={{ margin: 0 }}>Pending Actions</p>
                        <p className="text-xl font-extrabold text-[var(--color-black)]" style={{ margin: 0, lineHeight: 1 }}>{stats.pendingActions || applications.filter(a => a.status === 'pending').length}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowAnalyticsModal(false);
                          setActiveSubTab('applications');
                          setActiveFilter('pending');
                          toast.info("Filtering table: Pending actions only.");
                        }}
                        className="text-xs font-bold text-[var(--color-primary)] hover:underline bg-transparent border-none cursor-pointer p-0 transition-colors"
                      >
                        Filter Pending
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t border-[var(--color-border)] px-6 py-4 bg-white">
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm transition font-semibold cursor-pointer rounded-[var(--radius-sm)] h-10 border-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Schedule Interview Dialog */}
      <Dialog
        open={openScheduleModal}
        onClose={() => setOpenScheduleModal(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-container": { backgroundColor: "rgba(10,15,30,0.7)", backdropFilter: "blur(8px)" },
          "& .MuiDialog-paper": {
            background: "var(--color-main-bg) !important",
            color: "var(--color-paragraph) !important",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            maxWidth: "440px"
          }
        }}
      >
        <DialogTitle component="div" sx={{ textAlign: "center", pt: 3.5, pb: 1, px: 3 }}>
          <h2 className="text-xl font-bold text-[var(--color-black)] mb-1">Schedule Interview</h2>
          <p className="text-xs text-[var(--color-paragraph)] opacity-80 leading-normal">
            Schedule an interview for <span className="font-semibold text-black">{schedulingApp?.fullName}</span>
          </p>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1.5, pt: 0.5 }}>
          <form onSubmit={handleScheduleSubmit} noValidate>
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <TextField
                  select fullWidth size="small" label="Interview Type" name="type"
                  value={scheduleForm.type}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, type: e.target.value }))}
                  sx={fieldStyle}
                >
                  <MenuItem value="Technical Round">Technical Round</MenuItem>
                  <MenuItem value="HR Round">HR Round</MenuItem>
                  <MenuItem value="Managerial Round">Managerial Round</MenuItem>
                </TextField>
              </div>
              <div>
                <TextField
                  select fullWidth size="small" label="Interview Mode" name="mode"
                  value={scheduleForm.mode}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, mode: e.target.value }))}
                  sx={fieldStyle}
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                </TextField>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] text-[var(--color-paragraph)] font-semibold uppercase opacity-75">Date</label>
                  <input
                    type="date"
                    name="date"
                    min={getTodayDateString()}
                    value={scheduleForm.date}
                    onChange={(e) => {
                      setScheduleForm(prev => ({ ...prev, date: e.target.value }));
                      if (scheduleErrors.date) setScheduleErrors(prev => ({ ...prev, date: "" }));
                    }}
                    className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
                  />
                  {scheduleErrors.date && <p className="text-red-500 text-[10px] mt-0.5">{scheduleErrors.date}</p>}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] text-[var(--color-paragraph)] font-semibold uppercase opacity-75">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={scheduleForm.time}
                    onChange={(e) => {
                      setScheduleForm(prev => ({ ...prev, time: e.target.value }));
                      if (scheduleErrors.time) setScheduleErrors(prev => ({ ...prev, time: "" }));
                    }}
                    className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
                  />
                  {scheduleErrors.time && <p className="text-red-500 text-[10px] mt-0.5">{scheduleErrors.time}</p>}
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3.5, pt: 1, justifyContent: "flex-end", gap: 1.5 }}>
          <button
            type="button"
            onClick={() => setOpenScheduleModal(false)}
            className="bg-white border border-[var(--color-border)] hover:bg-slate-50 text-[var(--color-paragraph)] px-4 py-1.5 rounded-[var(--radius-sm)] cursor-pointer text-xs font-semibold transition-colors h-9"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleScheduleSubmit}
            className="btn px-4 py-1.5 cursor-pointer border-none rounded-[var(--radius-sm)] text-xs font-semibold h-9"
          >
            Submit Schedule
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CareerAdmin;
