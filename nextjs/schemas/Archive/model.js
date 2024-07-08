/* * */

import mongoose from 'mongoose';

/* * */

export const ArchiveSchema = new mongoose.Schema(
	{
		agency: {
			ref: 'Agency',
			type: mongoose.Schema.Types.ObjectId,
		},
		apex_files: {
			ref: 'Media',
			type: mongoose.Schema.Types.ObjectId,
		},
		code: {
			maxlength: 10,
			type: String,
			unique: true,
		},
		end_date: {
			maxlength: 8,
			type: String,
		},
		is_locked: {
			type: Boolean,
		},
		offer_plan: {
			ref: 'Media',
			type: mongoose.Schema.Types.ObjectId,
		},
		operation_plan: {
			ref: 'Media',
			type: mongoose.Schema.Types.ObjectId,
		},
		reference_plan: {
			ref: 'Media',
			type: mongoose.Schema.Types.ObjectId,
		},
		slamanager_feeder_last_processed_date: {
			type: String,
		},
		slamanager_feeder_status: {
			type: String,
		},
		start_date: {
			maxlength: 8,
			type: String,
		},
		status: {
			maxlength: 50,
			type: String,
		},
	},
	{ timestamps: true },
);

/* * */

export const ArchiveModel = mongoose?.models?.Archive || mongoose.model('Archive', ArchiveSchema);
