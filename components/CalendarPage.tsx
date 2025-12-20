
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NewEventModal } from './Modals';

const CalendarPage: React.FC = () => {
  const { events, addEvent } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigation Logic
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
      setCurrentDate(new Date());
  }

  // Calendar Grid Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const daysArray = [];

  // Padding days from previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const day = daysInPrevMonth - firstDayOfMonth + 1 + i;
    daysArray.push({
      day,
      isCurrentMonth: false,
      fullDate: new Date(year, month - 1, day).toISOString().split('T')[0]
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
      // Correctly format date as YYYY-MM-DD in local time (ignoring time component issues for simple display)
      // Using ISOString directly on new Date(year, month, i) might result in previous day due to UTC conversion depending on timezone
      // Safer way for string comparison:
      const d = new Date(year, month, i);
      const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      daysArray.push({
        day: i,
        isCurrentMonth: true,
        fullDate: isoDate
      });
  }

  // Padding days for next month (fill up to 35 or 42 cells)
  const totalSlots = daysArray.length > 35 ? 42 : 35;
  const remainingSlots = totalSlots - daysArray.length;
  
  for (let i = 1; i <= remainingSlots; i++) {
    daysArray.push({
      day: i,
      isCurrentMonth: false,
      fullDate: new Date(year, month + 1, i).toISOString().split('T')[0]
    });
  }

  const getEventTypeColor = (type: string) => {
      switch(type) {
          case 'Meeting': return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
          case 'Deadline': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
          case 'Review': return 'bg-primary/30 text-text-main border-primary/50 hover:bg-primary/50';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleDayClick = (dateStr: string) => {
      setSelectedDate(dateStr);
      setIsModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Calendar</h2>
          <p className="text-text-muted text-sm">{monthName}</p>
        </div>
        <div className="flex gap-4">
            <div className="flex items-center bg-white border border-border-color rounded-lg p-1">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} className="text-text-muted" /></button>
                <button onClick={goToToday} className="px-4 text-sm font-bold text-text-main hover:text-primary transition-colors min-w-[120px]">{monthName}</button>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} className="text-text-muted" /></button>
            </div>
            <button 
                onClick={() => {
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                    setIsModalOpen(true);
                }} 
                className="flex items-center justify-center rounded-full px-4 h-10 bg-primary hover:bg-[#e6e205] transition-colors text-black text-sm font-bold shadow-sm active:scale-95 duration-150"
            >
                <Plus size={18} className="mr-2" />
                Add Event
            </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-border-color overflow-hidden flex flex-col shadow-sm">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-border-color bg-gray-50">
              {weekDays.map(d => (
                  <div key={d} className="p-4 text-center text-xs font-bold text-text-muted uppercase tracking-wider">{d}</div>
              ))}
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr">
              {daysArray.map((cell, idx) => {
                  const cellEvents = events.filter(e => e.date === cell.fullDate);
                  
                  return (
                    <div 
                        key={idx} 
                        onClick={() => handleDayClick(cell.fullDate)}
                        className={`min-h-[100px] border-b border-r border-border-color p-2 flex flex-col gap-1 hover:bg-background-light transition-colors cursor-pointer ${
                            !cell.isCurrentMonth ? 'bg-gray-50/50 text-text-muted/50' : 'text-text-main'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-sm font-bold size-7 flex items-center justify-center rounded-full ${
                                cell.fullDate === new Date().toISOString().split('T')[0] ? 'bg-primary text-black' : ''
                            }`}>
                                {cell.day}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                            {cellEvents.map(event => (
                                <div key={event.id} className={`text-[10px] font-bold px-2 py-1 rounded border truncate transition-colors shadow-sm ${getEventTypeColor(event.type)}`}>
                                    {event.time} • {event.title}
                                </div>
                            ))}
                        </div>
                    </div>
                  )
              })}
          </div>
      </div>

      <NewEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={addEvent}
        defaultDate={selectedDate}
      />
    </div>
  );
};

export default CalendarPage;
