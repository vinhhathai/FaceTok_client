/**
 * Các hàm tiện ích xử lý định dạng ngày tháng
 */

// Format date string to DD/MM/YYYY for input
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Format input date (DD/MM/YYYY) to YYYY-MM-DD string for API
const formatDateForApi = (dateString) => {
  if (!dateString) return null;
  
  // Split the DD/MM/YYYY format into parts
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    
    // Validate day, month, year
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }
    
    // Validate ranges
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      return null;
    }
    
    return `${year}-${month}-${day}`;
  }
  
  // If date is already in YYYY-MM-DD format
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (isoPattern.test(dateString)) {
    return dateString;
  }
  
  // Invalid format
  return null;
};

export const formatDateUtils = {
  formatDateForInput,
  formatDateForApi
};