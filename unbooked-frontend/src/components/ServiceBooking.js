import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import ServiceSelector from './ServiceSelector';
import BookingCalendar from './BookingCalendar';
import ProfessionalSelector from './ProfessionalSelector';
import './ServiceBooking.css';

const ServiceBooking = () => {
    const [currentView, setCurrentView] = useState('professionals'); // 'professionals', 'services', or 'calendar'
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [totalDuration, setTotalDuration] = useState(0);

    const handleProfessionalSelect = (professional) => {
        setSelectedProfessional(professional);
        setCurrentView('services');
    };

    const handleContinue = (duration) => {
        setTotalDuration(duration);
        setCurrentView('calendar');
    };

    const handleBack = () => {
        if (currentView === 'calendar') {
            setCurrentView('services');
        } else if (currentView === 'services') {
            setCurrentView('professionals');
        }
    };

    return (
        <div className="content-container">
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={currentView}
                    timeout={300}
                    classNames="fade"
                    nodeRef={React.useRef(null)}
                >
                    <div className="page-wrapper" ref={React.useRef(null)}>
                        {currentView === 'professionals' && (
                            <ProfessionalSelector onSelect={handleProfessionalSelect} />
                        )}
                        {currentView === 'services' && (
                            <ServiceSelector
                                onContinue={handleContinue}
                                onBack={handleBack}
                                professional={selectedProfessional}
                            />
                        )}
                        {currentView === 'calendar' && (
                            <BookingCalendar
                                totalDuration={totalDuration}
                                onBack={handleBack}
                                professional={selectedProfessional}
                            />
                        )}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </div>
    );
};

export default ServiceBooking; 