/* * * * * */
/* GOCONTROL */
/* * */

/* * */
/* IMPORTS */
const importStops = require('./operations/importStops');
const importLines = require('./operations/importLines');
const importRoutes = require('./operations/importRoutes');
const importPatterns = require('./operations/importPatterns');
const mongodb = require('./services/mongodb');

(async () => {
  console.log();
  console.log('-----------------------------------------');
  console.log(new Date().toISOString());
  console.log('-----------------------------------------');
  console.log();

  // Store start time for logging purposes
  const startTime = process.hrtime();

  console.log('Starting...');

  try {
    await mongodb.connect();
  } catch (error) {
    console.log(error);
  }

  try {
    //
    // Perform operations

    // console.log('Starting importing Stops...');
    // await importStops();

    // console.log('Starting importing Lines...');
    // await importLines();

    // console.log('Starting importing Routes...');
    // await importRoutes();

    console.log('Starting importing Patterns...');
    await importPatterns();

    // DONE
    //
  } catch (error) {
    console.log(error);
  }

  try {
    await mongodb.disconnect();
  } catch (error) {
    console.log(error);
  }

  console.log();
  console.log('- - - - - - - - - - - - - - - - - - - - -');
  console.log('Operations took ' + getDuration(startTime) / 1000 + ' seconds.');
  console.log('- - - - - - - - - - - - - - - - - - - - -');
  console.log();
})();

/* * */
/* Returns a time interval for a provided start time. */
const getDuration = (startTime) => {
  const interval = process.hrtime(startTime);
  return parseInt(
    // seconds -> miliseconds +
    interval[0] * 1000 +
      // + nanoseconds -> miliseconds
      interval[1] / 1000000
  );
};
