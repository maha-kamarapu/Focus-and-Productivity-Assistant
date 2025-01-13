import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; 
import { Bar } from 'react-chartjs-2'; 
import './App.css'; 
import SessionStats from './SessionStats'; 


const StatsPage = ({ userId }) => {
  const [userXP, setUserXP] = useState(0);
  const [userStreak, setUserStreak] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [overallStats, setOverallStats] = useState({});

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserXP(userDoc.data().xp || 0); 
          setUserStreak(userDoc.data().streaks || 0); 
        }

        
        const sessionsRef = collection(db, 'sessions');
        const sessionQuery = query(sessionsRef, where('userId', '==', userId)); // Query to filter sessions by userId
        const sessionSnapshot = await getDocs(sessionQuery);
        const sessionData = sessionSnapshot.docs.map(doc => doc.data()); // Map the session data from Firestore
        setSessions(sessionData);

        console.log("Fetched Sessions:", sessionData);  

        // Calculate weekly and monthly stats from session data
        const weeklyData = calculateWeeklyStats(sessionData);
        const monthlyData = calculateMonthlyStats(sessionData);
        setWeeklyStats(weeklyData);
        setMonthlyStats(monthlyData);

        // Calculate overall stats
        const totalFocusTime = sessionData.reduce((total, session) => total + session.focusTime, 0);
        const totalSessions = sessionData.length;
        setOverallStats({ totalFocusTime, totalSessions });

      } catch (error) {
        console.error("Error fetching stats:", error); 
      }
    };

    fetchData(); 
  }, [userId]); 

  
  const calculateWeeklyStats = (sessions) => {
    const weeklyData = [0, 0, 0, 0, 0, 0, 0]; 
    sessions.forEach(session => {
      const dayOfWeek = new Date(session.date).getDay(); 
      weeklyData[dayOfWeek] += session.focusTime; 
    });
    console.log("Weekly Stats Calculated:", weeklyData);  
    return weeklyData;
  };

  
  const calculateMonthlyStats = (sessions) => {
    const monthlyData = [0, 0, 0, 0, 0, 0];
    sessions.forEach(session => {
      const weekOfMonth = Math.floor(new Date(session.date).getDate() / 7); 
      monthlyData[weekOfMonth] += session.focusTime; 
    });
    console.log("Monthly Stats Calculated:", monthlyData);  
    return monthlyData;
  };

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Focus Time (minutes)',
        data: weeklyStats,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const monthlyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Focus Time (minutes)',
        data: monthlyStats,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="stats-page">
      <h1>Your Stats</h1>
      <p>XP: {userXP}</p>
      <p>Current Streak: {userStreak}</p>

      {/* Weekly Stats */}
      <div className="stats-section">
        <h3>Weekly Stats</h3>
        <Bar data={weeklyData} options={{ responsive: true }} />
      </div>

      {/* Monthly Stats */}
      <div className="stats-section">
        <h3>Monthly Stats</h3>
        <Bar data={monthlyData} options={{ responsive: true }} />
      </div>

      {/* Overall Stats */}
      <div className="stats-section">
        <h3>Overall Stats</h3>
        <ul>
          <li>Total Focus Time: {overallStats.totalFocusTime} minutes</li>
          <li>Total Sessions: {overallStats.totalSessions}</li>
          <li>Streaks Achieved: {userStreak}</li>
        </ul>
      </div>
      {/* Session Stats */}
      <div className="stats-section">
        <h3>Your Session Details</h3>
        <SessionStats sessions={sessions} /> 
      </div>

    </div>
  );
};

export default StatsPage;





