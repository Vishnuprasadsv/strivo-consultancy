import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'sonner';
import { getJobsAPI, updateJobAPI } from '../services/allApi';

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    jobType: 'Full Time',
    status: 'Active',
    description: ''
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await getJobsAPI();
        if (response.status === 200 && response.data) {
          const jobsList = response.data.data || response.data;
          const job = Array.isArray(jobsList) ? jobsList.find(j => j._id === id) : null;
          if (job) {
            setFormData({
              title: job.title || '',
              department: job.department || '',
              location: job.location || '',
              jobType: job.jobType || 'Full Time',
              status: job.status || 'Active',
              description: job.description || ''
            });
          } else {
            toast.error("Job listing not found.");
          }
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        toast.error("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

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

    setSaving(true);
    try {
      const response = await updateJobAPI(id, formData);
      if (response.status === 200 && response.data?.success) {
        toast.success("Job listing updated successfully!");
        navigate('/admin/career');
      } else {
        toast.error(response.data?.message || "Failed to update job listing.");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("An error occurred while updating the job listing.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center bg-sub">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            EDIT JOB LISTING
          </h1>
          <p className="text-xs text-[var(--color-black)] font-medium opacity-60 mt-2" style={{ margin: 0 }}>
            Update career listing details for Fontend Technologies.
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
                disabled={saving}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold cursor-pointer rounded-[var(--radius-sm)] text-xs flex items-center justify-center transition border-none"
                style={{ height: '34px', padding: '0 16px', fontFamily: 'var(--font-primary)' }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
