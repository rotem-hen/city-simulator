describe('Handling scripts', function () {

    var fixture, alertStub, saveStub, setStub, createStub, destroyStub;

    before(function () {
        fixture = $("<div id='fixture'></div>");
        $("body").append(fixture);
        App.Scripts.add({id: 100});
    });

    beforeEach(function () {
        fixture.html(window.__html__['templates/script-modal.html']);
        alertStub = sinon.stub(window, 'alert');
        saveStub = sinon.stub(Backbone.Model.prototype, 'save');
        setStub = sinon.stub(Backbone.Model.prototype, 'set');
        createStub = sinon.stub(Backbone.Collection.prototype, 'create');
        destroyStub = sinon.stub(Backbone.Model.prototype, 'destroy');
    });

    describe('onNewScriptClick', function () {

        beforeEach(function () {
            App.Script.onNewScriptClick();
        });

        it('should reset form for new', function () {
            App.Script.scriptMode.should.equal('new');
            $('#script-name-input').should.be.visible;
            $('#script-name-combo').should.not.be.visible;
            $('#delete-script-button-div').should.not.be.visible;
            $('#script-name-input').should.have.value('');
            $('#parking-growth-rate-input').should.have.value('');
        });
    });

    describe('onUpdateScriptClick', function () {

        beforeEach(function () {
            App.Script.onUpdateScriptClick();
        });

        it('should reset form for updated', function () {
            App.Script.scriptMode.should.equal('update');
            $('#script-name-input').should.not.be.visible;
            $('#script-name-combo').should.be.visible;
            $('#delete-script-button-div').should.be.visible;
            $('#delete-script').should.be.disabled;
            $('#parking-growth-rate-input').should.have.value('');
        });
    });

    describe('onSaveScriptClick - new', function () {

        beforeEach(function () {
            $('#multiple-dropdown').empty();
            $('#main-area-script-input').empty();
            var option = $('<option />', {value: 100, text: '0'});
            $('#multiple-dropdown').append(option).multipleSelect('refresh');
            $('#main-area-script-input').append(option);
            App.Script.scriptMode = 'new';
        });

        describe('save invalid script', function () {

            it('should alert wrong input', function () {
                App.Script.onSaveScriptClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#script-name-input').val('script');
                App.Script.onSaveScriptClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#script-name-input').val('script');
                $('#main-area-script-input').val(100);
                App.Script.onSaveScriptClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#script-name-input').val('script');
                $('#main-area-script-input').val(100);
                $('#parking-growth-rate-input').val(0);
                App.Script.onSaveScriptClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#main-area-script-input').val(100);
                $('#multiple-dropdown').multipleSelect('checkAll');
                App.Script.onSaveScriptClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });
        });

        describe('save valid script', function () {

            it('should pass validation and call save', function () {
                $('#script-name-input').val('script');
                $('#main-area-script-input').val(100);
                $('#parking-growth-rate-input').val(0);
                $('#multiple-dropdown').multipleSelect('checkAll');
                App.Script.onSaveScriptClick();
                alertStub.should.not.be.calledWith('שדות חסרים או לא תקינים.');
                createStub.should.have.been.calledOnce;
                setStub.should.not.have.been.calledOnce;
                saveStub.should.not.have.been.calledOnce;
            });
        });
    });

    describe('onSaveScriptClick - update', function () {

        beforeEach(function () {
            $('#multiple-dropdown').empty();
            $('#main-area-script-input').empty();
            var option = $('<option />', {value: 100, text: '0'});
            $('#multiple-dropdown').append(option).multipleSelect('refresh');
            $('#main-area-script-input').append(option);
            $('#script-name-combo').append(option);
            App.Script.scriptMode = 'update';
        });

        describe('save invalid script', function () {

            it('should alert wrong input', function () {
                App.Script.onSaveScriptClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#script-name-combo').val(100);
                App.Script.onSaveScriptClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#script-name-combo').val(100);
                $('#main-area-script-input').val(100);
                App.Script.onSaveScriptClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#script-name-combo').val(100);
                $('#main-area-script-input').val(100);
                $('#parking-growth-rate-input').val(0);
                App.Script.onSaveScriptClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#main-area-script-combo').val(100);
                $('#multiple-dropdown').multipleSelect('checkAll');
                App.Script.onSaveScriptClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });
        });

        describe('save valid script', function () {

            it('should pass validation and call save', function () {
                $('#script-name-combo').val(100);
                $('#main-area-script-input').val(100);
                $('#parking-growth-rate-input').val(0);
                $('#multiple-dropdown').multipleSelect('checkAll');
                App.Script.onSaveScriptClick();
                alertStub.should.not.be.calledWith('שדות חסרים או לא תקינים.');
                createStub.should.not.have.been.calledOnce;
                setStub.should.have.been.calledOnce;
                saveStub.should.have.been.calledOnce;
            });
        });
    });

    describe('onDeleteScriptClick', function () {

        beforeEach(function () {
            var option = $('<option />', {value: 100, text: '0'});
            $('#script-name-combo').append(option);
            $('#script-name-combo').val(100);
            App.Script.scriptMode = 'update';
            App.Script.onDeleteScriptClick();
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