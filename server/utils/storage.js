const supabase = require('../config/supabase');

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} filePath - Path where file will be stored (e.g., 'profiles/user-123.jpg')
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>} - URL of the uploaded file
 */
const uploadFile = async (fileBuffer, filePath, contentType) => {
  try {
    // Use a consistent bucket name - 'financemate'
    const bucketName = 'financemate';
    
    const { data, error } = await supabase.storage
      .from(bucketName) // bucket name - make sure to create this in Supabase dashboard
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true // overwrite if file exists
      });

    if (error) throw new Error(error.message);
    
    // Get public URL - using the same bucket name
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - Path of file to delete
 * @returns {Promise<boolean>} - Success status
 */
const deleteFile = async (filePath) => {
  try {
    // Use a consistent bucket name
    const bucketName = 'financemate';
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get signed URL for temporary access to a file
 * @param {string} filePath - Path of file
 * @param {number} expiresIn - Expiration time in seconds
 * @returns {Promise<string>} - Signed URL
 */
const getSignedUrl = async (filePath, expiresIn = 60) => {
  try {
    // Use a consistent bucket name
    const bucketName = 'financemate';
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);
    
    if (error) throw new Error(error.message);
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getSignedUrl
};