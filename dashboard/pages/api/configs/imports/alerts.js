import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { AlertModel } from '@/schemas/Alert/model';
import { Model as MunicipalityModel } from '@/schemas/Municipality/model';
import { Model as LineModel } from '@/schemas/Line/model';
import { Model as StopModel } from '@/schemas/Stop/model';

/* * */
/* IMPORT ALERTS */
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

    // Fetch all Stops from API v2
    const allAlertsResponse = await fetch('https://www.carrismetropolitana.pt/?api=alerts');
    const allAlertsData = await allAlertsResponse.json();

    for (const entity of allAlertsData.entity) {
      //

      const alertData = entity.alert;

      //
      // MUNICIPALITIES
      const informedMunicipalityIds = new Set();
      const informedMunicipalityPrefixes = alertData.informed_entity.filter((item) => Object.keys(item)[0] === 'municipality_id');
      for (const municipalityEntity of informedMunicipalityPrefixes) {
        const municipalityDocument = await MunicipalityModel.findOne({ prefix: municipalityEntity.municipality_id });
        if (municipalityDocument) informedMunicipalityIds.add(municipalityDocument._id.toString());
      }

      //
      // LINES
      const informedLineIds = new Set();
      const informedRouteCodes = alertData.informed_entity.filter((item) => Object.keys(item)[0] === 'route_id');
      for (const routeEntity of informedRouteCodes) {
        const lineDocument = await LineModel.findOne({ code: routeEntity.route_id.substring(0, 4) });
        if (lineDocument) informedLineIds.add(lineDocument._id.toString());
      }

      //
      // STOPS
      const informedStopIds = new Set();
      const informedStopCodes = alertData.informed_entity.filter((item) => Object.keys(item)[0] === 'stop_id');
      for (const stopEntity of informedStopCodes) {
        const stopDocument = await StopModel.findOne({ code: stopEntity.stop_id });
        if (stopDocument) informedStopIds.add(stopDocument._id.toString());
      }

      // Format stop to match GO schema
      const formattedAlert = {
        // General
        code: entity.id,
        published: true,
        title: alertData.header_text[0].translation.text,
        active_period_start: alertData.active_period.start < 0 ? null : new Date(alertData.active_period.start * 1000),
        active_period_end: alertData.active_period.end < 0 ? null : new Date(alertData.active_period.end * 1000),
        municipalities: Array.from(informedMunicipalityIds),
        lines: Array.from(informedLineIds),
        stops: Array.from(informedStopIds),
        cause: alertData.cause,
        effect: alertData.effect,
        description: alertData.description_text[0].translation.text,
        images: [],
        url: alertData.url,
        created_by: undefined,
      };

      await AlertModel.findOneAndUpdate({ code: formattedAlert.code }, formattedAlert, { new: true, upsert: true });

      console.log(`Updated Alert ${formattedAlert.code}.`);
    }
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
