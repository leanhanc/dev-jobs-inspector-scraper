// Env Config
require("dotenv").config();

// Database connection
const { connectDatabase } = require("./db/connection");

// Scraping Schedule
const startCronJobs = require("./jobs/");

// Utils
require("./utils/errorHandling");

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
	startCronJobs(jobs);

	console.log("Started Worker!");
};

bootstrap();
