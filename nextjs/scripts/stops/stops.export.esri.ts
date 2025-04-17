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

export default async function stopsExportEsri() {
	//

	AgencyModel.syncIndexes();
	LineModel.syncIndexes();
	MunicipalityModel.syncIndexes();

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
			case StopPropertyWheelchairBoarding.No:
				wheelchairBoardingFormatted = '2';
				break;
			case StopPropertyWheelchairBoarding.Yes:
				wheelchairBoardingFormatted = '1';
				break;
			case StopPropertyWheelchairBoarding.Unknown:
			default:
				wheelchairBoardingFormatted = '0';
				break;
		}

		// 3.4.
		// Build the final stop object

		return {

			// objectid --> skip
			// datainicioutilizacao --> skip
			// datafimutilizacao --> skip
			// datainicioversao --> skip
			// datafimversao --> skip
			// estadoparagem --> skip
			// utilizadorcriacao --> skip
			// datacriacao --> skip
			// utilizadoratualizacao --> skip
			// dataatualizacao --> skip
			// globalid --> skip

			// General
			stop_id: stopData.code,
			stop_name: stopData.name,
			stop_short_name: stopData.short_name,
			tts_stop_name: stopData.tts_name,
			stop_lat: stopData.latitude.toFixed(6),
			y: stopData.latitude.toFixed(6),
			stop_lon: stopData.longitude.toFixed(6),
			x: stopData.longitude.toFixed(6),

			// Operation
			stop_area_1: thisStopAgencyCodes.includes('41') ? '1' : '0',
			stop_area_2: thisStopAgencyCodes.includes('42') ? '1' : '0',
			stop_area_3: thisStopAgencyCodes.includes('43') ? '1' : '0',
			stop_area_4: thisStopAgencyCodes.includes('44') ? '1' : '0',

			// Administrative
			address: stopData.address,
			postal_code: stopData.postal_code,
			jurisdiction: stopData.jurisdiction,
			district: stopData.municipality.district,
			district_description: thisStopDistrictName,
			region_id: stopData.municipality.region,
			region_name: thisStopRegionName,
			municipality: stopData.municipality.code,
			municipality_description: stopData.municipality.name,
			parish: '',
			parish_description: '',
			locality: stopData.locality,
			stepp_id: '',

			// Infrastructure
			last_stop_update: stopData.updatedAt,
			has_pole: stopData.has_pole,
			pole_material: stopData.pole_material,
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
			has_stop_sign: stopData.has_flag,
			stop_sign_maintainer: stopData.flag_maintainer,
			has_pole_frame: stopData.has_pip_static,
			shelter_frame_area_cm: '',
			has_pip_real_time: stopData.has_pip_realtime,
			has_h2oa_signage: stopData.has_h2oa_signage,
			has_schedules: stopData.has_schedules,
			has_network_map: stopData.has_network_map,
			last_schedules_maintenance: stopData.last_schedules_maintenance,
			last_schedules_check: stopData.last_schedules_check,
			last_stop_sign_maintenance: stopData.last_flag_maintenance,
			last_stop_sign_check: stopData.last_flag_check,
			has_sidewalk: stopData.has_sidewalk,
			sidewalk_type: stopData.sidewalk_type,
			has_tactile_schedules: stopData.has_tactile_schedules,
			stop_access_type: '',
			has_crosswalk: '',
			has_tactile_pavement: stopData.has_tactile_access,
			has_abusive_parking: stopData.has_abusive_parking,
			has_audio_stop_info: stopData.has_pip_audio,
			wheelchair_boarding: wheelchairBoardingFormatted,
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

			stop_remarks: '',

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
