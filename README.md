# IoT-based Environmental Monitoring and Irrigation Control System

This project involves an IoT-based system that connects an ESP32 with temperature, humidity, and soil moisture sensors to send data to a cloud-based backend. The system allows for remote monitoring of environmental conditions and controls irrigation based on sensor readings.

## Key Components

### 1. Hardware:
- **ESP32**: A microcontroller used for WiFi connectivity and sensor data collection.
- **DHT22 Sensor**: Measures temperature and humidity.
- **Soil Moisture Sensor**: Measures soil moisture content using an analog pin.
- **LED Indicator**: Represents irrigation status (ON/OFF).

### 2. Software:
- **Arduino IDE**: Used for writing and uploading code to the ESP32.
- **Backend (Flask Server)**: Handles sensor data collection, storage, and irrigation control through HTTP requests.
- **Cloudinary**: Used for uploading and storing images.
- **Web Interface**: Displays sensor data and allows manual irrigation control via a frontend interface.

## Backend - Flask API

### Routes

#### `/sensor` [POST]
- **Purpose**: Receives temperature, humidity, and soil moisture data from the ESP32 and updates the sensor data.
- **Request Body**:
    ```json
    {
      "temperature": <float>,
      "humidity": <float>,
      "soil_moisture": <int>
    }
    ```
- **Response**:
    ```json
    {
      "status": "success",
      "message": "Sensor data received"
    }
    ```

#### `/get_sensor_data` [GET]
- **Purpose**: Retrieves the latest sensor data.
- **Response**:
    ```json
    {
      "temperature": <float>,
      "humidity": <float>,
      "soil_moisture": <int>
    }
    ```

#### `/irrigation_control` [POST]
- **Purpose**: Updates the irrigation system state (ON/OFF).
- **Request Body**:
    ```json
    {
      "irrigation_on": <bool>
    }
    ```
- **Response**:
    ```json
    {
      "status": "success",
      "message": "Irrigation state updated",
      "irrigation_state": <bool>
    }
    ```

#### `/get_irrigation_state` [GET]
- **Purpose**: Retrieves the current irrigation state (ON/OFF).
- **Response**:
    ```json
    {
      "irrigation_state": <bool>
    }
    ```

#### `/upload_image` [POST]
- **Purpose**: Uploads images to Cloudinary.
- **Request**: Form data with a file input.
- **Response**:
    ```json
    {
      "status": "success",
      "message": "File uploaded successfully",
      "url": "<cloudinary_image_url>"
    }
    ```

## Frontend (Web Interface)

The frontend consists of an interface for displaying sensor data and controlling irrigation. The following components are used:

- **Temperature Display**: Shows the current temperature with unit toggling between Celsius and Fahrenheit.
- **Humidity Gauge**: Displays the current humidity level.
- **Soil Moisture Gauge**: Displays the soil moisture percentage.
- **Irrigation Control Card**: Allows the user to toggle the irrigation system ON or OFF, represented by a background color change (green for ON, red for OFF).

The frontend fetches sensor data from the backend every 5 seconds and updates the gauges accordingly.

## ESP32 Code Functionality

The code initializes the sensors and connects to WiFi. It continuously reads data from the sensors (temperature, humidity, soil moisture) and sends this data to the backend using HTTP POST requests. It also checks for the irrigation state and updates the LED indicator to show whether irrigation is ON or OFF.

Key functions:
- **sendSensorData()**: Sends temperature, humidity, and soil moisture data to the backend.
- **checkIrrigationState()**: Checks the current irrigation state from the backend and updates the LED accordingly.

## WiFi and HTTP Setup

- **WiFi Credentials**: Replace `ssid` and `password` with your network details.
- **Backend Server URL**: Replace `serverURL` with the URL of your backend.

## Cloudinary Setup

- **API Keys**: Ensure you have valid Cloudinary API credentials to upload images.

## Important Notes

- Ensure that your backend is running and accessible for the ESP32 to send data.
- Make sure the correct API keys are set for Cloudinary to handle image uploads.
- The frontend interacts with the backend to fetch sensor data and control the irrigation system.

