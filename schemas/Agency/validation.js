import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: AGENCY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  agency_code: yup.string().required().max(2, 'ID da Agência deve ter apenas ${max} caracteres.'),
  agency_name: yup.string().max(100, 'Nome da Agência não deve exceder os ${max} caracteres.'),
  agency_timezone: yup.string().required('Fuso Horário é um campo obrigatório.'),
  agency_lang: yup.string().required('Idioma é um campo obrigatório.'),
  agency_phone: yup.string(),
  agency_email: yup.string(),
  agency_url: yup.string(),
  agency_fare_url: yup.string(),
});
