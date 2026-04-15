import React, { useState, useEffect } from "react";
import { useTaskManagement } from "../hooks/useTaskManagement";
import { getDateKey, getDaysInMonth } from "../utils/api";
import TaskModal from "./TaskModal";

export const CalendarPage = ({ onLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todayDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthlyDataCache, setMonthlyDataCache] = useState({});
  const [loadingDates, setLoadingDates] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { fetchTasks, saveTasks } = useTaskManagement();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const totalDays = getDaysInMonth(currentDate);
  const firstDay = new Date(year, month, 1).getDay();

  // Load tasks for current month from day 1 to today
  useEffect(() => {
    const loadMonthTasks = async () => {
      const currentMonth = todayDate.getMonth();
      const currentYear = todayDate.getFullYear();
      const currentDay = todayDate.getDate();

      // Load tasks from day 1 to today
      for (let day = 1; day <= currentDay; day++) {
        const dateKey = getDateKey(day, currentMonth + 1, currentYear);
        if (!monthlyDataCache[dateKey]) {
          try {
            const tasks = await fetchTasks(dateKey);
            setMonthlyDataCache((prev) => ({
              ...prev,
              [dateKey]: tasks,
            }));
          } catch (err) {
          }
        }
      }
      setIsLoading(false);
    };

    loadMonthTasks();
  }, [todayDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleDayClick = async (day) => {
    // Fetch tasks on demand when day is clicked
    const key = getDateKey(day, month + 1, year);
    if (!monthlyDataCache[key]) {
      setLoadingDates((prev) => new Set(prev).add(key));
      const tasks = await fetchTasks(key);
      setMonthlyDataCache((prev) => ({ ...prev, [key]: tasks }));
      setLoadingDates((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
    setSelectedDay({ day, month, year });
    setIsModalOpen(true);
  };

  const handleTasksUpdate = async (dateKey, tasks) => {
    try {
      console.log(
        "📝 Updating tasks for date:",
        dateKey,
        "Count:",
        tasks.length,
      );
      const success = await saveTasks(dateKey, tasks);
      if (success || success === undefined) {
        setMonthlyDataCache((prev) => ({ ...prev, [dateKey]: tasks }));
        console.log("✓ Tasks updated in cache");
      } else {
        console.error("❌ Failed to save tasks");
      }
    } catch (err) {
      console.error("❌ Error updating tasks:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    onLogout();
  };

  const getDayStatus = (day) => {
    const key = getDateKey(day, month + 1, year);
    const tasks = monthlyDataCache[key];

    if (!tasks || tasks.length === 0) return "empty";
    if (tasks.every((t) => t.done)) return "completed";
    return "incomplete";
  };

  const isBeforeToday = (day) => {
    const checkDate = new Date(year, month, day);
    const today = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate(),
    );
    return checkDate < today;
  };

  const isAfterToday = (day) => {
    const checkDate = new Date(year, month, day);
    const today = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate(),
    );
    return checkDate > today;
  };

  const isToday = (day) => {
    return (
      day === todayDate.getDate() &&
      month === todayDate.getMonth() &&
      year === todayDate.getFullYear()
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
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
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center font-bold text-primary-600 py-2 text-sm md:text-base"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Empty cells for first day offset */}
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {Array(firstDay)
              .fill(null)
              .map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

            {/* Days */}
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
              const key = getDateKey(day, month + 1, year);
              const isLoadingThis = loadingDates.has(key);
              const status = getDayStatus(day);
              const todayFlag = isToday(day);
              const beforeToday = isBeforeToday(day);
              const afterToday = isAfterToday(day);

              const baseClasses =
                "aspect-square rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-2 font-semibold text-sm md:text-base hover:shadow-lg active:scale-95 relative overflow-hidden";

              let statusClasses = "";

              if (isLoadingThis) {
                // Skeleton loading state
                statusClasses =
                  "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse";
              } else if (todayFlag) {
                // TODAY - Special highlight with different colors based on completion
                if (status === "completed") {
                  // All tasks done today ✓
                  statusClasses =
                    "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-2xl ring-4 ring-emerald-300 animate-pulse border-2 border-emerald-600 scale-105";
                } else if (status === "empty") {
                  // No tasks for today
                  statusClasses =
                    "bg-gradient-to-br from-amber-400 to-amber-500 text-gray-900 shadow-2xl ring-4 ring-amber-300 animate-pulse border-2 border-amber-600 scale-105";
                } else {
                  // Tasks incomplete today ◐
                  statusClasses =
                    "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl ring-4 ring-blue-300 animate-pulse border-2 border-blue-700 scale-105";
                }
              } else if (beforeToday) {
                // PAST DAYS - Color based on completion status
                if (status === "completed") {
                  // All tasks done - Green ✓
                  statusClasses =
                    "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-110";
                } else {
                  // Tasks not completed - Red ✕
                  statusClasses =
                    "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:shadow-lg transform hover:scale-110";
                }
              } else if (afterToday) {
                // FUTURE DAYS - Light gray
                statusClasses =
                  "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 shadow-md hover:shadow-lg opacity-50";
              } else {
                // Fallback
                statusClasses =
                  "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100";
              }

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`${baseClasses} ${statusClasses}`}
                  disabled={isLoadingThis}
                >
                  {isLoadingThis ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
                    </div>
                  ) : (
                    <>
                      <span>{day}</span>
                      {todayFlag ? (
                        <span className="text-xs mt-1 animate-bounce font-bold">
                          {status === "completed"
                            ? "✓ DONE"
                            : status === "empty"
                              ? "-"
                              : "◐ TODO"}
                        </span>
                      ) : (
                        <span className="text-xs mt-1 font-bold">
                          {beforeToday
                            ? status === "completed"
                              ? "✓"
                              : "✕"
                            : afterToday
                              ? "—"
                              : ""}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 text-center shadow-md">
            <p className="font-semibold">✓ All Completed</p>
            <p className="text-xs mt-1">Past dates</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4 text-center shadow-md">
            <p className="font-semibold">✕ Incomplete</p>
            <p className="text-xs mt-1">Past dates</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-lg p-4 text-center shadow-md border-2 border-emerald-600 scale-105">
            <p className="font-semibold">✓ Today Done</p>
            <p className="text-xs mt-1">Current day</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center shadow-md border-2 border-blue-700 scale-105">
            <p className="font-semibold">◐ Today Pending</p>
            <p className="text-xs mt-1">Current day</p>
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
          tasks={
            monthlyDataCache[
              getDateKey(
                selectedDay.day,
                selectedDay.month + 1,
                selectedDay.year,
              )
            ] || []
          }
          onTasksUpdate={handleTasksUpdate}
        />
      )}
    </div>
  );
};
