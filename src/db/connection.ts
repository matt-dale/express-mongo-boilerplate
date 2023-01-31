import { MongoClient, Db } from "mongodb";
import { config, logger } from "@utils";

const client = new MongoClient(config.MONGO_URI as string);
let dbConnection: Db;

export const connectToServer = async (callback: (err?: Error) => void) => {
	try {
		await client.connect();
		dbConnection = client.db("sample_mflix");
		logger.info("Connected to MongoDB");
		return callback();
	} catch (err) {
		logger.error(err);
	}
};

export const getDb = () => {
	return dbConnection;
};

export const closeConnection = async () => {
	await client.close();
	logger.info("Closed connection to MongoDB");
};
