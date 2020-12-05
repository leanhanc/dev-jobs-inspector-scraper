const puppeteer = require("puppeteer");
const logger = require("../services/logger");
const { LAUNCH_OPTIONS } = require("../utils/constants");

module.exports = class Scraper {
	constructor() {}

	async init(url) {
		this.page = await this.launchBrowser();
		await this.page.goto(url);
	}

	async launchBrowser() {
		this.browser = await puppeteer.launch(LAUNCH_OPTIONS);

		const page = await this.browser.newPage();

		await page.setUserAgent(
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
		);

		await page.setRequestInterception(true);

		page.on("request", request => {
			if (["image", "font"].includes(request.resourceType())) {
				request.abort();
			} else {
				request.continue();
			}
		});

		return page;
	}

	async saveAdverts(adverts, jobsCollection) {
		try {
			for (let advert of adverts) {
				const alreadyExists = await jobsCollection.findOne({ description: advert.description });
				if (alreadyExists) return;

				await jobsCollection.insertOne(advert);
			}
		} catch (e) {
			logger.log(`[ScrapperError]: ${e}`);
		}
	}
};
