const fs = require('fs');
const scraperObject = {
    url: 'https://example-ecommerce.com/products',

    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        
        await page.goto(this.url);
        let products = [];

        let isLastPage = false;
        while (!isLastPage) {
            const modalCloseBtn = '.modal-close'; 
            if (await page.$(modalCloseBtn)) {
                await page.click(modalCloseBtn);
                console.log("Closed a modal.");
            }
            await page.waitForSelector('.product-item');
            let newProducts = await page.$$eval('.product-item', items => {
                return items.map(item => {
                    let name = item.querySelector('.product-name').textContent.trim();
                    let price = item.querySelector('.product-price').textContent.trim();
                    let imageUrl = item.querySelector('.product-image img').src;
                    return { name, price, imageUrl };
                });
            });

            products.push(...newProducts);
            console.log(`Extracted ${newProducts.length} products from the page.`);
            const nextButton = await page.$('.pagination-next');
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
}

module.exports = scraperObject;
