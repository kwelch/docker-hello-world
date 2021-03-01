require('dotenv').config();

import express from 'express';
import morgan from 'morgan';
import logger from 'loglevel';
import AWS from 'aws-sdk';
import { setupTables } from './setupTables';
import { getApplicationsRoute } from './applicationsApi';

AWS.config.update({
	region: process.env.AWS_REGION ?? 'us-east-1',
});

const db = new AWS.DynamoDB({
	endpoint: process.env.DB_ENDPOINT ?? 'http://localhost:8000',
});

logger.setDefaultLevel('info');
logger.setLevel(process.env.LOG_LEVEL || 'info');

const app = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const isDev = env !== 'production';

app.use(morgan(isDev ? 'dev' : 'tiny'));

app.get('/', (req, resp) => {
	resp.send('Testing deployments');
});
app.get('/test', (req, resp) => {
	resp.send('test route');
});

app.get('/ping', async (req, res) => {
	const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now(),
	};
	try {
		const tablesResponse = await db.listTables().promise();
		healthcheck.db = {
			tables: tablesResponse.TableNames,
		};
		res.send(healthcheck);
	} catch (e) {
		console.log('Error on healthcheck', e.message);
		healthcheck.message = e.message;
		res.status(503).send(healthcheck);
	}
});

app.use('/applications', getApplicationsRoute(db));

app.listen(port, async () => {
	await setupTables(db);
	logger.info(`Server is up on http://localhost:${port}/`);
});
