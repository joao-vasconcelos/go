/* * */

import * as yup from 'yup';

/* * */

export const FareValidation = yup.object({
	code: yup
		.string()
		.max(10, 'ID da Agência deve ter apenas ${max} caracteres.')
		.transform(value => value.replace(/  +/g, ' ').trim()),
	currency_type: yup.string().transform(value => value.replace(/  +/g, ' ').trim()),
	name: yup.string().transform(value => value.replace(/  +/g, ' ').trim()),
	payment_method: yup.string().transform(value => value.replace(/  +/g, ' ').trim()),
	price: yup.number().min(0),
	short_name: yup
		.string()
		.max(100, 'Nome da Agência não deve exceder os ${max} caracteres.')
		.transform(value => value.replace(/  +/g, ' ').trim()),
	transfers: yup.string().transform(value => value.replace(/  +/g, ' ').trim()),
});
