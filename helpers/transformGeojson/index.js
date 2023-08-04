/* * * * * */
/* MAKE TTS STOP NAMES */
/* * */
/* * */

/* * */
/* IMPORTS */
const fs = require('fs');
const turf = require('@turf/turf');

const formatFeatures = async () => {
  //

  //
  // 0. Get latest data from Intermodal

  console.log('• Parsing features...');

  const jsonData = fs.readFileSync('aml.json', { encoding: 'utf8' });

  const geojsonData = JSON.parse(jsonData);

  let unionResult = geojsonData.features.pop();
  for (const feature of geojsonData.features) {
    //
    unionResult = turf.union(unionResult, feature);
    //
  }

  // Append the csv string to the file
  fs.writeFileSync(`unitedAml.json`, JSON.stringify(unionResult));

  //

  console.log('• Done!');
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
  /* */ await formatFeatures();
  /* * * * * * * * * * * * */

  const syncDuration = new Date() - start;
  console.log('> Operation took ' + syncDuration / 1000 + ' seconds.');
  console.log('* * * * * * * * * * * * * * * * * * * * * * * * * *');
  console.log();
})();
