import React, { useState } from 'react';
import DateSelector from './DateSelector';
import './BookingCalendar.css';
import placeholder from '../assets/placeholder.jpg';

// Define the default provider
const defaultProvider = {
    id: 1,
    name: "Danny",
    avatar: "https://i.pravatar.cc/150?img=11",
};

const BookingCalendar = ({ totalDuration, onBack, professional }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(professional || defaultProvider);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    // Mock providers data
    const providers = [
        {
            id: 1,
            name: "Danny",
            avatar: "https://i.pravatar.cc/150?img=11",
        },
        {
            id: 2,
            name: "Sarah",
            avatar: "https://i.pravatar.cc/150?img=5",
        },
        // ... more providers
    ];

    // Mock data for available slots
    const getAvailableSlotsForDate = (date) => {
        // This would come from your backend in a real app
        return [
            {
                id: 1,
                time: "12:30 pm",
                available: true,
                status: "available",
                price: 120,
            },
            {
                id: 2,
                time: "2:00 pm",
                available: true,
                status: "offer-available",
                countdown: "4h 30m",
                price: 120,
                currentOffer: 145,
            },
            {
                id: 3,
                time: "2:30 pm",
                available: true,
                status: "available",
                price: 120,
            },
        ];
    };

    const availableSlots = getAvailableSlotsForDate(selectedDate);

    const handleTimeSlotSelect = (slot) => {
        if (slot.available) {
            setSelectedTimeSlot(slot);
        }
    };

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
                    {providers
                        .filter(provider => provider.id !== selectedProvider.id)
                        .map(provider => (
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
                {availableSlots.map((slot) => (
                    <button
                        key={slot.id}
                        className={`time-slot ${slot.status} ${!slot.available ? 'unavailable' : ''} ${selectedTimeSlot?.id === slot.id ? 'selected' : ''}`}
                        onClick={() => handleTimeSlotSelect(slot)}
                        disabled={!slot.available}
                    >
                        <div className="time-slot-header">
                            <div className="time-text">{slot.time}</div>
                            {slot.countdown && (
                                <div className="countdown">
                                    offer: {slot.countdown} remaining
                                </div>
                            )}
                        </div>

                        {slot.status === "offer-available" && slot.currentOffer && (
                            <>
                                <div className="offer-info">
                                    Current offer: ${slot.currentOffer}
                                </div>
                                <div className="response-time">
                                    Offer response within 10 mins
                                </div>
                            </>
                        )}

                        <div className="slot-actions">
                            {slot.status === "available" ? (
                                <button className="book-button">Book Now ${slot.price}</button>
                            ) : slot.status === "offer-available" ? (
                                <button className="offer-button">Make an Offer</button>
                            ) : null}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BookingCalendar;

