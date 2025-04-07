import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';

const mockEvents = [
    {
        id: '1',
        title: 'Haircut – Sam', // ✅ string only!
        start: '2025-04-02T10:00:00',
        end: '2025-04-02T10:30:00',
    },
    {
        id: '2',
        title: 'Booked: Open to offers',
        start: '2025-04-02T12:00:00',
        end: '2025-04-02T12:30:00',
    }
];

const Calendar = () => {
    console.log("Mock events passed to FullCalendar:", mockEvents);

    return (
        <div className="calendar-container">
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={mockEvents} // ✅ inject test-safe data
                views={{
                    timeGridDay: {
                        type: 'timeGrid',
                        duration: { days: 1 },
                        buttonText: '1 Day'
                    },
                    timeGrid3Day: {
                        type: 'timeGrid',
                        duration: { days: 3 },
                        buttonText: '3 Day'
                    },
                    timeGridWeek: {
                        type: 'timeGrid',
                        duration: { days: 7 },
                        buttonText: 'Week'
                    }
                }}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridDay,timeGrid3Day,timeGridWeek'
                }}
            />
        </div>
    );
};

export default Calendar;
