'use client';

/* * */

import { ExportFormDefault, ExportFormDefaultGtfsV29, ExportFormDefaultNetexV1, ExportFormDefaultRegionalMergeV1, ExportFormDefaultSlaDefaultV1 } from '@/schemas/Export/default';
import { ExportFormValidation, ExportFormValidationGtfsV29, ExportFormValidationNetexV1, ExportFormValidationRegionalMergeV1, ExportFormValidationSlaDefaultV1 } from '@/schemas/Export/validation';
import API from '@/services/API';
import { useForm, yupResolver } from '@mantine/form';
import { DateTime } from 'luxon';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

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
	is_error: false,
	//
	is_loading: false,
	is_read_only: false,
	is_valid: false,
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
		clearInputErrorOnChange: true,
		initialValues: ExportFormDefault,
		validate: yupResolver(ExportFormValidation),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	const formStateGtfsV29 = useForm({
		clearInputErrorOnChange: true,
		initialValues: ExportFormDefaultGtfsV29,
		validate: yupResolver(ExportFormValidationGtfsV29),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	const formStateNetexV1 = useForm({
		clearInputErrorOnChange: true,
		initialValues: ExportFormDefaultNetexV1,
		validate: yupResolver(ExportFormValidationNetexV1),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	const formStateRegionalMergeV1 = useForm({
		clearInputErrorOnChange: true,
		initialValues: ExportFormDefaultRegionalMergeV1,
		validate: yupResolver(ExportFormValidationRegionalMergeV1),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	const formStateSlaDefaultV1 = useForm({
		clearInputErrorOnChange: true,
		initialValues: ExportFormDefaultSlaDefaultV1,
		validate: yupResolver(ExportFormValidationSlaDefaultV1),
		validateInputOnBlur: true,
		validateInputOnChange: true,
	});

	//
	// F. Setup actions

	const { mutate: allExportsMutate } = useSWR('/api/exports');

	//
	// F. Setup actions

	useEffect(() => {
		setFormState(prev => ({ ...prev, is_valid: true }));
		if (formStateMain.values.kind === 'regional_merge_v1') formStateMain.setFieldValue('notify_user', false);
		// // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formStateMain.values.kind]);

	//
	// F. Setup actions

	const handleStartExport = useCallback(async () => {
		try {
			// Update interface
			setFormState(prev => ({ ...prev, is_loading: true, is_read_only: true }));
			// Setup request body based on export kind
			const formStateMainValues = formStateMain.getValues();
			//
			let requestBody = {};
			switch (formStateMainValues.kind) {
				case 'gtfs_v29':
					requestBody = {
						...formStateMainValues,
						...formStateGtfsV29.values,
						calendars_clip_end_date: formStateGtfsV29.values.calendars_clip_end_date ? DateTime.fromJSDate(formStateGtfsV29.values.calendars_clip_end_date).toFormat('yyyyMMdd') : null,
						calendars_clip_start_date: formStateGtfsV29.values.calendars_clip_start_date ? DateTime.fromJSDate(formStateGtfsV29.values.calendars_clip_start_date).toFormat('yyyyMMdd') : null,
						feed_end_date: DateTime.fromJSDate(formStateGtfsV29.values.feed_end_date).toFormat('yyyyMMdd'),
						feed_start_date: DateTime.fromJSDate(formStateGtfsV29.values.feed_start_date).toFormat('yyyyMMdd'),
					};
					break;
				case 'netex_v1':
					requestBody = {
						...formStateMainValues,
						...formStateNetexV1.values,
					};
					break;
				case 'regional_merge_v1':
					requestBody = {
						...formStateMainValues,
						...formStateRegionalMergeV1.values,
						active_date: DateTime.fromJSDate(formStateRegionalMergeV1.values.active_date).toFormat('yyyyMMdd'),
					};
					break;
				case 'sla_default_v1':
					requestBody = {
						...formStateMainValues,
						...formStateSlaDefaultV1.values,
						end_date: DateTime.fromJSDate(formStateSlaDefaultV1.values.end_date).toFormat('yyyyMMdd'),
						start_date: DateTime.fromJSDate(formStateSlaDefaultV1.values.start_date).toFormat('yyyyMMdd'),
					};
					break;
			}
			// Perform the API call
			await API({ body: requestBody, method: 'POST', operation: 'create', service: 'exports' });
			// Mutate results
			allExportsMutate();
			// Reset form
			formStateMain.setValues(ExportFormDefault);
			formStateGtfsV29.setValues(ExportFormDefaultGtfsV29);
			formStateNetexV1.setValues(ExportFormDefaultNetexV1);
			formStateRegionalMergeV1.setValues(ExportFormDefaultRegionalMergeV1);
			formStateSlaDefaultV1.setValues(ExportFormDefaultSlaDefaultV1);
			// Update interface
			setFormState(initialFormState);
			//
		}
		catch (error) {
			console.log(error);
			setFormState(prev => ({ ...prev, is_error: true, is_loading: false, is_read_only: false }));
		}
	}, [allExportsMutate, formStateGtfsV29, formStateMain, formStateNetexV1, formStateRegionalMergeV1]);

	//
	// G. Setup context object

	const contextObject = useMemo(
		() => ({
			//
			form: formState,
			form_gtfs_v29: formStateGtfsV29,
			//
			form_main: formStateMain,
			form_main_values: formStateMainValuesState,
			form_netex_v1: formStateNetexV1,
			form_regional_merge_v1: formStateRegionalMergeV1,
			form_sla_default_v1: formStateSlaDefaultV1,
			//
			startExport: handleStartExport,
			//
		}),
		[formState, formStateGtfsV29, formStateSlaDefaultV1, formStateMain, formStateMainValuesState, formStateNetexV1, formStateRegionalMergeV1, handleStartExport],
	);

	//
	// H. Return provider

	return <ExportsExplorerContext.Provider value={contextObject}>{children}</ExportsExplorerContext.Provider>;

	//
}
