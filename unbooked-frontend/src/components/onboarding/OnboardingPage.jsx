import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingPrompt from './OnboardingPrompt';
import VoiceOnboarding from './VoiceOnboarding';
import { mockGenerateSkeletonProfile } from '../../utils/profileGenerationUtils';
import './OnboardingPage.css';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const [onboardingMethod, setOnboardingMethod] = useState('voice'); // 'voice' or 'text'
    const [businessDescription, setBusinessDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [skeletonProfile, setSkeletonProfile] = useState(null);

    const handleGenerateProfile = async () => {
        if (!businessDescription.trim()) {
            setError('Please describe your business before generating a profile');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // Use the mock function for development, switch to real one in production
            const profileData = await mockGenerateSkeletonProfile(businessDescription);
            // const profileData = await generateSkeletonProfile(businessDescription);

            setSkeletonProfile(profileData);
        } catch (err) {
            setError('Failed to generate profile. Please try again or contact support.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleVoiceProfileUpdate = (profileData) => {
        console.log('Voice profile data:', profileData);
        setSkeletonProfile(profileData);
    };

    const handleSaveProfile = (profileData) => {
        // This would be called when the user saves the profile from the ProfileEditor
        console.log('Saving final profile:', profileData);

        // TODO: Save the profile to the backend
        // After saving, redirect to dashboard or confirmation page
        navigate('/provider/dashboard');
    };

    const examplePlaceholder =
        "E.g., I run a barbershop called 'SharpCuts'. We do haircuts, beard trims, Monday–Friday 9am–5pm. Our prices start at $25. We're located in downtown and have three stylists.";

    return (
        <div className="onboarding-page">
            <div className="container">
                <div className="banner">
                    <div className="placeholder-banner">
                        <h2>Welcome to Unbooked</h2>
                        <p>Set up your business profile in minutes</p>
                    </div>
                </div>

                <h1 className="page-title">Tell us about your business</h1>

                {/* Onboarding method selector */}
                <div className="onboarding-method-selector">
                    <button
                        className={`method-button ${onboardingMethod === 'voice' ? 'active' : ''}`}
                        onClick={() => setOnboardingMethod('voice')}
                    >
                        <span className="method-icon">🎤</span>
                        Voice Chat
                    </button>
                    <button
                        className={`method-button ${onboardingMethod === 'text' ? 'active' : ''}`}
                        onClick={() => setOnboardingMethod('text')}
                    >
                        <span className="method-icon">⌨️</span>
                        Text Input
                    </button>
                </div>

                {/* Voice onboarding */}
                {onboardingMethod === 'voice' && (
                    <div className="voice-onboarding-container">
                        <p className="method-description">
                            Talk with Nova, our AI assistant, to set up your business profile.
                            Just speak naturally about your services, hours, and location.
                        </p>
                        <VoiceOnboarding onProfileUpdate={handleVoiceProfileUpdate} />
                    </div>
                )}

                {/* Text onboarding */}
                {onboardingMethod === 'text' && (
                    <div className="description-section">
                        <OnboardingPrompt
                            value={businessDescription}
                            onChange={setBusinessDescription}
                            placeholder={examplePlaceholder}
                        />
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        <button
                            className="generate-button"
                            onClick={handleGenerateProfile}
                            disabled={isGenerating || !businessDescription.trim()}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="spinner"></span>
                                    Generating Profile...
                                </>
                            ) : (
                                'Generate Profile'
                            )}
                        </button>
                    </div>
                )}

                {/* Profile editor section - shown when profile is generated with either method */}
                {skeletonProfile && (
                    <div className="profile-editor-section">
                        <h2>Review & Edit Your Profile</h2>
                        <p className="editor-info">
                            We've created an initial profile based on your information.
                            Feel free to review and edit the details below.
                        </p>

                        {/* When your ProfileEditor component is ready, uncomment this */}
                        {/* <ProfileEditor
                            initialData={skeletonProfile}
                            onSave={handleSaveProfile}
                        /> */}

                        {/* Temporary display of profile data */}
                        <pre className="profile-json">{JSON.stringify(skeletonProfile, null, 2)}</pre>

                        <button className="save-button" onClick={() => handleSaveProfile(skeletonProfile)}>
                            Complete Setup
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingPage; 