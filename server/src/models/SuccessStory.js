import mongoose from 'mongoose';

const successStorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  clientStories: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
  },
}, {
  timestamps: true
});

const SuccessStory = mongoose.model('SuccessStory', successStorySchema);
export default SuccessStory;
