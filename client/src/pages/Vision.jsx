import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';

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

const Vision = () => {
  const navigate = useNavigate();

  const visionPillars = [
    {
      id: 1,
      category: 'Scale',
      title: 'Global Footprint',
      description: 'Expanding strategic partnerships across global markets to support enterprises in navigating complex international growth paths.',
      imageUrl: aboutUsImg
    },
    {
      id: 2,
      category: 'Ethic',
      title: 'Uncompromising Integrity',
      description: 'Serving as trusted advisors who prioritize objective diagnostic truth, transparency, and ethical consulting collaborations.',
      imageUrl: strategyHero
    },
    {
      id: 3,
      category: 'Growth',
      title: 'Generative Innovation',
      description: 'Leading client organizations into modern operating landscapes by integrating advanced digital strategies and analytical models.',
      imageUrl: servicesHero
    },
    {
      id: 4,
      category: 'Legacy',
      title: 'Lasting Enterprise Impact',
      description: 'Equipping client leaders and teams with sustainable internal capabilities to generate long-term corporate value and resilience.',
      imageUrl: leaderImg
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-sans">
      {/* HERO SECTION CONTAINER - dark transparent */}
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
            className="text-blue-500 hover:text-[var(--color-pure-black)] transition-colors flex items-center border border-blue-500/30 rounded-full px-5 py-2 text-sm font-medium hover:border-blue-500 cursor-pointer"
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">Our Vision & Future</h1>
          <p className="text-[var(--color-pure-black)] text-base md:text-lg leading-relaxed max-w-2xl">
            To be the definitive standard for corporate strategic advisory, recognized globally for integrity and impact.
          </p>
        </motion.section>
      </div>

      {/* SECTION 2: FEATURED BANNER - White bg, dark text */}
      <div className="bg-[var(--color-main-bg)] py-16 md:py-24 text-[var(--color-black)]">
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
                Horizon Plan
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-black)] mb-4">Shaping the Corporate Landscape of Tomorrow</h2>
              <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                We envision a business landscape where leadership is defined by strategic foresight, operational agility, and sustainable value creation. Our horizon plan guides organizations through transformational periods, turning industry disruptions into growth milestones.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <Button
                  variant="contained"
                  onClick={() => navigate("/contact")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-6 py-2.5 text-sm normal-case transition-colors"
                  style={{ background: '#2563eb' }}
                >
                  Connect With Us
                </Button>
              </div>
            </div>
            <div className="h-64 lg:h-full min-h-[300px] relative w-full overflow-hidden order-1 lg:order-2">
              <img
                src={servicesHero}
                alt="Our Vision Strategy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent lg:w-1/4"></div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* SECTION 3: PILLARS - Light Blue bg, dark text */}
      <div className="bg-[var(--color-sub-bg)] py-16 md:py-24 text-[var(--color-black)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUpVariants}
          >
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-black)] mb-3">Our Vision Pillars</h2>
              <p className="text-gray-600 text-sm md:text-base">The key coordinates that guide our long-term trajectory and global objectives.</p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {visionPillars.map((pillar) => (
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
                    <h3 className="text-lg md:text-xl font-bold text-[var(--color-black)] mb-2">{pillar.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed flex-grow">{pillar.description}</p>
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

export default Vision;
