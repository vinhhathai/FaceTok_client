import React, { useState, useEffect } from 'react';
import { InputLabel, MenuItem, FormHelperText, Typography, Box } from '@mui/material';
import { DateSelectorContainer, DateFormControl, DateSelect } from './styles';

function DayMonthYear({ onDayMonthYearChange }) {
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [dayMonthYear, setDayMonthYear] = useState('');

    useEffect(() => {
        if (selectedDay && selectedMonth && selectedYear) {
            const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
            // Validate day based on selected month and year
            if (date.getDate() !== parseInt(selectedDay, 10)) {
                setErrorMessage('Invalid date for the selected month and year.');
                setSelectedDate(null);
                setDayMonthYear('');
            } else {
                setSelectedDate(date);
                setErrorMessage('');
            }
        } else {
            setSelectedDate(null);
            setDayMonthYear('');
        }
    }, [selectedDay, selectedMonth, selectedYear]);

    useEffect(() => {
        if (selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString('en-GB');
            setDayMonthYear(formattedDate);
        } else {
            setDayMonthYear('');
        }
    }, [selectedDate]);

    useEffect(() => {
        onDayMonthYearChange(dayMonthYear);
    }, [dayMonthYear, onDayMonthYearChange]);

    const daysInMonth = (month, year) => {
        if (!month || !year) return 31; // Default to 31 if month/year not set
        return new Date(year, month, 0).getDate();
    };

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
        setErrorMessage(''); // Reset error on change
    };

    const handleMonthChange = (event) => {
        const newMonth = event.target.value;
        setSelectedMonth(newMonth);
        // If day is already selected, re-validate it
        if (selectedDay) {
            const maxDays = daysInMonth(newMonth, selectedYear);
            if (parseInt(selectedDay, 10) > maxDays) {
                setSelectedDay(''); // Reset day if invalid
            }
        }
        setErrorMessage('');
    };

    const handleYearChange = (event) => {
        const newYear = event.target.value;
        setSelectedYear(newYear);
        // If day and month are selected, re-validate day
        if (selectedDay && selectedMonth) {
            const maxDays = daysInMonth(selectedMonth, newYear);
            if (parseInt(selectedDay, 10) > maxDays) {
                setSelectedDay(''); // Reset day if invalid
            }
        }
        setErrorMessage('');
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: daysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1);

    return (
        <Box sx={{ width: '100%' }}>
            <DateSelectorContainer>
                <DateFormControl error={!!errorMessage && !selectedDay}>
                    <InputLabel id="day-select-label">Day</InputLabel>
                    <DateSelect
                        labelId="day-select-label"
                        id="day-select"
                        value={selectedDay}
                        label="Day"
                        onChange={handleDayChange}
                        required
                        disabled={!selectedMonth || !selectedYear}
                    >
                        <MenuItem value="">
                            <em>Select Day</em>
                        </MenuItem>
                        {days.map(day => (
                            <MenuItem key={day} value={day}>{day}</MenuItem>
                        ))}
                    </DateSelect>
                    {errorMessage && !selectedDay && <FormHelperText>{errorMessage}</FormHelperText>}
                </DateFormControl>

                <DateFormControl error={!!errorMessage && !selectedMonth}>
                    <InputLabel id="month-select-label">Month</InputLabel>
                    <DateSelect
                        labelId="month-select-label"
                        id="month-select"
                        value={selectedMonth}
                        label="Month"
                        onChange={handleMonthChange}
                        required
                    >
                        <MenuItem value="">
                            <em>Select Month</em>
                        </MenuItem>
                        {months.map(month => (
                            <MenuItem key={month} value={month}>{month}</MenuItem>
                        ))}
                    </DateSelect>
                    {errorMessage && !selectedMonth && <FormHelperText>{errorMessage}</FormHelperText>}
                </DateFormControl>

                <DateFormControl error={!!errorMessage && !selectedYear}>
                    <InputLabel id="year-select-label">Year</InputLabel>
                    <DateSelect
                        labelId="year-select-label"
                        id="year-select"
                        value={selectedYear}
                        label="Year"
                        onChange={handleYearChange}
                        required
                    >
                        <MenuItem value="">
                            <em>Select Year</em>
                        </MenuItem>
                        {years.map(year => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </DateSelect>
                    {errorMessage && !selectedYear && <FormHelperText>{errorMessage}</FormHelperText>}
                </DateFormControl>
            </DateSelectorContainer>
            {errorMessage && selectedDay && selectedMonth && selectedYear && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {errorMessage}
                </Typography>
            )}
            {/* Optional: Display the selected date for debugging/confirmation */}
            {/* {selectedDate && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Selected Date: {selectedDate.toLocaleDateString('en-GB')}
                </Typography>
            )} */}
        </Box>
    );
}

export default DayMonthYear; 