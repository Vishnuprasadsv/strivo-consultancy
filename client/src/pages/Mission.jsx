import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/strategy-hero.jpg";

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Mission = () => {
  const detailRefs = useRef([]);

  const pillars = [
    {
      icon: "📊",
      title: "Analytical Rigor",
      description:
        "Every strategic recommendation we make is grounded in meticulous data analysis, diagnostic assessment, and objective truth.",
    },
    {
      icon: "🎯",
      title: "Strategic Foresight",
      description:
        "We look beyond the horizon to identify emerging trends, model potential market shifts, and build future-proof corporate plans.",
    },
    {
      icon: "⚙️",
      title: "Flawless Execution",
      description:
        "A brilliant strategy is only as good as its implementation. We design structured roadmaps to transition strategies into reality.",
    },
    {
      icon: "🌱",
      title: "Sustainable Growth",
      description:
        "We are committed to fostering long-term value, internal capability building, and organizational resilience.",
    },
  ];

  return (
    <div className="bg-transparent text-white min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 py-12 md:py-16"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Typography
              component="h1"
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            >
              Designing the Blueprint for
              <span className="block text-blue-500 mt-1">
                Corporate Excellence
              </span>
            </Typography>

            <Typography
              component="p"
              className="text-gray-400 mt-6 leading-7 text-sm md:text-base max-w-xl"
            >
              Our mission is to architect sustainable growth for ambitious enterprises
              through rigorous data analysis, strategic foresight, and flawless
              operational execution. We partner with global leaders to solve their
              most complex challenges and build resilient organizations.
            </Typography>
          </div>

          <div>
            <img
              src={heroImage}
              alt="Our Mission"
              className="w-full h-[280px] sm:h-[350px] md:h-[400px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </motion.section>

      {/* Pillars Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 pb-16"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          Our Core Mission Pillars
        </h2>

        <p className="text-gray-400 mb-8 text-sm md:text-base">
          Four fundamental commitments that define how we deliver results and create value.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              onClick={() => {
                document
                  .getElementById(`pillar-${index}`)
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
              className="bg-[#0f1118]/80 backdrop-blur-md border border-gray-800/80 rounded-xl p-5 hover:border-blue-500/50 hover:-translate-y-1.5 cursor-pointer transition-all duration-300"
            >
              <div className="text-3xl">{pillar.icon}</div>

              <h3 className="text-lg md:text-xl font-semibold mt-3 mb-2">
                {pillar.title}
              </h3>

              <p className="text-gray-400 text-xs md:text-sm leading-6">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Detailed Pillars Sections */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {pillars.map((pillar, index) => (
          <motion.div
            key={index}
            id={`pillar-${index}`}
            style={{ scrollMarginTop: "100px" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
            }}
            ref={(el) => (detailRefs.current[index] = el)}
            className="grid lg:grid-cols-2 gap-8 border border-gray-800/60 rounded-xl p-6 md:p-8 mb-8 bg-[#0a0c10]/40 backdrop-blur-sm"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {pillar.title}
              </h3>

              <p className="text-gray-400 mb-6 text-sm md:text-base leading-7">
                {pillar.description}
              </p>

              <ul className="space-y-2 text-gray-300 text-xs md:text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✔</span> Rigorous methodology and structured assessment
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✔</span> Custom operational alignment and metrics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✔</span> Long-term value focus with team capability building
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✔</span> Objective auditing and success measurement
                </li>
              </ul>

              <Link
                to="/contact"
                className="inline-block mt-6 px-4 py-2 border border-blue-500 text-blue-500 text-sm font-semibold rounded-md hover:bg-blue-500 hover:text-white transition duration-300"
              >
                Partner With Us
              </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center h-[200px] md:h-[260px]">
              <div className="text-5xl md:text-6xl">{pillar.icon}</div>

              <h4 className="text-white text-lg md:text-xl mt-4 font-semibold">
                {pillar.title}
              </h4>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

// Help helper for Typography styled component equivalent in standard Tailwind
const Typography = ({ component = "div", className, children, ...props }) => {
  const Component = component;
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export default Mission;
