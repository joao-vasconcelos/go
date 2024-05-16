/* * */

import { LineModel } from '@/schemas/Line/model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RouteModel } from '@/schemas/Route/model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FareModel } from '@/schemas/Fare/model';

/* * */

interface FaresExportRulesOptions {
	line_ids?: string[];
	line_codes?: string[];
	forced_agency_id?: string;
}

interface FareRuleDataFormatted {
	agency_id?: string,
	route_id: string,
	fare_id: string,
}

/* * */

export default async function faresExportRules(options: FaresExportRulesOptions) {
	//

	// 1.
	// Setup filter based on options

	let linesQueryFilter = {};
	if (options?.line_ids && options.line_ids.length > 0) linesQueryFilter = { _id: { $in: options.line_ids } };
	else if (options?.line_codes && options.line_codes.length > 0) linesQueryFilter = { code: { $in: options.line_codes } };

	// 2.
	// Get all lines and routes from the database

	const allLinesData = await LineModel.find(linesQueryFilter, '_id code routes prepaid_fare onboard_fares').populate(['prepaid_fare', 'onboard_fares', 'routes']);

	// 3.
	// Iterate on all lines and routes to build the final fare rules data

	const allFareRulesDataFormatted: FareRuleDataFormatted[] = [];

	for (const lineData of allLinesData) {
		for (const routeData of lineData.routes) {
			for (const onboardFareData of lineData.onboard_fares) {
				//
				if (options?.forced_agency_id) {
					allFareRulesDataFormatted.push({
						agency_id: options.forced_agency_id,
						route_id: routeData.code,
						fare_id: lineData.prepaid_fare.code,
					});
					allFareRulesDataFormatted.push({
						agency_id: options.forced_agency_id,
						route_id: routeData.code,
						fare_id: onboardFareData.code,
					});
				} else {
					allFareRulesDataFormatted.push({
						route_id: routeData.code,
						fare_id: lineData.prepaid_fare.code,
					});
					allFareRulesDataFormatted.push({
						route_id: routeData.code,
						fare_id: onboardFareData.code,
					});
				}
				//
			}
		}
	}

	// 4.
	// Sort fares by route_id

	const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
	return allFareRulesDataFormatted.sort((a, b) => collator.compare(a.route_id, b.route_id));

	//
}