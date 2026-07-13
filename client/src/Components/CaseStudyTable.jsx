import React from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiTrash2, FiEdit2, FiCalendar, FiEye } from "react-icons/fi";
import { toast } from "sonner";

const statusColor = {
  Published: "bg-[var(--color-primary)] text-white border-[var(--color-primary)]",
  Draft: "bg-[var(--color-primary)] text-white border-[var(--color-primary)]",
  Archived: "bg-[var(--color-primary)] text-white border-[var(--color-primary)]",
};

const categoryColor = {
  Finance: "bg-blue-800",
  Healthcare: "bg-emerald-500",
  Technology: "bg-violet-500",
  Retail: "bg-amber-500",
};

// added onStatusChange as a prop in case you want to update status in-place
const CaseStudyTable = ({ caseStudies, onStatusChange, onDelete, currentPage, totalPages, setCurrentPage }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [targetId, setTargetId] = React.useState(null);
  const [selectedCaseStudyForView, setSelectedCaseStudyForView] = React.useState(null);

  const deleteCaseStudy = (id) => {
    setTargetId(id);
    setShowConfirm(true);
  };

  const executeDelete = async () => {
    const id = targetId;
    setShowConfirm(false);
    setTargetId(null);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/case-studies/${id}`);
      toast.success("Case study deleted successfully");
      if (onDelete) {
        onDelete(id);
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to delete case study:", err);
      toast.error("Failed to delete case study");
    }
  };

  return (
    <div className="card bg-white shadow-md border border-[var(--color-border)] relative overflow-hidden w-full" style={{ borderRadius: 'var(--radius-sm)' }}>
      {/* Table Header - Hidden on Mobile */}
      <div
        className="
          hidden
          lg:grid
          lg:grid-cols-[3fr_2.25fr_2.25fr_2.25fr_1.25fr]
          items-center
          px-8
          lg:px-10
          py-4
          text-primary
          text-xs
          font-normal
          uppercase
          tracking-wider
          border-b
          border-[var(--color-border)]
        "
      >
        <div>Case Study</div>
        <div>Category</div>
        <div>Status</div>
        <div>Published</div>
        <div className="text-right pr-2">Actions</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-[var(--color-border)]">
        {caseStudies.map((study) => (
          <div
            key={study._id}
            className="
              flex flex-col lg:grid
              lg:grid-cols-[3fr_2.25fr_2.25fr_2.25fr_1.25fr]
              items-start lg:items-center
              gap-3.5 lg:gap-0
              px-8 lg:px-10
              py-4 lg:py-3.5
              hover:bg-[var(--color-sub-bg)]/40
              transition-colors
              duration-200
            "
          >
            {/* Mobile Header: Cover Image + Title & Actions */}
            <div className="flex justify-between items-start w-full lg:hidden gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={study.coverImage || "https://via.placeholder.com/80"}
                  alt={study.title}
                  className="w-16 h-10 object-cover flex-shrink-0 border border-[var(--color-border)]"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                />
                <div className="min-w-0">
                  <h3 
                    onClick={() => setSelectedCaseStudyForView(study)}
                    className="font-bold text-[var(--color-black)] text-sm hover:text-[var(--color-primary)] transition-colors cursor-pointer truncate block max-w-full"
                  >
                    {study.title}
                  </h3>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  title="View Case Study"
                  onClick={() => setSelectedCaseStudyForView(study)}
                  className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]"
                >
                  <FiEye size={13} />
                </button>
                <button
                  title="Edit Case Study"
                  onClick={() => navigate(`/admin/edit-case-study/${study._id}`)}
                  className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]"
                >
                  <FiEdit2 size={13} />
                </button>
                <button
                  title="Delete Case Study"
                  onClick={() => deleteCaseStudy(study._id)}
                  className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-[var(--radius-sm)]"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>

            {/* Desktop Case Study Column */}
            <div className="hidden lg:flex items-center gap-3.5 min-w-0 pr-2 w-full">
              <img
                src={study.coverImage || "https://via.placeholder.com/80"}
                alt={study.title}
                className="w-16 h-10 object-cover flex-shrink-0 border border-[var(--color-border)]"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
              <div className="min-w-0 w-full">
                <h3 
                  onClick={() => setSelectedCaseStudyForView(study)}
                  className="font-bold text-[var(--color-black)] text-sm truncate block max-w-full hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                >
                  {study.title}
                </h3>
              </div>
            </div>

            {/* Category Column */}
            <div className="w-full lg:w-auto flex justify-between lg:block border-t lg:border-none pt-2.5 lg:pt-0">
              <span className="text-[10px] uppercase font-bold text-[var(--color-paragraph)] opacity-60 lg:hidden">Category</span>
              <div className="flex items-center gap-2 text-xs text-[var(--color-paragraph)] font-semibold pr-2">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    categoryColor[study.category] || "bg-slate-500"
                  }`}
                ></span>
                <span className="truncate uppercase tracking-wider">{study.category}</span>
              </div>
            </div>

            {/* Status Column */}
            <div className="w-full lg:w-auto flex justify-between lg:block border-t lg:border-none pt-2.5 lg:pt-0">
              <span className="text-[10px] uppercase font-bold text-[var(--color-paragraph)] opacity-60 lg:hidden">Status</span>
              <div className="flex items-center">
                <span className="text-xs font-semibold text-[var(--color-paragraph)] uppercase tracking-wider">
                  {study.status}
                </span>
              </div>
            </div>

            {/* Published Column */}
            <div className="w-full lg:w-auto flex justify-between lg:block border-t lg:border-none pt-2.5 lg:pt-0">
              <span className="text-[10px] uppercase font-bold text-[var(--color-paragraph)] opacity-60 lg:hidden">Published</span>
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-paragraph)] font-semibold pr-2 uppercase tracking-wider">
                <FiCalendar className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                <span>
                  {study.publicationDate
                    ? new Date(study.publicationDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }).toUpperCase()
                    : "—"}
                </span>
              </div>
            </div>

            {/* Desktop Actions Column */}
            <div className="hidden lg:flex justify-end gap-1.5 pr-2">
              <button
                title="View Case Study"
                onClick={() => setSelectedCaseStudyForView(study)}
                className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]"
              >
                <FiEye size={13} />
              </button>
              <button
                title="Edit Case Study"
                className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]"
                onClick={() => navigate(`/admin/edit-case-study/${study._id}`)}
              >
                <FiEdit2 size={13} />
              </button>
              <button
                title="Delete Case Study"
                onClick={() => deleteCaseStudy(study._id)}
                className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-[var(--radius-sm)]"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer & Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-8 lg:px-10 py-4 border-t border-[var(--color-border)] bg-white gap-3">
        <p className="text-[var(--color-paragraph)] opacity-50 text-xs">
          Showing <span className="text-[var(--color-black)] font-semibold">{caseStudies.length}</span> case studies
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs rounded-[var(--radius-sm)] transition disabled:opacity-30 disabled:hover:bg-[var(--color-primary)] cursor-pointer disabled:cursor-not-allowed font-semibold h-8 flex items-center justify-center"
            >
              &lt;
            </button>
            <span className="text-xs text-[var(--color-paragraph)] opacity-70 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs rounded-[var(--radius-sm)] transition disabled:opacity-30 disabled:hover:bg-[var(--color-primary)] cursor-pointer disabled:cursor-not-allowed font-semibold h-8 flex items-center justify-center"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-[var(--radius-sm)] shadow-xl max-w-sm w-full mx-4 border border-[var(--color-border)] text-left">
            <h3 className="text-[var(--color-primary)] font-bold text-lg mb-2">Delete Case Study</h3>
            <p className="text-[var(--color-paragraph)] text-sm mb-5">
              Are you sure you want to delete this case study? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setTargetId(null);
                }}
                className="border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center"
                style={{ height: '34px', padding: '0 16px' }}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center"
                style={{ height: '34px', padding: '0 16px' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View/Read Case Study Modal */}
      {selectedCaseStudyForView &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl border border-[var(--color-border)] bg-[var(--color-main-bg)] shadow-xl overflow-hidden flex flex-col max-h-[85vh]" style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-primary)' }}>
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 bg-white">
                <div className="min-w-0 flex-1 pr-4 text-left">
                  <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    {selectedCaseStudyForView.category}
                  </span>
                  <h2 className="text-md font-bold text-primary truncate block mt-0.5" style={{ margin: 0 }}>
                    {selectedCaseStudyForView.title}
                  </h2>
                  <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 mt-1">
                    Author: <span className="font-semibold">{selectedCaseStudyForView.author}</span> ({selectedCaseStudyForView.authorRole}) | Published: {selectedCaseStudyForView.publicationDate 
                      ? new Date(selectedCaseStudyForView.publicationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
                      : new Date(selectedCaseStudyForView.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
                    }
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCaseStudyForView(null)}
                  className="w-8 h-8 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-paragraph opacity-60 hover:opacity-100 cursor-pointer text-xs shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Content Area */}
              <div className="p-6 overflow-y-auto space-y-5 text-left flex-1 bg-white">
                {selectedCaseStudyForView.coverImage && (
                  <img
                    src={selectedCaseStudyForView.coverImage}
                    alt={selectedCaseStudyForView.title}
                    className="w-full h-48 object-cover border border-[var(--color-border)]"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  />
                )}
                
                {/* Summary Section */}
                {selectedCaseStudyForView.summary && (
                  <div>
                    <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1.5">Executive Summary</h3>
                    <p className="text-sm text-[var(--color-paragraph)] leading-relaxed whitespace-pre-wrap font-medium">{selectedCaseStudyForView.summary}</p>
                  </div>
                )}

                {/* Challenges Section */}
                {selectedCaseStudyForView.challenges && (
                  <div>
                    <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1.5">Challenges & Strategy</h3>
                    <p className="text-sm text-[var(--color-paragraph)] leading-relaxed whitespace-pre-wrap font-medium">{selectedCaseStudyForView.challenges}</p>
                  </div>
                )}

                {/* Results Section */}
                {selectedCaseStudyForView.results && (
                  <div>
                    <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1.5">Results & Impact</h3>
                    <p className="text-sm text-[var(--color-paragraph)] leading-relaxed whitespace-pre-wrap font-medium">{selectedCaseStudyForView.results}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[var(--color-border)] px-6 py-3 flex justify-end bg-[var(--color-sub-bg)]/20">
                <button
                  onClick={() => setSelectedCaseStudyForView(null)}
                  className="bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:text-white hover:bg-[var(--color-primary)] px-5 py-2 rounded-[var(--radius-sm)] transition font-semibold cursor-pointer h-10 text-sm flex items-center justify-center"
                >
                  Close Reader
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

export default CaseStudyTable;