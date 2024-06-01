/* * */

import { MunicipalityModel } from '@/schemas/Municipality/model';
import { MunicipalityOptions } from '@/schemas/Municipality/options';

/* * */

export default async function municipalitiesExportDefault() {
	//

	// 1.
	// Get all municipalities from the database

	const allMunicipalitiesData = await MunicipalityModel.find();

	// 2.
	// Parse each municipality and format it according to the GTFS-TML specification

	const allMunicipalitiesDataFormatted = allMunicipalitiesData.map((item) => {
		//

		// 2.1.
		// Get associated data

		const thisMunicipalityDistrictName = MunicipalityOptions.district.find(district => district.value === item.district)?.label || '-';
		const thisMunicipalityRegionName = MunicipalityOptions.region.find(region => region.value === item.region)?.label || '-';

		// 2.2.
		// Build the final municipality object

		return {
			district_id: item.district,
			district_name: thisMunicipalityDistrictName,
			municipality_id: item.code,
			municipality_name: item.name,
			municipality_prefix: item.prefix,
			region_id: item.region,
			region_name: thisMunicipalityRegionName,
		};

		//
	});

	// 3.
	// Sort municipalities by municipality

	const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
	return allMunicipalitiesDataFormatted.sort((a, b) => collator.compare(a.municipality_prefix, b.municipality_prefix));

	//
}
