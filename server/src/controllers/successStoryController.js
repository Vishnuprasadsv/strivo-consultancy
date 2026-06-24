import SuccessStory from '../models/SuccessStory.js';
import { v2 as cloudinary } from 'cloudinary';

export const createStory = async (req, res) => {
  try {
    const { name, position, clientStories } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // With multer-storage-cloudinary, req.file.path contains the Cloudinary URL.
    const imageUrl = req.file.path;
    const imageId = req.file.filename; // public_id

    const newStory = new SuccessStory({
      name,
      position,
      clientStories,
      imageUrl,
      imageId
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
    
    const story = await SuccessStory.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Delete image from Cloudinary
    if (story.imageId) {
      try {
        await cloudinary.uploader.destroy(story.imageId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
      }
    } else if (story.imageUrl && story.imageUrl.includes('cloudinary.com')) {
      // Fallback extraction for old Cloudinary URLs without imageId
      const urlParts = story.imageUrl.split('/');
      const filenameAndExtension = urlParts[urlParts.length - 1];
      const filename = filenameAndExtension.split('.')[0];
      const folderName = urlParts[urlParts.length - 2];
      const publicId = `${folderName}/${filename}`;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary fallback:', cloudinaryError);
      }
    }

    await SuccessStory.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting success story:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
