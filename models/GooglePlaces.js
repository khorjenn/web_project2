/**
 * Created by Joey on 7/18/2017.
 */

const Moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    var GooglePlaces = sequelize.define('GooglePlaces', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        centralLatitude: DataTypes.STRING,
        centralLongitude: DataTypes.STRING
    });

    return GooglePlaces;
};