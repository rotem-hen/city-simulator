var scenariosClass = Backbone.Collection.extend({
	url: '/scenarios'
});

App.Scenarios = new scenariosClass();