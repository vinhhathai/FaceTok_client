import React, { useState } from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import styles from './Logo.module.css';

const Logo = ({ size = 'medium', showText = true, ...props }) => {
  const [imgError, setImgError] = useState(false);
  const logoPath = '/logo.webp'; // Logo is in the public root directory
  const fallbackLogoPath = '/logo.webp'; // Fallback to React default logo if main logo fails
  
  const sizeClassMap = {
    extraSmall: styles.logoImageExtraSmall,
    small: styles.logoImageSmall,
    medium: styles.logoImageMedium,
    large: styles.logoImageLarge,
  };

  const textSizeClassMap = {
    extraSmall: styles.logoTextExtraSmall,
    small: styles.logoTextSmall,
    medium: styles.logoTextMedium,
    large: styles.logoTextLarge,
  };

  const handleImageError = () => {
  // debug removed
    setImgError(true);
  };

  return (
    <div className={styles.logoContainer} {...props}>
      <img
        src={imgError ? fallbackLogoPath : logoPath}
        alt="Logo Chaotok"
        className={`${styles.logoImage} ${sizeClassMap[size]}`}
        onError={handleImageError}
      />
      {showText && (
        <Typography
          variant="h5"
          component="h1"
          className={`${styles.logoText} ${textSizeClassMap[size]}`}
        >
          Chaotok
        </Typography>
      )}
    </div>
  );
};

Logo.propTypes = {
  size: PropTypes.oneOf(['extraSmall', 'small', 'medium', 'large']),
  showText: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo; 