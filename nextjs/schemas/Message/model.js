import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: MESSAGE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
	{
		content: {
			maxlength: 5000,
			type: String,
		},
		files: [
			{
				filename: {
					maxlength: 100,
					type: String,
				},
				url: {
					maxlength: 5000,
					type: String,
				},
			},
		],
		sent_by: {
			ref: 'User',
			type: mongoose.Schema.Types.ObjectId,
		},
		thread_id: {
			ref: 'Thread',
			type: mongoose.Schema.Types.ObjectId,
		},
	},
	{ timestamps: true },
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Message || mongoose.model('Message', Schema);
