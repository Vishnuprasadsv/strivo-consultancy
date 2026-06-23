import React, { useState } from "react";
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

  const caseStudies = [
    {
      
      category: "Finance",
      title: "Global Bank Digital Transformation",
      description:
        "Modernized core banking infrastructure, enabling faster transaction processing and improved customer experience.",
      result: "+40%",
      label: "REVENUE GROWTH",
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200",
    },
    {
      
      category: "Healthcare",
      title: "Healthcare Supply Chain Optimization",
      description:
        "Streamlined procurement and logistics for a national hospital network, reducing waste and ensuring critical supply availability.",
      result: "-25%",
      label: "OPERATIONAL COSTS",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200",
    },
    {
      
      category: "Tech",
      title: "SaaS Platform Scalability",
      description:
        "Architected a resilient cloud infrastructure allowing a hyper-growth startup to scale seamlessly across global markets.",
      result: "3x",
      label: "USER CAPACITY",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    },
  ];

  const categories = [
    "All",
    "Finance",
    "Healthcare",
    "Tech",
    "Retail",
  ];

  const filteredStudies =
    selectedCategory === "All"
      ? caseStudies
      : caseStudies.filter(
        (study) => study.category === selectedCategory
      );

  return (
    <div className="bg-black text-white min-h-screen">
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
        <div className="grid lg:grid-cols-3 gap-6">
          {filteredStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="border border-slate-800 rounded-xl overflow-hidden bg-[#050505]
                         hover:border-blue-500 hover:-translate-y-2
                         transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-56 object-cover"
                />

                <span className="absolute top-4 left-4 bg-blue-600 text-xs px-3 py-1 rounded">
                  {study.category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">
                  {study.title}
                </h3>

                <p className="text-gray-400 mb-6">
                  {study.description}
                </p>

                <div className="bg-slate-800 rounded-lg p-5 mb-6">
                  <div className="text-4xl font-bold text-blue-500">
                    {study.result}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {study.label}
                  </div>
                </div>

                <button
                  className="text-blue-500 font-medium
                             hover:text-white hover:translate-x-2
                             transition-all duration-300"
                  onClick={() => {
                    navigate("/case-study-details", {
                      state: study,
                    });

                    window.scrollTo(0, 0);
                  }}
                >
                  View Project →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredStudies.length === 0 && (
          <div className="text-center text-gray-500 py-20">
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