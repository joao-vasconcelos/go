/* * */

import { StopModel } from '@/schemas/Stop/model';
import { StopPropertyWheelchairBoarding } from '@/schemas/Stop/options';
import { MunicipalityOptions } from '@/schemas/Municipality/options';
import { PatternModel } from '@/schemas/Pattern/model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LineModel } from '@/schemas/Line/model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AgencyModel } from '@/schemas/Agency/model';

/* * */

export default async function stopsExportDefault() {
	//

	// 1.
	// Get all stops from the database

	const allStopsData = await StopModel.find().populate('municipality', 'code name district region').lean();

	// 2.
	// Get all patterns and municipalities from the database, and simplify them.
	// This will be used to determine to which areas each stop belongs to, as well as fill in the region and district names.

	const allPatternsData = await PatternModel.find({}, '_id code parent_line path').populate([{ path: 'path.stop' }, { path: 'parent_line', populate: { path: 'agency' } }]);
	const allPatternsDataFormatted = allPatternsData.map((item) => ({ _id: item._id, code: item.code, agency_code: item.parent_line?.agency?.code, stop_codes: item.path?.map((pathItem) => pathItem.stop?.code) }));

	const allRegionsMap = MunicipalityOptions.region.reduce((map, { value, label }) => (map[value] = label, map), {});
	const allDistrictsMap = MunicipalityOptions.district.reduce((map, { value, label }) => (map[value] = label, map), {});

	// 3.
	// Parse each stop and format it according to the GTFS-TML specification

	const allStopsDataFormatted = allStopsData.map((item) => {
		//

		// 3.1.
		// Determine to which areas this stop belongs to

		const thisStopAgencyCodes = Array.from(new Set(allPatternsDataFormatted.filter((item) => item.stop_codes.includes(item.code)).map((item) => item.agency_code))).join('|');

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
			// General
			stop_id: item.code,
			stop_name: item.name,
			stop_name_new: item.name_new,
			stop_short_name: item.short_name,
			stop_lat: item.latitude.toFixed(6),
			stop_lon: item.longitude.toFixed(6),
			// Operation
			operational_status: item.operational_status,
			areas: thisStopAgencyCodes,
			// Administrative
			region_id: item.municipality.region,
			region_name: thisStopRegionName,
			district_id: item.municipality.district,
			district_name: thisStopDistrictName,
			municipality_id: item.municipality.code,
			municipality_name: item.municipality.name,
			parish_id: '',
			parish_name: '',
			locality: item.locality || '',
			jurisdiction: item.jurisdiction || '',
			// GTFS
			stop_code: item.code,
			tts_stop_name: item.tts_name,
			platform_code: item.platform_code,
			parent_station: item.parent_station,
			location_type: '0',
			stop_url: `https://on.carrismetropolitana.pt/stops/${item.code}`,
			// Infrastructure
			has_pole: item.has_pole,
			has_cover: item.has_cover,
			has_shelter: item.has_shelter,
			shelter_code: item.shelter_code,
			shelter_maintainer: item.shelter_maintainer,
			has_mupi: item.has_mupi,
			has_bench: item.has_bench,
			has_trash_bin: item.has_trash_bin,
			has_lighting: item.has_lighting,
			has_electricity: item.has_electricity,
			docking_bay_type: item.docking_bay_type,
			last_infrastructure_maintenance: item.last_infrastructure_maintenance,
			last_infrastructure_check: item.last_infrastructure_check,
			// Public Information
			has_flag: item.has_flag,
			flag_maintainer: item.flag_maintainer,
			has_pip_static: item.has_pip_static,
			has_pip_audio: item.has_pip_audio,
			pip_audio_code: item.pip_audio_code,
			has_pip_realtime: item.has_pip_realtime,
			pip_realtime_code: item.pip_realtime_code,
			has_h2oa_signage: item.has_h2oa_signage,
			has_schedules: item.has_schedules,
			has_tactile_schedules: item.has_tactile_schedules,
			has_network_map: item.has_network_map,
			last_schedules_maintenance: item.last_schedules_maintenance,
			last_schedules_check: item.last_schedules_check,
			last_flag_maintenance: item.last_flag_maintenance,
			last_flag_check: item.last_flag_check,
			// Accessibility
			has_sidewalk: item.has_sidewalk,
			sidewalk_type: item.sidewalk_type,
			has_crossing: item.has_crossing,
			has_flat_access: item.has_flat_access,
			has_wide_access: item.has_wide_access,
			has_tactile_access: item.has_tactile_access,
			has_abusive_parking: item.has_abusive_parking,
			wheelchair_boarding: wheelchairBoardingFormatted,
			last_accessibility_maintenance: item.last_accessibility_maintenance,
			last_accessibility_check: item.last_accessibility_check,
			// Services
			near_health_clinic: item.near_health_clinic ? '1' : '0',
			near_hospital: item.near_hospital ? '1' : '0',
			near_university: item.near_university ? '1' : '0',
			near_school: item.near_school ? '1' : '0',
			near_police_station: item.near_police_station ? '1' : '0',
			near_fire_station: item.near_fire_station ? '1' : '0',
			near_shopping: item.near_shopping ? '1' : '0',
			near_historic_building: item.near_historic_building ? '1' : '0',
			near_transit_office: item.near_transit_office ? '1' : '0',
			near_beach: item.near_beach ? '1' : '0',
			// Connections
			subway: item.near_subway ? '1' : '0',
			light_rail: item.near_light_rail ? '1' : '0',
			train: item.near_train ? '1' : '0',
			boat: item.near_boat ? '1' : '0',
			airport: item.near_airport ? '1' : '0',
			bike_sharing: item.near_bike_sharing ? '1' : '0',
			bike_parking: item.near_bike_parking ? '1' : '0',
			car_parking: item.near_car_parking ? '1' : '0',
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