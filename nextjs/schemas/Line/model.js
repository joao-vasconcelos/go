/* * */

import mongoose from 'mongoose';

/* * */

export const LineSchema = new mongoose.Schema(
	{
		agency: {
			ref: 'Agency',
			type: mongoose.Schema.Types.ObjectId,
		},
		circular: {
			type: Boolean,
		},
		code: {
			maxlength: 5,
			type: String,
			unique: true,
		},
		continuous: {
			type: Boolean,
		},
		interchange: {
			default: '0',
			maxlength: 1,
			type: String,
		},
		is_locked: {
			type: Boolean,
		},
		name: {
			maxlength: 150,
			type: String,
		},
		onboard_fares: [
			{
				ref: 'Fare',
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		prepaid_fare: {
			ref: 'Fare',
			type: mongoose.Schema.Types.ObjectId,
		},
		routes: [
			{
				ref: 'Route',
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		school: {
			type: Boolean,
		},
		short_name: {
			maxlength: 5,
			type: String,
		},
		transport_type: {
			maxlength: 2,
			type: String,
		},
		typology: {
			ref: 'Typology',
			type: mongoose.Schema.Types.ObjectId,
		},
	},
	{ timestamps: true },
);

/* * */

export const LineModel = mongoose?.models?.Line || mongoose.model('Line', LineSchema);
