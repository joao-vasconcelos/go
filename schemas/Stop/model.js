import mongoose from 'mongoose';

/* * */
/* DOCUMENT TYPE: STOP */
/* Explanation needed. */
/* * */

/* * */
/* A. Mongoose Schema */
export const Schema = new mongoose.Schema(
  {
    //
    // General
    stop_code: {
      type: String,
      maxlength: 6,
      unique: true,
    },
    stop_name: {
      type: String,
      maxlength: 100,
    },
    stop_short_name: {
      type: String,
      maxlength: 100,
    },
    tts_stop_name: {
      type: String,
      maxlength: 100,
    },
    stop_lat: {
      type: Number,
      required: true,
    },
    stop_lon: {
      type: Number,
      required: true,
    },
    location_type: {
      type: String,
      maxlength: 100,
    },
    platform_code: {
      type: String,
      maxlength: 100,
    },
    parent_station: {
      type: String,
      maxlength: 100,
    },
    stop_url: {
      type: String,
      maxlength: 100,
    },
    public_visible: {
      type: Boolean,
    },

    // Operation
    stop_area_1: {
      type: Boolean,
    },
    stop_area_2: {
      type: Boolean,
    },
    stop_area_3: {
      type: Boolean,
    },
    stop_area_4: {
      type: Boolean,
    },

    // Administrative
    address: {
      type: String,
      maxlength: 100,
    },
    postal_code: {
      type: String,
      maxlength: 100,
    },
    jurisdiction: {
      type: String,
      maxlength: 100,
    },
    region: {
      type: String,
      maxlength: 100,
    },
    district: {
      type: String,
      maxlength: 100,
    },
    municipality: {
      type: String,
      maxlength: 100,
    },
    parish: {
      type: String,
      maxlength: 100,
    },
    locality: {
      type: String,
      maxlength: 100,
    },
    stepp_id: {
      type: String,
      maxlength: 100,
    },

    // Infrastructure
    has_pole: {
      type: Number,
    },
    pole_material: {
      type: String,
      maxlength: 100,
    },
    has_shelter: {
      type: Number,
    },
    shelter_code: {
      type: String,
      maxlength: 100,
    },
    shelter_maintainer: {
      type: String,
      maxlength: 100,
    },
    has_mupi: {
      type: Number,
    },
    has_bench: {
      type: Number,
    },
    has_trash_bin: {
      type: Number,
    },
    has_lighting: {
      type: Number,
    },
    has_electricity: {
      type: Number,
    },
    docking_bay_type: {
      type: Number,
    },
    last_infrastructure_maintenance: {
      type: String,
      maxlength: 100,
    },
    last_infrastructure_check: {
      type: String,
      maxlength: 100,
    },

    // Public Information
    has_stop_sign: {
      type: String,
      maxlength: 100,
    },
    stop_sign_maintainer: {
      type: String,
      maxlength: 100,
    },
    has_pole_frame: {
      type: String,
      maxlength: 100,
    },
    shelter_frame_area_cm: {
      type: String,
      maxlength: 100,
    },
    has_pip_real_time: {
      type: String,
      maxlength: 100,
    },
    pip_real_time_code: {
      type: String,
      maxlength: 100,
    },
    has_h2oa_signage: {
      type: String,
      maxlength: 100,
    },
    has_schedules: {
      type: String,
      maxlength: 100,
    },
    has_network_map: {
      type: String,
      maxlength: 100,
    },
    last_schedules_maintenance: {
      type: String,
      maxlength: 100,
    },
    last_schedules_check: {
      type: String,
      maxlength: 100,
    },
    last_stop_sign_maintenance: {
      type: String,
      maxlength: 100,
    },
    last_stop_sign_check: {
      type: String,
      maxlength: 100,
    },

    // Accessibility
    has_sidewalk: {
      type: String,
      maxlength: 100,
    },
    sidewalk_type: {
      type: String,
      maxlength: 100,
    },
    has_tactile_schedules: {
      type: String,
      maxlength: 100,
    },
    stop_access_type: {
      type: String,
      maxlength: 100,
    },
    has_crosswalk: {
      type: String,
      maxlength: 100,
    },
    has_tactile_pavement: {
      type: String,
      maxlength: 100,
    },
    has_abusive_parking: {
      type: String,
      maxlength: 100,
    },
    has_audio_stop_info: {
      type: String,
      maxlength: 100,
    },
    wheelchair_boarding: {
      type: String,
      maxlength: 100,
    },
    last_accessibility_check: {
      type: String,
      maxlength: 100,
    },

    // Services
    near_health_clinic: {
      type: Boolean,
    },
    near_hospital: {
      type: Boolean,
    },
    near_university: {
      type: Boolean,
    },
    near_school: {
      type: Boolean,
    },
    near_police_station: {
      type: Boolean,
    },
    near_fire_station: {
      type: Boolean,
    },
    near_shopping: {
      type: Boolean,
    },
    near_historic_building: {
      type: Boolean,
    },
    near_transit_office: {
      type: Boolean,
    },

    // Intermodal Connections
    subway: {
      type: Boolean,
    },
    light_rail: {
      type: Boolean,
    },
    train: {
      type: Boolean,
    },
    boat: {
      type: Boolean,
    },
    airport: {
      type: Boolean,
    },
    bike_sharing: {
      type: Boolean,
    },
    bike_parking: {
      type: Boolean,
    },
    car_parking: {
      type: Boolean,
    },

    // Comments
    stop_remarks: {
      type: String,
      maxlength: 10000,
    },

    //
  },
  { timestamps: true }
);

/* * */
/* C. Mongoose Model */
export const Model = mongoose?.models?.Stop || mongoose.model('Stop', Schema);