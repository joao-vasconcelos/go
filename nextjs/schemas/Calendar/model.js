import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: CALENDAR */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const CalendarSchema = new mongoose.Schema(
	{
		code: {
			maxlength: 100,
			type: String,
			unique: true,
		},
		dates: [
			{
				maxlength: 8,
				type: String,
			},
		],
		description: {
			maxlength: 250,
			type: String,
		},
		is_locked: {
			type: Boolean,
		},
		name: {
			maxlength: 250,
			type: String,
		},
		numeric_code: {
			max: 99999,
			min: 0,
			type: Number,
			unique: true,
		},
	},
	{ timestamps: true },
);

/* * */
/* C. Mongoose Model */
export const CalendarModel = mongoose?.models?.Calendar || mongoose.model('Calendar', CalendarSchema);
