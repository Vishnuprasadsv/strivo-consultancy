import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button
} from "@mui/material";


import ArticleIcon from '@mui/icons-material/Article';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';

const ArticlesAdmin = () => {
  
  const [articlesList, setArticlesList] = useState([]);
  const [loading, setLoading] = useState(true);


  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formState, setFormState] = useState({
    title: '',
    category: 'Development',
    imageUrl: '',
    description: '',
    content: ''
  });

  
  const loadArticles = () => {
    setLoading(true);
    const stored = localStorage.getItem('strivo_articles');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setArticlesList(parsed);
      } catch (error) {
        console.error("Error loading articles from localStorage:", error);
      }
    } else {
      
      localStorage.setItem('strivo_articles', JSON.stringify([]));
      setArticlesList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, []);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormState({
      title: '',
      category: 'Development',
      imageUrl: '',
      description: '',
      content: ''
    });
    setOpenFormModal(true);
  };


  const handleOpenEditModal = (article) => {
    setIsEditing(true);
    setEditingId(article.id);
    setFormState({
      title: article.title,
      category: article.category,
      imageUrl: article.imageUrl || '',
      description: article.description,
      content: article.content || ''
    });
    setOpenFormModal(true);
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();

  
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

    let updatedList = [];

    if (isEditing) {
      // Update existing article
      updatedList = articlesList.map(art => {
        if (art.id === editingId) {
          return {
            ...art,
            title: formState.title,
            category: formState.category,
            imageUrl: formState.imageUrl,
            description: formState.description,
            content: formState.content,
            updatedAt: new Date().toISOString()
          };
        } else {
          return art;
        }
      });
      toast.success("Article updated successfully!");
    } else {
      // Create new article
      const newArticle = {
        id: Date.now(), // Generate a unique numerical ID
        title: formState.title,
        category: formState.category,
        imageUrl: formState.imageUrl,
        description: formState.description,
        content: formState.content,
        createdAt: new Date().toISOString()
      };
      updatedList = [newArticle, ...articlesList];
      toast.success("New article published successfully!");
    }

    // Save back to state and localStorage
    setArticlesList(updatedList);
    localStorage.setItem('strivo_articles', JSON.stringify(updatedList));
    setOpenFormModal(false);
  };

  // Delete article by ID
  const handleDeleteArticle = (articleId) => {
    const confirmation = window.confirm("Are you sure you want to delete this article?");
    if (confirmation) {
      const updatedList = articlesList.filter(art => art.id !== articleId);
      setArticlesList(updatedList);
      localStorage.setItem('strivo_articles', JSON.stringify(updatedList));
      toast.success("Article deleted successfully.");
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-8 relative z-10 md:ml-64 bg-black text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ArticleIcon className="text-blue-500" fontSize="large" />
              Articles & Insights Management
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Create, edit, and manage articles that display on the public website Insights page.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <AddIcon />
            Add New Article
          </button>
        </div>

        {/* List of Articles Table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <DescriptionIcon className="text-blue-400" />
            Current Articles ({articlesList.length})
          </h2>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : articlesList.length === 0 ? (
            <div className="py-12 text-center text-white/40 border border-white/5 bg-black/20 rounded-2xl">
              No articles added yet. Click "Add New Article" to write your first post!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-3 pr-4 font-semibold w-[80px]">Cover</th>
                    <th className="pb-3 px-4 font-semibold w-1/3">Title</th>
                    <th className="pb-3 px-4 font-semibold w-[120px]">Category</th>
                    <th className="pb-3 px-4 font-semibold">Short Preview</th>
                    <th className="pb-3 pl-4 font-semibold text-right w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {articlesList.map((art) => (
                    <tr key={art.id} className="hover:bg-white/2.5 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="py-4 pr-4">
                        <img
                          src={art.imageUrl}
                          alt="Cover"
                          className="w-12 h-12 rounded-lg object-cover border border-white/10"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=200";
                          }}
                        />
                      </td>
                      {/* Title */}
                      <td className="py-4 px-4 font-bold text-white max-w-[250px] truncate">
                        {art.title}
                      </td>
                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xxs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                          {art.category}
                        </span>
                      </td>
                      {/* Short Description */}
                      <td className="py-4 px-4 text-white/60 max-w-[200px] truncate">
                        {art.description}
                      </td>
                      {/* Actions */}
                      <td className="py-4 pl-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(art)}
                            className="p-2 bg-white/5 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-colors border border-white/5 hover:border-blue-500/30 cursor-pointer"
                            title="Edit Article"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-2 bg-white/5 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors border border-white/5 hover:border-red-500/30 cursor-pointer"
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
          )}
        </div>

      </div>

      {/* CREATE & EDIT ARTICLE MODAL DIALOG */}
      <Dialog
        open={openFormModal}
        onClose={() => setOpenFormModal(false)}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-container": {
            backdropFilter: "blur(12px)",
            background: "rgba(0, 0, 0, 0.4)",
          },
          "& .MuiDialog-paper": {
            background: "#000000 !important",
            color: "#ffffff !important",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 80px rgba(37,99,235,.22)",
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.5rem", pb: 2, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          {isEditing ? "Modify Article" : "Publish New Article"}
        </DialogTitle>
        
        <form onSubmit={handleSaveArticle}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3 }}>
            
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
                    inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      backgroundColor: "rgba(0,0,0,0.2)",
                      borderRadius: "14px",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                      "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                      "&.Mui-focused fieldset": { borderColor: "#2563EB" }
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
                    inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      backgroundColor: "rgba(0,0,0,0.2)",
                      borderRadius: "14px",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                      "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                      "&.Mui-focused fieldset": { borderColor: "#2563EB" }
                    },
                    "& .MuiSvgIcon-root": { color: "#fff" }
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
                inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "14px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                  "&.Mui-focused fieldset": { borderColor: "#2563EB" }
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
                inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "14px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                  "&.Mui-focused fieldset": { borderColor: "#2563EB" }
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
                  inputLabel: { style: { color: 'rgba(255,255,255,0.6)' } }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: "14px",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: "rgba(37,99,235,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "#2563EB" }
                  }
                }}
              />
              <span className="text-[11px] text-white/40 px-1">
                Note: Use double Enter (empty lines) between paragraphs and section headings to structure the article presentation correctly.
              </span>
            </div>

          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Button
              onClick={() => setOpenFormModal(false)}
              sx={{ color: "rgba(255,255,255,0.6)", textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #2563EB, #7C3AED)",
                color: "#fff",
                px: 4,
                py: 1.2,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
              }}
            >
              {isEditing ? "Save Changes" : "Publish Article"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ArticlesAdmin;
