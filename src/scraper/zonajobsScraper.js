const Scraper = require("./baseScraper");
const { sleepFor } = require("../utils/generic");
const { ZONAJOBS_URL } = require("../utils/constants");

const filterAdvertsByWord = "horas";
const siteName = "Zonajobs";

module.exports = class Zonajobs extends Scraper {
	constructor(searchFor) {
		super();
		this.baseUrl = ZONAJOBS_URL;
		this.searchFor = searchFor;
	}

	async sortByDate() {
		const buttonSelector = ".btn.switch-btn";
		await this.page.waitForSelector(buttonSelector);
		const button = await this.page.$$(buttonSelector);
		await button[1].click();
		await sleepFor(1000);
	}

	async getAdvertsUrl() {
		const advertsUrl = await this.page.evaluate(filterAdvertsByWord => {
			const filteredAdverts = [];

			document.querySelectorAll(".aviso").forEach(advert => {
				if (advert.querySelector(".z-fecha").textContent.includes(filterAdvertsByWord)) {
					filteredAdverts.push(advert.querySelector("a").href);
				}
			}, filterAdvertsByWord);

			return filteredAdverts;
		}, filterAdvertsByWord);

		return advertsUrl;
	}

	async getAdvertDetails(advertDetailPage) {
		return await advertDetailPage.evaluate(siteName => {
			const composeAdvert = {};

			composeAdvert.date = new Date().toString();
			composeAdvert.description = document
				.querySelector(".aviso_description")
				.innerText.replace("Descripción", "")
				.trim();
			composeAdvert.location =
				document.querySelector(".spec_def h2 a").innerText.split(",")[0] === "Capital Federal"
					? document.querySelector(".spec_def h2 a").innerText.split(",")[0]
					: document.querySelector(".spec_def h2 a").innerText.split(",")[1];
			composeAdvert.publisher = document.querySelector(".aviso_company").innerText;
			composeAdvert.site = siteName;
			composeAdvert.title = document.querySelector(".aviso_title").innerText;
			composeAdvert.url = window.location.href;

			return composeAdvert;
		}, siteName);
	}

	async iterateOverAdvertsUrl(advertsUrl) {
		const advertsToSave = [];

		for (let advertUrl of advertsUrl) {
			const advertDetailPage = await this.browser.newPage();
			await advertDetailPage.goto(advertUrl);
			await sleepFor(2000);

			const newAdvert = await this.getAdvertDetails(advertDetailPage);
			advertsToSave.push(newAdvert);

			await sleepFor(1000);
			await advertDetailPage.close();
		}

		return advertsToSave;
	}

	async searchForAdverts(jobsCollection) {
		for (let term of this.searchFor) {
			await this.page.waitForSelector("#query");
			await this.page.type("#query", term, { delay: 100 });
			await this.page.keyboard.press("Enter");
			await sleepFor(1000);

			await this.sortByDate();

			await sleepFor(2000);
			const advertsUrl = await this.getAdvertsUrl();

			const advertsToSave = await this.iterateOverAdvertsUrl(advertsUrl);
			await super.saveAdverts(advertsToSave, jobsCollection);
		}
		this.browser.close();
	}

	async run(jobsCollection) {
		await super.init(this.baseUrl);
		await this.searchForAdverts(jobsCollection);
	}
};
