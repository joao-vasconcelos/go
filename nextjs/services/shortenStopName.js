/* * */

export default function shortenStopName(originalName = '') {
	//

	let shortName = originalName;

	// Replace "Rua"
	shortName = shortName.replace('Rua', 'R.');

	// Replace "Avenida"
	shortName = shortName.replace('Avenida', 'Av.');

	//
	return shortName;

	//
}