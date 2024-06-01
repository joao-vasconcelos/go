/* * */

import { StopOptions, StopPropertyDockingBayType, StopPropertyHasAbusiveParking, StopPropertyHasBench, StopPropertyHasCrossing, StopPropertyHasElectricity, StopPropertyHasFlag, StopPropertyHasFlatAccess, StopPropertyHasH2oaSignage, StopPropertyHasLighting, StopPropertyHasMupi, StopPropertyHasNetworkMap, StopPropertyHasPipAudio, StopPropertyHasPipRealtime, StopPropertyHasPipStatic, StopPropertyHasPole, StopPropertyHasSchedules, StopPropertyHasShelter, StopPropertyHasSidewalk, StopPropertyHasTactileAccess, StopPropertyHasTactileSchedules, StopPropertyHasTrashBin, StopPropertyHasWideAccess, StopPropertyOperationalStatus, StopPropertyWheelchairBoarding } from '@/schemas/Stop/options';
import mongoose from 'mongoose';

/* * */

export const StopSchema = new mongoose.Schema(
	{

		/*
     * GENERAL
     */

		code: {
			maxlength: 6,
			type: String,
			unique: true,
		},
		docking_bay_type: {
			default: StopPropertyDockingBayType.Unknown,
			maxlength: 50,
			type: String,
		},
		flag_maintainer: {
			maxlength: 100,
			type: String,
		},
		has_abusive_parking: {
			default: StopPropertyHasAbusiveParking.Unknown,
			maxlength: 50,
			type: String,
		},
		has_bench: {
			default: StopPropertyHasBench.Unknown,
			maxlength: 50,
			type: String,
		},
		has_cover: {
			default: StopPropertyHasShelter.Unknown,
			maxlength: 50,
			type: String,
		},
		has_crossing: {
			default: StopPropertyHasCrossing.Unknown,
			maxlength: 50,
			type: String,
		},
		has_electricity: {
			default: StopPropertyHasElectricity.Unknown,
			maxlength: 50,
			type: String,
		},
		has_flag: {
			default: StopPropertyHasFlag.Unknown,
			maxlength: 50,
			type: String,
		},
		has_flat_access: {
			default: StopPropertyHasFlatAccess.Unknown,
			maxlength: 50,
			type: String,
		},

		/*
		* OPERATION
		*/

		has_h2oa_signage: {
			default: StopPropertyHasH2oaSignage.Unknown,
			maxlength: 50,
			type: String,
		},
		has_lighting: {
			default: StopPropertyHasLighting.Unknown,
			maxlength: 50,
			type: String,
		},

		/*
     * ADMINISTRATIVE
     */

		has_mupi: {
			default: StopPropertyHasMupi.Unknown,
			maxlength: 50,
			type: String,
		},
		has_network_map: {
			default: StopPropertyHasNetworkMap.Unknown,
			maxlength: 50,
			type: String,
		},
		has_pip_audio: {
			default: StopPropertyHasPipAudio.Unknown,
			maxlength: 50,
			type: String,
		},
		has_pip_realtime: {
			default: StopPropertyHasPipRealtime.Unknown,
			maxlength: 50,
			type: String,
		},

		/*
     * INFRASTRUCTURE
     */

		has_pip_static: {
			default: StopPropertyHasPipStatic.Unknown,
			maxlength: 50,
			type: String,
		},
		has_pole: {
			default: StopPropertyHasPole.Unknown,
			maxlength: 50,
			type: String,
		},
		has_schedules: {
			default: StopPropertyHasSchedules.Unknown,
			maxlength: 50,
			type: String,
		},
		has_shelter: {
			default: StopPropertyHasShelter.Unknown,
			maxlength: 50,
			type: String,
		},
		has_sidewalk: {
			default: StopPropertyHasSidewalk.Unknown,
			maxlength: 50,
			type: String,
		},
		has_tactile_access: {
			default: StopPropertyHasTactileAccess.Unknown,
			maxlength: 50,
			type: String,
		},
		has_tactile_schedules: {
			default: StopPropertyHasTactileSchedules.Unknown,
			maxlength: 50,
			type: String,
		},
		has_trash_bin: {
			default: StopPropertyHasTrashBin.Unknown,
			maxlength: 50,
			type: String,
		},
		has_wide_access: {
			default: StopPropertyHasWideAccess.Unknown,
			maxlength: 50,
			type: String,
		},
		is_locked: {
			type: Boolean,
		},
		jurisdiction: {
			maxlength: 100,
			type: String,
		},
		last_accessibility_check: {
			maxlength: 100,
			type: String,
		},
		last_accessibility_maintenance: {
			maxlength: 100,
			type: String,
		},

		/*
     * PUBLIC INFORMATION
     */

		last_flag_check: {
			maxlength: 100,
			type: String,
		},
		last_flag_maintenance: {
			maxlength: 100,
			type: String,
		},
		last_infrastructure_check: {
			maxlength: 100,
			type: String,
		},
		last_infrastructure_maintenance: {
			maxlength: 100,
			type: String,
		},
		last_schedules_check: {
			maxlength: 100,
			type: String,
		},
		last_schedules_maintenance: {
			maxlength: 100,
			type: String,
		},
		latitude: {
			required: true,
			type: Number,
		},
		locality: {
			maxlength: 100,
			type: String,
		},
		longitude: {
			required: true,
			type: Number,
		},
		media: [
			{
				ref: 'Media',
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		municipality: {
			ref: 'Municipality',
			type: mongoose.Schema.Types.ObjectId,
		},
		name: {
			maxlength: StopOptions.max_stop_name_length,
			type: String,
		},
		name_new: {
			maxlength: StopOptions.max_stop_name_length,
			type: String,
		},
		near_airport: {
			type: Boolean,
		},
		near_beach: {
			type: Boolean,
		},

		/*
     * ACCESSIBILITY
     */

		near_bike_parking: {
			type: Boolean,
		},
		near_bike_sharing: {
			type: Boolean,
		},
		near_boat: {
			type: Boolean,
		},
		near_car_parking: {
			type: Boolean,
		},
		near_fire_station: {
			type: Boolean,
		},
		near_health_clinic: {
			type: Boolean,
		},
		near_historic_building: {
			type: Boolean,
		},
		near_hospital: {
			type: Boolean,
		},
		near_light_rail: {
			type: Boolean,
		},
		near_police_station: {
			type: Boolean,
		},

		/*
     * SERVICES
     */

		near_school: {
			type: Boolean,
		},
		near_shopping: {
			type: Boolean,
		},
		near_subway: {
			type: Boolean,
		},
		near_train: {
			type: Boolean,
		},
		near_transit_office: {
			type: Boolean,
		},
		near_university: {
			type: Boolean,
		},
		notes: {
			maxlength: 10000,
			type: String,
		},
		operational_status: {
			default: StopPropertyOperationalStatus.Active,
			maxlength: 25,
			type: String,
		},
		parent_station: {
			maxlength: 6,
			type: String,
		},
		parish: {
			maxlength: 100,
			type: String,
		},

		/*
     * CONNECTIONS
     */

		pip_audio_code: {
			maxlength: 100,
			type: String,
		},
		pip_realtime_code: {
			maxlength: 100,
			type: String,
		},
		platform_code: {
			maxlength: 100,
			type: String,
		},
		shelter_code: {
			maxlength: 100,
			type: String,
		},
		shelter_maintainer: {
			maxlength: 100,
			type: String,
		},
		short_name: {
			maxlength: StopOptions.max_stop_short_name_length,
			type: String,
		},
		short_name_auto: {
			default: true,
			type: Boolean,
		},
		sidewalk_type: {
			maxlength: 100,
			type: String,
		},

		/*
     * MEDIA
     */

		tts_name: {
			maxlength: 500,
			type: String,
		},

		/*
     * USER NOTES
     */

		wheelchair_boarding: {
			default: StopPropertyWheelchairBoarding.Unknown,
			maxlength: 50,
			type: String,
		},

		/*
     * LOCK STATUS
     */

		zones: [
			{
				ref: 'Zone',
				type: mongoose.Schema.Types.ObjectId,
			},
		],

		//
	},
	{ timestamps: true },
);

/* * */

export const StopModel = mongoose?.models?.Stop || mongoose.model('Stop', StopSchema);

export const DeletedStopModel = mongoose?.models?.DeletedStop || mongoose.model('DeletedStop', StopSchema);
