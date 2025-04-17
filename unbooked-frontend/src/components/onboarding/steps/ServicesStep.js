import React, { useState, useEffect } from 'react';
import './StepStyles.css';

const ServiceItem = ({ service, index, onChange, onRemove, errors }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(index, name, value);
    };

    return (
        <div className="service-item">
            <div className="service-header">
                <h3>Service #{index + 1}</h3>
                {index > 0 && (
                    <button
                        type="button"
                        className="remove-button"
                        onClick={() => onRemove(index)}
                    >
                        Remove
                    </button>
                )}
            </div>

            <div className="form-group">
                <label htmlFor={`serviceName-${index}`}>Service Name*</label>
                <input
                    type="text"
                    id={`serviceName-${index}`}
                    name="name"
                    value={service.name}
                    onChange={handleChange}
                    placeholder="e.g., Haircut, Massage, Consultation"
                    className={errors[index]?.name ? 'error' : ''}
                />
                {errors[index]?.name && <div className="error-message">{errors[index].name}</div>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor={`serviceDuration-${index}`}>Duration (minutes)*</label>
                    <select
                        id={`serviceDuration-${index}`}
                        name="duration"
                        value={service.duration}
                        onChange={handleChange}
                        className={errors[index]?.duration ? 'error' : ''}
                    >
                        <option value="">Select</option>
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                        <option value="180">3 hours</option>
                        <option value="240">4 hours</option>
                    </select>
                    {errors[index]?.duration && <div className="error-message">{errors[index].duration}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor={`servicePrice-${index}`}>Price ($)*</label>
                    <input
                        type="number"
                        id={`servicePrice-${index}`}
                        name="price"
                        value={service.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={errors[index]?.price ? 'error' : ''}
                    />
                    {errors[index]?.price && <div className="error-message">{errors[index].price}</div>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor={`serviceCategory-${index}`}>Category (optional)</label>
                <select
                    id={`serviceCategory-${index}`}
                    name="category"
                    value={service.category}
                    onChange={handleChange}
                >
                    <option value="">Select a category</option>
                    <option value="hair">Hair</option>
                    <option value="skin">Skin & Face</option>
                    <option value="nails">Nails</option>
                    <option value="massage">Massage</option>
                    <option value="fitness">Fitness</option>
                    <option value="therapy">Therapy</option>
                    <option value="consultation">Consultation</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor={`serviceDescription-${index}`}>Description (optional)</label>
                <textarea
                    id={`serviceDescription-${index}`}
                    name="description"
                    value={service.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe what this service includes..."
                />
            </div>
        </div>
    );
};

const ServicesStep = ({ data, onNext, onBack, isLoading }) => {
    const emptyService = {
        name: '',
        duration: '30',
        price: '',
        category: '',
        description: ''
    };

    const [services, setServices] = useState([{ ...emptyService }]);
    const [errors, setErrors] = useState([{}]);
    const [formError, setFormError] = useState('');

    // If data exists (resuming), populate the form
    useEffect(() => {
        if (data && data.length > 0) {
            setServices(data);
            setErrors(data.map(() => ({})));
        }
    }, [data]);

    const handleServiceChange = (index, name, value) => {
        const updatedServices = [...services];
        updatedServices[index] = { ...updatedServices[index], [name]: value };
        setServices(updatedServices);

        // Clear error for the field
        if (errors[index] && errors[index][name]) {
            const updatedErrors = [...errors];
            updatedErrors[index] = { ...updatedErrors[index], [name]: '' };
            setErrors(updatedErrors);
        }

        // Clear the form error when user makes changes
        if (formError) {
            setFormError('');
        }
    };

    const addService = () => {
        setServices([...services, { ...emptyService }]);
        setErrors([...errors, {}]);
    };

    const removeService = (index) => {
        const updatedServices = [...services];
        updatedServices.splice(index, 1);
        setServices(updatedServices);

        const updatedErrors = [...errors];
        updatedErrors.splice(index, 1);
        setErrors(updatedErrors);
    };

    const validateServices = () => {
        const newErrors = services.map(service => {
            const serviceErrors = {};

            if (!service.name.trim()) {
                serviceErrors.name = 'Service name is required';
            }

            if (!service.duration) {
                serviceErrors.duration = 'Duration is required';
            }

            if (service.price === '' || isNaN(service.price) || Number(service.price) < 0) {
                serviceErrors.price = 'Please enter a valid price (0 or higher)';
            }

            return serviceErrors;
        });

        setErrors(newErrors);

        // Check if any service has errors
        const hasErrors = newErrors.some(serviceErrors => Object.keys(serviceErrors).length > 0);

        if (hasErrors) {
            return false;
        }

        // Check if at least one service is added
        if (services.length === 0) {
            setFormError('Please add at least one service');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateServices()) {
            return;
        }

        try {
            // In a real app, you would make an API call here
            console.log("Saving services:", services);

            // Example API call:
            // const response = await fetch('/api/services', {
            //   method: 'POST',
            //   body: JSON.stringify(services),
            //   headers: { 'Content-Type': 'application/json' }
            // });

            // Move to next step
            onNext(services);
        } catch (error) {
            console.error("Error saving services:", error);
        }
    };

    return (
        <div className="step-form">
            <form onSubmit={handleSubmit}>
                <p className="step-description">
                    Add services that you offer to your clients. You must add at least one service.
                </p>

                {formError && <div className="form-error">{formError}</div>}

                <div className="services-list">
                    {services.map((service, index) => (
                        <ServiceItem
                            key={index}
                            service={service}
                            index={index}
                            onChange={handleServiceChange}
                            onRemove={removeService}
                            errors={errors}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="secondary-button add-button"
                    onClick={addService}
                >
                    + Add Another Service
                </button>

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
                        {isLoading ? 'Saving...' : 'Next: Set Availability'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServicesStep; 