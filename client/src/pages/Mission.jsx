import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';

// Import local assets
import strategyHero from "../assets/strategy-hero.jpg";
import aboutUsImg from "../assets/aboutus.jpg";
import servicesHero from "../assets/services-hero.jpg";
import leaderImg from "../assets/leader1.jpg";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } }
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

const Mission = () => {
  const navigate = useNavigate();

  const missionPillars = [
    {
      id: 1,
      category: 'Methodology',
      title: 'Analytical Rigor',
      description: 'We believe that true insight starts with deep diagnostic assessments. Our strategy is built upon objective truth and data-driven integrity.',
      imageUrl: aboutUsImg
    },
    {
      id: 2,
      category: 'Vision',
      title: 'Strategic Foresight',
      description: 'Modeling potential market disruptions, identifying long-term industry opportunities, and building adaptable corporate roadmaps.',
      imageUrl: strategyHero
    },
    {
      id: 3,
      category: 'Implementation',
      title: 'Flawless Execution',
      description: 'Translating strategy into reality. We design actionable frameworks, customize KPI indicators, and execute with precision.',
      imageUrl: servicesHero
    },
    {
      id: 4,
      category: 'Value Creation',
      title: 'Sustainable Growth',
      description: 'Fostering long-term capability building within client organizations to ensure permanent resilience and organic value creation.',
      imageUrl: leaderImg
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-black font-sans">
      {/* HERO SECTION CONTAINER - transparent with black text */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12">
        {/* Back Button */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUpVariants}
          className="flex justify-start mb-6"
        >
          <button 
            onClick={() => navigate("/about")} 
            className="text-blue-500 hover:text-white transition-colors flex items-center border border-blue-500/30 rounded-full px-5 py-2 text-sm font-medium hover:border-blue-500 cursor-pointer"
          >
            ← Back to About Us
          </button>
        </motion.div>

        {/* Section 1: Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black">Our Mission & Purpose</h1>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-2xl">
            To architect sustainable growth for ambitious enterprises through rigorous data analysis, strategic foresight, and flawless operational execution.
          </p>
        </motion.section>
      </div>

      {/* SECTION 2: FEATURED BANNER - White bg, solid black text */}
      <div className="bg-[var(--color-main-bg)] py-16 md:py-24 text-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-xl overflow-hidden border border-black/5 shadow-[0_15px_35px_rgba(0,0,0,0.03)]"
          >
            <div className="p-8 md:p-10 flex flex-col justify-center h-full order-2 lg:order-1">
              <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-600 text-xs font-semibold uppercase tracking-wider rounded-md mb-6 w-max">
                Core Statement
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">Empowering Enterprises for the Future</h2>
              <p className="text-black mb-6 text-sm md:text-base leading-relaxed">
                We partner with global leaders to navigate the complexities of corporate strategy, operational scaling, and digital integration. By delivering objective truth and robust execution frameworks, we help organizations shape their own destiny.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <Button
                  variant="contained"
                  onClick={() => navigate("/contact")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-6 py-2.5 text-sm normal-case transition-colors"
                  style={{ background: '#2563eb' }}
                >
                  Let's Partner
                </Button>
              </div>
            </div>
            <div className="h-64 lg:h-full min-h-[300px] relative w-full overflow-hidden order-1 lg:order-2">
              <img
                src={strategyHero}
                alt="Our Mission Strategy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent lg:w-1/4"></div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* SECTION 3: PILLARS - Light Blue bg, solid black text */}
      <div className="bg-[var(--color-sub-bg)] py-16 md:py-24 text-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUpVariants}
          >
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">Our Core Pillars</h2>
              <p className="text-black text-sm md:text-base">The methodologies and principles that direct our client delivery model.</p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {missionPillars.map((pillar) => (
                <motion.article
                  variants={cardVariants}
                  whileHover={{ y: -10 }}
                  key={pillar.id}
                  className="relative bg-white border border-black/5 rounded-2xl overflow-hidden group transition-all duration-300 ease-out hover:shadow-[0_20px_45px_rgba(37,99,235,0.08)] flex flex-col h-full"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 to-transparent z-10"></div>

                  <div className="h-44 w-full relative overflow-hidden z-20">
                    <img
                      src={pillar.imageUrl}
                      alt={pillar.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow relative z-20 bg-white">
                    <span className="text-blue-600 text-xs font-semibold mb-2 uppercase">{pillar.category}</span>
                    <h3 className="text-lg md:text-xl font-bold text-black mb-2">{pillar.title}</h3>
                    <p className="text-black text-xs md:text-sm leading-relaxed flex-grow">{pillar.description}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Mission;
