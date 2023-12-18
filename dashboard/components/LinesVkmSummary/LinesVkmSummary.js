'use client';

/* * */

import useSWR from 'swr';
import styles from './LinesVkmSummary.module.css';
import { DatePickerInput } from '@mantine/dates';
import { useEffect, useMemo, useState } from 'react';
import API from '@/services/API';
import StatCard from '@/components/StatCard/StatCard';
import { Select, NumberFormatter, Divider, Alert, SegmentedControl } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { useTranslations } from 'next-intl';
import { IconInfoCircle, IconRulerMeasure } from '@tabler/icons-react';
import Standout from '../Standout/Standout';

/* * */

const AVAILABLE_CALCULATION_METHODS = ['rolling_year', 'fixed_range'];

/* * */

export default function LinesVkmSummary() {
  //

  //
  // A. Setup variables

  const t = useTranslations('LinesVkmSummary');

  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);

  const [calculationMethod, setCalculationMethod] = useState('rolling_year');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [vkmForPeriod, setVkmForPeriod] = useState();

  //
  // B. Fetch data

  const { data: allAgenciesData } = useSWR('/api/agencies');

  //
  // B. Transform data

  const allAgenciesFormatted = useMemo(() => {
    if (!allAgenciesData) return;
    return allAgenciesData.map((agency) => ({
      value: agency._id,
      label: agency.name,
    }));
  }, [allAgenciesData]);

  useEffect(() => {
    // Skip if no dates are defined
    if (!selectedAgency) return;
    if (calculationMethod === 'fixed_range' && !startDate && !endDate) return;
    else if (calculationMethod === 'rolling_year' && !startDate) return;

    (async () => {
      try {
        setIsLoading(true);
        const response = await API({ service: 'agencies', resourceId: selectedAgency, operation: 'vkm', method: 'POST', body: { calculation_method: calculationMethod, start_date: startDate, end_date: endDate } });
        console.log(response);
        setVkmForPeriod(response);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    })();
  }, [startDate, endDate, selectedAgency, calculationMethod]);

  //
  // C. Render components


  return (
    <Pannel
      header={
        <>
          <IconRulerMeasure size={25} />
          <Text size="h1" full>
            {t('title')}
          </Text>
        </>
      }
    >
      <div className={styles.container}>
        <Select label={t('form.agency.label')} placeholder={t('form.agency.placeholder')} data={allAgenciesFormatted} value={selectedAgency} onChange={setSelectedAgency} />
        <Standout icon={<IconInfoCircle size={20} />} title={t('form.calculation_method.title')} description={t('form.calculation_method.description')}>
          <SegmentedControl label="Calculation Method" value={calculationMethod} onChange={setCalculationMethod} data={AVAILABLE_CALCULATION_METHODS.map((option) => ({ value: option, label: t(`form.calculation_method.options.${option}.label`) }))} placeholder="Select method" />
        </Standout>

        <div className={styles.datePickersWrapper}>
          <DatePickerInput label={t('form.start_date.label')} placeholder={t('form.start_date.placeholder')} value={startDate} onChange={setStartDate} />
          {calculationMethod === 'fixed_range' && <DatePickerInput label={t('form.end_date.label')} placeholder={t('form.end_date.placeholder')} value={endDate} onChange={setEndDate} />}
        </div>
      </div>

      <Divider />

      <div className={styles.container}>
        <div className={styles.resultsWrapper}>
          <div className={styles.resultsWrapperRow}>
            <StatCard
              isLoading={isLoading}
              title={t('stats.total_from_distance')}
              value={vkmForPeriod ? vkmForPeriod.total_from_distance / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.total_from_distance / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
            <StatCard
              isLoading={isLoading}
              title={t('stats.total_in_euros')}
              value={vkmForPeriod ? vkmForPeriod.total_in_euros : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.total_in_euros} suffix=" €" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
            {calculationMethod === 'rolling_year' && (
              <StatCard
                isLoading={isLoading}
                title={t('stats.total_relative_to_contract')}
                value={vkmForPeriod ? vkmForPeriod.total_relative_to_contract : '-'}
                displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.total_relative_to_contract * 100} suffix="%" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
              />
            )}
          </div>

          <Divider label={t('dividers.by_day_type')} labelPosition="left" />
          <div className={styles.resultsWrapperRow}>
            <StatCard
              isLoading={isLoading}
              title={t('stats.day_type_one')}
              value={vkmForPeriod ? vkmForPeriod.day_type_one / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.day_type_one / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
            <StatCard
              isLoading={isLoading}
              title={t('stats.day_type_two')}
              value={vkmForPeriod ? vkmForPeriod.day_type_two / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.day_type_two / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
            <StatCard
              isLoading={isLoading}
              title={t('stats.day_type_three')}
              value={vkmForPeriod ? vkmForPeriod.day_type_three / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.day_type_three / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
          </div>

          <Divider label={t('dividers.by_period_one_and_day_type')} labelPosition="left" />
          <StatCard
            isLoading={isLoading}
            title={t('stats.period_one')}
            value={vkmForPeriod ? vkmForPeriod.period_one / 1000 : '-'}
            displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_one / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
          />
          <div className={styles.resultsWrapperRow}>
            <StatCard
              isLoading={isLoading}
              title={t('stats.period_one_and_day_type_one')}
              value={vkmForPeriod ? vkmForPeriod.period_one_and_day_type_one / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_one_and_day_type_one / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
            <StatCard
              isLoading={isLoading}
              title={t('stats.period_one_and_day_type_two')}
              value={vkmForPeriod ? vkmForPeriod.period_one_and_day_type_two / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_one_and_day_type_two / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
            <StatCard
              isLoading={isLoading}
              title={t('stats.period_one_and_day_type_three')}
              value={vkmForPeriod ? vkmForPeriod.period_one_and_day_type_three / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_one_and_day_type_three / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
          </div>

          <Divider label={t('dividers.by_period_two_and_day_type')} labelPosition="left" />
          <StatCard
            isLoading={isLoading}
            title={t('stats.period_two')}
            value={vkmForPeriod ? vkmForPeriod.period_two / 1000 : '-'}
            displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_two / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
          />
          <div className={styles.resultsWrapperRow}>
            <StatCard
              isLoading={isLoading}
              title={t('stats.period_two_and_day_type_one')}
              value={vkmForPeriod ? vkmForPeriod.period_two_and_day_type_one / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_two_and_day_type_one / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
            <StatCard
              isLoading={isLoading}
              title={t('stats.period_two_and_day_type_two')}
              value={vkmForPeriod ? vkmForPeriod.period_two_and_day_type_two / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_two_and_day_type_two / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
            <StatCard
              isLoading={isLoading}
              title={t('stats.period_two_and_day_type_three')}
              value={vkmForPeriod ? vkmForPeriod.period_two_and_day_type_three / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_two_and_day_type_three / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
          </div>

          <Divider label={t('dividers.by_period_three_and_day_type')} labelPosition="left" />
          <StatCard
            isLoading={isLoading}
            title={t('stats.period_three')}
            value={vkmForPeriod ? vkmForPeriod.period_three / 1000 : '-'}
            displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_three / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
          />
          <div className={styles.resultsWrapperRow}>
            <StatCard
              isLoading={isLoading}
              title={t('stats.period_three_and_day_type_one')}
              value={vkmForPeriod ? vkmForPeriod.period_three_and_day_type_one / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_three_and_day_type_one / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
            <StatCard
              isLoading={isLoading}
              title={t('stats.period_three_and_day_type_two')}
              value={vkmForPeriod ? vkmForPeriod.period_three_and_day_type_two / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_three_and_day_type_two / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
            <StatCard
              isLoading={isLoading}
              title={t('stats.period_three_and_day_type_three')}
              value={vkmForPeriod ? vkmForPeriod.period_three_and_day_type_three / 1000 : '-'}
              displayValue={vkmForPeriod ? <NumberFormatter value={vkmForPeriod.period_three_and_day_type_three / 1000} suffix=" km" thousandSeparator=" " decimalSeparator="," decimalScale={2} /> : '-'}
            />
          </div>
        </div>
      </div>
    </Pannel>
  );

  //
}
