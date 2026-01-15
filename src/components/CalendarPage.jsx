import React, { useState, useEffect } from 'react';
import { useTaskManagement } from '../hooks/useTaskManagement';
import { getDateKey, getDaysInMonth } from '../utils/api';
import TaskModal from './TaskModal';

export const CalendarPage = ({ onLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todayDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthlyDataCache, setMonthlyDataCache] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { fetchTasks, saveTasks } = useTaskManagement();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const totalDays = getDaysInMonth(currentDate);
  const firstDay = new Date(year, month, 1).getDay();

  // Load task status for today only - lazy load on demand
  useEffect(() => {
    const loadTodayStatus = async () => {
      const todayKey = getDateKey(todayDate.getDate(), todayDate.getMonth(), todayDate.getFullYear());
      if (!monthlyDataCache[todayKey]) {
        const tasks = await fetchTasks(todayKey);
        setMonthlyDataCache(prev => ({ ...prev, [todayKey]: tasks }));
      }
      setIsLoading(false);
    };

    loadTodayStatus();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleDayClick = async (day) => {
    // Fetch tasks on demand when day is clicked
    const key = getDateKey(day, month, year);
    if (!monthlyDataCache[key]) {
      const tasks = await fetchTasks(key);
      setMonthlyDataCache(prev => ({ ...prev, [key]: tasks }));
    }
    setSelectedDay({ day, month, year });
    setIsModalOpen(true);
  };

  const handleTasksUpdate = async (dateKey, tasks) => {
    await saveTasks(dateKey, tasks);
    setMonthlyDataCache(prev => ({ ...prev, [dateKey]: tasks }));
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    onLogout();
  };

  const getDayStatus = (day) => {
    const key = getDateKey(day, month, year);
    const tasks = monthlyDataCache[key];

    if (!tasks || tasks.length === 0) return 'empty';
    if (tasks.every(t => t.done)) return 'completed';
    return 'incomplete';
  };

  const isToday = (day) => {
    return day === todayDate.getDate() &&
           month === todayDate.getMonth() &&
           year === todayDate.getFullYear();
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            📅 Task Manager
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-danger-500 hover:bg-danger-600 text-white rounded-lg font-semibold transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 md:p-6 rounded-xl shadow-md">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 md:px-6 md:py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all active:scale-95"
          >
            ⟵ Prev
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 md:px-6 md:py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all active:scale-95"
          >
            Next ⟶
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 overflow-hidden">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 md:gap-3 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center font-bold text-primary-600 py-2 text-sm md:text-base">
                {day}
              </div>
            ))}
          </div>

          {/* Empty cells for first day offset */}
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"/>
            ))}

            {/* Days */}
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
              const status = getDayStatus(day);
              const todayFlag = isToday(day);

              const baseClasses = "aspect-square rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-2 font-semibold text-sm md:text-base hover:shadow-lg active:scale-95";

              let statusClasses = "";
              if (todayFlag) {
                statusClasses = status === 'completed'
                  ? 'bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg ring-2 ring-success-300'
                  : 'bg-gradient-to-br from-primary-200 to-primary-300 text-primary-700 shadow-lg ring-2 ring-primary-400';
              } else {
                if (status === 'completed') {
                  statusClasses = 'bg-success-100 text-success-600 border-2 border-success-300 hover:bg-success-200';
                } else if (status === 'incomplete') {
                  statusClasses = 'bg-danger-50 text-danger-600 border-2 border-danger-300 hover:bg-danger-100';
                } else {
                  statusClasses = 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100';
                }
              }

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`${baseClasses} ${statusClasses}`}
                >
                  <span>{day}</span>
                  {status !== 'empty' && (
                    <span className="text-xs mt-1">
                      {status === 'completed' ? '✓' : status === 'incomplete' ? '◐' : ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-success-100 border-2 border-success-300 rounded-lg p-4 text-center">
            <p className="text-success-700 font-semibold">✓ Completed</p>
          </div>
          <div className="bg-danger-50 border-2 border-danger-300 rounded-lg p-4 text-center">
            <p className="text-danger-600 font-semibold">◐ Incomplete</p>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center">
            <p className="text-gray-700 font-semibold">- No Tasks</p>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {selectedDay && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          day={selectedDay.day}
          month={selectedDay.month}
          year={selectedDay.year}
          tasks={monthlyDataCache[getDateKey(selectedDay.day, selectedDay.month, selectedDay.year)] || []}
          onTasksUpdate={handleTasksUpdate}
        />
      )}
    </div>
  );
};
