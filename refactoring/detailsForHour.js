const axios = require('axios');

const getHourlyForecast = async (city, API_KEY, date) => {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        if (response.status === 200) {
            const forecastData = response.data;
            const hourlyForecasts = forecastData.list.filter(item => {
                const itemDate = new Date(item.dt * 1000);
                const forecastDate = itemDate.toISOString().split('T')[0];
                return forecastDate === date;
            });
            let forecastMessage = '';
            hourlyForecasts.forEach(forecast => {
                const time = new Date(forecast.dt * 1000).toLocaleTimeString();
                const temperature = forecast.main.temp;
                const description = forecast.weather[0].description;
                forecastMessage += `Час: ${time}\nТемпература: ${temperature.toFixed(1)}°C🌡️\nОпис: ${description}\n\n`;
            });
            return forecastMessage;
        } else {
            throw new Error('Не вдалося отримати прогноз погоди на цей день. Спробуйте пізніше.');
        }
    } catch (error) {
        console.error('Помилка при отриманні прогнозу погоди погодинно:', error);
        throw new Error('Не вдалося отримати прогноз погоди погодинно. Спробуйте пізніше.');
    }
};

module.exports = { getHourlyForecast };
