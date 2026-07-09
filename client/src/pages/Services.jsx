import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/services-hero.jpg";
import digitalTransformation from "../assets/digitalTransformation.jpg"
import changeManagement from "../assets/changeManagement.jpg"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

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
      icon: (
        <RocketLaunchIcon
          sx={{ fontSize: 24 }}
          className="transition-colors duration-300"
        />
      ),
      title: "Strategic Planning",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwH885Ucg74aW0JQ-tQ_R19jjsVUDbDWzt_rmw6fjRAflkTAWnj3pp44SYvBT6CItG78fZ56GGg-lZvfmJ1MYl-P779LOy7KhXM07RkdI-y-DF592pJBVw5j2h7CcNsyCvROSQEIX6-OPEl-cff306Trl3rX_qAEKob5mhJRicbHpacPmjrUOLinS4xZ9q8fqHQwuuNjGzrjAfBudpy7V0GD8Vf64RJVrGZIG8ePF4Amxwv-9Vp6nHfiZPZrSRhhPjMNOR5Cob5A",
      description:
        "Develop comprehensive business strategies that align with your vision and market opportunities.",
      link: "/strategic",
    },
    {
      icon: (<SettingsSuggestIcon sx={{ fontSize: 24 }} className="transition-colors duration-300" />),
      title: "Operations Optimization",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJgsChU0yTK8RMWxphON2ie81nOFWArko__RFbW3N21PEAz6C3NM-TE2HiZaWadpaDSCU5KTcVsNBHkqC_u_N5ZQes7-jHfSVtClljZCNcJfYBvrEdcUSHv3W9DNSB8bspImBZJhVh0ZGTk-MPH7SGX4TWVqdbS5jdZ17wsP0hVeswdKJVpjN_AlCFFin7_6VzQWvkE6tVcHOEOsdjdD_PBb4xULhO3BhapOILD1Y6CRoBUnscC65_BnCSpyZLMgZeE_T15vMBXg",
      description:
        "Streamline processes and improve efficiency across your organization.",
      link: "/operations",
    },
    {
      icon: (<AutoGraphIcon sx={{ fontSize: 24 }} className="transition-colors duration-300" />),
      title: "Digital Transformation",
      image: digitalTransformation,
      description:
        "Navigate the complexities of digital adoption and technology integration.",
      link: "/digital",
    },
    {
      icon: (<SyncAltIcon sx={{ fontSize: 24 }} className="transition-colors duration-300" />),
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
      <div
        style={{
          backgroundColor: "var(--color-primary)",
          minHeight: "500px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="max-w-[110rem] w-full mx-auto px-8 py-16"
          style={{
            filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.6))"
          }}
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="main-heading text-white leading-tight">
                Expert Precision for
                <span className="block text-white">
                  Complex Challenges
                </span>
              </h1>

              <p className="paragraph text-white mt-6">
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
                className="w-full h-[400px] object-cover rounded-[3px]"
              />
            </div>
          </div>
        </motion.section>
      </div>

      {/* Service Cards */}
      <div style={{ backgroundColor: "var(--color-main-bg)", padding: "4rem 0" }} >
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="max-w-7xl mx-auto px-6 "
        >
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="sub-heading mb-4">
              Our Consulting Services
            </h2>

            <p className="paragraph">
              We provide comprehensive consulting across strategy,
              operations, digital transformation, and change management.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="cursor-pointer"
              >

                <div
                  className="
 bg-[#edf0ff]
 border
 border-[#e2e8f0]
 card
 p-7
 h-full
 flex
 flex-col
 relative
 overflow-hidden
 transition-all
 duration-500
 hover:-translate-y-2
 hover:border-blue-500
 hover:shadow-[0_20px_40px_rgba(47,107,255,0.15)]
 group
 "
                >

                  {/* Bottom Blue Line */}

                  <div
                    className="
      absolute
      bottom-0
      left-0
      h-[4px]
      w-full
      bg-blue-600
      scale-x-0
      origin-left
      transition-transform
      duration-500
      group-hover:scale-x-100
      "
                  />

                  {/* Icon */}

                  <div
                    className="
    icon-container
    w-10 h-10
    rounded-full
    border border-[#e2e8f0]
    bg-blue-50
    flex items-center justify-center
    text-primary
    transition-all duration-300
    group-hover:bg-primary
    group-hover:!text-white mb-5
  "
                  >
                    {service.icon}
                  </div>
                  {/* Title */}

                  <h3
                    className="
      text-pparagrah
      font-[var(--font-semibold)]
      text-black
      mb-4
      transition-colors
      duration-300
      "
                  >
                    {service.title}
                  </h3>

                  {/* Description */}

                  <p
                    className="
      text-paragraph
      leading-7
      line-clamp-3
      "
                  >
                    {service.description}
                  </p>

                </div>

              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Detailed Service Sections */}
      <div className="h-100vh w-100vw bg-sub-bg">
        <section className="max-w-[89%] mx-auto px-6 pt-16 pb-16">

          {/* Section Heading & Subheading */}
          <div className="mb-12 text-center">
            <h2 className="sub-heading mb-3">
              Detailed Service Breakdown
            </h2>
            <p className="paragraph">
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
                borderRadius: "3px",
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
                <h3 className="sub-heading">
                  {service.title}
                </h3>

                <p className="paragraph">
                  {service.description}
                </p>

                <ul className="space-y-3 paragraph">
                  <li>✔ Comprehensive assessment and diagnostics</li>
                  <li>✔ Customized implementation roadmap</li>
                  <li>✔ Ongoing support and optimization</li>
                  <li>✔ Measurable KPIs and success metrics</li>
                </ul>

                <Link
                  to={service.link}
                  className="btn h-[40px] w-[140px] mt-6"
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