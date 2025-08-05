import React from 'react';
import PropTypes from 'prop-types';
import { Avatar as MuiAvatar } from '@mui/material';
import { getInitials } from '@utils/stringUtils';

/**
 * Custom Avatar component với các tùy chọn kích thước
 */
const Avatar = ({ src, alt, size = 40, variant = 'circular', ...props }) => {
  const initials = alt ? getInitials(alt) : '';
  
  return (
    <MuiAvatar 
      src={src} 
      alt={alt}
      variant={variant}
      sx={{ 
        width: size, 
        height: size,
        fontSize: size * 0.4,
        bgcolor: !src ? 'primary.main' : undefined,
        ...props.sx 
      }}
      {...props}
    >
      {!src && initials}
    </MuiAvatar>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.number,
  variant: PropTypes.oneOf(['circular', 'rounded', 'square']),
  sx: PropTypes.object
};

export default Avatar; 