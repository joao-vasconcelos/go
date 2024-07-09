/* eslint-disable perfectionist/sort-objects */

/* * */

import { LineModel } from '@/schemas/Line/model';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';

/* * */

export default async function stopsExportDefault() {
	//

	LineModel;

	// 1.
	// Get all stops from the database

	const allStopsData = await StopModel.find().lean();

	// 2.
	// Get all patterns and municipalities from the database, and simplify them.
	// This will be used to determine to which areas each stop belongs to, as well as fill in the region and district names.

	const allPatternsData = await PatternModel.find({}, '_id code parent_line path').populate([{ path: 'path.stop' }, { path: 'parent_line' }]);
	const allPatternsDataFormatted = allPatternsData.map(item => ({ _id: item._id, parent_line_code: item.parent_line?.code, code: item.code, stop_codes: item.path?.map(pathItem => pathItem.stop?.code) }));

	// 3.
	// Parse each stop and format it according to the GTFS-TML specification

	const allStopsDataFormatted = allStopsData.map((stopData) => {
		//

		// 3.1.
		// Determine to which areas this stop belongs to

		const thisStopLineCodes = Array.from(new Set(allPatternsDataFormatted.filter(patternData => patternData.stop_codes.includes(stopData.code)).map(patternData => patternData.parent_line_code))).join('|');

		// 3.2.
		// Build the final stop object

		return {
			// General
			stop_id: stopData.code,
			stop_name: stopData.name,
			stop_name_new: stopData.name_new,
			stop_short_name: stopData.short_name,
			stop_lat: stopData.latitude.toFixed(6),
			stop_lon: stopData.longitude.toFixed(6),
			// Operation
			operational_status: stopData.operational_status,
			//
			lines: thisStopLineCodes,
			//
		};

		//
	});

	// 4.
	// Sort stops by code

	const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
	return allStopsDataFormatted.sort((a, b) => collator.compare(a.stop_id, b.stop_id));

	//
}
