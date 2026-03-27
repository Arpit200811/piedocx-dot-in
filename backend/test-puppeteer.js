import test from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

test('puppeteer launch health', { skip: !(process.env.CI === 'true' || process.env.REQUIRE_PUPPETEER === 'true') }, async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });
    const version = await browser.version();
    await browser.close();
    assert.ok(typeof version === 'string' && version.length > 0);
});
