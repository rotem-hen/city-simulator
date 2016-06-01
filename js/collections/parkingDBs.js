var parkingClass = Backbone.Collection.extend({
	url: '/parkingDBs'
});

App.ParkingDBs = new parkingClass();