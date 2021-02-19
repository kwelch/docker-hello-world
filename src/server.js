require("dotenv").config();

import express from "express";
import morgan from "morgan";
import logger from "loglevel";

logger.setDefaultLevel("info");
logger.setLevel(process.env.LOG_LEVEL || "info");

const app = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || "development";
const isDev = env !== "production";

app.use(morgan(isDev ? "dev" : "tiny"));

app.get("/", (req, resp) => {
	resp.send("Hello from a compiled node world");
});

app.get("/ping", async (req, res) => {
	const healthcheck = {
		uptime: process.uptime(),
		message: "OK",
		timestamp: Date.now(),
	};
	try {
		res.send(healthcheck);
	} catch (e) {
		healthcheck.message = e.message;
		res.status(503).send(healthcheck);
	}
});

app.listen(port, () => {
	logger.info(`Server is up on http://localhost:${port}/`);
});
