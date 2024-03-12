'use client';

/* * */

import useSWR from 'swr';
import API from '@/services/API';
import notify from '@/services/notify';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import { SimpleGrid, TextInput, Select, Divider, Switch, Button, Text, MultiSelect } from '@mantine/core';
import { useLinesExplorerContext } from '@/contexts/LinesExplorerContext';
import LinesExplorerIdPageHeader from '@/components/LinesExplorerIdPageHeader/LinesExplorerIdPageHeader';
import RoutesExplorerRoute from '@/components/RoutesExplorerRoute/RoutesExplorerRoute';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import { LineOptions } from '@/schemas/Line/options';
import { openConfirmModal } from '@mantine/modals';

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
    return LineOptions.transport_type.map((item) => ({ value: item, label: lineOptionsLabels(`transport_type.${item}.label`) }));
  }, [lineOptionsLabels]);

  const allInterchangeDataFormatted = useMemo(() => {
    if (!LineOptions.interchange) return [];
    return LineOptions.interchange.map((item) => ({ value: item, label: lineOptionsLabels(`interchange.${item}.label`) }));
  }, [lineOptionsLabels]);

  const allTypologiesDataFormatted = useMemo(() => {
    if (!allTypologiesData) return [];
    return allTypologiesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [allTypologiesData]);

  const allAgenciesDataFormatted = useMemo(() => {
    if (!allAgenciesData) return [];
    return allAgenciesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [allAgenciesData]);

  const allPrepaidFaresDataFormatted = useMemo(() => {
    if (!allFaresData) return [];
    return allFaresData.filter((item) => item.payment_method === '1').map((item) => ({ value: item._id, label: `${item.name} (${item.price} ${item.currency_type})` }));
  }, [allFaresData]);

  const allOnboardFaresDataFormatted = useMemo(() => {
    if (!allFaresData) return [];
    return allFaresData.filter((item) => item.payment_method === '0').map((item) => ({ value: item._id, label: `${item.name} (${item.price} ${item.currency_type})` }));
  }, [allFaresData]);

  //
  // C. Render components

  const handleChangeTypology = (typology_id) => {
    const selectedTypologyData = allTypologiesData.find((item) => item._id === typology_id);
    if (!selectedTypologyData) return;
    openConfirmModal({
      title: <Text size="h2">{t('operations.change_typology.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('operations.change_typology.description')}</Text>,
      labels: { confirm: t('operations.change_typology.confirm', { typology_name: selectedTypologyData.name }), cancel: t('operations.change_typology.cancel') },
      confirmProps: { color: 'blue' },
      onConfirm: async () => {
        try {
          notify('change_typology', 'loading', t('operations.change_typology.loading'));
          linesExplorerContext.form.setFieldValue('typology', typology_id);
          linesExplorerContext.form.setFieldValue('prepaid_fare', selectedTypologyData.default_prepaid_fare || null);
          linesExplorerContext.form.setFieldValue('onboard_fares', selectedTypologyData.default_onboard_fares || []);
          notify('change_typology', 'success', t('operations.change_typology.success'));
        } catch (err) {
          console.log(err);
          setIsCreatingRoute(false);
          notify('change_typology', 'error', err.message || t('operations.change_typology.error'));
        }
      },
    });
  };

  const handleCreateRoute = async () => {
    try {
      setIsCreatingRoute(true);
      notify('new-route', 'loading', t('form.routes.create.loading'));
      const response = await API({ service: 'routes', operation: 'create', method: 'POST', body: { parent_line: linesExplorerContext.item_id } });
      linesExplorerContext.form.insertListItem('routes', response._id);
      notify('new-route', 'success', t('form.routes.create.success'));
      setIsCreatingRoute(false);
    } catch (err) {
      console.log(err);
      setIsCreatingRoute(false);
      notify('new-route', 'error', err.message || t('form.routes.create.error'));
    }
  };

  //
  // C. Render components

  return (
    <Pannel loading={linesExplorerContext.page.is_loading} header={<LinesExplorerIdPageHeader />}>
      <AppLayoutSection title={t('sections.intro.title')} description={t('sections.intro.description')}>
        <SimpleGrid cols={2}>
          <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...linesExplorerContext.form.getInputProps('code')} readOnly={linesExplorerContext.page.is_read_only} />
          <TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...linesExplorerContext.form.getInputProps('short_name')} readOnly={linesExplorerContext.page.is_read_only} />
        </SimpleGrid>
        <SimpleGrid cols={1}>
          <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...linesExplorerContext.form.getInputProps('name')} readOnly={linesExplorerContext.page.is_read_only} />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Select label={t('form.agency.label')} placeholder={t('form.agency.placeholder')} nothingFoundMessage={t('form.agency.nothingFound')} {...linesExplorerContext.form.getInputProps('agency')} data={allAgenciesDataFormatted} readOnly={linesExplorerContext.page.is_read_only} searchable />
          <Select
            label={t('form.transport_type.label')}
            placeholder={t('form.transport_type.placeholder')}
            nothingFoundMessage={t('form.transport_type.nothingFound')}
            {...linesExplorerContext.form.getInputProps('transport_type')}
            data={allTransportTypeDataFormatted}
            readOnly={linesExplorerContext.page.is_read_only}
            searchable
          />
        </SimpleGrid>
        <SimpleGrid cols={3}>
          <Select
            label={t('form.typology.label')}
            placeholder={t('form.typology.placeholder')}
            nothingFoundMessage={t('form.typology.nothingFound')}
            data={allTypologiesDataFormatted}
            {...linesExplorerContext.form.getInputProps('typology')}
            onChange={handleChangeTypology}
            readOnly={linesExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.interchange.label')}
            placeholder={t('form.interchange.placeholder')}
            nothingFoundMessage={t('form.interchange.nothingFound')}
            data={allInterchangeDataFormatted}
            {...linesExplorerContext.form.getInputProps('interchange')}
            readOnly={linesExplorerContext.page.is_read_only}
            searchable
          />
          <Select
            label={t('form.prepaid_fare.label')}
            placeholder={t('form.prepaid_fare.placeholder')}
            nothingFoundMessage={t('form.prepaid_fare.nothingFound')}
            data={allPrepaidFaresDataFormatted}
            {...linesExplorerContext.form.getInputProps('prepaid_fare')}
            readOnly={linesExplorerContext.page.is_read_only}
            searchable
          />
        </SimpleGrid>
        <SimpleGrid cols={1}>
          <MultiSelect
            label={t('form.onboard_fares.label')}
            placeholder={t('form.onboard_fares.placeholder')}
            nothingFoundMessage={t('form.onboard_fares.nothingFound')}
            data={allOnboardFaresDataFormatted}
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

      <AppLayoutSection title={t('sections.routes.title')} description={t('sections.routes.description')}>
        <div>
          {linesExplorerContext.form.values.routes.map((route_id, index) => (
            <RoutesExplorerRoute key={index} line_id={linesExplorerContext.item_id} route_id={route_id} />
          ))}
        </div>
        <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'create' }]}>
          <Button onClick={handleCreateRoute} loading={isCreatingRoute} disabled={linesExplorerContext.form.isDirty() || !linesExplorerContext.form.isValid() || linesExplorerContext.page.is_read_only}>
            {t('form.routes.create.title')}
          </Button>
        </AppAuthenticationCheck>
      </AppLayoutSection>

      <AppAuthenticationCheck permissions={[{ scope: 'configs', action: 'debug' }]}>
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
