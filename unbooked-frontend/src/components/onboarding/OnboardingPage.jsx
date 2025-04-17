import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingPrompt from './OnboardingPrompt';
// import ProfileEditor from '../profile/ProfileEditor'; // Assuming this exists as mentioned
import { generateSkeletonProfile, mockGenerateSkeletonProfile } from '../../utils/profileGenerationUtils';
import './OnboardingPage.css';

const OnboardingPage = () => {
    const navigate = useNavigate();
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
                {/* Optional Video/Banner Component */}
                <div className="banner">
                    {/* Uncomment and use actual component when available */}
                    {/* <VideoPlayer src="path/to/intro-video.mp4" /> */}
                    {/* OR */}
                    {/* <Banner 
            title="Welcome to Unbooked" 
            subtitle="Set up your business profile in minutes" 
            imageUrl="path/to/banner-image.jpg" 
          /> */}

                    {/* Placeholder banner */}
                    <div className="placeholder-banner">
                        <h2>Welcome to Unbooked</h2>
                        <p>Set up your business profile in minutes</p>
                    </div>
                </div>

                <h1 className="page-title">Tell us about your business</h1>

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
                        className="primary-button generate-button"
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

                {skeletonProfile && (
                    <div className="profile-editor-section">
                        <h2>Review & Edit Your Profile</h2>
                        <p className="editor-info">
                            We've created an initial profile based on your description.
                            Feel free to review and edit the details below.
                        </p>

                        {/* Render the ProfileEditor component with the generated skeleton */}
                        {/* <ProfileEditor
                            initialData={skeletonProfile}
                            onSave={handleSaveProfile}
                        /> */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingPage; 