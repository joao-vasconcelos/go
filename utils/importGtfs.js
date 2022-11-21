import { importGtfs } from 'gtfs';

export default async function importGTFSFromURL() {
  const config = {
    sqlitePath: '/var/lib/postgresql/data/tml_data',
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
}
