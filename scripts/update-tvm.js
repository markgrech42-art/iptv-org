const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let streamUrl = null;

    page.on("response", response => {
        const url = response.url();

        if (url.includes("/live/2/master.m3u8")) {
            streamUrl = url;
        }
    });

    console.log("Opening TVMi...");

    await page.goto("https://tvmi.mt/live/2", {
        waitUntil: "domcontentloaded",
        timeout: 60000
    });

    await page.waitForTimeout(15000);

    await browser.close();

    if (!streamUrl) {
        console.error("TVM stream was not found.");
        process.exit(1);
    }

    console.log("TVM stream found:");
    console.log(streamUrl);
})();
