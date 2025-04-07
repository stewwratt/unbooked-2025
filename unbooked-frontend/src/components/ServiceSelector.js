import React, { useState } from 'react';
import './ServiceSelector.css';

const services = {
    Featured: [
        {
            id: "featured1",
            name: "FEATURED SERVICE 1",
            duration: 30,
            price: 58,
            description: "30 mins"
        },
        {
            id: "featured2",
            name: "FEATURED SERVICE 2",
            duration: 45,
            price: 75,
            description: "45 mins"
        }
    ],
    Hair: [
        {
            id: "haircut",
            name: "INCLUDES BURST AND TAPER FADES",
            duration: 30,
            price: 58,
            description: "30 mins"
        },
        {
            id: "hairart",
            name: "HAIR ART DESIGN/ FREESTYLE",
            duration: 10,
            price: 10,
            description: "Freestyle hair art ie on tapers and burst fades"
        },
        {
            id: "restyle",
            name: "RESTYLE/LONG HAIR TRIM",
            duration: 30,
            price: 65,
            description: "scissor cut and style, hair shoulder length and below."
        }
    ],
    COMBO: [
        {
            id: "combo1",
            name: "HAIR + BEARD COMBO",
            duration: 45,
            price: 80,
            description: "Complete package"
        },
        {
            id: "combo2",
            name: "PREMIUM STYLING COMBO",
            duration: 60,
            price: 95,
            description: "Full service treatment"
        }
    ],
    Beard: [
        {
            id: "beard1",
            name: "BEARD TRIM",
            duration: 15,
            price: 25,
            description: "Basic beard maintenance"
        },
        {
            id: "beard2",
            name: "LUXURY BEARD TREATMENT",
            duration: 30,
            price: 40,
            description: "Including hot towel"
        }
    ],
    Color: [
        {
            id: "color1",
            name: "BASIC COLOR",
            duration: 60,
            price: 85,
            description: "Single color application"
        }
    ],
    Extensions: [
        {
            id: "ext1",
            name: "FULL HEAD EXTENSIONS",
            duration: 120,
            price: 200,
            description: "Premium extensions"
        }
    ],
    Treatments: [
        {
            id: "treat1",
            name: "SCALP TREATMENT",
            duration: 30,
            price: 45,
            description: "Therapeutic care"
        }
    ]
};

const ServiceSelector = ({ onContinue, onBack }) => {
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Featured');
    const [showSelectedServices, setShowSelectedServices] = useState(false);

    const categories = [
        'Featured',
        'Hair',
        'COMBO',
        'Beard',
        'Color',
        'Extensions',
        'Treatments'
    ];

    const toggleService = (service) => {
        if (selectedServices.some(s => s.id === service.id)) {
            setSelectedServices(selectedServices.filter(s => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const removeService = (serviceId) => {
        const updatedServices = selectedServices.filter(s => s.id !== serviceId);
        setSelectedServices(updatedServices);

        // If we just removed the last service, close the popup
        if (updatedServices.length === 0) {
            setShowSelectedServices(false);
        }
    };

    return (
        <div className="service-selector">
            <div className="header">
                <button onClick={onBack} className="back-button">
                    ←
                </button>
                <h1 className="page-title">Select services</h1>
            </div>

            <div className="category-tabs">
                {categories.map((category, index) => (
                    <button
                        key={category}
                        className={`category-tab ${selectedCategory === category ? 'selected' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                        style={{ "--index": index }}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="services-list">
                {services[selectedCategory].map((service, index) => (
                    <button
                        key={service.id}
                        className="service-item"
                        onClick={() => toggleService(service)}
                        style={{ "--index": index }}
                    >
                        <div className="service-content">
                            <div className="service-header">
                                <div className="service-duration">{service.description}</div>
                                <div className="service-name">{service.name}</div>
                            </div>
                            <div className="service-price">from ${service.price}</div>
                        </div>
                        <div className="service-indicators">
                            {selectedServices.some(s => s.id === service.id) ? (
                                <div className="service-check"></div>
                            ) : (
                                <div className="service-add">+</div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {selectedServices.length > 0 && (
                <div className="bottom-bar">
                    <div
                        className="booking-summary-container"
                        onClick={() => setShowSelectedServices(true)}
                    >
                        <div className="booking-summary">
                            <div>from ${selectedServices.reduce((sum, s) => sum + s.price, 0)}</div>
                            <div className="booking-details">
                                {selectedServices.length} {selectedServices.length === 1 ? 'service' : 'services'} • {selectedServices.reduce((sum, s) => sum + s.duration, 0)} mins
                            </div>
                        </div>
                    </div>
                    <button
                        className="continue-button"
                        onClick={() => onContinue(selectedServices.reduce((sum, s) => sum + s.duration, 0))}
                    >
                        Continue
                    </button>
                </div>
            )}

            <div className={`selected-services-popup ${showSelectedServices ? 'visible' : ''}`} onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowSelectedServices(false);
                }
            }}>
                <div className="selected-services-content">
                    <div className="selected-services-header">
                        <h2>Selected Services</h2>
                        <button
                            className="close-button"
                            onClick={() => setShowSelectedServices(false)}
                        >
                            ×
                        </button>
                    </div>
                    <div className="selected-services-list">
                        {selectedServices.map(service => (
                            <div key={service.id} className="selected-service-item">
                                <div className="selected-service-info">
                                    <div className="selected-service-name">{service.name}</div>
                                    <div className="selected-service-details">
                                        {service.duration} mins • ${service.price}
                                    </div>
                                </div>
                                <button
                                    className="remove-service-button"
                                    onClick={() => removeService(service.id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="selected-services-total">
                        <div>Total</div>
                        <div>${selectedServices.reduce((sum, s) => sum + s.price, 0)} • {selectedServices.reduce((sum, s) => sum + s.duration, 0)} mins</div>
                    </div>
                    <button
                        className="continue-button"
                        onClick={() => {
                            setShowSelectedServices(false);
                            onContinue(selectedServices.reduce((sum, s) => sum + s.duration, 0));
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceSelector;