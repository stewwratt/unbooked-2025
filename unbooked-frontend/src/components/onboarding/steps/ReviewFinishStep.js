import React, { useState } from 'react';
import './StepStyles.css';

const ReviewFinishStep = ({ data, onNext, onBack, isLoading }) => {
    const [isPublishing, setIsPublishing] = useState(false);

    const handleEditStep = (stepIndex) => {
        // In the real app, this would navigate back to the specific step
        onBack();
        // In a complete implementation, you would pass the step index to navigate to
        console.log(`Navigating back to step ${stepIndex}`);
    };

    const handlePublish = async () => {
        setIsPublishing(true);

        try {
            // In a real app, you would make an API call here
            console.log("Publishing profile with all data:", data);

            // Example API call:
            // const response = await fetch('/api/profile/complete', {
            //   method: 'POST',
            //   body: JSON.stringify(data),
            //   headers: { 'Content-Type': 'application/json' }
            // });

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Move to next step (which will redirect to dashboard)
            onNext(data);
        } catch (error) {
            console.error("Error publishing profile:", error);
            setIsPublishing(false);
        }
    };

    return (
        <div className="step-form review-step">
            <h2 className="review-header">Review Your Provider Profile</h2>
            <p className="step-description">
                Review your information below. You can go back to edit any section before finishing.
            </p>

            <div className="review-sections">
                {/* Business Info Section */}
                <div className="review-section">
                    <div className="review-section-header">
                        <h3>Business Information</h3>
                        <button
                            type="button"
                            className="edit-button"
                            onClick={() => handleEditStep(0)}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="review-card">
                        <div className="review-business-header">
                            {data.businessInfo?.businessLogo && (
                                <div className="business-logo">
                                    <img
                                        src={typeof data.businessInfo.businessLogo === 'string'
                                            ? data.businessInfo.businessLogo
                                            : URL.createObjectURL(data.businessInfo.businessLogo)}
                                        alt="Business Logo"
                                    />
                                </div>
                            )}
                            <div className="business-details">
                                <h3>{data.businessInfo?.businessName || 'Business Name'}</h3>
                                <p>{data.businessInfo?.businessType || 'Business Type'}</p>
                            </div>
                        </div>
                        <div className="review-info-row">
                            <span className="review-label">Address:</span>
                            <span className="review-value">{data.businessInfo?.businessAddress || 'N/A'}</span>
                        </div>
                        <div className="review-info-row">
                            <span className="review-label">Phone:</span>
                            <span className="review-value">{data.businessInfo?.businessPhone || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="review-section">
                    <div className="review-section-header">
                        <h3>Services ({data.services.length})</h3>
                        <button
                            type="button"
                            className="edit-button"
                            onClick={() => handleEditStep(1)}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="review-card">
                        <div className="services-review-list">
                            {data.services.map((service, index) => (
                                <div key={index} className="service-review-item">
                                    <div className="service-review-header">
                                        <h4>{service.name}</h4>
                                        <div className="service-price">${service.price}</div>
                                    </div>
                                    <div className="service-details">
                                        <span className="duration">{service.duration} min</span>
                                        {service.category && (
                                            <span className="category">{service.category}</span>
                                        )}
                                    </div>
                                    {service.description && (
                                        <p className="service-description">{service.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Availability Section */}
                <div className="review-section">
                    <div className="review-section-header">
                        <h3>Business Hours</h3>
                        <button
                            type="button"
                            className="edit-button"
                            onClick={() => handleEditStep(2)}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="review-card">
                        <div className="availability-review-list">
                            {data.availability && Object.entries(data.availability).map(([day, hours]) => (
                                <div key={day} className="availability-review-item">
                                    <span className="day-name">{day}</span>
                                    <span className="day-hours">
                                        {hours.isOpen
                                            ? `${hours.openTime} - ${hours.closeTime}`
                                            : 'Closed'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="review-section">
                    <div className="review-section-header">
                        <h3>Payment Setup</h3>
                        <button
                            type="button"
                            className="edit-button"
                            onClick={() => handleEditStep(3)}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="review-card">
                        <div className="payment-review-status">
                            {data.paymentSetup?.connected ? (
                                <div className="payment-connected">
                                    <div className="status-icon success">✓</div>
                                    <p>Payment processing is set up and ready to accept bookings</p>
                                </div>
                            ) : (
                                <div className="payment-not-connected">
                                    <div className="status-icon warning">!</div>
                                    <p>Payment processing not set up yet (you can still receive bookings)</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Media Section */}
                <div className="review-section">
                    <div className="review-section-header">
                        <h3>Media</h3>
                        <button
                            type="button"
                            className="edit-button"
                            onClick={() => handleEditStep(4)}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="review-card">
                        {data.mediaUploads?.coverPhoto ? (
                            <div className="media-review">
                                <h4>Cover Photo</h4>
                                <div className="cover-photo-preview">
                                    <img src={data.mediaUploads.coverPhoto.url} alt="Cover" />
                                </div>

                                {data.mediaUploads.portfolioImages.length > 0 && (
                                    <div className="portfolio-preview">
                                        <h4>Portfolio ({data.mediaUploads.portfolioImages.length} images)</h4>
                                        <div className="portfolio-thumbnails">
                                            {data.mediaUploads.portfolioImages.slice(0, 4).map((image, index) => (
                                                <div key={index} className="portfolio-thumbnail">
                                                    <img src={image.url} alt={`Portfolio ${index + 1}`} />
                                                </div>
                                            ))}
                                            {data.mediaUploads.portfolioImages.length > 4 && (
                                                <div className="more-images">
                                                    +{data.mediaUploads.portfolioImages.length - 4} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="media-placeholder">
                                <p>No media uploaded</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Team Section */}
                <div className="review-section">
                    <div className="review-section-header">
                        <h3>Team Members</h3>
                        <button
                            type="button"
                            className="edit-button"
                            onClick={() => handleEditStep(5)}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="review-card">
                        {data.teamMembers && data.teamMembers.length > 0 ? (
                            <div className="team-review-list">
                                {data.teamMembers.map((member, index) => (
                                    <div key={index} className="team-member-review">
                                        <span className="member-name">{member.name}</span>
                                        <span className="member-email">{member.email}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="team-placeholder">
                                <p>No team members added (solo provider)</p>
                            </div>
                        )}
                    </div>
                </div>
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
                    type="button"
                    className="primary-button publish-button"
                    onClick={handlePublish}
                    disabled={isLoading || isPublishing}
                >
                    {isPublishing ? 'Publishing...' : 'Publish Profile'}
                </button>
            </div>
        </div>
    );
};

export default ReviewFinishStep; 