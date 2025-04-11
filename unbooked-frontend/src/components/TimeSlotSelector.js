import React from 'react';
import './TimeSlotSelector.css';

const TimeSlotSelector = () => {
    // Example data - you'd fetch this from your API
    const timeSlots = [
        {
            id: 1,
            date: 'Monday, Aug 12',
            time: '2:00 PM',
            provider: {
                name: 'Olivia M.',
                image: '/images/providers/olivia.jpg',
            },
            status: 'available', // available, booked, offer-available
            countdown: '4h 30m remaining',
            price: 120,
        },
        {
            id: 2,
            date: 'Wednesday, Aug 14',
            time: '10:30 AM',
            provider: {
                name: 'James W.',
                image: '/images/providers/james.jpg',
            },
            status: 'offer-available',
            countdown: '2h 15m remaining',
            price: 150,
            currentOffer: 180,
        }
    ];

    return (
        <div className="time-slot-selector">
            <div className="header">
                <button className="back-button">←</button>
                <h1 className="page-title">Select time</h1>
            </div>

            <div className="time-slots">
                {timeSlots.map(slot => (
                    <div
                        key={slot.id}
                        className={`time-slot ${slot.status}`}
                    >
                        <div className="countdown">{slot.countdown}</div>
                        <div className="slot-time">{slot.time}</div>
                        <div className="slot-date">{slot.date}</div>

                        <div className="provider-info">
                            <img
                                src={slot.provider.image}
                                alt={slot.provider.name}
                                className="provider-image"
                            />
                            <div className="provider-name">{slot.provider.name}</div>
                        </div>

                        {slot.currentOffer && (
                            <div className="current-offer">
                                Current offer: ${slot.currentOffer}
                            </div>
                        )}

                        <div className="slot-actions">
                            {slot.status === 'available' ? (
                                <button className="book-button">Book Now ${slot.price}</button>
                            ) : slot.status === 'offer-available' ? (
                                <button className="offer-button">Make an Offer</button>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimeSlotSelector; 