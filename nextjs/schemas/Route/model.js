import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: ROUTE */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const RouteSchema = new mongoose.Schema(
	{
		code: {
			maxlength: 15,
			type: String,
			unique: true,
		},
		is_locked: {
			type: Boolean,
		},
		name: {
			maxlength: 150,
			type: String,
		},
		parent_line: {
			ref: 'Line',
			type: mongoose.Schema.Types.ObjectId,
		},
		path_type: {
			default: '1',
			maxlength: 2,
			type: String,
		},
		patterns: [
			{
				ref: 'Pattern',
				type: mongoose.Schema.Types.ObjectId,
			},
		],
	},
	{ timestamps: true },
);

/* * */
/* C. Mongoose Model */
export const RouteModel = mongoose?.models?.Route || mongoose.model('Route', RouteSchema);
