App.DatabaseOps = new function () {

	var _this = this;

	// find neighbor spots to each parking
	var findNeighborsToSpots = function () {
        var deferred = $.Deferred();

        var allNeighbors = [];
        App.Coords_tlv.each (function (coord1) {
            var neighbors = [];
            App.Coords_tlv.each (function (coord2) {
                var distance = App.Maps.getDistanceBetweenCoords(coord1, coord2);
                if (distance <= 200) neighbors.push(coord2.get('id'));
            });
            allNeighbors.push(neighbors);
        });

        deferred.resolve(allNeighbors);

        return deferred.promise();
	};

    // set the neighbors field of every parking spot
    _this.setNeighborsToSpots = function () {
        findNeighborsToSpots().then(function (neighbors) {
            var coords = App.Coords_tlv;
            for (var i = 10448; i < 10869; i++) {
               var coord = coords.get(i);
               coord.set({neighbors: neighbors[i]});
               coord.save();
           }
        });
    };

    // DFS for finding routes of length depth from node id
    _this.dfs = function (id, depth) {
        var deferred = $.Deferred();
        var paths = [];

        var dfsRec = function (parking, path, currDepth, maxDepth) {
            if (currDepth == maxDepth) return path;
            parking.set({discovered: true});
            parking.get('neighbors').forEach(function (n) {
                var neighbor = App.Coords_tlv.get(n);
                if (!neighbor.get('discovered')) {
                    paths.push(dfsRec(neighbor, path.concat([n]), currDepth + 1, maxDepth));
                }
            });
        };

        App.Coords_tlv.each( function (coord) {
            coord.set({discovered: false});
        });

        dfsRec(App.Coords_tlv.get(id), [id], 0, depth);

        deferred.resolve(_.without(paths, undefined));

        return deferred.promise();
    };

    // find routes from every node
    var findRoutes = function () {
        var deferred = $.Deferred();
        var routesById = [];

        App.Coords_tlv.each(function (coord) {
            var id = coord.get('id');
            routesById[id] = {};
            for (var depth = 3; depth < 10; depth += 1) {
               _this.dfs(id, depth).then(function (paths) {
                   routesById[id][depth * 100] = paths;
               });
           }
        });

        deferred.resolve(routesById);

        return deferred.promise();
    };

    // find all the parking spots that are close to a route
    var findCloseSpots = function (route) {
        var result = [];
        route.forEach(function (coordNum) {
            var coord = App.Coords_tlv.get(coordNum);
            App.Coords_tlv.each(function (spot) {
                if (App.Maps.getDistanceBetweenCoords(coord, spot) <= 0.2) {
                    result.push(spot.get('id'));
                }
            });
        });

        result = _.sortBy(_.uniq(result));
        return result;
    };

    // set the routes to the database
    _this.setRoutes = function () {
        findRoutes().then( function (routesById) {
            /*App.Coords_tlv.each(function (coord) {*/
            var coords = App.Coords_tlv;
            for (var i = 8000; i < 9000; i++) {
                var coord = coords.get(i);
                coord.set({routes: routesById[coord.get('id')]});
                coord.save();
            }
        });
    };

    _this.removeDuplicate = function () {
        App.Coords_tlv.each(function (coord1) {
            App.Coords_tlv.each(function (coord2) {
                if (coord1 === undefined || coord2 === undefined) return true;
                if (coord1.id != coord2.id && coord1.get('lat') == coord2.get('lat') && coord1.get('lng') == coord2.get('lng')) {
                    coord2.destroy();
                }
            })
        });
    }

}();