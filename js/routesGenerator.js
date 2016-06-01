var Backbone = require('backbone'),
	_ = require('underscore'),
    r = require('../db/coords2.json'),
    fs = require('fs'),
	$ = require('jquery-deferred'),
    coords_tlvAr = r.coords_tlv,
    coords_tlv = new Backbone.Collection(coords_tlvAr);


// DFS for finding routes of length depth from node id
var dfs = function (id, depth) {
	var deferred = $.Deferred();
	var paths = [];

	var dfsRec = function (spot, path, currDepth, maxDepth) {
		if (currDepth == maxDepth) return path;
		spot.set({discovered: true});
		spot.get('neighbors').forEach(function (n) {
			var neighbor = coords_tlv.get(n);
			if (!neighbor.get('discovered')) {
				paths.push(dfsRec(neighbor, path.concat([n]), currDepth + 1, maxDepth));
			}
		});
	};

	coords_tlv.each( function (coord) {
		coord.set({discovered: false});
	});

	dfsRec(coords_tlv.get(id), [id], 0, depth);

	deferred.resolve(_(paths).without(undefined));

	return deferred.promise();
};



var main = function () {
	var deferred = $.Deferred();

	var coords = coords_tlv;
	var allRoutes = [];
	coords.forEach(function (coord, index) {
		var coordRoutes = {
			id: coord.id,
			routes: {}
		};
		allRoutes.push(coordRoutes);
		for (var i = 30; i < 100; i+=10) {
			dfs(coord.id, i).then(function (routes) {
				if (i == 30 && _.isEmpty(routes)) {
					allRoutes = _(allRoutes).without(coordRoutes);
					if (index == coords.length - 1)
						deferred.resolve(allRoutes);
					return;
				}
				console.log('Coord: ', index, coord.id);
				coordRoutes.routes[i*10] = routes;
				if (index == coords.length - 1)
					deferred.resolve(allRoutes);
			});
		}
	});

	return deferred.promise();
};

main().then(function (allRoutes) {
	fs.writeFile('../db/routes2.json', JSON.stringify(allRoutes), function (err) {
		if(err) {
			return console.log(err);
		}

		console.log('The file was saved!');
	});
});