var scriptsClass = Backbone.Collection.extend({
	url: '/scripts'
});

App.Scripts = new scriptsClass();