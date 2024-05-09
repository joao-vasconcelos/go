/* * */

import mongoose from 'mongoose';

/* * */

export const StopSchema = new mongoose.Schema(
	{
		//
		// General
		code: {
			type: String,
			maxlength: 6,
			unique: true,
		},
		name: {
			type: String,
			maxlength: 100,
		},
		name_new: {
			type: String,
			maxlength: 100,
		},
		short_name: {
			type: String,
			maxlength: 100,
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
		operational_status: {
			type: String,
			maxlength: 25,
		},

		// Operation
		zones: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Zone',
			},
		],

		// Administrative
		municipality: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Municipality',
		},
		parish_code: {
			type: String,
			maxlength: 100,
		},
		parish_name: {
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

		// Infrastructure
		has_pole: {
			type: String,
			maxlength: 2,
			default: '0',
		},
		has_shelter: {
			type: String,
			maxlength: 2,
			default: '0',
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
			maxlength: 2,
		},
		has_bench: {
			type: String,
			maxlength: 2,
		},
		has_trash_bin: {
			type: String,
			maxlength: 2,
		},
		has_lighting: {
			type: String,
			maxlength: 2,
		},
		has_electricity: {
			type: String,
			maxlength: 2,
		},
		docking_bay_type: {
			type: String,
			maxlength: 2,
		},
		last_infrastructure_maintenance: {
			type: String,
			maxlength: 100,
		},
		last_infrastructure_check: {
			type: String,
			maxlength: 100,
		},

		// Public Information
		has_stop_sign: {
			type: String,
			maxlength: 2,
		},
		stop_sign_maintainer: {
			type: String,
			maxlength: 2,
		},
		has_pole_frame: {
			type: String,
			maxlength: 2,
		},
		shelter_frame_area_cm: {
			type: String,
			maxlength: 100,
		},
		has_pip_real_time: {
			type: String,
			maxlength: 100,
		},
		pip_real_time_code: {
			type: String,
			maxlength: 100,
		},
		has_h2oa_signage: {
			type: String,
			maxlength: 100,
		},
		has_schedules: {
			type: String,
			maxlength: 100,
		},
		has_network_map: {
			type: String,
			maxlength: 100,
		},
		last_schedules_maintenance: {
			type: String,
			maxlength: 100,
		},
		last_schedules_check: {
			type: String,
			maxlength: 100,
		},
		last_stop_sign_maintenance: {
			type: String,
			maxlength: 100,
		},
		last_stop_sign_check: {
			type: String,
			maxlength: 100,
		},

		// Accessibility
		has_sidewalk: {
			type: String,
			maxlength: 100,
		},
		sidewalk_type: {
			type: String,
			maxlength: 100,
		},
		has_tactile_schedules: {
			type: String,
			maxlength: 100,
		},
		stop_access_type: {
			type: String,
			maxlength: 100,
		},
		has_crosswalk: {
			type: String,
			maxlength: 100,
		},
		has_tactile_pavement: {
			type: String,
			maxlength: 100,
		},
		has_abusive_parking: {
			type: String,
			maxlength: 100,
		},
		has_audio_stop_info: {
			type: String,
			maxlength: 100,
		},
		wheelchair_boarding: {
			type: String,
			maxlength: 100,
		},
		last_accessibility_check: {
			type: String,
			maxlength: 100,
		},

		// Services
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

		// Intermodal Connections
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

		// Media
		media: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Media',
			},
		],

		// Comments
		notes: {
			type: String,
			maxlength: 10000,
		},

		// Lock
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