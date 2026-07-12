const c = require('cloudinary').v2; 
require('dotenv').config(); 
c.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
}); 
c.api.upload_presets().then(res => { 
  const unsigned = res.presets.find(p => p.unsigned); 
  if (unsigned) { 
    console.log('PRESET:' + unsigned.name); 
  } else { 
    c.api.create_upload_preset({name: 'strivo_unsigned', unsigned: true}).then(np => console.log('PRESET:' + np.name)); 
  } 
}).catch(console.error);
