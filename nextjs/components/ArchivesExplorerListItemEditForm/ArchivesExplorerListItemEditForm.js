'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { DatePickerInput } from '@mantine/dates';
import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import AutoSave from '@/components/AutoSave/AutoSave';
import { Select, SimpleGrid, TextInput } from '@mantine/core';
import { ArchiveOptions } from '@/schemas/Archive/options';
import styles from './ArchivesExplorerListItemEditForm.module.css';
import { useMemo } from 'react';
import AppButtonDelete from '@/components/AppButtonDelete/AppButtonDelete';
import AppButtonLock from '@/components/AppButtonLock/AppButtonLock';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

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
		return allAgenciesData.map((item) => ({ value: item._id, label: item.name }));
	}, [allAgenciesData]);

	const allStatusDataFormatted = useMemo(() => {
		if (!ArchiveOptions.status) return [];
		return ArchiveOptions.status.map((item) => ({ value: item, label: archiveOptionsLabels(`status.${item}.label`) }));
	}, [archiveOptionsLabels]);

	const allSlaManagerFeederStatusDataFormatted = useMemo(() => {
		if (!ArchiveOptions.slamanager_feeder_status) return [];
		return ArchiveOptions.slamanager_feeder_status.map((item) => ({ value: item, label: archiveOptionsLabels(`slamanager_feeder_status.${item}.label`) }));
	}, [archiveOptionsLabels]);
	//
	// D. Render components

	return (
		<div className={styles.container}>
			<div className={styles.actions}>
				<AutoSave
					isValid={archivesExplorerItemContext.form.isValid()}
					isDirty={archivesExplorerItemContext.form.isDirty()}
					onValidate={archivesExplorerItemContext.validateItem}
					isErrorValidating={archivesExplorerItemContext.item.is_error}
					isErrorSaving={archivesExplorerItemContext.item.is_error_saving}
					isSaving={archivesExplorerItemContext.item.is_saving}
					onSave={archivesExplorerItemContext.saveItem}
					onClose={archivesExplorerItemContext.toggleEditMode}
				/>
				<div className={styles.spacer} />
				<AppAuthenticationCheck permissions={[{ scope: 'archives', action: 'lock' }]}>
					<AppButtonLock isLocked={archivesExplorerItemContext.item_data?.is_locked} onClick={archivesExplorerItemContext.lockItem} />
				</AppAuthenticationCheck>
				<AppAuthenticationCheck permissions={[{ scope: 'archives', action: 'delete' }]}>
					<AppButtonDelete
						onClick={archivesExplorerItemContext.deleteItem}
						disabled={archivesExplorerItemContext.item.is_read_only || archivesExplorerItemContext.form.values.reference_plan || archivesExplorerItemContext.form.values.offer_plan || archivesExplorerItemContext.form.values.operation_plan || archivesExplorerItemContext.form.values.apex_files}
					/>
				</AppAuthenticationCheck>
			</div>
			<SimpleGrid cols={4}>
				<Select label={t('form.agency.label')} placeholder={t('form.agency.placeholder')} nothingFoundMessage={t('form.agency.nothingFound')} data={allAgenciesDataFormatted} {...archivesExplorerItemContext.form.getInputProps('agency')} readOnly={archivesExplorerItemContext.item.is_read_only} />
				<DatePickerInput label={t('form.start_date.label')} placeholder={t('form.start_date.placeholder')} {...archivesExplorerItemContext.form.getInputProps('start_date')} readOnly={archivesExplorerItemContext.item.is_read_only} dropdownType="modal" />
				<DatePickerInput label={t('form.end_date.label')} placeholder={t('form.end_date.placeholder')} {...archivesExplorerItemContext.form.getInputProps('end_date')} readOnly={archivesExplorerItemContext.item.is_read_only} dropdownType="modal" />
				<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...archivesExplorerItemContext.form.getInputProps('code')} readOnly={archivesExplorerItemContext.item.is_read_only} />
			</SimpleGrid>
			<SimpleGrid cols={2}>
				<Select label={t('form.status.label')} placeholder={t('form.status.placeholder')} nothingFoundMessage={t('form.status.nothingFound')} data={allStatusDataFormatted} {...archivesExplorerItemContext.form.getInputProps('status')} readOnly={archivesExplorerItemContext.item.is_read_only} />
				<Select label={t('form.slamanager_feeder_status.label')} placeholder={t('form.slamanager_feeder_status.placeholder')} nothingFoundMessage={t('form.slamanager_feeder_status.nothingFound')} data={allSlaManagerFeederStatusDataFormatted} {...archivesExplorerItemContext.form.getInputProps('slamanager_feeder_status')} readOnly={archivesExplorerItemContext.item.is_read_only} />
			</SimpleGrid>
		</div>
	);

	//
}