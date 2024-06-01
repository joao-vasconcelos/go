'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import Pannel from '@/components/Pannel/Pannel';
import TypologiesExplorerIdPageHeader from '@/components/TypologiesExplorerIdPageHeader/TypologiesExplorerIdPageHeader';
import { useTypologiesExplorerContext } from '@/contexts/TypologiesExplorerContext';
import { ColorInput, Divider, MultiSelect, Select, SimpleGrid, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

import LineDisplay from '../LineDisplay/LineDisplay';
import { LinesExplorerLine } from '../LinesExplorerLine/LinesExplorerLine';

/* * */

export default function TypologiesExplorerIdPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('TypologiesExplorerIdPage');
	const typologiesExplorerContext = useTypologiesExplorerContext();

	//
	// B. Fetch data

	const { data: allFaresData } = useSWR('/api/fares');

	//
	// C. Transform data

	const allPrepaidFaresDataFormatted = useMemo(() => {
		if (!allFaresData) return [];
		return allFaresData.filter(item => item.payment_method === '1').map(item => ({ label: `${item.name} (${item.price} ${item.currency_type})`, value: item._id }));
	}, [allFaresData]);

	const allOnboardFaresDataFormatted = useMemo(() => {
		if (!allFaresData) return [];
		return allFaresData.filter(item => item.payment_method === '0').map(item => ({ label: `${item.name} (${item.price} ${item.currency_type})`, value: item._id }));
	}, [allFaresData]);

	//
	// D. Render components

	return (
		<Pannel header={<TypologiesExplorerIdPageHeader />} loading={typologiesExplorerContext.page.is_loading}>
			<AppLayoutSection description={t('sections.intro.description')} title={t('sections.intro.title')}>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...typologiesExplorerContext.form.getInputProps('code')} readOnly={typologiesExplorerContext.page.is_read_only} />
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...typologiesExplorerContext.form.getInputProps('name')} readOnly={typologiesExplorerContext.page.is_read_only} />
					<TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...typologiesExplorerContext.form.getInputProps('short_name')} readOnly={typologiesExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>
			<Divider />
			<AppLayoutSection description={t('sections.appearance.description')} title={t('sections.appearance.title')}>
				<SimpleGrid cols={1}>
					<LineDisplay color={typologiesExplorerContext.form.values.color} name="A Carris Metropolitana é a maior" short_name="1234" text_color={typologiesExplorerContext.form.values.text_color} />
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<ColorInput label={t('form.color.label')} placeholder={t('form.color.placeholder')} {...typologiesExplorerContext.form.getInputProps('color')} readOnly={typologiesExplorerContext.page.is_read_only} />
					<ColorInput label={t('form.text_color.label')} placeholder={t('form.text_color.placeholder')} {...typologiesExplorerContext.form.getInputProps('text_color')} readOnly={typologiesExplorerContext.page.is_read_only} />
				</SimpleGrid>
			</AppLayoutSection>
			<Divider />
			<AppLayoutSection description={t('sections.default_fares.description')} title={t('sections.default_fares.title')}>
				<SimpleGrid cols={1}>
					<Select
						data={allPrepaidFaresDataFormatted}
						description={t('form.default_prepaid_fare.description')}
						label={t('form.default_prepaid_fare.label')}
						nothingFoundMessage={t('form.default_prepaid_fare.nothingFound')}
						placeholder={t('form.default_prepaid_fare.placeholder')}
						{...typologiesExplorerContext.form.getInputProps('default_prepaid_fare')}
						readOnly={typologiesExplorerContext.page.is_read_only}
						searchable
					/>
					<MultiSelect
						data={allOnboardFaresDataFormatted}
						description={t('form.default_onboard_fares.description')}
						label={t('form.default_onboard_fares.label')}
						nothingFoundMessage={t('form.default_onboard_fares.nothingFound')}
						placeholder={t('form.default_onboard_fares.placeholder')}
						{...typologiesExplorerContext.form.getInputProps('default_onboard_fares')}
						readOnly={typologiesExplorerContext.page.is_read_only}
						searchable
					/>
				</SimpleGrid>
			</AppLayoutSection>
		</Pannel>
	);

	//
}
