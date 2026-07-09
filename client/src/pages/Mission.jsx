import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

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
    <div className="min-h-screen bg-main text-black font-sans">
      
      {/* BACK BUTTON CONTAINER - Matched exact padding and max-width layout of the sections below */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[140px] pt-8">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUpVariants}
          className="flex justify-start"
        >
          <button 
            onClick={() => navigate("/about")} 
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors flex items-center px-5 py-2 text-sm font-medium hover:border-[var(--color-primary-hover)] cursor-pointer"
          >
            ← Back to About Us
          </button>
        </motion.div>
      </div>

      {/* SECTION 1: HERO */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-12">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="max-w-3xl mx-auto flex flex-col items-center text-center"
        >
          <h1 className="main-heading text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Our Mission & Purpose
          </h1>
          <p className="paragraph text-base md:text-lg leading-relaxed max-w-2xl">
            To architect sustainable growth for ambitious enterprises through rigorous data analysis, strategic foresight, and flawless operational execution.
          </p>
        </motion.section>
      </div>

      {/* SECTION 2: FEATURED BANNER */}
      <div className="bg-sub py-12 md:py-24 px-6 md:px-16 lg:px-[180px]">
        <div className="max-w-[1440px] mx-auto">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariants}
            className="rounded-[var(--radius-sm)] grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 items-stretch bg-white overflow-hidden border border-black/5 shadow-[0_15px_35px_rgba(0,0,0,0.03)]"
          >
            {/* Text Content */}
            <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center order-2 lg:order-1">
              <span className="inline-block px-3 pre-heading uppercase tracking-wider rounded-md mb-4 w-max text-xs font-semibold">
                Core Statement
              </span>
              <h2 className="sub-heading text-2xl md:text-3xl mb-4 font-bold">
                Empowering Enterprises for the Future
              </h2>
              <p className="paragraph mb-6 leading-relaxed text-sm md:text-base">
                We partner with global leaders to navigate the complexities of corporate strategy, operational scaling, and digital integration. By delivering objective truth and robust execution frameworks, we help organizations shape their own destiny.
              </p>
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
                Let's Partner
              </Button>
            </div>
            
            {/* Image Wrap */}
            <div className="h-64 sm:h-80 lg:h-auto min-h-[250px] relative w-full overflow-hidden order-1 lg:order-2">
              <img
                src={strategyHero}
                alt="Our Mission Strategy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white to-transparent h-1/3 lg:h-full lg:w-1/4 bottom-0 lg:bottom-auto"></div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* SECTION 3: PILLARS */}
      <div className="bg-[var(--color-sub-bg)] pb-10 px-6 md:px-16 lg:px-[180px]">
        <div className="max-w-[1440px] mx-auto ">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUpVariants}
          >
            <div className="mb-12 text-center md:text-left">
              <h2 className="sub-heading text-2xl md:text-3xl mb-3 font-bold">Our Core Pillars</h2>
              <p className="paragraph text-sm md:text-base">The methodologies and principles that direct our client delivery model.</p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {missionPillars.map((pillar) => (
  <motion.article
    variants={cardVariants}
    whileHover={{ y: -8 }}
    key={pillar.id}
    className="group relative overflow-hidden flex flex-col h-full cursor-pointer bg-main p-5 rounded-lg border border-black/5 shadow-sm transition-all duration-300 ease-out hover:shadow-md"
  >
    {/* Image Wrapper - Responsive height scaling */}
    <div className="overflow-hidden rounded h-auto sm:h-[220px] mb-5 w-full bg-neutral-100 flex items-center justify-center">
      <img
        src={pillar.imageUrl}
        alt={pillar.title}
        className="w-full h-auto sm:h-full object-contain sm:object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
      />
    </div>

    {/* Content Elements */}
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
    textAlign: "left", // Changed from "justify" to "left"
    hyphens: "auto",
  }}
>
  {pillar.description}
</p>
    </div>

    {/* Bottom Accent Hover Line */}
    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[var(--color-primary)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
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