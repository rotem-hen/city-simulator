App.Maps = new function () {

    var _this = this;

    // markers list
    _this.markers = [];

    // default polygon coordinates
    _this.defaultPolygonCoords = [
        {lat: 32.08393466504986, lng: 34.79928468422224},
        {lat: 32.07825025208277, lng: 34.800805663814685},
        {lat: 32.08011916786624, lng: 34.79532741407263}
    ];

    // tlv polygon
    _this.tlvBounds = {
        north: 32.09832567178236,
        south: 32.07135626089353,
        east: 34.80196219763184,
        west: 34.76777993127462
    };

    _this.createTlvRect = function () {
        _this.tlvRect = new google.maps.Rectangle({
            map: App.Maps.mainMap,
            bounds: _this.tlvBounds,
            strokeColor: '#D9F1FF',
            strokeOpacity: 0,
            strokeWeight: 1,
            fillColor: '#D9F1FF',
            fillOpacity: 0.5,
            editable: true,
            draggable: true
        })
    };

    // initialize the main map
    _this.initMainMap = function () {
        var tlvCoord = {lat: 32.0855955, lng: 34.7887467};
        _this.mainMap = new google.maps.Map($('#map-div')[0], {zoom: 15, center: tlvCoord});
    };

    // initialize the mark-polygon map
    _this.initPolygonMap = function (shapeCoords) {
        var tlvCoord = {lat: 32.0855955, lng: 34.7887467};
        _this.polygonMap = new google.maps.Map($('#mark-polygon-div')[0], {zoom: 15, center: tlvCoord});

        _this.polygon = new google.maps.Polygon({
            map: _this.polygonMap,
            paths: shapeCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            editable: true,
            draggable: true,
            geodesic: true
        });
    };

	// add a marker to the map
    _this.addMarkerById = function (id, color) {
        var spot = App.Coords_tlv.get(id),
			loc = new google.maps.LatLng(spot.get('lat'), spot.get('lng'));
        _this.addMarker(loc, color);
    };
	
    // add a marker to the map
    _this.addMarker = function (loc, color) {
        var marker = new google.maps.Marker({
            position: loc,
            map: _this.mainMap
        });
		if (color) marker.setIcon('http://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png')
        _this.markers.push(marker);
    };

    // removes the markers from the map and the array
    _this.clearAllMarkers = function () {
        _this.markers.forEach(marker => marker.setMap(null));
        _this.markers = [];
    };

    // convert degrees to radiation
    var deg2rad = function (deg) {
        return deg * (Math.PI / 180)
    };

    // get the distance in meters between two coordinates
    _this.getDistanceBetweenCoords = function (coord1, coord2) {
        var lat1 = coord1.get('lat'),
            lng1 = coord1.get('lng'),
            lat2 = coord2.get('lat'),
            lng2 = coord2.get('lng');
        var R = 6371000; // Radius of the earth in m
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lng2 - lng1);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // distance in m
    };

    // get route between two spots by coordinates
    _this.getRouteByCoords = function (coord1, coord2) {
        var directionsService = new google.maps.DirectionsService();

        var request = {
            origin: coord1,
            destination: coord2,
            travelMode: google.maps.TravelMode.DRIVING
        };

        var deferred = $.Deferred();

        var requestRoute = function (delay) {
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    console.info('success');
                    deferred.resolve(response);
                } else {
                    if (status === 'OVER_QUERY_LIMIT') {
                        var retryTime = (delay + Math.random() * 5);
                        console.warn(status, 'Retrying in', retryTime, 'seconds');
                        // retry in 1 second
                        _.delay(requestRoute, retryTime * 1000, retryTime);
                    }
                }
            });
        };

        requestRoute(0);

        return deferred.promise();
    };

    // get route between two spots by id
    _this.getRouteByIds = function (id1, id2) {
        var coord1 = App.Coords_tlv.get(id1),
            coord2 = App.Coords_tlv.get(id2);

        var coord1obj = new google.maps.LatLng(coord1.get('lat'), coord1.get('lng')),
            coord2obj = new google.maps.LatLng(coord2.get('lat'), coord2.get('lng'));

        var def = $.Deferred();

        _this.getRouteByCoords(coord1obj, coord2obj).then(function (response) {
                var coordArr = [],
                    rawCoordArr = response.routes[0].overview_path;

                rawCoordArr.map(function (rawCoord) {
                    coordArr.push({lat: rawCoord.lat(), lng: rawCoord.lng()});
                });

                var obj = {};
                obj['id'] = id1;
                obj['routeCoords'] = coordArr;

                def.resolve(obj);
            },
            function () {
                console.log('rejected');
            });

        return def.promise();
    };
}();