'use client';

/* * */

import AlertsExplorerIdPageHeader from '@/components/AlertsExplorerIdPageHeader/AlertsExplorerIdPageHeader';
import AlertsExplorerIdPageItemAffectedAgencies from '@/components/AlertsExplorerIdPageItemAffectedAgencies/AlertsExplorerIdPageItemAffectedAgencies';
import AlertsExplorerIdPageItemAffectedRoutes from '@/components/AlertsExplorerIdPageItemAffectedRoutes/AlertsExplorerIdPageItemAffectedRoutes';
import AlertsExplorerIdPageItemAffectedStops from '@/components/AlertsExplorerIdPageItemAffectedStops/AlertsExplorerIdPageItemAffectedStops';
import AlertsExplorerIdPageItemMedia from '@/components/AlertsExplorerIdPageItemMedia/AlertsExplorerIdPageItemMedia';
import AlertsExplorerIdPageItemPreview from '@/components/AlertsExplorerIdPageItemPreview/AlertsExplorerIdPageItemPreview';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { AlertOptions } from '@/schemas/Alert/options';
import { Divider, MultiSelect, SegmentedControl, Select, SimpleGrid, TextInput, Textarea } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

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
			return { label: alertOptionsTranslations(`status.${item}.label`), value: item };
		});
	}, [alertOptionsTranslations]);

	const availableTypes = useMemo(() => {
		if (!AlertOptions.type) return [];
		return AlertOptions.type.map((item) => {
			return { label: alertOptionsTranslations(`type.${item}.label`), value: item };
		});
	}, [alertOptionsTranslations]);

	const availableCauses = useMemo(() => {
		if (!AlertOptions.cause) return [];
		return AlertOptions.cause.map((item) => {
			return { label: alertOptionsTranslations(`cause.${item}.label`), value: item };
		});
	}, [alertOptionsTranslations]);

	const availableEffects = useMemo(() => {
		if (!AlertOptions.effect) return [];
		return AlertOptions.effect.map((item) => {
			return { label: alertOptionsTranslations(`effect.${item}.label`), value: item };
		});
	}, [alertOptionsTranslations]);

	const availableLiveMunicipalities = useMemo(() => {
		if (!allLiveMunicipalitiesData) return [];
		return allLiveMunicipalitiesData.map((item) => {
			return { label: item.name, value: item.id };
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
			centered: true,
			children: <Text size="h3">{t('operations.change_type.description')}</Text>,
			closeOnClickOutside: true,
			labels: { cancel: t('operations.change_type.cancel'), confirm: t('operations.change_type.confirm') },
			onConfirm: () => {
				alertsExplorerContext.form.setFieldValue('type', value);
				alertsExplorerContext.form.setFieldValue('affected_stops', []);
				alertsExplorerContext.form.setFieldValue('affected_routes', []);
				alertsExplorerContext.form.setFieldValue('affected_agencies', []);
			},
			title: <Text size="h2">{t('operations.change_type.title')}</Text>,
		});
	};

	//
	// D. Render components

	return (
		<Pannel header={<AlertsExplorerIdPageHeader />} loading={alertsExplorerContext.page.is_loading}>
			<AppLayoutSection title={t('sections.intro.title')}>
				<SimpleGrid cols={2}>
					<TextInput description={t('form.title.description')} label={t('form.title.label')} placeholder={t('form.title.placeholder')} {...alertsExplorerContext.form.getInputProps('title')} readOnly={alertsExplorerContext.page.is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<Textarea description={t('form.description.description')} label={t('form.description.label')} placeholder={t('form.description.placeholder')} {...alertsExplorerContext.form.getInputProps('description')} minRows={3} readOnly={alertsExplorerContext.page.is_read_only} autosize />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<TextInput description={t('form.url.description')} label={t('form.url.label')} placeholder={t('form.url.placeholder')} {...alertsExplorerContext.form.getInputProps('url')} readOnly={alertsExplorerContext.page.is_read_only} />
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
						description={t('form.status.description')}
						label={t('form.status.label')}
						nothingFoundMessage={t('form.status.nothingFound')}
						placeholder={t('form.status.placeholder')}
						{...alertsExplorerContext.form.getInputProps('status')}
						data={availableStatuses}
						readOnly={alertsExplorerContext.page.is_read_only}
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<DateTimePicker
						description={t('form.publish_start.description')}
						dropdownType="modal"
						label={t('form.publish_start.label')}
						placeholder={t('form.publish_start.placeholder')}
						{...alertsExplorerContext.form.getInputProps('publish_start')}
						readOnly={alertsExplorerContext.page.is_read_only}
						value={alertsExplorerContext.form.values.publish_start ? new Date(alertsExplorerContext.form.values.publish_start) : null}
						clearable
					/>
					<DateTimePicker
						description={t('form.publish_end.description')}
						dropdownType="modal"
						label={t('form.publish_end.label')}
						placeholder={t('form.publish_end.placeholder')}
						{...alertsExplorerContext.form.getInputProps('publish_end')}
						disabled={!alertsExplorerContext.form.values.publish_start}
						readOnly={alertsExplorerContext.page.is_read_only}
						value={alertsExplorerContext.form.values.publish_end ? new Date(alertsExplorerContext.form.values.publish_end) : null}
						clearable
					/>
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.active_period.title')}>
				<SimpleGrid cols={2}>
					<DateTimePicker
						description={t('form.active_period_start.description')}
						dropdownType="modal"
						label={t('form.active_period_start.label')}
						placeholder={t('form.active_period_start.placeholder')}
						{...alertsExplorerContext.form.getInputProps('active_period_start')}
						readOnly={alertsExplorerContext.page.is_read_only}
						value={alertsExplorerContext.form.values.active_period_start ? new Date(alertsExplorerContext.form.values.active_period_start) : null}
						clearable
					/>
					<DateTimePicker
						description={t('form.active_period_end.description')}
						dropdownType="modal"
						label={t('form.active_period_end.label')}
						placeholder={t('form.active_period_end.placeholder')}
						{...alertsExplorerContext.form.getInputProps('active_period_end')}
						disabled={!alertsExplorerContext.form.values.active_period_start}
						readOnly={alertsExplorerContext.page.is_read_only}
						value={alertsExplorerContext.form.values.active_period_end ? new Date(alertsExplorerContext.form.values.active_period_end) : null}
						clearable
					/>
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection title={t('sections.cause_effect.title')}>
				<SimpleGrid cols={2}>
					<Select
						description={t('form.cause.description')}
						label={t('form.cause.label')}
						nothingFoundMessage={t('form.cause.nothingFound')}
						placeholder={t('form.cause.placeholder')}
						{...alertsExplorerContext.form.getInputProps('cause')}
						data={availableCauses}
						readOnly={alertsExplorerContext.page.is_read_only}
						searchable
					/>
					<Select
						description={t('form.effect.description')}
						label={t('form.effect.label')}
						nothingFoundMessage={t('form.effect.nothingFound')}
						placeholder={t('form.effect.placeholder')}
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
						data={availableLiveMunicipalities}
						description={t('form.affected_municipalities.description')}
						label={t('form.affected_municipalities.label')}
						nothingFoundMessage={t('form.affected_municipalities.nothingFound')}
						placeholder={t('form.affected_municipalities.placeholder')}
						{...alertsExplorerContext.form.getInputProps('affected_municipalities')}
						readOnly={alertsExplorerContext.page.is_read_only}
						clearable
						searchable
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
