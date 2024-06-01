/* * */

export const AlertOptions = {
	//

	/*
   * STORAGE SCOPE
   */

	cause: ['UNKNOWN_CAUSE', 'OTHER_CAUSE', 'TECHNICAL_PROBLEM', 'STRIKE', 'DEMONSTRATION', 'ACCIDENT', 'HOLIDAY', 'WEATHER', 'MAINTENANCE', 'CONSTRUCTION', 'POLICE_ACTIVITY', 'MEDICAL_EMERGENCY'],

	/*
   * STATUS
   */

	effect: ['NO_SERVICE', 'REDUCED_SERVICE', 'SIGNIFICANT_DELAYS', 'DETOUR', 'ADDITIONAL_SERVICE', 'MODIFIED_SERVICE', 'OTHER_EFFECT', 'UNKNOWN_EFFECT', 'STOP_MOVED', 'NO_EFFECT', 'ACCESSIBILITY_ISSUE'],

	/*
   * TYPE
   */

	status: ['draft', 'published'],

	/*
   * CAUSES
   * More info: https://gtfs.org/realtime/reference/#enum-cause
   */

	storage_scope: 'alerts',

	/*
   * EFFECTS
   * More info: https://gtfs.org/realtime/reference/#enum-effect
   */

	type: ['select_routes', 'select_stops', 'select_agencies'],

	//
};
