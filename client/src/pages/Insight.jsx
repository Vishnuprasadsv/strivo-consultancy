import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data array for future Admin Panel integration
const articlesData = [
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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Insight = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles = selectedCategory === 'All' 
    ? articlesData 
    : articlesData.filter(article => article.category === selectedCategory);

  return (
    <div className="bg-black text-white min-h-screen pt-12 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">
        
        {/* Section 1: Hero */}
        <motion.section 
          initial="hidden" 
          animate="visible" 
          variants={fadeUpVariants}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">Insights & Resources</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Explore our curated collection of industry trends, strategic guides, and technical deep-dives to help you navigate the future of digital transformation and enterprise growth.
          </p>
        </motion.section>

        {/* Section 2: Featured Article */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#111827] rounded-xl overflow-hidden border border-[#374151]"
        >
          <div className="p-10 flex flex-col justify-center h-full order-2 lg:order-1">
            <span className="inline-block px-3 py-1 bg-[#1F2937] text-gray-300 text-xs font-semibold uppercase tracking-wider rounded-md mb-6 w-max">Enterprise</span>
            <h2 className="text-3xl font-bold text-white mb-4">The Future of AI in Modern SaaS</h2>
            <p className="text-gray-400 mb-6 line-clamp-3">
              Discover how artificial intelligence is reshaping software architectures, streamlining operations, and delivering unprecedented value to enterprise customers in an increasingly competitive landscape.
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-gray-500 text-sm">October 24, 2024</span>
              <a href="#" className="text-blue-500 font-medium flex items-center hover:text-white transition-colors group">
                Read Article 
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
          <div className="h-64 lg:h-full min-h-[400px] relative w-full overflow-hidden order-1 lg:order-2">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuANWAps8vBZB82FD4rVrqFXvPYuTs5kabUG-ZcSxBkBrtz2RC4XmIsXW7bABn09gTzqBcZvk89HKeozQxVTOz_Vsi64Va_KGERkQhznQ97yaQ4T8UujKlsIiNWLOAsCiy_obNm4_cp8mf8qY2QMKkdkKP1-xISKVw1X1w-L8Zdgb8tWlrWEaqBREALVvMc19RT47gZY10PHwnV3icrPyIRDmeWnr7WJ4z7ufaUOwqKTe3EZCWHW5cF0Ugk2puAfkkcaiLbhFyjW9w" 
              alt="AI Visualization" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827] to-transparent lg:w-1/4"></div>
          </div>
        </motion.section>

        {/* Section 3: All Articles */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUpVariants}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <h2 className="text-2xl font-bold text-white">All Articles</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white border border-blue-600' 
                      : 'bg-[#1F2937] text-gray-400 border border-transparent hover:text-white hover:bg-[#374151]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-gray-500 py-12 text-center">No articles found in this category.</div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode='popLayout'>
                {filteredArticles.map((article) => (
                  <motion.article 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={article.id}
                    className="bg-[#111827] border border-[#374151] rounded-lg overflow-hidden group hover:border-[#4b5563] transition-colors flex flex-col h-full cursor-pointer"
                  >
                    <div className="h-48 w-full relative overflow-hidden">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-blue-500 text-xs font-semibold mb-2 uppercase">{article.category}</span>
                      <h3 className="text-xl font-bold text-white mb-3">{article.title}</h3>
                      <p className="text-gray-400 mb-6 flex-grow">{article.description}</p>
                      <a href={article.link} className="text-blue-500 font-medium flex items-center hover:text-white transition-colors w-max group">
                        Read Article <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.section>

        {/* Section 4: Newsletter Banner */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariants}
          className="bg-[#1F2937] rounded-xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 border border-[#374151]"
        >
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-white mb-2">Stay Updated With Our Latest Insights</h3>
            <p className="text-gray-400">Get weekly deep-dives and strategic guides delivered straight to your inbox. No spam, just high-value signal.</p>
          </div>
          <form className="flex w-full lg:w-auto gap-3">
            <input 
              type="email" 
              placeholder="Enter your work email" 
              className="bg-[#374151] border border-[#4b5563] text-white placeholder-white/60 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72"
            />
            <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer">
              Subscribe
            </button>
          </form>
        </motion.section>

      </div>
    </div>
  );
};

export default Insight;
