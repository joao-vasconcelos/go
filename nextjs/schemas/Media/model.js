/* * */

import mongoose from 'mongoose';

/* * */

export const MediaSchema = new mongoose.Schema({
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
	file_extension: {
		maxlength: 6,
		type: String,
	},
	file_mime_type: {
		maxlength: 50,
		type: String,
	},
	//
	file_size: {
		type: Number,
	},
	//
	is_locked: {
		type: Boolean,
	},
	//
	storage_scope: {
		maxlength: 50,
		type: String,
	},
	//
	title: {
		maxlength: 50,
		type: String,
	},
	//
});

/* * */

export const MediaModel = mongoose?.models?.Media || mongoose.model('Media', MediaSchema);
