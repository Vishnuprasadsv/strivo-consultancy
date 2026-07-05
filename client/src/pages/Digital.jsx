import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import digitalTransformation from '../assets/digitalTransformation.jpg';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Digital = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-main min-h-screen font-sans selection:bg-blue-600 ">
      {/* Section 1: Hero */}
      <motion.section
        id="hero-section"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="w-full bg-main"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="main-heading">Digital Transformation</h1>
              <p className="paragraph">
                Accelerate innovation through technology modernization, cloud transformation, automation, data intelligence, and digital customer experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="btn text-sm px-6 py-3 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
            <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden bg-main border border-[var(--color-border-color)] flex items-center justify-center p-8">
              <img
                alt="Enterprise technology transformation, cloud systems, automation, AI, digital modernization."
                className="object-contain w-full h-full opacity-90 drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                src={digitalTransformation}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Service Overview */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariants}
        className="w-full bg-sub border-t"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden flex items-center justify-center p-8">
              <img
                alt="Digital transformation services overview"
                className="object-contain w-full h-full opacity-90 drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnaZPRqgp5-0qAJ5fUPAFjw_vWJ0DZbGpj7hSYyHBDOCXi6TW0Df3CyMxFt24jvrKMtKIYi09UJaHU0sfq1MLtztLykDCi1MN-eLzjig4LE1cbtNRFb6tt97CqusV0pbj9nd39Eo5xGYG-Ny-eiJZMgXavzQTdHva57tUby2XQTLTq5A8YCkoC1mkpRR9jgfIvl1xQYrBq4AHauCrzRBMbHIzpJB-X4V7kq-pKTOIkPV9AiPMQPoY0aDcAGF0ofN3NOPvOjSgf7Q"
              />
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center border border-[#374151]">
                  <svg className="text-blue-500 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="pre-heading uppercase tracking-widest">Service Overview</span>
              </div>
              <h2 className="sub-heading">Digital Transformation Services</h2>
              <ul className="space-y-4">
                {[
                  { title: 'Enterprise Modernization', desc: 'Modernize legacy systems and processes with scalable digital foundations.' },
                  { title: 'Cloud Transformation', desc: 'Migrate critical workloads and enable secure, flexible infrastructure.' },
                  { title: 'Digital Customer Experience', desc: 'Create seamless, personalized journeys across every engagement channel.' },
                  { title: 'Process Automation', desc: 'Use intelligent automation to reduce manual effort and increase speed.' },
                  { title: 'Data-Driven Decision Making', desc: 'Turn operational and customer data into measurable strategic insight.' },
                  { title: 'Technology Enablement', desc: 'Equip teams with the tools and governance needed to scale innovation.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="text-blue-500 w-6 h-6 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong className="text-base text-blue-500 block">{item.title}</strong>
                      <span className="paragraph">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 3: Digital Pillars */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUpVariants}
        className="w-full bg-sub"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="mb-12">
            <h2 className="sub-heading">Digital Pillars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                title: 'Customer Experience',
                desc: 'Design connected, intuitive journeys that elevate loyalty and retention.'
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
                title: 'Cloud & Infrastructure',
                desc: 'Build a secure, scalable base that supports rapid change and resilience.'
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: 'Data & Analytics',
                desc: 'Use data to uncover opportunities, improve decisions, and drive growth.'
              }
            ].map((cap, idx) => (
              <div key={idx} className="card hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.1)] transition-all duration-200">
                <svg className="text-blue-500 w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {cap.icon}
                </svg>
                <h3 className="text-xl font-semibold text-blue-500 mb-3">{cap.title}</h3>
                <p className="paragraph">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 4: Digital Methodology */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUpVariants}
        className="w-full bg-sub py-16 md:py-24 "
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="pre-heading inline-block px-3 py-1 rounded-full bg-white border border-[#374151] uppercase tracking-[3px] mb-4">4-Step Digital Process</span>
          <h2 className="sub-heading mb-16">Digital Methodology</h2>
          <div className="relative flex flex-col lg:flex-row gap-6 isolate">
            <div
              className="
    hidden lg:block
    absolute
    top-[48px]
    left-[10%]
    right-[10%]
    h-[2px]
    bg-gray-400
    z-0
  "
            />
            {[
              { num: 1, title: 'Digital Audit', items: ['Current-state assessment', 'Capability mapping', 'Opportunity prioritization'] },
              { num: 2, title: 'Solution Design', items: ['Roadmap planning', 'Architecture alignment', 'Technology selection'] },
              { num: 3, title: 'Implementation', items: ['Platform rollout', 'Change enablement', 'Team training'] },
              { num: 4, title: 'Optimization', items: ['Performance measurement', 'Innovation tracking', 'Continuous improvement'] }
            ].map((step) => (
              <div
                key={step.num}
                className="
    card
    flex-1
    relative
    z-20
    bg-white
    
    shadow-md
    hover:-translate-y-1
    transition-all
    duration-200
    text-left
  "
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold mb-6 shadow-[0_0_15px_rgba(37,99,235,0.5)]">{step.num}</div>
                <h3 className="text-xl font-semibold text-blue-500 mb-2">{step.title}</h3>
                <ul className="paragraph space-y-1 list-disc list-inside">
                  {step.items.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 5: Impact Metrics */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariants}
        className="w-full bg-main py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="sub-heading mb-12 text-center">Impact Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-[var(--color-main-bg)] p-8 divide-x divide-[var(--color-border-color)]">
            {[
              { val: '85%', label: 'Digital Adoption' },
              { val: '60%', label: 'Operational Efficiency' },
              { val: '40%', label: 'Customer Experience Improvement' },
              { val: '3-5 Years', label: 'Transformation Impact' }
            ].map((metric, idx) => (
              <div key={idx} className="text-center px-4">
                <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">{metric.val}</div>
                <div className="paragraph uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 6: Case Study */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUpVariants}
        className="w-full bg-main py-16 md:py-24 border-t border-[var(--color-border-color)]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-[#111827] border border-[#374151] text-xs font-semibold text-gray-400">Digital</span>
                  <span className="px-3 py-1 rounded-full bg-[#111827] border border-[#374151] text-xs font-semibold text-gray-400">Transformation</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Digital Transformation Case Study</h3>
                <p className="paragraph text-white mb-4"><strong>Challenge:</strong> A multi-national manufacturer faced a 15% margin erosion due to fragmented supply chains and rising geopolitical tensions.</p>
                <p className="paragraph text-white mb-8"><strong>Solution:</strong> We architected a 5-year nearshoring strategy, integrating advanced analytics to identify key vulnerabilities and establishing a resilient, cost-effective operating model.</p>
              </div>
              <Link to="/insights" className="inline-flex items-center gap-2 text-blue-500 text-sm font-medium hover:text-white transition-colors group">
                Read Full Case Study
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent z-10 pointer-events-none"></div>
              <div className="w-full h-full flex items-end justify-between gap-2 px-4 relative z-0 opacity-50">
                <div className="w-1/6 bg-gradient-to-t from-blue-600/20 to-blue-600/5 h-[30%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-blue-600/30 to-blue-600/10 h-[45%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-blue-600/40 to-blue-600/15 h-[40%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-blue-600/60 to-blue-600/20 h-[65%] rounded-t-sm"></div>
                <div className="w-1/6 bg-gradient-to-t from-blue-600/80 to-blue-600/30 h-[85%] rounded-t-sm shadow-[0_0_20px_rgba(37,99,235,0.4)]"></div>
              </div>
              <div className="absolute top-8 left-8 right-8 z-20">
                <h4 className="text-sm font-medium text-white mb-1">+42% Efficiency Gain</h4>
                <p className="text-xs font-semibold text-gray-400">Over 36 Months</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 7: CTA Banner */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariants}
        className="w-full bg-main py-16"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="sub-heading text-white">Ready to Accelerate Digital Transformation?</h2>
              <p className="paragraph text-white">
                Modernize technology, improve customer experiences, and unlock scalable growth through digital innovation.
              </p>
              <Link to="/contact" className="btn inline-flex items-center justify-center text-sm px-8 py-4 mt-4 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 8: Final Conversion */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariants}
        className="w-full bg-sub py-24 text-center border-t border-[var(--color-border-color)]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="sub-heading mb-6">What Could Digital Clarity Unlock For Your Business?</h2>
          <p className="paragraph mb-10 max-w-3xl mx-auto">
            The right digital strategy can transform operations, elevate customer experience, and create lasting momentum. Let's build your blueprint for tomorrow.
          </p>
          <Link to="/contact" className="btn inline-flex items-center justify-center text-sm px-8 py-4 mt-4 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
            Contact Our Team
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Digital;
