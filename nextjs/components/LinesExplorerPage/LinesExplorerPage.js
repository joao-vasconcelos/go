'use client';

/* * */

import useSWR from 'swr';
import styles from './LinesExplorerPage.module.css';
import { DatePickerInput } from '@mantine/dates';
import { useEffect, useMemo, useState } from 'react';
import API from '@/services/API';
import StatCard from '@/components/StatCard/StatCard';
import { Select, NumberFormatter, Divider, SegmentedControl } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { useFormatter, useTranslations } from 'next-intl';
import { IconInfoCircle, IconRulerMeasure } from '@tabler/icons-react';
import Standout from '../Standout/Standout';
import NoDataLabel from '../NoDataLabel/NoDataLabel';
import Loader from '../Loader/Loader';
import parseDate from '@/services/parseDate';
import ListHeader from '../ListHeader/ListHeader';

/* * */

const AVAILABLE_CALCULATION_METHODS = ['rolling_year', 'fixed_range'];

const AVAILABLE_EXTENSION_SOURCES = ['shape', 'stop_times', 'go'];

/* * */

export default function LinesExplorerPage() {
  //

  //
  // A. Setup variables

  const t = useTranslations('LinesExplorerPage');
  const intlFormatter = useFormatter();

  const [isLoading, setIsLoading] = useState(false);

  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedCalculationMethod, setSelectedCalculationMethod] = useState(AVAILABLE_CALCULATION_METHODS[0]);
  const [selectedExtensionSource, setSelectedExtensionSource] = useState(AVAILABLE_EXTENSION_SOURCES[0]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [vkmCalculationResult, setVkmCalculationResult] = useState(null);

  //
  // C. Fetch data

  const { data: allAgenciesData, isLoading: allAgenciesLoading } = useSWR('/api/agencies');

  //
  // D. Transform data

  const allAgenciesFormatted = useMemo(() => {
    if (!allAgenciesData) return;
    return allAgenciesData.map((agency) => ({
      value: agency._id,
      label: agency.name,
    }));
  }, [allAgenciesData]);

  useEffect(() => {
    // Skip if no agency, calculation method or start date are defined
    if (!selectedAgency || !selectedCalculationMethod || !selectedStartDate) {
      setVkmCalculationResult(null);
      return;
    }
    // Skip if the calculation method is fixed_range and no end date is defined
    if (selectedCalculationMethod === 'fixed_range' && !selectedEndDate) {
      setVkmCalculationResult(null);
      return;
    }
    //
    (async () => {
      try {
        setIsLoading(true);
        const response = await API({
          service: 'agencies',
          resourceId: selectedAgency,
          operation: 'vkm',
          method: 'POST',
          body: {
            calculation_method: selectedCalculationMethod,
            extension_source: selectedExtensionSource,
            start_date: parseDate(selectedStartDate),
            end_date: parseDate(selectedEndDate),
          },
        });
        setVkmCalculationResult(response);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    })();
  }, [selectedStartDate, selectedEndDate, selectedAgency, selectedCalculationMethod, selectedExtensionSource]);

  //
  // C. Render components

  return (
    <Pannel
      loading={allAgenciesLoading}
      header={
        <ListHeader>
          <IconRulerMeasure size={22} />
          <Text size="h1" full>
            {t('title')}
          </Text>
        </ListHeader>
      }
    >
      <div className={styles.container}>
        <Standout icon={<IconInfoCircle size={20} />} title={t('form.calculation_method.title')} description={t('form.calculation_method.description')}>
          <SegmentedControl
            value={selectedCalculationMethod}
            onChange={setSelectedCalculationMethod}
            data={AVAILABLE_CALCULATION_METHODS.map((option) => ({ value: option, label: t(`form.calculation_method.options.${option}.label`) }))}
            placeholder="Select method"
            style={{ alignSelf: 'flex-start' }}
          />
        </Standout>
        <Standout icon={<IconInfoCircle size={20} />} title={t('form.extension_source.title')} description={t('form.extension_source.description')}>
          <SegmentedControl value={selectedExtensionSource} onChange={setSelectedExtensionSource} data={AVAILABLE_EXTENSION_SOURCES.map((option) => ({ value: option, label: t(`form.extension_source.options.${option}.label`) }))} placeholder="Select method" style={{ alignSelf: 'flex-start' }} />
        </Standout>
        <Select label={t('form.agency.label')} placeholder={t('form.agency.placeholder')} data={allAgenciesFormatted} value={selectedAgency} onChange={setSelectedAgency} />
        <div className={styles.datePickersWrapper}>
          <DatePickerInput label={t('form.start_date.label')} placeholder={t('form.start_date.placeholder')} value={selectedStartDate} onChange={setSelectedStartDate} />
          {selectedCalculationMethod === 'fixed_range' && <DatePickerInput label={t('form.end_date.label')} placeholder={t('form.end_date.placeholder')} value={selectedEndDate} onChange={setSelectedEndDate} minDate={selectedStartDate} />}
        </div>
      </div>

      <Divider />

      <div className={styles.container}>
        {vkmCalculationResult ? (
          <div className={styles.resultsWrapper}>
            <Standout
              title={t('sections.overview.title')}
              description={t('sections.overview.description', { agency_name: vkmCalculationResult?.inputs?.agency_name, price_per_km: vkmCalculationResult?.inputs?.price_per_km, total_vkm_per_year: vkmCalculationResult?.inputs?.total_vkm_per_year })}
              collapsible
              defaultOpen={true}
            >
              <div className={styles.cardsWrapperWithOneRow}>
                <StatCard isLoading={isLoading} title={t('sections.overview.cards.total_from_distance')} value={vkmCalculationResult ? intlFormatter.number(vkmCalculationResult.total_from_distance, 'kilometers') : '-'} />
                <StatCard isLoading={isLoading} title={t('sections.overview.cards.total_in_euros')} value={vkmCalculationResult ? intlFormatter.number(vkmCalculationResult.total_in_euros, 'currency_euro') : '-'} />
                {selectedCalculationMethod === 'rolling_year' && <StatCard isLoading={isLoading} title={t('sections.overview.cards.total_relative_to_contract')} value={vkmCalculationResult ? intlFormatter.number(vkmCalculationResult.total_relative_to_contract * 100, 'percentage') : '-'} />}
              </div>
            </Standout>

            <Standout title={t('sections.totals_by_day_type.title')} description={t('sections.totals_by_day_type.description')} collapsible defaultOpen={false}>
              <div className={styles.cardsWrapperWithOneRow}>
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_by_day_type.cards.day_type_one')}
                  value={vkmCalculationResult ? vkmCalculationResult.day_type_one : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.day_type_one} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_by_day_type.cards.day_type_two')}
                  value={vkmCalculationResult ? vkmCalculationResult.day_type_two : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.day_type_two} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_by_day_type.cards.day_type_three')}
                  value={vkmCalculationResult ? vkmCalculationResult.day_type_three : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.day_type_three} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
              </div>
            </Standout>

            <Standout title={t('sections.totals_for_period_one.title')} description={t('sections.totals_for_period_one.description')} collapsible defaultOpen={false}>
              <div className={styles.cardsWrapperWithTwoRows}>
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_one.cards.period_one')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_one : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_one} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_one.cards.period_one_and_day_type_one')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_one_and_day_type_one : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_one_and_day_type_one} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_one.cards.period_one_and_day_type_two')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_one_and_day_type_two : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_one_and_day_type_two} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_one.cards.period_one_and_day_type_three')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_one_and_day_type_three : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_one_and_day_type_three} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
              </div>
            </Standout>

            <Standout title={t('sections.totals_for_period_two.title')} description={t('sections.totals_for_period_two.description')} collapsible defaultOpen={false}>
              <div className={styles.cardsWrapperWithTwoRows}>
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_two.cards.period_two')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_two : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_two} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_two.cards.period_two_and_day_type_one')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_two_and_day_type_one : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_two_and_day_type_one} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_two.cards.period_two_and_day_type_two')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_two_and_day_type_two : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_two_and_day_type_two} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_two.cards.period_two_and_day_type_three')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_two_and_day_type_three : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_two_and_day_type_three} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
              </div>
            </Standout>

            <Standout title={t('sections.totals_for_period_three.title')} description={t('sections.totals_for_period_three.description')} collapsible defaultOpen={false}>
              <div className={styles.cardsWrapperWithTwoRows}>
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_three.cards.period_three')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_three : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_three} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_three.cards.period_three_and_day_type_one')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_three_and_day_type_one : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_three_and_day_type_one} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_three.cards.period_three_and_day_type_two')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_three_and_day_type_two : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_three_and_day_type_two} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
                <StatCard
                  isLoading={isLoading}
                  title={t('sections.totals_for_period_three.cards.period_three_and_day_type_three')}
                  value={vkmCalculationResult ? vkmCalculationResult.period_three_and_day_type_three : '-'}
                  displayValue={vkmCalculationResult ? <NumberFormatter value={vkmCalculationResult.period_three_and_day_type_three} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
                />
              </div>
            </Standout>
          </div>
        ) : isLoading ? (
          <Loader visible fill />
        ) : (
          <NoDataLabel text={t('no_data')} fill />
        )}
      </div>
    </Pannel>
  );

  //
}
