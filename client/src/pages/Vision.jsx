import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

// Import local assets
import strategyHero from "../assets/strategy-hero.jpg";
import aboutUsImg from "../assets/aboutus.jpg";
import servicesHero from "../assets/services-hero.jpg";
import leaderImg from "../assets/leader1.jpg";

// MATCHED EXACTLY WITH VALUES & MISSION PAGES
const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
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
    <div className="min-h-screen bg-main text-black font-sans">
      
      {/* HERO SECTION - Matched Height (320px), Background (Primary), and Left Alignment */}
      <div
        style={{
          backgroundColor: "var(--color-primary)",
          minHeight: "320px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="max-w-[110rem] w-full mx-auto px-4 md:px-12 lg:px-[180px] py-10 text-white"
          style={{
            filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.2))"
          }}
        >
          <div className="max-w-4xl flex flex-col items-start text-left">
            
            {/* Integrated Back Button directly in Hero */}
            <button 
              onClick={() => navigate("/about")} 
              className="text-white/80 hover:text-white transition-colors flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer bg-white/10 hover:bg-white/20 rounded-md px-4 py-1.5 border border-white/20"
            >
              ← Back to About Us
            </button>

            <h1 className="main-heading text-white leading-tight mb-4 text-3xl md:text-4xl lg:text-5xl">
              Our Vision & Future
            </h1>

            <p className="paragraph text-white/90 max-w-3xl text-sm md:text-base leading-relaxed">
              To be the definitive standard for corporate strategic advisory, recognized globally for integrity and impact.
            </p>
          </div>
        </motion.section>
      </div>

      {/* SECTION 2: FEATURED BANNER */}
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-sub py-12 md:py-24 px-4 md:px-12 lg:px-[180px]">
          <div className="max-w-[1440px] mx-auto">
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUpVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 items-stretch bg-white rounded-xl overflow-hidden border border-black/5 shadow-[0_15px_35px_rgba(0,0,0,0.03)]"
            >
              <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center order-2 lg:order-1">
                <span className="inline-block px-3 py-1 bg-blue-500/10 pre-heading uppercase tracking-wider rounded-md mb-6 w-max text-xs font-semibold">
                  Horizon Plan
                </span>
                <h2 className="sub-heading text-2xl md:text-3xl mb-4 font-bold">
                  Shaping the Corporate Landscape of Tomorrow
                </h2>
                <p className="paragraph mb-6 leading-relaxed text-sm md:text-base text-gray-700">
                  We envision a business landscape where leadership is defined by strategic foresight, operational agility, and sustainable value creation. Our horizon plan guides organizations through transformational periods, turning industry disruptions into growth milestones.
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <Button
                    variant="contained"
                    onClick={() => navigate("/contact")}
                    sx={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-btn-text)",
                      minWidth: "130px",
                      width: "max-content",
                      height: "42px",
                      flexGrow: 0,
                      borderRadius: "var(--radius-sm)",
                      fontWeight: "var(--font-bold)",
                      boxShadow: "var(--shadow-button)",
                      transition: "all var(--transition-speed) ease",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "var(--color-primary)",
                        opacity: 0.9,
                      },
                    }}
                  >
                    Connect With Us
                  </Button>
                </div>
              </div>
              
              <div className="h-64 sm:h-80 lg:h-auto min-h-[250px] relative w-full overflow-hidden order-1 lg:order-2">
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
      </div>

      {/* SECTION 3: PILLARS */}
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-[var(--color-sub-bg)] pb-10 px-4 md:px-12 lg:px-[180px]">
          <div className="max-w-[1440px] mx-auto">
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUpVariants}
            >
              <div className="mb-12 text-center md:text-left">
                <h2 className="sub-heading text-2xl md:text-3xl mb-3 font-bold">Our Vision Pillars</h2>
                <p className="paragraph text-sm md:text-base">The key coordinates that guide our long-term trajectory and global objectives.</p>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {visionPillars.map((pillar) => (
                  <motion.article
                    variants={cardVariants}
                    whileHover={{ y: -8 }}
                    key={pillar.id}
                    className="group relative overflow-hidden flex flex-col h-full cursor-pointer bg-main p-5 rounded-lg border border-black/5 shadow-sm transition-all duration-300 ease-out hover:shadow-md"
                  >
                    <div className="overflow-hidden rounded h-auto sm:h-[220px] mb-5 w-full bg-neutral-100 flex items-center justify-center">
                      <img
                        src={pillar.imageUrl}
                        alt={pillar.title}
                        className="w-full h-auto sm:h-full object-contain sm:object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                      />
                    </div>

                    <div className="flex flex-col flex-grow">
                      <span
                        className="uppercase mb-2 tracking-wide"
                        style={{
                          color: "var(--color-paragraph)",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      >
                        {pillar.category}
                      </span>

                      <h3
                        className="mb-2 text-base md:text-lg"
                        style={{
                          color: "var(--color-primary)",
                          fontWeight: 700,
                        }}
                      >
                        {pillar.title}
                      </h3>

                      <p
                        className="text-xs md:text-sm"
                        style={{
                          color: "var(--color-paragraph)",
                          lineHeight: 1.6,
                          textAlign: "left",
                          hyphens: "auto",
                        }}
                      >
                        {pillar.description}
                      </p>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[var(--color-primary)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  </motion.article>
                ))}
              </motion.div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vision;