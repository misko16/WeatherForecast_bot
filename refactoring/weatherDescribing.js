// https://i.gifer.com/47tj.gif - тянка
// https://i.gifer.com/86Tf.gif - хмарна
// https://i.gifer.com/9Z0P.gif - дощ
// https://i.gifer.com/YWuH.gif - сніг

const getGifUrlByWeatherDescription = (description) => {
    if (description.includes('clear')) {
        return 'https://i.gifer.com/1k2f.gif'; // Приклад гіфки для ясної погоди
    } else if (description.includes('clouds')) {
        return 'https://i.gifer.com/86Tf.gif'; // Приклад гіфки для хмарної погоди
    } else if (description.includes('rain')) {
        return 'https://i.gifer.com/9Z0P.gif'; // Приклад гіфки для дощової погоди
    } else if (description.includes('snow')) {
        return 'https://i.gifer.com/YWuH.gif'; // Приклад гіфки для сніжної погоди
    }
    //  else {
    //     return 'https://media.tenor.com/2eVevYiek64AAAAM/default-weather.gif'; // Приклад загальної гіфки для інших видів погоди
    // }
};

module.exports = { getGifUrlByWeatherDescription };
