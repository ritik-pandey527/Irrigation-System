#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"
#include <ArduinoJson.h>  

// WiFi credentials
const char* ssid = "Rhutika";
const char* password = "12345678";
const char* serverURL = "https://backend-4ml0.onrender.com";

// Pins and sensors
#define DHTPIN 13 // GPIO pin connected to the DHT22
#define DHTTYPE DHT22
#define SOIL_PIN 34 // Analog pin for the soil moisture sensor
#define LED_PIN 12   // LED pin

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi.");
}

void loop() {
  sendSensorData();
  checkIrrigationState();
  delay(1000); // Send data every 5 seconds
}

void sendSensorData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(serverURL) + "/sensor");
    http.addHeader("Content-Type", "application/json");

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int soilMoisture = analogRead(SOIL_PIN);
    soilMoisture = map(soilMoisture, 4095, 0, 0, 100);
    // Check for sensor errors
    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }

    String payload = "{\"temperature\": " + String(temperature) +
                     ", \"humidity\": " + String(humidity) +
                     ", \"soil_moisture\": " + String(soilMoisture) + "}";
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.println("Data sent successfully: " + payload);
    } else {
      Serial.println("Error in sending data.");
    }
    http.end();
  }
}

void checkIrrigationState() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(serverURL) + "/get_irrigation_state");
    int httpResponseCode = http.GET();

    if (httpResponseCode == 200) {
      String response = http.getString();
      // Parse the response to get the irrigation state
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, response);
      String irrigationState = doc["irrigation_state"].as<String>();

      // Toggle the LED or relay based on the irrigation state
      if (irrigationState == "true") {
        digitalWrite(LED_PIN, HIGH);  // Example: Turn on LED to represent irrigation ON
        Serial.println("ON");
      } else {
        digitalWrite(LED_PIN, LOW);  // Example: Turn off LED to represent irrigation OFF
        Serial.println("OFF");
      }
    } else {
      Serial.println("Failed to retrieve irrigation state.");
    }
    http.end();
  }
}
