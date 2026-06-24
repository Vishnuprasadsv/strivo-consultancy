import SuccessStory from '../models/SuccessStory.js';

export const createStory = async (req, res) => {
  try {
    const { name, position, clientStories } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Since we are using local storage, construct the URL based on the filename
    const imageUrl = `http://localhost:5000/uploads/success_stories/${req.file.filename}`;

    const newStory = new SuccessStory({
      name,
      position,
      clientStories,
      imageUrl
    });

    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    console.error('Error creating success story:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    res.status(200).json(stories);
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStory = await SuccessStory.findByIdAndDelete(id);
    
    if (!deletedStory) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting success story:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
