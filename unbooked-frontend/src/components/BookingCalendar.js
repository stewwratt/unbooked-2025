import React, { useState } from 'react';
import DateSelector from './DateSelector';
import './BookingCalendar.css';
import placeholder from '../assets/placeholder.png';

const BookingCalendar = ({ totalDuration, onBack }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isFullyBooked, setIsFullyBooked] = useState(false);

    // Mock provider data
    const provider = {
        name: "Danny",
        avatar: placeholder
    };

    const availableSlots = [
        { time: '12:30 pm', available: true },
        { time: '2:00 pm', available: true },
        { time: '2:30 pm', available: true }
    ];

    return (
        <div className="booking-calendar">
            <div className="header">
                <button onClick={onBack} className="back-button">
                    ←
                </button>
                <h1 className="page-title">Select time</h1>
            </div>
            <div className="provider-selector">
                <button className="provider-button">
                    <span className="provider-name">{provider.name}</span>
                    <span className="provider-arrow">▼</span>
                </button>
            </div>
            <DateSelector
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
            />
            <div className="time-slots">
                {availableSlots.map((slot, index) => (
                    <button
                        key={index}
                        className={`time-slot ${!slot.available ? 'unavailable' : ''}`}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BookingCalendar;

