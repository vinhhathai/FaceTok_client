import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const BirthdaySelect = ({ birthdayParts, handleBirthdayChange }) => {
  const currentYear = new Date().getFullYear();
  
  // Đảm bảo birthdayParts không bị null/undefined
  const parts = birthdayParts || { day: '', month: '', year: '' };
  
  return (
    <Grid item xs={12}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Sinh nhật</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="day-select-label">Ngày</InputLabel>
            <Select
              labelId="day-select-label"
              id="day-select"
              value={parts.day || ''}
              label="Ngày"
              onChange={handleBirthdayChange('day')}
            >
              <MenuItem value="">
                <em>--</em>
              </MenuItem>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <MenuItem key={`day-${day}`} value={String(day).padStart(2, '0')}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="month-select-label">Tháng</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={parts.month || ''}
              label="Tháng"
              onChange={handleBirthdayChange('month')}
            >
              <MenuItem value="">
                <em>--</em>
              </MenuItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <MenuItem key={`month-${month}`} value={String(month).padStart(2, '0')}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="year-select-label">Năm</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={parts.year || ''}
              label="Năm"
              onChange={handleBirthdayChange('year')}
            >
              <MenuItem value="">
                <em>--</em>
              </MenuItem>
              {Array.from(
                { length: currentYear - 1900 + 1 }, 
                (_, i) => currentYear - i
              ).map(year => (
                <MenuItem key={`year-${year}`} value={String(year)}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

BirthdaySelect.propTypes = {
  birthdayParts: PropTypes.shape({
    day: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string
  }),
  handleBirthdayChange: PropTypes.func.isRequired
};

export default BirthdaySelect; 