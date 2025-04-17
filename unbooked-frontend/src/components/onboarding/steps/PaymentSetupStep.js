import React, { useState, useEffect } from 'react';
import './StepStyles.css';

const PaymentSetupStep = ({ data, onNext, onBack, onSkip, isLoading: propIsLoading }) => {
    const [isStripeConnected, setIsStripeConnected] = useState(false);
    const [stripeAccountInfo, setStripeAccountInfo] = useState(null);
    const [localLoading, setLocalLoading] = useState(false);

    // Combined loading state (either from props or local)
    const isLoading = propIsLoading || localLoading;

    // If data exists (resuming), populate the form
    useEffect(() => {
        if (data) {
            setIsStripeConnected(data.connected || false);
            setStripeAccountInfo(data.accountInfo || null);
        }
    }, [data]);

    const handleConnectStripe = () => {
        // In a real app, this would redirect to Stripe OAuth
        console.log("Redirecting to Stripe Connect...");

        // Simulate successful connection after a delay
        setLocalLoading(true);
        setTimeout(() => {
            const mockStripeAccount = {
                id: 'acct_' + Math.random().toString(36).substring(2, 10),
                last4: '4242',
                name: 'Bank of America',
            };

            setIsStripeConnected(true);
            setStripeAccountInfo(mockStripeAccount);
            setLocalLoading(false);
        }, 2000);
    };

    const handleDisconnectStripe = () => {
        setIsStripeConnected(false);
        setStripeAccountInfo(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const paymentData = {
            connected: isStripeConnected,
            accountInfo: stripeAccountInfo
        };

        // In a real app, you would make an API call here
        console.log("Saving payment setup:", paymentData);

        // Example API call:
        // const response = await fetch('/api/payment-setup', {
        //   method: 'POST',
        //   body: JSON.stringify(paymentData),
        //   headers: { 'Content-Type': 'application/json' }
        // });

        // Move to next step
        onNext(paymentData);
    };

    return (
        <div className="step-form">
            <form onSubmit={handleSubmit}>
                <p className="step-description">
                    Connect your payment account to accept online payments from clients.
                </p>

                <div className="payment-connect-container">
                    {!isStripeConnected ? (
                        <div className="connect-stripe-section">
                            <div className="connect-stripe-info">
                                <h3>Accept payments with Stripe</h3>
                                <p>
                                    Connect your Stripe account to receive payments directly to your bank account.
                                    Stripe is a secure payment processor used by millions of businesses.
                                </p>
                                <ul className="benefits-list">
                                    <li>Instant payment processing</li>
                                    <li>Secure customer data handling</li>
                                    <li>Direct deposits to your bank account</li>
                                    <li>Simple fee structure with no hidden costs</li>
                                </ul>
                            </div>

                            <button
                                type="button"
                                className="stripe-connect-button"
                                onClick={handleConnectStripe}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Connecting...' : 'Connect with Stripe'}
                            </button>
                        </div>
                    ) : (
                        <div className="stripe-connected-section">
                            <div className="connected-status">
                                <div className="success-icon">✓</div>
                                <div className="connected-text">
                                    <h3>Connected to Stripe</h3>
                                    <p>
                                        Your account is connected and ready to accept payments.
                                        Funds will be deposited to account ending in {stripeAccountInfo.last4}.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="text-button"
                                onClick={handleDisconnectStripe}
                            >
                                Disconnect Account
                            </button>
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onBack}
                    >
                        Back
                    </button>
                    {!isStripeConnected && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onSkip}
                        >
                            Skip for now
                        </button>
                    )}
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Next: Upload Media'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentSetupStep;