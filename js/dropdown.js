App.Dropdown = new function () {

	var _this = this;

	// fill scenarios to drop-down list
	_this.fillScenariosNames = function (select) {
		$(select).append($('<option value=-1>--בחר--</option>'));
		App.Scenarios.each (function (scenario) {
			var name = scenario.get('name');
			$(select).append($('<option value=' + scenario.id + '>' + name + '</option>)'));
		});
	};

	// fill polygons to drop-down list
	_this.fillPolygonsNames = function (select, isMultiple) {
		if (!isMultiple) $(select).append($('<option value=-1>--בחר--</option>'));
		App.Polygons.each (function (polygon) {
			var name = polygon.get('name');
			$(select).append($('<option value=' + polygon.id + '>' + name + '</option>'));
		});
		if (isMultiple) $(select).multipleSelect('refresh');
	};

	// fill parking db's to drop-down list
	_this.fillParkingDBs = function (select) {
		$(select).append($('<option value=-1>--בחר--</option>'));
		App.ParkingDBs.each (function (parking) {
			var name = parking.get('name');
			$(select).append($('<option value=' + parking.id + '>' + name + '</option>'));
		});
	}

}();