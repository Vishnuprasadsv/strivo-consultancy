import React, { useState, useEffect } from "react";
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
            const res = await axios.get("http://localhost:5000/api/inquiries");

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
`http://localhost:5000/api/inquiries/${id}`,
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
                "http://localhost:5000/api/inquiries/reply",
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
        return (
            <div className="flex justify-center items-center h-screen text-white">
                Loading inquiries...
            </div>
        );
    }
    if (inquiries.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-400">
                No inquiries found.
            </div>
        );
    }
    return (<>
        <div className="min-h-screen pt-28 px-4 sm:px-8  md:ml-64">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .5 }}
                className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">Inquiries</h1>

                    <p className="text-gray-400 mt-2">
                        Total <span className="text-blue-500">{inquiries.length}</span> inquiries
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="
bg-white/5
backdrop-blur-lg
border
border-white/10
rounded-2xl
p-6
hover:border-blue-500/50
hover:-translate-y-1
hover:shadow-xl
transition-all
duration-300
"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`text-4xl ${card.color}`}
                                >
                                    {card.icon}
                                </div>

                                <div>
                                    <h3 className="text-4xl font-bold">
                                        {card.value}
                                    </h3>

                                    <p className="text-gray-400">
                                        {card.title}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 sm:gap-8 border-b border-slate-800 pb-4 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {["All", "New", "In Progress", "Responded", "Closed"].map(
                        (tab) => (
                            <button
                                key={tab}

                                onClick={() => {
                                    console.log(tab);
                                    setActiveFilter(tab);
                                }}

                                className={`pb-2 transition-all duration-300 ${activeFilter === tab
                                    ? "text-blue-500 border-b-2 border-blue-500"
                                    : "text-gray-400 hover:text-blue-500"
                                    }`}
                            >
                                {tab}
                            </button>
                        )
                    )}
                </div>

                {/* Main Layout */}
                <div className="grid lg:grid-cols-[400px_1fr] gap-6">
                    {/* Left Panel */}
                    <div className="bg-white/5
                   
backdrop-blur-xl
border
border-white/10
rounded-2xl border border-white/10
bg-black/20
backdrop-blur-lg rounded-xl p-4 space-y-4 h-[700px] overflow-y-auto">
                        {filteredInquiries.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => setSelected(item)}
                                className={`cursor-pointer rounded-xl border p-4 transition-all duration-300
hover:border-blue-500
hover:bg-blue-500/10
hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]
hover:-translate-y-1
${selected?._id === item._id
                                        ? "border-blue-500 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.25)]"
                                        : "border-slate-800"
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                                            {item.fullName?.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                {item.fullName}
                                            </h3>

                                            <p className="text-sm text-gray-400">
                                                {item.company}
                                            </p>
                                        </div>
                                    </div>

             <div className="relative">

<select
className="
appearance-none
w-40
h-11
rounded-full
bg-[#1a2338]
border border-blue-500/30
pl-5
pr-10
text-blue-400
font-semibold
outline-none
"
value={item.status}

onChange={(e) => {
e.stopPropagation();

handleStatusChange(
item._id,
e.target.value
);
}}
>

<option>New</option>
<option>In Progress</option>
<option>Responded</option>
<option>Closed</option>

</select>

<FiChevronDown
className="
absolute
right-4
top-1/2
-translate-y-1/2
text-white/70
pointer-events-none
"
/>

</div>
                                </div>

                                <p className="text-gray-400 text-sm mt-4">
                                    {item.message.substring(0, 80)}...
                                </p>

                                <div className="flex justify-between mt-4 text-xs text-gray-500">
                                    <span>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>

                                    <span>{item._id.slice(-6)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Panel */}
                    <div className="
bg-white/5
backdrop-blur-xl
border
border-white/10
rounded-2xl
p-8
h-[720px]
overflow-y-auto
">
                        <div className="flex justify-between items-center mb-8">
    <h2 className="text-2xl font-bold text-white">
    Inquiry #{inquiries.findIndex(i => i._id === selected?._id) + 1}
</h2>

                          <div className="relative">

<select
className="
appearance-none
w-40
h-11
rounded-full
bg-[#1a2338]
border border-blue-500/30
pl-5
pr-10
text-blue-400
font-semibold
outline-none
"
value={selected?.status || "New"}

onChange={(e)=>
handleStatusChange(
selected._id,
e.target.value
)}
>

<option>New</option>
<option>In Progress</option>
<option>Responded</option>
<option>Closed</option>

</select>

<FiChevronDown
className="
absolute
right-4
top-1/2
-translate-y-1/2
text-white/70
pointer-events-none
"
/>

</div>
                 
                        </div>

                        <div className="border border-slate-800 rounded-xl p-6">
                            <div className="flex gap-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xl">
                                   {selected.fullName?.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold">
                                        {selected.fullName}
                                    </h3>

                                    <p className="text-gray-400">
                                        {selected.company}
                                    </p>
                                </div>
                            </div>

                          <div className="grid md:grid-cols-2 gap-6 mb-8 text-gray-300">
  <div className="flex items-center gap-2">
    <FiMail className="text-blue-500 flex-shrink-0" />
    <span className="break-all">{selected.email}</span>
  </div>

  <div className="flex items-center gap-2">
    <FiPhone className="text-blue-500 flex-shrink-0" />
    <span>{selected.phone}</span>
  </div>

  <div className="flex items-center gap-2 md:col-span-2">
    <FiBriefcase className="text-blue-500 flex-shrink-0" />
    <span>{selected.company}</span>
  </div>
</div>

                            <div className="grid md:grid-cols-2 gap-8 border-t border-slate-800 pt-6 mb-8">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Requested Service
                                    </p>

                                    <p>{selected.service}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Submitted On
                                    </p>

                                    <p>
                                       {new Date(selected?.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
})}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-3">
                                    Message
                                </h3>

                                <p className="text-gray-400 leading-7">
                                    {selected.message}
                                </p>
                            </div>



                            <div className="flex justify-end mt-10">
                                <button
                                    onClick={() => {
                                        setReply({
                                            subject: `Re: ${selected.service}`,
                                            message: `Dear ${selected.fullName},

Thank you for contacting Strivo Consultancy.



`,
                                        });

                                        setShowReplyModal(true);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2 transition"
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
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0F172A]/95 backdrop-blur-xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Reply to Inquiry
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Send a professional response to the customer.
            </p>
          </div>

          <button
            onClick={() => setShowReplyModal(false)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition flex items-center justify-center text-gray-400"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To
            </label>

            <input
              type="text"
              value={selected.email}
              disabled
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 text-gray-300 px-4 py-3 cursor-not-allowed"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-gray-500 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>

            <textarea
              rows={5}
              value={reply.message}
              onChange={(e) =>
                setReply({
                  ...reply,
                  message: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-gray-500 px-4 py-3 resize-none outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              placeholder="Type your reply..."
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 border-t border-white/10 px-8 py-5">

          <button
            onClick={() => setShowReplyModal(false)}
            className="px-6 py-3 rounded-xl border border-slate-600 text-gray-300 hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSendReply}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
          >
            <FiSend size={18} />
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