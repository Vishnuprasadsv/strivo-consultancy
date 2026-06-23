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

    return (
        <div className="bg-black text-white min-h-screen">

            {/* HEADER */}
            <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 pt-16"
            >
                <span className="inline-block px-4 py-2 bg-blue-600 rounded-full text-sm mb-6">
                    Digital Transformation
                </span>

                <h1>{study.title}</h1>

                <div className="flex flex-wrap gap-6 text-gray-400 border-b border-slate-800 pb-8">
                    <span>Sarah Mitchell</span>
                    <span>May 14, 2025</span>
                    <span>Senior Strategy Consultant</span>
                    <span>8 min read</span>
                </div>
            </motion.section>

            {/* FEATURED IMAGE */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-12"
            >
                <img
                    src={study.image}
                    alt={study.title}
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

                <div className="grid md:grid-cols-2 gap-6">
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
                </div>
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

                <div className="space-y-4">
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
                </div>
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

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                </div>
            </motion.section>

            {/* KEY TAKEAWAYS */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-10"
            >
                <h2 className="text-4xl font-bold mb-8">
                    Key Takeaways
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        ✓ Technology modernization creates long-term
                        competitive advantage.
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        ✓ Data-driven decision making improves agility.
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        ✓ Customer-centric strategies increase retention.
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        ✓ Operational efficiency directly impacts
                        profitability.
                    </div>
                </div>
            </motion.section>

            {/* SUPPORTING VISUALS */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-10"
            >
                <h2 className="text-4xl font-bold mb-8">
                    Supporting Visuals
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <img
                        src={chartImage}
                        alt="Chart"
                        className="rounded-xl border border-slate-800 h-[300px] w-full object-cover"
                    />

                    <img
                        src={chartImage}
                        alt="Chart"
                        className="rounded-xl border border-slate-800 h-[300px] w-full object-cover"
                    />
                </div>
            </motion.section>

            {/* FAQ SECTION */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-10"
            >
                <h2 className="text-4xl font-bold mb-8">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-slate-800 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() =>
                                    setOpenFaq(
                                        openFaq === index ? null : index
                                    )
                                }
                                className="w-full flex justify-between items-center p-5 bg-slate-900 text-left"
                            >
                                <span className="font-medium">
                                    {faq.question}
                                </span>

                                <span className="text-blue-500 text-xl">
                                    {openFaq === index ? "−" : "+"}
                                </span>
                            </button>

                            {openFaq === index && (
                                <div className="p-5 bg-slate-950 text-gray-400">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.section>
            {/* CONCLUSION */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-10"
            >
                <h2 className="text-4xl font-bold mb-6">
                    Conclusion
                </h2>

                <p className="text-gray-300 leading-8">
                    This engagement demonstrates how strategic planning,
                    technology modernization, and operational excellence
                    can unlock sustainable growth and long-term competitive
                    advantage. By aligning business objectives with
                    scalable digital capabilities, the client achieved
                    measurable improvements across revenue, efficiency,
                    and customer experience.
                </p>
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

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 grid md:grid-cols-[200px_1fr] gap-8 items-center">
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
                </div>
            </motion.section>

            {/* RELATED CASE STUDIES */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-10"
            >
                <h2 className="text-4xl font-bold mb-8">
                    Related Case Studies
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {relatedStudies.map((study, index) => (
                        <div
                            key={index}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                        >
                            <span className="text-blue-500 text-sm">
                                {study.category}
                            </span>

                            <h3 className="text-xl font-semibold mt-3 mb-4">
                                {study.title}
                            </h3>

                            <button className="text-blue-500 hover:text-white transition">
                                Read Case Study →
                            </button>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* CTA SECTION */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-6xl mx-auto px-6 py-20"
            >
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-10 md:p-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Transform Your Business?
                    </h2>

                    <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8">
                        Partner with our consulting experts to unlock
                        sustainable growth, optimize operations, and
                        accelerate your digital transformation journey.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition">
                            Schedule Consultation
                        </button>

                        <button className="border border-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-700 transition">
                            Request Proposal
                        </button>
                    </div>
                </div>
            </motion.section>

        </div>
    );
};

export default CaseStudyDetails;