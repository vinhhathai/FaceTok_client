import React from 'react';
import PropTypes from 'prop-types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import {
  UpdateCoverButton,
  MobileUpdateButton,
  UploadInput
} from './UpdateButtons.styles';

const UpdateButtons = ({ 
  isMobile, 
  isUploading, 
  onFileChange 
}) => {
  return (
    <>
      {/* Desktop update button */}
      {!isMobile && (
        <UpdateCoverButton
          variant="contained"
          component="label"
          startIcon={<CameraAltIcon />}
          disabled={isUploading}
        >
          Cập nhật ảnh bìa
          <UploadInput
            accept="image/*"
            type="file"
            onChange={onFileChange}
            disabled={isUploading}
          />
        </UpdateCoverButton>
      )}
      
      {/* Mobile update button - bottom right corner */}
      {isMobile && (
        <MobileUpdateButton
          component="label"
          disabled={isUploading}
          aria-label="Cập nhật ảnh bìa"
        >
          <CameraAltIcon sx={{ fontSize: 16 }} />
          <UploadInput
            accept="image/*"
            type="file"
            onChange={onFileChange}
            disabled={isUploading}
          />
        </MobileUpdateButton>
      )}
    </>
  );
};

UpdateButtons.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isUploading: PropTypes.bool,
  onFileChange: PropTypes.func.isRequired
};

UpdateButtons.defaultProps = {
  isUploading: false
};

export default UpdateButtons; 