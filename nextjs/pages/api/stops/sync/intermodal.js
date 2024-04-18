/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { StopModel } from '@/schemas/Stop/model';

/* * */

export default async function handler(req, res) {
  //

  throw new Error('Feature is disabled.');

  // 1.
  // Setup variables

  let sessionData;

  // 2.
  // Get session data

  try {
    sessionData = await getSession(req, res);
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Update stops

  try {
    //

    // 4.1.
    // Retrieve all stops from Intermodal

    const allIntermodalStopsRes = await fetch('https://api.intermodal.pt/v1/regions/1/stops/full');
    const allIntermodalStopsData = await allIntermodalStopsRes.json();

    // 4.2.
    // Build a hash map of the Municipalities array

    for (const intermodalStopData of allIntermodalStopsData) {
      //

      // 4.2.1.
      // Get the stop info for the operator 1 (Carris Metropolitana)

      const intermodalStopDataOperatorInfo = intermodalStopData.operators.find((item) => item.operator_id === 1);
      if (!intermodalStopDataOperatorInfo) continue;

      // 4.2.2.
      // Check if the stop is from the desired municipality
      // *** Uncomment the municipalities you want to synchronize

      const enabledMunicipalities = [
        // '01', // ALCOCHETE
        // '02', // ALMADA
        // '03', // AMADORA
        // '04', // BARREIRO
        // '05', // CASCAIS
        // '06', // LISBOA
        // '07', // LOURES
        // '08', // MAFRA
        // '09', // MOITA
        // '10', // MONTIJO
        // '11', // ODIVELAS
        // '12', // OEIRAS
        // '13', // PALMELA
        // '14', // SEIXAL
        // '15', // SESIMBRA
        // '16', // SETÚBAL
        // '17', // SINTRA
        // '18', // VILA FRANCA DE XIRA
        // '19', // OUT AML (MARGEM SUL)
        // '20', // OUT AML (MARGEM NORTE)
      ];

      if (!enabledMunicipalities.includes(intermodalStopDataOperatorInfo.stop_ref.substring(0, 2))) continue;

      // 4.2.3.
      // Get this stop from the databse and update its location

      const stopData = await StopModel.findOne({ code: intermodalStopDataOperatorInfo.stop_ref });
      if (!stopData) continue;

      // 4.2.4.
      // Update attributes of stop with data from Intermodal API

      stopData.latitude = intermodalStopData.lat;
      stopData.longitude = intermodalStopData.lon;

      // 4.2.5.
      // Save the stop

      await stopData.save();

      console.log(`Synced stop "${stopData.code}"`);

      //
    }

    //
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Error importing data from Intermodal' });
  }

  // 5.
  // Send response

  console.log('⤷ Done. Sending response to client...');
  return await res.status(200).json('Import complete.');

  //
}
