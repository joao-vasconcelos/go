/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import REALTIMEDB from '@/services/REALTIMEDB';
import { DateTime } from 'luxon';

/* * */

export const config = { api: { responseLimit: false } };

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;

  // 2.
  // Get session data

  try {
    sessionData = await getSession(req, res);
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'POST', session: sessionData, permissions: [{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['sales'] }] }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 5.
  // Prepare datetime variables

  let startDateFormatted;
  let endDateFormatted;

  try {
    startDateFormatted = DateTime.fromFormat(req.body.start_date, 'yyyyMMdd').setZone('Europe/Lisbon').startOf('day').set({ hour: 4, minute: 0 }).toFormat("yyyy-MM-dd'T'HH:MM:ss");
    endDateFormatted = DateTime.fromFormat(req.body.end_date, 'yyyyMMdd').setZone('Europe/Lisbon').plus({ days: 1 }).startOf('day').set({ hour: 3, minute: 59 }).toFormat("yyyy-MM-dd'T'HH:MM:ss");
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Error formatting date boundaries.' });
  }

  // 6.
  // Connect to REALTIMEDB

  try {
    await REALTIMEDB.connect();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Could not connect to REALTIMEDB.' });
  }

  // 7.
  // Prepare aggregation pipeline

  let result;

  const matchClauseNegative = {
    $match: {
      'transaction.transactionDate': {
        $gte: startDateFormatted,
        $lte: endDateFormatted,
      },
      'transaction.operatorLongID': { $eq: req.body.agency_code },
      'transaction.productLongID': 'id-prod-zapping',
    },
  };

  const groupClause = {
    $group: {
      _id: null,
      qty: {
        $count: {},
        // $sum: {
        //   $cond: [{ $gte: ['$transaction.price', 0] }, 1, 0],
        // },
      },
      euro: {
        $sum: '$transaction.price',
        // $sum: {
        //   $cond: [{ $gte: ['$transaction.price', 0] }, '$transaction.price', 0],
        // },
      },
    },
  };

  const projectClause = {
    $project: {
      _id: 0,
      qty: 1,
      euro: 1,
    },
  };

  // 8.
  // Perform database search

  try {
    console.log('Searching sales...');
    result = await REALTIMEDB.SalesEntity.aggregate([matchClauseNegative, groupClause, projectClause], { allowDiskUse: true, maxTimeMS: 90000 }).toArray();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: error.message || 'Cannot search for APEX Transactions.' });
  }

  // 9.
  // Perform database search

  try {
    if (result.length > 0) res.send(result[0]);
    else res.send({});
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: error.message || 'Error sending response to client.' });
  }

  //
}
