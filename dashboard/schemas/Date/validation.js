import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: DATE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  date: yup.string().max(8),
  period: yup.number(),
  day_type: yup.number(),
  is_holiday: yup.boolean(),
  notes: yup.string().max(5000),
});
