import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

// Icons
import { FiPlus, FiBarChart2, FiTrash2, FiEdit2, FiSearch, FiFilter, FiRefreshCw, FiEye, FiDownload } from 'react-icons/fi';

// API Services
import {
  getArticlesAPI,
  deleteArticleAPI,
  getSubscribersAPI,
  deleteSubscriberAPI
} from '../services/allApi';


const ArticlesAdmin = () => {
  const navigate = useNavigate();

  // State Management
  const [articlesList, setArticlesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subscribersList, setSubscribersList] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' or 'subscribers'

  // Search & Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;
  const [subscribersCurrentPage, setSubscribersCurrentPage] = useState(1);
  const subscribersPerPage = 5;

  // Modal Controls
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'article' or 'subscriber'
  const [targetId, setTargetId] = useState(null);
  const [selectedArticleForView, setSelectedArticleForView] = useState(null);

  // Fetch articles from backend
  const loadArticles = async () => {
    setLoading(true);
    try {
      const response = await getArticlesAPI();
      if (response.status === 200 && response.data?.success) {
        setArticlesList(response.data.data);
      } else {
        toast.error("Failed to load articles from database.");
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      toast.error("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscribers from backend
  const loadSubscribers = async () => {
    setSubscribersLoading(true);
    try {
      const response = await getSubscribersAPI();
      if (response.status === 200 && response.data?.success) {
        setSubscribersList(response.data.data);
      } else {
        toast.error("Failed to load subscribers list.");
      }
    } catch (error) {
      console.error("Error loading subscribers:", error);
      toast.error("Failed to load subscribers.");
    } finally {
      setSubscribersLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
    loadSubscribers();
  }, []);

  // Trigger Delete Confirmation Modal
  const handleDeleteSubscriber = (subId) => {
    setConfirmType('subscriber');
    setTargetId(subId);
    setShowConfirm(true);
  };

  const handleDeleteArticle = (articleId) => {
    setConfirmType('article');
    setTargetId(articleId);
    setShowConfirm(true);
  };

  // Confirm and execute backend delete
  const executeDelete = async () => {
    const id = targetId;
    const type = confirmType;
    setShowConfirm(false);
    setTargetId(null);
    setConfirmType(null);

    if (type === 'subscriber') {
      try {
        const response = await deleteSubscriberAPI(id);
        if (response.status === 200 && response.data?.success) {
          toast.success("Subscriber removed successfully.");
          loadSubscribers();
        } else {
          toast.error(response.data?.message || "Failed to remove subscriber.");
        }
      } catch (error) {
        console.error("Error removing subscriber:", error);
        toast.error("An error occurred while removing the subscriber.");
      }
    } else if (type === 'article') {
      try {
        const response = await deleteArticleAPI(id);
        if (response.status === 200 && response.data?.success) {
          toast.success("Article deleted successfully.");
          loadArticles();
        } else {
          toast.error(response.data?.message || "Failed to delete article.");
        }
      } catch (error) {
        console.error("Error deleting article:", error);
        toast.error("An error occurred while deleting the article.");
      }
    }
  };

  // Search and Filter Articles
  const filteredArticles = articlesList
    .filter(art => {
      const matchesSearch = searchQuery ? art.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      const matchesCategory = selectedCategory && selectedCategory !== 'All' ? art.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });

  // Sort: Newly added articles first (newest by createdAt or publicationDate first)
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const dateA = a.publicationDate ? new Date(a.publicationDate) : new Date(a.createdAt);
    const dateB = b.publicationDate ? new Date(b.publicationDate) : new Date(b.createdAt);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage) || 1;
  const paginatedArticles = sortedArticles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage);

  const handleViewArticle = (art) => {
    setSelectedArticleForView(art);
  };

  // Sort Subscribers: Newest first (newest by createdAt first)
  const sortedSubscribers = [...subscribersList].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalSubscriberPages = Math.ceil(sortedSubscribers.length / subscribersPerPage) || 1;
  const paginatedSubscribers = sortedSubscribers.slice(
    (subscribersCurrentPage - 1) * subscribersPerPage,
    subscribersCurrentPage * subscribersPerPage
  );

  const handleDownloadSubscribers = () => {
    if (subscribersList.length === 0) {
      toast.error("No subscribers to download.");
      return;
    }
    // Generate CSV content
    const headers = ["Email Address", "Subscribed On"];
    const rows = subscribersList.map(sub => [
      sub.email,
      new Date(sub.createdAt).toLocaleString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Subscribers list downloaded successfully");
  };

  // Real-time Analytics metrics
  const totalArticles = articlesList.length;
  const publishedArticles = articlesList.filter(a => a.status === 'Published' || !a.status).length;
  const draftArticles = articlesList.filter(a => a.status === 'Draft').length;
  const totalSubscribers = subscribersList.length;

  const stats = [
    {
      title: "Total Articles",
      value: totalArticles,
      subtitle: "All database entries"
    },
    {
      title: "Published Articles",
      value: publishedArticles,
      subtitle: "Visible on public site"
    },
    {
      title: "Draft Articles",
      value: draftArticles,
      subtitle: "Saved drafts / unpublished"
    },
    {
      title: "Subscribers",
      value: totalSubscribers,
      subtitle: "Mailing list members"
    }
  ];

  return (
    <div className="min-h-screen bg-sub flex flex-col" style={{ fontFamily: 'var(--font-primary)' }}>
      
      {/* Top Header Section with flat white background spanning full-width */}
      <div className="bg-white pt-24 pb-0 border-b border-[var(--color-border)] px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-6 mt-4">
            <div className="text-left">
              <h1 className="text-2xl font-[var(--font-bold)] text-primary leading-none uppercase" style={{ margin: 0 }}>
                ARTICLES & INSIGHTS
              </h1>
              <p className="text-xs text-[var(--color-black)] font-medium opacity-85 mt-2" style={{ margin: '6px 0 0 0', lineHeight: 1.3 }}>
                Create, edit, and manage articles that display on the public website Insights page.
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Analytics button */}
              <button
                onClick={() => setShowAnalyticsModal(true)}
                className="bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:text-white hover:bg-[var(--color-primary)] px-2.5 py-1.5 rounded-[var(--radius-sm)] flex items-center justify-center gap-2 transition cursor-pointer h-8 text-xs font-normal w-full sm:w-auto"
              >
                <FiBarChart2 size={13} />
                Analytics
              </button>
              
              {/* New Article button */}
              <button
                onClick={() => navigate('/admin/create-article')}
                className="btn px-2.5 py-1.5 flex items-center justify-center gap-2 cursor-pointer border-none h-8 text-xs font-normal w-full sm:w-auto"
                style={{ fontWeight: 'normal' }}
              >
                <FiPlus size={13} />
                New Article
              </button>
            </div>
          </div>

          {/* Tab Navigation Sitting inside white section bar */}
          <div className="flex gap-6 border-b border-transparent pb-0">
            <button
              onClick={() => setActiveTab('articles')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-300 cursor-pointer ${
                activeTab === 'articles' 
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]' 
                  : 'border-transparent text-[var(--color-black)] opacity-65 hover:opacity-100'
              }`}
            >
              Articles ({articlesList.length})
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-300 cursor-pointer ${
                activeTab === 'subscribers' 
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]' 
                  : 'border-transparent text-[var(--color-black)] opacity-65 hover:opacity-100'
              }`}
            >
              Newsletter Subscribers ({subscribersList.length})
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Section - Rendered over grey backdrop bg-sub */}
      <div className="flex-grow py-8 px-8 md:px-16 lg:px-24">
        <div className={activeTab === 'articles' ? "max-w-6xl mx-auto" : "max-w-3xl mx-auto"}>
          {activeTab === 'articles' ? (
            /* List of Articles Table */
            <div className="card bg-white p-6 shadow-card relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-2 border-b border-[var(--color-border)]/50">
                <h2 className="text-left font-bold text-[var(--color-black)]" style={{ fontSize: 'var(--text-paragraph)', margin: 0 }}>
                  Current Articles
                </h2>

                {/* Search, Filter, Refresh Toolbar */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Search Input & Button */}
                  <div className="flex items-center gap-2">
                    {isSearchOpen && (
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search Articles..."
                        className="border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2.5 py-1 text-xs outline-none bg-[var(--color-sub-bg)] focus:bg-white text-[var(--color-black)] w-36 sm:w-48 transition-all duration-300 font-medium"
                      />
                    )}
                    <button
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                        isSearchOpen 
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' 
                          : 'border-[var(--color-border)] bg-white text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)]'
                      }`}
                      title="Search Articles"
                    >
                      <FiSearch size={13} />
                    </button>
                  </div>

                  {/* Category Dropdown & Button */}
                  <div className="flex items-center gap-2">
                    {isCategoryOpen && (
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-1 text-xs outline-none bg-white text-[var(--color-black)] transition-all duration-300 font-semibold cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Technology">Technology</option>
                        <option value="Retail">Retail</option>
                      </select>
                    )}
                    <button
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                        isCategoryOpen 
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' 
                          : 'border-[var(--color-border)] bg-white text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)]'
                      }`}
                      title="Filter by Category"
                    >
                      <FiFilter size={13} />
                    </button>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={() => {
                      loadArticles();
                      toast.success("Articles list reloaded");
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--color-border)] bg-white text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition-all cursor-pointer"
                    title="Refresh List"
                  >
                    <FiRefreshCw size={13} />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : articlesList.length === 0 ? (
                <div className="py-12 text-center text-[var(--color-paragraph)] opacity-50 border border-[var(--color-border)] bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]">
                  No articles added yet. Click "New Article" to write your first post!
                </div>
              ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] text-[var(--color-black)] text-xs font-bold uppercase tracking-wider">
                          <th className="pb-4 pl-8 pr-6 font-bold">Cover</th>
                          <th className="pb-4 px-6 font-bold">Title</th>
                          <th className="pb-4 px-6 font-bold">Category</th>
                          <th className="pb-4 px-6 font-bold">Publishing Date</th>
                          <th className="pb-4 px-6 font-bold">Status</th>
                          <th className="pb-4 pl-6 pr-8 text-right font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)] text-sm">
                        {paginatedArticles.map((art) => (
                          <tr key={art._id} className="hover:bg-[var(--color-sub-bg)]/40 transition-colors">
                            <td className="py-5 pl-8 pr-6">
                              <img
                                src={art.imageUrl}
                                alt="Cover"
                                className="w-12 h-12 object-cover border border-[var(--color-border)]"
                                style={{ borderRadius: 'var(--radius-sm)' }}
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=200";
                                }}
                              />
                            </td>
                            
                            <td className="py-5 px-6 font-semibold text-[var(--color-black)] truncate text-left" title={art.title}>
                              {(() => {
                                const words = art.title.trim().split(/\s+/);
                                return words.length <= 2 ? art.title : `${words[0]} ${words[1]}...`;
                              })()}
                            </td>
                            
                            <td className="py-5 px-6 text-left text-xs text-[var(--color-paragraph)] font-semibold uppercase tracking-wider">
                              {art.category}
                            </td>

                            <td className="py-5 px-6 text-left text-xs text-[var(--color-paragraph)]">
                              {art.publicationDate 
                                ? new Date(art.publicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : new Date(art.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              }
                            </td>

                            <td className="py-5 px-6 text-left text-xs font-semibold text-[var(--color-paragraph)] uppercase tracking-wider">
                              {art.status || "Published"}
                            </td>
                            
                            <td className="py-5 pl-6 pr-8 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleViewArticle(art)}
                                  className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-70 hover:opacity-100"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="View Article"
                                >
                                  <FiEye size={13} />
                                </button>
                                <button
                                  onClick={() => navigate(`/admin/edit-article/${art._id}`)}
                                  className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-70 hover:opacity-100"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="Edit Article"
                                >
                                  <FiEdit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteArticle(art._id)}
                                  className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                  title="Delete Article"
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="block md:hidden space-y-4">
                    {paginatedArticles.map((art) => (
                      <div key={art._id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-[var(--color-sub-bg)]/20 hover:bg-[var(--color-sub-bg)]/40 transition-colors flex flex-col gap-3">
                        <div className="flex gap-3">
                          <img
                            src={art.imageUrl}
                            alt="Cover"
                            className="w-14 h-14 object-cover border border-[var(--color-border)] rounded-[var(--radius-sm)] shrink-0"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=200";
                            }}
                          />
                          <div className="flex-1 min-w-0 text-left">
                            <span className="block text-[10px] font-semibold text-[var(--color-paragraph)] uppercase tracking-wider mb-1">
                              {art.category}
                            </span>
                            
                            <h3 className="text-sm font-semibold text-[var(--color-black)] leading-snug truncate" title={art.title}>
                              {(() => {
                                const words = art.title.trim().split(/\s+/);
                                return words.length <= 2 ? art.title : `${words[0]} ${words[1]}...`;
                              })()}
                            </h3>

                            <p className="text-[10px] text-[var(--color-paragraph)] mt-1">
                              Published: {art.publicationDate 
                                ? new Date(art.publicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : new Date(art.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              }
                            </p>
                            
                            <p className="text-[10px] font-semibold text-[var(--color-paragraph)] uppercase mt-0.5">
                              Status: {art.status || "Published"}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]/50">
                          <button
                            onClick={() => handleViewArticle(art)}
                            className="px-3 py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-80 hover:opacity-100 text-xs font-semibold"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                          >
                            <FiEye size={12} /> View
                          </button>
                          <button
                            onClick={() => navigate(`/admin/edit-article/${art._id}`)}
                            className="px-3 py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-80 hover:opacity-100 text-xs font-semibold"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                          >
                            <FiEdit2 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art._id)}
                            className="px-3 py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                          >
                            <FiTrash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Articles Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--color-border)]">
                      <p className="text-[var(--color-paragraph)] opacity-50 text-xs">
                        Showing <span className="text-[var(--color-black)] font-semibold">{paginatedArticles.length}</span> of {sortedArticles.length} articles
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className="px-3 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs rounded-[var(--radius-sm)] transition disabled:opacity-30 disabled:hover:bg-[var(--color-primary)] cursor-pointer disabled:cursor-not-allowed font-semibold h-8 flex items-center justify-center"
                        >
                          &lt;
                        </button>
                        <span className="text-xs text-[var(--color-paragraph)] opacity-70 font-semibold">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className="px-3 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs rounded-[var(--radius-sm)] transition disabled:opacity-30 disabled:hover:bg-[var(--color-primary)] cursor-pointer disabled:cursor-not-allowed font-semibold h-8 flex items-center justify-center"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
             /* List of Subscribers Table */
             <div className="card bg-white p-6 shadow-card relative overflow-hidden">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]/50 mb-5">
                <h2 className="text-left font-bold text-[var(--color-black)]" style={{ fontSize: 'var(--text-paragraph)', margin: 0 }}>
                  Active Subscribers
                </h2>
                <button
                  onClick={handleDownloadSubscribers}
                  className="px-3 py-1.5 rounded-[var(--radius-sm)] flex items-center gap-1.5 border border-[var(--color-border)] bg-white text-[var(--color-paragraph)] hover:bg-[var(--color-primary)] hover:text-white transition-all cursor-pointer text-xs font-semibold shrink-0 shadow-sm"
                  title="Download Subscribers CSV"
                >
                  <FiDownload size={14} />
                  <span>Download CSV</span>
                </button>
              </div>

              {subscribersLoading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : subscribersList.length === 0 ? (
                <div className="py-12 text-center text-[var(--color-paragraph)] opacity-50 border border-[var(--color-border)] bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]">
                  No active newsletter subscribers registered yet.
                </div>
              ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] text-[var(--color-black)] text-xs font-bold uppercase tracking-wider">
                          <th className="pb-2 pl-8 pr-6 w-[50%]">Email Address</th>
                          <th className="pb-2 px-6 w-[35%]">Subscribed On</th>
                          <th className="pb-2 pl-6 pr-8 text-right w-[15%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)] text-sm">
                        {paginatedSubscribers.map((sub) => (
                          <tr key={sub._id} className="hover:bg-[var(--color-sub-bg)]/40 transition-colors">
                            <td className="py-1.5 pl-8 pr-6 font-medium text-[var(--color-black)] text-left break-all w-[50%]">
                              {sub.email}
                            </td>
                            <td className="py-1.5 px-6 text-[var(--color-paragraph)] opacity-70 text-left w-[35%]">
                              {new Date(sub.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-1.5 pl-6 pr-8 text-right w-[15%]">
                              <button
                                onClick={() => handleDeleteSubscriber(sub._id)}
                                className="w-7 h-7 inline-flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
                                style={{ borderRadius: 'var(--radius-sm)' }}
                                title="Remove Subscriber"
                              >
                                <FiTrash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="block md:hidden space-y-4">
                    {paginatedSubscribers.map((sub) => (
                      <div key={sub._id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-[var(--color-sub-bg)]/20 hover:bg-[var(--color-sub-bg)]/40 transition-colors flex flex-col gap-3">
                        <div className="text-left">
                          <p className="text-sm font-semibold text-[var(--color-black)] break-all">
                            {sub.email}
                          </p>
                          <p className="text-xs text-[var(--color-paragraph)] opacity-50 mt-1">
                            Subscribed: {new Date(sub.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-[var(--color-border)]/50">
                          <button
                            onClick={() => handleDeleteSubscriber(sub._id)}
                            className="px-3 py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                          >
                            <FiTrash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subscribers Pagination */}
                  {totalSubscriberPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--color-border)]">
                      <p className="text-[var(--color-paragraph)] opacity-50 text-xs">
                        Showing <span className="text-[var(--color-black)] font-semibold">{paginatedSubscribers.length}</span> of {sortedSubscribers.length} subscribers
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          disabled={subscribersCurrentPage === 1}
                          onClick={() => setSubscribersCurrentPage(p => Math.max(1, p - 1))}
                          className="px-3 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs rounded-[var(--radius-sm)] transition disabled:opacity-30 disabled:hover:bg-[var(--color-primary)] cursor-pointer disabled:cursor-not-allowed font-semibold h-8 flex items-center justify-center"
                        >
                          &lt;
                        </button>
                        <span className="text-xs text-[var(--color-paragraph)] opacity-70 font-semibold">
                          Page {subscribersCurrentPage} of {totalSubscriberPages}
                        </span>
                        <button
                          disabled={subscribersCurrentPage === totalSubscriberPages}
                          onClick={() => setSubscribersCurrentPage(p => Math.min(totalSubscriberPages, p + 1))}
                          className="px-3 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs rounded-[var(--radius-sm)] transition disabled:opacity-30 disabled:hover:bg-[var(--color-primary)] cursor-pointer disabled:cursor-not-allowed font-semibold h-8 flex items-center justify-center"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-[var(--radius-sm)] shadow-xl max-w-sm w-full mx-4 border border-[var(--color-border)] text-left">
            <h3 className="text-[var(--color-primary)] font-bold text-lg mb-2">
              {confirmType === 'subscriber' ? 'Remove Subscriber' : 'Delete Article'}
            </h3>
            <p className="text-[var(--color-paragraph)] text-sm mb-5">
              {confirmType === 'subscriber' 
                ? 'Are you sure you want to remove this subscriber from the mailing list?' 
                : 'Are you sure you want to delete this article? This action cannot be undone.'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setTargetId(null);
                  setConfirmType(null);
                }}
                className="border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center"
                style={{ height: '34px', padding: '0 16px' }}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center"
                style={{ height: '34px', padding: '0 16px' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Analytics Modal */}
      {showAnalyticsModal &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl border border-[var(--color-border)] bg-[var(--color-main-bg)] shadow-xl overflow-hidden" style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-primary)' }}>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 bg-white">
                <div>
                  <h2 className="text-lg font-bold text-primary" style={{ margin: 0 }}>
                    ARTICLES ANALYTICS
                  </h2>
                  <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-1">
                    Real-time stats overview of all articles and newsletter subscribers
                  </p>
                </div>
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="w-8 h-8 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-[var(--color-paragraph)] opacity-60 hover:opacity-100 cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 bg-[var(--color-sub-bg)]/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((item) => (
                    <div
                      key={item.title}
                      className="card bg-white p-5 flex flex-col justify-between items-center text-center shadow-sm border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                    >
                      <h3 className="card-title-custom text-xs" style={{ margin: 0 }}>{item.title}</h3>
                      <p className="stats-number text-2xl font-bold text-black" style={{ margin: '8px 0 8px 0', lineHeight: 1.1 }}>{item.value}</p>
                      <p className="text-black opacity-60 text-[10px] font-semibold" style={{ margin: 0 }}>{item.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t border-[var(--color-border)] px-6 py-4 bg-white">
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="px-5 py-2 border border-[var(--color-border)] text-sm text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition font-semibold cursor-pointer rounded-[var(--radius-sm)] h-10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      }

      {/* View/Read Article Modal */}
      {selectedArticleForView &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl border border-[var(--color-border)] bg-[var(--color-main-bg)] shadow-xl overflow-hidden flex flex-col max-h-[85vh]" style={{ borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-primary)' }}>
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 bg-white">
                <div className="min-w-0 flex-1 pr-4">
                  <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    {selectedArticleForView.category}
                  </span>
                  <h2 className="text-md font-bold text-primary truncate block mt-0.5" style={{ margin: 0 }}>
                    {selectedArticleForView.title}
                  </h2>
                  <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 mt-1">
                    Published: {selectedArticleForView.publicationDate 
                      ? new Date(selectedArticleForView.publicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : new Date(selectedArticleForView.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    } | Status: <span className="font-semibold">{selectedArticleForView.status || "Published"}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedArticleForView(null)}
                  className="w-8 h-8 rounded-full bg-[var(--color-sub-bg)] hover:bg-red-500/20 hover:text-red-600 transition flex items-center justify-center text-paragraph opacity-60 hover:opacity-100 cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Content Area */}
              <div className="p-6 overflow-y-auto space-y-4 text-left flex-1 bg-white">
                {selectedArticleForView.imageUrl && (
                  <img
                    src={selectedArticleForView.imageUrl}
                    alt={selectedArticleForView.title}
                    className="w-full h-48 object-cover border border-[var(--color-border)]"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  />
                )}
                
                {/* Render compiled content body beautifully */}
                <div className="text-sm text-[var(--color-black)] leading-relaxed whitespace-pre-wrap font-normal">
                  {selectedArticleForView.content}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[var(--color-border)] px-6 py-3 flex justify-end bg-[var(--color-sub-bg)]/20">
                <button
                  onClick={() => setSelectedArticleForView(null)}
                  className="border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs px-4 py-2 flex items-center justify-center h-8"
                >
                  Close Reader
                </button>
              </div>

            </div>
          </div>,
          document.body
        )
      }
    </div>
  );
};

export default ArticlesAdmin;
