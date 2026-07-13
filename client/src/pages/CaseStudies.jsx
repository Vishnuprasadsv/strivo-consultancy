import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingIndicator from "../Components/LoadingIndicator";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const CaseStudies = () => {
  const navigate = useNavigate();
  const cardsRef = useRef(null);
  const firstRender = useRef(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = ["All", "Finance", "Healthcare", "Technology", "Retail"];
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  const fetchCaseStudies = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/case-studies`
      );
      setCaseStudies(res.data.filter((item) => item.status === "Published"));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudies =
    selectedCategory === "All"
      ? caseStudies
      : caseStudies.filter((study) => study.category === selectedCategory);

  const totalPages = Math.ceil(filteredStudies.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const paginatedStudies = filteredStudies.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--color-primary)] text-white py-16 lg:py-20">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[180px] opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-[50px] lg:px-[50px] relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="w-full lg:mx-auto lg:text-center lg:flex lg:flex-col lg:items-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold mb-6 leading-tight w-full">
              Proven Results for Industry Leaders
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Explore how we partner with forward-thinking organizations to
              drive transformation, optimize operations, and achieve sustainable
              growth.
            </p>

            <div className="flex flex-wrap gap-4 lg:justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-2 rounded-sm text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-white text-[var(--color-primary)] shadow-md"
                      : "bg-transparent border border-white/40 text-white hover:bg-white/10 hover:border-white/60"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case Studies List */}
      <section className="py-12 md:py-16 lg:py-20 max-w-7xl mx-auto px-6 md:px-[50px] lg:px-[50px]" ref={cardsRef}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="mb-8"
        >
          <p className="text-gray-500 font-medium text-sm">
            Showing {paginatedStudies.length} of {filteredStudies.length} case
            studies
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="bg-white rounded-sm overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              {/* Card Image Header */}
              <div className="relative overflow-hidden aspect-[16/10] flex items-center justify-center bg-gray-100">
                <img
                  src={study.coverImage}
                  alt={study.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-sm z-10 shadow-sm">
                  {study.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-[22px] font-bold text-[var(--color-primary)] mb-4 leading-snug line-clamp-2">
                  {study.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                  {study.summary}
                </p>

                {/* Footer with Link */}
                <div className="mt-auto border-t border-gray-100 pt-5">
                  <button
                    onClick={() => {
                      navigate(`/case-study-details/${study._id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity group/btn"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-sm bg-[var(--color-primary)] text-white disabled:opacity-40 hover:bg-[#01193a] transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-sm font-bold transition ${
                  currentPage === i + 1
                    ? "text-[var(--color-primary)] bg-transparent"
                    : "text-gray-600 bg-transparent hover:text-[var(--color-primary)]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-sm bg-[var(--color-primary)] text-white disabled:opacity-40 hover:bg-[#01193a] transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}

        {filteredStudies.length === 0 && (
          <div className="text-center text-gray-500 py-20 font-medium">
            No case studies found for this category.
          </div>
        )}
      </section>

      {/* Global Impact */}
      <section className="pb-12 md:pb-16 lg:pb-20 px-4 md:px-12 lg:px-[180px]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="bg-[var(--color-primary)] rounded-sm p-10 md:p-14 lg:p-16 text-center relative overflow-hidden shadow-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            {/* Background texture/glow for the box */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[150px] opacity-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white mb-4 relative z-10">
              Global Impact
            </h2>
            <p className="text-gray-300 mb-16 relative z-10 text-lg">
              Quantifiable results delivered across industries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                { value: "$2B+", label: "VALUE CREATED", icon: <BarChartIcon fontSize="medium" sx={{ color: "white" }} /> },
                { value: "50+", label: "ENTERPRISE CLIENTS", icon: <GroupIcon fontSize="medium" sx={{ color: "white" }} /> },
                { value: "12", label: "COUNTRIES SERVED", icon: <PublicIcon fontSize="medium" sx={{ color: "white" }} /> },
                { value: "98%", label: "CLIENT RETENTION", icon: <TrackChangesIcon fontSize="medium" sx={{ color: "white" }} /> },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex items-center justify-center lg:justify-center gap-5"
                >
                  <div className="w-[60px] h-[60px] shrink-0 rounded-sm border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-inner">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-[32px] leading-none font-bold text-white mb-1.5">
                      {item.value}
                    </h3>
                    <p className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                      {item.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;