import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

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

   catch(err){

      console.log(err);

   }

   finally{

      setLoading(false);

   }

};
if(loading){

return(

<div className="h-screen flex items-center justify-center">

Loading...

</div>

)

}

if(!study){

return(

<div className="h-screen flex items-center justify-center">

Case Study Not Found

</div>

)

}
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
                    <span>{study.author}</span>

<span>

{study.publicationDate ?

new Date(

study.publicationDate

).toLocaleDateString()

: "-"}

</span>

<span>

{study.authorRole}

</span>

<span>

{study.duration}

</span>
                </motion.div>
            </motion.section>

          {/* FEATURED IMAGE WITH BLURRED GLOW */}
<motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={fadeUp}
    className="max-w-6xl mx-auto px-6 py-12"
>
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800/80">
        
        {/* Blurred Reflection Background */}
        <img
            src={study.coverImage || activeStudy.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-30 scale-110 pointer-events-none"
        />

        {/* Sharp Foreground Full Image */}
        <motion.img
            src={study.coverImage || activeStudy.image}
            alt={study.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-full max-h-full object-contain p-4 rounded-xl"
        />
    </div>
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

               <p>

{study.summary}

</p>
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
                className="max-w-6xl mx-auto px-6 py-10"
            >
                
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

{study.results}

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
                            src={study.authorImage}
                            alt="Author"
                            className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
                        />
                    </div>

                    <div>
                        <a
                            href={study.authorWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-3xl font-bold hover:text-blue-500 transition"
                        >
                           {study.author}
                        </a>

                        <p className="text-blue-500 mt-2">
                            {study.authorWebsite}
                        </p>

                        <p className="text-gray-400 mt-4 leading-7">
                            {study.authorRole}
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