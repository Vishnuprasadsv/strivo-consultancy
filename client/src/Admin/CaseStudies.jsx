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
import CaseStudyStats from "../components/CaseStudyStats";
import CaseStudyFilters from "../components/CaseStudyFilters";
import CaseStudyTable from "../components/CaseStudyTable";

const CaseStudies = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [industry, setIndustry] = useState("All");
    const [sortBy, setSortBy] = useState("Latest First");
    const [loading, setLoading] = useState(true);
    const [caseStudies, setCaseStudies] = useState([]);

    useEffect(() => {
        fetchCaseStudies();
    }, []);

    const fetchCaseStudies = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/case-studies"
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

    return (
        <div className="min-h-screen md:ml-64 pt-28 px-6 pb-10">

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >

                {/* Header */}

                <div className="flex justify-between items-center mb-8">

                    <div>
                        <h1 className="text-4xl font-bold">
                            Case Studies
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Showcase successful client projects and
                            business outcomes.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/create-case-study")}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl flex items-center gap-2"
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
                    caseStudies={filteredStudies}
                />

            </motion.div>
        </div>
    );
};

export default CaseStudies;