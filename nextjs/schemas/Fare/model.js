/* * */

import mongoose from 'mongoose';

/* * */

export const FareSchema = new mongoose.Schema(
	{
		code: {
			maxlength: 10,
			type: String,
			unique: true,
		},
		currency_type: {
			maxlength: 50,
			type: String,
		},
		is_locked: {
			type: Boolean,
		},
		name: {
			maxlength: 50,
			type: String,
		},
		payment_method: {
			maxlength: 50,
			type: String,
		},
		price: {
			maxlength: 50,
			type: Number,
		},
		short_name: {
			maxlength: 50,
			type: String,
		},
		transfers: {
			maxlength: 50,
			type: String,
		},
	},
	{ timestamps: true },
);

/* * */

export const FareModel = mongoose?.models?.Fare || mongoose.model('Fare', FareSchema);
