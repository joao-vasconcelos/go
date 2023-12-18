/* * */

import delay from '@/services/delay';
import checkAuthentication from '@/services/checkAuthentication';
import mongodb from '@/services/mongodb';
import parseDate from '@/services/parseDate';
import { AgencyModel } from '@/schemas/Agency/model';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { CalendarModel } from '@/schemas/Calendar/model';
import { DateModel } from '@/schemas/Date/model';
import calculateDateDayType from '@/services/calculateDateDayType';
import { DateTime } from 'luxon';

/* * */

export default async function handler(req, res) {
  //

  // 0.
  // Setup variables

  let parsedData;
  let agencyData;
  let allDatesMap = {};
  let allLinesData = [];

  // 1.
  // Refuse request if not POST

  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
  }

  // 2.
  // Check for correct Authentication and valid Permissions

  try {
    await checkAuthentication({ scope: 'agencies', permission: 'view', req, res });
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err.message || 'Could not verify Authentication.' });
  }

  // 3.
  // Parse request body into JSON

  try {
    parsedData = await JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 4.
  // Connect to MongoDB

  try {
    await mongodb.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'MongoDB connection error.' });
  }

  // 5.
  // Fetch all Dates and create a hashmap

  try {
    const allDates = await DateModel.find().lean();
    for (const dateData of allDates) {
      allDatesMap[dateData.date] = dateData;
    }
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not fetch all Dates.' });
  }

  // 5.
  // Fetch all Dates and create a hashmap

  try {
    agencyData = await AgencyModel.findOne({ _id: { $eq: req.query._id } }).lean();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Could not fetch Agency.' });
  }

  // 6.
  // Fetch lines for the requested agency

  try {
    allLinesData = await LineModel.find({ agency: { $eq: req.query._id } }, 'routes')
      .populate({
        path: 'routes',
        select: 'patterns',
        populate: {
          path: 'patterns',
          select: 'shape.extension schedules.calendars_on schedules.calendars_off',
          populate: {
            path: 'schedules.calendars_on',
            select: 'dates',
          },
        },
      })
      .lean();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch Lines for this Agency.' });
  }

  // 7.
  // Calculate vkm for the whole agency

  try {
    //

    // 7.1.
    // Prepare the result variables

    let startDateString;
    let endDateString;

    let vehicleDistanceInMetersTotal = 0;

    let vehicleDistanceInMetersForPeriodOne = 0;
    let vehicleDistanceInMetersForPeriodTwo = 0;
    let vehicleDistanceInMetersForPeriodThree = 0;

    let vehicleDistanceInMetersForDayTypeOne = 0;
    let vehicleDistanceInMetersForDayTypeTwo = 0;
    let vehicleDistanceInMetersForDayTypeThree = 0;

    let vehicleDistanceInMetersForPeriodOneAndDayTypeOne = 0;
    let vehicleDistanceInMetersForPeriodOneAndDayTypeTwo = 0;
    let vehicleDistanceInMetersForPeriodOneAndDayTypeThree = 0;

    let vehicleDistanceInMetersForPeriodTwoAndDayTypeOne = 0;
    let vehicleDistanceInMetersForPeriodTwoAndDayTypeTwo = 0;
    let vehicleDistanceInMetersForPeriodTwoAndDayTypeThree = 0;

    let vehicleDistanceInMetersForPeriodThreeAndDayTypeOne = 0;
    let vehicleDistanceInMetersForPeriodThreeAndDayTypeTwo = 0;
    let vehicleDistanceInMetersForPeriodThreeAndDayTypeThree = 0;

    // 7.2.
    // Parse the dates into YYYYMMDD strings

    startDateString = parseDate(new Date(parsedData.start_date));

    // Parse the end date into YYYYMMDD strings
    if (parsedData.calculation_method === 'fixed_range') endDateString = parseDate(new Date(parsedData.end_date));
    // Add one year to the start date to get the end date
    else if (parsedData.calculation_method === 'rolling_year') endDateString = DateTime.fromFormat(startDateString, 'yyyyMMdd').plus({ years: 1 }).toFormat('yyyyMMdd');
    // Throw error if calculation method is not supported
    else throw new Error('Calculation method not supported.');

    // 7.3.
    // Iterate on all objects to get the total distance ran,
    // in meters, for the desired period

    lineLoop: for (const lineData of allLinesData) {
      routeLoop: for (const routeData of lineData.routes) {
        patternLoop: for (const patternData of routeData.patterns) {
          scheduleLoop: for (const scheduleData of patternData.schedules) {
            calendarOnLopp: for (const calendarOnData of scheduleData.calendars_on) {
              dateLoop: for (const dateOn of calendarOnData.dates) {
                // Get the date attributes from the hashmap
                const dateData = allDatesMap[dateOn];
                // Skip if the date does not exist
                if (!dateData) throw new Error(`Date "${dateOn}" does not exist in GO.`);
                // Check if the date is within the desired period
                if (Number(dateData.date) < Number(startDateString)) continue;
                if (Number(dateData.date) > Number(endDateString)) continue;
                // Check if the date should be removed by any calendars_off
                calendarOffLoop: for (const calendarOffData of scheduleData.calendars_off) {
                  if (calendarOffData.dates?.includes(dateOn)) continue dateLoop;
                }
                // If the date should be considered, then add the pattern extension to the total variable
                vehicleDistanceInMetersTotal += patternData.shape.extension;
                // Based on the period this date belongs to, add the pattern extension to the relevant variable
                if (dateData.period === 1) vehicleDistanceInMetersForPeriodOne += patternData.shape.extension;
                if (dateData.period === 2) vehicleDistanceInMetersForPeriodTwo += patternData.shape.extension;
                if (dateData.period === 3) vehicleDistanceInMetersForPeriodThree += patternData.shape.extension;
                // Calulate day type for the current date
                const dayType = calculateDateDayType(dateData.date, dateData.is_holiday);
                // Based on the day_type this date belongs to, add the pattern extension to the relevant variable
                if (dayType === 1) vehicleDistanceInMetersForDayTypeOne += patternData.shape.extension;
                if (dayType === 2) vehicleDistanceInMetersForDayTypeTwo += patternData.shape.extension;
                if (dayType === 3) vehicleDistanceInMetersForDayTypeThree += patternData.shape.extension;
                // Set the relevant variables for the combination of period = 1 and day type
                if (dateData.period === 1 && dayType === 1) vehicleDistanceInMetersForPeriodOneAndDayTypeOne += patternData.shape.extension;
                if (dateData.period === 1 && dayType === 2) vehicleDistanceInMetersForPeriodOneAndDayTypeTwo += patternData.shape.extension;
                if (dateData.period === 1 && dayType === 3) vehicleDistanceInMetersForPeriodOneAndDayTypeThree += patternData.shape.extension;
                // Set the relevant variables for the combination of period = 2 and day type
                if (dateData.period === 2 && dayType === 1) vehicleDistanceInMetersForPeriodTwoAndDayTypeOne += patternData.shape.extension;
                if (dateData.period === 2 && dayType === 2) vehicleDistanceInMetersForPeriodTwoAndDayTypeTwo += patternData.shape.extension;
                if (dateData.period === 2 && dayType === 3) vehicleDistanceInMetersForPeriodTwoAndDayTypeThree += patternData.shape.extension;
                // Set the relevant variables for the combination of period = 3 and day type
                if (dateData.period === 3 && dayType === 1) vehicleDistanceInMetersForPeriodThreeAndDayTypeOne += patternData.shape.extension;
                if (dateData.period === 3 && dayType === 2) vehicleDistanceInMetersForPeriodThreeAndDayTypeTwo += patternData.shape.extension;
                if (dateData.period === 3 && dayType === 3) vehicleDistanceInMetersForPeriodThreeAndDayTypeThree += patternData.shape.extension;
              }
            }
          }
        }
      }
    }

    // 7.5.
    // Return the result

    const vehicleDistanceInKilometersTotal = vehicleDistanceInMetersTotal / 1000;

    return await res.status(200).json({
      //
      inputs: {
        calculation_method: parsedData.calculation_method,
        start_date: startDateString,
        end_date: endDateString,
        price_per_km: agencyData.price_per_km,
        total_vkm_per_year: agencyData.total_vkm_per_year,
      },
      //
      total_from_distance: vehicleDistanceInMetersTotal,
      total_from_shape: 0,
      total_in_euros: vehicleDistanceInKilometersTotal * agencyData.price_per_km,
      total_relative_to_contract: agencyData.total_vkm_per_year ? vehicleDistanceInKilometersTotal / agencyData.total_vkm_per_year : 0,
      //
      period_one: vehicleDistanceInMetersForPeriodOne,
      period_two: vehicleDistanceInMetersForPeriodTwo,
      period_three: vehicleDistanceInMetersForPeriodThree,
      //
      day_type_one: vehicleDistanceInMetersForDayTypeOne,
      day_type_two: vehicleDistanceInMetersForDayTypeTwo,
      day_type_three: vehicleDistanceInMetersForDayTypeThree,
      //
      period_one_and_day_type_one: vehicleDistanceInMetersForPeriodOneAndDayTypeOne,
      period_one_and_day_type_two: vehicleDistanceInMetersForPeriodOneAndDayTypeTwo,
      period_one_and_day_type_three: vehicleDistanceInMetersForPeriodOneAndDayTypeThree,
      //
      period_two_and_day_type_one: vehicleDistanceInMetersForPeriodTwoAndDayTypeOne,
      period_two_and_day_type_two: vehicleDistanceInMetersForPeriodTwoAndDayTypeTwo,
      period_two_and_day_type_three: vehicleDistanceInMetersForPeriodTwoAndDayTypeThree,
      //
      period_three_and_day_type_one: vehicleDistanceInMetersForPeriodThreeAndDayTypeOne,
      period_three_and_day_type_two: vehicleDistanceInMetersForPeriodThreeAndDayTypeTwo,
      period_three_and_day_type_three: vehicleDistanceInMetersForPeriodThreeAndDayTypeThree,
      //
    });

    //
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: err.message || 'Cannot calculate VKm for this Agency.' });
  }

  //
}
