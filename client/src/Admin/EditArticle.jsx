import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import { toast } from 'sonner';
import { getArticlesAPI, updateArticleAPI } from '../services/allApi';
import LoadingIndicator from '../Components/LoadingIndicator';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [isAlreadyPublished, setIsAlreadyPublished] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    category: 'Development',
    imageUrl: '',
    publicationDate: new Date().toISOString().split('T')[0],
    description: '',
    executiveSummary: '',
    sec1Title: '',
    sec1Content: '',
    quote: '',
    sec2Title: '',
    sec2Content: '',
    showSubscription: true,
    status: 'Published'
  });

  // Reverse parses compiled markdown-like content back into individual section states
  const parseContentToFields = (contentStr) => {
    const fields = {
      executiveSummary: '',
      sec1Title: 'The Paradigms of Modern Infrastructure',
      sec1Content: '',
      quote: '',
      sec2Title: 'Operationalizing Intelligence',
      sec2Content: ''
    };
    if (!contentStr) return fields;

    const blocks = contentStr.split('\n\n');
    let currentSection = 0; // 1 = sec1, 2 = sec2

    blocks.forEach(block => {
      const trimmed = block.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('### Executive Summary')) {
        const lines = trimmed.split('\n').slice(1);
        fields.executiveSummary = lines.map(line => line.replace(/^[\-\*]\s*/, '')).join('\n');
      } else if (trimmed.startsWith('## ')) {
        const firstNewline = trimmed.indexOf('\n');
        const title = trimmed.substring(3, firstNewline !== -1 ? firstNewline : trimmed.length).trim();
        const content = firstNewline !== -1 ? trimmed.substring(firstNewline + 1).trim() : '';

        if (currentSection === 0) {
          fields.sec1Title = title;
          fields.sec1Content = content;
          currentSection = 1;
        } else {
          fields.sec2Title = title;
          fields.sec2Content = content;
          currentSection = 2;
        }
      } else if (trimmed.startsWith('> ')) {
        fields.quote = trimmed.substring(2).trim();
      } else {
        if (currentSection === 1 || currentSection === 0) {
          fields.sec1Content = (fields.sec1Content ? fields.sec1Content + '\n\n' + trimmed : trimmed).trim();
          currentSection = 1;
        } else if (currentSection === 2) {
          fields.sec2Content = (fields.sec2Content ? fields.sec2Content + '\n\n' + trimmed : trimmed).trim();
        }
      }
    });

    return fields;
  };

  useEffect(() => {
    const fetchArticleDetails = async () => {
      setLoading(true);
      try {
        const response = await getArticlesAPI();
        if (response.status === 200 && response.data?.success) {
          const found = response.data.data.find(a => a._id === id);
          if (found) {
            const parsed = parseContentToFields(found.content);
            const initialForm = {
              title: found.title || '',
              category: found.category || 'Development',
              imageUrl: found.imageUrl || '',
              publicationDate: found.publicationDate
                ? new Date(found.publicationDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
              description: found.description || '',
              executiveSummary: parsed.executiveSummary,
              sec1Title: parsed.sec1Title,
              sec1Content: parsed.sec1Content,
              quote: parsed.quote,
              sec2Title: parsed.sec2Title,
              sec2Content: parsed.sec2Content,
              showSubscription: found.showSubscription !== false,
              status: found.status || 'Published'
            };
            setFormData(initialForm);
            setInitialData(initialForm);
            setIsAlreadyPublished(found.status === 'Published');
          } else {
            toast.error("Article not found in backend database.");
            navigate('/admin/article');
          }
        } else {
          toast.error("Failed to load articles.");
        }
      } catch (err) {
        console.error("Error fetching article details:", err);
        toast.error("Error loading article data.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticleDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      if (name === 'publicationDate') {
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate > today) {
          updated.status = 'Draft';
        }
      }
      return updated;
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      data
    );
    return res.data.secure_url;
  };

  const handleSave = async (statusVal) => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Article Title is required.";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Short Preview / Description is required.";
    }
    if (!formData.executiveSummary.trim()) {
      newErrors.executiveSummary = "Summary Highlights are required.";
    }
    if (!formData.sec1Title.trim()) {
      newErrors.sec1Title = "Section 1 Heading is required.";
    }
    if (!formData.sec1Content.trim()) {
      newErrors.sec1Content = "Section 1 Body Content is required.";
    }
    if (!formData.quote.trim()) {
      newErrors.quote = "Quote Text is required.";
    }
    if (!formData.sec2Title.trim()) {
      newErrors.sec2Title = "Section 2 Heading is required.";
    }
    if (!formData.sec2Content.trim()) {
      newErrors.sec2Content = "Section 2 Body Content is required.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Check if cover image file is changed
    const hasCoverImageChange = !!coverImageFile;

    // Compare fields
    let hasFieldChanges = false;
    if (initialData) {
      const keys = [
        'title', 'category', 'description', 'publicationDate', 'executiveSummary',
        'sec1Title', 'sec1Content', 'quote', 'sec2Title', 'sec2Content', 'showSubscription', 'status'
      ];
      for (const key of keys) {
        if (formData[key] !== initialData[key]) {
          hasFieldChanges = true;
          break;
        }
      }
    }

    if (!hasFieldChanges && !hasCoverImageChange) {
      toast.info("No changes were made.");
      navigate("/admin/article");
      return;
    }

    setSaving(true);

    try {
      // 1. Upload cover image if selected
      let uploadedUrl = formData.imageUrl;
      if (coverImageFile) {
        const url = await uploadImage(coverImageFile);
        if (url) {
          uploadedUrl = url;
        } else {
          toast.error("Failed to upload cover image.");
          setSaving(false);
          return;
        }
      }

      // 2. Assemble structured content back into single markdown content string
      let assembledContent = "";

      if (formData.executiveSummary.trim()) {
        assembledContent += `### Executive Summary\n${formData.executiveSummary.split('\n').filter(line => line.trim()).map(line => `- ${line.trim()}`).join('\n')}\n\n`;
      }

      if (formData.sec1Title.trim() || formData.sec1Content.trim()) {
        if (formData.sec1Title.trim()) {
          assembledContent += `## ${formData.sec1Title.trim()}\n`;
        }
        assembledContent += `${formData.sec1Content.trim()}\n\n`;
      }

      if (formData.quote.trim()) {
        assembledContent += `> ${formData.quote.trim()}\n\n`;
      }

      if (formData.sec2Title.trim() || formData.sec2Content.trim()) {
        if (formData.sec2Title.trim()) {
          assembledContent += `## ${formData.sec2Title.trim()}\n`;
        }
        assembledContent += `${formData.sec2Content.trim()}\n\n`;
      }

      const selectedDate = new Date(formData.publicationDate);
      selectedDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let finalStatus = statusVal;
      if (selectedDate > today) {
        finalStatus = 'Draft';
      }

      const payload = {
        title: formData.title,
        category: formData.category,
        imageUrl: uploadedUrl,
        description: formData.description,
        publicationDate: formData.publicationDate,
        showSubscription: formData.showSubscription,
        content: assembledContent,
        status: finalStatus
      };

      const response = await updateArticleAPI(id, payload);
      if (response.status === 200 && response.data?.success) {
        let successMsg = "Article updated successfully!";
        if (finalStatus === 'Draft' && selectedDate > today) {
          successMsg = "Article updated successfully (Saved as draft due to future date)!";
        } else if (finalStatus === 'Draft') {
          successMsg = "Article saved as Draft successfully!";
        }
        toast.success(successMsg);
        navigate('/admin/article');
      } else {
        toast.error(response.data?.message || "Failed to update article.");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("An error occurred while updating the article.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-8 md:px-16 lg:px-24 bg-sub" style={{ fontFamily: 'var(--font-primary)' }}>
      <div className="max-w-4xl mx-auto">

        {/* Back navigation */}
        <button
          onClick={() => navigate('/admin/article')}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] hover:opacity-85 transition mb-6 cursor-pointer"
          style={{ fontFamily: 'var(--font-primary)' }}
        >
          <FiArrowLeft size={14} /> Back to Articles
        </button>

        {/* Heading */}
        <div className="mb-8 text-left">
          <h1 className="text-2xl font-[var(--font-bold)] text-primary uppercase" style={{ margin: 0, fontFamily: 'var(--font-primary)' }}>
            EDIT ARTICLE
          </h1>
          <p className="text-xs text-[var(--color-paragraph)] opacity-85 mt-2" style={{ fontFamily: 'var(--font-primary)' }}>
            Modify structured content segments dynamically.
          </p>
        </div>

        {/* Form Sections */}
        <div className="space-y-8">

          {/* Card 1: Basic Info */}
          <div className="bg-white p-8 border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-sm text-left">
            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-6 border-b border-[var(--color-border)] pb-2" style={{ fontFamily: 'var(--font-primary)' }}>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Microservices vs Monolith"
                  className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
                  style={{ fontFamily: 'var(--font-primary)' }}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200 cursor-pointer"
                  style={{ fontFamily: 'var(--font-primary)' }}
                >
                  <option value="Technology">Technology</option>
                  <option value="Development">Development</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Business">Business</option>
                  <option value="SaaS">SaaS</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Cover Image Upload Option */}
              <div>
                <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                  Cover Image File
                </label>
                <label className="border border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] transition rounded-[var(--radius-sm)] h-32 flex flex-col items-center justify-center cursor-pointer bg-[var(--color-sub-bg)] hover:bg-white transition-colors duration-200 p-4">
                  <FiUpload className="text-2xl text-[var(--color-primary)] mb-1" />
                  <p className="text-[var(--color-paragraph)] font-semibold text-xs opacity-90">
                    {coverImageFile ? coverImageFile.name : "Click to Replace Image"}
                  </p>
                  <p className="text-[10px] text-[var(--color-paragraph)] opacity-60 mt-0.5">
                    JPG, PNG or WEBP
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                  Publishing Date *
                </label>
                <input
                  type="date"
                  name="publicationDate"
                  value={formData.publicationDate}
                  onChange={handleInputChange}
                  disabled={isAlreadyPublished}
                  className={`w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200 ${isAlreadyPublished ? 'opacity-65 cursor-not-allowed' : ''}`}
                  style={{ fontFamily: 'var(--font-primary)' }}
                />
              </div>
            </div>

            {(coverImageFile || formData.imageUrl) && (
              <div className="mb-6">
                <p className="text-[10px] text-[var(--color-black)] font-semibold uppercase tracking-wider mb-2">Image Preview:</p>
                <img
                  src={coverImageFile ? URL.createObjectURL(coverImageFile) : formData.imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-[var(--radius-sm)] border border-[var(--color-border)]"
                />
              </div>
            )}

            <div>
              <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                Short Preview / Card Description *
              </label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A brief card summary shown to readers in list page..."
                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
                style={{ fontFamily: 'var(--font-primary)' }}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Card 2: Executive Summary */}
          <div className="bg-white p-8 border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-sm text-left">
            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-6 border-b border-[var(--color-border)] pb-2" style={{ fontFamily: 'var(--font-primary)' }}>
              Executive Summary
            </h2>
            <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
              Summary Highlights (One point per line) *
            </label>
            <textarea
              name="executiveSummary"
              rows={3}
              value={formData.executiveSummary}
              onChange={handleInputChange}
              placeholder="e.g.&#10;First critical takeaway point&#10;Second architectural decision point&#10;Third key action item"
              className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
              style={{ fontFamily: 'var(--font-primary)' }}
            />
            {errors.executiveSummary && (
              <p className="text-red-500 text-xs mt-1">
                {errors.executiveSummary}
              </p>
            )}
          </div>

          {/* Card 3: Section 1 */}
          <div className="bg-white p-8 border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-sm text-left">
            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-6 border-b border-[var(--color-border)] pb-2" style={{ fontFamily: 'var(--font-primary)' }}>
              Section 1 (Infrastructure Paradigm)
            </h2>
            <div className="mb-6">
              <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                Section 1 Heading *
              </label>
              <input
                type="text"
                name="sec1Title"
                value={formData.sec1Title}
                onChange={handleInputChange}
                placeholder="The Paradigms of Modern Infrastructure"
                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
                style={{ fontFamily: 'var(--font-primary)' }}
              />
              {errors.sec1Title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sec1Title}
                </p>
              )}
            </div>
            <div>
              <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                Section 1 Body Content *
              </label>
              <textarea
                name="sec1Content"
                rows={4}
                value={formData.sec1Content}
                onChange={handleInputChange}
                placeholder="Enter section body paragraphs..."
                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
                style={{ fontFamily: 'var(--font-primary)' }}
              />
              {errors.sec1Content && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sec1Content}
                </p>
              )}
            </div>
          </div>

          {/* Card 4: Quote Block */}
          <div className="bg-white p-8 border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-sm text-left">
            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-6 border-b border-[var(--color-border)] pb-2" style={{ fontFamily: 'var(--font-primary)' }}>
              Featured Blockquote
            </h2>
            <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
              Quote Text *
            </label>
            <textarea
              name="quote"
              rows={2}
              value={formData.quote}
              onChange={handleInputChange}
              placeholder="e.g. 'Strategic adaptation is the baseline for enterprise survival.'"
              className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
              style={{ fontFamily: 'var(--font-primary)' }}
            />
            {errors.quote && (
              <p className="text-red-500 text-xs mt-1">
                {errors.quote}
              </p>
            )}
          </div>

          {/* Card 5: Section 2 */}
          <div className="bg-white p-8 border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-sm text-left">
            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-6 border-b border-[var(--color-border)] pb-2" style={{ fontFamily: 'var(--font-primary)' }}>
              Section 2 (Operationalizing Intelligence)
            </h2>
            <div className="mb-6">
              <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                Section 2 Heading *
              </label>
              <input
                type="text"
                name="sec2Title"
                value={formData.sec2Title}
                onChange={handleInputChange}
                placeholder="Operationalizing Intelligence"
                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
                style={{ fontFamily: 'var(--font-primary)' }}
              />
              {errors.sec2Title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sec2Title}
                </p>
              )}
            </div>
            <div>
              <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-primary)' }}>
                Section 2 Body Content *
              </label>
              <textarea
                name="sec2Content"
                rows={4}
                value={formData.sec2Content}
                onChange={handleInputChange}
                placeholder="Enter section body paragraphs..."
                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-paragraph)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
                style={{ fontFamily: 'var(--font-primary)' }}
              />
              {errors.sec2Content && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sec2Content}
                </p>
              )}
            </div>
          </div>

          {/* Card 6: Settings */}
          <div className="bg-white p-8 border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-sm text-left">
            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-6 border-b border-[var(--color-border)] pb-2" style={{ fontFamily: 'var(--font-primary)' }}>
              Settings
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showSubscription"
                name="showSubscription"
                checked={formData.showSubscription}
                onChange={handleInputChange}
                className="w-4 h-4 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-0 cursor-pointer"
              />
              <label htmlFor="showSubscription" className="text-sm text-[var(--color-paragraph)] font-semibold cursor-pointer" style={{ fontFamily: 'var(--font-primary)' }}>
                Show Newsletter subscription sidebar on detail page
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-3 pt-4">
            <button
              onClick={() => navigate('/admin/article')}
              disabled={saving}
              className="border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center"
              style={{ height: '34px', padding: '0 16px', fontFamily: 'var(--font-primary)' }}
            >
              Cancel
            </button>

            <button
              onClick={() => handleSave('Draft')}
              disabled={saving}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center transition"
              style={{ height: '34px', padding: '0 16px', fontFamily: 'var(--font-primary)' }}
            >
              Save as Draft
            </button>

            <button
              onClick={() => handleSave('Published')}
              disabled={saving}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center transition"
              style={{ height: '34px', padding: '0 16px', fontFamily: 'var(--font-primary)' }}
            >
              {saving ? "Saving..." : "Update Article"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EditArticle;
