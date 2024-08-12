import os
import sys
import MySQLdb
import pandas as pd
from django.conf import settings
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Export data from MySQL to CSV'

    def handle(self, *args, **kwargs):
        # Add the project root to the Python path - uncomment for production environment!
        path = '/home/scdash/django_project/dashboard_smartcity/django_backend'
        if path not in sys.path:
            sys.path.append(path)
            self.stdout.write(self.style.SUCCESS(f"Added {path} to sys.path"))

        # Ensure the Django settings module is set, set to production in production environment!
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_backend.settings.production')

        # Retrieve MySQL credentials from Django settings
        MYSQL_HOST = settings.DATABASES['default']['HOST']
        MYSQL_USER = settings.DATABASES['default']['USER']
        MYSQL_PASSWORD = settings.DATABASES['default']['PASSWORD']
        MYSQL_DB = settings.DATABASES['default']['NAME']

        # Connect to the MySQL database
        db = MySQLdb.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            passwd=MYSQL_PASSWORD,
            db=MYSQL_DB
        )

        # Execute the query to fetch data
        query = "SELECT * FROM sensor_data_treehealthreading"
        df = pd.read_sql(query, db)

        # Save DataFrame to CSV
        csv_file_path = "/home/scdash/django_project/dashboard_smartcity/sensor_data_treehealthreading.csv"
        df.to_csv(csv_file_path, index=False)

        self.stdout.write(self.style.SUCCESS(f"Data has been saved to {csv_file_path}"))

        # Close the database connection
        db.close()
