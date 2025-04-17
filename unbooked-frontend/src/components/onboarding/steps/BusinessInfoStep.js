import React, { useState, useEffect } from 'react';
import './StepStyles.css';

const BusinessInfoStep = ({ data, onNext, isLoading }) => {
    const [businessInfo, setBusinessInfo] = useState({
        businessName: '',
        businessType: '',
        businessAddress: '',
        businessPhone: '',
        businessLogo: null
    });
    const [errors, setErrors] = useState({});

    // If data exists (resuming), populate the form
    useEffect(() => {
        if (data) {
            setBusinessInfo(data);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBusinessInfo(prev => ({ ...prev, [name]: value }));

        // Clear error when field is being edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you would upload to a server/S3 here
            // For now, we'll just store the file object
            setBusinessInfo(prev => ({ ...prev, businessLogo: file }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!businessInfo.businessName.trim()) {
            newErrors.businessName = 'Business name is required';
        }

        if (!businessInfo.businessType) {
            newErrors.businessType = 'Please select a business type';
        }

        if (!businessInfo.businessAddress.trim()) {
            newErrors.businessAddress = 'Business address is required';
        }

        // Phone is optional, but if provided, must be valid format
        if (businessInfo.businessPhone && !/^\+?[0-9\s\-()]+$/.test(businessInfo.businessPhone)) {
            newErrors.businessPhone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // In a real app, you would make an API call here
            console.log("Saving business info:", businessInfo);

            // Example API call:
            // const response = await fetch('/api/profile', {
            //   method: 'POST',
            //   body: JSON.stringify(businessInfo),
            //   headers: { 'Content-Type': 'application/json' }
            // });

            // Move to next step
            onNext(businessInfo);
        } catch (error) {
            console.error("Error saving business info:", error);
        }
    };

    // Business type options
    const businessTypes = [
        { value: '', label: 'Select business type' },
        { value: 'salon', label: 'Salon' },
        { value: 'spa', label: 'Spa' },
        { value: 'barber', label: 'Barber Shop' },
        { value: 'fitness', label: 'Fitness/Personal Training' },
        { value: 'therapy', label: 'Therapy/Counseling' },
        { value: 'consulting', label: 'Consulting' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <div className="step-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="businessName">Business Name*</label>
                    <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={businessInfo.businessName}
                        onChange={handleChange}
                        placeholder="Your business name"
                        className={errors.businessName ? 'error' : ''}
                    />
                    {errors.businessName && <div className="error-message">{errors.businessName}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="businessType">Business Type*</label>
                    <select
                        id="businessType"
                        name="businessType"
                        value={businessInfo.businessType}
                        onChange={handleChange}
                        className={errors.businessType ? 'error' : ''}
                    >
                        {businessTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                    {errors.businessType && <div className="error-message">{errors.businessType}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="businessAddress">Business Address*</label>
                    {/* Normally this would be a Google Places autocomplete component */}
                    <input
                        type="text"
                        id="businessAddress"
                        name="businessAddress"
                        value={businessInfo.businessAddress}
                        onChange={handleChange}
                        placeholder="123 Main St, City, State, ZIP"
                        className={errors.businessAddress ? 'error' : ''}
                    />
                    <div className="field-hint">Enter your full business address</div>
                    {errors.businessAddress && <div className="error-message">{errors.businessAddress}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="businessPhone">Business Phone (optional)</label>
                    <input
                        type="tel"
                        id="businessPhone"
                        name="businessPhone"
                        value={businessInfo.businessPhone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className={errors.businessPhone ? 'error' : ''}
                    />
                    {errors.businessPhone && <div className="error-message">{errors.businessPhone}</div>}
                </div>

                <div className="form-group">
                    <label>Business Logo (optional)</label>
                    <div className="file-upload-container">
                        <input
                            type="file"
                            id="businessLogo"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="file-input"
                        />
                        <label htmlFor="businessLogo" className="file-upload-button">
                            {businessInfo.businessLogo ? 'Change Logo' : 'Upload Logo'}
                        </label>
                        {businessInfo.businessLogo && (
                            <div className="file-preview">
                                <img
                                    src={typeof businessInfo.businessLogo === 'string'
                                        ? businessInfo.businessLogo
                                        : URL.createObjectURL(businessInfo.businessLogo)}
                                    alt="Business Logo"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Next: Add Services'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BusinessInfoStep;