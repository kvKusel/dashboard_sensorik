from django.urls import path
from .views import SoilDataView, WeatherStationDataView, ElectricalResistanceDataView, TreeHealthDataView

urlpatterns = [
    path('soil-data/', SoilDataView.as_view(), name='soil_data'),
    path('weather-station-data/', WeatherStationDataView.as_view(), name='weather_station_data'),
    path('electrical-resistance-data/', ElectricalResistanceDataView.as_view(), name='electrical_resistance_data'),
    path('tree-health-data/', TreeHealthDataView.as_view(), name='tree_health__data'),

]
