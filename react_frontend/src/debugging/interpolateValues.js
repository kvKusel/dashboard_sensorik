const datasetA = [
    { time: new Date('2024-08-04T15:42:58').getTime(), value: 75.5 },
    { time: new Date('2024-08-04T16:02:58').getTime(), value: 85.5 }
  ];


  const xValueToInterpolate = new Date('2024-08-04T15:52:58').getTime();
  

    
  console.log(datasetA);
console.log(xValueToInterpolate);


  const interpolate = (x0, y0, x1, y1, x) => {
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  };
  
  const prev = datasetA[0];
  const next = datasetA[1];
  
  const interpolatedValue = interpolate(prev.time, prev.value, next.time, next.value, xValueToInterpolate);
  
  console.log(interpolatedValue); // This should print 80.5
  