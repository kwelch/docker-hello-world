import AWSMock from 'aws-sdk-mock';
import test from 'ava';
import supertest from 'supertest';
import { app } from './app';

test('GET /applications', async (t) => {
	AWSMock.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
		callback(null, { Item: { Name: 'create' } });
	});
	const response = await supertest(server)
		.get('/applications')
		.expect('Content-Type', /json/)
		.expect(200);

	t.deepEqual(response.body, { applications: [] });
	AWSMock.restore('DynamoDB.DocumentClient');
});

test('POST /applications', async (t) => {
	t.timeout(500);
	AWSMock.mock('DynamoDB', 'putItem', function (params, callback) {
		callback(null, { Item: { Key: 'create' } });
	});
	const response = await supertest(server)
		.post('/applications')
		.send({ name: 'create' })
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(201);

	console.log(response.body);

	// if it makes it this far it passed
	t.pass();
	AWSMock.restore('DynamoDB');
});

test('GET /ping', async (t) => {
	AWSMock.mock('DynamoDB', 'listTables', function (params, callback) {
		callback(null, { TableNames: ['applications'] });
	});
	const response = await supertest(server)
		.get('/ping')
		.expect('Content-Type', /json/)
		.expect(200);

	t.is(response.body.message, 'OK');
	t.deepEqual(response.body.db, {
		tables: ['applications'],
	});
	AWSMock.restore('DynamoDB');
});
