import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import WelcomePage from './WelcomePage';
import Dashboard from './Dashboard';
import TimerPage from './TimerPage';
import Timer from './Timer';
import Login from './Login'; 
import NotificationSystem from './components/NotificationSystem';
import StatsPage from "./components/StatsPage";
import SignInPage from "./SignInPage";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./Profile";
import ADHDPage from "./pages/ADHDPage";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState('User');
  const [userId, setUserId] = useState(null); 

  
  const handleLogin = (newUsername) => {
    setIsLoggedIn(true); 
    setUsername(newUsername); 
    localStorage.setItem('username', newUsername); 
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); 
        setUsername(user.displayName || user.email || 'User'); 
        setUserId(user.uid); 
      } else {
        setIsLoggedIn(false);
        setUserId(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <div className="App">
            <NotificationSystem />

      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Welcome Page (requires login) */}
        <Route
          path="/welcome"
          element={
            isLoggedIn ? (
              <WelcomePage username={username} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Dashboard Page (requires login) */}
        <Route
          path="/dashboard"
          element={<PrivateRoute>
            isLoggedIn ? (
              <Dashboard userId={userId} username={username} />
            ) : (
              <Navigate to="/login" replace />
            )
            </PrivateRoute>
          }
        />

        {/* Time Input Page (requires login) */}
        <Route
          path="/set-time"
          element={
            isLoggedIn ? (
              <TimerPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Timer and Face Detection Page (requires login) */}
        <Route
          path="/timer"
          element={
            isLoggedIn ? (
              <Timer />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
       {/* Statistics Display */}
        <Route path="/stats" element={<StatsPage />} />
        {/* Signin Page*/}
        <Route path="/signin" element={<SignInPage />} />

         {/* Profile and Sign Out Page */}
        <Route path="/profile" element={
        <PrivateRoute>
         <Profile />
          </PrivateRoute>}/>

           {/* ADHD Details Page */}
          <Route path="/adhd-support" element={<ADHDPage />} />


         {/* Default Redirect (if no route matches) */}
        <Route path="*" element={<Navigate to="/login" replace />} />


      </Routes>
    </div>
  );
}

export default App;




