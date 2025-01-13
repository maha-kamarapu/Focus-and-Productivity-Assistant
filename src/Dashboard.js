import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { db } from "./firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";  
import Confetti from 'react-confetti';  

const Dashboard = ({ userId }) => {
  const [activePanel, setActivePanel] = useState(0); 
  const [userXP, setUserXP] = useState(0);  
  const [userAchievements, setUserAchievements] = useState([]); 
  const [showConfetti, setShowConfetti] = useState(false); 
  const [levelUpNotification, setLevelUpNotification] = useState(""); 
  const navigate = useNavigate();

  // Panel data
  const panels = [
    {
      title: 'Motivational Content',
      content: 'Stay focused! You can do it!',
      buttonText: 'Start Focus Time',
      action: () => navigate('/set-time'), 
    },
    {
      title: 'Stats',
      content: 'View your progress here!',
      buttonText: 'View Stats',
      action: () => navigate('/stats'), 
    },
  ];

  
  const nextPanel = useCallback(() => {
    setActivePanel((prev) => (prev + 1) % panels.length);
  }, [panels.length]);

  useEffect(() => {
    const interval = setInterval(nextPanel, 3000); 

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserXP(data.xp || 0);  
          setUserAchievements(data.achievements || []);  

          
          if (data.xp >= 100 && !data.achievements.includes("Level 1 Unlocked")) {
            setUserAchievements((prevAchievements) => [
              ...prevAchievements,
              "Level 1 Unlocked"
            ]);
            setLevelUpNotification("🎉 Congratulations on reaching Level 1!");
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);  
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => clearInterval(interval); 
  }, [nextPanel, userId]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* Confetti Animation */}
      {showConfetti && <Confetti />}

      {/* Milestone Notification */}
      {levelUpNotification && (
        <div className="level-up-notification">
          <p>{levelUpNotification}</p>
        </div>
      )}

      {/* Sliding Panels */}
      <div className="sliding-panels">
        {panels.map((panel, index) => (
          <div
            key={index}
            className={`panel-container ${activePanel === index ? 'active' : ''}`}
            onClick={panel.action} 
          >
            <div className="panel">
              <h2>{panel.title}</h2>
              <p>{panel.content}</p>
              <button>{panel.buttonText}</button>
            </div>
          </div>
        ))}
      </div>

      {/* User Stats */}
      <div className="user-stats">
        <h2>Your Stats</h2>
        <p>XP: {userXP}</p>
        <h3>Achievements</h3>
        <ul>
          {userAchievements.length > 0 ? (
            userAchievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))
          ) : (
            <li>No achievements yet!</li>
          )}
        </ul>
      </div>

      {/* Analytics Link */}
      <div className="analytics-link">
        <Link to="/analytics">View Analytics</Link>
      </div>

      {/* Display Statistics */}
      <Link to="/stats">
        <button>View Stats</button>
      </Link>

      <div>
        {/* ADHD Support Link */}
        <button onClick={() => navigate("/adhd-support")}>
          ADHD Support
        </button>
      </div>
    </div>
  );
};

export default Dashboard;








