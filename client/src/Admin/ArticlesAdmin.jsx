import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Material UI Components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Switch
} from "@mui/material";

// Icons
import ArticleIcon from '@mui/icons-material/Article';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';

// API Services
import {
  getArticlesAPI,
  createArticleAPI,
  updateArticleAPI,
  deleteArticleAPI,
  getSubscribersAPI,
  deleteSubscriberAPI
} from '../services/allApi';


const ArticlesAdmin = () => {
  // Articles data list
  const [articlesList, setArticlesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribers list states
  const [subscribersList, setSubscribersList] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' or 'subscribers'

  // Form modal visibility controls
  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form inputs state
  const [formState, setFormState] = useState({
    title: '',
    category: 'Development',
    imageUrl: '',
    description: '',
    content: '',
    showSubscription: true
  });

  // Load articles from MongoDB backend database
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
      toast.error("Failed to load articles. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

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
      toast.error("Failed to load subscribers. Check server connection.");
    } finally {
      setSubscribersLoading(false);
    }
  };

  const handleDeleteSubscriber = async (subId) => {
    const confirmation = window.confirm("Are you sure you want to remove this subscriber from the mailing list?");
    if (confirmation) {
      try {
        const response = await deleteSubscriberAPI(subId);
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
    }
  };

  useEffect(() => {
    loadArticles();
    loadSubscribers();
  }, []);


  // Update inputs state as the user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Open modal in "Create" mode
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormState({
      title: '',
      category: 'Development',
      imageUrl: '',
      description: '',
      content: '',
      showSubscription: true
    });
    setOpenFormModal(true);
  };

  // Open modal in "Edit" mode with selected article details
  const handleOpenEditModal = (article) => {
    setIsEditing(true);
    setEditingId(article._id); // Map to MongoDB key _id
    setFormState({
      title: article.title,
      category: article.category,
      imageUrl: article.imageUrl || '',
      description: article.description,
      content: article.content || '',
      showSubscription: article.showSubscription !== false
    });
    setOpenFormModal(true);
  };


  // Handle Save (Create or Update article in database)
  const handleSaveArticle = async (e) => {
    e.preventDefault();

    // Simple validation checks
    if (!formState.title.trim()) {
      toast.error("Please enter an article title.");
      return;
    }
    if (!formState.imageUrl.trim()) {
      toast.error("Please provide an image URL.");
      return;
    }
    if (!formState.description.trim()) {
      toast.error("Please enter a short description.");
      return;
    }
    if (!formState.content.trim()) {
      toast.error("Please enter the full article content.");
      return;
    }

    try {
      if (isEditing) {
        // Call backend PUT API to update the article
        const response = await updateArticleAPI(editingId, formState);
        if (response.status === 200 && response.data?.success) {
          toast.success("Article updated successfully! 🎉");
          setOpenFormModal(false);
          loadArticles(); // Reload updated list from server
        } else {
          toast.error(response.data?.message || "Failed to update article.");
        }
      } else {
        // Call backend POST API to create a new article
        const response = await createArticleAPI(formState);
        if (response.status === 201 && response.data?.success) {
          toast.success("New article published successfully! 🎉");
          setOpenFormModal(false);
          loadArticles(); // Reload new list from server
        } else {
          toast.error(response.data?.message || "Failed to publish article.");
        }
      }
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("An error occurred while saving the article.");
    }
  };

  // Delete article by ID from MongoDB
  const handleDeleteArticle = async (articleId) => {
    const confirmation = window.confirm("Are you sure you want to delete this article?");
    if (confirmation) {
      try {
        const response = await deleteArticleAPI(articleId);
        if (response.status === 200 && response.data?.success) {
          toast.success("Article deleted successfully. 🗑️");
          loadArticles(); // Refresh list from server
        } else {
          toast.error(response.data?.message || "Failed to delete article.");
        }
      } catch (error) {
        console.error("Error deleting article:", error);
        toast.error("An error occurred while deleting the article.");
      }
    }
  };


  return (
    <div className="min-h-screen pt-24 pb-8 px-4 sm:px-8 relative z-10 md:ml-56 bg-sub">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-card">
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }}>
              Articles & Insights
            </h1>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-paragraph)', opacity: 0.6, margin: '2px 0 0 0' }}>
              Create, edit, and manage articles that display on the public website Insights page.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="btn px-5 py-2.5 flex items-center gap-2 cursor-pointer border-none"
            style={{ fontWeight: 'var(--font-medium)' }}
          >
            <AddIcon />
            Add New Article
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b border-[var(--color-border)] pb-1">
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-300 cursor-pointer ${activeTab === 'articles' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-paragraph)] opacity-60 hover:opacity-100'
              }`}
          >
            Articles ({articlesList.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-300 cursor-pointer ${activeTab === 'subscribers' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-paragraph)] opacity-60 hover:opacity-100'
              }`}
          >
            Newsletter Subscribers ({subscribersList.length})
          </button>
        </div>

        {activeTab === 'articles' ? (
          /* List of Articles Table */
          <div className="card p-6 shadow-card relative overflow-hidden">
            <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '0 0 20px 0' }}>
              Current Articles ({articlesList.length})
            </h2>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : articlesList.length === 0 ? (
              <div className="py-12 text-center text-[var(--color-paragraph)] opacity-50 border border-[var(--color-border)] bg-[var(--color-sub-bg)] rounded-[var(--radius-sm)]">
                No articles added yet. Click "Add New Article" to write your first post!
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-[var(--color-paragraph)] opacity-50 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pr-4 font-semibold w-[80px]">Cover</th>
                        <th className="pb-3 px-4 font-semibold w-1/3">Title</th>
                        <th className="pb-3 px-4 font-semibold w-[120px]">Category</th>
                        <th className="pb-3 px-4 font-semibold">Short Preview</th>
                        <th className="pb-3 pl-4 font-semibold text-right w-[150px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-sm">
                      {articlesList.slice(0, 5).map((art) => (
                        <tr key={art._id} className="hover:bg-[var(--color-sub-bg)]/40 transition-colors">
                          <td className="py-4 pr-4">
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
                          <td className="py-4 px-4 font-semibold text-[var(--color-black)] max-w-[250px] truncate">
                            {art.title}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase">
                              {art.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-[var(--color-paragraph)] opacity-70 max-w-[200px] truncate">
                            {art.description}
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(art)}
                                className="p-2 flex items-center justify-center transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-70 hover:opacity-100"
                                style={{ borderRadius: 'var(--radius-sm)' }}
                                title="Edit Article"
                              >
                                <EditIcon fontSize="small" />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art._id)}
                                className="p-2 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                                style={{ borderRadius: 'var(--radius-sm)' }}
                                title="Delete Article"
                              >
                                <DeleteIcon fontSize="small" />
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
                  {articlesList.slice(0, 5).map((art) => (
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
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase mb-1">
                            {art.category}
                          </span>
                          <h3 className="text-sm font-semibold text-[var(--color-black)] leading-snug truncate">
                            {art.title}
                          </h3>
                          <p className="text-xs text-[var(--color-paragraph)] opacity-60 line-clamp-2 mt-1">
                            {art.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]/50">
                        <button
                          onClick={() => handleOpenEditModal(art)}
                          className="px-3 py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[var(--color-border)] bg-[var(--color-main-bg)] text-[var(--color-paragraph)] opacity-80 hover:opacity-100 text-xs font-semibold"
                          style={{ borderRadius: 'var(--radius-sm)' }}
                        >
                          <EditIcon style={{ fontSize: 14 }} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art._id)}
                          className="px-3 py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10 text-xs font-semibold"
                          style={{ borderRadius: 'var(--radius-sm)' }}
                        >
                          <DeleteIcon style={{ fontSize: 14 }} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          /* List of Subscribers Table */
          <div className="card p-6 shadow-card relative overflow-hidden">
            <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '0 0 20px 0' }}>
              Active Subscribers ({subscribersList.length})
            </h2>

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
                      <tr className="border-b border-[var(--color-border)] text-[var(--color-paragraph)] opacity-50 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 px-4 font-semibold">Email Address</th>
                        <th className="pb-3 px-4 font-semibold w-[220px]">Subscribed On</th>
                        <th className="pb-3 pl-4 font-semibold text-right w-[150px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-sm">
                      {subscribersList.map((sub) => (
                        <tr key={sub._id} className="hover:bg-[var(--color-sub-bg)]/40 transition-colors">
                          <td className="py-4 px-4 font-medium text-[var(--color-black)]">
                            {sub.email}
                          </td>
                          <td className="py-4 px-4 text-[var(--color-paragraph)] opacity-70">
                            {new Date(sub.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <button
                              onClick={() => handleDeleteSubscriber(sub._id)}
                              className="p-2 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                              style={{ borderRadius: 'var(--radius-sm)' }}
                              title="Remove Subscriber"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="block md:hidden space-y-4">
                  {subscribersList.map((sub) => (
                    <div key={sub._id} className="border border-[var(--color-border)] rounded-[var(--radius-sm)] p-4 bg-[var(--color-sub-bg)]/20 hover:bg-[var(--color-sub-bg)]/40 transition-colors flex flex-col gap-3">
                      <div>
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
                          className="px-3 py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/10 text-xs font-semibold"
                          style={{ borderRadius: 'var(--radius-sm)' }}
                        >
                          <DeleteIcon style={{ fontSize: 14 }} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* CREATE & EDIT ARTICLE MODAL DIALOG */}
        <Dialog
          open={openFormModal}
          onClose={() => setOpenFormModal(false)}
          maxWidth="md"
          fullWidth
          scroll="paper"
          component="form"
          onSubmit={handleSaveArticle}
          sx={{
            "& .MuiDialog-container": {
              backdropFilter: "blur(4px)",
              background: "rgba(0, 0, 0, 0.15)",
            },
            "& .MuiDialog-paper": {
              background: "var(--color-main-bg) !important",
              color: "var(--color-paragraph) !important",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column"
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem", px: 3, pt: 3, pb: 2, borderBottom: "1px solid var(--color-border)", color: "var(--color-black)" }}>
            {isEditing ? "Modify Article" : "Publish New Article"}
          </DialogTitle>

          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, px: 3, py: 2.5 }}>

            {/* Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <TextField
                  fullWidth
                  label="Article Title"
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Microservices vs Monolith"
                  variant="outlined"
                  slotProps={{
                    inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "var(--color-paragraph)",
                      backgroundColor: "var(--color-sub-bg)",
                      borderRadius: "var(--radius-sm)",
                      "& fieldset": { borderColor: "var(--color-border)" },
                      "&:hover fieldset": { borderColor: "var(--color-primary)" },
                      "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                    }
                  }}
                />
              </div>
              <div>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="category"
                  value={formState.category}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  slotProps={{
                    inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "var(--color-paragraph)",
                      backgroundColor: "var(--color-sub-bg)",
                      borderRadius: "var(--radius-sm)",
                      "& fieldset": { borderColor: "var(--color-border)" },
                      "&:hover fieldset": { borderColor: "var(--color-primary)" },
                      "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                    },
                    "& .MuiSvgIcon-root": { color: "var(--color-paragraph)" }
                  }}
                >
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Development">Development</MenuItem>
                  <MenuItem value="UI/UX">UI/UX</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="SaaS">SaaS</MenuItem>
                </TextField>
              </div>
            </div>

            {/* Cover Image URL */}
            <TextField
              fullWidth
              label="Cover Image URL"
              name="imageUrl"
              value={formState.imageUrl}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/image.jpg"
              variant="outlined"
              slotProps={{
                inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "var(--color-paragraph)",
                  backgroundColor: "var(--color-sub-bg)",
                  borderRadius: "var(--radius-sm)",
                  "& fieldset": { borderColor: "var(--color-border)" },
                  "&:hover fieldset": { borderColor: "var(--color-primary)" },
                  "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                }
              }}
            />

            {/* Short description */}
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Short Preview / Card Description"
              name="description"
              value={formState.description}
              onChange={handleInputChange}
              required
              placeholder="Describe the card preview text shown to list articles..."
              variant="outlined"
              slotProps={{
                inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "var(--color-paragraph)",
                  backgroundColor: "var(--color-sub-bg)",
                  borderRadius: "var(--radius-sm)",
                  "& fieldset": { borderColor: "var(--color-border)" },
                  "&:hover fieldset": { borderColor: "var(--color-primary)" },
                  "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                }
              }}
            />

            {/* Article detailed content */}
            <div className="flex flex-col gap-1.5">
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Full Article Content"
                name="content"
                value={formState.content}
                onChange={handleInputChange}
                required
                placeholder="Write the full content. Tip: You can type '# Header' or '## Section' or '### Sub-section' on their own lines, separated by double-newlines, to automatically format titles and paragraphs when rendered on the frontend!"
                variant="outlined"
                slotProps={{
                  inputLabel: { style: { color: 'var(--color-paragraph)', opacity: 0.6 } }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-paragraph)",
                    backgroundColor: "var(--color-sub-bg)",
                    borderRadius: "var(--radius-sm)",
                    "& fieldset": { borderColor: "var(--color-border)" },
                    "&:hover fieldset": { borderColor: "var(--color-primary)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" }
                  }
                }}
              />
              <span className="text-[11px] text-[var(--color-paragraph)] opacity-50 px-1">
                Note: Use double Enter (empty lines) between paragraphs and section headings to structure the article presentation correctly.
              </span>
            </div>

            {/* Show Subscription Option */}
            <FormControlLabel
              control={
                <Switch
                  checked={formState.showSubscription}
                  onChange={handleSwitchChange}
                  name="showSubscription"
                  color="primary"
                />
              }
              label="Show Subscription Sidebar on Detail Page"
              sx={{ color: "var(--color-paragraph)", ml: 0.5 }}
            />

          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5, pt: 2, borderTop: "1px solid var(--color-border)" }}>
            <Button
              onClick={() => setOpenFormModal(false)}
              sx={{ color: "var(--color-paragraph)", opacity: 0.6, "&:hover": { opacity: 1 }, textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "var(--color-primary)",
                color: "#fff",
                px: 4,
                py: 1.2,
                borderRadius: "var(--radius-sm)",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { background: "var(--color-primary)", opacity: 0.9 },
                boxShadow: "none"
              }}
            >
              {isEditing ? "Save Changes" : "Publish Article"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ArticlesAdmin;
