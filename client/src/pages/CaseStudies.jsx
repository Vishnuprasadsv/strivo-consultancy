import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const CaseStudies = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = [

    "All",

    "Finance",

    "Healthcare",

    "Technology",

    "Retail"

  ];
  useEffect(() => {

    fetchCaseStudies();

  }, []);

  const fetchCaseStudies = async () => {

    try {

      const res = await axios.get(

        "http://localhost:5000/api/case-studies"

      );

      setCaseStudies(

        res.data.filter(

          item => item.status === "Published"

        )

      );

    }

    catch (err) {

      console.log(err);

    }

    finally {

      setLoading(false);

    }

  }
  const filteredStudies =
    selectedCategory === "All"
      ? caseStudies
      : caseStudies.filter(
        (study) => study.category === selectedCategory
      );
  if(loading){

return(

<div className="flex justify-center items-center h-screen">

Loading...

</div>

)

}
  return (
    <div className="bg-transparent text-white min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 py-20 text-center"
      >
        <h1 className="text-5xl font-bold mb-6">
          Proven Results for Industry Leaders
        </h1>

        <p className="text-gray-400 max-w-3xl mx-auto mb-10">
          Explore how we partner with forward-thinking organizations
          to drive transformation, optimize operations, and achieve
          sustainable growth.
        </p>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105
                ${selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-white hover:bg-blue-600"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Results Count */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 pb-8"
      >
        <p className="text-gray-400">
          Showing {filteredStudies.length} case studies
        </p>
      </motion.div>
      {/* Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group relative border border-slate-800/80 rounded-2xl overflow-hidden bg-[#0d131f]/40 backdrop-blur-md
                         hover:border-blue-500/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)]
                         transition-all duration-500 flex flex-col h-full"
            >
              {/* Image & Category Badge */}
              {/* Image Header with Container */}
<div className="relative overflow-hidden aspect-[16/10] bg-[#070b13] flex items-center justify-center">
  <img
    src={study.coverImage}
    alt={study.title}
    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-20 pointer-events-none" />
  <span className="absolute top-4 left-4 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg z-10">
    {study.category}
  </span>
</div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 leading-snug">
                  {study.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {study.summary}
                </p>

               
                {/* Footer with Slide-arrow Button */}
                <div className="border-t border-slate-800/60 pt-5 mt-auto flex items-center justify-between">
                  <button
                    onClick={() => {
                      navigate(`/case-study-details/${study._id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 group/btn transition-colors"
                  >
                    View Project
                    <svg
                      className="w-4 h-4 transform group-hover/btn:translate-x-1.5 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredStudies.length === 0 && (
          <div className="text-center text-gray-500 py-20 font-medium">
            No case studies found for this category.
          </div>
        )}
      </section>

      {/* Global Impact */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
        className="border-t border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Global Impact
          </h2>

          <p className="text-gray-400 mb-14">
            Quantifiable results delivered across industries.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { value: "$2B+", label: "VALUE CREATED" },
              { value: "50+", label: "ENTERPRISE CLIENTS" },
              { value: "12", label: "COUNTRIES SERVED" },
              { value: "98%", label: "CLIENT RETENTION" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
              >
                <h3 className="text-5xl font-bold text-blue-500">
                  {item.value}
                </h3>

                <p className="text-gray-400 mt-2">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default CaseStudies;