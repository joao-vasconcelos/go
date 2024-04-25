/* * */

const PCGIDB = require('./services/PCGIDB');
const SLAMANAGERDB = require('./services/SLAMANAGERDB');
const TIMETRACKER = require('./services/TIMETRACKER');
const { DateTime } = require('luxon');

/* * */

module.exports = async () => {
  //

  try {
    console.log();
    console.log('------------------------');
    console.log(new Date().toISOString());
    console.log('------------------------');
    console.log();

    const globalTimer = new TIMETRACKER();
    console.log('Starting...');

    // 1.
    // Connect to databases

    console.log();
    console.log('STEP 0.1: Connect to databases');

    await PCGIDB.connect();
    await SLAMANAGERDB.connect();

    // 2.
    // Await for a random amount of time to reduce chances of requesting the same trips as another worker

    const randomDelay = Math.floor(Math.random() * 5000); // 0 - 5 seconds
    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    // 3.
    // Fetch a fresh batch of trips

    const allTripsData = await SLAMANAGERDB.Trip.find({ status: 'waiting' }).limit(100).toArray();

    for (const [tripIndex, tripData] of allTripsData.entries()) {
      //

      const operationalDayStartMillis = DateTime.fromFormat(tripData.operational_day, 'yyyyMMdd').set({ hour: 4, minute: 0, second: 0 }).toMillis();
      const operationalDayEndMillis = DateTime.fromFormat(tripData.operational_day, 'yyyyMMdd').plus({ day: 1 }).set({ hour: 3, minute: 59, second: 59 }).toMillis();

      const tripEvents = await PCGIDB.VehicleEvents.find({ millis: { $gte: operationalDayStartMillis, $lte: operationalDayEndMillis }, 'content.entity.vehicle.trip.tripId': tripData.trip_id }).toArray();

      console.log(tripEvents);

      return;

      //
    }

    //

    console.log();
    console.log('- - - - - - - - - - - - - - - - - - - - -');
    console.log(`Run took ${globalTimer.get()}.`);
    console.log('- - - - - - - - - - - - - - - - - - - - -');
    console.log();

    process.exit(0);

    //
  } catch (err) {
    console.log('An error occurred. Halting execution.', err);
    console.log('Retrying in 10 seconds...');
    setTimeout(() => {
      process.exit(0); // End process
    }, 10000); // after 10 seconds
  }

  //
};
