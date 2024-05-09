/* * */

import mongoose from 'mongoose';

/* * */

export const IssueSchema = new mongoose.Schema({
	//
	code: {
		type: String,
		maxlength: 5,
	},
	//
	created_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	//
	title: {
		type: String,
		maxlength: 100,
	},
	summary: {
		type: String,
		maxlength: 5000,
	},
	tags: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tag',
		},
	],
	//
	status: {
		type: String,
		maxlength: 50,
	},
	priority: {
		type: String,
		maxlength: 50,
	},
	due_date: {
		type: Date,
	},
	assigned_to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	//
	related_lines: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Line',
		},
	],
	related_stops: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Stop',
		},
	],
	related_reports: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Report',
		},
	],
	related_issues: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Issue',
		},
	],
	//
	media: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Media',
		},
	],
	//
	comments: [
		{
			created_by: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			created_at: {
				type: Date,
				default: Date.now,
			},
			text: {
				type: String,
				maxlength: 5000,
			},
		},
	],
	//
	milestones: [
		{
			created_by: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			created_at: {
				type: Date,
				default: Date.now,
			},
			type: {
				type: String,
				maxlength: 50,
			},
			value: {
				type: String,
				maxlength: 100,
			},
		},
	],
	//
	is_locked: {
		type: Boolean,
	},
	//
});

/* * */

export const IssueModel = mongoose?.models?.Issue || mongoose.model('Issue', IssueSchema);