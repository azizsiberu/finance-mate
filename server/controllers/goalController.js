const { uploadFile } = require('../utils/storage');
const Goal = require('../models/Goal');

/**
 * Upload file for a goal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadGoalFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const goalId = req.params.goalId;
    const fileBuffer = req.file.buffer;
    const filePath = `goals/${goalId}-${Date.now()}.jpg`;
    const contentType = req.file.mimetype;

    // Upload file to Supabase Storage
    const publicUrl = await uploadFile(fileBuffer, filePath, contentType);

    // Update goal file URL in the database
    await Goal.update(goalId, { fileUrl: publicUrl });

    res.status(200).json({ message: 'Goal file uploaded successfully', url: publicUrl });
  } catch (error) {
    console.error('Error uploading goal file:', error);
    res.status(500).json({ error: 'Failed to upload goal file' });
  }
};

module.exports = {
  uploadGoalFile,
};