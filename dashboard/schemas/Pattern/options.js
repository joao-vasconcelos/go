/*
 * FIXED OPTIONS FOR PATTERN
 * These options are here because they should not, or don't need to be,
 * editable by any user. Most of them are encoded as part of the GTFS specification.
 *
 */

//
//
//

export const PatternOptions = {
  //

  /*
   * VEHICLE TYPE
   *
   * 0 - Any Vehicle Type
   * 1 - Urban Mini
   * 2 - Urban Midi
   * 3 - Urban Standard
   * 4 - Urban Articulated
   * 5 - Inter-urban Standard
   * 6 - Inter-urban Articulated
   * 7 - Touristic
   */

  vehicle_type: [0, 1, 2, 3, 4, 5, 6, 7],

  /*
   * PROPULSION
   *
   * 0 - Any Propulsion Type
   * 1 - Gasoline
   * 2 - Diesel
   * 3 - LPG Auto
   * 4 - Mixture
   * 5 - Biodisel
   * 6 - Electricity
   * 7 - Hybrid
   * 8 - Natural Gas
   */

  vehicle_propulsion: [0, 1, 2, 3, 4, 5, 6, 7, 8],

  //
};
