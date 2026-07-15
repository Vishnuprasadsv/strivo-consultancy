import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCalendar, FiPlus, FiDownload, FiEye, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { getAdminApplicationsAPI, updateApplicationStatusAPI } from '../services/allApi';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Stack
} from "@mui/material";

// Styling variables matching admin theme
const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "3px",
    background: "var(--color-main-bg)",
    "& fieldset": { borderColor: "var(--color-border)" },
    "&:hover fieldset": { borderColor: "var(--color-primary)" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" },
  },
  "& .MuiInputLabel-root": { color: "var(--color-paragraph)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
};

const initialInterviews = [
  { id: 1, name: "Arjun Menon", email: "arjun.menon@email.com", position: "Frontend Developer", type: "Technical Round", mode: "Online", date: "12 Jun 2026 10:00 AM", status: "Scheduled" },
  { id: 2, name: "Sneha Nair", email: "sneha.nair@email.com", position: "UI/UX Designer", type: "HR Round", mode: "Online", date: "12 Jun 2026 02:30 PM", status: "In Progress" },
  { id: 3, name: "Vishnu Prasad", email: "vishnu.prasad@email.com", position: "Backend Developer", type: "Technical Round", mode: "Offline", date: "13 Jun 2026 11:00 AM", status: "Scheduled" },
  { id: 4, name: "Aparna S", email: "aparna.s@email.com", position: "Product Manager", type: "Managerial Round", mode: "Offline", date: "14 Jun 2026 03:00 PM", status: "Completed" },
  { id: 5, name: "Rahul Ramesh", email: "rahul.ramesh@email.com", position: "DevOps Engineer", type: "HR Round", mode: "Online", date: "14 Jun 2026 04:30 PM", status: "Cancelled" }
];

const InterviewsAdmin = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState(() => {
    const stored = localStorage.getItem('interviews');
    if (!stored) {
      localStorage.setItem('interviews', JSON.stringify(initialInterviews));
      return initialInterviews;
    }
    return JSON.parse(stored);
  });

  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [];
  });

  React.useEffect(() => {
    const syncInterviews = () => {
      const stored = localStorage.getItem('interviews');
      if (stored) setInterviews(JSON.parse(stored));
    };
    const syncAppointments = () => {
      const stored = localStorage.getItem('appointments');
      if (stored) setAppointments(JSON.parse(stored));
    };
    window.addEventListener('storage', syncInterviews);
    window.addEventListener('interviewsUpdated', syncInterviews);
    window.addEventListener('storage', syncAppointments);
    window.addEventListener('appointmentsUpdated', syncAppointments);
    return () => {
      window.removeEventListener('storage', syncInterviews);
      window.removeEventListener('interviewsUpdated', syncInterviews);
      window.removeEventListener('storage', syncAppointments);
      window.removeEventListener('appointmentsUpdated', syncAppointments);
    };
  }, []);

  const isScheduledTimeReached = (item) => {
    if (item.scheduledAt) {
      return new Date() >= new Date(item.scheduledAt);
    }
    try {
      const parsed = new Date(item.date);
      if (!isNaN(parsed.getTime())) {
        return new Date() >= parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return true; 
  };

  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterMode, setFilterMode] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [openModal, setOpenModal] = useState(false);
  const [modalForm, setModalForm] = useState({ name: "", email: "", position: "", type: "", mode: "Online", date: "", time: "", status: "Scheduled" });
  const [errors, setErrors] = useState({});

  const [selectedInterview, setSelectedInterview] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [reschedulingInterview, setReschedulingInterview] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const [openExportModal, setOpenExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({
    fromDate: "",
    toDate: "",
    position: "All",
    status: "All"
  });
  const [exportErrors, setExportErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    const err = {};
    if (!modalForm.name.trim()) err.name = "Candidate Name is required";
    if (!modalForm.email.trim()) err.email = "Candidate Email is required";
    if (!modalForm.position.trim()) err.position = "Job Position is required";
    if (!modalForm.type.trim()) err.type = "Interview Type is required";
    if (!modalForm.date) {
      err.date = "Date is required";
    } else if (modalForm.date < getTodayDateString()) {
      err.date = "Date cannot be in the past";
    }
    if (!modalForm.time) err.time = "Time is required";
    return err;
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const err = validateForm();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    const formattedDate = new Date(`${modalForm.date}T${modalForm.time}`).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + " " + new Date(`${modalForm.date}T${modalForm.time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newInterview = {
      id: Date.now(),
      name: modalForm.name,
      email: modalForm.email,
      position: modalForm.position,
      type: modalForm.type,
      mode: modalForm.mode,
      date: formattedDate,
      status: modalForm.status
    };

    setInterviews(prev => {
      const updated = [newInterview, ...prev];
      localStorage.setItem('interviews', JSON.stringify(updated));
      window.dispatchEvent(new Event('interviewsUpdated'));
      return updated;
    });
    toast.success("Interview scheduled successfully!");
    setOpenModal(false);
    setModalForm({ name: "", email: "", position: "", type: "", mode: "Online", date: "", time: "", status: "Scheduled" });
    setErrors({});
  };

  const copyInterviewToAppointments = (interview) => {
    const stored = localStorage.getItem('appointments');
    const initialApps = [
      { id: 1, name: "Riya Raj", email: "riya.raj@email.com", position: "Frontend Developer", interviewer: "Rohit Kumar", date: "12 Jun 2026 10:00 AM", mode: "Online", status: "Pending" },
      { id: 2, name: "Adithya Krishnan", email: "adithya.k@email.com", position: "UI/UX Designer", interviewer: "Neha Sharma", date: "12 Jun 2026 02:30 PM", mode: "Online", status: "Pending" },
      { id: 3, name: "Meera Nandakumar", email: "meera.n@email.com", position: "Backend Developer", interviewer: "Sanjay Patel", date: "13 Jun 2026 11:00 AM", mode: "Offline", status: "Approved" },
      { id: 4, name: "Karthik S", email: "karthik.s@email.com", position: "Product Manager", interviewer: "Anita Joseph", date: "13 Jun 2026 04:00 PM", mode: "Offline", status: "Rejected" },
      { id: 5, name: "Devika P", email: "devika.p@email.com", position: "DevOps Engineer", interviewer: "Neha Sharma", date: "14 Jun 2026 10:30 AM", mode: "Online", status: "Pending" }
    ];
    const currentApps = stored ? JSON.parse(stored) : initialApps;
    
    if (currentApps.some(app => app.email === interview.email)) {
      return;
    }

    const newApp = {
      id: Date.now(),
      name: interview.name,
      email: interview.email,
      position: interview.position,
      interviewer: "Rohit Kumar",
      date: interview.date,
      mode: interview.mode,
      status: "Pending"
    };

    const updated = [newApp, ...currentApps];
    localStorage.setItem('appointments', JSON.stringify(updated));
    window.dispatchEvent(new Event('appointmentsUpdated'));
  };

  const handleStatusChange = async (id, newStatus) => {
    const interview = interviews.find(i => i.id === id);
    if (!interview) return;



    if (newStatus === 'Cancelled') {
      setReschedulingInterview(interview);
      setRescheduleDate("");
      setRescheduleTime("");
      setOpenRescheduleModal(true);
      return;
    }

    let backendStatus = '';
    if (newStatus === 'In Progress') {
      backendStatus = 'interview_in_progress';
    } else if (newStatus === 'Completed') {
      backendStatus = 'interview_completed';
    } else if (newStatus === 'Recommended') {
      backendStatus = 'interview_completed';
    } else if (newStatus === 'Rejected' || newStatus === 'Cancelled') {
      backendStatus = 'rejected';
    }

    if (backendStatus) {
      try {
        const appsRes = await getAdminApplicationsAPI();
        if (appsRes.status === 200 && appsRes.data?.success) {
          const app = appsRes.data.data.find(a => a.email.toLowerCase() === interview.email.toLowerCase());
          if (app) {
            await updateApplicationStatusAPI(app._id, backendStatus);
          }
        }
      } catch (err) {
        console.error("Failed quietly to sync status to backend:", err);
      }
    }

    setInterviews(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          if (newStatus === 'Recommended') {
            copyInterviewToAppointments(item);
          }
          return { ...item, status: newStatus };
        }
        return item;
      });
      localStorage.setItem('interviews', JSON.stringify(updated));
      window.dispatchEvent(new Event('interviewsUpdated'));
      return updated;
    });
    toast.success(`Interview status updated to: ${newStatus === 'Rejected' ? 'Not Fit' : newStatus}`);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Please select a valid date and time.");
      return;
    }

    const selectedDateTime = new Date(`${rescheduleDate}T${rescheduleTime}`);
    if (selectedDateTime < new Date()) {
      toast.error("Cannot reschedule an interview to a past date or time.");
      return;
    }

    const formattedDate = new Date(`${rescheduleDate}T${rescheduleTime}`).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + " " + new Date(`${rescheduleDate}T${rescheduleTime}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    setInterviews(prev => {
      const updated = prev.map(item => {
        if (item.id === reschedulingInterview.id) {
          return {
            ...item,
            date: formattedDate,
            scheduledAt: new Date(`${rescheduleDate}T${rescheduleTime}`).toISOString(),
            status: 'Scheduled'
          };
        }
        return item;
      });
      localStorage.setItem('interviews', JSON.stringify(updated));
      window.dispatchEvent(new Event('interviewsUpdated'));
      return updated;
    });

    try {
      const appsRes = await getAdminApplicationsAPI();
      if (appsRes.status === 200 && appsRes.data?.success) {
        const app = appsRes.data.data.find(a => a.email.toLowerCase() === reschedulingInterview.email.toLowerCase());
        if (app) {
          await updateApplicationStatusAPI(app._id, 'referred');
        }
      }
    } catch (err) {
      console.error(err);
    }

    toast.success("Interview rescheduled successfully!");
    setOpenRescheduleModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this interview record?")) {
      setInterviews(prev => {
        const updated = prev.filter(item => item.id !== id);
        localStorage.setItem('interviews', JSON.stringify(updated));
        window.dispatchEvent(new Event('interviewsUpdated'));
        return updated;
      });
      toast.success("Interview record deleted successfully.");
    }
  };

  const handleExport = () => {
    setExportForm({
      fromDate: "",
      toDate: "",
      position: "All",
      status: "All"
    });
    setExportErrors({});
    setOpenExportModal(true);
  };

  const handleExportSubmit = () => {
    const errs = {};
    if (exportForm.fromDate && exportForm.toDate && new Date(exportForm.fromDate) > new Date(exportForm.toDate)) {
      errs.toDate = "To Date cannot be before From Date";
    }
    if (Object.keys(errs).length > 0) {
      setExportErrors(errs);
      return;
    }

    const getInterviewDate = (item) => {
      if (item.scheduledAt) {
        return new Date(item.scheduledAt);
      }
      try {
        return new Date(item.date);
      } catch (e) {
        return new Date();
      }
    };

    const filtered = interviews.filter(item => {
      const itemDate = getInterviewDate(item);
      if (exportForm.fromDate) {
        const from = new Date(`${exportForm.fromDate}T00:00:00`);
        if (itemDate < from) return false;
      }
      if (exportForm.toDate) {
        const to = new Date(`${exportForm.toDate}T23:59:59`);
        if (itemDate > to) return false;
      }
      if (exportForm.position !== "All" && item.position !== exportForm.position) {
        return false;
      }
      if (exportForm.status !== "All" && item.status !== exportForm.status) {
        return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      toast.error("No interview records found for the selected criteria.");
      return;
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Bank Statement Header Style
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("STRIVO CONSULTANCY", 14, 20);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text("HR Department - Recruitment Operations Statement", 14, 25);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 28, 196, 28);
    
    // Metadata Block
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("INTERVIEW HISTORY STATEMENT", 14, 36);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    
    const periodText = `Statement Period: ${exportForm.fromDate || 'Start'} to ${exportForm.toDate || 'End'}`;
    const generatedText = `Generated On: ${new Date().toLocaleString()}`;
    const filterJobText = `Job Position: ${exportForm.position}`;
    const filterStatusText = `Interview Status: ${exportForm.status === 'Rejected' ? 'Not Fit' : exportForm.status}`;
    
    doc.text(periodText, 14, 42);
    doc.text(generatedText, 120, 42);
    doc.text(filterJobText, 14, 47);
    doc.text(filterStatusText, 120, 47);
    
    doc.line(14, 51, 196, 51);
    
    // Bank Statement Table Format (Black/White and Clean Grid Lines)
    const tableHeaders = [["DATE & TIME", "CANDIDATE", "EMAIL", "POSITION", "ROUND / MODE", "STATUS"]];
    const tableData = filtered.map(item => [
      item.date,
      item.name,
      item.email,
      item.position,
      `${item.type} (${item.mode})`,
      item.status === 'Rejected' ? 'Not Fit' : item.status
    ]);
    
    doc.autoTable({
      startY: 55,
      head: tableHeaders,
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [50, 50, 50],
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: 0.2,
        lineColor: [200, 200, 200]
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [80, 80, 80],
        lineWidth: 0.2,
        lineColor: [220, 220, 220]
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 25 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 30 },
        5: { cellWidth: 22 }
      },
      margin: { left: 14, right: 14 }
    });
    
    doc.save(`Interview_Statement_${new Date().toISOString().slice(0,10)}.pdf`);
    setOpenExportModal(false);
    toast.success("Statement PDF downloaded successfully!");
  };

  // Filter logic
  const filteredData = interviews.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase());
    const matchesPos = filterPosition === "All" || item.position === filterPosition;
    const matchesType = filterType === "All" || item.type === filterType;
    const matchesMode = filterMode === "All" || item.mode === filterMode;
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return matchesSearch && matchesPos && matchesType && matchesMode && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentPagedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    return 'text-slate-700 font-medium text-xs';
  };

  return (
    <div className="min-h-screen bg-sub flex flex-col" style={{ fontFamily: 'var(--font-primary)' }}>
      {/* Top Header Section */}
      <div className="bg-main pt-24 pb-6 border-b border-[var(--color-border)] px-8 md:px-16 lg:px-24">
        <div className="max-w-[98%] mx-auto flex flex-col md:flex-row justify-between items-center mt-4 gap-4 w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <h1 className="text-2xl font-[var(--font-bold)] text-primary leading-none uppercase" style={{ margin: 0 }}>
              Interviews
            </h1>
            <p className="text-xs text-[var(--color-black)] font-medium opacity-85 mt-2" style={{ margin: '6px 0 0 0', lineHeight: 1.3 }}>
              Manage all interviews and track candidate progress.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
            <button
              onClick={() => setOpenModal(true)}
              className="btn px-4 py-2 flex items-center justify-center gap-2 cursor-pointer border-none h-9 text-xs font-semibold rounded-[var(--radius-sm)]"
            >
              <FiPlus size={14} />
              Schedule Interview
            </button>
            <button
              onClick={handleExport}
              className="bg-white border border-[var(--color-border)] hover:bg-slate-50 text-slate-700 px-4 py-2 flex items-center justify-center gap-2 cursor-pointer h-9 text-xs font-semibold rounded-[var(--radius-sm)] transition-colors"
            >
              <FiDownload size={14} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-8 flex-grow">
        <div className="max-w-[98%] mx-auto bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-5 shadow-sm">
          
          {/* Search and Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white text-black placeholder-gray-400 rounded-[var(--radius-sm)] pl-9 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9 transition-all"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
            </div>

            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="bg-white text-black rounded-[var(--radius-sm)] px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
            >
              <option value="All">All Job Positions</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white text-black rounded-[var(--radius-sm)] px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
            >
              <option value="All">All Interview Types</option>
              <option value="Technical Round">Technical Round</option>
              <option value="HR Round">HR Round</option>
              <option value="Managerial Round">Managerial Round</option>
            </select>

            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="bg-white text-black rounded-[var(--radius-sm)] px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
            >
              <option value="All">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white text-black rounded-[var(--radius-sm)] px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Table (Desktop Viewport) */}
          <div className="overflow-x-auto hidden md:block border border-[var(--color-border)] rounded-[var(--radius-sm)] mb-6">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-slate-50/50">
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Candidate</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Job Position</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Interview Type</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Mode</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Interview Date & Time</th>
                  <th className="py-3 px-3 text-center text-xs font-normal uppercase tracking-wider text-primary">Status</th>
                  <th className="py-3 px-3 text-center text-xs font-normal uppercase tracking-wider text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPagedData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-xs text-slate-500">No interviews found matching filters.</td>
                  </tr>
                ) : (
                  currentPagedData.map((item) => (
                    <tr key={item.id} className="border-b border-[var(--color-border)] hover:bg-slate-50/30 transition-colors">
                      <td className="py-3.5 px-3">
                        <div>
                          <p
                            onClick={() => { setSelectedInterview(item); setOpenDetailModal(true); }}
                            className="text-xs font-semibold text-black hover:underline cursor-pointer inline-block"
                          >
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-500">{item.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.position}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.type}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.mode}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.date}</td>
                      <td className="py-3.5 px-3 text-center text-xs text-slate-700 font-medium">
                        {item.status === 'Rejected' ? 'Not Fit' : item.status}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {item.status === 'Recommended' ? (
                          <span className="text-slate-400 text-xs">-</span>
                        ) : (
                          <select
                            value=""
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="bg-white border border-gray-300 text-slate-700 rounded px-2 py-1 text-xs focus:outline-none cursor-pointer hover:bg-slate-50 w-32 font-medium"
                          >
                            <option value="" disabled hidden>Action</option>
                            <option value="Recommended">Recommended</option>
                            <option value="Rejected">Not Fit</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Cards Fallback (Mobile Viewport) */}
          <div className="flex flex-col gap-4 md:hidden mb-6">
            {currentPagedData.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-500">No interviews found.</p>
            ) : (
              currentPagedData.map((item) => (
                <div key={item.id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-slate-50/20 hover:bg-slate-50/40 transition-all flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        onClick={() => { setSelectedInterview(item); setOpenDetailModal(true); }}
                        className="text-xs font-semibold text-black hover:underline cursor-pointer"
                      >
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{item.email}</p>
                    </div>
                    <span className="text-slate-700 font-medium text-xs">
                      {item.status === 'Rejected' ? 'Not Fit' : item.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 flex flex-col gap-1 border-t border-slate-100 pt-2">
                    <p><span className="font-semibold">Role:</span> {item.position}</p>
                    <p><span className="font-semibold">Type:</span> {item.type}</p>
                    <p><span className="font-semibold">Mode:</span> {item.mode}</p>
                    <p><span className="font-semibold">Time:</span> {item.date}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-1 pt-2 border-t border-slate-100">
                    {item.status === 'Recommended' ? (
                      <span className="text-slate-400 text-xs">-</span>
                    ) : (
                      <select
                        value=""
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="bg-white border border-gray-300 text-slate-700 rounded px-2 py-1 text-xs focus:outline-none cursor-pointer hover:bg-slate-50 w-32 font-medium"
                      >
                        <option value="" disabled hidden>Action</option>
                        <option value="Recommended">Recommended</option>
                        <option value="Rejected">Not Fit</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {filteredData.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                Showing {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredData.length, currentPage * itemsPerPage)} of {filteredData.length} entries
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1 bg-white border border-slate-300 text-slate-700 text-xs rounded disabled:opacity-40 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 text-xs rounded transition-colors font-medium cursor-pointer ${currentPage === page ? 'bg-primary text-white font-bold' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1 bg-white border border-slate-300 text-slate-700 text-xs rounded disabled:opacity-40 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* dialog Schedule Interview */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-container": { backgroundColor: "rgba(10,15,30,0.7)", backdropFilter: "blur(8px)" },
          "& .MuiDialog-paper": { borderRadius: "3px", background: "var(--color-main-bg)", border: "1px solid var(--color-border)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", maxWidth: "440px" },
        }}
      >
        <DialogTitle component="div" sx={{ textAlign: "center", pt: 3.5, pb: 1, px: 3 }}>
          <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: "1.25rem" }}>Schedule Interview</Typography>
          <Typography sx={{ color: "var(--color-paragraph)", fontSize: "0.85rem", lineHeight: 1.5 }}>
            Create a new interview record for a candidate.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1.5, pt: 0.5 }}>
          <form onSubmit={handleScheduleSubmit} noValidate>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <div>
                <TextField
                  fullWidth size="small" label="Candidate Name" name="name"
                  value={modalForm.name} onChange={handleInputChange}
                  error={!!errors.name} helperText={errors.name}
                  sx={fieldStyle}
                />
              </div>
              <div>
                <TextField
                  fullWidth size="small" label="Candidate Email" name="email"
                  value={modalForm.email} onChange={handleInputChange}
                  error={!!errors.email} helperText={errors.email}
                  sx={fieldStyle}
                />
              </div>
              <div>
                <TextField
                  select fullWidth size="small" label="Job Position" name="position"
                  value={modalForm.position} onChange={handleInputChange}
                  error={!!errors.position} helperText={errors.position}
                  sx={fieldStyle}
                >
                  <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
                  <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
                  <MenuItem value="Backend Developer">Backend Developer</MenuItem>
                  <MenuItem value="Product Manager">Product Manager</MenuItem>
                  <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
                </TextField>
              </div>
              <div>
                <TextField
                  select fullWidth size="small" label="Interview Type" name="type"
                  value={modalForm.type} onChange={handleInputChange}
                  error={!!errors.type} helperText={errors.type}
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
                  value={modalForm.mode} onChange={handleInputChange}
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
                    value={modalForm.date}
                    onChange={handleInputChange}
                    className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
                  />
                  {errors.date && <p className="text-red-500 text-[10px] mt-0.5">{errors.date}</p>}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] text-[var(--color-paragraph)] font-semibold uppercase opacity-75">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={modalForm.time}
                    onChange={handleInputChange}
                    className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
                  />
                  {errors.time && <p className="text-red-500 text-[10px] mt-0.5">{errors.time}</p>}
                </div>
              </div>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3.5, pt: 1, justifyContent: "flex-end", gap: 1.5 }}>
          <button
            type="button"
            onClick={() => setOpenModal(false)}
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

      {/* dialog Details View */}
      <Dialog
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-container": { backgroundColor: "rgba(10,15,30,0.7)", backdropFilter: "blur(8px)" },
          "& .MuiDialog-paper": { borderRadius: "3px", background: "var(--color-main-bg)", border: "1px solid var(--color-border)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", maxWidth: "440px" },
        }}
      >
        <DialogTitle component="div" sx={{ pt: 3.5, pb: 1, px: 3, borderBottom: "1px solid var(--color-border)" }}>
          <Typography fontWeight={700} sx={{ fontSize: "1.25rem" }}>Candidate Details</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {selectedInterview && (
            <div className="flex flex-col gap-4 text-xs text-slate-700">
              <div className="border-b border-slate-100 pb-3 flex flex-col gap-0.5">
                <p className="text-sm font-bold text-black">{selectedInterview.name}</p>
                <p className="text-slate-500">{selectedInterview.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Job Position</p>
                  <p className="font-semibold text-black mt-0.5">{selectedInterview.position}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Interview Round</p>
                  <p className="font-semibold text-black mt-0.5">{selectedInterview.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Mode</p>
                  <p className="font-semibold text-black mt-0.5">{selectedInterview.mode}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Date & Time</p>
                  <p className="font-semibold text-black mt-0.5">{selectedInterview.date}</p>
                </div>
                 <div className="col-span-2">
                   <p className="text-[10px] text-slate-400 font-semibold uppercase">Status</p>
                   <span className="text-slate-700 font-medium text-xs mt-1 inline-block">
                     {selectedInterview.status === 'Rejected' ? 'Not Fit' : selectedInterview.status}
                   </span>
                 </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3.5, pt: 1, borderTop: "1px solid var(--color-border)" }}>
          <Button onClick={() => setOpenDetailModal(false)} sx={{ color: "var(--color-paragraph)", textTransform: "none" }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog
        open={openRescheduleModal}
        onClose={() => setOpenRescheduleModal(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-container": { backgroundColor: "rgba(10,15,30,0.7)", backdropFilter: "blur(8px)" },
          "& .MuiDialog-paper": { borderRadius: "3px", background: "var(--color-main-bg)", border: "1px solid var(--color-border)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", maxWidth: "440px" },
        }}
      >
        <DialogTitle component="div" sx={{ textAlign: "center", pt: 3.5, pb: 1, px: 3 }}>
          <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: "1.25rem" }}>Reschedule Interview</Typography>
          <Typography sx={{ color: "var(--color-paragraph)", fontSize: "0.85rem", lineHeight: 1.5 }}>
            Pick a new date and time for {reschedulingInterview?.name}'s interview.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1.5, pt: 0.5 }}>
          <form onSubmit={handleRescheduleSubmit} noValidate>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-[var(--color-paragraph)] font-semibold uppercase opacity-75">New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
                />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-[var(--color-paragraph)] font-semibold uppercase opacity-75">New Time</label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
                />
              </div>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3.5, pt: 1, justifyContent: "flex-end", gap: 1.5 }}>
          <Button
            onClick={() => setOpenRescheduleModal(false)}
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
          <button
            type="button"
            onClick={handleRescheduleSubmit}
            className="btn px-4 cursor-pointer border-none rounded-[var(--radius-sm)] text-xs font-semibold h-8"
          >
            Reschedule
          </button>
        </DialogActions>
      </Dialog>

      {/* Export Date Range Dialog */}
      <Dialog
        open={openExportModal}
        onClose={() => setOpenExportModal(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-container": { backgroundColor: "rgba(10,15,30,0.7)", backdropFilter: "blur(8px)" },
          "& .MuiDialog-paper": { borderRadius: "3px", background: "var(--color-main-bg)", border: "1px solid var(--color-border)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", maxWidth: "440px" },
        }}
      >
        <DialogTitle component="div" sx={{ pt: 3.5, pb: 1, px: 3, borderBottom: "1px solid var(--color-border)" }}>
          <Typography fontWeight={700} sx={{ fontSize: "1.25rem" }}>Export Interviews</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1.5, pt: 2 }}>
          <Stack spacing={2.5}>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-[var(--color-paragraph)] font-semibold uppercase opacity-75">From Date</label>
              <input
                type="date"
                value={exportForm.fromDate}
                onChange={(e) => {
                  setExportForm(prev => ({ ...prev, fromDate: e.target.value }));
                  if (exportErrors.fromDate) setExportErrors(prev => ({ ...prev, fromDate: "" }));
                }}
                className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
              />
              {exportErrors.fromDate && <p className="text-red-500 text-[10px] mt-0.5" style={{ margin: 0 }}>{exportErrors.fromDate}</p>}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-[var(--color-paragraph)] font-semibold uppercase opacity-75">To Date</label>
              <input
                type="date"
                value={exportForm.toDate}
                onChange={(e) => {
                  setExportForm(prev => ({ ...prev, toDate: e.target.value }));
                  if (exportErrors.toDate) setExportErrors(prev => ({ ...prev, toDate: "" }));
                }}
                className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
              />
              {exportErrors.toDate && <p className="text-red-500 text-[10px] mt-0.5" style={{ margin: 0 }}>{exportErrors.toDate}</p>}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-[var(--color-paragraph)] font-semibold uppercase opacity-75">Job Position</label>
              <select
                value={exportForm.position}
                onChange={(e) => setExportForm(prev => ({ ...prev, position: e.target.value }))}
                className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
              >
                <option value="All">All Job Positions</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-[var(--color-paragraph)] font-semibold uppercase opacity-75">Status</label>
              <select
                value={exportForm.status}
                onChange={(e) => setExportForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
              >
                <option value="All">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Recommended">Recommended</option>
                <option value="Rejected">Not Fit</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3.5, pt: 1, borderTop: "1px solid var(--color-border)", justifyContent: "flex-end", gap: 1.5 }}>
          <Button
            onClick={() => setOpenExportModal(false)}
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
          <button
            type="button"
            onClick={handleExportSubmit}
            className="btn px-4 cursor-pointer border-none rounded-[var(--radius-sm)] text-xs font-semibold h-8"
          >
            Export
          </button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default InterviewsAdmin;
