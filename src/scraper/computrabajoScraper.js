const Scraper = require("./baseScraper");

const { COMPUTRABAJO_URL } = require("../utils/constants");
const { sleepFor } = require("../utils/generic");
const filterAdvertsByWord = "Ayer";
const siteName = "Computrabajo";

module.exports = class ComputrabajoScraper extends Scraper {
	constructor(searchFor) {
		super();
		this.baseUrl = COMPUTRABAJO_URL;
		this.searchFor = searchFor;
	}

	async getAdvertDetails(advertDetailPage) {
		return await advertDetailPage.evaluate(siteName => {
			const composeAdvert = {};

			composeAdvert.date = new Date().toString();
			composeAdvert.description = document
				.querySelector(".p0.m0")
				.innerText.replace("Descripción", "")
				.trim();
			composeAdvert.location = document
				.querySelectorAll("ul.m0 p")[1]
				.innerText.split(",")[1]
				.trim();
			composeAdvert.publisher = document.querySelector("#urlverofertas")?.innerText.trim() || "";
			composeAdvert.site = siteName;
			composeAdvert.title = document.querySelector("h1.m0").innerText;
			composeAdvert.url = window.location.href;

			// Normalizar nombre de localidad
			if (composeAdvert.location.includes("Buenos Aires")) composeAdvert.location = "Buenos Aires";

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

	async getAdvertsUrl() {
		const advertsUrl = await this.page.evaluate(filterAdvertsByWord => {
			const filteredAdverts = [];

			document.querySelectorAll(".iO").forEach(advert => {
				// No hacer scraping de avisos sin Consultora o Empresa
				if (advert.querySelector(".it-blank").href === window.location.href) {
					return;
				}
				// Tomar todos los avisos y filtrarlos por fecha
				if (advert.querySelector(".dO").textContent.includes(filterAdvertsByWord)) {
					filteredAdverts.push(advert.querySelector(".js-o-link").href);
				}
			}, filterAdvertsByWord);

			return filteredAdverts;
		}, filterAdvertsByWord);

		return advertsUrl;
	}

	async searchForAdverts(jobsCollection) {
		for (let term of this.searchFor) {
			const searchInput = await this.page.$("#sq");

			if (!searchInput) {
				await this.page.goBack();
				await this.page.waitForSelector("#sq");
				await this.page.evaluate(() => (document.getElementById("sq").value = ""));
			}

			await this.page.waitForSelector("#sq");
			await this.page.type("#sq", term, { delay: 100 });
			await this.page.keyboard.press("Enter");

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
