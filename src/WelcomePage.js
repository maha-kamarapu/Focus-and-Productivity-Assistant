import React, {useState} from 'react';
import './App.css'; 
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; 
import { auth } from './firebase'
import { toast } from 'react-toastify';

const WelcomePage = ({ username }) => {
  const navigate = useNavigate(); 
  const [streak, setStreak] = useState(0);

  const handleStreakUpdate = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);

    toast.info(`Streak updated! Current streak: ${newStreak}`);
  };

  
  const goToDashboard = () => {
    navigate('/dashboard'); 
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); 
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="welcome-container">
      <h1>Welcome, {username}!</h1>
      <p>Current Streak: {streak} days</p>
      <button onClick={handleStreakUpdate}>Update Streak</button>
      <button onClick={goToDashboard}>Go to Dashboard</button>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default WelcomePage;





