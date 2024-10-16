/* * */

import * as yup from 'yup';

/* * */

export const DateValidation = yup.object({
	date: yup.string().max(8),
	is_holiday: yup.boolean().default(false),
	notes: yup
		.string()
		.max(5000)
		.transform(value => value.replace(/  +/g, ' ').trim()),
	period: yup.string().max(1),
});
