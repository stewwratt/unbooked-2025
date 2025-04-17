import React, { useState, useEffect } from 'react';
import './AvailabilityStep.css';

const AvailabilityStep = ({ data, onNext, onBack, isLoading }) => {
    // Initialize default availability if no data exists
    const [availability, setAvailability] = useState(() => {
        if (data) return data;

        // Default hours: Mon-Fri 9am-5pm, weekends closed
        return {
            Monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
            Tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
            Wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
            Thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
            Friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
            Saturday: { isOpen: false, openTime: '09:00', closeTime: '17:00' },
            Sunday: { isOpen: false, openTime: '09:00', closeTime: '17:00' }
        };
    });

    const [errors, setErrors] = useState({});

    // Handle toggle of day open/closed status
    const handleToggleDay = (day) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                isOpen: !prev[day].isOpen
            }
        }));

        // Clear errors for this day when toggling
        if (errors[day]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[day];
                return newErrors;
            });
        }
    };

    // Handle time change (open or close)
    const handleTimeChange = (day, field, value) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));

        // Clear errors for this day when changing times
        if (errors[day]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[day];
                return newErrors;
            });
        }
    };

    // Copy hours from one day to all following days
    const copyHoursToFollowing = (startDay) => {
        const days = Object.keys(availability);
        const startIndex = days.indexOf(startDay);

        if (startIndex === -1 || startIndex === days.length - 1) return;

        const dayToCopy = availability[startDay];
        const updatedAvailability = { ...availability };

        for (let i = startIndex + 1; i < days.length; i++) {
            updatedAvailability[days[i]] = { ...dayToCopy };
        }

        setAvailability(updatedAvailability);
    };

    // Copy hours from previous day
    const copyFromPreviousDay = (day) => {
        const days = Object.keys(availability);
        const dayIndex = days.indexOf(day);

        if (dayIndex <= 0) return;

        const previousDay = days[dayIndex - 1];
        setAvailability(prev => ({
            ...prev,
            [day]: { ...prev[previousDay] }
        }));
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        Object.entries(availability).forEach(([day, hours]) => {
            if (hours.isOpen) {
                // Convert times to Date objects for comparison
                const openTime = new Date(`2023-01-01T${hours.openTime}`);
                const closeTime = new Date(`2023-01-01T${hours.closeTime}`);

                if (closeTime <= openTime) {
                    newErrors[day] = "Closing time must be after opening time";
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Save availability data and proceed to next step
            onNext(availability);
        }
    };

    // Generate time options for select fields (30 min intervals)
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const hourStr = hour.toString().padStart(2, '0');
                const minStr = min.toString().padStart(2, '0');
                const time = `${hourStr}:${minStr}`;
                const displayTime = formatDisplayTime(time);
                options.push(<option key={time} value={time}>{displayTime}</option>);
            }
        }
        return options;
    };

    // Format time for display (12-hour format with AM/PM)
    const formatDisplayTime = (time) => {
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${minutes} ${ampm}`;
    };

    return (
        <div className="availability-step">
            <h2>Set Your Business Hours</h2>
            <p className="step-description">
                Let clients know when you're available for bookings. Set your regular business hours below.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="business-hours-container">
                    {Object.entries(availability).map(([day, hours], index) => (
                        <div key={day} className="day-row">
                            <div className="day-toggle">
                                <input
                                    type="checkbox"
                                    id={`toggle-${day}`}
                                    checked={hours.isOpen}
                                    onChange={() => handleToggleDay(day)}
                                />
                                <label htmlFor={`toggle-${day}`} className="day-name">{day}</label>
                            </div>

                            {hours.isOpen ? (
                                <div className="hours-inputs">
                                    <div className="time-select-container">
                                        <select
                                            value={hours.openTime}
                                            onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                                            disabled={!hours.isOpen}
                                        >
                                            {generateTimeOptions()}
                                        </select>
                                        <span className="time-separator">to</span>
                                        <select
                                            value={hours.closeTime}
                                            onChange={(e) => handleTimeChange(day, 'closeTime', e.target.value)}
                                            disabled={!hours.isOpen}
                                        >
                                            {generateTimeOptions()}
                                        </select>
                                    </div>

                                    <div className="quick-actions">
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="text-button"
                                                onClick={() => copyFromPreviousDay(day)}
                                            >
                                                Copy from {Object.keys(availability)[index - 1]}
                                            </button>
                                        )}
                                        {index < Object.keys(availability).length - 1 && (
                                            <button
                                                type="button"
                                                className="text-button"
                                                onClick={() => copyHoursToFollowing(day)}
                                            >
                                                Apply to all following days
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="closed-label">Closed</div>
                            )}

                            {errors[day] && <div className="error-message">{errors[day]}</div>}
                        </div>
                    ))}
                </div>

                <div className="availability-actions">
                    <button
                        type="button"
                        className="quick-set-button"
                        onClick={() => {
                            // Set standard business hours (9-5, Mon-Fri)
                            const standard = { ...availability };
                            Object.keys(standard).forEach(day => {
                                if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)) {
                                    standard[day] = { isOpen: true, openTime: '09:00', closeTime: '17:00' };
                                } else {
                                    standard[day] = { isOpen: false, openTime: '09:00', closeTime: '17:00' };
                                }
                            });
                            setAvailability(standard);
                        }}
                    >
                        Set Standard Hours (9-5, Mon-Fri)
                    </button>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onBack}
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Next: Payment Setup'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AvailabilityStep;
