import React, { useState } from 'react';
import DateSelector from './DateSelector';
import './BookingCalendar.css';
import placeholder from '../assets/placeholder.png';

const BookingCalendar = ({ totalDuration, onBack, professional }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(professional);

    // Mock providers data
    const providers = [
        { id: 1, name: "Danny", avatar: placeholder },
        { id: 2, name: "Sarah", avatar: placeholder },
        { id: 3, name: "Michael", avatar: placeholder }
    ];

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
                <button
                    className={`provider-button ${isDropdownOpen ? 'open' : ''}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <div className="provider-image">
                        <img src={selectedProvider.avatar} alt={selectedProvider.name} />
                    </div>
                    <span className="provider-name">{selectedProvider.name}</span>
                    <span className="provider-arrow">▼</span>
                </button>
                <div className={`provider-dropdown ${isDropdownOpen ? 'visible' : ''}`}>
                    {providers.map(provider => (
                        <button
                            key={provider.id}
                            className="provider-option"
                            onClick={() => {
                                setSelectedProvider(provider);
                                setIsDropdownOpen(false);
                            }}
                        >
                            <div className="provider-image">
                                <img src={provider.avatar} alt={provider.name} />
                            </div>
                            <span className="provider-name">{provider.name}</span>
                        </button>
                    ))}
                </div>
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

