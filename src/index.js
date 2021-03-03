import { app } from './app';
import { setupTables } from './setupTables';
import logger from 'loglevel';
logger.setDefaultLevel('info');
logger.setLevel(process.env.LOG_LEVEL || 'info');

const port = process.env.PORT || 3000;

app.listen(port, async () => {
	await setupTables(app.locals.db);
	logger.info(`Server is up on http://localhost:${port}/`);
});
