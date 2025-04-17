import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ServiceBooking from './components/ServiceBooking';
import Navigation from './components/common/Navigation';
import './App.css';

// Placeholder components (we'll implement these next)
const Login = () => <div className="content-container"><h1>Login Page</h1></div>;
const Register = () => <div className="content-container"><h1>Register Page</h1></div>;
const Home = () => <div className="content-container"><h1>Home Page</h1></div>;
const ProviderDashboard = () => <div className="content-container"><h1>Provider Dashboard</h1></div>;

function App() {
  // Temporary auth state (will be replaced with context)
  const isAuthenticated = false; // Change to true to test protected routes
  const userRole = 'user'; // Change to 'provider' to test provider routes

  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <div className="app-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<ServiceBooking />} />

            {/* Protected routes */}
            <Route
              path="/provider/dashboard"
              element={
                isAuthenticated && userRole === 'provider'
                  ? <ProviderDashboard />
                  : <Navigate to="/login" replace />
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;