const convertToMinutes = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours * 60 + minutes;
  };
  
  const interpolate = (x0, y0, x1, y1, x) => {
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  };


  const convertToDate = (timestamp) => {
    return new Date(timestamp);
  };
  
  const normalizeAndInterpolate = (datasetA, datasetB) => {
    const convertedDatasetA = datasetA.map(d => ({ x: convertToDate(d.time), y: d.value }));
    const convertedDatasetB = datasetB.map(d => ({ x: convertToDate(d.time), y: d.value }));
  
    const xValues = [...new Set([...convertedDatasetA.map(d => d.x), ...convertedDatasetB.map(d => d.x)])].sort((a, b) => a - b);

  
    const interpolateData = (dataset, xValues) => {
      const interpolatedData = [];
      for (let i = 0; i < xValues.length; i++) {
        const x = xValues[i];
        const point = dataset.find(d => d.x === x);
        if (point) {
          interpolatedData.push({ x: x, y: point.y });
        } else {
          const prev = dataset.filter(d => d.x < x).pop();
          const next = dataset.find(d => d.x > x);
          if (prev && next) {
            const y = interpolate(prev.x, prev.y, next.x, next.y, x);
            interpolatedData.push({ x: x, y: y });
          } else {
            interpolatedData.push({ x: x, y: null });
          }
        }
      }
      return interpolatedData;
    };
  
    const normalizedDatasetA = interpolateData(convertedDatasetA, xValues);
    const normalizedDatasetB = interpolateData(convertedDatasetB, xValues);
  
    return { normalizedDatasetA, normalizedDatasetB, xValues };
  };
  
  export default normalizeAndInterpolate;
  