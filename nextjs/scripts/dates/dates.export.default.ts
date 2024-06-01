/* * */

import { DateModel } from '@/schemas/Date/model';
import calculateDateDayType from '@/services/calculateDateDayType';

/* * */

export default async function datesExportDefault() {
	//

	// 1.
	// Get all dates from the database

	const allDatesData = await DateModel.find();

	// 2.
	// Parse each date and format it according to the GTFS-TML specification

	const allDatesDataFormatted = allDatesData.map((item) => {
		//

		// 3.1.
		// Determine the day type of this date

		const thisDateDayType = calculateDateDayType(item.date, item.is_holiday);

		// 3.4.
		// Build the final date object

		return {
			date: item.date,
			day_type: thisDateDayType,
			description: '',
			holiday: item.is_holiday ? '1' : '0',
			period: item.period,
		};

		//
	});

	// 3.
	// Sort dates by date

	const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
	return allDatesDataFormatted.sort((a, b) => collator.compare(a.date, b.date));

	//
}
