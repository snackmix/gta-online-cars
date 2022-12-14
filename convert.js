const fs = require('fs');
const axios = require('axios');
const {get, set, round} = require('lodash');

axios.get('https://www.gtabase.com/media/com_jamegafilter/en_gb/1.json').then(async function (response) {
    const cars = Object.values(response.data);
    await saveCarsData(cars);
});

async function saveCarsData(cars) {
    const results = new Array;
    const thumbnails = new Object;
    for (const car of cars) {
        delete car.access;
        delete car.catid;
        delete car.catslug;
        delete car.featured;
        delete car.hits;
        delete car.lang;
        delete car.slug;
        delete car.thumbnail_height;
        delete car.thumbnail_width;
        const response = await axios.get(`https://www.gtabase.com/${car.thumbnail}`, {
            responseType: 'arraybuffer',
            headers: {
                'Referer': 'https://www.gtabase.com'
            }
        });
        const encode = Buffer.from(response.data, 'binary').toString('base64');
        set(thumbnails, car.id, `data:image/jpeg;base64,${encode}`);
        delete car.thumbnail;
        car.vehicle_class = car.attr.ct1.frontend_value;
        car.manufacturer = get(car, 'attr.ct2.frontend_value.0', null);
        car.release_date = get(car, 'attr.ct3.frontend_value.0');
        car.title_update = get(car, 'attr.ct4.frontend_value.0');
        car.speed = floatRound(car, 'attr.ct6.frontend_value', 0);
        car.acceleration = floatRound(car, 'attr.ct7.frontend_value', 0);
        car.braking = floatRound(car, 'attr.ct8.frontend_value', 0);
        car.handling = floatRound(car, 'attr.ct9.frontend_value', 0);
        car.overall_rating = floatRound(car, 'attr.ct10.frontend_value', 0);
        car.seats = getInteger(car, 'attr.ct11.frontend_value.0', 0);
        car.available_from = get(car, 'attr.ct12.frontend_value', null);
        car.purchase_price = getInteger(car, 'attr.ct13.frontend_value', 0);
        car.sell = car.attr.ct14.frontend_value;
        car.resale_sell_price = getInteger(car, 'attr.ct15.frontend_value', 0);
        car.stolen_sell_price = getInteger(car, 'attr.ct16.frontend_value', 0);
        car.storage_location = get(car, 'attr.ct19.frontend_value', null);
        car.vehicle_features = get(car, 'attr.ct30.frontend_value', null);
        car.top_speed_game_files = getFloat(car, 'attr.ct32.frontend_value', 0);
        car.weight = getFloat(car, 'attr.ct33.frontend_value', 0);
        car.drivetrain = get(car, 'attr.ct34.frontend_value.0', 'None');
        car.gears = getInteger(car, 'attr.ct35.frontend_value.0', 0);
        car.modifications = get(car, 'attr.ct63.frontend_value', null);
        car.based_on = get(car, 'attr.ct72.frontend_value', null);
        car.top_speed_real = getFloat(car, 'attr.ct132.frontend_value', 0);
        car.game_model_name = get(car, 'attr.ct348.frontend_value', null);
        car.delivery_methods = get(car, 'attr.ct522.frontend_value', null);
        delete car.attr;
        results.push(car);
    }
    writeJsonFile('public/data.json', results);
    writeJsonFile('public/thumbnails.json', thumbnails);
}

function writeJsonFile(name, data) {
    const raw = JSON.stringify(data, null, 4);
    fs.writeFileSync(name, raw);
}

function getInteger(data, path, defaults) {
    const value = get(data, path, defaults);
    return parseInt(value);
}

function getFloat(data, path, defaults) {
    const value = get(data, path, defaults);
    return parseFloat(value);
}

function floatRound(data, path, defaults) {
    const value = getFloat(data, path, defaults);
    return round(value, 2);
}