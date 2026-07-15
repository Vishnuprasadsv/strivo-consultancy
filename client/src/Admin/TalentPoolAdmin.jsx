import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCalendar, FiPlus, FiDownload, FiEye, FiMail, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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

const initialTalent = [
  { id: 1, name: "Nandana P Nair", email: "nandana.p@email.com", skills: "React, Node.js, MongoDB", role: "Software Developer at TCS", date: "10 Jun 2026", source: "LinkedIn" },
  { id: 2, name: "Gokul Krishna", email: "gokul.k@email.com", skills: "UI/UX, Figma, Adobe XD", role: "UI/UX Designer at Infopark", date: "08 Jun 2026", source: "Referral" },
  { id: 3, name: "Harikrishnan M", email: "harikrishnan.m@email.com", skills: "AWS, Docker, Kubernetes", role: "DevOps Engineer at UST Global", date: "07 Jun 2026", source: "Naukri" },
  { id: 4, name: "Lakshmi Priya", email: "lakshmi.p@email.com", skills: "Python, Django, SQL", role: "Backend Developer at Zoho", date: "05 Jun 2026", source: "LinkedIn" },
  { id: 5, name: "Albin Antony", email: "albin.a@email.com", skills: "React Native, Firebase", role: "Mobile Developer at Accenture", date: "03 Jun 2026", source: "Company Website" }
];

const TalentPoolAdmin = () => {
  const navigate = useNavigate();
  const [talent, setTalent] = useState(() => {
    const stored = localStorage.getItem('talent');
    if (!stored) {
      localStorage.setItem('talent', JSON.stringify(initialTalent));
      return initialTalent;
    }
    return JSON.parse(stored);
  });

  React.useEffect(() => {
    const syncTalent = () => {
      const stored = localStorage.getItem('talent');
      if (stored) setTalent(JSON.parse(stored));
    };
    window.addEventListener('storage', syncTalent);
    window.addEventListener('talentUpdated', syncTalent);
    return () => {
      window.removeEventListener('storage', syncTalent);
      window.removeEventListener('talentUpdated', syncTalent);
    };
  }, []);

  const [search, setSearch] = useState("");
  const [filterSkill, setFilterSkill] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [filterSource, setFilterSource] = useState("All");

  const [openModal, setOpenModal] = useState(false);
  const [modalForm, setModalForm] = useState({ name: "", email: "", skills: "", role: "", source: "LinkedIn" });
  const [errors, setErrors] = useState({});

  const [openExportModal, setOpenExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({ fromDate: "", toDate: "" });
  const [exportErrors, setExportErrors] = useState({});

  const [selectedTalent, setSelectedTalent] = useState(null);
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
    if (!modalForm.skills.trim()) err.skills = "Skills are required (comma separated)";
    if (!modalForm.role.trim()) err.role = "Current Role is required";
    return err;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const err = validateForm();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    const formattedDate = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newTalent = {
      id: Date.now(),
      name: modalForm.name,
      email: modalForm.email,
      skills: modalForm.skills,
      role: modalForm.role,
      date: formattedDate,
      source: modalForm.source
    };

    setTalent(prev => {
      const updated = [newTalent, ...prev];
      localStorage.setItem('talent', JSON.stringify(updated));
      window.dispatchEvent(new Event('talentUpdated'));
      return updated;
    });
    toast.success("Candidate added to Talent Pool!");
    setOpenModal(false);
    setModalForm({ name: "", email: "", skills: "", role: "", source: "LinkedIn" });
    setErrors({});
  };

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [schedulingTalent, setSchedulingTalent] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ date: "", time: "", type: "Technical Round", mode: "Online" });
  const [scheduleErrors, setScheduleErrors] = useState({});

  const handleDelete = (id) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const executeDelete = () => {
    const id = deleteConfirm.id;
    setTalent(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('talent', JSON.stringify(updated));
      window.dispatchEvent(new Event('talentUpdated'));
      return updated;
    });
    toast.success("Talent record deleted successfully.");
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'New', className: 'text-slate-700 font-medium text-xs' };
      case 'reviewed':
        return { label: 'Under Review', className: 'text-slate-700 font-medium text-xs' };
      case 'referred':
        return { label: 'Interview Scheduled', className: 'text-slate-700 font-medium text-xs' };
      case 'not_fit':
        return { label: 'Not Fit', className: 'text-slate-700 font-medium text-xs' };
      default:
        return { label: 'New', className: 'text-slate-700 font-medium text-xs' };
    }
  };

  const handleTalentAction = (item, action) => {
    if (action === 'under_review') {
      setTalent(prev => {
        const updated = prev.map(t => t.id === item.id ? { ...t, status: 'reviewed' } : t);
        localStorage.setItem('talent', JSON.stringify(updated));
        window.dispatchEvent(new Event('talentUpdated'));
        return updated;
      });
      toast.success(`Candidate status updated to: Under Review`);
    } else if (action === 'not_fit') {
      setTalent(prev => {
        const updated = prev.map(t => t.id === item.id ? { ...t, status: 'not_fit' } : t);
        localStorage.setItem('talent', JSON.stringify(updated));
        window.dispatchEvent(new Event('talentUpdated'));
        return updated;
      });
      toast.success(`Candidate status updated to: Not Fit`);
    } else if (action === 'schedule_interview') {
      setSchedulingTalent(item);
      setScheduleForm({ date: "", time: "", type: "Technical Round", mode: "Online" });
      setScheduleErrors({});
      setOpenScheduleModal(true);
    }
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (!scheduleForm.date) err.date = "Date is required";
    if (!scheduleForm.time) err.time = "Time is required";
    if (scheduleForm.date && scheduleForm.time) {
      const selectedDateTime = new Date(`${scheduleForm.date}T${scheduleForm.time}`);
      if (selectedDateTime < new Date()) {
        err.date = "Interview date/time cannot be in the past";
      }
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
      name: schedulingTalent.name,
      email: schedulingTalent.email,
      position: schedulingTalent.role,
      type: scheduleForm.type,
      mode: scheduleForm.mode,
      date: formattedDate,
      scheduledAt: new Date(`${scheduleForm.date}T${scheduleForm.time}`).toISOString(),
      status: 'Scheduled'
    };

    const storedInterviews = localStorage.getItem('interviews');
    const currentInterviews = storedInterviews ? JSON.parse(storedInterviews) : [];
    const updatedInterviews = [newInterview, ...currentInterviews];
    localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
    window.dispatchEvent(new Event('interviewsUpdated'));

    setTalent(prev => {
      const updated = prev.map(t => t.id === schedulingTalent.id ? { ...t, status: 'referred' } : t);
      localStorage.setItem('talent', JSON.stringify(updated));
      window.dispatchEvent(new Event('talentUpdated'));
      return updated;
    });

    toast.success("Interview scheduled successfully!");
    setOpenScheduleModal(false);
  };

  const handleEmail = (email) => {
    toast.success(`Opening email compose window for: ${email}`);
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

    const exportedCandidates = talent.filter(candidate => {
      if (!candidate.date) return false;
      const parts = candidate.date.replace(/,/g, '').split(' ');
      const cleanStr = `${parts[0]} ${parts[1]} ${parts[2]}`;
      const candidateDate = new Date(cleanStr);
      return candidateDate >= from && candidateDate <= to;
    });

    if (exportedCandidates.length === 0) {
      toast.error("No candidates found in the selected date range.");
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
    doc.text("HR Department - Talent Pool Records Statement", 15, 30);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STATEMENT OF TALENT POOL", 130, 22);
    
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
    doc.text("Total Candidates:", 115, 71);
    doc.setFont("helvetica", "bold");
    doc.text(`${exportedCandidates.length}`, 148, 71);
    
    doc.line(15, 77, 195, 77);
    
    // Table Headers and Rows
    const headers = [["DATE ADDED", "CANDIDATE", "EMAIL", "CURRENT ROLE", "SKILLS", "SOURCE"]];
    const data = exportedCandidates.map(item => [
      item.date,
      item.name,
      item.email,
      item.role,
      item.skills,
      item.source
    ]);
    
    autoTable(doc, {
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
    
    doc.save(`talent_pool_statement_${exportForm.fromDate}_to_${exportForm.toDate}.pdf`);
    toast.success(`Exported ${exportedCandidates.length} candidate records successfully!`);
    setOpenExportModal(false);
    setExportForm({ fromDate: "", toDate: "" });
    setExportErrors({});
  };

  // Filter logic
  const filteredData = talent.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase()) || item.skills.toLowerCase().includes(search.toLowerCase());
    
    const matchesSkill = filterSkill === "All" || item.skills.toLowerCase().includes(filterSkill.toLowerCase());
    const matchesRole = filterRole === "All" || item.role.toLowerCase().includes(filterRole.toLowerCase());
    const matchesSource = filterSource === "All" || item.source === filterSource;
    return matchesSearch && matchesSkill && matchesRole && matchesSource;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentPagedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-sub flex flex-col" style={{ fontFamily: 'var(--font-primary)' }}>
      {/* Top Header Section */}
      <div className="bg-main pt-24 pb-6 border-b border-[var(--color-border)] px-8 md:px-16 lg:px-24">
        <div className="max-w-[98%] mx-auto flex flex-col md:flex-row justify-between items-center mt-4 gap-4 w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <h1 className="text-2xl font-[var(--font-bold)] text-primary leading-none uppercase" style={{ margin: 0 }}>
              Talent Pool
            </h1>
            <p className="text-xs text-[var(--color-black)] font-medium opacity-85 mt-2" style={{ margin: '6px 0 0 0', lineHeight: 1.3 }}>
              Manage and engage with potential future candidates.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-8 flex-grow">
        <div className="max-w-[98%] mx-auto bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-5 shadow-sm">
          
          {/* Search and Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="bg-white text-black rounded-[var(--radius-sm)] px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
            >
              <option value="All">All Skills</option>
              <option value="React">React / React Native</option>
              <option value="Node">Node.js</option>
              <option value="UI/UX">UI/UX / Figma</option>
              <option value="AWS">AWS / Docker / Kubernetes</option>
              <option value="Python">Python / Django</option>
            </select>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-white text-black rounded-[var(--radius-sm)] px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
            >
              <option value="All">All Roles</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Engineer">Engineer</option>
            </select>

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-white text-black rounded-[var(--radius-sm)] px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-xs h-9"
            >
              <option value="All">All Sources</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referral">Referral</option>
              <option value="Naukri">Naukri</option>
              <option value="Company Website">Company Website</option>
            </select>
          </div>

          {/* Table (Desktop Viewport) */}
          <div className="overflow-x-auto hidden md:block border border-[var(--color-border)] rounded-[var(--radius-sm)] mb-6">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-slate-50/50">
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Candidate</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Skills</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Current Role</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Added On</th>
                  <th className="py-3 px-3 text-left text-xs font-normal uppercase tracking-wider text-primary">Source</th>
                </tr>
              </thead>
              <tbody>
                {currentPagedData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-xs text-slate-500">No candidates found matching filters.</td>
                  </tr>
                ) : (
                  currentPagedData.map((item) => (
                    <tr key={item.id} className="border-b border-[var(--color-border)] hover:bg-slate-50/30 transition-colors">
                      <td className="py-3.5 px-3">
                        <div>
                          <p
                            onClick={() => { setSelectedTalent(item); setOpenDetailModal(true); }}
                            className="text-xs font-semibold text-black hover:underline cursor-pointer inline-block"
                          >
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-500">{item.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.skills}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.role}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.date}</td>
                      <td className="py-3.5 px-3 text-xs text-slate-700">{item.source}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Cards Fallback (Mobile Viewport) */}
          <div className="flex flex-col gap-4 md:hidden mb-6">
            {currentPagedData.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-500">No candidates found.</p>
            ) : (
              currentPagedData.map((item) => (
                <div key={item.id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-slate-50/20 hover:bg-slate-50/40 transition-all flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        onClick={() => { setSelectedTalent(item); setOpenDetailModal(true); }}
                        className="text-xs font-semibold text-black hover:underline cursor-pointer"
                      >
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{item.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                      {item.source}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 flex flex-col gap-1 border-t border-slate-100 pt-2">
                    <p><span className="font-semibold">Role:</span> {item.role}</p>
                    <p><span className="font-semibold">Skills:</span> {item.skills}</p>
                    <p><span className="font-semibold">Added On:</span> {item.date}</p>
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

      {/* dialog Add to Talent Pool */}
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
          <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: "1.25rem" }}>Add to Talent Pool</Typography>
          <Typography sx={{ color: "var(--color-paragraph)", fontSize: "0.85rem", lineHeight: 1.5 }}>
            Register a candidate's profile into the talent network.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1.5, pt: 0.5 }}>
          <form onSubmit={handleAddSubmit} noValidate>
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
                  fullWidth size="small" label="Skills (e.g. React, Node.js)" name="skills"
                  value={modalForm.skills} onChange={handleInputChange}
                  error={!!errors.skills} helperText={errors.skills}
                  sx={fieldStyle}
                />
              </div>
              <div>
                <TextField
                  fullWidth size="small" label="Current Role & Company" name="role"
                  placeholder="Software Developer at TCS"
                  value={modalForm.role} onChange={handleInputChange}
                  error={!!errors.role} helperText={errors.role}
                  sx={fieldStyle}
                />
              </div>
              <div>
                <TextField
                  select fullWidth size="small" label="Source" name="source"
                  value={modalForm.source} onChange={handleInputChange}
                  sx={fieldStyle}
                >
                  <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                  <MenuItem value="Naukri">Naukri</MenuItem>
                  <MenuItem value="Referral">Referral</MenuItem>
                  <MenuItem value="Company Website">Company Website</MenuItem>
                </TextField>
              </div>
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3.5, pt: 1, justifyContent: "flex-end", gap: 1.5 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: "var(--color-paragraph)", textTransform: "none" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddSubmit}
            sx={{
              background: "var(--color-primary)",
              px: 3, height: "38px", borderRadius: "var(--radius-sm)", textTransform: "none", fontWeight: "var(--font-bold)",
              boxShadow: "var(--shadow-button)",
              "&:hover": { background: "var(--color-primary-hover)" },
            }}
          >
            Add Candidate
          </Button>
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
          <Typography fontWeight={700} sx={{ fontSize: "1.25rem" }}>Talent Profile Details</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {selectedTalent && (
            <div className="flex flex-col gap-4 text-xs text-slate-700">
              <div className="border-b border-slate-100 pb-3 flex flex-col gap-0.5">
                <p className="text-sm font-bold text-black">{selectedTalent.name}</p>
                <p className="text-slate-500">{selectedTalent.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Skills</p>
                  <p className="font-semibold text-black mt-0.5">{selectedTalent.skills}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Current Role & Company</p>
                  <p className="font-semibold text-black mt-0.5">{selectedTalent.role}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Added On</p>
                  <p className="font-semibold text-black mt-0.5">{selectedTalent.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Source</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-700 inline-block mt-1">
                    {selectedTalent.source}
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
          <Typography fontWeight={700} sx={{ fontSize: "1.25rem" }}>Export Talent Pool</Typography>
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
          <button
            type="button"
            onClick={() => setOpenExportModal(false)}
            className="bg-[var(--color-sub-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-paragraph)] px-4 py-1 rounded-[var(--radius-sm)] cursor-pointer text-xs font-semibold transition-colors h-8"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExportSubmit}
            className="btn bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors px-4 cursor-pointer border-none rounded-[var(--radius-sm)] text-xs font-semibold h-8 text-white"
          >
            Export
          </button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default TalentPoolAdmin;
