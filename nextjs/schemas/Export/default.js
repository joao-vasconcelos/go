/* * */

export const ExportDefault = {
	kind: null,
	status: 'PROCESSING',
	progress_current: 0,
	progress_total: 0,
	filename: '',
	workdir: '',
};

/* * */

export const ExportFormDefault = {
	kind: null,
	notify_user: true,
};

/* * */

export const ExportFormDefaultGtfsV29 = {
	agency_id: null,
	lines_include: [],
	lines_exclude: [],
	feed_start_date: null,
	feed_end_date: null,
	clip_calendars: true,
	calendars_clip_start_date: null,
	calendars_clip_end_date: null,
	numeric_calendar_codes: false,
	stop_sequence_start: 1,
};

/* * */

export const ExportFormDefaultNetexV1 = {
	agency_id: null,
	lines_included: [],
	lines_excluded: [],
	feed_start_date: null,
	feed_end_date: null,
	clip_calendars: true,
	calendars_clip_start_date: null,
	calendars_clip_end_date: null,
	numeric_calendar_codes: false,
	stop_sequence_start: 1,
};

/* * */

export const ExportFormDefaultRegionalMergeV1 = {
	active_date: new Date,
};