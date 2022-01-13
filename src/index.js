require("dotenv").config();
require("./utils/errorHandling");
const { SEARCH_FOR } = require("./utils/constants");
const { connectDatabase } = require("./db/connection");
// Scrapers
const Bumeran = require("./scraper/bumeranScraper");
const Computrabajo = require("./scraper/computrabajoScraper");
const Zonajobs = require("./scraper/zonajobsScraper");

const bootstrap = async () => {
	// Handle uncaught exceptions/unhandled promise rejections and log them
	process.on("uncaughtException", e => {
		console.log(`${e.message}\n${e.stack}`);
		process.exit(1);
	});
	process.on("unhandledRejection", reason => {
		throw reason;
	});
	const { jobs } = await connectDatabase();

	await new Computrabajo(SEARCH_FOR).run(jobs);
	await new Zonajobs(SEARCH_FOR).run(jobs);
	await new Bumeran(SEARCH_FOR).run(jobs);
};

bootstrap();
