/* * */

import 'dotenv/config';

import { RUN_INTERVAL } from './config/settings';
import start from './start';

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
