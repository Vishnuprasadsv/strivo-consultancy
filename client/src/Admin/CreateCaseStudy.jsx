import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiUpload,
} from "react-icons/fi";
import AvatarEditor from "react-avatar-editor";
import { toast } from "sonner";


const CreateCaseStudy = () => {

  const navigate = useNavigate();
  const [scale, setScale] = useState(1.2);
  const editorRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({

    title: "",
    author: "",
    authorRole: "",
    publicationDate: "",
    category: "",

    summary: "",
    challenges: "",
    results: "",

    authorWebsite: "",

    status: "Draft",

    coverImage: null,
    authorImage: null,

  });

  // -------------------------
  // Handle Text Inputs
  // -------------------------

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

  };

  // -------------------------
  // Cover Image
  // -------------------------


  const handleCoverImage = (e) => {

    setFormData({
      ...formData,
      coverImage: e.target.files[0],
    });

    setErrors({
      ...errors,
      coverImage: "",
    });

  };

  // -------------------------
  // Author Image
  // -------------------------

  const handleAuthorImage = (e) => {

    setFormData({
      ...formData,
      authorImage: e.target.files[0],
    });

    setErrors({
      ...errors,
      authorImage: "",
    });

  };

  // -------------------------
  // Upload Image to Cloudinary
  // -------------------------

  const uploadImage = async (file) => {

    if (!file) return "";

    const data = new FormData();

    data.append("file", file);

    data.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await axios.post(

      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,

      data

    );

    return res.data.secure_url;

  };

  const validateForm = () => {

    const newErrors = {};

    if (!formData.title.trim())
      newErrors.title = "Case Study Title is required.";

    if (!formData.author.trim())
      newErrors.author = "Author Name is required.";

    if (!formData.authorRole.trim())
      newErrors.authorRole = "Author Role is required.";

    if (!formData.publicationDate)
      newErrors.publicationDate = "Publishing Date is required.";

    if (!formData.category)
      newErrors.category = "Please select a category.";

    if (!formData.summary.trim())
      newErrors.summary = "Summary is required.";

    if (!formData.challenges.trim())
      newErrors.challenges = "Business Challenges are required.";

    if (!formData.results.trim())
      newErrors.results = "Results & Impact are required.";

    if (!formData.coverImage)
      newErrors.coverImage = "Cover Image is required.";

    if (!formData.authorImage)
      newErrors.authorImage = "Author Image is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  const getCroppedAuthorImage = () => {

    const canvas =
      editorRef.current.getImageScaledToCanvas();

    return new Promise((resolve) => {

      canvas.toBlob((blob) => {

        resolve(blob);

      });

    });

  };

  // -------------------------
  // Submit
  // -------------------------

  const isFutureDate = (dateString) => {
    if (!dateString) return false;
    const inputDate = new Date(dateString);
    const currentDate = new Date();
    const inputMidnight = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const todayMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    return inputMidnight.getTime() > todayMidnight.getTime();
  };

  const handleSubmit = async (status) => {
    if (!validateForm()) return;
    try {

      setLoading(true);

      const coverImage = await uploadImage(
        formData.coverImage
      );

      const croppedBlob =
        await getCroppedAuthorImage();

      const authorImage =
        await uploadImage(croppedBlob);

      let finalStatus = status;
      let isFuture = false;
      if (isFutureDate(formData.publicationDate)) {
        finalStatus = "Draft";
        isFuture = true;
      }

      await axios.post(

        `${import.meta.env.VITE_API_BASE_URL}/api/case-studies`,

        {
          title: formData.title,
          author: formData.author,
          authorRole: formData.authorRole,
          category: formData.category,
          publicationDate: formData.publicationDate,

          summary: formData.summary,
          challenges: formData.challenges,
          results: formData.results,

          authorWebsite: formData.authorWebsite,

          coverImage,
          authorImage,

          status: finalStatus,
        }

      );

      if (isFuture) {
        toast.success("Case Study Created Successfully (Saved as draft due to future date)");
      } else {
        toast.success("Case Study Created Successfully");
      }

      navigate("/admin/casestudies");

    }

    catch (error) {

      console.log(error);

      toast.error("Something went wrong");

    }

    finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen pt-24 px-8 md:px-16 lg:px-24 pb-8 relative z-10 bg-sub">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* ================= Header ================= */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[var(--color-paragraph)] opacity-60 hover:opacity-100 transition mb-4 cursor-pointer font-semibold text-sm"
            >
              <FiArrowLeft />
              Back to Case Studies
            </button>
            <h1 style={{ fontSize: '26px', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary)', margin: 0 }}>
              Create Case Study
            </h1>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-paragraph)', opacity: 0.6, margin: '2px 0 0 0' }}>
              Create a professional case study showcasing your successful consultancy project.
            </p>
          </div>
        </div>

        {/* ================= Basic Information ================= */}
        <div className="card bg-white p-4 shadow-card relative overflow-hidden mb-4">
          <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)', margin: '0 0 12px 0' }}>
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block mb-1.5 text-[var(--color-black)] font-semibold text-sm">
                Case Study Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Digital Transformation for ABC Manufacturing"
                className="w-full bg-[var(--color-sub-bg)] hover:bg-white focus:bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition-colors duration-200"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Author Name */}
            <div>
              <label className="block mb-1.5 text-[var(--color-black)] font-semibold text-sm">
                Author Name *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="John Smith"
                className="w-full bg-[var(--color-sub-bg)] hover:bg-white focus:bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition-colors duration-200"
              />
              {errors.author && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.author}
                </p>
              )}
            </div>

            {/* Author Role */}
            <div>
              <label className="block mb-1.5 text-[var(--color-black)] font-semibold text-sm">
                Author Role *
              </label>
              <input
                type="text"
                name="authorRole"
                value={formData.authorRole}
                onChange={handleChange}
                placeholder="Senior Business Consultant"
                className="w-full bg-[var(--color-sub-bg)] hover:bg-white focus:bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition-colors duration-200"
              />
              {errors.authorRole && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.authorRole}
                </p>
              )}
            </div>

            {/* Publishing Date */}
            <div>
              <label className="block mb-1.5 text-[var(--color-black)] font-semibold text-sm">
                Publishing Date *
              </label>
              <input
                type="date"
                name="publicationDate"
                value={formData.publicationDate}
                onChange={handleChange}
                min={new Date().toLocaleDateString('en-CA')}
                className="w-full bg-[var(--color-sub-bg)] hover:bg-white focus:bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition-colors duration-200"
              />
              {errors.publicationDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.publicationDate}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block mb-1.5 text-[var(--color-black)] font-semibold text-sm">
                Category *
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="appearance-none w-full bg-[var(--color-sub-bg)] hover:bg-white focus:bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
                >
                  <option value="" className="bg-[var(--color-main-bg)] text-black">Select Category</option>
                  <option value="Finance" className="bg-[var(--color-main-bg)] text-black">Finance</option>
                  <option value="Healthcare" className="bg-[var(--color-main-bg)] text-black">Healthcare</option>
                  <option value="Technology" className="bg-[var(--color-main-bg)] text-black">Technology</option>
                  <option value="Retail" className="bg-[var(--color-main-bg)] text-black">Retail</option>
                </select>
                {/* Custom Arrow Icon */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-paragraph)] opacity-60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ================= Media Upload ================= */}
        <div className="card bg-white p-4 shadow-card relative overflow-hidden mb-4">
          <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)', margin: '0 0 12px 0' }}>
            Media
          </h2>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Cover Image */}
            <div>
              <label className="block mb-2 text-[var(--color-black)] font-semibold text-sm">
                Cover Image *
              </label>
              <label className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] transition rounded-[var(--radius-sm)] h-36 flex flex-col items-center justify-center cursor-pointer bg-[var(--color-sub-bg)] hover:bg-white transition-colors duration-200">
                <FiUpload className="text-3xl text-[var(--color-primary)] mb-2" />
                <p className="text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                  Click to Upload Cover Image
                </p>
                <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-1">
                  JPG, PNG or WEBP
                </p>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImage}
                />
                {errors.coverImage && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.coverImage}
                  </p>
                )}
              </label>

              {formData.coverImage && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(formData.coverImage)}
                    alt="Cover"
                    className="w-full h-36 object-cover border border-[var(--color-border)]"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              )}
            </div>

            {/* Author Image */}
            <div>
              <label className="block mb-2 text-[var(--color-black)] font-semibold text-sm">
                Author Image *
              </label>
              <label className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] transition rounded-[var(--radius-sm)] h-36 flex flex-col items-center justify-center cursor-pointer bg-[var(--color-sub-bg)] hover:bg-white transition-colors duration-200">
                <FiUpload className="text-3xl text-[var(--color-primary)] mb-2" />
                <p className="text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                  Click to Upload Author Image
                </p>
                <p className="text-xs text-[var(--color-paragraph)] opacity-60 mt-1">
                  JPG, PNG or WEBP
                </p>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleAuthorImage}
                />
                {errors.authorImage && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.authorImage}
                  </p>
                )}
              </label>

              {formData.authorImage && (
                <div className="mt-4">
                  <div className="flex justify-center">
                    <AvatarEditor
                      ref={editorRef}
                      image={formData.authorImage}
                      width={120}
                      height={120}
                      border={10}
                      borderRadius={60}
                      color={[242, 244, 246, 0.6]}
                      scale={scale}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-xs text-[var(--color-paragraph)] opacity-60">
                      Zoom Image
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full mt-1 accent-[var(--color-primary)] cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= Case Study Content ================= */}
        <div className="card bg-white p-4 shadow-card relative overflow-hidden mb-4">
          <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)', margin: '0 0 12px 0' }}>
            Case Study Content
          </h2>

          <div className="space-y-5">
            {/* Summary */}
            <div>
              <label className="block mb-2 text-[var(--color-black)] font-semibold text-sm">
                Summary of Case Study *
              </label>
              <textarea
                rows={2}
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Provide a concise overview of the project, the client’s objectives, and the overall outcome."
                className="w-full bg-[var(--color-sub-bg)] hover:bg-white focus:bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition-colors duration-200 resize-none"
              />
              {errors.summary && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.summary}
                </p>
              )}
            </div>

            {/* Business Challenges */}
            <div>
              <label className="block mb-2 text-[var(--color-black)] font-semibold text-sm">
                Business Challenges *
              </label>
              <textarea
                rows={2}
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                placeholder="Describe the challenges, pain points, and business problems faced by the client before the project."
                className="w-full bg-[var(--color-sub-bg)] hover:bg-white focus:bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition-colors duration-200 resize-none"
              />
              {errors.challenges && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.challenges}
                </p>
              )}
            </div>

            {/* Results & Impact */}
            <div>
              <label className="block mb-2 text-[var(--color-black)] font-semibold text-sm">
                Results & Impact *
              </label>
              <textarea
                rows={2}
                name="results"
                value={formData.results}
                onChange={handleChange}
                placeholder="Describe the improvements, measurable outcomes, ROI, business growth, and overall impact after implementing the solution."
                className="w-full bg-[var(--color-sub-bg)] hover:bg-white focus:bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] p-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition-colors duration-200 resize-none"
              />
              {errors.results && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.results}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ================= Author Information ================= */}
        <div className="card bg-white p-4 shadow-card relative overflow-hidden mb-4">
          <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)', margin: '0 0 12px 0' }}>
            Author Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Author Website */}
            <div>
              <label className="block mb-1.5 text-[var(--color-black)] font-semibold text-sm">
                Author Website
              </label>
              <input
                type="url"
                name="authorWebsite"
                value={formData.authorWebsite}
                onChange={handleChange}
                placeholder="https://www.yourwebsite.com"
                className="w-full bg-[var(--color-sub-bg)] hover:bg-white focus:bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* ================= Action Buttons ================= */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer flex items-center justify-center"
            style={{ height: '34px', padding: '0 16px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("Draft")}
            disabled={loading}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white disabled:opacity-50 transition font-semibold cursor-pointer flex items-center justify-center"
            style={{ height: '34px', padding: '0 16px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
          >
            {loading ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("Published")}
            disabled={loading}
            className="btn border-none disabled:opacity-50 cursor-pointer w-full sm:w-auto justify-center flex items-center"
            style={{ height: '34px', padding: '0 16px', fontSize: '12px', minWidth: 'auto', fontWeight: 'var(--font-semibold)' }}
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </motion.div>
    </div>

  );

};

export default CreateCaseStudy;
