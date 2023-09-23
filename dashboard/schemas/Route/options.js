/*
 * FIXED OPTIONS FOR ROUTE
 * These options are here because they should not, or don't need to be,
 * editable by any user. Most of them are encoded as part of the GTFS specification.
 *
 */

//
//
//

export const RouteOptions = {
  //

  /*
   * PATH TYPE
   *
   * 0 - Tram, Streetcar, Light rail. Any light rail or street level system within a metropolitan area
   * 1 - Subway, Metro. Any underground rail system within a metropolitan area
   * 2 - Rail. Used for intercity or long-distance travel.
   */

  path_type: ['0', '1', '2'],

  //
};
