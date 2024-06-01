/* * */

import mongoose from 'mongoose';

/* * */

export const AuditTripSchema = new mongoose.Schema(
	{
		//
		code: {
			maxlength: 100,
			// Code is = date|trip_id (unique trip_id)
			type: String,
			unique: true,
		},
		docking_bay_type: {
			maxlength: 2,
			type: String,
		},
		flag_maintainer: {
			maxlength: 2,
			type: String,
		},
		has_abusive_parking: {
			maxlength: 100,
			type: String,
		},
		has_audio_stop_info: {
			maxlength: 100,
			type: String,
		},
		has_bench: {
			maxlength: 2,
			type: String,
		},
		has_crossing: {
			maxlength: 100,
			type: String,
		},
		has_electricity: {
			maxlength: 2,
			type: String,
		},
		// Public Information
		has_flag: {
			maxlength: 2,
			type: String,
		},
		has_h2oa_signage: {
			maxlength: 100,
			type: String,
		},
		has_lighting: {
			maxlength: 2,
			type: String,
		},
		has_mupi: {
			maxlength: 2,
			type: String,
		},
		has_network_map: {
			maxlength: 100,
			type: String,
		},

		has_pip_realtime: {
			maxlength: 100,
			type: String,
		},

		// Infrastructure
		has_pole: {
			default: '0',
			maxlength: 2,
			type: String,
		},
		has_pole_frame: {
			maxlength: 2,
			type: String,
		},
		has_schedules: {
			maxlength: 100,
			type: String,
		},
		has_shelter: {
			default: '0',
			maxlength: 2,
			type: String,
		},
		// Accessibility
		has_sidewalk: {
			maxlength: 100,
			type: String,
		},

		has_tactile_access: {
			maxlength: 100,
			type: String,
		},
		has_tactile_schedules: {
			maxlength: 100,
			type: String,
		},
		has_trash_bin: {
			maxlength: 2,
			type: String,
		},
		// Lock
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
		// Media
		media: [
			{
				ref: 'Media',
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		// Administrative
		municipality: {
			ref: 'Municipality',
			type: mongoose.Schema.Types.ObjectId,
		},
		//
		name: {
			maxlength: 100,
			type: String,
		},
		name_new: {
			maxlength: 100,
			type: String,
		},
		near_airport: {
			type: Boolean,
		},
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

		// Services
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
		near_school: {
			type: Boolean,
		},
		near_shopping: {
			type: Boolean,
		},
		// Intermodal Connections
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
		// Comments
		notes: {
			maxlength: 10000,
			type: String,
		},
		operational_status: {
			maxlength: 25,
			type: String,
		},
		parent_station: {
			maxlength: 6,
			type: String,
		},
		parish_code: {
			maxlength: 100,
			type: String,
		},
		parish_name: {
			maxlength: 100,
			type: String,
		},
		pip_real_time_code: {
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

		shelter_frame_area_cm: {
			maxlength: 100,
			type: String,
		},
		shelter_maintainer: {
			maxlength: 100,
			type: String,
		},
		short_name: {
			maxlength: 100,
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
		//
		status: {
			maxlength: 100,
			type: String,
		},
		stop_access_type: {
			maxlength: 100,
			type: String,
		},
		//
		trip_id: {
			maxlength: 100,
			type: String,
		},

		tts_name: {
			maxlength: 500,
			type: String,
		},

		wheelchair_boarding: {
			maxlength: 100,
			type: String,
		},

		// Operation
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

/* * */

export const DeletedStopSchema = new mongoose.Schema({
	code: { maxlength: 6, type: String, unique: true },
	latitude: { required: true, type: Number },
	longitude: { required: true, type: Number },
	name: { maxlength: 500, type: String },
});

/* * */

export const DeletedStopModel = mongoose?.models?.DeletedStop || mongoose.model('DeletedStop', DeletedStopSchema);
