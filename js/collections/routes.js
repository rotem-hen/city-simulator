var routesClass = Backbone.Collection.extend({
    url: '/db/routes.json'
});

App.Routes = new routesClass();