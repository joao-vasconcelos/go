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

  workdir: 'exports',
  storage_scope: 'exports',

  /*
   * KIND
   */

  kind: ['gtfs_v29', 'netex_v1', 'regional_merge_v1'],

  /*
   * STATUS
   */

  status: ['WAITING', 'PROGRESS', 'COMPLETED', 'ERROR'],

  //
};
