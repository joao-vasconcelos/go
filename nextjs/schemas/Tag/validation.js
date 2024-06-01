/* * */

import * as yup from 'yup';

/* * */

export const TagValidation = yup.object({
	label: yup
		.string()
		.required()
		.max(20)
		.transform(value => value.replace(/  +/g, ' ').trim())
		.uppercase(),
});
