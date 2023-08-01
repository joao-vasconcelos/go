/* * * * * */
/* MAKE TTS STOP NAMES */
/* * */
/* * */

/* * */
/* IMPORTS */
const fs = require('fs');
const Papa = require('papaparse');

const formatStops = async () => {
  //

  //
  // 0. Get latest data from Intermodal

  console.log('• Parsing afetacao...');

  const txtData = fs.readFileSync('afetacao_a3.txt', { encoding: 'utf8' });

  const originalAfetacao = Papa.parse(txtData, { header: true });

  let parsedAfetacao = [];
  for (const afetacaoLine of originalAfetacao.data) {
    const originalZones = afetacaoLine.zones.split('-');

    const parsedZones = originalZones.map((z) => {
      if (z === '0') return 'AML';
      if (z === 'Complemento IR') return 'COMP-IR';
      return z.trim().toUpperCase();
    });

    if (!parsedZones.includes('AML')) parsedZones.push('AML');

    const numberOfZerosToAdd = 6 - afetacaoLine.stop_id.length;
    const zeros = '0'.repeat(numberOfZerosToAdd);
    const parsedStopId = zeros + afetacaoLine.stop_id;

    const parsedAfetacaoLine = {
      pattern_id: afetacaoLine.pattern_id,
      stop_sequence: afetacaoLine.stop_sequence,
      stop_id: parsedStopId,
      zones: parsedZones,
    };

    parsedAfetacao.push(parsedAfetacaoLine);
  }

  const transformedData = {};

  parsedAfetacao.forEach((item) => {
    const parsed = {
      stop_sequence: item.stop_sequence,
      stop_id: item.stop_id,
      zones: item.zones,
    };
    if (!transformedData[item.pattern_id]) transformedData[item.pattern_id] = [parsed];
    else transformedData[item.pattern_id].push(parsed);
  });

  const jsonString = JSON.stringify(transformedData);

  // Append the csv string to the file
  fs.writeFileSync(`afetacao_a3_parsed.json`, jsonString);

  //

  console.log('• Done! Updated ' + parsedAfetacao.length + ' stops.');
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
  /* */ await formatStops();
  /* * * * * * * * * * * * */

  const syncDuration = new Date() - start;
  console.log('> Operation took ' + syncDuration / 1000 + ' seconds.');
  console.log('* * * * * * * * * * * * * * * * * * * * * * * * * *');
  console.log();
})();
