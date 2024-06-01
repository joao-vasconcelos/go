'use client';

/* * */

import isAllowed from '@/authentication/isAllowed';
import { StopDefault } from '@/schemas/Stop/default';
import { StopOptions } from '@/schemas/Stop/options';
import { StopValidation } from '@/schemas/Stop/validation';
import API from '@/services/API';
import doSearch from '@/services/doSearch';
import populate from '@/services/populate';
import { useRouter } from '@/translations/navigation';
import tts from '@carrismetropolitana/tts';
import { useForm, yupResolver } from '@mantine/form';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

const StopsExplorerContext = createContext(null);

export function useStopsExplorerContext() {
	return useContext(StopsExplorerContext);
}

/* * */

const initialListState = {
	//
	is_error: false,
	is_loading: false,
	//
	items: [],
	//
	search_query: '',
	//
};

const initialMapState = {
	//
	style: 'map',
	//
};

const initialPageState = {
	//
	associated_patterns: [],
	//
	is_deletable: false,
	//
	is_error: false,
	is_error_saving: false,
	is_loading: false,
	//
	is_read_only: false,
	is_read_only_code: false,
	is_read_only_location: false,
	is_read_only_name: false,
	is_read_only_zoning: false,
	is_saving: false,
	//
};

/* * */

export function StopsExplorerContextProvider({ children }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { stop_id: itemId } = useParams();

	//
	// B. Setup state

	const [listState, setListState] = useState(initialListState);
	const [mapState, setMapState] = useState(initialMapState);
	const [pageState, setPageState] = useState(initialPageState);

	//
	// C. Setup form

	const formState = useForm({
		clearInputErrorOnChange: true,
		initialValues: StopDefault,
		validate: yupResolver(StopValidation),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	//
	// D. Fetch data

	const { data: sessionData } = useSession();
	const { data: allItemsData, isLoading: allItemsLoading, mutate: allItemsMutate } = useSWR('/api/stops');
	const { data: itemData, isLoading: itemLoading, mutate: itemMutate } = useSWR(itemId && `/api/stops/${itemId}`);
	const { data: allAssociatedPatternsData, isLoading: allAssociatedPatternsLoading } = useSWR(itemId && `/api/stops/${itemId}/associatedPatterns`);
	const { data: apiItemData } = useSWR(itemData && `https://api.carrismetropolitana.pt/stops/${itemData.code}`);

	//
	// E. Transform data

	useEffect(() => {
		setListState(prev => ({ ...prev, is_loading: allItemsLoading }));
	}, [allItemsLoading]);

	useEffect(() => {
		setPageState(prev => ({ ...prev, is_loading: itemLoading || allAssociatedPatternsLoading }));
	}, [itemLoading, allAssociatedPatternsLoading]);

	useEffect(() => {
		// Return if no data is available
		if (!allItemsData) return;
		// Filter items based on search query
		const filteredItems = doSearch(listState.search_query, allItemsData, { keys: ['name', 'code'] });
		// Update state
		setListState(prev => ({ ...prev, items: filteredItems }));
		//
	}, [allItemsData, listState.search_query]);

	useEffect(() => {
		// Return if no data is available
		if (!allAssociatedPatternsData || allAssociatedPatternsData.length === 0) {
			setPageState(prev => ({ ...prev, associated_patterns: [] }));
			return;
		}
		// Sort items by code
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
		const allAssociatedPatternsDataSorted = allAssociatedPatternsData.sort((a, b) => collator.compare(a.code, b.code));
		// Update state
		setPageState(prev => ({ ...prev, associated_patterns: allAssociatedPatternsDataSorted }));
		//
	}, [allAssociatedPatternsData]);

	useEffect(() => {
		// Stop is deletable if no patterns are associated in GO
		const hasAssociatedPatternsInGo = allAssociatedPatternsData?.length > 0;
		const hasAssociatedPatternsInApi = apiItemData?.lines?.length > 0;
		if (!hasAssociatedPatternsInGo && !hasAssociatedPatternsInApi) {
			setPageState(prev => ({ ...prev, is_deletable: true }));
			return;
		}
		// Update state
		setPageState(prev => ({ ...prev, is_deletable: false }));
		//
	}, [allAssociatedPatternsData?.length, apiItemData?.lines]);

	useEffect(() => {
		// Check if the user is allowed to edit the current page
		const isReadOnly = !isAllowed(sessionData, [{ action: 'edit', scope: 'stops' }], { handleError: true }) || itemData?.is_locked || pageState.is_saving;
		// Check if the use is allowed to edit the stop code
		const isReadOnlyCode = isReadOnly || !isAllowed(sessionData, [{ action: 'edit_code', scope: 'stops' }], { handleError: true });
		// Check if the use is allowed to edit the stop name
		const isReadOnlyName = isReadOnly || !isAllowed(sessionData, [{ action: 'edit_name', scope: 'stops' }], { handleError: true });
		// Check if the use is allowed to edit the stop location
		const isReadOnlyLocation = isReadOnly || !isAllowed(sessionData, [{ action: 'edit_location', scope: 'stops' }], { handleError: true });
		// Check if the use is allowed to edit the stop zones
		const isReadOnlyZones = isReadOnly || !isAllowed(sessionData, [{ action: 'edit_zones', scope: 'stops' }], { handleError: true });
		// Update state
		setPageState(prev => ({ ...prev, is_read_only: isReadOnly, is_read_only_code: isReadOnlyCode, is_read_only_location: isReadOnlyLocation, is_read_only_name: isReadOnlyName, is_read_only_zones: isReadOnlyZones }));
		//
	}, [itemData?.is_locked, pageState.is_saving, sessionData]);

	useEffect(() => {
		// Exit if no data is available or form is dirty
		if (!itemData || formState.isDirty()) return;
		// Merge the data with the default
		const populated = populate(StopDefault, itemData);
		// Update form
		formState.setValues(populated);
		formState.resetDirty(populated);
		// // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.isDirty(), itemData]);

	useEffect(() => {
		// Return if stop has no name
		if (!formState.values.name_new.length || !formState.values.short_name_auto) return;
		// Copy the name first
		let shortenedStopName = formState.values.name_new;
		// Shorten the stop name
		StopOptions.name_abbreviations
			.filter(abbreviation => abbreviation.enabled)
			.forEach((abbreviation) => {
				const regexExpression = new RegExp(abbreviation.phrase, 'g');
				shortenedStopName = shortenedStopName.replace(regexExpression, abbreviation.replacement);
			});
		// Save the new name
		formState.setFieldValue('short_name', shortenedStopName);
		// // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.values.name_new, formState.values.short_name_auto]);

	useEffect(() => {
		// Return if stop has no name
		if (!formState.values.name.length) return;
		// Create the modes object
		const stopModalConnections = {
			airport: formState.values.near_airport,
			bike_parking: formState.values.near_bike_parking,
			bike_sharing: formState.values.near_bike_sharing,
			boat: formState.values.near_boat,
			car_parking: formState.values.near_car_parking,
			light_rail: formState.values.near_light_rail,
			subway: formState.values.near_subway,
			train: formState.values.near_train,
		};
		// Save the new name
		formState.setFieldValue('tts_name', tts.makeText(formState.values.name, stopModalConnections).trim());
		// // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.values.name, formState.values.near_subway, formState.values.near_light_rail, formState.values.near_train, formState.values.near_boat, formState.values.near_airport, formState.values.near_bike_sharing, formState.values.near_bike_parking, formState.values.near_car_parking]);

	//
	// F. Setup actions

	const updateSearchQuery = useCallback((value) => {
		setListState(prev => ({ ...prev, search_query: value }));
	}, []);

	const clearSearchQuery = useCallback(() => {
		setListState(prev => ({ ...prev, search_query: '' }));
	}, []);

	const updateMapStyle = useCallback((value) => {
		setMapState(prev => ({ ...prev, style: value }));
	}, []);

	const exportAsFile = useCallback(async () => {
		try {
			setListState(prev => ({ ...prev, is_loading: true }));
			setPageState(prev => ({ ...prev, is_loading: true }));
			const responseBlob = await API({ method: 'GET', operation: 'export/default', parseType: 'blob', service: 'stops' });
			const objectURL = URL.createObjectURL(responseBlob);
			// eslint-disable-next-line no-undef
			const htmlAnchorElement = document.createElement('a');
			htmlAnchorElement.href = objectURL;
			htmlAnchorElement.download = 'stops.txt';
			// eslint-disable-next-line no-undef
			document.body.appendChild(htmlAnchorElement);
			htmlAnchorElement.click();
			setListState(prev => ({ ...prev, is_loading: false }));
			setPageState(prev => ({ ...prev, is_loading: false }));
		}
		catch (error) {
			console.log(error);
			setListState(prev => ({ ...prev, is_loading: false }));
			setPageState(prev => ({ ...prev, is_loading: false }));
		}
	}, []);

	const exportDeletedAsFile = useCallback(async () => {
		try {
			setListState(prev => ({ ...prev, is_loading: true }));
			setPageState(prev => ({ ...prev, is_loading: true }));
			const responseBlob = await API({ method: 'GET', operation: 'export/deleted', parseType: 'blob', service: 'stops' });
			const objectURL = URL.createObjectURL(responseBlob);
			// eslint-disable-next-line no-undef
			const htmlAnchorElement = document.createElement('a');
			htmlAnchorElement.href = objectURL;
			htmlAnchorElement.download = 'stops_deleted.txt';
			// eslint-disable-next-line no-undef
			document.body.appendChild(htmlAnchorElement);
			htmlAnchorElement.click();
			setListState(prev => ({ ...prev, is_loading: false }));
			setPageState(prev => ({ ...prev, is_loading: false }));
		}
		catch (error) {
			console.log(error);
			setListState(prev => ({ ...prev, is_loading: false }));
			setPageState(prev => ({ ...prev, is_loading: false }));
		}
	}, []);

	const syncWithDatasets = useCallback(async () => {
		try {
			setListState(prev => ({ ...prev, is_loading: true }));
			setPageState(prev => ({ ...prev, is_loading: true }));
			await API({ method: 'GET', operation: 'sync/datasets', service: 'stops' });
			setListState(prev => ({ ...prev, is_loading: false }));
			setPageState(prev => ({ ...prev, is_loading: false }));
		}
		catch (error) {
			console.log(error);
			setListState(prev => ({ ...prev, is_loading: false }));
			setPageState(prev => ({ ...prev, is_loading: false }));
		}
	}, []);

	const syncWithIntermodal = useCallback(async () => {
		try {
			setListState(prev => ({ ...prev, is_loading: true }));
			setPageState(prev => ({ ...prev, is_loading: true }));
			await API({ method: 'GET', operation: 'sync/intermodal', service: 'stops' });
			setListState(prev => ({ ...prev, is_loading: false }));
			setPageState(prev => ({ ...prev, is_loading: false }));
		}
		catch (error) {
			console.log(error);
			setListState(prev => ({ ...prev, is_loading: false }));
			setPageState(prev => ({ ...prev, is_loading: false }));
		}
	}, []);

	const validateItem = useCallback(async () => {
		formState.validate();
	}, [formState]);

	const saveItem = useCallback(async () => {
		try {
			setPageState(prev => ({ ...prev, is_error_saving: false, is_saving: true }));
			await API({ body: formState.values, method: 'PUT', operation: 'edit', resourceId: itemId, service: 'stops' });
			itemMutate(formState.values);
			allItemsMutate();
			formState.resetDirty();
			setPageState(prev => ({ ...prev, is_saving: false }));
		}
		catch (error) {
			console.log(error);
			setPageState(prev => ({ ...prev, is_error_saving: error, is_saving: false }));
		}
	}, [allItemsMutate, formState, itemId, itemMutate]);

	const lockItem = useCallback(async () => {
		try {
			await API({ method: 'PUT', operation: 'lock', resourceId: itemId, service: 'stops' });
			itemMutate();
			allItemsMutate();
		}
		catch (error) {
			itemMutate();
			allItemsMutate();
			console.log(error);
			setPageState(prev => ({ ...prev, is_error: error }));
		}
	}, [allItemsMutate, itemId, itemMutate]);

	const closeItem = useCallback(async () => {
		router.push('/stops');
	}, [router]);

	const openInWebsite = useCallback(async () => {
		// eslint-disable-next-line no-undef
		window.open(`https://on.carrismetropolitana.pt/stops/${itemData.code}`, '_blank');
	}, [itemData?.code]);

	//
	// G. Setup context object

	const contextObject = useMemo(
		() => ({
			clearSearchQuery: clearSearchQuery,
			closeItem: closeItem,
			//
			exportAsFile: exportAsFile,
			exportDeletedAsFile: exportDeletedAsFile,
			form: formState,
			item_data: itemData,
			//
			item_id: itemId,
			//
			list: listState,
			lockItem: lockItem,
			map: mapState,
			openInWebsite: openInWebsite,
			page: pageState,
			saveItem: saveItem,
			//
			syncWithDatasets: syncWithDatasets,
			syncWithIntermodal: syncWithIntermodal,
			//
			updateMapStyle: updateMapStyle,
			//
			updateSearchQuery: updateSearchQuery,
			//
			validateItem: validateItem,
			//
		}),
		[listState, mapState, pageState, formState, itemId, itemData, updateSearchQuery, clearSearchQuery, exportAsFile, exportDeletedAsFile, syncWithDatasets, syncWithIntermodal, updateMapStyle, validateItem, saveItem, lockItem, closeItem, openInWebsite],
	);

	//
	// H. Return provider

	return <StopsExplorerContext.Provider value={contextObject}>{children}</StopsExplorerContext.Provider>;

	//
}
