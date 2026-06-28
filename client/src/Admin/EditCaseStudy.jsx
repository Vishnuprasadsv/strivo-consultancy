import React, {
    useState,
    useEffect
} from "react";

import axios from "axios";

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
    console.log("Params ID:", id);
    const navigate = useNavigate();

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

   if(id){

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

    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,

    data

  );

  return res.data.secure_url;

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

      authorImage = await uploadImage(

        formData.authorImage

      );

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

  catch(err){

    console.log(err);

  }

}
    if (loading) {

        return (

            <div className="h-screen flex items-center justify-center">

                Loading...

            </div>

        );

    }
    return (

        <div className="min-h-screen md:ml-64 pt-28 px-6 pb-12">

            <motion.div

                initial={{ opacity: 0, y: 15 }}

                animate={{ opacity: 1, y: 0 }}

                className="max-w-6xl mx-auto"

            >
                {/* ================= Header ================= */}

                <div className="flex justify-between items-start mb-10">

                    <div>

                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-5"
                        >
                            <FiArrowLeft />
                            Back to Case Studies
                        </button>

                        <h1 className="text-4xl font-bold">

                            Edit Case Study

                        </h1>

                        <p className="text-gray-400 mt-3">
                            Create a professional case study showcasing your
                            successful consultancy project.
                        </p>

                    </div>

                </div>

                {/* ================= Basic Information ================= */}

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8">

                    <h2 className="text-2xl font-semibold mb-8">
                        Basic Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Title */}

                        <div>

                            <label className="block mb-2 text-gray-300">
                                Case Study Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Digital Transformation for ABC Manufacturing"
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Author Name */}

                        <div>

                            <label className="block mb-2 text-gray-300">
                                Author Name *
                            </label>

                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="John Smith"
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
                            />
                            {errors.author && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.author}
                                </p>
                            )}
                        </div>

                        {/* Author Role */}

                        <div>

                            <label className="block mb-2 text-gray-300">
                                Author Role *
                            </label>

                            <input
                                type="text"
                                name="authorRole"
                                value={formData.authorRole}
                                onChange={handleChange}
                                placeholder="Senior Business Consultant"
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
                            />
                            {errors.authorRole && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.authorRole}
                                </p>
                            )}
                        </div>

                        {/* Project Duration */}

                        <div>

                            <label className="block mb-2 text-gray-300">
                                Project Duration *
                            </label>

                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="6 Months"
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
                            />
                            {errors.duration && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.duration}
                                </p>
                            )}
                        </div>

                        {/* Category */}

                        <div className="md:col-span-2">

                            <label className="block mb-2 text-gray-300">
                                Category *
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Finance">
                                    Finance
                                </option>

                                <option value="Healthcare">
                                    Healthcare
                                </option>

                                <option value="Technology">
                                    Tech
                                </option>

                                <option value="Retail">
                                    Retail
                                </option>

                            </select>
                            {errors.category && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                    </div>

                </div>
                {/* ================= Media Upload ================= */}

                <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8">

                    <h2 className="text-2xl font-semibold mb-8">
                        Media
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* Cover Image */}

                        <div>

                            <label className="block mb-3 text-gray-300">
                                Cover Image *
                            </label>

                            <label className="border-2 border-dashed border-slate-600 hover:border-blue-500 transition rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer">

                                <FiUpload className="text-5xl text-blue-500 mb-4" />

                                <p className="text-gray-300 font-medium">
                                    Click to Upload Cover Image
                                </p>

                                <p className="text-sm text-gray-500 mt-2">
                                    JPG, PNG or WEBP
                                </p>

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImage}
                                />
                                {errors.coverImage && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.coverImage}
                                    </p>
                                )}
                            </label>

                            {formData.coverImage && (

                                <div className="mt-5">

                                    <img

                                        src={
                                            typeof formData.coverImage === "string"
                                                ? formData.coverImage
                                                : URL.createObjectURL(formData.coverImage)
                                        }

                                        className="w-full h-64 rounded-xl object-cover"

                                    />

                                </div>

                            )}

                        </div>

                        {/* Author Image */}

                        <div>

                            <label className="block mb-3 text-gray-300">
                                Author Image *
                            </label>

                            <label className="border-2 border-dashed border-slate-600 hover:border-blue-500 transition rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer">

                                <FiUpload className="text-5xl text-blue-500 mb-4" />

                                <p className="text-gray-300 font-medium">
                                    Click to Upload Author Image
                                </p>

                                <p className="text-sm text-gray-500 mt-2">
                                    JPG, PNG or WEBP
                                </p>

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAuthorImage}
                                />
                                {errors.authorImage && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.authorImage}
                                    </p>
                                )}
                            </label>

                            {formData.authorImage && (

                                <div className="mt-5 flex justify-center">

                                    <img

                                        src={
                                            typeof formData.authorImage === "string"
                                                ? formData.authorImage
                                                : URL.createObjectURL(formData.authorImage)
                                        }

                                        className="w-48 h-48 rounded-full object-cover"

                                    />

                                </div>

                            )}

                        </div>

                    </div>

                </div>
                {/* ================= Case Study Content ================= */}

                <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8">

                    <h2 className="text-2xl font-semibold mb-8">
                        Case Study Content
                    </h2>

                    <div className="space-y-8">

                        {/* Summary */}

                        <div>

                            <label className="block mb-3 text-gray-300">
                                Summary of Case Study *
                            </label>

                            <textarea
                                rows={5}
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                placeholder="Provide a concise overview of the project, the client’s objectives, and the overall outcome."
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500 resize-none"
                            />
                            {errors.summary && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.summary}
                                </p>
                            )}
                        </div>

                        {/* Business Challenges */}

                        <div>

                            <label className="block mb-3 text-gray-300">
                                Business Challenges *
                            </label>

                            <textarea
                                rows={6}
                                name="challenges"
                                value={formData.challenges}
                                onChange={handleChange}
                                placeholder="Describe the challenges, pain points, and business problems faced by the client before the project."
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500 resize-none"
                            />
                            {errors.challenges && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.challenges}
                                </p>
                            )}
                        </div>

                        {/* Results & Impact */}

                        <div>

                            <label className="block mb-3 text-gray-300">
                                Results & Impact *
                            </label>

                            <textarea
                                rows={6}
                                name="results"
                                value={formData.results}
                                onChange={handleChange}
                                placeholder="Describe the improvements, measurable outcomes, ROI, business growth, and overall impact after implementing the solution."
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500 resize-none"
                            />
                            {errors.results && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.results}
                                </p>
                            )}
                        </div>

                    </div>

                </div>
                {/* ================= Author Information ================= */}

                <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8">

                    <h2 className="text-2xl font-semibold mb-8">
                        Author Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Author Website */}

                        <div>

                            <label className="block mb-2 text-gray-300">
                                Author Website
                            </label>

                            <input
                                type="url"
                                name="authorWebsite"
                                value={formData.authorWebsite}
                                onChange={handleChange}
                                placeholder="https://www.yourwebsite.com"
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
                            />

                        </div>

                    </div>

                </div>

                {/* ================= Action Buttons ================= */}

                <div className="flex justify-end gap-4 mt-10">
                    <button
                        className="px-6 py-3 rounded-xl border border-slate-600"


                        onClick={() => navigate(-1)}

                    >

                        Cancel

                    </button>

                    <button

                        onClick={handleUpdate}
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl"

                    >

                        Update Case Study

                    </button>

                </div>
            </motion.div>

        </div>

    );

};

export default EditCaseStudy;
