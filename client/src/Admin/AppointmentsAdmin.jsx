import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCalendar, FiPlus, FiDownload, FiEye, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';
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

const initialAppointments = [
  { id: 1, name: "Riya Raj", email: "riya.raj@email.com", position: "Frontend Developer", interviewer: "Rohit Kumar", date: "12 Jun 2026 10:00 AM", mode: "Online", status: "Pending" },
  { id: 2, name: "Adithya Krishnan", email: "adithya.k@email.com", position: "UI/UX Designer", interviewer: "Neha Sharma", date: "12 Jun 2026 02:30 PM", mode: "Online", status: "Pending" },
  { id: 3, name: "Meera Nandakumar", email: "meera.n@email.com", position: "Backend Developer", interviewer: "Sanjay Patel", date: "13 Jun 2026 11:00 AM", mode: "Offline", status: "Approved" },
  { id: 4, name: "Karthik S", email: "karthik.s@email.com", position: "Product Manager", interviewer: "Anita Joseph", date: "13 Jun 2026 04:00 PM", mode: "Offline", status: "Rejected" },
  { id: 5, name: "Devika P", email: "devika.p@email.com", position: "DevOps Engineer", interviewer: "Neha Sharma", date: "14 Jun 2026 10:30 AM", mode: "Online", status: "Pending" }
];

const AppointmentsAdmin = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('appointments');
    if (!stored) {
      localStorage.setItem('appointments', JSON.stringify(initialAppointments));
      return initialAppointments;
    }
    return JSON.parse(stored);
  });

  React.useEffect(() => {
    const syncAppointments = () => {
      const stored = localStorage.getItem('appointments');
      if (stored) setAppointments(JSON.parse(stored));
    };
    window.addEventListener('storage', syncAppointments);
    window.addEventListener('appointmentsUpdated', syncAppointments);
    return () => {
      window.removeEventListener('storage', syncAppointments);
      window.removeEventListener('appointmentsUpdated', syncAppointments);
    };
  }, []);

  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("All");
  const [filterInterviewer, setFilterInterviewer] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [openModal, setOpenModal] = useState(false);
  const [modalForm, setModalForm] = useState({ name: "", email: "", position: "", interviewer: "", date: "", time: "", mode: "Online", status: "Pending" });
  const [errors, setErrors] = useState({});

  const [openExportModal, setOpenExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({ fromDate: "", toDate: "" });
  const [exportErrors, setExportErrors] = useState({});

  const [selectedApp, setSelectedApp] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const err = {};
    if (!modalForm.name.trim()) err.name = "Candidate Name is required";
    if (!modalForm.email.trim()) err.email = "Candidate Email is required";
    if (!modalForm.position.trim()) err.position = "Job Position is required";
    if (!modalForm.interviewer.trim()) err.interviewer = "Interviewer Name is required";
    if (!modalForm.date) err.date = "Date is required";
    if (!modalForm.time) err.time = "Time is required";
    return err;
  };

  const handleCreateSubmit = (e) => {
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

    const newApp = {
      id: Date.now(),
      name: modalForm.name,
      email: modalForm.email,
      position: modalForm.position,
      interviewer: modalForm.interviewer,
      date: formattedDate,
      mode: modalForm.mode,
      status: modalForm.status
    };

    setAppointments(prev => {
      const updated = [newApp, ...prev];
      localStorage.setItem('appointments', JSON.stringify(updated));
      window.dispatchEvent(new Event('appointmentsUpdated'));
      return updated;
    });
    toast.success("Appointment scheduled successfully!");
    setOpenModal(false);
    setModalForm({ name: "", email: "", position: "", interviewer: "", date: "", time: "", mode: "Online", status: "Pending" });
    setErrors({});
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, status: newStatus } : item);
      localStorage.setItem('appointments', JSON.stringify(updated));
      window.dispatchEvent(new Event('appointmentsUpdated'));
      return updated;
    });
    toast.success(`Appointment status updated to: ${newStatus}`);
  };

  const handleSendToApproval = (id) => {
    setAppointments(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, status: 'Pending Approval' } : item);
      localStorage.setItem('appointments', JSON.stringify(updated));
      window.dispatchEvent(new Event('appointmentsUpdated'));
      return updated;
    });
    toast.success("Appointment sent to Admin Dashboard for approval!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment record?")) {
      setAppointments(prev => {
        const updated = prev.filter(item => item.id !== id);
        localStorage.setItem('appointments', JSON.stringify(updated));
        window.dispatchEvent(new Event('appointmentsUpdated'));
        return updated;
      });
      toast.success("Appointment record deleted successfully.");
    }
  };

  const handleExport = () => {
    setOpenExportModal(true);
  };

  const handleExportSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (!exportForm.fromDate) err.fromDate = "From Date is required";
    if (!exportForm.toDate) err.toDate = "To Date is required";
    if (Object.keys(err).length > 0) {
      setExportErrors(err);
      return;
    }

    const from = new Date(exportForm.fromDate + "T00:00:00");
    const to = new Date(exportForm.toDate + "T23:59:59");

    const exported = appointments.filter(item => {
      if (!item.date) return false;
      const parts = item.date.replace(/,/g, '').split(' ');
      const cleanStr = `${parts[0]} ${parts[1]} ${parts[2]}`;
      const itemDate = new Date(cleanStr);
      return itemDate >= from && itemDate <= to;
    });

    if (exported.length === 0) {
      toast.error("No appointments found in the selected date range.");
      return;
    }

    // Generate PDF in bank statement format
    const doc = new jsPDF();
    
    // Header banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("STRIVO CONSULTANCY", 15, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("HR Department - Candidate Appointments Statement", 15, 30);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STATEMENT OF APPOINTMENTS", 130, 22);
    
    // Metadata Summary Grid (Bank Statement Style)
    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("STATEMENT SUMMARY", 15, 52);
    
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(15, 55, 195, 55);
    
    doc.setFont("helvetica", "normal");
    doc.text("Account Name:", 15, 63);
    doc.setFont("helvetica", "bold");
    doc.text("Strivo Consultancy HR Dept", 45, 63);
    
    doc.setFont("helvetica", "normal");
    doc.text("Statement Period:", 15, 71);
    doc.setFont("helvetica", "bold");
    doc.text(`${exportForm.fromDate} to ${exportForm.toDate}`, 48, 71);
    
    doc.setFont("helvetica", "normal");
    doc.text("Statement Date:", 115, 63);
    doc.setFont("helvetica", "bold");
    doc.text(`${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`, 145, 63);
    
    doc.setFont("helvetica", "normal");
    doc.text("Total Appointments:", 115, 71);
    doc.setFont("helvetica", "bold");
    doc.text(`${exported.length}`, 151, 71);
    
    doc.line(15, 77, 195, 77);
    
    // Table Headers and Rows
    const headers = [["DATE & TIME", "CANDIDATE", "EMAIL", "JOB POSITION", "MODE", "STATUS"]];
    const data = exported.map(item => [
      item.date,
      item.name,
      item.email,
      item.position,
      item.mode,
      item.status
    ]);
    
    doc.autoTable({
      head: headers,
      body: data,
      startY: 85,
      theme: 'grid',
      styles: {
        fontSize: 8,
        font: 'helvetica',
        cellPadding: 3,
        lineColor: [226, 232, 240], // slate-200
        textColor: [51, 65, 85]
      },
      headStyles: {
        fillColor: [15, 23, 42], // Deep Navy slate-900
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // slate-50 alternating rows
      },
      margin: { left: 15, right: 15 },
      didDrawPage: function(data) {
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, 195, doc.internal.pageSize.height - 10, { align: 'right' });
        doc.text("CONFIDENTIAL - FOR INTERNAL HR USE ONLY", 15, doc.internal.pageSize.height - 10);
      }
    });
    
    doc.save(`appointments_statement_${exportForm.fromDate}_to_${exportForm.toDate}.pdf`);
    toast.success(`Exported ${exported.length} appointments successfully!`);
    setOpenExportModal(false);
    setExportForm({ fromDate: "", toDate: "" });
    setExportErrors({});
  };

  // Filter logic
  const filteredData = appointments.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase());
    const matchesPos = filterPosition === "All" || item.position === filterPosition;
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return matchesSearch && matchesPos && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentPagedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending Approval': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-sub flex flex-col" style={{ fontFamily: 'var(--font-primary)' }}>
      {/* Top Header Section */}
      <div className="bg-main pt-24 pb-6 border-b border-[var(--color-border)] px-8 md:px-16 lg:px-24">
        <div className="max-w-[98%] mx-auto flex flex-col md:flex-row justify-between items-center mt-4 gap-4 w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <h1 className="text-2xl font-[var(--font-bold)] text-primary leading-none uppercase" style={{ margin: 0 }}>
              Appointments
            </h1>
            <p className="text-xs text-[var(--color-black)] font-medium opacity-85 mt-2" style={{ margin: '6px 0 0 0', lineHeight: 1.3 }}>
              Manage candidate appointments. Approval required from admin.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
            <button
              onClick={() => setOpenModal(true)}
              className="btn px-4 py-2 flex items-center justify-center gap-2 cursor-pointer border-none h-9 text-xs font-semibold rounded-[var(--radius-sm)]"
            >
              <FiPlus size={14} />
              New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-8 flex-grow">
        <div className="max-w-[98%] mx-auto bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-5 shadow-sm">
          
          {/* Search and Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
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
              className="bg-white text-black rounded-[var(--radius-sm)] px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9 cursor-pointer"
            >
              <option value="All">All Job Positions</option>
              {[...new Set(appointments.map(app => app.position))].filter(Boolean).map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white text-black rounded-[var(--radius-sm)] px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9 cursor-pointer"
            >
              <option value="All">Approval Status</option>
              <option value="Pending">Pending</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Table (Desktop Viewport) */}
          <div className="overflow-x-auto hidden md:block border border-[var(--color-border)] rounded-[var(--radius-sm)] mb-6">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-slate-50/50">
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Candidate</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Job Position</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Interviewer</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Appointment Date & Time</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Mode</th>
                  <th className="py-3 px-3 text-center text-xs font-normal uppercase tracking-wider text-primary">Approval Status</th>
                  <th className="py-3 px-3 text-center text-xs font-normal uppercase tracking-wider text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPagedData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-xs text-slate-500">No appointments found matching filters.</td>
                  </tr>
                ) : (
                  currentPagedData.map((item) => (
                    <tr key={item.id} className="border-b border-[var(--color-border)] hover:bg-slate-50/30 transition-colors">
                      <td className="py-3.5 px-3">
                        <div>
                          <p className="text-xs font-semibold text-black">{item.name}</p>
                          <p className="text-[10px] text-slate-500">{item.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.position}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.interviewer}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.date}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.mode}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.status === 'Pending' && (
                            <button
                              onClick={() => handleSendToApproval(item.id)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-[var(--radius-sm)] transition cursor-pointer"
                              title="Send to Approval"
                            >
                              Send to Approval
                            </button>
                          )}
                          <button
                            onClick={() => { setSelectedApp(item); setOpenDetailModal(true); }}
                            className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-slate-600 hover:text-slate-900"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                            title="View Details"
                          >
                            <FiEye size={13} />
                          </button>
                        </div>
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
              <p className="text-center py-6 text-xs text-slate-500">No appointments found.</p>
            ) : (
              currentPagedData.map((item) => (
                <div key={item.id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-slate-50/20 hover:bg-slate-50/40 transition-all flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-black">{item.name}</p>
                      <p className="text-[10px] text-slate-500">{item.email}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 flex flex-col gap-1 border-t border-slate-100 pt-2">
                    <p><span className="font-semibold">Role:</span> {item.position}</p>
                    <p><span className="font-semibold">Interviewer:</span> {item.interviewer}</p>
                    <p><span className="font-semibold">Time:</span> {item.date}</p>
                    <p><span className="font-semibold">Mode:</span> {item.mode}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-1 pt-2 border-t border-slate-100">
                    {item.status === 'Pending' && (
                      <button
                        onClick={() => handleSendToApproval(item.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 border border-blue-200 rounded px-2.5 py-1 bg-blue-50 cursor-pointer font-bold"
                      >
                        Send to Approval
                      </button>
                    )}
                    <button
                      onClick={() => { setSelectedApp(item); setOpenDetailModal(true); }}
                      className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 border border-slate-300 rounded px-2.5 py-1 bg-white cursor-pointer"
                    >
                      <FiEye size={12} />
                      View
                    </button>
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

      {/* dialog New Appointment */}
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
          <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: "1.25rem" }}>New Appointment</Typography>
          <Typography sx={{ color: "var(--color-paragraph)", fontSize: "0.85rem", lineHeight: 1.5 }}>
            Schedule a new appointment for a candidate.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1.5, pt: 0.5 }}>
          <form onSubmit={handleCreateSubmit} noValidate>
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
                  select fullWidth size="small" label="Interviewer" name="interviewer"
                  value={modalForm.interviewer} onChange={handleInputChange}
                  error={!!errors.interviewer} helperText={errors.interviewer}
                  sx={fieldStyle}
                >
                  <MenuItem value="Rohit Kumar">Rohit Kumar</MenuItem>
                  <MenuItem value="Neha Sharma">Neha Sharma</MenuItem>
                  <MenuItem value="Sanjay Patel">Sanjay Patel</MenuItem>
                  <MenuItem value="Anita Joseph">Anita Joseph</MenuItem>
                </TextField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] text-[var(--color-paragraph)] font-semibold uppercase opacity-75">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={modalForm.date}
                    onChange={handleInputChange}
                    className="w-full bg-white text-black rounded-[var(--radius-sm)] px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
                  />
                  {errors.date && <p className="text-red-500 text-[10px] mt-0.5" style={{ margin: 0 }}>{errors.date}</p>}
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
                  {errors.time && <p className="text-red-500 text-[10px] mt-0.5" style={{ margin: 0 }}>{errors.time}</p>}
                </div>
              </div>
              <div>
                <TextField
                  select fullWidth size="small" label="Mode" name="mode"
                  value={modalForm.mode} onChange={handleInputChange}
                  sx={fieldStyle}
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                </TextField>
              </div>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3.5, pt: 1, justifyContent: "flex-end", gap: 1.5 }}>
          <Button
            onClick={() => setOpenModal(false)}
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
            onClick={handleCreateSubmit}
            className="btn px-4 cursor-pointer border-none rounded-[var(--radius-sm)] text-xs font-semibold h-8"
          >
            Create Appointment
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
          <Typography fontWeight={700} sx={{ fontSize: "1.25rem" }}>Appointment Details</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {selectedApp && (
            <div className="flex flex-col gap-4 text-xs text-slate-700">
              <div className="border-b border-slate-100 pb-3 flex flex-col gap-0.5">
                <p className="text-sm font-bold text-black">{selectedApp.name}</p>
                <p className="text-slate-500">{selectedApp.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Job Position</p>
                  <p className="font-semibold text-black mt-0.5">{selectedApp.position}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Interviewer</p>
                  <p className="font-semibold text-black mt-0.5">{selectedApp.interviewer}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Date & Time</p>
                  <p className="font-semibold text-black mt-0.5">{selectedApp.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Mode</p>
                  <p className="font-semibold text-black mt-0.5">{selectedApp.mode}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Approval Status</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold inline-block mt-1 ${getStatusColor(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3.5, pt: 1, borderTop: "1px solid var(--color-border)", justifyContent: "flex-end" }}>
          <Button
            onClick={() => setOpenDetailModal(false)}
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
          <Typography fontWeight={700} sx={{ fontSize: "1.25rem" }}>Export Appointments</Typography>
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

export default AppointmentsAdmin;
