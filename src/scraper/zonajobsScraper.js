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

	async sortByDate(page) {
		await sleepFor(2000);

		page.evaluate(() => {
			const { href } = window.location;
			window.location.href = `${href}?recientes=true`;
		});
	}

	async getAdvertsUrl() {
		const advertsUrl = await this.page.evaluate(filterAdvertsByWord => {
			const filteredAdverts = [];

			document.querySelectorAll(".aviso").forEach(advert => {
				if (advert.querySelector(".z-fecha").textContent.includes(filterAdvertsByWord)) {
					filteredAdverts.push(advert.querySelector("a").href);
				}
			}, filterAdvertsByWord);

			// Remove all Bumeran jobs, they are saved in their own scraper job
			return filteredAdverts.filter(url => !url.includes("bumeran"));
		}, filterAdvertsByWord);

		return advertsUrl;
	}

	async getAdvertDetails(advertDetailPage) {
		return await advertDetailPage.evaluate(siteName => {
			const composedAdvert = {};

			if (!document.querySelector(".detalle-aviso")) {
				return;
			}

			composedAdvert.date = new Date().toISOString();
			composedAdvert.description = document.querySelector(".aviso_description").innerText;

			composedAdvert.location = document.querySelector(".spec_def h2").innerText;
			composedAdvert.publisher = document.querySelector(".aviso_company").innerText;
			composedAdvert.site = siteName;
			composedAdvert.title = document.querySelector(".aviso_title").innerText;
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

	async searchForAdverts(jobsCollection) {
		for (let term of this.searchFor) {
			await this.page.waitForSelector("#query");
			await this.page.type("#query", term, { delay: 100 });
			await this.page.keyboard.press("Enter");
			await sleepFor(10000);

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
