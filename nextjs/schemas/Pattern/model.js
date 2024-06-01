/* * */

import mongoose from 'mongoose';

/* * */

export const PatternSchema = new mongoose.Schema(
	{
		code: {
			maxlength: 25,
			type: String,
			unique: true,
		},
		destination: {
			maxlength: 100,
			type: String,
		},
		headsign: {
			maxlength: 100,
			type: String,
		},
		is_locked: {
			type: Boolean,
		},
		origin: {
			maxlength: 100,
			type: String,
		},
		parent_line: {
			ref: 'Line',
			type: mongoose.Schema.Types.ObjectId,
		},
		parent_route: {
			ref: 'Route',
			type: mongoose.Schema.Types.ObjectId,
		},
		path: [
			{
				allow_drop_off: {
					type: Boolean,
				},
				allow_pickup: {
					type: Boolean,
				},
				default_dwell_time: {
					type: Number,
				},
				default_travel_time: {
					type: Number,
				},
				default_velocity: {
					type: Number,
				},
				distance_delta: {
					type: Number,
				},
				stop: {
					ref: 'Stop',
					type: mongoose.Schema.Types.ObjectId,
				},
				zones: [
					{
						ref: 'Zone',
						type: mongoose.Schema.Types.ObjectId,
					},
				],
			},
		],
		presets: {
			dwell_time: {
				default: 0,
				type: Number,
			},
			velocity: {
				default: 20,
				type: Number,
			},
		},
		schedules: [
			{
				calendar_desc: {
					maxlength: 500,
					type: String,
				},
				calendars_off: [
					{
						ref: 'Calendar',
						type: mongoose.Schema.Types.ObjectId,
					},
				],
				calendars_on: [
					{
						ref: 'Calendar',
						type: mongoose.Schema.Types.ObjectId,
					},
				],
				path_overrides: [
					{
						dwell_time: {
							type: Number,
						},
						sequence_index: {
							type: Number,
						},
						travel_time: {
							type: Number,
						},
						velocity: {
							type: Number,
						},
					},
				],
				start_time: {
					maxlength: 100,
					type: String,
				},
				vehicle_features: {
					allow_bicycles: {
						default: true,
						type: Boolean,
					},
					passenger_counting: {
						type: Boolean,
					},
					propulsion: {
						default: '0',
						maxlength: 2,
						type: String,
					},
					type: {
						default: '0',
						maxlength: 2,
						type: String,
					},
					video_surveillance: {
						type: Boolean,
					},
				},
			},
		],
		shape: {
			extension: {
				type: Number,
			},
			geojson: {
				geometry: {
					coordinates: [
						[
							{
								type: Number,
							},
						],
					],
					type: {
						default: 'LineString',
						maxlength: 100,
						type: String,
					},
				},
				type: {
					default: 'Feature',
					maxlength: 100,
					type: String,
				},
			},
			points: [
				{
					shape_dist_traveled: {
						type: Number,
					},
					shape_pt_lat: {
						type: Number,
					},
					shape_pt_lon: {
						type: Number,
					},
					shape_pt_sequence: {
						type: Number,
					},
				},
			],
		},
	},
	{ timestamps: true },
);

/* * */

export const PatternModel = mongoose?.models?.Pattern || mongoose.model('Pattern', PatternSchema);
