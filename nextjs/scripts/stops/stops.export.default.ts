/* * */

import { AgencyModel } from '@/schemas/Agency/model';
import { LineModel } from '@/schemas/Line/model';
import { MunicipalityModel } from '@/schemas/Municipality/model';
import { MunicipalityOptions } from '@/schemas/Municipality/options';
import { PatternModel } from '@/schemas/Pattern/model';
import { StopModel } from '@/schemas/Stop/model';
import { StopPropertyWheelchairBoarding } from '@/schemas/Stop/options';

/* * */

export default async function stopsExportDefault() {
	//

	LineModel;
	AgencyModel;
	MunicipalityModel;

	// 1.
	// Get all stops from the database

	const allStopsData = await StopModel.find().populate('municipality', 'code name district region').lean();

	// 2.
	// Get all patterns and municipalities from the database, and simplify them.
	// This will be used to determine to which areas each stop belongs to, as well as fill in the region and district names.

	const allPatternsData = await PatternModel.find({}, '_id code parent_line path').populate([{ path: 'path.stop' }, { path: 'parent_line', populate: { path: 'agency' } }]);
	const allPatternsDataFormatted = allPatternsData.map(item => ({ _id: item._id, agency_code: item.parent_line?.agency?.code, code: item.code, stop_codes: item.path?.map(pathItem => pathItem.stop?.code) }));

	const allRegionsMap = MunicipalityOptions.region.reduce((map, { label, value }) => (map[value] = label, map), {});
	const allDistrictsMap = MunicipalityOptions.district.reduce((map, { label, value }) => (map[value] = label, map), {});

	// 3.
	// Parse each stop and format it according to the GTFS-TML specification

	const allStopsDataFormatted = allStopsData.map((item) => {
		//

		// 3.1.
		// Determine to which areas this stop belongs to

		const thisStopAgencyCodes = Array.from(new Set(allPatternsDataFormatted.filter(item => item.stop_codes.includes(item.code)).map(item => item.agency_code))).join('|');

		// 3.2.
		// Get region and district names

		const thisStopRegionName = allRegionsMap[item.municipality.region] || '';
		const thisStopDistrictName = allDistrictsMap[item.municipality.district] || '';

		// 3.3.
		// Parse fields according to GTFS specification

		let wheelchairBoardingFormatted;
		switch (item.wheelchair_boarding) {
			default:
			case StopPropertyWheelchairBoarding.Unknown:
				wheelchairBoardingFormatted = '0';
				break;
			case StopPropertyWheelchairBoarding.Yes:
				wheelchairBoardingFormatted = '1';
				break;
			case StopPropertyWheelchairBoarding.No:
				wheelchairBoardingFormatted = '2';
				break;
		}

		// 3.4.
		// Build the final stop object

		return {
			airport: item.near_airport ? '1' : '0',
			areas: thisStopAgencyCodes,
			bike_parking: item.near_bike_parking ? '1' : '0',
			bike_sharing: item.near_bike_sharing ? '1' : '0',
			boat: item.near_boat ? '1' : '0',
			car_parking: item.near_car_parking ? '1' : '0',
			district_id: item.municipality.district,
			district_name: thisStopDistrictName,
			docking_bay_type: item.docking_bay_type,
			flag_maintainer: item.flag_maintainer,
			has_abusive_parking: item.has_abusive_parking,
			has_bench: item.has_bench,
			has_cover: item.has_cover,
			has_crossing: item.has_crossing,
			has_electricity: item.has_electricity,
			// Public Information
			has_flag: item.has_flag,
			has_flat_access: item.has_flat_access,
			has_h2oa_signage: item.has_h2oa_signage,
			has_lighting: item.has_lighting,
			has_mupi: item.has_mupi,
			has_network_map: item.has_network_map,
			has_pip_audio: item.has_pip_audio,
			has_pip_realtime: item.has_pip_realtime,
			has_pip_static: item.has_pip_static,
			// Infrastructure
			has_pole: item.has_pole,
			has_schedules: item.has_schedules,
			has_shelter: item.has_shelter,
			// Accessibility
			has_sidewalk: item.has_sidewalk,
			has_tactile_access: item.has_tactile_access,
			has_tactile_schedules: item.has_tactile_schedules,
			has_trash_bin: item.has_trash_bin,
			has_wide_access: item.has_wide_access,
			jurisdiction: item.jurisdiction || '',
			last_accessibility_check: item.last_accessibility_check,
			last_accessibility_maintenance: item.last_accessibility_maintenance,
			last_flag_check: item.last_flag_check,
			last_flag_maintenance: item.last_flag_maintenance,
			last_infrastructure_check: item.last_infrastructure_check,
			last_infrastructure_maintenance: item.last_infrastructure_maintenance,
			last_schedules_check: item.last_schedules_check,
			last_schedules_maintenance: item.last_schedules_maintenance,
			light_rail: item.near_light_rail ? '1' : '0',
			locality: item.locality || '',
			location_type: '0',
			municipality_id: item.municipality.code,
			municipality_name: item.municipality.name,
			near_beach: item.near_beach ? '1' : '0',
			near_fire_station: item.near_fire_station ? '1' : '0',
			// Services
			near_health_clinic: item.near_health_clinic ? '1' : '0',
			near_historic_building: item.near_historic_building ? '1' : '0',
			near_hospital: item.near_hospital ? '1' : '0',
			near_police_station: item.near_police_station ? '1' : '0',
			near_school: item.near_school ? '1' : '0',
			near_shopping: item.near_shopping ? '1' : '0',
			near_transit_office: item.near_transit_office ? '1' : '0',
			near_university: item.near_university ? '1' : '0',
			// Operation
			operational_status: item.operational_status,
			parent_station: item.parent_station,
			parish_id: '',
			parish_name: '',
			pip_audio_code: item.pip_audio_code,
			pip_realtime_code: item.pip_realtime_code,
			platform_code: item.platform_code,
			// Administrative
			region_id: item.municipality.region,
			region_name: thisStopRegionName,
			shelter_code: item.shelter_code,
			shelter_maintainer: item.shelter_maintainer,
			sidewalk_type: item.sidewalk_type,
			// GTFS
			stop_code: item.code,
			// General
			stop_id: item.code,
			stop_lat: item.latitude.toFixed(6),
			stop_lon: item.longitude.toFixed(6),
			stop_name: item.name,
			stop_name_new: item.name_new,
			stop_short_name: item.short_name,
			stop_url: `https://on.carrismetropolitana.pt/stops/${item.code}`,
			// Connections
			subway: item.near_subway ? '1' : '0',
			train: item.near_train ? '1' : '0',
			tts_stop_name: item.tts_name,
			wheelchair_boarding: wheelchairBoardingFormatted,
			//
		};

		//
	});

	// 2.
	// Sort stops by code

	const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
	return allStopsDataFormatted.sort((a, b) => collator.compare(a.stop_id, b.stop_id));

	//
}
