import { motion } from 'framer-motion';
import PolicyIcon from '@mui/icons-material/Policy';
import GavelIcon from '@mui/icons-material/Gavel';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen text-[var(--color-pure-black)]">

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 bg-main">
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-6">
                        <GavelIcon fontSize="small" />
                        Terms & Conditions
                    </div>

                    <h1 className="main-heading mb-5">Terms of Service</h1>

                    <p className="paragraph max-w-3xl mx-auto leading-8">
                        Welcome to Strivo Consultancy. These terms and conditions outline the rules and regulations for the use of our website and services.
                    </p>

                    <p className="paragraph mt-5">Last Updated: July 2026</p>
                </motion.div>
            </section>

            {/* Content */}
            <section className="pb-24 px-6 bg-sub p-8">
                <div className="max-w-5xl mx-auto space-y-6">

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card border border-gray-200 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <InfoIcon className="text-blue-500" />
                            <h2 className="sub-heading">1. Introduction</h2>
                        </div>
                        <p className="paragraph leading-8">
                            By accessing this website we assume you accept these terms and conditions. Do not continue to use Strivo Consultancy if you do not agree to these terms.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card border border-gray-200 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <AccountBalanceIcon className="text-blue-500" />
                            <h2 className="sub-heading">2. Intellectual Property</h2>
                        </div>
                        <p className="paragraph leading-8">
                            Unless otherwise stated, Strivo Consultancy and/or its licensors own the intellectual property rights for all material on this site. You may view and/or print pages from the site for your own personal use subject to restrictions.
                        </p>
                        <ul className="paragraph mt-4 space-y-2 list-disc pl-6">
                            <li>You must not republish material from our website.</li>
                            <li>You must not sell, rent or sub-license material from our website.</li>
                            <li>You must not reproduce, duplicate or copy material from our website.</li>
                        </ul>
                    </motion.div>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card border border-gray-200 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <PolicyIcon className="text-blue-500" />
                            <h2 className="sub-heading">3. Limitation of Liability</h2>
                        </div>
                        <p className="paragraph leading-8">
                            In no event shall Strivo Consultancy, nor any of its officers, directors and employees, be liable for any indirect, consequential or special liability arising out of or in any way related to your use of this site.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card border border-gray-200 rounded-2xl p-8">
                        <h2 className="sub-heading mb-4">Questions?</h2>
                        <p className="paragraph leading-7">If you have any questions regarding these Terms, our team will be happy to assist you.</p>
                        <a href="mailto:strivoc@gmail.com" className="inline-block mt-5 text-blue-600 font-semibold hover:text-blue-700 transition">strivoc@gmail.com</a>
                    </motion.div>

                </div>
            </section>
        </div>
    );
};

export default TermsAndConditions;
