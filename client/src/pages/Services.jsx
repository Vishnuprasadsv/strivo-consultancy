import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/services-hero.jpg";
import digitalTransformation from "../assets/digitalTransformation.jpg"
import changeManagement from "../assets/changeManagement.jpg"

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
      image:"https://lh3.googleusercontent.com/aida-public/AB6AXuAwH885Ucg74aW0JQ-tQ_R19jjsVUDbDWzt_rmw6fjRAflkTAWnj3pp44SYvBT6CItG78fZ56GGg-lZvfmJ1MYl-P779LOy7KhXM07RkdI-y-DF592pJBVw5j2h7CcNsyCvROSQEIX6-OPEl-cff306Trl3rX_qAEKob5mhJRicbHpacPmjrUOLinS4xZ9q8fqHQwuuNjGzrjAfBudpy7V0GD8Vf64RJVrGZIG8ePF4Amxwv-9Vp6nHfiZPZrSRhhPjMNOR5Cob5A",
      description:
        "Develop comprehensive business strategies that align with your vision and market opportunities.",
      link: "/strategic",
    },
    {
      icon: "⚙️",
      title: "Operations Optimization",
      image:"https://lh3.googleusercontent.com/aida-public/AB6AXuAJgsChU0yTK8RMWxphON2ie81nOFWArko__RFbW3N21PEAz6C3NM-TE2HiZaWadpaDSCU5KTcVsNBHkqC_u_N5ZQes7-jHfSVtClljZCNcJfYBvrEdcUSHv3W9DNSB8bspImBZJhVh0ZGTk-MPH7SGX4TWVqdbS5jdZ17wsP0hVeswdKJVpjN_AlCFFin7_6VzQWvkE6tVcHOEOsdjdD_PBb4xULhO3BhapOILD1Y6CRoBUnscC65_BnCSpyZLMgZeE_T15vMBXg",
      description:
        "Streamline processes and improve efficiency across your organization.",
      link: "/operations",
    },
    {
      icon: "💻",
      title: "Digital Transformation",
      image: digitalTransformation,
      description:
        "Navigate the complexities of digital adoption and technology integration.",
      link: "/digital",
    },
    {
      icon: "🚀",
      title: "Change Management",
      image: changeManagement,
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
      <div style={{ backgroundColor: "var(--color-main-bg)", padding: "4rem 0" }}>
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="max-w-7xl mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-3" style={{ color: "var(--color-pure-black)" }}>
            Our Consulting Services
          </h2>

          <p className="mb-10" style={{ color: "var(--color-pure-black)" }}>
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
                style={{ backgroundColor: "var(--color-sub-bg)" }}
                className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:-translate-y-2 cursor-pointer transition-all duration-300"
              >
                <div className="text-4xl">{service.icon}</div>

                <h3 className="text-2xl font-semibold mt-4 mb-3" style={{ color: "var(--color-pure-black)" }}>
                  {service.title}
                </h3>

                <p style={{ color: "var(--color-pure-black)" }}>
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Detailed Service Sections */}
      <div className="h-100vh w-100vw bg-sub-bg">
      <section className="max-w-[89%] mx-auto px-6 pt-16 pb-16">
        
        {/* Section Heading & Subheading */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-3" style={{ color: "var(--color-pure-black)" }}>
            Detailed Service Breakdown
          </h2>
          <p style={{ color: "var(--color-pure-black)", opacity: 0.8 }}>
            Explore the custom methodologies, processes, and core deliverables we provide for each service area.
          </p>
        </div>

        {services.map((service, index) => (
          <motion.div
            key={index}
            id={`service-${index}`}
            style={{ 
              scrollMarginTop: "100px", 
              backgroundColor: "var(--color-main-bg)", 
              color: "var(--color-pure-black)",
              border: "1px solid rgba(5, 0, 0, 0.135)",
            borderRadius: "8px",
            }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.7,
              delay: index * 0.15,
            }}
            ref={(el) => (detailRefs.current[index] = el)}
            className="grid lg:grid-cols-2 gap-8 border rounded-xl p-8 mb-8"
          >
            <div>
              <h3 className="text-3xl font-bold mb-4">
                {service.title}
              </h3>

              <p className="mb-6">
                {service.description}
              </p>

              <ul className="space-y-3">
                <li>✔ Comprehensive assessment and diagnostics</li>
                <li>✔ Customized implementation roadmap</li>
                <li>✔ Ongoing support and optimization</li>
                <li>✔ Measurable KPIs and success metrics</li>
              </ul>

              <Link
                to={service.link}
                className="btn h-[40px] w-[140px] flex items-center justify-center inline-block mt-6 pt-2 pl-7"
              >
                Learn More
              </Link>
            </div>

            <div 
              style={{ borderRadius: "8px" }}
              className="bg-white flex flex-col items-center justify-center h-[280px]"
            >
              <img alt="Strategic Service Overview" className="w-full h-full object-fill opacity-90 drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]" src={service.image} />
            </div>
          </motion.div>
        ))}
      </section>
      </div>
    </div>
  );
};

export default Services;