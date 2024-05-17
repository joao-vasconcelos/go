'use client';

/* * */

import useSWR from 'swr';
import API from '@/services/API';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ExportFormDefault, ExportFormDefaultGtfsV29, ExportFormDefaultNetexV1, ExportFormDefaultRegionalMergeV1 } from '@/schemas/Export/default';
import { ExportFormValidation, ExportFormValidationGtfsV29, ExportFormValidationNetexV1, ExportFormValidationRegionalMergeV1 } from '@/schemas/Export/validation';
import { useForm, yupResolver } from '@mantine/form';
import { DateTime } from 'luxon';

/* * */

const ExportsExplorerContext = createContext(null);

export function useExportsExplorerContext() {
	return useContext(ExportsExplorerContext);
}

/* * */

const initialListState = {
	//
	is_loading: false,
	//
};

const initialFormState = {
	//
	is_loading: false,
	is_valid: false,
	is_error: false,
	is_read_only: false,
	//
};

/* * */

export function ExportsExplorerContextProvider({ children }) {
	//

	//
	// B. Setup state

	const [formState, setFormState] = useState(initialFormState);
	const [formStateMainValuesState, setFormStateMainValuesState] = useState(ExportFormDefault);

	//
	// C. Setup forms

	const formStateMain = useForm({
		validateInputOnBlur: true,
		validateInputOnChange: true,
		clearInputErrorOnChange: true,
		validate: yupResolver(ExportFormValidation),
		initialValues: ExportFormDefault,
	});

	const formStateGtfsV29 = useForm({
		validateInputOnBlur: true,
		validateInputOnChange: true,
		clearInputErrorOnChange: true,
		validate: yupResolver(ExportFormValidationGtfsV29),
		initialValues: ExportFormDefaultGtfsV29,
	});

	const formStateNetexV1 = useForm({
		validateInputOnBlur: true,
		validateInputOnChange: true,
		clearInputErrorOnChange: true,
		validate: yupResolver(ExportFormValidationNetexV1),
		initialValues: ExportFormDefaultNetexV1,
	});

	const formStateRegionalMergeV1 = useForm({
		validateInputOnBlur: true,
		validateInputOnChange: true,
		clearInputErrorOnChange: true,
		validate: yupResolver(ExportFormValidationRegionalMergeV1),
		initialValues: ExportFormDefaultRegionalMergeV1,
	});

	//
	// F. Setup actions

	const { mutate: allExportsMutate } = useSWR('/api/exports');

	//
	// F. Setup actions

	useEffect(() => {
		setFormState((prev) => ({ ...prev, is_valid: true }));
		if (formStateMain.values.kind === 'regional_merge_v1') formStateMain.setFieldValue('notify_user', false);
		// // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formStateMain.values.kind]);

	//
	// F. Setup actions

	const handleStartExport = useCallback(async () => {
		try {
			// Update interface
			setFormState((prev) => ({ ...prev, is_loading: true, is_read_only: true }));
			// Setup request body based on export kind
			const formStateMainValues = formStateMain.getValues();
			//
			let requestBody = {};
			switch (formStateMainValues.kind) {
			case 'gtfs_v29':
				requestBody = {
					...formStateMainValues,
					...formStateGtfsV29.values,
					feed_start_date: DateTime.fromJSDate(formStateGtfsV29.values.feed_start_date).toFormat('yyyyMMdd'),
					feed_end_date: DateTime.fromJSDate(formStateGtfsV29.values.feed_end_date).toFormat('yyyyMMdd'),
					calendars_clip_start_date: formStateGtfsV29.values.calendars_clip_start_date ? DateTime.fromJSDate(formStateGtfsV29.values.calendars_clip_start_date).toFormat('yyyyMMdd') : null,
					calendars_clip_end_date: formStateGtfsV29.values.calendars_clip_end_date ? DateTime.fromJSDate(formStateGtfsV29.values.calendars_clip_end_date).toFormat('yyyyMMdd') : null,
				};
				break;
			case 'netex_v1':
				requestBody = {
					...formStateMainValues,
					...formStateNetexV1.values,
					active_Date: DateTime.fromJSDate(formStateGtfsV29.values.active_date).toFormat('yyyyMMdd'),
				};
				break;
			case 'regional_merge_v1':
				requestBody = { ...formStateMainValues, ...formStateRegionalMergeV1.values };
				break;
			}
			// Perform the API call
			await API({ service: 'exports', operation: 'create', method: 'POST', body: requestBody });
			// Mutate results
			allExportsMutate();
			// Reset form
			formStateMain.setValues(ExportFormDefault);
			formStateGtfsV29.setValues(ExportFormDefaultGtfsV29);
			formStateNetexV1.setValues(ExportFormDefaultNetexV1);
			formStateRegionalMergeV1.setValues(ExportFormDefaultRegionalMergeV1);
			// Update interface
			setFormState(initialFormState);
			//
		} catch (error) {
			console.log(error);
			setFormState((prev) => ({ ...prev, is_loading: false, is_read_only: false, is_error: true }));
		}
	}, [allExportsMutate, formStateGtfsV29, formStateMain, formStateNetexV1, formStateRegionalMergeV1]);

	//
	// G. Setup context object

	const contextObject = useMemo(
		() => ({
			//
			form: formState,
			//
			form_main: formStateMain,
			form_main_values: formStateMainValuesState,
			form_gtfs_v29: formStateGtfsV29,
			form_netex_v1: formStateNetexV1,
			form_regional_merge_v1: formStateRegionalMergeV1,
			//
			startExport: handleStartExport,
			//
		}),
		[formState, formStateGtfsV29, formStateMain, formStateMainValuesState, formStateNetexV1, formStateRegionalMergeV1, handleStartExport],
	);

	//
	// H. Return provider

	return <ExportsExplorerContext.Provider value={contextObject}>{children}</ExportsExplorerContext.Provider>;

	//
}