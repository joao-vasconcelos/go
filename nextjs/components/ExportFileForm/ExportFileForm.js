'use client';

import useSWR from 'swr';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import parseDate from '@/services/parseDate';
import { useTranslations } from 'next-intl';
import { ExportOptions } from '@/schemas/Export/options';
import { useSession } from 'next-auth/react';
import { isAllowed } from '@/components/AuthGate/AuthGate';
import { IconCloudPlus } from '@tabler/icons-react';
import { SimpleGrid, Select, MultiSelect, Button, Divider, Switch, SegmentedControl, Slider, NumberInput } from '@mantine/core';
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

  const [selectedExportType, setSelectedExportType] = useState(null);
  const [selectedAgencyId, setSelectedAgencyId] = useState(null);
  const [selectedLineIdsToInclude, setSelectedLineIdsToInclude] = useState([]);
  const [selectedLineIdsToExclude, setSelectedLineIdsToExclude] = useState([]);
  const [selectedFeedStartDate, setSelectedFeedStartDate] = useState(null);
  const [selectedFeedEndDate, setSelectedFeedEndDate] = useState(null);
  const [shouldClipCalendars, setShouldClipCalendars] = useState(false);
  const [selectedCalendarsClipStartDate, setSelectedCalendarsClipStartDate] = useState(null);
  const [selectedCalendarsClipEndDate, setSelectedCalendarsClipEndDate] = useState(null);
  const [outputNumericCalendarCodes, setOutputNumericCalendarCodes] = useState(false);
  const [selectedStopSequenceStart, setSelectedStopSequenceStart] = useState(1);

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
          feed_start_date: parseDate(selectedFeedStartDate),
          feed_end_date: parseDate(selectedFeedEndDate),
          clip_calendars: shouldClipCalendars,
          calendars_clip_start_date: parseDate(selectedCalendarsClipStartDate),
          calendars_clip_end_date: parseDate(selectedCalendarsClipEndDate),
          numeric_calendar_codes: outputNumericCalendarCodes,
          stop_sequence_start: selectedStopSequenceStart,
        },
      });
      // Mutate results
      allExportsMutate();
      // Reset form
      setSelectedExportType(null);
      setSelectedAgencyId(null);
      setSelectedLineIdsToInclude([]);
      setSelectedLineIdsToExclude([]);
      setSelectedFeedStartDate(null);
      setSelectedFeedEndDate(null);
      setShouldClipCalendars(false);
      setSelectedCalendarsClipStartDate(null);
      setSelectedCalendarsClipEndDate(null);
      setOutputNumericCalendarCodes(false);
      setSelectedStopSequenceStart(1);
      // Reset state
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
          <Text size="h2" full>
            {t('title')}
          </Text>
        </>
      }
    >
      <Section>
        <Text size="h4" color="muted">
          {t('description')}
        </Text>
      </Section>

      <Divider />

      <Section>
        <Select
          label={t('form.export_type.label')}
          description={t('form.export_type.description')}
          placeholder={t('form.export_type.placeholder')}
          nothingFoundMessage={t('form.export_type.nothingFound')}
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
          description={t('form.agencies.description')}
          placeholder={t('form.agencies.placeholder')}
          nothingFoundMessage={t('form.agencies.nothingFound')}
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
          nothingFoundMessage={t('form.lines_include.nothingFound')}
          data={availableLinesToInclude}
          value={selectedLineIdsToInclude}
          onChange={setSelectedLineIdsToInclude}
          disabled={!selectedAgencyId || selectedLineIdsToExclude.length > 0}
          searchable
          clearable
        />
        <MultiSelect
          label={t('form.lines_exclude.label')}
          placeholder={t('form.lines_exclude.placeholder')}
          description={t('form.lines_exclude.description')}
          nothingFoundMessage={t('form.lines_exclude.nothingFound')}
          data={availableLinesToExclude}
          value={selectedLineIdsToExclude}
          onChange={setSelectedLineIdsToExclude}
          disabled={!selectedAgencyId || selectedLineIdsToInclude.length > 0}
          searchable
          clearable
        />
      </Section>

      <Divider />

      <Section>
        <SimpleGrid cols={2}>
          <DatePickerInput label={t('form.feed_start_date.label')} description={t('form.feed_start_date.description')} placeholder={t('form.feed_start_date.placeholder')} value={selectedFeedStartDate} onChange={setSelectedFeedStartDate} disabled={!selectedAgencyId} dropdownType="modal" clearable />
          <DatePickerInput
            label={t('form.feed_end_date.label')}
            description={t('form.feed_end_date.description')}
            placeholder={t('form.feed_end_date.placeholder')}
            value={selectedFeedEndDate}
            onChange={setSelectedFeedEndDate}
            minDate={selectedFeedStartDate}
            disabled={!selectedFeedStartDate}
            dropdownType="modal"
            clearable
          />
        </SimpleGrid>
      </Section>

      <Divider />

      <Section>
        <SimpleGrid cols={1}>
          <Switch label={t('form.clip_calendars.label')} description={t('form.clip_calendars.description')} checked={shouldClipCalendars} onChange={(event) => setShouldClipCalendars(event.currentTarget.checked)} disabled={!selectedAgencyId || !selectedFeedStartDate || !selectedFeedEndDate} />
        </SimpleGrid>
        {shouldClipCalendars && (
          <SimpleGrid cols={2}>
            <DatePickerInput
              label={t('form.calendars_clip_start_date.label')}
              description={t('form.calendars_clip_start_date.description')}
              placeholder={t('form.calendars_clip_start_date.placeholder')}
              value={selectedCalendarsClipStartDate}
              onChange={setSelectedCalendarsClipStartDate}
              disabled={!selectedAgencyId}
              dropdownType="modal"
              clearable
            />
            <DatePickerInput
              label={t('form.calendars_clip_end_date.label')}
              description={t('form.calendars_clip_end_date.description')}
              placeholder={t('form.calendars_clip_end_date.placeholder')}
              value={selectedCalendarsClipEndDate}
              onChange={setSelectedCalendarsClipEndDate}
              minDate={selectedCalendarsClipStartDate}
              disabled={!selectedCalendarsClipStartDate}
              dropdownType="modal"
              clearable
            />
          </SimpleGrid>
        )}
      </Section>

      <Divider />

      <Section>
        <SimpleGrid cols={1}>
          <Switch
            label={t('form.numeric_calendar_codes.label')}
            description={t('form.numeric_calendar_codes.description')}
            checked={outputNumericCalendarCodes}
            onChange={(event) => setOutputNumericCalendarCodes(event.currentTarget.checked)}
            disabled={!selectedAgencyId || !selectedFeedStartDate || !selectedFeedEndDate}
          />
        </SimpleGrid>
      </Section>

      <Divider />

      <Section>
        <SimpleGrid cols={1}>
          <NumberInput
            label={t('form.stop_sequence_start.label')}
            description={t('form.stop_sequence_start.description')}
            placeholder={t('form.stop_sequence_start.placeholder')}
            value={selectedStopSequenceStart}
            onChange={setSelectedStopSequenceStart}
            disabled={!selectedAgencyId || !selectedFeedStartDate || !selectedFeedEndDate}
            max={1}
            min={0}
          />
        </SimpleGrid>
      </Section>

      <Divider />

      <Section>
        <Button onClick={handleStartExport} loading={isCreatingExport} disabled={!selectedAgencyId || !selectedFeedStartDate || !selectedFeedEndDate || (shouldClipCalendars && (!selectedCalendarsClipStartDate || !selectedCalendarsClipEndDate)) || selectedStopSequenceStart.length === 0}>
          {t('operations.start.label')}
        </Button>
      </Section>
    </Pannel>
  );
}
