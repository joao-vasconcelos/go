/* * */

import getSession from '@/authentication/getSession';
import { ReportOptions } from '@/schemas/Report/options';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import PCGIDB from '@/services/PCGIDB';
import { DateTime } from 'luxon';

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
    await prepareApiEndpoint({ request: req, method: 'POST', session: sessionData, permissions: [{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: ['revenue'] }] }] });
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
    startDateFormatted = DateTime.fromFormat(req.body.start_date, 'yyyyMMdd').startOf('day').set({ hour: 4, minute: 0, second: 0 }).toFormat("yyyy-MM-dd'T'HH:mm:ss");
    endDateFormatted = DateTime.fromFormat(req.body.end_date, 'yyyyMMdd').plus({ days: 1 }).startOf('day').set({ hour: 3, minute: 59, second: 59 }).toFormat("yyyy-MM-dd'T'HH:mm:ss");
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Error formatting date boundaries.' });
  }

  // 6.
  // Connect to PCGIDB

  try {
    await PCGIDB.connect();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Could not connect to PCGIDB.' });
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
      'transaction.productLongID': { $in: ReportOptions.apex_transaction_onboard_product_ids },
    },
  };

  const groupClause = {
    $group: {
      //
      _id: '$transaction.productLongID',
      //
      sales_qty: {
        $sum: {
          $cond: [{ $gte: ['$transaction.price', 0] }, 1, 0],
        },
      },
      cashbacks_qty: {
        $sum: {
          $cond: [{ $lt: ['$transaction.price', 0] }, 1, 0],
        },
      },
      transactions_qty: { $sum: 1 },
      //
      sales_euro: {
        $sum: {
          $cond: [{ $gte: ['$transaction.price', 0] }, '$transaction.price', 0],
        },
      },
      cashbacks_euro: {
        $sum: {
          $cond: [{ $lt: ['$transaction.price', 0] }, '$transaction.price', 0],
        },
      },
      transactions_euro: {
        $sum: '$transaction.price',
      },
      //
    },
  };

  const projectClause = {
    $project: {
      _id: 0,
      product_id: '$_id',
      sales_qty: 1,
      cashbacks_qty: 1,
      transactions_qty: 1,
      sales_euro: 1,
      cashbacks_euro: 1,
      transactions_euro: 1,
    },
  };

  // 8.
  // Perform database search

  try {
    console.log('Searching sales...');
    result = await PCGIDB.SalesEntity.aggregate([matchClauseNegative, groupClause, projectClause], { allowDiskUse: true, maxTimeMS: 90000 }).toArray();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: error.message || 'Cannot search for APEX Transactions.' });
  }

  // 9.
  // Perform database search

  try {
    res.send(result);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: error.message || 'Error sending response to client.' });
  }

  //
}
