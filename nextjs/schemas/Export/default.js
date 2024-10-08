/* * */

export const ExportDefault = {
	filename: '',
	kind: null,
	progress_current: 0,
	progress_total: 0,
	status: 'PROCESSING',
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
	calendars_clip_end_date: null,
	calendars_clip_start_date: null,
	clip_calendars: true,
	feed_end_date: null,
	feed_start_date: null,
	lines_exclude: [],
	lines_include: [],
	numeric_calendar_codes: false,
	stop_sequence_start: 1,
};

/* * */

export const ExportFormDefaultNetexV1 = {
	agency_id: null,
	calendars_clip_end_date: null,
	calendars_clip_start_date: null,
	clip_calendars: true,
	feed_end_date: null,
	feed_start_date: null,
	lines_excluded: [],
	lines_included: [],
	numeric_calendar_codes: false,
	stop_sequence_start: 1,
};

/* * */

export const ExportFormDefaultRegionalMergeV1 = {
	active_date: new Date(),
};

/* * */

export const ExportFormDefaultSlaDebugV1 = {
	agency_id: null,
	debug_date: null,
};

/* * */

export const ExportFormDefaultSlaDefaultV1 = {
	agency_id: null,
	end_date: null,
	start_date: null,
};

/* * */

export const ExportFormDefaultSlaPublishV1 = {
	end_date: null,
	start_date: null,
};
