/* * */

import mongoose from 'mongoose';

/* * */

export const ExportSchema = new mongoose.Schema({
	createdAt: {
		default: Date.now,
		expires: 14400, // Auto remove document after x seconds have passed from createdAt value
		type: Date,
	},
	exported_by: {
		ref: 'User',
		type: mongoose.Schema.Types.ObjectId,
	},
	filename: {
		maxlength: 50,
		type: String,
	},
	kind: {
		maxlength: 50,
		type: String,
	},
	notify_user: {
		type: Boolean,
	},
	progress_current: {
		type: Number,
	},
	progress_total: {
		type: Number,
	},
	status: {
		maxlength: 50,
		type: String,
	},
	workdir: {
		maxlength: 200,
		type: String,
	},
});

/* * */

export const ExportModel = mongoose?.models?.Export || mongoose.model('Export', ExportSchema);
