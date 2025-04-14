import React, { useEffect, useState } from 'react';
import './BookingConfirmation.css';

const BookingConfirmation = ({ type, details, onClose }) => {
    const [animated, setAnimated] = useState(false);

    // Auto-trigger animation when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimated(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Generate a pseudo-random ID for reference
    const referenceId = details.id || `${type}-${Date.now().toString(36).slice(-8)}`;

    return (
        <div className="confirmation-page">
            <div className="confirmation-container">
                <div className={`success-checkmark ${animated ? 'animate' : ''}`}>
                    <div className="check-icon">
                        <span className="icon-line line-tip"></span>
                        <span className="icon-line line-long"></span>
                        <div className="icon-circle"></div>
                        <div className="icon-fix"></div>
                    </div>
                </div>

                <h1 className="success-title">
                    {type === 'booking' ? 'Booking Confirmed!' : 'Offer Submitted!'}
                </h1>

                <div className="reference-id">
                    {type === 'booking' ? 'Booking' : 'Offer'} ID: {referenceId}
                </div>

                <div className="summary-container">
                    <h2>Summary</h2>

                    <div className="summary-details">
                        {type === 'booking' && (
                            <>
                                <div className="summary-row">
                                    <span>Service</span>
                                    <span>{details.service || 'Hair Service'}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Provider</span>
                                    <span>{details.provider}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Date</span>
                                    <span>{details.date}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Time</span>
                                    <span>{details.time}</span>
                                </div>
                                <div className="summary-row highlight">
                                    <span>Price</span>
                                    <span>${details.price}</span>
                                </div>

                                {details.openToOffers && (
                                    <div className="summary-row offer-status">
                                        <span>Min. Acceptable Offer</span>
                                        <span>${details.minAcceptableOffer}</span>
                                    </div>
                                )}

                                <div className="summary-note">
                                    Your payment will be processed 3 hours before your appointment.
                                    {details.openToOffers && (
                                        <span className="offers-note"> Your booking is open to offers. You'll be notified if someone makes an offer above your minimum.</span>
                                    )}
                                </div>
                            </>
                        )}

                        {type === 'offer' && (
                            <>
                                <div className="summary-row">
                                    <span>Service</span>
                                    <span>{details.service || 'Hair Service'}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Provider</span>
                                    <span>{details.provider}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Date</span>
                                    <span>{details.date}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Time</span>
                                    <span>{details.time}</span>
                                </div>
                                <div className="summary-row highlight">
                                    <span>Your Offer</span>
                                    <span>${details.offerAmount}</span>
                                </div>
                                <div className="summary-note">
                                    We'll notify you when the current booker responds to your offer.
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="back-to-calendar" onClick={onClose}>
                        Return to Calendar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;