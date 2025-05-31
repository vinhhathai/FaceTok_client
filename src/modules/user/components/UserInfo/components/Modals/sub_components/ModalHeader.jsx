import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { ModalTitle } from '../ProfileEditModal.styles';

const ModalHeader = ({ title }) => {
  return (
    <ModalTitle>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
    </ModalTitle>
  );
};

ModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ModalHeader; 