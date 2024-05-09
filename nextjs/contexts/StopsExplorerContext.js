'use client';

/* * */

import useSWR from 'swr';
import doSearch from '@/services/doSearch';
import { useRouter } from '@/translations/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isAllowed from '@/authentication/isAllowed';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import { StopValidation } from '@/schemas/Stop/validation';
import { StopDefault } from '@/schemas/Stop/default';
import populate from '@/services/populate';
import API from '@/services/API';
import { StopOptions } from '@/schemas/Stop/options';
import tts from '@carrismetropolitana/tts';

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
	search_query: '',
	//
	items: [],
	//
};

const initialMapState = {
	//
	style: 'map',
	//
};

const initialPageState = {
	//
	is_error: false,
	is_loading: false,
	is_saving: false,
	is_error_saving: false,
	//
	is_read_only: false,
	is_read_only_code: false,
	is_read_only_name: false,
	is_read_only_location: false,
	is_read_only_zoning: false,
	//
	is_deletable: false,
	//
	associated_patterns: [],
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
		validateInputOnBlur: true,
		validateInputOnChange: true,
		clearInputErrorOnChange: true,
		validate: yupResolver(StopValidation),
		initialValues: StopDefault,
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
		setListState((prev) => ({ ...prev, is_loading: allItemsLoading }));
	}, [allItemsLoading]);

	useEffect(() => {
		setPageState((prev) => ({ ...prev, is_loading: itemLoading || allAssociatedPatternsLoading }));
	}, [itemLoading, allAssociatedPatternsLoading]);

	useEffect(() => {
		// Return if no data is available
		if (!allItemsData) return;
		// Filter items based on search query
		const filteredItems = doSearch(listState.search_query, allItemsData, { keys: ['name', 'code'] });
		// Update state
		setListState((prev) => ({ ...prev, items: filteredItems }));
		//
	}, [allItemsData, listState.search_query]);

	useEffect(() => {
		// Return if no data is available
		if (!allAssociatedPatternsData || allAssociatedPatternsData.length === 0) {
			setPageState((prev) => ({ ...prev, associated_patterns: [] }));
			return;
		}
		// Sort items by code
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
		const allAssociatedPatternsDataSorted = allAssociatedPatternsData.sort((a, b) => collator.compare(a.code, b.code));
		// Update state
		setPageState((prev) => ({ ...prev, associated_patterns: allAssociatedPatternsDataSorted }));
		//
	}, [allAssociatedPatternsData]);

	useEffect(() => {
		// Stop is deletable if no patterns are associated in GO
		const hasAssociatedPatternsInGo = allAssociatedPatternsData?.length > 0;
		const hasAssociatedPatternsInApi = apiItemData?.lines?.length > 0;
		if (!hasAssociatedPatternsInGo && !hasAssociatedPatternsInApi) {
			setPageState((prev) => ({ ...prev, is_deletable: true }));
			return;
		}
		// Update state
		setPageState((prev) => ({ ...prev, is_deletable: false }));
		//
	}, [allAssociatedPatternsData?.length, apiItemData?.lines]);

	useEffect(() => {
		// Check if the user is allowed to edit the current page
		const isReadOnly = !isAllowed(sessionData, [{ scope: 'stops', action: 'edit' }], { handleError: true }) || itemData?.is_locked || pageState.is_saving;
		// Check if the use is allowed to edit the stop code
		const isReadOnlyCode = isReadOnly || !isAllowed(sessionData, [{ scope: 'stops', action: 'edit_code' }], { handleError: true });
		// Check if the use is allowed to edit the stop name
		const isReadOnlyName = isReadOnly || !isAllowed(sessionData, [{ scope: 'stops', action: 'edit_name' }], { handleError: true });
		// Check if the use is allowed to edit the stop location
		const isReadOnlyLocation = isReadOnly || !isAllowed(sessionData, [{ scope: 'stops', action: 'edit_location' }], { handleError: true });
		// Check if the use is allowed to edit the stop zones
		const isReadOnlyZones = isReadOnly || !isAllowed(sessionData, [{ scope: 'stops', action: 'edit_zones' }], { handleError: true });
		// Update state
		setPageState((prev) => ({ ...prev, is_read_only: isReadOnly, is_read_only_code: isReadOnlyCode, is_read_only_name: isReadOnlyName, is_read_only_location: isReadOnlyLocation, is_read_only_zones: isReadOnlyZones }));
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.isDirty(), itemData]);

	useEffect(() => {
		// Return if stop has no name
		if (!formState.values.name_new.length || !formState.values.short_name_auto) return;
		// Copy the name first
		let shortenedStopName = formState.values.name_new;
		// Shorten the stop name
		StopOptions.name_abbreviations
			.filter((abbreviation) => abbreviation.enabled)
			.forEach((abbreviation) => {
				const regexExpression = new RegExp(abbreviation.phrase, 'g');
				shortenedStopName = shortenedStopName.replace(regexExpression, abbreviation.replacement);
			});
		// Save the new name
		formState.setFieldValue('short_name', shortenedStopName);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.values.name_new, formState.values.short_name_auto]);

	useEffect(() => {
		// Return if stop has no name
		if (!formState.values.name.length) return;
		// Create the modes object
		const stopModalConnections = {
			subway: formState.values.near_subway,
			light_rail: formState.values.near_light_rail,
			train: formState.values.near_train,
			boat: formState.values.near_boat,
			airport: formState.values.near_airport,
			bike_sharing: formState.values.near_bike_sharing,
			bike_parking: formState.values.near_bike_parking,
			car_parking: formState.values.near_car_parking,
		};
		// Save the new name
		formState.setFieldValue('tts_name', tts.makeText(formState.values.name, stopModalConnections).trim());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.values.name, formState.values.near_subway, formState.values.near_light_rail, formState.values.near_train, formState.values.near_boat, formState.values.near_airport, formState.values.near_bike_sharing, formState.values.near_bike_parking, formState.values.near_car_parking]);

	//
	// F. Setup actions

	const updateSearchQuery = useCallback((value) => {
		setListState((prev) => ({ ...prev, search_query: value }));
	}, []);

	const clearSearchQuery = useCallback(() => {
		setListState((prev) => ({ ...prev, search_query: '' }));
	}, []);

	const updateMapStyle = useCallback((value) => {
		setMapState((prev) => ({ ...prev, style: value }));
	}, []);

	const exportAsFile = useCallback(async () => {
		try {
			setListState((prev) => ({ ...prev, is_loading: true }));
			setPageState((prev) => ({ ...prev, is_loading: true }));
			const responseBlob = await API({ service: 'stops', operation: 'export', method: 'GET', parseType: 'blob' });
			const objectURL = URL.createObjectURL(responseBlob);
			const htmlAnchorElement = document.createElement('a');
			htmlAnchorElement.href = objectURL;
			htmlAnchorElement.download = 'stops.txt';
			document.body.appendChild(htmlAnchorElement);
			htmlAnchorElement.click();
			setListState((prev) => ({ ...prev, is_loading: false }));
			setPageState((prev) => ({ ...prev, is_loading: false }));
		} catch (error) {
			console.log(error);
			setListState((prev) => ({ ...prev, is_loading: false }));
			setPageState((prev) => ({ ...prev, is_loading: false }));
		}
	}, []);

	const exportDeletedAsFile = useCallback(async () => {
		try {
			setListState((prev) => ({ ...prev, is_loading: true }));
			setPageState((prev) => ({ ...prev, is_loading: true }));
			const responseBlob = await API({ service: 'stops', operation: 'export_deleted', method: 'GET', parseType: 'blob' });
			const objectURL = URL.createObjectURL(responseBlob);
			const htmlAnchorElement = document.createElement('a');
			htmlAnchorElement.href = objectURL;
			htmlAnchorElement.download = 'stops_deleted.txt';
			document.body.appendChild(htmlAnchorElement);
			htmlAnchorElement.click();
			setListState((prev) => ({ ...prev, is_loading: false }));
			setPageState((prev) => ({ ...prev, is_loading: false }));
		} catch (error) {
			console.log(error);
			setListState((prev) => ({ ...prev, is_loading: false }));
			setPageState((prev) => ({ ...prev, is_loading: false }));
		}
	}, []);

	const syncWithDatasets = useCallback(async () => {
		try {
			setListState((prev) => ({ ...prev, is_loading: true }));
			setPageState((prev) => ({ ...prev, is_loading: true }));
			await API({ service: 'stops', operation: 'sync/datasets', method: 'GET' });
			setListState((prev) => ({ ...prev, is_loading: false }));
			setPageState((prev) => ({ ...prev, is_loading: false }));
		} catch (error) {
			console.log(error);
			setListState((prev) => ({ ...prev, is_loading: false }));
			setPageState((prev) => ({ ...prev, is_loading: false }));
		}
	}, []);

	const syncWithIntermodal = useCallback(async () => {
		try {
			setListState((prev) => ({ ...prev, is_loading: true }));
			setPageState((prev) => ({ ...prev, is_loading: true }));
			await API({ service: 'stops', operation: 'sync/intermodal', method: 'GET' });
			setListState((prev) => ({ ...prev, is_loading: false }));
			setPageState((prev) => ({ ...prev, is_loading: false }));
		} catch (error) {
			console.log(error);
			setListState((prev) => ({ ...prev, is_loading: false }));
			setPageState((prev) => ({ ...prev, is_loading: false }));
		}
	}, []);

	const validateItem = useCallback(async () => {
		formState.validate();
	}, [formState]);

	const saveItem = useCallback(async () => {
		try {
			setPageState((prev) => ({ ...prev, is_saving: true, is_error_saving: false }));
			await API({ service: 'stops', resourceId: itemId, operation: 'edit', method: 'PUT', body: formState.values });
			itemMutate(formState.values);
			allItemsMutate();
			formState.resetDirty();
			setPageState((prev) => ({ ...prev, is_saving: false }));
		} catch (error) {
			console.log(error);
			setPageState((prev) => ({ ...prev, is_saving: false, is_error_saving: err }));
		}
	}, [allItemsMutate, formState, itemId, itemMutate]);

	const lockItem = useCallback(async () => {
		try {
			await API({ service: 'stops', resourceId: itemId, operation: 'lock', method: 'PUT' });
			itemMutate();
			allItemsMutate();
		} catch (error) {
			itemMutate();
			allItemsMutate();
			console.log(error);
			setPageState((prev) => ({ ...prev, is_error: err }));
		}
	}, [allItemsMutate, itemId, itemMutate]);

	const closeItem = useCallback(async () => {
		router.push('/stops');
	}, [router]);

	const openInWebsite = useCallback(async () => {
		window.open(`https://on.carrismetropolitana.pt/stops/${itemData.code}`, '_blank');
	}, [itemData?.code]);

	//
	// G. Setup context object

	const contextObject = useMemo(
		() => ({
			//
			list: listState,
			map: mapState,
			page: pageState,
			form: formState,
			//
			item_id: itemId,
			item_data: itemData,
			//
			updateSearchQuery: updateSearchQuery,
			clearSearchQuery: clearSearchQuery,
			//
			exportAsFile: exportAsFile,
			exportDeletedAsFile: exportDeletedAsFile,
			//
			syncWithDatasets: syncWithDatasets,
			syncWithIntermodal: syncWithIntermodal,
			//
			updateMapStyle: updateMapStyle,
			//
			validateItem: validateItem,
			saveItem: saveItem,
			lockItem: lockItem,
			closeItem: closeItem,
			openInWebsite: openInWebsite,
			//
		}),
		[listState, mapState, pageState, formState, itemId, itemData, updateSearchQuery, clearSearchQuery, exportAsFile, exportDeletedAsFile, syncWithDatasets, syncWithIntermodal, updateMapStyle, validateItem, saveItem, lockItem, closeItem, openInWebsite],
	);

	//
	// H. Return provider

	return <StopsExplorerContext.Provider value={contextObject}>{children}</StopsExplorerContext.Provider>;

	//
}