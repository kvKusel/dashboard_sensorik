const convertToMinutes = (time) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours * 60 + minutes;
};

const convertToDate = (timestamp) => {
  return new Date(timestamp);
};

const formatDateToISO = (date) => {
  return date.toISOString();
};

const normalizeAndMerge = (datasetA, datasetB) => {
  const convertedDatasetA = datasetA.map(d => ({ x: convertToDate(d.time), y: d.value }));
  const convertedDatasetB = datasetB.map(d => ({ x: convertToDate(d.time), y: d.value }));

  // Merge and sort datasets by x (date)
  const mergedData = [...convertedDatasetA, ...convertedDatasetB].sort((a, b) => a.x - b.x);

  // Extract unique x values (dates)
  const xValues = [...new Set(mergedData.map(d => d.x.getTime()))].sort((a, b) => a - b);

  // Create normalized datasets
  const normalizedDatasetA = xValues.map(x => {
    const date = new Date(x);
    const point = convertedDatasetA.find(d => d.x.getTime() === x);
    return { time: formatDateToISO(date), value: point ? point.y : 0 };
  });

  const normalizedDatasetB = xValues.map(x => {
    const date = new Date(x);
    const point = convertedDatasetB.find(d => d.x.getTime() === x);
    return { time: formatDateToISO(date), value: point ? point.y : 0 };
  });

  return { normalizedDatasetA, normalizedDatasetB, xValues: xValues.map(x => formatDateToISO(new Date(x))) };
};

export default normalizeAndMerge;
