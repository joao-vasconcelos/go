import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: PATTERN */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */

export const PatternValidation = yup.object({
  code: yup
    .string()
    .required()
    .max(25)
    .uppercase()
    .matches(/^[0-9_\s]+$/),
  parent_route: yup.string().required(),
  direction: yup.number().integer().required(),
  headsign: yup
    .string()
    .required()
    .max(50)
    .matches(/^[a-zA-ZÀ-ÿ0-9()|-\s]+$/),
  presets: yup.object({
    velocity: yup.number().integer(),
    dwell_time: yup.number().integer(),
  }),
  shape: yup.object({
    extension: yup.number(),
    //   points: yup.array(
    //     yup.object({
    //       shape_pt_lat: yup.string(),
    //       shape_pt_lon: yup.string(),
    //       shape_pt_sequence: yup.string(),
    //       shape_dist_traveled: yup.string(),
    //     })
    //   ),
  }),
  path: yup
    .array(
      yup.object({
        stop: yup.string().required(),
        allow_pickup: yup.boolean(),
        allow_drop_off: yup.boolean(),
        distance_delta: yup.number().required(),
        default_velocity: yup.number().integer().required(),
        default_travel_time: yup.number().integer().required(),
        default_dwell_time: yup.number().integer().required(),
        zones: yup.array(yup.string()),
      })
    )
    .min(2),
  schedules: yup.array(),
});
