/**
 * Created by Joey on 7/18/2017.
 */

const Models         = require('../models/');
var settings         = require('../settings');
var googleMapsClient = require('@google/maps').createClient({
    key: settings.keys.google_key
});

var GooglePlaceData = function(centralLat, centralLong, googleMapResults) {
    console.log(centralLat, centralLong, googleMapResults);
    var results = [];

    for(var i = 0; i < googleMapResults.length; i++) {

        var data = {
            'name': googleMapResults[i].name,
            'description': '',
            'latitude': googleMapResults[i].geometry.location.lat,
            'longitude': googleMapResults[i].geometry.location.lng,
            'centralLatitude': centralLat,
            'centralLongitude': centralLong
        };

        results.push(data);
    }
    return results;
};

module.exports = {
    searchTerm: function(req, res, next) {

        Models.GooglePlaces.findAll({
            where: {
                centralLatitude : req.body.lat,
                centralLongitude: req.body.long
            }
        }).then((result) => {

            if(result.length <= 0) {

                console.log("No results from database, asking google");
                var results = googleMapsClient.placesNearby({
                    language: 'en',
                    location: [req.body.lat,req.body.long],
                    radius: 8000
                },function(err, res) {
                    console.log("Google responded with data");
                    if (!err) {
                        // format the results
                        var results = GooglePlaceData(req.body.lat, req.body.long, res.json.results);

                        console.log(results);
                        // store google results in database
                        for(var i = 0; i < results.length; i++) {
                            Models.GooglePlaces.create(results[i]);
                        }

                        // return to client side for display
                        res.send(results);

                    } else if (err === 'timeout') {
                        // Handle timeout.
                        console.log('time out');
                    } else if (err.json) {
                        // Inspect err.status for more info.
                        console.log('error', err.json);
                    } else {
                        // Handle network error.
                        console.log('network error');
                    }
                });

                // send response back to user

            } else { // get data from database
                console.log("Get results from database")
                res.send(result);
            }
        });
    }
};