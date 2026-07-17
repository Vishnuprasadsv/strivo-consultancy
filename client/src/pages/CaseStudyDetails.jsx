import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingIndicator from "../Components/LoadingIndicator";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import StrategynSolution from "../assets/Strategy&Solution.jpg";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

const CaseStudyDetails = () => {
    const { id } = useParams();

    const [study, setStudy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            question: "What was the project timeline?",
            answer: "The complete transformation engagement was delivered over a 12-month period.",
        },
        {
            question: "What consulting services were provided?",
            answer: "Strategic planning, digital transformation consulting, process optimization, and implementation governance.",
        },
        {
            question: "How was success measured?",
            answer: "Success was measured using revenue growth, operational efficiency, customer satisfaction, and ROI metrics.",
        },
    ];

    const relatedStudies = [
        {
            title: "Enterprise Cloud Transformation",
            category: "Technology",
        },
        {
            title: "Healthcare Operations Optimization",
            category: "Healthcare",
        },
        {
            title: "Financial Services Growth Strategy",
            category: "Finance",
        },
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const staggerContainer = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    useEffect(() => {
        fetchStudy();
    }, [id]);

    const fetchStudy = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/case-studies/${id}`
            );
            setStudy(res.data);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!study) {
        return (
            <div className="paragraph h-screen flex items-center justify-center">
                Case Study Not Found
            </div>
        );
    }

    return (
        <div className="bg-main min-h-screen">

            {/* HERO SECTION */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px] py-10">
                {/* Back Button matching Article Template */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="max-w-4xl flex flex-col items-start text-left"
                >
                    <Link
                        to="/casestudies"
                        className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]
                        transition-colors flex items-center border border-[var(--color-primary)]
                        rounded-md px-4 py-1.5 text-sm font-medium
                        hover:border-[var(--color-primary-hover)] cursor-pointer"
                    >
                        ← Back to Case Studies
                    </Link>
                </motion.div>

                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="mt-6 pt-9"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="main-heading leading-tight">
                                {study.title}
                            </h1>
                            <div className="mt-5">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-sub-bg)] border border-gray-200">
                                    <ScheduleOutlinedIcon
                                        sx={{
                                            fontSize: 18,
                                            color: "var(--color-primary)",
                                        }}
                                    />
                                    <span className="text-sm font-medium text-[var(--color-primary)]">
                                        Project Duration:
                                    </span>
                                    <span className="text-sm text-[var(--color-paragraph)]">
                                        {study.duration}
                                    </span>
                                </div>
                            </div>
                            <p className="paragraph mt-6">
                                {study.summary}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-6 text-[15px] text-gray-600">
                                {/* Date */}
                                <div className="flex items-center gap-2">
                                    <CalendarTodayOutlinedIcon
                                        sx={{ fontSize: 18, color: "var(--color-paragraph)" }}
                                    />
                                    <span>
                                        {study.publicationDate
                                            ? new Date(study.publicationDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "-"}
                                    </span>
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-2">
                                    <PersonOutlineOutlinedIcon
                                        sx={{ fontSize: 18, color: "var(--color-paragraph)" }}
                                    />
                                    <span>Published by {study.author}</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-64 sm:h-80 lg:h-auto min-h-[250px] relative w-full overflow-hidden rounded-[var(--radius-sm)] border border-[#374151]">
                            <img
                                src={study.coverImage}
                                alt={study.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </motion.section>
            </div>

            {/* OTHER SECTIONS */}
            <div className="bg-sub w-full py-10 md:py-12">
                <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-[180px] space-y-12 md:space-y-16">

                    {/* BUSINESS CHALLENGE */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="sub-heading mb-6 md:mb-8">
                            Business Challenge
                        </h2>
                        <p className="paragraph mb-6">
                            {study.challenges}
                        </p>
                    </motion.section>

                    {/* STRATEGY & SOLUTION */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="sub-heading mb-8">
                            Strategy & Solution
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {[
                                    "Enterprise Cloud Migration",
                                    "Process Automation & Workflow Optimization",
                                    "Advanced Analytics & Reporting Infrastructure",
                                    "Omnichannel Customer Experience Strategy",
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-main card p-5 border border-gray-200 hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-lg"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                                                <span className="text-[var(--color-primary)] font-bold">
                                                    ✓
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-[var(--color-primary)]">
                                                    {item}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Right Image */}
                            <motion.div
                                variants={fadeUp}
                                className="relative"
                            >
                                <div className="overflow-hidden rounded-[var(--radius-sm)] shadow-xl border border-gray-200">
                                    <img
                                        src={StrategynSolution}
                                        alt="Strategy"
                                        className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* RESULTS & IMPACT */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="sub-heading mb-6 md:mb-8">
                            Results & Impact
                        </h2>
                        <p className="paragraph mb-10">
                            {study.results}
                        </p>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            <div className="bg-main rounded-[var(--radius-sm)] p-6 md:p-8 text-center">
                                <h3 className="text-5xl font-bold text-[var(--color-primary)] mb-3">
                                    35%
                                </h3>
                                <p className="paragraph">
                                    Revenue Growth
                                </p>
                            </div>
                            <div className="bg-main rounded-[var(--radius-sm)] p-6 md:p-8 text-center">
                                <h3 className="text-5xl font-bold text-[var(--color-primary)] mb-3">
                                    28%
                                </h3>
                                <p className="paragraph">
                                    Cost Reduction
                                </p>
                            </div>
                            <div className="bg-main rounded-[var(--radius-sm)] p-6 md:p-8 text-center">
                                <h3 className="text-5xl font-bold text-[var(--color-primary)] mb-3">
                                    42%
                                </h3>
                                <p className="paragraph">
                                    Productivity Increase
                                </p>
                            </div>
                            <div className="bg-main rounded-[var(--radius-sm)] p-6 md:p-8 text-center">
                                <h3 className="text-5xl font-bold text-[var(--color-primary)] mb-3">
                                    90%
                                </h3>
                                <p className="paragraph">
                                    Customer Satisfaction
                                </p>
                            </div>
                        </motion.div>
                    </motion.section>

                    {/* AUTHOR INFORMATION */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="sub-heading mb-6 md:mb-8">
                            About the Author
                        </h2>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="bg-main rounded-2xl p-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-center"
                        >
                            <div className="flex justify-center">
                                <img
                                    src={study.authorImage}
                                    alt="Author"
                                    className="w-40 h-40 rounded-full object-cover border-4 border-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <p className="text-3xl font-bold mt-2 text-[var(--color-primary)]">
                                    {study.author}
                                </p>
                                <a
                                    href={study.authorWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold hover:text-[var(--color-primary-hover)] transition break-all leading-relaxed inline-block max-w-full"
                                >
                                    {study.authorWebsite}
                                </a>

                                <p className="paragraph mt-4">
                                    {study.authorRole}
                                </p>
                                <div className="flex flex-wrap gap-3 mt-6">
                                    <span className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-full text-sm">
                                        Strategy
                                    </span>
                                    <span className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-full text-sm">
                                        Digital Transformation
                                    </span>
                                    <span className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-full text-sm">
                                        Operations
                                    </span>
                                    <span className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-full text-sm">
                                        Leadership
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
};

export default CaseStudyDetails;