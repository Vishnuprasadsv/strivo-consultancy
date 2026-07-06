import React, {
    useState,
    useEffect,
    useRef
} from "react";
import axios from "axios";
import AvatarEditor from "react-avatar-editor";
import LoadingIndicator from "../Components/LoadingIndicator";
import {

    useNavigate,

    useParams

} from "react-router-dom";

import { motion } from "framer-motion";
import {
    FiArrowLeft,
    FiUpload,
} from "react-icons/fi";
const EditCaseStudy = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const editorRef = useRef(null);

    const [scale, setScale] = useState(1.2);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({

        title: "",

        author: "",

        authorRole: "",

        category: "",

        duration: "",

        summary: "",

        challenges: "",

        results: "",

        authorWebsite: "",

        coverImage: "",

        authorImage: "",

        status: "Draft"

    });
    useEffect(() => {

        if (id) {

            fetchStudy();

        }

    }, [id]);


    const fetchStudy = async () => {
        console.log(
            `${import.meta.env.VITE_API_BASE_URL}/api/case-studies/${id}`
        );

        try {

            const res = await axios.get(

                `${import.meta.env.VITE_API_BASE_URL}/api/case-studies/${id}`

            );
            console.log(res.data);

            setFormData(res.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }
    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:

                e.target.value

        });

    }
    const handleCoverImage = (e) => {

        setFormData({

            ...formData,

            coverImage: e.target.files[0]

        });

    };
    const handleAuthorImage = (e) => {

        setFormData({

            ...formData,

            authorImage: e.target.files[0]

        });

    };
    const validate = () => {

        const temp = {};

        if (!formData.title)
            temp.title = "Required";

        if (!formData.author)
            temp.author = "Required";

        if (!formData.authorRole)
            temp.authorRole = "Required";

        if (!formData.category)
            temp.category = "Required";

        setErrors(temp);

        return Object.keys(temp).length === 0;

    }
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
    const getCroppedImage = () => {

        if (!editorRef.current)

            return null;

        const canvas =

            editorRef.current

                .getImageScaledToCanvas();

        return new Promise((resolve) => {

            canvas.toBlob(blob => {

                resolve(blob);

            });

        });

    };
    const handleUpdate = async () => {

        try {

            let coverImage = formData.coverImage;

            let authorImage = formData.authorImage;

            if (formData.coverImage instanceof File) {

                coverImage = await uploadImage(

                    formData.coverImage

                );

            }

            if (formData.authorImage instanceof File) {

                const croppedBlob =

                    await getCroppedImage();

                authorImage =

                    await uploadImage(croppedBlob);

            }

            const res = await axios.put(

                `${import.meta.env.VITE_API_BASE_URL}/api/case-studies/${id}`,

                {

                    ...formData,

                    coverImage,

                    authorImage

                }

            );

            alert("Case Study Updated Successfully");

            navigate("/admin/casestudies");

        }

        catch (err) {

            console.log(err);

        }

    }
    if (loading) {
        return <LoadingIndicator />;
    }
    return (
        <div className="min-h-screen pt-24 px-4 sm:px-8 pb-8 relative z-10 md:ml-56 bg-sub">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
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
                        <h1 style={{ fontSize: '26px', fontWeight: 'var(--font-semibold)', color: 'var(--color-black)', margin: 0 }}>
                            Edit Case Study
                        </h1>
                        <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-paragraph)', opacity: 0.6, margin: '2px 0 0 0' }}>
                            Create a professional case study showcasing your successful consultancy project.
                        </p>
                    </div>
                </div>

                {/* ================= Basic Information ================= */}
                <div className="card p-5 shadow-card relative overflow-hidden mb-6">
                    <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '0 0 15px 0' }}>
                        Basic Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                            <label className="block mb-1.5 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Case Study Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Digital Transformation for ABC Manufacturing"
                                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Author Name */}
                        <div>
                            <label className="block mb-1.5 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Author Name *
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="John Smith"
                                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition"
                            />
                            {errors.author && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.author}
                                </p>
                            )}
                        </div>

                        {/* Author Role */}
                        <div>
                            <label className="block mb-1.5 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Author Role *
                            </label>
                            <input
                                type="text"
                                name="authorRole"
                                value={formData.authorRole}
                                onChange={handleChange}
                                placeholder="Senior Business Consultant"
                                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition"
                            />
                            {errors.authorRole && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.authorRole}
                                </p>
                            )}
                        </div>

                        {/* Project Duration */}
                        <div>
                            <label className="block mb-1.5 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Project Duration *
                            </label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="6 Months"
                                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition"
                            />
                            {errors.duration && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.duration}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Category *
                            </label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="appearance-none w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition cursor-pointer"
                                >
                                    <option value="" className="bg-[var(--color-main-bg)]">Select Category</option>
                                    <option value="Finance" className="bg-[var(--color-main-bg)]">Finance</option>
                                    <option value="Healthcare" className="bg-[var(--color-main-bg)]">Healthcare</option>
                                    <option value="Technology" className="bg-[var(--color-main-bg)]">Technology</option>
                                    <option value="Retail" className="bg-[var(--color-main-bg)]">Retail</option>
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
                <div className="card p-5 shadow-card relative overflow-hidden mb-6">
                    <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '0 0 15px 0' }}>
                        Media
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-5">
                        {/* Cover Image */}
                        <div>
                            <label className="block mb-2 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Cover Image *
                            </label>
                            <label className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] transition rounded-[var(--radius-sm)] h-56 flex flex-col items-center justify-center cursor-pointer">
                                <FiUpload className="text-4xl text-[var(--color-primary)] mb-3" />
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
                                        src={typeof formData.coverImage === 'string' ? formData.coverImage : URL.createObjectURL(formData.coverImage)}
                                        alt="Cover"
                                        className="w-full h-56 object-cover border border-[var(--color-border)]"
                                        style={{ borderRadius: 'var(--radius-sm)' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Author Image */}
                        <div>
                            <label className="block mb-2 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Author Image *
                            </label>
                            <label className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] transition rounded-[var(--radius-sm)] h-56 flex flex-col items-center justify-center cursor-pointer">
                                <FiUpload className="text-4xl text-[var(--color-primary)] mb-3" />
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
                                            width={180}
                                            height={180}
                                            border={15}
                                            borderRadius={90}
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
                <div className="card p-5 shadow-card relative overflow-hidden mb-6">
                    <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '0 0 15px 0' }}>
                        Case Study Content
                    </h2>

                    <div className="space-y-5">
                        {/* Summary */}
                        <div>
                            <label className="block mb-2 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Summary of Case Study *
                            </label>
                            <textarea
                                rows={4}
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                placeholder="Provide a concise overview of the project, the client’s objectives, and the overall outcome."
                                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] p-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition resize-none"
                            />
                            {errors.summary && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.summary}
                                </p>
                            )}
                        </div>

                        {/* Business Challenges */}
                        <div>
                            <label className="block mb-2 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Business Challenges *
                            </label>
                            <textarea
                                rows={5}
                                name="challenges"
                                value={formData.challenges}
                                onChange={handleChange}
                                placeholder="Describe the challenges, pain points, and business problems faced by the client before the project."
                                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] p-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition resize-none"
                            />
                            {errors.challenges && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.challenges}
                                </p>
                            )}
                        </div>

                        {/* Results & Impact */}
                        <div>
                            <label className="block mb-2 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Results & Impact *
                            </label>
                            <textarea
                                rows={5}
                                name="results"
                                value={formData.results}
                                onChange={handleChange}
                                placeholder="Describe the improvements, measurable outcomes, ROI, business growth, and overall impact after implementing the solution."
                                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] p-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition resize-none"
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
                <div className="card p-5 shadow-card relative overflow-hidden mb-6">
                    <h2 style={{ fontSize: 'var(--text-paragraph)', fontWeight: 'var(--font-bold)', color: 'var(--color-black)', margin: '0 0 15px 0' }}>
                        Author Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Author Website */}
                        <div>
                            <label className="block mb-1.5 text-[var(--color-paragraph)] opacity-80 font-medium text-sm">
                                Author Website
                            </label>
                            <input
                                type="url"
                                name="authorWebsite"
                                value={formData.authorWebsite}
                                onChange={handleChange}
                                placeholder="https://www.yourwebsite.com"
                                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] py-2.5 px-3 outline-none text-sm text-[var(--color-paragraph)] focus:border-[var(--color-primary)] transition"
                            />
                        </div>
                    </div>
                </div>

                {/* ================= Action Buttons ================= */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border border-[var(--color-border)] text-sm text-[var(--color-paragraph)] hover:bg-[var(--color-sub-bg)] transition font-semibold cursor-pointer h-10"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdate}
                        className="btn px-6 py-2 border-none cursor-pointer w-full sm:w-auto justify-center h-10 text-sm"
                        style={{ fontWeight: 'var(--font-semibold)' }}
                    >
                        Update Case Study
                    </button>
                </div>
            </motion.div>
        </div>

    );

};

export default EditCaseStudy;
