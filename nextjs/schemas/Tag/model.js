/* * */

import mongoose from 'mongoose';

/* * */

export const TagSchema = new mongoose.Schema({
	color: {
		default: '#5aaf00',
		maxlength: 50,
		type: String,
	},
	created_at: {
		default: Date.now,
		type: Date,
	},
	//
	created_by: {
		ref: 'User',
		type: mongoose.Schema.Types.ObjectId,
	},
	description: {
		maxlength: 500,
		type: String,
	},
	//
	is_locked: {
		type: Boolean,
	},
	//
	label: {
		maxlength: 20,
		type: String,
		unique: true,
	},
	text_color: {
		default: '#ffffff',
		maxlength: 50,
		type: String,
	},
	//
});

/* * */

export const TagModel = mongoose?.models?.Tag || mongoose.model('Tag', TagSchema);
