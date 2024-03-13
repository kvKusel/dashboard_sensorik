// CustomHeatmap.js
import React from 'react';

const Heatmap = () => {

    const legendData = [
        { label: 'Low', color: 'rgba(255, 0, 0, 0.2)' },
        { label: 'Medium', color: 'rgba(255, 0, 0, 0.5)' },
        { label: 'High', color: 'rgba(255, 0, 0, 0.8)' },
      ];

  // Generate some random data for demonstration purposes
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');

  const generateRandomData = () => {
    const daysDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));

    const data = [];
    for (let index = 0; index <= daysDiff; index++) {
      const date = new Date(startDate.getTime() + index * (24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      const value = getRandomInt(1, 20); // Adjust the range of random values as needed

      data.push({ date, value });

      // Break out of the loop after generating 30 squares (emulates 30 days)
      if (data.length >= 30) {
        break;
      }
    }

    return data;
  };

  const data = generateRandomData();

  // Calculate maxValue from data (you can customize this based on your actual data)
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="heatmap-container">
      <h2 className="heatmap-title">Niederschlag Heatmap</h2>

      <div className="custom-heatmap">
        {data.map((item) => (
          <div
            key={item.date}
            className="heatmap-square"
            style={{
              backgroundColor: `rgba(255, 0, 0, ${item.value / maxValue})`,
              width: '30px', // Adjust the width as needed
              height: '30px', // Adjust the height as needed
            }}
          />
        ))}
      </div>

      <div className="heatmap-legend">
        {legendData.map((legendItem, index) => (
          <div key={index} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: legendItem.color }} />
            <span className="legend-label">{legendItem.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;