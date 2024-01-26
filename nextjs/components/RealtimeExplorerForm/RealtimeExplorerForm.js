'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Select, Button, Alert, Divider } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import Text from '@/components/Text/Text';
import Loader from '@/components/Loader/Loader';
import Pannel from '@/components/Pannel/Pannel';
import { DatePickerInput } from '@mantine/dates';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';

/* * */

export default function RealtimeExplorerForm() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerForm');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Fetch data

  const { data: allAgenciesData } = useSWR('/api/agencies');

  //
  // C. Format data

  const availableAgencies = useMemo(() => {
    if (!allAgenciesData) return [];
    return allAgenciesData.map((agency) => ({ value: agency.code, label: agency.name || '-' }));
  }, [allAgenciesData]);

  //
  // D. Render components

  return (
    <Pannel>
      <Section>
        <Text size="h4" color="muted">
          {t('summary')}
        </Text>
      </Section>
      <Divider />
      <Section>
        <Select
          label={t('form.agency_code.label')}
          description={t('form.agency_code.description')}
          placeholder={t('form.agency_code.placeholder')}
          nothingFoundMessage={t('form.agency_code.nothingFound')}
          data={availableAgencies}
          value={realtimeExplorerContext.form.agency_code}
          onChange={realtimeExplorerContext.selectAgencyId}
          disabled={realtimeExplorerContext.request.is_loading}
          searchable
          clearable
        />
        <DatePickerInput
          label={t('form.operation_day.label')}
          description={t('form.operation_day.description')}
          placeholder={t('form.operation_day.placeholder')}
          value={realtimeExplorerContext.form.operation_day}
          onChange={realtimeExplorerContext.selectOperationDay}
          disabled={realtimeExplorerContext.request.is_loading || !realtimeExplorerContext.form.agency_code}
          dropdownType="modal"
          clearable
        />
      </Section>
      <Divider />
      <Section>
        {realtimeExplorerContext.request.is_loading && !realtimeExplorerContext.request.summary?.length && (
          <Alert icon={<Loader visible size={20} />} title={t('info.is_loading.title')} color="gray">
            {t('info.is_loading.description')}
          </Alert>
        )}
        {realtimeExplorerContext.request.is_loading && realtimeExplorerContext.request.summary?.length > 0 && (
          <Alert icon={<Loader visible size={20} />} title={t('info.is_loading_found_trips.title', { value: realtimeExplorerContext.request.summary?.length || 0 })} color="green">
            {t('info.is_loading_found_trips.description')}
          </Alert>
        )}
        {!realtimeExplorerContext.request.is_loading && (
          <Button onClick={realtimeExplorerContext.fetchEvents} disabled={!realtimeExplorerContext.form.agency_code || !realtimeExplorerContext.form.operation_day || realtimeExplorerContext.request.summary?.length > 0} loading={realtimeExplorerContext.request.is_loading}>
            {t('operations.submit.label')}
          </Button>
        )}
      </Section>
    </Pannel>
  );

  //
}
