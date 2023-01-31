import "module-alias/register";
import { config, logger } from "@utils";
import { connectToServer } from "@db";
import server from "./server";
const port = config.PORT || 80000;

export const createServer = async () => {
	// Connect to DB and start server. If there is an error, then exit the process.
	await connectToServer((err) => {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
		server().listen(port);
		logger.info("Server started on port " + port + "...");
	});
};

createServer();
