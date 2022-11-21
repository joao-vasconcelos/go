import { importGtfs } from 'gtfs';

const config = {
  sqlitePath: '/dev/sqlite/gtfs',
  agencies: [
    {
      url: 'http://countyconnection.com/GTFS/google_transit.zip',
      exclude: ['shapes'],
    },
  ],
};

try {
  await importGtfs(config);
} catch (error) {
  console.error(error);
}
