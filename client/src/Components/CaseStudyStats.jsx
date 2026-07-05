import React from "react";

const CaseStudyStats = ({ stats }) => {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
      {stats.map((item) => {
        return (
          <div
            key={item.title}
            className="card p-5 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)]/40 hover:shadow-lg transition-all duration-300 group"
          >
            <h3 style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-medium)', color: 'var(--color-paragraph)', opacity: 0.7, margin: 0 }}>{item.title}</h3>
            <p style={{ fontSize: 'var(--text-sub-heading)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '4px 0 0 0' }}>{item.value}</p>
            <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-semibold)', color: 'var(--color-paragraph)', opacity: 0.6, margin: '4px 0 0 0' }}>{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CaseStudyStats;