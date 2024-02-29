/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import { DateModel } from '@/schemas/Date/model';

/* * */

export default async function handler(req, res) {
  //

  //   throw new Error('Feature is disabled.');

  // 1.
  // Setup variables

  let sessionData;

  // 2.
  // Get session data

  try {
    sessionData = await getSession(req, res);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'GET', session: sessionData, permissions: [{ scope: 'configs', action: 'admin' }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 5.
  // Connect to mongodb

  try {
    //

    try {
      await DateModel.syncIndexes();
    } catch (err) {
      console.log(err);
      return await res.status(500).json({ message: 'Cannot sync indexes.' });
    }

    // Fetch all Patterns from database
    const allDatesData = await DateModel.find();

    // For each pattern
    for (const dateData of allDatesData) {
      //

      dateData.period = new String(dateData.period);
      dateData.day_type = undefined;

      await DateModel.findOneAndReplace({ _id: dateData._id }, dateData);

      console.log(`Date ${dateData.date} updated.`);

      //
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');

  //
}
