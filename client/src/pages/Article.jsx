import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { articlesData } from './Insight';
import { getArticlesAPI, subscribeEmailAPI } from '../services/allApi';
import { toast } from 'sonner';
import LoadingIndicator from '../Components/LoadingIndicator';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { FiArrowLeft } from 'react-icons/fi';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const renderContent = (contentString) => {
  if (!contentString) return null;

  // Split by newlines, but filter out empty lines to parse accurately
  const lines = contentString.split("\n").map(line => line.trim()).filter(Boolean);

  return lines.map((line, idx) => {
    // 1. Handle Bullet Points
    if (line.startsWith("-") || line.startsWith("*") || line.startsWith("•")) {
      return (
        <ul key={idx} className="paragraph space-y-3 mb-6 list-disc list-inside ml-2">
          <li>{line.replace(/^[-*•]\s*/, "")}</li>
        </ul>
      );
    }

    // 2. Handle Markdown Blockquotes
    if (line.startsWith(">")) {
      return (
        <blockquote key={idx} className="bg-main paragraph border-l border-l-[var(--color-primary)] border-l-4 rounded-r-xl p-8 my-6 text-[var(--color-primary)] font-medium italic">
          {line.replace(/^>\s*/, "")}
        </blockquote>
      );
    }

    // 3. Handle Generic Titles/Headers (e.g., "Why Digital Transformation Matters" or "# Title")
    const isHeaderWord = /^(why|key|emerging|how|what|benefits|\d\.)/i.test(line);
    const isShortLine = line.split(" ").length <= 8; // Headers are usually short strings
    
    if (line.startsWith("#") || (isShortLine && isHeaderWord)) {
      const cleanHeader = line.replace(/^#+\s*/, "");
      return (
        <h2 key={idx} className="sub-heading font-bold text-2xl lg:text-3xl mt-10 mb-4 text-[var(--color-primary)]">
          {cleanHeader}
        </h2>
      );
    }

    // 4. Default Body Paragraphs
    return (
      <p key={idx} className="paragraph text-base lg:text-lg leading-relaxed mb-6 text-gray-700">
        {line}
      </p>
    );
  });
};
const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subscribeEmailVal, setSubscribeEmailVal] = useState("");
  const [submittingSubscribe, setSubmittingSubscribe] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmailVal.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setSubmittingSubscribe(true);
    try {
      const response = await subscribeEmailAPI({ email: subscribeEmailVal });
      if (response.status === 201 || response.status === 200) {
        if (response.data?.success) {
          toast.success("Subscribed successfully! Welcome to Nexus Insights Daily! 🎉");
          setSubscribeEmailVal("");
        } else {
          toast.error(response.data?.message || "Failed to subscribe.");
        }
      } else {
        toast.error(response.data?.message || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      console.error("Article subscription error:", err);
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setSubmittingSubscribe(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadArticleDetails = async () => {
      setLoading(true);
      const defaultList = [...articlesData];
      let combined = defaultList;

      try {
        const response = await getArticlesAPI();
        if (response.status === 200 && response.data?.success) {
          combined = [...response.data.data, ...defaultList];
        }
      } catch (error) {
        console.error("Failed to fetch articles from database:", error);
      }

      const foundArticle = combined.find(a => a._id === id || a.id === parseInt(id));
      const related = combined.filter(a => a._id !== id && a.id !== parseInt(id)).slice(0, 3);

      setArticle(foundArticle || null);
      setRelatedArticles(related);
      setLoading(false);
    };

    loadArticleDetails();
  }, [id]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!article) {
    return (
      <div className="bg-main min-h-screen pt-32 text-center">
        <h1 className="pre-heading mb-6">Article not found</h1>
        <Link to="/insights" className="text-[var(--color-primary)] hover:text-white transition-colors">
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

  return (
    <div className="min-h-screen">
      {/* HEADER SECTION */}
      <section className="bg-main">
        <div className="max-w-[110rem] mx-auto px-4 md:px-12 lg:px-[180px] py-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="max-w-4xl flex flex-col items-start text-left"
          >
            <Link
              to="/insights"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]
              transition-colors flex items-center gap-2 border border-[var(--color-primary)]
              rounded-md px-4 py-1.5 text-sm font-medium
              hover:border-[var(--color-primary-hover)] cursor-pointer"
            >
              <FiArrowLeft size={16} /> Back to Insights
            </Link>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-6">
            <motion.div initial="hidden" animate="visible" variants={fadeUpVariants}>
              <div className="flex justify-between items-start flex-col lg:flex-row gap-8">
                <div className="max-w-4xl">
                  <span className="pre-heading inline-block px-3 py-1 tracking-wider mb-6">{article.category}</span>
                  <motion.h1 className="main-heading mb-6">
                    {article.title}
                  </motion.h1>
                  <div className="flex flex-wrap gap-3 mt-6">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="paragraph mt-6">
                    {article.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-6 text-[15px] text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarTodayOutlinedIcon
                        sx={{ fontSize: 18, color: "var(--color-paragraph)" }}
                      />
                      <span>
                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "October 24, 2024"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUpVariants}
              className="w-full h-[500px] lg:h-[550px] rounded-[var(--radius-sm)] sm:h-[280px] md:h-[350px] relative overflow-hidden border border-[#374151]"
            >
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200";
              }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTENT BODY SECTION */}
      <section className="bg-sub py-24">
        <div className="max-w-[110rem] mx-auto px-8 md:px-[180px] space-y-24">
          
          {/* ROW 1: GRID FOR ARTICLE BODY + STICKY SIDEBAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Markdown Article Body */}
            <div className="lg:col-span-8 xl:col-span-9">
              <motion.div
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, amount: 0.1 }} 
                variants={fadeUpVariants}
                className="leading-relaxed space-y-10"
              >
                {article.content ? (
                  <div className="paragraph article-body">
                    {renderContent(article.content)}
                  </div>
                ) : (
                  <>
                    <div className="bg-main border-l border-l-[var(--color-primary)] border-l-4 rounded-r-[var(--radius-sm)] p-8">
                      <h3 className="sub-heading text-[var(--color-primary)] mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Executive Summary
                      </h3>
                      <ul className="paragraph space-y-3 list-disc list-inside">
                        <li>The integration of LLMs requires a fundamental shift from static cloud infrastructure to elastic, compute-heavy environments.</li>
                        <li>Data governance and sovereignty remain the primary friction points for global enterprise adoption in 2024.</li>
                        <li>Legacy systems are not an obstacle but a foundational data layer when abstracted correctly through API-first orchestration.</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="sub-heading mb-6">The Paradigms of Modern Infrastructure</h2>
                      <p className="paragraph mb-6">
                        In the current fiscal landscape, the narrative has shifted from pure digital adoption to deep architectural transformation. Enterprises that once viewed Artificial Intelligence as a tangential luxury are now confronting a reality where compute-readiness defines their valuation. The friction between legacy stability and generative speed has never been more pronounced.
                      </p>
                    </div>

                    <blockquote className="bg-main paragraph border-l border-l-[var(--color-primary)] border-l-4 rounded-r-[var(--radius-sm)] p-8 text-[var(--color-primary)]">
                      "Strategic adaptation is no longer an option—it is the baseline for enterprise survival."
                      <footer className="text-black text-sm font-semibold mt-4 not-italic">— Maria Halstead, Nexus Insights Global</footer>
                    </blockquote>

                    <div>
                      <h2 className="sub-heading mb-6">Operationalizing Intelligence</h2>
                      <p className="paragraph mb-6">
                        To successfully integrate high-parameter models, an organization must audit its data hygiene with surgical precision. Most failures in AI implementation do not stem from model inadequacy, but from the inability of the infrastructure to feed the engine high-quality, contextual data in real-time.
                      </p>
                      <ul className="paragraph space-y-4 mb-6 list-disc list-inside ml-2">
                        <li><strong>Unified Data Fabric:</strong> Breaking down department-level silos to create a single source of truth.</li>
                        <li><strong>Edge Computing Synergy:</strong> Moving processing power closer to the data source to minimize latency in decision-making.</li>
                        <li><strong>Ethical Governance Frameworks:</strong> Implementing hard-coded guardrails that protect intellectual property while allowing for rapid iteration.</li>
                      </ul>
                      <p className='paragraph'>
                        We are seeing a trend towards "Small Language Models" (SLMs) trained on proprietary enterprise data, which offer higher security and lower operational costs than general-purpose giants. This shift allows for more tailored automation that understands the specific nuances of a global supply chain or a complex financial portfolio.
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </div>

            {/* Right Column: Sidebar (Stops at the end of this Grid Row) */}
            <aside className="lg:col-span-4 xl:col-span-3 self-start h-full">
              <div className="sticky top-28 h-fit flex flex-col gap-8">
                
                {/* Share Links Widget */}
                <div className="bg-main rounded-[var(--radius-sm)] p-6">
                  <h3 className="text-[var(--color-primary)] pre-heading font-bold text-sm uppercase tracking-wider mb-4">Share Article</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="w-full h-12 rounded-full bg-[#1F2937] flex items-center justify-center text-white hover:text-white hover:bg-[var(--color-primary-hover)] transition-colors" aria-label="Share on Twitter">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                    </a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-full h-12 rounded-full bg-[#1F2937] flex items-center justify-center text-white hover:text-white hover:bg-[var(--color-primary-hover)] transition-colors" aria-label="Share on LinkedIn">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </a>
                    <button onClick={handleCopyLink} className="w-full h-12 rounded-full bg-[#1F2937] flex items-center justify-center text-white hover:text-white hover:bg-[var(--color-primary-hover)] transition-colors" aria-label="Copy Link">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    </button>
                    <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`} className="w-full h-12 rounded-full bg-[#1F2937] flex items-center justify-center text-white hover:text-white hover:bg-[var(--color-primary-hover)] transition-colors" aria-label="Email Article">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </a>
                  </div>
                </div>

                {/* Newsletter Subscription Widget */}
                {article.showSubscription !== false && (
                  <div className="bg-main rounded-[var(--radius-sm)] p-6">
                    <h3 className="sub-heading font-bold text-lg mb-2">Nexus Insights Daily</h3>
                    <p className="paragraph text-sm mb-4">The latest strategic intelligence delivered to your inbox.</p>
                    <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                      <input
                        type="email"
                        required
                        value={subscribeEmailVal}
                        onChange={(e) => setSubscribeEmailVal(e.target.value)}
                        placeholder="Email address"
                        className="input bg-sub text-black placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                      />
                      <button
                        type="submit"
                        disabled={submittingSubscribe}
                        className="btn disabled:bg-blue-500/50 px-4 py-2 transition-colors w-full cursor-pointer"
                      >
                        {submittingSubscribe ? "Subscribing..." : "Subscribe"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </aside>

          </div>

          {/* ROW 2: BELOW THE GRID (Widgets will no longer follow down here) */}
         
            
            {/* Consultation Context Banner */}
            <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUpVariants}
            className="mt-24 bg-main rounded-[var9--radius-sm] p-8 md:p-12 text-center"
          >
            <h2 className="sub-heading  mb-4">Want expert guidance?</h2>
            <p className=" max-w-2xl mx-auto mb-8 pragraph">
              Our global team of consultants helps organizations navigate technical complexity and unlock transformative value through tailored strategic frameworks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/contact" className="btn w-full sm:w-auto px-8 py-3 transition-colors cursor-pointer">
                Schedule Consultation
              </Link>
              <Link to="/insights" className="w-full h-[42px] flex items-center justify-center sm:w-auto bg-transparent border border-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:text-white text-black px-8 py-3 rounded-sm font-black transition-colors text-center cursor-pointer">
                Explore More Insights
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUpVariants}
            className="bg-sub w-full mt-24"
          >
            <h2 className="sub-heading mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map(relArticle => (
                <motion.article
                  key={relArticle._id || relArticle.id}
                  whileHover={{ y: -5 }}
                  className="group relative card p-0 border border-white-800/80 overflow-hidden bg-main transition-all duration-500 flex flex-col h-full shadow-md/30 cursor-pointer"
                >
                  <Link to={`/article/${relArticle._id || relArticle.id}`} className="flex flex-col h-full">
                    <div className="h-48 w-full relative overflow-hidden">
                      <img
                        src={relArticle.imageUrl}
                        alt={relArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-[var(--color-primary)] text-xs font-semibold mb-2 uppercase">{relArticle.category}</span>
                      <h3 className="
  text-xl
  font-bold
  text-[var(--color-primary)]
  mb-3
  line-clamp-2
  leading-snug
  min-h-[56px]
">{relArticle.title}</h3>
                      <p className=" paragraph
  
  mb-6
  flex-grow
  line-clamp-3
  leading-relaxed
  min-h-[72px]
">{relArticle.description}</p>
                      {/* Footer with Slide-arrow Button */}
                                              <div className="border-t border-slate-800/60 pt-5 mt-auto flex items-center justify-between">
                                                <Link
                                                  to={`/article/${relArticle._id || relArticle.id}`}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                  }}
                                                  className="inline-flex items-center gap-2 text-sm font-semibold a  group/btn transition-colors"
                                                >
                                                  Read Article
                                                  <svg
                                                    className="w-4 h-4 transform group-hover/btn:translate-x-1.5 transition-transform duration-300"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2.5}
                                                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                    />
                                                  </svg>
                                                </Link>
                                              </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.div>
          

        </div>
      </section>
    </div>
  );
};

export default Article;