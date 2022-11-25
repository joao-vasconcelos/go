/* * * * * */
/* MODEL: STOP */
/* * */

/* * */
/* IMPORTS */
import mongoose from 'mongoose';

/* * */
/* Schema for MongoDB ["Stop"] Object */
module.exports =
  mongoose.models.Stop ||
  mongoose.model(
    'Stop',
    new mongoose.Schema({
      stop_id: {
        type: String,
        minlength: 2,
        maxlength: 30,
      },
      stop_code: {
        type: String,
        maxlength: 30,
      },
      stop_name: {
        type: String,
        maxlength: 2,
      },
      stop_desc: {
        type: String,
        maxlength: 9,
      },
      stop_lat: {
        type: String,
        maxlength: 50,
      },
      stop_lon: {
        type: Boolean,
        default: true,
      },
      features: {
        bench: {
          type: Boolean,
          default: true,
        },
        signage: {
          type: Boolean,
          default: true,
        },
        light: {
          type: Boolean,
          default: true,
        },
      },
    })
  );

// INTERMODAL
// door: null;
// external_id: '11_2943';
// has_abusive_parking: null;
// has_accessibility: null;
// has_bench: null;
// has_crossing: null;
// has_flag: null;
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
