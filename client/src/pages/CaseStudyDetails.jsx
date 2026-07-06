import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingIndicator from "../Components/LoadingIndicator";

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
            answer:
                "The complete transformation engagement was delivered over a 12-month period.",
        },
        {
            question: "What consulting services were provided?",
            answer:
                "Strategic planning, digital transformation consulting, process optimization, and implementation governance.",
        },
        {
            question: "How was success measured?",
            answer:
                "Success was measured using revenue growth, operational efficiency, customer satisfaction, and ROI metrics.",
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
        )
    }

    return (
        <div className=" bg-main  min-h-screen">

            {/* HERO SECTION */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="max-w-[110rem] mx-auto px-8 py-16"
            >
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <h1 className="main-heading  text-heading leading-tight">
                            {study.title}
                        </h1>

                        <p className="paragraph  mt-6">
                            {study.summary}
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-6 text-gray-400 text-sm">
                            <span>{study.author}</span>
                            <span>
                                {study.publicationDate
                                    ? new Date(study.publicationDate).toLocaleDateString()
                                    : "-"}
                            </span>
                            <span>{study.authorRole}</span>
                            <span>{study.duration}</span>
                        </div>
                    </div>

                    <div>
                        <img
                            src={study.coverImage}
                            alt={study.title}
                            className="w-full h-[400px] object-cover rounded-[3px]"
                        />
                    </div>
                </div>
            </motion.section>

            {/* OTHER SECTIONS */}
            <div className="bg-sub w-full py-16">
                <div className="max-w-[110rem] mx-auto px-8 space-y-16">
                    {/* EXECUTIVE SUMMARY */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="sub-heading mb-6">
                            Executive Summary
                        </h2>
                        <p className="paragraph">
                            {study.summary}
                        </p>
                    </motion.section>

                    {/* BUSINESS CHALLENGE */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="sub-heading mb-6">
                            Business Challenge
                        </h2>
                        <p className="paragraph mb-6">
                            {study.challenges}
                        </p>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid md:grid-cols-2 gap-6"
                        >
                        </motion.div>
                    </motion.section>

                    {/* STRATEGY & SOLUTION */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="sub-heading mb-6">
                            Strategy & Solution
                        </h2>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                ✓ Enterprise Cloud Migration
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                ✓ Process Automation & Workflow Optimization
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                ✓ Advanced Analytics & Reporting Infrastructure
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                ✓ Omnichannel Customer Experience Strategy
                            </div>
                        </motion.div>
                    </motion.section>

                    {/* RESULTS & IMPACT */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="sub-heading mb-8">
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
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                                <h3 className="text-5xl font-bold text-blue-500 mb-3">
                                    35%
                                </h3>
                                <p className="paragraph text-white">
                                    Revenue Growth
                                </p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                                <h3 className="text-5xl font-bold text-blue-500 mb-3">
                                    28%
                                </h3>
                                <p className="paragraph text-white">
                                    Cost Reduction
                                </p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                                <h3 className="text-5xl font-bold text-blue-500 mb-3">
                                    42%
                                </h3>
                                <p className="paragraph text-white">
                                    Productivity Increase
                                </p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                                <h3 className="text-5xl font-bold text-blue-500 mb-3">
                                    90%
                                </h3>
                                <p className="paragraph text-white">
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
                        <h2 className="sub-heading mb-8">
                            About the Author
                        </h2>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-center"
                        >
                            <div className="flex justify-center">
                                <img
                                    src={study.authorImage}
                                    alt="Author"
                                    className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
                                />
                            </div>
                            <div>
                                <p className=" text-white text-3xl font-bold mt-2">
                                    {study.author}
                                </p>
                                <a
                                    href={study.authorWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold hover:text-blue-500 transition break-all leading-relaxed inline-block max-w-full"
                                >
                                    {study.authorWebsite}
                                </a>

                                <p className="paragraph text-white mt-4">
                                    {study.authorRole}
                                </p>
                                <div className="flex flex-wrap gap-3 mt-6">
                                    <span className="px-4 py-2 bg-blue-500 rounded-full text-sm">
                                        Strategy
                                    </span>
                                    <span className="px-4 py-2 bg-blue-500 rounded-full text-sm">
                                        Digital Transformation
                                    </span>
                                    <span className="px-4 py-2 bg-blue-500 rounded-full text-sm">
                                        Operations
                                    </span>
                                    <span className="px-4 py-2 bg-blue-500 rounded-full text-sm">
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
