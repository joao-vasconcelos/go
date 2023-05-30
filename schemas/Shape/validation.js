import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: SHAPE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  code: yup.string().max(50, 'Código da Shape deve ter apenas ${max} caracteres.'),
  name: yup.string().max(50, 'ID da Agência deve ter apenas ${max} caracteres.'),
  distance: yup.number(),
  //   points: yup.array(
  //     yup.object({
  //       shape_pt_lat: yup.string(),
  //       shape_pt_lon: yup.string(),
  //       shape_pt_sequence: yup.string(),
  //       shape_dist_traveled: yup.string(),
  //     })
  //   ),
});
