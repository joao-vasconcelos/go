/* * */

import mongoose from 'mongoose';

/* * */

export const IssueSchema = new mongoose.Schema({
	assigned_to: {
		ref: 'User',
		type: mongoose.Schema.Types.ObjectId,
	},
	//
	code: {
		maxlength: 5,
		type: String,
	},
	//
	comments: [
		{
			created_at: {
				default: Date.now,
				type: Date,
			},
			created_by: {
				ref: 'User',
				type: mongoose.Schema.Types.ObjectId,
			},
			text: {
				maxlength: 5000,
				type: String,
			},
		},
	],
	created_at: {
		default: Date.now,
		type: Date,
	},
	//
	created_by: {
		ref: 'User',
		type: mongoose.Schema.Types.ObjectId,
	},
	due_date: {
		type: Date,
	},
	//
	is_locked: {
		type: Boolean,
	},
	//
	media: [
		{
			ref: 'Media',
			type: mongoose.Schema.Types.ObjectId,
		},
	],
	//
	milestones: [
		{
			created_at: {
				default: Date.now,
				type: Date,
			},
			created_by: {
				ref: 'User',
				type: mongoose.Schema.Types.ObjectId,
			},
			type: {
				maxlength: 50,
				type: String,
			},
			value: {
				maxlength: 100,
				type: String,
			},
		},
	],
	priority: {
		maxlength: 50,
		type: String,
	},
	related_issues: [
		{
			ref: 'Issue',
			type: mongoose.Schema.Types.ObjectId,
		},
	],
	//
	related_lines: [
		{
			ref: 'Line',
			type: mongoose.Schema.Types.ObjectId,
		},
	],
	related_reports: [
		{
			ref: 'Report',
			type: mongoose.Schema.Types.ObjectId,
		},
	],
	related_stops: [
		{
			ref: 'Stop',
			type: mongoose.Schema.Types.ObjectId,
		},
	],
	//
	status: {
		maxlength: 50,
		type: String,
	},
	summary: {
		maxlength: 5000,
		type: String,
	},
	tags: [
		{
			ref: 'Tag',
			type: mongoose.Schema.Types.ObjectId,
		},
	],
	//
	title: {
		maxlength: 100,
		type: String,
	},
	//
});

/* * */

export const IssueModel = mongoose?.models?.Issue || mongoose.model('Issue', IssueSchema);
