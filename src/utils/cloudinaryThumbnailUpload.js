/**
 * Upload thumbnail to Cloudinary directly from browser
 * @param {File} file - The file to upload
 * @param {Function} progressCallback - Optional callback for progress updates
 * @returns {Promise<string>} - Cloudinary URL
 */
export const uploadThumbnailToCloudinary = async (file, progressCallback = null) => {
  // Cloudinary upload preset - Đây là tên upload preset trong Cloudinary dashboard
  // Phải là unsigned preset và đã được tạo trong dashboard
  const CLOUDINARY_UPLOAD_PRESET = 'facetok_unsigned';
  
  // Cloudinary cloud name từ tài khoản của bạn
  const CLOUDINARY_CLOUD_NAME = 'dzzvpvemu';
  
  // Cloudinary API URL
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  console.log('Cloudinary config:', {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    url: url
  });
  
  try {
    if (!file) {
      throw new Error("No file provided for upload");
    }
    
    // Tạo Form Data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    // Thêm folder để phân loại trong Cloudinary
    formData.append('folder', 'thumbnails');
    
    // Log thông tin upload
    console.log("Uploading thumbnail to Cloudinary:", {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Upload sử dụng fetch API thay vì XMLHttpRequest
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudinary upload failed:", errorText);
        throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Thumbnail uploaded successfully to Cloudinary:", data);
      
      // Kiểm tra và log URL
      if (data.secure_url) {
        console.log("Secure URL received:", data.secure_url);
        return data.secure_url;
      } else {
        console.error("No secure_url in response:", data);
        throw new Error("No secure_url in Cloudinary response");
      }
    } catch (fetchError) {
      console.error("Fetch error during Cloudinary upload:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}; 