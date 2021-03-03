require('dotenv').config();

import express from 'express';
import morgan from 'morgan';
import AWS from 'aws-sdk';
import bodyParser from 'body-parser';
import { getApplicationsRoute } from './applicationsApi';

AWS.config.update({
	region: process.env.AWS_REGION ?? 'us-east-1',
});

const db = new AWS.DynamoDB({
	endpoint: process.env.DB_ENDPOINT ?? 'http://localhost:8000',
});

const app = express();
const env = process.env.NODE_ENV || 'development';
const isDev = env !== 'production';

app.locals.db = db;
app.use(morgan(isDev ? 'dev' : 'tiny'));

app.use(bodyParser.json());

app.get('/', (req, resp) => {
	resp.send('Testing deployments');
});
app.get('/test', (req, resp) => {
	resp.send('test route');
});

app.get('/ping', async (req, res) => {
	const { db } = app.locals;
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

app.use('/applications', getApplicationsRoute());

app.use(function errorHandler(err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}
	res.status(500);
	res.render('error', { error: err });
});

export { app };
