import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const streamUpload = (buffer, applicantName) => {
  return new Promise((resolve, reject) => {
    const cleanName = applicantName ? applicantName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() : 'applicant';
    const fileName = `${cleanName}_resume_${Date.now()}`;
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "strivo_resumes",
        public_id: fileName
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

(async () => {
  try {
    const dummyBuffer = Buffer.from('dummy file content');
    const result = await streamUpload(dummyBuffer, 'test_applicant');
    console.log('Success:', result.secure_url);
  } catch (error) {
    console.error('Error:', error);
  }
})();
