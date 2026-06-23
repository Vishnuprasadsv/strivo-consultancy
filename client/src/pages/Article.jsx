import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { articlesData } from './Insight';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Article = () => {
  const { id } = useParams();
  const article = articlesData.find(a => a.id === parseInt(id));
  
  // Exclude current article for related articles, limit to 3
  const relatedArticles = articlesData.filter(a => a.id !== parseInt(id)).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="bg-transparent text-white min-h-screen pt-32 text-center">
        <h1 className="text-3xl font-bold mb-6">Article not found</h1>
        <Link to="/insights" className="text-blue-500 hover:text-white transition-colors">
          Return to Insights
        </Link>
      </div>
    );
  }

  const tags = ["AI", "Enterprise", "Innovation", "Cloud"];
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link: ', err));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Subscribed successfully to Nexus Insights Daily!');
  };

  return (
    <div className="bg-transparent text-white min-h-screen pt-24 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Navigation */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUpVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <Link to="/insights" className="text-blue-500 hover:text-white transition-colors flex items-center border border-blue-500/30 rounded-full px-5 py-2 text-sm font-medium hover:border-blue-500">
            ← Back to Insights
          </Link>
          <div className="text-gray-400 text-sm font-medium flex flex-wrap items-center gap-2">
            Home <span className="text-gray-600">›</span> Insights <span className="text-gray-600">›</span> <span className="text-blue-500 whitespace-nowrap">{article.category}</span>
          </div>
        </motion.div>

        {/* Title Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUpVariants}>
          <div className="flex justify-between items-start flex-col lg:flex-row gap-8">
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 border border-blue-500/30 text-blue-500 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">{article.category}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">{article.title}</h1>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed">{article.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end items-start mt-4 lg:mt-0">
              {tags.map(t => (
                <span key={t} className="bg-[#1F2937] text-gray-300 text-sm font-medium px-4 py-1.5 rounded-full border border-[#374151]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUpVariants}
          className="mt-12 w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative rounded-2xl overflow-hidden border border-[#374151]"
        >
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-12 mt-16">
          
          {/* Left Column: Author Info */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
            className="lg:w-1/4 xl:w-1/5 shrink-0"
          >
            <div className="bg-[#111827] border border-[#374151] rounded-xl p-6 flex flex-col items-center text-center sticky top-24">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMsZ4v8T5-3Y-y1s145_7w94_vT8nK1sF_X5wzY1Y_0xT57Qz09pUv2q6X7w18q5-M5P8E0kH4v5jP3pP429sV2n4z706q0qJ15U3lR-w8H-4H_rT70uH_h9D4x0q58085Z19-H02DqP82gR4K8yP6t5qH-x5r5QG5WwU_sP_Hw0Zq8tU=s400" alt="Elena Rostova" className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 mb-4" />
              <h3 className="text-white font-bold text-lg">Elena Rostova</h3>
              <p className="text-blue-500 text-sm font-medium mb-6">Principal Consultant</p>
              
              <div className="w-full border-t border-[#374151] pt-6 flex flex-col gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span>October 24, 2024</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>12 min read</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Middle Column: Article Content */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
            className="lg:w-2/4 xl:w-3/5 text-gray-300 leading-relaxed space-y-10"
          >
            {/* Executive Summary */}
            <div className="bg-[#111827] border border-[#374151] border-l-4 border-l-blue-500 rounded-r-xl p-8">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Executive Summary
              </h3>
              <ul className="space-y-3 list-disc list-inside text-gray-400">
                <li>The integration of LLMs requires a fundamental shift from static cloud infrastructure to elastic, compute-heavy environments.</li>
                <li>Data governance and sovereignty remain the primary friction points for global enterprise adoption in 2024.</li>
                <li>Legacy systems are not an obstacle but a foundational data layer when abstracted correctly through API-first orchestration.</li>
              </ul>
            </div>

            {/* Paragraphs */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">The Paradigms of Modern Infrastructure</h2>
              <p className="mb-6">
                In the current fiscal landscape, the narrative has shifted from pure digital adoption to deep architectural transformation. Enterprises that once viewed Artificial Intelligence as a tangential luxury are now confronting a reality where compute-readiness defines their valuation. The friction between legacy stability and generative speed has never been more pronounced.
              </p>
            </div>

            {/* Blockquote */}
            <blockquote className="bg-[#1F2937] border-l-4 border-gray-500 italic p-6 rounded-r-lg text-lg text-gray-300">
              "Strategic adaptation is no longer an option—it is the baseline for enterprise survival."
              <footer className="text-blue-500 text-sm font-semibold mt-4 not-italic">— Maria Halstead, Nexus Insights Global</footer>
            </blockquote>

            {/* Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Operationalizing Intelligence</h2>
              <p className="mb-6">
                To successfully integrate high-parameter models, an organization must audit its data hygiene with surgical precision. Most failures in AI implementation do not stem from model inadequacy, but from the inability of the infrastructure to feed the engine high-quality, contextual data in real-time.
              </p>
              <ul className="space-y-4 mb-6 list-disc list-inside ml-2">
                <li><strong className="text-white">Unified Data Fabric:</strong> Breaking down department-level silos to create a single source of truth.</li>
                <li><strong className="text-white">Edge Computing Synergy:</strong> Moving processing power closer to the data source to minimize latency in decision-making.</li>
                <li><strong className="text-white">Ethical Governance Frameworks:</strong> Implementing hard-coded guardrails that protect intellectual property while allowing for rapid iteration.</li>
              </ul>
              <p>
                We are seeing a trend towards "Small Language Models" (SLMs) trained on proprietary enterprise data, which offer higher security and lower operational costs than general-purpose giants. This shift allows for more tailored automation that understands the specific nuances of a global supply chain or a complex financial portfolio.
              </p>
            </div>

          </motion.div>

          {/* Right Column: Share & Newsletter */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
            className="lg:w-1/4 xl:w-1/5 shrink-0 flex flex-col gap-8"
          >
            {/* Share Article */}
            <div className="bg-[#111827] border border-[#374151] rounded-xl p-6">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Share Article</h3>
              <div className="flex flex-wrap gap-3">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-colors" aria-label="Share on Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0077b5] transition-colors" aria-label="Share on LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <button onClick={handleCopyLink} className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] transition-colors" aria-label="Copy Link">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </button>
                <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`} className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 transition-colors" aria-label="Email Article">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-[#111827] border border-[#374151] rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">Nexus Insights Daily</h3>
              <p className="text-gray-400 text-sm mb-4">The latest strategic intelligence delivered to your inbox.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input type="email" required placeholder="Email address" className="bg-[#1F2937] border border-[#374151] text-white placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full" />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors w-full cursor-pointer">
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>

        </div>

        {/* Want expert guidance? Section */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
          className="mt-24 border border-[#374151] bg-[#111827] rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Want expert guidance?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Our global team of consultants helps organizations navigate technical complexity and unlock transformative value through tailored strategic frameworks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/contact" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center cursor-pointer">
              Schedule Consultation
            </Link>
            <Link to="/insights" className="w-full sm:w-auto bg-transparent border border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center cursor-pointer">
              Explore More Insights
            </Link>
          </div>
        </motion.div>

        {/* Related Articles Section */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
          className="mt-24"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedArticles.map(relArticle => (
              <motion.article 
                key={relArticle.id}
                whileHover={{ y: -5 }}
                className="bg-[#111827] border border-[#374151] rounded-lg overflow-hidden group hover:border-[#4b5563] transition-colors flex flex-col h-full"
              >
                <Link to={`/article/${relArticle.id}`} className="flex flex-col h-full">
                  <div className="h-48 w-full relative overflow-hidden">
                    <img 
                      src={relArticle.imageUrl} 
                      alt={relArticle.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-blue-500 text-xs font-semibold mb-2 uppercase">{relArticle.category}</span>
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{relArticle.title}</h3>
                    <p className="text-gray-400 mb-6 flex-grow">{relArticle.description}</p>
                    <div className="text-blue-500 font-medium flex items-center group-hover:text-white transition-colors w-max mt-auto">
                      Read Article <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Article;