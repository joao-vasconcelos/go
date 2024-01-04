import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: FARE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const AlertValidation = yup.object({
  code: yup.string(),
  published: yup.boolean(),
  title: yup.string().max(250),
  active_period_start: yup.date(),
  active_period_end: yup.date(),
  municipalities: yup.array(yup.string()),
  lines: yup.array(yup.string()),
  stops: yup.array(yup.string()),
  cause: yup.string().max(50),
  effect: yup.string().max(50),
  description: yup.string().max(2500),
  images: yup.array(),
  url: yup.string().max(500),
  created_by: yup.string().max(500),
});
