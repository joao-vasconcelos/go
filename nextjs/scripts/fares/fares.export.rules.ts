/* * */

import { FareModel } from '@/schemas/Fare/model';
import { LineModel } from '@/schemas/Line/model';
import { RouteModel } from '@/schemas/Route/model';

/* * */

interface FaresExportRulesOptions {
	forced_agency_id?: string
	line_codes?: string[]
	line_ids?: string[]
	route_codes?: string[]
	route_ids?: string[]
}

interface FareRuleDataFormatted {
	agency_id?: string
	fare_id: string
	route_id: string
}

/* * */

export default async function faresExportRules(options: FaresExportRulesOptions) {
	//

	LineModel;
	FareModel;
	RouteModel;

	// 1.
	// Setup filter based on options

	let linesQueryFilter = {};

	if (options?.line_ids && options.line_ids.length > 0) {
		linesQueryFilter = { _id: { $in: options.line_ids } };
	}

	if (options?.line_codes && options.line_codes.length > 0) {
		linesQueryFilter = { code: { $in: options.line_codes } };
	}

	// 2.
	// Get all lines and routes from the database

	const allLinesData = await LineModel.find(linesQueryFilter, '_id code routes prepaid_fare onboard_fares').populate(['prepaid_fare', 'onboard_fares', 'routes']);

	// 3.
	// Iterate on all lines and routes to build the final fare rules data

	const allFareRulesDataFormatted: FareRuleDataFormatted[] = [];

	for (const lineData of allLinesData) {
		for (const routeData of lineData.routes) {
			//

			try {
				if (options?.route_codes && options.route_codes.length > 0) {
					if (!options.route_codes.includes(routeData.code)) {
						continue;
					}
				}

				if (lineData.prepaid_fare) {
					if (options?.forced_agency_id) {
						allFareRulesDataFormatted.push({
							agency_id: options.forced_agency_id,
							fare_id: lineData.prepaid_fare.code,
							route_id: routeData.code,
						});
					}
					else {
						allFareRulesDataFormatted.push({
							fare_id: lineData.prepaid_fare.code,
							route_id: routeData.code,
						});
					}
				}

				for (const onboardFareData of lineData.onboard_fares) {
				//
					if (options?.forced_agency_id) {
						allFareRulesDataFormatted.push({
							agency_id: options.forced_agency_id,
							fare_id: onboardFareData.code,
							route_id: routeData.code,
						});
					}
					else {
						allFareRulesDataFormatted.push({
							fare_id: onboardFareData.code,
							route_id: routeData.code,
						});
					}
				//
				}
			}
			catch (error) {
				console.log('Error at fares.export.rules.ts:', error, routeData);
				throw new Error('Error at fares.export.rules.ts');
			}

			//
		}
	}

	// 4.
	// Sort fares by route_id

	const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
	return allFareRulesDataFormatted.sort((a, b) => collator.compare(a.route_id, b.route_id));

	//
}
