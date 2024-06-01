/* * */

export const UserDefault = {
	email: '',
	emailVerified: '',
	is_locked: false,
	last_active: '',
	name: '',
	permissions: {
		//
		agencies: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		alerts: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		archives: {
			create: { is_allowed: false },
			delete: { fields: { agency: [] }, is_allowed: false },
			edit: { fields: { agency: [] }, is_allowed: false },
			lock: { fields: { agency: [] }, is_allowed: false },
			navigate: { is_allowed: false },
			view: { fields: { agency: [] }, is_allowed: false },
		},
		//
		audits: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		calendars: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			edit_dates: { is_allowed: false },
			export_dates: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		configs: {
			admin: { is_allowed: false },
		},
		//
		exports: {
			create: { fields: { agency: [], kind: [] }, is_allowed: false },
			delete: { fields: { agency: [], kind: [] }, is_allowed: false },
			download: { fields: { agency: [], kind: [] }, is_allowed: false },
			lock: { fields: { agency: [], kind: [] }, is_allowed: false },
			navigate: { is_allowed: false },
			view: { fields: { agency: [], kind: [] }, is_allowed: false },
		},
		//
		fares: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		feedback: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		issues: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		lines: {
			create: { fields: { agencies: [] }, is_allowed: false },
			delete: { fields: { agencies: [] }, is_allowed: false },
			edit: { fields: { agencies: [] }, is_allowed: false },
			lock: { fields: { agencies: [] }, is_allowed: false },
			navigate: { is_allowed: false },
			view: { fields: { agencies: [] }, is_allowed: false },
		},
		//
		media: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		municipalities: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		reports: {
			download: { fields: { kind: [] }, is_allowed: false },
			navigate: { is_allowed: false },
			view: { fields: { kind: [] }, is_allowed: false },
		},
		//
		stops: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			edit_code: { is_allowed: false },
			edit_location: { is_allowed: false },
			edit_name: { is_allowed: false },
			edit_zones: { is_allowed: false },
			export: { is_allowed: false },
			export_deleted: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		tags: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		typologies: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		users: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
		zones: {
			create: { is_allowed: false },
			delete: { is_allowed: false },
			edit: { is_allowed: false },
			lock: { is_allowed: false },
			navigate: { is_allowed: false },
			view: { is_allowed: false },
		},
		//
	},
	phone: '',
};
