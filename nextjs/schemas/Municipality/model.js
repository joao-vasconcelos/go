/* * */

import mongoose from 'mongoose';

/* * */

export const MunicipalitySchema = new mongoose.Schema(
	{
		code: {
			type: String,
			maxlength: 4,
			unique: true,
		},
		prefix: {
			type: String,
			maxlength: 2,
		},
		name: {
			type: String,
			maxlength: 50,
		},
		district: {
			type: String,
			maxlength: 2,
		},
		region: {
			type: String,
			maxlength: 5,
		},
		fill_color: {
			type: String,
			maxlength: 7,
		},
		fill_opacity: {
			type: Number,
		},
		border_color: {
			type: String,
			maxlength: 7,
		},
		border_opacity: {
			type: Number,
		},
		border_width: {
			type: Number,
		},
		geojson: {
			type: {
				type: String,
				maxlength: 100,
				default: 'Feature',
			},
			geometry: {
				type: {
					type: String,
					maxlength: 100,
					default: 'Polygon',
				},
				coordinates: [mongoose.Schema.Types.Mixed],
			},
		},
		is_locked: {
			type: Boolean,
		},
	},
	{ timestamps: true },
);

/* * */

export const MunicipalityModel = mongoose?.models?.Municipality || mongoose.model('Municipality', MunicipalitySchema);