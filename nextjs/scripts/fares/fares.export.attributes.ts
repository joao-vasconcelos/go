/* * */

import { FareModel } from '@/schemas/Fare/model';

/* * */

interface FaresExportAttributesOptions {
	fare_codes?: string[]
	fare_ids?: string[]
	forced_agency_id?: string
}

/* * */

export default async function faresExportAttributes(options: FaresExportAttributesOptions) {
	//

	// 1.
	// Setup filter based on options

	let queryFilter = {};
	if (options?.fare_ids && options.fare_ids.length > 0) queryFilter = { _id: { $in: options.fare_ids } };
	else if (options?.fare_codes && options.fare_codes.length > 0) queryFilter = { code: { $in: options.fare_codes } };

	// 2.
	// Get all fares from the database

	const allFaresData = await FareModel.find(queryFilter);

	// 3.
	// Parse each fare and format it according to the GTFS-TML specification

	const allFaresDataFormatted = allFaresData.map((item) => {
		//

		// 3.1.
		// Setup GTFS-specfic fare attributes

		let thisFarePaymentMethod = '';
		switch (item.payment_method) {
			default:
			case '0': // ONBOARD
				thisFarePaymentMethod = '0';
				break;
			case '1': // PREPAID
				thisFarePaymentMethod = '1';
				break;
		}

		let thisFareTransfers = '';
		switch (item.transfers) {
			case '0': // No transfers permitted on this fare.
				thisFareTransfers = '0';
				break;
			case '1': // Riders may transfer once.
				thisFareTransfers = '1';
				break;
			case '2': // Riders may transfer twice.
				thisFareTransfers = '2';
				break;
			default:
			case 'unlimited': // empty - Unlimited transfers are permitted.
				thisFareTransfers = '';
				break;
		}

		// 3.3.
		// Include the agency code or not

		if (options?.forced_agency_id) {
			return {
				agency_id: options.forced_agency_id,
				currency_type: item.currency_type,
				fare_id: item.code,
				payment_method: thisFarePaymentMethod,
				price: item.price,
				transfers: thisFareTransfers,
			};
		}

		// 3.2.
		// Build the final fare object

		return {
			currency_type: item.currency_type,
			fare_id: item.code,
			payment_method: thisFarePaymentMethod,
			price: item.price,
			transfers: thisFareTransfers,
		};

		//
	});

	// 4.
	// Sort fares by fare_id

	const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
	return allFaresDataFormatted.sort((a, b) => collator.compare(a.fare_id, b.fare_id));

	//
}
