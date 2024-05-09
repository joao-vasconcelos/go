/* * */

import * as yup from 'yup';

/* * */

export const AgencyValidation = yup.object({
	code: yup
		.string()
		.required()
		.max(2, 'ID da Agência deve ter apenas ${max} caracteres.')
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	name: yup
		.string()
		.max(100, 'Nome da Agência não deve exceder os ${max} caracteres.')
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	timezone: yup
		.string()
		.required('Fuso Horário é um campo obrigatório.')
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	lang: yup
		.string()
		.required('Idioma é um campo obrigatório.')
		.transform((value) => value.replace(/  +/g, ' ').trim()),
	phone: yup.string().transform((value) => value.replace(/  +/g, ' ').trim()),
	email: yup.string().transform((value) => value.replace(/  +/g, ' ').trim()),
	url: yup.string().transform((value) => value.replace(/  +/g, ' ').trim()),
	fare_url: yup.string().transform((value) => value.replace(/  +/g, ' ').trim()),
	operation_start_date: yup.string().max(8, 'Data de Início da Operação deve ter apenas ${max} caracteres.'),
	price_per_km: yup.number(),
	total_vkm_per_year: yup.number(),
});