/* * */

import mongoose from 'mongoose';

/* * */

export const AgencySchema = new mongoose.Schema(
	{
		code: {
			type: String,
			maxlength: 10,
			unique: true,
		},
		name: {
			type: String,
			maxlength: 50,
		},
		timezone: {
			type: String,
			maxlength: 50,
		},
		lang: {
			type: String,
			maxlength: 50,
		},
		phone: {
			type: String,
			maxlength: 50,
		},
		email: {
			type: String,
			maxlength: 50,
		},
		url: {
			type: String,
			maxlength: 50,
		},
		fare_url: {
			type: String,
			maxlength: 50,
		},
		operation_start_date: {
			type: String,
			maxlength: 8,
		},
		price_per_km: {
			type: Number,
		},
		total_vkm_per_year: {
			type: Number,
		},
		is_locked: {
			type: Boolean,
		},
	},
	{ timestamps: true },
);

/* * */

export const AgencyModel = mongoose?.models?.Agency || mongoose.model('Agency', AgencySchema);