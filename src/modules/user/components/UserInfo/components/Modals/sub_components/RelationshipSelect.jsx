import React from 'react';
import PropTypes from 'prop-types';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const RelationshipSelect = ({ value, onChange }) => {
  return (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel>Tình trạng mối quan hệ</InputLabel>
        <Select
          value={value || ''}
          label="Tình trạng mối quan hệ"
          onChange={onChange}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return 'Không xác định';
            }
            
            // Hiển thị tên tương ứng với giá trị
            switch(selected) {
              case 'single': return 'Độc thân';
              case 'relationship': return 'Đang trong mối quan hệ';
              case 'married': return 'Đã kết hôn';
              default: return selected;
            }
          }}
        >
          <MenuItem value="">Không xác định</MenuItem>
          <MenuItem value="single">Độc thân</MenuItem>
          <MenuItem value="relationship">Đang trong mối quan hệ</MenuItem>
          <MenuItem value="married">Đã kết hôn</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

RelationshipSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default RelationshipSelect; 