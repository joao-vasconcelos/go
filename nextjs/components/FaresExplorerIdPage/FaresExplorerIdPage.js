'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import FaresExplorerIdPageHeader from '@/components/FaresExplorerIdPageHeader/FaresExplorerIdPageHeader';
import Pannel from '@/components/Pannel/Pannel';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';
import { FareOptions } from '@/schemas/Fare/options';
import { NumberInput, Select, SimpleGrid, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

/* * */

export default function FaresExplorerIdPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('FaresExplorerIdPage');
	const fareOptionsLabels = useTranslations('FareOptions');
	const faresExplorerContext = useFaresExplorerContext();

	//
	// B. Transform data

	const allCurrencyTypesFormatted = useMemo(() => {
		if (!FareOptions.currency_type) return [];
		return FareOptions.currency_type.map(item => ({ label: fareOptionsLabels(`currency_type.${item}`), value: item }));
	}, [fareOptionsLabels]);

	const allPaymentMethodsFormatted = useMemo(() => {
		if (!FareOptions.payment_method) return [];
		return FareOptions.payment_method.map(item => ({ label: fareOptionsLabels(`payment_method.${item}`), value: item }));
	}, [fareOptionsLabels]);

	const allTransfersFormatted = useMemo(() => {
		if (!FareOptions.transfers) return [];
		return FareOptions.transfers.map(item => ({ label: fareOptionsLabels(`transfers.${item}`), value: item }));
	}, [fareOptionsLabels]);

	//
	// C. Render components

	return (
		<Pannel header={<FaresExplorerIdPageHeader />} loading={faresExplorerContext.page.is_loading}>
			<AppLayoutSection description={t('sections.intro.description')} title={t('sections.intro.title')}>
				<SimpleGrid cols={3}>
					<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...faresExplorerContext.form.getInputProps('code')} readOnly={faresExplorerContext.page.isReadOnly} />
					<TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...faresExplorerContext.form.getInputProps('name')} readOnly={faresExplorerContext.page.isReadOnly} />
					<TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...faresExplorerContext.form.getInputProps('short_name')} readOnly={faresExplorerContext.page.isReadOnly} />
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<NumberInput label={t('form.price.label')} min={0.0} placeholder={t('form.price.placeholder')} precision={2} step={0.05} {...faresExplorerContext.form.getInputProps('price')} readOnly={faresExplorerContext.page.isReadOnly} />
					<Select
						data={allCurrencyTypesFormatted}
						label={t('form.currency_type.label')}
						nothingFoundMessage={t('form.currency_type.nothingFound')}
						placeholder={t('form.currency_type.placeholder')}
						{...faresExplorerContext.form.getInputProps('currency_type')}
						readOnly={faresExplorerContext.page.isReadOnly}
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<Select
						data={allPaymentMethodsFormatted}
						label={t('form.payment_method.label')}
						nothingFoundMessage={t('form.payment_method.nothingFound')}
						placeholder={t('form.payment_method.placeholder')}
						{...faresExplorerContext.form.getInputProps('payment_method')}
						readOnly={faresExplorerContext.page.isReadOnly}
						searchable
					/>
					<Select
						data={allTransfersFormatted}
						label={t('form.transfers.label')}
						nothingFoundMessage={t('form.transfers.nothingFound')}
						placeholder={t('form.transfers.placeholder')}
						{...faresExplorerContext.form.getInputProps('transfers')}
						readOnly={faresExplorerContext.page.isReadOnly}
						searchable
					/>
				</SimpleGrid>
			</AppLayoutSection>
		</Pannel>
	);

	//
}
