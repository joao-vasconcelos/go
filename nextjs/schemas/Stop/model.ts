/* * */

import mongoose from 'mongoose';
import { StopOptions, StopPropertyDockingBayType, StopPropertyHasAbusiveParking, StopPropertyHasBench, StopPropertyHasCrossing, StopPropertyHasElectricity, StopPropertyHasFlag, StopPropertyHasFlatAccess, StopPropertyHasH2oaSignage, StopPropertyHasLighting, StopPropertyHasMupi, StopPropertyHasNetworkMap, StopPropertyHasPipAudio, StopPropertyHasPipRealtime, StopPropertyHasPipStatic, StopPropertyHasPole, StopPropertyHasSchedules, StopPropertyHasShelter, StopPropertyHasSidewalk, StopPropertyHasTactileAccess, StopPropertyHasTactileSchedules, StopPropertyHasTrashBin, StopPropertyHasWideAccess, StopPropertyOperationalStatus, StopPropertyWheelchairBoarding } from '@/schemas/Stop/options';

/* * */

export const StopSchema = new mongoose.Schema(
	{

		/*
     * GENERAL
     */

		code: {
			type: String,
			maxlength: 6,
			unique: true,
		},
		name: {
			type: String,
			maxlength: StopOptions.max_stop_name_length,
		},
		name_new: {
			type: String,
			maxlength: StopOptions.max_stop_name_length,
		},
		short_name: {
			type: String,
			maxlength: StopOptions.max_stop_short_name_length,
		},
		short_name_auto: {
			type: Boolean,
			default: true,
		},
		tts_name: {
			type: String,
			maxlength: 500,
		},
		latitude: {
			type: Number,
			required: true,
		},
		longitude: {
			type: Number,
			required: true,
		},
		platform_code: {
			type: String,
			maxlength: 100,
		},
		parent_station: {
			type: String,
			maxlength: 6,
		},

		/*
		* OPERATION
		*/

		operational_status: {
			type: String,
			maxlength: 25,
			default: StopPropertyOperationalStatus.Active,
		},
		zones: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Zone',
			},
		],

		/*
     * ADMINISTRATIVE
     */

		municipality: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Municipality',
		},
		parish: {
			type: String,
			maxlength: 100,
		},
		locality: {
			type: String,
			maxlength: 100,
		},
		jurisdiction: {
			type: String,
			maxlength: 100,
		},

		/*
     * INFRASTRUCTURE
     */

		has_pole: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasPole.Unknown,
		},
		has_cover: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasShelter.Unknown,
		},
		has_shelter: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasShelter.Unknown,
		},
		shelter_code: {
			type: String,
			maxlength: 100,
		},
		shelter_maintainer: {
			type: String,
			maxlength: 100,
		},
		has_mupi: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasMupi.Unknown,
		},
		has_bench: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasBench.Unknown,
		},
		has_trash_bin: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasTrashBin.Unknown,
		},
		has_lighting: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasLighting.Unknown,
		},
		has_electricity: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasElectricity.Unknown,
		},
		docking_bay_type: {
			type: String,
			maxlength: 50,
			default: StopPropertyDockingBayType.Unknown,
		},
		last_infrastructure_maintenance: {
			type: String,
			maxlength: 100,
		},
		last_infrastructure_check: {
			type: String,
			maxlength: 100,
		},

		/*
     * PUBLIC INFORMATION
     */

		has_flag: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasFlag.Unknown,
		},
		flag_maintainer: {
			type: String,
			maxlength: 100,
		},
		has_pip_static: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasPipStatic.Unknown,
		},
		has_pip_audio: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasPipAudio.Unknown,
		},
		pip_audio_code: {
			type: String,
			maxlength: 100,
		},
		has_pip_realtime: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasPipRealtime.Unknown,
		},
		pip_realtime_code: {
			type: String,
			maxlength: 100,
		},
		has_h2oa_signage: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasH2oaSignage.Unknown,
		},
		has_schedules: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasSchedules.Unknown,
		},
		has_tactile_schedules: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasTactileSchedules.Unknown,
		},
		has_network_map: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasNetworkMap.Unknown,
		},
		last_schedules_maintenance: {
			type: String,
			maxlength: 100,
		},
		last_schedules_check: {
			type: String,
			maxlength: 100,
		},
		last_flag_maintenance: {
			type: String,
			maxlength: 100,
		},
		last_flag_check: {
			type: String,
			maxlength: 100,
		},

		/*
     * ACCESSIBILITY
     */

		has_sidewalk: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasSidewalk.Unknown,
		},
		sidewalk_type: {
			type: String,
			maxlength: 100,
		},
		has_crossing: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasCrossing.Unknown,
		},
		has_flat_access: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasFlatAccess.Unknown,
		},
		has_wide_access: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasWideAccess.Unknown,
		},
		has_tactile_access: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasTactileAccess.Unknown,
		},
		has_abusive_parking: {
			type: String,
			maxlength: 50,
			default: StopPropertyHasAbusiveParking.Unknown,
		},
		wheelchair_boarding: {
			type: String,
			maxlength: 50,
			default: StopPropertyWheelchairBoarding.Unknown,
		},
		last_accessibility_maintenance: {
			type: String,
			maxlength: 100,
		},
		last_accessibility_check: {
			type: String,
			maxlength: 100,
		},

		/*
     * SERVICES
     */

		near_health_clinic: {
			type: Boolean,
		},
		near_hospital: {
			type: Boolean,
		},
		near_university: {
			type: Boolean,
		},
		near_school: {
			type: Boolean,
		},
		near_police_station: {
			type: Boolean,
		},
		near_fire_station: {
			type: Boolean,
		},
		near_shopping: {
			type: Boolean,
		},
		near_historic_building: {
			type: Boolean,
		},
		near_transit_office: {
			type: Boolean,
		},
		near_beach: {
			type: Boolean,
		},

		/*
     * CONNECTIONS
     */

		near_subway: {
			type: Boolean,
		},
		near_light_rail: {
			type: Boolean,
		},
		near_train: {
			type: Boolean,
		},
		near_boat: {
			type: Boolean,
		},
		near_airport: {
			type: Boolean,
		},
		near_bike_sharing: {
			type: Boolean,
		},
		near_bike_parking: {
			type: Boolean,
		},
		near_car_parking: {
			type: Boolean,
		},

		/*
     * MEDIA
     */

		media: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Media',
			},
		],

		/*
     * USER NOTES
     */

		notes: {
			type: String,
			maxlength: 10000,
		},

		/*
     * LOCK STATUS
     */

		is_locked: {
			type: Boolean,
		},

		//
	},
	{ timestamps: true },
);

/* * */

export const StopModel = mongoose?.models?.Stop || mongoose.model('Stop', StopSchema);

/* * */

export const DeletedStopSchema = new mongoose.Schema({
	code: { type: String, maxlength: 6, unique: true },
	name: { type: String, maxlength: 500 },
	latitude: { type: Number, required: true },
	longitude: { type: Number, required: true },
});

/* * */

export const DeletedStopModel = mongoose?.models?.DeletedStop || mongoose.model('DeletedStop', DeletedStopSchema);