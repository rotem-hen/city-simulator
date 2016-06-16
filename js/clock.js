var ClockModel = Backbone.Model.extend({

    settings: {
        initHour: 7,
        initMin: 0,
        initSec: 0,
        clockAdvanceInterval: 10, // 10 seconds
        interval: 5 // in miliseconds
    },

    initialTime: null,
    
    timeEvents: {},

    initialize: function () {
        // Init the clock
        this.initialTime = moment()
            .hour(this.settings.initHour).minute(this.settings.initMin).second(this.settings.initSec);
        this.set('time', this.initialTime.unix());
    },

    // set to the initial time in seconds
    resetClock : function () {
        this.stopTicking();
        this.set('time', this.initialTime.unix());
    },

    getTime: function () {
        return moment.unix(this.get('time'));
    },

    getTimeString: function () {
        return moment.unix(this.get('time')).format('HH:mm:ss');
    },

    startTicking: function () {
        this.clockRun = window.setInterval(function () {
            var currentTime = this.get('time');
            this.set('time', currentTime + this.settings.clockAdvanceInterval);
            this.onTick(currentTime);
        }.bind(this), this.settings.interval);
    },

    stopTicking: function () {
        window.clearInterval(this.clockRun);
    },

    addEvent: function (timeMoment, func) {
        var time = timeMoment.unix();
        if (!_.isArray(this.timeEvents[time])) {
            this.timeEvents[time] = [];
        }
        this.timeEvents[time].push(func);
    },

    onTick: function (time) {
        if (!_.isArray(this.timeEvents[time])) {
            return;
        }

        this.timeEvents[time].forEach ( func => func());
    },

    resetTimeEvents: function () {
        this.timeEvents = {};
    }
});

App.Clock = new ClockModel();