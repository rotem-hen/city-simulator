App.DataHandling = new function () {

	var _this = this;

    _this.stats = [];
    _this.savedMinutes = 0;
    _this.chartValues = {2: ['0.5', '1', '1.5', '2'],
                        4: ['1', '2', '3', '4'],
                        6: ['1.5', '3', '4.5', '6'],
                        8: ['2', '4', '6', '8'],
                        10: ['2.5', '5', '7.5', '10']};

    // sum
    var sum = (memo, num) => memo + num;

    // set the GUI average times
    var setAverage = function (isRunWithApp, isDriverWithApp) {
        var filtered = _.where(_this.stats, {isRunWithApp: isRunWithApp,
                                            isDriverWithApp: isDriverWithApp});
        var statsProp = isDriverWithApp ? 'with-app-' : 'without-app-',
            statsAr = filtered.map(obj => obj.timeToFind),
            avg = statsAr.length === 0 ? 0
                : (statsAr.reduce(sum, 0) / statsAr.length);
        $('#' + statsProp + 'avg').text(avg.toFixed(2));
    };

    // add entry to file
    var addEntry = function (isRunWithApp, isDriverWithApp, timeToFind) {
        _this.stats.push({isRunWithApp: isRunWithApp,
                            isDriverWithApp: isDriverWithApp,
                            timeToFind: timeToFind});
    };
    
    // process new data entry - add it and update average
    _this.processNewData = function (isRunWithApp, isDriverWithApp, timeToFind) {
        addEntry(isRunWithApp, isDriverWithApp, timeToFind);
        setAverage(isRunWithApp, isDriverWithApp);
    };

    // calculated sum of all saved minutes in the current run
    _this.calculateSavedMinutes = function () {
        var withApp = _.where(_this.stats, {isRunWithApp: true}),
            withoutApp = _.where(_this.stats, {isRunWithApp: false}),
            withAppTotal = withApp.map(entry => entry.timeToFind).reduce(sum, 0);
        _this.withoutAppTotal = withoutApp.map(entry => entry.timeToFind).reduce(sum, 0);

        _this.savedMinutes = _this.withoutAppTotal - withAppTotal;
    };

    // button action for the statistics year buttons
    _this.onYearButtonClick = function (id) {
        drawChart(calculateDataByYear(id));
        $('#statistics-modal').modal('show');
    };

    // calculate minutes saved for one driver
    var calculateMinutesSavedPerYear = function () {
        var numOfDays = App.RunningScenario.daysToRun;

        return (_this.savedMinutes * 365) / numOfDays;
    };

    // calculate saved time for every period of time
    var calculateSavedTime = function (id, minPerDriverYear) {
        var res = [];

        _this.chartValues[id].forEach ( function (years) {
            res.push((minPerDriverYear * years * Math.pow(1.01, years - 1)).toFixed(0));
        });

        return res;
    };

    // calculate saved money for every period of time
    var calculateSavedMoney = function (id, minPerDriverYear) {
        var res = [],
            minutePrice = 0.5;

        _this.chartValues[id].forEach ( function (years) {
            res.push((minPerDriverYear * years * minutePrice * Math.pow(1.01, years - 1)).toFixed(0));
        });

        return res;
    };

    // calculate saved pollution for every period of time
    var calculateSavedPollution = function (id) {
        var res = [],
			decreaseTimePercent = _this.savedMinutes * 100 / _this.withoutAppTotal,
			decreasePollutionPercent = decreaseTimePercent / 3;
		
		_this.chartValues[id].forEach ( function (years) {
            res.push((decreasePollutionPercent * Math.pow(1.01, years - 1)).toFixed(2));
        });
		
		return res;
    };

    // stringify - add 'year' or 'years' to the number
    var stringify = function (num) {
        return num + (num > 1 ? ' years' : ' year');
    };

    // calculate all chart's parameters
    var calculateDataByYear = function (id) {
        var minPerYear = calculateMinutesSavedPerYear(),
			numOfDrivers = App.ScenarioHandling.getTotalNumOfDrivers(App.RunningScenario.scenario.id),
            savedTime = calculateSavedTime(id, minPerYear / numOfDrivers),
            savedMoney = calculateSavedMoney(id, minPerYear / numOfDrivers),
            savedPollution = calculateSavedPollution(id);

        return [
            {
                "years": stringify(_this.chartValues[id][0]),
                "savedTime": savedTime[0],
                "savedMoney": savedMoney[0],
                "savedPollution": savedPollution[0]
            },
            {
                "years": stringify(_this.chartValues[id][1]),
                "savedTime": savedTime[1],
                "savedMoney": savedMoney[1],
                "savedPollution": savedPollution[1]
            },
            {
                "years": stringify(_this.chartValues[id][2]),
                "savedTime": savedTime[2],
                "savedMoney": savedMoney[2],
                "savedPollution": savedPollution[2]
            },
            {
                "years": stringify(_this.chartValues[id][3]),
                "savedTime": savedTime[3],
                "savedMoney": savedMoney[3],
                "savedPollution": savedPollution[3]
            }
        ];
    };

    // draw the chart
    var drawChart = function (data) {
        AmCharts.makeChart("chart",
            {
                "type": "serial",
                "categoryField": "years",
                "startDuration": 1,
                "creditsPosition": "bottom-right",
                "fontSize": 25,
                "handDrawn": true,
                "panEventsEnabled": false,
                "theme": "chalk",
                "categoryAxis": {
                    "gridPosition": "start",
                    "titleRotation": 2
                },
                "trendLines": [],
                "graphs": [
                    {
						"balloonText": "[[value]] min.",
                        "fillAlphas": 1,
                        "fillColors": "#11C4E1",
                        "id": "savedTime",
                        "lineAlpha": 0,
                        "title": "Saved Time\n(per driver)",
                        "type": "column",
                        "valueField": "savedTime"
                    },
                    {
						"balloonText": "[[value]] ILS",
                        "fillAlphas": 1,
                        "fillColors": "#FB8A8A",
                        "id": "savedMoney",
                        "lineAlpha": 0,
                        "title": "Saved Money\n(per driver)",
                        "type": "column",
                        "valueField": "savedMoney"
                    },
                    {
						"balloonText": "[[value]]%",
                        "fillAlphas": 1,
                        "fillColors": "#F9D46F",
                        "id": "savedPollution",
                        "lineAlpha": 0,
                        "title": "Saved Pollution",
                        "type": "column",
                        "valueField": "savedPollution"
                    }
                ],
                "guides": [],
                "valueAxes": [
                    {
                        "id": "ValueAxis-1",
                        "title": ""
                    }
                ],
                "allLabels": [],
                "balloon": {
                    "fixedPosition": true
                },
                "legend": {
                    "enabled": true,
                    "align": "center",
                    "autoMargins": false,
                    "bottom": 0,
                    "marginLeft": 0,
                    "marginRight": 0,
                    "marginTop": 30,
                    "markerLabelGap": 3,
                    "markerSize": 24,
                    "markerType": "circle",
                    "equalWidths": false,
                    "labelWidth": 160,
                    "spacing": -45,
                    "verticalGap": 0
                },
                "titles": [],
                "dataProvider": data
            }
        );
    }
}();