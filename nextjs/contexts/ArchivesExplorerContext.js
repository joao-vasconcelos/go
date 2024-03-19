'use client';

/* * */

import useSWR from 'swr';
import doSearch from '@/services/doSearch';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* * */

const ArchivesExplorerContext = createContext(null);

export function useArchivesExplorerContext() {
  return useContext(ArchivesExplorerContext);
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

/* * */

export function ArchivesExplorerContextProvider({ children }) {
  //

  //
  // B. Setup state

  const [listState, setListState] = useState(initialListState);

  //
  // D. Fetch data

  const { data: allItemsData } = useSWR('/api/archives');

  //
  // E. Transform data

  useEffect(() => {
    // Return if no data is available
    if (!allItemsData) return;
    // Filter items based on search query
    const filteredItems = doSearch(listState.search_query, allItemsData, { keys: ['code'] });
    // Update state
    setListState((prev) => ({ ...prev, items: filteredItems }));
    //
  }, [allItemsData, listState.search_query]);

  //
  // F. Setup actions

  const updateSearchQuery = useCallback((value) => {
    setListState((prev) => ({ ...prev, search_query: value }));
  }, []);

  const clearSearchQuery = useCallback(() => {
    setListState((prev) => ({ ...prev, search_query: '' }));
  }, []);

  //
  // G. Setup context object

  const contextObject = useMemo(
    () => ({
      //
      list: listState,
      //
      updateSearchQuery: updateSearchQuery,
      clearSearchQuery: clearSearchQuery,
      //
    }),
    [listState, updateSearchQuery, clearSearchQuery]
  );

  //
  // H. Return provider

  return <ArchivesExplorerContext.Provider value={contextObject}>{children}</ArchivesExplorerContext.Provider>;

  //
}
