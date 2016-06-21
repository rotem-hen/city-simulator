describe('Handling Data', function () {

    var fixture, getTotalNumOfDriversStub;

    before(function () {
        AmCharts = {makeChart: function () {}};
        fixture = $("<div id='fixture'></div>");
        $("body").append(fixture);
		App.DataHandling.stats = [];
    });

    beforeEach(function () {
        getTotalNumOfDriversStub = sinon.stub(App.ScenarioHandling, 'getTotalNumOfDrivers');
        getTotalNumOfDriversStub.returns(100);
        fixture.html(window.__html__['templates/statistics-modal.html']);
		App.DataHandling.stats = [];
        App.DataHandling.savedMinutes = 100;

    });

    describe('processNewData', function () {

        describe('adding an entry to the stats field', function () {

            it('should add an entry to the stats field for run-with-app and driver-with-app', function () {
                App.DataHandling.processNewData(true, true, 1);
                App.DataHandling.stats.should.deep.equal([{isRunWithApp: true,
														isDriverWithApp: true,
														timeToFind: 1}]);
            });

			it('should add an entry to the stats field for run-with-app and driver-without-app', function () {
                App.DataHandling.processNewData(true, false, 2);
                App.DataHandling.stats.should.deep.equal([{isRunWithApp: true,
														isDriverWithApp: false,
														timeToFind: 2}]);
            });
			
			it('should add an entry to the stats field for run-without-app and driver-with-app', function () {
                App.DataHandling.processNewData(false, true, 3);
                App.DataHandling.stats.should.deep.equal([{isRunWithApp: false,
														isDriverWithApp: true,
														timeToFind: 3}]);
            });
			
			it('should add an entry to the stats field for run-without-app and driver-without-app', function () {
                App.DataHandling.processNewData(false, false, 4);
                App.DataHandling.stats.should.deep.equal([{isRunWithApp: false,
														isDriverWithApp: false,
														timeToFind: 4}]);
            });
        });
	});

	describe('calculateSavedMinutes', function () {

        describe('calculating the saved minutes according to stats', function () {

            it('should update the savedMinutes field by the saved minutes (1)', function () {
                App.DataHandling.stats = [{isRunWithApp: true, isDriverWithApp: true, timeToFind: 4},
											{isRunWithApp: true, isDriverWithApp: false, timeToFind: 6},
											{isRunWithApp: false, isDriverWithApp: true, timeToFind: 9},
											{isRunWithApp: false, isDriverWithApp: false, timeToFind: 11}];
                App.DataHandling.calculateSavedMinutes();
				App.DataHandling.savedMinutes.should.equal(10);
            });
			
			it('should update the savedMinutes field by the saved minutes (2)', function () {
                App.DataHandling.stats = [{isRunWithApp: true, isDriverWithApp: true, timeToFind: 10},
											{isRunWithApp: true, isDriverWithApp: false, timeToFind: 10},
											{isRunWithApp: false, isDriverWithApp: true, timeToFind: 20},
											{isRunWithApp: false, isDriverWithApp: false, timeToFind: 20}];
                App.DataHandling.calculateSavedMinutes();
				App.DataHandling.savedMinutes.should.equal(20);
            });
        });
	});

	describe('onYearButtonClick', function () {

        describe('clicking one of the stats buttons', function () {

            it('should calculate and present a chart', function () {
                App.RunningScenario.scenario = {id: 1};
                App.DataHandling.onYearButtonClick(2);
                App.DataHandling.chartsData.should.deep.equal(
                    [
                        {
                            "years": '0.5 year',
                            "savedTime": '182',
                            "savedMoney": '91',
                            "savedPollution": '37.31'
                        },
                        {
                            "years": '1 year',
                            "savedTime": '365',
                            "savedMoney": '183',
                            "savedPollution": '37.50'
                        },
                        {
                            "years": '1.5 years',
                            "savedTime": '550',
                            "savedMoney": '275',
                            "savedPollution": '37.69'
                        },
                        {
                            "years": '2 years',
                            "savedTime": '737',
                            "savedMoney": '369',
                            "savedPollution": '37.88'
                        }
                    ]
                )
            });
        });
	});

    afterEach(function () {
        getTotalNumOfDriversStub.restore();
        fixture.empty();
		App.DataHandling.stats = [];
    });

});