/* * */

const numericSet = '0123456789';
const alphanumericSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/* * */

export default function generator({ length = 2, type = 'alphanumeric' }) {
	//

	let allowedCharacters;

	switch (type) {
	case 'numeric':
		allowedCharacters = numericSet;
		break;
	default:
		allowedCharacters = alphanumericSet;
		break;
	}

	let result = '';

	for (let i = 0; i < length; i++) {
		result += allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length));
	}

	return result;

	//
}