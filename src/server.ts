import { errorHandler } from "@utils";
import express, { Request, Response } from "express";
import helmet from "helmet";
import http from "http";
import routes from "./api";

const server = () => {
	const app = express();

	app.use((_: Request, res: Response, next) => {
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Credentials, Set-Cookie"
		);
		res.header("Access-Control-Allow-Credentials", "true");
		res.header(
			"Access-Control-Allow-Headers",
			"Content-Type, Accept, Access-Control-Allow-Credentials, Cross-Origin"
		);
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		next();
	});

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(helmet());

	// Routes
	app.use("/", routes);
	app.get("/health", (_, res) => res.status(200).send({ success: true }));
	app.get("*", (_, res) => res.status(404).send("Not Found"));
	app.use(errorHandler);

	const httpServer = http.createServer(app);

	return httpServer;
};

module.exports.app = server;
export default server;
