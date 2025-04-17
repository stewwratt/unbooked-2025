import React from 'react';
import './OnboardingPrompt.css';

const OnboardingPrompt = ({ value, onChange, placeholder }) => {
    return (
        <div className="onboarding-prompt">
            <textarea
                className="prompt-textarea"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={6}
                aria-label="Business description"
            />
            <div className="prompt-info">
                <span className="prompt-info-icon">💡</span>
                <p>The more details you provide, the better your initial profile will be.</p>
            </div>
        </div>
    );
};

export default OnboardingPrompt; 