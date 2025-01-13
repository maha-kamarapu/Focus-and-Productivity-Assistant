import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PerformanceChart = ({ sessions }) => {
  const labels = sessions.map(session => new Date(session.date).toLocaleDateString());
  const data = sessions.map(session => session.focusTime);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Focus Time (minutes)',
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Performance Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

export default PerformanceChart;
