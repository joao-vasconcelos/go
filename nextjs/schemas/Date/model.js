/* * */

import mongoose from 'mongoose';

/* * */

export const DateSchema = new mongoose.Schema(
	{
		date: {
			maxlength: 8,
			type: String,
			unique: true,
		},
		is_holiday: {
			default: false,
			type: Boolean,
		},
		notes: {
			maxlength: 5000,
			type: String,
		},
		period: {
			maxlength: 1,
			type: String,
		},
	},
	{ timestamps: true },
);

/* * */

export const DateModel = mongoose?.models?.Date || mongoose.model('Date', DateSchema);
