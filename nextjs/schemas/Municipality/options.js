/*
 * FIXED OPTIONS FOR MUNICIPALITY
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
   * DISTRICT
   *
   * 07 - Évora
   * 11 - Lisboa
   * 15 - Setúbal
   */

  district: [
    { value: '07', label: 'Évora' },
    { value: '11', label: 'Lisboa' },
    { value: '15', label: 'Setúbal' },
  ],

  /*
   * REGION
   *
   * PT170 - AML
   * PT16B - Oeste
   * PT187 - Alentejo Central
   */

  region: [
    { value: 'PT170', label: 'AML' },
    { value: 'PT16B', label: 'Oeste' },
    { value: 'PT187', label: 'Alentejo Central' },
  ],

  //
};
