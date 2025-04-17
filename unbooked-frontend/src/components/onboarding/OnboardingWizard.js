import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import BusinessInfoStep from './steps/BusinessInfoStep';
import ServicesStep from './steps/ServicesStep';
import AvailabilityStep from './steps/AvailabilityStep';
import PaymentSetupStep from './steps/PaymentSetupStep';
import MediaUploadStep from './steps/MediaUploadStep';
import TeamInvitationsStep from './steps/TeamInvitationsStep';
import ReviewFinishStep from './steps/ReviewFinishStep';
import './OnboardingWizard.css';

const OnboardingWizard = () => {
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [onboardingData, setOnboardingData] = useState({
        businessInfo: null,
        services: [],
        availability: null,
        paymentSetup: null,
        mediaUploads: { coverPhoto: null, portfolioImages: [] },
        teamMembers: []
    });
    const [loading, setLoading] = useState(false);

    // Load saved progress from localStorage if exists
    useEffect(() => {
        const savedData = localStorage.getItem('onboardingData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setOnboardingData(parsedData);

                // Determine which step to start from
                if (parsedData.businessInfo) {
                    if (parsedData.services?.length > 0) {
                        if (parsedData.availability) {
                            if (parsedData.paymentSetup || parsedData.paymentSetup === false) {
                                if (parsedData.mediaUploads?.coverPhoto) {
                                    // Either at team invites or review
                                    if (parsedData.teamMembers?.length > 0) {
                                        setCurrentStepIndex(6); // Review step
                                    } else {
                                        setCurrentStepIndex(5); // Team invites step
                                    }
                                } else {
                                    setCurrentStepIndex(4); // Media upload step
                                }
                            } else {
                                setCurrentStepIndex(3); // Payment setup step
                            }
                        } else {
                            setCurrentStepIndex(2); // Availability step
                        }
                    } else {
                        setCurrentStepIndex(1); // Services step
                    }
                }
            } catch (e) {
                console.error("Error parsing saved onboarding data", e);
            }
        }
    }, []);

    // Save progress to localStorage whenever data changes
    useEffect(() => {
        if (Object.values(onboardingData).some(value => value !== null)) {
            localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
        }
    }, [onboardingData]);

    const steps = [
        {
            title: "Business Information",
            component: BusinessInfoStep,
            data: onboardingData.businessInfo
        },
        {
            title: "Services",
            component: ServicesStep,
            data: onboardingData.services
        },
        {
            title: "Availability",
            component: AvailabilityStep,
            data: onboardingData.availability
        },
        {
            title: "Payment Setup",
            component: PaymentSetupStep,
            data: onboardingData.paymentSetup
        },
        {
            title: "Media Upload",
            component: MediaUploadStep,
            data: onboardingData.mediaUploads
        },
        {
            title: "Team Members",
            component: TeamInvitationsStep,
            data: onboardingData.teamMembers
        },
        {
            title: "Review & Finish",
            component: ReviewFinishStep,
            data: onboardingData
        }
    ];

    const handleNext = async (stepData) => {
        setLoading(true);

        try {
            // Update the state with the new data from the current step
            const newOnboardingData = { ...onboardingData };

            // Determine which property to update based on the current step
            switch (currentStepIndex) {
                case 0:
                    newOnboardingData.businessInfo = stepData;
                    break;
                case 1:
                    newOnboardingData.services = stepData;
                    break;
                case 2:
                    newOnboardingData.availability = stepData;
                    break;
                case 3:
                    newOnboardingData.paymentSetup = stepData;
                    break;
                case 4:
                    newOnboardingData.mediaUploads = stepData;
                    break;
                case 5:
                    newOnboardingData.teamMembers = stepData;
                    break;
                case 6:
                    // Final step - complete onboarding
                    await completeOnboarding(onboardingData);
                    break;
                default:
                    break;
            }

            setOnboardingData(newOnboardingData);

            // If this is the last step, redirect to dashboard
            if (currentStepIndex === steps.length - 1) {
                navigate('/provider/dashboard');
                return;
            }

            // Move to the next step
            setCurrentStepIndex(prevIndex => prevIndex + 1);
        } catch (error) {
            console.error("Error processing step data:", error);
            // Could add error notification here
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleSkip = () => {
        // For optional steps like Payment Setup or Team Invitations
        // We'll set the data as empty or false to indicate it was skipped
        const newOnboardingData = { ...onboardingData };

        switch (currentStepIndex) {
            case 3: // Payment Setup
                newOnboardingData.paymentSetup = false;
                break;
            case 4: // Media Upload
                // Keep whatever was already uploaded, just move on
                break;
            case 5: // Team Invitations
                newOnboardingData.teamMembers = [];
                break;
            default:
                break;
        }

        setOnboardingData(newOnboardingData);
        setCurrentStepIndex(prevIndex => prevIndex + 1);
    };

    const completeOnboarding = async (data) => {
        try {
            // In a real app, this would be an API call to mark onboarding as complete
            console.log("FINAL SUBMISSION: Completing onboarding with data:", data);

            // Example API call:
            // await api.post('/api/profile/complete', data);

            // Clear localStorage after successful completion
            localStorage.removeItem('onboardingData');
        } catch (error) {
            console.error("Error completing onboarding:", error);
            throw error;
        }
    };

    const CurrentStep = steps[currentStepIndex].component;
    const stepData = steps[currentStepIndex].data;
    const isLastStep = currentStepIndex === steps.length - 1;
    const isOptionalStep = currentStepIndex === 3 || currentStepIndex === 4 || currentStepIndex === 5;

    return (
        <div className="onboarding-wizard">
            <div className="onboarding-wizard-header">
                <h1>Set Up Your Provider Profile</h1>
                <div className="step-indicator">
                    <span className="step-text">Step {currentStepIndex + 1} of {steps.length}</span>
                    <div className="step-dots">
                        {steps.map((step, index) => (
                            <span
                                key={index}
                                className={`step-dot ${index === currentStepIndex ? 'active' : ''} ${index < currentStepIndex ? 'completed' : ''}`}
                            />
                        ))}
                    </div>
                    <h2 className="step-title">{steps[currentStepIndex].title}</h2>
                </div>
            </div>

            <div className="onboarding-wizard-content">
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={currentStepIndex}
                        timeout={300}
                        classNames="fade"
                        nodeRef={React.createRef()}
                    >
                        <div className="step-container" ref={React.createRef()}>
                            <CurrentStep
                                data={stepData}
                                onNext={handleNext}
                                onBack={handleBack}
                                onSkip={isOptionalStep ? handleSkip : undefined}
                                isLoading={loading}
                                allData={onboardingData}
                            />
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </div>
    );
};

export default OnboardingWizard;