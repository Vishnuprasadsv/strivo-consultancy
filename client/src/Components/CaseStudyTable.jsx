import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

const statusColor = {
  Published: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  Draft: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  Archived: "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20",
};

const categoryColor = {
  Finance: "bg-[var(--color-primary)]",
  Healthcare: "bg-emerald-500",
  Technology: "bg-indigo-500",
  Retail: "bg-amber-500",
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
    <div className="card shadow-card relative overflow-hidden w-full">
      {/* Table Header - Hidden on Mobile */}
      <div
        className="
          hidden
          lg:grid
          lg:grid-cols-[90px_3fr_2fr_1.5fr_1.2fr_140px_110px]
          items-center
          px-6
          py-4
          text-[var(--color-paragraph)]
          opacity-50
          text-[11px]
          font-bold
          uppercase
          tracking-wider
          border-b
          border-[var(--color-border)]
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
      <div className="divide-y divide-[var(--color-border)]">
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
              hover:bg-[var(--color-sub-bg)]/40
              transition-colors
              duration-200
            "
          >
            {/* Mobile Header: ID and Actions */}
            <div className="flex justify-between items-center w-full lg:hidden mb-2">
              <div className="font-mono text-[11px] text-[var(--color-paragraph)] opacity-70">
                #{study._id.slice(-6).toUpperCase()}
              </div>
              <div className="flex gap-2">
                <button
                  title="Edit Case Study"
                  onClick={() => navigate(`/admin/edit-case-study/${study._id}`)}
                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-70 hover:opacity-100"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  <FiEdit2 size={13} />
                </button>
                <button
                  title="Delete Case Study"
                  onClick={() => deleteCaseStudy(study._id)}
                  className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
            {/* Desktop ID */}
            <div className="hidden lg:block font-mono text-[11px] text-[var(--color-paragraph)] opacity-70">
              #{study._id.slice(-6).toUpperCase()}
            </div>

            {/* Case Study Details */}
            <div className="flex items-center gap-3.5 min-w-0 pr-4">
              <img
                src={study.coverImage || "https://via.placeholder.com/80"}
                alt={study.title}
                className="w-12 h-12 object-cover flex-shrink-0 border border-[var(--color-border)]"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
              <div className="min-w-0">
                <h3 
                  onClick={() => navigate(`/admin/edit-case-study/${study._id}`)}
                  className="font-semibold text-[var(--color-black)] text-sm truncate hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                >
                  {study.title}
                </h3>
                <p className="text-[11px] text-[var(--color-paragraph)] opacity-60 mt-0.5">
                  {study.duration}
                </p>
              </div>
            </div>

            {/* Mobile Meta Details Grid */}
            <div className="grid grid-cols-2 gap-4 w-full lg:hidden mt-2">
              <div>
                <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 uppercase mb-1">Author</p>
                <p className="font-medium text-sm text-[var(--color-black)] truncate">{study.author}</p>
                <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-0.5 truncate">{study.authorRole}</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 uppercase mb-1">Category</p>
                <div className="flex items-center gap-2 text-sm text-[var(--color-paragraph)] opacity-80">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${categoryColor[study.category] || "bg-slate-500"}`}></span>
                  <span className="truncate">{study.category}</span>
                </div>
              </div>
            </div>

            {/* Desktop Author */}
            <div className="hidden lg:block min-w-0 pr-4">
              <p className="font-medium text-sm text-[var(--color-black)] truncate">
                {study.author}
              </p>
              <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-0.5 truncate">
                {study.authorRole}
              </p>
            </div>

            {/* Desktop Category */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-[var(--color-paragraph)] opacity-80">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  categoryColor[study.category] || "bg-slate-500"
                }`}
              ></span>
              <span className="truncate">{study.category}</span>
            </div>

            {/* Status (Interactive Select Dropdown) */}
            <div className="flex flex-col lg:flex-row justify-start lg:justify-center items-start lg:items-center w-full lg:w-auto">
              <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 uppercase mb-1 lg:hidden">Status</p>
              <div className="relative inline-block w-[120px] lg:w-[110px]">
                <select
                  value={study.status}
                  onChange={(e) => handleStatusChange(study._id, e.target.value)}
                  className={`
                    appearance-none 
                    w-full 
                    text-center
                    font-semibold 
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
                    ${statusColor[study.status] || "bg-slate-100 text-slate-600 border border-slate-200"}
                  `}
                >
                  <option value="Published" className="bg-[var(--color-main-bg)] text-emerald-600">Published</option>
                  <option value="Draft" className="bg-[var(--color-main-bg)] text-amber-600">Draft</option>
                  <option value="Archived" className="bg-[var(--color-main-bg)] text-indigo-600">Archived</option>
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
            <div className="hidden lg:block text-center text-sm text-[var(--color-paragraph)] opacity-70">
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
                className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-70 hover:opacity-100"
                style={{ borderRadius: 'var(--radius-sm)' }}
                onClick={() => navigate(`/admin/edit-case-study/${study._id}`)}
              >
                <FiEdit2 size={13} />
              </button>

              <button
                title="Delete Case Study"
                onClick={() => deleteCaseStudy(study._id)}
                className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4.5 border-t border-[var(--color-border)] bg-[var(--color-sub-bg)]/40">
        <p className="text-[var(--color-paragraph)] opacity-50 text-xs">
          Showing <span className="text-[var(--color-black)] font-semibold">{caseStudies.length}</span> case studies
        </p>
      </div>
    </div>
  );
};

export default CaseStudyTable;