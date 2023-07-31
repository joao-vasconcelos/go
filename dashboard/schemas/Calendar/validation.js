import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: CALENDAR */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  code: yup
    .string()
    .required()
    .max(100)
    .uppercase()
    .matches(/^[a-zA-Z0-9]+$/),
  name: yup
    .string()
    .required()
    .max(250)
    .matches(/^[a-zA-ZÀ-ÿ0-9(),|-\s]+$/),
  description: yup
    .string()
    .required()
    .max(250)
    .matches(/^[a-zA-ZÀ-ÿ0-9().|-\s]+$/),
  dates: yup.array(yup.string().max(8)),
});
