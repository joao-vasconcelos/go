'use client';

/* * */

import Pannel from '@/components/Pannel/Pannel';
import StatCard from '@/components/StatCard/StatCard';
import Text from '@/components/Text/Text';
import API from '@/services/API';
import parseDate from '@/services/parseDate';
import { Divider, NumberFormatter, SegmentedControl, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconInfoCircle, IconRulerMeasure } from '@tabler/icons-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import ListHeader from '../ListHeader/ListHeader';
import Loader from '../Loader/Loader';
import NoDataLabel from '../NoDataLabel/NoDataLabel';
import Standout from '../Standout/Standout';
import styles from './LinesExplorerPage.module.css';

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
		return allAgenciesData.map(agency => ({
			label: agency.name,
			value: agency._id,
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
					body: {
						calculation_method: selectedCalculationMethod,
						end_date: parseDate(selectedEndDate),
						extension_source: selectedExtensionSource,
						start_date: parseDate(selectedStartDate),
					},
					method: 'POST',
					operation: 'vkm',
					resourceId: selectedAgency,
					service: 'agencies',
				});
				setVkmCalculationResult(response);
				setIsLoading(false);
			}
			catch (error) {
				setIsLoading(false);
				console.log(error);
			}
		})();
	}, [selectedStartDate, selectedEndDate, selectedAgency, selectedCalculationMethod, selectedExtensionSource]);

	//
	// C. Render components

	return (
		<Pannel
			loading={allAgenciesLoading}
			header={(
				<ListHeader>
					<IconRulerMeasure size={22} />
					<Text size="h1" full>
						{t('title')}
					</Text>
				</ListHeader>
			)}
		>
			<div className={styles.container}>
				<Standout description={t('form.calculation_method.description')} icon={<IconInfoCircle size={20} />} title={t('form.calculation_method.title')}>
					<SegmentedControl
						data={AVAILABLE_CALCULATION_METHODS.map(option => ({ label: t(`form.calculation_method.options.${option}.label`), value: option }))}
						onChange={setSelectedCalculationMethod}
						placeholder="Select method"
						style={{ alignSelf: 'flex-start' }}
						value={selectedCalculationMethod}
					/>
				</Standout>
				<Standout description={t('form.extension_source.description')} icon={<IconInfoCircle size={20} />} title={t('form.extension_source.title')}>
					<SegmentedControl data={AVAILABLE_EXTENSION_SOURCES.map(option => ({ label: t(`form.extension_source.options.${option}.label`), value: option }))} onChange={setSelectedExtensionSource} placeholder="Select method" style={{ alignSelf: 'flex-start' }} value={selectedExtensionSource} />
				</Standout>
				<Select data={allAgenciesFormatted} label={t('form.agency.label')} onChange={setSelectedAgency} placeholder={t('form.agency.placeholder')} value={selectedAgency} />
				<div className={styles.datePickersWrapper}>
					<DatePickerInput label={t('form.start_date.label')} onChange={setSelectedStartDate} placeholder={t('form.start_date.placeholder')} value={selectedStartDate} />
					{selectedCalculationMethod === 'fixed_range' && <DatePickerInput label={t('form.end_date.label')} minDate={selectedStartDate} onChange={setSelectedEndDate} placeholder={t('form.end_date.placeholder')} value={selectedEndDate} />}
				</div>
			</div>

			<Divider />

			<div className={styles.container}>
				{vkmCalculationResult
					? (
						<div className={styles.resultsWrapper}>
							<Standout
								defaultOpen={true}
								description={t('sections.overview.description', { agency_name: vkmCalculationResult?.inputs?.agency_name, price_per_km: vkmCalculationResult?.inputs?.price_per_km, total_vkm_per_year: vkmCalculationResult?.inputs?.total_vkm_per_year })}
								title={t('sections.overview.title')}
								collapsible
							>
								<div className={styles.cardsWrapperWithOneRow}>
									<StatCard isLoading={isLoading} title={t('sections.overview.cards.total_from_distance')} value={vkmCalculationResult ? intlFormatter.number(vkmCalculationResult.total_from_distance, 'kilometers') : '-'} />
									<StatCard isLoading={isLoading} title={t('sections.overview.cards.total_in_euros')} value={vkmCalculationResult ? intlFormatter.number(vkmCalculationResult.total_in_euros, 'currency_euro') : '-'} />
									{selectedCalculationMethod === 'rolling_year' && <StatCard isLoading={isLoading} title={t('sections.overview.cards.total_relative_to_contract')} value={vkmCalculationResult ? intlFormatter.number(vkmCalculationResult.total_relative_to_contract * 100, 'percentage') : '-'} />}
								</div>
							</Standout>

							<Standout defaultOpen={false} description={t('sections.totals_by_day_type.description')} title={t('sections.totals_by_day_type.title')} collapsible>
								<div className={styles.cardsWrapperWithOneRow}>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.day_type_one} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_by_day_type.cards.day_type_one')}
										value={vkmCalculationResult ? vkmCalculationResult.day_type_one : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.day_type_two} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_by_day_type.cards.day_type_two')}
										value={vkmCalculationResult ? vkmCalculationResult.day_type_two : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.day_type_three} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_by_day_type.cards.day_type_three')}
										value={vkmCalculationResult ? vkmCalculationResult.day_type_three : '-'}
									/>
								</div>
							</Standout>

							<Standout defaultOpen={false} description={t('sections.totals_for_period_one.description')} title={t('sections.totals_for_period_one.title')} collapsible>
								<div className={styles.cardsWrapperWithTwoRows}>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_one} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_one.cards.period_one')}
										value={vkmCalculationResult ? vkmCalculationResult.period_one : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_one_and_day_type_one} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_one.cards.period_one_and_day_type_one')}
										value={vkmCalculationResult ? vkmCalculationResult.period_one_and_day_type_one : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_one_and_day_type_two} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_one.cards.period_one_and_day_type_two')}
										value={vkmCalculationResult ? vkmCalculationResult.period_one_and_day_type_two : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_one_and_day_type_three} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_one.cards.period_one_and_day_type_three')}
										value={vkmCalculationResult ? vkmCalculationResult.period_one_and_day_type_three : '-'}
									/>
								</div>
							</Standout>

							<Standout defaultOpen={false} description={t('sections.totals_for_period_two.description')} title={t('sections.totals_for_period_two.title')} collapsible>
								<div className={styles.cardsWrapperWithTwoRows}>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_two} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_two.cards.period_two')}
										value={vkmCalculationResult ? vkmCalculationResult.period_two : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_two_and_day_type_one} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_two.cards.period_two_and_day_type_one')}
										value={vkmCalculationResult ? vkmCalculationResult.period_two_and_day_type_one : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_two_and_day_type_two} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_two.cards.period_two_and_day_type_two')}
										value={vkmCalculationResult ? vkmCalculationResult.period_two_and_day_type_two : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_two_and_day_type_three} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_two.cards.period_two_and_day_type_three')}
										value={vkmCalculationResult ? vkmCalculationResult.period_two_and_day_type_three : '-'}
									/>
								</div>
							</Standout>

							<Standout defaultOpen={false} description={t('sections.totals_for_period_three.description')} title={t('sections.totals_for_period_three.title')} collapsible>
								<div className={styles.cardsWrapperWithTwoRows}>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_three} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_three.cards.period_three')}
										value={vkmCalculationResult ? vkmCalculationResult.period_three : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_three_and_day_type_one} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_three.cards.period_three_and_day_type_one')}
										value={vkmCalculationResult ? vkmCalculationResult.period_three_and_day_type_one : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_three_and_day_type_two} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_three.cards.period_three_and_day_type_two')}
										value={vkmCalculationResult ? vkmCalculationResult.period_three_and_day_type_two : '-'}
									/>
									<StatCard
										displayValue={vkmCalculationResult ? <NumberFormatter decimalScale={2} decimalSeparator="," suffix=" km" thousandSeparator=" " value={vkmCalculationResult.period_three_and_day_type_three} /> : '-'}
										isLoading={isLoading}
										title={t('sections.totals_for_period_three.cards.period_three_and_day_type_three')}
										value={vkmCalculationResult ? vkmCalculationResult.period_three_and_day_type_three : '-'}
									/>
								</div>
							</Standout>
						</div>
					)
					: isLoading
						? <Loader fill visible />
						: <NoDataLabel text={t('no_data')} fill />}
			</div>
		</Pannel>
	);

	//
}
