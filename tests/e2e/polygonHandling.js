module.exports = {
    'New Polygon test1': function (browser) {
        browser
            .url('http://localhost:3000/')
            .pause(3000);

        // expect element <#settings> to be visible
        browser.expect.element('#settings').to.be.visible;

        // expect <#settings-modal> to not be displayed
        browser.expect.element('#settings-modal').to.not.be.visible;

        browser.click('#settings')
            .waitForElementVisible('#settings-modal', 1000);

        // expect <#settings-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#settings-modal').to.have.css('display').which.equals('block');

        browser.click('#new-polygon')
            .waitForElementVisible('#new-update-polygon-modal', 5000);

        // expect <#new-update-polygon-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-polygon-modal').to.have.css('display').which.equals('block');

        browser.setValue('#polygon-name-input', 'test polygon 1')
            .click('#main-area-polygon-input')
            .click('#main-area-polygon-input option[value="1"]')
            .click('#load-mgmt')
            .waitForElementVisible('#load-management-modal', 5000);

        // expect <#load-mgmt-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#load-management-modal').to.have.css('display').which.equals('block');

        browser.setValue('#morning-capacity-rate input', '1')
            .setValue('#morning-num-parking-to-free input', '1')
            .setValue('#morning-drivers-with-app input', '1')
            .setValue('#morning-drivers-without-app input', '1')
            .setValue('#noon-capacity-rate input', '1')
            .setValue('#noon-num-parking-to-free input', '1')
            .setValue('#noon-drivers-with-app input', '1')
            .setValue('#noon-drivers-without-app input', '1')
            .setValue('#evening-capacity-rate input', '1')
            .setValue('#evening-num-parking-to-free input', '1')
            .setValue('#evening-drivers-with-app input', '1')
            .setValue('#evening-drivers-without-app input', '1')
            .setValue('#night-capacity-rate input', '1')
            .setValue('#night-num-parking-to-free input', '1')
            .setValue('#night-drivers-with-app input', '1')
            .setValue('#night-drivers-without-app input', '1');
        browser.click('#save-load-mgmt')
            .waitForElementNotVisible('#load-management-modal', 5000);

        // expect <#load-mgmt-modal> to not be displayed
        browser.expect.element('#load-management-modal').to.not.be.visible;

        browser.click('#save-polygon');

        browser.end();
    },

    'New Polygon test2' : function (browser) {
        browser
            .url('http://localhost:3000/')
            .pause(3000);

        // expect element <#settings> to be visible
        browser.expect.element('#settings').to.be.visible;

        // expect <#settings-modal> to not be displayed
        browser.expect.element('#settings-modal').to.not.be.visible;

        browser.click('#settings')
            .waitForElementVisible('#settings-modal', 1000);

        // expect <#settings-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#settings-modal').to.have.css('display').which.equals('block');

        browser.click('#new-polygon')
            .waitForElementVisible('#new-update-polygon-modal', 5000);

        // expect <#new-update-scenario-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-polygon-modal').to.have.css('display').which.equals('block');

        browser.setValue('#polygon-name-input', 'test polygon 1')
            .click('#main-area-polygon-input')
            .click('#main-area-polygon-input option[value="1"]')
            .click('#save-polygon')
            .pause(100)
            .getAlertText(function (result) {
                browser.assert.equal(result.value, 'שדות חסרים או לא תקינים.');
            }).acceptAlert();



        browser.end();
    },

    'Update Polygon test1' : function (browser) {
        browser
            .url('http://localhost:3000/')
            .pause(3000);

        // expect element <#settings> to be visible
        browser.expect.element('#settings').to.be.visible;

        // expect <#settings-modal> to not be displayed
        browser.expect.element('#settings-modal').to.not.be.visible;

        browser.click('#settings')
            .waitForElementVisible('#settings-modal', 1000);

        // expect <#settings-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#settings-modal').to.have.css('display').which.equals('block');

        browser.click('#update-polygon')
            .waitForElementVisible('#new-update-polygon-modal', 5000);

        // expect <#new-update-scenario-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-polygon-modal').to.have.css('display').which.equals('block');

        browser.click('#polygon-name-combo')
            .click('#polygon-name-combo option')
            .pause(3000)
            .click('#load-mgmt')
            .waitForElementVisible('#load-management-modal', 5000);

        // expect <#load-mgmt-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#load-management-modal').to.have.css('display').which.equals('block');

        browser.setValue('#morning-capacity-rate input', '2')
            .click('#save-load-mgmt')
            .waitForElementNotVisible('#load-management-modal', 5000);

        // expect <#load-mgmt-modal> to not be displayed
        browser.expect.element('#load-management-modal').to.not.be.visible;

        browser.click('#save-polygon');

        browser.end();
    },

    'Update Polygon test2' : function (browser) {
        browser
            .url('http://localhost:3000/')
            .pause(3000);

        // expect element <#settings> to be visible
        browser.expect.element('#settings').to.be.visible;

        // expect <#settings-modal> to not be displayed
        browser.expect.element('#settings-modal').to.not.be.visible;

        browser.click('#settings')
            .waitForElementVisible('#settings-modal', 1000);

        // expect <#settings-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#settings-modal').to.have.css('display').which.equals('block');

        browser.click('#update-polygon')
            .waitForElementVisible('#new-update-polygon-modal', 5000);

        // expect <#new-update-scenario-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-polygon-modal').to.have.css('display').which.equals('block');

        browser.click('#polygon-name-combo')
            .click('#polygon-name-combo option')
            .click('#load-mgmt')
            .waitForElementVisible('#load-management-modal', 5000);

        // expect <#load-mgmt-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#load-management-modal').to.have.css('display').which.equals('block');

        browser.clearValue('#morning-capacity-rate input')
            .click('#save-load-mgmt')
            .pause(100)
            .getAlertText(function (result) {
                browser.assert.equal(result.value, 'שדות חסרים או לא תקינים.');
            }).acceptAlert();



        browser.end();
    },

    'Delete Polygon test1' : function (browser) {
        browser
            .url('http://localhost:3000/')
            .pause(3000);

        // expect element <#settings> to be visible
        browser.expect.element('#settings').to.be.visible;

        // expect <#settings-modal> to not be displayed
        browser.expect.element('#settings-modal').to.not.be.visible;

        browser.click('#settings')
            .waitForElementVisible('#settings-modal', 1000);

        // expect <#settings-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#settings-modal').to.have.css('display').which.equals('block');

        browser.click('#update-polygon')
            .waitForElementVisible('#new-update-polygon-modal', 5000);

        // expect <#new-update-scenario-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-polygon-modal').to.have.css('display').which.equals('block');

        browser.click('#polygon-name-combo')
            .click('#polygon-name-combo option')
            .click('#delete-polygon');

        browser.end();
    }
};