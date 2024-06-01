/*
 * FIXED OPTIONS FOR EXPORT
 * These options are here because they should not, or don't need to be,
 * editable by any user. Most of them are encoded as part of the GTFS specification.
 *
 */

//
//
//

export const ExportOptions = {
	//

	/*
   * STORAGE SCOPE
   */

	kind: ['gtfs_v29', 'netex_v1', 'regional_merge_v1'],
	status: ['WAITING', 'PROGRESS', 'COMPLETED', 'ERROR'],

	/*
   * KIND
   */

	storage_scope: 'exports',

	/*
   * STATUS
   */

	workdir: 'exports',

	//
};
