import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { AgencyModel } from '@/schemas/Agency/model';
import { CalendarModel } from '@/schemas/Calendar/model';
import { FareModel } from '@/schemas/Fare/model';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { MunicipalityModel } from '@/schemas/Municipality/model';
import { ZoneModel } from '@/schemas/Zone/model';
import { TypologyModel } from '@/schemas/Typology/model';
import { StopModel } from '@/schemas/Stop/model';

/* * */
/* IMPORT PATTERNS */
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

    console.log('Starting Agencies...');
    const allAgencyIds = await AgencyModel.find({}, '_id');
    for (const agencyId of allAgencyIds) {
      await AgencyModel.findOneAndUpdate({ _id: agencyId._id }, { is_locked: false });
    }
    console.log('Agencies done.');

    console.log('Starting Calendars...');
    const allCalendarIds = await CalendarModel.find({}, '_id');
    for (const calendarId of allCalendarIds) {
      await CalendarModel.findOneAndUpdate({ _id: calendarId._id }, { is_locked: false });
    }
    console.log('Calendars done.');

    console.log('Starting Fares...');
    const allFareIds = await FareModel.find({}, '_id');
    for (const fareId of allFareIds) {
      await FareModel.findOneAndUpdate({ _id: fareId._id }, { is_locked: false });
    }
    console.log('Fares done.');

    console.log('Starting Lines...');
    const allLineIds = await LineModel.find({}, '_id');
    for (const lineId of allLineIds) {
      await LineModel.findOneAndUpdate({ _id: lineId._id }, { is_locked: false });
    }
    console.log('Lines done.');

    console.log('Starting Routes...');
    const allRouteIds = await RouteModel.find({}, '_id');
    for (const routeId of allRouteIds) {
      await RouteModel.findOneAndUpdate({ _id: routeId._id }, { is_locked: false });
    }
    console.log('Routes done.');

    console.log('Starting Patterns...');
    const allPatternIds = await PatternModel.find({}, '_id');
    for (const patternId of allPatternIds) {
      await PatternModel.findOneAndUpdate({ _id: patternId._id }, { is_locked: false });
    }
    console.log('Patterns done.');

    console.log('Starting Municipalities...');
    const allMunicipalityIds = await MunicipalityModel.find({}, '_id');
    for (const municipalityId of allMunicipalityIds) {
      await MunicipalityModel.findOneAndUpdate({ _id: municipalityId._id }, { is_locked: false });
    }
    console.log('Municipalities done.');

    console.log('Starting Zones...');
    const allZoneIds = await ZoneModel.find({}, '_id');
    for (const zoneId of allZoneIds) {
      await ZoneModel.findOneAndUpdate({ _id: zoneId._id }, { is_locked: false });
    }
    console.log('Zones done.');

    console.log('Starting Typologies...');
    const allTypologyIds = await TypologyModel.find({}, '_id');
    for (const typologyId of allTypologyIds) {
      await TypologyModel.findOneAndUpdate({ _id: typologyId._id }, { is_locked: false });
    }
    console.log('Typologies done.');

    console.log('Starting Stops...');
    const allStopIds = await StopModel.find({}, '_id');
    for (const stopId of allStopIds) {
      await StopModel.findOneAndUpdate({ _id: stopId._id }, { is_locked: false });
    }
    console.log('Stops done.');

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Import Error' });
  }

  console.log('Done. Sending response to client...');
  return await res.status(200).json('Import complete.');
}
