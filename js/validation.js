App.Validation = new function () {

	var _this = this;

	// validate scenario form
	_this.validateScenarioForm = function () {

		var name = App.ScenarioHandling.scenarioMode == 'new' ?
			$('#scenario-name-input').val() != '' :
			$('#scenario-name-combo').val() != -1,
			mainArea = $('#main-area-scenario-input').val() != -1,
			polygons = !_.isEmpty($('#multiple-dropdown').multipleSelect('getSelects')),
			parkingGrowthRate = $('#parking-growth-rate-input').val() != '';

		return name && mainArea && polygons && parkingGrowthRate;
	};

	// validate polygon form
	_this.validatePolygonForm = function () {
		var name = App.PolygonHandling.polygonMode == 'new' ?
			$('#polygon-name-input').val() != '' :
			$('#polygon-name-combo').val() != -1,
			mainArea = $('#main-area-polygon-input').val() != -1;

		return name && mainArea && _this.validateLoadMgmtForm();
	};

	// validate load management form
	_this.validateLoadMgmtForm = function () {
		var allInputs = $('#load-mgmt-table input'),
			isValid = true;
		allInputs.each( function (i, input) {
			if ($(input).val() == '') isValid = false;
		});

		return isValid;
	}

}();