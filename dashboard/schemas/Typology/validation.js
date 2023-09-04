import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: TYPOLOGY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const TypologyValidation = yup.object({
  code: yup.string().required().max(10),
  name: yup.string().max(100),
  short_name: yup.string().max(100),
  color: yup.string().max(100),
  text_color: yup.string().max(100),
});
