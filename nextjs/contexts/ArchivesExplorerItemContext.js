'use client';

/* * */

import useSWR from 'swr';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isAllowed from '@/authentication/isAllowed';
import { useSession } from 'next-auth/react';
import { useForm, yupResolver } from '@mantine/form';
import { ArchiveValidation } from '@/schemas/Archive/validation';
import { ArchiveDefault } from '@/schemas/Archive/default';
import populate from '@/services/populate';
import API from '@/services/API';

/* * */

const ArchivesExplorerItemContext = createContext(null);

export function useArchivesExplorerItemContext() {
  return useContext(ArchivesExplorerItemContext);
}

/* * */

const initialItemState = {
  //
  is_error: false,
  is_loading: false,
  is_saving: false,
  is_error_saving: false,
  //
  is_read_only: false,
  //
  is_edit_mode: false,
  //
};

/* * */

export function ArchivesExplorerItemContextProvider({ itemId, itemData, children }) {
  //

  //
  // B. Setup state

  const [itemState, setItemState] = useState(initialItemState);

  //
  // C. Setup form

  const formState = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(ArchiveValidation),
    initialValues: ArchiveDefault,
  });

  //
  // D. Fetch data

  const { data: sessionData } = useSession();
  const { mutate: allItemsMutate } = useSWR('/api/archives');

  //
  // E. Transform data

  useEffect(() => {
    // Check if the use is allowed to edit the current page
    const isReadOnly = !isAllowed(sessionData, [{ scope: 'archives', action: 'edit' }], { handleError: true }) || itemData?.is_locked || itemState.is_saving;
    // Update state
    setItemState((prev) => ({ ...prev, is_read_only: isReadOnly }));
    //
  }, [itemData?.is_locked, itemState.is_saving, sessionData]);

  useEffect(() => {
    // Exit if no data is available or form is dirty
    if (!itemData || formState.isDirty()) return;
    // Merge the data with the default
    const populated = populate(ArchiveDefault, itemData);
    // Special case for dates
    populated.start_date = itemData.start_date ? new Date(itemData.start_date) : null;
    populated.end_date = itemData.end_date ? new Date(itemData.end_date) : null;
    // Update form
    formState.setValues(populated);
    formState.resetDirty(populated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.isDirty(), itemData]);

  //
  // F. Setup actions

  const validateItem = useCallback(async () => {
    formState.validate();
  }, [formState]);

  const saveItem = useCallback(async () => {
    try {
      setItemState((prev) => ({ ...prev, is_saving: true, is_error_saving: false }));
      await API({ service: 'archives', resourceId: itemId, operation: 'edit', method: 'PUT', body: formState.values });
      allItemsMutate();
      formState.resetDirty();
      setItemState((prev) => ({ ...prev, is_saving: false }));
    } catch (err) {
      console.log(err);
      setItemState((prev) => ({ ...prev, is_saving: false, is_error_saving: err }));
    }
  }, [allItemsMutate, formState, itemId]);

  const lockItem = useCallback(async () => {
    try {
      await API({ service: 'archives', resourceId: itemId, operation: 'lock', method: 'PUT' });
      allItemsMutate();
    } catch (err) {
      itemMutate();
      allItemsMutate();
      console.log(err);
      setItemState((prev) => ({ ...prev, is_error: err }));
    }
  }, [allItemsMutate, itemId]);

  const deleteItem = useCallback(async () => {
    try {
      setItemState((prev) => ({ ...prev, is_loading: true, is_error: false }));
      await API({ service: 'archives', resourceId: itemId, operation: 'delete', method: 'DELETE' });
      setItemState((prev) => ({ ...prev, is_loading: false, is_error: false }));
      allItemsMutate();
      formState.resetDirty();
    } catch (err) {
      allItemsMutate();
      console.log(err);
      setItemState((prev) => ({ ...prev, is_loading: false, is_error: err }));
    }
  }, [allItemsMutate, formState, itemId]);

  const toggleEditMode = useCallback(() => {
    setItemState((prev) => ({ ...prev, is_edit_mode: !prev.is_edit_mode }));
  }, []);

  //
  // G. Setup context object

  const contextObject = useMemo(
    () => ({
      //
      item: itemState,
      form: formState,
      //
      item_id: itemId,
      item_data: itemData,
      //
      validateItem: validateItem,
      saveItem: saveItem,
      lockItem: lockItem,
      deleteItem: deleteItem,
      toggleEditMode: toggleEditMode,
      //
    }),
    [itemState, formState, itemId, itemData, validateItem, saveItem, lockItem, deleteItem, toggleEditMode]
  );

  //
  // H. Return provider

  return <ArchivesExplorerItemContext.Provider value={contextObject}>{children}</ArchivesExplorerItemContext.Provider>;

  //
}
