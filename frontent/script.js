// Units for temperature
const units = { Celcius: "°C", Fahrenheit: "°F" };

// Initial configuration for temperature
const config = {
    minTemp: -20,
    maxTemp: 50,
    currentTemp: 30,
    unit: "Celcius",
};

let humidityValue = 0;
let soilMoistureValue = 0;

const tempValueInputs = document.querySelectorAll("input[type='text']");
tempValueInputs.forEach(input => {
    input.addEventListener("change", event => {
        const newValue = parseFloat(event.target.value);
        if (isNaN(newValue)) {
            input.value = config[input.id];
            return;
        } else {
            config[input.id] = newValue;
            if (input.id === "currentTemp") {
                setTemperature();
            }
        }
    });
});

const unitP = document.getElementById("unit");
unitP.addEventListener("click", () => {
    config.unit = config.unit === "Celcius" ? "Fahrenheit" : "Celcius";
    unitP.innerHTML = `${config.unit} ${units[config.unit]}`;
    setTemperature();
});

const temperature = document.getElementById("temperature");
function setTemperature() {
    let displayTemp = config.currentTemp;
    if (config.unit === "Fahrenheit") {
        displayTemp = (config.currentTemp * 9/5) + 32;
    }
    const heightPercentage = ((displayTemp - config.minTemp) / (config.maxTemp - config.minTemp)) * 100;
    temperature.style.height = Math.max(0, Math.min(100, heightPercentage)) + "%";
    temperature.dataset.value = displayTemp.toFixed(1) + units[config.unit];
}

setTemperature();

async function fetchSensorData() {
    try {
        const response = await fetch('https://backend-4ml0.onrender.com/get_sensor_data');
        if (response.ok) {
            const data = await response.json();
            updateTemperature(data.temperature);
            updateHumidity(data.humidity);
            updateSoilMoisture(data.soil_moisture);
        } else {
            console.error('Failed to fetch sensor data');
        }
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

function updateTemperature(temperature) {
    config.currentTemp = temperature;
    setTemperature();
}

function updateHumidity(humidity) {
    humidityValue = humidity;
    chart.series(0).options({ points: [['Humidity', humidityValue]] });
    chart.series(0).options({ shape_label_text: `${humidityValue.toFixed(1)}%` });
}

function updateSoilMoisture(soilMoisture) {
    soilMoistureValue = Math.max(0, Math.min(100, soilMoisture));
    soilMoistureGauge.series(0).options({ points: [['Soil Moisture', soilMoistureValue]] });
    soilMoistureGauge.series(0).options({ shape_label_text: `${soilMoistureValue.toFixed(1)}%` });
}

window.onload = function () {
    fetchSensorData();
    setInterval(fetchSensorData, 5000);
};

var chart = JSC.chart('chartDiv', {
    legend_visible: false,
    xAxis_spacingPercentage: 0.4,
    yAxis: [{ id: 'humidityAxis', customTicks: [0, 20, 40, 60, 80, 100], scale_range: [0, 100], line: { width: 10, color: 'smartPalette:humidityPalette' }}],
    defaultSeries: {
        type: 'gauge column roundcaps',
        shape: { label: { text: `${humidityValue}%`, align: 'center', verticalAlign: 'middle', style_fontSize: 22, style_color: '#333' }}
    },
    series: [{ yAxis: 'humidityAxis', palette: { id: 'humidityPalette', ranges: [{ value: 20, color: '#FF5353' }, { value: 40, color: '#FFD221' }, { value: 60, color: '#77E6B4' }, { value: 80, color: '#21D683' }, { value: 100, color: '#007ACC' }] }, points: [['Humidity', humidityValue]]}]
});

var soilMoistureGauge = JSC.chart('soilMoistureGauge', {
    legend_visible: false,
    xAxis_spacingPercentage: 0.4,
    yAxis: [{ id: 'soilMoistureAxis', customTicks: [0, 20, 40, 60, 80, 100], scale_range: [0, 100], line: { width: 10, color: 'smartPalette:soilMoisturePalette' }}],
    defaultSeries: {
        type: 'gauge column roundcaps',
        shape: { label: { text: `${soilMoistureValue}%`, align: 'center', verticalAlign: 'middle', style_fontSize: 22, style_color: '#333' }}
    },
    series: [{ yAxis: 'soilMoistureAxis', palette: { id: 'soilMoisturePalette', ranges: [{ value: 20, color: '#FF5353' }, { value: 40, color: '#FFD221' }, { value: 60, color: '#77E6B4' }, { value: 80, color: '#21D683' }, { value: 100, color: '#007ACC' }] }, points: [['Soil Moisture', soilMoistureValue]]}]
});

const irrigationCard = document.getElementById('irrigationCard');
const unitText = irrigationCard.querySelector('#unit');
let irrigationOn = false;
irrigationCard.style.backgroundColor = '#f44336';

irrigationCard.addEventListener('click', async function () {
    irrigationOn = !irrigationOn;
    irrigationCard.style.backgroundColor = irrigationOn ? '#4CAF50' : '#f44336';
    unitText.textContent = `Irrigation Control: ${irrigationOn ? 'ON' : 'OFF'}`;

    try {
        const response = await fetch('https://backend-4ml0.onrender.com/irrigation_control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ irrigation_on: irrigationOn })
        });

        if (response.ok) {
            console.log('Irrigation state updated successfully');
        } else {
            console.error('Failed to update irrigation state');
        }
    } catch (error) {
        console.error('Error sending irrigation state:', error);
    }
});

