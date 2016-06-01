App.Script = new function () {

	var _this = this;

	// mode - new or update
	_this.scriptMode = 'new';

	// create new script
	_this.onNewScriptClick = function () {
		_this.scriptMode = 'new';

		$('#script-name-input').show();
		$('#script-name-combo').hide();
		$('#delete-script-button-div').hide();

		$('#script-name-input').val('');
		$('#main-area-script-input').empty();
		$('#multiple-dropdown').empty();
		$('#parking-growth-rate-input').val('');

		App.Dropdown.fillParkingDBs('#main-area-script-input');
		App.Dropdown.fillPolygonsNames('#multiple-dropdown', true);
	};

	// update existing script
	_this.onUpdateScriptClick = function () {
		_this.scriptMode = 'update';

		$('#script-name-input').hide();
		$('#script-name-combo').show();
		$('#delete-script-button-div').show();
		$('#delete-script').prop('disabled', true);

		$('#script-name-combo').empty();
		$('#main-area-script-input').empty();
		$('#multiple-dropdown').empty();
		$('#parking-growth-rate-input').val('');

		App.Dropdown.fillScriptsNames('#script-name-combo');
		App.Dropdown.fillParkingDBs('#main-area-script-input');
		App.Dropdown.fillPolygonsNames('#multiple-dropdown', true);
	};

	// save new/updated script
	_this.onSaveScriptClick = function () {
		if (!App.Validation.validateScriptForm()) {
			alert('שדות חסרים או לא תקינים.');
			return;
		}
		var	mainArea = $('#main-area-script-input').val(),
			polygons = $('#multiple-dropdown').multipleSelect('getSelects'),
			parkingGrowthRate = $('#parking-growth-rate-input').val();

		if (_this.scriptMode == 'new') {

			var name = $('#script-name-input').val();
			App.Scripts.create({name: name, mainArea: mainArea, polygons: polygons, parkingGrowthRate: parkingGrowthRate});

		} else {

			var id = $('#script-name-combo').val();
			var script = App.Scripts.get(parseInt(id));
			script.set({mainArea: mainArea, polygons: polygons, parkingGrowthRate: parkingGrowthRate});
			script.save();
		}

		$('#new-update-script-modal').modal('hide');
	};

	// delete script
	_this.onDeleteScriptClick = function () {
		var scriptId = $('#script-name-combo').val();
		var script = App.Scripts.get(parseInt(scriptId));
		script.destroy();
		$('#new-update-script-modal').modal('hide');
	};
}();