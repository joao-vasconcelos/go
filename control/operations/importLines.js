const AgencyModel = require('../schemas/Agency');
const TypologyModel = require('../schemas/Typology');
const FareModel = require('../schemas/Fare');
const LineModel = require('../schemas/Line');

/* * */
/* IMPORT LINES */
/* Explanation needed. */
/* * */

module.exports = async function importLines() {
  //
  // Get info for all Lines from API v2
  const response = await fetch('https://schedules-test.carrismetropolitana.pt/api/lines');
  const allLinesApi = await response.json();

  for (const lineApi of allLinesApi) {
    //
    // Skip if not A1
    if (!lineApi.code.startsWith('2')) continue;

    // Find out the Agency
    const agencyCode = `4${lineApi.code.substring(0, 1)}`;
    const agencyDocument = await AgencyModel.findOne({ code: agencyCode });

    // Find out the Typology
    const typologyDocument = await TypologyModel.findOne({ color: lineApi.color });

    // Find out the Fare
    let fareCode;
    if (typologyDocument?.code === 'PROXIMA') fareCode = 'BORDO-1';
    else if (typologyDocument?.code === 'LONGA') fareCode = 'BORDO-2';
    else if (typologyDocument?.code === 'RAPIDA') fareCode = 'BORDO-3';
    else if (typologyDocument?.code === 'MAR') fareCode = 'BORDO-5';
    else if (typologyDocument?.code === 'INTER-REG' && agencyCode === '42') fareCode = 'BORDO-4-A';
    else if (typologyDocument?.code === 'INTER-REG' && agencyCode === '44') fareCode = 'BORDO-4-B';
    const fareDocument = await FareModel.findOne({ code: fareCode });

    // Format the Line

    const parsedLine = {
      code: lineApi.code,
      name: lineApi.long_name,
      short_name: lineApi.short_name,
      circular: lineApi.continuous || false,
      school: false,
      continuous: false,
      typology: typologyDocument?._id || null,
      fare: fareDocument?._id || null,
      agency: agencyDocument?._id || null,
      routes: [],
    };
    const lineDocument = await LineModel.findOneAndUpdate({ code: parsedLine.code }, parsedLine, { new: true, upsert: true });

    console.log(`Saved Line ${lineDocument?.code} (agency: ${agencyDocument?.code}) (typology: ${typologyDocument?.code}) (fare: ${fareDocument?.code})`);

    //
  }

  //
};
