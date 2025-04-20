/**
 * Upload file to Cloudinary directly from browser
 * @param {File} file - The file to upload
 * @param {Function} progressCallback - Optional callback for progress updates
 * @returns {Promise<string>} - Cloudinary URL
 */
export const uploadToCloudinary = async (file, progressCallback = null) => {
  // Cloudinary upload preset - CLOUDINARY_UPLOAD_PRESET là một "unsigned upload preset" 
  // bạn cần tạo trong Cloudinary dashboard
  const CLOUDINARY_UPLOAD_PRESET = 'facetok_unsigned';
  
  // Cloudinary cloud name từ tài khoản của bạn
  const CLOUDINARY_CLOUD_NAME = 'dzzvpvemu';
  
  // Cloudinary API URL
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  try {
    if (!file) {
      throw new Error("No file provided for upload");
    }
    
    // Tạo Form Data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Log thông tin upload
    console.log("Uploading file to Cloudinary:", {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // XMLHttpRequest để theo dõi tiến trình
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Theo dõi tiến trình upload
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          console.log(`Upload progress: ${progress}%`);
          
          if (progressCallback) {
            progressCallback(progress);
          }
        }
      };
      
      // Xử lý khi upload hoàn thành
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log("File uploaded successfully to Cloudinary:", response.secure_url);
          resolve(response.secure_url);
        } else {
          console.error("Cloudinary upload failed:", xhr.responseText);
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };
      
      // Xử lý lỗi
      xhr.onerror = () => {
        console.error("Cloudinary upload error");
        reject(new Error("Failed to upload to Cloudinary"));
      };
      
      // Mở kết nối và gửi dữ liệu
      xhr.open('POST', url, true);
      xhr.send(formData);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}; 