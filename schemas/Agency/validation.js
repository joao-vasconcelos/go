import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: AGENCY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  agency_id: yup.string().min(2, 'ID da Agência deve ter apenas ${min} caracteres.').max(2, 'ID da Agência deve ter apenas ${max} caracteres.').required('ID da Agência é um campo obrigatório.'),
  agency_name: yup.string().min(2, 'Nome da Agência deve ter pelo menos ${min} caracteres.').max(100, 'Nome da Agência não deve exceder os ${max} caracteres.').required('Nome da Agência é um campo obrigatório.'),
  agency_timezone: yup.string().required('Fuso Horário é um campo obrigatório.'),
  agency_lang: yup.string().required('Idioma é um campo obrigatório.'),
  agency_phone: yup.string().required('Contacto Telefónico é um campo obrigatório.'),
  agency_email: yup.string().required('Contacto Eletrónico é um campo obrigatório.'),
  agency_url: yup.string().required('Website é um campo obrigatório.'),
  agency_fare_url: yup.string().required('Website dos Tarifários é um campo obrigatório.'),
});
