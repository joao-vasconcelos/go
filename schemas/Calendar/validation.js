import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: CALENDAR */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  calendar_code: yup.string().max(100, 'ID da Agência deve ter apenas ${max} caracteres.'),
  calendar_name: yup.string().max(100, 'Nome da Agência não deve exceder os ${max} caracteres.'),
  agencies: yup.array(yup.string()),
  dates: yup.array(),
});
