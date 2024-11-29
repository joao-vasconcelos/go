'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import { usePlansItemContext } from '@/contexts/PlansItemContext';
import { PlanOptions } from '@/schemas/Plan/options';
import { Select, SimpleGrid, Switch } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

import styles from './styles.module.css';

/* * */

export function PlansListItemEditForm() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PlansListItemEditForm');
	const planOptionsLabels = useTranslations('PlanOptions');
	const plansItemContext = usePlansItemContext();

	//
	// B. Transform data

	const { data: allAgenciesData } = useSWR('/api/agencies');

	//
	// C. Transform data

	const allAgenciesDataFormatted = useMemo(() => {
		if (!allAgenciesData) return [];
		return allAgenciesData.map(item => ({ label: item.name, value: item._id }));
	}, [allAgenciesData]);

	const allStatusDataFormatted = useMemo(() => {
		if (!PlanOptions.feeder_status) return [];
		return PlanOptions.feeder_status.map(item => ({ label: planOptionsLabels(`feeder_status.${item}.label`), value: item }));
	}, [planOptionsLabels]);

	//
	// D. Render components

	return (
		<div className={styles.container}>
			<div className={styles.actions}>
				<AutoSave
					isDirty={plansItemContext.form.isDirty()}
					isErrorSaving={plansItemContext.item.is_error_saving}
					isErrorValidating={plansItemContext.item.is_error}
					isSaving={plansItemContext.item.is_saving}
					isValid={plansItemContext.form.isValid()}
					onClose={plansItemContext.toggleEditMode}
					onSave={plansItemContext.saveItem}
					onValidate={plansItemContext.validateItem}
				/>
				<div className={styles.spacer} />
				<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'plans' }]}>
					<AppButtonLock isLocked={plansItemContext.item_data?.is_locked} onClick={plansItemContext.lockItem} />
				</AppAuthenticationCheck>
				<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'plans' }]}>
					<AppButtonDelete
						disabled={plansItemContext.item.is_read_only || plansItemContext.form.values.reference_file || plansItemContext.form.values.operation_file || plansItemContext.form.values.is_approved}
						onClick={plansItemContext.deleteItem}
					/>
				</AppAuthenticationCheck>
				<Switch label={t('form.is_approved.label')} size="lg" {...plansItemContext.form.getInputProps('is_approved', { type: 'checkbox' })} readOnly={plansItemContext.item.is_read_only} />
			</div>
			<SimpleGrid cols={4}>
				<Select data={allAgenciesDataFormatted} label={t('form.agency.label')} nothingFoundMessage={t('form.agency.nothingFound')} placeholder={t('form.agency.placeholder')} {...plansItemContext.form.getInputProps('agency_id')} readOnly={plansItemContext.item.is_read_only} />
				<DatePickerInput label={t('form.valid_from.label')} placeholder={t('form.valid_from.placeholder')} {...plansItemContext.form.getInputProps('valid_from')} dropdownType="modal" readOnly={plansItemContext.item.is_read_only} />
				<DatePickerInput label={t('form.valid_until.label')} placeholder={t('form.valid_until.placeholder')} {...plansItemContext.form.getInputProps('valid_until')} dropdownType="modal" readOnly={plansItemContext.item.is_read_only} />
				<Select data={allStatusDataFormatted} label={t('form.feeder_status.label')} nothingFoundMessage={t('form.feeder_status.nothingFound')} placeholder={t('form.feeder_status.placeholder')} {...plansItemContext.form.getInputProps('feeder_status')} readOnly={plansItemContext.item.is_read_only} />
			</SimpleGrid>
		</div>
	);

	//
}
