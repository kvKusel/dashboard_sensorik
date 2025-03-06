import React from 'react';
import { GaugeComponent } from 'react-gauge-component';

const GaugeWaterLevel = ({ value, arcs }) => {

  const toCm = (value) => {
    return Number.isInteger(value) ? value.toFixed(0) + ' cm' : value.toFixed(1) + ' cm';
  };

  return (
    <GaugeComponent
    style={{ width: '100%', height: '100%' }}
      arc={{ subArcs: arcs }}
      value={value}
      minValue={0} // Set the minimum value
      maxValue={300} // Set the maximum value
      labels={{
        valueLabel: {
          formatTextValue: toCm,
          style: { fontSize: 30, fill: "lightgray" },  // Set color for the current value

        },
        tickLabels: {
          type: "outer",
          ticks: [
            { value: 300 },
          ],
          defaultTickValueConfig: {
            formatTextValue: toCm,
            style: { fontSize: 14, color: 'lightgray' },  // Set color for tick labels
          },
        },
      }}
    />
  );
};

export default GaugeWaterLevel;
