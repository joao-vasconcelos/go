import * as yup from 'yup';
import mongoose from 'mongoose';

/* * */
/* SCHEMA: STOP DOCUMENT */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  unique_code: yup
    .string()
    .min(6, 'Unique Code must have exactly ${min} characters')
    .max(6, 'Unique Code must have exactly ${max} characters')
    .required('Unique Code is a required field'),
  name: yup.string().max(50, 'Name must be no longer than ${max} characters'),
  short_name: yup.string().max(15, 'Short Name must be no longer than ${max} characters'),
  description: yup.string().max(300, 'Description must be no longer than ${max} characters'),
  latitude: yup.number(),
  longitude: yup.number(),
});

/* * */
/* B. MongoDB Model Schema */
export const Model =
  mongoose?.models?.Stop ||
  mongoose.model(
    'Stop',
    new mongoose.Schema({
      unique_code: {
        type: String,
        minlength: 6,
        maxlength: 6,
      },
      name: {
        type: String,
        maxlength: 50,
      },
      short_name: {
        type: String,
        maxlength: 15,
      },
      description: {
        type: String,
        maxlength: 300,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      features: {
        has_bench: {
          type: Boolean,
          default: true,
        },
        has_crossing: {
          type: Boolean,
          default: true,
        },
        has_flag: {
          type: Boolean,
          default: true,
        },
        has_abusive_parking: {
          type: Boolean,
          default: true,
        },
        has_accessibility: {
          type: Boolean,
          default: true,
        },
        has_schedules: {
          type: Boolean,
          default: true,
        },
      },
    })
  );

// INTERMODAL
// door: null;
// external_id: '11_2943';
// has_illuminated_path: null;
// has_outdated_info: null;
// has_schedules: null;
// has_shelter: null;
// has_sidewalk: null;
// has_trash_can: null;
// has_visibility_from_area: null;
// has_visibility_from_within: null;
// id: 3364;
// illumination_position: null;
// illumination_strength: null;
// is_damaged: null;
// is_illumination_working: null;
// is_vandalized: null;
// is_visible_from_outside: null;
// lat: 38.7121904463394;
// locality: null;
// lon: -8.97949222793943;
// name: 'Montijo (R Papoilas 11)';
// notes: null;
// official_name: null;
// osm_name: null;
// parish: null;
// short_name: 'Montijo (R Papoilas 11)';
// source: 'tst';
// street: null;
// succeeded_by: null;
// tags: [];
// update_date: '2022-11-21 23:01:05.587243126 +00:00';
// updater: 1;
