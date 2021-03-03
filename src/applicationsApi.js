import express from 'express';
import AWS from 'aws-sdk';

export const getApplicationsRoute = () => {
	const table = 'applications';
	const applicationsRouter = express.Router();

	applicationsRouter.get('/', async (req, res) => {
		const applications = await req.app.locals.db
			.scan({
				ExpressionAttributeNames: {
					'#N': 'AlbumTitle',
				},
				ProjectionExpression: '#N',
				TableName: table,
			})
			.promise();
		res.send({
			applications: applications.Items,
		});
	});

	applicationsRouter.post('/', async (req, res) => {
		const response = await req.app.locals.db
			.putItem({
				TableName: table,
				Item: { Name: { S: req.body.name } },
				// ReturnValues: 'UPDATED_NEW',
			})
			.promise();
		console.log(response);

		res.send(201);
	});

	return applicationsRouter;
};
