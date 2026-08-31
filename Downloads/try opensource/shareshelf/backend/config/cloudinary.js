const cloudinary = require('cloudinary').v2;

const configCloudinary = () => {
  if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('Cloudinary configured');
  } else {
    console.log('Cloudinary not configured - using local storage fallback');
  }
};

module.exports = { cloudinary, configCloudinary };
