import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: THREAD */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
	{
		associated_lines: [
			{
				ref: 'Line',
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		associated_stops: [
			{
				ref: 'Stop',
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		owner: {
			ref: 'User',
			type: mongoose.Schema.Types.ObjectId,
		},
		status: {
			maxlength: 50,
			type: String,
		},
		subject: {
			maxlength: 100,
			type: String,
		},
		theme: {
			maxlength: 50,
			type: String,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		virtuals: {
			messages: {
				options: {
					foreignField: 'thread_id',
					localField: '_id',
					ref: 'Message',
				},
			},
		},
	},
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Thread || mongoose.model('Thread', Schema);
