const cron = require("node-cron");
const logger = require("../services/logger");
const { SEARCH_FOR } = require("../utils/constants");

const Bumeran = require("../scraper/bumeranScraper");
const Computrabajo = require("../scraper/computrabajoScraper");
const Zonajobs = require("../scraper/zonajobsScraper");

module.exports = async () => {
	const jobs = cron.schedule("0 0 */3 * * *", async () => {
		try {
			// Computrabajo
			const computrabajo = new Computrabajo(SEARCH_FOR);
			await computrabajo.scraper();

			// Zonajobs
			const zonajobs = new Zonajobs(SEARCH_FOR);
			await zonajobs.scraper();

			// Bumeran
			const bumeran = new Bumeran(SEARCH_FOR);
			await bumeran.scraper();
		} catch (e) {
			logger.error(e.message);
		}
	});

	jobs.start();
};
