/* * * * * */
/* GEOCODER */
/* * */
/* * */

/* * */
/* IMPORTS */
const fs = require('fs');
const Papa = require('papaparse');

const findPostalCodes = async () => {
  //

  //
  // 0. Get latest data from Intermodal

  console.log('• Parsing raw list...');

  const txtData = fs.readFileSync('postal_codes.csv', { encoding: 'utf8' });

  const rawPostalCodes = Papa.parse(txtData, { header: true });

  //
  // 1. Format the raw data from Intermodal

  const foundMatches = [];

  console.log('• Preparing ' + rawPostalCodes.data.length + ' postal codes...');
  console.log();

  for (const [index, postalCode] of rawPostalCodes.data.entries()) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Updating postal code ${postalCode.school_id} (${index}/${rawPostalCodes.data.length})`);
    //
    try {
      //

      const parsedPostalCode = postalCode.postal_code.split('-');

      const response = await fetch(`https://json.geoapi.pt/codigo_postal/${parsedPostalCode[0]}-${parsedPostalCode[1]}?json=1`);
      const responseData = await response.json();

      foundMatches.push({
        postal_code: postalCode.postal_code,
        address: postalCode.address,
        lat: responseData.centroide[0],
        lon: responseData.centroide[1],
      });

      //
    } catch (error) {
      console.log('Error', postalCode.postal_code, index, error);
    }
    await delay(250);
    //
  }

  //
  // 2. Save the formatted data into a JSON file

  console.log('• Saving data to CSV file.');

  // Use papaparse to produce the CSV string
  const csvData = Papa.unparse(foundMatches, { skipEmptyLines: 'greedy' });
  // Append the csv string to the file
  fs.writeFileSync(`postal_codes_coordinates.csv`, csvData);

  //

  console.log('• Done! Updated ' + foundMatches.length + ' postal codes.');
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
  /* */ await findPostalCodes();
  /* * * * * * * * * * * * */

  const syncDuration = new Date() - start;
  console.log('> Operation took ' + syncDuration / 1000 + ' seconds.');
  console.log('* * * * * * * * * * * * * * * * * * * * * * * * * *');
  console.log();
})();

function delay(miliseconds = 0) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}
