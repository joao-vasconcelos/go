'use client';

/* * */

import useSWR from 'swr';
import doSearch from '@/services/doSearch';
import { useRouter } from '@/translations/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isAllowed } from '@/components/AuthGate/AuthGate';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import { Validation as IssueValidation } from '@/schemas/Issue/validation';
import { Default as IssueDefault, DefaultMilestone, DefaultCommment } from '@/schemas/Issue/default';
import populate from '@/services/populate';
import API from '@/services/API';

/* * */

const IssuesExplorerContext = createContext(null);

export function useIssuesExplorerContext() {
  return useContext(IssuesExplorerContext);
}

/* * */

const initialListState = {
  //
  is_error: false,
  is_loading: false,
  //
  search_query: '',
  //
  sort_key: '',
  //
  filter_status: null,
  filter_priority: null,
  filter_tags: null,
  filter_lines: null,
  filter_stops: null,
  filter_reports: null,
  filter_created_by: null,
  filter_assigned_to: null,
  //
  items: [],
  //
  available_tags: [],
  available_lines: [],
  available_stops: [],
  available_reports: [],
  available_created_by: [],
  available_assigned_to: [],
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

export function IssuesExplorerContextProvider({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const { issue_id: itemId } = useParams();

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
    validate: yupResolver(IssueValidation),
    initialValues: IssueDefault,
  });

  //
  // D. Fetch data

  const { data: userSession } = useSession();
  const { data: allItemsData, mutate: allItemsMutate } = useSWR('/api/issues');
  const { data: itemData, isLoading: itemLoading, mutate: itemMutate } = useSWR(itemId && `/api/issues/${itemId}`);

  //
  // E. Transform data

  useEffect(() => {
    setPageState((prev) => ({ ...prev, is_loading: itemLoading }));
  }, [itemLoading]);

  useEffect(() => {
    // Return if no data is available
    if (!allItemsData) return;
    // Create a variable to hold the filtered items
    let filteredItems = allItemsData;
    // Filter items based on selected status
    if (listState.filter_status) filteredItems = filteredItems.filter((item) => item.status === listState.filter_status);
    // Filter items based on selected priority
    if (listState.filter_priority) filteredItems = filteredItems.filter((item) => item.priority === listState.filter_priority);
    // Filter items based on selected tag
    if (listState.filter_tags) filteredItems = filteredItems.filter((item) => item.tags.includes(listState.filter_tags));
    // Filter items based on selected created_by
    if (listState.filter_created_by) filteredItems = filteredItems.filter((item) => item.created_by === listState.filter_created_by);
    // Filter items based on search query
    filteredItems = doSearch(listState.search_query, filteredItems, { keys: ['code', 'title', 'summary'] });
    // Update state
    setListState((prev) => ({ ...prev, items: filteredItems }));
    //
  }, [allItemsData, listState.filter_status, listState.filter_priority, listState.search_query, listState.filter_tags, listState.filter_created_by]);

  useEffect(() => {
    // Check if the use is allowed to edit the current page
    const isReadOnly = !isAllowed(userSession, 'issues', 'create_edit') || itemData?.is_locked || pageState.is_saving;
    // Update state
    setPageState((prev) => ({ ...prev, is_read_only: isReadOnly }));
    //
  }, [itemData?.is_locked, pageState.is_saving, userSession]);

  useEffect(() => {
    // Exit if no data is available or form is dirty
    if (!itemData || formState.isDirty()) return;
    // Merge the data with the default
    const populated = populate(IssueDefault, itemData);
    // Update form
    formState.setValues(populated);
    formState.resetDirty(populated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.isDirty(), itemData]);

  useEffect(() => {
    if (!allItemsData) return setListState((prev) => ({ ...prev, available_status: [] }));
    const allValues = allItemsData.map((item) => item.status);
    const allUniqueValues = new Set(allValues);
    setListState((prev) => ({ ...prev, available_status: Array.from(allUniqueValues) }));
  }, [allItemsData]);

  useEffect(() => {
    if (!allItemsData) return setListState((prev) => ({ ...prev, available_priority: [] }));
    const allValues = allItemsData.map((item) => item.priority);
    const allUniqueValues = new Set(allValues);
    setListState((prev) => ({ ...prev, available_priority: Array.from(allUniqueValues) }));
  }, [allItemsData]);

  useEffect(() => {
    if (!allItemsData) return setListState((prev) => ({ ...prev, available_created_by: [] }));
    const allValues = allItemsData.map((item) => item.created_by);
    const allUniqueValues = new Set(allValues);
    setListState((prev) => ({ ...prev, available_created_by: Array.from(allUniqueValues) }));
  }, [allItemsData]);

  useEffect(() => {
    if (!allItemsData) return setListState((prev) => ({ ...prev, available_tags: [] }));
    const allValues = allItemsData.flatMap((item) => item.tags);
    const allUniqueValues = new Set(allValues);
    setListState((prev) => ({ ...prev, available_tags: Array.from(allUniqueValues) }));
  }, [allItemsData]);

  //
  // F. Setup actions

  const updateSearchQuery = useCallback((value) => {
    setListState((prev) => ({ ...prev, search_query: value }));
  }, []);

  const clearSearchQuery = useCallback(() => {
    setListState((prev) => ({ ...prev, search_query: '' }));
  }, []);

  const updateSortKey = useCallback((value) => {
    setListState((prev) => ({ ...prev, sort_key: value }));
  }, []);

  const clearSortKey = useCallback(() => {
    setListState((prev) => ({ ...prev, sort_key: '' }));
  }, []);

  const updateFilterStatus = useCallback((value) => {
    setListState((prev) => {
      if (prev.filter_status === value) return { ...prev, filter_status: null };
      else return { ...prev, filter_status: value };
    });
  }, []);

  const updateFilterPriority = useCallback((value) => {
    setListState((prev) => {
      if (prev.filter_priority === value) return { ...prev, filter_priority: null };
      else return { ...prev, filter_priority: value };
    });
  }, []);

  const updateFilterTags = useCallback((value) => {
    setListState((prev) => {
      if (prev.filter_tags === value) return { ...prev, filter_tags: null };
      else return { ...prev, filter_tags: value };
    });
  }, []);

  const updateFilterCreatedBy = useCallback((value) => {
    setListState((prev) => {
      if (prev.filter_created_by === value) return { ...prev, filter_created_by: null };
      else return { ...prev, filter_created_by: value };
    });
  }, []);

  const updateFilterAssignedTo = useCallback((value) => {
    setListState((prev) => {
      if (prev.filter_assigned_to === value) return { ...prev, filter_assigned_to: null };
      else return { ...prev, filter_assigned_to: value };
    });
  }, []);

  const validateItem = useCallback(async () => {
    formState.validate();
  }, [formState]);

  const saveItem = useCallback(async () => {
    try {
      setPageState((prev) => ({ ...prev, is_saving: true, is_error_saving: false }));
      await API({ service: 'issues', resourceId: itemId, operation: 'edit', method: 'PUT', body: formState.values });
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
      await API({ service: 'issues', resourceId: itemId, operation: 'lock', method: 'PUT' });
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
      await API({ service: 'issues', resourceId: itemId, operation: 'delete', method: 'DELETE' });
      router.push('/issues');
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
    router.push('/issues');
  }, [router]);

  const addMilestone = useCallback(
    async (type, value) => {
      const newMilestone = { ...DefaultMilestone, created_by: userSession.user._id, type, value };
      formState.insertListItem('milestones', newMilestone);
    },
    [formState, userSession.user._id]
  );

  const addTag = useCallback(
    async (tagId) => {
      // Create a set of tag ids for this issue
      const uniqueSetOfTags = new Set(formState.values.tags);
      if (uniqueSetOfTags.has(tagId)) {
        // Remove the tag and a milestone
        addMilestone('tag_added', tagId);
        uniqueSetOfTags.delete(tagId);
      } else {
        // Add the tag and a milestone
        addMilestone('tag_removed', tagId);
        uniqueSetOfTags.add(tagId);
      }
      formState.setFieldValue('tags', [...uniqueSetOfTags]);
    },
    [addMilestone, formState]
  );

  const addComment = useCallback(
    async (commentText) => {
      const newComment = { ...DefaultCommment, created_by: userSession.user._id, text: commentText };
      formState.insertListItem('comments', newComment);
    },
    [formState, userSession.user._id]
  );

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
      updateSortKey: updateSortKey,
      clearSortKey: clearSortKey,
      updateFilterStatus: updateFilterStatus,
      updateFilterPriority: updateFilterPriority,
      updateFilterTags: updateFilterTags,
      updateFilterCreatedBy: updateFilterCreatedBy,
      updateFilterAssignedTo: updateFilterAssignedTo,
      //
      validateItem: validateItem,
      saveItem: saveItem,
      lockItem: lockItem,
      deleteItem: deleteItem,
      closeItem: closeItem,
      //
      addTag: addTag,
      addComment: addComment,
      //
    }),
    [
      listState,
      pageState,
      formState,
      itemId,
      itemData,
      updateSearchQuery,
      clearSearchQuery,
      updateSortKey,
      clearSortKey,
      updateFilterStatus,
      updateFilterPriority,
      updateFilterTags,
      updateFilterCreatedBy,
      updateFilterAssignedTo,
      validateItem,
      saveItem,
      lockItem,
      deleteItem,
      closeItem,
      addTag,
      addComment,
    ]
  );

  //
  // H. Return provider

  return <IssuesExplorerContext.Provider value={contextObject}>{children}</IssuesExplorerContext.Provider>;

  //
}
