/* * */

import LOGGER from '@helperkits/logger';
import pg from 'pg';

/* * */

const client = new pg.Client({
	connectionTimeoutMillis: 10000,
	database: 'networkdbuser',
	host: 'slamanagerdb-bridge',
	password: 'networkdbpassword',
	user: 'networkdbuser',
});

async function connect() {
	await client.connect();
	await client.query(`CREATE TABLE municipalities (
			municipality_prefix VARCHAR(2),
			municipality_id VARCHAR(4),
			municipality_name VARCHAR(255),
			district_id VARCHAR(255),
			district_name VARCHAR(255),
			region_id VARCHAR(255),
			region_name VARCHAR(255)
		);`);
	LOGGER.success('Connected to NETWORKDB');
}

async function disconnect() {
	await client.end();
	LOGGER.success('Disconnected from NETWORKDB');
}

/* * */

const networkdb = {
	client,
	connect,
	disconnect,
};

/* * */

export default networkdb;
