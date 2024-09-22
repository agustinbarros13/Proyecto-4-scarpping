const browserObject = require('./browser');
const scraperController = require('./pageController');

(async () => {
    let browserInstance = await browserObject.startBrowser();
    await scraperController(browserInstance);
})();
