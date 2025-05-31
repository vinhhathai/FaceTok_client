import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { 
  BirthdaySelect,
  LocationSelect,
  GenderSelect,
  RelationshipSelect,
  BioInput
} from './index';

const ProfileForm = ({ 
  profileForm, 
  handleProfileFormChange, 
  birthdayParts,
  handleBirthdayChange
}) => {
  return (
    <Grid container spacing={2}>
      {/* Bio Input */}
      <BioInput 
        value={profileForm.bio} 
        onChange={handleProfileFormChange('bio')} 
      />
      
      {/* Location Select */}
      <LocationSelect 
        value={profileForm.location} 
        onChange={handleProfileFormChange('location')} 
      />
      
      {/* Gender Select */}
      <GenderSelect 
        value={profileForm.gender} 
        onChange={handleProfileFormChange('gender')} 
      />
      
      {/* Birthday Select */}
      <BirthdaySelect 
        birthdayParts={birthdayParts} 
        handleBirthdayChange={handleBirthdayChange} 
      />
      
      {/* Relationship Select */}
      <RelationshipSelect 
        value={profileForm.relationship} 
        onChange={handleProfileFormChange('relationship')} 
      />
    </Grid>
  );
};

ProfileForm.propTypes = {
  profileForm: PropTypes.shape({
    bio: PropTypes.string,
    location: PropTypes.string,
    gender: PropTypes.string,
    birthday: PropTypes.string,
    relationship: PropTypes.string
  }).isRequired,
  handleProfileFormChange: PropTypes.func.isRequired,
  birthdayParts: PropTypes.shape({
    day: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string
  }),
  handleBirthdayChange: PropTypes.func.isRequired
};

export default ProfileForm; 