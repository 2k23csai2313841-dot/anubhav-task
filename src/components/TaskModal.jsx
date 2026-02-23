import React, { useState, useEffect } from 'react';
import { getDateKey } from '../utils/api';

const TaskModal = ({ isOpen, onClose, day, month, year, tasks, onTasksUpdate }) => {
  const [taskList, setTaskList] = useState(tasks || []);
  const [newTaskText, setNewTaskText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setTaskList(tasks || []);
  }, [tasks]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;

    const updatedTasks = [...taskList, { text: newTaskText, done: false }];
    setTaskList(updatedTasks);
    onTasksUpdate(getDateKey(day, month, year), updatedTasks);
    setNewTaskText('');
  };

  const handleToggleTask = (index) => {
    const updatedTasks = taskList.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTaskList(updatedTasks);
    onTasksUpdate(getDateKey(day, month, year), updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = taskList.filter((_, i) => i !== index);
    setTaskList(updatedTasks);
    onTasksUpdate(getDateKey(day, month, year), updatedTasks);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  if (!isOpen) return null;

  const completedCount = taskList.filter(t => t.done).length;
  const totalCount = taskList.length;

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-1">📋 Tasks</h3>
              <p className="text-primary-100 text-sm">
                {new Date(year, month, day).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-primary-100 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Progress Bar Section */}
          {totalCount > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Progress</span>
                <span className="text-xs font-bold bg-white text-primary-600 px-3 py-1 rounded-full">
                  {completedCount}/{totalCount}
                </span>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="relative h-3 bg-white/30 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-success-300 to-success-500 transition-all duration-700 ease-out shadow-lg"
                  style={{ 
                    width: `${(completedCount / totalCount) * 100}%`,
                    boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.3)'
                  }}
                >
                  <div className="h-full bg-gradient-to-r from-transparent to-white/20 animate-pulse"></div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-xs text-primary-100 pt-1">
                <span>✓ {completedCount} done</span>
                <span>{totalCount - completedCount} remaining</span>
              </div>

              {/* Completion Percentage */}
              <div className="text-center">
                <span className="text-2xl font-bold text-white">
                  {Math.round((completedCount / totalCount) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tasks List */}
        <div className="p-6">
          {taskList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-3">📝</p>
              <p className="text-gray-600 text-lg font-semibold mb-1">No tasks yet</p>
              <p className="text-gray-500 text-sm">Add your first task to get started</p>
            </div>
          ) : (
            <div className="space-y-2 mb-6">
              {taskList.map((task, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 group border-2 ${
                    task.done
                      ? 'bg-gradient-to-r from-success-50 to-green-50 border-success-300 shadow-sm'
                      : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-300 hover:border-primary-400 hover:shadow-md'
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleTask(index)}
                    className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                      task.done
                        ? 'bg-gradient-to-br from-success-500 to-success-600 border-success-600'
                        : 'border-gray-400 hover:border-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {task.done && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>

                  {/* Task Text */}
                  <span
                    className={`flex-1 font-medium transition-all duration-300 ${
                      task.done
                        ? 'text-gray-400 line-through'
                        : 'text-gray-700'
                    }`}
                  >
                    {task.text}
                  </span>

                  
                  
                </div>
              ))}
            </div>
          )}

          {/* Add Task Input */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-5 rounded-2xl border-2 border-primary-200 shadow-sm">
            <label className="block text-xs font-semibold text-primary-700 mb-2">✏️ Add New Task</label>
            <div className="flex flex-col gap-3 md:flex-row md:gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-2.5 md:py-3 rounded-lg border-2 border-primary-300 focus:outline-none focus:border-primary-600 focus:bg-white focus:shadow-md transition-all text-sm md:text-base placeholder-gray-400"
              />
              <button
                onClick={handleAddTask}
                disabled={newTaskText.trim() === ''}
                className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold text-white transition-all active:scale-95 text-sm md:text-base shadow-md ${
                  newTaskText.trim() === ''
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg'
                }`}
              >
                ➕ Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all active:scale-95 text-sm md:text-base shadow-md hover:shadow-lg"
          >
            ✓ Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

