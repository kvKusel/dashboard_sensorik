from django.urls import path
from .views.views import index, HistoricalPrecipitationView, ForecastDataViewWolfstein, FTPWeatherDataView
from .views.treesense_views import (
    ElectricalResistanceDataView, 
    TreeHealthDataView, 
    TreeMoistureContentDataView
)

from .views.soil_moisture_burg_lichtenberg_views import (
    SoilDataView
)


from .views.weather_stations_views.siebenpfeiffer_gymnasium_views import (
    WeatherDataView
)

from .views.weather_stations_views.burg_lichtenberg_views import (
    WeatherStationDataView
)

from .views.post_method_views.nb_iot_aws import (
    AWSIotCore_Milesight_Sensors
)

from .views.post_method_views.things_network_devices_views import (
    TTNWebhookView
)

from .views.water_level_views import (
    waterLevelDataView
)

from .views.generate_csv_views.csv_hochbeete_soil_and_ph_views import (
    ExportAssetDataView
)   

from .views.generate_csv_views.csv_hochbeete_weather_station import (
    ExportWeatherDataView
)

from .views.generate_csv_views.csv_water_levels_each_water_station import (
    ExportWaterLevelDataView
)

from .views.generate_csv_views.csv_historical_precipitation import (
    ExportPrecipitationDataView 
)
    

from .views.soil_moisture_and_ph_hochbeete_views import (
    pHDataHochbeetProject, SoilMoistureDataHochbeetProject
)

from .views.soil_moisture_etschberg_views import (
    soilMoistureEtschbergDataView
)

from .views.chatbot_views.chatbot_views import ChatEndpointView

from .views.chatbot_views.data_analytics_for_chatbot import DataAnalyticsForChatbot



urlpatterns = [
    path('soil-data/', SoilDataView.as_view(), name='soil_data'),
    path('soil-data/etschberg/', soilMoistureEtschbergDataView.as_view(), name='soil_data'),
    path('weather-station-data/', WeatherStationDataView.as_view(), name='weather_station_data'),
    path('electrical-resistance-data/', ElectricalResistanceDataView.as_view(), name='electrical_resistance_data'),
    path('tree-moisture-content-data/', TreeMoistureContentDataView.as_view(), name='tree_moisture_content_data'),
    path('tree-health-data/', TreeHealthDataView.as_view(), name='tree_health__data'),
    path('ttn-webhook/', TTNWebhookView.as_view(), name='ttn-webhook'),
    path('aws-waterlevel-webhook/', AWSIotCore_Milesight_Sensors.as_view(), name='aws-waterlevel-webhook'),
    path('weather-data-gymnasium/', WeatherDataView.as_view(), name='weather-data-gymnasium'),
    path('soil-moisture-data-hochbeet-project/', SoilMoistureDataHochbeetProject.as_view(), name='soil-moisture-data-hochbeet-project'),
    path('ph-data/', pHDataHochbeetProject.as_view(), name='ph-data'),
    path('water-level-data/', waterLevelDataView.as_view(), name='water-level'),
    path('api/export-asset-data/', ExportAssetDataView.as_view(), name='export_asset_data'),
    path('api/export-water-level-data/', ExportWaterLevelDataView.as_view(), name='export_water_level_data'),
    path('api/export-weather-data/', ExportWeatherDataView.as_view(), name='export_weather_data'),
    path('', index, name='index'),
    path('api/forecast-data-wolfstein/', ForecastDataViewWolfstein.as_view(), name='forecast_data'),
    path('api/historical-precipitation/', HistoricalPrecipitationView.as_view(), name='historical_precipitation'),
    
    path('api/lohnweiler-weather-data/', FTPWeatherDataView.as_view(), name='ftp_weather_data'),


    #csv with precipitation data
    path('api/export-precipitation-data/', ExportPrecipitationDataView.as_view(), name='export-precipitation-data'),

    path('api/chat/', ChatEndpointView.as_view(), name='chat_endpoint'),
    path('api/data-analytics-chatbot/', DataAnalyticsForChatbot.as_view(), name='data_analytics_chatbot'),
]

