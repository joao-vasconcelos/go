import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: SHAPE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  shape_id: yup.string().max(50, 'ID da Agência deve ter apenas ${max} caracteres.'),
  shape_name: yup.string().max(50, 'ID da Agência deve ter apenas ${max} caracteres.'),
  shape_distance: yup.number(),
  //   points: yup.array(
  //     yup.object({
  //       shape_pt_lat: yup.string(),
  //       shape_pt_lon: yup.string(),
  //       shape_pt_sequence: yup.string(),
  //       shape_dist_traveled: yup.string(),
  //     })
  //   ),
});
