import pandas as pd
import openai
from openai import OpenAI
import json
from typing import Dict, Optional, List
from dotenv import load_dotenv
import os
import struct

load_dotenv()


####################################            Setup for the chatbot           ###############################################################

# class ConstrainedDataAnalyzer:
#     def __init__(self, data_dir: str = 'chatbot_data/'):
#         self.data_dir = data_dir
#         self.dataframes: Dict[str, pd.DataFrame] = {}
#         self.metadata: Dict[str, dict] = {}
#         openai.api_key = os.getenv('OPENAI_API_KEY')
#         self.client = OpenAI()  # Initialize the OpenAI client
#         self.load_data()
        
#     def load_data(self):
#         """Load CSVs and generate detailed metadata"""
#         for filename in os.listdir(self.data_dir):
#             if filename.endswith('.csv'):
#                 name = filename.replace('.csv', '')
#                 df = pd.read_csv(os.path.join(self.data_dir, filename), delimiter=';')

#                 # Replace commas with dots in the temperature column and convert to float
#                 df['temperature [C]'] = df['temperature [C]'].str.replace(',', '.').astype(float)

#                 # Parse the time column as datetime and convert it to string for JSON serialization
#                 df['time'] = pd.to_datetime(df['time'], format='%d/%m/%Y %H:%M').astype(str)

#                 # Ensure all 'object' type columns are converted to strings for JSON compatibility
#                 for col in df.select_dtypes(include=['object']).columns:
#                     df[col] = df[col].astype(str)

#                 self.dataframes[name] = df

#                 # Generate metadata, ensuring all object columns are JSON serializable
#                 self.metadata[name] = {
#                     'columns': list(df.columns),
#                     'row_count': len(df),
#                     'column_types': {k: str(v) for k, v in df.dtypes.to_dict().items()},  # Ensure dtype is a string
#                     'numeric_stats': df.describe().to_dict() if not df.select_dtypes(include=['float64']).empty else {},
#                     'categorical_stats': {
#                         col: df[col].value_counts().to_dict()
#                         for col in df.select_dtypes(include=['object']).columns
#                     },
#                     'value_ranges': {
#                         col: {'min': df[col].min(), 'max': df[col].max()}
#                         for col in df.select_dtypes(include=['float64']).columns
#                     }
#                 }




#     def validate_response(self, response: str, relevant_data: pd.DataFrame) -> bool:
#         """Validate that the response only contains information from the provided data"""
        
#         # Extract numerical values from the response
#         import re
#         numbers_in_response = set(map(float, re.findall(r'\d+\.?\d*', response)))
        
#         # Get all possible numerical values from the dataset
#         all_possible_numbers = set()
#         numeric_cols = relevant_data.select_dtypes(include=['int64', 'float64']).columns
#         for col in numeric_cols:
#             all_possible_numbers.update(relevant_data[col].unique())
        
#         # Check if numbers in response are present in or derived from the dataset
#         for num in numbers_in_response:
#             if num > 100000:  # Arbitrary large number that shouldn't appear in normal aggregations
#                 return False
        
#         # Check for categorical values
#         categorical_cols = relevant_data.select_dtypes(include=['object']).columns
#         all_categories = set()
#         for col in categorical_cols:
#             all_categories.update(relevant_data[col].unique())
        
#         # Convert categories to lowercase for case-insensitive comparison
#         all_categories_lower = {str(cat).lower() for cat in all_categories}
        
#         # Check if any words in response are not from our dataset or common analytical terms
#         common_analytical_terms = {
#             'average', 'mean', 'median', 'total', 'sum', 'count', 'minimum', 'maximum',
#             'min', 'max', 'percentage', 'percent', 'approximately', 'about', 'around',
#             'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
#             'data', 'shows', 'indicates', 'suggests', 'reveals', 'based', 'analysis'
#         }
        
#         words_in_response = set(response.lower().split())
#         unexpected_words = words_in_response - all_categories_lower - common_analytical_terms
        
#         # Allow some flexibility for connecting words and common terms
#         if len(unexpected_words) > len(words_in_response) * 0.3:  # If more than 30% of words are unexpected
#             return False
            
#         return True

#     def analyze_data(self, question: str) -> dict:
#         """Analyze data with strict constraints"""
#         try:
#             # System message for the assistant
#             system_message = {
#                 "role": "system",
#                 "content": "You are a data analyst with access to the following datasets: " + ", ".join(self.metadata.keys()) + ". Please choose the most relevant dataset based on the question. If you can't make a choice, ask questions that will help you choose."
#             }

#             # User message for the question
#             user_message = {
#                 "role": "user",
#                 "content": question
#             }

#             # Print metadata for debugging
#             print("Available datasets:", self.metadata.keys())  # Debugging line

#             # Determine which dataset to use
#             dataset_response = self.client.chat.completions.create(
#                 model="gpt-3.5-turbo",
#                 messages=[system_message, user_message],
#                 temperature=0.1
#             )

#             print("Dataset response:", dataset_response)  # Debugging line

#             dataset_name = dataset_response.choices[0].message.content.strip()
#             print(f"Selected dataset: {dataset_name}")  # Debugging line

#             df = self.dataframes.get(dataset_name)

#             if df is None:
#                 return {"error": "Could not determine relevant dataset", "success": False}

#             # Prepare a concise analysis prompt
#             analysis_prompt = [
#                 {
#                     "role": "system",
#                     "content": "You are a data analyst with access ONLY to this specific dataset."
#                 },
#                 {
#                     "role": "user",
#                     "content": f"Question: {question}\n\nAvailable data summary: {self.metadata[dataset_name]}"
#                 }
#             ]

#             response = self.client.chat.completions.create(
#                 model="gpt-3.5-turbo",
#                 messages=analysis_prompt,
#                 temperature=0.1
#             )

#             analysis = response.choices[0].message.content

#             # Validate the response
#             if not self.validate_response(analysis, df):
#                 return {
#                     "error": "Response validation failed - contained information outside of dataset",
#                     "success": False
#                 }

#             return {
#                 "analysis": analysis,
#                 "dataset_used": dataset_name,
#                 "success": True
#             }

#         except Exception as e:
#             return {"error": str(e), "success": False}
        
        

#######################     Payload Decoder for NB-IoT (2 x Milesight EM400-UDL, installed in Wolfstein. Encoded Messages come from AWS IoT Core)       ##############################


class PayloadDecoder:
    def __init__(self, hex_string):
        self.payload = bytes.fromhex(hex_string)
        self.header = {}
        self.sensor_data = {}

    def decode_header(self):
        # Decode the header
        self.header = {
            'start': self.payload[0],
            'id': struct.unpack('>H', self.payload[1:3])[0],
            'packet_length': struct.unpack('>H', self.payload[3:5])[0],
            'flag': self.payload[5],
            'frame_counter': struct.unpack('>H', self.payload[6:8])[0],
            'protocol_version': self.payload[8],
            'software_version': self.payload[9:13].decode(),
            'hardware_version': self.payload[13:17].decode(),
            'sn': self.payload[17:33].decode(),
            'imei': self.payload[33:48].decode(),
            'imsi': self.payload[48:63].decode(),
            'iccid': self.payload[63:83].decode(),
            'signal': self.payload[83],
            'data_length': struct.unpack('>H', self.payload[84:86])[0]
        }

    def decode_sensor_data(self):
        # Decode the data part
        data = self.payload[86:]
        i = 0
        
        while i < len(data):
            channel = data[i]
            type_ = data[i+1]

            if channel == 0x01 and type_ == 0x75:  # Battery
                self.sensor_data['battery'] = data[i+2]
                i += 3
            elif channel == 0x03 and type_ == 0x67:  # Temperature
                self.sensor_data['temperature'] = struct.unpack('<h', data[i+2:i+4])[0] / 10
                i += 4
            elif channel == 0x04 and type_ == 0x82:  # Distance
                self.sensor_data['distance'] = struct.unpack('<H', data[i+2:i+4])[0]
                i += 4
            elif channel == 0x05 and type_ == 0x00:  # Device Position
                self.sensor_data['position'] = "Normal" if data[i+2] == 0 else "Tilt"
                i += 3
            else:
                i += 1

    def decode(self):
        self.decode_header()
        self.decode_sensor_data()
        return {**self.header, 'sensor_data': self.sensor_data}
