import React from 'react';

const SessionStats = ({ sessions }) => {
  return (
    <div>
      <h2>Session Stats</h2>
      <ul>
        {sessions.map((session, index) => (
          <li key={index}>
            <p>Date: {session.date}</p>
            <p>Focus Time: {session.focusTime} minutes</p>
            <p>Break Time: {session.breakTime} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionStats;

