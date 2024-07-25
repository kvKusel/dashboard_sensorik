import React, { useState } from "react";
import LeafletMap from "../LeafletMap";
import LineChart from "../LineChart";
import BarChart from "../BarChart";

import {
  precipitationConfig,
  temperatureConfig,
  soilMoistureConfig,
  electricalResistanceConfig,
  treeMoistureContentLineChartConfig,
  airPressureConfig,
  humidityConfig
} from "../../../../chartsConfig/chartsConfig";

import WeatherMap from "./WeatherMap";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  CardMedia,
  CardActions,
  Button,
} from "@mui/material";



import { useWeatherStationHumidity } from "../../../../hooks/weatherStation/WeatherStationHumidity";
import { useWeatherStationAirPressure } from "../../../../hooks/weatherStation/WeatherStationAirPressure";
import { useWeatherStationWindSpeed } from "../../../../hooks/weatherStation/WeatherStationWindSpeed";
import { useWeatherStationWindDirection } from "../../../../hooks/weatherStation/WeatherStationWindDirection";
import { useWeatherStationPrecipitation } from "../../../../hooks/weatherStation/WeatherStationPrecipitation ";
import { useWeatherStationTemperature } from "../../../../hooks/weatherStation/WeatherStationTemperatureData";
import { useWeatherStationUVIndex } from "../../../../hooks/weatherStation/WeatherStationUVIndex";

import {
  fetchWeatherStationData,
} from "../../../../chartsConfig/apiCalls";

const WeatherDashboard = () => {

  //temperature data from the weather station
  const { weatherStationTemperatureData, lastValueWeatherStationTemperature } =
    useWeatherStationTemperature();

  //precipitation data from the weather station
  const {
    weatherStationPrecipitationData,
    lastTimestampFormatted,
    lastPrecipitationValue,
  } = useWeatherStationPrecipitation();

    //UV-Index data from the weather station
    const uVIndex = useWeatherStationUVIndex();

    //humidity data from the weather station
    const {lastValueWeatherStationHumidity, weatherStationHumidityData }  = useWeatherStationHumidity();
  
    //air pressure data from the weather station
    const {weatherStationAirPressureData, lastValueWeatherStationAirPressure} = useWeatherStationAirPressure();
  
    //wind speed data from the weather station
    const windSpeed = useWeatherStationWindSpeed();
  
    //wind direction data from the weather station
    const windDirection = useWeatherStationWindDirection();

  console.log("air pressure," , weatherStationAirPressureData)


  return (
    <>
      <div className="row mt-4" style={{ flex: "1 1 auto" }}>
        <div
          className="col-12 p-2 mb-3 mx-2"
          style={{
            flex: "1 1 auto",

            backgroundColor: "#5D7280",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#5D7280",
            zIndex: "0", //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
          }}
        >
          <WeatherMap />
        </div>
      </div>


     {/* <div className="row mb-3" style={{ flex: "1 1 auto"}}>
        <div className="col-12 d-flex flex-wrap px-2">
          <div
            className="col-12 col-md-6 col-lg-4 col-xl-5  d-flex align-items-center p-5"
            style={{
              backgroundColor: "#5D7280",
              color: "lightgray",
            }}
          >
            <div className="px-4">Wetterstation Burg Lichtenberg</div>
            <div className="">
            <label className="switch">
            <input type="checkbox" defaultChecked disabled/>
            <span className="slider round"></span>
          </label>
            </div>
          </div>

          <div
            className="col-12 col-md-6 col-lg-8 col-xl-7  d-flex align-items-center p-5"
            style={{
              backgroundColor: "#5D7280",
              color: "lightgray",
            }}
          >
            <div className="px-4">Wetterstation Siebenpfeiffer-Gymnasium</div>
            <div className="">
              <label className="switch">
    <input type="checkbox" disabled />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div> */}


      <div className="row mb-3" style={{ flex: "1 1 auto" }}>
  <div className="col-12 d-flex flex-wrap px-2">
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={4}>
        <Card style={{ backgroundColor: "#5D7280", color: "lightgray" }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              <strong>Temperatur</strong>
            </Typography>
            <Typography variant="body2" color="lightgray">
              Aktueller Wert: {lastValueWeatherStationTemperature} °C
            </Typography>
            <Typography variant="body2" color="lightgray">
              Am: {lastTimestampFormatted}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card style={{ backgroundColor: "#5D7280", color: "lightgray" }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            <strong>Niederschlag</strong>
            </Typography>
            <Typography variant="body2" color="lightgray">
              Aktueller Wert: {lastPrecipitationValue} mm
            </Typography>
            <Typography variant="body2" color="lightgray">
              Am: {lastTimestampFormatted}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card style={{ backgroundColor: "#5D7280", color: "lightgray" }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            <strong>Luftfeuchte</strong>
            </Typography>
            <Typography variant="body2" color="lightgray">
              Aktueller Wert: {lastValueWeatherStationHumidity} %
            </Typography>
            <Typography variant="body2" color="lightgray">
              Am: {lastTimestampFormatted}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card style={{ backgroundColor: "#5D7280", color: "lightgray" }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            <strong>Luftdruck</strong>
            </Typography>
            <Typography variant="body2" color="lightgray">
              Aktueller Wert: {lastValueWeatherStationAirPressure } hPa
            </Typography>
            <Typography variant="body2" color="lightgray">
              Am: {lastTimestampFormatted}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card style={{ backgroundColor: "#5D7280", color: "lightgray" }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            <strong>Windgeschw.</strong>
            </Typography>
            <Typography variant="body2" color="lightgray">
              Aktueller Wert: {windSpeed} m/s
            </Typography>
            <Typography variant="body2" color="lightgray">
              Am: {lastTimestampFormatted}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Card style={{ backgroundColor: "#5D7280", color: "lightgray" }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            <strong>Windrichtung</strong>
            </Typography>
            <Typography variant="body2" color="lightgray">
              Aktueller Wert: {windDirection} 
            </Typography>
            <Typography variant="body2" color="lightgray">
              Am: {lastTimestampFormatted}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </div>
</div>


      <div className="row " style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex px-2 ">
          <div
            className="chart-container d-flex "
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
              backgroundColor: "#5D7280",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "#5D7280",
            }}
          >
            {weatherStationTemperatureData && (
              <LineChart
                id="temperatureChart"
                lineChartConfig={temperatureConfig}
                lineData={weatherStationTemperatureData}
              />
            )}
          </div>
        </div>
      </div>


      <div className="row mt-3 mb-3" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex px-2 ">
          <div
            className="chart-container d-flex "
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
  
              backgroundColor: "#5D7280",
   
            }}
          >
            {weatherStationPrecipitationData && (
              <BarChart
                barChartConfig={precipitationConfig}
                barChartData={weatherStationPrecipitationData}
              />
            )}
          </div>
        </div>
      </div>

    
      <div className="row mt-3 mb-3" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex px-2 ">
          <div
            className="chart-container d-flex "
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
  
              backgroundColor: "#5D7280",
   
            }}
          >
            {weatherStationAirPressureData && (
              <LineChart
                lineChartConfig={airPressureConfig}
                lineData={weatherStationAirPressureData}
                id="temperatureChart"              />
            )}
          </div>
        </div>
      </div>


    
      <div className="row mt-3 mb-3" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex px-2 ">
          <div
            className="chart-container d-flex "
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
  
              backgroundColor: "#5D7280",
   
            }}
          >
            {weatherStationAirPressureData && (
              <LineChart
                lineChartConfig={humidityConfig}
                lineData={weatherStationHumidityData}
                id="temperatureChart"              />
            )}
          </div>
        </div>
      </div>

      
    </>
  );
};

export default WeatherDashboard;
