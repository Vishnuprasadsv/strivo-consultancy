import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import heroImage from "../assets/case-study-hero.jpg";
import chartImage from "../assets/chart-placeholder.jpg";
import authorImage from "../assets/author.jpg";

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
    const location = useLocation();
    const study = location.state || {
        title: "Case Study",
        image: heroImage,
        description:
            "Case study details are not available.",
        result: "N/A",
        label: "METRIC",
    };
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
    return (
        <div className="bg-transparent text-white min-h-screen">

            {/* HEADER */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 pt-16"
            >


                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8"
                >
                    {study.title}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-wrap gap-6 text-gray-400 border-b border-slate-800 pb-8"
                >
                    <span>Sarah Mitchell</span>
                    <span>May 14, 2025</span>
                    <span>Senior Strategy Consultant</span>
                    <span>8 min read</span>
                </motion.div>
            </motion.section>

            {/* FEATURED IMAGE */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-12"
            >
                <motion.img
                    src={study.image}
                    alt={study.title}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-[500px] object-cover rounded-2xl"
                />
            </motion.section>

            {/* EXECUTIVE SUMMARY */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-10"
            >
                <h2 className="text-4xl font-bold mb-6">
                    Executive Summary
                </h2>

                <p>{study.description}</p>
            </motion.section>

            {/* BUSINESS CHALLENGE */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-10"
            >
                <h2 className="text-4xl font-bold mb-6">
                    Business Challenge
                </h2>

                <p className="text-gray-300 leading-8 mb-6">
                    Prior to engagement, the client experienced several
                    critical operational and strategic challenges that
                    hindered growth and efficiency.
                </p>


                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 gap-6"
                >
                    <div>{study.result}</div>

                    <div>{study.label}</div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="font-semibold mb-3">
                            Customer Experience Gaps
                        </h3>
                        <p className="text-gray-400">
                            Inconsistent customer journeys impacted retention
                            and satisfaction.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="font-semibold mb-3">
                            Operational Costs
                        </h3>
                        <p className="text-gray-400">
                            High manual effort increased operational expenses
                            and slowed decision-making.
                        </p>
                    </div>
                </motion.div>

            </motion.section>

            {/* STRATEGY & SOLUTION */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-10"
            >
                <h2 className="text-4xl font-bold mb-6">
                    Strategy & Solution
                </h2>

                <p className="text-gray-300 leading-8 mb-8">
                    Our consultants developed a phased transformation
                    roadmap focused on technology modernization, operational
                    excellence, and customer-centric innovation.
                </p>
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
                className="max-w-6xl mx-auto px-6 py-10"
            >
                <h2 className="text-4xl font-bold mb-8">
                    Results & Impact
                </h2>

                <p className="text-gray-300 mb-10 leading-8">
                    The transformation initiative delivered measurable
                    business outcomes across operational efficiency,
                    customer satisfaction, and revenue growth.
                </p>
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
  className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
>
                
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                        <h3 className="text-5xl font-bold text-blue-500 mb-3">
                            35%
                        </h3>
                        <p className="text-gray-400">
                            Revenue Growth
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                        <h3 className="text-5xl font-bold text-blue-500 mb-3">
                            28%
                        </h3>
                        <p className="text-gray-400">
                            Cost Reduction
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                        <h3 className="text-5xl font-bold text-blue-500 mb-3">
                            42%
                        </h3>
                        <p className="text-gray-400">
                            Productivity Increase
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                        <h3 className="text-5xl font-bold text-blue-500 mb-3">
                            90%
                        </h3>
                        <p className="text-gray-400">
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
                className="max-w-6xl mx-auto px-6 py-10"
            >
                <h2 className="text-4xl font-bold mb-8">
                    About the Author
                </h2>
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
  className="bg-slate-900 border border-slate-800 rounded-2xl p-8 grid md:grid-cols-[200px_1fr] gap-8 items-center"
>
                
                    <div className="flex justify-center">
                        <img
                            src={authorImage}
                            alt="Author"
                            className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
                        />
                    </div>

                    <div>
                        <a
                            href="https://example.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-3xl font-bold hover:text-blue-500 transition"
                        >
                            Sarah Mitchell
                        </a>

                        <p className="text-blue-500 mt-2">
                            www.sarahmitchell.com
                        </p>

                        <p className="text-gray-400 mt-4 leading-7">
                            Senior Strategy Consultant with over 15 years of
                            experience helping enterprises navigate complex
                            transformations, accelerate growth, and build
                            resilient business models.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm">
                                Strategy
                            </span>

                            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm">
                                Digital Transformation
                            </span>

                            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm">
                                Operations
                            </span>

                            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm">
                                Leadership
                            </span>
                        </div>
                    </div>
                
                </motion.div>
            </motion.section>


        </div>
    );
};

export default CaseStudyDetails;