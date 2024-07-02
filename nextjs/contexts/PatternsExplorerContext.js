'use client';

/* * */

import isAllowed from '@/authentication/isAllowed';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import { useRoutesExplorerContext } from '@/contexts/RoutesExplorerContext';
import { PatternDefault, PatternPathDefault, PatternScheduleDefault, PatternShapePointDefault } from '@/schemas/Pattern/default';
import { PatternValidation } from '@/schemas/Pattern/validation';
import API from '@/services/API';
import populate from '@/services/populate';
import { useRouter } from '@/translations/navigation';
import { useForm, yupResolver } from '@mantine/form';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

const PatternsExplorerContext = createContext(null);

export function usePatternsExplorerContext() {
	return useContext(PatternsExplorerContext);
}

/* * */

const initialDataState = {
	//
	all_zones_data: [],
	//
	is_error: false,
	is_loading: false,
	//
};

const initialPageState = {
	//
	active_section: null,
	//
	is_admin: false,
	//
	is_error: false,
	is_error_saving: false,
	is_loading: false,
	//
	is_read_only: false,
	is_saving: false,
	//
};

const initialSchedulesSectionState = {
	//
	available_calendars: [],
	//
	selected_calendar: null,
	//
};

/* * */

export function PatternsExplorerContextProvider({ children }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { pattern_id: itemId } = useParams();

	const linesExplorerContext = useLinesExplorerContext();
	const routesExplorerContext = useRoutesExplorerContext();

	//
	// B. Setup state

	const [dataState, setDataState] = useState(initialDataState);
	const [pageState, setPageState] = useState(initialPageState);
	const [schedulesSectionState, setSchedulesSectionState] = useState(initialSchedulesSectionState);

	//
	// C. Setup form

	const formState = useForm({
		clearInputErrorOnChange: true,
		initialValues: PatternDefault,
		validate: yupResolver(PatternValidation),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	//
	// D. Fetch data

	const { data: sessionData } = useSession();
	const { data: allZonesData } = useSWR('/api/zones');
	const { data: allCalendarsData } = useSWR('/api/calendars');
	const { mutate: parentRouteMutate } = useSWR(routesExplorerContext.item_id && `/api/routes/${routesExplorerContext.item_id}`);
	const { data: itemData, isLoading: itemLoading, mutate: itemMutate } = useSWR(itemId && `/api/patterns/${itemId}`);

	//
	// E. Transform data

	useEffect(() => {
		setPageState(prev => ({ ...prev, is_loading: itemLoading }));
	}, [itemLoading]);

	useEffect(() => {
		// Return if no data is available
		if (!allZonesData) return;
		// Filter items based on search query
		const allZonesDataFormatted = allZonesData.map((item) => {
			return { label: item.name || '-', value: item._id };
		});
		// Update state
		setDataState(prev => ({ ...prev, all_zones_data: allZonesDataFormatted }));
		//
	}, [allZonesData]);

	useEffect(() => {
		// Return if no data is available
		if (!allCalendarsData) return;
		// Filter items based on search query
		const allCalendarsDataFormatted = allCalendarsData.map((item) => {
			return { label: `[${item.code}] ${item.name || '-'}`, value: item._id };
		});
		// Update state
		setDataState(prev => ({ ...prev, all_calendars_data: allCalendarsDataFormatted }));
		//
	}, [allCalendarsData]);

	useEffect(() => {
		// Check if the use is allowed to edit the current page
		const isReadOnly = !isAllowed(sessionData, [{ action: 'edit', scope: 'lines' }], { handleError: true }) || itemData?.is_locked || pageState.is_saving || linesExplorerContext.item_data?.is_locked || routesExplorerContext.item_data?.is_locked;
		// Update state
		setPageState(prev => ({ ...prev, is_read_only: isReadOnly }));
		//
	}, [itemData?.is_locked, linesExplorerContext.item_data?.is_locked, pageState.is_saving, routesExplorerContext.item_data?.is_locked, sessionData]);

	useEffect(() => {
		// Check if the use is allowed to edit the current page
		const isAdmin = isAllowed(sessionData, [{ action: 'admin', scope: 'configs' }], { handleError: true });
		// Update state
		setPageState(prev => ({ ...prev, is_admin: isAdmin }));
		//
	}, [sessionData]);

	useEffect(() => {
		// Exit if no data is available or form is dirty
		if (!itemData || formState.isDirty()) return;
		// Merge the data with the default
		const populated = populate(PatternDefault, itemData);
		//
		const shapePointsPopulated = [];
		for (const shapePointData of itemData.shape?.points || []) {
			shapePointsPopulated.push(populate(PatternShapePointDefault, shapePointData));
		}
		//
		const pathPopulated = [];
		for (const pathData of itemData.path || []) {
			pathPopulated.push(populate(PatternPathDefault, pathData));
		}
		//
		const schedulesPopulated = [];
		for (const scheduleData of itemData.schedules || []) {
			schedulesPopulated.push(populate(PatternScheduleDefault, scheduleData));
		}
		//
		populated.path = pathPopulated;
		populated.schedules = schedulesPopulated;
		populated.shape.points = shapePointsPopulated;
		// Update form
		formState.setValues(populated);
		formState.resetDirty(populated);
		//
	}, [formState.isDirty(), itemData]);

	useEffect(() => {
		// Return if no data is available
		if (!itemData || !formState.values?.schedules || !allCalendarsData) return;
		// Populate available calendars
		const tempAvailableCalendars = new Set();
		// Populate available calendars
		for (const scheduleData of formState.values.schedules || []) {
			for (const calendarId of scheduleData.calendars_on || []) {
				tempAvailableCalendars.add(calendarId);
			}
			for (const calendarId of scheduleData.calendars_off || []) {
				tempAvailableCalendars.add(calendarId);
			}
			if (schedulesSectionState.selected_calendar) {
				tempAvailableCalendars.add(schedulesSectionState.selected_calendar);
			}
		}
		// Filter items based on search query
		const allAvilableCalendarsDataFormatted = Array.from(tempAvailableCalendars).map((item) => {
			const calendarData = allCalendarsData.find(calendar => calendar._id === item);
			return { label: `[${calendarData.code}] ${calendarData.name || '-'}`, value: item };
		}).sort((a, b) => a.label.localeCompare(b.label));
		// Update state
		setSchedulesSectionState(prev => ({ ...prev, available_calendars: allAvilableCalendarsDataFormatted }));
		//
	}, [formState.values.schedules, allCalendarsData, schedulesSectionState.selected_calendar]);

	//
	// F. Setup actions

	const updateSearchQuery = useCallback((value) => {
		setDataState(prev => ({ ...prev, search_query: value }));
	}, []);

	const clearSearchQuery = useCallback(() => {
		setDataState(prev => ({ ...prev, search_query: '' }));
	}, []);

	const updateActiveSection = useCallback((value) => {
		setPageState(prev => ({ ...prev, active_section: prev.active_section === value ? null : value }));
	}, []);

	const setSelectedFilterCalendar = useCallback((value) => {
		setSchedulesSectionState(prev => ({ ...prev, selected_calendar: value }));
	}, []);

	const validateItem = useCallback(async () => {
		formState.validate();
	}, [formState]);

	const saveItem = useCallback(async () => {
		try {
			setPageState(prev => ({ ...prev, is_error_saving: false, is_saving: true }));
			await API({ body: formState.values, method: 'PUT', operation: 'edit', resourceId: itemId, service: 'patterns' });
			itemMutate(formState.values);
			formState.resetDirty();
			setPageState(prev => ({ ...prev, is_saving: false }));
		}
		catch (error) {
			console.log(error);
			setPageState(prev => ({ ...prev, is_error_saving: error, is_saving: false }));
		}
	}, [formState, itemId, itemMutate]);

	const lockItem = useCallback(async () => {
		try {
			await API({ method: 'PUT', operation: 'lock', resourceId: itemId, service: 'patterns' });
			itemMutate();
		}
		catch (error) {
			itemMutate();
			console.log(error);
			setPageState(prev => ({ ...prev, is_error: error }));
		}
	}, [itemId, itemMutate]);

	const deleteItem = useCallback(async () => {
		try {
			setPageState(prev => ({ ...prev, is_error: false }));
			await API({ method: 'DELETE', operation: 'delete', resourceId: itemId, service: 'patterns' });
			router.push(`/lines/${linesExplorerContext.item_id}/${routesExplorerContext.item_id}`);
			formState.resetDirty();
			itemMutate();
			parentRouteMutate();
		}
		catch (error) {
			itemMutate();
			parentRouteMutate();
			console.log(error);
			setPageState(prev => ({ ...prev, is_error: error }));
		}
	}, [formState, itemId, itemMutate, linesExplorerContext.item_id, parentRouteMutate, router, routesExplorerContext.item_id]);

	const closeItem = useCallback(async () => {
		router.push(`/lines/${linesExplorerContext.item_id}/${routesExplorerContext.item_id}`);
	}, [linesExplorerContext.item_id, router, routesExplorerContext.item_id]);

	const importPatternFromGtfs = useCallback(
		async (importedPattern) => {
			await API({ body: importedPattern, method: 'PUT', operation: 'import', resourceId: itemId, service: 'patterns' });
			itemMutate();
			formState.resetDirty();
		},
		[formState, itemId, itemMutate],
	);

	//
	// G. Setup context object

	const contextObject = useMemo(
		() => ({
			clearSearchQuery: clearSearchQuery,
			closeItem: closeItem,
			//
			data: dataState,
			deleteItem: deleteItem,
			form: formState,
			//
			importPatternFromGtfs: importPatternFromGtfs,
			item_data: itemData,
			//
			item_id: itemId,
			lockItem: lockItem,
			page: pageState,
			saveItem: saveItem,
			//
			schedulesSection: schedulesSectionState,
			//
			setSelectedFilterCalendar: setSelectedFilterCalendar,
			//
			updateActiveSection: updateActiveSection,
			//
			updateSearchQuery: updateSearchQuery,
			//
			validateItem: validateItem,
			//
		}),
		[dataState, pageState, formState, itemId, setSelectedFilterCalendar, itemData, schedulesSectionState, updateSearchQuery, clearSearchQuery, updateActiveSection, validateItem, saveItem, lockItem, deleteItem, closeItem, importPatternFromGtfs],
	);

	//
	// H. Return provider

	return <PatternsExplorerContext.Provider value={contextObject}>{children}</PatternsExplorerContext.Provider>;

	//
}
