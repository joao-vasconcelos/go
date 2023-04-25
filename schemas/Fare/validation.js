import * as yup from 'yup';

/* * */
/* DOCUMENT TYPE: AGENCY */
/* Explanation needed. */
/* * */

/* * */
/* A. YUP Validation Schema */
export const Validation = yup.object({
  fare_id: yup.string().min(2, 'ID da Agência deve ter apenas ${min} caracteres.').max(2, 'ID da Agência deve ter apenas ${max} caracteres.').required('ID da Agência é um campo obrigatório.'),
  fare_short_name: yup.string().min(2, 'Nome da Agência deve ter pelo menos ${min} caracteres.').max(100, 'Nome da Agência não deve exceder os ${max} caracteres.').required('Nome da Agência é um campo obrigatório.'),
  fare_long_name: yup.string().required('Fuso Horário é um campo obrigatório.'),
  price: yup.string().required('Idioma é um campo obrigatório.'),
  currency_type: yup.string().required('Contacto Telefónico é um campo obrigatório.'),
  payment_method: yup.string().required('Contacto Eletrónico é um campo obrigatório.'),
  transfers: yup.string().required('Website é um campo obrigatório.'),
  agency_id: yup.string().required('Website dos Tarifários é um campo obrigatório.'),
});
