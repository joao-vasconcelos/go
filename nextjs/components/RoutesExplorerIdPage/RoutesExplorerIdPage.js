'use client';

/* * */

import API from '@/services/API';
import notify from '@/services/notify';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import { SimpleGrid, TextInput, Select, Divider, Button } from '@mantine/core';
import { useRoutesExplorerContext } from '@/contexts/RoutesExplorerContext';
import RoutesExplorerIdPageHeader from '@/components/RoutesExplorerIdPageHeader/RoutesExplorerIdPageHeader';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import { RouteOptions } from '@/schemas/Route/options';
import PatternsExplorerPattern from '@/components/PatternsExplorerPattern/PatternsExplorerPattern';

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
    return RouteOptions.path_type.map((item) => ({ value: item, label: routeOptionsLabels(`path_type.${item}.label`) }));
  }, [routeOptionsLabels]);

  //
  // C. Handle actions

  const handleCreatePattern = async () => {
    try {
      setIsCreatingPattern(true);
      notify('new-pattern', 'loading', 'A criar Pattern...');
      const response = await API({ service: 'patterns', operation: 'create', method: 'POST', body: { code: `${routesExplorerContext.form.values.code}_${routesExplorerContext.form.values.patterns.length}`, parent_route: routesExplorerContext.item_id } });
      routesExplorerContext.form.insertListItem('patterns', response._id);
      notify('new-pattern', 'success', 'Pattern criado com sucesso.');
      setIsCreatingPattern(false);
    } catch (error) {
      setIsCreatingPattern(false);
      console.log(error);
      notify('new-pattern', 'error', error.message);
    }
  };

  //
  // D. Render components

  return (
    <Pannel loading={routesExplorerContext.page.is_loading} header={<RoutesExplorerIdPageHeader />}>
      <AppLayoutSection title={t('sections.intro.title')} description={t('sections.intro.description')}>
        <SimpleGrid cols={4}>
          <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...routesExplorerContext.form.getInputProps('code')} readOnly={routesExplorerContext.page.is_read_only} />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...routesExplorerContext.form.getInputProps('name')} readOnly={routesExplorerContext.page.is_read_only} />
          <Select
            label={t('form.path_type.label')}
            placeholder={t('form.path_type.placeholder')}
            nothingFoundMessage={t('form.path_type.nothingFound')}
            data={allPathTypeDataFormatted}
            {...routesExplorerContext.form.getInputProps('path_type')}
            readOnly={routesExplorerContext.page.is_read_only}
            searchable
          />
        </SimpleGrid>
      </AppLayoutSection>
      <Divider />
      <AppLayoutSection title={t('sections.patterns.title')} description={t('sections.patterns.description')}>
        <div>
          {routesExplorerContext.form.values.patterns.map((patternId, index) => (
            <PatternsExplorerPattern key={index} patternId={patternId} />
          ))}
        </div>
        <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'edit' }]}>
          <Button onClick={handleCreatePattern} loading={isCreatingPattern} disabled={routesExplorerContext.form.values.patterns.length > 1 || routesExplorerContext.page.is_read_only}>
            {t('form.patterns.create.title')}
          </Button>
        </AppAuthenticationCheck>
      </AppLayoutSection>
    </Pannel>
  );

  //
}
