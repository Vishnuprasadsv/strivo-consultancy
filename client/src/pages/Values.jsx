import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';

// Import local assets
import strategyHero from "../assets/strategy-hero.jpg";
import aboutUsImg from "../assets/aboutus.jpg";
import servicesHero from "../assets/services-hero.jpg";
import leaderImg from "../assets/leader1.jpg";
import { FiArrowLeft } from 'react-icons/fi';

// MATCHED EXACTLY WITH SERVICE PAGE ANIMATION
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

// Content database for each of the core values
const valuesContent = {
  integrity: {
    heroTitle: "Integrity & Objective Advisory",
    heroSubtitle: "We prioritize objective truth above all. We deliver uncompromising honesty in our analysis, strategic advisory, and stakeholder communications.",
    featuredTag: "Core Principle",
    featuredTitle: "The Standard of Objective Truth",
    featuredDesc: "Strivo was founded on the principle that corporate advisory must remain completely unbiased. We reject comfortable compromises, verify every diagnostic parameter, and ensure client leadership receives an accurate, raw portrayal of operational realities to make correct decisions.",
    featuredImage: strategyHero,
    pillarsTitle: "Integrity Pillars",
    pillarsDesc: "The methodologies we use to safeguard objectivity and ethics.",
    pillars: [
      {
        id: 1,
        category: 'Transparency',
        title: 'Independent Diagnostics',
        description: 'Deploying deep data audits and client audits without external influence or vendor alignments.',
        imageUrl: aboutUsImg
      },
      {
        id: 2,
        category: 'Communications',
        title: 'Direct Reporting',
        description: 'Delivering direct and clear reporting on structural risks, timeline delays, and operational friction points.',
        imageUrl: strategyHero
      },
      {
        id: 3,
        category: 'Ethics',
        title: 'Client-First Alignment',
        description: 'Ensuring project recommendations serve the long-term success of the client rather than billable extensions.',
        imageUrl: servicesHero
      },
      {
        id: 4,
        category: 'Compliance',
        title: 'Rigorous Oversight',
        description: 'Adhering to international auditing standards and strictly maintaining data privacy constraints.',
        imageUrl: leaderImg
      }
    ]
  },
  innovation: {
    heroTitle: "Innovation & Digital Acceleration",
    heroSubtitle: "Challenging legacy paradigms to discover superior operational systems. We integrate AI-powered diagnostics and agile models.",
    featuredTag: "Next-Gen Strategy",
    featuredTitle: "Disrupting Traditional Consulting Models",
    featuredDesc: "In a rapid, changing global economy, legacy strategies represent risk. Strivo helps enterprises incorporate predictive intelligence, responsive supply chain architectures, and cloud-native solutions to unlock new commercial growth vectors.",
    featuredImage: servicesHero,
    pillarsTitle: "Innovation Pillars",
    pillarsDesc: "The technologies and frameworks guiding our solution design.",
    pillars: [
      {
        id: 1,
        category: 'Analytics',
        title: 'AI-Powered Strategy',
        description: 'Leveraging automated predictive modeling to optimize commercial actions and market targeting.',
        imageUrl: strategyHero
      },
      {
        id: 2,
        category: 'Tech Stack',
        title: 'Modern Architecture',
        description: 'Redesigning outdated database systems into high-efficiency distributed APIs.',
        imageUrl: servicesHero
      },
      {
        id: 3,
        category: 'Workflow',
        title: 'Agile Operability',
        description: 'Structuring internal client teams to execute iterative development sprints and respond to changes.',
        imageUrl: aboutUsImg
      },
      {
        id: 4,
        category: 'User Experience',
        title: 'Product Design',
        description: 'Balancing complex operational features with simple interface designs to maximize software adoption.',
        imageUrl: leaderImg
      }
    ]
  },
  impact: {
    heroTitle: "Impact & Measurable Value",
    heroSubtitle: "We measure our success exclusively by client outcomes. We deliver concrete, quantifiable improvements to your bottom line.",
    featuredTag: "Performance Focus",
    featuredTitle: "Outcome-Driven Client Partnerships",
    featuredDesc: "Consulting should never be a theoretical exercise. We tie our delivery models directly to key corporate parameters—including revenue expansion, cost reductions, operational throughput, and permanent capability improvements.",
    featuredImage: aboutUsImg,
    pillarsTitle: "Impact Pillars",
    pillarsDesc: "Our focus areas for delivering measurable improvement.",
    pillars: [
      {
        id: 1,
        category: 'Financials',
        title: 'Revenue Expansion',
        description: 'Pinpointing pricing inefficiencies and target markets to grow annual recurring revenues.',
        imageUrl: aboutUsImg
      },
      {
        id: 2,
        category: 'Operations',
        title: 'Cost Optimization',
        description: 'Optimizing resource allocation and supply chains to reduce structural overheads.',
        imageUrl: strategyHero
      },
      {
        id: 3,
        category: 'Risk Mitigation',
        title: 'Resilient Systems',
        description: 'Implementing risk management layers to absorb supply chain and currency fluctuations.',
        imageUrl: servicesHero
      },
      {
        id: 4,
        category: 'Sustainability',
        title: 'Capability Transfer',
        description: 'Upskilling employee teams so that performance gains outlive our advisory contract.',
        imageUrl: leaderImg
      }
    ]
  },
  collaboration: {
    heroTitle: "Collaboration & Unified Teams",
    heroSubtitle: "Partnering deeply with your employees to build capabilities. We co-create solutions as a single, cohesive team.",
    featuredTag: "Human Factor",
    featuredTitle: "Co-Creative Strategic Advisory",
    featuredDesc: "We do not believe in drop-in advisory packages. Strivo embeds senior consultants directly alongside client managers and team members, merging client institutional knowledge with external strategy to achieve lasting cultural improvements.",
    featuredImage: leaderImg,
    pillarsTitle: "Collaboration Pillars",
    pillarsDesc: "How we integrate with your team for collaborative success.",
    pillars: [
      {
        id: 1,
        category: 'Co-Design',
        title: 'Interactive Ideation',
        description: 'Engaging key department leaders in brainstorming and roadmap design sessions.',
        imageUrl: leaderImg
      },
      {
        id: 2,
        category: 'Enablement',
        title: 'Employee Training',
        description: 'Conducting detailed training programs to ensure seamless tool transition.',
        imageUrl: aboutUsImg
      },
      {
        id: 3,
        category: 'Culture',
        title: 'Organizational Alignment',
        description: 'Aligning executive goals with front-line operations to minimize friction and resistance.',
        imageUrl: strategyHero
      },
      {
        id: 4,
        category: 'Support',
        title: 'Continuous Review',
        description: 'Hosting regular performance reviews post-launch to debug workflows.',
        imageUrl: servicesHero
      }
    ]
  }
};

const Values = () => {
  const navigate = useNavigate();
  const { valueType } = useParams();

  // Normalize parameter, default to 'integrity' if not found or invalid
  const normalizedType = (valueType || '').toLowerCase();
  const currentContent = valuesContent[normalizedType] || valuesContent.integrity;

  return (
    <div className="min-h-screen bg-main text-black font-sans">
      
      {/* HERO CONTAINER - HEIGHT MATCHED TO SCREENSHOT */}
      <div
        style={{
          backgroundColor: "var(--color-primary)",
          minHeight: "320px", // Reduced from 500px to match the screenshot aspect ratio
          display: "flex",
          alignItems: "center"
        }}
      >
        <motion.section
          key={`hero-${normalizedType}`}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="max-w-[110rem] w-full mx-auto px-4 md:px-12 lg:px-[180px] py-10 text-white"
          style={{
            filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.2))"
          }}
        >
          <div className="max-w-4xl flex flex-col items-start text-left">
            
            {/* Clean Back Button exactly replacing breadcrumbs path */}
            <button 
              onClick={() => navigate("/about")} 
              className="text-white/80 hover:text-white transition-colors flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer bg-white/10 hover:bg-white/20 rounded-md px-4 py-1.5 border border-white/20"
            >
              <FiArrowLeft size={16} /> Back to About Us
            </button>

            {/* Main Dynamic Heading */}
            <h1 className="main-heading text-white leading-tight mb-4 text-3xl md:text-4xl lg:text-5xl">
              {currentContent.heroTitle}
            </h1>

            {/* Description Subtitle text */}
            <p className="paragraph text-white/90 max-w-3xl text-sm md:text-base leading-relaxed">
              {currentContent.heroSubtitle}
            </p>
          </div>
        </motion.section>
      </div>

      {/* SECTION 2: FEATURED BANNER */}
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-sub py-8 md:py-20 px-4 md:px-12 lg:px-[180px]">
          <div className="max-w-[1440px] mx-auto">
            <motion.section
              key={`featured-${normalizedType}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUpVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 items-stretch bg-white card overflow-hidden border border-black/5 shadow-[0_15px_35px_rgba(0,0,0,0.03)]"
            >
              <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center order-2 lg:order-1">
                <span className="inline-block px-3 py-1 bg-sub pre-heading uppercase tracking-wider rounded-md mb-6 w-max text-xs font-semibold">
                  {currentContent.featuredTag}
                </span>
                <h2 className="sub-heading md:text-3xl mb-4">
                  {currentContent.featuredTitle}
                </h2>
                <p className="paragraph mb-6 md:text-base leading-relaxed">
                  {currentContent.featuredDesc}
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
                  src={currentContent.featuredImage}
                  alt={currentContent.featuredTitle}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="
    hidden lg:block
    absolute inset-y-0 left-0
    w-40
    bg-gradient-to-r
    from-[var(--color-sub-bg)]
    via-[var(--color-sub-bg)]/45
    to-transparent
    z-10
  "></div>
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
              key={`pillars-${normalizedType}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUpVariants}
            >
              <div className="mb-12">
                <h2 className="sub-heading md:text-3xl mb-3">
                  {currentContent.pillarsTitle}
                </h2>
                <p className="paragraph md:text-base">
                  {currentContent.pillarsDesc}
                </p>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {currentContent.pillars.map((pillar) => (
                  <motion.article
                    variants={cardVariants}
                    whileHover={{ y: -8 }}
                    key={pillar.id}
                    className="group relative overflow-hidden flex flex-col h-full cursor-pointer bg-main p-5 card border border-black/5 shadow-sm transition-all duration-300 ease-out hover:shadow-md"
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

                    {/* Interactive bottom slider border */}
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

export default Values;