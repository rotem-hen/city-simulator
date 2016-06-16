window.App = {};


App.main = function () {

	// load main map
	App.Maps.initMainMap();

	// fetch database
	App.Scenarios.fetch();
	App.Polygons.fetch();
	App.Drivers.fetch();
	App.ParkingDBs.fetch();
	App.Coords_tlv.fetch();
	App.Routes.fetch();

	App.Scenarios.on('sync', function () {
		$('#main-scenarios-dd').empty();
		App.Dropdown.fillScenariosNames('#main-scenarios-dd');
	});

	// hide buttons
	$('#year-buttons-div').hide();
    $('#stop').hide();

	// assign action to button
	$('#run').click(App.RunningScenario.onRunClick);
    $('#stop').click(App.RunningScenario.onStopClick);
    $('#year-buttons-div button').click((event) => App.DataHandling.onYearButtonClick(event.target.id));
    
    // place holder for the multiple select
	$('#multiple-dropdown').multipleSelect({
		placeholder: '--בחר--'
	});

    // show polygon map
	$('#new-update-polygon-modal').on( 'shown.bs.modal', function(){
		google.maps.event.trigger(App.Maps.polygonMap, 'resize');
	});

    // on settings modal load
    function onSettingsModalLoad () {
        $('#new-scenario').click(App.ScenarioHandling.onNewScenarioClick);
        $('#update-scenario').click(App.ScenarioHandling.onUpdateScenarioClick);
        $('#new-polygon').click(App.PolygonHandling.onNewPolygonClick);
        $('#update-polygon').click(App.PolygonHandling.onUpdatePolygonClick);
    }

    // on scenario modal load
    function onScenarioModalLoad () {
        $('#save-scenario').click(App.ScenarioHandling.onSaveScenarioClick);
        $('#delete-scenario').click(App.ScenarioHandling.onDeleteScenarioClick);
        // fill scenario fields when drop-down element selected
        $('#scenario-name-combo').change (function () {
            if ($('#scenario-name-combo').val() == -1) {

                $('#delete-scenario').prop('disabled', true);

            } else {

                $('#delete-scenario').prop('disabled', false);

                var scenarioId = $('#scenario-name-combo').val(),
                    scenario = App.Scenarios.get(parseInt(scenarioId)),
                    mainArea = scenario.get('mainArea'),
                    polygons = scenario.get('polygons'),
                    growthRate = scenario.get('parkingGrowthRate');

                $('#main-area-scenario-input').val(mainArea);
                $('#multiple-dropdown').multipleSelect('setSelects', polygons);
                $('#parking-growth-rate-input').val(growthRate);
            }
        });
    }

    // on polygon modal load
    function onPolygonModalLoad () {
        $('#save-polygon').click(App.PolygonHandling.onSavePolygonClick);
        $('#delete-polygon').click(App.PolygonHandling.onDeletePolygonClick);
        // fill polygon fields when drop-down element selected
        $('#polygon-name-combo').change (function () {
            if ($('#polygon-name-combo').val() == -1) {

                $('#delete-polygon').prop('disabled', true);
                $('#load-mgmt').prop('disabled', true);

            } else {

                $('#delete-polygon').prop('disabled', false);
                $('#load-mgmt').prop('disabled', false);

                var polygonId = $('#polygon-name-combo').val(),
                    polygon = App.Polygons.get(parseInt(polygonId)),
                    mainArea = polygon.get('mainArea'),
                    coords = polygon.get('coordinates');

                $('#main-area-polygon-input').val(mainArea);
                App.Maps.initPolygonMap(coords);

                var setLoadMgmtValues = function (dayPeriod) {
                    var attributes = ['capacity', 'numParkingToFree', 'driversWithApp', 'driversWithoutApp'];
                    $('#' + dayPeriod + ' input').each (function (i, e) {
                        $(e).val(polygon.get(dayPeriod)[attributes[i]]);
                    });
                };

                _.keys(App.RunningScenario.dayPeriods).forEach (function (dayPeriod) {
                    setLoadMgmtValues(dayPeriod);
                });
            }
        });
    }

    // on load-management modal load
    function onLoadMgmtModalLoad () {
        $('#save-load-mgmt').click(App.PolygonHandling.onSaveLoadMgmtClick);
    }
    
    // load all templates
    function loadTemplates () {

        $('#settings-modal').load('templates/settings-modal.html', onSettingsModalLoad);
        $('#new-update-scenario-modal').load('templates/scenario-modal.html', onScenarioModalLoad);
        $('#new-update-polygon-modal').load('templates/polygon-modal.html', onPolygonModalLoad);
        $('#load-management-modal').load('templates/load-mgmt-modal.html', onLoadMgmtModalLoad);
        $('#statistics-modal').load('templates/statistics-modal.html');

    }

    loadTemplates();
};

$(document).ready(App.main);