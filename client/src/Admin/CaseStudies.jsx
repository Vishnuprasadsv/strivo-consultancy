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

    const handleOpenAnalyticsModal = () => {
        fetchCaseStudies();
        setShowAnalyticsModal(true);
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

    // Category statistics & donut segments calculation
    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Technology': return '#3B82F6'; // Blue
            case 'Development': return '#10B981'; // Emerald
            case 'UI/UX': return '#F59E0B'; // Amber
            case 'Business': return '#A855F7'; // Purple
            case 'SaaS': return '#EC4899'; // Pink
            case 'Finance': return '#06B6D4'; // Cyan
            case 'Healthcare': return '#14B8A6'; // Teal
            case 'Retail': return '#F43F5E'; // Rose
            default: return '#6B7280'; // Gray
        }
    };

    const getCategoryStats = () => {
        const counts = {};
        caseStudies.forEach(study => {
            const cat = study.category || 'Technology';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return counts;
    };

    const categoryCounts = getCategoryStats();
    const totalCaseStudiesForDonut = caseStudies.length || 1;

    const radius = 40;
    const circumference = 2 * Math.PI * radius; // Approx 251.327

    // Sort categories by count desc so largest segments come first
    const categoryMap = Object.keys(categoryCounts)
        .map(name => ({
            name,
            count: categoryCounts[name],
            color: getCategoryColor(name)
        }))
        .sort((a, b) => b.count - a.count);

    let currentOffset = 0;
    const donutSegments = [];

    categoryMap.forEach((segment) => {
        if (segment.count > 0) {
            const percentage = segment.count / totalCaseStudiesForDonut;
            const strokeLength = percentage * circumference;
            const strokeOffset = circumference - strokeLength + currentOffset;

            donutSegments.push({
                color: segment.color,
                strokeOffset: strokeOffset
            });

            currentOffset = currentOffset - strokeLength;
        }
    });

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
                                onClick={handleOpenAnalyticsModal}
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
                        <div className="w-full max-w-4xl max-h-[90vh] flex flex-col border border-[var(--color-border)] bg-white shadow-xl overflow-hidden" style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-primary)' }}>
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 bg-white">
                                <div className="min-w-0 pr-4 flex-1 text-left">
                                    <h2 className="text-lg font-bold text-primary truncate block" style={{ margin: 0 }}>
                                        CASE STUDIES ANALYTICS
                                    </h2>
                                    <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-1">
                                        Real-time stats overview of all case studies
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAnalyticsModal(false)}
                                    className="w-8 h-8 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-[var(--color-paragraph)] opacity-60 hover:opacity-100 cursor-pointer text-xs shrink-0"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 bg-[var(--color-sub-bg)]/35 overflow-y-auto flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column: Donut Chart / Category Breakdown */}
                                    <div className="card p-5 bg-white shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] flex flex-col items-center justify-center text-center">
                                        <h3 className="text-xs font-bold text-[var(--color-black)] uppercase tracking-wider mb-4" style={{ margin: 0 }}>
                                            Category Breakdown
                                        </h3>

                                        {caseStudies.length > 0 ? (
                                            <>
                                                <div className="relative w-36 h-36 mb-4">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-border)" strokeWidth="10" />
                                                        {donutSegments.map((segment, idx) => (
                                                            <circle
                                                                key={idx}
                                                                cx="50"
                                                                cy="50"
                                                                r={radius}
                                                                fill="transparent"
                                                                stroke={segment.color}
                                                                strokeWidth="10"
                                                                strokeDasharray={circumference}
                                                                strokeDashoffset={segment.strokeOffset}
                                                                strokeLinecap="round"
                                                                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                                                            />
                                                        ))}
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-2xl font-extrabold text-[var(--color-black)]">{caseStudies.length}</span>
                                                        <span className="text-[9px] text-[var(--color-paragraph)] opacity-50 uppercase tracking-widest">Studies</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs w-full max-w-[280px] border-t border-[var(--color-border)] pt-4 mt-2">
                                                    {categoryMap.map((segment) => (
                                                        <div key={segment.name} className="flex justify-between items-center">
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }}></span>
                                                                <span className="text-[var(--color-paragraph)] opacity-85 truncate text-left" title={segment.name}>{segment.name}</span>
                                                            </div>
                                                            <span className="font-semibold text-[var(--color-black)] ml-1">{segment.count}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-xs text-[var(--color-paragraph)] opacity-50 py-12">
                                                No case studies to analyze.
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Key Metrics */}
                                    <div className="flex flex-col gap-4 justify-between h-full">
                                        {stats.map((item) => (
                                            <div
                                                key={item.title}
                                                className="card bg-white p-4 px-5 flex justify-between items-center shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)] flex-1 min-h-[72px]"
                                            >
                                                <div className="text-left">
                                                    <h3 className="card-title-custom text-xs text-[var(--color-paragraph)] font-semibold uppercase tracking-wider" style={{ margin: 0 }}>
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 font-semibold mt-0.5" style={{ margin: 0 }}>
                                                        {item.subtitle}
                                                    </p>
                                                </div>
                                                <p className="stats-number text-2xl font-black text-[var(--color-primary)]" style={{ margin: 0, lineHeight: 1 }}>
                                                    {item.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end border-t border-[var(--color-border)] px-6 py-4 bg-white">
                                <button
                                    onClick={() => setShowAnalyticsModal(false)}
                                    className="bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:text-white hover:bg-[var(--color-primary)] px-5 py-2 rounded-[var(--radius-sm)] transition font-semibold cursor-pointer h-10 text-sm flex items-center justify-center"
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