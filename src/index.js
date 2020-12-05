require("dotenv").config();
require("./utils/errorHandling");

const { connectDatabase } = require("./db/connection");

const bootstrap = async () => {
	const { jobs } = await connectDatabase();

	const { SEARCH_FOR } = require("./utils/constants");

	const Bumeran = require("./scraper/bumeranScraper");

	new Bumeran(SEARCH_FOR).run(jobs);
};

bootstrap();
