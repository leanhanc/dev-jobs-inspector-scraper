require("dotenv").config();
require("./utils/errorHandling");
const { SEARCH_FOR } = require("./utils/constants");
const { connectDatabase } = require("./db/connection");
// Scrapers
const Bumeran = require("./scraper/bumeranScraper");
const Computrabajo = require("./scraper/computrabajoScraper");
const Zonajobs = require("./scraper/zonajobsScraper");

const bootstrap = async () => {
	const { jobs } = await connectDatabase();

	new Zonajobs(SEARCH_FOR).run(jobs);
};

bootstrap();
