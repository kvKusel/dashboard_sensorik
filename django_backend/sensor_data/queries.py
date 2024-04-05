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
    


def query_soil_moisture_sensor1(client, org):
    query = f'''
        from(bucket: "Kusel")
            |> range(start: -1d)
            |> filter(fn: (r) => 
                r._measurement == "mqtt_consumer" and
                (r._field == "water_SOIL") and
                r.device == "eui-a84041b721876064" 
            )
    '''
    return execute_and_process_query(client, org, query)


def query_soil_moisture_sensor2(client, org):
    query = f'''
        from(bucket: "Kusel")
            |> range(start: -1d)
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
            |> range(start: -1d)
            |> filter(fn: (r) => 
                r._measurement == "mqtt_consumer" and
                (r._field == "water_SOIL") and
                r.device == "eui-a840411b518827d3" 
            )
        '''
    return execute_and_process_query(client, org, query)


# put the rest of the soil moisture queries here...

def query_weather_station_precipitation(client, org):
    query = f'''
        from(bucket: "Kusel")
        |> range(start: -1d)
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
  |> range(start: -1d)
  |> filter(fn: (r) =>
      r._measurement == "mqtt_consumer" and
      r._field == "measurementValue" and
      r.device == "eui-2cf7f1c0443003da" and
      r.type == "Air Temperature"
    )
  |> aggregateWindow(every: 1h, fn: mean) 

'''
    return execute_and_process_query(client, org, query)