import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: MUNICIPALITY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  code: yup.string().required().max(4),
  prefix: yup.string().required().max(2),
  name: yup.string().required().max(50),
  district: yup.string().required().max(2),
  region: yup.string().required().max(5),
});
