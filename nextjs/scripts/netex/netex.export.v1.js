/* eslint-disable no-constant-binary-expression */

/* * */

import { CalendarModel } from '@/schemas/Calendar/model';
import { DateModel } from '@/schemas/Date/model';
import { ExportModel } from '@/schemas/Export/model';
import { FareModel } from '@/schemas/Fare/model';
import { LineModel } from '@/schemas/Line/model';
import { MunicipalityModel } from '@/schemas/Municipality/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { RouteModel } from '@/schemas/Route/model';
import { StopModel } from '@/schemas/Stop/model';
import { TypologyModel } from '@/schemas/Typology/model';
import { ZoneModel } from '@/schemas/Zone/model';
import dayjs from 'dayjs';
import * as fs from 'fs';

/* * */
/* EXPORT NETEX V1 */
/* This endpoint returns a zip file. */
/* * */

//
//
//
//

/* * */
/* UPDATE PROGRESS */
/* Fetch the database for the given agency_id. */
async function update(exportDocument, updates) {
	await ExportModel.updateOne({ _id: exportDocument._id }, updates);
}

//
//
//
//

/* * */
/* WRITE CSV TO FILE */
/* Parse and append data to an existing file. */
function writeXmlToFile(workdir, filename, data) {
	// Set the new line character to be used (should be \n)
	const newLineCharacter = '\n';
	const xmlFileHeader = '<?xml version="1.0" encoding="utf-8"?>';
	// Check if the file already exists
	const fileExists = fs.existsSync(`${workdir}/${filename}`);
	// Use papaparse to produce the CSV string
	let xmlData = data;
	// Prepend a file indicator
	if (fileExists) xmlData = newLineCharacter + xmlData;
	else xmlData = xmlFileHeader + newLineCharacter + xmlData;
	// Append the xml string to the file
	fs.appendFileSync(`${workdir}/${filename}`, xmlData);
}

//
//
//
//

/* * */
/* PARSE AND SUM TIME STRING */
/* Parse a GTFS-standard time string in the format HH:MM and sum it */
/* with a given increment in seconds. Return a string in the same format. */
function incrementTime(timeString, increment) {
	// Parse the time string into hours, minutes, and seconds
	const [hours, minutes] = timeString.split(':').map(Number);
	// Calculate the new total seconds
	const totalSeconds = hours * 3600 + minutes * 60 + increment;
	// Calculate the new hours, minutes, and seconds
	const newHours = Math.floor(totalSeconds / 3600);
	const newMinutes = Math.floor(totalSeconds / 60) % 60;
	const newSeconds = 0;
	// Format the new time string
	return `${padZero(newHours)}:${padZero(newMinutes)}:${padZero(newSeconds)}`;
	//
}

//
//
//
//

/* * */
/* PAD ZEROS */
/* Add zeros to start of string if length is less than 2. */
function padZero(num) {
	return num.toString().padStart(2, '0');
}

//
//
//
//

/* * */
/* GET TODAY AS STRING */
/* Output the current date and time in the format YYYYMMDDHHMM. */
/* For example, if the current date is July 3, 2023, at 9:30 AM, the output will be 202307030930. */
function today() {
	let currentDate = new Date();
	let year = currentDate.getFullYear();
	let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
	let day = currentDate.getDate().toString().padStart(2, '0');
	let hours = currentDate.getHours().toString().padStart(2, '0');
	let minutes = currentDate.getMinutes().toString().padStart(2, '0');

	return year + month + day + hours + minutes;
}

//
//
//
//

/* * */
/* BUILD ROUTE OBJECT ENTRY */
/* Build an agency object entry */
function parseAgency(agencyData) {
	return {
		agency_email: agencyData.email,
		agency_fare_url: agencyData.fare_url,
		agency_id: agencyData.code,
		agency_lang: 'pt' || agencyData.lang,
		agency_name: 'Carris Metropolitana' || agencyData.name,
		agency_phone: '210410400' || agencyData.phone,
		agency_timezone: 'Europe/Lisbon' || agencyData.timezone,
		agency_url: 'https://www.carrismetropolitana.pt' || agencyData.url,
	};
}

//
//
//
//

/* * */
/* BUILD ROUTE OBJECT ENTRY */
/* Build an agency object entry */
function parseFeedInfo(agencyData, options) {
	return {
		default_lang: 'en',
		feed_contact_url: 'https://api.carrismetropolitana.pt/gtfs',
		feed_end_date: options.feed_end_date,
		feed_lang: 'pt',
		feed_publisher_name: agencyData.name,
		feed_publisher_url: agencyData.url,
		feed_start_date: options.feed_start_date,
		feed_version: today(),
	};
}

//
//
//
//

/* * */
/* PARSE ROUTE */
/* Build a route object entry */
function parseRoute(agencyData, lineData, typologyData, routeData) {
	return {
		agency_id: agencyData.code,
		circular: lineData.circular ? 1 : 0,
		line_id: lineData.code,
		line_long_name: lineData.name.replaceAll(',', ''),
		line_short_name: lineData.short_name,
		line_type: getLineType(typologyData.code),
		path_type: 1,
		route_color: typologyData.color.slice(1),
		route_destination: 'line-destination',
		route_id: routeData.code,
		route_long_name: routeData.name.replaceAll(',', ''),
		route_origin: 'line-origin',
		route_short_name: lineData.short_name,
		route_text_color: typologyData.text_color.slice(1),
		route_type: 3,
		school: lineData.school ? 1 : 0,
	};
}

//
//
//
//

/* * */
/* PARSE FARE RULE */
/* Build a route object entry */
function parseFareRule(agencyData, routeData, fareData) {
	return {
		agency_id: agencyData.code,
		fare_id: fareData.code,
		route_id: routeData.code,
	};
}

//
//
//
//

/* * */
/* PARSE FARE */
/* Build a route object entry */
function parseFare(agencyData, fareData) {
	return {
		agency_id: agencyData.code,
		currency_type: fareData.currency_type,
		fare_id: fareData.code,
		payment_method: fareData.payment_method,
		price: fareData.price,
		transfers: fareData.transfers,
	};
}

//
//
//
//

/* * */
/* GET LINE TYPE */
/* For a given typology code return the corresponding type key */
function getLineType(typologyCode) {
	switch (typologyCode) {
		case 'PROXIMA':
			return 1;
		case 'LONGA':
			return 2;
		case 'RAPIDA':
			return 3;
		case 'INTER-REG':
			return 4;
		case 'MAR':
			return 5;
		default:
			return 0;
	}
}

//
//
//
//

/* * */
/* PARSE ZONING */
/* Build a zoning object entry */
async function parseZoning(lineData, patternData, exportOptions) {
	const parsedZoning = [];
	for (const [pathIndex, pathData] of patternData.path.entries()) {
		// Skip if this pathStop has no associated stop
		if (!pathData.stop) continue;
		// Get stop, municipality and zones data for this stop
		const stopData = await StopModel.findOne({ _id: pathData.stop }, 'code name latitude longitude municipality zones');
		const municipalityData = await MunicipalityModel.findOne({ _id: stopData.municipality }, 'code name');
		const allZonesData = await ZoneModel.find({ _id: pathData.zones }, 'code name');
		// Prepare zones in the file format
		let formattedZones = allZonesData.filter(zone => zone.code !== 'AML').map(zone => zone.code);
		if (formattedZones.length === 0) formattedZones = '0';
		else formattedZones = formattedZones.join('-');
		// Write the afetacao.txt entry for this path
		parsedZoning.push({
			'Aceitacao passes municipais': formattedZones,
			'Localizacao Paragem Municipios v2': municipalityData.name,
			'line_id': lineData.code,
			'pattern_id': patternData.code,
			'stop_id': stopData.code,
			'stop_lat': stopData.latitude || '0',
			'stop_lon': stopData.longitude || '0',
			'stop_name': stopData.name || '',
			'stop_sequence': pathIndex + exportOptions.stop_sequence_start,
		});

		// End of afetacao loop
	}
	return parsedZoning;
}

//
//
//
//

/* * */
/* PARSE SHAPE */
/* Build a shape object entry */
function parseShape(gtfsShapeId, shapeData) {
	const parsedShape = [];
	for (const shapePoint of shapeData.points) {
		// Prepare variables
		const shapePtLat = shapePoint.shape_pt_lat.toFixed(6);
		const shapePtLon = shapePoint.shape_pt_lon.toFixed(6);
		const shapeDistTraveled = parseFloat(((shapePoint.shape_dist_traveled || 0) / 1000).toFixed(15));
		// Build shape point
		parsedShape.push({
			shape_dist_traveled: shapeDistTraveled,
			shape_id: gtfsShapeId,
			shape_pt_lat: shapePtLat,
			shape_pt_lon: shapePtLon,
			shape_pt_sequence: shapePoint.shape_pt_sequence,
		});
	}
	return parsedShape;
}

//
//
//
//

/* * */
/* PARSE CALENDAR */
/* Build a calendar_dates object entry */
async function parseCalendar(calendarData, startDate, endDate, shouldConcatenate) {
	// Initiate an new variable
	const parsedCalendar = [];
	// For each date in the calendar
	for (const calendarDate of calendarData.dates) {
		// Tranform the current, start and end dates
		// into integers to allow for easy comparison
		const calendarDateInt = parseInt(calendarDate);
		const startDateInt = parseInt(startDate);
		const endDateInt = parseInt(endDate);
		// Skip adding the current date if it is not between the requested start and end dates
		if (shouldConcatenate && (calendarDateInt < startDateInt || calendarDateInt > endDateInt)) continue;
		// Get Date document for this calendar date
		const dateData = await DateModel.findOne({ date: calendarDate });
		// Skip if no date is found
		if (!dateData) continue;
		// Get the day_type for the current date
		let dayType = getDayType(calendarDate, calendarData.is_holiday);
		// Build the date entry
		parsedCalendar.push({
			date: calendarDate,
			day_type: dayType,
			exception_type: 1,
			holiday: calendarData.is_holiday ? 1 : 0,
			period: dateData.period,
			service_id: calendarData.code,
		});
		//
	}
	// Return this calendar
	return parsedCalendar;
	//
}

//
//
//
//

/* * */
/* GET DAY TYPE FOR DATE */
/* Return 1, 2 or 3 for a given date */
function getDayType(date, isHoliday) {
	// Return 3 immediately if it is a holiday
	if (isHoliday) return 3;
	// Create a dayjs object
	const dateObj = dayjs(date, 'YYYYMMDD');
	// Get the weekday using dayjs
	const dayOfWeek = dateObj.day();
	// If it Weekday
	if (dayOfWeek >= 1 && dayOfWeek <= 5) return 1;
	// Saturday
	else if (dayOfWeek === 6) return 2;
	// Sunday
	else return 3;
	//
}

//
//
//
//

/* * */
/* PARSE STOP */
/* Build a trip object entry */
function parseStop(stopData, municipalityData) {
	// NETEX
	let xmlTextData = '<StopPlace version="1" id="NSR:StopPlace:10000000">';

	return {
		bench: '',
		entrance_restriction: '',
		equipment: '',
		exit_restriction: '',
		level_id: '',
		location_type: '',
		municipality: municipalityData.code || '',
		network_map: '',
		observations: '',
		parent_station: '',
		platform_code: '',
		preservation_state: '',
		real_time_information: '',
		region: municipalityData.region || '',
		schedule: '',
		shelter: '',
		signalling: '',
		slot: '',
		stop_code: stopData.code,
		stop_desc: '',
		stop_id: stopData.code,
		stop_id_stepp: '0',
		stop_lat: stopData.latitude.toFixed(6),
		stop_lon: stopData.longitude.toFixed(6),
		stop_name: stopData.name,
		stop_remarks: '',
		stop_timezone: '',
		stop_url: '',
		tariff: '',
		wheelchair_boarding: '',
		zone_id: '',
		zone_shift: '',
	};
}

//
//
//
//

/* * */
/* BUILD GTFS V18 */
/* This builds the GTFS archive. */
export default async function exportNetexV1(progress, agencyData, exportOptions) {
	//

	// 0.
	// Update progress
	await update(progress, { progress_current: 1, progress_total: 7, status: 1 });

	// 0.1.
	// In order to build stops.txt, shapes.txt and calendar_dates.txt it is necessary
	// to initiate these variables outside all loops that hold the _ids
	// of the objects that are referenced in the other objects (trips, patterns)
	const referencedFareCodes = new Set();
	const referencedStopCodes = new Set();
	const referencedCalendarCodes = new Set();

	// 1.
	// Retrieve the requested agency object
	// and write the entry for this agency in agency.txt file
	const parsedAgency = parseAgency(agencyData);
	//   writeXmlToFile(progress.workdir, 'agency.txt', parsedAgency);
	//
	await update(progress, { progress_current: 2 });

	// 2.
	// Retrieve only the lines that match the requested export options,
	// or all of them for the given agency if 'lines_included' and 'lines_excluded' are empty.

	const linesFilterParams = { agency: agencyData._id };

	if (exportOptions.lines_included.length) linesFilterParams._id = { $in: exportOptions.lines_included };
	else if (exportOptions.lines_excluded.length) linesFilterParams._id = { $nin: exportOptions.lines_excluded };

	const allLinesData = await LineModel.find(linesFilterParams);

	await update(progress, { progress_current: 0, progress_total: allLinesData.length });

	// 3.
	// Initiate the main loop that go through all lines
	// and progressively builds the GTFS files
	lineLoop: for (const [lineIndex, lineData] of allLinesData.entries()) {
		//

		// 3.0.
		// Update progress
		await update(progress, { progress_current: lineIndex + 1 });

		// 3.1.
		// Skip to the next line if this line has no routes
		if (!lineData.routes) continue lineLoop; // throw new Error({ code: 5101, short_message: 'Line has no routes.', references: { line_code: lineData.code } });

		// 3.2.
		// Get fare associated with this line
		const fareData = await FareModel.findOne({ _id: lineData.fare });
		if (!fareData) throw new Error({ code: 5102, references: { line_code: lineData.code }, short_message: 'Fare not found.' });

		// 3.3.
		// Get typology associated with this line
		const typologyData = await TypologyModel.findOne({ _id: lineData.typology });
		if (!typologyData) throw new Error({ code: 5102, references: { line_code: lineData.code }, short_message: 'Typology not found.' });

		// 3.4.
		// Loop on all the routes for this line
		routeLoop: for (const routeId of lineData.routes) {
			//
			// 3.4.0.
			// Fetch route from database
			const routeData = await RouteModel.findOne({ _id: routeId });
			if (!routeData) continue routeLoop; // throw new Error({ code: 5201, short_message: 'Route not found.', references: { line_code: lineData.code } });

			// 3.4.1.
			// Skip to the next route if this route has no patterns
			if (!routeData.patterns) continue routeLoop; // throw new Error({ code: 5202, short_message: 'Route has no patterns.', references: { route_code: routeData.code } });

			// 3.4.2.
			// Set a flag to make sure that there are no foreign key violations
			// due to entries in higher-order files being added without entries in lower-order files
			// (ex: trip without stop_times or route without trips)
			let thisRouteHasAtLeastOnePatternWithOneTrip = false;

			// 3.4.3.
			// Iterate on all the patterns for the given route
			patternLoop: for (const patternId of routeData.patterns) {
				//
				// 3.4.3.0.
				// Fetch pattern from database
				const patternData = await PatternModel.findOne({ _id: patternId });
				if (!patternData) continue patternLoop; // throw new Error({ code: 5301, short_message: 'Pattern not found.', references: { route_code: routeData.code } });

				// 3.4.3.1.
				// Skip to the next pattern if this pattern has no shape, no path or no schedules
				if (!patternData.shape || !patternData.shape.points) continue patternLoop; // throw new Error({ code: 5302, short_message: 'Pattern has no shape.', references: { pattern_code: patternData.code } });
				if (!patternData.path) continue patternLoop; // throw new Error({ code: 5303, short_message: 'Pattern has no path.', references: { pattern_code: patternData.code } });
				if (!patternData.schedules) continue patternLoop; // throw new Error({ code: 5303, short_message: 'Pattern has no schedules.', references: { pattern_code: patternData.code } });

				// 3.4.3.2.
				// Build the code for the associated shape
				const thisShapeCode = `shp_${patternData.code}`;

				// 3.4.3.3.
				// Set a flag to ensure no foreign key violation are commited
				// if this pattern ends up having no trips
				let thisPatternHasAtLeastOneTrip = false;

				// 3.4.3.4.
				// Iterate on all the schedules for the given pattern
				scheduleLoop: for (const scheduleData of patternData.schedules) {
					//
					// 3.4.3.4.0.
					// Skip to the next schedule if this schedule has no associated calendars
					if (!scheduleData.calendars_on) continue scheduleLoop; // throw new Error({ code: 5401, short_message: 'Schedule has no calendars.', references: { pattern_code: patternData.code, schedule_start_time: scheduleData.start_time } });

					// 3.4.3.4.1.
					// The rule for this GTFS version is to create as many trips as associated calendars.
					// For this, iterate on all the calendars associated with this schedule and build the trips.
					calendarLoop: for (const calendarId of scheduleData.calendars_on) {
						//
						// 3.4.3.4.1.0.
						// Fetch calendar from database
						const calendarData = await CalendarModel.findOne({ _id: calendarId });
						if (!calendarData) continue calendarLoop; // throw new Error({ code: 5501, short_message: 'Calendar not found.', references: { pattern_code: patternData.code, schedule_start_time: scheduleData.start_time } });

						// 3.4.3.4.1.1.
						// Skip if this calendar has no dates
						if (!calendarData.dates) continue calendarLoop; // throw new Error({ code: 5502, short_message: 'Calendar has no dates.', references: { pattern_code: patternData.code, schedule_start_time: scheduleData.start_time, calendar_code: calendarData.code } });

						// 3.4.3.4.1.2.
						// Skip if this calendar ends up not being used when 'concatenate' option is set to true
						const parsedCalendar = await parseCalendar(calendarData, exportOptions.calendars_start_date, exportOptions.calendars_end_date, exportOptions.adjust_calendars);
						if (!parsedCalendar.length) continue calendarLoop;

						// 3.4.3.4.1.3.
						// Append the calendar code of this schedule to the scoped variable
						referencedCalendarCodes.add(calendarData.code);

						// 3.4.3.4.1.4.
						// Remove the : from this schedules start_time to use it as the identifier for this trip.
						// Associate the route_code, direction, calendar_code and start_time of this schedule.
						const startTimeStripped = scheduleData.start_time.split(':').join('');
						const thisTripCode = `${patternData.code}_${calendarData.code}_${startTimeStripped}`;

						// 3.4.3.4.1.5.
						// Calculate the arrival_time for each stop
						// Start by collecting the arrival time of the first stop in the path
						// and hold it outside the path loop to keep updating it relative to each iteration
						let currentArrivalTime = scheduleData.start_time;

						// 3.4.3.4.1.6.
						// Calculate the accumulated trip distance for each stop
						// Trip distance is incremented relative to each iteration
						// so hold the variable outside the path loop, and initiate it with zero
						let currentTripDistance = 0;

						// 3.4.3.4.1.7.
						// Hold a flag to ensure that all stop_times in this trip are valid
						let allStopTimesForThisTripAreValid = false;

						// 3.4.3.4.1.8.
						// In order to only write valid stop_times entries,
						// hold them in a variable outside the path loop and write them all at once
						const parsedStopTimes = [];

						// 3.4.3.4.1.9.
						// Iterate on all the calendars associated with this schedule
						pathLoop: for (const [pathIndex, pathData] of patternData.path.entries()) {
							//
							// 3.4.3.4.1.9.0.
							// Reset the flag to ensure that it is set
							// on every stop for this path
							allStopTimesForThisTripAreValid = false;

							// 3.4.3.4.1.9.1.
							// Skip to the next pattern if this pathStop has no associated stop
							if (!pathData.stop) continue pathLoop; // throw new Error({ code: 5301, short_message: 'Path without defined stop.', references: { pattern_code: patternData.code } });

							// 3.4.3.4.1.9.2.
							// Fetch stop from database. Exit the loop early if not found.
							const stopData = await StopModel.findOne({ _id: pathData.stop }, 'code');
							if (!stopData) break pathLoop; // throw new Error({ code: 5302, short_message: 'Stop not found with _id on path.', references: { pattern_code: patternData.code } });

							// 3.4.3.4.1.9.3.
							// Append the stop codes for this path to the scoped variable
							referencedStopCodes.add(stopData.code);

							// 3.4.3.4.1.9.4.
							// Increment the arrival_time for this stop with the travel time for this path segment
							// If the schedule has a travel time override, then use that instead of the default (not yet implemented)
							// In the first iteration, the travel time is zero, so we get the start_time as the current trip time.
							currentArrivalTime = incrementTime(currentArrivalTime, pathData.default_travel_time);

							// 3.4.3.4.1.9.5.
							// Increment the arrival_time for this stop with the dwell time
							// If the schedule has a dwell time override, then use that instead of the default (not yet implemented)
							const departureTime = incrementTime(currentArrivalTime, pathData.default_dwell_time);

							// 3.4.3.4.1.9.6.
							// Increment the traveled distance for this path segment with the distance delta
							currentTripDistance = currentTripDistance + pathData.distance_delta;

							// 3.4.3.4.1.9.7.
							// Add to the sequence index the value from the client (start with 1 or 0)
							const currentStopSequence = pathIndex + exportOptions.stop_sequence_start;

							// 3.4.3.4.1.9.8.
							// Format the shape_dist_traveled for the given precision
							const currentShapeDistTraveled = parseFloat((currentTripDistance / 1000).toFixed(15));

							// 3.4.3.4.1.9.9.
							// Write the stop_times.txt entry for this stop_time
							parsedStopTimes.push({
								arrival_time: currentArrivalTime,
								departure_time: departureTime,
								drop_off_type: pathData.allow_drop_off ? 0 : 1,
								pickup_type: pathData.allow_pickup ? 0 : 1,
								shape_dist_traveled: currentShapeDistTraveled,
								stop_id: stopData.code,
								stop_sequence: currentStopSequence,
								timepoint: 1,
								trip_id: thisTripCode,
							});

							// 3.4.3.4.1.9.10.
							// The current trip time should now be equal to the departure time, so that the next iteration
							// also takes into the account the dwell time on the current stop.
							currentArrivalTime = departureTime;

							// 3.4.3.4.1.9.11.
							// Set the flag to true to indicate that this stop_time was valid
							allStopTimesForThisTripAreValid = true;

							// End of path loop
						}

						// 3.4.3.4.1.10.
						// Abort creating this trip if there were invalid stop_times entries
						if (!allStopTimesForThisTripAreValid) continue calendarLoop;

						// 3.4.3.4.1.11.
						// Write the stop_times.txt entries for this trip
						// writeXmlToFile(progress.workdir, 'stop_times.txt', parsedStopTimes);

						// 3.4.3.4.1.12.
						// Write the trips.txt entry for this trip
						// writeXmlToFile(progress.workdir, 'trips.txt', {
						//   route_id: routeData.code,
						//   pattern_id: patternData.code,
						//   pattern_short_name: patternData.headsign.replaceAll(',', ''),
						//   service_id: calendarData.code,
						//   trip_id: thisTripCode,
						//   trip_headsign: patternData.headsign.replaceAll(',', ''),
						//   direction_id: patternData.direction,
						//   shape_id: thisShapeCode,
						//   calendar_desc: scheduleData.calendar_desc.replaceAll(',', ''),
						// });

						// 3.4.3.4.1.13.
						// Set the flag to true to instruct that there is at least
						// one valid trip written to the trips.txt file
						thisPatternHasAtLeastOneTrip = true;

						// End of schedule calendars loop
					}

					// End of schedules loop
				}

				// 3.4.3.5.
				// Only continue with this patten if there was at least one valid trip
				if (!thisPatternHasAtLeastOneTrip) continue patternLoop;

				// 3.4.3.6.
				// Write the afetacao.txt entry for this pattern
				const parsedZoning = await parseZoning(lineData, patternData, exportOptions);
				// writeXmlToFile(progress.workdir, 'afetacao.csv', parsedZoning);

				// 3.4.3.7.
				// Write the shapes.txt entry for this pattern
				const parsedShape = parseShape(thisShapeCode, patternData.shape);
				// writeXmlToFile(progress.workdir, 'shapes.txt', parsedShape);

				// 3.4.3.8.
				// Update the flag indicating that the components for this pattern
				// were successfully written to their respective files
				thisRouteHasAtLeastOnePatternWithOneTrip = true;

				// End of patterns loop
			}

			// 3.4.4.
			// Check the previously set flag to ensure that no foreign keys are added for this route
			if (!thisRouteHasAtLeastOnePatternWithOneTrip) continue routeLoop;

			// 3.4.5.
			// Write the routes.txt entry for this route
			const parsedRoute = parseRoute(agencyData, lineData, typologyData, routeData);
			//   writeXmlToFile(progress.workdir, 'routes.txt', parsedRoute);

			// 3.4.6.
			// Write the fare_rules.txt entry for this route
			const parsedFareRule = parseFareRule(agencyData, routeData, fareData);
			//   writeXmlToFile(progress.workdir, 'fare_rules.txt', parsedFareRule);
			referencedFareCodes.add(fareData.code);

			// End of routes loop
		}

		// End of lines loop
	}

	// 4.
	// Update progress
	await update(progress, { progress_current: 4, progress_total: 7, status: 1 });

	// 4.1.
	// Fetch the referenced calendars and write the calendar_dates.txt file
	//   for (const calendarCode of referencedCalendarCodes) {
	//     const calendarData = await CalendarModel.findOne({ code: calendarCode });
	//     const parsedCalendar = await parseCalendar(calendarData, exportOptions.calendars_start_date, exportOptions.calendars_end_date, exportOptions.adjust_calendars);
	//     if (parsedCalendar.length) writeXmlToFile(progress.workdir, 'calendar_dates.txt', parsedCalendar);
	//   }

	// 5.
	// Update progress
	await update(progress, { progress_current: 5, progress_total: 7, status: 1 });

	// 5.1.
	// Fetch the referenced stops and write the stops.txt file

	writeXmlToFile(progress.workdir, 'stops.xml', '<PublicationDelivery version="1.0" xmlns="http://www.netex.org.uk/netex" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">');
	writeXmlToFile(progress.workdir, 'stops.xml', '<PublicationTimestamp>2017-02-13T15:00:00.0Z</PublicationTimestamp>');
	writeXmlToFile(progress.workdir, 'stops.xml', '<ParticipantRef>NSR</ParticipantRef>');
	writeXmlToFile(progress.workdir, 'stops.xml', '<dataObjects>');
	writeXmlToFile(progress.workdir, 'stops.xml', '<FrameDefaults>');
	writeXmlToFile(progress.workdir, 'stops.xml', '<DefaultLocale>');
	writeXmlToFile(progress.workdir, 'stops.xml', '<DefaultLanguage>no</DefaultLanguage>');
	writeXmlToFile(progress.workdir, 'stops.xml', '</DefaultLocale>');
	writeXmlToFile(progress.workdir, 'stops.xml', '</FrameDefaults>');
	writeXmlToFile(progress.workdir, 'stops.xml', '<SiteFrame version="1" id="NSR:SiteFrame:1" >');
	writeXmlToFile(progress.workdir, 'stops.xml', '<stopPlaces>');

	for (const stopCode of referencedStopCodes) {
		//
		const stopData = await StopModel.findOne({ code: stopCode });
		//
		writeXmlToFile(progress.workdir, 'stops.xml', `<StopPlace version="1" id="NSR:StopPlace:${stopCode}">`);
		writeXmlToFile(progress.workdir, 'stops.xml', `<Name>${stopData.name}</Name>`);
		writeXmlToFile(progress.workdir, 'stops.xml', '<StopPlaceType>onstreetBus</StopPlaceType>');
		writeXmlToFile(progress.workdir, 'stops.xml', '<quays>');
		writeXmlToFile(progress.workdir, 'stops.xml', `<Quay version="1" id="NSR:Quay:${stopCode}">`);
		writeXmlToFile(progress.workdir, 'stops.xml', '<Centroid>');
		writeXmlToFile(progress.workdir, 'stops.xml', '<Location srsName="WGS84">');
		writeXmlToFile(progress.workdir, 'stops.xml', `<Longitude>${stopData.longitude}</Longitude>`);
		writeXmlToFile(progress.workdir, 'stops.xml', `<Latitude>${stopData.latitude}</Latitude>`);
		writeXmlToFile(progress.workdir, 'stops.xml', '</Location>');
		writeXmlToFile(progress.workdir, 'stops.xml', '</Centroid>');
		writeXmlToFile(progress.workdir, 'stops.xml', `<PublicCode>${stopCode}</PublicCode>`);
		writeXmlToFile(progress.workdir, 'stops.xml', '</Quay>');
		writeXmlToFile(progress.workdir, 'stops.xml', '</quays>');
		writeXmlToFile(progress.workdir, 'stops.xml', '</StopPlace>');
		//
	}

	writeXmlToFile(progress.workdir, 'stops.xml', '</stopPlaces>');
	writeXmlToFile(progress.workdir, 'stops.xml', '</SiteFrame>');
	writeXmlToFile(progress.workdir, 'stops.xml', '</dataObjects>');
	writeXmlToFile(progress.workdir, 'stops.xml', '</PublicationDelivery>');

	//
	//
	//
	//
	//
	//
	//
	//

	// 6.
	// Update progress
	await update(progress, { progress_current: 6, progress_total: 7, status: 1 });

	// 6.1.
	// Fetch the referenced fares and write the fare_attributes.txt file
	//   for (const fareCode of referencedFareCodes) {
	//     const fareData = await FareModel.findOne({ code: fareCode });
	//     const parsedFare = parseFare(agencyData, fareData);
	//     writeXmlToFile(progress.workdir, 'fare_attributes.txt', parsedFare);
	//   }

	// 7.
	// Update progress
	await update(progress, { progress_current: 7, progress_total: 7, status: 1 });

	// 7.1.
	// Create the feed_info file
	const feedInfoData = parseFeedInfo(agencyData, exportOptions);
	//   writeXmlToFile(progress.workdir, 'feed_info.txt', feedInfoData);

	//
}
