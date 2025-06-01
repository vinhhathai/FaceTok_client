import { useState, useEffect } from 'react';

/**
 * Custom hook để tạo giá trị debounced từ một giá trị đầu vào.
 * Thường được sử dụng cho tìm kiếm để tránh gửi quá nhiều yêu cầu khi người dùng đang gõ.
 * 
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian trì hoãn tính bằng mili giây
 * @returns {any} Giá trị đã được debounced
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Khởi tạo timer để cập nhật giá trị debounced sau một khoảng thời gian
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Xóa timer nếu giá trị thay đổi hoặc component unmount
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 