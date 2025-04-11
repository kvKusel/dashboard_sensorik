import React from 'react';
import { GaugeComponent } from 'react-gauge-component';

const GaugeWaterLevel = ({ value, arcs }) => {
  const toCm = (value) => {
    return Number.isInteger(value) ? value.toFixed(0) + ' cm' : value.toFixed(1) + ' cm';
  };

  // Calculate dynamic maxValue based on arcs
  const maxValue = arcs ? Math.max(...arcs.map(arc => arc.limit)) : 300;

  // Calculate dynamic ticks based on arcs
  const ticks = arcs ? arcs.map((arc) => ({ value: arc.limit })) : [{ value: 300 }];

  return (
    <GaugeComponent
      style={{ width: '100%', height: '100%' }}
      arc={{ subArcs: arcs }}
      value={value}
      minValue={0} // Set the minimum value
      maxValue={maxValue} // Dynamically set the maximum value based on arcs
      ticks={ticks} // Dynamically set the ticks based on arcs
      labels={{
        valueLabel: {
          formatTextValue: toCm,
          style: { fontSize: 30, fill: "#18204F" },  // Set color for the current value
        },
        tickLabels: {
          type: "outer",
          ticks: ticks,  // Apply dynamic ticks here
          defaultTickValueConfig: {
            formatTextValue: toCm,
            style: { fontSize: 15, fill: '#18204F' },  // Set color for tick labels
          },
        },
      }}
    />
  );
};

export default GaugeWaterLevel;
