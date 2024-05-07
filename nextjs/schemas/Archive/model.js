/* * */

import mongoose from 'mongoose';

/* * */

export const ArchiveSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			maxlength: 10,
			unique: true,
		},
		status: {
			type: String,
			maxlength: 50,
		},
		agency: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Agency',
		},
		start_date: {
			type: Date,
		},
		end_date: {
			type: Date,
		},
		reference_plan: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Media',
		},
		offer_plan: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Media',
		},
		operation_plan: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Media',
		},
		apex_files: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Media',
		},
		is_locked: {
			type: Boolean,
		},
		slamanager_feeder_status: {
			type: String,
		},
	},
	{ timestamps: true },
);

/* * */

export const ArchiveModel = mongoose?.models?.Archive || mongoose.model('Archive', ArchiveSchema);