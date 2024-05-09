'use client';

/* * */

import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import { SimpleGrid, TextInput, NumberInput, Select } from '@mantine/core';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import FaresExplorerIdPageHeader from '@/components/FaresExplorerIdPageHeader/FaresExplorerIdPageHeader';
import { useMemo } from 'react';
import { FareOptions } from '@/schemas/Fare/options';

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
		return FareOptions.currency_type.map((item) => ({ value: item, label: fareOptionsLabels(`currency_type.${item}`) }));
	}, [fareOptionsLabels]);

	const allPaymentMethodsFormatted = useMemo(() => {
		if (!FareOptions.payment_method) return [];
		return FareOptions.payment_method.map((item) => ({ value: item, label: fareOptionsLabels(`payment_method.${item}`) }));
	}, [fareOptionsLabels]);

	const allTransfersFormatted = useMemo(() => {
		if (!FareOptions.transfers) return [];
		return FareOptions.transfers.map((item) => ({ value: item, label: fareOptionsLabels(`transfers.${item}`) }));
	}, [fareOptionsLabels]);

	//
	// C. Render components

	return (
		<Pannel loading={faresExplorerContext.page.is_loading} header={<FaresExplorerIdPageHeader />}>
			<AppLayoutSection title={t('sections.intro.title')} description={t('sections.intro.description')}>
				<SimpleGrid cols={3}>
					<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...faresExplorerContext.form.getInputProps('code')} readOnly={faresExplorerContext.page.isReadOnly} />
					<TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...faresExplorerContext.form.getInputProps('name')} readOnly={faresExplorerContext.page.isReadOnly} />
					<TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...faresExplorerContext.form.getInputProps('short_name')} readOnly={faresExplorerContext.page.isReadOnly} />
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<NumberInput label={t('form.price.label')} placeholder={t('form.price.placeholder')} precision={2} step={0.05} min={0.0} {...faresExplorerContext.form.getInputProps('price')} readOnly={faresExplorerContext.page.isReadOnly} />
					<Select
						label={t('form.currency_type.label')}
						placeholder={t('form.currency_type.placeholder')}
						nothingFoundMessage={t('form.currency_type.nothingFound')}
						data={allCurrencyTypesFormatted}
						{...faresExplorerContext.form.getInputProps('currency_type')}
						readOnly={faresExplorerContext.page.isReadOnly}
						searchable
					/>
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<Select
						label={t('form.payment_method.label')}
						placeholder={t('form.payment_method.placeholder')}
						nothingFoundMessage={t('form.payment_method.nothingFound')}
						data={allPaymentMethodsFormatted}
						{...faresExplorerContext.form.getInputProps('payment_method')}
						readOnly={faresExplorerContext.page.isReadOnly}
						searchable
					/>
					<Select
						label={t('form.transfers.label')}
						placeholder={t('form.transfers.placeholder')}
						nothingFoundMessage={t('form.transfers.nothingFound')}
						data={allTransfersFormatted}
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