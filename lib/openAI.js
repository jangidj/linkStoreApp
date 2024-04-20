const puppeteer = require('puppeteer');
const axios = require('axios'); // for making HTTP requests

const sendMessageAndGetResponse = async function (message) {
    const browser = await puppeteer.launch({
        headless: false, args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });
    const page = await browser.newPage();

    await page.goto('https://chat.openai.com/', { timeout: 30000 });
    await sleep(5000); // Sleep for 3000 milliseconds (3 seconds)
    await page.type('#prompt-textarea', `please create search keywords on this message . ${message}`);
    await page.click('button[data-testid="send-button"]');
    await page.waitForSelector('button[data-testid="send-button"]');
    await page.waitForSelector('ol li');

    const listItemsText = await page.evaluate(() => {
        const liElements = Array.from(document.querySelectorAll('ol li'));
        return liElements.map(li => li.textContent.trim());
    });


    console.log("listItemsText", listItemsText);

    // Close the browser
    await browser.close();

    return listItemsText

    // return { websiteResponse: response, openaiResponse: openaiText };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



module.exports = sendMessageAndGetResponse;