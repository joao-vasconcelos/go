import delay from '../../../services/delay';
import mongodb from '../../../services/mongodb';
import { Default as StopDefault } from '../../../schemas/Stop/default';
import { Validation as StopValidation } from '../../../schemas/Stop/validation';
import { Model as StopModel } from '../../../schemas/Stop/model';

/* * */
/* IMPORT STOPS */
/* Explanation needed. */
/* * */

export default async function importStops(req, res) {
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

  const response = await fetch('https://schedules.carrismetropolitana.pt/api/stops');
  const allStops = await response.json();

  for (const stop of allStops) {
    await StopModel.findOneAndUpdate(
      { code: stop.stop_id },
      {
        ...StopDefault,
        code: stop.stop_id,
        latitude: stop.stop_lat,
        longitude: stop.stop_lon,
        name: stop.stop_name,
      },
      { new: true, upsert: true }
    );
    console.log('Saved Stop ', stop.stop_id);
  }

  return await res.status(200).json({ message: 'Done import.' });
}
