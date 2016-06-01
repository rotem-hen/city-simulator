App.Validation = new function () {

	var _this = this;

	// validate script form
	_this.validateScriptForm = function () {

		var name = App.Script.scriptMode == 'new' ?
			$('#script-name-input').val() != '' :
			$('#script-name-combo').val() != -1,
			mainArea = $('#main-area-script-input').val() != -1,
			polygons = !_.isEmpty($('#multiple-dropdown').multipleSelect('getSelects')),
			parkingGrowthRate = $('#parking-growth-rate-input').val() != '';

		return name && mainArea && polygons && parkingGrowthRate;
	};

	// validate polygon form
	_this.validatePolygonForm = function () {
		var name = App.Polygon.polygonMode == 'new' ?
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