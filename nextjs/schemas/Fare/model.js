/* * */

import mongoose from 'mongoose';

/* * */

export const FareSchema = new mongoose.Schema(
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
		short_name: {
			type: String,
			maxlength: 50,
		},
		price: {
			type: Number,
			maxlength: 50,
		},
		currency_type: {
			type: String,
			maxlength: 50,
		},
		payment_method: {
			type: String,
			maxlength: 50,
		},
		transfers: {
			type: String,
			maxlength: 50,
		},
		is_locked: {
			type: Boolean,
		},
	},
	{ timestamps: true },
);

/* * */

export const FareModel = mongoose?.models?.Fare || mongoose.model('Fare', FareSchema);