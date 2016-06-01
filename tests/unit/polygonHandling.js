describe('Handling polygons', function () {

    var fixture, alertStub, saveStub, setStub, createStub, destroyStub, initPolygonMapStub;

    App.Maps.polygon = new function () { this.getPaths = function () {
                return new function () { this.getAt = function () {
                    return new function () { this.j = function () {}}();
                }}();
    }}();

    before(function () {
        fixture = $("<div id='fixture'></div>");
        $("body").append(fixture);
        App.Polygons.add({id: 100});
    });

    beforeEach(function () {
        fixture.html(window.__html__['templates/polygon-modal.html']);
        fixture.append(window.__html__['templates/load-mgmt-modal.html']);
        alertStub = sinon.stub(window, 'alert');
        saveStub = sinon.stub(Backbone.Model.prototype, 'save');
        setStub = sinon.stub(Backbone.Model.prototype, 'set');
        createStub = sinon.stub(Backbone.Collection.prototype, 'create');
        destroyStub = sinon.stub(Backbone.Model.prototype, 'destroy');
        initPolygonMapStub = sinon.stub(App.Maps, 'initPolygonMap');
    });

    describe('onNewPolygonClick', function () {

        beforeEach(function () {
            App.Polygon.onNewPolygonClick();
        });

        it('should reset form for new', function () {
            App.Polygon.polygonMode.should.equal('new');
            $('#polygon-name-input').should.be.visible;
            $('#polygon-name-combo').should.not.be.visible;
            $('#delete-polygon-button-div').should.not.be.visible;
            $('#load-mgmt').should.not.be.disabled;
            $('#polygon-name-input').should.have.value('');
            $('#load-mgmt-table td input').each(function (index, element) {
                element.value.should.equal('');
            });
        });
    });

    describe('onUpdatePolygonClick', function () {

        beforeEach(function () {
            App.Polygon.onUpdatePolygonClick();
        });

        it('should reset form for updated', function () {
            App.Polygon.polygonMode.should.equal('update');
            $('#polygon-name-input').should.not.be.visible;
            $('#polygon-name-combo').should.be.visible;
            $('#delete-polygon-button-div').should.be.visible;
            $('#delete-polygon').should.be.disabled;
            $('#load-mgmt').should.be.disabled;
        });
    });

    describe('onSavePolygonClick - new', function () {

        beforeEach(function () {
            $('#main-area-polygon-input').empty();
            var option = $('<option />', {value: 100, text: '0'});
            $('#main-area-polygon-input').append(option);
            App.Polygon.polygonMode = 'new';
        });

        describe('save invalid polygon', function () {

            it('should alert wrong input', function () {
                App.Polygon.onSavePolygonClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#polygon-name-input').val('polygon');
                App.Polygon.onSavePolygonClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#main-area-polygon-input').val(100);
                App.Polygon.onSavePolygonClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

           it('should alert wrong input', function () {
                $('#polygon-name-input').val('polygon');
                $('#main-area-polygon-input').val(100);
                App.Polygon.onSavePolygonClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });
        });

        describe('save valid polygon', function () {

            it('should pass validation and call save', function () {
                $('#polygon-name-input').val('polygon');
                $('#main-area-polygon-input').val(100);
                $('#load-mgmt-table td input').each(function (index, element) {
                    element.value = 1;
                });
                App.Polygon.onSavePolygonClick();
                alertStub.should.not.be.calledWith('שדות חסרים או לא תקינים.');
                createStub.should.have.been.calledOnce;
                setStub.should.not.have.been.calledOnce;
                saveStub.should.not.have.been.calledOnce;
            });
        });
    });

    describe('onSavePolygonClick - update', function () {

        beforeEach(function () {
            $('#main-area-polygon-input').empty();
            var option = $('<option />', {value: 100, text: '0'});
            $('#main-area-polygon-input').append(option);
            $('#polygon-name-combo').append(option);
            App.Polygon.polygonMode = 'update';
        });

        describe('save invalid polygon', function () {

            it('should alert wrong input', function () {
                App.Polygon.onSavePolygonClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#polygon-name-combo').val(100);
                App.Polygon.onSavePolygonClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#main-area-polygon-input').val(100);
                App.Polygon.onSavePolygonClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });

            it('should alert wrong input', function () {
                $('#polygon-name-combo').val(100);
                $('#main-area-polygon-input').val(100);
                App.Polygon.onSavePolygonClick();
                alertStub.should.be.calledWith('שדות חסרים או לא תקינים.');
            });
        });

        describe('save valid polygon', function () {

            it('should pass validation and call save', function () {
                $('#polygon-name-combo').val(100);
                $('#main-area-polygon-input').val(100);
                $('#load-mgmt-table td input').each(function (index, element) {
                    element.value = 1;
                });
                App.Polygon.onSavePolygonClick();
                alertStub.should.not.be.calledWith('שדות חסרים או לא תקינים.');
                createStub.should.not.have.been.calledOnce;
                setStub.should.have.been.calledOnce;
                saveStub.should.have.been.calledOnce;
            });
        });
    });

    describe('onDeletePolygonClick', function () {

        beforeEach(function () {
            var option = $('<option />', {value: 100, text: '0'});
            $('#polygon-name-combo').append(option);
            $('#polygon-name-combo').val(100);
            App.Polygon.polygonMode = 'update';
        });

        it('should call destroy - no scripts', function () {
            App.Polygon.onDeletePolygonClick();
            destroyStub.should.have.been.calledOnce;
            setStub.should.have.not.been.calledOnce;
            saveStub.should.have.not.been.calledOnce;
        });

        it('should call destroy - script exist', function () {
            var script = App.Scripts.add({id: 100});
            App.Polygon.onDeletePolygonClick();
            destroyStub.should.have.been.calledOnce;
            setStub.should.have.been.calledTwice;
            saveStub.should.have.been.calledOnce;
        });
    });

    afterEach(function () {
        fixture.empty();
        alertStub.restore();
        saveStub.restore();
        setStub.restore();
        createStub.restore();
        destroyStub.restore();
        initPolygonMapStub.restore();
    });

});