import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FaceDetection from './FaceDetection'; 

const Timer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { totalTime, focusTime, breakTime, withFaceDetection } = location.state || {};

  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFocusTime, setIsFocusTime] = useState(true);
  const [totalTimeLeft, setTotalTimeLeft] = useState(totalTime * 60);
  const [focusCycles, setFocusCycles] = useState(0);
  const [breakCycles, setBreakCycles] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [focusTimeElapsed, setFocusTimeElapsed] = useState(0); 
  const [breakTimeElapsed, setBreakTimeElapsed] = useState(0); 
  const [totalDistractedTime, setTotalDistractedTime] = useState(0); 
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractionDuration, setDistractionDuration] = useState(0);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
          alert('Please allow notifications for focus and break alerts. (Highly Recommended)');
        }
      });
    }
  }, []);

  useEffect(() => {
    if (focusTime && breakTime) {
      setTimeLeft(focusTime * 60);
    }
  }, [focusTime, breakTime]);

  useEffect(() => {
    let interval;

    if (isActive && (!withFaceDetection || !isDistracted)) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTotalTimeLeft((prev) => prev - 1);

        if (isFocusTime) {
          setFocusTimeElapsed((prev) => prev + 1);
        } else {
          setBreakTimeElapsed((prev) => prev + 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (totalTimeLeft <= 0) {
      setIsActive(false);
      setTimeLeft(0);
      setShowPopup(true);
      sendNotification('Focus Assistant', 'Total time is up! Great job!');
    } else if (timeLeft === 0 && isActive) {
      if (isFocusTime) {
        if (totalTimeLeft <= breakTime * 0.5 * 60) {
          setTimeLeft(totalTimeLeft);
          sendNotification('Focus Assistant', 'Focus time extended! Use the remaining time wisely.');
        } else {
          setIsFocusTime(false);
          setTimeLeft(breakTime * 60);
          setBreakCycles((prev) => prev + 1);
          sendNotification('Focus Assistant', 'Focus time is up! Take a break.');
        }
      } else {
        setIsFocusTime(true);
        setTimeLeft(focusTime * 60);
        setFocusCycles((prev) => prev + 1);
        sendNotification('Focus Assistant', 'Break time is over! Time to focus.');
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, totalTimeLeft, isFocusTime, focusTime, breakTime, isDistracted, withFaceDetection]);

  useEffect(() => {
    let distractionTimer;

    if (isDistracted && isFocusTime) {
      distractionTimer = setInterval(() => {
        setDistractionDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(distractionTimer);
      setDistractionDuration(0);
    }

    if (distractionDuration >= 5) {
      setIsActive(false);
      setTotalDistractedTime((prev) => prev + distractionDuration);
      sendNotification('Focus Assistant', 'You were distracted for too long! Timer paused.');
      setDistractionDuration(0);
    }

    return () => clearInterval(distractionTimer);
  }, [isDistracted, distractionDuration, isFocusTime]);

  const sendNotification = (title, message) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: 'path-to-your-icon.png',
      });
    }
  };

  const startTimer = () => {
    setIsActive(true);

    if (!hasStarted) {
      setHasStarted(true);
      sendNotification('Focus Assistant', 'Focus time started! Let’s get to work.');
    }
  };

  const stopTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(focusTime * 60);
    setTotalTimeLeft(totalTime * 60);
    setIsFocusTime(true);
    setHasStarted(false);
  };

  const goBack = () => navigate('/');

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      <h2>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</h2>
      <p>{isFocusTime ? 'Focus Time' : 'Break Time'}</p>

      {withFaceDetection && <FaceDetection onDistractionChange={setIsDistracted} />}

      <div>
        <button onClick={startTimer} disabled={isActive || (withFaceDetection && isDistracted)}>Start</button>
        <button onClick={stopTimer} disabled={!isActive}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>

      <div>
        <h3>Focus Cycles: {focusCycles}</h3>
        <h3>Break Cycles: {breakCycles}</h3>
        <h3>
          Total Time Left: {Math.floor(totalTimeLeft / 60)}:
          {totalTimeLeft % 60 < 10 ? '0' : ''}{totalTimeLeft % 60}
        </h3>
      </div>

      <button onClick={goBack}>Back</button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Congratulations! 🎉</h2>
            <p>You've completed your focus session. Great job!</p>
            <button onClick={() => setShowSummary(true)}>Show Summary</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {showSummary && (
        <div className="popup">
          <div className="popup-content">
            <h2>Session Summary</h2>
            <p>Total Focus Time: {Math.floor(focusTimeElapsed / 60)} minutes</p>
            <p>Total Break Time: {Math.floor(breakTimeElapsed / 60)} minutes</p>
            <p>Total Time: {totalTime} minutes</p>
            <p>Focus Cycles: {focusCycles}</p>
            <p>Break Cycles: {breakCycles}</p>
            <p>Total Distracted Time: {Math.floor(totalDistractedTime / 60)} minutes</p>
            <button onClick={() => setShowSummary(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;











