/* * */

import * as yup from 'yup';

/* * */

export const ZoneValidation = yup.object({
	border_color: yup.string().max(7),
	border_opacity: yup.number().min(0).max(1),
	border_width: yup.number().min(0).max(6),
	code: yup
		.string()
		.required()
		.max(30, 'ID da Zona deve ter apenas ${max} caracteres.')
		.transform(value => value.replace(/  +/g, ' ').trim()),
	fill_color: yup.string().max(7),
	fill_opacity: yup.number().min(0).max(1),
	name: yup
		.string()
		.max(100, 'Nome da Zona não deve exceder os ${max} caracteres.')
		.transform(value => value.replace(/  +/g, ' ').trim()),
	//   geojson: yup.object(),
});
