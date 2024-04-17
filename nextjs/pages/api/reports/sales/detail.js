/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import REALTIMEDB from '@/services/REALTIMEDB';
import JSONStream from 'JSONStream';
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
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not get Session data. Are you logged in?' });
  }

  // 3.
  // Prepare endpoint

  try {
    await prepareApiEndpoint({ request: req, method: 'POST', session: sessionData, permissions: [{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['sales'] }] }] });
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: err.message || 'Could not prepare endpoint.' });
  }

  // 4.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 5.
  // Prepare datetime variables

  let startDateFormatted;
  let endDateFormatted;

  try {
    startDateFormatted = DateTime.fromFormat(req.body.start_date, 'yyyyMMdd').setZone('Europe/Lisbon').startOf('day').set({ hour: 4, minute: 0 }).toFormat("yyyy-MM-dd'T'HH:MM:ss");
    endDateFormatted = DateTime.fromFormat(req.body.end_date, 'yyyyMMdd').setZone('Europe/Lisbon').plus({ days: 1 }).startOf('day').set({ hour: 3, minute: 59 }).toFormat("yyyy-MM-dd'T'HH:MM:ss");
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Error formatting date boundaries.' });
  }

  // 6.
  // Connect to REALTIMEDB

  try {
    await REALTIMEDB.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not connect to REALTIMEDB.' });
  }

  // 7.
  // Prepare aggregation pipeline

  const matchClauseNegative = {
    $match: {
      'transaction.transactionDate': {
        $gte: startDateFormatted,
        $lte: endDateFormatted,
      },
    },
  };

  const groupClause = {
    $group: {
      _id: null,
      countNegative: {
        $sum: {
          $cond: [{ $lt: ['$transaction.price', 0] }, 1, 0],
        },
      },
      countNull: {
        $sum: {
          $cond: [{ $eq: ['$transaction.price', 0] }, 1, 0],
        },
      },
      countPositive: {
        $sum: {
          $cond: [{ $gt: ['$transaction.price', 0] }, 1, 0],
        },
      },
    },
  };

  const projectClause = {
    $project: {
      _id: 0,
      countNegative: 1,
      countNull: 1,
      countPositive: 1,
    },
  };

  // 8.
  // Perform database search

  try {
    console.log('Searching sales...');
    const result = await REALTIMEDB.SalesEntity.aggregate([matchClauseNegative, groupClause, projectClause], { allowDiskUse: true, maxTimeMS: 90000 }).toArray();
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: err.message || 'Cannot list VehicleEvents.' });
  }

  //
}
