import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/services-hero.jpg";

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

const Services = () => {
 
  const detailRefs = useRef([]);
  const services = [
    {
      icon: "📊",
      title: "Strategic Planning",
      description:
        "Develop comprehensive business strategies that align with your vision and market opportunities.",
      link: "/strategic",
    },
    {
      icon: "⚙️",
      title: "Operations Optimization",
      description:
        "Streamline processes and improve efficiency across your organization.",
      link: "/operations",
    },
    {
      icon: "💻",
      title: "Digital Transformation",
      description:
        "Navigate the complexities of digital adoption and technology integration.",
      link: "/digital",
    },
    {
      icon: "🚀",
      title: "Change Management",
      description:
        "Lead organizational change with confidence and minimize resistance.",
      link: "/change",
    },
  ];

  return (
    <div className="bg-transparent text-white min-h-screen">

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 py-16"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Expert Precision for
              <span className="block text-blue-500">
                Complex Challenges
              </span>
            </h1>

            <p className="text-gray-400 mt-6 leading-8">
              We architect scalable solutions for enterprise growth.
              Discover our comprehensive suite of consulting services
              designed to optimize operations, drive digital
              transformation, and navigate complex organizational
              change.
            </p>
          </div>

          <div>
            <img
              src={heroImage}
              alt="Services"
              className="w-full h-[400px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </motion.section>

      {/* Service Cards */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
        className="max-w-7xl mx-auto px-6 pb-16"
      >
        <h2 className="text-4xl font-bold mb-3">
          Our Consulting Services
        </h2>

        <p className="text-gray-400 mb-10">
          We provide comprehensive consulting across strategy,
          operations, digital transformation, and change management.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
             onClick={() => {
  document
    .getElementById(`service-${index}`)
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
}}
              className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-blue-500 hover:-translate-y-2 cursor-pointer transition-all duration-300"
            >
              <div className="text-4xl">{service.icon}</div>

              <h3 className="text-2xl font-semibold mt-4 mb-3">
                {service.title}
              </h3>

              <p className="text-gray-400">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Detailed Service Sections */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {services.map((service, index) => (
          <motion.div
            key={index}
            id={`service-${index}`}
            style={{ scrollMarginTop: "100px" }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.7,
              delay: index * 0.15,
            }}
            ref={(el) => (detailRefs.current[index] = el)}
            className="grid lg:grid-cols-2 gap-8 border border-gray-800 rounded-xl p-8 mb-8"
          >
            <div>
              <h3 className="text-3xl font-bold mb-4">
                {service.title}
              </h3>

              <p className="text-gray-400 mb-6">
                {service.description}
              </p>

              <ul className="space-y-3 text-gray-300">
                <li>✔ Comprehensive assessment and diagnostics</li>
                <li>✔ Customized implementation roadmap</li>
                <li>✔ Ongoing support and optimization</li>
                <li>✔ Measurable KPIs and success metrics</li>
              </ul>

              <Link
                to={service.link}
                className="inline-block mt-6 px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-300"
              >
                Learn More
              </Link>
            </div>

            <div className="bg-white rounded-xl flex flex-col items-center justify-center h-[280px]">
              <div className="text-6xl">{service.icon}</div>

              <h4 className="text-black text-xl mt-4 font-semibold">
                {service.title}
              </h4>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Services;