var ClockModel = Backbone.Model.extend({

    settings: {
        initHour: 7,
        initMin: 0,
        initSec: 0,
        clockAdvanceInterval: 10, // 10 seconds
        interval: 50 // in miliseconds
    },

    timeEvents: {},

    initialize: function () {
        // Init the clock
        var initialTime = moment()
            .hour(this.settings.initHour).minute(this.settings.initMin).second(this.settings.initSec);
        // set to the initial time in seconds
        this.set('time', initialTime.unix());
    },

    getTime: function () {
        return moment.unix(this.get('time'));
    },

    getTimeString: function () {
        return moment.unix(this.get('time')).format('HH:mm:ss');
    },

    startTicking: function () {
        window.setInterval(function () {
            var currentTime = this.get('time');
            this.onTick(currentTime);
            this.set('time', currentTime + this.settings.clockAdvanceInterval);
        }.bind(this), this.settings.interval);
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

        this.timeEvents[time].forEach ( function (func) {
           func();
        });
    },

    resetTimeEvents: function () {
        this.timeEvents = {};
    }
});

App.Clock = new ClockModel();