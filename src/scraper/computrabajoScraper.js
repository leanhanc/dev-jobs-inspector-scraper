const Scraper = require("./baseScraper");

const { COMPUTRABAJO_URL } = require("../utils/constants");
const { sleepFor } = require("../utils/generic");
const filterAdvertsByWord = "hora";
const siteName = "Computrabajo";

module.exports = class ComputrabajoScraper extends Scraper {
	constructor(searchFor) {
		super();
		this.baseUrl = COMPUTRABAJO_URL;
		this.searchFor = searchFor;
	}

	async sortByDate(page) {
		await sleepFor(2000);

		page.evaluate(() => {
			const { href } = window.location;
			window.location.href = `${href}?by=publicationtime`;
		});
	}

	async getAdvertDetails(advertDetailPage) {
		return await advertDetailPage.evaluate(siteName => {
			const composedAdvert = {};

			composedAdvert.date = new Date().toISOString();
			composedAdvert.description = document.querySelector(".box_detail.fl p.mbB").innerText.trim();

			const [publisherText, locationText] = document
				.querySelector("main h1 + p")
				.textContent.split("-");

			composedAdvert.title = document.querySelector("main h1").innerText.trim();
			composedAdvert.location = locationText.trim();
			composedAdvert.publisher = publisherText.trim();

			composedAdvert.site = siteName;
			composedAdvert.url = window.location.href;

			return composedAdvert;
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

	async getAdvertsUrl() {
		const advertsUrl = await this.page.evaluate(filterAdvertsByWord => {
			const filteredAdverts = [];
			const adverts = [...document.querySelectorAll("#p_ofertas")];

			if (!adverts.length) return filteredAdverts;

			document.querySelectorAll("#p_ofertas").forEach(advert => {
				// Tomar todos los avisos y filtrarlos por fecha
				if (
					advert.querySelector(".fs13.fc_aux") &&
					advert.querySelector(".fs13.fc_aux").textContent.includes(filterAdvertsByWord)
				) {
					filteredAdverts.push(advert.querySelector(".js-o-link").href);
				}
			}, filterAdvertsByWord);

			return filteredAdverts;
		}, filterAdvertsByWord);

		return advertsUrl;
	}

	async searchForAdverts(jobsCollection) {
		const searchInputSelector = "#search-prof-cat-input";

		for (let term of this.searchFor) {
			const searchInput = await this.page.$(searchInputSelector);

			if (!searchInputSelector) {
				await this.page.goBack();
				await this.page.waitForSelector(searchInput);
				await this.page.evaluate(() => (document.getElementById(searchInput).value = ""));
			}

			await this.page.waitForSelector(searchInputSelector);
			await this.page.$eval(searchInputSelector, el => (el.value = ""));

			await this.page.type(searchInputSelector, term, { delay: 100 });
			await this.page.keyboard.press("Enter");

			await this.sortByDate(this.page);
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
