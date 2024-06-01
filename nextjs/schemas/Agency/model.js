/* * */

import mongoose from 'mongoose';

/* * */

export const AgencySchema = new mongoose.Schema(
	{
		code: {
			maxlength: 10,
			type: String,
			unique: true,
		},
		email: {
			maxlength: 50,
			type: String,
		},
		fare_url: {
			maxlength: 50,
			type: String,
		},
		is_locked: {
			type: Boolean,
		},
		lang: {
			maxlength: 50,
			type: String,
		},
		name: {
			maxlength: 50,
			type: String,
		},
		operation_start_date: {
			maxlength: 8,
			type: String,
		},
		phone: {
			maxlength: 50,
			type: String,
		},
		price_per_km: {
			type: Number,
		},
		timezone: {
			maxlength: 50,
			type: String,
		},
		total_vkm_per_year: {
			type: Number,
		},
		url: {
			maxlength: 50,
			type: String,
		},
	},
	{ timestamps: true },
);

/* * */

export const AgencyModel = mongoose?.models?.Agency || mongoose.model('Agency', AgencySchema);
