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
import { SimpleGrid, Select, MultiSelect, Button, Divider } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import { useState, useMemo } from 'react';
import API from '@/services/API';
import { DatePickerInput } from '@mantine/dates';

/* * */
/* EXPORT TYPE 1 */

function ExportGTFSv18() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ExportGTFSv18');
  const { data: session } = useSession();

  const [selectedAgencyId, setSelectedAgencyId] = useState();
  const [selectedLineIdsToInclude, setSelectedLineIdsToInclude] = useState([]);
  const [selectedLineIdsToExclude, setSelectedLineIdsToExclude] = useState([]);
  const [selectedPlanStartDate, setSelectedPlanStartDate] = useState();
  const [selectedPlanEndDate, setSelectedPlanEndDate] = useState();

  const [isCreatingExport, setIsCreatingExport] = useState(false);

  console.log('selectedAgencyId', selectedAgencyId);
  console.log('selectedPlanStartDate', selectedPlanStartDate);
  console.log('selectedPlanEndDate', selectedPlanEndDate);

  //
  // B. Fetch data

  const { mutate: allExportsMutate } = useSWR('/api/exports');
  const { data: allAgenciesData } = useSWR('/api/agencies');
  const { data: allLinesData } = useSWR('/api/lines');

  //
  // B. Format data

  const availableAgencies = useMemo(() => {
    if (!allAgenciesData) return [];
    return allAgenciesData.map((agency) => {
      const isAllowed = true; // !isAllowed(session, 'export', type)
      return { value: agency._id, label: agency.name || '-', disabled: !isAllowed };
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
        operation: 'gtfs_v18',
        method: 'POST',
        body: {
          agency_id: selectedAgencyId,
          lines_included: selectedLineIdsToInclude,
          lines_excluded: selectedLineIdsToExclude,
          start_date: parseDate(selectedPlanStartDate),
          end_date: parseDate(selectedPlanEndDate),
        },
      });
      allExportsMutate();
      setSelectedAgencyId();
      setSelectedLineIdsToInclude([]);
      setSelectedLineIdsToExclude([]);
      setSelectedPlanStartDate();
      setSelectedPlanEndDate();
      setIsCreatingExport(false);
    } catch (err) {
      console.log(err);
      setIsCreatingExport(false);
    }
  };

  //
  // E. Render components

  return (
    <>
      <Section>
        <Select
          label={t('form.agencies.label')}
          placeholder={t('form.agencies.placeholder')}
          description={t('form.agencies.description')}
          nothingFound={t('form.agencies.nothingFound')}
          data={availableAgencies}
          value={selectedAgencyId}
          onChange={setSelectedAgencyId}
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
      </Section>
      <Divider />
      <Section>
        <Button onClick={handleStartExport} loading={isCreatingExport} disabled={!selectedAgencyId || !selectedPlanStartDate || !selectedPlanEndDate}>
          {t('operations.start.label')}
        </Button>
      </Section>
    </>
  );
}

export function ExportFileFormType2() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ExportFileForm');
  const { data: session } = useSession();

  const [selectedExportType, setSelectedExportType] = useState();

  const [selectedAgencyId, setSelectedAgencyId] = useState();
  const [selectedLineIds, setSelectedLineIds] = useState([]);
  const [isCreatingExport, setIsCreatingExport] = useState(false);

  //
  // B. Fetch data

  const { mutate: allExportsMutate } = useSWR('/api/exports');
  const { data: allAgenciesData, error: allAgenciesError, isLoading: allAgenciesLoading } = useSWR('/api/agencies');
  const { data: allLinesData, error: linesError, isLoading: linesLoading } = useSWR('/api/lines');

  //
  // B. Format data

  const agenciesFormattedForSelect = useMemo(() => {
    if (!allAgenciesData) return [];
    return allAgenciesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [allAgenciesData]);

  const linesFormattedForSelect = useMemo(() => {
    if (!allLinesData) return [];
    let filteredLineBySelectedAgency = allLinesData;
    if (selectedAgencyId) filteredLineBySelectedAgency = allLinesData.filter((item) => item.agency === selectedAgencyId);
    return filteredLineBySelectedAgency.map((item) => {
      return { value: item._id, label: `(${item.short_name}) ${item.long_name}` };
    });
  }, [allLinesData, selectedAgencyId]);

  //
  // D. Handle actions

  const handleExportGTFSv18 = async () => {
    try {
      setIsCreatingExport(true);
      await API({ service: 'exports', operation: 'gtfs_v18', method: 'POST', body: { agency_id: selectedAgencyId, lines: selectedLineIds } });
      allExportsMutate();
      setIsCreatingExport(false);
    } catch (err) {
      console.log(err);
      setIsCreatingExport(false);
    }
  };

  //
  // E. Render components

  return (
    <>
      <Section>
        asdouihasdiouashdiuashdiuahsdii
        <Select
          label={t('form.agencies.label')}
          placeholder={t('form.agencies.placeholder')}
          description={t('form.agencies.description')}
          nothingFound={t('form.agencies.nothingFound')}
          data={agenciesFormattedForSelect}
          value={selectedAgencyId}
          onChange={setSelectedAgencyId}
          searchable
          clearable
        />
        <MultiSelect
          label={t('form.lines.label')}
          placeholder={t('form.lines.placeholder')}
          description={t('form.lines.description')}
          nothingFound={t('form.lines.nothingFound')}
          data={linesFormattedForSelect}
          value={selectedLineIds}
          onChange={setSelectedLineIds}
          disabled={!selectedAgencyId}
          searchable
          clearable
        />
      </Section>
      <Divider />
      <Section>
        <SimpleGrid cols={1}>
          <Button onClick={handleExportGTFSv18} loading={isCreatingExport} disabled={!selectedAgencyId}>
            {t('operations.start.label')}
          </Button>
          <Text size='h4'>{t('sections.intro.description')}</Text>
        </SimpleGrid>
      </Section>
    </>
  );
}

export function ExportFileFormType3() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ExportFileForm');
  const { data: session } = useSession();

  const [selectedExportType, setSelectedExportType] = useState();

  const [selectedAgencyId, setSelectedAgencyId] = useState();
  const [selectedLineIds, setSelectedLineIds] = useState([]);
  const [isCreatingExport, setIsCreatingExport] = useState(false);

  //
  // B. Fetch data

  const { mutate: allExportsMutate } = useSWR('/api/exports');
  const { data: allAgenciesData, error: allAgenciesError, isLoading: allAgenciesLoading } = useSWR('/api/agencies');
  const { data: allLinesData, error: linesError, isLoading: linesLoading } = useSWR('/api/lines');

  //
  // B. Format data

  const agenciesFormattedForSelect = useMemo(() => {
    if (!allAgenciesData) return [];
    return allAgenciesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [allAgenciesData]);

  const linesFormattedForSelect = useMemo(() => {
    if (!allLinesData) return [];
    let filteredLineBySelectedAgency = allLinesData;
    if (selectedAgencyId) filteredLineBySelectedAgency = allLinesData.filter((item) => item.agency === selectedAgencyId);
    return filteredLineBySelectedAgency.map((item) => {
      return { value: item._id, label: `(${item.short_name}) ${item.long_name}` };
    });
  }, [allLinesData, selectedAgencyId]);

  //
  // D. Handle actions

  const handleExportGTFSv18 = async () => {
    try {
      setIsCreatingExport(true);
      await API({ service: 'exports', operation: 'gtfs_v18', method: 'POST', body: { agency_id: selectedAgencyId, lines: selectedLineIds } });
      allExportsMutate();
      setIsCreatingExport(false);
    } catch (err) {
      console.log(err);
      setIsCreatingExport(false);
    }
  };

  //
  // E. Render components

  return (
    <>
      <Section>
        asdouihasdiouashdiuashdiuahsdii
        <Select
          label={t('form.agencies.label')}
          placeholder={t('form.agencies.placeholder')}
          description={t('form.agencies.description')}
          nothingFound={t('form.agencies.nothingFound')}
          data={agenciesFormattedForSelect}
          value={selectedAgencyId}
          onChange={setSelectedAgencyId}
          searchable
          clearable
        />
        <MultiSelect
          label={t('form.lines.label')}
          placeholder={t('form.lines.placeholder')}
          description={t('form.lines.description')}
          nothingFound={t('form.lines.nothingFound')}
          data={linesFormattedForSelect}
          value={selectedLineIds}
          onChange={setSelectedLineIds}
          disabled={!selectedAgencyId}
          searchable
          clearable
        />
      </Section>
      <Divider />
      <Section>
        <SimpleGrid cols={1}>
          <Button onClick={handleExportGTFSv18} loading={isCreatingExport} disabled={!selectedAgencyId}>
            {t('operations.start.label')}
          </Button>
          <Text size='h4'>{t('sections.intro.description')}</Text>
        </SimpleGrid>
      </Section>
    </>
  );
}

/* * */
/* EXPORT FILE FORM */

export default function ExportFileForm() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ExportFileForm');
  const exportOptionsTranslations = useTranslations('ExportOptions');

  const { data: session } = useSession();

  const [selectedExportType, setSelectedExportType] = useState();

  //
  // B. Format data

  const availableExportTypes = useMemo(() => {
    if (!ExportOptions.export_type) return [];
    return ExportOptions.export_type.map((type) => {
      return { value: type, label: exportOptionsTranslations(`export_type.${type}.label`), disabled: !isAllowed(session, 'export', type) };
    });
  }, [exportOptionsTranslations, session]);

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
      {selectedExportType && selectedExportType === 'gtfs_v18' && <ExportGTFSv18 />}
      {selectedExportType && selectedExportType === 'gtfs_v29' && <ExportFileFormType2 />}
      {selectedExportType && selectedExportType === 'gtfs_v30' && <ExportFileFormType3 />}
    </Pannel>
  );
}
