import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: PATTERN */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  code: yup.string().required().max(25),
  parent_route: yup.string().required(),
  direction: yup.number().integer().required(),
  headsign: yup.string().required().max(50),
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
  schedules: yup.array().min(1),
});
