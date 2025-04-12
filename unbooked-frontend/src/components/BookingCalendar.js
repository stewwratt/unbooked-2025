import React, { useState, useRef, useEffect } from 'react';
import DateSelector from './DateSelector';
import './BookingCalendar.css';
import placeholder from '../assets/placeholder.jpg';
import BookingConfirmation from './BookingConfirmation';

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
    const [bookingExpanded, setBookingExpanded] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationType, setConfirmationType] = useState(null);
    const [confirmationDetails, setConfirmationDetails] = useState({});

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
            if (selectedTimeSlot?.id === slot.id && bookingExpanded) {
                // If already expanded, do nothing - keep it open
                return;
            } else {
                // If clicking a different slot or expanding a slot for the first time
                setSelectedTimeSlot(slot);
                setBookingExpanded(true);
            }
        }
    };

    // Add a click handler to safely interact with form elements
    const handleFormClick = (e) => {
        // Stop propagation to prevent the slot's onClick from firing
        e.stopPropagation();
    };

    const handleContinueBooking = () => {
        // Handle the final booking action
        console.log("Booking confirmed for slot:", selectedTimeSlot);
        // Navigate to next step or submit booking
    };

    // Add this handler for closing the form
    const handleCloseForm = (e) => {
        e.stopPropagation();
        setBookingExpanded(false);
        setSelectedTimeSlot(null);
    };

    // Add a ref for the calendar container
    const calendarRef = useRef(null);

    // Add effect to handle clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bookingExpanded &&
                calendarRef.current &&
                !calendarRef.current.contains(event.target)) {
                setBookingExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [bookingExpanded]);

    // Add these functions to your BookingCalendar component
    const handleBookingSubmission = () => {
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const location = document.getElementById('location').value;
        const offerAcceptance = document.getElementById('offer-acceptance').value;

        // Validate form
        if (!name || !email || !phone || !location || !offerAcceptance) {
            console.error("Please fill out all fields");
            return;
        }

        // In a real implementation, you would:
        // 1. Process the payment with Stripe
        // 2. Send the booking data to your backend

        console.log("Booking submitted:", {
            slot: selectedTimeSlot,
            provider: selectedProvider,
            date: selectedDate,
            name,
            email,
            phone,
            location,
            offerAcceptance
        });

        // Close the form
        setBookingExpanded(false);

        // Prepare confirmation details
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        setConfirmationDetails({
            id: `BK-${Date.now().toString(36).slice(-6).toUpperCase()}`,
            provider: selectedProvider.name,
            date: formattedDate,
            time: selectedTimeSlot.time,
            price: selectedTimeSlot.price,
            service: "Hair Service" // You can make this dynamic based on selected services
        });

        setConfirmationType('booking');
        setShowConfirmation(true);
    };

    const handleOfferSubmission = () => {
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const location = document.getElementById('location').value;
        const offerAmount = document.getElementById('offer-amount').value;

        // Validate form
        if (!name || !email || !phone || !location || !offerAmount) {
            console.error("Please fill out all fields");
            return;
        }

        // Validate offer amount is higher than current price
        if (parseFloat(offerAmount) <= selectedTimeSlot.price) {
            console.error("Offer must be higher than the current price");
            return;
        }

        // In a real implementation, you would:
        // 1. Process the payment with Stripe
        // 2. Send the offer data to your backend

        console.log("Offer submitted:", {
            slot: selectedTimeSlot,
            provider: selectedProvider,
            date: selectedDate,
            name,
            email,
            phone,
            location,
            offerAmount
        });

        // Close the form
        setBookingExpanded(false);

        // Prepare confirmation details
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        setConfirmationDetails({
            id: `OF-${Date.now().toString(36).slice(-6).toUpperCase()}`,
            provider: selectedProvider.name,
            date: formattedDate,
            time: selectedTimeSlot.time,
            offerAmount: offerAmount,
            service: "Hair Service" // You can make this dynamic based on selected services
        });

        setConfirmationType('offer');
        setShowConfirmation(true);
    };

    // Add a handler to close the confirmation and return to the calendar
    const handleConfirmationClose = () => {
        setShowConfirmation(false);
        setSelectedTimeSlot(null);
        // Reset any other necessary state
    };

    // Add this function to determine the urgency class based on remaining time
    const getUrgencyClass = (countdownString) => {
        // Extract hours from countdown (assuming format like "4h 30m remaining")
        const hoursMatch = countdownString.match(/(\d+)h/);
        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;

        if (hours <= 1) return 'urgent';      // Less than 1 hour = urgent (reddish-purple)
        if (hours <= 4) return 'medium';      // 1-4 hours = medium (purple)
        return 'plenty';                      // More than 4 hours = plenty (blue)
    };

    return (
        <div className="booking-calendar" ref={calendarRef}>
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
                    <div
                        key={slot.id}
                        className={`time-slot ${slot.status} ${!slot.available ? 'unavailable' : ''} 
                                   ${selectedTimeSlot?.id === slot.id ? 'selected' : ''} 
                                   ${selectedTimeSlot?.id === slot.id && bookingExpanded ? 'expanded' : ''}`}
                        onClick={() => handleTimeSlotSelect(slot)}
                    >
                        <div className="time-slot-header">
                            <div className="time-text">{slot.time}</div>
                            {slot.countdown && (
                                <div className={`countdown ${getUrgencyClass(slot.countdown)}`}>
                                    Offer: {slot.countdown} remaining
                                </div>
                            )}
                        </div>

                        {slot.status === "offer-available" && slot.currentOffer && (
                            <>
                                <div className="offer-info">
                                    Suggested offer: ${slot.currentOffer}
                                </div>
                                <div className="response-time">
                                    Offer response within 10 mins
                                </div>
                            </>
                        )}

                        {(!bookingExpanded || selectedTimeSlot?.id !== slot.id) && (
                            <div className="slot-actions">
                                {slot.status === "available" ? (
                                    <button
                                        className="book-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTimeSlotSelect(slot);
                                        }}
                                    >
                                        Book Now ${slot.price}
                                    </button>
                                ) : slot.status === "offer-available" ? (
                                    <button
                                        className="offer-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTimeSlotSelect(slot);
                                        }}
                                    >
                                        Make an Offer
                                    </button>
                                ) : null}
                            </div>
                        )}

                        {selectedTimeSlot?.id === slot.id && bookingExpanded && (
                            <div
                                className="booking-form-container"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="form-close-button-container">
                                    <button
                                        className="form-close-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setBookingExpanded(false);
                                            setSelectedTimeSlot(null);
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="booking-form">
                                    <h3>Complete your booking with {selectedProvider.name}</h3>

                                    <div className="booking-details">
                                        <div className="booking-detail-item">
                                            <span className="detail-label">Date:</span>
                                            <span className="detail-value">
                                                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="booking-detail-item">
                                            <span className="detail-label">Time:</span>
                                            <span className="detail-value">{slot.time}</span>
                                        </div>
                                        <div className="booking-detail-item">
                                            <span className="detail-label">Price:</span>
                                            <span className="detail-value">${slot.price}</span>
                                        </div>
                                    </div>

                                    {slot.status === "available" ? (
                                        <div className="booking-message">
                                            <p>Your payment will be authorized now but only processed 3 hours before the service delivery.</p>
                                        </div>
                                    ) : (
                                        <div className="booking-message offer-message">
                                            <p>This slot is currently booked. You may make an offer to take over the booking.</p>
                                        </div>
                                    )}

                                    <div className="booking-inputs">
                                        <div className="form-group">
                                            <label htmlFor="name">Full Name</label>
                                            <input type="text" id="name" placeholder="Your full name" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input type="email" id="email" placeholder="your@email.com" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone</label>
                                            <input type="tel" id="phone" placeholder="Your phone number" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="location">Service Location</label>
                                            <input type="text" id="location" placeholder="Your address or preferred location" required />
                                        </div>

                                        {slot.status === "available" ? (
                                            <div className="form-group">
                                                <label htmlFor="offer-acceptance">If someone offers to buy your slot, how much would you accept? ($)</label>
                                                <input type="number" id="offer-acceptance" placeholder="0.00" min="0" step="0.01" required />
                                            </div>
                                        ) : (
                                            <div className="form-group">
                                                <label htmlFor="offer-amount">Your Offer Amount ($)</label>
                                                <input type="number" id="offer-amount" placeholder="0.00" min={slot.price + 1} step="0.01" required />
                                            </div>
                                        )}

                                        <div className="form-group payment-group">
                                            <label htmlFor="card-element">Payment Details</label>
                                            <div className="card-element-placeholder">
                                                <div className="card-element-info">
                                                    Credit or debit card information will be collected here using Stripe
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="confirm-booking-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle booking or offer submission
                                            slot.status === "available"
                                                ? handleBookingSubmission()
                                                : handleOfferSubmission();
                                        }}
                                    >
                                        {slot.status === "available" ? "Confirm Booking" : "Submit Offer"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showConfirmation && (
                <BookingConfirmation
                    type={confirmationType}
                    details={confirmationDetails}
                    onClose={handleConfirmationClose}
                />
            )}
        </div>
    );
};

export default BookingCalendar;