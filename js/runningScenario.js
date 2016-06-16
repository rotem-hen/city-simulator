App.RunningScenario = new function () {

    var _this = this;

    _this.scenario = null;
    _this.routeSpots = [];
    _this.isRunWithApp = true;
    _this.spotsToOccupyAfterAppRun = {morning: [], noon: [], evening: [], night: []};
    _this.spotsToFreeAfterAppRun = {morning: [], noon: [], evening: [], night: []};
    _this.daysToRun = 1;
    _this.dayPeriods = {morning:  {from: 7, to: 12},
                        noon:     {from: 12, to: 17},
                        evening:  {from: 17, to: 22},
                        night:    {from: 22, to: 24+7}}; // 7 of the next day

    // reset parking spots (free or occupy) after with-app run finished
    var resetSpotsAfterAppRun = function (dayPeriod) {
        _this.spotsToFreeAfterAppRun[dayPeriod].forEach(spot =>
            App.Coords_tlv.get(spot).set({isFree: true}));

        _this.spotsToOccupyAfterAppRun[dayPeriod].forEach(spot => {
            App.Coords_tlv.get(spot).set({isFree: false});
            App.Maps.addMarkerById(spot, 'red');
        });
    };

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
        _this.spotsToOccupyAfterAppRun[dayPeriod].push(spot);
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
            numOfOccupied = polygon.get(dayPeriod).capacity * totalNumOfSpots / 100,
            occupiedIds = chooseRandomSpots(spots, numOfOccupied);

        occupiedIds.forEach(function (id) {
            App.Coords_tlv.get(id).set({isFree: false});
            addSpotEvent(dayPeriod, id);
			App.Maps.addMarkerById(id, 'red');
        });
    };

    // check if there is a close free parking spot
    var checkForFreeSpot = function (driver, dayPeriod) {
        var route = driver.get('route'),
            position = driver.get('currLocation');
        var coordOnRouteId = route[position],
            coordOnRoute = App.Coords_tlv.get(coordOnRouteId),
            closeSpots = coordOnRoute.get('closeSpots');

        var closestSpotId = -1,
            closestSpotDistance = Infinity,
            max = _this.isRunWithApp && driver.get('isWithApp') ? 50 : 0;

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
                isWith = _this.isRunWithApp && driver.get('isWithApp'),
                isWithString =  isWith ? 'WITH' : 'WITHOUT',
                duration = moment.duration(App.Clock.getTime().diff(driver.get('timeCreated'))).asMinutes();

            console.log(App.Clock.getTimeString() + ': driver ' + id + ', ' +
                            isWithString + ' app, parked in ' + closestSpotId + ' after ' +
                            duration.toFixed(1) + ' minutes.');

            _this.spotsToFreeAfterAppRun[dayPeriod].push(closestSpotId);
            App.DataHandling.processNewData(_this.isRunWithApp, isWith, duration);
            App.Maps.addMarkerById(closestSpotId, 'blue');
            App.Coords_tlv.get(closestSpotId).set({isFree: false});
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
        // reset previous data
        App.Drivers.reset();
        App.Maps.clearAllMarkers();
        if (!_this.isRunWithApp)
            resetSpotsAfterAppRun(dayPeriod);
        // set new data (only if it's with-app run)
        if (_this.isRunWithApp) {

            App.Coords_tlv.each(function (coord) {
                if (!coord.get('isFree')) coord.set({isFree: true});
            });

            // set drivers and parking spots for each polygon
            _this.scenario.get('polygons').forEach(function (polygonId) {
                var polygon = App.Polygons.get(parseInt(polygonId));
                addAllDrivers(polygon, dayPeriod);
                updateSpotsInDb(polygon, dayPeriod);
            });
        }
        console.info('Day Period: ' + dayPeriod.toUpperCase());

        // start running
        var onTimeChange = function () {

            App.Drivers.each(function (driver) {
                // go forward 100 meters (10 meters at every step)
                for (var i = 0; i < 1 && !driver.get('found'); i++) {
                    checkForFreeSpot(driver, dayPeriod);
                    oneStep(driver);
                }
            });
        };

        App.Clock.on('change:time',onTimeChange);
        var nextPeriodTime = App.Clock.getTime().hour(_this.dayPeriods[dayPeriod].to).minute(0).second(0);
        App.Clock.addEvent(nextPeriodTime, function () {
            App.Clock.off('change:time',onTimeChange);
        });
    };

    // main - running scenario
    _this.main = function () {
        $('#year-buttons-div').hide();
        $('#settings').prop('disabled', true);
        $('#run').hide();
        $('#stop').show();
        _this.isRunWithApp = true;
        App.DataHandling.stats = [];
        App.DataHandling.savedMinutes = 0;
        _this.routeSpots = App.Routes.pluck('id');

        for (var i = 0; i < _this.daysToRun; i++) { // number of days to run
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

    // run scenario button clicked
    _this.onRunClick = function () {
        var scenarioId = $('#main-scenarios-dd').val();
        if (scenarioId == -1) return;
        _this.scenario = App.Scenarios.get(scenarioId);
        _this.main();

        App.Clock.addEvent(moment()
                .hour(App.Clock.settings.initHour)
                .minute(App.Clock.settings.initMin)
                .second(App.Clock.settings.initSec)
                .add(_this.daysToRun, 'day'),
            () => {
                if (_this.isRunWithApp) {
                    switchRuns();
                } else {
                    onRunEnd();
                }
            });
    };

    _this.onStopClick = function () {
        App.DataHandling.stats = [];
        App.DataHandling.savedMinutes = 0;
        App.Clock.resetClock();
        App.Clock.resetTimeEvents();
        $('#with-app-avg').text('-');
        $('#without-app-avg').text('-');
        App.Maps.clearAllMarkers();
        $('#stop').hide();
        $('#run').show();
    };
    
    var switchRuns = function () {
        _this.isRunWithApp = false;
        $('#with-app-avg').text('-');
        App.Clock.resetClock();
        App.Clock.startTicking();
    };

    var onRunEnd = function () {
        App.Clock.resetClock();
        App.Clock.resetTimeEvents();
        App.Maps.clearAllMarkers();
        App.DataHandling.calculateSavedMinutes();
        $('#year-buttons-div').show(500);
        $('#settings').prop('disabled', false);
        $('#stop').hide();
        $('#run').show();
    };

}();