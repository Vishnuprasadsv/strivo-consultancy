import { motion } from "framer-motion";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import StorageIcon from "@mui/icons-material/Storage";
import PolicyIcon from "@mui/icons-material/Policy";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: .6 }
    }
};

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[var(--color-main-bg)] text-[var(--color-pure-black)]">

            {/* Hero */}

            <section className="pt-32 pb-16 px-6">

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="max-w-6xl mx-auto text-center"
                >

                    <div className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-full
          bg-blue-600/10
          border border-blue-500/20
          text-blue-400
          mb-6">

                        <PolicyIcon fontSize="small" />

                        Privacy Policy

                    </div>

                    <h1 className="text-5xl font-bold mb-5">

                        Your Privacy Matters

                    </h1>

                    <p className="
          text-[var(--color-pure-black)]
          max-w-3xl
          mx-auto
          leading-8">

                        At Strivo Consultancy we are committed to
                        protecting your personal information and
                        maintaining transparency about how your
                        data is collected, stored, and used.

                    </p>

                    <p className="text-sm text-[var(--color-pure-black)] mt-5">

                        Last Updated: July 2026

                    </p>

                </motion.div>

            </section>

            {/* Content */}

            <section className="pb-24 px-6">

                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Card */}

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="
            bg-[var(--color-sub-bg)]
            border
            border-gray-200
            rounded-2xl
            p-8">

                        <div className="flex items-center gap-3 mb-5">

                            <SecurityIcon className="text-blue-500" />

                            <h2 className="text-2xl font-bold">

                                Information We Collect

                            </h2>

                        </div>

                        <p className="text-[var(--color-pure-black)] leading-8">

                            We may collect:

                        </p>

                        <ul className="
            mt-4
            space-y-2
            text-[var(--color-pure-black)]
            list-disc
            pl-6">

                            <li>Full Name</li>

                            <li>Company Name</li>

                            <li>Email Address</li>

                            <li>Phone Number</li>

                            <li>Service Interests</li>

                            <li>Messages submitted through contact forms</li>

                        </ul>

                    </motion.div>

                    {/* Usage */}

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="
            bg-[var(--color-sub-bg)]
            border
            border-gray-200
            rounded-2xl
            p-8">

                        <div className="flex items-center gap-3 mb-5">

                            <StorageIcon className="text-blue-500" />

                            <h2 className="text-2xl font-bold">

                                How We Use Information

                            </h2>

                        </div>

                        <ul className="
            space-y-3
            text-[var(--color-pure-black)]
            list-disc
            pl-6">

                            <li>Respond to inquiries</li>

                            <li>Provide consultancy services</li>

                            <li>Improve user experience</li>

                            <li>Send important updates</li>

                            <li>Maintain communication records</li>

                        </ul>

                    </motion.div>

                    {/* Security */}

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="
            bg-[var(--color-sub-bg)]
            border
            border-gray-200
            rounded-2xl
            p-8">

                        <div className="flex items-center gap-3 mb-5">

                            <LockIcon className="text-blue-500" />

                            <h2 className="text-2xl font-bold">

                                Data Protection

                            </h2>

                        </div>

                        <p className="text-[var(--color-pure-black)] leading-8">

                            We implement security measures to
                            protect your information against
                            unauthorized access, alteration,
                            disclosure, or destruction.

                        </p>

                        <p className="text-[var(--color-pure-black)] leading-8 mt-4">

                            We never sell your personal information
                            to third parties.

                        </p>

                    </motion.div>

                    {/* Contact */}

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="
            bg-[var(--color-sub-bg)]
            border
            border-gray-200
            rounded-2xl
            p-8"
                    >

                        <h2 className="text-2xl font-bold text-[var(--color-pure-black)] mb-4">
                            Questions?
                        </h2>

                        <p className="text-[var(--color-pure-black)] leading-7">
                            If you have any questions regarding this Privacy Policy,
                            our team will be happy to assist you.
                        </p>

                        <a
                            href="mailto:strivoc@gmail.com"
                            className="
      inline-block
      mt-5
      text-blue-600
      font-semibold
      hover:text-blue-700
      transition
    "
                        >
                            strivoc@gmail.com
                        </a>

                    </motion.div>

                </div>

            </section>

        </div>
    );
};

export default PrivacyPolicy;
