import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Operations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pt-20 pb-24 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Section 1: Hero */}
      <motion.section 
        initial="hidden" animate="visible" variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">Architecting Operational Excellence</h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Streamline workflows and maximize efficiency with our data-driven optimization strategies. We partner with visionary leaders to navigate complexity and orchestrate execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-blue-600 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] text-center">
                Schedule Consultation
              </Link>
            </div>
          </div>
          <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden bg-[#111111] border border-[#222222] flex items-center justify-center p-8">
            <img alt="3D workflow optimization illustration" className="object-contain w-full h-full opacity-90 drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJgsChU0yTK8RMWxphON2ie81nOFWArko__RFbW3N21PEAz6C3NM-TE2HiZaWadpaDSCU5KTcVsNBHkqC_u_N5ZQes7-jHfSVtClljZCNcJfYBvrEdcUSHv3W9DNSB8bspImBZJhVh0ZGTk-MPH7SGX4TWVqdbS5jdZ17wsP0hVeswdKJVpjN_AlCFFin7_6VzQWvkE6tVcHOEOsdjdD_PBb4xULhO3BhapOILD1Y6CRoBUnscC65_BnCSpyZLMgZeE_T15vMBXg" />
          </div>
        </div>
      </motion.section>

      {/* Section 2: Service Overview */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 border-t border-[#1F2937]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden bg-[#111111] border border-[#222222] flex items-center justify-center p-8">
            <img alt="Operational efficiency workflow visualization" className="object-contain w-full h-full opacity-90 drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm_KBVAgfaPgwoYpyM1P40sQ54CoO107p_1JBVcN4vjJdMGJBq_OJ5nrGankemaIDcoCQtDU-OQYRz4K6L1cFKNTHMIDjSSAhr04BDJmudBALrgEryjkZWV05ib5NvOx_s0BZHXyqVvl3fyRj_spL8WIA2oq31GJhSsvtWSmSlurtIzkTXn8PyFrD_MaOdwV6P_ERvAaHPqmwG5nE_wBgki0tuWKWCh5I5xqEx-6vggUmgnaF7w6KcXiW-omCJ2BZ7tmw-LPf5vQ" />
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center border border-[#374151]">
                <svg className="text-blue-500 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Service Overview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Precision in Every Process</h2>
            <ul className="space-y-4">
              {[
                { title: "Process efficiency enhancement", desc: "Identify and eliminate bottlenecks across your operations." },
                { title: "Operational streamlining", desc: "Simplify complex workflows for maximum productivity." },
                { title: "Workflow optimization", desc: "Design data-driven paths for task execution." },
                { title: "Automation opportunities", desc: "Leverage technology to handle repetitive tasks." },
                { title: "Resource allocation improvements", desc: "Direct your capital and talent where it matters most." },
                { title: "Performance measurement systems", desc: "Establish KPIs to monitor ongoing operational health." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="text-blue-500 w-6 h-6 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <div>
                    <strong className="text-base text-white block">{item.title}</strong>
                    <span className="text-base text-gray-400">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Section 3: Operations Pillars (matches Core Capabilities) */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24"
      >
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Operations Pillars</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Supply Chain & Logistics",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
              desc: "Restructuring logistics frameworks, implementing automated tracking and predictive inventory management."
            },
            {
              title: "Workflow & Automation",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
              desc: "Identifying redundancies and building streamlined workflows leveraging modern automation tools."
            },
            {
              title: "Cost & Waste Reduction",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />,
              desc: "Analyzing expenditure to uncover opportunities for substantial margin improvement without quality loss."
            }
          ].map((pillar, idx) => (
            <div key={idx} className="bg-[#111111] border border-[#222222] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.1)] transition-all duration-200">
              <svg className="text-blue-500 w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{pillar.icon}</svg>
              <h3 className="text-xl font-semibold text-white mb-3">{pillar.title}</h3>
              <p className="text-gray-400">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Section 4: Operations Methodology (matches Acumen Strategic Framework) */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
        className="bg-[#0A0A0A] py-16 md:py-24 border-y border-[#1F2937]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#111827] border border-[#374151] text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">4-Step Optimization Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">Operations Methodology</h2>
          <div className="flex flex-col lg:flex-row gap-6 relative">
            <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-[#1F2937] -translate-y-1/2 z-0"></div>
            {[
              { num: 1, title: "Operational Audit", items: ["Process Mapping", "Inefficiency Identification", "Cost Analysis"] },
              { num: 2, title: "Solution Design", items: ["Workflow Redesign", "Automation Planning", "Resource Allocation"] },
              { num: 3, title: "Implementation", items: ["System Integration", "Change Management", "Training & Rollout"] },
              { num: 4, title: "Optimization", items: ["Performance Tracking", "KPI Monitoring", "Continuous Tuning"] }
            ].map((step) => (
              <div key={step.num} className="flex-1 bg-[#111111] border border-[#222222] rounded-2xl p-6 relative z-10 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.1)] transition-all duration-200 text-left">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold mb-6 shadow-[0_0_15px_rgba(37,99,235,0.5)]">{step.num}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <ul className="text-gray-400 space-y-1 list-disc list-inside">
                  {step.items.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 5: Impact Metrics */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Impact Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-[#111111] border border-[#222222] rounded-2xl p-8 divide-x divide-[#222222]">
          {[
            { val: "35%", label: "Operational Cost Reduction" },
            { val: "60%", label: "Process Efficiency Improvement" },
            { val: "95%", label: "Project Success Rate" },
            { val: "3-5 Yrs", label: "Sustainable Performance Gains" }
          ].map((metric, idx) => (
            <div key={idx} className="text-center px-4">
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">{metric.val}</div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{metric.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Section 6: Proven Impact (matches Strategic Excellence in Action) */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 border-t border-[#1F2937]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-[#111827] border border-[#374151] text-xs font-semibold text-gray-400">Manufacturing</span>
                <span className="px-3 py-1 rounded-full bg-[#111827] border border-[#374151] text-xs font-semibold text-gray-400">Operations</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Optimizing Global Supply Chains</h3>
              <p className="text-gray-400 mb-4"><strong>Challenge:</strong> A multi-national manufacturer faced a 15% margin erosion due to fragmented supply chains and rising geopolitical tensions.</p>
              <p className="text-gray-400 mb-8"><strong>Solution:</strong> We restructured the core logistics framework, implementing automated tracking and predictive inventory management to drastically reduce bottlenecks.</p>
            </div>
            <Link to="/insights" className="inline-flex items-center gap-2 text-blue-500 text-sm font-medium hover:text-white transition-colors group">
              Read Full Case Study
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent z-10 pointer-events-none"></div>
            <div className="w-full h-full flex items-end justify-between gap-2 px-4 relative z-0 opacity-50">
              <div className="w-1/6 bg-gradient-to-t from-blue-600/20 to-blue-600/5 h-[20%] rounded-t-sm"></div>
              <div className="w-1/6 bg-gradient-to-t from-blue-600/30 to-blue-600/10 h-[35%] rounded-t-sm"></div>
              <div className="w-1/6 bg-gradient-to-t from-blue-600/40 to-blue-600/15 h-[45%] rounded-t-sm"></div>
              <div className="w-1/6 bg-blue-600/40 border border-blue-600 h-[70%] rounded-t-sm relative">
                 <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-blue-500 font-semibold hidden sm:block">Implementation</span>
              </div>
              <div className="w-1/6 bg-blue-600 h-[90%] rounded-t-sm relative">
                 <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-blue-500 font-semibold hidden sm:block">Optimization</span>
              </div>
            </div>
            <div className="absolute top-8 left-8 right-8 z-20">
              <h4 className="text-sm font-medium text-white mb-1">+60% Efficiency Gain</h4>
              <p className="text-xs font-semibold text-gray-400">Over 36 Months</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 7: CTA Banner */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 md:px-12 py-16"
      >
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Transform Operational Performance?</h2>
            <p className="text-lg text-gray-400">
              Partner with our specialists to optimize workflows and reduce inefficiencies. Engage with us to discuss your immediate challenges.
            </p>
            <Link to="/contact" className="bg-blue-600 text-white text-sm font-medium px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] mt-4 inline-block">
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Section 8: Final Conversion */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center border-t border-[#1F2937]"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What Could Operational Efficiency Unlock For Your Business?</h2>
        <p className="text-lg text-gray-400 mb-10 max-w-3xl mx-auto">
          The difference between market leaders and followers is relentless optimization. Let's build your blueprint for tomorrow.
        </p>
        <Link to="/contact" className="bg-blue-600 text-white text-sm font-medium px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] inline-block">
          Contact Our Team
        </Link>
      </motion.section>
    </div>
  );
};

export default Operations;