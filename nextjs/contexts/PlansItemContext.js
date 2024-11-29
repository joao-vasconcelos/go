'use client';

/* * */

import isAllowed from '@/authentication/isAllowed';
import { PlanDefault } from '@/schemas/Plan/default';
import API from '@/services/API';
import populate from '@/services/populate';
import { useForm } from '@mantine/form';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

const initialItemState = {
	//
	is_edit_mode: false,
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

const PlansItemContext = createContext(initialItemState);

export function usePlansItemContext() {
	const context = useContext(PlansItemContext);
	if (!context) {
		throw new Error('usePlansItemContext must be used within a PlansItemContextProvider');
	}
	return context;
}

/* * */

export function PlansItemContextProvider({ children, itemData, itemId }) {
	//

	//
	// B. Setup state

	const [itemState, setItemState] = useState(initialItemState);

	//
	// C. Setup form

	const formState = useForm({
		clearInputErrorOnChange: true,
		initialValues: PlanDefault,
		// validate: zodResolver(PlanSchema),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	//
	// D. Fetch data

	const { data: sessionData } = useSession();
	const { mutate: allItemsMutate } = useSWR('/api/plans');

	//
	// E. Transform data

	useEffect(() => {
		// Check if the use is allowed to edit the current page
		const isReadOnly = !isAllowed(sessionData, [{ action: 'edit', scope: 'plans' }], { handleError: true }) || itemData?.is_locked || itemState.is_saving;
		// Update state
		setItemState(prev => ({ ...prev, is_read_only: isReadOnly }));
		//
	}, [itemData?.is_locked, itemState.is_saving, sessionData]);

	useEffect(() => {
		// Exit if no data is available or form is dirty
		if (!itemData || formState.isDirty()) return;
		// Merge the data with the default
		const populated = populate(PlanDefault, itemData);
		// Special case for dates
		populated.valid_from = itemData.valid_from ? DateTime.fromFormat(itemData.valid_from, 'yyyyMMdd').toJSDate() : null;
		populated.valid_until = itemData.valid_until ? DateTime.fromFormat(itemData.valid_until, 'yyyyMMdd').toJSDate() : null;
		// Update form
		formState.setValues(populated);
		formState.resetDirty(populated);
		//
	}, [formState.isDirty(), itemData]);

	//
	// F. Setup actions

	const validateItem = useCallback(async () => {
		formState.validate();
	}, [formState]);

	const saveItem = useCallback(async () => {
		try {
			setItemState(prev => ({ ...prev, is_error_saving: false, is_saving: true }));
			const parsedFormValues = {
				...formState.values,
				valid_from: formState.values.valid_from ? DateTime.fromJSDate(formState.values.valid_from).startOf('day').toFormat('yyyyMMdd') : null,
				valid_until: formState.values.valid_until ? DateTime.fromJSDate(formState.values.valid_until).startOf('day').toFormat('yyyyMMdd') : null,
			};
			await API({ body: parsedFormValues, method: 'PUT', operation: 'edit', resourceId: itemId, service: 'plans' });
			allItemsMutate();
			formState.resetDirty();
			setItemState(prev => ({ ...prev, is_saving: false }));
		}
		catch (error) {
			console.log(error);
			setItemState(prev => ({ ...prev, is_error_saving: error, is_saving: false }));
		}
	}, [allItemsMutate, formState, itemId]);

	const lockItem = useCallback(async () => {
		try {
			await API({ method: 'PUT', operation: 'lock', resourceId: itemId, service: 'plans' });
			allItemsMutate();
		}
		catch (error) {
			allItemsMutate();
			console.log(error);
			setItemState(prev => ({ ...prev, is_error: error }));
		}
	}, [allItemsMutate, itemId]);

	const deleteItem = useCallback(async () => {
		try {
			setItemState(prev => ({ ...prev, is_error: false, is_loading: true }));
			await API({ method: 'DELETE', operation: 'delete', resourceId: itemId, service: 'plans' });
			setItemState(prev => ({ ...prev, is_error: false, is_loading: false }));
			allItemsMutate();
			formState.resetDirty();
		}
		catch (error) {
			allItemsMutate();
			console.log(error);
			setItemState(prev => ({ ...prev, is_error: error, is_loading: false }));
		}
	}, [allItemsMutate, formState, itemId]);

	const toggleEditMode = useCallback(() => {
		setItemState(prev => ({ ...prev, is_edit_mode: !prev.is_edit_mode }));
	}, []);

	//
	// G. Setup context object

	const contextObject = useMemo(
		() => ({
			deleteItem: deleteItem,
			form: formState,
			//
			item: itemState,
			item_data: itemData,
			//
			item_id: itemId,
			lockItem: lockItem,
			saveItem: saveItem,
			toggleEditMode: toggleEditMode,
			//
			validateItem: validateItem,
			//
		}),
		[itemState, formState, itemId, itemData, validateItem, saveItem, lockItem, deleteItem, toggleEditMode],
	);

	//
	// H. Return provider

	return <PlansItemContext.Provider value={contextObject}>{children}</PlansItemContext.Provider>;

	//
}
