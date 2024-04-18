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
import { PatternValidation } from '@/schemas/Pattern/validation';
import { PatternDefault, PatternPathDefault, PatternScheduleDefault, PatternShapePointDefault } from '@/schemas/Pattern/default';
import populate from '@/services/populate';
import API from '@/services/API';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import { useRoutesExplorerContext } from '@/contexts/RoutesExplorerContext';

/* * */

const PatternsExplorerContext = createContext(null);

export function usePatternsExplorerContext() {
  return useContext(PatternsExplorerContext);
}

/* * */

const initialDataState = {
  //
  is_error: false,
  is_loading: false,
  //
  all_zones_data: [],
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
  active_section: null,
  //
  is_admin: false,
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

  //
  // C. Setup form

  const formState = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(PatternValidation),
    initialValues: PatternDefault,
  });

  //
  // D. Fetch data

  const { data: sessionData } = useSession();
  const { data: allZonesData } = useSWR('/api/zones');
  const { data: allCalendarsData } = useSWR('/api/calendars');
  const { mutate: parentLineMutate } = useSWR(linesExplorerContext.item_id && `/api/lines/${linesExplorerContext.item_id}`);
  const { mutate: parentRouteMutate } = useSWR(routesExplorerContext.item_id && `/api/routes/${routesExplorerContext.item_id}`);
  const { data: itemData, isLoading: itemLoading, mutate: itemMutate } = useSWR(itemId && `/api/patterns/${itemId}`);

  //
  // E. Transform data

  useEffect(() => {
    setPageState((prev) => ({ ...prev, is_loading: itemLoading }));
  }, [itemLoading]);

  useEffect(() => {
    // Return if no data is available
    if (!allZonesData) return;
    // Filter items based on search query
    const allZonesDataFormatted = allZonesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
    // Update state
    setDataState((prev) => ({ ...prev, all_zones_data: allZonesDataFormatted }));
    //
  }, [allZonesData]);

  useEffect(() => {
    // Return if no data is available
    if (!allCalendarsData) return;
    // Filter items based on search query
    const allCalendarsDataFormatted = allCalendarsData.map((item) => {
      return { value: item._id, label: `[${item.code}] ${item.name || '-'}` };
    });
    // Update state
    setDataState((prev) => ({ ...prev, all_calendars_data: allCalendarsDataFormatted }));
    //
  }, [allCalendarsData]);

  useEffect(() => {
    // Check if the use is allowed to edit the current page
    const isReadOnly = !isAllowed(sessionData, [{ scope: 'lines', action: 'edit' }], { handleError: true }) || itemData?.is_locked || pageState.is_saving || linesExplorerContext.item_data?.is_locked || routesExplorerContext.item_data?.is_locked;
    // Update state
    setPageState((prev) => ({ ...prev, is_read_only: isReadOnly }));
    //
  }, [itemData?.is_locked, linesExplorerContext.item_data?.is_locked, pageState.is_saving, routesExplorerContext.item_data?.is_locked, sessionData]);

  useEffect(() => {
    // Check if the use is allowed to edit the current page
    const isAdmin = isAllowed(sessionData, [{ scope: 'configs', action: 'admin' }], { handleError: true });
    // Update state
    setPageState((prev) => ({ ...prev, is_admin: isAdmin }));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.isDirty(), itemData]);

  //
  // F. Setup actions

  const updateSearchQuery = useCallback((value) => {
    setDataState((prev) => ({ ...prev, search_query: value }));
  }, []);

  const clearSearchQuery = useCallback(() => {
    setDataState((prev) => ({ ...prev, search_query: '' }));
  }, []);

  const updateActiveSection = useCallback((value) => {
    setPageState((prev) => ({ ...prev, active_section: prev.active_section === value ? null : value }));
  }, []);

  const validateItem = useCallback(async () => {
    formState.validate();
  }, [formState]);

  const saveItem = useCallback(async () => {
    try {
      setPageState((prev) => ({ ...prev, is_saving: true, is_error_saving: false }));
      await API({ service: 'patterns', resourceId: itemId, operation: 'edit', method: 'PUT', body: formState.values });
      itemMutate(formState.values);
      formState.resetDirty();
      setPageState((prev) => ({ ...prev, is_saving: false }));
    } catch (error) {
      console.log(error);
      setPageState((prev) => ({ ...prev, is_saving: false, is_error_saving: err }));
    }
  }, [formState, itemId, itemMutate]);

  const lockItem = useCallback(async () => {
    try {
      await API({ service: 'patterns', resourceId: itemId, operation: 'lock', method: 'PUT' });
      itemMutate();
    } catch (error) {
      itemMutate();
      console.log(error);
      setPageState((prev) => ({ ...prev, is_error: err }));
    }
  }, [itemId, itemMutate]);

  const deleteItem = useCallback(async () => {
    try {
      setPageState((prev) => ({ ...prev, is_error: false }));
      await API({ service: 'patterns', resourceId: itemId, operation: 'delete', method: 'DELETE' });
      router.push(`/lines/${linesExplorerContext.item_id}/${routesExplorerContext.item_id}`);
      formState.resetDirty();
      itemMutate();
      parentRouteMutate();
    } catch (error) {
      itemMutate();
      parentRouteMutate();
      console.log(error);
      setPageState((prev) => ({ ...prev, is_error: err }));
    }
  }, [formState, itemId, itemMutate, linesExplorerContext.item_id, parentRouteMutate, router, routesExplorerContext.item_id]);

  const closeItem = useCallback(async () => {
    router.push(`/lines/${linesExplorerContext.item_id}/${routesExplorerContext.item_id}`);
  }, [linesExplorerContext.item_id, router, routesExplorerContext.item_id]);

  const importPatternFromGtfs = useCallback(
    async (importedPattern) => {
      await API({ service: 'patterns', resourceId: itemId, operation: 'import', method: 'PUT', body: importedPattern });
      itemMutate();
      formState.resetDirty();
    },
    [formState, itemId, itemMutate]
  );

  //
  // G. Setup context object

  const contextObject = useMemo(
    () => ({
      //
      data: dataState,
      page: pageState,
      form: formState,
      //
      item_id: itemId,
      item_data: itemData,
      //
      updateSearchQuery: updateSearchQuery,
      clearSearchQuery: clearSearchQuery,
      //
      updateActiveSection: updateActiveSection,
      //
      validateItem: validateItem,
      saveItem: saveItem,
      lockItem: lockItem,
      deleteItem: deleteItem,
      closeItem: closeItem,
      //
      importPatternFromGtfs: importPatternFromGtfs,
      //
    }),
    [dataState, pageState, formState, itemId, itemData, updateSearchQuery, clearSearchQuery, updateActiveSection, validateItem, saveItem, lockItem, deleteItem, closeItem, importPatternFromGtfs]
  );

  //
  // H. Return provider

  return <PatternsExplorerContext.Provider value={contextObject}>{children}</PatternsExplorerContext.Provider>;

  //
}
