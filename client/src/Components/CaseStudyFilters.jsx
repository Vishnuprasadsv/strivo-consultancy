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
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-8">
      <div className="grid xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto] lg:grid-cols-3 md:grid-cols-2 gap-4">
        
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search case studies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              py-3
              pl-12
              pr-4
              text-white
              placeholder-gray-400
              outline-none
              focus:border-blue-500
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
    bg-slate-900
    border
    border-slate-700
    rounded-xl
    pl-4
    pr-12
    py-3
    text-white
    outline-none
    focus:border-blue-500
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
          <div
  className="
    pointer-events-none
    absolute
    right-3
    top-1/2
    -translate-y-1/2
    text-gray-400
  "
>
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
    bg-slate-900
    border
    border-slate-700
    rounded-xl
    pl-4
    pr-12
    py-3
    text-white
    outline-none
    focus:border-blue-500
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
          <div
  className="
    pointer-events-none
    absolute
    right-3
    top-1/2
    -translate-y-1/2
    text-gray-400
  "
>
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
    bg-slate-900
    border
    border-slate-700
    rounded-xl
    pl-4
    pr-12
    py-3
    text-white
    outline-none
    focus:border-blue-500
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
          <div
  className="
    pointer-events-none
    absolute
    right-3
    top-1/2
    -translate-y-1/2
    text-gray-400
  "
>
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

              