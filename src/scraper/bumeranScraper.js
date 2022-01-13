const BaseScraper = require("./baseScraper");
const { BUMERAN_URL } = require("../utils/constants");
const { sleepFor } = require("../utils/generic");
const { clickByText } = require("../utils/scraper");

const siteName = "Bumeran";
const filterAdvertsByWord = "Hoy";
module.exports = class Bumeran extends BaseScraper {
	constructor(searchFor) {
		super();
		this.baseUrl = BUMERAN_URL;
		this.searchFor = searchFor;
	}

	async selectRecents() {
		await sleepFor(2000);
		await clickByText(this.page, "Recientes");
		await sleepFor(2000);
	}

	async getAdvertsUrl() {
		const advertsUrl = await this.page.evaluate(filterAdvertsByWord => {
			const filteredAdverts = [];

			document.querySelectorAll(".sc-dBaXSw.gPMmGU").forEach(advert => {
				if (
					advert
						.querySelector(".mixins__CustomText-sc-1t8bozv-5")
						.textContent.includes(filterAdvertsByWord)
				) {
					filteredAdverts.push(advert.querySelector("a").href);
				}
			}, filterAdvertsByWord);

			return filteredAdverts;
		}, filterAdvertsByWord);

		return advertsUrl;
	}

	async iterateOverAdvertsUrl(advertsUrl) {
		const advertsToSave = [];

		for (let advertUrl of advertsUrl) {
			const advertDetailPage = await this.browser.newPage();
			await advertDetailPage.goto(advertUrl);
			await sleepFor(2000);
			const newAdvert = await this.getAdvertDetails(advertDetailPage);
			advertsToSave.push(newAdvert);

			await sleepFor(2000);
			await advertDetailPage.close();
		}

		return advertsToSave;
	}

	async searchForAdverts(jobsCollection) {
		const searchInputSelector = "#react-select-3-input";

		for (let term of this.searchFor) {
			await this.page.goto(this.baseUrl);
			await sleepFor(1000);
			await this.page.waitForSelector(searchInputSelector);
			await this.page.type(searchInputSelector, term, { delay: 100 });
			await this.page.keyboard.press("Enter");
			await this.selectRecents();

			await sleepFor(2000);
			const advertsUrl = await this.getAdvertsUrl();

			const advertsToSave = await this.iterateOverAdvertsUrl(advertsUrl);
			await super.saveAdverts(advertsToSave, jobsCollection);
		}
		await this.browser.close();
	}

	async getAdvertDetails(advertDetailPage) {
		await sleepFor(2000);

		return await advertDetailPage.evaluate(async sitename => {
			const composedAdvert = {};

			composedAdvert.date = new Date().toISOString();
			composedAdvert.description = document.querySelector(".sc-clBsIJ.hZOSPM").innerText.trim();
			composedAdvert.location = document
				.querySelectorAll(".sc-hlILIN.bCBtuV")[1]
				.innerText.replace(", Argentina", "")
				.replace(", Buenos Aires", "");
			composedAdvert.title = document.querySelector(".Title__H1-sc-2yd2j1-0").innerText.trim();
			composedAdvert.site = sitename;
			composedAdvert.publisher = document.querySelector(".sc-fQkuQJ.qIiSv").innerText.trim();
			composedAdvert.url = window.location.href;

			return composedAdvert;
		}, siteName);
	}

	async run(jobsCollection) {
		await this.init(this.baseUrl);
		await this.searchForAdverts(jobsCollection);
	}
};
