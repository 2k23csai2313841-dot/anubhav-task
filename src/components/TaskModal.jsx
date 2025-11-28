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

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>Progress</span>
                <span>{completedCount}/{totalCount}</span>
              </div>
              <div className="w-full h-2 bg-primary-400 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success-400 transition-all duration-500"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tasks List */}
        <div className="p-6">
          {taskList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg mb-2">📝 No tasks yet</p>
              <p className="text-gray-500 text-sm">Add your first task below</p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {taskList.map((task, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${
                    task.done
                      ? 'bg-success-50 border-2 border-success-200'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggleTask(index)}
                    className="w-5 h-5 rounded cursor-pointer accent-success-500"
                  />
                  <span
                    className={`flex-1 text-sm md:text-base font-medium transition-all ${
                      task.done
                        ? 'line-through text-gray-400'
                        : 'text-gray-700'
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(index)}
                    className="px-2 py-1 rounded-lg bg-danger-500 hover:bg-danger-600 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Task Input */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-xl border-2 border-primary-200">
            <div className="flex flex-col gap-3 md:flex-row md:gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 md:py-3 rounded-lg border-2 border-primary-300 focus:outline-none focus:border-primary-600 focus:bg-white transition-all text-sm md:text-base"
              />
              <button
                onClick={handleAddTask}
                disabled={newTaskText.trim() === ''}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-white transition-all active:scale-95 text-sm md:text-base ${
                  newTaskText.trim() === ''
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg'
                }`}
              >
                ➕ Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 bg-danger-500 hover:bg-danger-600 text-white font-semibold rounded-lg transition-all active:scale-95 text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
