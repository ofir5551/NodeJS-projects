const request = require('request');

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1Ijoib2ZpcjU1NTEiLCJhIjoiY2s2M29lcWEzMDk0aDNmcGJrMmtoaGc3YSJ9.UmjEMYvkM3C-U2vZ4PQAPQ&limit=1`;

    request({url: url, json:true}, (error, res) => {
        if (error) {
            callback('Unable to connect to location services!', undefined);
        } else if (res.body.features.length == 0) {
            callback('Unable to find location, try another search.', undefined);
        } else {
            callback(undefined, {
                latitude: res.body.features[0].center[1],
                longtitude: res.body.features[0].center[0],
                location: res.body.features[0].place_name
            })
        }
    })
}

module.exports = geocode;