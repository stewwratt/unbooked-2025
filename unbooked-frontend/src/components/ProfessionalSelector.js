import React from 'react';
import './ProfessionalSelector.css';
import placeholder from '../assets/placeholder.jpg';

const ProfessionalSelector = ({ onSelect }) => {
    // Mock professionals data
    const professionals = [
        {
            id: 1,
            name: "Danny",
            role: "Senior Stylist",
            availability: "Next available today",
            image: placeholder
        },
        {
            id: 2,
            name: "Sarah",
            role: "Color Specialist",
            availability: "Next available tomorrow",
            image: placeholder
        },
        {
            id: 3,
            name: "Michael",
            role: "Master Barber",
            availability: "Next available Wed",
            image: placeholder
        }
    ];

    return (
        <div className="professional-selector">
            <div className="header">
                <div className="back-button-spacer"></div>
                <h1 className="page-title">Select professional</h1>
            </div>

            <div className="professionals-list">
                {professionals.map((professional, index) => (
                    <button
                        key={professional.id}
                        className="professional-item"
                        onClick={() => onSelect(professional)}
                        style={{ "--index": index }}
                    >
                        <div className="professional-image">
                            <img src={professional.image} alt={professional.name} />
                        </div>
                        <div className="professional-content">
                            <div className="professional-header">
                                <div className="professional-name">{professional.name}</div>
                                <div className="professional-role">{professional.role}</div>
                            </div>
                            <div className="professional-availability">{professional.availability}</div>
                        </div>
                        <div className="professional-arrow">→</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProfessionalSelector; 