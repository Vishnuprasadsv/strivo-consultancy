import React from "react";

const CaseStudyStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {stats.map((item) => {
        return (
          <div
            key={item.title}
            className="card bg-white p-4 flex flex-col justify-between items-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-300"
          >
            <div>
              <h3 className="card-title-custom" style={{ margin: 0 }}>{item.title}</h3>
              <p className="stats-number" style={{ margin: '3px 0 0 0', lineHeight: 1.1 }}>{item.value}</p>
              <p className="text-black opacity-70 mt-1 font-semibold" style={{ fontSize: 'var(--text-caption)' }}>{item.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CaseStudyStats;