import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ProfileFullName, NameContainer } from '../ProfileHeader.styles';

const ProfileName = ({ fullName, isOwner, onEditName }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <NameContainer>
      <ProfileFullName variant={isMobile ? "h4" : "h5"}>
        {fullName}
      </ProfileFullName>
      
      {isOwner && (
        <IconButton 
          size="small" 
          sx={{ 
            ml: 0.5, 
            color: 'primary.main',
            padding: '4px',
          }}
          onClick={onEditName}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )}
    </NameContainer>
  );
};

ProfileName.propTypes = {
  fullName: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
  onEditName: PropTypes.func,
};

ProfileName.defaultProps = {
  isOwner: false,
  onEditName: () => {},
};

export default ProfileName; 