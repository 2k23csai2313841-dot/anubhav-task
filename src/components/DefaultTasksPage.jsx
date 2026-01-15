import React, { useState, useEffect } from 'react';
import { useTaskManagement } from '../hooks/useTaskManagement';

export const DefaultTasksPage = ({ onLogout, onNavigate }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { fetchTasks, saveTasks } = useTaskManagement();

  const DEFAULT_TASK_KEY = 'default_tasks';

  // Load default tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      const loadedTasks = await fetchTasks(DEFAULT_TASK_KEY);
      setTasks(loadedTasks);
      setIsLoading(false);
    };
    loadTasks();
  }, [fetchTasks]);

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;

    const updatedTasks = [...tasks, { text: newTaskText, done: false }];
    setTasks(updatedTasks);
    saveTasks(DEFAULT_TASK_KEY, updatedTasks);
    setNewTaskText('');
  };

  const handleToggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
    saveTasks(DEFAULT_TASK_KEY, updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(DEFAULT_TASK_KEY, updatedTasks);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    onLogout();
  };

  const completedCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-white">
      {/* Header with Navigation */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              ✓ Default Tasks
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

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-t border-primary-500 pt-4">
            <button
              onClick={() => onNavigate('calendar')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-all duration-300 active:scale-95"
            >
              📅 Calendar
            </button>
            <button
              onClick={() => onNavigate('default')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-lg font-semibold transition-all duration-300 active:scale-95 shadow-md"
            >
              ✓ Default Tasks
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Card */}
            {totalCount > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Progress</h3>
                    <p className="text-3xl font-bold text-primary-600 mt-2">
                      {completedCount}/{totalCount}
                    </p>
                  </div>
                  <div className="w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="8"
                        strokeDasharray={`${(completedCount / totalCount) * 283} 283`}
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Add Task Input */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Add New Task
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a new task..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-600 transition-colors"
                />
                <button
                  onClick={handleAddTask}
                  className="px-6 py-3 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white font-semibold rounded-lg transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg"
                >
                  ➕ Add
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No tasks yet. Add one to get started! 🚀</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleTask(index)}
                        className={`flex-shrink-0 w-6 h-6 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                          task.done
                            ? 'bg-gradient-to-r from-success-500 to-success-600 border-success-600'
                            : 'border-gray-300 hover:border-primary-600'
                        }`}
                      >
                        {task.done && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>

                      {/* Task Text */}
                      <span
                        className={`flex-1 text-base transition-all duration-200 ${
                          task.done
                            ? 'text-gray-400 line-through'
                            : 'text-gray-800'
                        }`}
                      >
                        {task.text}
                      </span>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteTask(index)}
                        className="flex-shrink-0 p-2 text-danger-500 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-300 active:scale-95 opacity-0 group-hover:opacity-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
