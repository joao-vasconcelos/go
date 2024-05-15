/* * */

import { ArchiveModel } from '@/schemas/Archive/model';

/* * */

export default async function archivesExportDefault() {
	//

	// 1.
	// Get all archives from the database

	const allArchivesData = await ArchiveModel.find().populate('agency');

	// 2.
	// Parse each archive and format it according to the GTFS-TML specification

	const allArchivesDataFormatted = allArchivesData.map((item) => {
		return {
			archive_id: item.code,
			operator_id: item.agency?.code || 'N/A',
			archive_start_date: item.start_date,
			archive_end_date: item.end_date,
		};
	});

	// 3.
	// Sort archives by date and operator

	const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
	return allArchivesDataFormatted.sort((a, b) => collator.compare(a.archive_start_date, b.archive_start_date)).sort((a, b) => collator.compare(a.operator_id, b.operator_id));

	//
}