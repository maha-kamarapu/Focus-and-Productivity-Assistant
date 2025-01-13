import { useState, useEffect } from "react";
import { db } from "./firebase"; 
import { collection, getDocs, query, where } from "firebase/firestore";
import { Line } from "react-chartjs-2"; 

const AnalyticsPage = ({ userId }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const q = query(collection(db, "sessions"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const sessionData = querySnapshot.docs.map(doc => doc.data());
        setSessions(sessionData);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [userId]);

  const chartData = {
    labels: sessions.map(session => session.date),  
    datasets: [
      {
        label: 'Focus Time (minutes)',
        data: sessions.map(session => session.focusTime), // Focus time data
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Break Time (minutes)',
        data: sessions.map(session => session.breakTime), // Break time data
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      }
    ]
  };

  return (
    <div>
      <h1>Analytics</h1>
      <Line data={chartData} />
    </div>
  );
};

export default AnalyticsPage;
