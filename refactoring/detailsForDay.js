const axios = require('axios');

const getDailyForecast = async (city, API_KEY) => {
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
            const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
            let forecastMessage = '';
            dailyForecasts.forEach(forecast => {
                const date = new Date(forecast.dt * 1000);
                const formattedDate = date.toLocaleDateString();
                const temperature = forecast.main.temp;
                const description = forecast.weather[0].description;
                forecastMessage += `Дата: ${formattedDate}\nТемпература: ${temperature.toFixed(1)}°C🌡️\nОпис: ${description}\n\n`;
            });
            return forecastMessage;
        } else {
            throw new Error('Не вдалося отримати прогноз на цілий день. Спробуйте пізніше.');
        }
    } catch (error) {
        console.error('Помилка при отриманні прогнозу на цілий день:', error);
        throw new Error('Не вдалося отримати прогноз на цілий день. Спробуйте пізніше.');
    }
};

module.exports = { getDailyForecast };
