import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingIndicator from "../Components/LoadingIndicator";
import { motion } from "framer-motion";
import {
    FiPlus,
    FiLayers,
    FiCheckCircle,
    FiEdit,
    FiArchive,
    FiBarChart2
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
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
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

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

    const handleStatusChange = (id, newStatus) => {
        setCaseStudies(prev =>
            prev.map(study =>
                study._id === id ? { ...study, status: newStatus } : study
            )
        );
    };

    const handleDeleteCaseStudy = (id) => {
        setCaseStudies(prev => prev.filter(study => study._id !== id));
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
        return <LoadingIndicator />;
    }

    const itemsPerPage = 5;
    const indexOfLastStudy = currentPage * itemsPerPage;
    const indexOfFirstStudy = indexOfLastStudy - itemsPerPage;
    const currentStudies = filteredStudies.slice(indexOfFirstStudy, indexOfLastStudy);
    const totalPages = Math.ceil(filteredStudies.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-sub flex flex-col" style={{ fontFamily: 'var(--font-primary)' }}>
            
            {/* Top Header Section with bg-main spanning full-width */}
            <div className="bg-main pt-24 pb-6 border-b border-[var(--color-border)] px-8 md:px-16 lg:px-24">
                <div className="max-w-[98%] mx-auto">
                    
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
                        <div className="text-left">
                            <h1 className="text-2xl font-[var(--font-bold)] text-primary leading-none uppercase" style={{ margin: 0 }}>
                                CASE STUDIES
                            </h1>
                            <p className="text-xs text-[var(--color-black)] font-medium opacity-85 mt-2" style={{ margin: '6px 0 0 0', lineHeight: 1.3 }}>
                                Manage and organize all case studies content.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setShowAnalyticsModal(true)}
                                className="bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:text-white hover:bg-[var(--color-primary)] px-2.5 py-1.5 rounded-[var(--radius-sm)] flex items-center justify-center gap-2 transition cursor-pointer h-8 text-xs font-normal w-full sm:w-auto"
                            >
                                <FiBarChart2 size={13} />
                                Analytics
                            </button>
                            <button
                                onClick={() => navigate("/admin/create-case-study")}
                                className="btn px-2.5 py-1.5 flex items-center justify-center gap-2 cursor-pointer border-none h-8 text-xs font-normal w-full sm:w-auto"
                                style={{ fontWeight: 'normal' }}
                            >
                                <FiPlus size={13} />
                                New Case Study
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Section - Rendered over grey backdrop (bg-sub) */}
            <div className="flex-grow py-8 px-8 md:px-16 lg:px-24">
                <div className="max-w-[98%] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
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
                            onStatusChange={handleStatusChange}
                            onDelete={handleDeleteCaseStudy}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Real-time Analytics Modal */}
            {showAnalyticsModal &&
                createPortal(
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="w-full max-w-4xl border border-[var(--color-border)] bg-[var(--color-main-bg)] shadow-xl overflow-hidden" style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-primary)' }}>
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 bg-white">
                                <div>
                                    <h2 className="text-lg font-bold text-primary" style={{ margin: 0 }}>
                                        CASE STUDIES ANALYTICS
                                    </h2>
                                    <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-1">
                                        Real-time stats overview of all case studies
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAnalyticsModal(false)}
                                    className="w-8 h-8 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-[var(--color-paragraph)] opacity-60 hover:opacity-100 cursor-pointer text-xs"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 bg-[var(--color-sub-bg)]/20">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {stats.map((item) => (
                                        <div
                                            key={item.title}
                                            className="card bg-white p-5 flex flex-col justify-between items-center text-center shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                                        >
                                            <h3 className="card-title-custom text-xs" style={{ margin: 0 }}>{item.title}</h3>
                                            <p className="stats-number text-2xl font-bold text-black" style={{ margin: '8px 0 8px 0', lineHeight: 1.1 }}>{item.value}</p>
                                            <p className="text-black opacity-60 text-[10px] font-semibold" style={{ margin: 0 }}>{item.subtitle}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end border-t border-[var(--color-border)] px-6 py-4 bg-white">
                                <button
                                    onClick={() => setShowAnalyticsModal(false)}
                                    className="px-5 py-2 border border-[var(--color-border)] text-sm text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition font-semibold cursor-pointer rounded-[var(--radius-sm)] h-10"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div>
    );
};

export default CaseStudies;