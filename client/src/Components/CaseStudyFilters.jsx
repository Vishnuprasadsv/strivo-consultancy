import React from "react";
import { FiSearch} from "react-icons/fi";

const CaseStudyFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  industry,
  setIndustry,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="card bg-white p-4 mb-6 shadow-md border border-[var(--color-border)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-paragraph)] opacity-60 text-base" />
          <input
            type="text"
            placeholder="Search case studies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-[var(--color-sub-bg)]
              border
              border-[var(--color-border)]
              rounded-[var(--radius-sm)]
              py-2.5
              pl-11
              pr-4
              text-sm
              text-[var(--color-paragraph)]
              placeholder-gray-400
              outline-none
              focus:border-[var(--color-primary)]
              transition
            "
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              appearance-none
              w-full
              bg-white
              border
              border-[var(--color-border)]
              rounded-[var(--radius-sm)]
              pl-4
              pr-10
              py-2.5
              text-sm
              text-[var(--color-paragraph)]
              outline-none
              focus:border-[var(--color-primary)]
              cursor-pointer
              transition
            "
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
          {/* Custom Arrow Icon */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-paragraph)] opacity-60">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Industry Dropdown */}
        <div className="relative">
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="
              appearance-none
              w-full
              bg-white
              border
              border-[var(--color-border)]
              rounded-[var(--radius-sm)]
              pl-4
              pr-10
              py-2.5
              text-sm
              text-[var(--color-paragraph)]
              outline-none
              focus:border-[var(--color-primary)]
              cursor-pointer
              transition
            "
          >
            <option value="All">All Categories</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Technology">Technology</option>
            <option value="Retail">Retail</option>
          </select>
          {/* Custom Arrow Icon */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-paragraph)] opacity-60">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="
              appearance-none
              w-full
              bg-white
              border
              border-[var(--color-border)]
              rounded-[var(--radius-sm)]
              pl-4
              pr-10
              py-2.5
              text-sm
              text-[var(--color-paragraph)]
              outline-none
              focus:border-[var(--color-primary)]
              cursor-pointer
              transition
            "
          >
            <option value="Latest First">Latest First</option>
            <option value="Oldest First">Oldest First</option>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
          </select>

          {/* Custom Arrow Icon */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-paragraph)] opacity-60">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyFilters;


              