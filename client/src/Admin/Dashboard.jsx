import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import DeleteIcon from '@mui/icons-material/Delete';

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  // Simulated backend data state (ready to connect)
  const [metrics, setMetrics] = useState({
    totalInquiries: 142,
    totalCaseStudies: 24,
    activeArticles: 56,
    newApplications: 12
  });

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    clientStories: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);

  const fetchStories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/success-stories');
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoadingStories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.position || !formData.clientStories || !formData.image) {
      toast.error('Please fill all fields and select an image');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('position', formData.position);
      data.append('clientStories', formData.clientStories);
      data.append('image', formData.image);

      await axios.post('http://localhost:5000/api/success-stories', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Client success story added successfully!');
      setFormData({ name: '', position: '', clientStories: '', image: null });
      document.getElementById('imageUpload').value = "";
      fetchStories(); // Refetch after adding
    } catch (error) {
      console.error(error);
      toast.error('Failed to add success story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/success-stories/${id}`);
      toast.success('Story deleted successfully');
      setStories(stories.filter(story => story._id !== id));
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin/login');
    } else {
      setAdminUser(JSON.parse(user));
      fetchStories();
    }
  }, [navigate]);

  if (!adminUser) return null;

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-8 relative z-10 md:ml-64">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-white/50 text-sm">Manage your platform data here</p>
          </div>
        </div>
        
        {/* Dashboard Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Inquiries */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/70 text-sm font-medium mb-1">Total Inquiries</h3>
            <p className="text-3xl font-bold text-blue-400">{metrics.totalInquiries}</p>
          </div>
          
          {/* Card 2: Total Case Studies */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/70 text-sm font-medium mb-1">Total Case Studies</h3>
            <p className="text-3xl font-bold text-purple-400">{metrics.totalCaseStudies}</p>
          </div>

          {/* Card 3: Active Articles */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/70 text-sm font-medium mb-1">Active Articles</h3>
            <p className="text-3xl font-bold text-emerald-400">{metrics.activeArticles}</p>
          </div>

          {/* Card 4: New Applications */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/70 text-sm font-medium mb-1">New Applications</h3>
            <p className="text-3xl font-bold text-amber-400">{metrics.newApplications}</p>
          </div>
        </div>

        {/* Add Success Story Form */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Add Client Success Story</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Client Story</label>
              <textarea 
                name="clientStories"
                value={formData.clientStories}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="Write the client's success story here..."
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="e.g. Sarah Johnson"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Position & Company</label>
                <input 
                  type="text" 
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="e.g. CEO, GlobalTech"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Client Image</label>
              <input 
                type="file" 
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors cursor-pointer"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Uploading...' : 'Submit Story'}
            </button>
          </form>
        </div>

        {/* Active Client Stories Section */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Active Client Stories</h2>
          
          {loadingStories ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : stories.length === 0 ? (
            <div className="p-8 text-center text-white/50 bg-black/20 rounded-xl border border-white/5">
              No stories to display
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div key={story._id} className="bg-black/20 border border-white/10 rounded-xl p-5 relative group transition-all hover:border-blue-500/30">
                  <button 
                    onClick={() => handleDelete(story._id)}
                    className="absolute top-4 right-4 text-white/40 hover:text-red-500 transition-colors z-10 p-2 bg-black/40 rounded-lg hover:bg-black/80 shadow-lg"
                    title="Delete Story"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <img src={story.imageUrl} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-white/10" />
                    <div>
                      <h3 className="text-white font-bold">{story.name}</h3>
                      <p className="text-white/50 text-sm">{story.position}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm italic line-clamp-4">
                    "{story.clientStories}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
