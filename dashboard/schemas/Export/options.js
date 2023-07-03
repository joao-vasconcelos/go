/*
 * FIXED OPTIONS FOR EXPORT
 * These options are here because they should not, or don't need to be,
 * editable by any user. Most of them are encoded as part of the GTFS specification.
 *
 */

//
//
//

export const Options = {
  //

  /*
   * TYPE
   *
   * 0 - Unknown Type
   * 1 - GTFS v18
   * 2 - GTFS v29
   * 3 - GTFS v30
   * 4 - Ticket Zoning
   */

  type: [0, 1, 2, 3, 4],

  /*
   * STATUS
   *
   * 0 - Waiting
   * 1 - Processing
   * 2 - Completed
   * 5 - Error
   */

  status: [0, 1, 2, 5],

  //
};
