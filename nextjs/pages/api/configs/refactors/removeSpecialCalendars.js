/* * */

import getSession from '@/authentication/getSession';
import { CalendarModel } from '@/schemas/Calendar/model';
import { PatternModel } from '@/schemas/Pattern/model';
import prepareApiEndpoint from '@/services/prepareApiEndpoint';

/* * */

export default async function handler(req, res) {
	//

	throw new Error('Feature is disabled.');

	// 1.
	// Setup variables

	let sessionData;

	// 2.
	// Get session data

	try {
		sessionData = await getSession(req, res);
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not get Session data. Are you logged in?' });
	}

	// 3.
	// Prepare endpoint

	try {
		await prepareApiEndpoint({ method: 'GET', permissions: [{ action: 'admin', scope: 'configs' }], request: req, session: sessionData });
	}
	catch (error) {
		console.log(error);
		return await res.status(400).json({ message: error.message || 'Could not prepare endpoint.' });
	}

	// 5.
	// Connect to mongodb

	try {
		//

		const allCalendarCodes = await CalendarModel.find({
			code: {
				$in: [
					'ESP_SANTOS_VESP',
					'ESP_SANTOS_DIA',
					'EVENTOS_RIR_TOD',
				],
			},
		}, '_id code');

		const allCalendarIdsToRemove = new Set(allCalendarCodes.map(item => String(item._id)));

		const allPatternCodesWithSpecialCalendarsOn = await PatternModel.find({ 'schedules.calendars_on': { $in: Array.from(allCalendarIdsToRemove) } }, '_id code');
		const allPatternCodesWithSpecialCalendarsOff = await PatternModel.find({ 'schedules.calendars_off': { $in: Array.from(allCalendarIdsToRemove) } }, '_id code');

		const allPatternCodesWithSpecialCalendars = [...allPatternCodesWithSpecialCalendarsOn, ...allPatternCodesWithSpecialCalendarsOff];

		for (const patternCode of allPatternCodesWithSpecialCalendars) {
			//

			if (!patternCode.code.startsWith('4')) {
				continue;
			}

			const patternData = await PatternModel.findOne({ code: patternCode.code });

			const newSchedulesForThisPattern = [];

			// For each schedule
			for (const scheduleData of patternData.schedules) {
				//

				// Create a temporary variable
				const calendarsOnForThisSchedule = new Set(scheduleData.calendars_on.map(item => String(item)));
				const calendarsOffForThisSchedule = new Set(scheduleData.calendars_off.map(item => String(item)));

				for (const calendarIdToRemove of allCalendarIdsToRemove.values()) {
					calendarsOnForThisSchedule.delete(calendarIdToRemove);
					calendarsOffForThisSchedule.delete(calendarIdToRemove);
				}

				// Update schedule data
				scheduleData.calendars_on = Array.from(calendarsOnForThisSchedule);
				scheduleData.calendars_off = Array.from(calendarsOffForThisSchedule);

				newSchedulesForThisPattern.push(scheduleData);

				//
			}

			patternData.schedules = newSchedulesForThisPattern;

			await patternData.save();

			// await PatternModel.replaceOne({ code: patternData.code }, patternData);

			console.log(`Updated pattern ${patternData.code}`);

			//
		}

		//
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Import Error' });
	}

	console.log('Done. Sending response to client...');
	return await res.status(200).json('Import complete.');
}
