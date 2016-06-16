module.exports = {
    'New Scenario test1' : function (browser) {
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

        browser.click('#new-scenario')
            .waitForElementVisible('#new-update-scenario-modal', 1000);

        // expect <#new-update-scenario-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-scenario-modal').to.have.css('display').which.equals('block');

        browser.setValue('#scenario-name-input', 'test scenario 1')
            .click('#main-area-scenario-input')
            .click('#main-area-scenario-input option[value="1"]')
            .click('.ms-choice')
            .click('input[type="checkbox"]')
            .pause(3000)
            .setValue('#parking-growth-rate-input', 1)
            .click('#save-scenario');

        browser.end();
    },

    'New Scenario test2' : function (browser) {
        browser
            .url('http://localhost:3000/')
            .pause(2000);

        // expect element <#settings> to be visible
        browser.expect.element('#settings').to.be.visible;

        // expect <#settings-modal> to not be displayed
        browser.expect.element('#settings-modal').to.not.be.visible;

        browser.click('#settings')
            .waitForElementVisible('#settings-modal', 1000);

        // expect <#settings-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#settings-modal').to.have.css('display').which.equals('block');

        browser.click('#new-scenario')
            .waitForElementVisible('#new-update-scenario-modal', 5000);

        // expect <#new-update-scenario-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-scenario-modal').to.have.css('display').which.equals('block');

        browser.setValue('#scenario-name-input', 'test scenario 1')
            .click('#main-area-scenario-input')
            .click('#main-area-scenario-input option[value="1"]')
            .click('.ms-choice')
            .click('input[type="checkbox"]')
            .click('#save-scenario')
            .pause(100)
            .getAlertText(function (result) {
                browser.assert.equal(result.value, 'שדות חסרים או לא תקינים.');
            }).acceptAlert();


        browser.end();
    },

    'Updated Scenario test1' : function (browser) {
        browser
            .url('http://localhost:3000/')
            .pause(2000);

        // expect element <#settings> to be visible
        browser.expect.element('#settings').to.be.visible;

        // expect <#settings-modal> to not be displayed
        browser.expect.element('#settings-modal').to.not.be.visible;

        browser.click('#settings')
            .waitForElementVisible('#settings-modal', 1000);

        // expect <#settings-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#settings-modal').to.have.css('display').which.equals('block');

        browser.click('#update-scenario')
            .waitForElementVisible('#new-update-scenario-modal', 5000);

        // expect <#new-update-scenario-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-scenario-modal').to.have.css('display').which.equals('block');

        browser.click('#scenario-name-combo')
            .click('#scenario-name-combo option')
            .setValue('#parking-growth-rate-input', '2')
            .click('#save-scenario');

        browser.end();
    },

    'Updated Scenario test2' : function (browser) {
        browser
            .url('http://localhost:3000/')
            .pause(2000);

        // expect element <#settings> to be visible
        browser.expect.element('#settings').to.be.visible;

        // expect <#settings-modal> to not be displayed
        browser.expect.element('#settings-modal').to.not.be.visible;

        browser.click('#settings')
            .waitForElementVisible('#settings-modal', 1000);

        // expect <#settings-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#settings-modal').to.have.css('display').which.equals('block');

        browser.click('#update-scenario')
            .waitForElementVisible('#new-update-scenario-modal', 5000);

        // expect <#new-update-scenario-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-scenario-modal').to.have.css('display').which.equals('block');

        browser.click('#scenario-name-combo')
            .click('#scenario-name-combo option')
            .clearValue('#parking-growth-rate-input')
            .click('#save-scenario')
            .pause(100)
            .getAlertText(function (result) {
                browser.assert.equal(result.value, 'שדות חסרים או לא תקינים.');
            }).acceptAlert();

        browser.end();
    },

    'Delete Scenario test1' : function (browser) {
        browser
            .url('http://localhost:3000/')
            .pause(2000);

        // expect element <#settings> to be visible
        browser.expect.element('#settings').to.be.visible;

        // expect <#settings-modal> to not be displayed
        browser.expect.element('#settings-modal').to.not.be.visible;

        browser.click('#settings')
            .waitForElementVisible('#settings-modal', 1000);

        // expect <#settings-modal> to have attribute 'display' which equals to 'block'
        browser.expect.element('#settings-modal').to.have.css('display').which.equals('block');

        browser.click('#update-scenario')
            .waitForElementVisible('#new-update-scenario-modal', 5000);

        // expect <#new-update-scenario-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-scenario-modal').to.have.css('display').which.equals('block');

        browser.click('#scenario-name-combo')
            .click('#scenario-name-combo option')
            .click('#delete-scenario');

        browser.end();
    }
};