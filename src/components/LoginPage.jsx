import React, { useState, useEffect } from 'react';
import { getDateKey } from '../utils/api';

export const LoginPage = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('loggedIn') === 'true') {
      onLoginSuccess();
    }
  }, [onLoginSuccess]);

  const handleLogin = () => {
    setError('');
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      if (userId.trim() === '2313841' && password.trim() === 'anu') {
        localStorage.setItem('loggedIn', 'true');
        onLoginSuccess();
      } else {
        setError('❌ Incorrect Credentials');
      }
      setIsLoading(false);
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-sm mx-4 animate-fadeIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">🔐 Task Manager</h2>
          <p className="text-gray-600 text-sm md:text-base">Login to continue</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="User ID"
            className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-600 focus:bg-primary-50 transition-all text-gray-700"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Password"
            className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:border-primary-600 focus:bg-primary-50 transition-all text-gray-700"
          />

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              isLoading
                ? 'bg-primary-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
            }`}
          >
            {isLoading ? '⏳ Logging in...' : 'Login'}
          </button>

          {error && (
            <p className="text-center text-danger-600 font-medium text-sm md:text-base mt-3">
              {error}
            </p>
          )}
        </div>

        
      </div>
    </div>
  );
};
