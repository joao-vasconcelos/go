'use client';

/* * */

import isAllowed from '@/authentication/isAllowed';
import { RouteDefault } from '@/schemas/Route/default';
import { RouteValidation } from '@/schemas/Route/validation';
import API from '@/services/API';
import doSearch from '@/services/doSearch';
import populate from '@/services/populate';
import { useRouter } from '@/translations/navigation';
import { useForm, yupResolver } from '@mantine/form';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { useLinesExplorerContext } from './LinesExplorerContext';

/* * */

const RoutesExplorerContext = createContext(null);

export function useRoutesExplorerContext() {
	return useContext(RoutesExplorerContext);
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

const initialPageState = {
	//
	is_error: false,
	is_error_saving: false,
	is_loading: false,
	//
	is_read_only: false,
	is_saving: false,
	//
};

/* * */

export function RoutesExplorerContextProvider({ children }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const { route_id: itemId } = useParams();

	const linesExplorerContext = useLinesExplorerContext();

	//
	// B. Setup state

	const [listState, setListState] = useState(initialListState);
	const [pageState, setPageState] = useState(initialPageState);

	//
	// C. Setup form

	const formState = useForm({
		clearInputErrorOnChange: true,
		initialValues: RouteDefault,
		validate: yupResolver(RouteValidation),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	//
	// D. Fetch data

	const { data: sessionData } = useSession();
	const { data: allItemsData, isLoading: allItemsLoading, mutate: allItemsMutate } = useSWR('/api/routes');
	const { data: itemData, isLoading: itemLoading, mutate: itemMutate } = useSWR(itemId && `/api/routes/${itemId}`);

	//
	// E. Transform data

	useEffect(() => {
		setPageState(prev => ({ ...prev, is_loading: itemLoading }));
	}, [itemLoading]);

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
		// Check if the use is allowed to edit the current page
		const isReadOnly = !isAllowed(sessionData, [{ action: 'edit', scope: 'lines' }], { handleError: true }) || itemData?.is_locked || pageState.is_saving || linesExplorerContext.item_data?.is_locked;
		// Update state
		setPageState(prev => ({ ...prev, is_read_only: isReadOnly }));
		//
	}, [itemData?.is_locked, linesExplorerContext.item_data?.is_locked, pageState.is_saving, sessionData]);

	useEffect(() => {
		// Exit if no data is available or form is dirty
		if (!itemData || formState.isDirty()) return;
		// Merge the data with the default
		const populated = populate(RouteDefault, itemData);
		// Update form
		formState.setValues(populated);
		formState.resetDirty(populated);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.isDirty(), itemData]);

	//
	// F. Setup actions

	const updateSearchQuery = useCallback((value) => {
		setListState(prev => ({ ...prev, search_query: value }));
	}, []);

	const clearSearchQuery = useCallback(() => {
		setListState(prev => ({ ...prev, search_query: '' }));
	}, []);

	const validateItem = useCallback(async () => {
		formState.validate();
	}, [formState]);

	const saveItem = useCallback(async () => {
		try {
			setPageState(prev => ({ ...prev, is_error_saving: false, is_saving: true }));
			await API({ body: formState.values, method: 'PUT', operation: 'edit', resourceId: itemId, service: 'routes' });
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
			await API({ method: 'PUT', operation: 'lock', resourceId: itemId, service: 'routes' });
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

	const deleteItem = useCallback(async () => {
		try {
			setPageState(prev => ({ ...prev, is_error: false }));
			await API({ method: 'DELETE', operation: 'delete', resourceId: itemId, service: 'routes' });
			router.push(`/lines/${linesExplorerContext.item_id}`);
			allItemsMutate();
			formState.resetDirty();
		}
		catch (error) {
			itemMutate();
			allItemsMutate();
			console.log(error);
			setPageState(prev => ({ ...prev, is_error: error }));
		}
	}, [allItemsMutate, formState, itemId, itemMutate, linesExplorerContext.item_id, router]);

	const closeItem = useCallback(async () => {
		router.push(`/lines/${linesExplorerContext.item_id}`);
	}, [linesExplorerContext.item_id, router]);

	//
	// G. Setup context object

	const contextObject = useMemo(
		() => ({
			clearSearchQuery: clearSearchQuery,
			closeItem: closeItem,
			deleteItem: deleteItem,
			form: formState,
			item_data: itemData,
			//
			item_id: itemId,
			//
			list: listState,
			lockItem: lockItem,
			page: pageState,
			saveItem: saveItem,
			//
			updateSearchQuery: updateSearchQuery,
			//
			validateItem: validateItem,
			//
		}),
		[listState, pageState, formState, itemId, itemData, updateSearchQuery, clearSearchQuery, validateItem, saveItem, lockItem, deleteItem, closeItem],
	);

	//
	// H. Return provider

	return <RoutesExplorerContext.Provider value={contextObject}>{children}</RoutesExplorerContext.Provider>;

	//
}
