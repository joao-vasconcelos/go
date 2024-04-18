'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Select, Button, Alert, Divider } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import Loader from '@/components/Loader/Loader';
import { DatePickerInput } from '@mantine/dates';
import { useReportsExplorerSalesContext } from '@/contexts/ReportsExplorerSalesContext';
import { IconMoodAnnoyed } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import ReportsExplorerSalesFormHeader from '@/components/ReportsExplorerSalesFormHeader/ReportsExplorerSalesFormHeader';
import ReportsExplorerSalesFormIntro from '@/components/ReportsExplorerSalesFormIntro/ReportsExplorerSalesFormIntro';

/* * */

export default function ReportsExplorerSalesForm() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerSalesForm');
  const reportsExplorerSalesContext = useReportsExplorerSalesContext();

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
    <Pannel header={<ReportsExplorerSalesFormHeader />}>
      <ReportsExplorerSalesFormIntro />
      <Divider />
      <Section>
        <Select
          label={t('form.agency_code.label')}
          description={t('form.agency_code.description')}
          placeholder={t('form.agency_code.placeholder')}
          nothingFoundMessage={t('form.agency_code.nothingFound')}
          data={availableAgencies}
          {...reportsExplorerSalesContext.form.getInputProps('agency_code')}
          disabled={reportsExplorerSalesContext.request.is_loading}
          searchable
          clearable
        />
        <DatePickerInput
          label={t('form.start_date.label')}
          description={t('form.start_date.description')}
          placeholder={t('form.start_date.placeholder')}
          {...reportsExplorerSalesContext.form.getInputProps('start_date')}
          disabled={reportsExplorerSalesContext.request.is_loading || !reportsExplorerSalesContext.form.values.agency_code}
          dropdownType="modal"
          clearable
        />
        <DatePickerInput
          label={t('form.end_date.label')}
          description={t('form.end_date.description')}
          placeholder={t('form.end_date.placeholder')}
          {...reportsExplorerSalesContext.form.getInputProps('end_date')}
          minDate={reportsExplorerSalesContext.form.values.start_date}
          disabled={reportsExplorerSalesContext.request.is_loading || !reportsExplorerSalesContext.form.values.agency_code || !reportsExplorerSalesContext.form.values.start_date}
          dropdownType="modal"
          clearable
        />
      </Section>
      <Divider />
      <Section>
        {reportsExplorerSalesContext.request.is_error && (
          <Alert icon={<IconMoodAnnoyed size={20} />} title={t('info.is_error.title')} color="red">
            {t('info.is_error.description', { errorMessage: reportsExplorerSalesContext.request.is_error })}
          </Alert>
        )}
        {reportsExplorerSalesContext.request.is_loading && !reportsExplorerSalesContext.request.summary?.length && (
          <Alert icon={<Loader visible size={20} />} title={t('info.is_loading.title')} color="gray">
            {t('info.is_loading.description')}
          </Alert>
        )}
        {reportsExplorerSalesContext.request.is_loading && reportsExplorerSalesContext.request.summary?.length > 0 && (
          <Alert icon={<Loader visible size={20} />} title={t('info.is_loading_found_trips.title', { value: reportsExplorerSalesContext.request.summary?.length || 0 })} color="green">
            {t('info.is_loading_found_trips.description')}
          </Alert>
        )}
        {!reportsExplorerSalesContext.request.is_loading && (
          <Button
            onClick={reportsExplorerSalesContext.fetchSummary}
            disabled={!reportsExplorerSalesContext.form.values.agency_code || !reportsExplorerSalesContext.form.values.start_date || !reportsExplorerSalesContext.form.values.end_date || reportsExplorerSalesContext.request.is_success}
            loading={reportsExplorerSalesContext.request.is_loading}
          >
            {reportsExplorerSalesContext.request.is_error ? t('operations.retry.label') : t('operations.submit.label')}
          </Button>
        )}
      </Section>
    </Pannel>
  );

  //
}
