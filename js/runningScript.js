App.RunningScript = new function () {

    var _this = this;

    _this.script = null;
    _this.routeSpots = [];
    _this.stats = {withApp: [], withoutApp: []};
    _this.dayPeriods = {morning:  {from: 7, to: 12},
                        noon:     {from: 12, to: 17},
                        evening:  {from: 17, to: 22},
                        night:    {from: 22, to: 24+7}}; // 7 of the next day

    // find all spots in a polygon
    var allSpotsInPolygon = function (polygon, withRoutes) {
        var spotsInPolygon = [],
            googlePolygon = new google.maps.Polygon({paths: polygon.get('coordinates')});

        App.Coords_tlv.each (function (coord) {
            var latLng = new google.maps.LatLng(coord.get('lat'), coord.get('lng'));
            if (google.maps.geometry.poly.containsLocation(latLng, googlePolygon))
                spotsInPolygon.push(coord.id);
        });

        var routesSpotsInPolygon = [];
        if (withRoutes) {
            var spotsWithRoutesInPolygon = _.intersection(spotsInPolygon, _this.routeSpots);
            spotsWithRoutesInPolygon.forEach(function (id) {
                var idRoutes = App.Routes.get(id).get('routes'),
                    routesSpots = _.chain(idRoutes).values().flatten().value();
                routesSpotsInPolygon = routesSpotsInPolygon.concat(routesSpots);
            });
        }
        return _.union(spotsInPolygon, routesSpotsInPolygon);
    };

    // get a random route from a spot
    var getRandomRouteFromSpot = function (spot) {
        var routes = App.Routes.get(spot);
        return _.chain(routes.attributes.routes)
            .values()
            .flatten(true)
            .sample()
            .value();
    };

    // find a random spot and route for a new driver
    var findRandomSpotAndRoute = function (spots) {
        var found = false,
            randSpot,
            randRoute;

        while (!found) {
            randSpot = spots[_.random(spots.length - 1)];
            randRoute = getRandomRouteFromSpot(randSpot);
            if (randRoute != undefined) found = true;
        }

        return {spot: randSpot, route: randRoute};
    };

    // generate a random time according to day period
    var generateRandomTime = function (dayPeriod) {
        var dayPeriodObj = _this.dayPeriods[dayPeriod],
            randHour = _.random(dayPeriodObj.from, dayPeriodObj.to - 1),
            randMin = _.random(59),
            randSec = _.random(5) * 10;

        return App.Clock.getTime().hour(randHour).minute(randMin).second(randSec);
    };

    // add a clock event - add driver
    var addDriverEvent = function (dayPeriod, withApp, spot, route) {
        var time = generateRandomTime(dayPeriod);
        App.Clock.addEvent(time, function () {
            var driver = App.Drivers.add({
                isWithApp: withApp,
                hook: spot,
                route: route,
                found: false,
                forward: true,
                currLocation: 0,
                timeCreated: time
            });
            console.log(App.Clock.getTimeString() + ': creating driver ' + driver.cid);
        });
    };

    // add a clock event - free spot
    var addSpotEvent = function (dayPeriod, spot) {
        var time = generateRandomTime(dayPeriod);
        App.Clock.addEvent(time, function () {
            App.Coords_tlv.get(spot).set({isFree: true});
        });
    };

    // add all drivers to db
    var addAllDrivers = function (polygon, dayPeriod) {
        var driversWithApp = polygon.get(dayPeriod).driversWithApp,
            driversWithoutApp = polygon.get(dayPeriod).driversWithoutApp,
            spots = _.intersection(allSpotsInPolygon(polygon, false), _this.routeSpots);

        var addDrivers = function (withApp) {
            var numToCreate = withApp ? driversWithApp : driversWithoutApp;

            for (var i = 0; i < numToCreate; i++) {
                var randomSpotAndRoute = findRandomSpotAndRoute(spots);
                addDriverEvent(dayPeriod, withApp, randomSpotAndRoute.spot, randomSpotAndRoute.route);
            }
        };

        addDrivers(true);
        addDrivers(false);
    };

    // choose randomly the parking spots to be occupied
    var chooseRandomSpots = function (spots, numToChoose) {
        var result = [];
        while (result.length < numToChoose) {
            var randNum = _.random(spots.length - 1),
                randSpot = spots[randNum];
            if (!_.contains(result, randSpot)) result.push(randSpot);
        }

        return result;
    };

    // set the parking spaces according to polygon's data
    var updateSpotsInDb = function (polygon, dayPeriod) {
        var spots = allSpotsInPolygon(polygon, true),
            totalNumOfSpots = spots.length,
            //spotsInitially = totalNumOfSpots / _this.script.get('parkingGrowthRate'),
            numOfOccupied = polygon.get(dayPeriod).capacity * totalNumOfSpots / 100,
            occupiedIds = chooseRandomSpots(spots, numOfOccupied);

        occupiedIds.forEach(function (id) {
            App.Coords_tlv.get(id).set({isFree: false});
            addSpotEvent(dayPeriod, id);
        });
    };

    // check if there is a close free parking spot
    var checkForFreeSpot = function (driver) {
        var route = driver.get('route'),
            position = driver.get('currLocation');
        var coordOnRouteId = route[position],
            coordOnRoute = App.Coords_tlv.get(coordOnRouteId),
            closeSpots = coordOnRoute.get('closeSpots');

        var closestSpotId = -1,
            closestSpotDistance = Infinity,
            max = driver.get('isWithApp') ? 50 : 0;

        closeSpots.forEach(function (p) {
            var parkingSpot = App.Coords_tlv.get(p);
            var distance = App.Maps.getDistanceBetweenCoords(parkingSpot, coordOnRoute);
            if (distance <= closestSpotDistance && parkingSpot.get('isFree') && distance <= max) {
                closestSpotId = parkingSpot.get('id');
                closestSpotDistance = distance;
            }
        });

        if (closestSpotId != -1) {
            var id = driver.cid,
                isWith = driver.get('isWithApp') ? 'WITH' : 'WITHOUT',
                duration = moment.duration(App.Clock.getTime().diff(driver.get('timeCreated'))).asSeconds();

            console.log(App.Clock.getTimeString() + ': driver ' + id + ', ' + isWith + ' app, parked in ' + closestSpotId + ' after ' + duration + ' seconds.');
            var statsProp = driver.get('isWithApp') ? 'withApp' : 'withoutApp',
                statsAr = _this.stats[statsProp];
            statsAr.push(duration);
            var avg = statsAr.length === 0 ? 0
                : (statsAr.reduce(function(memo, num) {
                    return memo + num;
                }, 0) / statsAr.length);
            $('#' + statsProp + 'Avg').text(avg.toFixed(2));
            var closestSpot = App.Coords_tlv.get(closestSpotId);
            App.Maps.addMarker(new google.maps.LatLng(closestSpot.get('lat'), closestSpot.get('lng')));
            closestSpot.set({isFree: false});
            driver.set({found: true});
        }
    };

    // take the driver one step forward
    var oneStep = function (driver) {
        var routeCoords = driver.get('route'),
            max = routeCoords.length - 1,
            position = driver.get('currLocation');

        var move = function (add, edge, backward) {
            position += add;
            driver.set({currLocation: position});
            if (position == edge) driver.set({forward: backward});
        };

        if (driver.get('forward')) {
            move(1, max, false);
        } else {
            move(-1, 0, true);
        }
    };

    var startDayPeriod = function (dayPeriod) {
        // delete previous data
        App.Drivers.reset();
        App.Coords_tlv.each(function (coord) {
            if (!coord.get('isFree')) coord.set({isFree: true});
        });

        // set drivers and parking spots for each polygon
        _this.script.get('polygons').forEach(function (polygonId) {
            var polygon = App.Polygons.get(parseInt(polygonId));
            addAllDrivers(polygon, dayPeriod);
            updateSpotsInDb(polygon, dayPeriod);
        });

        console.info('Day Period: ' + dayPeriod.toUpperCase());

        // start running
        var onTimeChange = function () {

            App.Drivers.each(function (driver) {
                // go forward 100 meters (10 meters at every step)
                for (var i = 0; i < 10 && !driver.get('found'); i++) {
                    checkForFreeSpot(driver);
                    oneStep(driver);
                }
            });
        };

        // run
        App.Clock.on('change:time',onTimeChange);
        var nextPeriodTime = App.Clock.getTime().hour(_this.dayPeriods[dayPeriod].to).minute(0).second(0);
        App.Clock.addEvent(nextPeriodTime, function () {
            App.Clock.off('change:time',onTimeChange);
        });
    };

    // main - running script
    _this.main = function () {
        _this.routeSpots = App.Routes.pluck('id');
        _this.stats = {withApp: [], withoutApp: []};

        for (var i = 0; i < 1; i++) { // number of days to run
            _.each(_this.dayPeriods, function (dayPeriodVals, dayPeriodName){
                var startTime = App.Clock.getTime().add(i, 'day').hour(dayPeriodVals.from).minute(0).second(0);
                console.log('Registering event at', startTime.format());
                App.Clock.addEvent(startTime, function () {
                    startDayPeriod(dayPeriodName);
                });
            });
        }

        App.Clock.startTicking();
    };

    // run script button clicked
    _this.onRunClick = function () {
        var scriptId = $('#main-scripts-dd').val();
        if (scriptId == -1) return;
        _this.script = App.Scripts.get(scriptId);
        //$('#year-buttons-div').show(500);
        _this.main();
    };

}();