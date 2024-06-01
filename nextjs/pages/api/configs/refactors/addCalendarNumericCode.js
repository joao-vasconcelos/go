/* * */

import getSession from '@/authentication/getSession';
import { CalendarModel } from '@/schemas/Calendar/model';
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
		// Fetch all Patterns from database
		const allCalendarCodes = await CalendarModel.find({}, 'code');

		// For each pattern
		for (const [index, calendarCode] of allCalendarCodes.entries()) {
			//

			const calendarData = await CalendarModel.findById(calendarCode._id);

			const possibleNumericCode = Number(calendarCode.code);

			if (isNaN(possibleNumericCode)) calendarData.numeric_code = index + 1000;
			else {
				const foundWithSameNumericCode = await CalendarModel.findOne({ numeric_code: possibleNumericCode });
				if (!foundWithSameNumericCode) calendarData.numeric_code = possibleNumericCode;
				else if (foundWithSameNumericCode.code === calendarData.code) calendarData.numeric_code = possibleNumericCode;
				else calendarData.numeric_code = index + 1000;
			}

			await calendarData.save();

			console.log(`Calendar Code: ${calendarData.code} -> Numeric code: ${calendarData.numeric_code}`);

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

	//
}
