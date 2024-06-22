/* * */

import 'dotenv/config';

import start from './start.js';

/* * */

const RUN_INTERVAL = 60000 * 60; // 60 minutes

/* * */

(async function init() {
	//

	const runOnInterval = async () => {
		await start();
		setTimeout(runOnInterval, RUN_INTERVAL);
	};

	runOnInterval();

	//
})();
