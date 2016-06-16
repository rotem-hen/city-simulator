App.ScenarioHandling = new function () {

	var _this = this;

	// mode - new or update
	_this.scenarioMode = 'new';

	// create new scenario
	_this.onNewScenarioClick = function () {
		_this.scenarioMode = 'new';

		$('#scenario-name-input').show();
		$('#scenario-name-combo').hide();
		$('#delete-scenario-button-div').hide();

		$('#scenario-name-input').val('');
		$('#main-area-scenario-input').empty();
		$('#multiple-dropdown').empty();
		$('#parking-growth-rate-input').val('');

		App.Dropdown.fillParkingDBs('#main-area-scenario-input');
		App.Dropdown.fillPolygonsNames('#multiple-dropdown', true);
	};

	// update existing scenario
	_this.onUpdateScenarioClick = function () {
		_this.scenarioMode = 'update';

		$('#scenario-name-input').hide();
		$('#scenario-name-combo').show();
		$('#delete-scenario-button-div').show();
		$('#delete-scenario').prop('disabled', true);

		$('#scenario-name-combo').empty();
		$('#main-area-scenario-input').empty();
		$('#multiple-dropdown').empty();
		$('#parking-growth-rate-input').val('');

		App.Dropdown.fillScenariosNames('#scenario-name-combo');
		App.Dropdown.fillParkingDBs('#main-area-scenario-input');
		App.Dropdown.fillPolygonsNames('#multiple-dropdown', true);
	};

	// save new/updated scenario
	_this.onSaveScenarioClick = function () {
		if (!App.Validation.validateScenarioForm()) {
			alert('שדות חסרים או לא תקינים.');
			return;
		}
		var	mainArea = $('#main-area-scenario-input').val(),
			polygons = $('#multiple-dropdown').multipleSelect('getSelects'),
			parkingGrowthRate = $('#parking-growth-rate-input').val();

		if (_this.scenarioMode == 'new') {

			var name = $('#scenario-name-input').val();
			App.Scenarios.create({name: name, mainArea: mainArea, polygons: polygons, parkingGrowthRate: parkingGrowthRate});

		} else {

			var id = $('#scenario-name-combo').val();
			var scenario = App.Scenarios.get(parseInt(id));
			scenario.set({mainArea: mainArea, polygons: polygons, parkingGrowthRate: parkingGrowthRate});
			scenario.save();
		}

		$('#new-update-scenario-modal').modal('hide');
	};

	// delete scenario
	_this.onDeleteScenarioClick = function () {
		var scenarioId = $('#scenario-name-combo').val();
		var scenario = App.Scenarios.get(parseInt(scenarioId));
		scenario.destroy();
		$('#new-update-scenario-modal').modal('hide');
	};

	// get total number of drivers in a scenario
	_this.getTotalNumOfDrivers = function (scenarioId) {
		var totalNum = 0,
			scenario = App.Scenarios.get(scenarioId),
			polygons = scenario.get('polygons');
		polygons.forEach( function (polyIdString) {
			var polyId = parseInt(polyIdString);
			totalNum += App.PolygonHandling.getTotalNumOfDrivers(polyId);
		});

		return totalNum;
	};

}();