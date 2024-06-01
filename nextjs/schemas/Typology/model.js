/* * */

import mongoose from 'mongoose';

/* * */
export const TypologySchema = new mongoose.Schema(
	{
		code: {
			maxlength: 10,
			type: String,
			unique: true,
		},
		color: {
			maxlength: 7,
			type: String,
		},
		default_onboard_fares: [
			{
				ref: 'Fare',
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		default_prepaid_fare: {
			ref: 'Fare',
			type: mongoose.Schema.Types.ObjectId,
		},
		is_locked: {
			type: Boolean,
		},
		name: {
			maxlength: 50,
			type: String,
		},
		short_name: {
			maxlength: 50,
			type: String,
		},
		text_color: {
			maxlength: 7,
			type: String,
		},
	},
	{ timestamps: true },
);

/* * */
/* C. Mongoose Model */
export const TypologyModel = mongoose?.models?.Typology || mongoose.model('Typology', TypologySchema);
