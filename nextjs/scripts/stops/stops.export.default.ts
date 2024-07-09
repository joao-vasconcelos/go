/* eslint-disable perfectionist/sort-objects */

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
	const allPatternsDataFormatted = allPatternsData.map(patternData => ({ _id: patternData._id, agency_code: patternData.parent_line?.agency?.code, code: patternData.code, stop_codes: patternData.path?.map(pathItemData => pathItemData.stop?.code) }));

	const allRegionsMap = MunicipalityOptions.region.reduce((map, { label, value }) => (map[value] = label, map), {});
	const allDistrictsMap = MunicipalityOptions.district.reduce((map, { label, value }) => (map[value] = label, map), {});

	// 3.
	// Parse each stop and format it according to the GTFS-TML specification

	const allStopsDataFormatted = allStopsData.map((stopData) => {
		//

		// 3.1.
		// Determine to which areas this stop belongs to

		const thisStopAgencyCodes = Array.from(new Set(allPatternsDataFormatted.filter(patternData => patternData.stop_codes.includes(stopData.code)).map(patternData => patternData.agency_code))).join('|');

		// 3.2.
		// Get region and district names

		const thisStopRegionName = allRegionsMap[stopData.municipality.region] || '';
		const thisStopDistrictName = allDistrictsMap[stopData.municipality.district] || '';

		// 3.3.
		// Parse fields according to GTFS specification

		let wheelchairBoardingFormatted;
		switch (stopData.wheelchair_boarding) {
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
			stop_id: stopData.code,
			stop_name: stopData.name,
			stop_name_new: stopData.name_new,
			stop_short_name: stopData.short_name,
			stop_lat: stopData.latitude.toFixed(6),
			stop_lon: stopData.longitude.toFixed(6),
			// Operation
			operational_status: stopData.operational_status,
			areas: thisStopAgencyCodes,
			// Administrative
			region_id: stopData.municipality.region,
			region_name: thisStopRegionName,
			district_id: stopData.municipality.district,
			district_name: thisStopDistrictName,
			municipality_id: stopData.municipality.code,
			municipality_name: stopData.municipality.name,
			parish_id: '',
			parish_name: '',
			locality: stopData.locality || '',
			jurisdiction: stopData.jurisdiction || '',
			// GTFS
			stop_code: stopData.code,
			tts_stop_name: stopData.tts_name,
			platform_code: stopData.platform_code,
			parent_station: stopData.parent_station,
			location_type: '0',
			stop_url: `https://on.carrismetropolitana.pt/stops/${stopData.code}`,
			// Infrastructure
			has_pole: stopData.has_pole,
			has_cover: stopData.has_cover,
			has_shelter: stopData.has_shelter,
			shelter_code: stopData.shelter_code,
			shelter_maintainer: stopData.shelter_maintainer,
			has_mupi: stopData.has_mupi,
			has_bench: stopData.has_bench,
			has_trash_bin: stopData.has_trash_bin,
			has_lighting: stopData.has_lighting,
			has_electricity: stopData.has_electricity,
			docking_bay_type: stopData.docking_bay_type,
			last_infrastructure_maintenance: stopData.last_infrastructure_maintenance,
			last_infrastructure_check: stopData.last_infrastructure_check,
			// Public Information
			has_flag: stopData.has_flag,
			flag_maintainer: stopData.flag_maintainer,
			has_pip_static: stopData.has_pip_static,
			has_pip_audio: stopData.has_pip_audio,
			pip_audio_code: stopData.pip_audio_code,
			has_pip_realtime: stopData.has_pip_realtime,
			pip_realtime_code: stopData.pip_realtime_code,
			has_h2oa_signage: stopData.has_h2oa_signage,
			has_schedules: stopData.has_schedules,
			has_tactile_schedules: stopData.has_tactile_schedules,
			has_network_map: stopData.has_network_map,
			last_schedules_maintenance: stopData.last_schedules_maintenance,
			last_schedules_check: stopData.last_schedules_check,
			last_flag_maintenance: stopData.last_flag_maintenance,
			last_flag_check: stopData.last_flag_check,
			// Accessibility
			has_sidewalk: stopData.has_sidewalk,
			sidewalk_type: stopData.sidewalk_type,
			has_crossing: stopData.has_crossing,
			has_flat_access: stopData.has_flat_access,
			has_wide_access: stopData.has_wide_access,
			has_tactile_access: stopData.has_tactile_access,
			has_abusive_parking: stopData.has_abusive_parking,
			wheelchair_boarding: wheelchairBoardingFormatted,
			last_accessibility_maintenance: stopData.last_accessibility_maintenance,
			last_accessibility_check: stopData.last_accessibility_check,
			// Services
			near_health_clinic: stopData.near_health_clinic ? '1' : '0',
			near_hospital: stopData.near_hospital ? '1' : '0',
			near_university: stopData.near_university ? '1' : '0',
			near_school: stopData.near_school ? '1' : '0',
			near_police_station: stopData.near_police_station ? '1' : '0',
			near_fire_station: stopData.near_fire_station ? '1' : '0',
			near_shopping: stopData.near_shopping ? '1' : '0',
			near_historic_building: stopData.near_historic_building ? '1' : '0',
			near_transit_office: stopData.near_transit_office ? '1' : '0',
			near_beach: stopData.near_beach ? '1' : '0',
			// Connections
			subway: stopData.near_subway ? '1' : '0',
			light_rail: stopData.near_light_rail ? '1' : '0',
			train: stopData.near_train ? '1' : '0',
			boat: stopData.near_boat ? '1' : '0',
			airport: stopData.near_airport ? '1' : '0',
			bike_sharing: stopData.near_bike_sharing ? '1' : '0',
			bike_parking: stopData.near_bike_parking ? '1' : '0',
			car_parking: stopData.near_car_parking ? '1' : '0',
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
