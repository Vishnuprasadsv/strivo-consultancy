import React from "react";
import { FiSearch } from "react-icons/fi";

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

        {/* Status */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            text-white
            outline-none
            focus:border-blue-500
          "
        >
          <option value="All">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
        </select>

        {/* Industry */}

        <select
  value={industry}
  onChange={(e) => setIndustry(e.target.value)}
  className="bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            text-white
            outline-none
            focus:border-blue-500
          "
>
  <option value="All">All Categories</option>
  <option value="Finance">Finance</option>
  <option value="Healthcare">Healthcare</option>
  <option value="Technology">Technology</option>
  <option value="Retail">Retail</option>
</select>

       
        {/* Sort */}

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            text-white
            outline-none
            focus:border-blue-500
          "
        >
          <option>Latest First</option>
          <option>Oldest First</option>
          <option>A-Z</option>
          <option>Z-A</option>
        </select>

        

      </div>
    </div>
  );
};

export default CaseStudyFilters;