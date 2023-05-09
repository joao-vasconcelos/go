import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: DATE */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  date: yup.string().max(8, 'Field_ ${max} caracteres.'),
  period: yup.number(),
  notes: yup.string().max(5000, 'Field_ ${max} caracteres.'),
});
