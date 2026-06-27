import React from "react";

const colorClasses = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/30",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-500",
    border: "border-green-500/30",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/30",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/30",
  },
};

const CaseStudyStats = ({ stats }) => {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
      {stats.map((item) => {
        const color = colorClasses[item.color];

        return (
          <div
            key={item.title}
            className={`
              bg-white/5
              backdrop-blur-xl
              border
              ${color.border}
              rounded-2xl
              p-6
              hover:-translate-y-1
              transition-all
              duration-300
              shadow-lg
            `}
          >
            <div className="flex items-center gap-4">

              <div
                className={`
                  w-16 h-16
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-3xl
                  ${color.bg}
                  ${color.text}
                `}
              >
                {item.icon}
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  {item.title}
                </p>

                <h3 className="text-4xl font-bold mt-1">
                  {item.value}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {item.subtitle}
                </p>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CaseStudyStats;