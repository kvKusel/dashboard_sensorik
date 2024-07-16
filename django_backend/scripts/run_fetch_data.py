# /home/yourusername/yourproject/scripts/run_fetch_moisture_data.py

import os
import time
import subprocess

while True:
    try:
        # Run the Django management command
        result = subprocess.run(['python', 'manage.py', 'fetch_data'], check=True)
        if result.returncode == 0:
            print("Command executed successfully.")
        else:
            print(f"Command failed with return code {result.returncode}")
    except subprocess.CalledProcessError as e:
        print(f"Error while executing command: {e}")

    # Wait for 20 minutes before running the command again
    time.sleep(20 * 60)
