import React, { useState, useEffect } from "react";
import LoadingIndicator from "../Components/LoadingIndicator";
import {
    FiMessageSquare,
    FiClock,
    FiCheckCircle,
    FiArchive,
    FiMail,
    FiPhone,
    FiBriefcase,
    FiSend,
    FiBarChart2,
    FiTrash2,
    FiCalendar,
    FiArrowLeft,
    FiFileText,
    FiUserPlus,
    FiLock,
    FiSearch,
    FiChevronDown,
    FiDownload,
    FiPaperclip,
    FiEdit3,
    FiEye
} from "react-icons/fi";
import { motion } from 'framer-motion';
import { toast } from "sonner";
import axios from "axios";
import { jsPDF } from 'jspdf';

const Inquiries = () => {
    // Main UI View state
    const [activeView, setActiveView] = useState("inquiries"); // "inquiries" | "proposal" | "history"
    const [loading, setLoading] = useState(true);
    const [inquiries, setInquiries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);

    // Left Column filters
    const [leftSearch, setLeftSearch] = useState("");
    const [leftStatusFilter, setLeftStatusFilter] = useState("All");
    const [leftPage, setLeftPage] = useState(1);
    const leftItemsPerPage = 4;
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    // Actions form state
    const [selectedAction, setSelectedAction] = useState("Reply by Email");
    const [assignedPerson, setAssignedPerson] = useState("Vishnu");
    const [followUpDate, setFollowUpDate] = useState("");

    // Bottom overview table state
    const [tableFilter, setTableFilter] = useState("All Inquiries"); // "All Inquiries" | "Proposals" | "Assigned to Team" | "Follow-ups"
    const [tablePage, setTablePage] = useState(1);
    const tableItemsPerPage = 5;

    // History dedicated page state
    const [historyInquiry, setHistoryInquiry] = useState(null);

    // Email reply modal state
    const [reply, setReply] = useState({
        subject: "",
        message: "",
    });

    // We store the payload to apply after sending the email successfully
    const [pendingActionPayload, setPendingActionPayload] = useState(null);

    // Proposal builder form state
    const [proposalSubject, setProposalSubject] = useState("");
    const [proposalContent, setProposalContent] = useState("");
    const [proposalBudget, setProposalBudget] = useState("₹ 1,500,000");
    const [proposalTimeline, setProposalTimeline] = useState("30 Days");
    const [proposalNotes, setProposalNotes] = useState([]);
    const [proposalAttachments, setProposalAttachments] = useState([]);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFromDate, setExportFromDate] = useState("");
    const [exportToDate, setExportToDate] = useState("");
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const localDeleteAllRef = React.useRef(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalAction, setConfirmModalAction] = useState(null); // "delete" | "delete_all"
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    useEffect(() => {
        fetchInquiries();

        // SSE Real-time Updates Connection
        const token = localStorage.getItem('adminToken');
        const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/events?token=${token}`);

        eventSource.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                if (parsed.type === "new_inquiry") {
                    const newInq = parsed.data;
                    setInquiries(prev => {
                        if (prev.some(inq => inq._id === newInq._id)) {
                            return prev;
                        }
                        return [newInq, ...prev];
                    });
                    setSelected(currSelected => currSelected ? currSelected : newInq);
                    toast.success(`New inquiry received from ${newInq.fullName}`);
                } else if (parsed.type === "update_inquiry") {
                    const updatedInq = parsed.data;
                    setInquiries(prev => prev.map(inq => inq._id === updatedInq._id ? updatedInq : inq));
                    setSelected(currSelected => currSelected?._id === updatedInq._id ? updatedInq : currSelected);
                    setHistoryInquiry(currHist => currHist?._id === updatedInq._id ? updatedInq : currHist);
                } else if (parsed.type === "delete_all") {
                    setInquiries([]);
                    setSelected(null);
                    setHistoryInquiry(null);
                    if (localDeleteAllRef.current) {
                        localDeleteAllRef.current = false;
                    } else {
                        toast.info("All inquiries deleted by another admin.");
                    }
                }
            } catch (err) {
                console.error("Error parsing SSE event:", err);
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE connection error:", err);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries`);
            const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setInquiries(sorted);

            if (sorted.length > 0) {
                setSelected(prev => {
                    const found = sorted.find(inq => inq._id === prev?._id);
                    return found ? found : sorted[0];
                });
            } else {
                setSelected(null);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "";
        const clean = name.trim().replace(/\s+/g, " ");
        const parts = clean.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name[0]?.toUpperCase() || "";
    };

    const getActivityLog = (item) => {
        if (!item) return [];
        let logs = item.activityLog || [];
        if (logs.length === 0) {
            logs = [{
                action: "Received",
                details: "Inquiry submitted by client.",
                timestamp: item.createdAt
            }];
            if (item.status && item.status !== "New") {
                const mappedStatus = item.status === "In Progress" ? "Responded" : item.status;
                logs.push({
                    action: "Status Changed",
                    details: `Status set to ${mappedStatus}`,
                    timestamp: item.updatedAt
                });
            }
            if (item.assignedTo && item.assignedTo !== "Unassigned") {
                logs.push({
                    action: "Assigned",
                    details: `Assigned to ${item.assignedTo}`,
                    timestamp: item.updatedAt
                });
            }
            if (item.nextFollowUp) {
                logs.push({
                    action: "Follow-up Scheduled",
                    details: `Follow-up scheduled for ${new Date(item.nextFollowUp).toLocaleDateString()}`,
                    timestamp: item.updatedAt
                });
            }
        }
        return [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    };

    const handleActionSubmit = () => {
        if (!selected) {
            toast.error("No inquiry selected!");
            return;
        }

        if (selectedAction === "Convert to Proposal") {
            setProposalSubject(`Proposal for ${selected.service} Consulting Services`);
            setProposalContent(`Dear Client,

Thank you for contacting Strivo Consultancy.

We are pleased to submit our proposal for your consideration.

We propose the following ${selected.service || "consulting"} services tailored to your business needs:

- Strategy & Insights Mapping
- Operational Framework Development
- Process & Timelines Milestones

Pricing:
Timeline:
Deliverables:

Regards,
Strivo Consultancy Team`);
            setProposalBudget("₹ 1,500,000");
            setProposalTimeline("30 Days");
            setProposalNotes([
                { text: `Client is interested in our ${selected.service?.toLowerCase() || "consulting"} services.`, author: "John Doe", time: "11 Jul, 2026, 10:30 AM" },
                { text: "Follow up next week with a detailed proposal.", author: "Jane Smith", time: "11 Jul, 2026, 11:15 AM" }
            ]);
            setProposalAttachments([
                { name: "Project_Overview.pdf", size: "245 KB" }
            ]);
            setActiveView("proposal");
            return;
        }

        let emailSubject = "";
        let emailMessage = "";
        let actionPayload = {};

        if (selectedAction === "Reply by Email") {
            emailSubject = `Re: Strivo Consultancy Inquiry - ${selected.service}`;
            emailMessage = "";
            actionPayload = { status: "Responded" };
        } else if (selectedAction === "Assign to Team") {
            emailSubject = `Inquiry Update - Strivo Consultancy`;
            emailMessage = `Hi ${selected.fullName},\n\nYour inquiry regarding ${selected.service} has been assigned to our team member ${assignedPerson}. They will reach out to you shortly.\n\nRegards,\nStrivo Consultancy Team`;
            actionPayload = { status: "Responded", assignedTo: assignedPerson };
        } else if (selectedAction === "Schedule Follow-up") {
            if (!followUpDate) {
                toast.error("Please choose a follow-up date!");
                return;
            }
            emailSubject = `Follow-up Scheduled - Strivo Consultancy`;
            emailMessage = `Hi ${selected.fullName},\n\nWe have scheduled a follow-up for your inquiry on ${new Date(followUpDate).toLocaleDateString()}.\n\nRegards,\nStrivo Consultancy Team`;
            actionPayload = { status: "Responded", nextFollowUp: new Date(followUpDate) };
        } else if (selectedAction === "Mark as Closed") {
            emailSubject = `Inquiry Closed - Strivo Consultancy`;
            emailMessage = `Hi ${selected.fullName},\n\nWe have marked your inquiry regarding ${selected.service} as closed/resolved. Thank you for reaching out to us.\n\nRegards,\nStrivo Consultancy Team`;
            actionPayload = { status: "Closed" };
        }

        setReply({
            subject: emailSubject,
            message: emailMessage
        });
        setPendingActionPayload(actionPayload);
        setShowReplyModal(true);
    };

    const handleDelete = (id, e) => {
        if (e) e.stopPropagation();
        setDeleteTargetId(id);
        setConfirmModalAction("delete");
        setShowConfirmModal(true);
    };

    const handleDeleteAll = () => {
        setConfirmModalAction("delete_all");
        setShowConfirmModal(true);
    };

    const executeConfirmAction = async () => {
        if (confirmModalAction === "delete" && deleteTargetId) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/${deleteTargetId}`);
                toast.success("Inquiry deleted successfully!");
                const updated = inquiries.filter(inq => inq._id !== deleteTargetId);
                setInquiries(updated);
                if (selected?._id === deleteTargetId) {
                    if (updated.length > 0) {
                        setSelected(updated[0]);
                    } else {
                        setSelected(null);
                    }
                }
            } catch (err) {
                console.log(err);
                toast.error("Failed to delete inquiry.");
            }
        } else if (confirmModalAction === "delete_all") {
            try {
                localDeleteAllRef.current = true;
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries`);
                toast.info("All inquiries deleted successfully!");
                setInquiries([]);
                setSelected(null);
                setHistoryInquiry(null);
            } catch (err) {
                console.log(err);
                toast.error("Failed to delete all inquiries.");
                localDeleteAllRef.current = false;
            }
        }
        setShowConfirmModal(false);
        setConfirmModalAction(null);
        setDeleteTargetId(null);
    };

    const handleReplyChange = (e) => {
        setReply({ ...reply, [e.target.name]: e.target.value });
    };

    const handleSendReply = async () => {
        if (!reply.subject || !reply.message) {
            toast.error("Subject and message are required!");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/reply`, {
                email: selected.email,
                subject: reply.subject,
                message: reply.message,
                inquiryId: selected._id
            });

            const payload = pendingActionPayload || { status: "Responded" };
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/${selected._id}`, payload);

            toast.success("Email sent and action applied successfully!");
            setShowReplyModal(false);
            setPendingActionPayload(null);
            setReply({ subject: "", message: "" });
            fetchInquiries();
        } catch (error) {
            console.log(error);
            toast.error("Failed to send email reply.");
        }
    };

    const handleCopyMessage = () => {
        if (selected && selected.message) {
            navigator.clipboard.writeText(selected.message);
            toast.success("Message copied to clipboard!");
        }
    };

    const handleSendProposal = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/${selected._id}`, {
                status: "Proposals"
            });
            toast.success("Proposal sent to client via email successfully!");
            setActiveView("inquiries");
            fetchInquiries();
        } catch (err) {
            console.error(err);
            toast.error("Failed to send proposal.");
        }
    };

    const generateProposalPDF = (action = 'download') => {
        if (!selected) {
            toast.error("No inquiry selected");
            return;
        }

        const doc = new jsPDF();

        // Color Palette
        const primaryColor = [1, 41, 89]; // #012959 (Navy Blue)

        // Header Banner
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 210, 45, 'F');

        // Header Text
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("STRIVO CONSULTANCY", 15, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Strategic Business Transformations & Consulting Services", 15, 28);
        doc.text("Web: www.strivo-consultancy.com | Email: contact@strivo.com", 15, 34);

        // Document Title
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("BUSINESS PROPOSAL", 130, 25);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Proposal Date: ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`, 130, 31);

        // Horizontal Line
        doc.setDrawColor(226, 232, 240); // Slate-200
        doc.setLineWidth(0.5);
        doc.line(15, 55, 195, 55);

        // Section 1: Inquiry & Client Information
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("CLIENT & INQUIRY INFORMATION", 15, 63);

        doc.setDrawColor(200, 200, 200);
        doc.line(15, 66, 195, 66);

        // Client Info Grid
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(9);
        
        doc.setFont("helvetica", "bold");
        doc.text("Client Name:", 15, 73);
        doc.setFont("helvetica", "normal");
        doc.text(selected.fullName || "N/A", 42, 73);

        doc.setFont("helvetica", "bold");
        doc.text("Company:", 15, 80);
        doc.setFont("helvetica", "normal");
        doc.text(selected.company || "N/A", 42, 80);

        doc.setFont("helvetica", "bold");
        doc.text("Email:", 15, 87);
        doc.setFont("helvetica", "normal");
        doc.text(selected.email || "N/A", 42, 87);

        doc.setFont("helvetica", "bold");
        doc.text("Phone:", 15, 94);
        doc.setFont("helvetica", "normal");
        doc.text(selected.phone || "N/A", 42, 94);

        // Right side info (Service details)
        doc.setFont("helvetica", "bold");
        doc.text("Requested Service:", 110, 73);
        doc.setFont("helvetica", "normal");
        doc.text(selected.service || "N/A", 145, 73);

        doc.setFont("helvetica", "bold");
        doc.text("Received Date:", 110, 80);
        doc.setFont("helvetica", "normal");
        doc.text(new Date(selected.createdAt).toLocaleDateString(), 145, 80);

        doc.setFont("helvetica", "bold");
        doc.text("Estimated Budget:", 110, 87);
        doc.setFont("helvetica", "normal");
        doc.text(proposalBudget || "N/A", 145, 87);

        doc.setFont("helvetica", "bold");
        doc.text("Timeline:", 110, 94);
        doc.setFont("helvetica", "normal");
        doc.text(proposalTimeline || "N/A", 145, 94);

        // Section 2: Proposal Details
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("PROPOSAL DETAILS", 15, 107);
        doc.setDrawColor(200, 200, 200);
        doc.line(15, 110, 195, 110);

        doc.setTextColor(51, 65, 85);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Subject:", 15, 117);
        doc.setFont("helvetica", "normal");
        doc.text(proposalSubject || "N/A", 32, 117);

        // Proposal Content Box
        doc.setFont("helvetica", "bold");
        doc.text("Proposal Content:", 15, 126);
        
        doc.setFont("helvetica", "normal");
        const splitContent = doc.splitTextToSize(proposalContent || "", 180);
        doc.text(splitContent, 15, 133);

        // Footer banner/signature
        const pageHeight = doc.internal.pageSize.height;
        doc.setDrawColor(226, 232, 240);
        doc.line(15, pageHeight - 35, 195, pageHeight - 35);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("Prepared by Strivo Consultancy Consulting Panel.", 15, pageHeight - 28);
        doc.text("This proposal is valid for 30 days from the issue date.", 15, pageHeight - 23);
        doc.text("CONFIDENTIAL - FOR CLIENT USE ONLY", 15, pageHeight - 18);

        // Handle Action
        if (action === 'preview') {
            window.open(doc.output('bloburl'), '_blank');
            toast.success("Generating preview of proposal PDF...");
        } else {
            doc.save(`Proposal_${(selected.fullName || 'Client').replace(/\s+/g, '_')}.pdf`);
            toast.success("Proposal PDF downloaded successfully!");
        }
    };

    const handleSaveDraftProposal = () => {
        toast.success("Proposal saved as draft successfully!");
    };

    const handlePreviewProposal = () => {
        generateProposalPDF('preview');
    };

    const handleGenerateProposalPDF = () => {
        generateProposalPDF('download');
    };

    const handleExportPDF = () => {
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

        // Filter inquiries within range
        const filtered = inquiries.filter(inq => {
            const date = new Date(inq.createdAt);
            return date >= start && date <= end;
        });

        if (filtered.length === 0) {
            toast.error("No inquiries found in this date range!");
            return;
        }

        // Generate print window HTML
        const printWindow = window.open("", "_blank");
        
        const rowsHTML = filtered.map(inq => {
            const dateStr = new Date(inq.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' });
            return `
                <tr style="border-bottom: 1px solid #cbd5e1;">
                    <td style="padding: 12px 10px; font-weight: 600; color: #0f172a; font-size: 11px;">${inq.fullName ? inq.fullName.toUpperCase() : ''}</td>
                    <td style="padding: 12px 10px; color: #334155; font-size: 11px;">${inq.phone || "-"}</td>
                    <td style="padding: 12px 10px; color: #334155; font-size: 11px; text-transform: lowercase;">${inq.email || ''}</td>
                    <td style="padding: 12px 10px; color: #334155; font-size: 11px;">
                        <div style="font-weight: 600; color: #0f172a;">${inq.service || ''}</div>
                        <div style="font-size: 10px; color: #64748b; margin-top: 3px; line-height: 1.4;">${inq.message || ''}</div>
                    </td>
                    <td style="padding: 12px 10px; text-transform: uppercase; font-size: 10px; font-weight: 700;">
                        <span style="color: ${inq.status === 'Closed' ? '#64748b' : inq.status === 'Proposals' ? '#f59e0b' : inq.status === 'New' ? '#10b981' : '#2563eb'};">
                            ${(inq.status === 'In Progress' ? 'Responded' : inq.status).toUpperCase()}
                        </span>
                    </td>
                    <td style="padding: 12px 10px; color: #334155; font-size: 11px;">${dateStr ? dateStr.toUpperCase() : ''}</td>
                </tr>
            `;
        }).join("");

        const docHTML = `
            <html>
                <head>
                    <title>Strivo Consultancy - Inquiries Statement</title>
                    <style>
                        @media print {
                            body { margin: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                            .no-print { display: none; }
                        }
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px auto; max-width: 900px; color: #0f172a; padding: 0 15px; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
                        .logo-text { font-size: 24px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px; }
                        .statement-title { font-size: 14px; font-weight: 700; color: #64748b; text-transform: uppercase; text-align: right; line-height: 1.4; }
                        .metadata { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 25px; color: #475569; border-bottom: 1px solid #cbd5e1; padding-bottom: 15px; }
                        table { width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 30px; }
                        th { background-color: #f8fafc; border-bottom: 2px solid #94a3b8; padding: 12px 10px; font-weight: 700; text-transform: uppercase; color: #475569; font-size: 10px; }
                        .footer { border-top: 1px solid #cbd5e1; padding-top: 15px; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; margin-top: 50px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <div class="logo-text">Strivo Consultancy</div>
                            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">TechPark Tower, Kakkanad, Kochi, Kerala</div>
                        </div>
                        <div class="statement-title">
                            Inquiries Statement<br/>
                            <span style="font-size: 11px; font-weight: normal; color: #475569;">Range: ${exportFromDate} to ${exportToDate}</span>
                        </div>
                    </div>
                    
                    <div class="metadata">
                        <div>
                            <strong>Generated On:</strong> ${new Date().toLocaleString()}<br/>
                            <strong>Period:</strong> ${exportFromDate} - ${exportToDate}
                        </div>
                        <div style="text-align: right;">
                            <strong>Total Entries:</strong> ${filtered.length}<br/>
                            <strong>Role:</strong> Administrator
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width: 18%;">Client Name</th>
                                <th style="width: 13%;">Phone</th>
                                <th style="width: 20%;">Email</th>
                                <th style="width: 27%;">Inquiry Details</th>
                                <th style="width: 10%;">Status</th>
                                <th style="width: 12%;">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHTML}
                        </tbody>
                    </table>

                    <div class="footer">
                        <div>© ${new Date().getFullYear()} Strivo Consultancy. Confidential document for internal use only.</div>
                        <div style="text-align: right;">Page 1 of 1</div>
                    </div>

                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 500);
                        }
                    </script>
                </body>
            </html>
        `;

        printWindow.document.write(docHTML);
        printWindow.document.close();
        setShowExportModal(false);
    };

    // Clean status dot colors
    const getStatusDotColor = (status) => {
        const mapped = status === "In Progress" ? "Responded" : status;
        if (mapped === "New") return "bg-[var(--color-success)]";
        if (mapped === "Responded") return "bg-[var(--color-primary)]";
        if (mapped === "General Inquiry") return "bg-[var(--color-navlink)]";
        if (mapped === "Proposals") return "bg-[var(--color-warning)]";
        return "bg-gray-400";
    };

    // Filters for left panel list
    const filteredLeftInquiries = inquiries.filter(item => {
        const matchesSearch = 
            item.fullName?.toLowerCase().includes(leftSearch.toLowerCase()) ||
            item.email?.toLowerCase().includes(leftSearch.toLowerCase()) ||
            item.company?.toLowerCase().includes(leftSearch.toLowerCase());
        
        const mappedStatus = item.status === "In Progress" ? "Responded" : item.status;
        const matchesStatus = leftStatusFilter === "All" || mappedStatus === leftStatusFilter;
        return matchesSearch && matchesStatus;
    });

    const leftTotalPages = Math.ceil(filteredLeftInquiries.length / leftItemsPerPage);
    const paginatedLeftInquiries = filteredLeftInquiries.slice(
        (leftPage - 1) * leftItemsPerPage,
        leftPage * leftItemsPerPage
    );

    // Filters for bottom table
    const filteredTableInquiries = inquiries.filter(item => {
        if (tableFilter === "All Inquiries") return true;
        if (tableFilter === "Proposals") return item.status === "Proposals";
        if (tableFilter === "Assigned to Team") return item.assignedTo && item.assignedTo !== "Unassigned";
        if (tableFilter === "Follow-ups") return item.nextFollowUp !== null;
        return true;
    });

    const tableTotalPages = Math.ceil(filteredTableInquiries.length / tableItemsPerPage);
    const paginatedTableInquiries = filteredTableInquiries.slice(
        (tablePage - 1) * tableItemsPerPage,
        tablePage * tableItemsPerPage
    );

    // Inquiries status totals analytics
    const totalInquiries = inquiries.length;
    
    const statusCounts = inquiries.reduce((acc, curr) => {
        const mapped = curr.status === "In Progress" ? "Responded" : curr.status;
        acc[mapped] = (acc[mapped] || 0) + 1;
        return acc;
    }, { New: 0, Responded: 0, Proposals: 0, Closed: 0 });

    const radius = 40;
    const circumference = 2 * Math.PI * radius; // ~251.327
    const totalInquiriesForDonut = totalInquiries || 1;
    const statusColors = {
        New: "var(--color-success)",
        Responded: "var(--color-primary)",
        Proposals: "var(--color-warning)",
        Closed: "#94a3b8" // Slate gray
    };

    const statusMap = Object.keys(statusCounts).map(name => ({
        name,
        count: statusCounts[name],
        color: statusColors[name]
    })).sort((a, b) => b.count - a.count);

    let currentOffset = 0;
    const donutSegments = [];
    statusMap.forEach(segment => {
        if (segment.count > 0) {
            const percentage = segment.count / totalInquiriesForDonut;
            const strokeLength = percentage * circumference;
            const strokeOffset = circumference - strokeLength + currentOffset;

            donutSegments.push({
                color: segment.color,
                strokeOffset: strokeOffset
            });

            currentOffset = currentOffset - strokeLength;
        }
    });

    if (loading) {
        return <LoadingIndicator />;
    }

    if (activeView === "proposal") {
        return (
            <div className="min-h-screen bg-sub flex flex-col pt-20 px-4 md:px-8 lg:px-12 text-[var(--color-black)]" style={{ fontFamily: 'var(--font-primary)' }}>
                {/* Proposal view Header */}
                <div className="max-w-[98%] mx-auto w-full mb-6 text-left">
                    <button 
                        onClick={() => setActiveView("inquiries")}
                        className="flex items-center gap-2 text-sm font-[var(--font-normal)] text-[var(--color-primary)] hover:underline mb-3 cursor-pointer bg-transparent border-0"
                        style={{ fontWeight: 'normal' }}
                    >
                        <FiArrowLeft size={16} />
                        Back to Inquiries / Convert to Proposal
                    </button>
                    <h1 className="text-2xl font-[var(--font-bold)] text-[var(--color-primary)] uppercase tracking-tight">
                        Convert to Proposal
                    </h1>
                    <p className="text-xs text-gray-555 font-medium mt-1">
                        Create and send a proposal for this inquiry
                    </p>
                </div>

                {/* 4 Columns Layout */}
                <div className="max-w-[98%] mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start pb-12 text-left">
                    
                    {/* Col 1: Inquiry Information */}
                    <div className="bg-white p-4 border border-[var(--color-border)] rounded-[var(--radius-sm)] flex flex-col gap-4 shadow-sm">
                        <div>
                            <h2 className="text-sm font-[var(--font-normal)] text-[var(--color-primary)] uppercase border-b pb-2 mb-3" style={{ fontWeight: 'normal' }}>
                                Inquiry Information
                            </h2>
                            <div className="space-y-2 text-xs">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-[var(--font-normal)] uppercase" style={{ fontWeight: 'normal' }}>Client Name</span>
                                    <span className="font-[var(--font-normal)] text-[var(--color-black)]" style={{ fontWeight: 'normal' }}>{selected?.fullName}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-[var(--font-normal)] uppercase" style={{ fontWeight: 'normal' }}>Company</span>
                                    <span className="font-[var(--font-normal)] text-[var(--color-black)]" style={{ fontWeight: 'normal' }}>{selected?.company || "Individual client"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-[var(--font-normal)] uppercase" style={{ fontWeight: 'normal' }}>Email</span>
                                    <span className="font-[var(--font-normal)] text-[var(--color-black)] break-all" style={{ fontWeight: 'normal' }}>{selected?.email}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-[var(--font-normal)] uppercase" style={{ fontWeight: 'normal' }}>Phone</span>
                                    <span className="font-[var(--font-normal)] text-[var(--color-black)]" style={{ fontWeight: 'normal' }}>{selected?.phone || "-"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-455 font-[var(--font-normal)] uppercase" style={{ fontWeight: 'normal' }}>Service</span>
                                    <span className="font-[var(--font-normal)] text-[var(--color-black)]" style={{ fontWeight: 'normal' }}>{selected?.service}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-[var(--font-normal)] uppercase" style={{ fontWeight: 'normal' }}>Received Date</span>
                                    <span className="font-[var(--font-normal)] text-[var(--color-black)]" style={{ fontWeight: 'normal' }}>{selected ? new Date(selected.createdAt).toLocaleString() : "-"}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-[var(--font-normal)] text-[var(--color-black)] uppercase tracking-wider mb-2 border-b pb-1.5" style={{ fontWeight: 'normal' }}>
                                Notes ({proposalNotes.length})
                            </h3>
                            <div className="space-y-3">
                                {proposalNotes.map((note, idx) => (
                                    <div key={idx} className="bg-gray-55 p-2.5 rounded-[var(--radius-sm)] border border-gray-200 text-xs">
                                        <p className="text-[var(--color-paragraph)] leading-normal">{note.text}</p>
                                        <div className="mt-1.5 flex justify-between items-center text-[10px] text-gray-400 font-medium">
                                            <span>{note.author}</span>
                                            <span>{note.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="text-[11px] text-[var(--color-primary)] font-[var(--font-normal)] mt-3 block hover:underline w-full text-center bg-transparent border-0" style={{ fontWeight: 'normal' }}>
                                View All Notes
                            </button>
                        </div>
                    </div>

                    {/* Col 2: Proposal Builder */}
                    <div className="bg-white p-4 border border-[var(--color-border)] rounded-[var(--radius-sm)] flex flex-col gap-4 shadow-sm lg:col-span-1">
                        <h2 className="text-sm font-[var(--font-normal)] text-[var(--color-primary)] uppercase border-b pb-2 mb-1" style={{ fontWeight: 'normal' }}>
                            Proposal Builder
                        </h2>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-[var(--font-normal)] text-[var(--color-black)] uppercase" style={{ fontWeight: 'normal' }}>
                                Subject <span className="text-red-550">*</span>
                            </label>
                            <input
                                type="text"
                                value={proposalSubject}
                                onChange={(e) => setProposalSubject(e.target.value)}
                                className="w-full border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-xs text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] bg-white font-normal"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-[var(--font-normal)] text-[var(--color-black)] uppercase" style={{ fontWeight: 'normal' }}>
                                Proposal Content <span className="text-red-555">*</span>
                            </label>
                            {/* Rich toolbar mock */}
                            <div className="flex items-center gap-1 border border-[var(--color-border)] border-b-0 px-2 py-1.5 bg-gray-55 rounded-t-[var(--radius-sm)] flex-wrap text-xs text-gray-550">
                                <button className="font-normal px-1.5 py-0.5 hover:bg-gray-200 rounded border-0 bg-transparent cursor-pointer">B</button>
                                <button className="italic px-1.5 py-0.5 hover:bg-gray-200 rounded border-0 bg-transparent cursor-pointer">I</button>
                                <button className="underline px-1.5 py-0.5 hover:bg-gray-200 rounded border-0 bg-transparent cursor-pointer">U</button>
                                <span className="text-gray-300 mx-1">|</span>
                                <button className="px-1.5 py-0.5 hover:bg-gray-200 rounded border-0 bg-transparent cursor-pointer">List</button>
                                <button className="px-1.5 py-0.5 hover:bg-gray-200 rounded border-0 bg-transparent cursor-pointer">Link</button>
                            </div>
                            <textarea
                                value={proposalContent}
                                rows={10}
                                onChange={(e) => setProposalContent(e.target.value)}
                                className="w-full border border-[var(--color-border)] rounded-b-[var(--radius-sm)] px-3 py-2 text-xs text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] font-mono resize-none leading-relaxed bg-white font-normal"
                            />
                        </div>
                    </div>

                    {/* Col 3: Budget and Attachments */}
                    <div className="bg-white p-4 border border-[var(--color-border)] rounded-[var(--radius-sm)] flex flex-col gap-4 shadow-sm">
                        <h2 className="text-sm font-[var(--font-normal)] text-[var(--color-primary)] uppercase border-b pb-2 mb-1" style={{ fontWeight: 'normal' }}>
                            Estimated Budget
                        </h2>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-[var(--font-normal)] text-[var(--color-black)] uppercase" style={{ fontWeight: 'normal' }}>
                                Budget (₹)
                            </label>
                            <input
                                type="text"
                                value={proposalBudget}
                                onChange={(e) => setProposalBudget(e.target.value)}
                                className="w-full border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-xs text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] bg-white font-normal"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-[var(--font-normal)] text-[var(--color-black)] uppercase" style={{ fontWeight: 'normal' }}>
                                Timeline
                            </label>
                            <input
                                type="text"
                                value={proposalTimeline}
                                onChange={(e) => setProposalTimeline(e.target.value)}
                                className="w-full border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-xs text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] bg-white font-normal"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 mt-2">
                            <label className="text-[11px] font-[var(--font-normal)] text-[var(--color-black)] uppercase" style={{ fontWeight: 'normal' }}>
                                Attachments
                            </label>
                            <div className="border border-dashed border-gray-300 rounded-[var(--radius-sm)] p-4 flex flex-col items-center justify-center gap-1 bg-gray-50/50 hover:bg-gray-55 transition cursor-pointer">
                                <FiDownload className="text-gray-400 text-lg mb-1" />
                                <span className="text-[11px] text-[var(--color-primary)] font-semibold">Drag & drop files here</span>
                                <span className="text-[9px] text-gray-400">or click to browse (Max. 10MB)</span>
                            </div>
                        </div>

                        {proposalAttachments.length > 0 && (
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                                    Attached Files ({proposalAttachments.length})
                                </span>
                                <div className="space-y-1.5">
                                    {proposalAttachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-gray-55 border border-[var(--color-border)] p-2 rounded-[var(--radius-sm)] text-[11px]">
                                            <div className="flex items-center gap-2 truncate">
                                                <FiPaperclip className="text-gray-400 shrink-0" />
                                                <span className="font-semibold truncate text-[var(--color-black)]">{file.name}</span>
                                                <span className="text-[9px] text-gray-400">({file.size})</span>
                                            </div>
                                            <button className="text-red-550 hover:text-red-770 bg-transparent shrink-0 border-0">
                                                <FiTrash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Col 4: Proposal Actions */}
                    <div className="bg-white p-4 border border-[var(--color-border)] rounded-[var(--radius-sm)] flex flex-col gap-4 shadow-sm">
                        <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase border-b pb-2 mb-2">
                            Proposal Actions
                        </h2>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handlePreviewProposal}
                                className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 transition py-2.5 rounded-[var(--radius-sm)] text-xs text-[var(--color-black)] font-normal bg-white cursor-pointer"
                                style={{ fontWeight: 'normal' }}
                            >
                                <FiEdit3 size={14} />
                                Preview PDF
                            </button>

                            <button
                                onClick={handleGenerateProposalPDF}
                                className="btn w-full flex items-center justify-center gap-2 text-white transition py-1.5 rounded-[var(--radius-sm)] text-xs font-normal cursor-pointer border-0 h-8"
                                style={{ fontWeight: 'normal' }}
                            >
                                <FiFileText size={14} />
                                Generate PDF
                            </button>

                            <button
                                onClick={handleSendProposal}
                                className="w-full flex items-center justify-center gap-2 bg-[var(--color-success)] hover:opacity-90 text-white transition py-2 rounded-[var(--radius-sm)] text-xs font-normal cursor-pointer border-0 h-8"
                                style={{ fontWeight: 'normal' }}
                            >
                                <FiSend size={14} />
                                Send Proposal
                            </button>

                            <button
                                onClick={handleSaveDraftProposal}
                                className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 transition py-2 rounded-[var(--radius-sm)] text-xs text-[var(--color-black)] font-normal bg-white cursor-pointer h-8"
                                style={{ fontWeight: 'normal' }}
                            >
                                <FiArchive size={14} />
                                Save as Draft
                            </button>
                        </div>

                        <div className="bg-blue-50/60 p-3 border border-blue-100 rounded-[var(--radius-sm)] mt-4">
                            <p className="text-[10px] text-blue-800 leading-normal font-medium">
                                After sending, the status will be updated to "Proposals" automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (activeView === "history" && historyInquiry) {
        const inqStatus = historyInquiry.status === "In Progress" ? "Responded" : historyInquiry.status;
        return (
            <div className="min-h-screen bg-sub flex flex-col pt-0 text-[var(--color-black)] font-primary" style={{ fontFamily: 'var(--font-primary)' }}>
                {/* Dedicated page Top Header Section with bg-main spanning full-width */}
                <div className="bg-main pt-24 pb-6 border-b border-[var(--color-border)] px-4 sm:px-8 md:px-16 lg:px-24">
                    <div className="max-w-[98%] mx-auto">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
                            <div className="text-left">
                                <button 
                                    onClick={() => {
                                        setActiveView("inquiries");
                                        setHistoryInquiry(null);
                                    }}
                                    className="flex items-center gap-2 text-sm font-normal text-[var(--color-primary)] hover:underline mb-2 cursor-pointer bg-transparent border-0"
                                    style={{ fontWeight: 'normal' }}
                                >
                                    <FiArrowLeft size={15} />
                                    Back to Inquiries list
                                </button>
                                <h1 className="text-2xl font-[var(--font-bold)] text-primary leading-none uppercase" style={{ margin: 0 }}>
                                    INQUIRY HISTORY DETAILS
                                </h1>
                                <p className="text-xs text-[var(--color-black)] font-medium opacity-85 mt-2" style={{ margin: '6px 0 0 0', lineHeight: 1.3 }}>
                                    Received on {new Date(historyInquiry.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Content Columns */}
                <div className="flex-grow py-8 px-4 sm:px-8 md:px-16 lg:px-24">
                    <div className="max-w-[98%] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-left">
                        
                        {/* Column 1: Client Profile Details Card */}
                        <div className="card bg-white p-5 border border-[var(--color-border)] rounded-[var(--radius-sm)] flex flex-col gap-4 shadow-sm">
                            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase border-b pb-2 mb-1">
                                Client Profile
                            </h2>
                            <div className="space-y-3.5 text-sm text-[var(--color-black)] font-medium">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Client Name</span>
                                    <span className="text-base font-bold text-[var(--color-primary)]">{historyInquiry.fullName}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Company</span>
                                    <span>{historyInquiry.company || "Individual Client"}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Email</span>
                                    <span className="break-all">{historyInquiry.email}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Phone</span>
                                    <span>{historyInquiry.phone || "-"}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Service Requested</span>
                                    <span>{historyInquiry.service}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-gray-450 font-bold uppercase">Assigned To</span>
                                    <span className="text-sm font-semibold">{historyInquiry.assignedTo || "Unassigned"}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-gray-450 font-bold uppercase">Last Activity</span>
                                    <span className="text-xs font-semibold">{new Date(historyInquiry.updatedAt).toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-gray-450 font-bold uppercase">Status</span>
                                    <div className="flex items-center gap-1.5 select-none">
                                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(historyInquiry.status)}`} />
                                        <span className="text-xs font-semibold text-[var(--color-black)] uppercase tracking-wider">
                                            {inqStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Client Original Query Text Quote box */}
                        <div className="card bg-white p-5 border border-[var(--color-border)] rounded-[var(--radius-sm)] flex flex-col gap-4 shadow-sm">
                            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase border-b pb-2 mb-1">
                                Client Message Query
                            </h2>
                            <div className="border-l-4 border-[var(--color-primary)] pl-4 py-2 bg-gray-50/60 rounded-r-[var(--radius-sm)]">
                                <p className="text-sm text-[var(--color-paragraph)] leading-relaxed whitespace-pre-wrap font-normal">
                                    "{historyInquiry.message}"
                                </p>
                            </div>
                        </div>

                        {/* Column 3: Chronological logs timeline */}
                        <div className="card bg-white p-5 border border-[var(--color-border)] rounded-[var(--radius-sm)] flex flex-col gap-4 shadow-sm">
                            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase border-b pb-2 mb-1">
                                Activity Logs & Timeline
                            </h2>
                            {getActivityLog(historyInquiry).length === 0 ? (
                                <p className="text-xs text-gray-455 italic">No activity recorded yet.</p>
                            ) : (
                                <div className="relative border-l-2 border-gray-200 pl-5 ml-2.5 space-y-5 font-normal">
                                    {getActivityLog(historyInquiry).map((log, idx) => (
                                        <div key={idx} className="relative text-left">
                                            {/* timeline marker */}
                                            <span className="absolute -left-[26px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] border border-white" />
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 text-xs">
                                                <div>
                                                    <span className="font-bold text-[var(--color-black)] text-sm block">
                                                        {log.action}
                                                    </span>
                                                    {log.details && (
                                                        <p className="text-xs text-[var(--color-paragraph)] leading-relaxed mt-0.5 font-normal">
                                                            {log.details}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-gray-450 font-normal shrink-0 mt-0.5">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sub flex flex-col pt-0 text-[var(--color-black)] font-primary" style={{ fontFamily: 'var(--font-primary)' }}>
            
            {/* Top Header Section with bg-main spanning full-width */}
            <div className="bg-main pt-24 pb-6 border-b border-[var(--color-border)] px-4 sm:px-8 md:px-16 lg:px-24">
                <div className="max-w-[98%] mx-auto">
                    
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
                        <div className="text-left">
                            <h1 className="text-2xl font-[var(--font-bold)] text-primary leading-none uppercase" style={{ margin: 0 }}>
                                INQUIRIES
                            </h1>
                            <p className="text-xs text-[var(--color-black)] font-medium opacity-85 mt-2" style={{ margin: '6px 0 0 0', lineHeight: 1.3 }}>
                                Manage and respond to client inquiries in real-time.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* Reconfigured Delete All Button styled as brand outline button */}
                            <button
                                onClick={handleDeleteAll}
                                className="bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:text-white hover:bg-[var(--color-primary)] px-2.5 py-1.5 rounded-[var(--radius-sm)] flex items-center justify-center gap-2 transition cursor-pointer h-8 text-xs font-normal w-full sm:w-auto border-solid"
                                style={{ fontWeight: 'normal' }}
                            >
                                <FiTrash2 size={13} />
                                Delete All
                            </button>
                            <button
                                onClick={() => setShowAnalyticsModal(true)}
                                className="bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:text-white hover:bg-[var(--color-primary)] px-2.5 py-1.5 rounded-[var(--radius-sm)] flex items-center justify-center gap-2 transition cursor-pointer h-8 text-xs font-normal w-full sm:w-auto border-solid"
                                style={{ fontWeight: 'normal' }}
                            >
                                <FiBarChart2 size={13} />
                                Analytics
                            </button>
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="btn px-2.5 py-1.5 flex items-center justify-center gap-2 cursor-pointer border-none h-8 text-xs font-normal w-full sm:w-auto text-white"
                                style={{ fontWeight: 'normal' }}
                            >
                                <FiFileText size={13} />
                                Export to PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Content Container - Rendered over grey backdrop (bg-sub) */}
            <div className="flex-grow py-8 px-4 sm:px-8 md:px-16 lg:px-24">
                <div className="max-w-[98%] mx-auto">
                    
                    {/* 2-Column Master-Detail Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-5 mb-8 items-start">
                        
                        {/* Column 1: Inquiry List */}
                        <div className="bg-white p-4 border border-[var(--color-border)] rounded-[var(--radius-sm)] h-auto lg:h-[430px] min-h-[350px] flex flex-col justify-between shadow-sm">
                            {/* Toolbar header exactly like ArticlesAdmin.jsx */}
                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--color-border)]/65">
                                <h3 className="font-bold text-primary text-xs uppercase tracking-wider" style={{ margin: 0 }}>
                                    Inquiries
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    {/* Search Query Input & Toggle Button */}
                                    <div className="flex items-center gap-1.5">
                                        {isSearchOpen && (
                                            <input
                                                type="text"
                                                value={leftSearch}
                                                onChange={(e) => {
                                                    setLeftSearch(e.target.value);
                                                    setLeftPage(1);
                                                }}
                                                placeholder="Search Inquiries..."
                                                className="border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-0.5 text-xs outline-none bg-[var(--color-sub-bg)] focus:bg-white text-[var(--color-black)] w-28 sm:w-36 transition-all duration-300 font-medium"
                                            />
                                        )}
                                        <button
                                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                                            className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                                                isSearchOpen 
                                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' 
                                                    : 'border-[var(--color-border)] bg-white text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)]'
                                            }`}
                                            title="Search Inquiries"
                                        >
                                            <FiSearch size={12} />
                                        </button>
                                    </div>

                                    {/* Status Dropdown & Toggle Button */}
                                    <div className="flex items-center gap-1.5">
                                        {isStatusOpen && (
                                            <select
                                                value={leftStatusFilter}
                                                onChange={(e) => {
                                                    setLeftStatusFilter(e.target.value);
                                                    setLeftPage(1);
                                                }}
                                                className="border border-[var(--color-border)] rounded-[var(--radius-sm)] px-1.5 py-0.5 text-xs outline-none bg-white text-[var(--color-black)] transition-all duration-300 font-semibold cursor-pointer"
                                            >
                                                <option value="All">All Status</option>
                                                <option value="New">New</option>
                                                <option value="Responded">Responded</option>
                                                <option value="Proposals">Proposals</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        )}
                                        <button
                                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                                            className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                                                isStatusOpen 
                                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' 
                                                    : 'border-[var(--color-border)] bg-white text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)]'
                                            }`}
                                            title="Filter Status"
                                        >
                                            <FiChevronDown size={12} className={`transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 pr-1 mb-2">
                                {paginatedLeftInquiries.length === 0 ? (
                                    <p className="py-12 text-center text-gray-400 text-sm font-semibold">
                                        No inquiries found matching filters.
                                    </p>
                                ) : (
                                    paginatedLeftInquiries.map((item) => {
                                        const isSel = selected?._id === item._id;
                                        const cardStatus = item.status === "In Progress" ? "Responded" : item.status;
                                        return (
                                            <div
                                                key={item._id}
                                                onClick={() => setSelected(item)}
                                                className={`cursor-pointer border p-2.5 sm:p-3 transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-gray-50/50 relative group ${
                                                    isSel
                                                        ? "border-[var(--color-primary)] bg-blue-50/20"
                                                        : "border-[var(--color-border)]"
                                                }`}
                                                style={{ borderRadius: 'var(--radius-sm)' }}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {/* Replaced numbering badge circle with clean circular name initials avatar */}
                                                        <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                                                            {getInitials(item.fullName)}
                                                        </div>
                                                        <div className="min-w-0 text-left">
                                                            <h3 className="font-bold text-[var(--color-black)] text-sm truncate leading-tight">
                                                                {item.fullName ? item.fullName.toUpperCase() : ''}
                                                            </h3>
                                                            <p className="text-xs text-gray-455 font-semibold truncate mt-0.5">
                                                                {item.company ? item.company.toUpperCase() : "INDIVIDUAL CLIENT"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                        {/* Switched to clean plain text format with status dot indicator */}
                                                        <div className="flex items-center gap-1.5 select-none">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(item.status)}`} />
                                                            <span className="text-[11px] font-semibold text-[var(--color-black)] uppercase tracking-wider">
                                                                {cardStatus ? cardStatus.toUpperCase() : ''}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-400 font-semibold group-hover:hidden">
                                                                {new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                                                            </span>
                                                            {/* Reconfigured card trash icon styled to match primary blue brand theme */}
                                                            <button
                                                                onClick={(e) => handleDelete(item._id, e)}
                                                                className="hidden group-hover:flex w-7 h-7 items-center justify-center border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition cursor-pointer rounded-[var(--radius-sm)] shrink-0"
                                                                title="Delete Inquiry"
                                                            >
                                                                <FiTrash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination for Left Column list */}
                            {leftTotalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 pt-3 border-t border-[var(--color-border)] mt-4">
                                    <button
                                        disabled={leftPage === 1}
                                        onClick={() => setLeftPage(prev => Math.max(prev - 1, 1))}
                                        className="px-2.5 py-1 text-xs border border-[var(--color-border)] text-black bg-white rounded-[var(--radius-sm)] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                    >
                                        &lt;
                                    </button>
                                    <span className="text-xs font-bold text-gray-505">
                                        Page {leftPage} of {leftTotalPages}
                                    </span>
                                    <button
                                        disabled={leftPage === leftTotalPages}
                                        onClick={() => setLeftPage(prev => Math.min(prev + 1, leftTotalPages))}
                                        className="px-2.5 py-1 text-xs border border-[var(--color-border)] text-black bg-white rounded-[var(--radius-sm)] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Column 2: Inquiry Details + Conversation (Stacked Panel) */}
                        <div className="bg-white p-4 border border-[var(--color-border)] rounded-[var(--radius-sm)] h-auto lg:h-[430px] flex flex-col justify-between shadow-sm text-left">
                            {selected ? (
                                <div className="flex flex-col h-full justify-between overflow-y-auto scrollbar-hide pr-1">
                                    
                                    {/* SECTION 1: Client Info Header */}
                                    <div className="flex flex-col gap-1 pb-3 border-b border-[var(--color-border)] select-none">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-base font-bold text-black uppercase tracking-wide">{selected.fullName ? selected.fullName.toUpperCase() : ''}</h2>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(selected.status)}`} />
                                                <span className="text-xs font-bold text-[var(--color-black)] uppercase tracking-wider">
                                                    {(selected.status === 'In Progress' ? 'Responded' : selected.status).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-[var(--color-paragraph)] font-normal mt-0.5">
                                            <span className="font-semibold select-text" style={{ textTransform: 'lowercase' }}>{selected.email || ''}</span>
                                            <span className="font-semibold">{selected.phone || "-"}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-[var(--color-paragraph)] font-normal">
                                            <span className="font-semibold">{selected.service || ''}</span>
                                            <span className="font-semibold">{new Date(selected.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase()}</span>
                                        </div>
                                    </div>

                                    {/* SECTION 2: Assigned & Last Activity Columns */}
                                    <div className="grid grid-cols-2 border-b border-[var(--color-border)] py-3 text-xs font-normal">
                                        <div className="border-r border-[var(--color-border)] pr-4 text-left">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ASSIGNED TO</div>
                                            <div className="text-[var(--color-black)] font-semibold">{selected.assignedTo ? selected.assignedTo.toUpperCase() : "UNASSIGNED"}</div>
                                        </div>
                                        <div className="pl-4 text-left">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">LAST ACTIVITY</div>
                                            <div className="text-[var(--color-black)] font-semibold">{new Date(selected.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' }).toUpperCase()}</div>
                                        </div>
                                    </div>

                                    {/* SECTION 3: Message Content Box */}
                                    <div className="flex flex-col flex-grow py-3 min-h-[110px] overflow-hidden justify-between">
                                        <div className="flex justify-between items-center mb-1.5 select-none">
                                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">MESSAGE</h3>
                                            <button 
                                                onClick={handleCopyMessage}
                                                className="text-[10px] font-bold text-[var(--color-primary)] hover:underline cursor-pointer bg-transparent border-none outline-none"
                                            >
                                                COPY
                                            </button>
                                        </div>
                                        <div className="flex-grow overflow-y-auto scrollbar-hide bg-gray-50 p-3 rounded-[var(--radius-sm)] border border-gray-100 text-left">
                                            <p className="text-xs text-[var(--color-paragraph)] leading-relaxed whitespace-pre-wrap font-normal">
                                                {selected.message || ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* SECTION 4: Action & Submit Footer */}
                                    <div className="pt-3 border-t border-[var(--color-border)] flex flex-col gap-2 bg-white">
                                        <div className="flex justify-between items-center select-none">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                Action
                                            </label>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2 flex-grow">
                                                <div className="relative w-full sm:w-[155px]">
                                                    <select
                                                        value={selectedAction}
                                                        onChange={(e) => setSelectedAction(e.target.value)}
                                                        className="appearance-none w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] pl-3 pr-8 py-2 text-xs text-[var(--color-paragraph)] outline-none focus:border-[var(--color-primary)] cursor-pointer transition font-normal font-semibold"
                                                    >
                                                        <option value="Reply by Email">Reply by Email</option>
                                                        <option value="Convert to Proposal">Convert to Proposal</option>
                                                        <option value="Assign to Team">Assign to Team</option>
                                                        <option value="Schedule Follow-up">Schedule Follow-up</option>
                                                        <option value="Mark as Closed">Mark as Closed</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-paragraph)] opacity-60">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {selectedAction === "Assign to Team" && (
                                                    <div className="relative w-full sm:w-[145px] animate-fadeIn">
                                                        <select
                                                            value={assignedPerson}
                                                            onChange={(e) => setAssignedPerson(e.target.value)}
                                                            className="appearance-none w-full bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] pl-3 pr-8 py-2 text-xs text-[var(--color-paragraph)] outline-none focus:border-[var(--color-primary)] cursor-pointer transition font-normal"
                                                        >
                                                            <option value="Vishnu">Vishnu</option>
                                                            <option value="Namitha">Namitha</option>
                                                            <option value="Najma">Najma</option>
                                                        </select>
                                                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-paragraph)] opacity-60">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedAction === "Schedule Follow-up" && (
                                                    <div className="w-full sm:w-[145px] animate-fadeIn">
                                                        <input
                                                            type="date"
                                                            value={followUpDate}
                                                            onChange={(e) => setFollowUpDate(e.target.value)}
                                                            className="w-full border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-1.5 text-xs text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] bg-white font-normal h-[34px]"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={handleActionSubmit}
                                                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center border-none h-[34px] px-5 transition shrink-0"
                                                style={{ fontWeight: 'normal' }}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-semibold">
                                    Select an inquiry to view details.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Section: Inquiries Overview Card/Table */}
                    <div className="card bg-white p-6 shadow-card relative overflow-hidden w-full text-left" style={{ borderRadius: 'var(--radius-sm)' }}>
                        
                        {/* Table Header Row & Tabs styled exactly like Current Articles in ArticlesAdmin.jsx */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-2 border-b border-[var(--color-border)]/50">
                            <h2 className="text-primary" style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                                Inquiries Overview
                            </h2>
                            
                            <div className="flex gap-2.5 overflow-x-auto w-full sm:w-auto scrollbar-hide py-1">
                                {["All Inquiries", "Proposals", "Assigned to Team", "Follow-ups"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setTableFilter(tab);
                                            setTablePage(1);
                                        }}
                                        className={`px-3 py-1.5 text-xs font-[var(--font-normal)] border-b-2 transition cursor-pointer whitespace-nowrap bg-transparent border-0 ${
                                            tableFilter === tab
                                                ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-blue-50/10"
                                                : "border-transparent text-gray-500 hover:text-[var(--color-primary)]"
                                        }`}
                                        style={{ fontWeight: 'normal' }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Dashboard Card Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {paginatedTableInquiries.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-gray-400 font-semibold text-sm">
                                    No entries found matching filters.
                                </div>
                            ) : (
                                paginatedTableInquiries.map((item) => {
                                    const nextFollowUpStr = item.nextFollowUp 
                                        ? new Date(item.nextFollowUp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
                                        : "-";
                                    const tblStatus = item.status === "In Progress" ? "Responded" : item.status;
                                    const initials = item.fullName 
                                        ? item.fullName.trim().split(/\s+/).map(n => n[0]).join("").toUpperCase().slice(0, 2)
                                        : "C";

                                    return (
                                        <div 
                                            key={item._id} 
                                            className="bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between p-5"
                                            style={{ borderRadius: 'var(--radius-sm)' }}
                                        >
                                            {/* Card Top: Initials Avatar and Client Identifier */}
                                            <div className="flex items-center gap-3 border-b border-[var(--color-border)]/50 pb-3 mb-3 text-left">
                                                <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                                                    {initials}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-bold text-[var(--color-black)] text-sm truncate leading-snug">
                                                        {item.fullName ? item.fullName.toUpperCase() : ''}
                                                    </h3>
                                                    <p className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">
                                                        {item.company ? item.company.toUpperCase() : "INDIVIDUAL CLIENT"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Card Mid: Metadata Grid */}
                                            <div className="space-y-2 text-left text-xs font-semibold text-[var(--color-black)] flex-grow">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">SERVICE</span>
                                                    <span className="font-normal truncate max-w-[70%] text-[var(--color-black)]">{item.service || ''}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">FOLLOW-UP</span>
                                                    <span className="font-normal text-[var(--color-black)]">{nextFollowUpStr ? nextFollowUpStr.toUpperCase() : ''}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">STATUS</span>
                                                    <div className="flex items-center gap-1.5 select-none">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(item.status)}`} />
                                                        <span className="text-[11px] font-semibold text-[var(--color-black)] uppercase tracking-wider">
                                                            {tblStatus ? tblStatus.toUpperCase() : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Bottom Actions */}
                                            <div className="mt-4 pt-3 border-t border-[var(--color-border)]/50 flex justify-end">
                                                <button
                                                    onClick={() => {
                                                        setHistoryInquiry(item);
                                                        setActiveView("history");
                                                    }}
                                                    className="border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-primary)] px-3 py-1 rounded-[var(--radius-sm)] text-xs font-normal transition cursor-pointer bg-transparent h-7 inline-flex items-center justify-center gap-1.5"
                                                    style={{ fontWeight: 'normal' }}
                                                >
                                                    <FiEye size={13} />
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Table Pagination */}
                        {tableTotalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 py-4 border-t border-[var(--color-border)]">
                                <button
                                    disabled={tablePage === 1}
                                    onClick={() => setTablePage(prev => Math.max(prev - 1, 1))}
                                    className="px-2.5 py-1 text-xs border border-[var(--color-border)] text-black bg-white rounded-[var(--radius-sm)] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                >
                                    &lt;
                                </button>
                                <span className="text-xs font-bold text-gray-500">
                                    Page {tablePage} of {tableTotalPages}
                                </span>
                                <button
                                    disabled={tablePage === tableTotalPages}
                                    onClick={() => setTablePage(prev => Math.min(prev + 1, tableTotalPages))}
                                    className="px-2.5 py-1 text-xs border border-[var(--color-border)] text-black bg-white rounded-[var(--radius-sm)] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Email Reply Modal */}
            {showReplyModal && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    {/* Backdrop click closer */}
                    <div className="absolute inset-0" onClick={() => {
                        setShowReplyModal(false);
                        setPendingActionPayload(null);
                    }} />
                    
                    <div className="relative bg-white p-6 rounded-[var(--radius-sm)] shadow-xl max-w-lg w-full border border-[var(--color-border)] text-left font-primary font-normal z-10">
                        <h3 className="text-[var(--color-primary)] font-bold text-lg mb-4">Reply/Notification to {selected?.fullName}</h3>
                        
                        <div className="space-y-4 font-normal">
                            <div>
                                <label className="text-[var(--color-black)] font-normal mb-1 block text-xs uppercase tracking-wider">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={reply.subject}
                                    onChange={handleReplyChange}
                                    placeholder="Re: Strivo Consultancy Inquiry"
                                    className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] bg-white font-normal"
                                />
                            </div>
                            <div>
                                <label className="text-[var(--color-black)] font-normal mb-1 block text-xs uppercase tracking-wider">Message</label>
                                <textarea
                                    name="message"
                                    rows={6}
                                    value={reply.message}
                                    onChange={handleReplyChange}
                                    placeholder="Type your response email..."
                                    className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] bg-white font-normal"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)] font-normal">
                            <button
                                onClick={() => {
                                    setShowReplyModal(false);
                                    setPendingActionPayload(null);
                                }}
                                className="border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition font-normal cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center border-solid h-8 px-4 bg-transparent"
                                style={{ fontWeight: 'normal' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendReply}
                                className="btn cursor-pointer text-sm font-normal flex items-center justify-center px-5 border-none h-8 text-white"
                                style={{ fontWeight: 'normal' }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Custom Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="bg-white p-6 rounded-[var(--radius-sm)] shadow-xl max-w-sm w-full mx-4 border border-[var(--color-border)] text-left font-primary font-normal z-[999999]">
                        <h3 className="text-[var(--color-primary)] font-bold text-lg mb-2">
                            {confirmModalAction === "delete_all" ? "Delete All Inquiries" : "Delete Inquiry"}
                        </h3>
                        <p className="text-[var(--color-paragraph)] text-sm mb-5 font-semibold">
                            {confirmModalAction === "delete_all"
                                ? "WARNING: Are you sure you want to delete ALL inquiries? This action cannot be undone."
                                : "Are you sure you want to delete this inquiry? This action cannot be undone."}
                        </p>
                        <div className="flex justify-end gap-3 font-normal">
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setConfirmModalAction(null);
                                    setDeleteTargetId(null);
                                }}
                                className="border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center border-solid h-8.5 px-4"
                                style={{ fontWeight: 'normal' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeConfirmAction}
                                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center border-none h-8.5 px-4"
                                style={{ fontWeight: 'normal' }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Date Range Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="bg-white p-6 rounded-[var(--radius-sm)] shadow-xl max-w-sm w-full mx-4 border border-[var(--color-border)] text-left font-primary font-normal z-[999999]">
                        <h3 className="text-[var(--color-primary)] font-bold text-lg mb-4">
                            Export Inquiries to PDF
                        </h3>
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-[var(--color-black)] font-semibold uppercase tracking-wider">From Date</label>
                                <input
                                    type="date"
                                    value={exportFromDate}
                                    onChange={(e) => setExportFromDate(e.target.value)}
                                    className="w-full border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-xs text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] bg-white font-normal"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-[var(--color-black)] font-semibold uppercase tracking-wider">To Date</label>
                                <input
                                    type="date"
                                    value={exportToDate}
                                    onChange={(e) => setExportToDate(e.target.value)}
                                    className="w-full border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-xs text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] bg-white font-normal"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowExportModal(false);
                                    setExportFromDate("");
                                    setExportToDate("");
                                }}
                                className="border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center border-solid h-8.5 px-4"
                                style={{ fontWeight: 'normal' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center border-none h-8.5 px-4"
                                style={{ fontWeight: 'normal' }}
                            >
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Modal */}
            {showAnalyticsModal && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-[var(--radius-sm)] shadow-xl max-w-4xl w-full mx-4 border border-[var(--color-border)] flex flex-col max-h-[85vh] overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-white select-none">
                            <div className="text-left">
                                <h2 className="text-xl font-bold text-[var(--color-primary)] uppercase tracking-tight" style={{ margin: 0 }}>
                                    Inquiries Analytics
                                </h2>
                                <p className="text-xs text-gray-555 font-medium mt-1" style={{ margin: '4px 0 0 0' }}>
                                    Overview of client inquiry statuses and pipeline
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAnalyticsModal(false)}
                                className="w-8 h-8 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-[var(--color-paragraph)] opacity-60 hover:opacity-100 cursor-pointer text-xs shrink-0 border-none outline-none"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 bg-[var(--color-sub-bg)]/35 overflow-y-auto flex-1 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Donut Chart / Status Breakdown */}
                                <div className="card p-5 bg-white shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] flex flex-col items-center justify-center text-center">
                                    <h3 className="text-xs font-bold text-[var(--color-black)] uppercase tracking-wider mb-4" style={{ margin: 0 }}>
                                        Status Breakdown
                                    </h3>

                                    {totalInquiries > 0 ? (
                                        <>
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
                                                    <span className="text-2xl font-extrabold text-[var(--color-black)]">{totalInquiries}</span>
                                                    <span className="text-[9px] text-[var(--color-paragraph)] opacity-50 uppercase tracking-widest">Inquiries</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs w-full max-w-[280px] border-t border-[var(--color-border)] pt-4 mt-2">
                                                {statusMap.map((segment) => (
                                                    <div key={segment.name} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
                                                            <span className="text-[var(--color-paragraph)] font-semibold uppercase text-[10px] tracking-wide">{segment.name}</span>
                                                        </div>
                                                        <span className="font-bold text-[var(--color-black)]">{segment.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-12 text-gray-400 text-sm font-semibold select-none">
                                            No statistics available.
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Status Detail Summaries */}
                                <div className="flex flex-col gap-4">
                                    <div className="card p-5 bg-white shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] flex-1 flex flex-col justify-between">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 select-none" style={{ margin: 0 }}>Active Pipeline</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <div>
                                                    <span className="text-xs font-bold text-[var(--color-black)]">NEW SUBMISSIONS</span>
                                                    <span className="text-[10px] text-gray-400 block font-normal">Awaiting first response</span>
                                                </div>
                                                <span className="text-2xl font-extrabold text-[var(--color-success)]">{statusCounts.New}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <div>
                                                    <span className="text-xs font-bold text-[var(--color-black)]">RESPONDED INQUIRIES</span>
                                                    <span className="text-[10px] text-gray-400 block font-normal">In progress conversations</span>
                                                </div>
                                                <span className="text-2xl font-extrabold text-[var(--color-primary)]">{statusCounts.Responded}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <div>
                                                    <span className="text-xs font-bold text-[var(--color-black)]">PROPOSALS CONVERTED</span>
                                                    <span className="text-[10px] text-gray-400 block font-normal">Sent details statements</span>
                                                </div>
                                                <span className="text-2xl font-extrabold text-[var(--color-warning)]">{statusCounts.Proposals}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-xs font-bold text-[var(--color-black)]">CLOSED ISSUES</span>
                                                    <span className="text-[10px] text-gray-400 block font-normal">Successfully resolved</span>
                                                </div>
                                                <span className="text-2xl font-extrabold text-gray-500">{statusCounts.Closed}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Close Button */}
                        <div className="p-4 border-t border-[var(--color-border)] flex justify-end bg-white select-none">
                            <button
                                onClick={() => setShowAnalyticsModal(false)}
                                className="border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center border-solid h-9 px-6"
                                style={{ fontWeight: 'normal' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inquiries;