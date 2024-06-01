'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import LinesExplorerIdPageHeader from '@/components/LinesExplorerIdPageHeader/LinesExplorerIdPageHeader';
import Pannel from '@/components/Pannel/Pannel';
import RoutesExplorerRoute from '@/components/RoutesExplorerRoute/RoutesExplorerRoute';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import { LineOptions } from '@/schemas/Line/options';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button, Divider, MultiSelect, Select, SimpleGrid, Switch, Text, TextInput } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

export default function LinesExplorerIdPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('LinesExplorerIdPage');
	const lineOptionsLabels = useTranslations('LineOptions');
	const linesExplorerContext = useLinesExplorerContext();

	const [isCreatingRoute, setIsCreatingRoute] = useState(false);

	//
	// B. Fetch data

	const { data: allTypologiesData } = useSWR('/api/typologies');
	const { data: allFaresData } = useSWR('/api/fares');
	const { data: allAgenciesData } = useSWR('/api/agencies');

	//
	// C. Transform data

	const allTransportTypeDataFormatted = useMemo(() => {
		if (!LineOptions.transport_type) return [];
		return LineOptions.transport_type.map(item => ({ label: lineOptionsLabels(`transport_type.${item}.label`), value: item }));
	}, [lineOptionsLabels]);

	const allInterchangeDataFormatted = useMemo(() => {
		if (!LineOptions.interchange) return [];
		return LineOptions.interchange.map(item => ({ label: lineOptionsLabels(`interchange.${item}.label`), value: item }));
	}, [lineOptionsLabels]);

	const allTypologiesDataFormatted = useMemo(() => {
		if (!allTypologiesData) return [];
		return allTypologiesData.map((item) => {
			return { label: item.name || '-', value: item._id };
		});
	}, [allTypologiesData]);

	const allAgenciesDataFormatted = useMemo(() => {
		if (!allAgenciesData) return [];
		return allAgenciesData.map((item) => {
			return { label: item.name || '-', value: item._id };
		});
	}, [allAgenciesData]);

	const allPrepaidFaresDataFormatted = useMemo(() => {
		if (!allFaresData) return [];
		return allFaresData.filter(item => item.payment_method === '1').map(item => ({ label: `${item.name} (${item.price} ${item.currency_type})`, value: item._id }));
	}, [allFaresData]);

	const allOnboardFaresDataFormatted = useMemo(() => {
		if (!allFaresData) return [];
		return allFaresData.filter(item => item.payment_method === '0').map(item => ({ label: `${item.name} (${item.price} ${item.currency_type})`, value: item._id }));
	}, [allFaresData]);

	//
	// C. Render components

	const handleChangeTypology = (typology_id) => {
		const selectedTypologyData = allTypologiesData.find(item => item._id === typology_id);
		if (!selectedTypologyData) return;
		openConfirmModal({
			centered: true,
			children: <Text size="h3">{t('operations.change_typology.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'blue' },
			labels: { cancel: t('operations.change_typology.cancel'), confirm: t('operations.change_typology.confirm', { typology_name: selectedTypologyData.name }) },
			onConfirm: async () => {
				try {
					notify('change_typology', 'loading', t('operations.change_typology.loading'));
					linesExplorerContext.form.setFieldValue('typology', typology_id);
					linesExplorerContext.form.setFieldValue('prepaid_fare', selectedTypologyData.default_prepaid_fare || null);
					linesExplorerContext.form.setFieldValue('onboard_fares', selectedTypologyData.default_onboard_fares || []);
					notify('change_typology', 'success', t('operations.change_typology.success'));
				}
				catch (error) {
					console.log(error);
					setIsCreatingRoute(false);
					notify('change_typology', 'error', error.message || t('operations.change_typology.error'));
				}
			},
			title: <Text size="h2">{t('operations.change_typology.title')}</Text>,
		});
	};

	const handleCreateRoute = async () => {
		try {
			setIsCreatingRoute(true);
			notify('new-route', 'loading', t('form.routes.create.loading'));
			const response = await API({ body: { parent_line: linesExplorerContext.item_id }, method: 'POST', operation: 'create', service: 'routes' });
			linesExplorerContext.form.insertListItem('routes', response._id);
			notify('new-route', 'success', t('form.routes.create.success'));
			setIsCreatingRoute(false);
		}
		catch (error) {
			console.log(error);
			setIsCreatingRoute(false);
			notify('new-route', 'error', error.message || t('form.routes.create.error'));
		}
	};

	//
	// C. Render components

	return (
		<Pannel header={<LinesExplorerIdPageHeader />} loading={linesExplorerContext.page.is_loading}>
			<AppLayoutSection description={t('sections.intro.description')} title={t('sections.intro.title')}>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...linesExplorerContext.form.getInputProps('code')} readOnly={linesExplorerContext.page.is_read_only} />
					<TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...linesExplorerContext.form.getInputProps('short_name')} readOnly={linesExplorerContext.page.is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...linesExplorerContext.form.getInputProps('name')} readOnly={linesExplorerContext.page.is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<Select label={t('form.agency.label')} nothingFoundMessage={t('form.agency.nothingFound')} placeholder={t('form.agency.placeholder')} {...linesExplorerContext.form.getInputProps('agency')} data={allAgenciesDataFormatted} readOnly={linesExplorerContext.page.is_read_only} searchable />
					<Select
						label={t('form.transport_type.label')}
						nothingFoundMessage={t('form.transport_type.nothingFound')}
						placeholder={t('form.transport_type.placeholder')}
						{...linesExplorerContext.form.getInputProps('transport_type')}
						data={allTransportTypeDataFormatted}
						readOnly={linesExplorerContext.page.is_read_only}
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={3}>
					<Select
						data={allTypologiesDataFormatted}
						label={t('form.typology.label')}
						nothingFoundMessage={t('form.typology.nothingFound')}
						placeholder={t('form.typology.placeholder')}
						{...linesExplorerContext.form.getInputProps('typology')}
						onChange={handleChangeTypology}
						readOnly={linesExplorerContext.page.is_read_only}
						searchable
					/>
					<Select
						data={allInterchangeDataFormatted}
						label={t('form.interchange.label')}
						nothingFoundMessage={t('form.interchange.nothingFound')}
						placeholder={t('form.interchange.placeholder')}
						{...linesExplorerContext.form.getInputProps('interchange')}
						readOnly={linesExplorerContext.page.is_read_only}
						searchable
					/>
					<Select
						data={allPrepaidFaresDataFormatted}
						label={t('form.prepaid_fare.label')}
						nothingFoundMessage={t('form.prepaid_fare.nothingFound')}
						placeholder={t('form.prepaid_fare.placeholder')}
						{...linesExplorerContext.form.getInputProps('prepaid_fare')}
						readOnly={linesExplorerContext.page.is_read_only}
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={1}>
					<MultiSelect
						data={allOnboardFaresDataFormatted}
						label={t('form.onboard_fares.label')}
						nothingFoundMessage={t('form.onboard_fares.nothingFound')}
						placeholder={t('form.onboard_fares.placeholder')}
						{...linesExplorerContext.form.getInputProps('onboard_fares')}
						readOnly={linesExplorerContext.page.is_read_only}
						searchable
					/>
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection>
				<SimpleGrid cols={3}>
					<Switch label={t('form.circular.label')} size="md" {...linesExplorerContext.form.getInputProps('circular', { type: 'checkbox' })} readOnly={linesExplorerContext.page.is_read_only} />
					<Switch label={t('form.school.label')} size="md" {...linesExplorerContext.form.getInputProps('school', { type: 'checkbox' })} readOnly={linesExplorerContext.page.is_read_only} />
					<Switch label={t('form.continuous.label')} size="md" {...linesExplorerContext.form.getInputProps('continuous', { type: 'checkbox' })} readOnly={linesExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>

			<Divider />

			<AppLayoutSection description={t('sections.routes.description')} title={t('sections.routes.title')}>
				<div>
					{linesExplorerContext.form.values.routes.map((route_id, index) => <RoutesExplorerRoute key={index} line_id={linesExplorerContext.item_id} route_id={route_id} />)}
				</div>
				<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'lines' }]}>
					<Button disabled={linesExplorerContext.form.isDirty() || !linesExplorerContext.form.isValid() || linesExplorerContext.page.is_read_only} loading={isCreatingRoute} onClick={handleCreateRoute}>
						{t('form.routes.create.title')}
					</Button>
				</AppAuthenticationCheck>
			</AppLayoutSection>

			<AppAuthenticationCheck permissions={[{ action: 'debug', scope: 'configs' }]}>
				<Divider />
				<AppLayoutSection>
					<Text size="h2">{t('sections.debug.title')}</Text>
					{/* <JsonInput value={JSON.stringify(lineData)} rows={20} /> */}
				</AppLayoutSection>
			</AppAuthenticationCheck>
		</Pannel>
	);

	//
}
