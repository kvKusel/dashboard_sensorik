from django.urls import path
from .views import AWSIotCore_Milesight_Sensors, ExportWeatherDataView, ExportAssetDataView, pHDataHochbeetProject, waterLevelDataView, SoilDataView, WeatherStationDataView, ElectricalResistanceDataView, TreeHealthDataView, index, TreeMoistureContentDataView, TTNWebhookView, WeatherDataView, SoilMoistureDataHochbeetProject

urlpatterns = [
    path('soil-data/', SoilDataView.as_view(), name='soil_data'),
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
    path('api/export-weather-data/', ExportWeatherDataView.as_view(), name='export_weather_data'),
    path('', index, name='index'),
    #path('api/chat/', ChatEndpointView.as_view(), name='chat_endpoint'),
]

