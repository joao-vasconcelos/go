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
