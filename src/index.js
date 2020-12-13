require("dotenv").config();
require("./utils/errorHandling");

const cronJobs = require("./jobs/");
const { connectDatabase } = require("./db/connection");

const bootstrap = async () => {
	const { jobs: jobsCollection } = await connectDatabase();
	cronJobs(jobsCollection);
};

bootstrap();
