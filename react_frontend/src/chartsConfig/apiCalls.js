import axios from "axios";

export const fetchSoilMoistureData = async (queryType) => {
    try {
        const response = await axios.get(`http://sensorikbackend.eba-acgbgkr4.eu-north-1.elasticbeanstalk.com/soil-data/?query_type=${queryType}`);
        const parsedData = JSON.parse(response.data);
        return parsedData;
    } catch (error) {
        console.error("Error fetching soil moisture data:", error);
        return null;
    }
};

export const fetchWeatherStationData = async (queryType) => {
    try {
        const response = await axios.get(`http://sensorikbackend.eba-acgbgkr4.eu-north-1.elasticbeanstalk.com/weather-station-data/?query_type=${queryType}`);
        const parsedData = JSON.parse(response.data);
        console.log(parsedData)
        return parsedData;
    } catch (error) {
        console.error("Error fetching weather station data:", error);
        return null;
    }
};

export const fetchResistanceData = async () => {
    try {
        const response = await axios.get('http://sensorikbackend.eba-acgbgkr4.eu-north-1.elasticbeanstalk.com/electrical-resistance-data/');
        const parsedData = JSON.parse(response.data);
        return parsedData;
    } catch (error) {
        console.error("Error fetching electrical resistance data from Django:", error);
        return null;
    }
};

export const fetchTreeHealthData = async () => {
    try {
        const response = await axios.get('http://sensorikbackend.eba-acgbgkr4.eu-north-1.elasticbeanstalk.com/tree-health-data/');
        // const parsedData = JSON.parse(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tree health data from Django:", error);
        return null;
    }
};