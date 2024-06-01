/* * */

import mongoose from 'mongoose';

/* * */

export const AlertSchema = new mongoose.Schema({
	active_period_end: {
		type: Date,
	},
	//
	active_period_start: {
		type: Date,
	},
	affected_agencies: [
		{
			agency_id: {
				maxlength: 10,
				type: String,
			},
		},
	],
	affected_municipalities: [
		{
			municipality_id: {
				maxlength: 10,
				type: String,
			},
		},
	],
	affected_routes: [
		{
			route_id: {
				maxlength: 10,
				type: String,
			},
			specific_stops: [
				{
					maxlength: 10,
					type: String,
				},
			],
		},
	],
	//
	affected_stops: [
		{
			specific_routes: [
				{
					maxlength: 10,
					type: String,
				},
			],
			stop_id: {
				maxlength: 10,
				type: String,
			},
		},
	],
	//
	cause: {
		maxlength: 50,
		type: String,
	},
	//
	code: {
		maxlength: 200,
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
		maxlength: 5000,
		type: String,
	},
	effect: {
		maxlength: 50,
		type: String,
	},
	//
	is_locked: {
		type: Boolean,
	},
	media: {
		ref: 'Media',
		type: mongoose.Schema.Types.ObjectId,
	},
	publish_end: {
		type: Date,
	},
	publish_start: {
		type: Date,
	},
	//
	status: {
		default: 'draft',
		maxlength: 30,
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
	type: {
		maxlength: 50,
		type: String,
	},
	//
	url: {
		maxlength: 50,
		type: String,
	},
	//
});

/* * */

export const AlertModel = mongoose?.models?.Alert || mongoose.model('Alert', AlertSchema);
