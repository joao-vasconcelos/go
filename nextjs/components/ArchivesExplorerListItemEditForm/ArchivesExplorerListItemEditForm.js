'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AutoSave from '@/components/AutoSave/AutoSave';
import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import { ArchiveOptions } from '@/schemas/Archive/options';
import { Select, SimpleGrid, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

import styles from './ArchivesExplorerListItemEditForm.module.css';

/* * */

export default function ArchivesExplorerListItemEditForm() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ArchivesExplorerListItemEditForm');
	const archiveOptionsLabels = useTranslations('ArchiveOptions');
	const archivesExplorerItemContext = useArchivesExplorerItemContext();

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
		if (!ArchiveOptions.status) return [];
		return ArchiveOptions.status.map(item => ({ label: archiveOptionsLabels(`status.${item}.label`), value: item }));
	}, [archiveOptionsLabels]);

	const allSlaManagerFeederStatusDataFormatted = useMemo(() => {
		if (!ArchiveOptions.slamanager_feeder_status) return [];
		return ArchiveOptions.slamanager_feeder_status.map(item => ({ label: archiveOptionsLabels(`slamanager_feeder_status.${item}.label`), value: item }));
	}, [archiveOptionsLabels]);
	//
	// D. Render components

	return (
		<div className={styles.container}>
			<div className={styles.actions}>
				<AutoSave
					isDirty={archivesExplorerItemContext.form.isDirty()}
					isErrorSaving={archivesExplorerItemContext.item.is_error_saving}
					isErrorValidating={archivesExplorerItemContext.item.is_error}
					isSaving={archivesExplorerItemContext.item.is_saving}
					isValid={archivesExplorerItemContext.form.isValid()}
					onClose={archivesExplorerItemContext.toggleEditMode}
					onSave={archivesExplorerItemContext.saveItem}
					onValidate={archivesExplorerItemContext.validateItem}
				/>
				<div className={styles.spacer} />
				<AppAuthenticationCheck permissions={[{ action: 'lock', scope: 'archives' }]}>
					<AppButtonLock isLocked={archivesExplorerItemContext.item_data?.is_locked} onClick={archivesExplorerItemContext.lockItem} />
				</AppAuthenticationCheck>
				<AppAuthenticationCheck permissions={[{ action: 'delete', scope: 'archives' }]}>
					<AppButtonDelete
						disabled={archivesExplorerItemContext.item.is_read_only || archivesExplorerItemContext.form.values.reference_plan || archivesExplorerItemContext.form.values.offer_plan || archivesExplorerItemContext.form.values.operation_plan || archivesExplorerItemContext.form.values.apex_files}
						onClick={archivesExplorerItemContext.deleteItem}
					/>
				</AppAuthenticationCheck>
			</div>
			<SimpleGrid cols={4}>
				<Select data={allAgenciesDataFormatted} label={t('form.agency.label')} nothingFoundMessage={t('form.agency.nothingFound')} placeholder={t('form.agency.placeholder')} {...archivesExplorerItemContext.form.getInputProps('agency')} readOnly={archivesExplorerItemContext.item.is_read_only} />
				<DatePickerInput label={t('form.start_date.label')} placeholder={t('form.start_date.placeholder')} {...archivesExplorerItemContext.form.getInputProps('start_date')} dropdownType="modal" readOnly={archivesExplorerItemContext.item.is_read_only} />
				<DatePickerInput label={t('form.end_date.label')} placeholder={t('form.end_date.placeholder')} {...archivesExplorerItemContext.form.getInputProps('end_date')} dropdownType="modal" readOnly={archivesExplorerItemContext.item.is_read_only} />
				<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...archivesExplorerItemContext.form.getInputProps('code')} readOnly={archivesExplorerItemContext.item.is_read_only} />
			</SimpleGrid>
			<SimpleGrid cols={2}>
				<Select data={allStatusDataFormatted} label={t('form.status.label')} nothingFoundMessage={t('form.status.nothingFound')} placeholder={t('form.status.placeholder')} {...archivesExplorerItemContext.form.getInputProps('status')} readOnly={archivesExplorerItemContext.item.is_read_only} />
				<Select data={allSlaManagerFeederStatusDataFormatted} label={t('form.slamanager_feeder_status.label')} nothingFoundMessage={t('form.slamanager_feeder_status.nothingFound')} placeholder={t('form.slamanager_feeder_status.placeholder')} {...archivesExplorerItemContext.form.getInputProps('slamanager_feeder_status')} readOnly={archivesExplorerItemContext.item.is_read_only} />
			</SimpleGrid>
		</div>
	);

	//
}
