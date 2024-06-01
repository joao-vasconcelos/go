/* * */

import { DateTime } from 'luxon';

/* * */

export default function parseDateToMilis(date) {
	//
	if (!date) return null;

	const dateTimeObject = DateTime.fromJSDate(date).setZone('Europe/Lisbon').startOf('day').set({ hour: 4 }).toMillis();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	//
	const dateString = `${year}${month}${day}`;
	//
	if (returnType === 'int') return parseInt(dateString);
	else return dateString;

	//
}
