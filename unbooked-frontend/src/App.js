import React from 'react';
import ServiceBooking from './components/ServiceBooking';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <div className="logo-container">
        <img src={unbookedLogo} alt="Unbooked Logo" className="logo" />
      </div> */}
      <ServiceBooking />
    </div>
  );
}

export default App;

