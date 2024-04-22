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
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import ReportsExplorerRealtimeFormHeader from '@/components/ReportsExplorerRealtimeFormHeader/ReportsExplorerRealtimeFormHeader';
import { IconMoodAnnoyed } from '@tabler/icons-react';

/* * */

export default function ReportsExplorerRealtimeForm() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerRealtimeForm');
  const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

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
    <Pannel header={<ReportsExplorerRealtimeFormHeader />}>
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
          value={reportsExplorerRealtimeContext.form.agency_code}
          onChange={reportsExplorerRealtimeContext.selectAgencyId}
          disabled={reportsExplorerRealtimeContext.request.is_loading}
          searchable
          clearable
        />
        <DatePickerInput
          label={t('form.operation_day.label')}
          description={t('form.operation_day.description')}
          placeholder={t('form.operation_day.placeholder')}
          value={reportsExplorerRealtimeContext.form.operation_day}
          onChange={reportsExplorerRealtimeContext.selectOperationDay}
          disabled={reportsExplorerRealtimeContext.request.is_loading || !reportsExplorerRealtimeContext.form.agency_code}
          dropdownType="modal"
          clearable
        />
      </Section>
      <Divider />
      <Section>
        {reportsExplorerRealtimeContext.request.is_error && (
          <Alert icon={<IconMoodAnnoyed size={20} />} title={t('info.is_error.title')} color="red">
            {t('info.is_error.description', { errorMessage: reportsExplorerRealtimeContext.request.is_error })}
          </Alert>
        )}
        {reportsExplorerRealtimeContext.request.is_loading && !reportsExplorerRealtimeContext.request.summary?.length && (
          <Alert icon={<Loader visible size={20} />} title={t('info.is_loading.title')} color="gray">
            {t('info.is_loading.description')}
          </Alert>
        )}
        {reportsExplorerRealtimeContext.request.is_loading && reportsExplorerRealtimeContext.request.summary?.length > 0 && (
          <Alert icon={<Loader visible size={20} />} title={t('info.is_loading_found_trips.title', { value: reportsExplorerRealtimeContext.request.summary?.length || 0 })} color="green">
            {t('info.is_loading_found_trips.description')}
          </Alert>
        )}
        {!reportsExplorerRealtimeContext.request.is_loading && (
          <Button
            onClick={reportsExplorerRealtimeContext.fetchEvents}
            disabled={!reportsExplorerRealtimeContext.form.agency_code || !reportsExplorerRealtimeContext.form.operation_day || reportsExplorerRealtimeContext.request.summary?.length > 0}
            loading={reportsExplorerRealtimeContext.request.is_loading}
          >
            {reportsExplorerRealtimeContext.request.is_error ? t('operations.retry.label') : t('operations.submit.label')}
          </Button>
        )}
      </Section>
    </Pannel>
  );

  //
}
