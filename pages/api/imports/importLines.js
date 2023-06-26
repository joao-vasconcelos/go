import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Default as LineDefault } from '../../../schemas/Line/default';
import { Validation as LineValidation } from '../../../schemas/Line/validation';
import { Model as LineModel } from '../../../schemas/Line/model';

/* * */
/* IMPORT STOPS */
/* Explanation needed. */
/* * */

export default async function importLines(req, res) {
  //
  await delay();

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1. Try to connect to mongodb
  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  const response = await fetch('https://schedules.carrismetropolitana.pt/api/routes/summary');
  const allLines = await response.json();

  for (const route of allLines) {
    let agencyId;
    if (route.route_id.startsWith('1')) agencyId = '644976034212abfd6e160d1a';
    else if (route.route_id.startsWith('2')) agencyId = '645d7ee04ef63aec14fbf1eb';
    else if (route.route_id.startsWith('3')) agencyId = '645d7f114ef63aec14fbf217';
    else if (route.route_id.startsWith('4')) agencyId = '645d7f204ef63aec14fbf22a';
    await LineModel.findOneAndUpdate(
      { code: route.route_short_name },
      {
        ...LineDefault,
        code: route.route_short_name,
        short_name: route.route_short_name,
        long_name: route.route_long_name,
        color: route.route_color,
        text_color: route.route_text_color,
        agency: agencyId,
      },
      { new: true, upsert: true }
    );
    console.log('Saved Line ', route.route_short_name);
  }

  return await res.status(200).json({ message: 'Done import.' });

  //
}
