import React from 'react';
import PropTypes from 'prop-types';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const GenderSelect = ({ value, onChange }) => {
  return (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel>Giới tính</InputLabel>
        <Select
          value={value || ''}
          label="Giới tính"
          onChange={onChange}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return 'Không xác định';
            }
            
            // Hiển thị tên tương ứng với giá trị
            switch(selected) {
              case 'male': return 'Nam';
              case 'female': return 'Nữ';
              case 'other': return 'Khác';
              default: return selected;
            }
          }}
        >
          <MenuItem value="">Không xác định</MenuItem>
          <MenuItem value="male">Nam</MenuItem>
          <MenuItem value="female">Nữ</MenuItem>
          <MenuItem value="other">Khác</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

GenderSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default GenderSelect; 