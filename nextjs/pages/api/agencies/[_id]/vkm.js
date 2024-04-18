/* * */

import getSession from '@/authentication/getSession';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';
import calculateDateDayType from '@/services/calculateDateDayType';
import { DateTime } from 'luxon';
import { AgencyModel } from '@/schemas/Agency/model';
import { LineModel } from '@/schemas/Line/model';
import { DateModel } from '@/schemas/Date/model';
import { RouteModel } from '@/schemas/Route/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { CalendarModel } from '@/schemas/Calendar/model';

/* * */

export default async function handler(req, res) {
  //

  // 1.
  // Setup variables

  let sessionData;
  let agencyData;
  let allDatesMap = {};
  let allLinesData = [];

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
    await prepareApiEndpoint({ request: req, method: 'POST', session: sessionData, permissions: [{ scope: 'agencies', action: 'view' }] });
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
  }

  // 3.
  // Parse request body into JSON

  try {
    req.body = await JSON.parse(req.body);
  } catch (error) {
    console.log(error);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 4.
  // Fetch all Dates and create a hashmap

  try {
    const allDates = await DateModel.find().lean();
    for (const dateData of allDates) {
      allDatesMap[dateData.date] = dateData;
    }
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Could not fetch all Dates.' });
  }

  // 5.
  // Fetch all Dates and create a hashmap

  try {
    agencyData = await AgencyModel.findOne({ _id: { $eq: req.query._id } }).lean();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Could not fetch Agency.' });
  }

  // 6.
  // Fetch lines for the requested agency

  try {
    allLinesData = await LineModel.find({ agency: { $eq: req.query._id } }, { select: 'routes' })
      .populate({
        path: 'routes',
        select: 'patterns',
        populate: {
          path: 'patterns',
          select: 'code shape.extension shape.points.shape_dist_traveled path.distance_delta schedules.calendars_on schedules.calendars_off',
          populate: {
            path: 'schedules.calendars_on schedules.calendars_off',
            select: 'code dates',
          },
        },
      })
      .lean();
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: 'Cannot fetch Lines for this Agency.' });
  }

  // 7.
  // Calculate vkm for the whole agency

  try {
    //

    // 7.1.
    // Prepare the result variables

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
    // Prepare the date variables in YYYYMMDD string format

    let startDateString = req.body.start_date;
    let endDateString = req.body.end_date;

    // 7.3.
    // Add one year to the start date to get the end date

    if (req.body.calculation_method === 'rolling_year') endDateString = DateTime.fromFormat(startDateString, 'yyyyMMdd').plus({ years: 1 }).toFormat('yyyyMMdd');

    // 7.4.
    // Iterate on all objects to get the total distance ran,
    // in meters, for the desired period

    lineLoop: for (const lineData of allLinesData) {
      routeLoop: for (const routeData of lineData.routes) {
        patternLoop: for (const patternData of routeData.patterns) {
          scheduleLoop: for (const scheduleData of patternData.schedules) {
            calendarOnLopp: for (const calendarOnData of scheduleData.calendars_on) {
              dateLoop: for (const dateOn of calendarOnData.dates) {
                //

                // Get the date attributes from the hashmap
                const dateData = allDatesMap[dateOn];

                // Skip if the date does not exist
                if (!dateData) throw new Error(`Date "${dateOn}" does not exist in GO.`);

                // Check if the date is within the desired period
                if (Number(dateData.date) < Number(startDateString)) continue;
                if (Number(dateData.date) > Number(endDateString)) continue;

                // Check if the date should be removed by any calendars_off
                calendarOffLoop: for (const calendarOffData of scheduleData.calendars_off) {
                  // Skip this date if it should be removed by this calendar_off
                  if (calendarOffData.dates?.includes(dateOn)) continue dateLoop;
                }

                // Setup a variable to hold the shape extension
                let shapeExtension = 0;

                // If the source is 'shape' get the max shape_dist_traveled
                if (req.body.extension_source === 'shape') shapeExtension = patternData.shape.points[patternData.shape.points.length - 1].shape_dist_traveled;
                // If the source is 'stop_times' sum all segments between each stop
                else if (req.body.extension_source === 'stop_times') patternData.path.forEach((stopPath) => (shapeExtension += Number(stopPath.distance_delta)));
                // If the source is 'go' use the TurfJS uniformization
                else if (req.body.extension_source === 'go') shapeExtension = patternData.shape.extension;

                // If the date should be considered, then add the pattern extension to the total variable
                vehicleDistanceInMetersTotal += shapeExtension;

                // Based on the period this date belongs to, add the pattern extension to the relevant variable
                if (dateData.period === '1') vehicleDistanceInMetersForPeriodOne += shapeExtension;
                if (dateData.period === '2') vehicleDistanceInMetersForPeriodTwo += shapeExtension;
                if (dateData.period === '3') vehicleDistanceInMetersForPeriodThree += shapeExtension;

                // Calulate day type for the current date
                const dayType = calculateDateDayType(dateData.date, dateData.is_holiday);

                // Based on the day_type this date belongs to, add the pattern extension to the relevant variable
                if (dayType === '1') vehicleDistanceInMetersForDayTypeOne += shapeExtension;
                if (dayType === '2') vehicleDistanceInMetersForDayTypeTwo += shapeExtension;
                if (dayType === '3') vehicleDistanceInMetersForDayTypeThree += shapeExtension;

                // Set the relevant variables for the combination of period = 1 and day type
                if (dateData.period === '1' && dayType === '1') vehicleDistanceInMetersForPeriodOneAndDayTypeOne += shapeExtension;
                if (dateData.period === '1' && dayType === '2') vehicleDistanceInMetersForPeriodOneAndDayTypeTwo += shapeExtension;
                if (dateData.period === '1' && dayType === '3') vehicleDistanceInMetersForPeriodOneAndDayTypeThree += shapeExtension;

                // Set the relevant variables for the combination of period = 2 and day type
                if (dateData.period === '2' && dayType === '1') vehicleDistanceInMetersForPeriodTwoAndDayTypeOne += shapeExtension;
                if (dateData.period === '2' && dayType === '2') vehicleDistanceInMetersForPeriodTwoAndDayTypeTwo += shapeExtension;
                if (dateData.period === '2' && dayType === '3') vehicleDistanceInMetersForPeriodTwoAndDayTypeThree += shapeExtension;

                // Set the relevant variables for the combination of period = 3 and day type
                if (dateData.period === '3' && dayType === '1') vehicleDistanceInMetersForPeriodThreeAndDayTypeOne += shapeExtension;
                if (dateData.period === '3' && dayType === '2') vehicleDistanceInMetersForPeriodThreeAndDayTypeTwo += shapeExtension;
                if (dateData.period === '3' && dayType === '3') vehicleDistanceInMetersForPeriodThreeAndDayTypeThree += shapeExtension;

                //
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
        calculation_method: req.body.calculation_method,
        start_date: startDateString,
        end_date: endDateString,
        price_per_km: agencyData.price_per_km,
        total_vkm_per_year: agencyData.total_vkm_per_year,
        agency_id: agencyData._id,
        agency_name: agencyData.name,
      },
      //
      total_from_distance: vehicleDistanceInKilometersTotal,
      total_from_shape: 0,
      total_in_euros: vehicleDistanceInKilometersTotal * agencyData.price_per_km,
      total_relative_to_contract: agencyData.total_vkm_per_year ? vehicleDistanceInKilometersTotal / agencyData.total_vkm_per_year : 0,
      //
      period_one: vehicleDistanceInMetersForPeriodOne / 1000,
      period_two: vehicleDistanceInMetersForPeriodTwo / 1000,
      period_three: vehicleDistanceInMetersForPeriodThree / 1000,
      //
      day_type_one: vehicleDistanceInMetersForDayTypeOne / 1000,
      day_type_two: vehicleDistanceInMetersForDayTypeTwo / 1000,
      day_type_three: vehicleDistanceInMetersForDayTypeThree / 1000,
      //
      period_one_and_day_type_one: vehicleDistanceInMetersForPeriodOneAndDayTypeOne / 1000,
      period_one_and_day_type_two: vehicleDistanceInMetersForPeriodOneAndDayTypeTwo / 1000,
      period_one_and_day_type_three: vehicleDistanceInMetersForPeriodOneAndDayTypeThree / 1000,
      //
      period_two_and_day_type_one: vehicleDistanceInMetersForPeriodTwoAndDayTypeOne / 1000,
      period_two_and_day_type_two: vehicleDistanceInMetersForPeriodTwoAndDayTypeTwo / 1000,
      period_two_and_day_type_three: vehicleDistanceInMetersForPeriodTwoAndDayTypeThree / 1000,
      //
      period_three_and_day_type_one: vehicleDistanceInMetersForPeriodThreeAndDayTypeOne / 1000,
      period_three_and_day_type_two: vehicleDistanceInMetersForPeriodThreeAndDayTypeTwo / 1000,
      period_three_and_day_type_three: vehicleDistanceInMetersForPeriodThreeAndDayTypeThree / 1000,
      //
    });

    //
  } catch (error) {
    console.log(error);
    return await res.status(500).json({ message: error.message || 'Cannot calculate VKm for this Agency.' });
  }

  //
}
