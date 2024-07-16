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
	* KIND
	*/

	kind: ['gtfs_v29', 'netex_v1', 'regional_merge_v1', 'sla_debug_v1', 'sla_default_v1'],

	/*
   * STATUS
   */

	status: ['WAITING', 'PROGRESS', 'COMPLETED', 'ERROR'],

	/*
   * STORAGE SCOPE
   */

	storage_scope: 'exports',

	/*
   * WORKDIR
   */

	workdir: 'exports',

	//
};
