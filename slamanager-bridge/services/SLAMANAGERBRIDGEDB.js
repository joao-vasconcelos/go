/* * */

import LOGGER from '@helperkits/logger';
import pg from 'pg';

/* * */

const client = new pg.Client({
	connectionTimeoutMillis: 10000,
	database: process.env.SLAMANAGERBRIDGEDB_DB,
	host: process.env.SLAMANAGERBRIDGEDB_HOST,
	password: process.env.SLAMANAGERBRIDGEDB_PASSWORD,
	user: process.env.SLAMANAGERBRIDGEDB_USER,
});

async function connect() {
	console.log('------');
	console.log(process.env.SLAMANAGERBRIDGEDB_DB);
	console.log(process.env.SLAMANAGERBRIDGEDB_HOST);
	console.log(process.env.SLAMANAGERBRIDGEDB_USER);
	console.log(process.env.SLAMANAGERBRIDGEDB_PASSWORD);
	console.log('------');
	await client.connect();
	LOGGER.success('Connected to SLAMANAGERBRIDGEDB');
}

async function disconnect() {
	await client.end();
	LOGGER.success('Disconnected from SLAMANAGERBRIDGEDB');
}

/* * */

const networkdb = {
	client,
	connect,
	disconnect,
};

/* * */

export default networkdb;
