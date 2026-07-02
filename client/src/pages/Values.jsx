import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
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
            className="text-blue-500 hover:text-white transition-colors flex items-center border border-blue-500/30 rounded-full px-5 py-2 text-sm font-medium hover:border-blue-500 cursor-pointer"
          >
            ← Back to About Us
          </button>
        </motion.div>

        {/* Section 1: Hero */}
        <motion.section
          key={`hero-${normalizedType}`}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {currentContent.heroTitle}
          </h1>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
            {currentContent.heroSubtitle}
          </p>
        </motion.section>
      </div>

      {/* SECTION 2: FEATURED BANNER - White bg, dark text */}
      <div className="bg-[var(--color-main-bg)] py-16 md:py-24 text-[var(--color-black)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.section
            key={`featured-${normalizedType}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-xl overflow-hidden border border-black/5 shadow-[0_15px_35px_rgba(0,0,0,0.03)]"
          >
            <div className="p-8 md:p-10 flex flex-col justify-center h-full order-2 lg:order-1">
              <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-600 text-xs font-semibold uppercase tracking-wider rounded-md mb-6 w-max">
                {currentContent.featuredTag}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-black)] mb-4">
                {currentContent.featuredTitle}
              </h2>
              <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                {currentContent.featuredDesc}
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
                src={currentContent.featuredImage}
                alt={currentContent.featuredTitle}
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
            key={`pillars-${normalizedType}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUpVariants}
          >
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-black)] mb-3">
                {currentContent.pillarsTitle}
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                {currentContent.pillarsDesc}
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {currentContent.pillars.map((pillar) => (
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
                    <span className="text-blue-600 text-xs font-semibold mb-2 uppercase">
                      {pillar.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-[var(--color-black)] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed flex-grow">
                      {pillar.description}
                    </p>
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

export default Values;
