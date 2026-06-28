import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

const statusColor = {
  Published: "bg-green-500/10 text-green-400 border border-green-500/20",
  Draft: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  Archived: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
};

const categoryColor = {
  Finance: "bg-blue-500",
  Healthcare: "bg-green-500",
  Technology: "bg-purple-500",
  Retail: "bg-orange-500",
};

// added onStatusChange as a prop in case you want to update status in-place
const CaseStudyTable = ({ caseStudies, onStatusChange }) => {
  const navigate = useNavigate();

  const deleteCaseStudy = async (id) => {
    if (!window.confirm("Delete this case study?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/case-studies/${id}`);
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete case study:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // API call to update status directly in-place
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/case-studies/${id}`, { status: newStatus });
      if (onStatusChange) {
        onStatusChange(id, newStatus);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div
      className="
        bg-[#090f1c]/40
        backdrop-blur-xl
        border
        border-slate-800/80
        rounded-2xl
        overflow-hidden
        w-full
      "
    >
      {/* Table Header - Hidden on Mobile */}
      <div
        className="
          hidden
          lg:grid
          lg:grid-cols-[90px_3fr_2fr_1.5fr_1.2fr_140px_110px]
          items-center
          px-6
          py-4
          text-gray-500
          text-[11px]
          font-bold
          uppercase
          tracking-wider
          border-b
          border-slate-800/60
        "
      >
        <div>ID</div>
        <div>Case Study</div>
        <div>Author</div>
        <div>Category</div>
        <div className="text-center">Status</div>
        <div className="text-center">Published</div>
        <div className="text-right pr-4">Actions</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-800/40">
        {caseStudies.map((study) => (
          <div
            key={study._id}
            className="
              flex flex-col lg:grid
              lg:grid-cols-[90px_3fr_2fr_1.5fr_1.2fr_140px_110px]
              items-start lg:items-center
              gap-4 lg:gap-0
              px-6
              py-6 lg:py-4.5
              hover:bg-white/[0.02]
              transition-colors
              duration-200
            "
          >
            {/* Mobile Header: ID and Actions */}
            <div className="flex justify-between items-center w-full lg:hidden mb-2">
              <div className="font-mono text-[11px] text-gray-500">
                #{study._id.slice(-6).toUpperCase()}
              </div>
              <div className="flex gap-2">
                <button
                  title="Edit Case Study"
                  onClick={() => navigate(`/admin/edit-case-study/${study._id}`)}
                  className="w-8 h-8 rounded-lg bg-slate-800/40 text-slate-400 border border-slate-800/80 flex items-center justify-center"
                >
                  <FiEdit2 size={13} />
                </button>
                <button
                  title="Delete Case Study"
                  onClick={() => deleteCaseStudy(study._id)}
                  className="w-8 h-8 rounded-lg bg-slate-800/40 text-slate-400 border border-slate-800/80 flex items-center justify-center"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
            {/* Desktop ID */}
            <div className="hidden lg:block font-mono text-[11px] text-gray-500">
              #{study._id.slice(-6).toUpperCase()}
            </div>

            {/* Case Study Details */}
            <div className="flex items-center gap-3.5 min-w-0 pr-4">
              <img
                src={study.coverImage || "https://via.placeholder.com/80"}
                alt={study.title}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-800/80"
              />
              <div className="min-w-0">
                <h3 
                  onClick={() => navigate(`/admin/edit-case-study/${study._id}`)}
                  className="font-semibold text-white text-sm truncate hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {study.title}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {study.duration}
                </p>
              </div>
            </div>

            {/* Mobile Meta Details Grid */}
            <div className="grid grid-cols-2 gap-4 w-full lg:hidden mt-2">
              <div>
                <p className="text-[10px] text-gray-500 uppercase mb-1">Author</p>
                <p className="font-medium text-sm text-gray-200 truncate">{study.author}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{study.authorRole}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase mb-1">Category</p>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${categoryColor[study.category] || "bg-slate-500"}`}></span>
                  <span className="truncate">{study.category}</span>
                </div>
              </div>
            </div>

            {/* Desktop Author */}
            <div className="hidden lg:block min-w-0 pr-4">
              <p className="font-medium text-sm text-gray-200 truncate">
                {study.author}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {study.authorRole}
              </p>
            </div>

            {/* Desktop Category */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-300">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  categoryColor[study.category] || "bg-slate-500"
                }`}
              ></span>
              <span className="truncate">{study.category}</span>
            </div>

            {/* Status (Interactive Select Dropdown) */}
            <div className="flex flex-col lg:flex-row justify-start lg:justify-center items-start lg:items-center w-full lg:w-auto">
              <p className="text-[10px] text-gray-500 uppercase mb-1 lg:hidden">Status</p>
              <div className="relative inline-block w-[120px] lg:w-[110px]">
                <select
                  value={study.status}
                  onChange={(e) => handleStatusChange(study._id, e.target.value)}
                  className={`
                    appearance-none 
                    w-full 
                    text-center
                    font-bold 
                    rounded-full 
                    pl-3 
                    pr-7 
                    py-1 
                    text-[10px] 
                    uppercase 
                    tracking-wider 
                    border 
                    cursor-pointer 
                    focus:outline-none 
                    transition-all 
                    duration-200 
                    ${statusColor[study.status] || "bg-slate-800 text-slate-400 border border-slate-700/50"}
                  `}
                >
                  <option value="Published" className="bg-[#0f172a] text-green-400">Published</option>
                  <option value="Draft" className="bg-[#0f172a] text-orange-400">Draft</option>
                  <option value="Archived" className="bg-[#0f172a] text-purple-400">Archived</option>
                </select>

                {/* Arrow Icon aligned relative to the select pill */}
                <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-current opacity-70">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Publication Date */}
            <div className="hidden lg:block text-center text-sm text-gray-400">
              {study.publicationDate
                ? new Date(study.publicationDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : "—"}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex justify-end gap-2 pr-2">
              <button
                title="Edit Case Study"
                className="
                  w-8
                  h-8
                  rounded-lg
                  bg-slate-800/40
                  hover:bg-blue-600/10
                  text-slate-400
                  hover:text-blue-400
                  border
                  border-slate-800/80
                  hover:border-blue-500/30
                  transition-all
                  duration-200
                  flex
                  items-center
                  justify-center
                "
                onClick={() => navigate(`/admin/edit-case-study/${study._id}`)}
              >
                <FiEdit2 size={13} />
              </button>

              <button
                title="Delete Case Study"
                onClick={() => deleteCaseStudy(study._id)}
                className="
                  w-8
                  h-8
                  rounded-lg
                  bg-slate-800/40
                  hover:bg-red-600/10
                  text-slate-400
                  hover:text-red-400
                  border
                  border-slate-800/80
                  hover:border-red-500/30
                  transition-all
                  duration-200
                  flex
                  items-center
                  justify-center
                "
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4.5 border-t border-slate-800/60 bg-white/[0.01]">
        <p className="text-gray-500 text-xs">
          Showing <span className="text-gray-300 font-semibold">{caseStudies.length}</span> case studies
        </p>
      </div>
    </div>
  );
};

export default CaseStudyTable;