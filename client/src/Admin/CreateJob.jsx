import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'sonner';
import { createJobAPI } from '../services/allApi';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    jobType: 'Full Time',
    status: 'Active',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Job Title is required.");
      return;
    }
    if (!formData.department.trim()) {
      toast.error("Department is required.");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Job Description is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await createJobAPI(formData);
      if (response.status === 201 && response.data?.success) {
        toast.success("Job listing created successfully!");
        navigate('/admin/career');
      } else {
        toast.error(response.data?.message || "Failed to create job listing.");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("An error occurred while creating the job listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-8 md:px-16 lg:px-24 bg-sub" style={{ fontFamily: 'var(--font-primary)' }}>
      <div className="max-w-3xl mx-auto">
        
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate('/admin/career')}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] hover:opacity-85 transition mb-6 cursor-pointer bg-transparent border-none p-0"
        >
          <FiArrowLeft size={14} /> Back to Careers
        </button>

        {/* Heading */}
        <div className="mb-8 text-left">
          <h1 className="text-2xl font-[var(--font-bold)] text-primary uppercase" style={{ margin: 0 }}>
            CREATE NEW JOB LISTING
          </h1>
          <p className="text-xs text-[var(--color-black)] font-medium opacity-60 mt-2" style={{ margin: 0 }}>
            List a new career position open at Fontend Technologies.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="bg-white p-8 border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-sm text-left flex flex-col gap-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-black)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g. Technology"
                  className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-black)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Kochi, Kerala"
                  className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-black)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider">
                  Job Type *
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-black)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200 cursor-pointer h-10"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-black)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200 cursor-pointer h-10"
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[var(--color-black)] font-semibold mb-2 block text-xs uppercase tracking-wider">
                Job Description & Requirements *
              </label>
              <textarea
                name="description"
                rows={10}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe role responsibilities, required skills, experience level, and qualifications..."
                className="w-full bg-[var(--color-sub-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-black)] focus:outline-none focus:border-[var(--color-primary)] hover:bg-white focus:bg-white transition-all duration-200"
              />
            </div>
            {/* Action Buttons inside the white box */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t border-[var(--color-border)]/50 mt-2">
              <button
                type="button"
                onClick={() => navigate('/admin/career')}
                className="border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center bg-transparent"
                style={{ height: '34px', padding: '0 16px', fontFamily: 'var(--font-primary)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center transition border-none"
                style={{ height: '34px', padding: '0 16px', fontFamily: 'var(--font-primary)' }}
              >
                {loading ? "Creating..." : "Create Job"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
