import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, Typography, Button, Box } from '@mui/material';

// Import API services
import { getArticlesAPI, subscribeEmailAPI } from '../services/allApi';
import { toast } from 'sonner';



// Mock data array for public articles
export const articlesData = [
  {
    id: 1,
    category: 'Development',
    title: 'Microservices vs Monolith: A Definitive Guide',
    description: 'Evaluate the architectural trade-offs between monolithic structures and microservices to determine the optimal approach for scaling your enterprise application.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB2MTG_TivWKGHqjJtewmcLq0ZN1jxanA8IjEKG5sLP0nw7NwcwSI7GdSvZSK-WqLUs4Mn-CeuBn1rG0INx6b_1NMyNtjlbIqQfpGRTtLV04KY9KU1hb1T4hJ4uxi1DR_6ZmAXs5x7dqB5Gt8uNZPj81v0ot0i84adLzGbaYp8FelA67a3Cqe-Y8BQ3P-cJQn25ahNuoWrR1iiiXU5AP49gaG-BlQYmBAovOgSO333k_FSIzJKvzwLZLWTCCEa1EXW4fejQm5MlA',
    link: '#'
  },
  {
    id: 2,
    category: 'UI/UX',
    title: 'Designing for Power Users in B2B Platforms',
    description: 'Strategies for balancing complex functionality with intuitive navigation to satisfy demanding enterprise users without overwhelming novices.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABD2SUuuJhfKj5hn8i2_QkUHVmCj4G7whXQZQ6xrJxQx18y3jUqOn8phFcqafMS4BDbribwYwcBEG8Fc-dDk8XO5_1F_oeZtLfyZOFD-FLm6pfU8_J9nHdmuOytE8jLNEu1zcaz275dVB6FWMhZ5DRxfH-uAz3opkgpzFnuLmPrKJac_rjHPsSy6X55NMcvH3rrQPblF-5ZuyEQsZEISNfPSRw3zUfOYopJ_Ki6fL5xefi_VufNgrn4jPJgfrQs3anFxs8ShVBEA',
    link: '#'
  },
  {
    id: 3,
    category: 'Business',
    title: 'Optimizing SaaS Pricing Models for Scale',
    description: 'An analytical deep dive into tiered vs. usage-based pricing models and how to structure your tiers to maximize ARR and minimize churn.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYIBAQrXboKyuhQkBSYlEmrsc3OU0fe9wTG2QAvuLrAnyiV1949fPemFOiY9VWNjXTPf06t3DG81A8SwOC0ahNDGDZuZzR3YG0yzTlVfQMkfa_aL3gbgXaMPgrSyxzi87RODe9x0GEz6tRdsiJlUxqNkf2Yk55b2DMYz3mOKdZKrjopxtSjQiwAH75KLY1y8ViEKXb-dZfAn3heUYPAxF9cEnoOe74l5XYU_P60N8HgHkRoLS7bdc-3k3i-jHbMUu41jSbeHYiFA',
    link: '#'
  },
  {
    id: 4,
    category: 'Technology',
    title: 'Zero Trust Security in Cloud Infrastructures',
    description: 'Implementing robust security protocols and identity management systems in distributed cloud environments to protect sensitive enterprise data.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBGSK4t5_4GBq09C97cC1GFK5U4qIXNrjq8phEFeAeYQo3Asry8nElF5llwC2T4tRJ_3uitd6nYxSEqZnyyz4bhzR6FTkcI-hQES3OlkERNPUDzthHRkBW8YDg91IBFqdyC5i8QdCZeMQ3adtITsD8XkL1SIMzmbkjYn0NuV1OgC3pnvT9-DyTZewDTGkL0gJr_ELTyEXPk-sgoenZKa2k2sTiQk-PiM-ec-FZ9GdlFmQnuxjhsRWJWkFGwxNOECfRJSCcjVPYoA',
    link: '#'
  }
];

const categories = ['All', 'Technology', 'Development', 'UI/UX', 'Business', 'SaaS'];

const fadeUpVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } }
};

const Insight = () => {
  const navigate = useNavigate();
  const articlesRef = useRef(null);
  // Merged array of default and custom admin articles
  const [articles, setArticles] = useState([]);

  // Filters and pagination states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6; // Show 6 articles per page in a responsive 3-column grid

  // Newsletter states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setSubmittingNewsletter(true);
    try {
      const response = await subscribeEmailAPI({ email: newsletterEmail });
      if (response.status === 201 || response.status === 200) {
        if (response.data?.success) {
          setShowSuccessPopup(true);
          setNewsletterEmail('');
        } else {
          toast.error(response.data?.message || "Failed to subscribe.");
        }
      } else {
        toast.error(response.data?.message || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setSubmittingNewsletter(false);
    }
  };


  // Load articles from MongoDB backend database and combine them with static default articles
  useEffect(() => {
    const loadArticlesData = async () => {
      const defaultList = [...articlesData];
      try {
        const response = await getArticlesAPI();
        if (response.status === 200 && response.data?.success) {
          const dbArticles = response.data.data;
          // Combine dynamic articles at the top, static articles below
          setArticles([...dbArticles, ...defaultList]);
        } else {
          setArticles(defaultList);
        }
      } catch (error) {
        console.error("Failed to load articles from backend database:", error);
        setArticles(defaultList);
      }
    };

    loadArticlesData();
  }, []);
  useEffect(() => {
    if (currentPage > 1) {
      articlesRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  // Reset pagination to page 1 whenever category is switched
  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
  };


  // Filter articles by category
  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  // Slice list of articles for current page display
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Identify featured article (fallback to first article in list if not found)
  const featuredArticle = articles.length > 0 ? (articles.find(a => a.id === 1) || articles[0]) : null;

  return (
    <div className="bg-sub min-h-screen font-sans">
      <motion.section
        id="hero-section"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="w-full h-[500px] bg-primary py-20 md:py-28"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div variants={containerVariants} className="mx-auto text-center max-w-7xl" style={{filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.6))"}}>
            <motion.div variants={cardVariants}>
              <h1 className="main-heading text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
                Precision Strategy for the Modern Enterprise.
              </h1>
            </motion.div>
            <motion.div variants={cardVariants} style={{filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.6))"}}>
              <p className="paragraph max-w-2xl mx-auto leading-relaxed text-white">
                We bridge the gap between visionary thinking and operational excellence. Discover the story, people, and values that drive our relentless pursuit of impact.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="bg-sub max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 space-y-24">

        {/* Section 2: Featured Article */}
        {featuredArticle && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariants}
            className="bg-main grid grid-cols-1 lg:grid-cols-2 gap-12 items-center  rounded-xl overflow-hidden "
          >
            <div className="p-10 flex flex-col justify-center h-full order-2 lg:order-1">
              <span className="pre-heading inline-block px-3 py-1 bg-[#1F2937] text-gray-300 text-xs  uppercase tracking-wider rounded-md mb-6 w-max">
                Featured
              </span>
              <h2 className="sub-heading   mb-4">{featuredArticle.title}</h2>
              <p className="paragraph  mb-6 line-clamp-3">
                {featuredArticle.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-gray-500 text-sm">
                  {featuredArticle.createdAt ? new Date(featuredArticle.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "October 24, 2024"}
                </span>
                <Link
                  to={`/article/${featuredArticle._id || featuredArticle.id}`}
                  className="text-blue-500 font-medium flex items-center hover:text-black transition-colors group cursor-pointer"
                >
                  Read Article
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>

              </div>
            </div>
          <div className="
relative
h-64
lg:h-full
min-h-[400px]
overflow-hidden
rounded-r-xl
order-1 lg:order-2
">
                     <img
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600";
                }}
              />
             <div
  className="
  absolute inset-y-0 left-0
  w-40
  bg-gradient-to-r
  from-[var(--color-main-bg)]
  via-[var(--color-main-bg)]/70
  to-transparent
  z-10
"
/>
        
            </div>
          </motion.section>
        )}

        {/* Section 3: All Articles */}
        <motion.section
          ref={articlesRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUpVariants}
          className="bg-sub rounded-2xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <h2 className="sub-heading ">All Articles</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${selectedCategory === cat
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'bg-[#1F2937] text-gray-400 border border-transparent hover:text-white hover:bg-[#374151]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {currentArticles.length === 0 ? (
            <div className="text-gray-500 py-12 text-center">No articles found in this category.</div>
          ) : (
            <div className="space-y-12">
              <motion.div
                layout
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode='popLayout'>
                  {currentArticles.map((article) => (
                    <motion.article
                      layout
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ y: -15, scale: 1.03 }}
                      key={article._id || article.id}
                      className="card relative  overflow-hidden group  transition-shadow duration-300 ease-out hover:border-blue-500/40 hover:shadow-[0_20px_50px_rgba(37,99,235,0.18)] flex flex-col h-full cursor-pointer"
                      onClick={() => navigate(`/article/${article._id || article.id}`)}
                    >
                      {/* Top gradient line */}
                      <div className=" absolute top-0 left-0 w-full h-[2px]  from-blue-600 to-transparent z-10"></div>

                      {/* Glow effect */}
                      <div className="absolute -top-[70px] -right-[70px] w-[180px] h-[180px] pointer-events-none z-10"></div>

                      <div className="h-48 w-full relative overflow-hidden z-20">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=400";
                          }}
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow relative z-20  from-[#081224]/50 to-[#0f172a]/50">
                        <span className="text-blue-500 text-xs font-semibold mb-2 uppercase">{article.category}</span>
                        <h3
                          className="
  text-xl
  font-bold
  text-[#4764FF]
  mb-3
  line-clamp-2
  leading-snug
  min-h-[56px]
"
                        >
                          {article.title}
                        </h3>
                        <p
                          className=" paragraph
  
  mb-6
  flex-grow
  line-clamp-3
  leading-relaxed
  min-h-[72px]
"
                        >
                          {article.description}
                        </p>

                        <Link
                          to={`/article/${article._id || article.id}`}
                          onClick={(e) => {
                            // Prevent card click navigation from colliding
                            e.stopPropagation();
                          }}
                          className="text-blue-500 font-medium flex items-center hover:text-[#454545] transition-colors w-max group"
                        >
                          Read Article <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      </div>
                    </motion.article>

                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Responsive Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() =>
                      setCurrentPage(prev =>
                        Math.max(prev - 1, 1)
                      )}
                    disabled={currentPage === 1}
                    className="
w-10 h-10
flex items-center justify-center
rounded-full
bg-primary
text-white
disabled:opacity-40
hover:bg-blue-700
transition"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setCurrentPage(i + 1)
                      }
                      className={`
w-10
h-10
rounded-full
font-bold
transition

${currentPage === i + 1
                          ? "text-primary font-bold bg-transparent"
                          : "text-black font-bold bg-transparent hover:text-primary"
                        }
`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage(prev =>
                        Math.min(prev + 1, totalPages)
                      )}
                    disabled={currentPage === totalPages}
                    className="
w-10 h-10
flex items-center justify-center
rounded-full
bg-primary
text-white
disabled:opacity-40
hover:bg-blue-700
transition"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.section>

        {/* Section 4: Newsletter Banner */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariants}
          className="bg-main rounded-[--radius-sm] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-xl">
            <h3 className="text-2xl sub-heading mb-2">Stay Updated With Our Latest Insights</h3>
            <p className="paragraph">Get weekly deep-dives and strategic guides delivered straight to your inbox. No spam, just high-value signal.</p>
          </div>
          <form onSubmit={handleNewsletterSubscribe} className="flex w-full lg:w-auto gap-3">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your work email"
              className=" bg-[var(--color-sub-bg)] border border-[#4b5563] text-white placeholder-gray-500 rounded-[var(--radius-sm)] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72"
            />
            <button
              type="submit"
              disabled={submittingNewsletter}
              className="btn disabled:bg-blue-500/50 px-6 py-2 whitespace-nowrap transition-colors cursor-pointer"
            >
              {submittingNewsletter ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </motion.section>

      </div>

      <Dialog
        open={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        sx={{
          "& .MuiDialog-paper": {
            background: 'rgba(0, 0, 0, 0.9) !important',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            color: '#ffffff !important',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
            maxWidth: '500px',
            textAlign: 'center',
            p: 3,
          }
        }}
      >
        <DialogContent sx={{ overflow: 'hidden' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <Typography variant="h3" sx={{ mb: 2 }}>🎉</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#ffffff' }}>
              Subscription Confirmed!
            </Typography>
            <Typography sx={{ color: '#ffffff', lineHeight: 1.6, mb: 4, opacity: 0.9 }}>
              You are officially on the list. Get ready for weekly deep-dives and high-value signals delivered straight to your inbox.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setShowSuccessPopup(false)}
              sx={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                borderRadius: '12px',
                px: 5,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Awesome!
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Insight;
