import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { AgencyModel } from '@/schemas/Agency/model';
import { Model as TypologyModel } from '@/schemas/Typology/model';
import { Model as FareModel } from '@/schemas/Fare/model';
import { Model as LineModel } from '@/schemas/Line/model';

/* * */
/* IMPORT LINES */
/* Explanation needed. */
/* * */

export default async function handler(req, res) {
  //
  await delay();

  throw new Error('Feature is disabled.');

  // 0.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'configs', permission: 'admin', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 4.
  // Connect to mongodb

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Ensure latest schema modifications are applied in the database.

  try {
    await LineModel.syncIndexes();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot sync indexes.' });
  }

  // 6.
  // Update lines

  try {
    //

    // 6.1.
    // Retrieve all Lines from API v2
    const allLinesRes = await fetch('https://api.carrismetropolitana.pt/lines');
    const allLinesApi = await allLinesRes.json();

    // 6.2.
    // Iterate through each available line
    for (const lineApi of allLinesApi) {
      //

      // 6.2.0.
      // Skip if this line is for A4
      if (lineApi.code.startsWith('4')) continue;

      // 6.2.1.
      // Find out to which Agency this line belongs to
      const agencyCode = `4${lineApi.code.substring(0, 1)}`;
      const agencyDocument = await AgencyModel.findOne({ code: agencyCode });

      // 6.2.2.
      // Find out the Typology for this line
      const typologyDocument = await TypologyModel.findOne({ color: lineApi.color });

      // 6.2.3.
      // Find out the Fare for this line
      let fareCode;
      if (typologyDocument?.code === 'PROXIMA') fareCode = 'BORDO-1';
      else if (typologyDocument?.code === 'LONGA') fareCode = 'BORDO-2';
      else if (typologyDocument?.code === 'RAPIDA') fareCode = 'BORDO-3';
      else if (typologyDocument?.code === 'MAR') fareCode = 'BORDO-5';
      else if (typologyDocument?.code === 'INTER-REG' && agencyCode === '42') fareCode = 'BORDO-4-A';
      else if (typologyDocument?.code === 'INTER-REG' && agencyCode === '44') fareCode = 'BORDO-4-B';
      const fareDocument = await FareModel.findOne({ code: fareCode });

      // 6.2.4.
      // Format line to match GO schema
      const parsedLine = {
        code: lineApi.code,
        name: lineApi.long_name,
        short_name: lineApi.short_name,
        circular: lineApi.continuous || false,
        school: false,
        continuous: false,
        transport_type: 3,
        typology: typologyDocument?._id || null,
        fare: fareDocument?._id || null,
        agency: agencyDocument?._id || null,
        routes: [],
      };

      // 6.2.5.
      // Update the line
      const lineDocument = await LineModel.findOneAndUpdate({ code: parsedLine.code }, parsedLine, { new: true, upsert: true });

      // 6.2.6.
      // Log progress
      console.log(`⤷ Updated Line ${lineDocument?.code} (agency: ${agencyDocument?.code}) (typology: ${typologyDocument?.code}) (fare: ${fareDocument?.code})`);

      //
    }

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  // 7.
  // Log progress
  console.log('⤷ Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
