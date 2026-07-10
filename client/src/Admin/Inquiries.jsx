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
    FiTrash2
} from "react-icons/fi";
import { motion } from 'framer-motion';
import { createPortal } from "react-dom";
import { toast } from "sonner";
import axios from "axios";

const Inquiries = () => {
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [inquiries, setInquiries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [expandedIds, setExpandedIds] = useState({});
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const toggleExpand = (id, e) => {
        e.stopPropagation();
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const [reply, setReply] = useState({
        subject: "",
        message: "",
    });
    const filteredInquiries =
        activeFilter === "All"
            ? inquiries
            : inquiries.filter(
                (item) => item.status === activeFilter
            );

    // Pagination calculations
    const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
    const paginatedInquiries = filteredInquiries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const cards = [
        {
            title: "New Inquiries",
            value: inquiries.filter(i => i.status === "New").length,
            icon: <FiMessageSquare />,
            color: "text-blue-500",
        },
        {
            title: "In Progress",
            value: inquiries.filter(i => i.status === "In Progress").length,
            icon: <FiClock />,
            color: "text-orange-500",
        },
        {
            title: "Responded",
            value: inquiries.filter(i => i.status === "Responded").length,
            icon: <FiCheckCircle />,
            color: "text-green-500",
        },
        {
            title: "Closed",
            value: inquiries.filter(i => i.status === "Closed").length,
            icon: <FiArchive />,
            color: "text-purple-500",
        },
    ];

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries`);

            // Sort descending: new ones first
            const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setInquiries(sorted);

            if (sorted.length > 0) {
                setSelected(sorted[0]);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/inquiries/${id}`,
                {status}
            );

            const updated = inquiries.map(inq =>
                inq._id === id
                    ? {...inq, status}
                    : inq
            );

            setInquiries(updated);

            if (selected?._id === id) {
                setSelected(prev => ({
                    ...prev,
                    status
                }));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this inquiry?")) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/${id}`);
                toast.success("Inquiry deleted successfully!");
                const updated = inquiries.filter(inq => inq._id !== id);
                setInquiries(updated);
                if (selected?._id === id) {
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
        }
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

            toast.success("Reply sent successfully!");
            setShowReplyModal(false);
            setReply({ subject: "", message: "" });
            fetchInquiries();
        } catch (error) {
            console.log(error);
            toast.error("Failed to send reply.");
        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    if (inquiries.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-400 bg-sub" style={{ fontFamily: 'var(--font-primary)' }}>
                No inquiries found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sub flex flex-col" style={{ fontFamily: 'var(--font-primary)' }}>
            
            {/* Top Header Section with bg-main spanning full-width */}
            <div className="bg-main pt-24 pb-0 border-b border-[var(--color-border)] px-8 md:px-16 lg:px-24">
                <div className="max-w-[98%] mx-auto">
                    
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-6 mt-4">
                        <div className="text-left">
                            <h1 className="text-2xl font-[var(--font-bold)] text-primary leading-none uppercase" style={{ margin: 0 }}>
                                INQUIRIES
                            </h1>
                            <p className="text-xs text-[var(--color-black)] font-medium opacity-85 mt-2" style={{ margin: '6px 0 0 0', lineHeight: 1.3 }}>
                                Manage and respond to client inquiries in real-time.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setShowAnalyticsModal(true)}
                                className="bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:text-white hover:bg-[var(--color-primary)] px-2.5 py-1.5 rounded-[var(--radius-sm)] flex items-center justify-center gap-2 transition cursor-pointer h-8 text-xs font-normal w-full sm:w-auto"
                            >
                                <FiBarChart2 size={13} />
                                Analytics
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation sitting inside white section */}
                    <div className="flex gap-4 sm:gap-8 border-b border-transparent pb-0 overflow-x-auto scrollbar-hide">
                        {["All", "New", "In Progress", "Responded", "Closed"].map(
                            (tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveFilter(tab);
                                        setCurrentPage(1);
                                    }}
                                    className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-300 cursor-pointer whitespace-nowrap ${
                                        activeFilter === tab
                                            ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                                            : "border-transparent text-[var(--color-paragraph)] opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    {tab}
                                </button>
                            )
                        )}
                    </div>

                </div>
            </div>

            {/* Bottom Section - Rendered over grey backdrop (bg-sub) */}
            <div className="flex-grow py-8 px-8 md:px-16 lg:px-24">
                <div className="max-w-[98%] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Main Layout */}
                        <div className="grid lg:grid-cols-[400px_1fr] gap-5">
                            {/* Left Panel */}
                            <div className="card bg-white p-5 h-[500px] flex flex-col justify-between shadow-md border border-[var(--color-border)]">
                                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                    {paginatedInquiries.length === 0 ? (
                                        <p className="py-8 text-center text-black opacity-60 text-xs">
                                            No inquiries found matching filters.
                                        </p>
                                    ) : (
                                        paginatedInquiries.map((item) => (
                                            <div
                                                key={item._id}
                                                onClick={() => setSelected(item)}
                                                className={`cursor-pointer border p-3 transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-sub-bg)]/40 hover:-translate-y-0.5 ${
                                                    selected?._id === item._id
                                                        ? "border-[var(--color-primary)] bg-[var(--color-sub-bg)]"
                                                        : "border-[var(--color-border)]"
                                                }`}
                                                style={{ borderRadius: 'var(--radius-sm)' }}
                                            >
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                                                    <div className="flex gap-2.5">
                                                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center font-semibold text-sm shrink-0">
                                                            {item.fullName?.charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0 text-left">
                                                            <h3 className="font-semibold text-primary text-sm truncate">
                                                                {item.fullName}
                                                            </h3>
                                                            <p className="text-xs text-primary font-medium opacity-100 truncate mt-0.5">
                                                                {item.company}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        <select
                                                            className="bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-1 px-2 focus:outline-none transition cursor-pointer text-black text-[11px]"
                                                            value={item.status}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(item._id, e.target.value);
                                                            }}
                                                        >
                                                            <option value="New">New</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Responded">Responded</option>
                                                            <option value="Closed">Closed</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex justify-between items-center border-t border-[var(--color-border)] pt-2 text-[11px] text-[var(--color-paragraph)]">
                                                    <span className="opacity-80 font-medium">{item.phone}</span>
                                                    <span className="opacity-60">
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Pagination inside card */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 pt-4 border-t border-[var(--color-border)] mt-4">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className="px-2.5 py-1 text-xs border border-[var(--color-border)] text-black bg-white rounded-[var(--radius-sm)] hover:bg-[var(--color-sub-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            &lt;
                                        </button>
                                        <span className="text-xs font-semibold text-black">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            className="px-2.5 py-1 text-xs border border-[var(--color-border)] text-black bg-white rounded-[var(--radius-sm)] hover:bg-[var(--color-sub-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Right Panel */}
                            <div className="card bg-white p-6 shadow-md border border-[var(--color-border)] flex flex-col text-left">
                                {selected ? (
                                    <div className="space-y-6 flex-1 flex flex-col">
                                        {/* User Details Header */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 border-b border-[var(--color-border)] pb-4">
                                            <div>
                                                <h2 className="text-lg font-bold text-black">{selected.fullName}</h2>
                                                <p className="text-xs text-[var(--color-paragraph)] font-semibold mt-0.5 uppercase tracking-wider">{selected.company || "Individual client"}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-[var(--radius-sm)] uppercase ${
                                                    selected.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                    selected.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                                                    selected.status === 'Responded' ? 'bg-emerald-100 text-emerald-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {selected.status}
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(selected._id)}
                                                    className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
                                                    style={{ borderRadius: 'var(--radius-sm)' }}
                                                    title="Delete Inquiry"
                                                >
                                                    <FiTrash2 size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Inquiry Specifics */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                <FiMail className="text-[var(--color-primary)]" />
                                                <span className="font-semibold text-black break-all">{selected.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FiPhone className="text-[var(--color-primary)]" />
                                                <span className="font-semibold text-black">{selected.phone || "No phone provided"}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FiBriefcase className="text-[var(--color-primary)]" />
                                                <span className="font-semibold text-black">{selected.service || "No service selected"}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FiClock className="text-[var(--color-primary)]" />
                                                <span className="font-semibold text-black">
                                                    {new Date(selected.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Message Box */}
                                        <div className="bg-[var(--color-sub-bg)] p-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex-1">
                                            <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-2">Message Content</h3>
                                            <p className="text-xs text-[var(--color-paragraph)] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                                        </div>

                                        {/* Reply Trigger */}
                                        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)] mt-auto">
                                            <button
                                                onClick={() => setShowReplyModal(true)}
                                                className="btn px-4 py-2 flex items-center justify-center gap-2 cursor-pointer text-xs"
                                                style={{ height: '36px', minWidth: '100px' }}
                                            >
                                                <FiSend size={13} />
                                                Send Email Reply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-400">
                                        Select an inquiry to view details.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Email Reply Modal */}
            {showReplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
                    <div className="bg-white p-6 rounded-[var(--radius-sm)] shadow-xl max-w-lg w-full mx-4 border border-[var(--color-border)] text-left">
                        <h3 className="text-[var(--color-primary)] font-bold text-lg mb-4">Reply to {selected?.fullName}</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-[var(--color-black)] font-semibold mb-1 block text-xs uppercase tracking-wider">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={reply.subject}
                                    onChange={handleReplyChange}
                                    placeholder="Re: Strivo Consultancy Inquiry"
                                    className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <label className="text-[var(--color-black)] font-semibold mb-1 block text-xs uppercase tracking-wider">Message</label>
                                <textarea
                                    name="message"
                                    rows={6}
                                    value={reply.message}
                                    onChange={handleReplyChange}
                                    placeholder="Type your response email..."
                                    className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
                            <button
                                onClick={() => setShowReplyModal(false)}
                                className="border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center"
                                style={{ height: '34px', padding: '0 16px' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendReply}
                                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center"
                                style={{ height: '34px', padding: '0 16px' }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Real-time Analytics Modal */}
            {showAnalyticsModal &&
                createPortal(
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="w-full max-w-4xl border border-[var(--color-border)] bg-[var(--color-main-bg)] shadow-xl overflow-hidden" style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-primary)' }}>
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 bg-white">
                                <div>
                                    <h2 className="text-lg font-bold text-primary" style={{ margin: 0 }}>
                                        INQUIRIES ANALYTICS
                                    </h2>
                                    <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-1">
                                        Real-time status overview of all client inquiries
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAnalyticsModal(false)}
                                    className="w-8 h-8 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-[var(--color-paragraph)] opacity-60 hover:opacity-100 cursor-pointer text-xs"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 bg-[var(--color-sub-bg)]/20">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {cards.map((item) => (
                                        <div
                                            key={item.title}
                                            className="card bg-white p-5 flex flex-col justify-between items-center text-center shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                                        >
                                            <h3 className="card-title-custom text-xs" style={{ margin: 0 }}>{item.title}</h3>
                                            <p className="stats-number text-2xl font-bold text-black" style={{ margin: '8px 0 8px 0', lineHeight: 1.1 }}>{item.value}</p>
                                            <span className={`${item.color} text-lg`}>{item.icon}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end border-t border-[var(--color-border)] px-6 py-4 bg-white">
                                <button
                                    onClick={() => setShowAnalyticsModal(false)}
                                    className="px-5 py-2 border border-[var(--color-border)] text-sm text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition font-semibold cursor-pointer rounded-[var(--radius-sm)] h-10"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div>
    );
};

export default Inquiries;