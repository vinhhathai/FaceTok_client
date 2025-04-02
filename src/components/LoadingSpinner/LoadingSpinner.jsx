import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner component hiển thị khi đang tải dữ liệu
 * @param {Object} props - Component props
 * @param {string} props.size - Kích thước spinner: 'small', 'medium', or 'large'
 * @param {string} props.color - Màu sắc của spinner
 * @param {string} props.text - Văn bản hiển thị dưới spinner
 * @param {boolean} props.fullScreen - Nếu true, spinner sẽ hiển thị ở giữa màn hình
 */
const LoadingSpinner = ({ size = 'medium', color = 'primary', text, fullScreen }) => {
  const spinnerClasses = [
    'spinner-border',
    size === 'small' ? 'spinner-border-sm' : '',
    size === 'large' ? 'spinner-border-lg' : '',
    `text-${color}`
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'loading-spinner-container',
    fullScreen ? 'loading-fullscreen' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="spinner-wrapper">
        <div className={spinnerClasses} role="status">
          <span className="sr-only">Loading...</span>
        </div>
        {text && <p className="spinner-text mt-2">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner; 