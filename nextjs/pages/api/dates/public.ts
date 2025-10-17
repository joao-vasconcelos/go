/* * */

import { DateModel } from '@/schemas/Date/model';
import { type OperationalDate } from '@tmlmobilidade/types';
import { Dates } from '@tmlmobilidade/utils';

/* * */

interface DateObj {
	date: OperationalDate
	day_type: '1' | '2' | '3'
	holiday: '0' | '1'
	notes: string
	period: '1' | '2' | '3'
}

/* * */

export default async function handler(req, res) {
	//

	//
	// List all documents

	try {
		const allDocuments = await DateModel.find({});

		const allDocumentsFormatted: DateObj[] = allDocuments.map((doc): DateObj => {
			const weekday = Dates
				.fromOperationalDate(doc.date, 'Europe/Lisbon')
				.toFormat('c'); // ISO weekday number (1 = Monday, 7 = Sunday)
			return {
				date: doc.date,
				day_type: doc.is_holiday ? '3' : weekday === '6' ? '2' : weekday === '7' ? '3' : '1',
				holiday: doc.is_holiday ? '1' : '0',
				notes: doc.notes || '',
				period: doc.period,
			};
		});

		return await res.status(200).send(allDocumentsFormatted);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot list Dates.' });
	}

	//
}
