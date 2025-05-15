import React from 'react';
import { Avatar as MuiAvatar } from '@mui/material';
import PropTypes from 'prop-types';
import styles from './Avatar.module.css';

const Avatar = ({ src, alt, size = 'medium', ...props }) => {
  const defaultAvatar = '/assets/images/avatar_default.jpg';
  
  const sizeClassMap = {
    small: styles.avatarSmall,
    medium: styles.avatarMedium,
    large: styles.avatarLarge,
    xlarge: styles.avatarXLarge,
  };

  return (
    <MuiAvatar
      src={src || defaultAvatar}
      alt={alt || 'User Avatar'}
      className={`${styles.avatar} ${sizeClassMap[size]}`}
      {...props}
    />
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  sx: PropTypes.object,
};

export default Avatar; 