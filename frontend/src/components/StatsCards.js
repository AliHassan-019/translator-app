import React from 'react';

const statsData = [
  { label: 'New Users', value: '8,282' },
  { label: 'Total Orders', value: '200,521' },
  { label: 'Available Products', value: '215,542' },
];

const StatsCards = () => {
  return (
    <div className="stats-grid">
      {statsData.map((stat, idx) => (
        <div className="stats-card" key={idx}>
          <h3>{stat.value}</h3>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
