App.DataHandling = new function () {

	var _this = this;

    _this.stats = [];

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

    _this.calculateWastedMinutes = function () {
        var withApp = _.where(_this.stats, {isRunWithApp: true}),
            withoutApp = _.where(_this.stats, {isRunWithApp: false}),
            withAppTotal = withApp.reduce(sum, 0),
            withoutAppTotal = withoutApp.reduce(sum, 0);

        return withAppTotal - withoutAppTotal;
    }

}();