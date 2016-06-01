App.Polygon = new function () {

	var _this = this;

	// mode - new or update
	_this.polygonMode = 'new';

	// load management values
	_this.loadMgmtValues = {};

	// create new polygon
	_this.onNewPolygonClick = function () {
		_this.polygonMode = 'new';

		$('#polygon-name-input').show();
		$('#polygon-name-combo').hide();
		$('#delete-polygon-button-div').hide();
		$('#load-mgmt').prop('disabled', false);

		$('#polygon-name-input').val('');
		$('#main-area-polygon-input').empty();
		$('#load-mgmt-table td input').each(function (index, element) {
			element.value = '';
		});

		App.Dropdown.fillParkingDBs('#main-area-polygon-input');
		App.Maps.initPolygonMap(App.Maps.defaultPolygonCoords);
	};

	// update existing polygon
	_this.onUpdatePolygonClick = function () {
		_this.polygonMode = 'update';

		$('#polygon-name-input').hide();
		$('#polygon-name-combo').show();
		$('#delete-polygon-button-div').show();
		$('#delete-polygon').prop('disabled', true);
		$('#load-mgmt').prop('disabled', true);

		$('#polygon-name-combo').empty();
		$('#main-area-polygon-input').empty();

		App.Dropdown.fillParkingDBs('#main-area-polygon-input');
		App.Dropdown.fillPolygonsNames('#polygon-name-combo', false);
		App.Maps.initPolygonMap([]);
	};

	// get polygon's coordinates
	var getPolygonCoords = function () {
		var polygonCoords = [],
			coordsArr = App.Maps.polygon.getPaths().getAt(0).j;

		for (var i = 0; i < coordsArr.length; i++) {
			polygonCoords.push({lat: coordsArr[i].lat(), lng: coordsArr[i].lng()});
		}

		return polygonCoords;
	};

	// save new/updated polygon
	_this.onSavePolygonClick = function () {
		if (!App.Validation.validatePolygonForm()) {
			alert('שדות חסרים או לא תקינים.');
			return;
		}

		var	mainArea = $('#main-area-polygon-input').val(),
			coordinates = getPolygonCoords(),
			polyAttr = {};

		if (_this.polygonMode == 'new') {

			var name = $('#polygon-name-input').val();
			polyAttr = _.extend({name: name, mainArea: mainArea, coordinates: coordinates}, _this.loadMgmtValues);
			App.Polygons.create(polyAttr);

		} else {

			var id = $('#polygon-name-combo').val();
			var polygon = App.Polygons.get(parseInt(id));
			polyAttr = _.extend({mainArea: mainArea, coordinates: coordinates}, _this.loadMgmtValues);
			polygon.set(polyAttr);
			polygon.save();
		}

		$('#new-update-polygon-modal').modal('hide');
	};

	// save load management
	_this.onSaveLoadMgmtClick = function () {
		if (!App.Validation.validateLoadMgmtForm()) {
			alert('שדות חסרים או לא תקינים.');
			return;
		}

		var getValues = function (dayPeriod) {
			var values = $('#' + dayPeriod + ' input').toArray().map(function (e) {
				return parseInt($(e).val());
			});
			return {capacity: values[0], numParkingToFree: values[1],
				driversWithApp: values[2], driversWithoutApp: values[3]}
		};

		var values = {};
		_.keys(App.RunningScript.dayPeriods).forEach (function (dayPeriod) {
			values[dayPeriod] = getValues(dayPeriod);
		});
		_this.loadMgmtValues = values;

		$('#load-management-modal').modal('hide');
	};

	// delete polygon from all scripts it's in
	var deletePolygonFromScripts = function (polyId) {
		App.Scripts.each (function (script) {
			var polygons = script.get('polygons');
			script.set({polygons: _.without(polygons, polyId)});
			script.save();
		});
	};

	// delete polygon
	_this.onDeletePolygonClick = function () {
		var polygonId = $('#polygon-name-combo').val();
		var polygon = App.Polygons.get(parseInt(polygonId));
		polygon.destroy();
		deletePolygonFromScripts(polygonId);
		$('#new-update-polygon-modal').modal('hide');
	};
}();