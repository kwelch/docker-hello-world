const tables = {
	applications: {
		AttributeDefinitions: [
			{
				AttributeName: 'Name',
				AttributeType: 'S',
			},
		],
		KeySchema: [
			{
				AttributeName: 'Name',
				KeyType: 'HASH',
			},
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 5 /* required */,
			WriteCapacityUnits: 5 /* required */,
		},
	},
};

export const setupTables = async (db) => {
	const tableCreatePromises = [];
	const currentTables = (await db.listTables().promise()).TableNames;

	for (let [name, schema] of Object.entries(tables)) {
		if (!currentTables.includes(name)) {
			console.log(`creating table: ${name}`);
			tableCreatePromises.push(
				db.createTable({ ...schema, TableName: name }).promise()
			);
		}
	}

	return Promise.all(tableCreatePromises);
};
