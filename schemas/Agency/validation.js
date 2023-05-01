import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: AGENCY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  agency_code: yup.string().max(2, 'ID da Agência deve ter apenas ${max} caracteres.'),
  agency_name: yup.string().max(100, 'Nome da Agência não deve exceder os ${max} caracteres.'),
  agency_timezone: yup.string().required('Fuso Horário é um campo obrigatório.'),
  agency_lang: yup.string().required('Idioma é um campo obrigatório.'),
  agency_phone: yup.string().required('Contacto Telefónico é um campo obrigatório.'),
  agency_email: yup.string().required('Contacto Eletrónico é um campo obrigatório.'),
  agency_url: yup.string().required('Website é um campo obrigatório.'),
  agency_fare_url: yup.string().required('Website dos Tarifários é um campo obrigatório.'),
});
