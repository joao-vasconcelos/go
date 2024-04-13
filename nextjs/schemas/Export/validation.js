/* * */

import * as yup from 'yup';

/* * */

export const ExportValidation = yup.object({
  kind: yup.string().required(),
  status: yup.string().required(),
  progress_current: yup.number().required(),
  progress_total: yup.number().required(),
  filename: yup.string().required(),
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
  lines_included: yup.array(yup.string),
  lines_excluded: yup.array(yup.string),
  feed_start_date: yup.string(),
  feed_end_date: yup.string(),
  clip_calendars: yup.boolean(),
  calendars_clip_start_date: yup.string(),
  calendars_clip_end_date: yup.string(),
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
