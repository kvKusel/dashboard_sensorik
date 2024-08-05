const convertToDate = (timestamp) => {
  return new Date(timestamp);
};

const normalizeAndInterpolate = (datasetA, datasetB) => {
  // Convert time values to Date objects
  const convertedDatasetA = datasetA.map(d => ({ x: convertToDate(d.time), y: d.value }));
  const convertedDatasetB = datasetB.map(d => ({ x: convertToDate(d.time), y: d.value }));

  // Combine and sort unique x values (timestamps)
  const xValues = [...new Set([...convertedDatasetA.map(d => d.x), ...convertedDatasetB.map(d => d.x)])].sort((a, b) => a - b);

  // Create normalized datasets with possible gaps
  const normalizeData = (dataset, xValues) => {
    return xValues.map(x => {
      const point = dataset.find(d => d.x.getTime() === x.getTime());
      return { x: x, y: point ? point.y : null };
    });
  };

  const normalizedDatasetA = normalizeData(convertedDatasetA, xValues);
  const normalizedDatasetB = normalizeData(convertedDatasetB, xValues);

  return { normalizedDatasetA, normalizedDatasetB, xValues };
};

export default normalizeAndInterpolate;
