/* * */

import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import { AgencyModel } from '@/schemas/Agency/model';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { CalendarModel } from '@/schemas/Calendar/model';
import { DateModel } from '@/schemas/Date/model';

/* * */

export default async function handler(req, res) {
  //

  // 0.
  // Refuse request if not GET

  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 1.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'agencies', permission: 'view', req, res });
    await checkAuthentication({ scope: 'lines', permission: 'view', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 2.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 3.
  // Fetch all Dates and create a hashmap

  const allDates = await DateModel.find().lean();
  const allDatesMap = {};
  for (const dateData of allDates) {
    allDatesMap[dateData.date] = dateData;
  }

  // 3.
  // Setup variables

  let allAgencyLines = [];

  // 3.
  // Fetch lines for the requested agency

  try {
    allAgencyLines = await LineModel.find({ agency: { $eq: req.query._id } }, 'code short_name name routes').populate({
      path: 'routes',
      select: 'code name patterns',
      populate: {
        path: 'patterns',
        select: 'shape.extension schedules.start_time schedules.calendars_on schedules.calendars_off',
        populate: {
          path: 'schedules.calendars_on',
          select: 'dates',
        },
      },
    });
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch Lines for this Agency.' });
  }

  // 3.
  // Calculate vkm for the whole agency

  try {
    let totalVkm = 0;
    for (const lineData of allAgencyLines) {
      let lineVkm = 0;
      for (const routeData of lineData.routes) {
        for (const patternData of routeData.patterns) {
          for (const scheduleData of patternData.schedules) {
            for (const calendarData of scheduleData.calendars_on) {
              for (const dateData of calendarData.dates) {
                const date = allDatesMap[dateData];
                lineVkm += patternData.shape.extension;
              }
            }
          }
        }
      }
      totalVkm += lineVkm;
    }
    return await res.status(200).json({ totalVkm: totalVkm / 1000 });
  } catch (error) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot calculate V.Km for this Agency.' });
  }

  //
}
