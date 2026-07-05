import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiLayers,
    FiCheckCircle,
    FiEdit,
    FiArchive,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import CaseStudyStats from "../Components/CaseStudyStats";
import CaseStudyFilters from "../Components/CaseStudyFilters";
import CaseStudyTable from "../Components/CaseStudyTable";

const CaseStudies = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [industry, setIndustry] = useState("All");
    const [sortBy, setSortBy] = useState("Latest First");
    const [loading, setLoading] = useState(true);
    const [caseStudies, setCaseStudies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, status, industry, sortBy]);

    useEffect(() => {
        fetchCaseStudies();
    }, []);

    const fetchCaseStudies = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/case-studies`
            );

            setCaseStudies(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudies = caseStudies
        .filter((study) => {

            const matchesSearch =
                study.title?.toLowerCase().includes(search.toLowerCase()) ||
                study.author?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                status === "All" ||
                study.status === status;

            const matchesIndustry =
                industry === "All" ||
                study.category === industry;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesIndustry
            );
        })
        .sort((a, b) => {

            if (sortBy === "Latest First") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }

            if (sortBy === "Oldest First") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }

            if (sortBy === "A-Z") {
                return a.title.localeCompare(b.title);
            }

            if (sortBy === "Z-A") {
                return b.title.localeCompare(a.title);
            }

            return 0;

        });
    const stats = [
        {
            title: "Total Case Studies",
            value: caseStudies.length,
            subtitle: "All case studies",
            color: "blue",
            icon: <FiLayers />,
        },
        {
            title: "Published",
            value: caseStudies.filter(
                study => study.status === "Published"
            ).length,
            subtitle: "Visible on website",
            color: "green",
            icon: <FiCheckCircle />,
        },
        {
            title: "Drafts",
            value: caseStudies.filter(
                study => study.status === "Draft"
            ).length,
            subtitle: "Not published",
            color: "orange",
            icon: <FiEdit />,
        },
        {
            title: "Archived",
            value: caseStudies.filter(
                study => study.status === "Archived"
            ).length,
            subtitle: "Archived studies",
            color: "purple",
            icon: <FiArchive />,
        },
    ];
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                Loading Case Studies...
            </div>
        );
    }

    const itemsPerPage = 5;
    const indexOfLastStudy = currentPage * itemsPerPage;
    const indexOfFirstStudy = indexOfLastStudy - itemsPerPage;
    const currentStudies = filteredStudies.slice(indexOfFirstStudy, indexOfLastStudy);
    const totalPages = Math.ceil(filteredStudies.length / itemsPerPage);

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-8 pb-8 relative z-10 md:ml-56 bg-sub">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 mb-6 pb-5 border-b border-[var(--color-border)]">
                    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                        <h1 style={{ fontSize: '26px', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }}>
                            Case Studies
                        </h1>
                        <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-paragraph)', opacity: 0.6, margin: '2px 0 0 0' }}>
                            Showcase successful client projects and business outcomes.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/create-case-study")}
                        className="btn px-4 py-2 flex items-center justify-center gap-2 cursor-pointer border-none w-full sm:w-auto h-10 text-sm"
                        style={{ fontWeight: 'var(--font-medium)' }}
                    >
                        <FiPlus />
                        Create Case Study
                    </button>
                </div>

                {/* Stats */}

                <CaseStudyStats stats={stats} />

                {/* Filters */}

                <CaseStudyFilters
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    industry={industry}
                    setIndustry={setIndustry}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
                {/* Table */}

                <CaseStudyTable
                    caseStudies={currentStudies}
                />

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border)]">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] text-xs rounded-[var(--radius-sm)] transition-all cursor-pointer font-semibold bg-[var(--color-main-bg)] disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-xs text-[var(--color-paragraph)] opacity-60">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="px-3 py-1.5 border border-[var(--color-border)] hover:bg-[var(--color-sub-bg)] text-[var(--color-paragraph)] text-xs rounded-[var(--radius-sm)] transition-all cursor-pointer font-semibold bg-[var(--color-main-bg)] disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}

            </motion.div>
        </div>
    );
};

export default CaseStudies;