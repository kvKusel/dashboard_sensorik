# sensor_data/management/commands/populate_devices.py
from django.core.management.base import BaseCommand
from sensor_data.models import Device

class Command(BaseCommand):
    help = "Populate sensor_data_device table with sample devices"

    def handle(self, *args, **options):
        devices = [
            {"id": 1, "device_id": "A84041B42187E5C6", "name": "Cox Orangenrenette", "location": "Default Location"},
            {"id": 2, "device_id": "24e124454d083548-wetter-schule", "name": "Wetter Schule", "location": None},
            {"id": 3, "device_id": "43ec8990-356c-11ef-bce4-c54c62f3e59a", "name": "Wetter Schule", "location": None},
            {"id": 4, "device_id": "a840413cc1884fb6-hochbeet-moisture1", "name": "", "location": None},
            {"id": 5, "device_id": "a8404182ba5900fe-moisture-dragino-2", "name": "", "location": None},
            {"id": 6, "device_id": "a84041ea2b5908ce-moisture-dragino-6", "name": "", "location": None},
            {"id": 7, "device_id": "a84041bf545908c5-moisture-dragino-5", "name": "", "location": None},
            {"id": 8, "device_id": "a84041df075908cc-moisture-dragino-4", "name": "", "location": None},
            {"id": 9, "device_id": "a840414c035908cd-moisture-dragino-3", "name": "", "location": None},
            {"id": 10, "device_id": "a84041f571875f2b-ph-dragino2-schule", "name": "", "location": None},
            {"id": 11, "device_id": "a84041a8e1875f29-ph-dragino1-schule", "name": "", "location": None},
            {"id": 12, "device_id": "2cf7f1c054400013-ph-sensecap2-schule", "name": "", "location": None},
            {"id": 13, "device_id": "2cf7f1c05440005d-ph-sensecap-schule", "name": "", "location": None},
            {"id": 14, "device_id": "A840414A6187E5C5", "name": "Schöner von Nordhausen", "location": "Streuobstwiese"},
            {"id": 15, "device_id": "A840418F1187E5C4", "name": "Pleiner Mostbirne", "location": "Streuobstwiese"},
            {"id": 16, "device_id": "B93052C43298F7D8", "name": "Golden Delicious", "location": "Orchard A"},
            {"id": 17, "device_id": "C75163D54321G9E1", "name": "Granny Smith", "location": "Orchard B"},
            {"id": 18, "device_id": "eui-a8404169c187e059-water-lvl-kv", "name": "Water Level Sensor KV Kusel", "location": None},
            {"id": 19, "device_id": "6749D19422850054", "name": "", "location": None},
            {"id": 20, "device_id": "6749E17352790049", "name": "Rutsweiler", "location": "Rutsweiler"},
            {"id": 21, "device_id": "6749D19427550061", "name": "Kreimbach", "location": None},
            {"id": 22, "device_id": "6749E17530450043", "name": "", "location": None},
            {"id": 23, "device_id": "6749E09866560038", "name": "", "location": None},
            {"id": 24, "device_id": "6749E09611440028", "name": "", "location": None},
            {"id": 25, "device_id": "6749E17323330042", "name": "", "location": None},
            {"id": 26, "device_id": "6749E17419910043", "name": "", "location": None},
            {"id": 37, "device_id": "soil-moisture-etschberg-2-1811", "name": "Soil Moisture Etschberg 2", "location": None},
            {"id": 38, "device_id": "soil-moisture-etschberg-4-181d", "name": "Soil Moisture Etschberg 4", "location": None},
            {"id": 39, "device_id": "soil-moisture-etschberg-3-181a", "name": "Soil Moisture Etschberg 3", "location": None},
            {"id": 40, "device_id": "soil-moisture-etschberg-5-180c", "name": "Soil Moisture Etschberg 5", "location": None},
            {"id": 41, "device_id": "soil-moisture-etschberg-1", "name": "Soil Moisture Etschberg 1", "location": None},
            {"id": 42, "device_id": "pegel_untersulzbach", "name": "Pegel Untersulzbach", "location": None},
            {"id": 43, "device_id": "pegel_lohnweiler_land", "name": "Pegel Lohnweiler / RLP", "location": None},
            {"id": 44, "device_id": "ftp_weather_station", "name": "FTP Weather Station ftp_weather_station", "location": None},
            {"id": 45, "device_id": "pegel_stausee_ohmbach", "name": "Pegel Stausee Ohmbach", "location": None},
            {"id": 46, "device_id": "pegel_nanzdietschweiler", "name": "Pegel Nanzdietschweiler", "location": None},
            {"id": 47, "device_id": "pegel_rammelsbach", "name": "Pegel Rammelsbach 2", "location": None},
            {"id": 48, "device_id": "pegel_eschenau", "name": "Pegel Eschenau", "location": None},
            {"id": 49, "device_id": "pegel_sulzhof", "name": "Pegel Sulzhof", "location": None},
            {"id": 50, "device_id": "pegel_odenbach_steinbruch", "name": "Pegel Odenbach Steinbruch", "location": None},
            {"id": 51, "device_id": "pegel_odenbach", "name": "Pegel Odenbach", "location": None},
            {"id": 52, "device_id": "pegel_niedermohr", "name": "Pegel Niedermohr", "location": None},
            {"id": 53, "device_id": "pegel_loellbach", "name": "Pegel Löllbach", "location": None},
            {"id": 54, "device_id": "6749E17799680048", "name": "", "location": None},
            {"id": 55, "device_id": "6749E17125480048", "name": "Kreimbach_3_new_after_replacement", "location": None},
        ]


        for dev in devices:
            Device.objects.update_or_create(
                id=dev["id"],
                defaults={
                    "device_id": dev["device_id"],
                    "name": dev["name"],
                    "location": dev["location"],
                }
            )

        self.stdout.write(self.style.SUCCESS("Devices populated successfully!"))
