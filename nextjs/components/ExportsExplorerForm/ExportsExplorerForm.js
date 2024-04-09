'use client';

/* * */

import useSWR from 'swr';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import parseDate from '@/services/parseDate';
import { useTranslations } from 'next-intl';
import { ExportOptions } from '@/schemas/Export/options';
import { useSession } from 'next-auth/react';
import isAllowed from '@/authentication/isAllowed';
import { IconCloudPlus } from '@tabler/icons-react';
import { SimpleGrid, Select, MultiSelect, Button, Divider, Switch, NumberInput } from '@mantine/core';
import ListHeader from '@/components/ListHeader/ListHeader';
import { Section } from '@/components/Layouts/Layouts';
import { useState, useMemo } from 'react';
import API from '@/services/API';
import { DatePickerInput } from '@mantine/dates';
import { DateTime } from 'luxon';

/* * */

export default function ExportsExplorerForm() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ExportsExplorerForm');
  const exportOptionsTranslations = useTranslations('ExportOptions');

  const { data: sessionData } = useSession();

  const [isCreatingExport, setIsCreatingExport] = useState(false);

  const [selectedExportType, setSelectedExportType] = useState(ExportOptions.defaults.export_type);
  const [selectedAgencyId, setSelectedAgencyId] = useState(ExportOptions.defaults.agency_id);
  const [selectedLineIdsToInclude, setSelectedLineIdsToInclude] = useState(ExportOptions.defaults.lines_included);
  const [selectedLineIdsToExclude, setSelectedLineIdsToExclude] = useState(ExportOptions.defaults.lines_excluded);
  const [selectedFeedStartDate, setSelectedFeedStartDate] = useState(ExportOptions.defaults.feed_start_date);
  const [selectedFeedEndDate, setSelectedFeedEndDate] = useState(ExportOptions.defaults.feed_end_date);
  const [shouldClipCalendars, setShouldClipCalendars] = useState(ExportOptions.defaults.clip_calendars);
  const [selectedCalendarsClipStartDate, setSelectedCalendarsClipStartDate] = useState(ExportOptions.defaults.calendars_clip_start_date);
  const [selectedCalendarsClipEndDate, setSelectedCalendarsClipEndDate] = useState(ExportOptions.defaults.calendars_clip_end_date);
  const [outputNumericCalendarCodes, setOutputNumericCalendarCodes] = useState(ExportOptions.defaults.numeric_calendar_codes);
  const [selectedStopSequenceStart, setSelectedStopSequenceStart] = useState(ExportOptions.defaults.stop_sequence_start);
  const [shouldNotifyUser, setShouldNotifyUser] = useState(ExportOptions.defaults.notify_user);

  //
  // B. Fetch data

  const { mutate: allExportsMutate } = useSWR('/api/exports');
  const { data: allAgenciesData } = useSWR('/api/agencies');
  const { data: allLinesData } = useSWR('/api/lines');

  //
  // B. Format data

  const availableExportTypes = useMemo(() => {
    if (!ExportOptions.export_type) return [];
    return ExportOptions.export_type.filter((type) => isAllowed(sessionData, [{ scope: 'exports', action: 'create', fields: [{ key: 'export_types', values: [type] }] }], { handleError: true })).map((type) => ({ value: type, label: exportOptionsTranslations(`export_type.${type}.label`) }));
  }, [exportOptionsTranslations, sessionData]);

  const availableAgencies = useMemo(() => {
    if (!allAgenciesData) return [];
    return allAgenciesData.map((agency) => ({ value: agency._id, label: agency.name || '-' }));
  }, [allAgenciesData]);

  const availableLinesToInclude = useMemo(() => {
    if (!allLinesData && !selectedAgencyId) return [];
    const filteredLinesBySelectedAgency = allLinesData.filter((item) => item.agency === selectedAgencyId);
    return filteredLinesBySelectedAgency.map((item) => ({ value: item._id, label: `(${item.short_name}) ${item.name}` }));
  }, [allLinesData, selectedAgencyId]);

  const availableLinesToExclude = useMemo(() => {
    if (!allLinesData || !selectedAgencyId) return [];
    const filteredLinesBySelectedAgency = allLinesData.filter((item) => item.agency === selectedAgencyId);
    return filteredLinesBySelectedAgency.map((item) => ({ value: item._id, label: `(${item.short_name}) ${item.name}` }));
  }, [allLinesData, selectedAgencyId]);

  //
  // D. Handle actions

  const handleSelectAgency = (agencyId) => {
    // Set the selected agency
    setSelectedAgencyId(agencyId);
    // Set Feed Start Date, since it does not require any agency information
    const firstDayOfNextMonth = DateTime.now().plus({ months: 1 }).startOf('month');
    setSelectedFeedStartDate(firstDayOfNextMonth.toJSDate());
    // Get the selected agency data
    const agencyData = allAgenciesData.find((agency) => agency._id === agencyId);
    // Exit if no agency found or agency has not set an operation start date
    if (!agencyData || !agencyData.operation_start_date) return;
    // Setup variables to hold the start and end dates of the current operational year
    let currentOperationYearStartDate;
    let currentOperationYearEndDate;
    // Get the operation start date into a DateTime object
    const operationStartDate = DateTime.fromFormat(agencyData.operation_start_date, 'yyyyMMdd');
    // If now is before the start date of the operationation if it was this year...
    if (agencyId === '645d7f204ef63aec14fbf22a') {
      // If A4 then start the next month until the end of the contract
      const endOfContractStartDate = DateTime.now().set({ year: 2029, month: 12, day: 31 }).endOf('month');
      const nextMonthStartDatePlusOneYear = firstDayOfNextMonth.plus({ year: 1, day: -1 }).endOf('month');
      // Set the corresponding fields
      setSelectedCalendarsClipStartDate(firstDayOfNextMonth.toJSDate());
      setSelectedCalendarsClipEndDate(endOfContractStartDate.toJSDate());
      setSelectedFeedEndDate(nextMonthStartDatePlusOneYear.toJSDate());
      setOutputNumericCalendarCodes(true);
    } else if (DateTime.now() < operationStartDate.set({ year: DateTime.now().year })) {
      // ...then it means the current operation year started last year
      currentOperationYearStartDate = operationStartDate.set({ year: DateTime.now().year - 1 });
      currentOperationYearEndDate = currentOperationYearStartDate.plus({ year: 1 }).minus({ day: 1 });
      // Set the corresponding fields
      setSelectedCalendarsClipStartDate(currentOperationYearStartDate.toJSDate());
      setSelectedCalendarsClipEndDate(currentOperationYearEndDate.toJSDate());
      setSelectedFeedEndDate(currentOperationYearEndDate.toJSDate());
      //
    } else {
      // ...else it means the current operation year is in the current year
      currentOperationYearStartDate = operationStartDate.set({ year: DateTime.now().year });
      currentOperationYearEndDate = currentOperationYearStartDate.plus({ year: 1 }).minus({ day: 1 });
      // Set the corresponding fields
      setSelectedCalendarsClipStartDate(currentOperationYearStartDate.toJSDate());
      setSelectedCalendarsClipEndDate(currentOperationYearEndDate.toJSDate());
      setSelectedFeedEndDate(currentOperationYearEndDate.toJSDate());
      //
    }
    //
  };

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
          notify_user: shouldNotifyUser,
        },
      });
      // Mutate results
      allExportsMutate();
      // Reset form
      setSelectedExportType(ExportOptions.defaults.export_type);
      setSelectedAgencyId(ExportOptions.defaults.agency_id);
      setSelectedLineIdsToInclude(ExportOptions.defaults.lines_included);
      setSelectedLineIdsToExclude(ExportOptions.defaults.lines_excluded);
      setSelectedFeedStartDate(ExportOptions.defaults.feed_start_date);
      setSelectedFeedEndDate(ExportOptions.defaults.feed_end_date);
      setShouldClipCalendars(ExportOptions.defaults.clip_calendars);
      setSelectedCalendarsClipStartDate(ExportOptions.defaults.calendars_clip_start_date);
      setSelectedCalendarsClipEndDate(ExportOptions.defaults.calendars_clip_end_date);
      setOutputNumericCalendarCodes(ExportOptions.defaults.numeric_calendar_codes);
      setSelectedStopSequenceStart(ExportOptions.defaults.stop_sequence_start);
      setShouldNotifyUser(ExportOptions.defaults.notify_user);
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
        <ListHeader>
          <IconCloudPlus size={22} />
          <Text size="h2" full>
            {t('title')}
          </Text>
        </ListHeader>
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
          onChange={handleSelectAgency}
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
        <SimpleGrid cols={1}>
          <Switch label={t('form.notify_user.label')} description={t('form.notify_user.description')} checked={shouldNotifyUser} onChange={(event) => setShouldNotifyUser(event.currentTarget.checked)} disabled={!selectedAgencyId || !selectedFeedStartDate || !selectedFeedEndDate} />
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
