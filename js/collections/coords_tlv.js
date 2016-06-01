var coordsClass = Backbone.Collection.extend({
  url: 'http://localhost:3000/db/coords_tlv.json'
});

App.Coords_tlv = new coordsClass();