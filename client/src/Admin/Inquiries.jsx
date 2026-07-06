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
    FiChevronDown
} from "react-icons/fi";
import { motion } from 'framer-motion';
import { createPortal } from "react-dom";
import axios from "axios";



const Inquiries = () => {

    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [inquiries, setInquiries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [expandedIds, setExpandedIds] = useState({});

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

            setInquiries(res.data);

            if (res.data.length > 0) {
                setSelected(res.data[0]);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    const handleStatusChange = async (id, status) => {

try{

await axios.put(
`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/${id}`,
{status}
);

const updated = inquiries.map(inq =>
inq._id === id
? {...inq,status}
: inq
);

setInquiries(updated);

if(selected?._id===id){

setSelected(prev=>({
...prev,
status
}));

}

}catch(err){

console.log(err);

}

}
    const handleSendReply = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/inquiries/reply`,
                {
                    email: selected.email,
                    subject: reply.subject,
                    message: reply.message,
                }
            );

            alert(response.data.message);
            setShowReplyModal(false);

        } catch (error) {
            console.log(error);
            alert("Failed to send email");
        }
    };
    if (loading) {
        return <LoadingIndicator />;
    }
    if (inquiries.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-400">
                No inquiries found.
            </div>
        );
    }
    return (<>
        <div className="min-h-screen pt-24 px-4 sm:px-8 pb-8 relative z-10 md:ml-56 bg-sub">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .5 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="mb-6 pb-5 border-b border-[var(--color-border)]">
                    <h1 style={{ fontSize: '26px', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }}>
                        Inquiries
                    </h1>
                    <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-paragraph)', opacity: 0.6, margin: '2px 0 0 0' }}>
                        Total <span className="text-[var(--color-primary)] font-semibold">{inquiries.length}</span> inquiries
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="card py-4 px-5 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300 group"
                        >
                            <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)', opacity: 0.7, margin: 0 }}>{card.title}</h3>
                            <p style={{ fontSize: '26px', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '2px 0 0 0' }}>{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 sm:gap-8 border-b border-[var(--color-border)] pb-3 mb-5 overflow-x-auto scrollbar-hide">
                    {["All", "New", "In Progress", "Responded", "Closed"].map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveFilter(tab);
                                }}
                                className={`pb-2 text-sm font-semibold border-b-2 transition-all duration-300 cursor-pointer ${
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

                {/* Main Layout */}
                <div className="grid lg:grid-cols-[400px_1fr] gap-5">
                    {/* Left Panel */}
                    <div className="card p-3.5 space-y-3 h-[620px] overflow-y-auto shadow-card">
                        {filteredInquiries.map((item) => (
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

                                        <div>
                                            <h3 className="font-semibold text-[var(--color-black)] text-sm">
                                                {item.fullName}
                                            </h3>
                                            <p className="text-xs text-[var(--color-paragraph)] opacity-60 truncate mt-0.5">
                                                {item.company}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <select
                                            className="appearance-none w-32 h-8 rounded-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] pl-3 pr-7 text-[var(--color-paragraph)] font-semibold outline-none cursor-pointer text-[11px]"
                                            value={item.status}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange(item._id, e.target.value);
                                            }}
                                        >
                                            <option className="bg-[var(--color-main-bg)]">New</option>
                                            <option className="bg-[var(--color-main-bg)]">In Progress</option>
                                            <option className="bg-[var(--color-main-bg)]">Responded</option>
                                            <option className="bg-[var(--color-main-bg)]">Closed</option>
                                        </select>
                                        <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-paragraph)] opacity-60 pointer-events-none text-xs" />
                                    </div>
                                </div>

                                <div className="text-[var(--color-paragraph)] opacity-80 text-xs mt-3">
                                    <p className={expandedIds[item._id] ? "" : "line-clamp-2"}>
                                        {item.message}
                                    </p>
                                    {item.message.length > 80 && (
                                        <button
                                            type="button"
                                            onClick={(e) => toggleExpand(item._id, e)}
                                            className="text-[var(--color-primary)] mt-1 hover:underline text-[10px] font-semibold focus:outline-none block cursor-pointer"
                                        >
                                            {expandedIds[item._id] ? "Read Less" : "Read More"}
                                        </button>
                                    )}
                                </div>

                                <div className="flex justify-between mt-3 text-[10px] text-[var(--color-paragraph)] opacity-50">
                                    <span>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                    <span>#{item._id.slice(-6).toUpperCase()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Panel */}
                    <div className="card p-5 h-[620px] overflow-y-auto shadow-card">
                        <div className="flex justify-between items-center mb-5">
                            <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: 0 }}>
                                Inquiry #{inquiries.findIndex(i => i._id === selected?._id) + 1}
                            </h2>

                            <div className="relative">
                                <select
                                    className="appearance-none w-32 h-8 rounded-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] pl-3 pr-7 text-[var(--color-paragraph)] font-semibold outline-none cursor-pointer text-[11px]"
                                    value={selected?.status || "New"}
                                    onChange={(e)=> handleStatusChange(selected._id, e.target.value)}
                                >
                                    <option className="bg-[var(--color-main-bg)]">New</option>
                                    <option className="bg-[var(--color-main-bg)]">In Progress</option>
                                    <option className="bg-[var(--color-main-bg)]">Responded</option>
                                    <option className="bg-[var(--color-main-bg)]">Closed</option>
                                </select>
                                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-paragraph)] opacity-60 pointer-events-none text-xs" />
                            </div>
                        </div>

                        <div className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-[var(--color-sub-bg)]/20">
                            <div className="flex gap-3 mb-5">
                                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center text-lg font-semibold shrink-0">
                                   {selected.fullName?.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-[var(--color-black)]">
                                        {selected.fullName}
                                    </h3>
                                    <p className="text-xs text-[var(--color-paragraph)] opacity-60">
                                        {selected.company}
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-5 text-[var(--color-paragraph)] opacity-80 text-xs">
                                <div className="flex items-center gap-2">
                                    <FiMail className="text-[var(--color-primary)] flex-shrink-0" />
                                    <span className="break-all">{selected.email}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FiPhone className="text-[var(--color-primary)] flex-shrink-0" />
                                    <span>{selected.phone}</span>
                                </div>

                                <div className="flex items-center gap-2 md:col-span-2">
                                    <FiBriefcase className="text-[var(--color-primary)] flex-shrink-0" />
                                    <span>{selected.company}</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5 border-t border-[var(--color-border)] pt-4 mb-5 text-[var(--color-paragraph)] opacity-80">
                                <div>
                                    <p className="text-[var(--color-paragraph)] opacity-50 text-[10px] uppercase mb-1">
                                        Requested Service
                                    </p>
                                    <p className="font-semibold text-xs text-[var(--color-black)]">{selected.service}</p>
                                </div>

                                <div>
                                    <p className="text-[var(--color-paragraph)] opacity-50 text-[10px] uppercase mb-1">
                                        Submitted On
                                    </p>
                                    <p className="font-semibold text-xs text-[var(--color-black)]">
                                       {new Date(selected?.createdAt).toLocaleString("en-IN", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h3 className="text-xs font-bold text-[var(--color-black)] opacity-80 uppercase tracking-wider mb-2">
                                    Message
                                </h3>
                                <p className="text-xs text-[var(--color-paragraph)] opacity-80 leading-6">
                                    {selected.message}
                                </p>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => {
                                        setReply({
                                            subject: `Re: ${selected.service}`,
                                            message: `Dear ${selected.fullName},\n\nThank you for contacting Strivo Consultancy.\n\n\n\n`,
                                        });
                                        setShowReplyModal(true);
                                    }}
                                    className="btn px-5 py-2 border-none flex items-center gap-2 transition cursor-pointer text-xs h-10"
                                    style={{ fontWeight: 'var(--font-semibold)' }}
                                >
                                    <FiSend />
                                    Reply to Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
        {showReplyModal &&
  createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg border border-[var(--color-border)] bg-[var(--color-main-bg)] shadow-xl overflow-hidden" style={{ borderRadius: 'var(--radius-sm)' }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <h2 style={{ fontSize: 'var(--text-card-heading)', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }}>
              Reply to Inquiry
            </h2>
            <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-1">
              Send a professional response to the customer.
            </p>
          </div>

          <button
            onClick={() => setShowReplyModal(false)}
            className="w-8 h-8 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-[var(--color-paragraph)] opacity-60 hover:opacity-100 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* To */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-paragraph)] opacity-80 mb-1.5">
              To
            </label>
            <input
              type="text"
              value={selected.email}
              disabled
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] opacity-60 py-2 px-3 text-sm cursor-not-allowed"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-paragraph)] opacity-80 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={reply.subject}
              onChange={(e) =>
                setReply({
                  ...reply,
                  subject: e.target.value,
                })
              }
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-sub-bg)] text-sm text-[var(--color-paragraph)] placeholder-gray-400 py-2 px-3 outline-none transition focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-paragraph)] opacity-80 mb-1.5">
              Message
            </label>
            <textarea
              rows={4}
              value={reply.message}
              onChange={(e) =>
                setReply({
                  ...reply,
                  message: e.target.value,
                })
              }
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-sub-bg)] text-sm text-[var(--color-paragraph)] placeholder-gray-400 p-3 resize-none outline-none transition focus:border-[var(--color-primary)]"
              placeholder="Type your reply..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
          <button
            onClick={() => setShowReplyModal(false)}
            className="px-5 py-2 border border-[var(--color-border)] text-sm text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition font-semibold cursor-pointer h-10"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            Cancel
          </button>

          <button
            onClick={handleSendReply}
            className="btn px-5 py-2 border-none transition flex items-center gap-2 cursor-pointer text-sm h-10"
            style={{ fontWeight: 'var(--font-semibold)' }}
          >
            <FiSend size={15} />
            Send Reply
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}</>

    );
};

export default Inquiries;