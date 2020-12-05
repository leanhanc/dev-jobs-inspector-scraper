const Scraper = require("./baseScraper");

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
		await this.page.waitFor(1000);
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

			composeAdvert.description = [].map
				.call(document.querySelectorAll(".aviso_description > p"), el => el.innerText)
				.join();
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
		for (let advertUrl of advertsUrl) {
			const advertDetailPage = await this.browser.newPage();
			await advertDetailPage.goto(advertUrl);
			await advertDetailPage.waitFor(2000);

			const adverts = await this.getAdvertDetails(advertDetailPage);
			await super.saveAdverts(adverts);

			await advertDetailPage.waitFor(1000);
			await advertDetailPage.close();
		}
	}

	async searchForAdverts() {
		for (let term of this.searchFor) {
			await this.page.waitForSelector("#query");
			await this.page.type("#query", term, { delay: 100 });
			await this.page.keyboard.press("Enter");
			await this.page.waitFor(1000);

			await this.sortByDate();

			await this.page.waitFor(2000);
			const advertsUrl = await this.getAdvertsUrl();
			await this.iterateOverAdvertsUrl(advertsUrl);
		}
		this.browser.close();
	}

	async scraper() {
		await super.init(this.baseUrl);
		await this.searchForAdverts();
	}
};
