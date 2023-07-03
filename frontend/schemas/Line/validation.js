import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: LINE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  code: yup.string().required().max(5),
  name: yup.string().required().max(150),
  short_name: yup.string().required().max(5),
  transport_type: yup.number().integer().required(),
  circular: yup.boolean(),
  school: yup.boolean(),
  continuous: yup.boolean(),
  typology: yup.string().required(),
  fare: yup.string().required(),
  agency: yup.string().required(),
  routes: yup.array(yup.string()),
});
