var driversClass = Backbone.Collection.extend({
	url: '/drivers'
});

App.Drivers = new driversClass();