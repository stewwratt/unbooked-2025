import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import unbookedLogo from '../../assets/unbooked-logo.png';

const Navigation = () => {
    // Temporary auth state (will be replaced with context)
    const isAuthenticated = false; // Change to true to test authenticated nav
    const userRole = 'user'; // Change to 'provider' to test provider nav

    return (
        <nav className="main-nav">
            <div className="nav-container">
                <div className="nav-logo">
                    <Link to="/"><img src={unbookedLogo} alt="Unbooked" width="150" /></Link>
                </div>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/booking">Book Service</Link>
                    <Link to="/onboarding">Onboarding</Link>

                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="auth-link">Login</Link>
                            <Link to="/register" className="auth-link register">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            {userRole === 'provider' && (
                                <Link to="/provider/dashboard">Provider Dashboard</Link>
                            )}
                            <button className="auth-link">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 