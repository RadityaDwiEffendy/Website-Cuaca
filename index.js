const apiKey = '202fb8e412a94c0a8f5120632243007';
const city = 'Jakarta';
const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.addEventListener('DOMContentLoaded', () => {
        const weatherInfo = document.getElementById('weather-info');
        const timeInfo = document.getElementById('time-info');
        const hourlyTempsInfo = document.getElementById('hourly-temps-info');
        const citySelector = document.getElementById('city-selector');
        const btnContainer = document.querySelector('.btn');


        let forecastData = [];
        let timeIntervalId; 
    
        const apiKey = '202fb8e412a94c0a8f5120632243007';
    
        function fetchWeatherData(city) {
            const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;
    
            fetch(forecastUrl)
                .then(response => response.json())
                .then(data => {
                    if (data && data.forecast && data.forecast.forecastday) {
                        const timeZone = data.location.tz_id;
                        forecastData = data.forecast.forecastday;
    
                        weatherInfo.textContent = `Kota: ${city}`;

                        updateDateButtons();
    
                        
                        if (timeIntervalId) {
                            clearInterval(timeIntervalId);
                        }
    
                        updateLocalTime(timeZone);
                        timeIntervalId = setInterval(() => updateLocalTime(timeZone), 1000);
    
                        
                        updateHourlyTemps();
                    } else {
                        hourlyTempsInfo.textContent = 'Tidak ada data suhu untuk 7 hari ke depan.';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    hourlyTempsInfo.textContent = 'Data gagal dimuat.';
                });
        }
    
        function updateLocalTime(timeZone) {
            const localTime = new Date().toLocaleTimeString('en-US', { timeZone: timeZone });
            timeInfo.textContent = `Waktu saat ini di ${citySelector.value}: ${localTime}`;
        }

        
    
        function updateHourlyTemps(selectedDate = null) {
            if(!selectedDate){
                selectedDate = new Date().toISOString().split('T')[0];
            }

            let hourlyTemp = '';
        
            forecastData.forEach(day => {
                if (selectedDate === day.date) {
                    const hours = day.hour;
        
                    hours.forEach(hour => {
                        const [hourDate, hourTime] = hour.time.split(' ');
                        const hourOfDay = parseInt(hourTime.split(':')[0], 10);
                        const temp = hour.temp_c;
        
                        if (hourOfDay % 2 === 0) {
                            hourlyTemp += `<div class="hourly-temp">
                                <span class="hour">${hourOfDay}:00</span>
                                <span class="temperature">${temp}°C</span>
                            </div>`;
                        }
                    });
                }
            });
        
            hourlyTempsInfo.innerHTML = hourlyTemp;
        }
        
        function updateDateButtons() {
            btnContainer.innerHTML = '';
        
            forecastData.forEach(day => {
                const button = document.createElement('button');
                button.textContent = new Date(day.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                button.setAttribute('data-date', day.date);
                button.addEventListener('click', () => {
                    selectDate(day.date); 
                    updateHourlyTemps(day.date);
                });
                btnContainer.appendChild(button);
            });
        }
        
        function selectDate(selectedDate) {
            const buttons = btnContainer.querySelectorAll('button');
            buttons.forEach(button => {
                button.classList.remove('selected');
            });
        
            const selectedButton = Array.from(buttons).find(button => button.getAttribute('data-date') === selectedDate);
            if (selectedButton) {
                selectedButton.classList.add('selected');
            }
        }

        
    
        citySelector.addEventListener('change', (event) => {
            const selectedCity = event.target.value;
            fetchWeatherData(selectedCity);
        });
    

        fetchWeatherData(citySelector.value);
    });
    