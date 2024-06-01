/* * */

import * as yup from 'yup';

/* * */

export const LineValidation = yup.object({
	agency: yup.string().required(),
	circular: yup.boolean(),
	code: yup
		.string()
		.required()
		.max(5)
		.uppercase()
		.matches(/^[0-9]+$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	continuous: yup.boolean(),
	interchange: yup.string().max(1).required(),
	name: yup
		.string()
		.required()
		.max(150)
		.matches(/^[a-zA-ZÀ-ÿ0-9()|ºª.'-\s]+$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	onboard_fares: yup.array(yup.string()),
	prepaid_fare: yup.string().nullable(),
	routes: yup.array(yup.string()),
	school: yup.boolean(),
	short_name: yup
		.string()
		.required()
		.max(5)
		.uppercase()
		.matches(/^[a-zA-ZÀ-ÿ0-9()|-\s]+$/)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	transport_type: yup.string().required().max(2),
	typology: yup.string().required(),
});
