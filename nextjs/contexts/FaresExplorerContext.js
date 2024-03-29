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
import { FareValidation } from '@/schemas/Fare/validation';
import { FareDefault } from '@/schemas/Fare/default';
import populate from '@/services/populate';
import API from '@/services/API';

/* * */

const FaresExplorerContext = createContext(null);

export function useFaresExplorerContext() {
  return useContext(FaresExplorerContext);
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

const initialPageState = {
  //
  is_error: false,
  is_loading: false,
  is_saving: false,
  is_error_saving: false,
  //
  is_read_only: false,
  //
};

/* * */

export function FaresExplorerContextProvider({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const { fare_id: itemId } = useParams();

  //
  // B. Setup state

  const [listState, setListState] = useState(initialListState);
  const [pageState, setPageState] = useState(initialPageState);

  //
  // C. Setup form

  const formState = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(FareValidation),
    initialValues: FareDefault,
  });

  //
  // D. Fetch data

  const { data: sessionData } = useSession();
  const { data: allItemsData, isLoading: allItemsLoading, mutate: allItemsMutate } = useSWR('/api/fares');
  const { data: itemData, isLoading: itemLoading, mutate: itemMutate } = useSWR(itemId && `/api/fares/${itemId}`);

  //
  // E. Transform data

  useEffect(() => {
    setPageState((prev) => ({ ...prev, is_loading: itemLoading }));
  }, [itemLoading]);

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
    // Check if the use is allowed to edit the current page
    const isReadOnly = !isAllowed(sessionData, [{ scope: 'fares', action: 'edit' }], { handleError: true }) || itemData?.is_locked || pageState.is_saving;
    // Update state
    setPageState((prev) => ({ ...prev, is_read_only: isReadOnly }));
    //
  }, [itemData?.is_locked, pageState.is_saving, sessionData]);

  useEffect(() => {
    // Exit if no data is available or form is dirty
    if (!itemData || formState.isDirty()) return;
    // Merge the data with the default
    const populated = populate(FareDefault, itemData);
    // Update form
    formState.setValues(populated);
    formState.resetDirty(populated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.isDirty(), itemData]);

  //
  // F. Setup actions

  const updateSearchQuery = useCallback((value) => {
    setListState((prev) => ({ ...prev, search_query: value }));
  }, []);

  const clearSearchQuery = useCallback(() => {
    setListState((prev) => ({ ...prev, search_query: '' }));
  }, []);

  const validateItem = useCallback(async () => {
    formState.validate();
  }, [formState]);

  const saveItem = useCallback(async () => {
    try {
      setPageState((prev) => ({ ...prev, is_saving: true, is_error_saving: false }));
      await API({ service: 'fares', resourceId: itemId, operation: 'edit', method: 'PUT', body: formState.values });
      itemMutate(formState.values);
      allItemsMutate();
      formState.resetDirty();
      setPageState((prev) => ({ ...prev, is_saving: false }));
    } catch (err) {
      console.log(err);
      setPageState((prev) => ({ ...prev, is_saving: false, is_error_saving: err }));
    }
  }, [allItemsMutate, formState, itemId, itemMutate]);

  const lockItem = useCallback(async () => {
    try {
      await API({ service: 'fares', resourceId: itemId, operation: 'lock', method: 'PUT' });
      itemMutate();
      allItemsMutate();
    } catch (err) {
      itemMutate();
      allItemsMutate();
      console.log(err);
      setPageState((prev) => ({ ...prev, is_error: err }));
    }
  }, [allItemsMutate, itemId, itemMutate]);

  const deleteItem = useCallback(async () => {
    try {
      setPageState((prev) => ({ ...prev, is_error: false }));
      await API({ service: 'fares', resourceId: itemId, operation: 'delete', method: 'DELETE' });
      router.push('/fares');
      allItemsMutate();
      formState.resetDirty();
    } catch (err) {
      itemMutate();
      allItemsMutate();
      console.log(err);
      setPageState((prev) => ({ ...prev, is_error: err }));
    }
  }, [allItemsMutate, formState, itemId, itemMutate, router]);

  const closeItem = useCallback(async () => {
    router.push('/fares');
  }, [router]);

  //
  // G. Setup context object

  const contextObject = useMemo(
    () => ({
      //
      list: listState,
      page: pageState,
      form: formState,
      //
      item_id: itemId,
      item_data: itemData,
      //
      updateSearchQuery: updateSearchQuery,
      clearSearchQuery: clearSearchQuery,
      //
      validateItem: validateItem,
      saveItem: saveItem,
      lockItem: lockItem,
      deleteItem: deleteItem,
      closeItem: closeItem,
      //
    }),
    [listState, pageState, formState, itemId, itemData, updateSearchQuery, clearSearchQuery, validateItem, saveItem, lockItem, deleteItem, closeItem]
  );

  //
  // H. Return provider

  return <FaresExplorerContext.Provider value={contextObject}>{children}</FaresExplorerContext.Provider>;

  //
}
