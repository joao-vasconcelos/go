/* * */

require('dotenv').config();
const start = require('./start');
const { RUN_INTERVAL } = require('./config/settings');

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
