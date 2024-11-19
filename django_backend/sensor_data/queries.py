import pandas as pd


def execute_and_process_query(client, org, query):

    # Execute your InfluxDB query here using influxdb-client and process the result into a DataFrame
    result = client.query_api().query(org=org, query=query)

    # Check if the result is not None before processing
    if result:
        # serialize to JSON
        output = result.to_values(columns=['_time', '_value'])

        # transform into a pandas dataframe
        df = pd.DataFrame(output, columns=['time', 'value'])

        return df
    else:
        # Return None if the result is empty
        return None
    


def query_soil_moisture_pleiner_mostbirne(client, org):
    query = f'''
        from(bucket: "Kusel")
            |> range(start: -27h)
            |> filter(fn: (r) => 
                r._measurement == "mqtt_consumer" and
                (r._field == "water_SOIL") and
                r.device == "eui-a840416eb18827cb" 
            )
    '''
    return execute_and_process_query(client, org, query)


def query_soil_moisture_roter_boskoop(client, org):
    query = f'''
        from(bucket: "Kusel")
            |> range(start: -27h)
            |> filter(fn: (r) => 
                r._measurement == "mqtt_consumer" and
                (r._field == "water_SOIL") and
                r.device == "eui-a84041b721876064" 
            )

    '''
    return execute_and_process_query(client, org, query)


def query_soil_moisture_schoener_von_nordhausen(client, org):
    query = f'''
        from(bucket: "Kusel")
            |> range(start: -27h)
            |> filter(fn: (r) => 
                r._measurement == "mqtt_consumer" and
                (r._field == "water_SOIL") and
                r.device == "eui-a8404109118827b3" 
            )
    '''
    return execute_and_process_query(client, org, query)


def query_soil_moisture_cox_orangenrenette(client, org):
    query = f'''
        from(bucket: "Kusel")
            |> range(start: -27h)
            |> filter(fn: (r) => 
                r._measurement == "mqtt_consumer" and
                (r._field == "water_SOIL") and
                r.device == "eui-a84041eff18827d1" 
            )
        '''
    return execute_and_process_query(client, org, query)

def query_soil_moisture_jonathan(client, org):
    query = f'''
        from(bucket: "Kusel")
            |> range(start: -27h)
            |> filter(fn: (r) => 
                r._measurement == "mqtt_consumer" and
                (r._field == "water_SOIL") and
                r.device == "eui-a840411b518827d3" 
            )
        '''
    return execute_and_process_query(client, org, query)


#####################################################           weather station queries             ########################################################


def query_weather_station_precipitation(client, org):
    query = f'''
        from(bucket: "Kusel")
        |> range(start: -27h)
        |> filter(fn: (r) =>
            r._measurement == "mqtt_consumer" and
            r._field == "measurementValue" and
            r.device == "eui-2cf7f1c0443003da" and
            r.type == "Rain Gauge"
        )
        |> aggregateWindow(every: 1h, fn: sum)
    '''
    return execute_and_process_query(client, org, query)

def query_weather_station_temperature(client, org):
    query = f'''
from(bucket: "Kusel")
  |> range(start: -27h)
  |> filter(fn: (r) =>
      r._measurement == "mqtt_consumer" and
      r._field == "measurementValue" and
      r.device == "eui-2cf7f1c0443003da" and
      r.type == "Air Temperature"
    )
  |> aggregateWindow(every: 1h, fn: mean) 

'''
    return execute_and_process_query(client, org, query)

def query_weather_station_uv_index(client, org):
    query = f'''
from(bucket: "Kusel")
  |> range(start: -27h)
  |> filter(fn: (r) =>
      r._measurement == "mqtt_consumer" and
      r._field == "measurementValue" and
      r.device == "eui-2cf7f1c0443003da" and
      r.type == "UV Index"
    )
  |> last()

'''
    return execute_and_process_query(client, org, query)

def query_weather_station_humidity(client, org):
    query = f'''
from(bucket: "Kusel")
  |> range(start: -27h)
  |> filter(fn: (r) =>
      r._measurement == "mqtt_consumer" and
      r._field == "measurementValue" and
      r.device == "eui-2cf7f1c0443003da" and
      r.type == "Air Humidity"
    )
  |> aggregateWindow(every: 1h, fn: mean) 

'''
    return execute_and_process_query(client, org, query)

def query_weather_station_air_pressure(client, org):
    query = f'''
from(bucket: "Kusel")
  |> range(start: -27h)
  |> filter(fn: (r) =>
      r._measurement == "mqtt_consumer" and
      r._field == "measurementValue" and
      r.device == "eui-2cf7f1c0443003da" and
      r.type == "Barometric Pressure"
    )
  |> aggregateWindow(every: 1h, fn: mean) 

'''
    return execute_and_process_query(client, org, query)

def query_weather_station_wind_speed(client, org):
    query = f'''
from(bucket: "Kusel")
  |> range(start: -27h)
  |> filter(fn: (r) =>
      r._measurement == "mqtt_consumer" and
      r._field == "measurementValue" and
      r.device == "eui-2cf7f1c0443003da" and
      r.type == "Wind Speed"
    )
  |> last()

'''
    return execute_and_process_query(client, org, query)

def query_weather_station_wind_direction(client, org):
    query = f'''
from(bucket: "Kusel")
  |> range(start: -27h)
  |> filter(fn: (r) =>
      r._measurement == "mqtt_consumer" and
      r._field == "measurementValue" and
      r.device == "eui-2cf7f1c0443003da" and
      r.type == "Wind Direction Sensor"
    )
  |> last()

'''
    return execute_and_process_query(client, org, query)