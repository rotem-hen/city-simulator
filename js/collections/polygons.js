var polygonsClass = Backbone.Collection.extend({
	url: '/polygons'
});

App.Polygons = new polygonsClass();