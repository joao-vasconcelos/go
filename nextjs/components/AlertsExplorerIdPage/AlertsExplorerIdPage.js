'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { DateTimePicker } from '@mantine/dates';
import { AlertOptions } from '@/schemas/Alert/options';
import { SimpleGrid, TextInput, Divider, Textarea, Select, MultiSelect, SegmentedControl } from '@mantine/core';
import AlertsExplorerIdPageHeader from '@/components/AlertsExplorerIdPageHeader/AlertsExplorerIdPageHeader';
import AlertsExplorerIdPageItemMedia from '@/components/AlertsExplorerIdPageItemMedia/AlertsExplorerIdPageItemMedia';
import AlertsExplorerIdPageItemAffectedStops from '@/components/AlertsExplorerIdPageItemAffectedStops/AlertsExplorerIdPageItemAffectedStops';
import AlertsExplorerIdPageItemAffectedRoutes from '@/components/AlertsExplorerIdPageItemAffectedRoutes/AlertsExplorerIdPageItemAffectedRoutes';
import AlertsExplorerIdPageItemAffectedAgencies from '@/components/AlertsExplorerIdPageItemAffectedAgencies/AlertsExplorerIdPageItemAffectedAgencies';
import AlertsExplorerIdPageItemPreview from '@/components/AlertsExplorerIdPageItemPreview/AlertsExplorerIdPageItemPreview';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { openConfirmModal } from '@mantine/modals';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';

/* * */

export default function AlertsExplorerIdPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('AlertsExplorerIdPage');
	const alertOptionsTranslations = useTranslations('AlertOptions');

	const alertsExplorerContext = useAlertsExplorerContext();

	//
	// B. Fetch data

	const { data: allLiveMunicipalitiesData } = useSWR('https://api.carrismetropolitana.pt/municipalities');

	//
	// C. Transform data

	const availableStatuses = useMemo(() => {
		if (!AlertOptions.status) return [];
		return AlertOptions.status.map((item) => {
			return { value: item, label: alertOptionsTranslations(`status.${item}.label`) };
		});
	}, [alertOptionsTranslations]);

	const availableTypes = useMemo(() => {
		if (!AlertOptions.type) return [];
		return AlertOptions.type.map((item) => {
			return { value: item, label: alertOptionsTranslations(`type.${item}.label`) };
		});
	}, [alertOptionsTranslations]);

	const availableCauses = useMemo(() => {
		if (!AlertOptions.cause) return [];
		return AlertOptions.cause.map((item) => {
			return { value: item, label: alertOptionsTranslations(`cause.${item}.label`) };
		});
	}, [alertOptionsTranslations]);

	const availableEffects = useMemo(() => {
		if (!AlertOptions.effect) return [];
		return AlertOptions.effect.map((item) => {
			return { value: item, label: alertOptionsTranslations(`effect.${item}.label`) };
		});
	}, [alertOptionsTranslations]);

	const availableLiveMunicipalities = useMemo(() => {
		if (!allLiveMunicipalitiesData) return [];
		return allLiveMunicipalitiesData.map((item) => {
			return { value: item.id, label: item.name };
		});
	}, [allLiveMunicipalitiesData]);

	//
	// D. Render components

	const handleChangeAlertType = (value) => {
		if (!alertsExplorerContext.form.values.affected_stops.length && !alertsExplorerContext.form.values.affected_routes.length && !alertsExplorerContext.form.values.affected_agencies.length) {
			alertsExplorerContext.form.setFieldValue('type', value);
			return;
		}
		openConfirmModal({
			title: <Text size="h2">{t('operations.change_type.title')}</Text>,
			centered: true,
			closeOnClickOutside: true,
			children: <Text size="h3">{t('operations.change_type.description')}</Text>,
			labels: { confirm: t('operations.change_type.confirm'), cancel: t('operations.change_type.cancel') },
			onConfirm: () => {
				alertsExplorerContext.form.setFieldValue('type', value);
				alertsExplorerContext.form.setFieldValue('affected_stops', []);
				alertsExplorerContext.form.setFieldValue('affected_routes', []);
				alertsExplorerContext.form.setFieldValue('affected_agencies', []);
			},
		});
	};

	//
	// D. Render components

	return (
		<Pannel loading={alertsExplorerContext.page.is_loading} header={<AlertsExplorerIdPageHeader />}>
			<AppLayoutSection title={t('sections.intro.title')}>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.title.label')} description={t('form.title.description')} placeholder={t('form.title.placeholder')} {...alertsExplorerContext.form.getInputProps('title')} readOnly={alertsExplorerContext.page.is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<Textarea label={t('form.description.label')} description={t('form.description.description')} placeholder={t('form.description.placeholder')} {...alertsExplorerContext.form.getInputProps('description')} readOnly={alertsExplorerContext.page.is_read_only} minRows={3} autosize />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<TextInput label={t('form.url.label')} description={t('form.url.description')} placeholder={t('form.url.placeholder')} {...alertsExplorerContext.form.getInputProps('url')} readOnly={alertsExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.media.title')}>
				<SimpleGrid cols={1}>
					<AlertsExplorerIdPageItemMedia />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.publishing.title')}>
				<SimpleGrid cols={1}>
					<Select
						label={t('form.status.label')}
						placeholder={t('form.status.placeholder')}
						description={t('form.status.description')}
						nothingFoundMessage={t('form.status.nothingFound')}
						{...alertsExplorerContext.form.getInputProps('status')}
						data={availableStatuses}
						readOnly={alertsExplorerContext.page.is_read_only}
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<DateTimePicker
						dropdownType="modal"
						label={t('form.publish_start.label')}
						placeholder={t('form.publish_start.placeholder')}
						description={t('form.publish_start.description')}
						{...alertsExplorerContext.form.getInputProps('publish_start')}
						value={alertsExplorerContext.form.values.publish_start ? new Date(alertsExplorerContext.form.values.publish_start) : null}
						readOnly={alertsExplorerContext.page.is_read_only}
						clearable
					/>
					<DateTimePicker
						dropdownType="modal"
						label={t('form.publish_end.label')}
						placeholder={t('form.publish_end.placeholder')}
						description={t('form.publish_end.description')}
						{...alertsExplorerContext.form.getInputProps('publish_end')}
						value={alertsExplorerContext.form.values.publish_end ? new Date(alertsExplorerContext.form.values.publish_end) : null}
						disabled={!alertsExplorerContext.form.values.publish_start}
						readOnly={alertsExplorerContext.page.is_read_only}
						clearable
					/>
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.active_period.title')}>
				<SimpleGrid cols={2}>
					<DateTimePicker
						dropdownType="modal"
						label={t('form.active_period_start.label')}
						placeholder={t('form.active_period_start.placeholder')}
						description={t('form.active_period_start.description')}
						{...alertsExplorerContext.form.getInputProps('active_period_start')}
						value={alertsExplorerContext.form.values.active_period_start ? new Date(alertsExplorerContext.form.values.active_period_start) : null}
						readOnly={alertsExplorerContext.page.is_read_only}
						clearable
					/>
					<DateTimePicker
						dropdownType="modal"
						label={t('form.active_period_end.label')}
						placeholder={t('form.active_period_end.placeholder')}
						description={t('form.active_period_end.description')}
						{...alertsExplorerContext.form.getInputProps('active_period_end')}
						value={alertsExplorerContext.form.values.active_period_end ? new Date(alertsExplorerContext.form.values.active_period_end) : null}
						disabled={!alertsExplorerContext.form.values.active_period_start}
						readOnly={alertsExplorerContext.page.is_read_only}
						clearable
					/>
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.cause_effect.title')}>
				<SimpleGrid cols={2}>
					<Select
						label={t('form.cause.label')}
						placeholder={t('form.cause.placeholder')}
						description={t('form.cause.description')}
						nothingFoundMessage={t('form.cause.nothingFound')}
						{...alertsExplorerContext.form.getInputProps('cause')}
						data={availableCauses}
						readOnly={alertsExplorerContext.page.is_read_only}
						searchable
					/>
					<Select
						label={t('form.effect.label')}
						placeholder={t('form.effect.placeholder')}
						description={t('form.effect.description')}
						nothingFoundMessage={t('form.effect.nothingFound')}
						{...alertsExplorerContext.form.getInputProps('effect')}
						data={availableEffects}
						readOnly={alertsExplorerContext.page.is_read_only}
						searchable
					/>
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.entities.title')}>
				<SimpleGrid cols={1}>
					<MultiSelect
						label={t('form.affected_municipalities.label')}
						placeholder={t('form.affected_municipalities.placeholder')}
						description={t('form.affected_municipalities.description')}
						nothingFoundMessage={t('form.affected_municipalities.nothingFound')}
						data={availableLiveMunicipalities}
						{...alertsExplorerContext.form.getInputProps('affected_municipalities')}
						readOnly={alertsExplorerContext.page.is_read_only}
						searchable
						clearable
					/>
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<SegmentedControl data={availableTypes} {...alertsExplorerContext.form.getInputProps('type')} onChange={handleChangeAlertType} />
				</SimpleGrid>
				{alertsExplorerContext.form.values.type === 'select_stops' && <AlertsExplorerIdPageItemAffectedStops />}
				{alertsExplorerContext.form.values.type === 'select_routes' && <AlertsExplorerIdPageItemAffectedRoutes />}
				{alertsExplorerContext.form.values.type === 'select_agencies' && <AlertsExplorerIdPageItemAffectedAgencies />}
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.preview.title')}>
				<AlertsExplorerIdPageItemPreview />
			</AppLayoutSection>
		</Pannel>
	);

	//
}