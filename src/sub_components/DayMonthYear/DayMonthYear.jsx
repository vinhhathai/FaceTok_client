import React, { useState, useEffect } from 'react';

function DayMonthYear({onDayMonthYearChange}) {
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [dayMonthYear, setDayMonthYear] = useState('');

    useEffect(() => {
        if (selectedDay && selectedMonth && selectedYear) {
            const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
            setSelectedDate(date);
        } else {
            setSelectedDate(null);
        }
    }, [selectedDay, selectedMonth, selectedYear]);

    useEffect(() => {
        if (selectedDate !== null) {
            setDayMonthYear(selectedDate.toLocaleDateString('en-GB'));
        }
    }, [selectedDate]);

    useEffect(() => {
        console.log(dayMonthYear);
        onDayMonthYearChange(dayMonthYear); 
    }, [dayMonthYear, onDayMonthYearChange]);

    const daysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    const handleDayChange = (event) => {
        const selected = parseInt(event.target.value);
        const maxDays = daysInMonth(selectedMonth, selectedYear);
        if (selected > maxDays || selected < 1) {
            setErrorMessage('Invalid date!');
        } else {
            setSelectedDay(selected);
            setErrorMessage('');
        }
    };

    const handleMonthChange = (event) => {
        const selected = parseInt(event.target.value);
        if (selected < 1 || selected > 12) {
            setErrorMessage('Invalid month!');
        } else {
            setSelectedMonth(selected);
            setErrorMessage('');
        }
    };

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
        setErrorMessage('');
    };

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
        <>
            <div className="col-md-4">
                <div className="form-group">
                    <select value={selectedDay} onChange={handleDayChange} className="form-control" required>
                        <option value="">- Select Day -</option>
                        {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="col-md-4">
                <div className="form-group">
                    <select value={selectedMonth} onChange={handleMonthChange} className="form-control" required>
                        <option value="">- Select Month -</option>
                        {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="col-md-4">
                <div className="form-group">
                    <select value={selectedYear} onChange={handleYearChange} className="form-control" required>
                        <option value="">- Select Year -</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
            {selectedDate && (
                <div className="col-md-12">
                    <p>Selected Date: {selectedDate.toLocaleDateString('en-GB')}</p>
                </div>
            )}
            {errorMessage && (
                <div className="col-md-12">
                    <p className="text-danger">{errorMessage}</p>
                </div>
            )}
        </>
    );
}

export default DayMonthYear;
