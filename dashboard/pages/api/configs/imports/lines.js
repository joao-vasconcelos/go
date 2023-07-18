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
  // Connect to mongodb

  try {
    //
    // Get info for all Lines from API v2
    const response = await fetch('https://api.carrismetropolitana.pt/lines');
    const allLinesApi = await response.json();

    for (const lineApi of allLinesApi) {
      //
      // Skip if not A2
      //   if (!lineApi.code.startsWith('2')) continue;

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
        transport_type: 3,
        typology: typologyDocument?._id || null,
        fare: fareDocument?._id || null,
        agency: agencyDocument?._id || null,
        routes: [],
      };
      const lineDocument = await LineModel.findOneAndUpdate({ code: parsedLine.code }, parsedLine, { new: true, upsert: true });

      console.log(`Saved Line ${lineDocument?.code} (agency: ${agencyDocument?.code}) (typology: ${typologyDocument?.code}) (fare: ${fareDocument?.code})`);

      //
    }
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
