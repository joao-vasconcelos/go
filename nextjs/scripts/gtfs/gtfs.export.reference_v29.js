/* * */

import { AgencyModel } from '@/schemas/Agency/model';
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
import CSVWRITER from '@/services/CSVWRITER';
import calculateDateDayType from '@/services/calculateDateDayType';

/* * */
/* EXPORT GTFS V29 */
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
	try {
		await ExportModel.updateOne({ _id: exportDocument._id }, updates);
	}
	catch (error) {
		console.log(`Error at update(${exportDocument}, ${updates})`, error);
		throw new Error(`Error at update(${exportDocument}, ${updates})`);
	}
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
	try {
		// Parse the time string into hours, minutes, and seconds
		let [hours, minutes, seconds] = timeString.split(':').map(Number);
		// Handle case where seconds is undefined
		if (!seconds) seconds = 0;
		// Calculate the new total seconds
		const totalSeconds = hours * 3600 + minutes * 60 + seconds + increment;
		// Calculate the new hours, minutes, and seconds
		const newHours = Math.floor(totalSeconds / 3600);
		const newMinutes = Math.floor((totalSeconds % 3600) / 60);
		const newSeconds = Math.floor((totalSeconds % 3600) % 60);
		// Format the new time string
		return `${padZero(newHours)}:${padZero(newMinutes)}:${padZero(newSeconds)}`;
		//
	}
	catch (error) {
		console.log(`Error at incrementTime(${timeString}, ${increment})`, error);
		throw new Error(`Error at incrementTime(${timeString}, ${increment})`);
	}
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
	try {
		return {
			agency_email: agencyData.email,
			agency_fare_url: agencyData.fare_url,
			agency_id: agencyData.code,
			agency_lang: 'pt', // || agencyData.lang,
			agency_name: 'Carris Metropolitana', // || agencyData.name,
			agency_phone: '210410400', // || agencyData.phone,
			agency_timezone: 'Europe/Lisbon', // || agencyData.timezone,
			agency_url: 'https://www.carrismetropolitana.pt', // || agencyData.url,
		};
	}
	catch (error) {
		console.log(`Error at parseAgency(${agencyData})`, error);
		throw new Error(`Error at parseAgency(${agencyData})`);
	}
}

//
//
//
//

/* * */
/* BUILD ROUTE OBJECT ENTRY */
/* Build an agency object entry */
function parseFeedInfo(agencyData, options) {
	try {
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
	catch (error) {
		console.log(`Error at parseFeedInfo(${agencyData}, ${options})`, error);
		throw new Error(`Error at parseFeedInfo(${agencyData}, ${options})`);
	}
}

//
//
//
//

/* * */
/* PARSE ROUTE */
/* Build a route object entry */
function parseRoute(agencyData, lineData, typologyData, routeData) {
	try {
		return {
			agency_id: agencyData.code,
			circular: lineData.circular ? 1 : 0,
			line_id: lineData.code,
			line_long_name: lineData.name.replaceAll(',', '').replace(/  +/g, ' ').trim(),
			line_short_name: lineData.short_name.replace(/  +/g, ' ').trim(),
			line_type: getLineType(typologyData.code),
			path_type: routeData.path_type,
			route_color: typologyData.color.slice(1),
			route_destination: routeData.patterns[0]?.destination || '',
			route_id: routeData.code,
			route_long_name: routeData.name.replaceAll(',', '').replace(/  +/g, ' ').trim(),
			route_origin: routeData.patterns[0]?.origin || '',
			route_short_name: lineData.short_name.replace(/  +/g, ' ').trim(),
			route_text_color: typologyData.text_color.slice(1),
			route_type: lineData.transport_type,
			school: lineData.school ? 1 : 0,
		};
	}
	catch (error) {
		console.log(`Error at parseRoute(${agencyData}, ${lineData}, ${typologyData}, ${routeData})`, error);
		throw new Error(`Error at parseRoute(${agencyData}, ${lineData}, ${typologyData}, ${routeData})`);
	}
}

//
//
//
//

/* * */
/* PARSE FARE RULE */
/* Build a route object entry */
function parseFareRule(agencyData, routeData, fareData) {
	try {
		return {
			agency_id: agencyData.code,
			fare_id: fareData.code,
			route_id: routeData.code,
		};
	}
	catch (error) {
		console.log(`Error at parseFareRule(${agencyData}, ${routeData}, ${fareData})`, error);
		throw new Error(`Error at parseFareRule(${agencyData}, ${routeData}, ${fareData})`);
	}
}

//
//
//
//

/* * */
/* PARSE FARE */
/* Build a route object entry */
function parseFare(agencyData, fareData) {
	try {
		return {
			agency_id: agencyData.code,
			currency_type: fareData.currency_type,
			fare_id: fareData.code,
			payment_method: fareData.payment_method,
			price: fareData.price,
			transfers: fareData.transfers,
		};
	}
	catch (error) {
		console.log(`Error at parseFare(${agencyData}, ${fareData})`, error);
		throw new Error(`Error at parseFare(${agencyData}, ${fareData})`);
	}
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
async function parseZoning(agencyData, lineData, patternData, exportOptions) {
	try {
		const parsedZoning = [];
		for (const [pathIndex, pathData] of patternData.path.entries()) {
			// Skip if this pathStop has no associated stop
			if (!pathData.stop) continue;
			// Get stop, municipality and zones data for this stop
			const stopData = await StopModel.findOne({ _id: pathData.stop }, 'code name zones');
			const allZonesData = await ZoneModel.find({ _id: pathData.zones }, 'code name');
			// Prepare zones in the file format
			let formattedZoneNames = allZonesData.map(zone => zone.name).join('|');
			let formattedZoneCodes = allZonesData.map(zone => zone.code).join('|');
			// Prepare fares in the file format
			let formattedOnboardFares = lineData.onboard_fares.map(onboardFare => onboardFare.code).join('|');
			// Write the afetacao.txt entry for this path
			parsedZoning.push({
				accepted_zone_codes: formattedZoneCodes,
				accepted_zone_names: formattedZoneNames,
				interchange: lineData.interchange || '0',
				line_id: lineData.code,
				line_type: lineData.typology.code || '',
				onboard_fares: formattedOnboardFares,
				operator_id: agencyData.code,
				pattern_id: patternData.code,
				prepaid_fare: lineData.prepaid_fare?.code || '',
				prepaid_fare_price: lineData.prepaid_fare?.price || '0',
				stop_id: stopData.code,
				stop_name: stopData.name || '',
				stop_sequence: pathIndex + exportOptions.stop_sequence_start,
			});

			// End of afetacao loop
		}
		return parsedZoning;
	}
	catch (error) {
		console.log(`Error at parseZoning(${lineData}, ${patternData}, ${exportOptions})`, error);
		throw new Error(`Error at parseZoning(${lineData}, ${patternData}, ${exportOptions})`);
	}
}

//
//
//
//

/* * */
/* PARSE SHAPE */
/* Build a shape object entry */
function parseShape(gtfsShapeId, shapeData) {
	try {
		const parsedShape = [];
		for (const shapePoint of shapeData.points) {
			// Prepare variables
			const shapePtLat = shapePoint.shape_pt_lat.toFixed(6);
			const shapePtLon = shapePoint.shape_pt_lon.toFixed(6);
			const shapeDistTraveled = parseFloat(((shapePoint.shape_dist_traveled || 0) / 1000).toFixed(6));
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
	catch (error) {
		console.log(`Error at parseShape(${gtfsShapeId}, ${shapeData})`, error);
		throw new Error(`Error at parseShape(${gtfsShapeId}, ${shapeData})`);
	}
}

//
//
//
//

/* * */
/* PARSE CALENDAR */
/* Build a calendar_dates object entry */
async function parseCalendar(calendarCode, calendarDates) {
	try {
		// Initiate an new variable
		const parsedCalendar = [];
		// For each date in the calendar
		for (const calendarDate of calendarDates) {
			// Get Date document for this calendar date
			const dateData = await DateModel.findOne({ date: calendarDate });
			// Skip if no date is found
			if (!dateData) continue;
			// Get the day_type for the current date
			const dayType = calculateDateDayType(calendarDate, dateData.is_holiday);
			// Build the date entry
			parsedCalendar.push({
				date: calendarDate,
				day_type: dayType,
				exception_type: 1,
				holiday: dateData.is_holiday ? 1 : 0,
				period: dateData.period,
				service_id: calendarCode,
			});
			//
		}
		// Return this calendar
		return parsedCalendar;
		//
	}
	catch (error) {
		console.log(`Error at parseCalendar(${calendarCode}, ${calendarDates.length})`, error);
		throw new Error(`Error at parseCalendar(${calendarCode}, ${calendarDates.length})`);
	}
}

//
//
//
//

/* * */
/* PARSE STOP */
/* Build a trip object entry */
function parseStop(stopData, municipalityData) {
	try {
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
			stop_short_name: stopData.short_name,
			stop_timezone: '',
			stop_url: '',
			tariff: '',
			wheelchair_boarding: '',
			zone_id: '',
			zone_shift: '',
		};
	}
	catch (error) {
		console.log(`Error at parseStop(${stopData}, ${municipalityData})`, error);
		throw new Error(`Error at parseStop(${stopData}, ${municipalityData})`);
	}
}

//
//
//
//

/* * */
/* BUILD GTFS V29 */
/* This builds the GTFS archive. */
export default async function exportGtfsV29(progress, exportOptions) {
	//

	const agencyData = await AgencyModel.findOne({ _id: { $eq: exportOptions.agency_id } });

	console.log(`* * *`);
	console.log(`* GTFS v29 : NEW EXPORT`);
	console.log(`* AgencyData:`, agencyData);
	console.log(`* ExportOptions:`, exportOptions);
	console.log(`* * *`);

	const agencyCsvWriter = new CSVWRITER('gtfs.reference.v29-agency');
	const tripsCsvWriter = new CSVWRITER('gtfs.reference.v29-trips');
	const stopTimesCsvWriter = new CSVWRITER('gtfs.reference.v29-stopTimes');
	const stopsCsvWriter = new CSVWRITER('gtfs.reference.v29-stops');
	const calendarDatesCsvWriter = new CSVWRITER('gtfs.reference.v29-calendarDates');
	const feedInfoCsvWriter = new CSVWRITER('gtfs.reference.v29-feedInfo');
	const afetacaoCsvWriter = new CSVWRITER('gtfs.reference.v29-afetacao');
	const shapesCsvWriter = new CSVWRITER('gtfs.reference.v29-shapes');
	const fareRulesCsvWriter = new CSVWRITER('gtfs.reference.v29-fareRules');
	const fareAttributesCsvWriter = new CSVWRITER('gtfs.reference.v29-fareAttributes');
	const routesCsvWriter = new CSVWRITER('gtfs.reference.v29-routes');

	// 0.
	// Update progress
	await update(progress, { progress_current: 1, progress_total: 7 });

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
	await agencyCsvWriter.write(progress.workdir, 'agency.txt', parsedAgency);

	//
	await update(progress, { progress_current: 2 });

	// 2.
	// Retrieve only the lines that match the requested export options,
	// or all of them for the given agency if 'lines_include' and 'lines_exclude' are empty.

	const linesFilterParams = { agency: agencyData._id };

	if (exportOptions.lines_include.length) linesFilterParams._id = { $in: exportOptions.lines_include };
	else if (exportOptions.lines_exclude.length) linesFilterParams._id = { $nin: exportOptions.lines_exclude };

	const allLinesData = await LineModel.find(linesFilterParams).sort({ code: 1 }).populate(['typology', 'prepaid_fare', 'onboard_fares', 'routes']);

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
		if (!lineData.routes.length) continue lineLoop; // throw new Error({ code: 5101, short_message: 'Line has no routes.', references: { line_code: lineData.code } });

		// 3.2.
		// Get typology associated with this line
		const typologyData = lineData.typology; // await TypologyModel.findOne({ _id: lineData.typology });
		if (!typologyData) throw new Error({ code: 5102, references: { line_code: lineData.code }, short_message: 'Typology not found.' });

		// 3.3.
		// Loop on all the routes for this line
		routeLoop: for (const routeId of lineData.routes) {
			//
			// 3.3.0.
			// Fetch route from database
			const routeData = await RouteModel.findOne({ _id: routeId }).populate({ path: 'patterns', populate: { path: 'schedules.calendars_on schedules.calendars_off path.stop' } });
			if (!routeData) continue routeLoop; // throw new Error({ code: 5201, short_message: 'Route not found.', references: { line_code: lineData.code } });

			// 3.3.1.
			// Skip to the next route if this route has no patterns
			if (!routeData.patterns.length) continue routeLoop; // throw new Error({ code: 5202, short_message: 'Route has no patterns.', references: { route_code: routeData.code } });

			// 3.3.2.
			// Set a flag to make sure that there are no foreign key violations
			// due to entries in higher-order files being added without entries in lower-order files
			// (ex: trip without stop_times or route without trips)
			let thisRouteHasAtLeastOnePatternWithOneTrip = false;

			// 3.3.3.
			// Iterate on all the patterns for the given route
			patternLoop: for (const patternData of routeData.patterns) {
				//
				// 3.3.3.0.
				// Check if there is a pattern here
				if (!patternData) continue patternLoop; // throw new Error({ code: 5301, short_message: 'Pattern not found.', references: { route_code: routeData.code } });

				// 3.3.3.1.
				// Skip to the next pattern if this pattern has no shape, no path or no schedules
				if (!patternData.shape || !patternData.shape.points.length) continue patternLoop; // throw new Error({ code: 5302, short_message: 'Pattern has no shape.', references: { pattern_code: patternData.code } });
				if (!patternData.path.length) continue patternLoop; // throw new Error({ code: 5303, short_message: 'Pattern has no path.', references: { pattern_code: patternData.code } });
				if (!patternData.schedules.length) continue patternLoop; // throw new Error({ code: 5303, short_message: 'Pattern has no schedules.', references: { pattern_code: patternData.code } });

				// 3.3.3.2.
				// Build the code for the associated shape
				const thisShapeCode = `shp_${patternData.code}`;

				// 3.3.3.3.
				// Set a flag to ensure no foreign key violation are commited
				// if this pattern ends up having no trips
				let thisPatternHasAtLeastOneTrip = false;

				// 3.3.3.4.
				// Iterate on all the schedules for the given pattern
				scheduleLoop: for (const scheduleData of patternData.schedules) {
					//
					// 3.3.3.4.0.
					// Skip to the next schedule if this schedule has no associated calendars
					if (!scheduleData.calendars_on.length) continue scheduleLoop; // throw new Error({ code: 5401, short_message: 'Schedule has no calendars.', references: { pattern_code: patternData.code, schedule_start_time: scheduleData.start_time } });

					// 3.3.3.4.1.
					// The rule for this GTFS version is to create as many trips as associated calendars.
					// For this, iterate on all the calendars associated with this schedule and build the trips.
					calendarOnLoop: for (const calendarOnData of scheduleData.calendars_on) {
						//
						// 3.3.3.4.1.0.
						// Check if there is a calendar here
						if (!calendarOnData) continue calendarOnLoop; // throw new Error({ code: 5501, short_message: 'Calendar not found.', references: { pattern_code: patternData.code, schedule_start_time: scheduleData.start_time } });

						// 3.3.3.4.1.1.
						// Skip if this calendar has no dates
						if (!calendarOnData.dates.length) continue calendarOnLoop; // throw new Error({ code: 5502, short_message: 'Calendar has no dates.', references: { pattern_code: patternData.code, schedule_start_time: scheduleData.start_time, calendar_code: calendarData.code } });

						// 3.3.3.4.1.2.
						// Setup this calendar ON code based on the desired type
						const currentCalendarOnCode = exportOptions.numeric_calendar_codes ? String(calendarOnData.numeric_code) : String(calendarOnData.code);

						// 3.3.3.4.1.3.
						// Prepare the final calendar code and description
						let resultingCalendarCode = currentCalendarOnCode;
						let resultingCalendarDescription = calendarOnData.description ? `Apenas ${calendarOnData.description}` : '';

						// 3.3.3.4.1.4.
						// Transform this calendar dates into a Set for easier manipulation
						const calendarOnDates = new Set(calendarOnData.dates);

						// 3.3.3.4.1.5.
						// Subtract all calendars_off dates from the current calendar ON
						calendarOffLoop: for (const calendarOffData of scheduleData.calendars_off) {
							//
							// 3.3.3.4.1.5.1.
							// Check if there is a calendar here
							if (!calendarOffData) continue calendarOffLoop;

							// 3.3.3.4.1.5.2.
							// Skip if this calendar has no dates
							if (!calendarOffData.dates.length) continue calendarOffLoop;

							// 3.3.3.4.1.5.3.
							// Set a flag to indicate if any date was removed or the calendar was untouched
							let currentCalendarOnWasModified = false;

							// 3.3.3.4.1.5.4.
							// Subtract from the current calendar ON all the dates in the current calendar OFF
							calendarOffData.dates.forEach((dateToBeRemoved) => {
								// Remove the date from the calendar ON
								const dateWasRemoved = calendarOnDates.delete(dateToBeRemoved);
								// If the flag is already set to true, keep it set to true
								currentCalendarOnWasModified = currentCalendarOnWasModified || dateWasRemoved;
							});

							// 3.3.3.4.1.5.5.
							// if the current calendar ON was modified then append the current calendar OFF code and description to this combination
							if (currentCalendarOnWasModified) {
								// Include the OFF flag if this is the first calendar OFF code being appended
								if (resultingCalendarCode === currentCalendarOnCode) {
									// Append 'OFF' as the divider if not using numeric codes
									if (!exportOptions.numeric_calendar_codes) resultingCalendarCode = `${resultingCalendarCode}-OFF`;
								}
								// Append the current calendar OFF code (numeric or regular)
								if (exportOptions.numeric_calendar_codes) resultingCalendarCode = `${resultingCalendarCode}${calendarOffData.numeric_code}`;
								else resultingCalendarCode = `${resultingCalendarCode}-${calendarOffData.code}`;
								// Append the description string for this calendar OFF and trim the result
								const calendarOffDescription = calendarOffData.description ? `Excepto ${calendarOffData.description}` : '';
								resultingCalendarDescription = `${resultingCalendarDescription} ${calendarOffDescription}`;
								resultingCalendarDescription = resultingCalendarDescription.replace(/  +/g, ' ').trim();
							}

							// End of calendarOff loop
						}

						// 3.3.3.4.1.6.
						// Skip if this calendar ends up not being used because it was fully subtracted
						if (!calendarOnDates.size) continue calendarOnLoop;

						// 3.3.3.4.1.7.
						// If set, clip the resulting calendar ON dates to the desired start and end dates
						if (exportOptions.clip_calendars) {
							[...calendarOnDates].forEach((currentDate) => {
								// If the current date is before the start date OR after the end date, then remove it from the set
								if (currentDate < exportOptions.calendars_clip_start_date || currentDate > exportOptions.calendars_clip_end_date) {
									calendarOnDates.delete(currentDate);
								}
							});
						}

						// 3.3.3.4.1.8.
						// Skip if this calendar ends up not being used because it was fully clipped
						if (!calendarOnDates.size) continue calendarOnLoop;

						// 3.3.3.4.1.9.
						// If the resulting calendar is not yet written to the export file
						if (!referencedCalendarCodes.has(resultingCalendarCode)) {
							// Append the resulting calendar code to the scoped variable
							referencedCalendarCodes.add(resultingCalendarCode);
							// Write the resulting calendar dates to the output file
							const parsedCalendar = await parseCalendar(resultingCalendarCode, [...calendarOnDates]);
							if (parsedCalendar.length) await calendarDatesCsvWriter.write(progress.workdir, 'calendar_dates.txt', parsedCalendar);
						}

						// 3.3.3.4.1.10.
						// Remove the : from this schedules start_time to use it as the identifier for this trip.
						// Associate the pattern_code, resulting calendar_code and start_time of the current schedule.
						const startTimeStripped = scheduleData.start_time.split(':').join('');
						const thisTripCode = `${patternData.code}|${resultingCalendarCode}|${startTimeStripped}`;

						// 3.3.3.4.1.11.
						// Calculate the arrival_time for each stop
						// Start by collecting the arrival time of the first stop in the path
						// and hold it outside the path loop to keep updating it relative to each iteration
						let currentArrivalTime = scheduleData.start_time;

						// 3.3.3.4.1.12.
						// Calculate the accumulated trip distance for each stop
						// Trip distance is incremented relative to each iteration
						// so hold the variable outside the path loop, and initiate it with zero
						let currentTripDistance = 0;

						// 3.3.3.4.1.13.
						// Hold a flag to ensure that all stop_times in this trip are valid
						let allStopTimesForThisTripAreValid = false;

						// 3.3.3.4.1.14.
						// In order to only write valid stop_times entries,
						// hold them in a variable outside the path loop and write them all at once
						const parsedStopTimes = [];

						// 3.3.3.4.1.15.
						// Iterate on all the calendars associated with this schedule
						pathLoop: for (const [pathIndex, pathData] of patternData.path.entries()) {
							//
							// 3.3.3.4.1.15.0.
							// Reset the flag to ensure that it is set
							// on every stop for this path
							allStopTimesForThisTripAreValid = false;

							// 3.3.3.4.1.15.1.
							// Skip to the next pattern if this pathStop has no associated stop
							if (!pathData.stop) continue pathLoop; // throw new Error({ code: 5301, short_message: 'Path without defined stop.', references: { pattern_code: patternData.code } });

							// 3.3.3.4.1.15.2.
							// Check if there is a stop here. Exit the loop early if not found.
							if (!pathData.stop) break pathLoop; // throw new Error({ code: 5302, short_message: 'Stop not found with _id on path.', references: { pattern_code: patternData.code } });

							// 3.3.3.4.1.15.3.
							// Append the stop codes for this path to the scoped variable
							referencedStopCodes.add(pathData.stop.code);

							// 3.3.3.4.1.15.4.
							// Increment the arrival_time for this stop with the travel time for this path segment
							// If the schedule has a travel time override, then use that instead of the default (not yet implemented)
							// In the first iteration, the travel time is zero, so we get the start_time as the current trip time.
							currentArrivalTime = incrementTime(currentArrivalTime, pathData.default_travel_time);

							// 3.3.3.4.1.15.5.
							// Increment the arrival_time for this stop with the dwell time
							// If the schedule has a dwell time override, then use that instead of the default (not yet implemented)
							const departureTime = incrementTime(currentArrivalTime, pathData.default_dwell_time);

							// 3.3.3.4.1.15.6.
							// Increment the traveled distance for this path segment with the distance delta
							currentTripDistance = currentTripDistance + pathData.distance_delta;

							// 3.3.3.4.1.15.7.
							// Add to the sequence index the value from the client (start with 1 or 0)
							const currentStopSequence = pathIndex + exportOptions.stop_sequence_start;

							// 3.3.3.4.1.15.8.
							// Format the shape_dist_traveled for the given precision
							const currentShapeDistTraveled = parseFloat((currentTripDistance / 1000).toFixed(6));

							// 3.3.3.4.1.15.9.
							// Write the stop_times.txt entry for this stop_time
							parsedStopTimes.push({
								arrival_time: currentArrivalTime,
								departure_time: departureTime,
								drop_off_type: pathData.allow_drop_off ? 0 : 1,
								pickup_type: pathData.allow_pickup ? 0 : 1,
								shape_dist_traveled: currentShapeDistTraveled,
								stop_id: pathData.stop.code,
								stop_sequence: currentStopSequence,
								timepoint: 1,
								trip_id: thisTripCode,
							});

							// 3.3.3.4.1.15.10.
							// The current trip time should now be equal to the departure time, so that the next iteration
							// also takes into the account the dwell time on the current stop.
							currentArrivalTime = departureTime;

							// 3.3.3.4.1.15.11.
							// Set the flag to true to indicate that this stop_time was valid
							allStopTimesForThisTripAreValid = true;

							// End of path loop
						}

						// 3.3.3.4.1.16.
						// Abort creating this trip if there were invalid stop_times entries
						if (!allStopTimesForThisTripAreValid) continue calendarOnLoop;

						// 3.3.3.4.1.17.
						// Write the stop_times.txt entries for this trip
						await stopTimesCsvWriter.write(progress.workdir, 'stop_times.txt', parsedStopTimes);

						// 3.3.3.4.1.18.
						// Write the trips.txt entry for this trip
						await tripsCsvWriter.write(progress.workdir, 'trips.txt', {
							calendar_desc: resultingCalendarDescription.replaceAll(',', '').replace(/  +/g, ' ').trim(),
							direction_id: patternData.direction,
							pattern_id: patternData.code,
							pattern_short_name: patternData.headsign.replaceAll(',', '').replace(/  +/g, ' ').trim(),
							route_id: routeData.code,
							service_id: resultingCalendarCode,
							shape_id: thisShapeCode,
							trip_headsign: patternData.headsign.replaceAll(',', '').replace(/  +/g, ' ').trim(),
							trip_id: thisTripCode,
						});

						// 3.3.3.4.1.19.
						// Set the flag to true to instruct that there is at least
						// one valid trip written to the trips.txt file
						thisPatternHasAtLeastOneTrip = true;

						// End of schedule calendars loop
					}

					// End of schedules loop
				}

				// 3.3.3.5.
				// Only continue with this patten if there was at least one valid trip
				if (!thisPatternHasAtLeastOneTrip) continue patternLoop;

				// 3.3.3.6.
				// Write the afetacao.txt entry for this pattern
				const parsedZoning = await parseZoning(agencyData, lineData, patternData, exportOptions);
				await afetacaoCsvWriter.write(progress.workdir, 'afetacao.csv', parsedZoning);

				// 3.3.3.7.
				// Write the shapes.txt entry for this pattern
				const parsedShape = parseShape(thisShapeCode, patternData.shape);
				await shapesCsvWriter.write(progress.workdir, 'shapes.txt', parsedShape);

				// 3.3.3.8.
				// Update the flag indicating that the components for this pattern
				// were successfully written to their respective files
				thisRouteHasAtLeastOnePatternWithOneTrip = true;

				// End of patterns loop
			}

			// 3.3.4.
			// Check the previously set flag to ensure that no foreign keys are added for this route
			if (!thisRouteHasAtLeastOnePatternWithOneTrip) continue routeLoop;

			// 3.3.5.
			// Write the routes.txt entry for this route
			const parsedRoute = parseRoute(agencyData, lineData, typologyData, routeData);
			await routesCsvWriter.write(progress.workdir, 'routes.txt', parsedRoute);

			// 3.3.6.
			// Write the fare_rules.txt entry for this route
			const combinedFares = lineData.onboard_fares.concat(lineData.prepaid_fare ? [lineData.prepaid_fare] : []);
			for (const fareData of combinedFares) {
				const parsedFareRule = parseFareRule(agencyData, routeData, fareData);
				await fareRulesCsvWriter.write(progress.workdir, 'fare_rules.txt', parsedFareRule);
				referencedFareCodes.add(fareData.code);
			}

			// End of routes loop
		}

		// End of lines loop
	}

	// 4.
	// Update progress
	await update(progress, { progress_current: 5, progress_total: 7 });

	// 4.1.
	// Fetch the referenced stops and write the stops.txt file
	const allReferencedStopsData = await StopModel.find({ code: { $in: Array.from(referencedStopCodes) } }).populate('municipality');

	// 4.2.
	// Fetch the referenced stops and write the stops.txt file
	for (const stopData of allReferencedStopsData) {
		const parsedStop = parseStop(stopData, stopData.municipality);
		await stopsCsvWriter.write(progress.workdir, 'stops.txt', parsedStop);
	}

	// 5.
	// Update progress
	await update(progress, { progress_current: 6, progress_total: 7 });

	// 5.1.
	// Fetch the referenced fares and write the fare_attributes.txt file
	const allReferencedFaresData = await FareModel.find({ code: { $in: Array.from(referencedFareCodes) } });

	// 5.1.
	// Fetch the referenced fares and write the fare_attributes.txt file
	for (const fareData of allReferencedFaresData) {
		const parsedFare = parseFare(agencyData, fareData);
		await fareAttributesCsvWriter.write(progress.workdir, 'fare_attributes.txt', parsedFare);
	}

	// 6.
	// Update progress
	await update(progress, { progress_current: 7, progress_total: 7 });

	// 6.1.
	// Create the feed_info file
	const feedInfoData = parseFeedInfo(agencyData, exportOptions);
	await feedInfoCsvWriter.write(progress.workdir, 'feed_info.txt', feedInfoData);

	// 7.
	// Flush everything

	await agencyCsvWriter.flush();
	await tripsCsvWriter.flush();
	await stopTimesCsvWriter.flush();
	await stopsCsvWriter.flush();
	await calendarDatesCsvWriter.flush();
	await feedInfoCsvWriter.flush();
	await afetacaoCsvWriter.flush();
	await shapesCsvWriter.flush();
	await fareRulesCsvWriter.flush();
	await fareAttributesCsvWriter.flush();
	await routesCsvWriter.flush();

	//
}
