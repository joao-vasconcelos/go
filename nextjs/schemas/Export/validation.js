/* * */

import * as yup from 'yup';

/* * */

export const ExportValidation = yup.object({
	filename: yup.string().required(),
	kind: yup.string().required(),
	progress_current: yup.number().required(),
	progress_total: yup.number().required(),
	status: yup.string().required(),
	workdir: yup.string().required(),
});

/* * */

export const ExportFormValidation = yup.object({
	kind: yup.string().required(),
	notify_user: yup.boolean(),
});

/* * */

export const ExportFormValidationGtfsV29 = yup.object({
	agency_id: yup.string(),
	calendars_clip_end_date: yup.string(),
	calendars_clip_start_date: yup.string(),
	clip_calendars: yup.boolean(),
	feed_end_date: yup.string(),
	feed_start_date: yup.string(),
	lines_excluded: yup.array(yup.string),
	lines_included: yup.array(yup.string),
	numeric_calendar_codes: yup.boolean(),
	stop_sequence_start: yup.number(),
});

/* * */

export const ExportFormValidationNetexV1 = yup.object({
	agency_id: yup.string().nullable(),
});

/* * */

export const ExportFormValidationRegionalMergeV1 = yup.object({
	//   agency_id: yup.string().nullable(),
});

/* * */

export const ExportFormValidationSlaDebugV1 = yup.object({
	agency_id: yup.string(),
	debug_date: yup.string(),
});

/* * */

export const ExportFormValidationSlaDefaultV1 = yup.object({
	agency_id: yup.string(),
	end_date: yup.string(),
	start_date: yup.string(),
});
