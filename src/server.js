require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const logger = require("loglevel");

logger.setDefaultLevel("info");
logger.setLevel(process.env.LOG_LEVEL || "info");

const app = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || "development";
const isDev = env !== "production";

app.use(morgan(isDev ? "dev" : "tiny"));

app.get("/", (req, resp) => {
	resp.send("Hey! This worked");
});

app.listen(port, () => {
	logger.info(`Server is up on http://localhost:${port}/`);
});
