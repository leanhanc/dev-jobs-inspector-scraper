import logger from "../services/logger";

process.on("uncaughtException", e => {
	logger.error(e.stack);
	process.exit(1);
});

process.on("unhandledRejection", e => {
	logger.error("[Unhandled Rejection]", e);
	process.exit(1);
});
