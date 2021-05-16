const BaseScraper = require("./baseScraper");
const { BUMERAN_URL } = require("../utils/constants");
const { sleepFor } = require("../utils/generic");
const { clickByText } = require("../utils/scraper");

const siteName = "Bumeran";

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
		const advertsUrl = await this.page.evaluate(() => {
			const filteredAdverts = [];

			const cards = document.querySelectorAll(".Card__CardContentWrapper-i6v2cb-1.cdmEkq");

			for (const card of cards) {
				const isNew = card.querySelector(".Card__NewTag-i6v2cb-15.cDXEOe");
				if (isNew) filteredAdverts.push(card.href);
			}

			return filteredAdverts;
		});

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
		for (let term of this.searchFor) {
			await this.page.goto(this.baseUrl);
			await sleepFor(1000);
			await this.page.waitForSelector("#react-select-4-input");
			await this.page.type("#react-select-4-input", term, { delay: 100 });
			await this.page.keyboard.press("Enter");
			await this.selectRecents();
			const advertsUrl = await this.getAdvertsUrl();
			const advertsToSave = await this.iterateOverAdvertsUrl(advertsUrl);
			await super.saveAdverts(advertsToSave, jobsCollection);
			await sleepFor(1000);
		}
		await this.browser.close();
	}

	async getAdvertDetails(advertDetailPage) {
		await sleepFor(2000);

		return await advertDetailPage.evaluate(async sitename => {
			const advert = {
				description: "",
				location: "",
				publisher: "",
				site: "",
				title: "",
				url: "",
			};

			advert.date = new Date().toString();

			advert.description = document.querySelector(
				".FichaAviso__DescripcionAviso-b2a7hd-11",
			).innerText;

			advert.location =
				[...document.querySelectorAll(".DetalleAviso__InfoLabel-sc-1kfhr6j-1")][1].innerText.split(
					",",
				).shift === "Capital Federal"
					? "Capital Federal"
					: [...document.querySelectorAll(".DetalleAviso__InfoLabel-sc-1kfhr6j-1")][1].innerText
							.split(",")[1]
							.trim();
			advert.publisher = document.querySelector(
				".FichaAvisoSubHeader__Company-sc-1poii24-2",
			).innerText;
			advert.site = sitename;
			advert.title =
				document.querySelector(
					".FichaAvisoSubHeader__Heading-sc-1poii24-3.dzUULL.Title__H1-sc-2yd2j1-0.dmYIZt",
				)?.innerText || "";
			advert.url = window.location.href;

			return advert;
		}, siteName);
	}

	async run(jobsCollection) {
		await this.init(this.baseUrl);
		await this.searchForAdverts(jobsCollection);
	}
};
