var Backbone = require('backbone'),
	_ = require('underscore'),
    db = require('../db/db.json'),
    r = require('../db/routes.json'),
    fs = require('fs'),
    coords_tlvAr = db.coords_tlv,
    coords_tlv = new Backbone.Collection(coords_tlvAr);

// convert degrees to radiation
var deg2rad = function (deg) {
    return deg * (Math.PI/180)
};

// get the distance in meters between two coordinates
var getDistanceBetweenCoords = function (coord1, coord2) {
	var lat1 = coord1.get('lat'),
		lng1 = coord1.get('lng'),
		lat2 = coord2.get('lat'),
		lng2 = coord2.get('lng');
	var R = 6371000; // Radius of the earth in m
	var dLat = deg2rad(lat2 - lat1);  // deg2rad below
	var dLon = deg2rad(lng2 - lng1);
	var a =
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			Math.sin(dLon/2) * Math.sin(dLon/2)
		;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return R * c; // distance in m
};

// find all the parking spots that are close to a route
var findCloseSpots = function (route) {
	var result = [];
	route.forEach(function (coordNum) {
		var coord = coords_tlv.get(coordNum);
		coords_tlv.each(function (spot) {
			if (getDistanceBetweenCoords(coord, spot) <= 200) {
				result.push(spot.get('id'));
			}
		});
	});

	result = _.sortBy(_.uniq(result));
	return result;
};

var main = function () {
	r.routes.forEach (function (spotRoute) {
		console.log('Spot route: ', spotRoute.id);
		for (var i = 300; i < 1000; i+=100) {
			spotRoute[i].forEach (function (route) {
				route.closeSpots = findCloseSpots(route.route);
			});
		}
	});
	return r;
};

var output = main();
fs.writeFile('./db/routes2.json', JSON.stringify(output), function (err) {
    if(err) {
        return console.log(err);
    }

    console.log('The file was saved!');
});