/* * */

import mongoose from 'mongoose';

/* * */

export const ZoneSchema = new mongoose.Schema(
	{
		border_color: {
			maxlength: 7,
			type: String,
		},
		border_opacity: {
			type: Number,
		},
		border_width: {
			type: Number,
		},
		code: {
			maxlength: 30,
			type: String,
			unique: true,
		},
		fill_color: {
			maxlength: 7,
			type: String,
		},
		fill_opacity: {
			type: Number,
		},
		geojson: {
			geometry: {
				coordinates: [mongoose.Schema.Types.Mixed],
				type: {
					default: 'Polygon',
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
		is_locked: {
			type: Boolean,
		},
		name: {
			maxlength: 50,
			type: String,
		},
	},
	{ timestamps: true },
);

/* * */

export const ZoneModel = mongoose?.models?.Zone || mongoose.model('Zone', ZoneSchema);
