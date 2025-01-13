import React, { useState } from 'react';
import './App.css'; 
import { useNavigate } from 'react-router-dom';
import { addSessionData, updateUserStreaks } from './firebase'; 
import { toast } from 'react-toastify';

const TimerPage = () => {
  const [formData, setFormData] = useState({
    totalTime: '',
    focusTime: '',
    breakTime: '',
  });

  const [errors, setErrors] = useState({
    totalTime: '',
    focusTime: '',
    breakTime: '',
    combinedTime: '',
  });

  const [userId] = useState("user123"); 
  const [currentStreak, setCurrentStreak] = useState(0);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', 
      combinedTime: '', 
    }));
  };

  const validateForm = () => {
    const { totalTime, focusTime, breakTime } = formData;
    const newErrors = {};

    if (!totalTime || totalTime < 2) {
      newErrors.totalTime = 'Total time must be at least 2 minutes.';
    }
    if (!focusTime || focusTime < 1) {
      newErrors.focusTime = 'Focus time must be at least 1 minute.';
    }
    if (!breakTime || breakTime < 1) {
      newErrors.breakTime = 'Break time must be at least 1 minute.';
    }
    if (
      parseInt(focusTime || 0) + parseInt(breakTime || 0) >
      parseInt(totalTime || 0)
    ) {
      newErrors.combinedTime =
        'The combined focus time and break time must not exceed the total time.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateXP = (focusTime) => {

    return Math.floor(focusTime / 10) * 10;
  };

  const handleCompleteSession = async (focusTime, breakTime) => {
    const date = new Date().toISOString(); // Store the date of the session
    if (focusTime >= 25) {
      toast.success("Excellent! You stayed focused for 25 minutes!");
    } else if (focusTime >= 10) {
      toast.info("Good job! Keep it up!");
    } else {
      toast.warn("Try to focus for a bit longer next time.");
    }

    try {
      await addSessionData(userId, focusTime, breakTime, date);

      let newStreak = currentStreak + 1; 
      if (breakTime >= 5) {
      
        newStreak = 0;
      }
      setCurrentStreak(newStreak);

      // Store the updated streak
      await updateUserStreaks(userId, newStreak);

      // Update XP (this could be based on streaks or focus time)
      const xpAwarded = calculateXP(focusTime);
      // Here you should also update XP in Firestore, but for now, we log it
      console.log(`XP Awarded: ${xpAwarded}`);

      alert(`You earned ${xpAwarded} XP and your streak is ${newStreak}`);
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };

  const handleStartTimer = (withFaceDetection) => {
    if (validateForm()) {
      const { totalTime, focusTime, breakTime } = formData;

      navigate('/timer', {
        state: {
          totalTime: parseInt(totalTime),
          focusTime: parseInt(focusTime),
          breakTime: parseInt(breakTime),
          withFaceDetection,
          onCompleteSession: (focusTime, breakTime) =>
            handleCompleteSession(focusTime, breakTime), // Pass handler to TimerPage
        },
      });
    }
  };

  return (
    <div className="timer-page-container">
      <h1>Set Your Timer</h1>
      <form className="timer-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-box">
          <label>Total Time (minutes)</label>
          <input
            type="number"
            name="totalTime"
            value={formData.totalTime}
            onChange={handleInputChange}
            placeholder="Enter total time"
            className={errors.totalTime ? 'error' : ''}
          />
          {errors.totalTime && <p className="error-message">{errors.totalTime}</p>}
        </div>
        <div className="input-box">
          <label>Focus Time (minutes)</label>
          <input
            type="number"
            name="focusTime"
            value={formData.focusTime}
            onChange={handleInputChange}
            placeholder="Enter focus time"
            className={errors.focusTime ? 'error' : ''}
          />
          {errors.focusTime && <p className="error-message">{errors.focusTime}</p>}
        </div>
        <div className="input-box">
          <label>Break Time (minutes)</label>
          <input
            type="number"
            name="breakTime"
            value={formData.breakTime}
            onChange={handleInputChange}
            placeholder="Enter break time"
            className={errors.breakTime ? 'error' : ''}
          />
          {errors.breakTime && <p className="error-message">{errors.breakTime}</p>}
        </div>
        {errors.combinedTime && <p className="error-message">{errors.combinedTime}</p>}
        <div className="button-group">
          <button
            type="button"
            className="submit-button"
            onClick={() => handleStartTimer(false)}
          >
            Start Timer Only
          </button>
          <button
            type="button"
            className="submit-button"
            onClick={() => handleStartTimer(true)}
          >
            Start Timer with Face Detection
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimerPage;


