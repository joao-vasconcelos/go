'use client';

/* * */

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/* * */

// 1.
// SETUP INITIAL STATE

const initialFormState = {
  //
  agency_id: null,
  operation_day: null,
  //
  is_open: false,
  is_loading: false,
  is_error: false,
  //
  max_step: 3, // Zero-based + the Completed step
  current_step: 0,
  //
  step_0_complete: false,
  step_1_complete: false,
};

/* * */

// 2.
// CREATE CONTEXTS

const RealtimeExplorerContext = createContext(null);

/* * */

// 3.
// SETUP CUSTOM HOOKS

export function useRealtimeExplorerContext() {
  return useContext(RealtimeExplorerContext);
}

/* * */

// 4.
// SETUP PROVIDER

export function RealtimeExplorerContextProvider({ children }) {
  //

  //
  // A. Setup state

  const [formState, setFormState] = useState(initialFormState);

  //
  // C. Setup actions

  const selectOperationDay = useCallback((operationDay) => {
    setFormState((prev) => ({ ...prev, operation_day: operationDay }));
  }, []);

  const clearOperationDay = useCallback(() => {
    setFormState((prev) => ({ ...prev, operation_day: null }));
  }, []);

  const selectAgencyId = useCallback((agencyId) => {
    setFormState((prev) => ({ ...prev, agency_id: agencyId }));
  }, []);

  const clearAgencyId = useCallback(() => {
    setFormState((prev) => ({ ...prev, agency_id: null }));
  }, []);

  //
  // E. Setup context object

  const contextObject = useMemo(
    () => ({
      //
      form: formState,
      //
      selectOperationDay: selectOperationDay,
      clearOperationDay: clearOperationDay,
      //
      selectAgencyId: selectAgencyId,
      clearAgencyId: clearAgencyId,
      //
    }),
    [formState, selectOperationDay, clearOperationDay, selectAgencyId, clearAgencyId]
  );

  //
  // D. Return provider

  return <RealtimeExplorerContext.Provider value={contextObject}>{children}</RealtimeExplorerContext.Provider>;

  //
}
