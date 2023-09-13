/* * * * * */
/* MAKE TTS STOP NAMES */
/* * */
/* * */

/* * */
/* IMPORTS */
const fs = require('fs');
const Papa = require('papaparse');
const { Client } = require('@googlemaps/google-maps-services-js');
require('dotenv').config();
const { GOOGLE_API_KEY } = process.env;

const formatSchools = async () => {
  //

  //
  // 0. Get latest data from Intermodal

  console.log('• Parsing latest schools...');

  const txtData = fs.readFileSync('schools_torres_vedras.csv', { encoding: 'utf8' });

  const rawSchoolsData = Papa.parse(txtData, { header: true });

  //
  // 1. Format the raw data from Intermodal

  const updatedSchools = [];

  console.log('• Preparing ' + rawSchoolsData.data.length + ' schools...');
  console.log();

  for (const [index, school] of rawSchoolsData.data.entries()) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Updating school ${school.school_id} (${index}/${rawSchoolsData.data.length})`);
    //
    try {
      //

      //   const geocoderQuery = `${school.school_name}, ${school.address}, ${school.postal_code}, ${school.locality}, Portugal`;
      const geocoderQuery = `${school.school_name}, ${school.address}, ${school.municipality_dgeec}, Portugal`;
      //   const geocoderQuery = `School at ${school.address}, ${school.postal_code} ${school.municipality_dgeec}, Portugal`;

      const client = new Client({});
      const response = await client.findPlaceFromText({
        params: {
          input: geocoderQuery,
          inputtype: 'textquery',
          language: 'pt',
          fields: ['geometry', 'place_id'],
          key: GOOGLE_API_KEY,
        },
        timeout: 1000, // milliseconds
      });
      //
      updatedSchools.push({
        school_id: school.school_id,
        school_name: school.school_name,
        coordinates_lat: response.data.candidates[0].geometry.location.lat,
        coordinates_lon: response.data.candidates[0].geometry.location.lng,
      });
      console.log('Success', school.school_id, school.school_name, response.data.candidates[0].geometry.location.lat, response.data.candidates[0].geometry.location.lng);
    } catch (error) {
      //   console.log(error);
      console.log('Error', school.school_id, school.school_name, error);
    }
    await delay(250);
    //
  }

  //
  // 2. Save the formatted data into a JSON file

  console.log('• Saving data to CSV file.');

  // Use papaparse to produce the CSV string
  const csvData = Papa.unparse(updatedSchools, { skipEmptyLines: 'greedy' });
  // Append the csv string to the file
  fs.writeFileSync(`schools_result.csv`, csvData);

  //

  console.log('• Done! Updated ' + updatedSchools.length + ' schools.');
};

/* * *
 * ONE TIME EXECUTION
 */
(async () => {
  console.log();
  console.log('* * * * * * * * * * * * * * * * * * * * * * * * * *');
  console.log('> PARSER');
  const start = new Date();
  console.log('> Parsing started on ' + start.toISOString());

  /* * * * * * * * * * * * */
  /* */ await formatSchools();
  /* * * * * * * * * * * * */

  const syncDuration = new Date() - start;
  console.log('> Operation took ' + syncDuration / 1000 + ' seconds.');
  console.log('* * * * * * * * * * * * * * * * * * * * * * * * * *');
  console.log();
})();

function delay(miliseconds = 0) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}
