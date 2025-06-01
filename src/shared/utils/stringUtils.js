/**
 * Lấy chữ cái đầu tiên của từng từ trong tên
 * @param {string} name - Tên đầy đủ
 * @param {number} maxChars - Số ký tự tối đa trả về
 * @returns {string} Chữ cái đầu tiên
 */
export const getInitials = (name, maxChars = 2) => {
  if (!name) return '';
  
  const names = name.trim().split(' ');
  
  // Nếu chỉ có một từ, lấy chữ cái đầu hoặc 2 chữ cái đầu
  if (names.length === 1) {
    if (names[0].length === 0) return '';
    return names[0].substring(0, Math.min(maxChars, names[0].length)).toUpperCase();
  }
  
  // Nếu có nhiều từ, lấy chữ cái đầu của từ đầu tiên và từ cuối cùng
  const firstInitial = names[0][0] || '';
  const lastInitial = names[names.length - 1][0] || '';
  
  return (firstInitial + lastInitial).toUpperCase();
};

/**
 * Rút gọn chuỗi với dấu ... nếu quá dài
 * @param {string} str - Chuỗi cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} Chuỗi đã rút gọn
 */
export const truncateString = (str, maxLength) => {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}; 