'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { SimpleGrid, Select } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import { useMemo } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';

/* * */

export default function RealtimeExplorerOverviewForm() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerOverviewForm');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Fetch data

  const { data: allAgenciesData } = useSWR('/api/agencies');

  //
  // C. Format data

  const availableAgencies = useMemo(() => {
    if (!allAgenciesData) return [];
    return allAgenciesData.map((agency) => ({ value: agency._id, label: agency.name || '-' }));
  }, [allAgenciesData]);

  //
  // D. Render components

  return (
    <Section>
      <SimpleGrid cols={2}>
        <Select
          label={t('form.agency_id.label')}
          description={t('form.agency_id.description')}
          placeholder={t('form.agency_id.placeholder')}
          nothingFoundMessage={t('form.agency_id.nothingFound')}
          data={availableAgencies}
          value={realtimeExplorerContext.form.agency_id}
          onChange={realtimeExplorerContext.selectAgencyId}
          searchable
          clearable
        />
        <DatePickerInput
          label={t('form.operation_day.label')}
          description={t('form.operation_day.description')}
          placeholder={t('form.operation_day.placeholder')}
          value={realtimeExplorerContext.form.operation_day}
          onChange={realtimeExplorerContext.selectOperationDay}
          disabled={!realtimeExplorerContext.form.agency_id}
          dropdownType="modal"
          clearable
        />
      </SimpleGrid>
    </Section>
  );

  //
}
