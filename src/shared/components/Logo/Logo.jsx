import React from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import styles from './Logo.module.css';

const Logo = ({ size = 'medium', showText = true, ...props }) => {
  const sizeClassMap = {
    small: styles.logoImageSmall,
    medium: styles.logoImageMedium,
    large: styles.logoImageLarge,
  };

  const textSizeClassMap = {
    small: styles.logoTextSmall,
    medium: styles.logoTextMedium,
    large: styles.logoTextLarge,
  };

  return (
    <div className={styles.logoContainer} {...props}>
      <img
        src="/assets/logo.png"
        alt="Chaotok Logo"
        className={`${styles.logoImage} ${sizeClassMap[size]}`}
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
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showText: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo; 