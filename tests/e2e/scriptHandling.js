module.exports = {
    'New Script test1' : function (browser) {
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

        browser.click('#new-script')
            .waitForElementVisible('#new-update-script-modal', 1000);

        // expect <#new-update-script-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-script-modal').to.have.css('display').which.equals('block');

        browser.setValue('#script-name-input', 'test script 1')
            .click('#main-area-script-input')
            .click('#main-area-script-input option[value="1"]')
            .click('.ms-choice')
            .click('input[type="checkbox"]')
            .pause(3000)
            .setValue('#parking-growth-rate-input', 1)
            .click('#save-script');

        browser.end();
    },

    'New Script test2' : function (browser) {
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

        browser.click('#new-script')
            .waitForElementVisible('#new-update-script-modal', 5000);

        // expect <#new-update-script-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-script-modal').to.have.css('display').which.equals('block');

        browser.setValue('#script-name-input', 'test script 1')
            .click('#main-area-script-input')
            .click('#main-area-script-input option[value="1"]')
            .click('.ms-choice')
            .click('input[type="checkbox"]')
            .click('#save-script')
            .pause(100)
            .getAlertText(function (result) {
                browser.assert.equal(result.value, 'שדות חסרים או לא תקינים.');
            }).acceptAlert();


        browser.end();
    },

    'Updated Script test1' : function (browser) {
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

        browser.click('#update-script')
            .waitForElementVisible('#new-update-script-modal', 5000);

        // expect <#new-update-script-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-script-modal').to.have.css('display').which.equals('block');

        browser.click('#script-name-combo')
            .click('#script-name-combo option')
            .setValue('#parking-growth-rate-input', '2')
            .click('#save-script');

        browser.end();
    },

    'Updated Script test2' : function (browser) {
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

        browser.click('#update-script')
            .waitForElementVisible('#new-update-script-modal', 5000);

        // expect <#new-update-script-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-script-modal').to.have.css('display').which.equals('block');

        browser.click('#script-name-combo')
            .click('#script-name-combo option')
            .clearValue('#parking-growth-rate-input')
            .click('#save-script')
            .pause(100)
            .getAlertText(function (result) {
                browser.assert.equal(result.value, 'שדות חסרים או לא תקינים.');
            }).acceptAlert();

        browser.end();
    },

    'Delete Script test1' : function (browser) {
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

        browser.click('#update-script')
            .waitForElementVisible('#new-update-script-modal', 5000);

        // expect <#new-update-script-modal> to have attribute 'display' which contains text 'block'
        browser.expect.element('#new-update-script-modal').to.have.css('display').which.equals('block');

        browser.click('#script-name-combo')
            .click('#script-name-combo option')
            .click('#delete-script');

        browser.end();
    }
};