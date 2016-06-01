module.exports = {
    'Delete Script test1' : function (browser) {
        browser
            .url('http://localhost:3000/')
            .pause(2000);

        // expect element <#main-scripts-dd> to be visible
        browser.expect.element('#main-scripts-dd').to.be.visible;

        // expect <#run> to be visible
        browser.expect.element('#run').to.be.visible;

        browser.click('#main-scripts-dd')
            .click('#main-script-dd option');

        browser.click('#run');
    }
};