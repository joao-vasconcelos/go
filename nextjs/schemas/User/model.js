/* * */

import mongoose from 'mongoose';

/* * */

export const UserSchema = new mongoose.Schema(
	{
		email: {
			maxlength: 50,
			type: String,
			unique: true,
		},
		is_locked: {
			type: Boolean,
		},
		last_active: {
			type: Date,
		},
		name: {
			maxlength: 50,
			type: String,
		},
		permissions: {
			//
			agencies: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			alerts: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			archives: {
				create: { is_allowed: { type: Boolean } },
				delete: { fields: { agency: [{ type: String }] }, is_allowed: { type: Boolean } },
				edit: { fields: { agency: [{ type: String }] }, is_allowed: { type: Boolean } },
				lock: { fields: { agency: [{ type: String }] }, is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { fields: { agency: [{ type: String }] }, is_allowed: { type: Boolean } },
			},
			//
			audits: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			calendars: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				edit_dates: { is_allowed: { type: Boolean } },
				export_dates: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			configs: {
				admin: { is_allowed: { type: Boolean } },
			},
			//
			exports: {
				create: { fields: { agency: [{ type: String }], kind: [{ type: String }] }, is_allowed: { type: Boolean } },
				delete: { fields: { agency: [{ type: String }], kind: [{ type: String }] }, is_allowed: { type: Boolean } },
				download: { fields: { agency: [{ type: String }], kind: [{ type: String }] }, is_allowed: { type: Boolean } },
				lock: { fields: { agency: [{ type: String }], kind: [{ type: String }] }, is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { fields: { agency: [{ type: String }], kind: [{ type: String }] }, is_allowed: { type: Boolean } },
			},
			//
			fares: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			feedback: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			issues: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			lines: {
				create: { is_allowed: { type: Boolean } },
				delete: { fields: { agencies: [{ type: String }] }, is_allowed: { type: Boolean } },
				edit: { fields: { agencies: [{ type: String }] }, is_allowed: { type: Boolean } },
				lock: { fields: { agencies: [{ type: String }] }, is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { fields: { agencies: [{ type: String }] }, is_allowed: { type: Boolean } },
			},
			//
			media: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			municipalities: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			reports: {
				download: { fields: { kind: [{ type: String }] }, is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { fields: { kind: [{ type: String }] }, is_allowed: { type: Boolean } },
			},
			//
			stops: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				edit_code: { is_allowed: { type: Boolean } },
				edit_location: { is_allowed: { type: Boolean } },
				edit_name: { is_allowed: { type: Boolean } },
				edit_zones: { is_allowed: { type: Boolean } },
				export: { is_allowed: { type: Boolean } },
				export_deleted: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			tags: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			typologies: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			users: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
			zones: {
				create: { is_allowed: { type: Boolean } },
				delete: { is_allowed: { type: Boolean } },
				edit: { is_allowed: { type: Boolean } },
				lock: { is_allowed: { type: Boolean } },
				navigate: { is_allowed: { type: Boolean } },
				view: { is_allowed: { type: Boolean } },
			},
			//
		},
		phone: {
			maxlength: 50,
			type: String,
		},
	},
	{ timestamps: true },
);

/* * */

export const UserModel = mongoose?.models?.User || mongoose.model('User', UserSchema);
