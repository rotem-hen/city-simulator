describe('Clock', function () {

    var clock, settings, time, hour, minute, second, onTickStub, func, setStub;

    before(function () {
        clock = sinon.useFakeTimers();

        settings = App.Clock.settings;
        time = App.Clock.get('time');
        hour = moment.unix(time).get('hour');
        minute = moment.unix(time).get('minute');
        second = moment.unix(time).get('second');

        func = sinon.stub();
    });

    beforeEach(function () {
        setStub = sinon.stub(Backbone.Model.prototype, 'set');
    });

    describe('initialize on creation', function () {

        it ('should initialize clock from settings', function () {
            hour.should.equal(settings.initHour);
            minute.should.equal(settings.initMin);
            second.should.equal(settings.initSec);
        });

    });

    describe('getTime', function () {

        it ('should return the current value of clock as moment', function () {
            var getTimeResult = App.Clock.getTime();
            getTimeResult.get('hour').should.equal(settings.initHour);
            getTimeResult.get('minute').should.equal(settings.initMin);
            getTimeResult.get('second').should.equal(settings.initSec);
        });

    });

    describe('getTimeString', function () {
        var format = function (num) {
            return (num.toString().length < 2 ? '0' : '') + num;
        };

        it ('should return the current value of clock as string HH:mm:ss', function () {
            var getTimeStringResult = App.Clock.getTimeString();
            getTimeStringResult.should.equal(format(settings.initHour) + ':'
                                            + format(settings.initMin) + ':'
                                            + format(settings.initSec));
        });

    });

    describe('startTicking', function () {
        before(function () {
            onTickStub = sinon.stub(App.Clock, 'onTick');
        });

        it ('should activate onTick every INTERVAL ms', function () {
            App.Clock.startTicking();
            clock.tick(settings.interval);
            onTickStub.should.have.been.calledOnce;
            clock.tick(settings.interval);
            onTickStub.should.have.been.calledTwice;
            clock.tick(settings.interval);
            onTickStub.should.have.been.calledThrice;
        });

        after(function () {
            onTickStub.restore();
        });
    });

    describe('onTick', function () {
        App.Clock.resetTimeEvents();

        it ('should return with no action', function () {
            App.Clock.onTick();
            func.should.not.have.been.called;
        });

        it ('should activate func', function () {
            App.Clock.timeEvents[time] = [func];
            App.Clock.onTick(time);
            func.should.have.been.calledOnce;
        });

    });

    describe('addEvent', function () {

        it ('should add an event to time events', function () {
            var clockTime = App.Clock.getTime();
            App.Clock.addEvent(clockTime, func);
            App.Clock.timeEvents[clockTime.unix()].should.include(func);
        });

    });

    describe('resetTimeEvent', function () {

        it ('should reset the time events', function () {
            App.Clock.resetTimeEvents();
            App.Clock.timeEvents.should.be.empty;
        });

    });

    afterEach(function () {
        setStub.restore();
    });

    after(function () {
        clock.restore();
    });

});