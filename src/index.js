require("dotenv").config();
require("./utils/errorHandling");
const { SEARCH_FOR } = require("./utils/constants");
const { connectDatabase } = require("./db/connection");
// Scrapers
const Bumeran = require("./scraper/bumeranScraper");
const Computrabajo = require("./scraper/computrabajoScraper");

const bootstrap = async () => {
	const { jobs } = await connectDatabase();

	new Computrabajo(SEARCH_FOR).run(jobs);
};

bootstrap();
