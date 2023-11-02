const axios = require('axios');
const TeleBot = require('telebot');
const { getGifUrlByWeatherDescription } = require('./refactoring/weatherDescribing');
const { getDailyForecast } = require('./refactoring/detailsForDay');
const { getHourlyForecast } = require('./refactoring/detailsForHour');

const TOKEN = '6599354929:AAG3pu0TBng-oNDdg0xSYaWCdrYMWhScssc';
const API_KEY = 'a6d2b576b8271e03a72a3583c02673b0';

const bot = new TeleBot({
    token: TOKEN,
    usePlugins: ['askUser'],
});

const sentMessages = {};

bot.on('/start', (msg) => {
    const greetingMessage = `Привіт, ${msg.from.first_name}! Відправте мені назву міста, щоб отримати погоду.`;
    bot.sendMessage(msg.from.id, greetingMessage, {
        replyMarkup: bot.keyboard([
            ['/start', '/help']
        ], { resize: true })
    });
});

bot.on(['/help'], (msg) => {
    const commandsList = `Список доступних команд:\n\n/start - почати роботу з ботом`;
    bot.sendMessage(msg.from.id, commandsList);
});

bot.on('text', async (msg) => {
    if (msg.text !== '/start' && msg.text !== '/help') {
        const city = msg.text;

        try {
            const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: city,
                    appid: API_KEY,
                    units: 'metric'
                }
            });

            if (response.status === 404) {
                bot.sendMessage(msg.from.id, 'Місто не знайдено. Будь ласка, спробуйте інше місто.');
            } else {
                const weatherData = response.data;
                const temperature = weatherData.main.temp.toFixed(1);
                const description = weatherData.weather[0].description;
                const gifUrl = getGifUrlByWeatherDescription(description);

                const date = new Date();
                const formattedDate = date.toLocaleDateString();

                const weatherMessage = `Погода на даний момент в місті ${city}:\n\n Опис: ${description}☁️\n\n Температура: ${temperature}°C🌡️\n\n Дата: ${formattedDate}📅\n\n`;

                const keyboard = bot.inlineKeyboard([
                    [bot.inlineButton('Прогноз на інші дні', { callback: 'dailyforecast' })]
                ]);
                bot.sendDocument(msg.from.id, gifUrl, { caption: weatherMessage, replyMarkup: keyboard });

                sentMessages[msg.from.id] = city;
            }
        } catch (error) {
            console.error('Помилка отримання інформації про погоду:', error);
            bot.sendMessage(msg.from.id, 'Сталася помилка під час отримання інформації про погоду. Будь ласка, спробуйте пізніше або перевірте правильність введеного міста.');
        }
    }
});

bot.on('callbackQuery', async (msg) => {
    if (msg.data === 'dailyforecast') {
        try {
            const city = sentMessages[msg.from.id];
            const dailyForecast = await getDailyForecast(city, API_KEY);
            const date = new Date();
            const formattedDate = date.toLocaleDateString();

            const hourlyKeyboard = bot.inlineKeyboard([
                [bot.inlineButton('Прогноз погодинно', { callback: 'hourlyforecast' })]
            ]);

            const dailyForecasts = dailyForecast.split('\n\n');
            const sortedForecasts = dailyForecasts.sort(); // Впорядкування дат
            for (const forecast of sortedForecasts) {
                bot.sendMessage(msg.from.id, forecast, { replyMarkup: hourlyKeyboard });
            }
        } catch (error) {
            console.error('Помилка при отриманні прогнозу на цілий день:', error);
            bot.sendMessage(msg.from.id, 'Сталася помилка під час отримання прогнозу на цілий день. Будь ласка, спробуйте пізніше.');
        }
    } else if (msg.data === 'hourlyforecast') {
        const city = sentMessages[msg.from.id];
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        try {
            const hourlyForecast = await getHourlyForecast(city, API_KEY, formattedDate);
            bot.sendMessage(msg.from.id, `Прогноз погодинно на ${formattedDate}: \n${hourlyForecast}`);
        } catch (error) {
            console.error('Помилка при отриманні прогнозу погоди погодинно:', error);
            bot.sendMessage(msg.from.id, 'Сталася помилка під час отримання прогнозу погоди погодинно. Будь ласка, спробуйте пізніше.');
        }
    }
});


bot.start();

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
});
