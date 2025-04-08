import React, { useState } from 'react';
import './DateSelector.css';

const DateSelector = ({ onDateSelect, selectedDate }) => {
    const [showCalendarPopup, setShowCalendarPopup] = useState(false);

    // Generate next 30 days instead of just 7
    const getDates = () => {
        const dates = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    return (
        <div className="date-selector">
            <div className="date-scroll">
                {getDates().map((date) => (
                    <button
                        key={date.toISOString()}
                        className={`date-button ${date.toDateString() === selectedDate?.toDateString() ? 'selected' : ''}`}
                        onClick={() => onDateSelect(date)}
                    >
                        <span className="day-number">{date.getDate()}</span>
                        <span className="day-name">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                    </button>
                ))}
            </div>

            <button
                className="calendar-button"
                onClick={() => setShowCalendarPopup(true)}
            >
                {/* Remove the 📅 emoji from here */}
            </button>

            {showCalendarPopup && (
                <div className="calendar-popup">
                    <div className="calendar-popup-content">
                        <button
                            className="close-button"
                            onClick={() => setShowCalendarPopup(false)}
                        >
                            ×
                        </button>
                        {/* Calendar popup content here */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateSelector; 