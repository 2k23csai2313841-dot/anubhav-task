import React, { useState, useCallback } from 'react';
import { LoginPage } from './components/LoginPage';
import { CalendarPage } from './components/CalendarPage';
import { DefaultTasksPage } from './components/DefaultTasksPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true';
  });

  const [currentPage, setCurrentPage] = useState('calendar');

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return (
    <>
      {isLoggedIn ? (
        currentPage === 'calendar' ? (
          <CalendarPage onLogout={handleLogout} onNavigate={handleNavigate} />
        ) : (
          <DefaultTasksPage onLogout={handleLogout} onNavigate={handleNavigate} />
        )
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
