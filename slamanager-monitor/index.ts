/* * */

import 'dotenv/config';

import start from './start.js';

/* * */

const RUN_INTERVAL = 10000; // 10 seconds

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
