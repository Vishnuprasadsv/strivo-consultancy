import { motion } from "framer-motion";
import PolicyIcon from "@mui/icons-material/Policy";
import GavelIcon from "@mui/icons-material/Gavel";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import InfoIcon from "@mui/icons-material/Info";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: .6 }
    }
};

const TermsAndConditions = () => {
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-6">
                        <GavelIcon fontSize="small" />
                        Terms & Conditions
                    </div>
                    <h1 className="text-5xl font-bold mb-5">
                        Terms of Service
                    </h1>
                    <p className="text-[var(--color-pure-black)] max-w-3xl mx-auto leading-8">
                        Welcome to Strivo Consultancy. These terms and conditions outline the rules and regulations for the use of our website and services.
                    </p>
                    <p className="text-sm text-[var(--color-pure-black)] mt-5">
                        Last Updated: July 2026
                    </p>
                </motion.div>
            </section>

            {/* Content */}
            <section className="pb-24 px-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Card 1 */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-[var(--color-sub-bg)] border border-gray-200 rounded-2xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <InfoIcon className="text-blue-500" />
                            <h2 className="text-2xl font-semibold">1. Introduction</h2>
                        </div>
                        <div className="text-[var(--color-pure-black)] space-y-4 leading-8">
                            <p>
                                By accessing this website we assume you accept these terms and conditions. Do not continue to use Strivo Consultancy if you do not agree to take all of the terms and conditions stated on this page.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-[var(--color-sub-bg)] border border-gray-200 rounded-2xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <AccountBalanceIcon className="text-blue-500" />
                            <h2 className="text-2xl font-semibold">2. Intellectual Property Rights</h2>
                        </div>
                        <div className="text-[var(--color-pure-black)] space-y-4 leading-8">
                            <p>
                                Unless otherwise stated, Strivo Consultancy and/or its licensors own the intellectual property rights for all material on Strivo Consultancy. All intellectual property rights are reserved. You may access this from Strivo Consultancy for your own personal use subjected to restrictions set in these terms and conditions.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>You must not republish material from our website.</li>
                                <li>You must not sell, rent or sub-license material from our website.</li>
                                <li>You must not reproduce, duplicate or copy material from our website.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-[var(--color-sub-bg)] border border-gray-200 rounded-2xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <PolicyIcon className="text-blue-500" />
                            <h2 className="text-2xl font-semibold">3. Limitation of Liability</h2>
                        </div>
                        <div className="text-[var(--color-pure-black)] space-y-4 leading-8">
                            <p>
                                In no event shall Strivo Consultancy, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract. Strivo Consultancy, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this website.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default TermsAndConditions;
