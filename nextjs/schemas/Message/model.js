import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: MESSAGE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
	{
		thread_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Thread',
		},
		content: {
			type: String,
			maxlength: 5000,
		},
		sent_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		files: [
			{
				filename: {
					type: String,
					maxlength: 100,
				},
				url: {
					type: String,
					maxlength: 5000,
				},
			},
		],
	},
	{ timestamps: true },
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Message || mongoose.model('Message', Schema);