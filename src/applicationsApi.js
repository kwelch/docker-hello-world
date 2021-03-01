import express from 'express';

export const getApplicationsRoute = ({ db }) => {
	const applicationsRouter = express.Router();

	applicationsRouter.get('/', (req, res) => {
		res.send({
			applications: [],
		});
	});

	return applicationsRouter;
};
