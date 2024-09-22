const fs = require('fs');

const scraperObject = {
    url: 'http://books.toscrape.com/',

    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        let products = [];
        let isLastPage = false;

        while (!isLastPage) {
            await page.waitForSelector('.product_pod');
            // Manejo de modales
            try {
                await page.waitForSelector('.modal-close', { timeout: 5000 });
                await page.click('.modal-close');
            } catch (err) {
                console.log("No modal present");
            }

            let newProducts = await page.$$eval('.product_pod', items => {
                return items.map(item => {
                    let name = item.querySelector('h3 a').getAttribute('title');
                    let price = item.querySelector('.price_color').textContent;
                    let imageUrl = item.querySelector('img').src;
                    return { name, price, imageUrl };
                });
            });

            products.push(...newProducts);
            console.log(`Extracted ${newProducts.length} products from the page.`);

            const nextButton = await page.$('.next a');
            if (nextButton) {
                await nextButton.click();
                await page.waitForTimeout(2000);
            } else {
                isLastPage = true;
                console.log("No more pages to scrape.");
            }
        }

        fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2));
        console.log('Data scraped and saved to products.json');
    }
};

module.exports = scraperObject;
