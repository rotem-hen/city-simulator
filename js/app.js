window.App = {};


App.main = function () {

	// load main map
	App.Maps.initMainMap();

	// fetch database
	App.Scripts.fetch();
	App.Polygons.fetch();
	App.Drivers.fetch();
	App.ParkingDBs.fetch();
	App.Coords_tlv.fetch();
	App.Routes.fetch();

	App.Scripts.on('sync', function () {
		$('#main-scripts-dd').empty();
		App.Dropdown.fillScriptsNames('#main-scripts-dd');
	});

	// hide years buttons
	$('#year-buttons-div').hide();

	// assign action to button
	$('#run').click(App.RunningScript.onRunClick);

	$('#multiple-dropdown').multipleSelect({
		placeholder: '--בחר--'
	});

    // show polygon map
	$('#new-update-polygon-modal').on( 'shown.bs.modal', function(){
		google.maps.event.trigger(App.Maps.polygonMap, 'resize');
	});

    // on settings modal load
    function onSettingsModalLoad () {
        $('#new-script').click(App.Script.onNewScriptClick);
        $('#update-script').click(App.Script.onUpdateScriptClick);
        $('#new-polygon').click(App.Polygon.onNewPolygonClick);
        $('#update-polygon').click(App.Polygon.onUpdatePolygonClick);
    }

    // on script modal load
    function onScriptModalLoad () {
        $('#save-script').click(App.Script.onSaveScriptClick);
        $('#delete-script').click(App.Script.onDeleteScriptClick);
        // fill script fields when drop-down element selected
        $('#script-name-combo').change (function () {
            if ($('#script-name-combo').val() == -1) {

                $('#delete-script').prop('disabled', true);

            } else {

                $('#delete-script').prop('disabled', false);

                var scriptId = $('#script-name-combo').val(),
                    script = App.Scripts.get(parseInt(scriptId)),
                    mainArea = script.get('mainArea'),
                    polygons = script.get('polygons'),
                    growthRate = script.get('parkingGrowthRate');

                $('#main-area-script-input').val(mainArea);
                $('#multiple-dropdown').multipleSelect('setSelects', polygons);
                $('#parking-growth-rate-input').val(growthRate);
            }
        });
    }

    // on polygon modal load
    function onPolygonModalLoad () {
        $('#save-polygon').click(App.Polygon.onSavePolygonClick);
        $('#delete-polygon').click(App.Polygon.onDeletePolygonClick);
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

                _.keys(App.RunningScript.dayPeriods).forEach (function (dayPeriod) {
                    setLoadMgmtValues(dayPeriod);
                });
            }
        });
    }

    // on load-management modal load
    function onLoadMgmtModalLoad () {
        $('#save-load-mgmt').click(App.Polygon.onSaveLoadMgmtClick);
    }
    
    // load all templates
    function loadTemplates () {

        $("#settings-modal").load("templates/settings-modal.html", onSettingsModalLoad);
        $("#new-update-script-modal").load("templates/script-modal.html", onScriptModalLoad);
        $("#new-update-polygon-modal").load("templates/polygon-modal.html", onPolygonModalLoad);
        $("#load-management-modal").load("templates/load-mgmt-modal.html", onLoadMgmtModalLoad);
    }

    loadTemplates();
};

$(document).ready(App.main);