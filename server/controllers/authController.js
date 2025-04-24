const { uploadFile } = require('../utils/storage');
const User = require('../models/User');

/**
 * Upload profile picture
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user.userId;
    const fileBuffer = req.file.buffer;
    const filePath = `profiles/${userId}-${Date.now()}.jpg`;
    const contentType = req.file.mimetype;

    // Upload file to Supabase Storage
    const publicUrl = await uploadFile(fileBuffer, filePath, contentType);

    // Update user profile picture URL in the database
    await User.update(userId, { profilePicture: publicUrl });

    res.status(200).json({ message: 'Profile picture uploaded successfully', url: publicUrl });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};

module.exports = {
  // ...existing exports...
  uploadProfilePicture,
};