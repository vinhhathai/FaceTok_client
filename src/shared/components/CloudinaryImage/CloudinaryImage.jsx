import React from 'react';
import PropTypes from 'prop-types';

/**
 * Wrapper component for Cloudinary images to handle tracking prevention warnings
 * Adds referrerPolicy and crossOrigin attributes to reduce browser warnings
 */
const CloudinaryImage = ({ src, alt, style, className, onError, ...props }) => {
  const handleError = (e) => {
    // Fallback to placeholder on error
    if (onError) {
      onError(e);
    }
  };

  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt || ''}
      style={style}
      className={className}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

CloudinaryImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  onError: PropTypes.func,
};

export default CloudinaryImage;
