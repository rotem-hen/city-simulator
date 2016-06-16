describe('Handling scenarios', function () {

    var fixture, alertStub, saveStub, setStub, createStub, destroyStub;

    before(function () {
        fixture = $("<div id='fixture'></div>");
        $("body").append(fixture);
        App.Scenarios.add({id: 100});
    });

    beforeEach(function () {
        fixture.html(window.__html__['templates/scenario-modal.html']);
        alertStub = sinon.stub(window, 'alert');
        saveStub = sinon.stub(Backbone.Model.prototype, 'save');
        setStub = sinon.stub(Backbone.Model.prototype, 'set');
        createStub = sinon.stub(Backbone.Collection.prototype, 'create');
        destroyStub = sinon.stub(Backbone.Model.prototype, 'destroy');
    });

    describe('onNewScenarioClick', function () {

        beforeEach(function () {
            App.ScenarioHandling.onNewScenarioClick();
        });

        it('should reset form for new', function () {
            App.ScenarioHandling.scenarioMode.should.equal('new');
            $('#scenario-name-input').should.be.visible;
            $('#scenario-name-combo').should.not.be.visible;
            $('#delete-scenario-button-div').should.not.be.visible;
            $('#scenario-name-input').should.have.value('');
            $('#parking-growth-rate-input').should.have.value('');
        });
    });

    describe('onUpdateScenarioClick', function () {

        beforeEach(function () {
            App.ScenarioHandling.onUpdateScenarioClick();
        });

        it('should reset form for updated', function () {
            App.ScenarioHandling.scenarioMode.should.equal('update');
            $('#scenario-name-input').should.not.be.visible;
            $('#scenario-name-combo').should.be.visible;
            $('#delete-scenario-button-div').should.be.visible;
            $('#delete-scenario').should.be.disabled;
            $('#parking-growth-rate-input').should.have.value('');
        });
    });

    describe('onSaveScenarioClick - new', function () {

        beforeEach(function () {
            $('#multiple-dropdown').empty();
            $('#main-area-scenario-input').empty();
            var option = $('<option />', {value: 100, text: '0'});
            $('#multiple-dropdown').append(option).multipleSelect('refresh');
            $('#main-area-scenario-input').append(option);
            App.ScenarioHandling.scenarioMode = 'new';
        });

        describe('save invalid scenario', function () {

            it('should alert wrong input', function () {
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#scenario-name-input').val('scenario');
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#scenario-name-input').val('scenario');
                $('#main-area-scenario-input').val(100);
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#scenario-name-input').val('scenario');
                $('#main-area-scenario-input').val(100);
                $('#parking-growth-rate-input').val(0);
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#main-area-scenario-input').val(100);
                $('#multiple-dropdown').multipleSelect('checkAll');
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });
        });

        describe('save valid scenario', function () {

            it('should pass validation and call save', function () {
                $('#scenario-name-input').val('scenario');
                $('#main-area-scenario-input').val(100);
                $('#parking-growth-rate-input').val(0);
                $('#multiple-dropdown').multipleSelect('checkAll');
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.not.be.calledWith('שדות חסרים או לא תקינים.');
                createStub.should.have.been.calledOnce;
                setStub.should.not.have.been.calledOnce;
                saveStub.should.not.have.been.calledOnce;
            });
        });
    });

    describe('onSaveScenarioClick - update', function () {

        beforeEach(function () {
            $('#multiple-dropdown').empty();
            $('#main-area-scenario-input').empty();
            var option = $('<option />', {value: 100, text: '0'});
            $('#multiple-dropdown').append(option).multipleSelect('refresh');
            $('#main-area-scenario-input').append(option);
            $('#scenario-name-combo').append(option);
            App.ScenarioHandling.scenarioMode = 'update';
        });

        describe('save invalid scenario', function () {

            it('should alert wrong input', function () {
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#scenario-name-combo').val(100);
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#scenario-name-combo').val(100);
                $('#main-area-scenario-input').val(100);
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#scenario-name-combo').val(100);
                $('#main-area-scenario-input').val(100);
                $('#parking-growth-rate-input').val(0);
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#main-area-scenario-combo').val(100);
                $('#multiple-dropdown').multipleSelect('checkAll');
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });
        });

        describe('save valid scenario', function () {

            it('should pass validation and call save', function () {
                $('#scenario-name-combo').val(100);
                $('#main-area-scenario-input').val(100);
                $('#parking-growth-rate-input').val(0);
                $('#multiple-dropdown').multipleSelect('checkAll');
                App.ScenarioHandling.onSaveScenarioClick();
                alertStub.should.not.be.calledWith('שדות חסרים או לא תקינים.');
                createStub.should.not.have.been.calledOnce;
                setStub.should.have.been.calledOnce;
                saveStub.should.have.been.calledOnce;
            });
        });
    });

    describe('onDeleteScenarioClick', function () {

        beforeEach(function () {
            var option = $('<option />', {value: 100, text: '0'});
            $('#scenario-name-combo').append(option);
            $('#scenario-name-combo').val(100);
            App.ScenarioHandling.scenarioMode = 'update';
            App.ScenarioHandling.onDeleteScenarioClick();
        });

        it('should call destroy', function () {
            destroyStub.should.have.been.calledOnce;
        });
    });

    afterEach(function () {
        fixture.empty();
        alertStub.restore();
        saveStub.restore();
        setStub.restore();
        createStub.restore();
        destroyStub.restore();
    });

});