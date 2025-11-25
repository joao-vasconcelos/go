/* * */

import faresExportAttributes from '@/scripts/fares/fares.export.attributes';

/* * */

export default async function handler(req, res) {
	try {
		const allFareAttributesExportedData = await faresExportAttributes({});
		await res.send(allFareAttributesExportedData);
	}
	catch (error) {
		console.log(error);
		return await res.status(500).json({ message: 'Cannot export from found documents.' });
	}
}
