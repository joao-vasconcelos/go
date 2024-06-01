'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import Pannel from '@/components/Pannel/Pannel';
import PatternsExplorerPattern from '@/components/PatternsExplorerPattern/PatternsExplorerPattern';
import RoutesExplorerIdPageHeader from '@/components/RoutesExplorerIdPageHeader/RoutesExplorerIdPageHeader';
import { useRoutesExplorerContext } from '@/contexts/RoutesExplorerContext';
import { RouteOptions } from '@/schemas/Route/options';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button, Divider, Select, SimpleGrid, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

/* * */

export default function RoutesExplorerIdPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('RoutesExplorerIdPage');
	const routeOptionsLabels = useTranslations('RouteOptions');

	const routesExplorerContext = useRoutesExplorerContext();

	const [isCreatingPattern, setIsCreatingPattern] = useState(false);

	//
	// B. Transform data

	const allPathTypeDataFormatted = useMemo(() => {
		if (!RouteOptions.path_type) return [];
		return RouteOptions.path_type.map(item => ({ label: routeOptionsLabels(`path_type.${item}.label`), value: item }));
	}, [routeOptionsLabels]);

	//
	// C. Handle actions

	const handleCreatePattern = async () => {
		try {
			setIsCreatingPattern(true);
			notify('new-pattern', 'loading', 'A criar Pattern...');
			const response = await API({ body: { code: `${routesExplorerContext.form.values.code}_${routesExplorerContext.form.values.patterns.length}`, parent_route: routesExplorerContext.item_id }, method: 'POST', operation: 'create', service: 'patterns' });
			routesExplorerContext.form.insertListItem('patterns', response._id);
			notify('new-pattern', 'success', 'Pattern criado com sucesso.');
			setIsCreatingPattern(false);
		}
		catch (error) {
			setIsCreatingPattern(false);
			console.log(error);
			notify('new-pattern', 'error', error.message);
		}
	};

	//
	// D. Render components

	return (
		<Pannel header={<RoutesExplorerIdPageHeader />} loading={routesExplorerContext.page.is_loading}>
			<AppLayoutSection description={t('sections.intro.description')} title={t('sections.intro.title')}>
				<SimpleGrid cols={4}>
					<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...routesExplorerContext.form.getInputProps('code')} readOnly={routesExplorerContext.page.is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...routesExplorerContext.form.getInputProps('name')} readOnly={routesExplorerContext.page.is_read_only} />
					<Select
						data={allPathTypeDataFormatted}
						label={t('form.path_type.label')}
						nothingFoundMessage={t('form.path_type.nothingFound')}
						placeholder={t('form.path_type.placeholder')}
						{...routesExplorerContext.form.getInputProps('path_type')}
						readOnly={routesExplorerContext.page.is_read_only}
						searchable
					/>
				</SimpleGrid>
			</AppLayoutSection>
			<Divider />
			<AppLayoutSection description={t('sections.patterns.description')} title={t('sections.patterns.title')}>
				<div>
					{routesExplorerContext.form.values.patterns.map((patternId, index) => <PatternsExplorerPattern key={index} patternId={patternId} />)}
				</div>
				<AppAuthenticationCheck permissions={[{ action: 'edit', scope: 'lines' }]}>
					<Button disabled={routesExplorerContext.form.values.patterns.length > 1 || routesExplorerContext.page.is_read_only} loading={isCreatingPattern} onClick={handleCreatePattern}>
						{t('form.patterns.create.title')}
					</Button>
				</AppAuthenticationCheck>
			</AppLayoutSection>
		</Pannel>
	);

	//
}
