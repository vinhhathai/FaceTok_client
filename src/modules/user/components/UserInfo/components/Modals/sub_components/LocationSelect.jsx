import React from 'react';
import PropTypes from 'prop-types';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// Import danh sách tỉnh thành Việt Nam
import vietnamProvinces from '../../../../../../../shared/data/vietnamProvinces';

const LocationSelect = ({ value, onChange }) => {
  const provinces = Array.isArray(vietnamProvinces) ? vietnamProvinces : [];
  
  return (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel>Đang sống tại</InputLabel>
        <Select
          value={value || ''}
          label="Đang sống tại"
          onChange={onChange}
        >
          <MenuItem value="">Chọn tỉnh thành</MenuItem>
          {provinces.map((province) => (
            <MenuItem key={province.code || province.name} value={province.name}>
              {province.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

LocationSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default LocationSelect; 