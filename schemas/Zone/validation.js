import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: AGENCY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  code: yup.string().required().max(10, 'ID da Zona deve ter apenas ${max} caracteres.'),
  name: yup.string().max(100, 'Nome da Zona não deve exceder os ${max} caracteres.'),
});
