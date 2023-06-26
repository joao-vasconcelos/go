import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: TYPOLOGY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  code: yup.string().required().max(2, 'ID da Zona deve ter apenas ${max} caracteres.'),
  name: yup.string().max(100, 'Nome da Zona não deve exceder os ${max} caracteres.'),
  short_name: yup.string().max(100, 'Nome da Zona não deve exceder os ${max} caracteres.'),
  color: yup.string().max(100, 'Nome da Zona não deve exceder os ${max} caracteres.'),
  text_color: yup.string().max(100, 'Nome da Zona não deve exceder os ${max} caracteres.'),
});
