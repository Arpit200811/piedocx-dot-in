import puppeteer from 'puppeteer';

(async () => {
    try {
        console.log('Testing Puppeteer launch...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        console.log('Browser launched successfully!');
        const version = await browser.version();
        console.log('Browser version:', version);
        await browser.close();
        console.log('Browser closed.');
    } catch (err) {
        console.error('Puppeteer launch failed:', err);
    }
})();
