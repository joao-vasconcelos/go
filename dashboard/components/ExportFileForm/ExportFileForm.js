'use client';

import useSWR from 'swr';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import parseDate from '@/services/parseDate';
import { useTranslations } from 'next-intl';
import { ExportOptions } from '@/schemas/Export/options';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import { IconCloudPlus } from '@tabler/icons-react';
import { SimpleGrid, Select, MultiSelect, Button, Divider, Switch } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import { useState, useMemo } from 'react';
import API from '@/services/API';
import { DatePickerInput } from '@mantine/dates';

/* * */
/* EXPORT FILE FORM */

export default function ExportFileForm() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ExportFileForm');
  const exportOptionsTranslations = useTranslations('ExportOptions');

  const { data: session } = useSession();

  const [isCreatingExport, setIsCreatingExport] = useState(false);

  const [selectedExportType, setSelectedExportType] = useState();
  const [selectedAgencyId, setSelectedAgencyId] = useState();
  const [selectedLineIdsToInclude, setSelectedLineIdsToInclude] = useState([]);
  const [selectedLineIdsToExclude, setSelectedLineIdsToExclude] = useState([]);
  const [selectedPlanStartDate, setSelectedPlanStartDate] = useState();
  const [selectedPlanEndDate, setSelectedPlanEndDate] = useState();
  const [shouldConcatenateCalendars, setShouldConcatenateCalendars] = useState();

  //
  // B. Fetch data

  const { mutate: allExportsMutate } = useSWR('/api/exports');
  const { data: allAgenciesData } = useSWR('/api/agencies');
  const { data: allLinesData } = useSWR('/api/lines');

  //
  // B. Format data

  const availableExportTypes = useMemo(() => {
    if (!ExportOptions.export_type) return [];
    return ExportOptions.export_type
      .filter((type) => {
        return isAllowed(session, 'exports', type);
      })
      .map((type) => {
        return { value: type, label: exportOptionsTranslations(`export_type.${type}.label`) };
      });
  }, [exportOptionsTranslations, session]);

  const availableAgencies = useMemo(() => {
    if (!allAgenciesData) return [];
    return allAgenciesData
      .filter((agency) => {
        const isAllowed = true; // !isAllowed(session, 'export', type)
        return isAllowed;
      })
      .map((agency) => {
        return { value: agency._id, label: agency.name || '-' };
      });
  }, [allAgenciesData]);

  const availableLinesToInclude = useMemo(() => {
    if (!allLinesData && !selectedAgencyId) return [];
    const filteredLinesBySelectedAgency = allLinesData.filter((item) => item.agency === selectedAgencyId);
    return filteredLinesBySelectedAgency.map((item) => {
      return { value: item._id, label: `(${item.short_name}) ${item.name}` };
    });
  }, [allLinesData, selectedAgencyId]);

  const availableLinesToExclude = useMemo(() => {
    if (!allLinesData || !selectedAgencyId) return [];
    const filteredLinesBySelectedAgency = allLinesData.filter((item) => item.agency === selectedAgencyId);
    return filteredLinesBySelectedAgency.map((item) => {
      return { value: item._id, label: `(${item.short_name}) ${item.name}` };
    });
  }, [allLinesData, selectedAgencyId]);

  //
  // D. Handle actions

  const handleStartExport = async () => {
    try {
      setIsCreatingExport(true);
      await API({
        service: 'exports',
        operation: 'create',
        method: 'POST',
        body: {
          export_type: selectedExportType,
          agency_id: selectedAgencyId,
          lines_included: selectedLineIdsToInclude,
          lines_excluded: selectedLineIdsToExclude,
          start_date: parseDate(selectedPlanStartDate),
          end_date: parseDate(selectedPlanEndDate),
          concatenate_calendars: shouldConcatenateCalendars,
        },
      });
      allExportsMutate();
      //   setSelectedAgencyId();
      //   setSelectedLineIdsToInclude([]);
      //   setSelectedLineIdsToExclude([]);
      //   setSelectedPlanStartDate();
      //   setSelectedPlanEndDate();
      //   setShouldConcatenateCalendars();
      setIsCreatingExport(false);
    } catch (err) {
      console.log(err);
      setIsCreatingExport(false);
    }
  };

  //
  // E. Render components

  return (
    <Pannel
      header={
        <>
          <IconCloudPlus size={22} />
          <Text size='h2' full>
            {t('title')}
          </Text>
        </>
      }
    >
      <Section>
        <Text size='h4' color='muted'>
          {t('description')}
        </Text>
      </Section>
      <Divider />
      <Section>
        <Select
          label={t('form.export_type.label')}
          placeholder={t('form.export_type.placeholder')}
          nothingFound={t('form.export_type.nothingFound')}
          data={availableExportTypes}
          value={selectedExportType}
          onChange={setSelectedExportType}
          searchable
          clearable
        />
      </Section>
      <Divider />
      <Section>
        <Select
          label={t('form.agencies.label')}
          placeholder={t('form.agencies.placeholder')}
          description={t('form.agencies.description')}
          nothingFound={t('form.agencies.nothingFound')}
          data={availableAgencies}
          value={selectedAgencyId}
          onChange={setSelectedAgencyId}
          disabled={!selectedExportType}
          searchable
          clearable
        />
      </Section>
      <Divider />
      <Section>
        <MultiSelect
          label={t('form.lines_include.label')}
          placeholder={t('form.lines_include.placeholder')}
          description={t('form.lines_include.description')}
          nothingFound={t('form.lines_include.nothingFound')}
          data={availableLinesToInclude}
          value={selectedLineIdsToInclude}
          onChange={setSelectedLineIdsToInclude}
          disabled={!selectedAgencyId || selectedLineIdsToExclude.length}
          searchable
          clearable
        />
        <MultiSelect
          label={t('form.lines_exclude.label')}
          placeholder={t('form.lines_exclude.placeholder')}
          description={t('form.lines_exclude.description')}
          nothingFound={t('form.lines_exclude.nothingFound')}
          data={availableLinesToExclude}
          value={selectedLineIdsToExclude}
          onChange={setSelectedLineIdsToExclude}
          disabled={!selectedAgencyId || selectedLineIdsToInclude.length}
          searchable
          clearable
        />
      </Section>
      <Divider />
      <Section>
        <SimpleGrid cols={2}>
          <DatePickerInput label={t('form.start_date.label')} placeholder={t('form.start_date.placeholder')} value={selectedPlanStartDate} onChange={setSelectedPlanStartDate} disabled={!selectedAgencyId} dropdownType='modal' clearable />
          <DatePickerInput
            label={t('form.end_date.label')}
            placeholder={t('form.end_date.placeholder')}
            value={selectedPlanEndDate}
            onChange={setSelectedPlanEndDate}
            minDate={selectedPlanStartDate}
            disabled={!selectedPlanStartDate}
            dropdownType='modal'
            clearable
          />
        </SimpleGrid>
        <SimpleGrid cols={1}>
          <Switch
            label={t('form.concatenate_calendars.label')}
            description={t('form.concatenate_calendars.description')}
            checked={shouldConcatenateCalendars}
            onChange={(event) => setShouldConcatenateCalendars(event.currentTarget.checked)}
            disabled={!selectedAgencyId || !selectedPlanStartDate || !selectedPlanEndDate}
          />
        </SimpleGrid>
      </Section>
      <Divider />
      <Section>
        <Button onClick={handleStartExport} loading={isCreatingExport} disabled={!selectedAgencyId || !selectedPlanStartDate || !selectedPlanEndDate}>
          {t('operations.start.label')}
        </Button>
      </Section>
    </Pannel>
  );
}
