import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const BioInput = ({ value, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const bioValue = value || '';
  
  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Giới thiệu về bản thân"
        value={bioValue}
        onChange={onChange}
        variant="outlined"
        multiline
        rows={isMobile ? 3 : 4}
        inputProps={{ maxLength: 500 }}
        helperText={`${bioValue.length}/500 ký tự`}
        error={bioValue.length > 500}
        sx={{ mb: 2 }}
      />
    </Grid>
  );
};

BioInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default BioInput; 